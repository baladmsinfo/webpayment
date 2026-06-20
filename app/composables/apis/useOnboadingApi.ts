// src/composables/useOnboadingApi.ts
import { useApi } from "./useApi";
import { useOnboardingStore } from "~/stores/onboading";

export function useOnboadingApi() {
  const { get, post, put } = useApi();
  const Onboading = useOnboardingStore();

  const MCCSearch = async (searchBy: string) => {
    return await get("/admin/onboarding/search/mcc?q=" + searchBy);
  };

  const pincodeSearch = async (searchBy: string) => {
    return await get("/admin/onboarding/search/pincode?q=" + searchBy);
  };

  const businessTurnOver = async () => {
    const res = await get("/admin/onboarding/trunOver");
    Onboading.setTurnOver(res.data);
    return res.data;
  };

  const businessType = async () => {
    const res = await get("/admin/onboarding/businessType");
    if (res.data.statusCode == "00") {
      Onboading.setBusinessTypes(res.data.data);
      return res.data.data;
    }
  };

  const complianceStatus = async (merchantId: any) => {
    const res = await get(`/onboarding/upi/isg/compliance/status`, {
      params: { merchantId }
    })
    return res.data
  }

  const vendorCompliance = async (vendorId: any) => {
    const res = await get(`/aggregator/compliance-vendor/status`, {
      params: { vendorId }
    })
    return res
  }

  const updateMerchant = async (payload: any) => {
    const { merchantId, ...body } = payload
    const res = await put(
      `/api/merchant/business-type`,
      body,
      { params: { merchantId } }
    )
    if (res?.data.success) {
      return res.data
    }
    return null
  }

  const updateVendor = async (payload: any) => {
    const { vendorId, ...body } = payload
    const res = await put(
      `/aggregator/vendor/business-type`,
      payload,
    )
    if (res.data?.statusCode == "00") {
      return res.data
    }
    return null
  }

  const fetchCompliance = async (type: any) => {
    const res = await get(`/aggregator/fetch-compliance`);
    if (res?.data?.statusCode === "00") {
      return res.data.data;
    }
    return null;
  };

  const onboading = async (payload: any, merchantId: any) => {
    return await post("/Onboarding", payload, { params: { merchantId } });
  };

  const onboadingAEPS = async (payload: any, merchantId: any) => {
    return await post("/onboarding/aeps/vendor-onboard", payload, {
      params: { merchantId }
    });
  };

  const initiateOnboarding = async (payload: any, merchantId: any) => {
    return await post("/initiateOnboarding", payload, { params: { merchantId } });
  };

  const onboadingVendor = async (vendorId: any) => {
    return await post("/onboarding/OnboardingVendor", { vendorId });
  };

  const uploadDoc = async (
    file: File,
    options?: {
      filename?: string
      docid?: number
    }
  ) => {
    const formData = new FormData()
    formData.append("file", file)
    if (options?.filename) {
      formData.append("filename", options.filename)
    }
    if (options?.docid) {
      formData.append("docid", String(options.docid))
    }
    return await post("/aggregator/compliance/images", formData)
  }

  const complianceInit = async (payload: any, merchantId: any) => {
    const res = await post(`/api/merchant/init-compliance`, payload, { params: { merchantId } });
    return res;
  };

  const complianceInitVendor = async (payload: any, vendorId: any) => {
    const res = await post(`/aggregator/vendor/init-compliance`, payload, { params: { vendorId } });
    return res;
  };

  const createMerchant = async (payload: any) => {
    try {
      const res = await post(`/onboarding/Onboarding`, payload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  const createKyc = async (payload: any) => {
    try {
      const builtPayload = {
        service: payload.service,
        interfaceName: payload.interfaceName,
      }
      const merchantId = payload.merchantId
      const res = await post(`/services/createServceKyc/${merchantId}`, builtPayload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  const VendorOnboardingAEPS = async (payload: any) => {
    try {
      const res = await post(`/aeps/onboarding`, payload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  const validateAEPSOTP = async (payload: any) => {
    try {
      const res = await post(`/aeps/validate_otp`, payload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  const verifyPANAEPS = async (payload: any) => {
    try {
      const res = await post(`/aeps/verify_pan`, payload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  const verifyAadhaarAEPS = async (payload: any) => {
    try {
      const res = await post(`/aeps/update_UID`, payload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  const UpdateBiodevice = async (payload: any) => {
    try {
      const res = await post(`/aeps/updatebiodetail`, payload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  const getMerchantForOnboarding = async (id: string) => {
    try {
      const res = await get(`/onboarding/merchants/onboarding/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching merchant by ID:", error);
      return null;
    }
  };

  const getMerchantById = async (id: string) => {
    try {
      const res = await get(`/merchant/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching merchant by ID:", error);
      return null;
    }
  };

  const getServices = async () => {
    try {
      const res = await get(`/services/List`);
      return res.data;
    } catch (error) {
      console.error("Error fetching services by merchant ID:", error);
      return null;
    }
  };

  const getPaymentMethods = async () => {
    try {
      const res = await get(`/vendor/payments/methods`);
      return res.data?.data || [];
    } catch (error) {
      return [];
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // WALLET SERVICE
  // ─────────────────────────────────────────────────────────────────

  /**
   * Register a new wallet_service user + WalletProfile.
   * POST /wallet-service/register
   */
  const createWalletService = async (payload: {
    // Identity
    name: string
    email: string
    mobile_no: string
    password?: string
    dob: string
    gender: string

    // Business
    dba_name: string
    mcc?: string
    nature_of_business?: string
    annual_turn_over?: string
    website?: string

    // Location
    lat?: string
    long?: string

    // Official address
    official_address: string
    address1: string
    address2: string
    address3?: string
    phone?: string
    city: string
    state: string
    pincode: string

    // Residential address
    residential_address?: string
    res_address1?: string
    res_address2?: string
    res_address3?: string
    res_mobile?: string
    res_phone_number?: string
    res_city?: string
    res_state?: string
    res_pincode?: string

    // Visitor address
    vister_address?: string
    v_address1?: string
    v_address2?: string
    v_address3?: string
    v_mobile?: string
    v_phone_number?: string
    v_city?: string
    v_state?: string
    v_pincode?: string
  }) => {
    try {
      const res = await post(`/wallet-service/register`, payload)
      return res.data
    } catch (err: any) {
      return err?.response?.data
    }
  }

  return {
    MCCSearch,
    businessTurnOver,
    complianceStatus,
    vendorCompliance,
    updateMerchant,
    businessType,
    pincodeSearch,
    complianceInit,
    uploadDoc,
    onboading,
    initiateOnboarding,
    onboadingVendor,
    onboadingAEPS,
    fetchCompliance,
    updateVendor,
    createMerchant,
    verifyAadhaarAEPS,
    VendorOnboardingAEPS,
    validateAEPSOTP,
    verifyPANAEPS,
    createKyc,
    getServices,
    getMerchantForOnboarding,
    getMerchantById,
    getPaymentMethods,
    complianceInitVendor,
    UpdateBiodevice,
    // ── new ──
    createWalletService,
  };
}