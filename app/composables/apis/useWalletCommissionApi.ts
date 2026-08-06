// composables/apis/useWalletCommissionApi.ts
import { useApi } from "./useApi";

export interface CommissionComponentInput {
  name: string;
  chargeType: string;
  value: number;
  minValue?: number | null;
  maxValue?: number | null;
  appliesOn?: string;
  dependsOn?: string | null;
  receiver?: string;
}

export interface WalletCommissionPayload {
  walletprofileId: string;
  paymentMethod: string;
  provider: string;
  txnType: string;
  minAmount: number;
  maxAmount: number;
  level?: string;
  active?: boolean;
  isDefault?: boolean;
  components: CommissionComponentInput[];
}

export function useWalletCommissionApi() {
  const { get, post, put, del } = useApi();

  const getWalletCommissions = async (walletprofileId: string) => {
    const res = await get(`/wallet-commission/${walletprofileId}`);
    return res.data;
  };

  const createWalletCommission = async (payload: WalletCommissionPayload) => {
    const res = await post(`/wallet-commission`, payload);
    return res.data;
  };

  const updateWalletCommission = async (
    id: string,
    payload: Partial<WalletCommissionPayload>
  ) => {
    const res = await put(`/wallet-commission/${id}`, payload);
    return res.data;
  };

  const disableWalletCommission = async (id: string) => {
    const res = await del(`/wallet-commission/${id}`);
    return res.data;
  };

  return {
    getWalletCommissions,
    createWalletCommission,
    updateWalletCommission,
    disableWalletCommission,
  };
}
