// stores/aeps.ts
//
// Cross-page state for AEPS transactions (Cash Withdrawal, Balance Enquiry, Mini
// Statement, Aadhaar Pay). Each flow is a single biometric-authenticated call — there's
// no OTP step and no requery endpoint on the backend, so results are immediate.
import { defineStore } from "pinia";
import { useAepsTxnApi, type AepsTxnPayload, type AepsBank, type AepsAuthStatus } from "~/composables/apis/useAepsTxnApi";

export type AepsTxnType = "WITHDRAWAL" | "BALANCE" | "MINISTATEMENT" | "AADHAAR_PAY";
export type AepsStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface AepsResult {
  type: AepsTxnType;
  status: AepsStatus;
  reason: string | null;
  amount: number;
  balance: string | null;
  statementLines: string[] | null;
  stan: string;
  referenceNo: string;
  retailerReferenceNumber: string;
  authCode: string | null;
  aadhaarMasked: string;
  bankName: string;
  customerName: string;
  createdAt: string;
}

function emptyDraft() {
  return { aadhaar: "", bankIin: "", bankName: "", amount: 0, customerName: "" };
}

/** Maps the raw /aeps/* response into a normalized AepsResult (fields confirmed
 *  against aeps.txn.controller.js / simulate.js — ResponseCode, ResponseStatus,
 *  Balance, Ministatement, STAN, RetailerReferenceNumber, ReferenceNo, AuthCode). */
function mapAepsResponse(type: AepsTxnType, res: any, draft: ReturnType<typeof emptyDraft>): AepsResult {
  const d = res?.data;
  const nsdlResponded = !!d;
  const status: AepsStatus = !nsdlResponded ? "PENDING" : d.ResponseCode === "00" ? "SUCCESS" : "FAILED";
  return {
    type,
    status,
    reason: status === "SUCCESS" ? null : (d?.ResponseStatus || res?.message || "Transaction could not be completed"),
    amount: draft.amount,
    balance: d?.Balance ?? null,
    statementLines: typeof d?.Ministatement === "string" ? d.Ministatement.split(/\r?\n/).filter(Boolean) : null,
    stan: d?.STAN ?? "",
    referenceNo: d?.ReferenceNo ?? "",
    retailerReferenceNumber: d?.RetailerReferenceNumber ?? "",
    authCode: d?.AuthCode ?? null,
    aadhaarMasked: d?.AadharNo ?? maskAadhaarLocal(draft.aadhaar),
    bankName: draft.bankName,
    customerName: draft.customerName,
    createdAt: new Date().toISOString(),
  };
}

function maskAadhaarLocal(aadhaar: string) {
  const digits = (aadhaar || "").replace(/\D/g, "");
  return digits.length >= 4 ? "XXXX XXXX " + digits.slice(-4) : "XXXX XXXX XXXX";
}

