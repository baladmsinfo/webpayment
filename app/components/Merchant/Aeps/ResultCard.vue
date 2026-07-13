<template>
  <div v-if="result">
    <MerchantDmtStatusIllustration
      :status="result.status"
      :title="statusTitle"
      :subtitle="result.status === 'FAILED' ? result.reason : (result.status === 'PENDING' ? 'No confirmation received yet — check the reference number with support.' : '')"
    />

    <v-card rounded="lg" elevation="0" class="pa-4 mt-4 result-card">
      <div v-if="result.type === 'BALANCE'" class="hero-amount">{{ formatCurrency(result.balance) }}</div>
      <div v-else-if="result.type !== 'MINISTATEMENT'" class="hero-amount">{{ formatCurrency(result.amount) }}</div>

      <div v-if="result.type === 'MINISTATEMENT'" class="statement-block">
        <p v-if="!result.statementLines?.length" class="statement-empty">No recent transactions returned.</p>
        <div v-for="(line, i) in result.statementLines" :key="i" class="statement-line">{{ line }}</div>
      </div>

      <v-divider class="my-3" v-if="result.type === 'WITHDRAWAL' && result.balance != null" />
      <div class="rc-row" v-if="result.type === 'WITHDRAWAL' && result.balance != null">
        <span class="rc-k">Balance After Withdrawal</span><span class="rc-v">{{ formatCurrency(result.balance) }}</span>
      </div>

      <v-divider class="my-3" />
      <div class="rc-row"><span class="rc-k">Customer</span><span class="rc-v">{{ result.customerName }}</span></div>
      <div class="rc-row"><span class="rc-k">Aadhaar</span><span class="rc-v mono">{{ result.aadhaarMasked }}</span></div>
      <div class="rc-row" v-if="result.bankName"><span class="rc-k">Bank</span><span class="rc-v">{{ result.bankName }}</span></div>
      <div class="rc-row" v-if="result.stan"><span class="rc-k">STAN / RRN</span><span class="rc-v mono">{{ result.stan }}</span></div>
      <div class="rc-row" v-if="result.retailerReferenceNumber"><span class="rc-k">Reference Number</span><span class="rc-v mono">{{ result.retailerReferenceNumber }}</span></div>
      <div class="rc-row" v-if="result.authCode"><span class="rc-k">Auth Code</span><span class="rc-v mono">{{ result.authCode }}</span></div>
      <div class="rc-row"><span class="rc-k">Date &amp; Time</span><span class="rc-v">{{ formatDateTime(result.createdAt) }}</span></div>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDmtFormat } from "~/composables/useDmtFormat";

const props = defineProps({ result: { type: Object, required: true } });
const { formatCurrency, formatDateTime } = useDmtFormat();

const typeLabel = { WITHDRAWAL: "Cash Withdrawal", BALANCE: "Balance Enquiry", MINISTATEMENT: "Mini Statement", AADHAAR_PAY: "Aadhaar Pay" };

const statusTitle = computed(() => {
  const label = typeLabel[props.result.type] || "Transaction";
  if (props.result.status === "SUCCESS") return `${label} Successful`;
  if (props.result.status === "PENDING") return `${label} Pending`;
  return `${label} Failed`;
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@500;600;700&display=swap');
.result-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.hero-amount { font-size: 26px; font-weight: 800; font-family: 'DM Mono', monospace; color: #0f172a; text-align: center; margin-bottom: 6px; }
.statement-block { display: flex; flex-direction: column; gap: 6px; }
.statement-line { font-family: 'DM Mono', monospace; font-size: 12px; color: #334155; background: #f8fafc; border: 1px solid #e6eaf1; border-radius: 8px; padding: 8px 10px; }
.statement-empty { font-size: 12.5px; color: #94a3b8; text-align: center; padding: 8px 0; }
.rc-row { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; }
.rc-k { font-size: 11.5px; color: #64748b; flex-shrink: 0; }
.rc-v { font-size: 12.5px; font-weight: 700; color: #0f172a; text-align: right; }
.mono { font-family: 'DM Mono', monospace; }
</style>
