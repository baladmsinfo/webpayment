// stores/walletProfiles.ts
export const useWalletProfilesStore = defineStore("walletProfiles", {
  state: () => ({
    list: [] as Array<Record<string, any>>,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  }),

  actions: {
    setProfiles(data: { list: any; total: number; page: number; limit: number; totalPages: number }) {
      this.list = data.list || [];
      this.total = data.total || 0;
      this.page = data.page || 1;
      this.limit = data.limit || 10;
      this.totalPages = data.totalPages || 0;
    },
  },
});
