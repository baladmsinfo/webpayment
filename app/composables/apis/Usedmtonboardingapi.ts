// src/composables/apis/useDmtOnboardingApi.ts
import { useApi } from "./useApi";

export function useDmtOnboardingApi() {
  const { get, post } = useApi();

  const dmtOnboarding = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/onboarding`, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtRequestOtp = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/request_otp`, payload);
      return res.data;
    } catch (err: any) {
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
      return res.data;
    } catch (err: any) {
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
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtVerifyAadhaar = async (payload: {
    aadhaarno: string;
    merchantId: string;
  }) => {
    try {
      const res = await post(`/onboarding/dmt/verify_UID`, payload);
      return res.data;
    } catch (err: any) {
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
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtSubmitConfirmation = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/submit`, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtStatusCheck = async (merchantId: string) => {
    try {
      const res = await get(`/onboarding/dmt/statusCheck`, { params: { merchantId } });
      return res.data;
    } catch (err: any) {
      console.error("[DMT] Status Check error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const dmtGetAgentDetail = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/GetAgentDetail`, payload);
      return res.data;
    } catch (err: any) {
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