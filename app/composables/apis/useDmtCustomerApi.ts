// src/composables/apis/useDmtCustomerApi.ts
//
// Customer (remitter) onboarding — NSDL DMT.
// Source of truth: fintech-gateway/docs/qr-aeps-dmt-operations.md ("Customer (remitter) onboarding")
// paymentSystem routes are mounted directly at /dmt/customer/* — no encrypted envelope,
// merchant identity is resolved from the Bearer token by useApi()'s interceptor.
import { useApi } from "./useApi";

export interface DmtApiResult<T = any> {
  statusCode: string;
  message?: string;
  data?: T;
  [key: string]: any;
}

export function useDmtCustomerApi() {
  const { get, post } = useApi();

  const handle = async (label: string, fn: () => Promise<any>): Promise<DmtApiResult> => {
    try {
      const res = await fn();
      return res.data;
    } catch (err: any) {
      console.error(`[DMT-Customer] ${label} error:`, err);
      return (
        err?.response?.data ?? {
          statusCode: "01",
          message: err?.message || "Network error — please try again",
        }
      );
    }
  };

  /** POST /dmt/customer/GetDetail — { mobile_number } */
  const customerGetDetail = (mobile_number: string) =>
    handle("GetDetail", () => post(`/dmt/customer/GetDetail`, { mobile_number }));

  /** POST /dmt/customer/onboarding — { name, mobile_no, email_id, city, state } */
  const customerOnboarding = (payload: {
    name: string;
    mobile_no: string;
    email_id?: string;
    city: string;
    state: string;
  }) => handle("onboarding", () => post(`/dmt/customer/onboarding`, payload));

  /** POST /dmt/customer/request_otp — { referenceid } */
  const customerRequestOtp = (referenceid: string) =>
    handle("request_otp", () => post(`/dmt/customer/request_otp`, { referenceid }));

  /** POST /dmt/customer/validate_otp — { otp, otpreqid, referenceid } */
  const customerValidateOtp = (payload: { otp: string; otpreqid: string; referenceid: string }) =>
    handle("validate_otp", () => post(`/dmt/customer/validate_otp`, payload));

  /** POST /dmt/customer/verify_UID — { aadhaarno, referenceid } */
  const customerVerifyUid = (payload: { aadhaarno: string; referenceid: string }) =>
    handle("verify_UID", () => post(`/dmt/customer/verify_UID`, payload));

  /** POST /dmt/customer/updatebiodetail — { PidData, aadhaarno, referenceid } */
  const customerUpdateBiodetail = (payload: { PidData: string; aadhaarno: string; referenceid: string }) =>
    handle("updatebiodetail", () => post(`/dmt/customer/updatebiodetail`, payload));

  /** POST /dmt/customer/submit — finalizes onboarding, no body fields documented */
  const customerSubmit = () => handle("submit", () => post(`/dmt/customer/submit`, {}));

  /** GET /dmt/customer/statusCheck */
  const customerStatusCheck = () => handle("statusCheck", () => get(`/dmt/customer/statusCheck`));

  return {
    customerGetDetail,
    customerOnboarding,
    customerRequestOtp,
    customerValidateOtp,
    customerVerifyUid,
    customerUpdateBiodetail,
    customerSubmit,
    customerStatusCheck,
  };
}
