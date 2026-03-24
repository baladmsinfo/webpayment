// src/composables/apis/useVendorCommissionApi.ts
import { useApi } from './useApi'

export function useVendorCommissionApi() {
  const { get, post, put, del } = useApi()

  /**
   * GET all commission slabs for a vendor
   */
  const getVendorCommissions = async (vendorId: string) => {
    try {
      const res = await get(`/vendor-commission/${vendorId}/commission`)
      return res.data
    } catch (err) {
      console.error('getVendorCommissions error:', err)
      return err?.response?.data
    }
  }

  /**
   * POST — create a new commission slab for a vendor (by aggregator)
   */
  const createVendorCommission = async (vendorId: string, payload: {
    paymentMethod:  string
    provider:       string
    txnType:        string
    minAmount:      number
    maxAmount:      number
    commissionRate: number
    rateType:       string
    isDefault?:     boolean
  }) => {
    try {
      const res = await post(`/vendor-commission/${vendorId}/commission`, payload)
      console.log('createVendorCommission:', res.data)
      return res.data
    } catch (err) {
      console.error('createVendorCommission error:', err)
      return err?.response?.data
    }
  }

  /**
   * PUT — update an existing commission slab
   */
  const updateVendorCommission = async (
    vendorId: string,
    slabId: string,
    payload: Partial<{
      paymentMethod:  string
      provider:       string
      txnType:        string
      minAmount:      number
      maxAmount:      number
      commissionRate: number
      rateType:       string
      isDefault:      boolean
    }>
  ) => {
    try {
      const res = await put(`/vendor-commission/${vendorId}/commission/${slabId}`, payload)
      console.log('updateVendorCommission:', res.data)
      return res.data
    } catch (err) {
      console.error('updateVendorCommission error:', err)
      return err?.response?.data
    }
  }

  /**
   * DELETE — remove a commission slab
   */
  const deleteVendorCommission = async (vendorId: string, slabId: string) => {
    try {
      const res = await del(`/vendor-commission/${vendorId}/commission/${slabId}`)
      return res.data
    } catch (err) {
      console.error('deleteVendorCommission error:', err)
      return err?.response?.data
    }
  }

  return {
    getVendorCommissions,
    createVendorCommission,
    updateVendorCommission,
    deleteVendorCommission,
  }
}