// composables/apis/useAggregatorApplicationCardsApi.ts
//
// Aggregator-facing equivalent of ConnectedBanking's useCardEnquiryCardsApi.ts —
// cards issued under one specific Card Apply application.
import { ref, reactive } from "vue";
import { useApi } from "./useApi";

export type CardStatus  = "ACTIVE" | "BLOCKED" | "HOTLISTED" | "EXPIRED" | "INACTIVE" | "AVAILABIL" | "PENDING";
export type CardType    = "DEBIT" | "CREDIT" | "PREPAID" | "CDM";
export type CardNetwork = "VISA" | "MASTERCARD" | "RUPAY" | "AMEX" | "DINERS";
export type IssuerBank  = "AXIS";

export interface ApplicationCardRow {
  id:               string;
  cardRefId:        string | null;
  cardHolderName:   string;
  maskedPan:        string;
  last4:            string | null;
  expiryMonth:      number;
  expiryYear:       number;
  type:             CardType;
  network:          CardNetwork;
  issuerBank:       IssuerBank;
  status:           CardStatus;
  dailyLimit:       string | null;
  availableLimit:   string | null;
  perTxnLimit:      string | null;
  internationalTxn: boolean;
  contactless:      boolean;
  pinSet:           boolean;
  pinRetry?:        number;
  kycVerified:      boolean;
  cardenquiryId:    string | null;
  customerId:       string | null;
  aggregatorId:     string | null;
  merchantId:       string | null;
  walletprofileId:  string | null;
  createdAt:        string;
  updatedAt:        string;
}

export interface ApplicationCardsMeta {
  enquiryId:     string;
  enquiryNo:     string;
  noOfCards:     number;
  enquiryStatus: string;
}

export interface ApplicationCardsPagination {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface ApplicationCardsStats {
  total:            number;
  pendingCount:     number;
  activeCount:      number;
  blockedCount:     number;
  inactiveCount:    number;
  hotlistedCount:   number;
  expiredCount:     number;
  networkBreakdown: { network: CardNetwork; count: number }[];
  typeBreakdown:    { type: CardType; count: number }[];
}

export interface FetchApplicationCardsParams {
  page?:    number;
  limit?:   number;
  search?:  string;
  status?:  CardStatus | "";
  type?:    CardType   | "";
  network?: CardNetwork | "";
  sortBy?:  string;
  sortDir?: "asc" | "desc";
}

export const useAggregatorApplicationCardsApi = () => {
  const { get } = useApi();

  const cardsList       = ref<ApplicationCardRow[]>([]);
  const cardsMeta       = ref<ApplicationCardsMeta | null>(null);
  const cardsPagination = ref<ApplicationCardsPagination>({
    total: 0, page: 1, limit: 50, totalPages: 1, hasNext: false, hasPrev: false,
  });
  const cardsLoading = ref(false);
  const cardsError   = ref<string | null>(null);

  const currentCard = ref<ApplicationCardRow | null>(null);
  const cardLoading = ref(false);
  const cardError   = ref<string | null>(null);

  const cardsStats = reactive<ApplicationCardsStats>({
    total: 0, pendingCount: 0, activeCount: 0, blockedCount: 0,
    inactiveCount: 0, hotlistedCount: 0, expiredCount: 0,
    networkBreakdown: [], typeBreakdown: [],
  });
  const statsLoading = ref(false);
  const statsError   = ref<string | null>(null);

  const fetchApplicationCards = async (
    applicationId: string,
    params: FetchApplicationCardsParams = {}
  ) => {
    cardsLoading.value = true;
    cardsError.value   = null;
    try {
      const query: Record<string, string> = {
        page:  String(params.page  ?? 1),
        limit: String(params.limit ?? 50),
      };
      if (params.search)  query.search  = params.search;
      if (params.status)  query.status  = params.status;
      if (params.type)    query.type    = params.type;
      if (params.network) query.network = params.network;
      if (params.sortBy)  query.sortBy  = params.sortBy;
      if (params.sortDir) query.sortDir = params.sortDir;

      const res = await get(`/aggregator/card-enquiries/${applicationId}/cards`, { params: query });

      if (res.data?.statusCode === "00") {
        cardsList.value       = res.data.data;
        cardsMeta.value       = res.data.meta ?? null;
        cardsPagination.value = res.data.pagination;
        return res.data;
      }
      throw new Error(res.data?.message || "Failed to fetch cards");
    } catch (err: any) {
      cardsError.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      cardsLoading.value = false;
    }
  };

  const fetchApplicationCardsStats = async (applicationId: string) => {
    statsLoading.value = true;
    statsError.value   = null;
    try {
      const res = await get(`/aggregator/card-enquiries/${applicationId}/cards/stats`);
      if (res.data?.statusCode === "00") {
        Object.assign(cardsStats, res.data.data);
        return cardsStats;
      }
      throw new Error(res.data?.message || "Failed to fetch card stats");
    } catch (err: any) {
      statsError.value = err?.response?.data?.message || err.message;
      console.error("[Aggregator.ApplicationCards Stats]", err);
    } finally {
      statsLoading.value = false;
    }
  };

  const fetchApplicationCard = async (applicationId: string, cardId: string) => {
    cardLoading.value = true;
    cardError.value   = null;
    currentCard.value = null;
    try {
      const res = await get(`/aggregator/card-enquiries/${applicationId}/cards/${cardId}`);
      if (res.data?.statusCode === "00") {
        currentCard.value = res.data.data as ApplicationCardRow;
        return currentCard.value;
      }
      throw new Error(res.data?.message || "Failed to fetch card");
    } catch (err: any) {
      cardError.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      cardLoading.value = false;
    }
  };

  const resetCards = () => {
    cardsList.value       = [];
    cardsMeta.value       = null;
    cardsPagination.value = { total: 0, page: 1, limit: 50, totalPages: 1, hasNext: false, hasPrev: false };
    cardsError.value      = null;
    currentCard.value     = null;
    cardError.value       = null;
    Object.assign(cardsStats, {
      total: 0, pendingCount: 0, activeCount: 0, blockedCount: 0,
      inactiveCount: 0, hotlistedCount: 0, expiredCount: 0,
      networkBreakdown: [], typeBreakdown: [],
    });
  };

  return {
    cardsList, cardsMeta, cardsPagination, cardsLoading, cardsError,
    currentCard, cardLoading, cardError,
    cardsStats, statsLoading, statsError,
    fetchApplicationCards, fetchApplicationCardsStats, fetchApplicationCard,
    resetCards,
  };
};
