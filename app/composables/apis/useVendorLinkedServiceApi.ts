// src/composables/apis/useVendorLinkedServiceApi.ts
import { useApi } from "./useApi";

export function useVendorLinkedServiceApi() {
  const { get, post, put, del } = useApi();

  // For vendor's own dashboard — uses token, no vendorId param needed
  const getMyLinkedServices = async () => {
    try {
      const res = await get(`/services/vendor/services-interfaces`);
      if (res?.data?.statusCode === "00") return res.data;
      return null;
    } catch (e) {
      console.error("getMyLinkedServices error:", e);
      return null;
    }
  };

  // For admin/aggregator viewing a specific vendor
  const getLinkedServices = async (vendorId: string) => {
    try {
      const res = await get(`/services/vendor/${vendorId}/linked-services`);
      if (res?.data?.statusCode === "00") return res.data;
      return null;
    } catch (e) {
      console.error("getLinkedServices error:", e);
      return null;
    }
  };

  const createLinkedService = async (
    vendorId: string,
    payload: { serviceId: string; interfaceId: string; status?: boolean }
  ) => {
    try {
      const res = await post(`/services/vendor/${vendorId}/linked-services`, payload);
      return res?.data ?? null;
    } catch (e) {
      console.error("createLinkedService error:", e);
      return (e as any)?.response?.data ?? null;
    }
  };

  const updateLinkedService = async (
    vendorId: string,
    id: string,
    payload: { serviceId?: string; interfaceId?: string; status?: boolean }
  ) => {
    try {
      const res = await put(`/services/vendor/${vendorId}/linked-services/${id}`, payload);
      return res?.data ?? null;
    } catch (e) {
      console.error("updateLinkedService error:", e);
      return (e as any)?.response?.data ?? null;
    }
  };

  const deleteLinkedService = async (vendorId: string, id: string) => {
    try {
      const res = await del(`/services/vendor/${vendorId}/linked-services/${id}`);
      return res?.data ?? null;
    } catch (e) {
      console.error("deleteLinkedService error:", e);
      return (e as any)?.response?.data ?? null;
    }
  };

  return {
    getMyLinkedServices,
    getLinkedServices,
    createLinkedService,
    updateLinkedService,
    deleteLinkedService,
  };
}