export const useAuthStore = defineStore("auth", {
  state: () => ({
    merchant: null as Record<string, any> | null,
    aggregator: null as Record<string, any> | null,
    user: null as Record<string, any> | null,
    mobile_number: null as number | null,
    token: null as string | null,

    merchants: {
      active: 0,
      total: 0,
    },
    summary: {
      today: { count: 0, totalAmount: 0 },
      week: { count: 0, totalAmount: 0 },
      month: { count: 0, totalAmount: 0 },
      year: { count: 0, totalAmount: 0 },
    },
    topMerchants: {
      week: [] as Array<Record<string, any>>,
      month: [] as Array<Record<string, any>>,
      year: [] as Array<Record<string, any>>,
    },
    paymentSummary: {} as Record<string, { amount: number }>,
    transactionStatusSummary: {} as Record<string, { count: number }>,
  }),
  actions: {
    setAggregatorTransactions(data: any) {
      this.merchants = data.merchants;
      this.summary = data.summary;
      this.topMerchants = data.topMerchants;
    },
    setPaymentSummary(data: Record<string, { amount: number }>) {
      this.paymentSummary = data;
    },
    setMerchant(payload: any) {
      this.merchant = payload;
    },
    setAggregator(payload: any) {
      this.aggregator = payload;
    },
    setMobile(mobile_number: number) {
      this.mobile_number = mobile_number;
    },
    setTransactionStatusSummary(data: Array<{
      responceCode: string;
      reason: string;
      status: string;
      count: number;
      amount: number;
    }>) {
      this.transactionStatusSummary = data.reduce((acc, t) => {
        acc[t.responceCode] = t;
        return acc;
      }, {} as Record<string, any>);
    },
    setUser(user: any, token: string) {
      if (user.role === "merchant") {
        this.user = user;
        this.merchant = user.merchant;
      } else if (user.role === "aggregator") {
        this.user = user;
        this.aggregator = user.aggregator;
      }

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