<template>
  <v-card rounded="lg" elevation="0" class="receipt-card">
    <div class="rc-amount">{{ formatCurrency(txn.amount) }}</div>
    <div class="rc-row"><span class="rc-k">Beneficiary</span><span class="rc-v">{{ txn.beneficiaryName }}</span></div>
    <div class="rc-row" v-if="txn.bankName"><span class="rc-k">Bank</span><span class="rc-v">{{ txn.bankName }}</span></div>
    <div class="rc-row" v-if="txn.accountNumber"><span class="rc-k">Account</span><span class="rc-v mono">{{ maskAccount(txn.accountNumber) }}</span></div>
    <div class="rc-row" v-if="txn.rrn"><span class="rc-k">RRN</span><span class="rc-v mono">{{ txn.rrn }}</span></div>
    <div class="rc-row" v-if="txn.bankReference"><span class="rc-k">Bank Reference</span><span class="rc-v mono">{{ txn.bankReference }}</span></div>
    <div class="rc-row" v-if="txn.transactionId"><span class="rc-k">Transaction ID</span><span class="rc-v mono">{{ txn.transactionId }}</span></div>
    <div class="rc-row" v-if="txn.refId"><span class="rc-k">Reference ID</span><span class="rc-v mono">{{ txn.refId }}</span></div>
    <div class="rc-row" v-if="txn.remarks"><span class="rc-k">Remarks</span><span class="rc-v">{{ txn.remarks }}</span></div>
    <div class="rc-row"><span class="rc-k">Date &amp; Time</span><span class="rc-v">{{ formatDateTime(txn.createdAt) }}</span></div>

    <template v-if="showLimits">
      <v-divider class="my-3" />
      <div class="rc-row"><span class="rc-k">Remaining Wallet</span><span class="rc-v" :style="{ color: BX.primary }">{{ formatCurrency(walletBalance) }}</span></div>
      <div class="rc-row"><span class="rc-k">Remaining Daily Limit</span><span class="rc-v" :style="{ color: BX.success2 }">{{ formatCurrency(remainingLimit) }}</span></div>
    </template>
  </v-card>
</template>

<script setup>
import { useDmtFormat } from "~/composables/useDmtFormat";
import { BX } from "~/utils/dmtTheme";

defineProps({
  txn: { type: Object, required: true },
  showLimits: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  remainingLimit: { type: Number, default: 0 },
});

const { formatCurrency, maskAccount, formatDateTime } = useDmtFormat();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@500;600;700&display=swap');
.receipt-card { padding: 16px 18px; border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.rc-amount { font-size: 24px; font-weight: 800; color: #0f172a; text-align: center; font-family: 'DM Mono', monospace; margin-bottom: 12px; }
.rc-row { display: flex; justify-content: space-between; gap: 12px; padding: 7px 0; border-bottom: 1px dashed #e6eaf1; }
.rc-row:last-child { border-bottom: none; }
.rc-k { font-size: 11.5px; color: #64748b; flex-shrink: 0; }
.rc-v { font-size: 12.5px; font-weight: 700; color: #0f172a; text-align: right; }
.mono { font-family: 'DM Mono', monospace; }
</style>
