// src/composables/useUsersApi.ts
import { useApi } from "./useApi";
import { useAuthStore } from "~/stores/auth";
import { useCookie } from "#app";

export function useUsersApi() {
  const { get, post } = useApi();
  const auth = useAuthStore();

  const SendOtp = async (payload: { phone: string }) => {
    return await post("/send-otp", payload);
  };

  const verifyOtp = async (payload: { phone: number; otp: string }) => {
    const is_verified = await post("/verify-otp", payload);
    if (is_verified.statusCode == "00") {
      if (is_verified.data.token != null) {
        auth.setUser(is_verified.data, is_verified.data.token);
        localStorage.setItem("token", is_verified.data.token);
      }
    }
    auth.setMobile(payload.phone);
    return is_verified;
  };

  const fetchMerchant = async () => {
    try {
      const res = await get("/merchant/me");
      return res.data;
    } catch (e) {
      console.error("Merchant fetch failed:", e);
      throw e;
    }
  };

  const resetPassword = async (payload: { oldPassword: string; newPassword: string }) => {
    try {
      const res = await post("/merchant/reset-password", payload);
      return res;
    } catch (e) {
      console.error("Password reset failed:", e);
      throw e;
    }
  };

  const fetchTerminals = async () => {
    try {
      const res = await get("/terminals");

      return res.data;
    } catch (e) {
      console.error("Terminals fetch failed:", e);
      throw e;
    }
  };

  const fetchAccount = async () => {
    try {
      const res = await get("/merchant/account-kyc");

      return res.data;
    } catch (e) {
      console.error("Account fetch failed:", e);
      throw e;
    }
  };

  const registor = async (payload) => {
    const res = await post("/register", payload);

    if (res.statusCode === "00") {
      const data = res.data;

      // if (data.user) {
      //   // If backend returns user object with role
      //   auth.setUser(data.user, data.token);
      // } else if (data.aggregator) {
      //   // If backend sends aggregator directly
      //   auth.setUser({ role: "aggregator", aggregator: data.aggregator }, data.token);
      // } else if (data.merchant) {
      //   // If backend sends merchant directly
      //   auth.setUser({ role: "merchant", merchant: data.merchant }, data.token);
      // }
    }

    return res.data;
  };

  const forgotPassword = async (payload: any) => {
    try {
      const res = await post("/forgotpassword", { emailOrMobileNo: payload });
      return res;
    } catch (e) {
      console.error("Forgot password failed:", e);
      throw e;
    }
  };

  const setPassword = async (payload: any) => {
    try {
      const res = await post("/setpassword", payload);
      return res;
    } catch (e) {
      console.error("Set password failed:", e);
      throw e;
    }
  };

  const loginAdmin = async (payload: {
    emailOrMobile: string;
    password: string;
  }) => {
    const res = await post("/login", payload);

    if (res.data.statusCode === "00" && res.data.token) {
      // store user in Pinia or wherever you manage state

      auth.setUser(res.data.user, res.data.token);

      // ✅ Save token in cookie
      const authToken = useCookie("authToken", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      authToken.value = res.data.token;
    }

    return res;
  };

  const login = async (payload: {
    emailOrMobile: string;
    password: string;
  }, role: any) => {
    const res = await post("/login", payload);

    console.log("Res after login:", res);
    

    const userRole = res?.data?.user?.role;

    if (res.data.statusCode === "00" && res.data.token) {

      if (role.includes(userRole)) {
        auth.setUser(res.data.user, res.data.token);

        // Save token in cookie
        const authToken = useCookie("authToken", {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        authToken.value = res.data.token;
      }

      // if (role.includes(userRole)) {
      //   throw new Error("Unauthorized role");
      // }

      // auth.setUser(res.data.user, res.data.token);

      // // ✅ Save token in cookie
      // const authToken = useCookie("authToken", {
      //   maxAge: 60 * 60 * 24 * 7, // 7 days
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "lax",
      // });
      // authToken.value = res.data.token;
    }

    return res;
  };

  const changeDefaultPassword = async (payload: { newPassword: string }) => {
    try {
      const res = await post("/change-default-password", payload);
      return res;
    } catch (e) {
      console.error("Change default password failed:", e);
      throw e;
    }
  };

  // const addMerchant = async (payload) => {
  //   try {
  //     const res = await post("/add-merchant", payload)


  //     return res.data
  //   } catch (err) {

  //     return err.response.data
  //   }
  // }

  const addVendor = async (payload) => {
    try {
      const res = await post("/add-vendor", payload)


      return res.data
    } catch (err) {

      return err.response.data
    }
  }

  const fetchVendor = async (payload) => {
    try {
      const res = await get("/fetch-vendor", {
        params: payload,
      })

      return res.data
    } catch (err) {
      console.error("Fetch vendor API Error:", err?.response?.data || err)
      return err?.response?.data
    }
  }

  const getProfile = async () => {
    let merchant = await get("/merchant/me");
    auth.setMerchant(merchant.data);
    return merchant;
  };

  const getAllMerchantTransactions = async ({
    page = 1,
    limit = 20,
    status,
    paymentMethod,
    fromDate,
    toDate,
    transactionMethod,
  }: any = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(status            && { status }),
      ...(paymentMethod     && { paymentMethod }),
      ...(fromDate          && { fromDate }),
      ...(toDate            && { toDate }),
      ...(transactionMethod && { transactionMethod }),
    }).toString();

    const res = await get(`/merchant/transaction/all?${query}`);

    if (res.data.statusCode === "00") {
      return {
        data: res.data.data,
        meta: res.data.meta,
      };
    }

    return { data: [], meta: {} };
  };

  const getWalletMe = async () => {
    let wallet_user = await get("/wallet-service/me");
    auth.setWalletProfile(wallet_user.data);
    return wallet_user;
  };

  const getAggregator = async () => {
    let aggregator = await get("/aggregator/me");

    if (aggregator.data.data.statusCode !== "00") {
      return aggregator.data.data;
    }
  };

  const getRole = async () => {
    try {
      const res = await get("/role");

      if (res.data?.statusCode === "00") {
        return res.data.data;
      }

      return null;
    } catch (e) {
      console.error("Role fetch failed:", e);
      return null;
    }
  };

  const getTransactionsByMerchantId = async (merchantId: any, page = 1, limit = 10) => {
    try {
      const res = await get(`/admin/merchants/${merchantId}/transactions?page=${page}&limit=${limit}`);
      
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

  const getMerchantTransactionById = async (id: string) => {
    const res = await get(`/merchant/transaction/${id}`);
    return res.data;
  };

  const getAllTransactionsUnderVendor = async (vendorId: any, page = 1, limit = 10) => {
    try {
      const res = await get(`/admin/vendor/${vendorId}/transactions?page=${page}&limit=${limit}`);
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

  return { SendOtp, getRole, changeDefaultPassword, getWalletMe, getAllMerchantTransactions, getMerchantTransactionById, getAllTransactionsUnderVendor, addVendor, fetchVendor, getTransactionsByMerchantId, resetPassword, loginAdmin, setPassword, forgotPassword, verifyOtp, getAggregator, fetchMerchant, fetchAccount, fetchTerminals, login, getProfile, registor };
}
