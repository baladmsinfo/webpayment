<template>
  <div class="wallet-strip">
    <div class="ws-chip">
      <v-icon size="18" :color="BX.primary">mdi-wallet-outline</v-icon>
      <div class="ws-body">
        <span class="ws-label">Wallet Balance</span>
        <span class="ws-value" v-if="!balanceLoading">{{ formatCurrency(balanceData.balance) }}</span>
        <v-skeleton-loader v-else type="text" width="70" class="ws-skel" />
      </div>
    </div>
    <div class="ws-chip" v-if="remainingLimit !== null">
      <v-icon size="18" :color="BX.success2">mdi-shield-check-outline</v-icon>
      <div class="ws-body">
        <span class="ws-label">Remaining Daily Limit</span>
        <span class="ws-value" :style="{ color: BX.success2 }">{{ formatCurrencyShort(remainingLimit) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useMerchantBalanceApi } from "~/composables/apis/useMerchantBalanceApi";
import { useDmtFormat } from "~/composables/useDmtFormat";
import { BX } from "~/utils/dmtTheme";

defineProps({
  remainingLimit: { type: Number, default: null },
});

const { balanceData, balanceLoading, fetchBalance } = useMerchantBalanceApi();
const { formatCurrency, formatCurrencyShort } = useDmtFormat();

onMounted(() => {
  if (!balanceData.value.balance) fetchBalance();
});

defineExpose({ fetchBalance, balanceData });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;700;800&family=DM+Mono:wght@600;700&display=swap');
.wallet-strip { display: flex; gap: 10px; font-family: 'DM Sans', sans-serif; }
.ws-chip {
  flex: 1; display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid #e6eaf1; border-radius: 12px;
  padding: 9px 12px; box-shadow: 0 1px 4px rgba(15,23,42,.05);
  min-width: 0;
}
.ws-body { display: flex; flex-direction: column; min-width: 0; }
.ws-label { font-size: 9.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.ws-value { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ws-skel { margin-top: 2px; }
</style>
