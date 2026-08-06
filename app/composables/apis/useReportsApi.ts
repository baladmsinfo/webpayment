// src/composables/apis/useReportsApi.ts
// DMT Transaction Accounting & Commission Reports — read-only reporting API
import { useApi } from "./useApi";

export interface ReportFilters {
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
  page?: number;
  limit?: number;
  groupBy?: string;
}

export function useReportsApi() {
  const { get } = useApi();

  const buildQuery = (params: Record<string, any> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") q.set(key, String(val));
    });
    return q.toString();
  };

  // 1. Raw transaction list (filterable, paginated)
  const getTransactions = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/transactions?${buildQuery(params)}`);
    return res.data;
  };

  // 2. Single transaction detail by `tr` (reference)
  const getTransactionDetail = async (tr: string) => {
    const res = await get(`/reports/transactions/${tr}`);
    return res.data;
  };

  // 3. Overall summary (counts + all commission totals)
  const getSummary = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/summary?${buildQuery(params)}`);
    return res.data;
  };

  // 4. Day-wise trend of txn count + commission
  const getDailyTrend = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/trend/daily?${buildQuery(params)}`);
    return res.data;
  };

  // 5. Commission report grouped by vendor
  const getVendorCommissionReport = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/commission/vendor?${buildQuery(params)}`);
    return res.data;
  };

  // 6. Commission report grouped by merchant
  const getMerchantCommissionReport = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/commission/merchant?${buildQuery(params)}`);
    return res.data;
  };

  // 7. Commission report grouped by aggregator (admin only)
  const getAggregatorCommissionReport = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/commission/aggregator?${buildQuery(params)}`);
    return res.data;
  };

  // 8. Bank / provider-wise commission report (admin only)
  const getBankCommissionReport = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/commission/bank?${buildQuery(params)}`);
    return res.data;
  };

  // 9. GST report — flexible groupBy=day|merchant|vendor|aggregator|none
  const getGstReport = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/gst?${buildQuery(params)}`);
    return res.data;
  };

  // 10. Settlement-status wise report
  const getSettlementReport = async (params: ReportFilters = {}) => {
    const res = await get(`/reports/settlement?${buildQuery(params)}`);
    return res.data;
  };

  return {
    getTransactions,
    getTransactionDetail,
    getSummary,
    getDailyTrend,
    getVendorCommissionReport,
    getMerchantCommissionReport,
    getAggregatorCommissionReport,
    getBankCommissionReport,
    getGstReport,
    getSettlementReport,
  };
}
