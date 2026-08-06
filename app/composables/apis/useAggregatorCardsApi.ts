// composables/apis/useAggregatorCardsApi.ts
//
// Aggregator's own card pool ("Cards" tab under Settings > Cards). Every card ever
// issued under the aggregator, searchable/filterable, with status/detail update and
// linking a pooled card to one of the aggregator's Merchants or WalletProfiles.
import { useApi } from "./useApi";

export interface ApiResponse<T = any> {
  statusCode: string;
  message: string;
  data?: T;
}

export interface LinkOption {
  id: string;
  legal_name?: string;
  dba_name?: string;
  mid?: string;
  name?: string;
  code?: string;
}

export function useAggregatorCardsApi() {
  const { get, put, post } = useApi();

  const getCards = async (
    {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      type = "",
      network = "",
      dateFrom = "",
      dateTo = "",
      linked = "",
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
      linked?: string;
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
      ...(linked && { linked }),
    });

    try {
      const res = await get(`/aggregator/cards?${params.toString()}`);
      return res.data;
    } catch (err: any) {
      return { statusCode: "99", message: err?.response?.data?.message ?? "Failed to fetch cards" };
    }
  };

  const getLinkOptions = async (): Promise<ApiResponse<{ merchants: LinkOption[]; walletProfiles: LinkOption[] }>> => {
    try {
      const res = await get("/aggregator/cards/link-options");
      return res.data;
    } catch (err: any) {
      return { statusCode: "99", message: err?.response?.data?.message ?? "Failed to fetch link options" };
    }
  };

  const updateCard = async (
    cardId: string,
    payload: { cardHolderName?: string; maskedPan?: string; status?: string; reason?: string }
  ): Promise<ApiResponse> => {
    try {
      const res = await put(`/aggregator/cards/${cardId}`, payload);
      return res.data;
    } catch (err: any) {
      return { statusCode: "99", message: err?.response?.data?.message ?? "Failed to update card" };
    }
  };

  const linkCard = async (
    cardId: string,
    payload: { targetType: "MERCHANT" | "WALLET_PROFILE"; targetId: string; reason?: string }
  ): Promise<ApiResponse> => {
    try {
      const res = await post(`/aggregator/cards/${cardId}/link`, payload);
      return res.data;
    } catch (err: any) {
      return { statusCode: "99", message: err?.response?.data?.message ?? "Failed to link card" };
    }
  };

  const unlinkCard = async (cardId: string, reason?: string): Promise<ApiResponse> => {
    try {
      const res = await post(`/aggregator/cards/${cardId}/unlink`, { reason });
      return res.data;
    } catch (err: any) {
      return { statusCode: "99", message: err?.response?.data?.message ?? "Failed to unlink card" };
    }
  };

  return {
    getCards,
    getLinkOptions,
    updateCard,
    linkCard,
    unlinkCard,
  };
}
