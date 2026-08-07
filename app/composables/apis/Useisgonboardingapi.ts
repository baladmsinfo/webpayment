// src/composables/apis/useIsgOnboardingApi.ts
import { useApi } from "./useApi";

export function useIsgOnboardingApi() {
  const { get, post, del } = useApi();

  // ── NEW: ISG OTP ──────────────────────────────────────────────
  const isgSendOtp = async (payload: { phone: string }) => {
    try {
      const res = await post(`/onboarding/upi/isg/send-otp`, payload);
      return res;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const isgVerifyOtp = async (payload: { phone: string; otp: string }) => {
    try {
      const res = await post(`/onboarding/upi/isg/verify-otp`, payload);
      return res;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const setVerifyOtp = async (merchantId: string) => {
    try {
      const res = await post(`/onboarding/upi/isg/set-verify-otp`, { merchantId });
      return res;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };
  // ─────────────────────────────────────────────────────────────

  const isgGetMerchantForOnboarding = async (id: string) => {
    try {
      const res = await get(`/onboarding/merchants/onboarding/${id}`);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // Self-service variant — resolves the merchant from the caller's own JWT
  // (no id param), same endpoint paymentapp's mobile app uses for merchant
  // self-registration onboarding.
  const isgGetOwnMerchantForOnboarding = async () => {
    try {
      const res = await get(`/onboarding/merchants/onboarding`);
      return res.data;
    } catch (err: any) {
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

  // Deletes a previously uploaded compliance image — used before attaching
  // a replacement so a reupload actually replaces rather than piling up.
  const deleteComplianceImage = async (imageId: number | string, merchantId?: string) => {
    try {
      const res = await del(`/onboarding/compliance/images/${imageId}`, {
        params: { merchantId },
      });
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // Deletes an entire compliance document (and its attached images).
  const deleteComplianceDocument = async (documentId: number | string, merchantId?: string) => {
    try {
      const res = await del(`/onboarding/compliance/documents/${documentId}`, {
        params: { merchantId },
      });
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
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
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  const isgSubmitOnboarding = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/upi/isg/submit/onboading`, {
      merchantId: payload.merchantId
      });
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // Marks a merchant record as KYC-submitted (mstatus -> SUBMITTED) so the
  // dashboard shows the "awaiting verification" banner instead of "submit
  // documents". For a merchant caller this is self-service — the backend
  // resolves the target from the caller's own JWT and ignores merchantId.
  // For a vendor caller (onboarding a merchant on their behalf), merchantId
  // is required — the backend verifies that merchant actually belongs to
  // that vendor before updating it.
  const isgMarkKycSubmitted = async (merchantId?: string) => {
    try {
      const res = await post(`/merchant/kyc/submit`, merchantId ? { merchantId } : {});
      return res.data;
    } catch (err: any) {
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
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  return {
    isgSendOtp,
    isgVerifyOtp,
    setVerifyOtp,
    isgGetMerchantForOnboarding,
    isgGetOwnMerchantForOnboarding,
    isgVerifyPan,
    uploadDoc,
    complianceInit,
    deleteComplianceImage,
    deleteComplianceDocument,
    isgVerifyAccount,
    isgSubmitOnboarding,
    isgMarkKycSubmitted,
    isgVerifyGst,
  };
}