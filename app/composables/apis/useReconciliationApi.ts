import { useApi } from "./useApi";

export function useReconciliationApi() {
  const { get, post } = useApi();

  const getReconciliationStatus = async () => {
    const res = await get("/reconciliation/status");
    return res.data;
  };

  const getMatchedTransactions = async (params: {
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.page)     q.set("page",     String(params.page));
    if (params.limit)    q.set("limit",    String(params.limit));
    if (params.fromDate) q.set("fromDate", params.fromDate);
    if (params.toDate)   q.set("toDate",   params.toDate);
    const res = await get(`/reconciliation/matched?${q.toString()}`);
    return res.data;
  };

  const getExceptions = async (params: {
    page?: number;
    limit?: number;
    type?: string;
    resolution?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.page)       q.set("page",       String(params.page));
    if (params.limit)      q.set("limit",       String(params.limit));
    if (params.type)       q.set("type",        params.type);
    if (params.resolution) q.set("resolution",  params.resolution);
    const res = await get(`/reconciliation/exceptions?${q.toString()}`);
    return res.data;
  };

  const getReconciliationBatches = async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.page)   q.set("page",   String(params.page));
    if (params.limit)  q.set("limit",  String(params.limit));
    if (params.status) q.set("status", params.status);
    const res = await get(`/reconciliation/batches?${q.toString()}`);
    return res.data;
  };

  const runReconciliationBatch = async (data: {
    fromDate: string;
    toDate: string;
    merchantId?: string;
    remarks?: string;
  }) => {
    const res = await post("/reconciliation/run", data);
    return res.data;
  };

  return {
    getReconciliationStatus,
    getMatchedTransactions,
    getExceptions,
    getReconciliationBatches,
    runReconciliationBatch,
  };
}
