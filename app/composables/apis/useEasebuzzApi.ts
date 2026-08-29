// src/composables/apis/useEasebuzzApi.ts
import { useApi } from "./useApi";

export function useEasebuzzApi() {
  const { post } = useApi();

  // Vendor-assisted (or self-service) Easebuzz sub-merchant creation —
  // POST /onboarding/easebuzz/merchant/create (see
  // Merchantsystem/src/modules/interface/easebuzz for the backend module).
  // merchantId is required here since the caller is typically a vendor, not
  // the merchant themselves — the backend resolves it from req.body.merchantId
  // when req.user.merchantId isn't set (see easebuzz.controller.js).
  const createEasebuzzSubMerchant = async (payload: {
    merchantId: string;
    key?: string;
    name: string;
    name_on_bank: string;
    email: string;
    phone: string;
    business_name: string;
    state: string;
    nature_of_business: string;
    business_address: string;
    bank_name: string;
    bank_branch: string;
    account_number: string;
    account_ifsc: string;
    category_code: string;
    pan_number: string;
    business_type_code: string;
    address: string;
    city: string;
    pincode: string;
    entity_type: string;
    gstin?: string;
    primary_vpa?: string;
  }) => {
    try {
      const res = await post(`/onboarding/easebuzz/merchant/create`, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "99", message: "Failed to create Easebuzz sub-merchant" };
    }
  };

  // "Create Sub-Merchant" button on the vendor onboarding page — does NOT
  // call the real Easebuzz API. It marks the merchant's UPI/EASEBUZZ
  // MerchantServiceKyc row SUBMITTED (queued for manual review), mirroring
  // the old ISG "mark KYC submitted" shortcut. See markSubmitted() in
  // easebuzz.onboarding.service.js on the backend for why.
  const markEasebuzzSubmitted = async (merchantId: string) => {
    try {
      const res = await post(`/onboarding/easebuzz/merchant/submit`, { merchantId });
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "99", message: "Failed to submit Easebuzz onboarding" };
    }
  };

  return { createEasebuzzSubMerchant, markEasebuzzSubmitted };
}
