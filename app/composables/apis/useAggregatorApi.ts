import { useApi } from "./useApi";
import { useAuthStore } from "~/stores/auth";
import { useMerchantsStore } from "~/stores/merchants";
import { useVendorStore } from "~/stores/vendors";
import { useOnboardingStore } from "~/stores/onboading";

export function useAggregatorApi() {
    const { get, post } = useApi();
    const auth = useAuthStore();
    const merchant = useMerchantsStore();
    const vendor = useVendorStore();
    const onboard = useOnboardingStore()

    const getAggregator = async () => {
        const res = await get("/aggregator/me");
        auth.setAggregator(res.data.data)
        return res
    };

    const getTransactions = async () => {
        const res = await get("/aggregator/gettransactions");
        auth.setAggregatorTransactions(res.data.data);
    };

    const getPaymentMethodSummary = async () => {
        const res = await get("/aggregator/payment-method-summary");

        if (res.data.statusCode === "00") {
            auth.setPaymentSummary(res.data.data); 
        }
        return res.data;
    };

    const getTransactionStatusSummary = async () => {
        const res = await get("/aggregator/transaction/summary/today");

        if (res.data.statusCode === "00") {
            auth.setTransactionStatusSummary(res.data.data);
        }
        return res.data;
    };

    const getMerchants = async ({ page = 1, limit = 10 }) => {
        const res = await get(`/aggregator/merchants?page=${page}&limit=${limit}`);

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

    const getPendingMerchants = async ({ page = 1, limit = 10 }) => {
        const res = await get(`/aggregator/merchants/pending?page=${page}&limit=${limit}`);

        return res.data;
    };

    const getVendors = async ({ page = 1, limit = 10 }) => {
        const res = await get(`/aggregator/vendors?page=${page}&limit=${limit}`);

        vendor.setVendors({
            list: res.data.data,
            active: res.data.active || 0,
            total: res.data.pagination.total,
            page: res.data.pagination.page,
            limit: res.data.pagination.limit,
            totalPages: res.data.pagination.totalPages,
        });

        return res.data;
    };

    const getPendingVendors = async ({ page = 1, limit = 10 }) => {
        const res = await get(`/aggregator/vendors/pending?page=${page}&limit=${limit}`);

        return res.data;
    };

    const getMerchantById = async (id: string) => {
        try {
            const res = await get(`/merchant/${id}`);
            return res.data; // return the single merchant object
        } catch (error) {
            return null;
        }
    };

    const getVendorById = async (id: string) => {
        try {
            const res = await get(`/vendor/${id}`);
            return res.data;
        } catch (error) {
            return null;
        }
    };

    const getAllAggregatorTransactions = async ({
        page = 1,
        limit = 20,
        status,
        paymentMethod,
        fromDate,
        toDate,
        merchantId,
        transactionMethod,
    }: any = {}) => {
        const query = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(status && { status }),
            ...(paymentMethod && { paymentMethod }),
            ...(fromDate && { fromDate }),
            ...(toDate && { toDate }),
            ...(merchantId && { merchantId }),
            ...(transactionMethod && { transactionMethod }),
        }).toString();


        const res = await get(`/aggregator/transaction/aggregator/all?${query}`);

        if (res.data.statusCode === "00") {
            return {
                data: res.data.data,
                meta: res.data.meta,
            };
        }

        return { data: [], meta: {} };
    };


    const resetPassword = async (payload: { oldPassword: string; newPassword: string }) => {
        try {
            const res = await post("/aggregator/reset-password", payload);
            return res;
        } catch (e) {
            throw e;
        }
    };

    const getuserOnboarding = async (merchantId: string) => {
        try {
            const res = await get(`/aggregator/merchants/${merchantId}/getuser-onboarding`);
            return res.data;
        } catch (error) {
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
        return await post("/aggregator/merchantMonitoring/onboarding", payload);
    };

    const verifyOnboarding = async (payload: any) => {
        //console.log(payload);
        return await post("/aggregator/merchant/onboarding", payload);
    };

    return {
        getAggregator,
        resetPassword,
        getuserOnboarding,
        verifyPan,
        verifyAccount,
        onboading,
        verifyOnboarding,
        getPendingMerchants,
        getPaymentMethodSummary,
        getTransactionStatusSummary,
        getAllAggregatorTransactions,
        getTransactions,
        getMerchants,
        getVendors,
        getPendingVendors,
        getMerchantById,
        getVendorById
    };
}