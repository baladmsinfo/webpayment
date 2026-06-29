// composables/apis/useMerchantUpdateApi.ts
import { useApi } from "./useApi";

export type MerchantLifecycle =
  | "REGISTERED"
  | "KYC_PENDING"
  | "KYC_VERIFIED"
  | "SERVICE_ENABLED"
  | "ACTIVE"
  | "SUSPENDED"
  | "BLOCKED"
  | "PENDING"
  | "APPROVED";

export interface MerchantStatusSnapshot {
  id: string;
  mid: string;
  status: boolean;
  mstatus: MerchantLifecycle;
  riskflag: number;
}

export interface UpdateStatusPayload {
  status: boolean;
  reason?: string;
}

export interface UpdateMstatusPayload {
  mstatus: MerchantLifecycle;
  reason?: string;
}

export interface UpdateRiskflagPayload {
  riskflag: number; // 0–5
  reason?: string;
}

export interface BulkUpdatePayload {
  status?: boolean;
  mstatus?: MerchantLifecycle;
  riskflag?: number;
  reason?: string;
}

export interface ApiResponse<T = MerchantStatusSnapshot> {
  statusCode: string;
  message: string;
  data?: T;
}

export function useMerchantUpdateApi() {
  const { post } = useApi();

  /**
   * Toggle merchant active / inactive status
   */
  const updateMerchantStatus = async (
    merchantId: string,
    payload: UpdateStatusPayload
  ): Promise<ApiResponse> => {
    try {
      const res = await post(`/merchant/${merchantId}/status`, payload);
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to update merchant status";
      return { statusCode: "99", message: msg };
    }
  };

  const updateMerchantMstatus = async (
    merchantId: string,
    payload: UpdateMstatusPayload
  ): Promise<ApiResponse> => {
    try {
      const res = await post(`/merchant/${merchantId}/mstatus`, payload);
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to update merchant lifecycle";
      return { statusCode: "99", message: msg };
    }
  };

  /**
   * Update merchant risk flag (0 = clear, 1–5 = escalating risk)
   */
  const updateMerchantRiskflag = async (
    merchantId: string,
    payload: UpdateRiskflagPayload
  ): Promise<ApiResponse> => {
    try {
      const res = await post(`/merchant/${merchantId}/riskflag`, payload);
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to update merchant risk flag";
      return { statusCode: "99", message: msg };
    }
  };

  /**
   * Bulk-update status, mstatus, and/or riskflag in one call
   */
  const bulkUpdateMerchant = async (
    merchantId: string,
    payload: BulkUpdatePayload
  ): Promise<ApiResponse> => {
    try {
      const res = await post(`/merchant/${merchantId}/bulk-update`, payload);
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to update merchant";
      return { statusCode: "99", message: msg };
    }
  };

  return {
    updateMerchantStatus,
    updateMerchantMstatus,
    updateMerchantRiskflag,
    bulkUpdateMerchant,
  };
}