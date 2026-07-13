// src/composables/apis/useDmtTxnApi.ts
//
// Remittance transactions — NSDL DMT.
// Source of truth: fintech-gateway/docs/qr-aeps-dmt-operations.md ("Remittance transactions")
// paymentSystem routes are mounted directly at /dmt/txn/v1/* — no encrypted envelope,
// merchant identity is resolved from the Bearer token by useApi()'s interceptor.
import { useApi } from "./useApi";
import type { DmtApiResult } from "./useDmtCustomerApi";

export function useDmtTxnApi() {
  const { post } = useApi();

  const handle = async (label: string, fn: () => Promise<any>): Promise<DmtApiResult> => {
    try {
      const res = await fn();
      return res.data;
    } catch (err: any) {
      console.error(`[DMT-Txn] ${label} error:`, err);
      return (
        err?.response?.data ?? {
          statusCode: "01",
          message: err?.message || "Network error — please try again",
        }
      );
    }
  };

  /** POST /dmt/txn/v1/remitter/register — { mobilenumber } */
  const remitterRegister = (mobilenumber: string) =>
    handle("remitter/register", () => post(`/dmt/txn/v1/remitter/register`, { mobilenumber }));

  /** POST /dmt/txn/v1/remitter/details — { sender_mobilenumber } (senderId also accepted upstream) */
  const remitterDetails = (sender_mobilenumber: string) =>
    handle("remitter/details", () => post(`/dmt/txn/v1/remitter/details`, { sender_mobilenumber }));

  /**
   * POST /dmt/txn/v1/beneficiary/accountVerification
   * Penny-drop style verification before a beneficiary is added.
   */
  const beneficiaryAccountVerification = (payload: {
    sender_mobilenumber: string;
    accountnumber: string;
    ifsccode: string;
    receivername: string;
    receivermobilenumber: string;
    receiveremailid?: string;
  }) => handle("beneficiary/accountVerification", () => post(`/dmt/txn/v1/beneficiary/accountVerification`, payload));

  /** POST /dmt/txn/v1/beneficiary/get — { senderId, receiverIfscCode, receiver_account_no } */
  const beneficiaryGet = (payload: { senderId: string; receiverIfscCode: string; receiver_account_no: string }) =>
    handle("beneficiary/get", () => post(`/dmt/txn/v1/beneficiary/get`, payload));

  /** POST /dmt/txn/v1/beneficiary/add */
  const beneficiaryAdd = (payload: {
    senderId: string;
    receivername: string;
    receivermobilenumber: string;
    receiveremailid?: string;
    receiverIfscCode: string;
    receiver_account_no: string;
    address?: string;
    city?: string;
    state?: string;
    branch_contact?: string;
  }) => handle("beneficiary/add", () => post(`/dmt/txn/v1/beneficiary/add`, payload));

  /** POST /dmt/txn/v1/transaction/otp — { senderId, amount, receiver_account_no, receiverIfscCode } */
  const transactionOtp = (payload: {
    senderId: string;
    amount: number;
    receiver_account_no: string;
    receiverIfscCode: string;
  }) => handle("transaction/otp", () => post(`/dmt/txn/v1/transaction/otp`, payload));

  /** POST /dmt/txn/v1/transaction/instant */
  const transactionInstant = (payload: {
    senderId: string;
    BeneficiaryId: string;
    amount: number;
    refId: string;
    remarks?: string;
    otp: string;
    receiver_account_no: string;
    receiverIfscCode: string;
    account_holder_name: string;
    receiverMobilenumber: string;
  }) => handle("transaction/instant", () => post(`/dmt/txn/v1/transaction/instant`, payload));

  /** POST /dmt/txn/v1/transaction/charges — { senderId, amount } */
  const transactionCharges = (payload: { senderId: string; amount: number }) =>
    handle("transaction/charges", () => post(`/dmt/txn/v1/transaction/charges`, payload));

  /**
   * POST /dmt/txn/v1/transaction/requery
   * Documented as "passed through as-is" — paymentSystem's dmt.txn.controller.js#requery
   * is the real source of truth for the exact field name(s). We send every reference we
   * hold (refId / transaction id / RRN) so the call works regardless of which key the
   * backend actually reads; confirm against the controller and trim this once verified.
   */
  const transactionRequery = (payload: { refId: string; transactionId?: string; rrn?: string }) =>
    handle("transaction/requery", () => post(`/dmt/txn/v1/transaction/requery`, payload));

  return {
    remitterRegister,
    remitterDetails,
    beneficiaryAccountVerification,
    beneficiaryGet,
    beneficiaryAdd,
    transactionOtp,
    transactionInstant,
    transactionCharges,
    transactionRequery,
  };
}
