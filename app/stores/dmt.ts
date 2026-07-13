// stores/dmt.ts
//
// Cross-page state for the Domestic Money Transfer module. Nuxt pages are separate
// route components, so anything that needs to survive a navigation (the customer
// being onboarded, the selected beneficiary, the in-flight transfer, poll progress)
// lives here rather than in page-local refs.
import { defineStore } from "pinia";
import { useDmtCustomerApi } from "~/composables/apis/useDmtCustomerApi";
import { useDmtTxnApi } from "~/composables/apis/useDmtTxnApi";

export type TxnStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface DmtCustomer {
  referenceid: string | null;
  name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  aadhaarMasked: string | null;
  /** Kept only in memory for the biometric step's updatebiodetail call — never rendered. */
  aadhaarRaw: string | null;
  otpVerified: boolean;
  kycVerified: boolean;
}

export interface DmtRemitter {
  senderId: string;
  name: string;
  mobile: string;
  dailyLimit: number;
  usedToday: number;
  remainingLimit: number;
  beneficiaryCount: number;
  registered: boolean;
}

export interface DmtBeneficiary {
  id: string;
  name: string;
  mobile: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  verified: boolean;
}

export interface DmtCharges {
  charge: number;
  gst: number;
  commission: number;
  totalDebit: number;
}

export interface DmtTransaction {
  transactionId: string;
  refId: string;
  rrn: string;
  bankReference: string;
  amount: number;
  commission: number;
  beneficiaryName: string;
  bankName: string;
  accountNumber: string;
  remarks: string;
  status: TxnStatus;
  reason: string | null;
  createdAt: string;
}

function emptyCustomer(): DmtCustomer {
  return {
    referenceid: null, name: "", mobile: "", email: "", city: "", state: "",
    aadhaarMasked: null, aadhaarRaw: null, otpVerified: false, kycVerified: false,
  };
}

function emptyRemitter(): DmtRemitter {
  return {
    senderId: "", name: "", mobile: "", dailyLimit: 0, usedToday: 0,
    remainingLimit: 0, beneficiaryCount: 0, registered: false,
  };
}

/** Best-effort NSDL response → UI status mapping. Unknown codes default to PENDING
 *  (safer than mislabeling FAILED) so the requery poller gets a chance to resolve them. */
export function mapTxnStatus(res: any): TxnStatus {
  const raw = String(res?.data?.status ?? res?.status ?? res?.data?.txnStatus ?? "").toUpperCase();
  if (["SUCCESS", "SUCCESSFUL", "COMPLETED"].includes(raw)) return "SUCCESS";
  if (["FAILED", "FAILURE", "DECLINED", "REJECTED", "REVERSED"].includes(raw)) return "FAILED";
  if (["PENDING", "PROCESSING", "INITIATED", "IN PROGRESS"].includes(raw)) return "PENDING";
  if (res?.statusCode === "00") return "SUCCESS";
  if (res?.statusCode === "01") return "FAILED";
  return "PENDING";
}

