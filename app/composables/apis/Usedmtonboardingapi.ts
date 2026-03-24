// src/composables/apis/useDmtOnboardingApi.ts
import { useApi } from "./useApi";

export function useDmtOnboardingApi() {
  const { get, post } = useApi();

  const dmtOnboarding = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/onboarding`, payload);
      console.log("[DMT] Onboarding response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Onboarding error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtRequestOtp = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/request_otp`, payload);
      console.log("[DMT] Request OTP response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Request OTP error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtValidateOtp = async (payload: {
    otp: string;
    otpreqid: string;
    merchantId: string;
  }) => {
    try {
      const res = await post(`/onboarding/dmt/validate_otp`, payload);
      console.log("[DMT] Validate OTP response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Validate OTP error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const dmtVerifyPan = async (payload: {
    pan: string;
    name: string;
    dob: string; // DD/MM/YYYY
    merchantId: string;
  }) => {
    try {
      // Using AEPS verify_pan endpoint as the DMT controller reuses the same KYC service
      const res = await post(`/aeps/verify_pan`, payload);
      console.log("[DMT] Verify PAN response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Verify PAN error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtVerifyAadhaar = async (payload: {
    aadhaarno: string;
    merchantId: string;
  }) => {
    try {
      const res = await post(`/onboarding/dmt/verify_UID`, payload);
      console.log("[DMT] Verify Aadhaar response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Verify Aadhaar error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtSubmitBiometric = async (payload: {
    PidData: string;
    aadhaarno: string;
    merchantId: string;
  }) => {
    try {
      const res = await post(`/onboarding/dmt/updatebiodetail`, payload);
      console.log("[DMT] Submit Biometric response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Submit Biometric error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtSubmitConfirmation = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/submit`, payload);
      console.log("[DMT] Submit Confirmation response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Submit Confirmation error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtStatusCheck = async (merchantId: string) => {
    try {
      const res = await get(`/onboarding/dmt/statusCheck`, { params: { merchantId } });
      console.log("[DMT] Status Check response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Status Check error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtGetAgentDetail = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/GetAgentDetail`, payload);
      console.log("[DMT] Get Agent Detail response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Get Agent Detail error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  return {
    dmtOnboarding,
    dmtRequestOtp,
    dmtValidateOtp,
    dmtVerifyPan,
    dmtVerifyAadhaar,
    dmtSubmitBiometric,
    dmtSubmitConfirmation,
    dmtStatusCheck,
    dmtGetAgentDetail,
  };
}