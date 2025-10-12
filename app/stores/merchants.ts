// stores/merchants.ts
export const useMerchantsStore = defineStore("merchants", {
  state: () => ({
    list: [] as Array<Record<string, any>>,
    kycPending: [] as Array<Record<string, any>>,
    active: 0,
    total: 0,
    totalKycPending: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    kycPendingPage: 1,
    kycPendingLimit: 10,
    kycPendingTotalPages: 0,
  }),

  actions: {
    setMerchants(data: { list: any; active: number; total: number; page: number; limit: number; totalPages: number }) {
      this.list = data.list || [];
      this.active = data.active || 0;
      this.total = data.total || 0;
      this.page = data.page || 1;
      this.limit = data.limit || 10;
      this.totalPages = data.totalPages || 0;
    },

    setKycPending(data: { list: any; total: number; page: number; limit: number; totalPages: number }) {
      this.kycPending = data.list || [];
      this.totalKycPending = data.total || 0;
      this.kycPendingPage = data.page || 1;
      this.kycPendingLimit = data.limit || 10;
      this.kycPendingTotalPages = data.totalPages || 0;
    },
  },
});