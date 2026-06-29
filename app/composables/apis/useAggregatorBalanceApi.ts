import { useApi } from "./useApi";
import { ref } from "vue";

export function useAggregatorBalanceApi() {
    const { get, post } = useApi();

    const balanceData = ref({
        walletId:          null,
        balance:           0,
        walletActive:      false,
        settlementAccount: null,
    });

    const historyData = ref([]);
    const historyMeta = ref({ page: 1, limit: 20, total: 0, totalPages: 0 });

    const balanceLoading  = ref(false);
    const historyLoading  = ref(false);
    const addMoneyLoading = ref(false);
    const withdrawLoading = ref(false);

    const balanceError = ref(null);
    const historyError = ref(null);

    const fetchBalance = async () => {
        balanceLoading.value = true;
        balanceError.value   = null;
        try {
            const res = await get("/aggregator/balance");
            if (res.data?.statusCode === "00") {
                balanceData.value = res.data.data;
            } else {
                balanceError.value = res.data?.message || "Failed to load balance";
            }
            return res.data;
        } catch (err) {
            balanceError.value = err?.message || "Network error";
            throw err;
        } finally {
            balanceLoading.value = false;
        }
    };

    const addMoney = async (amount, description = "") => {
        addMoneyLoading.value = true;
        try {
            const res = await post("/aggregator/balance/add", { amount, description });
            if (res.data?.statusCode === "00") {
                balanceData.value.balance = res.data.data.newBalance;
            }
            return res.data;
        } catch (err) {
            throw err;
        } finally {
            addMoneyLoading.value = false;
        }
    };

    const withdraw = async (amount, description = "") => {
        withdrawLoading.value = true;
        try {
            const res = await post("/aggregator/balance/withdraw", { amount, description });
            if (res.data?.statusCode === "00") {
                balanceData.value.balance = res.data.data.newBalance;
            }
            return res.data;
        } catch (err) {
            throw err;
        } finally {
            withdrawLoading.value = false;
        }
    };

    const fetchHistory = async ({
        page   = 1,
        limit  = 20,
        type,
        from,
        to,
        search,
    } = {}) => {
        historyLoading.value = true;
        historyError.value   = null;
        try {
            const params = new URLSearchParams({ page: String(page), limit: String(limit) });
            if (type)   params.set("type",   type);
            if (from)   params.set("from",   from);
            if (to)     params.set("to",     to);
            if (search) params.set("search", search);

            const res = await get(`/aggregator/balance/history?${params.toString()}`);
            if (res.data?.statusCode === "00") {
                historyData.value = res.data.data;
                historyMeta.value = res.data.meta;
            } else {
                historyError.value = res.data?.message || "Failed to load history";
            }
            return res.data;
        } catch (err) {
            historyError.value = err?.message || "Network error";
            throw err;
        } finally {
            historyLoading.value = false;
        }
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(val ?? 0);

    const maskAccount = (accNo) => {
        if (!accNo) return "—";
        return "•••• " + String(accNo).slice(-4);
    };

    return {
        balanceData, historyData, historyMeta,
        balanceLoading, historyLoading, addMoneyLoading, withdrawLoading,
        balanceError, historyError,
        fetchBalance, addMoney, withdraw, fetchHistory,
        formatCurrency, maskAccount,
    };
}
