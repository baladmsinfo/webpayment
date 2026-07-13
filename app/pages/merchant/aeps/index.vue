<template>
  <MerchantDmtShell title="AEPS Services" subtitle="Aadhaar-enabled banking for your customers" :show-back="false" back-to="/merchant/dashboard">
    <MerchantDmtWalletStrip class="mb-4" />

    <div class="qa-grid">
      <button class="qa-item" @click="router.push('/merchant/aeps/cash-withdrawal')">
        <div class="qa-icon" style="background:rgba(17,66,212,.1);color:#1142d4"><v-icon size="24">mdi-cash-multiple</v-icon></div>
        <span>Cash Withdrawal</span>
      </button>
      <button class="qa-item" @click="router.push('/merchant/aeps/balance-enquiry')">
        <div class="qa-icon" style="background:rgba(5,150,105,.1);color:#059669"><v-icon size="24">mdi-wallet-outline</v-icon></div>
        <span>Balance Enquiry</span>
      </button>
      <button class="qa-item" @click="router.push('/merchant/aeps/mini-statement')">
        <div class="qa-icon" style="background:rgba(124,58,237,.1);color:#7c3aed"><v-icon size="24">mdi-receipt-text-outline</v-icon></div>
        <span>Mini Statement</span>
      </button>
      <button class="qa-item" @click="router.push('/merchant/aeps/aadhaar-pay')">
        <div class="qa-icon" style="background:rgba(217,119,6,.1);color:#d97706"><v-icon size="24">mdi-fingerprint</v-icon></div>
        <span>Aadhaar Pay</span>
      </button>
      <button class="qa-item" disabled>
        <div class="qa-icon" style="background:#f1f5f9;color:#94a3b8"><v-icon size="24">mdi-cash-plus</v-icon></div>
        <span>Cash Deposit<br /><small>Coming soon</small></span>
      </button>
    </div>

    <div class="section-title">
      <h3>Recent AEPS Transactions</h3>
    </div>

    <div v-if="aepsStore.sessionTransactions.length" class="txn-list">
      <v-card v-for="(t, i) in aepsStore.sessionTransactions.slice(0, 8)" :key="i" rounded="lg" elevation="0" class="txn-row pa-3 mb-2">
        <div class="txn-ic" :style="{ background: statusMeta(t.status).bg, color: statusMeta(t.status).color }">
          <v-icon size="18">{{ statusMeta(t.status).icon }}</v-icon>
        </div>
        <div class="txn-body">
          <p class="txn-name">{{ typeLabel[t.type] }}</p>
          <p class="txn-sub">{{ t.customerName }} · {{ formatDateTime(t.createdAt) }}</p>
        </div>
        <div class="txn-right">
          <p class="txn-amt" v-if="t.type !== 'MINISTATEMENT'">{{ formatCurrencyShort(t.type === 'BALANCE' ? t.balance : t.amount) }}</p>
          <v-chip size="x-small" :color="statusMeta(t.status).color" variant="tonal">{{ t.status }}</v-chip>
        </div>
      </v-card>
    </div>
    <div v-else class="empty-wrap">
      <v-icon size="48" color="grey-lighten-1">mdi-fingerprint</v-icon>
      <p class="empty-title">No AEPS transactions yet</p>
      <p class="empty-sub">Start a cash withdrawal, balance enquiry or mini statement above.</p>
    </div>
  </MerchantDmtShell>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAepsStore } from "~/stores/aeps";
import { useDmtFormat } from "~/composables/useDmtFormat";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const aepsStore = useAepsStore();
const { formatDateTime, formatCurrencyShort } = useDmtFormat();

const typeLabel = { WITHDRAWAL: "Cash Withdrawal", BALANCE: "Balance Enquiry", MINISTATEMENT: "Mini Statement", AADHAAR_PAY: "Aadhaar Pay" };

const statusMeta = (status) => ({
  SUCCESS: { icon: "mdi-check", color: BX.success2, bg: BX.successTint },
  PENDING: { icon: "mdi-clock-outline", color: BX.warning, bg: BX.warningTint },
  FAILED: { icon: "mdi-close", color: BX.error, bg: BX.errorTint },
}[status] || { icon: "mdi-help", color: BX.muted, bg: "#f1f5f9" });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@600;700&display=swap');
.qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 6px; }
.qa-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; background: none; border: none; }
.qa-item:disabled { opacity: .5; cursor: not-allowed; }
.qa-item small { font-size: 9px; color: #94a3b8; font-weight: 600; }
.qa-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 6px rgba(15,23,42,.05); transition: transform .15s; }
.qa-item:not(:disabled):active .qa-icon { transform: scale(.92); }
.qa-item span { font-size: 11px; font-weight: 700; color: #0f172a; text-align: center; line-height: 1.3; font-family: 'DM Sans', sans-serif; }

.section-title { margin: 22px 0 10px; }
.section-title h3 { font-size: 13.5px; font-weight: 800; color: #0f172a; font-family: 'DM Sans', sans-serif; }

.txn-list { font-family: 'DM Sans', sans-serif; }
.txn-row { display: flex; align-items: center; gap: 12px; border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 4px rgba(15,23,42,.04) !important; }
.txn-ic { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.txn-body { flex: 1; min-width: 0; }
.txn-name { font-size: 13px; font-weight: 700; color: #0f172a; }
.txn-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.txn-right { text-align: right; flex-shrink: 0; }
.txn-amt { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }

.empty-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 16px 20px; font-family: 'DM Sans', sans-serif; }
.empty-title { font-size: 14.5px; font-weight: 800; color: #0f172a; margin-top: 12px; }
.empty-sub { font-size: 12.5px; color: #94a3b8; margin-top: 6px; max-width: 260px; line-height: 1.5; }
</style>
