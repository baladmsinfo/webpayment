// composables/apis/useCardEnquiryApi.ts
import { ref, reactive } from "vue";
import { useApi } from "~/composables/apis/useApi";

// ── Types ──────────────────────────────────────────────────────────────────
export type EnquiryStatus        = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED";
export type EnquiryPaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";
export type FulfillmentStatus    = "PENDING" | "PROCESSING" | "DISPATCHED" | "DELIVERED" | "FAILED";

export interface DeliveryAddress {
  // Core delivery fields drawn from the Address model
  official_address: string;
  address1:         string;
  address2:         string;
  address3:         string;
  mobile_number:    string;
  city:             string;
  state:            string;
  pincode:          number | string;
  // Optional extras
  id?: string;
}

export interface CardEnquiryRow {
  id:                string;
  enquiryNo:         string;
  walletprofileId:   string;
  noOfCards:         number;
  paymentStatus:     EnquiryPaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber:    string | null;
  dispatchedAt:      string | null;
  deliveredAt:       string | null;
  status:            EnquiryStatus;
  remarks:           string | null;
  addressId:         string | null;
  address:           DeliveryAddress | null;
  createdAt:         string;
  updatedAt:         string;
}

export interface CardEnquiryStats {
  totalEnquiries:     number;
  draftCount:         number;
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

export interface EnquiryPagination {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNext:    boolean;
  hasPrev:    boolean;
}

export interface FetchEnquiryParams {
  page?:              number;
  limit?:             number;
  search?:            string;
  status?:            EnquiryStatus | "";
  paymentStatus?:     EnquiryPaymentStatus | "";
  fulfillmentStatus?: FulfillmentStatus | "";
  sortBy?:            string;
  sortDir?:           "asc" | "desc";
}

export interface CreateEnquiryPayload {
  noOfCards:  number;
  remarks?:   string;
  // Address: either confirm existing (pass addressId) or supply a new one
  addressId?:       string;
  newAddress?:      NewAddressPayload;
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

// ── Composable ─────────────────────────────────────────────────────────────
export const useCardEnquiryApi = () => {
  const { get, post, put, del } = useApi();

  // ── List state ──
  const enquiryList       = ref<CardEnquiryRow[]>([]);
  const enquiryPagination = ref<EnquiryPagination>({
    total: 0, page: 1, limit: 10,
    totalPages: 1, hasNext: false, hasPrev: false,
  });
  const enquiryLoading = ref(false);
  const enquiryError   = ref<string | null>(null);

  // ── Single enquiry state ──
  const currentEnquiry = ref<CardEnquiryRow | null>(null);
  const detailLoading  = ref(false);
  const detailError    = ref<string | null>(null);

  // ── Stats state ──
  const enquiryStats = reactive<CardEnquiryStats>({
    totalEnquiries: 0, draftCount: 0, submittedCount: 0,
    approvedCount: 0, rejectedCount: 0, unpaidCount: 0, paidCount: 0,
    pendingFulfillment: 0, deliveredCount: 0,
    totalCardsOrdered: 0, totalRevenue: 0,
  });
  const statsLoading = ref(false);

  // ── Wallet profile official address ──
  const profileAddress    = ref<DeliveryAddress | null>(null);
  const addressLoading    = ref(false);

  // ── Fetch profile's official address ──────────────────────────────────────
  const fetchProfileAddress = async () => {
    addressLoading.value = true;
    try {
      const res = await get("/wallet-service/profile");
      if (res.data?.statusCode === "00") {
        profileAddress.value = res.data.data?.address ?? null;
        return profileAddress.value;
      }
    } catch (err) {
      console.error("[ProfileAddress]", err);
    } finally {
      addressLoading.value = false;
    }
  };

  // ── Fetch Enquiries (paginated) ────────────────────────────────────────────
  const fetchEnquiries = async (params: FetchEnquiryParams = {}) => {
    enquiryLoading.value = true;
    enquiryError.value   = null;
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

      const res = await get("/wallet-service/card-enquiries", { params: query });

      if (res.data?.statusCode === "00") {
        enquiryList.value       = res.data.data;
        enquiryPagination.value = res.data.pagination;
        return res.data;
      }
      throw new Error(res.data?.message || "Failed to fetch enquiries");
    } catch (err: any) {
      enquiryError.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      enquiryLoading.value = false;
    }
  };

  // ── Fetch Single Enquiry ───────────────────────────────────────────────────
  const fetchEnquiry = async (enquiryId: string) => {
    detailLoading.value  = true;
    detailError.value    = null;
    currentEnquiry.value = null;
    try {
      const res = await get(`/wallet-service/card-enquiries/${enquiryId}`);
      if (res.data?.statusCode === "00") {
        currentEnquiry.value = res.data.data;
        return res.data.data as CardEnquiryRow;
      }
      throw new Error(res.data?.message || "Failed to fetch enquiry");
    } catch (err: any) {
      detailError.value = err?.response?.data?.message || err.message;
      throw err;
    } finally {
      detailLoading.value = false;
    }
  };

  // ── Fetch Stats ────────────────────────────────────────────────────────────
  const fetchEnquiryStats = async () => {
    statsLoading.value = true;
    try {
      const res = await get("/wallet-service/card-enquiries/stats");
      if (res.data?.statusCode === "00") {
        Object.assign(enquiryStats, res.data.data);
        return enquiryStats;
      }
      throw new Error(res.data?.message || "Failed to fetch stats");
    } catch (err: any) {
      console.error("[CardEnquiry Stats]", err);
    } finally {
      statsLoading.value = false;
    }
  };

  // ── Create Enquiry ─────────────────────────────────────────────────────────
  const createEnquiry = async (payload: CreateEnquiryPayload) => {
    try {
      const res = await post("/wallet-service/card-enquiries", payload);
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message);
    }
  };

  // ── Update Enquiry ─────────────────────────────────────────────────────────
  const updateEnquiry = async (enquiryId: string, payload: Partial<CardEnquiryRow>) => {
    try {
      const res = await put(`/wallet-service/card-enquiries/${enquiryId}`, payload);
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message);
    }
  };

  // ── Submit Enquiry ─────────────────────────────────────────────────────────
  const submitEnquiry = async (enquiryId: string) => {
    try {
      const res = await post(`/wallet-service/card-enquiries/${enquiryId}/submit`, {});
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message);
    }
  };

  // ── Cancel Enquiry ─────────────────────────────────────────────────────────
  const cancelEnquiry = async (enquiryId: string, reason?: string) => {
    try {
      const res = await post(`/wallet-service/card-enquiries/${enquiryId}/cancel`, { reason });
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message);
    }
  };

  // ── Delete Enquiry ─────────────────────────────────────────────────────────
  const deleteEnquiry = async (enquiryId: string) => {
    try {
      const res = await del(`/wallet-service/card-enquiries/${enquiryId}`);
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message);
    }
  };

  return {
    // state
    enquiryList, enquiryPagination, enquiryLoading, enquiryError,
    currentEnquiry, detailLoading, detailError,
    enquiryStats, statsLoading,
    profileAddress, addressLoading,
    // actions
    fetchEnquiries, fetchEnquiry, fetchEnquiryStats,
    fetchProfileAddress,
    createEnquiry, updateEnquiry, submitEnquiry, cancelEnquiry, deleteEnquiry,
  };
};