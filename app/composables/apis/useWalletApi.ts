// composables/apis/useWalletApi.ts
import { ref, reactive } from "vue";
import { useApi } from "~/composables/apis/useApi";

// ── Types ──────────────────────────────────────────────────────
export interface WalletTxnRow {
  id: string;
  walletId: string;
  transactionId: string;
  amount: string;
  type: "CREDIT" | "DEBIT";
  description: string;
  createdAt: string;
  txn: { id: string; type: string; status: string } | null;
}

export interface TxnPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FetchTxnParams {
  page?: number;
  limit?: number;
  type?: "CREDIT" | "DEBIT" | "";
  from?: string;
  to?: string;
  search?: string;
}

export const useWalletApi = () => {
  const { get, post } = useApi();

  const walletData = reactive({
    id: null as string | null,
    balance: "0",
    status: false,
    userId: null as number | null,
    merchantId: null as string | null,
    vendorId: null as string | null,
    walletprofileId: null as string | null,
    createdAt: null as string | null,
    updatedAt: null as string | null,
    ledger: [] as any[],
    limits: [] as any[],
  });

  // ── Transactions state ──
  const txnList      = ref<WalletTxnRow[]>([]);
  const txnPagination = ref<TxnPagination>({
    total: 0, page: 1, limit: 10,
    totalPages: 1, hasNext: false, hasPrev: false,
  });
  const txnLoading = ref(false);
  const txnError   = ref<string | null>(null);

  const loading = ref(false);
  const error   = ref<string | null>(null);

  // ── Fetch Wallet ───────────────────────────────────────────────
  const fetchWallet = async (ownerType = "profile", id: string | null = null) => {
    loading.value = true;
    error.value   = null;
    try {
      const params: Record<string, string> = {};
      if (id) params.id = id;
      const res = await get(`/wallet/${ownerType}`, { params });
      if (res.data?.statusCode === "00" && res.data?.data) {
        Object.assign(walletData, res.data.data);
        return walletData;
      }
      throw new Error(res.data?.message || "Failed to fetch wallet");
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ── Fetch Transactions (paginated) ─────────────────────────────
  const fetchTransactions = async (params: FetchTxnParams = {}) => {
    txnLoading.value = true;
    txnError.value   = null;
    try {
      const query: Record<string, string> = {
        page:  String(params.page  ?? 1),
        limit: String(params.limit ?? 10),
      };
      if (params.type)   query.type   = params.type;
      if (params.from)   query.from   = params.from;
      if (params.to)     query.to     = params.to;
      if (params.search) query.search = params.search;

      const res = await get("/wallet-service/transactions", { params: query });

      if (res.data?.statusCode === "00" && res.data?.data) {
        txnList.value       = res.data.data.transactions;
        txnPagination.value = res.data.data.pagination;
        return res.data.data;
      }
      throw new Error(res.data?.message || "Failed to fetch transactions");
    } catch (err: any) {
      txnError.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      txnLoading.value = false;
    }
  };

  // ── Add / Debit / Process (unchanged) ─────────────────────────
  const addMoney = async (
    amount: number, description: string,
    ownerType = "profile", id: string | null = null
  ) => {
    loading.value = true; error.value = null;
    try {
      const params: Record<string, string> = {};
      if (id) params.id = id;
      const res = await post(`/wallet/${ownerType}/add-money`, { amount, description }, { params });
      if (res.data?.statusCode === "00" && res.data?.data) {
        Object.assign(walletData, res.data.data);
        return walletData;
      }
      throw new Error(res.data?.message || "Failed to add money");
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const debitMoney = async (
    amount: number, description: string,
    channel = "WALLET", paymentMethod = "ALL",
    ownerType = "profile", id: string | null = null
  ) => {
    loading.value = true; error.value = null;
    try {
      const params: Record<string, string> = {};
      if (id) params.id = id;
      const res = await post(
        `/wallet/${ownerType}/debit-money`,
        { amount, description, channel, paymentMethod },
        { params }
      );
      if (res.data?.statusCode === "00" && res.data?.data) {
        Object.assign(walletData, res.data.data);
        return walletData;
      }
      throw new Error(res.data?.message || "Failed to debit wallet");
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const processTransaction = async (
    amount: number, direction: "CREDIT" | "DEBIT",
    channel = "WALLET", paymentMethod = "ALL",
    description = "", ownerType = "profile", id: string | null = null
  ) => {
    loading.value = true; error.value = null;
    try {
      const params: Record<string, string> = {};
      if (id) params.id = id;
      const res = await post(
        `/wallet/${ownerType}/txn`,
        { amount, direction, channel, paymentMethod, description },
        { params }
      );
      if (res.data?.statusCode === "00" && res.data?.data) {
        Object.assign(walletData, res.data.data);
        return walletData;
      }
      throw new Error(res.data?.message || "Failed to process transaction");
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getRecentTransactions = (limit = 10) => walletData.ledger.slice(0, limit);
  const getTotalCredits = () =>
    walletData.ledger.filter(t => t.type === "CREDIT")
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  const getTotalDebits = () =>
    walletData.ledger.filter(t => t.type === "DEBIT")
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  return {
    walletData, loading, error,
    txnList, txnPagination, txnLoading, txnError,
    fetchWallet, fetchTransactions,
    addMoney, debitMoney, processTransaction,
    getRecentTransactions, getTotalCredits, getTotalDebits,
  };
};