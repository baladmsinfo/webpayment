// src/composables/apis/useTerminalApi.ts
import { useApi } from './useApi'

export interface TerminalPayload {
  outletId?:      string | null
  tid?:           string
  mid?:           string
  type?:          string
  interface:      string
  interfaceType?: string
  service?:       string
  status?:        boolean
  soundbox?:      boolean
  riskflag?:      number
}

export function useTerminalApi() {
  const { get, post, put, patch, del } = useApi()

  /**
   * GET all terminals for a merchant (aggregator-scoped)
   */
  const getMerchantTerminals = async (merchantId: string) => {
    try {
      const res = await get(`/aggregator/merchant/${merchantId}/terminals`)
      return res.data
    } catch (err) {
      console.error('getMerchantTerminals error:', err)
      return err?.response?.data ?? { statusCode: '99', message: 'Failed to fetch terminals' }
    }
  }

  /**
   * POST — create a new terminal for a merchant
   */
  const createTerminal = async (merchantId: string, payload: TerminalPayload) => {
    try {
      const res = await post(`/aggregator/merchant/${merchantId}/terminals`, payload)
      return res.data
    } catch (err) {
      console.error('createTerminal error:', err)
      return err?.response?.data ?? { statusCode: '99', message: 'Failed to create terminal' }
    }
  }

  /**
   * PUT — update an existing terminal
   */
  const updateTerminal = async (merchantId: string, terminalId: string, payload: Partial<TerminalPayload>) => {
    try {
      const res = await put(`/aggregator/merchant/${merchantId}/terminals/${terminalId}`, payload)
      return res.data
    } catch (err) {
      console.error('updateTerminal error:', err)
      return err?.response?.data ?? { statusCode: '99', message: 'Failed to update terminal' }
    }
  }

  /**
   * PATCH — toggle terminal active/inactive status
   */
  const updateTerminalStatus = async (merchantId: string, terminalId: string, status: boolean) => {
    try {
      const res = await patch(`/aggregator/merchant/${merchantId}/terminals/${terminalId}/status`, { status })
      return res.data
    } catch (err) {
      console.error('updateTerminalStatus error:', err)
      return err?.response?.data ?? { statusCode: '99', message: 'Failed to update terminal status' }
    }
  }

  /**
   * DELETE — remove a terminal
   */
  const deleteTerminal = async (merchantId: string, terminalId: string) => {
    try {
      const res = await del(`/aggregator/merchant/${merchantId}/terminals/${terminalId}`)
      return res.data
    } catch (err) {
      console.error('deleteTerminal error:', err)
      return err?.response?.data ?? { statusCode: '99', message: 'Failed to delete terminal' }
    }
  }

  return {
    getMerchantTerminals,
    createTerminal,
    updateTerminal,
    updateTerminalStatus,
    deleteTerminal,
  }
}
