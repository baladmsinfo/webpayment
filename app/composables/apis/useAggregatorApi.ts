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

    const updateVendorStatus = async (id: string, payload: { status: boolean; reason?: string }) => {
        try {
            const res = await post(`/aggregator/vendor/${id}/status`, payload);
            return res.data;
        } catch (err: any) {
            return err?.response?.data ?? { statusCode: "99", message: "Failed to update vendor status" };
        }
    };

    const updateVendorMstatus = async (id: string, payload: { mstatus: string; reason?: string }) => {
        try {
            const res = await post(`/aggregator/vendor/${id}/mstatus`, payload);
            return res.data;
        } catch (err: any) {
            return err?.response?.data ?? { statusCode: "99", message: "Failed to update vendor status" };
        }
    };

    const updateVendorRiskflag = async (id: string, payload: { riskflag: number; reason?: string }) => {
        try {
            const res = await post(`/aggregator/vendor/${id}/riskflag`, payload);
            return res.data;
        } catch (err: any) {
            return err?.response?.data ?? { statusCode: "99", message: "Failed to update vendor risk flag" };
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


    const getTransactionById = async (id: string) => {
        const res = await get(`/aggregator/transaction/${id}`);
        return res.data;
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

    const getDashboardAnalytics = async () => {
        try {
            const res = await get("/aggregator/dashboard/analytics");
            return res.data?.data ?? null;
        } catch (e) {
            console.error("getDashboardAnalytics error:", e);
            return null;
        }
    };

    const getReportDmtSummary = async (params: { from?: string; to?: string } = {}) => {
        const q = new URLSearchParams(params as any).toString();
        const res = await get(`/aggregator/reports/dmt-summary${q ? '?' + q : ''}`);
        return res.data;
    };

    const getReportCommissionSummary = async (params: { from?: string; to?: string } = {}) => {
        const q = new URLSearchParams(params as any).toString();
        const res = await get(`/aggregator/reports/commission-summary${q ? '?' + q : ''}`);
        return res.data;
    };

    const getReportSettlementPosition = async (params: { from?: string; to?: string } = {}) => {
        const q = new URLSearchParams(params as any).toString();
        const res = await get(`/aggregator/reports/settlement-position${q ? '?' + q : ''}`);
        return res.data;
    };

    const getReportNsdlEmdMovement = async (params: { from?: string; to?: string; page?: number; limit?: number } = {}) => {
        const q = new URLSearchParams(Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))).toString();
        const res = await get(`/aggregator/reports/nsdl-emd-movement${q ? '?' + q : ''}`);
        return res.data;
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
        getVendorById,
        updateVendorStatus,
        updateVendorMstatus,
        updateVendorRiskflag,
        getTransactionById,
        getDashboardAnalytics,
        getReportDmtSummary,
        getReportCommissionSummary,
        getReportSettlementPosition,
        getReportNsdlEmdMovement,
    };
}