// composables/apis/useAggregatorCardApplicationApi.ts
//
// Aggregator-facing equivalent of ConnectedBanking's useCardEnquiryApi.ts —
// lets the aggregator apply for cards ("Card Apply") and list/track their
// applications, hitting /aggregator/card-enquiries instead of /wallet-service/card-enquiries.
import { ref, reactive } from "vue";
import { useApi } from "./useApi";

export type ApplicationStatus        = "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED";
export type ApplicationPaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";
export type FulfillmentStatus        = "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "FAILED";

export interface DeliveryAddress {
  official_address: string;
  address1:         string;
  address2:         string;
  address3:         string;
  mobile_number:    string;
  city:             string;
  state:            string;
  pincode:          number | string;
  id?: string;
}

export interface CardApplicationRow {
  id:                string;
  enquiryNo:         string;
  aggregatorId:      string;
  noOfCards:         number;
  paymentStatus:     ApplicationPaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber:    string | null;
  dispatchedAt:      string | null;
  deliveredAt:       string | null;
  status:            ApplicationStatus;
  remarks:           string | null;
  addressId:         string | null;
  address:           DeliveryAddress | null;
  createdAt:         string;
  updatedAt:         string;
}

export interface ApplicationStats {
  totalEnquiries:     number;
  submittedCount:     number;
  approvedCount:      number;
  rejectedCount:      number;
  unpaidCount:        number;
  paidCount:          number;
  pendingFulfillment: number;
  deliveredCount:     number;
  totalCardsOrdered:  number;
  totalRevenue:       number;
}

export interface ApplicationPagination {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface FetchApplicationsParams {
  page?:              number;
  limit?:             number;
  search?:            string;
  status?:            ApplicationStatus | "";
  paymentStatus?:     ApplicationPaymentStatus | "";
  fulfillmentStatus?: FulfillmentStatus | "";
  sortBy?:            string;
  sortDir?:           "asc" | "desc";
}

export interface NewAddressPayload {
  official_address: string;
  address1:         string;
  address2:         string;
  address3?:        string;
  mobile_number:    string;
  city:             string;
  state:            string;
  pincode:          number | string;
}

export interface CreateApplicationPayload {
  noOfCards:   number;
  remarks?:    string;
  addressId?:  string;
  newAddress?: NewAddressPayload;
}

export interface CardCharges {
  issuanceFee:  number;
  chargeType:   "FIXED" | "PERCENTAGE" | "HYBRID";
  appliesOn:    string;
  configId:     string;
  componentId:  string;
  currency:     string;
  isDefault:    boolean;
}

export const useAggregatorCardApplicationApi = () => {
  const { get, post, put } = useApi();

  const applicationList       = ref<CardApplicationRow[]>([]);
  const applicationPagination = ref<ApplicationPagination>({
    total: 0, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false,
  });
  const applicationLoading = ref(false);
  const applicationError   = ref<string | null>(null);

  const currentApplication = ref<CardApplicationRow | null>(null);
  const detailLoading      = ref(false);
  const detailError        = ref<string | null>(null);

  const applicationStats = reactive<ApplicationStats>({
    totalEnquiries: 0, submittedCount: 0, approvedCount: 0, rejectedCount: 0,
    unpaidCount: 0, paidCount: 0, pendingFulfillment: 0, deliveredCount: 0,
    totalCardsOrdered: 0, totalRevenue: 0,
  });
  const statsLoading = ref(false);

  const profileAddress = ref<DeliveryAddress | null>(null);
  const addressLoading = ref(false);

  const cardCharges        = ref<CardCharges | null>(null);
  const cardChargesLoading = ref(false);
  const cardChargesError   = ref<string | null>(null);

  const fetchProfileAddress = async () => {
    addressLoading.value = true;
    try {
      const res = await get("/aggregator/card-enquiries/profile-address");
      if (res.data?.statusCode === "00") {
        profileAddress.value = res.data.data?.address ?? null;
        return profileAddress.value;
      }
    } catch (err) {
      console.error("[Aggregator.ProfileAddress]", err);
    } finally {
      addressLoading.value = false;
    }
  };

  const fetchCardCharges = async (): Promise<CardCharges | null> => {
    cardChargesLoading.value = true;
    cardChargesError.value   = null;
    try {
      const res = await get("/aggregator/card-enquiries/charges");
      if (res.data?.statusCode === "00") {
        cardCharges.value = res.data.data as CardCharges;
        return cardCharges.value;
      }
      throw new Error(res.data?.message || "Failed to fetch card charges");
    } catch (err: any) {
      cardChargesError.value = err?.response?.data?.message || err.message;
      cardCharges.value      = null;
      return null;
    } finally {
      cardChargesLoading.value = false;
    }
  };

  const fetchApplications = async (params: FetchApplicationsParams = {}) => {
    applicationLoading.value = true;
    applicationError.value   = null;
    try {
      const query: Record<string, string> = {
        page:  String(params.page  ?? 1),
        limit: String(params.limit ?? 10),
      };
      if (params.search)            query.search            = params.search;
      if (params.status)            query.status            = params.status;
      if (params.paymentStatus)     query.paymentStatus     = params.paymentStatus;
      if (params.fulfillmentStatus) query.fulfillmentStatus = params.fulfillmentStatus;
      if (params.sortBy)            query.sortBy            = params.sortBy;
      if (params.sortDir)           query.sortDir           = params.sortDir;

      const res = await get("/aggregator/card-enquiries", { params: query });

      if (res.data?.statusCode === "00") {
        applicationList.value       = res.data.data;
        applicationPagination.value = res.data.pagination;
        return res.data;
      }
      throw new Error(res.data?.message || "Failed to fetch applications");
    } catch (err: any) {
      applicationError.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      applicationLoading.value = false;
    }
  };

  const fetchApplication = async (applicationId: string) => {
    detailLoading.value      = true;
    detailError.value        = null;
    currentApplication.value = null;
    try {
      const res = await get(`/aggregator/card-enquiries/${applicationId}`);
      if (res.data?.statusCode === "00") {
        currentApplication.value = res.data.data;
        return res.data.data as CardApplicationRow;
      }
      throw new Error(res.data?.message || "Failed to fetch application");
    } catch (err: any) {
      detailError.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      detailLoading.value = false;
    }
  };

  const fetchApplicationStats = async () => {
    statsLoading.value = true;
    try {
      const res = await get("/aggregator/card-enquiries/stats");
      if (res.data?.statusCode === "00") {
        Object.assign(applicationStats, res.data.data);
        return applicationStats;
      }
      throw new Error(res.data?.message || "Failed to fetch stats");
    } catch (err: any) {
      console.error("[Aggregator.CardApplication Stats]", err);
    } finally {
      statsLoading.value = false;
    }
  };

  // Backend creates + submits the application (status = SUBMITTED) atomically.
  const createApplication = async (payload: CreateApplicationPayload) => {
    try {
      const res = await post("/aggregator/card-enquiries", payload);
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message);
    }
  };

  const updateApplication = async (applicationId: string, payload: Partial<CardApplicationRow>) => {
    try {
      const res = await put(`/aggregator/card-enquiries/${applicationId}`, payload);
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message);
    }
  };

  return {
    applicationList, applicationPagination, applicationLoading, applicationError,
    currentApplication, detailLoading, detailError,
    applicationStats, statsLoading,
    profileAddress, addressLoading,
    cardCharges, cardChargesLoading, cardChargesError,
    fetchApplications, fetchApplication, fetchApplicationStats,
    fetchProfileAddress, fetchCardCharges,
    createApplication, updateApplication,
  };
};
