import { useApi } from './useApi'

export function useVendorCommissionConfigApi() {
  const { post, put, patch } = useApi()

  const createCommissionConfig = async (payload) => {
    const res = await post('/commission/aggregator/vendor', payload)
    return res?.data
  }

  const updateCommissionConfig = async (id, payload) => {
    const res = await put(`/commission/${id}`, payload)
    return res?.data
  }

  const disableCommissionConfig = async (id) => {
    const res = await patch(`/commission/${id}/disable`, {})
    return res?.data
  }

  return {
    createCommissionConfig,
    updateCommissionConfig,
    disableCommissionConfig,
  }
}
