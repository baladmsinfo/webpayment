import { defineStore } from "pinia"

export type PaymentStatus = "PENDING" | "PAID" | "FAILED"

export interface QRData {
  qr: string
  order_id: string
  paymentStatus: PaymentStatus
  payerVpa: string
  rrn: string
  txn_ref_no: string
  time: string
}

export const usePaymentsStore = defineStore("payments", {
  state: () => ({
    transactions: [],
    totalTransactions: 0,
    totalReports: 0,   // ✅ Added here
    totalCollection: {
      dailyCollection: 0,
      dailyCount: 0,
      weeklyCollection: 0,
      weeklyCount: 0,
      monthlyCollection: 0,
      monthlyCount: 0,
      yearlyCollection: 0,
      yearlyCount: 0,
    },
    reports: [],
    payments: [] as QRData[],
    lastQR: null as QRData | null,
    vpaStatus: null as { valid: boolean; message?: string } | null,
    loading: false,
    error: null as string | null,
    paymentStatus: null as PaymentStatus | null,
    transactionDetails: null as QRData | null,
  }),

  actions: {
    setQR(data: QRData) {
      this.lastQR = data
      this.transactionDetails = data
      this.addOrUpdatePayment(data)
    },

    setVPAStatus(status: { valid: boolean; message?: string }) {
      this.vpaStatus = status
    },

    setLoading(status: boolean) {
      this.loading = status
    },

    setError(message: string | null) {
      this.error = message
    },

    setPayment(payload: any) {
      this.transactions = payload
    },

    setTotalTransactions(count: number) {
      this.totalTransactions = count
    },

    setReports(r: any) {
      this.reports = r
    },
    
    setTotalReports(count: number) {
      this.totalReports = count
    },

    setCollection(payload: any) {
      this.totalCollection = {
        dailyCollection: payload.dailyCollection || 0,
        dailyCount: payload.dailyCount || 0,
        weeklyCollection: payload.weeklyCollection || 0,
        weeklyCount: payload.weeklyCount || 0,
        monthlyCollection: payload.monthlyCollection || 0,
        monthlyCount: payload.monthlyCount || 0,
        yearlyCollection: payload.yearlyCollection || 0,
        yearlyCount: payload.yearlyCount || 0,
      }
    },

    setPaymentStatus(status: PaymentStatus, details: Partial<QRData>) {
      this.paymentStatus = status

      const updated: QRData = {
        ...(this.transactionDetails ?? {
          qr: "",
          order_id: "",
          paymentStatus: "PENDING",
          payerVpa: "",
          rrn: "",
          txn_ref_no: "",
          time: "",
        }),
        ...details,
        paymentStatus: status,
      }

      this.transactionDetails = updated
      this.addOrUpdatePayment(updated)
    },

    clearPaymentStatus() {
      this.paymentStatus = null
      this.transactionDetails = null
    },

    addOrUpdatePayment(payment: QRData) {
      const index = this.payments.findIndex(p => p.order_id === payment.order_id)
      if (index !== -1) {
        this.payments[index] = payment
      } else {
        this.payments.push(payment)
      }
    },
  },
})