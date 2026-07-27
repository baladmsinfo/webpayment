// composables/apis/useWalletProfileApi.ts
import { useApi } from "./useApi";
import { useWalletProfilesStore } from "~/stores/walletProfiles";

export interface ApiResponse<T = any> {
  statusCode: string;
  message: string;
  data?: T;
}

export function useWalletProfileApi() {
  const { get, post, put } = useApi();
  const store = useWalletProfilesStore();

  const getWalletProfiles = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
    mstatus = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    mstatus?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
      ...(search && { search }),
      ...(status && { status }),
      ...(mstatus && { mstatus }),
    });

    const res = await get(`/aggregator/wallet-profiles?${params.toString()}`);

    store.setProfiles({
      list: res.data.data,
      total: res.data.pagination.total,
      page: res.data.pagination.page,
      limit: res.data.pagination.limit,
      totalPages: res.data.pagination.totalPages,
    });

    return res.data;
  };

  const getWalletProfileById = async (id: string) => {
    try {
      const res = await get(`/aggregator/wallet-profiles/${id}`);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  const updateWalletProfileStatus = async (
    id: string,
    payload: { status: boolean; reason?: string }
  ): Promise<ApiResponse> => {
    try {
      const res = await post(`/aggregator/wallet-profiles/${id}/status`, payload);
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update profile status";
      return { statusCode: "99", message: msg };
    }
  };

  const getWalletProfileActivity = async (id: string) => {
    try {
      const res = await get(`/aggregator/wallet-profiles/${id}/activity`);
      return res.data;
    } catch (error) {
      return null;
    }
  };

  const getWalletProfileCards = async (
    id: string,
    {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      type = "",
      network = "",
      dateFrom = "",
      dateTo = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    }: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      type?: string;
      network?: string;
      dateFrom?: string;
      dateTo?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      sortOrder,
      ...(search && { search }),
      ...(status && { status }),
      ...(type && { type }),
      ...(network && { network }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
    });

    try {
      const res = await get(`/aggregator/wallet-profiles/${id}/cards?${params.toString()}`);
      return res.data;
    } catch (err: any) {
      return { statusCode: "99", message: err?.response?.data?.message ?? "Failed to fetch cards" };
    }
  };

  const updateWalletProfileCard = async (
    id: string,
    cardId: string,
    payload: { cardHolderName?: string; maskedPan?: string; status?: string; reason?: string }
  ): Promise<ApiResponse> => {
    try {
      const res = await put(`/aggregator/wallet-profiles/${id}/cards/${cardId}`, payload);
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update card";
      return { statusCode: "99", message: msg };
    }
  };

  return {
    getWalletProfiles,
    getWalletProfileById,
    updateWalletProfileStatus,
    getWalletProfileActivity,
    getWalletProfileCards,
    updateWalletProfileCard,
  };
}
