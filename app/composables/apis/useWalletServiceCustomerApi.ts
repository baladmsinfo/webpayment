// src/composables/apis/useWalletServiceCustomerApi.ts
import { useApi } from "./useApi";
import { ref } from "vue";


export interface CustomerCard {
  id:               string;
  cardHolderName:   string;
  maskedPan:        string;
  last4:            string | null;
  expiryMonth:      number;
  expiryYear:       number;
  type:             "DEBIT" | "CREDIT" | "PREPAID" | "CDM";
  network:          "VISA" | "MASTERCARD" | "RUPAY" | "AMEX" | "DINERS";
  status:           "ACTIVE" | "BLOCKED" | "HOTLISTED" | "EXPIRED" | "INACTIVE" | "AVAILABIL";
  issuerBank:       string;
  dailyLimit:       string | null;
  availableLimit:   string | null;
  perTxnLimit:      string | null;
  internationalTxn: boolean;
  contactless:      boolean;
  pinSet:           boolean;
  kycVerified:      boolean;
  createdAt:        string;
}

export interface CustomerBeneficiary {
  id:                  string;
  account_holder_name: string;
  bank_name:           string;
  verified:            boolean;
}

export interface Customer {
  id:              string;
  name:            string;
  phone:           string;
  email:           string | null;
  vpa:             string | null;
  address1:        string | null;
  address2:        string | null;
  pincode:         string | null;
  city:            string | null;
  state:           string | null;
  dob:             string | null;
  type:            string;
  remitter:        boolean;
  AviableLimit:    number | null;
  AviabledayLimit: number | null;
  TransactionDone: number | null;
  cards:           CustomerCard[];
  beneficiary:     CustomerBeneficiary[];
  createdAt:       string;
  updatedAt:       string;
}

export interface CustomerPagination {
  page:       number;
  limit:      number;
  total:      number;
  totalPages: number;
  hasPrev:    boolean;
  hasNext:    boolean;
}

export interface CustomerStats {
  totalCustomers: number;
  totalCards:     number;
  activeCards:    number;
  blockedCards:   number;
}

export interface CreateCustomerPayload {
  name:      string;
  phone:     string;
  email?:    string;
  vpa?:      string;
  address1?: string;
  address2?: string;
  pincode?:  string;
  city?:     string;
  state?:    string;
  dob?:      string;
}

export interface UpdateCustomerPayload {
  name?:     string;
  email?:    string;
  vpa?:      string;
  address1?: string;
  address2?: string;
  pincode?:  string;
  city?:     string;
  state?:    string;
  dob?:      string;
}

export interface AddCardPayload {
  cardHolderName:    string;
  maskedPan:         string;
  panToken?:         string;
  last4?:            string;
  expiryMonth:       number;
  expiryYear:        number;
  type:              string;
  network:           string;
  issuerBank?:       string;
  dailyLimit?:       number;
  availableLimit?:   number;
  perTxnLimit?:      number;
  internationalTxn?: boolean;
  contactless?:      boolean;
}

export interface CustomerListParams {
  page?:    number;
  limit?:   number;
  search?:  string;
  city?:    string;
  state?:   string;
  sortBy?:  string;
  sortDir?: "asc" | "desc";
}

