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
    page?: number;
    limit: number | string;
    startDate?: string;
    endDate?: string;
    search?: string;
    status?: string;
  }) => {
    try {
      store.setLoading(true);

      const params = new URLSearchParams();
      params.append("limit", payload.limit.toString());
      if (payload.page) params.append("page", payload.page.toString());
      if (payload.startDate) params.append("startDate", payload.startDate);
      if (payload.endDate) params.append("endDate", payload.endDate);
      if (payload.search) params.append("search", payload.search);
      if (payload.status && payload.status !== "ALL") params.append("status", payload.status);

      const res = await get(`/merchant/txnHistory?${params.toString()}`);
      console.log("Transaction response:", res.data.data.payment);

      store.transactions = res.data.data.payment || [];
      store.totalTransactions = res.data.meta.total || 0;
    } catch (err: any) {
      store.setError(err?.message || "Failed to fetch transaction history");
      return [];
    } finally {
      store.setLoading(false);
    }
  };

  const getReports = async (payload: {
    startDate?: string;
    endDate?: string;
    status?: string;
    paymentMethod?: string;
    limit: number | string;
    page?: number;
  }) => {
    try {
      store.setLoading(true);

      const params = new URLSearchParams();
      params.append("limit", payload.limit.toString());
      if (payload.page) params.append("page", payload.page.toString());

      if (payload.startDate) params.append("startDate", payload.startDate);
      if (payload.endDate) params.append("endDate", payload.endDate);
      if (payload.status) params.append("status", payload.status);
      if (payload.paymentMethod) params.append("paymentMethod", payload.paymentMethod);

      const res = await get(`/payments/transactions?${params.toString()}`);
      console.log("Reports response:", res.data);

      store.setReports(res.data.data || []);
      store.setTotalReports(res.data.total || 0);
      return res;
    } catch (err: any) {
      store.setError(err?.message || "Failed to fetch reports");
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
      console.log("res", res.data.data);

      store.setCollection(res.data.data)
    } catch (err: any) {
      store.setError(err?.message || "Failed to fetch transaction history");
    } finally {
      store.setLoading(false);
    }
  };

  const getPaymentsByGranularity = async (granularity: string) => {
    try {
      store.setLoading(true);
      const res = await post("/merchant/getCollectionsByGranularity", {
        granularity,
      });

      if (res) {
        return res.data;
      } else {
        console.warn("Unexpected granularity response");
        return { labels: [], totals: [] };
      }
    } catch (err: any) {
      console.error("Error fetching payments by granularity:", err);
      store.setError(err?.message || "Failed to fetch payments by granularity");
      return { labels: [], totals: [] };
    } finally {
      store.setLoading(false);
    }
  };

  const getTransactionStatus = async () => {
    try {
      console.log("Fetching transaction status data...");

      const res = await get("/payments/transactions/status-summary");
      return res.data;

    } catch (e) {
      console.error("Error fetching transaction status data:", e);
      return { labels: [], values: [], colors: [] };
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
      console.log("err", err)
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
    getTransactionStatus,
    getTransactions,
    getReports,
    getMerchantCollections,
    getPaymentsByGranularity,
  };
}