export const useAepsStore = defineStore("aeps", {
  state: () => ({
    draft: emptyDraft(),
    geoCoords: null as { latitude: number; longitude: number } | null,
    pidData: null as string | null,
    isProcessing: false,
    currentResult: null as AepsResult | null,
    sessionTransactions: [] as AepsResult[],
    lastError: null as string | null,
    banks: [] as AepsBank[],
    banksLoading: false,

    // Agent/terminal reqAuth gate — checked once on the AEPS dashboard before
    // Cash Withdrawal / Balance Enquiry / Mini Statement / Aadhaar Pay unlock.
    authChecked: false,
    authChecking: false,
    authenticated: false,
    authExpiresAt: null as string | null,
  }),

  getters: {
    /** Session-scoped (not a full-day server total — see stores/dmt.ts's identical
     *  caveat) summary for the dashboard's AEPS entry card. */
    todaysSessionSummary: (s) => {
      const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
      const todays = s.sessionTransactions.filter((t) => t.status === "SUCCESS" && new Date(t.createdAt) >= startOfDay);
      const cashDisbursed = todays.filter((t) => t.type === "WITHDRAWAL").reduce((sum, t) => sum + t.amount, 0);
      return { count: todays.length, cashDisbursed };
    },
  },

  actions: {
    /** Fetches the AEPS bank (IIN) list once and caches it — shared across
     *  cash-withdrawal / balance-enquiry / mini-statement, all of which use
     *  the same "Select Bank" form. */
    async fetchBanks() {
      if (this.banks.length || this.banksLoading) return this.banks;
      this.banksLoading = true;
      try {
        const { banks } = useAepsTxnApi();
        this.banks = await banks();
        return this.banks;
      } finally {
        this.banksLoading = false;
      }
    },

    /** Read-only reqAuth session check — call before showing the AEPS services grid.
     *  Safe to call repeatedly; never hits NSDL (see aeps.txn.controller.js authStatus). */
    async checkAuthStatus() {
      this.authChecking = true;
      try {
        const { authStatus } = useAepsTxnApi();
        const res: AepsAuthStatus = await authStatus();
        this.authenticated = !!res.authenticated;
        this.authExpiresAt = res.expiresAt;
        this.authChecked = true;
        return this.authenticated;
      } finally {
        this.authChecking = false;
      }
    },

    /** One-time agent/terminal authentication (NSDL reqAuth). On success the backend
     *  caches the session for 24h, so this only needs to run again after it expires. */
    async performReqAuth() {
      if (this.isProcessing) return { ok: false, busy: true, message: "A transaction is already in progress" };
      this.isProcessing = true;
      try {
        const { reqAuth } = useAepsTxnApi();
        const res = await reqAuth(this.buildPayload());
        const ok = res?.statusCode === "00";
        if (ok) {
          this.authenticated = true;
          this.authChecked = true;
        }
        return { ok, statusCode: res?.statusCode, message: res?.message };
      } finally {
        this.isProcessing = false;
      }
    },

    resetDraft() {
      this.draft = emptyDraft();
      this.geoCoords = null;
      this.pidData = null;
      this.currentResult = null;
    },

    buildPayload(): AepsTxnPayload {
      return {
        AadharNo: this.draft.aadhaar,
        TxnAmount: this.draft.amount || 0,
        Latitude: this.geoCoords?.latitude ?? 0,
        Longitude: this.geoCoords?.longitude ?? 0,
        CustomerName: this.draft.customerName,
        PidData: this.pidData ?? "",
        BankName: this.draft.bankIin || undefined,
      };
    },

    async performWithdrawal() {
      if (this.isProcessing) return { ok: false, message: "A transaction is already in progress" };
      this.isProcessing = true;
      try {
        const { withdrawal } = useAepsTxnApi();
        const res = await withdrawal(this.buildPayload());
        const result = mapAepsResponse("WITHDRAWAL", res, this.draft);
        this.currentResult = result;
        this.sessionTransactions.unshift(result);
        return { ok: result.status !== "FAILED", status: result.status };
      } finally {
        this.isProcessing = false;
      }
    },

    async performBalanceEnquiry() {
      if (this.isProcessing) return { ok: false, message: "A transaction is already in progress" };
      this.isProcessing = true;
      try {
        const { balance } = useAepsTxnApi();
        const res = await balance(this.buildPayload());
        const result = mapAepsResponse("BALANCE", res, this.draft);
        this.currentResult = result;
        this.sessionTransactions.unshift(result);
        return { ok: result.status !== "FAILED", status: result.status };
      } finally {
        this.isProcessing = false;
      }
    },

    async performMiniStatement() {
      if (this.isProcessing) return { ok: false, message: "A transaction is already in progress" };
      this.isProcessing = true;
      try {
        const { ministatement } = useAepsTxnApi();
        const res = await ministatement(this.buildPayload());
        const result = mapAepsResponse("MINISTATEMENT", res, this.draft);
        this.currentResult = result;
        this.sessionTransactions.unshift(result);
        return { ok: result.status !== "FAILED", status: result.status };
      } finally {
        this.isProcessing = false;
      }
    },

    async performAadhaarPay() {
      if (this.isProcessing) return { ok: false, message: "A transaction is already in progress" };
      this.isProcessing = true;
      try {
        const { purchase } = useAepsTxnApi();
        const res = await purchase(this.buildPayload());
        const result = mapAepsResponse("AADHAAR_PAY", res, this.draft);
        this.currentResult = result;
        this.sessionTransactions.unshift(result);
        return { ok: result.status !== "FAILED", status: result.status };
      } finally {
        this.isProcessing = false;
      }
    },
  },
});
