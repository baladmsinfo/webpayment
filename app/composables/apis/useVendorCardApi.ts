
import { useApi } from "./useApi";

export function useVendorCardApi() {
  const { get, post, put } = useApi();

  const getVendorCards = async (vendorId: string) => {
    try {
      const res = await get(`/vendor/${vendorId}/cards`);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "99", message: "Request failed" };
    }
  };

  const createVendorCard = async (
    vendorId: string,
    payload: {
      cardHolderName: string;
      maskedPan?: string;
      type: "DEBIT" | "CREDIT" | "PREPAID" | "CDM";
      network: "VISA" | "MASTERCARD" | "RUPAY" | "AMEX" | "DINERS";
      status?: string;
      expiryMonth?: number;
      expiryYear?: number;
      issuerBank?: string;
      dailyLimit?: number;
      availableLimit?: number;
      perTxnLimit?: number;
      internationalTxn?: boolean;
      contactless?: boolean;
    }
  ) => {
    try {
      const res = await post(`/vendor/${vendorId}/cards`, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "99", message: "Request failed" };
    }
  };

  const updateVendorCard = async (
    vendorId: string,
    cardId: string,
    payload: {
      status?: "ACTIVE" | "BLOCKED" | "HOTLISTED" | "EXPIRED" | "INACTIVE" | "AVAILABIL" | "PENDING";
      cardHolderName?: string;
      maskedPan?: string;
      type?: string;
      network?: string;
      expiryMonth?: number;
      expiryYear?: number;
      issuerBank?: string;
      dailyLimit?: number;
      availableLimit?: number;
      perTxnLimit?: number;
      internationalTxn?: boolean;
      contactless?: boolean;
      kycVerified?: boolean;
    }
  ) => {
    try {
      const res = await put(`/vendor/${vendorId}/cards/${cardId}`, payload);
      return res.data;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "99", message: "Request failed" };
    }
  };

  const updateVendorCardStatus = async (
    vendorId: string,
    cardId: string,
    status: "ACTIVE" | "BLOCKED" | "HOTLISTED" | "EXPIRED" | "INACTIVE" | "AVAILABIL" | "PENDING"
  ) => {
    return updateVendorCard(vendorId, cardId, { status });
  };

  const deleteVendorCard = async (vendorId: string, cardId: string) => {
    try {
      const { $fetch } = await import("#app");
      const token =
        typeof window !== "undefined"
          ? document.cookie
              .split("; ")
              .find((r) => r.startsWith("authToken="))
              ?.split("=")[1]
          : null;

      const baseURL = useRuntimeConfig().public.apiBase ?? "";

      const res = await $fetch(`${baseURL}/vendor/${vendorId}/cards/${cardId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res;
    } catch (err: any) {
      return err?.response?.data ?? { statusCode: "99", message: "Delete failed" };
    }
  };

  return {
    getVendorCards,
    createVendorCard,
    updateVendorCard,
    updateVendorCardStatus,
    deleteVendorCard,
  };
}