// src/composables/apis/useBucksboxApi.ts
import { useApi } from "./useApi";

// BUCKSBOX is Bucksbox's own first-party interface — no external provider
// API to call. "Onboarding" here is purely internal: mark the merchant's
// UPI/BUCKSBOX MerchantServiceKyc row SUBMITTED (queued for manual review).
// Backed by src/modules/interface/bucksbox/routes/bucksbox.route.js.
export function useBucksboxApi() {
  const { post } = useApi();

  const markBucksboxSubmitted = async (merchantId: string) => {
    try {
      const res = await post(`/onboarding/bucksbox/merchant/submit`, { merchantId });
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "99", message: "Failed to submit BUCKSBOX onboarding" };
    }
  };

  return { markBucksboxSubmitted };
}
