// src/composables/apis/useCommissionApi.ts
import { useApi } from './useApi'

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
   * POST — create a new commission config slab for a merchant
   */
  const createCommissionConfig = async (merchantId: string, payload: {
    paymentMethod:      string
    provider:           string
    txnType:            string
    minAmount:          number
    maxAmount:          number
    merchantRate:       number
    merchantRateType:   string
    vendorRate:         number
    vendorRateType:     string
    aggregatorRate:     number
    aggregatorRateType: string
    bankRate:           number
    bankRateType:       string
    active?:            boolean
  }) => {
    try {
      const res = await post(`/merchant-commision/${merchantId}/commission`, payload)
      console.log('createCommissionConfig:', res.data)
      return res.data
    } catch (err) {
      console.error('createCommissionConfig error:', err)
      return err?.response?.data
    }
  }

  /**
   * PUT — update an existing commission config slab
   */
  const updateCommissionConfig = async (
    merchantId: string,
    configId: string,
    payload: Partial<{
      paymentMethod:      string
      provider:           string
      txnType:            string
      minAmount:          number
      maxAmount:          number
      merchantRate:       number
      merchantRateType:   string
      vendorRate:         number
      vendorRateType:     string
      aggregatorRate:     number
      aggregatorRateType: string
      bankRate:           number
      bankRateType:       string
      active:             boolean
    }>
  ) => {
    try {
      const res = await put(`/merchant-commision/${merchantId}/commission/${configId}`, payload)
      console.log('updateCommissionConfig:', res.data)
      return res.data
    } catch (err) {
      console.error('updateCommissionConfig error:', err)
      return err?.response?.data
    }
  }

  /**
   * DELETE — remove a commission config slab
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