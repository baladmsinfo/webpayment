// src/composables/apis/useUpiOnboardingApi.ts
import { useApi } from "./useApi";

export function useUpiOnboardingApi() {
  const { get, post } = useApi();

  const upiInitiateMOS = async (payload: any) => {
    try {
      const res = await post(`/onboarding/upi/mos/initiate`, payload);
      console.log("[UPI] Initiate MOS response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[UPI] Initiate MOS error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const upiSubmitCKYC = async (payload: {
    dob: string;
    pan: string;
    mobile: string;
  }) => {
    try {
      const res = await post(`/upi/ckyc/submit`, payload);
      console.log("[UPI] Submit CKYC response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[UPI] Submit CKYC error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const upiVerifyCKYCOTP = async (payload: {
    request_id: string;
    otp: string;
  }) => {
    try {
      const res = await post(`/upi/ckyc/verify_otp`, payload);
      console.log("[UPI] Verify CKYC OTP response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[UPI] Verify CKYC OTP error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const upiSubmitOnboarding = async (payload: {
    dba_name?: string;
    business_dob?: string;
    primary_email_id?: string;
    primary_mobile?: string | number;
    official_address?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    city?: string;
    state?: string;
    pincode?: string;
    residential_address?: string;
    res_address1?: string;
    res_address2?: string;
    res_address3?: string;
    res_city?: string;
    res_state?: string;
    res_pincode?: string;
    vister_address?: string;
    v_address1?: string;
    v_address2?: string;
    v_address3?: string;
    v_city?: string;
    v_state?: string;
    v_pincode?: string;
    beneficiary_email?: string;
    beneficiary_mobile?: string | number;
    gender?: string;
    nature_of_business?: string;
    annual_turn_over?: string | number;
    website?: string;
    std_code?: string;
    lead_source?: string;
    ckyc?: boolean;
  }) => {
    try {
      const res = await post(`/Onboarding`, { ...payload }, { params: { type: "UPI" } });
      console.log("[UPI] Submit Onboarding response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[UPI] Submit Onboarding error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const upiGetMerchantForOnboarding = async (id: string) => {
    try {
      const res = await get(`/onboarding/merchants/onboarding/${id}`);
      console.log("[UPI] Get Merchant response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[UPI] Get Merchant error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const upiUploadDoc = async (
    file: File,
    meta: { filename: string }
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file, meta.filename);
      const res = await post(`/upi/compliance/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("[UPI] Upload Doc response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[UPI] Upload Doc error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const upiComplianceInit = async (
    payload: Record<string, any>,
    merchantId: string
  ) => {
    try {
      const res = await post(`/upi/compliance/init`, payload, {
        params: { merchantId },
      });
      console.log("[UPI] Compliance Init response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[UPI] Compliance Init error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  return {
    upiInitiateMOS,
    upiSubmitCKYC,
    upiVerifyCKYCOTP,
    upiSubmitOnboarding,
    upiGetMerchantForOnboarding,
    upiUploadDoc,
    upiComplianceInit,
  };
}