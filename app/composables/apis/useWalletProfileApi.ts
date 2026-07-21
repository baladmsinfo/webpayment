// composables/apis/useWalletProfileApi.ts
import { useApi } from "./useApi";
import { useWalletProfilesStore } from "~/stores/walletProfiles";

export interface ApiResponse<T = any> {
  statusCode: string;
  message: string;
  data?: T;
}

export function useWalletProfileApi() {
  const { get, post } = useApi();
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

  return {
    getWalletProfiles,
    getWalletProfileById,
    updateWalletProfileStatus,
    getWalletProfileActivity,
  };
}
