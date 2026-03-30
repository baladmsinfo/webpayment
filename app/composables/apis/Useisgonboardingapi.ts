// src/composables/apis/useIsgOnboardingApi.ts
import { useApi } from "./useApi";

export function useIsgOnboardingApi() {
  const { get, post } = useApi();

  // ── NEW: ISG OTP ──────────────────────────────────────────────
  const isgSendOtp = async (payload: { phone: string }) => {
    try {
      const res = await post(`/onboarding/upi/isg/send-otp`, payload);
      console.log("[ISG] Send OTP response:", res);
      return res;
    } catch (err: any) {
      console.error("[ISG] Send OTP error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const isgVerifyOtp = async (payload: { phone: string; otp: string }) => {
    try {
      const res = await post(`/onboarding/upi/isg/verify-otp`, payload);
      console.log("[ISG] Verify OTP response:", res);
      return res;
    } catch (err: any) {
      console.error("[ISG] Verify OTP error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };
  // ─────────────────────────────────────────────────────────────

  const isgGetMerchantForOnboarding = async (id: string) => {
    try {
      const res = await get(`/onboarding/merchants/onboarding/${id}`);
      console.log("[ISG] Get Merchant response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[ISG] Get Merchant error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const isgVerifyPan = async (payload: {
    pan: string;
    name: string;
    dob: string;
    fathername: string;
    merchantId?: string;
  }) => {
    try {
      const res = await post(`/onboarding/upi/isg/verify/pan`, payload);
      console.log("[ISG] Verify PAN response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[ISG] Verify PAN error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const uploadDoc = async (
    file: File,
    options?: { filename?: string; docid?: number; merchantId?: string }
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.filename) formData.append("filename", options.filename);
    if (options?.docid) formData.append("docid", String(options.docid));
    return await post("/onboarding/compliance/images", formData, {
      params: { merchantId: options?.merchantId },
    });
  };

  const complianceInit = async (payload: any, merchantId: any) => {
    const res = await post(`/onboarding/upi/isg/compliance/docUpload`, payload, {
      params: { merchantId },
    });
    return res;
  };

  const isgVerifyAccount = async (payload: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    consent: string;
    additionalData: string;
    merchantId?: string;
  }) => {
    try {
      const res = await post(`/onboarding/upi/isg/verify/account`, payload);
      console.log("[ISG] Verify Account response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[ISG] Verify Account error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const isgSubmitOnboarding = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/upi/isg/submit/onboading`, {
      merchantId: payload.merchantId
      });
      console.log("[ISG] Submit Onboarding response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[ISG] Submit Onboarding error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const isgVerifyGst = async (payload: {
    gstin: string;
    consent: string;
    additionalData: string;
    merchantId?: string;
  }) => {
    try {
      const res = await post(`/onboarding/upi/isg/verify/gst`, payload);
      console.log("[ISG] Verify GST response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[ISG] Verify GST error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  return {
    isgSendOtp,
    isgVerifyOtp,
    isgGetMerchantForOnboarding,
    isgVerifyPan,
    uploadDoc,
    complianceInit,
    isgVerifyAccount,
    isgSubmitOnboarding,
    isgVerifyGst,
  };
}