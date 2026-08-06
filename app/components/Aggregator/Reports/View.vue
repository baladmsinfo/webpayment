<template>
  <div class="view-root">

    <!-- Header -->
    <div class="view-header">
      <button class="btn-back" @click="router.back()">
        <span class="mdi mdi-arrow-left"></span>
        Back
      </button>
      <div class="header-center">
        <h1 class="view-title">Transaction Detail</h1>
        <p class="view-txnid">{{ txn?.tr ?? txn?.transactionid ?? route.params.tr }}</p>
      </div>
      <div class="header-chips">
        <span v-if="txn" class="chip" :class="statusChip(txn.status)">{{ txn.status }}</span>
        <span v-if="txn" class="chip chip-blue">{{ txn.provider }}</span>
        <span v-if="txn" class="chip chip-grey">{{ txn.txnType }}</span>
      </div>
    </div>

    <!-- Skeleton -->
    <div v-if="loading" class="skeleton-area">
      <div v-for="i in 6" :key="i" class="skel-card">
        <div class="skel skel-title"></div>
        <div class="skel skel-line"></div>
        <div class="skel skel-line skel-short"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-box">
      <span class="mdi mdi-alert-circle-outline"></span>
      {{ error }}
    </div>

    <!-- Content -->
    <template v-else-if="txn">

      <!-- Stats strip -->
      <div class="stats-strip">
        <div class="stat-pill" style="--c:#1142d4">
          <span class="pill-label">Gross Amount</span>
          <span class="pill-val">₹{{ fmt(txn.amount) }}</span>
        </div>
        <div class="stat-pill" style="--c:#059669">
          <span class="pill-label">Net Amount</span>
          <span class="pill-val">₹{{ fmt(txn.netAmount) }}</span>
        </div>
        <div class="stat-pill" style="--c:#7c3aed">
          <span class="pill-label">Total Commission</span>
          <span class="pill-val">₹{{ fmt(txn.totalCommission) }}</span>
        </div>
        <div class="stat-pill" style="--c:#d97706">
          <span class="pill-label">GST</span>
          <span class="pill-val">₹{{ fmt(txn.gstAmount) }}</span>
        </div>
        <div class="stat-pill" :style="{ '--c': settlementColor(txn.settlementStatus) }">
          <span class="pill-label">Settlement</span>
          <span class="pill-val">{{ txn.settlementStatus ?? 'N/A' }}</span>
        </div>
      </div>

      <!-- Info grid -->
      <div class="info-grid">

        <!-- Transaction Details -->
        <div class="info-card">
          <div class="card-hdr"><span class="mdi mdi-swap-horizontal card-hdr-icon" style="color:#1142d4"></span>Transaction Details</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Reference (tr)</span><span class="field-val mono">{{ txn.tr ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Transaction ID</span><span class="field-val mono">{{ txn.transactionid ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">RRN</span><span class="field-val mono">{{ txn.rrn ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Gateway Ref</span><span class="field-val mono">{{ txn.gatewayRefId ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Type</span><span class="field-val">{{ txn.txnType ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Method</span><span class="field-val">{{ txn.paymentMethod ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Provider</span><span class="field-val">{{ txn.provider ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Status</span><span class="field-val"><span class="chip chip-sm" :class="statusChip(txn.status)">{{ txn.status }}</span></span></div>
            <div class="field-row"><span class="field-lbl">Created</span><span class="field-val">{{ fmtDate(txn.createdAt) }}</span></div>
          </div>
        </div>

        <!-- Parties -->
        <div class="info-card">
          <div class="card-hdr"><span class="mdi mdi-account-group-outline card-hdr-icon" style="color:#059669"></span>Parties</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Merchant ID</span><span class="field-val mono">{{ txn.merchantId ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Vendor ID</span><span class="field-val mono">{{ txn.vendorId ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Aggregator ID</span><span class="field-val mono">{{ txn.aggregatorId ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Terminal ID</span><span class="field-val mono">{{ txn.terminalId ?? '—' }}</span></div>
          </div>
        </div>

        <!-- Amount Breakdown -->
        <div class="info-card">
          <div class="card-hdr"><span class="mdi mdi-currency-inr card-hdr-icon" style="color:#059669"></span>Amount Breakdown</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Gross Amount</span><span class="field-val mono">₹{{ fmt(txn.amount) }}</span></div>
            <div class="field-row"><span class="field-lbl">Total Fee</span><span class="field-val mono">₹{{ fmt(txn.totalfee) }}</span></div>
            <div class="field-row"><span class="field-lbl">GST Amount</span><span class="field-val mono">₹{{ fmt(txn.gstAmount) }}</span></div>
            <div class="field-row"><span class="field-lbl">Net Amount</span><span class="field-val mono">₹{{ fmt(txn.netAmount) }}</span></div>
          </div>
        </div>

        <!-- Commission Breakdown -->
        <div class="info-card">
          <div class="card-hdr"><span class="mdi mdi-chart-pie card-hdr-icon" style="color:#7c3aed"></span>Commission Breakdown</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Base Commission</span><span class="field-val mono">₹{{ fmt(txn.baseCommission) }}</span></div>
            <div class="field-row"><span class="field-lbl">Merchant Commission</span><span class="field-val mono">₹{{ fmt(txn.merchantCommission) }}</span></div>
            <div class="field-row"><span class="field-lbl">Vendor Commission</span><span class="field-val mono">₹{{ fmt(txn.vendorCommission) }}</span></div>
            <div class="field-row"><span class="field-lbl">Aggregator Commission</span><span class="field-val mono">₹{{ fmt(txn.aggregatorCommission) }}</span></div>
            <div class="field-row"><span class="field-lbl">Bank Commission</span><span class="field-val mono">₹{{ fmt(txn.bankCommission) }}</span></div>
            <div class="field-row"><span class="field-lbl">Super Distributor Commission</span><span class="field-val mono">₹{{ fmt(txn.superDistributorCommission) }}</span></div>
            <div class="field-row"><span class="field-lbl">Total Commission</span><span class="field-val mono">₹{{ fmt(txn.totalCommission) }}</span></div>
          </div>
        </div>

        <!-- Settlement -->
        <div class="info-card" v-if="txn.settlement">
          <div class="card-hdr"><span class="mdi mdi-bank-transfer-out card-hdr-icon" style="color:#d97706"></span>Settlement</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Status</span><span class="field-val"><span class="chip chip-sm" :class="statusChip(txn.settlement.status)">{{ txn.settlement.status }}</span></span></div>
            <div class="field-row"><span class="field-lbl">Net Settlement</span><span class="field-val mono">₹{{ fmt(txn.settlement.netSettlement) }}</span></div>
            <div class="field-row"><span class="field-lbl">Ref</span><span class="field-val mono">{{ txn.settlement.settlementRef ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Settled At</span><span class="field-val">{{ fmtDate(txn.settlement.settledAt) }}</span></div>
          </div>
        </div>

        <!-- Commission Snapshot (generic dump, shape may vary) -->
        <div class="info-card" v-if="txn.commissionSnapshot">
          <div class="card-hdr"><span class="mdi mdi-camera-outline card-hdr-icon" style="color:#0891b2"></span>Commission Snapshot</div>
          <div class="field-list">
            <div class="field-row" v-for="(val, key) in snapshotFields" :key="key">
              <span class="field-lbl">{{ humanize(key) }}</span>
              <span class="field-val mono">{{ formatSnapshotVal(val) }}</span>
            </div>
          </div>
        </div>

      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useReportsApi } from "~/composables/apis/useReportsApi";

const router = useRouter();
const route  = useRoute();
const { getTransactionDetail } = useReportsApi();

const txn     = ref<any>(null);
const loading = ref(true);
const error   = ref<string | null>(null);

const load = async () => {
  loading.value = true;
  error.value   = null;
  try {
    const tr  = route.params.tr as string;
    const res = await getTransactionDetail(tr);
    if (res?.statusCode === '00') {
      txn.value = res.data;
    } else {
      error.value = res?.message ?? 'Failed to load transaction';
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? 'Network error';
  } finally {
    loading.value = false;
  }
};

const snapshotFields = computed(() => {
  const snap = txn.value?.commissionSnapshot;
  if (!snap) return {};
  const { id, transactionId, createdAt, updatedAt, ...rest } = snap;
  return rest;
});

const humanize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
const formatSnapshotVal = (v: any) => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'number') return v.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return String(v);
};

const fmt     = (v: any) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const fmtDate = (d: string | null) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const statusChip = (s: string) => {
  if (s === 'SUCCESS') return 'chip-green';
  if (s === 'FAILED')  return 'chip-red';
  if (s === 'PENDING') return 'chip-amber';
  return 'chip-grey';
};
const settlementColor = (s: string) => {
  if (s === 'SUCCESS') return '#059669';
  if (s === 'FAILED')  return '#be123c';
  if (s === 'PENDING') return '#d97706';
  return '#64748b';
};

onMounted(load);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.view-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; padding-bottom: 32px; }

.view-header { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 16px 20px; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.btn-back { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .14s; flex-shrink: 0; }
.btn-back:hover { background: rgba(17,66,212,.07); color: #1142d4; border-color: rgba(17,66,212,.2); }
.btn-back .mdi { font-size: 15px; }
.header-center { flex: 1; min-width: 0; }
.view-title { font-size: 18px; font-weight: 800; color: #0f172a; }
.view-txnid { font-family: 'DM Mono', monospace; font-size: 11px; color: #94a3b8; margin-top: 2px; word-break: break-all; }
.header-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.stats-strip { display: flex; gap: 10px; flex-wrap: wrap; }
.stat-pill { flex: 1; min-width: 130px; background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,.04); border-top: 3px solid var(--c, #1142d4); display: flex; flex-direction: column; gap: 4px; }
.pill-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.pill-val { font-size: 16px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }

.info-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 640px)  { .info-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .info-grid { grid-template-columns: repeat(3, 1fr); } }

.info-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.card-hdr { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; }
.card-hdr-icon { font-size: 16px; }
.field-list { display: flex; flex-direction: column; gap: 8px; }
.field-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; font-size: 12px; }
.field-lbl { color: #64748b; font-weight: 500; flex-shrink: 0; }
.field-val { color: #0f172a; font-weight: 600; text-align: right; word-break: break-all; }
.mono { font-family: 'DM Mono', monospace; font-size: 11px; }

.chip { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.chip-sm { padding: 2px 8px; font-size: 9px; }
.chip-green  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber  { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }
.chip-grey   { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }

.error-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 20px 24px; color: #be123c; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
.error-box .mdi { font-size: 20px; }

.skeleton-area { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.skel-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-title { height: 14px; width: 55%; }
.skel-line  { height: 11px; width: 80%; }
.skel-short { width: 45%; }
</style>
