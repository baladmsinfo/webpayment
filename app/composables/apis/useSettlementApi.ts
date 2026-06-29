import { useApi } from "./useApi";

export function useSettlementApi() {
  const { get, post, put } = useApi();

  const getSettlementDashboard = async () => {
    const res = await get("/settlement/dashboard");
    return res.data;
  };

  const getPendingSettlements = async (params: {
    page?: number;
    limit?: number;
    merchantId?: string | null;
    fromDate?: string;
    toDate?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.page)       q.set("page",       String(params.page));
    if (params.limit)      q.set("limit",      String(params.limit));
    if (params.merchantId) q.set("merchantId", params.merchantId);
    if (params.fromDate)   q.set("fromDate",   params.fromDate);
    if (params.toDate)     q.set("toDate",     params.toDate);
    const res = await get(`/settlement/pending?${q.toString()}`);
    return res.data;
  };

  const getSettlementBatches = async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.page)   q.set("page",   String(params.page));
    if (params.limit)  q.set("limit",  String(params.limit));
    if (params.status) q.set("status", params.status);
    const res = await get(`/settlement/batches?${q.toString()}`);
    return res.data;
  };

  const triggerSettlementBatch = async (data: {
    fromDate?: string;
    toDate?: string;
    merchantId?: string;
    remarks?: string;
  }) => {
    const res = await post("/settlement/trigger", data);
    return res.data;
  };

  const updateSettlementStatus = async (id: string, data: {
    status: string;
    settlementRef?: string;
    remarks?: string;
  }) => {
    const res = await put(`/settlement/${id}/status`, data);
    return res.data;
  };

  return {
    getSettlementDashboard,
    getPendingSettlements,
    getSettlementBatches,
    triggerSettlementBatch,
    updateSettlementStatus,
  };
}
