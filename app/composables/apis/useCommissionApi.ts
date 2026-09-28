// src/composables/apis/useCommissionApi.ts
//
// Merchant-specific commission config (component model — same shape as the
// aggregator's vendor configs, see useVendorCommissionConfigApi). Allowed for
// admin, the merchant's aggregator and the merchant's own vendor.
import { useApi } from './useApi'

export interface CommissionComponentInput {
  name:                   string
  chargeType:             'FIXED' | 'PERCENTAGE' | 'HYBRID'
  value:                  number
  minValue?:              number | null
  maxValue?:              number | null
  appliesOn:              'TRANSACTION' | 'VALIDATION' | 'REGISTRATION'
  dependsOn?:             string | null
  receiver?:              string | null
  splitType?:             'PERCENTAGE' | 'FIXED'
  merchantShare?:         number | null
  distributorShare?:      number | null
  superDistributorShare?: number | null
  vendorShare?:           number | null
  aggregatorShare?:       number | null
  platformShare?:         number | null
}

export interface MerchantCommissionConfigInput {
  paymentMethod:      string
  provider:           string
  txnType:            string
  minAmount:          number
  maxAmount:          number
  minGmv?:            number | null
  maxGmv?:            number | null
  instantCommission?: boolean
  components:         CommissionComponentInput[]
}

export function useCommissionApi() {
  const { get, post, put, del } = useApi()

  /**
   * GET all commission configs for a merchant
   */
  const getCommissionConfigs = async (merchantId: string) => {
    try {
      const res = await get(`/merchant-commision/${merchantId}/commission`)
      return res.data
    } catch (err) {
      console.error('getCommissionConfigs error:', err)
      return err?.response?.data
    }
  }

  /**
   * POST — create a merchant-specific commission config slab
   */
  const createCommissionConfig = async (merchantId: string, payload: MerchantCommissionConfigInput) => {
    try {
      const res = await post(`/merchant-commision/${merchantId}/commission`, payload)
      return res.data
    } catch (err) {
      console.error('createCommissionConfig error:', err)
      return err?.response?.data
    }
  }

  /**
   * PUT — update a slab (components are replaced as a whole)
   */
  const updateCommissionConfig = async (
    merchantId: string,
    configId: string,
    payload: Partial<MerchantCommissionConfigInput> & { components: CommissionComponentInput[] }
  ) => {
    try {
      const res = await put(`/merchant-commision/${merchantId}/commission/${configId}`, payload)
      return res.data
    } catch (err) {
      console.error('updateCommissionConfig error:', err)
      return err?.response?.data
    }
  }

  /**
   * DELETE — disable a slab (kept for audit)
   */
  const deleteCommissionConfig = async (merchantId: string, configId: string) => {
    try {
      const res = await del(`/merchant-commision/${merchantId}/commission/${configId}`)
      return res.data
    } catch (err) {
      console.error('deleteCommissionConfig error:', err)
      return err?.response?.data
    }
  }

  return {
    getCommissionConfigs,
    createCommissionConfig,
    updateCommissionConfig,
    deleteCommissionConfig,
  }
}
