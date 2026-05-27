// composables/apis/useWalletApi.ts
import { ref, reactive } from "vue";
import { useApi } from "~/composables/apis/useApi";

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

  const loading = ref(false);
  const error = ref<string | null>(null);

  // ─────────────────────────────────────────────
  // GET WALLET
  // ─────────────────────────────────────────────
  const fetchWallet = async (ownerType = "profile", id: string | null = null) => {
    loading.value = true;
    error.value = null;

    try {
      const params: Record<string, string> = {};
      if (id) params.id = id;

      const res = await get(`/wallet/${ownerType}`, { params });

      console.log("Fetch wallet response:", res.data);

      if (res.data?.statusCode === "00" && res.data?.data) {
        Object.assign(walletData, res.data.data);
        return walletData;
      }

      throw new Error(res.data?.message || "Failed to fetch wallet");
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message;
      console.error("Wallet fetch error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ─────────────────────────────────────────────
  // ADD MONEY
  // ─────────────────────────────────────────────
  const addMoney = async (
    amount: number,
    description: string,
    ownerType = "profile",
    id: string | null = null
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const params: Record<string, string> = {};
      if (id) params.id = id;

      const res = await post(
        `/wallet/${ownerType}/add-money`,
        { amount, description },
        { params }
      );

      if (res.data?.statusCode === "00" && res.data?.data) {
        Object.assign(walletData, res.data.data);
        return walletData;
      }

      throw new Error(res.data?.message || "Failed to add money");
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message;
      console.error("Add money error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ─────────────────────────────────────────────
  // DEBIT MONEY
  // ─────────────────────────────────────────────
  const debitMoney = async (
    amount: number,
    description: string,
    channel = "WALLET",
    paymentMethod = "ALL",
    ownerType = "profile",
    id: string | null = null
  ) => {
    loading.value = true;
    error.value = null;

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
      console.error("Debit money error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ─────────────────────────────────────────────
  // PROCESS TRANSACTION
  // ─────────────────────────────────────────────
  const processTransaction = async (
    amount: number,
    direction: "CREDIT" | "DEBIT",
    channel = "WALLET",
    paymentMethod = "ALL",
    description = "",
    ownerType = "profile",
    id: string | null = null
  ) => {
    loading.value = true;
    error.value = null;

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
      console.error("Transaction error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────
  const getRecentTransactions = (limit = 10) =>
    walletData.ledger.slice(0, limit);

  const getTotalCredits = () =>
    walletData.ledger
      .filter((txn) => txn.type === "CREDIT")
      .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);

  const getTotalDebits = () =>
    walletData.ledger
      .filter((txn) => txn.type === "DEBIT")
      .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);

  return {
    walletData,
    loading,
    error,
    fetchWallet,
    addMoney,
    debitMoney,
    processTransaction,
    getRecentTransactions,
    getTotalCredits,
    getTotalDebits,
  };
};