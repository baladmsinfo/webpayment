// src/composables/usePaymentsApi.ts
import { useApi } from "./useApi";
import { usePaymentsStore } from "~/stores/payments";

export function usePaymentsApi() {
  const { get, post } = useApi();
  const store = usePaymentsStore();

function formatDate(date: Date) {
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

const getTransactions = async (payload: { 
  page: string; 
  limit: string; 
  startDate?: string; 
  endDate?: string; 
  search?: string;
  status?: string;
}) => {
  try {
    store.setLoading(true);

    const params = new URLSearchParams({
      page: payload.page,
      limit: payload.limit,
    });

    if (payload.startDate) params.append("startDate", payload.startDate);
    if (payload.endDate) params.append("endDate", payload.endDate);
    if (payload.search) params.append("search", payload.search);
    if (payload.status && payload.status !== "ALL") params.append("status", payload.status);

    const res = await get(`/merchant/txnHistory?${params.toString()}`);

    store.setPayment(res.data.payment);
    return res;
  } catch (err: any) {
    store.setError(err?.message || "Failed to fetch transaction history");
  } finally {
    store.setLoading(false);
  }
};

    const getMerchantCollections = async () => {
    try {
      store.setLoading(true);
      const res = await get(
        "/merchant/getMerchantCollections"
      );
      store.setCollection(res.data);
      return res;
    } catch (err: any) {
      store.setError(err?.message || "Failed to fetch transaction history");
    } finally {
      store.setLoading(false);
    }
  };

  const StaticQR = async () => {
    try {
      store.setLoading(true);
      const res = await get("/payments/GenerateQR");
      store.setQR(res.data);
      return res;
    } catch (err: any) {
      store.setError(err?.message || "Failed to fetch Static QR");
    } finally {
      store.setLoading(false);
    }
  };

  const DynamicQR = async (payload: { amount: string; order_id: string }) => {
    try {
      store.setLoading(true);
      const res = await post("/payments/DynamicQR", payload);
      store.setQR(res.data);
      console.log(res)
      return res;
    } catch (err: any) {
      console.log("err",err)
      store.setError(err?.message || "Dynamic QR failed");
    } finally {
      store.setLoading(false);
    }
  };

  const SMSPay = async (payload: { amount: string; order_id: string }) => {
    try {
      store.setLoading(true);
      const res = await post("/payments/SMSPay", payload);
      store.setQR(res.data);
      return res;
    } catch (err: any) {
      store.setError(err?.message || "SMSPay failed");
    } finally {
      store.setLoading(false);
    }
  };

  const Collection = async (payload: { amount: string; order_id: string }) => {
    try {
      store.setLoading(true);
      const res = await post("/payments/Collection", payload);
      return res;
    } catch (err: any) {
      store.setError(err?.message || "Collection failed");
    } finally {
      store.setLoading(false);
    }
  };

  const verifyVPA = async (payload: { payer_virtual_address: string }) => {
    try {
      store.setLoading(true);
      const res = await post("/payments/verifyVPA", payload);
      store.setVPAStatus(res);
      return res;
    } catch (err: any) {
      store.setError(err?.message || "VPA verification failed");
    } finally {
      store.setLoading(false);
    }
  };

  return {
    StaticQR,
    DynamicQR,
    SMSPay,
    Collection,
    verifyVPA,
    getTransactions,
    getMerchantCollections
  };
}
