import { useApi } from "./useApi";

// Same filter shape as ReportFilters (useReportsApi.ts) — the reconciliation
// list is filtered exactly like the transaction reports list, by design.
export interface ReconciliationFilters {
  from?: string;
  to?: string;
  merchantId?: string | null;
  vendorId?: string | null;
  aggregatorId?: string | null;
  status?: string;
  settlementStatus?: string;
  txnType?: string;
  provider?: string;
  paymentMethod?: string;
  search?: string;
  amountMin?: number | string;
  amountMax?: number | string;
  page?: number;
  limit?: number;
}

export function useReconciliationApi() {
  const { get, post } = useApi();

  const buildQuery = (params: Record<string, any> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") q.set(key, String(val));
    });
    return q.toString();
  };

  const getReconciliationStatus = async (params: ReconciliationFilters = {}) => {
    const res = await get(`/reconciliation/status?${buildQuery(params)}`);
    return res.data;
  };

  const getMatchedTransactions = async (params: ReconciliationFilters = {}) => {
    const res = await get(`/reconciliation/matched?${buildQuery(params)}`);
    return res.data;
  };

  const getExceptions = async (params: ReconciliationFilters & { type?: string; resolution?: string } = {}) => {
    const res = await get(`/reconciliation/exceptions?${buildQuery(params)}`);
    return res.data;
  };

  const getReconciliationBatches = async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const res = await get(`/reconciliation/batches?${buildQuery(params)}`);
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
