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
        <p class="view-txnid">{{ txn?.id ?? '—' }}</p>
      </div>
      <div class="header-chips">
        <span v-if="txn" class="chip" :class="statusChip(txn.status)">{{ txn.status }}</span>
        <span v-if="txn" class="chip chip-blue">{{ txn.paymentMethod }}</span>
        <span v-if="txn" class="chip chip-grey">{{ txn.txnType }}</span>
      </div>
    </div>

    <!-- Loading skeleton -->
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
          <span class="pill-label">Commission</span>
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
            <div class="field-row"><span class="field-lbl">Transaction Ref</span><span class="field-val mono">{{ txn.tr ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Order ID</span><span class="field-val mono">{{ txn.orderId ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Type</span><span class="field-val">{{ txn.txnType ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Method</span><span class="field-val">{{ txn.paymentMethod ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Status</span><span class="field-val"><span class="chip chip-sm" :class="statusChip(txn.status)">{{ txn.status }}</span></span></div>
            <div class="field-row"><span class="field-lbl">Created</span><span class="field-val">{{ fmtDate(txn.createdAt) }}</span></div>
            <div class="field-row"><span class="field-lbl">Updated</span><span class="field-val">{{ fmtDate(txn.updatedAt) }}</span></div>
          </div>
        </div>

        <!-- Terminal Info -->
        <div class="info-card">
          <div class="card-hdr"><span class="mdi mdi-devices card-hdr-icon" style="color:#7c3aed"></span>Terminal</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Terminal ID</span><span class="field-val mono">{{ txn.terminal?.tid ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Type</span><span class="field-val">{{ txn.terminal?.type ?? '—' }}</span></div>
            <div class="field-row" v-if="txn.vendor"><span class="field-lbl">Vendor</span><span class="field-val">{{ txn.vendor?.name ?? '—' }}</span></div>
          </div>
        </div>

        <!-- Amount Breakdown -->
        <div class="info-card">
          <div class="card-hdr"><span class="mdi mdi-currency-inr card-hdr-icon" style="color:#059669"></span>Amount Breakdown</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Gross Amount</span><span class="field-val mono">₹{{ fmt(txn.amount) }}</span></div>
            <div class="field-row"><span class="field-lbl">Net Amount</span><span class="field-val mono">₹{{ fmt(txn.netAmount) }}</span></div>
            <div class="field-row"><span class="field-lbl">Commission</span><span class="field-val mono">₹{{ fmt(txn.totalCommission) }}</span></div>
            <div class="field-row"><span class="field-lbl">GST</span><span class="field-val mono">₹{{ fmt(txn.gstAmount) }}</span></div>
            <div class="field-row" v-if="txn.customerFee"><span class="field-lbl">Customer Fee</span><span class="field-val mono">₹{{ fmt(txn.customerFee) }}</span></div>
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

        <!-- Reconciliation -->
        <div class="info-card" v-if="txn.reconciliation">
          <div class="card-hdr"><span class="mdi mdi-check-all card-hdr-icon" style="color:#0891b2"></span>Reconciliation</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">GL Posted</span><span class="field-val"><span class="chip chip-sm" :class="txn.reconciliation.posted ? 'chip-green' : 'chip-amber'">{{ txn.reconciliation.posted ? 'Yes' : 'No' }}</span></span></div>
            <div class="field-row"><span class="field-lbl">Settled</span><span class="field-val"><span class="chip chip-sm" :class="txn.reconciliation.settled ? 'chip-green' : 'chip-amber'">{{ txn.reconciliation.settled ? 'Yes' : 'No' }}</span></span></div>
            <div class="field-row" v-if="txn.reconciliation.reconciledAt"><span class="field-lbl">Reconciled At</span><span class="field-val">{{ fmtDate(txn.reconciliation.reconciledAt) }}</span></div>
          </div>
        </div>

        <!-- Commission Snapshot -->
        <div class="info-card" v-if="txn.commissionSnapshot">
          <div class="card-hdr"><span class="mdi mdi-percent card-hdr-icon" style="color:#64748b"></span>Commission Snapshot</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Rate</span><span class="field-val mono">{{ txn.commissionSnapshot.rate ?? '—' }}%</span></div>
            <div class="field-row"><span class="field-lbl">GST Rate</span><span class="field-val mono">{{ txn.commissionSnapshot.gstRate ?? '—' }}%</span></div>
            <div class="field-row"><span class="field-lbl">Flat Fee</span><span class="field-val mono">₹{{ fmt(txn.commissionSnapshot.flatFee) }}</span></div>
            <div class="field-row"><span class="field-lbl">Commission Basis</span><span class="field-val">{{ txn.commissionSnapshot.commissionBasis ?? '—' }}</span></div>
          </div>
        </div>

        <!-- UPI Details -->
        <div class="info-card" v-if="txn.upiTransaction">
          <div class="card-hdr"><span class="mdi mdi-qrcode card-hdr-icon" style="color:#1142d4"></span>UPI Details</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">UPI Ref</span><span class="field-val mono">{{ txn.upiTransaction.upiRef ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">VPA</span><span class="field-val">{{ txn.upiTransaction.vpa ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Payer VPA</span><span class="field-val">{{ txn.upiTransaction.payerVpa ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Bank</span><span class="field-val">{{ txn.upiTransaction.bankName ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">RRN</span><span class="field-val mono">{{ txn.upiTransaction.rrn ?? '—' }}</span></div>
          </div>
        </div>

        <!-- Card Details -->
        <div class="info-card" v-if="txn.cardTransaction">
          <div class="card-hdr"><span class="mdi mdi-credit-card-outline card-hdr-icon" style="color:#e11d48"></span>Card Details</div>
          <div class="field-list">
            <div class="field-row"><span class="field-lbl">Card No</span><span class="field-val mono">{{ txn.cardTransaction.maskedCardNo ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Card Type</span><span class="field-val">{{ txn.cardTransaction.cardType ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">Auth Code</span><span class="field-val mono">{{ txn.cardTransaction.authCode ?? '—' }}</span></div>
            <div class="field-row"><span class="field-lbl">RRN</span><span class="field-val mono">{{ txn.cardTransaction.rrn ?? '—' }}</span></div>
          </div>
        </div>

      </div>

      <!-- GL Journal Entries -->
      <div class="gl-card" v-if="txn.ledgerEntries?.length">
        <div class="card-hdr"><span class="mdi mdi-scale-balance card-hdr-icon" style="color:#1142d4"></span>GL Journal Entries</div>
        <div class="gl-table-wrap">
          <table class="gl-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Code</th>
                <th>Type</th>
                <th>Debit (DR)</th>
                <th>Credit (CR)</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in txn.ledgerEntries" :key="e.id">
                <td>{{ e.account?.name ?? '—' }}</td>
                <td class="mono">{{ e.account?.code ?? '—' }}</td>
                <td><span class="chip chip-sm" :class="e.entryType === 'DR' ? 'chip-red' : 'chip-green'">{{ e.entryType }}</span></td>
                <td class="mono amt-dr">{{ e.entryType === 'DR' ? '₹' + fmt(e.amount) : '—' }}</td>
                <td class="mono amt-cr">{{ e.entryType === 'CR' ? '₹' + fmt(e.amount) : '—' }}</td>
                <td class="note-cell">{{ e.note ?? '' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="gl-foot-label">Totals</td>
                <td class="mono amt-dr">₹{{ fmt(drTotal) }}</td>
                <td class="mono amt-cr">₹{{ fmt(crTotal) }}</td>
                <td>
                  <span class="chip chip-sm" :class="balanced ? 'chip-green' : 'chip-red'">{{ balanced ? 'Balanced' : 'Imbalanced' }}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUsersApi } from "~/composables/apis/useUsersApi";

const router = useRouter();
const route  = useRoute();
const { getMerchantTransactionById } = useUsersApi();

const txn     = ref<any>(null);
const loading = ref(true);
const error   = ref<string | null>(null);

const load = async () => {
  loading.value = true;
  error.value   = null;
  try {
    const id  = route.params.id as string;
    const res = await getMerchantTransactionById(id);
    if (res?.statusCode === '00') {
      txn.value = res.data;
    } else {
      error.value = res?.message ?? 'Failed to load transaction';
    }
  } catch (e: any) {
    error.value = e?.message ?? 'Network error';
  } finally {
    loading.value = false;
  }
};

const drTotal  = computed(() => (txn.value?.ledgerEntries ?? []).filter((e: any) => e.entryType === 'DR').reduce((s: number, e: any) => s + Number(e.amount), 0));
const crTotal  = computed(() => (txn.value?.ledgerEntries ?? []).filter((e: any) => e.entryType === 'CR').reduce((s: number, e: any) => s + Number(e.amount), 0));
const balanced = computed(() => Math.abs(drTotal.value - crTotal.value) < 0.01);

const fmt     = (v: any) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const fmtDate = (d: string | null) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const statusChip = (s: string) => {
  if (s === 'SUCCESS')  return 'chip-green';
  if (s === 'FAILED')   return 'chip-red';
  if (s === 'PENDING')  return 'chip-amber';
  return 'chip-grey';
};
const settlementColor = (s: string) => {
  if (s === 'SUCCESS')  return '#059669';
  if (s === 'FAILED')   return '#be123c';
  if (s === 'PENDING')  return '#d97706';
  return '#64748b';
};

onMounted(load);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.view-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; padding-bottom: 32px; }

/* Header */
.view-header {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  background: #fff; border: 1px solid #e8edf3; border-radius: 14px;
  padding: 16px 20px; box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.btn-back { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .14s; flex-shrink: 0; }
.btn-back:hover { background: rgba(17,66,212,.07); color: #1142d4; border-color: rgba(17,66,212,.2); }
.btn-back .mdi { font-size: 15px; }
.header-center { flex: 1; min-width: 0; }
.view-title { font-size: 18px; font-weight: 800; color: #0f172a; }
.view-txnid { font-family: 'DM Mono', monospace; font-size: 11px; color: #94a3b8; margin-top: 2px; word-break: break-all; }
.header-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

/* Stats strip */
.stats-strip { display: flex; gap: 10px; flex-wrap: wrap; }
.stat-pill {
  flex: 1; min-width: 130px;
  background: #fff; border: 1px solid #e8edf3; border-radius: 12px;
  padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,.04);
  border-top: 3px solid var(--c, #1142d4);
  display: flex; flex-direction: column; gap: 4px;
}
.pill-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.pill-val { font-size: 16px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }

/* Info grid */
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

/* GL card */
.gl-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.gl-table-wrap { overflow-x: auto; margin-top: 12px; }
.gl-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.gl-table thead tr { background: #f8fafc; }
.gl-table th { padding: 9px 12px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #64748b; white-space: nowrap; border-bottom: 1px solid #e8edf3; }
.gl-table td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.gl-table tfoot td { padding: 9px 12px; font-weight: 700; color: #0f172a; border-top: 2px solid #e8edf3; }
.gl-foot-label { font-size: 11px; text-transform: uppercase; color: #64748b; }
.amt-dr { color: #be123c; }
.amt-cr { color: #15803d; }
.note-cell { color: #94a3b8; font-size: 11px; }

/* Chips */
.chip { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.chip-sm { padding: 2px 8px; font-size: 9px; }
.chip-green  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber  { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }
.chip-grey   { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }

/* Error */
.error-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 20px 24px; color: #be123c; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
.error-box .mdi { font-size: 20px; }

/* Skeleton */
.skeleton-area { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.skel-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-title { height: 14px; width: 55%; }
.skel-line  { height: 11px; width: 80%; }
.skel-short { width: 45%; }
</style>
