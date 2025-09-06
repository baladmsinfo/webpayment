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
        localStorage.setItem("token", is_verified.data.token); // optional
      }
    }
    auth.setMobile(payload.phone);
    return is_verified;
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

  const login = async (payload: {
    emailOrMobile: string;
    password: string;
  }) => {
    const res = await post("/login", payload);
    //console.log(res);

    if (res.statusCode === "00" && res.token) {
      // store user in Pinia or wherever you manage state
      auth.setUser(res.user, res.token);

      // ✅ Save token in cookie
      const authToken = useCookie("authToken", {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      authToken.value = res.token;
    }

    return res;
  };

  const getProfile = async () => {
    let merchant = await get("/merchant/me");
    auth.setMerchant(merchant.data);
    return merchant;
  };

  return { SendOtp, verifyOtp, login, getProfile, registor };
}
