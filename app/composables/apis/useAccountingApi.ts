import { useApi } from "./useApi";

export function useAccountingApi() {
  const { get, post } = useApi();

  const getAccounts = async (params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.page)     q.set("page",     String(params.page));
    if (params.limit)    q.set("limit",    String(params.limit));
    if (params.category) q.set("category", params.category);
    if (params.type)     q.set("type",     params.type);
    const res = await get(`/accounting/accounts?${q.toString()}`);
    return res.data;
  };

  const getEntries = async (params: {
    page?: number;
    limit?: number;
    transactionId?: string;
    accountId?: string;
    entryType?: string;
    fromDate?: string;
    toDate?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.page)          q.set("page",          String(params.page));
    if (params.limit)         q.set("limit",         String(params.limit));
    if (params.transactionId) q.set("transactionId", params.transactionId);
    if (params.accountId)     q.set("accountId",     params.accountId);
    if (params.entryType)     q.set("entryType",     params.entryType);
    if (params.fromDate)      q.set("fromDate",      params.fromDate);
    if (params.toDate)        q.set("toDate",        params.toDate);
    const res = await get(`/accounting/entries?${q.toString()}`);
    return res.data;
  };

  const getTrialBalance = async (params: {
    fromDate?: string;
    toDate?: string;
  } = {}) => {
    const q = new URLSearchParams();
    if (params.fromDate) q.set("fromDate", params.fromDate);
    if (params.toDate)   q.set("toDate",   params.toDate);
    const res = await get(`/accounting/trial-balance?${q.toString()}`);
    return res.data;
  };

  const seedAccounts = async () => {
    const res = await post("/accounting/accounts/seed", {});
    return res.data;
  };

  const autoPostGl = async (transactionId: string) => {
    const res = await post(`/accounting/auto-post/${transactionId}`, {});
    return res.data;
  };

  return {
    getAccounts,
    getEntries,
    getTrialBalance,
    seedAccounts,
    autoPostGl,
  };
}
