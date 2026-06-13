// src/composables/apis/useWalletServiceOnboardingApi.ts
import { useApi } from "./useApi";

export function useWalletServiceOnboardingApi() {
  const { get, post } = useApi();

  // ─────────────────────────────────────────────────────────────────────────
  // PAN VERIFICATION
  // Reuses the ISG PAN verify endpoint (same controller, same logic)
  // POST /onboarding/upi/isg/verify/pan
  // ─────────────────────────────────────────────────────────────────────────
  const wsVerifyPan = async (payload: {
    pan: string;
    name: string;
    dob: string;
    fathername: string;
    walletProfileId?: string;
  }) => {
    try {
      const res = await post(`/onboarding/wallet-service/verify/pan`, payload);
      console.log("[WS] Verify PAN response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[WS] Verify PAN error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BANK ACCOUNT VERIFICATION + SETTLEMENT ACCOUNT CREATION
  // POST /onboarding/wallet-service/verify/account
  // This verifies the account via ISG and persists a SettlementAccount
  // linked to the WalletProfile.
  // ─────────────────────────────────────────────────────────────────────────
  const wsVerifyAccount = async (payload: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    consent: string;
    additionalData: string;
    walletProfileId?: string;
  }) => {
    try {
      const res = await post(`/onboarding/wallet-service/verify/account`, payload);
      console.log("[WS] Verify Account response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[WS] Verify Account error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // UPLOAD DOCUMENT IMAGE
  // POST /onboarding/wallet-service/compliance/images
  // ─────────────────────────────────────────────────────────────────────────
  const wsUploadDoc = async (
    file: File,
    options?: { filename?: string; docid?: number; walletProfileId?: string }
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.filename) formData.append("filename", options.filename);
    if (options?.docid)    formData.append("docid", String(options.docid));
    return await post("/onboarding/wallet-service/compliance/images", formData, {
      params: { walletProfileId: options?.walletProfileId },
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SAVE COMPLIANCE DOCUMENT (link images → document record)
  // POST /onboarding/wallet-service/compliance/docUpload
  // ─────────────────────────────────────────────────────────────────────────
  const wsComplianceInit = async (payload: any, walletProfileId: string) => {
    const res = await post(
      `/onboarding/wallet-service/compliance/docUpload`,
      payload,
      { params: { walletProfileId } }
    );
    return res;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // COMPLIANCE STATUS
  // GET /onboarding/wallet-service/compliance/status
  // Returns categories with uploaded/required counts per doc type
  // ─────────────────────────────────────────────────────────────────────────
  const wsComplianceStatus = async (walletProfileId: string) => {
    const res = await get(`/onboarding/wallet-service/compliance/status`, {
      params: { walletProfileId },
    });
    return res.data;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // GET WALLET PROFILE FOR ONBOARDING (merchant-style profile fetch)
  // GET /onboarding/wallet-service/profile/:id
  // ─────────────────────────────────────────────────────────────────────────
  const wsGetProfile = async (walletProfileId: string) => {
    try {
      const res = await get(`/onboarding/wallet-service/profile/${walletProfileId}`);
      console.log("[WS] Get Profile response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[WS] Get Profile error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // FINAL APPROVAL
  // POST /onboarding/wallet-service/approve
  // Marks SettlementAccount.status = true + WalletProfile.mstatus = APPROVED
  // if PAN, bank, and all required docs are verified.
  // ─────────────────────────────────────────────────────────────────────────
  const wsApprove = async (walletProfileId: string) => {
    try {
      const res = await post(`/onboarding/wallet-service/approve`, { walletProfileId });
      console.log("[WS] Approve response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[WS] Approve error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  return {
    wsVerifyPan,
    wsVerifyAccount,
    wsUploadDoc,
    wsComplianceInit,
    wsComplianceStatus,
    wsGetProfile,
    wsApprove,
  };
}