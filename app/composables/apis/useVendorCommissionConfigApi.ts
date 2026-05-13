import { useApi } from './useApi'

export function useVendorCommissionConfigApi() {
  const { post } = useApi()

  const createCommissionConfig = async (payload) => {
    const res = await post('/commission/aggregator/vendor', payload)
    return res?.data
  }

  return {
    createCommissionConfig,
  }
}