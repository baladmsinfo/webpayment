import { useApi } from "./useApi";
import { useAuthStore } from "~/stores/auth";
import { useMerchantsStore } from "~/stores/merchants";
import { useOnboardingStore } from "~/stores/onboading";

export function useAggregatorApi() {
    const { get, post } = useApi();
    const auth = useAuthStore();
    const merchant = useMerchantsStore();
    const onboard = useOnboardingStore()

    const getAggregator = async () => {
        const res = await get("/aggregator/me");
        console.log("Aggregator:", res.data.data);
        auth.setAggregator(res.data.data)
        return res
    };

    const getTransactions = async () => {
        const res = await get("/aggregator/gettransactions");
        console.log("Aggregator Transactions", res.data.data);
        auth.setAggregatorTransactions(res.data.data);
    };

    const getPaymentMethodSummary = async () => {
        const res = await get("/aggregator/payment-method-summary");
        console.log("Payment Method Summary", res.data);

        if (res.data.statusCode === "00") {
            auth.setPaymentSummary(res.data.data); // <-- save to store
        }
        return res.data;
    };

    const getTransactionStatusSummary = async () => {
        const res = await get("/aggregator/transaction/summary/today");
        console.log("Transaction Status Summary", res.data);

        if (res.data.statusCode === "00") {
            auth.setTransactionStatusSummary(res.data.data);
        }
        return res.data;
    };

    const getMerchants = async ({ page = 1, limit = 10 }) => {
        const res = await get(`/aggregator/merchants?page=${page}&limit=${limit}`);
        console.log("Aggregator Merchants:", res.data.data);

        merchant.setMerchants({
            list: res.data.data,
            active: res.data.active || 0,
            total: res.data.pagination.total,
            page: res.data.pagination.page,
            limit: res.data.pagination.limit,
            totalPages: res.data.pagination.totalPages,
        });

        return res.data;
    };

    const getMerchantById = async (id: string) => {
        try {
            const res = await get(`/aggregator/merchants/${id}`);
            console.log("Merchant Details:", res.data);
            return res.data; // return the single merchant object
        } catch (error) {
            console.error("Error fetching merchant by ID:", error);
            return null;
        }
    };

    const getTransactionsByMerchantId = async (merchantId: any, page = 1, limit = 10) => {
        try {
            const res = await get(`/aggregator/merchants/${merchantId}/transactions?page=${page}&limit=${limit}`);
            // Convert BigInt fields to string if necessary
            const data = res.data.data.map((t: any) => ({
                ...t,
                id: t.id.toString(),
                amount: t.amount.toString(),
            }));
            return {
                data,
                pagination: res.data.pagination
            };
        } catch (error) {
            console.error("Error fetching transactions:", error);
            return { data: [], pagination: {} };
        }
    };

    const resetPassword = async (payload: { oldPassword: string; newPassword: string }) => {
        try {
            const res = await post("/aggregator/reset-password", payload);
            console.log("Password reset response:", res);
            return res;
        } catch (e) {
            console.error("Password reset failed:", e);
            throw e;
        }
    };

    const getuserOnboarding = async (merchantId: string) => {
        try {
            const res = await get(`/aggregator/merchants/${merchantId}/getuser-onboarding`);
            console.log("Get User Onboarding Response:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error completing onboarding:", error);
            throw error;
        }
    };

    const verifyPan = async (payload: any) => {
        //console.log(payload);
        return await post("/aggregator/verify/pan", payload);
    };

    const verifyAccount = async (payload: any) => {
        //console.log(payload);
        return await post("/aggregator/verify/account", payload);
    };

    const onboading = async (payload: any) => {
        //console.log(payload);
        return await post("/aggregator/onboading", payload);
    };

    return {
        getAggregator,
        resetPassword,
        getTransactionsByMerchantId,
        getuserOnboarding,
        verifyPan,
        verifyAccount,
        onboading,
        getPaymentMethodSummary,
        getTransactionStatusSummary,
        getTransactions,
        getMerchants,
        getMerchantById
    };
}