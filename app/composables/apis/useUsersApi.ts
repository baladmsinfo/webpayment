// src/composables/useUsersApi.ts
import { useApi } from "./useApi";
import { useAuthStore } from "~/stores/auth";
import { useCookie } from "#app";

export function useUsersApi() {
  const { get, post } = useApi();
  const auth = useAuthStore();

  const SendOtp = async (payload: { phone: string }) => {
    console.log(payload);
    return await post("/send-otp", payload);
  };

  const verifyOtp = async (payload: { phone: number; otp: string }) => {
    const is_verified = await post("/verify-otp", payload);
    console.log(is_verified);
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
      console.log("Merchant fetch response:", res.data);
      return res.data;
    } catch (e) {
      console.error("Merchant fetch failed:", e);
      throw e;
    }
  };

  const resetPassword = async (payload: { oldPassword: string; newPassword: string }) => {
    try {
      const res = await post("/merchant/reset-password", payload);
      console.log("Password reset response:", res);
      return res;
    } catch (e) {
      console.error("Password reset failed:", e);
      throw e;
    }
  };

  const fetchTerminals = async () => {
    try {
      const res = await get("/terminals");
      console.log("Terminals fetch response:", res.data);

      return res.data;
    } catch (e) {
      console.error("Terminals fetch failed:", e);
      throw e;
    }
  };

  const fetchAccount = async () => {
    try {
      const res = await get("/merchant/account-kyc");
      console.log("Terminals fetch response:", res.data);

      return res.data;
    } catch (e) {
      console.error("Account fetch failed:", e);
      throw e;
    }
  };

  const registor = async (payload: {
    name: string;
    email: string;
    mobile_no: number;
    interface: string;
  }) => {
    const is_verified = await post("/register", payload);
    console.log(is_verified);
    if (is_verified.statusCode == "00") {
      auth.setUser(is_verified.data.merchant, is_verified.data.token);
      localStorage.setItem("token", is_verified.data.token); // optional
    }
    //auth.setMobile()
    return is_verified;
  };

  const forgotPassword = async (payload: any) => {
    try {
      const res = await post("/forgotpassword", { emailOrMobileNo: payload });
      console.log("Forgot password response:", res);
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


  const login = async (payload: {
    emailOrMobile: string;
    password: string;
  }) => {
    const res = await post("/login", payload);
    console.log(res);

    if (res.data.statusCode === "00" && res.data.token) {
      // store user in Pinia or wherever you manage state
      console.log("Login successful, setting user in store");
      
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

  const getProfile = async () => {
    let merchant = await get("/merchant/me");
    auth.setMerchant(merchant.data);
    return merchant;
  };

  return { SendOtp, resetPassword, setPassword, forgotPassword, verifyOtp, fetchMerchant, fetchAccount, fetchTerminals, login, getProfile, registor };
}
