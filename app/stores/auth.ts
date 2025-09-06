// stores/auth.ts
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    merchant: null as null | Record<string, any>,
    user: null as null | Record<string, any>,
    mobile_number: null as number | null,
    token: null as string | null,
  }),
  actions: {
    setMerchant(payload: any) {
      this.merchant = payload;
    },
    setMobile(mobile_number: number) {
      this.mobile_number = mobile_number;
    },
    setUser(user: any, token: string) {
      this.user = user.user;
      this.merchant = user.merchant;
      this.token = token;
      localStorage.setItem("token", token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