export interface AvailableCardsParams {
  search?:  string;
  type?:    string;
  network?: string;
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useWalletServiceCustomerApi() {
  const { get, post, put, del } = useApi();

  const BASE = "/wallet-service/customers";

  // ── Reactive state ─────────────────────────────────────────────────────────

  const customerList       = ref<Customer[]>([]);
  const customerPagination = ref<CustomerPagination>({
    page: 1, limit: 10, total: 0, totalPages: 0, hasPrev: false, hasNext: false,
  });
  const customerStats    = ref<CustomerStats>({ totalCustomers: 0, totalCards: 0, activeCards: 0, blockedCards: 0 });
  const customerLoading  = ref(false);
  const customerError    = ref<string | null>(null);
  const statsLoading     = ref(false);

  // Available cards state (used by the link-card picker)
  const availableCards        = ref<CustomerCard[]>([]);
  const availableCardsLoading = ref(false);

  // ── CREATE customer ────────────────────────────────────────────────────────
  const wsCreateCustomer = async (payload: CreateCustomerPayload) => {
    try {
      const res = await post(BASE, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── LIST customers ─────────────────────────────────────────────────────────
  const wsFetchCustomers = async (params: CustomerListParams = {}) => {
    customerLoading.value = true;
    customerError.value   = null;

    try {
      const res  = await get(BASE, { params });
      const body = res.data;

      if (body.statusCode === "00") {
        customerList.value       = body.data ?? [];
        customerPagination.value = body.pagination ?? customerPagination.value;
      } else {
        customerError.value = body.message ?? "Failed to load customers";
      }

      return body;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Network error";
      customerError.value = msg;
      return { statusCode: "01", message: msg };
    } finally {
      customerLoading.value = false;
    }
  };

  // ── GET single customer ────────────────────────────────────────────────────
  const wsGetCustomer = async (customerId: string) => {
    try {
      const res = await get(`${BASE}/${customerId}`);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── UPDATE customer ────────────────────────────────────────────────────────
  const wsUpdateCustomer = async (customerId: string, payload: UpdateCustomerPayload) => {
    try {
      const res = await put(`${BASE}/${customerId}`, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── DELETE customer ────────────────────────────────────────────────────────
  const wsDeleteCustomer = async (customerId: string) => {
    try {
      const res = await del(`${BASE}/${customerId}`);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── GET customer cards ─────────────────────────────────────────────────────
  const wsGetCustomerCards = async (
    customerId: string,
    filters?: { status?: string; type?: string; network?: string }
  ) => {
    try {
      const res = await get(`${BASE}/${customerId}/cards`, { params: filters });
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── ADD card (create new) ──────────────────────────────────────────────────
  const wsAddCard = async (customerId: string, payload: AddCardPayload) => {
    try {
      const res = await post(`${BASE}/${customerId}/cards`, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── UPDATE card status ─────────────────────────────────────────────────────
  const wsUpdateCardStatus = async (
    customerId: string,
    cardId:     string,
    status:     "ACTIVE" | "BLOCKED" | "HOTLISTED" | "INACTIVE"
  ) => {
    try {
      const res = await put(`${BASE}/${customerId}/cards/${cardId}/status`, { status });
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };


  const wsFetchAvailableCards = async (params: AvailableCardsParams = {}) => {
    availableCardsLoading.value = true;
    try {
      const res  = await get(`${BASE}/available-cards`, { params });
      const body = res.data;

      if (body.statusCode === "00") {
        availableCards.value = body.data ?? [];
      }
      return body;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    } finally {
      availableCardsLoading.value = false;
    }
  };

  // ── LINK an existing available card to a customer ──────────────────────────

  const wsLinkCard = async (customerId: string, cardId: string) => {
    try {
      const res = await post(`${BASE}/${customerId}/link-card/${cardId}`, {});
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── UNLINK a card from a customer ──────────────────────────────────────────

  const wsUnlinkCard = async (customerId: string, cardId: string) => {
    try {
      const res = await del(`${BASE}/${customerId}/unlink-card/${cardId}`);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  // ── STATS ──────────────────────────────────────────────────────────────────
  const wsFetchCustomerStats = async () => {
    statsLoading.value = true;
    try {
      const res  = await get(`${BASE}/stats`);
      const body = res.data;
      if (body.statusCode === "00") {
        customerStats.value = body.data;
      }
      return body;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    } finally {
      statsLoading.value = false;
    }
  };

  return {
    // ── State ──
    customerList,
    customerPagination,
    customerStats,
    customerLoading,
    customerError,
    statsLoading,
    availableCards,
    availableCardsLoading,

    // ── Methods ──
    wsCreateCustomer,
    wsFetchCustomers,
    wsGetCustomer,
    wsUpdateCustomer,
    wsDeleteCustomer,
    wsGetCustomerCards,
    wsAddCard,
    wsUpdateCardStatus,
    wsFetchAvailableCards,
    wsLinkCard,
    wsUnlinkCard,
    wsFetchCustomerStats,
  };
}