export const useDmtStore = defineStore("dmt", {
  state: () => ({
    // ── Customer onboarding ──
    customer: emptyCustomer() as DmtCustomer,
    otpReqId: null as string | null,

    // ── Remitter ──
    remitter: emptyRemitter() as DmtRemitter,

    // ── Beneficiaries ──
    beneficiaries: [] as DmtBeneficiary[],
    selectedBeneficiary: null as DmtBeneficiary | null,
    pendingVerifiedHolder: null as { name: string } | null,

    // ── Transfer draft ──
    amount: 0,
    remarks: "",
    charges: { charge: 0, gst: 0, commission: 0, totalDebit: 0 } as DmtCharges,
    transactionOtpReqId: null as string | null,
    transferRefId: null as string | null,
    /** Set true once transaction/otp succeeds — the OTP screen gates on this rather
     *  than on transactionOtpReqId, since we can't be certain of NSDL's actual field
     *  name for that id and don't want a mapping miss to strand the user mid-transfer. */
    transferOtpRequested: false,

    // ── Result ──
    currentTransaction: null as DmtTransaction | null,
    sessionTransactions: [] as DmtTransaction[], // enriches generic /merchant/txnHistory rows

    // ── Guards / UX flags ──
    isProcessing: false, // true from "Send OTP" through settle — blocks duplicate taps
    pollAttempts: 0,
    pollMax: 12,
    pollIntervalMs: 5000,

    lastError: null as string | null,
  }),

  getters: {
    remainingLimitAfterTransfer: (s) => Math.max(0, s.remitter.remainingLimit - s.amount),
    canSendOtp: (s) => {
      if (!s.selectedBeneficiary?.verified) return false;
      if (!s.amount || s.amount <= 0) return false;
      if (s.amount > s.remitter.remainingLimit) return false;
      if (s.isProcessing) return false;
      return true;
    },
    /** Sums this browser session's completed transfers made today — used for the
     *  dashboard's DMT summary card. Scoped to the session (not a full-day server
     *  total) since paymentSystem doesn't expose a per-method daily commission endpoint. */
    todaysSessionSummary: (s) => {
      const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
      const todays = s.sessionTransactions.filter((t) => t.status === "SUCCESS" && new Date(t.createdAt) >= startOfDay);
      return {
        count: todays.length,
        amount: todays.reduce((sum, t) => sum + t.amount, 0),
        commission: todays.reduce((sum, t) => sum + t.commission, 0),
      };
    },
  },

  actions: {
    resetTransferDraft() {
      this.amount = 0;
      this.remarks = "";
      this.charges = { charge: 0, gst: 0, commission: 0, totalDebit: 0 };
      this.transactionOtpReqId = null;
      this.transferRefId = null;
      this.transferOtpRequested = false;
      this.currentTransaction = null;
      this.pollAttempts = 0;
    },

    resetCustomerFlow() {
      this.customer = emptyCustomer();
      this.remitter = emptyRemitter();
      this.beneficiaries = [];
      this.selectedBeneficiary = null;
      this.pendingVerifiedHolder = null;
      this.resetTransferDraft();
    },

    // ───────────────────────── Customer search / onboarding ─────────────────────────
    /** Returns "found" | "not-found" | "error" */
    async searchCustomer(mobile: string) {
      this.lastError = null;
      const { customerGetDetail } = useDmtCustomerApi();
      const res = await customerGetDetail(mobile);
      if (res.statusCode === "00" && res.data) {
        this.customer = {
          referenceid: res.data.referenceid ?? res.data.referenceId ?? null,
          name: res.data.name ?? "",
          mobile,
          email: res.data.email_id ?? res.data.email ?? "",
          city: res.data.city ?? "",
          state: res.data.state ?? "",
          aadhaarMasked: res.data.aadhaar_masked ?? null,
          otpVerified: true,
          kycVerified: !!(res.data.aadhaar_verified ?? res.data.kyc_verified),
        };
        return "found" as const;
      }
      if (res.statusCode === "01" || res.statusCode === "404") {
        this.customer = { ...emptyCustomer(), mobile };
        return "not-found" as const;
      }
      this.lastError = res.message || "Could not verify customer right now";
      return "error" as const;
    },

    async registerCustomer(payload: { name: string; mobile_no: string; email_id?: string; city: string; state: string }) {
      this.lastError = null;
      const { customerOnboarding, customerRequestOtp } = useDmtCustomerApi();
      const res = await customerOnboarding(payload);
      if (res.statusCode !== "00") {
        this.lastError = res.message || "Registration failed";
        return { ok: false, message: this.lastError };
      }
      const referenceid = res.data?.referenceid ?? res.data?.referenceId;
      this.customer = {
        ...emptyCustomer(),
        referenceid,
        name: payload.name,
        mobile: payload.mobile_no,
        email: payload.email_id ?? "",
        city: payload.city,
        state: payload.state,
      };

      // Kick off mobile OTP straight away so the OTP screen has a live otpreqid + timer.
      const otpRes = await customerRequestOtp(referenceid);
      if (otpRes.statusCode === "00") {
        this.otpReqId = otpRes.data?.otpreqid ?? otpRes.data?.otpReqId ?? null;
      }
      return { ok: true, otpRequired: true };
    },

    async resendCustomerOtp() {
      if (!this.customer.referenceid) return { ok: false, message: "Missing reference id" };
      const { customerRequestOtp } = useDmtCustomerApi();
      const res = await customerRequestOtp(this.customer.referenceid);
      if (res.statusCode === "00") {
        this.otpReqId = res.data?.otpreqid ?? res.data?.otpReqId ?? this.otpReqId;
        return { ok: true };
      }
      return { ok: false, message: res.message || "Could not resend OTP" };
    },

    async verifyCustomerOtp(otp: string) {
      if (!this.customer.referenceid) return { ok: false, message: "Missing reference id" };
      const { customerValidateOtp } = useDmtCustomerApi();
      const res = await customerValidateOtp({
        otp,
        otpreqid: this.otpReqId ?? "",
        referenceid: this.customer.referenceid,
      });
      if (res.statusCode === "00") {
        this.customer.otpVerified = true;
        return { ok: true };
      }
      return { ok: false, message: res.message || "Incorrect OTP" };
    },

    async verifyAadhaar(aadhaarno: string) {
      if (!this.customer.referenceid) return { ok: false, message: "Missing reference id" };
      const { customerVerifyUid } = useDmtCustomerApi();
      const res = await customerVerifyUid({ aadhaarno, referenceid: this.customer.referenceid });
      if (res.statusCode === "00") {
        this.customer.aadhaarMasked = "XXXX XXXX " + aadhaarno.slice(-4);
        this.customer.aadhaarRaw = aadhaarno; // needed by the biometric step's updatebiodetail call
        return { ok: true };
      }
      return { ok: false, message: res.message || "Aadhaar verification failed" };
    },

    async submitBiometric(pidData: string) {
      if (!this.customer.referenceid || !this.customer.aadhaarRaw) {
        return { ok: false, message: "Verify Aadhaar before capturing biometrics" };
      }
      const { customerUpdateBiodetail, customerSubmit } = useDmtCustomerApi();
      const res = await customerUpdateBiodetail({
        PidData: pidData,
        aadhaarno: this.customer.aadhaarRaw,
        referenceid: this.customer.referenceid,
      });
      if (res.statusCode !== "00") {
        return { ok: false, message: res.message || "Biometric verification failed" };
      }
      await customerSubmit();
      this.customer.kycVerified = true;
      this.customer.aadhaarRaw = null; // purge the raw number now that KYC is complete
      return { ok: true };
    },

    // ───────────────────────── Remitter ─────────────────────────
    /** Loads remitter details; auto-registers a first-time remitter and reloads. */
    async loadRemitter(mobile: string) {
      this.lastError = null;
      const { remitterDetails, remitterRegister } = useDmtTxnApi();
      let res = await remitterDetails(mobile);
      console.debug("[DMT] remitter/details raw response for", mobile, res);

      if (res.statusCode !== "00" || !res.data) {
        console.debug("[DMT] remitter/details failed, auto-registering:", res.statusCode, res.message);
        const regRes = await remitterRegister(mobile);
        if (regRes.statusCode !== "00") {
          this.lastError = regRes.message || "Could not register remitter";
          return { ok: false, message: this.lastError };
        }
        res = await remitterDetails(mobile);
        console.debug("[DMT] remitter/details raw response after register:", res);
        if (res.statusCode !== "00" || !res.data) {
          this.lastError = res.message || "Remitter registered but details are unavailable";
          return { ok: false, message: this.lastError };
        }
      }

      // Confirmed live response shape (paymentSystem /dmt/txn/v1/remitter/details):
      // { senderId, AviableLimit, AviabledayLimit, TransactionDone, beneficiarydetail: [...] }
      // "AviabledayLimit" is the day's ceiling; "AviableLimit" is what's still available to
      // spend right now — so usedToday is derived as the difference between the two.
      const d = res.data;
      const dailyLimit = Number(d.AviabledayLimit ?? d.dailyLimit ?? 25000);
      const remainingLimit = Number(d.AviableLimit ?? d.remainingLimit ?? dailyLimit);
      const beneficiaryList: any[] = Array.isArray(d.beneficiarydetail) ? d.beneficiarydetail : [];
      console.debug("[DMT] parsed beneficiaryList:", beneficiaryList.length, beneficiaryList);

      this.remitter = {
        senderId: d.senderId ?? mobile,
        name: d.name ?? this.customer.name,
        mobile,
        dailyLimit,
        usedToday: Math.max(0, dailyLimit - remainingLimit),
        remainingLimit,
        beneficiaryCount: beneficiaryList.length,
        registered: true,
      };

      if (beneficiaryList.length) {
        const mapped: DmtBeneficiary[] = beneficiaryList.map((b: any) => ({
          id: String(b.beneficiaryid),
          name: b.beneficiaryname ?? "",
          mobile: b.beneficiarymobilenumber ? String(b.beneficiarymobilenumber) : "",
          accountNumber: String(b.accountnumber ?? ""),
          ifsc: b.ifscode ?? "",
          bankName: b.bank ?? "",
          verified: Number(b.beneficiarystatus) === 1,
        }));
        // Merge with anything added client-side this session (dedupe by account+ifsc).
        const known = new Set(this.beneficiaries.map((b) => b.accountNumber + b.ifsc));
        this.beneficiaries = [...this.beneficiaries, ...mapped.filter((b) => !known.has(b.accountNumber + b.ifsc))];
      }

      return { ok: true };
    },

    // ───────────────────────── Beneficiaries ─────────────────────────
    async verifyBeneficiaryAccount(payload: {
      accountnumber: string;
      ifsccode: string;
      receivername: string;
      receivermobilenumber: string;
      receiveremailid?: string;
    }) {
      this.pendingVerifiedHolder = null;
      const { beneficiaryAccountVerification } = useDmtTxnApi();
      const res = await beneficiaryAccountVerification({
        sender_mobilenumber: this.remitter.mobile,
        ...payload,
      });
      if (res.statusCode === "00") {
        const holderName = res.data?.account_holder_name ?? res.data?.accountHolderName ?? payload.receivername;
        this.pendingVerifiedHolder = { name: holderName };
        return { ok: true, holderName };
      }
      return { ok: false, message: res.message || "Account verification failed" };
    },

    async addBeneficiary(payload: {
      receivername: string;
      receivermobilenumber: string;
      receiveremailid?: string;
      receiverIfscCode: string;
      receiver_account_no: string;
      bankName?: string;
      city?: string;
      state?: string;
    }) {
      const { beneficiaryAdd } = useDmtTxnApi();
      const res = await beneficiaryAdd({
        senderId: this.remitter.senderId,
        receivername: payload.receivername,
        receivermobilenumber: payload.receivermobilenumber,
        receiveremailid: payload.receiveremailid,
        receiverIfscCode: payload.receiverIfscCode,
        receiver_account_no: payload.receiver_account_no,
        city: payload.city,
        state: payload.state,
      });
      if (res.statusCode !== "00") {
        return { ok: false, message: res.message || "Could not add beneficiary" };
      }
      const ben: DmtBeneficiary = {
        id: String(res.data?.BeneficiaryId ?? res.data?.beneficiaryId ?? payload.receiver_account_no),
        name: payload.receivername,
        mobile: payload.receivermobilenumber,
        accountNumber: payload.receiver_account_no,
        ifsc: payload.receiverIfscCode,
        bankName: payload.bankName ?? "",
        verified: true,
      };
      this.beneficiaries.push(ben);
      this.remitter.beneficiaryCount += 1;
      this.pendingVerifiedHolder = null;
      return { ok: true, beneficiary: ben };
    },

    selectBeneficiary(ben: DmtBeneficiary) {
      this.selectedBeneficiary = ben;
      this.resetTransferDraft();
    },

    removeBeneficiary(id: string) {
      this.beneficiaries = this.beneficiaries.filter((b) => b.id !== id);
    },

    // ───────────────────────── Transfer ─────────────────────────
    async fetchCharges(amount: number) {
      this.amount = amount;
      if (!amount || amount <= 0) {
        this.charges = { charge: 0, gst: 0, commission: 0, totalDebit: 0 };
        return;
      }
      const { transactionCharges } = useDmtTxnApi();
      const res = await transactionCharges({ senderId: this.remitter.senderId, amount });
      if (res.statusCode === "00" && res.data) {
        const charge = Number(res.data.charge ?? res.data.txnCharge ?? 0);
        const gst = Number(res.data.gst ?? res.data.gstAmount ?? +(charge * 0.18).toFixed(2));
        const commission = Number(res.data.commission ?? res.data.merchantCommission ?? 0);
        this.charges = { charge, gst, commission, totalDebit: +(amount + charge + gst).toFixed(2) };
      } else {
        // Fallback slab so the screen still functions if charges/quote is unavailable.
        const charge = 15;
        const gst = +(charge * 0.18).toFixed(2);
        this.charges = { charge, gst, commission: +(charge * 0.4).toFixed(2), totalDebit: +(amount + charge + gst).toFixed(2) };
      }
    },

    async requestTransferOtp() {
      if (this.isProcessing || !this.selectedBeneficiary) return { ok: false, message: "Select a beneficiary first" };
      this.isProcessing = true;
      try {
        const { transactionOtp } = useDmtTxnApi();
        const res = await transactionOtp({
          senderId: this.remitter.senderId,
          amount: this.amount,
          receiver_account_no: this.selectedBeneficiary.accountNumber,
          receiverIfscCode: this.selectedBeneficiary.ifsc,
        });
        console.debug("[DMT] transaction/otp raw response:", res);
        if (res.statusCode !== "00") {
          return { ok: false, message: res.message || "Could not send OTP" };
        }
        this.transactionOtpReqId = res.data?.otpreqid ?? res.data?.otpReqId ?? null;
        this.transferRefId = res.data?.refId ?? res.data?.referenceId ?? res.data?.refid ?? null;
        this.transferOtpRequested = true; // gates the OTP screen — independent of the field guesses above
        return { ok: true };
      } finally {
        this.isProcessing = false;
      }
    },

    /** Confirms the transfer. Duplicate taps are ignored while isProcessing is true. */
    async confirmTransfer(otp: string) {
      if (this.isProcessing || !this.selectedBeneficiary) return { ok: false, message: "Transfer already in progress" };
      this.isProcessing = true;
      try {
        const { transactionInstant } = useDmtTxnApi();
        const res = await transactionInstant({
          senderId: this.remitter.senderId,
          BeneficiaryId: this.selectedBeneficiary.id,
          amount: this.amount,
          refId: this.transferRefId ?? "",
          remarks: this.remarks,
          otp,
          receiver_account_no: this.selectedBeneficiary.accountNumber,
          receiverIfscCode: this.selectedBeneficiary.ifsc,
          account_holder_name: this.selectedBeneficiary.name,
          receiverMobilenumber: this.selectedBeneficiary.mobile,
        });

        const status = mapTxnStatus(res);
        const txn: DmtTransaction = {
          transactionId: res.data?.transactionId ?? res.data?.txnId ?? this.transferRefId ?? "",
          refId: this.transferRefId ?? "",
          rrn: res.data?.rrn ?? res.data?.RRN ?? "",
          bankReference: res.data?.bankReference ?? res.data?.bank_reference ?? "",
          amount: this.amount,
          commission: this.charges.commission,
          beneficiaryName: this.selectedBeneficiary.name,
          bankName: this.selectedBeneficiary.bankName,
          accountNumber: this.selectedBeneficiary.accountNumber,
          remarks: this.remarks,
          status,
          reason: status === "FAILED" ? (res.message ?? "Transaction was declined by the bank") : null,
          createdAt: new Date().toISOString(),
        };
        this.currentTransaction = txn;
        this.sessionTransactions.unshift(txn);
        if (status !== "FAILED") {
          this.remitter.usedToday += this.amount;
          this.remitter.remainingLimit = Math.max(0, this.remitter.remainingLimit - this.amount);
        }
        return { ok: res.statusCode === "00" || status !== "FAILED", status };
      } finally {
        this.isProcessing = false;
      }
    },

    /** Polls transaction/requery every 5s, up to 12 attempts, updating currentTransaction.status. */
    async pollTransactionStatus(onUpdate?: (status: TxnStatus) => void) {
      if (!this.currentTransaction || this.currentTransaction.status !== "PENDING") return;
      const { transactionRequery } = useDmtTxnApi();
      this.pollAttempts = 0;

      while (this.pollAttempts < this.pollMax && this.currentTransaction?.status === "PENDING") {
        await new Promise((r) => setTimeout(r, this.pollIntervalMs));
        this.pollAttempts += 1;
        const res = await transactionRequery({
          refId: this.currentTransaction.refId,
          transactionId: this.currentTransaction.transactionId,
          rrn: this.currentTransaction.rrn,
        });
        const status = mapTxnStatus(res);
        if (this.currentTransaction && status !== "PENDING") {
          this.currentTransaction.status = status;
          this.currentTransaction.reason = status === "FAILED" ? res.message ?? "Transaction failed at the bank" : null;
          const idx = this.sessionTransactions.findIndex((t) => t.refId === this.currentTransaction!.refId);
          if (idx >= 0) this.sessionTransactions[idx] = { ...this.currentTransaction };
          onUpdate?.(status);
          return;
        }
      }
      // Exhausted retries without a resolution — leave as PENDING; UI offers a manual refresh.
    },

    async manualRequery() {
      if (!this.currentTransaction) return null;
      const { transactionRequery } = useDmtTxnApi();
      const res = await transactionRequery({
        refId: this.currentTransaction.refId,
        transactionId: this.currentTransaction.transactionId,
        rrn: this.currentTransaction.rrn,
      });
      const status = mapTxnStatus(res);
      this.currentTransaction.status = status;
      this.currentTransaction.reason = status === "FAILED" ? res.message ?? "Transaction failed at the bank" : null;
      return status;
    },
  },
});
