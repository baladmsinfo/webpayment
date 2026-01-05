// src/composables/useUsersApi.ts
import { useApi } from "./useApi";
import { useOnboardingStore } from "~/stores/onboading";

export function useOnboadingApi() {
  const { get, post, put } = useApi();
  const Onboading = useOnboardingStore();

  const MCCSearch = async (searchBy: string) => {
    return await get("/api/search/mcc?q=" + searchBy);
  };

  const pincodeSearch = async (searchBy: string) => {
    return await get("/api/search/pincode?q=" + searchBy);
  };

  // const verifyPan = async (payload: any) => {
  //   //console.log(payload);
  //   return await post("/onboading/verify/pan", payload);
  // };

  // const verifyAccount = async (payload: ) => {
  //   //console.log(payload);
  //   return await post("/onboading/verify/account", payload);
  // };

  // const onboading = async (payload: any) => {
  //   //console.log(payload);
  //   return await post("/onboading/onboading", payload);
  // };

  const businessTurnOver = async () => {
    const res = await get("/api/trunOver");
    Onboading.setTurnOver(res.data);
    return res.data;
  };

  const businessType = async () => {
    const res = await get("/api/businessType");
    console.log(res.data);
    if (res.data.statusCode == "00") {
      Onboading.setBusinessTypes(res.data.data);
      return res.data.data;
    }
  };

  const complianceStatus = async (merchantId: any) => {
    const res = await get(`/api/compliance/status`, {
      params: { merchantId }
    })

    return res
  }

  const updateMerchant = async (payload: any) => {
    const { merchantId, ...body } = payload

    const res = await put(
      `/api/merchant/business-type`,
      body,
      { params: { merchantId } }   // ✅ query param
    )

    console.log("Update Merchant Response", res)

    if (res?.data.success) {
      return res.data
    }

    return null
  }

  const fetchCompliance = async (type: any) => {
    const res = await get(`/fetch-compliance`);

    if (res?.data?.statusCode === "00") {
      return res.data.data;
    }

    return null;
  };

  const onboading = async (payload: any, merchantId: any) => {
    //console.log(payload);
    return await post("/Onboarding", payload, { params: { merchantId } });
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

    return await post("/api/compliance/images", formData)
  }

  const complianceInit = async (payload: any, merchantId: any) => {
    const res = await post(`/api/merchant/init-compliance`, payload, { params: { merchantId } });

    return res;
  };


  const getMerchantById = async (id: string) => {
    try {
      const res = await get(`/api/merchants/${id}`);
      console.log("Merchant Details:", res.data);
      return res.data; // return the single merchant object
    } catch (error) {
      console.error("Error fetching merchant by ID:", error);
      return null;
    }
  };


  return {
    MCCSearch,
    businessTurnOver,
    complianceStatus,
    updateMerchant,
    businessType,
    pincodeSearch,
    complianceInit,
    uploadDoc,
    onboading,
    fetchCompliance,
    getMerchantById,
  };
}
