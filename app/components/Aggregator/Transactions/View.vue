<template>
  <div class="tv-shell">

    <!-- ── Loading ── -->
    <div v-if="loading" class="tv-loading">
      <div class="tv-header skel-header">
        <div class="skel skel-back"></div>
        <div class="skel skel-title"></div>
      </div>
      <div class="tv-body">
        <div class="tv-grid">
          <div class="info-card" v-for="n in 4" :key="n">
            <div class="skel skel-card-title" style="margin-bottom:12px"></div>
            <div class="skel skel-line-lg" style="margin-bottom:8px"></div>
            <div class="skel skel-line-md" style="margin-bottom:8px"></div>
            <div class="skel skel-line-sm"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Error ── -->
    <div v-else-if="error" class="tv-error">
      <div class="empty-icon"><span class="mdi mdi-alert-circle-outline"></span></div>
      <p class="empty-title">Failed to load transaction</p>
      <p class="empty-desc">{{ error }}</p>
      <button class="btn-back-inline" @click="router.back()">← Go Back</button>
    </div>

    <!-- ── Content ── -->
    <template v-else-if="txn">

      <!-- Header -->
      <div class="tv-header">
        <button class="btn-back" @click="router.back()">
          <span class="mdi mdi-arrow-left"></span> Back
        </button>
        <div class="tv-header-main">
          <div class="tv-id-wrap">
            <div class="tv-status-dot" :class="dotClass(txn.status)"></div>
            <div>
              <p class="tv-txn-id">{{ txn.id }}</p>
              <p class="tv-txn-ref" v-if="txn.transactionid">Ref: {{ txn.transactionid }}</p>
            </div>
          </div>
          <div class="tv-header-badges">
            <span class="chip" :class="statusChip(txn.status)"><span class="chip-dot"></span>{{ txn.status }}</span>
            <span class="chip chip-blue">{{ txn.paymentMethod }}</span>
            <span class="chip chip-grey" v-if="txn.txnType">{{ txn.txnType }}</span>
          </div>
        </div>
      </div>

      <!-- Stats Strip -->
      <div class="tv-stat-strip">
        <div class="stat-pill" v-for="s in statsStrip" :key="s.label" :style="{ '--c': s.color }">
          <span class="stat-pill-dot"></span>
          <div>
            <p class="stat-pill-val">{{ s.value }}</p>
            <p class="stat-pill-label">{{ s.label }}</p>
          </div>
        </div>
      </div>

      <!-- Grid of detail cards -->
      <div class="tv-grid">

        <!-- ── Transaction Details ── -->
        <div class="info-card">
          <div class="info-card-header">
            <span class="mdi mdi-swap-horizontal info-icon"></span>
            <h3 class="info-card-title">Transaction Details</h3>
          </div>
          <div class="info-rows">
            <div class="info-row"><span class="info-key">Transaction ID</span><span class="info-val mono">{{ txn.id }}</span></div>
            <div class="info-row" v-if="txn.transactionid"><span class="info-key">Reference ID</span><span class="info-val mono">{{ txn.transactionid }}</span></div>
            <div class="info-row" v-if="txn.tr"><span class="info-key">TR Number</span><span class="info-val mono">{{ txn.tr }}</span></div>
            <div class="info-row" v-if="txn.rrn"><span class="info-key">RRN</span><span class="info-val mono">{{ txn.rrn }}</span></div>
            <div class="info-row" v-if="txn.gatewayRefId"><span class="info-key">Gateway Ref</span><span class="info-val mono">{{ txn.gatewayRefId }}</span></div>
            <div class="info-row"><span class="info-key">Payment Method</span><span class="chip chip-blue" style="font-size:10px">{{ txn.paymentMethod }}</span></div>
            <div class="info-row" v-if="txn.txnType"><span class="info-key">Txn Type</span><span class="info-val">{{ txn.txnType }}</span></div>
            <div class="info-row" v-if="txn.provider"><span class="info-key">Provider</span><span class="info-val">{{ txn.provider }}</span></div>
            <div class="info-row"><span class="info-key">Status</span><span class="chip" :class="statusChip(txn.status)"><span class="chip-dot"></span>{{ txn.status }}</span></div>
            <div class="info-row" v-if="txn.responseCode"><span class="info-key">Response Code</span><span class="info-val mono">{{ txn.responseCode }}</span></div>
            <div class="info-row" v-if="txn.reason"><span class="info-key">Reason</span><span class="info-val">{{ txn.reason }}</span></div>
            <div class="info-row"><span class="info-key">Created At</span><span class="info-val">{{ formatDateTime(txn.createdAt) }}</span></div>
            <div class="info-row" v-if="txn.updatedAt"><span class="info-key">Updated At</span><span class="info-val">{{ formatDateTime(txn.updatedAt) }}</span></div>
          </div>
        </div>

        <!-- ── Merchant & Terminal ── -->
        <div class="info-card">
          <div class="info-card-header">
            <span class="mdi mdi-store-outline info-icon"></span>
            <h3 class="info-card-title">Merchant & Terminal</h3>
          </div>
          <div class="info-rows">
            <div class="info-row" v-if="txn.merchant?.legal_name">
              <span class="info-key">Merchant</span>
              <div class="merchant-mini">
                <div class="m-avatar" :style="{ background: avatarColor(txn.merchant.legal_name) }">{{ initials(txn.merchant.legal_name) }}</div>
                <div>
                  <p class="info-val">{{ txn.merchant.legal_name }}</p>
                  <p class="info-sub">{{ txn.merchant.mid }}</p>
                </div>
              </div>
            </div>
            <div class="info-row" v-if="txn.merchantId"><span class="info-key">Merchant ID</span><span class="info-val mono">{{ txn.merchantId }}</span></div>
            <div class="info-row" v-if="txn.merchant?.mobile_no"><span class="info-key">Mobile</span><span class="info-val mono">{{ txn.merchant.mobile_no }}</span></div>
            <!-- <div class="info-row" v-if="txn.merchant?.interface"><span class="info-key">Interface</span><span class="info-val">{{ txn.merchant.interface }}</span></div> -->
            <div class="info-row" v-if="txn.merchant?.mstatus">
              <span class="info-key">KYC Status</span>
              <span class="chip" :class="kycChip(txn.merchant.mstatus)"><span class="chip-dot"></span>{{ txn.merchant.mstatus }}</span>
            </div>
            <div class="divider" v-if="txn.terminal"></div>
            <div class="info-row" v-if="txn.terminal?.tid"><span class="info-key">Terminal ID</span><span class="info-val mono">{{ txn.terminal.tid }}</span></div>
            <div class="info-row" v-if="txn.terminal?.type"><span class="info-key">Terminal Type</span><span class="info-val">{{ txn.terminal.type }}</span></div>
            <div class="divider" v-if="txn.vendor"></div>
            <div class="info-row" v-if="txn.vendor?.name"><span class="info-key">Vendor</span><span class="info-val">{{ txn.vendor.name }}</span></div>
          </div>
        </div>

        <!-- ── Amount & Commission ── -->
        <div class="info-card">
          <div class="info-card-header">
            <span class="mdi mdi-currency-inr info-icon"></span>
            <h3 class="info-card-title">Amount & Commission</h3>
          </div>
          <div class="info-rows">
            <div class="info-row amount-row"><span class="info-key">Gross Amount</span><span class="amount-big">₹{{ fmtAmt(txn.amount) }}</span></div>
            <div class="info-row" v-if="txn.totalfee"><span class="info-key">Customer Fee</span><span class="info-val mono">₹{{ fmtAmt(txn.totalfee) }}</span></div>
            <div class="divider"></div>
            <div class="info-row" v-if="txn.merchantCommission != null"><span class="info-key">Merchant MDR</span><span class="info-val mono">₹{{ fmtAmt(txn.merchantCommission) }}</span></div>
            <div class="info-row" v-if="txn.vendorCommission != null"><span class="info-key">Distributor Comm.</span><span class="info-val mono">₹{{ fmtAmt(txn.vendorCommission) }}</span></div>
            <div class="info-row" v-if="txn.aggregatorCommission != null"><span class="info-key">Aggregator Comm.</span><span class="info-val mono">₹{{ fmtAmt(txn.aggregatorCommission) }}</span></div>
            <div class="info-row" v-if="txn.bankCommission != null"><span class="info-key">Bank Share</span><span class="info-val mono">₹{{ fmtAmt(txn.bankCommission) }}</span></div>
            <div class="info-row" v-if="txn.gstAmount != null"><span class="info-key">GST</span><span class="info-val mono">₹{{ fmtAmt(txn.gstAmount) }}</span></div>
            <div class="info-row" v-if="txn.totalCommission != null"><span class="info-key">Total Commission</span><span class="info-val mono font-bold">₹{{ fmtAmt(txn.totalCommission) }}</span></div>
            <div class="divider"></div>
            <div class="info-row amount-row"><span class="info-key">Net Amount</span><span class="amount-net">₹{{ fmtAmt(txn.netAmount) }}</span></div>
          </div>
        </div>

        <!-- ── Settlement ── -->
        <div class="info-card">
          <div class="info-card-header">
            <span class="mdi mdi-bank-transfer-out info-icon"></span>
            <h3 class="info-card-title">Settlement</h3>
          </div>
          <div v-if="txn.settlement" class="info-rows">
            <div class="info-row"><span class="info-key">Settlement ID</span><span class="info-val mono small">{{ txn.settlement.id }}</span></div>
            <div class="info-row"><span class="info-key">Status</span><span class="chip" :class="stlChip(txn.settlement.status)"><span class="chip-dot"></span>{{ txn.settlement.status }}</span></div>
            <div class="info-row" v-if="txn.settlement.settlementRef"><span class="info-key">Bank Ref (UTR)</span><span class="info-val mono">{{ txn.settlement.settlementRef }}</span></div>
            <div class="info-row" v-if="txn.settlement.amount"><span class="info-key">Amount</span><span class="info-val mono">₹{{ fmtAmt(txn.settlement.amount) }}</span></div>
            <div class="info-row" v-if="txn.settlement.commission"><span class="info-key">Commission</span><span class="info-val mono">₹{{ fmtAmt(txn.settlement.commission) }}</span></div>
            <div class="info-row" v-if="txn.settlement.gst"><span class="info-key">GST</span><span class="info-val mono">₹{{ fmtAmt(txn.settlement.gst) }}</span></div>
            <div class="info-row amount-row" v-if="txn.settlement.netSettlement != null"><span class="info-key">Net Settlement</span><span class="amount-net">₹{{ fmtAmt(txn.settlement.netSettlement) }}</span></div>
            <div class="info-row" v-if="txn.settlement.settledAt"><span class="info-key">Settled At</span><span class="info-val">{{ formatDateTime(txn.settlement.settledAt) }}</span></div>
            <div class="info-row" v-if="txn.settlement.remarks"><span class="info-key">Remarks</span><span class="info-val">{{ txn.settlement.remarks }}</span></div>
          </div>
          <div v-else class="no-data">
            <span class="mdi mdi-clock-outline"></span>
            <p>Settlement record not created yet</p>
          </div>
        </div>

        <!-- ── Reconciliation ── -->
        <div class="info-card">
          <div class="info-card-header">
            <span class="mdi mdi-check-all info-icon"></span>
            <h3 class="info-card-title">Reconciliation</h3>
          </div>
          <div v-if="txn.reconciliation" class="info-rows">
            <div class="info-row">
              <span class="info-key">GL Posted</span>
              <span class="chip" :class="txn.reconciliation.posted ? 'chip-green' : 'chip-amber'">
                <span class="chip-dot"></span>{{ txn.reconciliation.posted ? 'Yes' : 'Pending' }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-key">Settlement Confirmed</span>
              <span class="chip" :class="txn.reconciliation.settled ? 'chip-green' : 'chip-amber'">
                <span class="chip-dot"></span>{{ txn.reconciliation.settled ? 'Yes' : 'Pending' }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-key">Fully Reconciled</span>
              <span class="chip" :class="txn.reconciliation.reconciledAt ? 'chip-green' : 'chip-red'">
                <span class="chip-dot"></span>{{ txn.reconciliation.reconciledAt ? 'Yes' : 'No' }}
              </span>
            </div>
            <div class="info-row" v-if="txn.reconciliation.reconciledAt">
              <span class="info-key">Reconciled At</span><span class="info-val">{{ formatDateTime(txn.reconciliation.reconciledAt) }}</span>
            </div>
            <div class="info-row" v-if="txn.reconciliation.notes"><span class="info-key">Notes</span><span class="info-val">{{ txn.reconciliation.notes }}</span></div>
          </div>
          <div v-else class="no-data">
            <span class="mdi mdi-clock-outline"></span>
            <p>Reconciliation pending</p>
          </div>
        </div>

        <!-- ── Commission Snapshot ── -->
        <div class="info-card" v-if="txn.commissionSnapshot">
          <div class="info-card-header">
            <span class="mdi mdi-percent info-icon"></span>
            <h3 class="info-card-title">Commission Snapshot</h3>
          </div>
          <div class="info-rows">
            <div class="info-row" v-if="txn.commissionSnapshot.grossAmount != null"><span class="info-key">Gross Amount</span><span class="info-val mono">₹{{ fmtAmt(txn.commissionSnapshot.grossAmount) }}</span></div>
            <div class="info-row" v-if="txn.commissionSnapshot.fee != null"><span class="info-key">Customer Fee</span><span class="info-val mono">₹{{ fmtAmt(txn.commissionSnapshot.fee) }}</span></div>
            <div class="info-row" v-if="txn.commissionSnapshot.gstAmount != null"><span class="info-key">GST</span><span class="info-val mono">₹{{ fmtAmt(txn.commissionSnapshot.gstAmount) }}</span></div>
            <div class="info-row" v-if="txn.commissionSnapshot.merchantAmount != null"><span class="info-key">Merchant MDR</span><span class="info-val mono">₹{{ fmtAmt(txn.commissionSnapshot.merchantAmount) }}</span></div>
            <div class="info-row" v-if="txn.commissionSnapshot.vendorAmount != null"><span class="info-key">Distributor</span><span class="info-val mono">₹{{ fmtAmt(txn.commissionSnapshot.vendorAmount) }}</span></div>
            <div class="info-row" v-if="txn.commissionSnapshot.aggregatorAmount != null"><span class="info-key">Aggregator</span><span class="info-val mono">₹{{ fmtAmt(txn.commissionSnapshot.aggregatorAmount) }}</span></div>
            <div class="info-row" v-if="txn.commissionSnapshot.bankAmount != null"><span class="info-key">Bank</span><span class="info-val mono">₹{{ fmtAmt(txn.commissionSnapshot.bankAmount) }}</span></div>
            <div class="info-row" v-if="txn.commissionSnapshot.platformProfit != null"><span class="info-key">Platform Profit</span><span class="info-val mono font-bold">₹{{ fmtAmt(txn.commissionSnapshot.platformProfit) }}</span></div>
            <div class="info-row amount-row" v-if="txn.commissionSnapshot.netAmount != null"><span class="info-key">Net Amount</span><span class="amount-net">₹{{ fmtAmt(txn.commissionSnapshot.netAmount) }}</span></div>
          </div>
        </div>

        <!-- ── UPI Details ── -->
        <div class="info-card" v-if="txn.upiTransaction">
          <div class="info-card-header">
            <span class="mdi mdi-qrcode info-icon"></span>
            <h3 class="info-card-title">UPI Details</h3>
          </div>
          <div class="info-rows">
            <div class="info-row" v-for="(v, k) in upiFields" :key="k">
              <span class="info-key">{{ k }}</span>
              <span class="info-val mono">{{ v }}</span>
            </div>
          </div>
        </div>

        <!-- ── Card Details ── -->
        <div class="info-card" v-if="txn.cardTransaction">
          <div class="info-card-header">
            <span class="mdi mdi-credit-card-outline info-icon"></span>
            <h3 class="info-card-title">Card Details</h3>
          </div>
          <div class="info-rows">
            <div class="info-row" v-for="(v, k) in cardFields" :key="k">
              <span class="info-key">{{ k }}</span>
              <span class="info-val mono">{{ v }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── GL Journal Entries ── -->
      <div class="info-card gl-card" v-if="txn.ledgerEntries?.length">
        <div class="info-card-header">
          <span class="mdi mdi-book-open-outline info-icon"></span>
          <h3 class="info-card-title">GL Journal Entries</h3>
          <div class="gl-summary">
            <span class="gl-sum-item debit-txt">DR ₹{{ fmtAmt(totalDr) }}</span>
            <span class="gl-sum-sep">|</span>
            <span class="gl-sum-item credit-txt">CR ₹{{ fmtAmt(totalCr) }}</span>
            <span class="gl-balance-chip" :class="isBalanced ? 'chip-green' : 'chip-red'">
              {{ isBalanced ? 'Balanced ✓' : 'Imbalanced ✗' }}
            </span>
          </div>
        </div>
        <div class="table-wrap">
          <table class="gl-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Account</th>
                <th>Type</th>
                <th class="text-right">Amount (₹)</th>
                <th class="th-hide-sm">Narration</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in txn.ledgerEntries" :key="e.id" class="gl-row" :class="e.entryType === 'DEBIT' ? 'gl-dr' : 'gl-cr'">
                <td><span class="gl-code">{{ e.account?.code }}</span></td>
                <td>
                  <p class="acc-name">{{ e.account?.name }}</p>
                  <p class="acc-type-sub">{{ e.account?.type }}</p>
                </td>
                <td>
                  <span class="chip" :class="e.entryType === 'DEBIT' ? 'chip-red' : 'chip-green'">
                    <span class="chip-dot"></span>{{ e.entryType }}
                  </span>
                </td>
                <td class="text-right">
                  <span class="mono-num" :class="e.entryType === 'DEBIT' ? 'debit-txt' : 'credit-txt'">
                    {{ fmtAmt(e.amount) }}
                  </span>
                </td>
                <td class="th-hide-sm"><span class="narration">{{ e.narration || '—' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAggregatorApi } from "@/composables/apis/useAggregatorApi";

const route  = useRoute();
const router = useRouter();
const { getTransactionById } = useAggregatorApi();

const loading = ref(true);
const error   = ref('');
const txn     = ref<any>(null);

/* ── Helpers ── */
const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor  = (n: string) => AVATAR_COLORS[((n||'?').charCodeAt(0)) % AVATAR_COLORS.length];
const initials     = (n: string) => (n||'?').split(' ').map((w:string)=>w[0]).slice(0,2).join('').toUpperCase();
const fmtAmt       = (v: any)    => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';

const statusChip = (s: string) => ({
  'chip-green': s === 'SUCCESS',
  'chip-red':   s === 'FAILED',
  'chip-amber': s === 'PENDING',
  'chip-grey':  !['SUCCESS','FAILED','PENDING'].includes(s),
});
const dotClass = (s: string) => ({
  'dot-green': s === 'SUCCESS',
  'dot-red':   s === 'FAILED',
  'dot-amber': s === 'PENDING',
  'dot-grey':  !['SUCCESS','FAILED','PENDING'].includes(s),
});
const stlChip = (s: string) => ({
  'chip-green': s === 'SUCCESS',
  'chip-red':   s === 'FAILED',
  'chip-amber': s === 'PENDING',
  'chip-blue':  s === 'PROCESSING',
  'chip-grey':  !['SUCCESS','FAILED','PENDING','PROCESSING'].includes(s),
});
const kycChip = (s: string) => ({
  'chip-green': s === 'APPROVED',
  'chip-amber': s === 'PENDING',
  'chip-red':   s === 'REJECTED',
  'chip-grey':  !['APPROVED','PENDING','REJECTED'].includes(s),
});

/* ── Stats strip ── */
const statsStrip = computed(() => {
  if (!txn.value) return [];
  const t = txn.value;
  return [
    { label: 'Gross Amount',   value: `₹${fmtAmt(t.amount)}`,          color: '#1142d4' },
    { label: 'Net Amount',     value: `₹${fmtAmt(t.netAmount)}`,        color: '#059669' },
    { label: 'Commission',     value: `₹${fmtAmt(t.totalCommission)}`,  color: '#f59e0b' },
    { label: 'GST',            value: `₹${fmtAmt(t.gstAmount)}`,        color: '#7c3aed' },
    { label: 'Settlement',     value: t.settlementStatus || '—',         color: t.settlementStatus === 'SUCCESS' ? '#22c55e' : '#f59e0b' },
  ];
});

/* ── GL totals ── */
const totalDr = computed(() => (txn.value?.ledgerEntries || []).filter((e:any)=>e.entryType==='DEBIT').reduce((s:number,e:any)=>s+Number(e.amount),0));
const totalCr = computed(() => (txn.value?.ledgerEntries || []).filter((e:any)=>e.entryType==='CREDIT').reduce((s:number,e:any)=>s+Number(e.amount),0));
const isBalanced = computed(() => Math.abs(totalDr.value - totalCr.value) < 0.01);

/* ── UPI / Card field maps ── */
const SKIP_KEYS = new Set(['id','transactionId','createdAt','updatedAt']);
const upiFields = computed(() => {
  if (!txn.value?.upiTransaction) return {};
  const obj: Record<string,string> = {};
  for (const [k, v] of Object.entries(txn.value.upiTransaction)) {
    if (!SKIP_KEYS.has(k) && v != null) obj[k] = String(v);
  }
  return obj;
});
const cardFields = computed(() => {
  if (!txn.value?.cardTransaction) return {};
  const obj: Record<string,string> = {};
  for (const [k, v] of Object.entries(txn.value.cardTransaction)) {
    if (!SKIP_KEYS.has(k) && v != null) obj[k] = String(v);
  }
  return obj;
});

/* ── Load ── */
onMounted(async () => {
  const id = route.params.id as string;
  if (!id) { error.value = 'No transaction ID provided'; loading.value = false; return; }
  try {
    const res = await getTransactionById(id);
    if (res.statusCode === '00' && res.data) {
      txn.value = res.data;
    } else {
      error.value = res.message || 'Transaction not found';
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to load transaction';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.tv-shell { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; }

/* ── Header ── */
.tv-header { display: flex; flex-direction: column; gap: 12px; }
.btn-back  {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0;
  background: #fff; font-size: 12px; font-weight: 700; color: #475569;
  font-family: 'DM Sans', sans-serif; cursor: pointer; width: fit-content;
  transition: all .13s;
}
.btn-back:hover { border-color: #1142d4; color: #1142d4; }
.btn-back .mdi  { font-size: 16px; }
.tv-header-main { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.tv-id-wrap { display: flex; align-items: center; gap: 10px; }
.tv-status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,.2); }
.dot-red   { background: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,.2); }
.dot-amber { background: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,.2); }
.dot-grey  { background: #94a3b8; }
.tv-txn-id  { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 700; color: #0f172a; }
.tv-txn-ref { font-size: 11px; color: #94a3b8; font-family: 'DM Mono', monospace; margin-top: 2px; }
.tv-header-badges { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

/* ── Stat Strip ── */
.tv-stat-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.stat-pill { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid #e8edf3; padding: 10px 16px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.stat-pill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c,#1142d4); flex-shrink: 0; }
.stat-pill-val { font-size: 14px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.stat-pill-label { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; }

/* ── Grid ── */
.tv-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media(min-width:768px)  { .tv-grid { grid-template-columns: repeat(2,1fr); } }
@media(min-width:1280px) { .tv-grid { grid-template-columns: repeat(3,1fr); } }

/* ── Info Card ── */
.info-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.gl-card { grid-column: 1 / -1; }
.info-card-header { display: flex; align-items: center; gap: 8px; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; }
.info-icon { font-size: 17px; color: #1142d4; }
.info-card-title { font-size: 13px; font-weight: 800; color: #0f172a; }
.info-rows { display: flex; flex-direction: column; }
.info-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 16px; border-bottom: 1px solid #f8fafc; flex-wrap: wrap;
}
.info-row:last-child { border-bottom: none; }
.info-key   { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; flex-shrink: 0; }
.info-val   { font-size: 12px; font-weight: 600; color: #334155; text-align: right; }
.info-val.mono { font-family: 'DM Mono', monospace; font-size: 11px; }
.info-val.small { font-size: 10px; }
.info-sub   { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; margin-top: 1px; }
.info-val.font-bold { font-weight: 800; color: #0f172a; }
.divider    { height: 1px; background: #f1f5f9; margin: 4px 16px; }
.amount-row { background: #f8fafc; }
.amount-big { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 800; color: #0f172a; }
.amount-net { font-family: 'DM Mono', monospace; font-size: 16px; font-weight: 800; color: #059669; }

/* Merchant mini */
.merchant-mini { display: flex; align-items: center; gap: 8px; }
.m-avatar { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #fff; flex-shrink: 0; }

/* No data */
.no-data { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 28px 16px; text-align: center; color: #94a3b8; font-size: 12px; }
.no-data .mdi { font-size: 24px; }

/* GL Summary */
.gl-summary { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.gl-sum-item { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; }
.gl-sum-sep  { color: #e2e8f0; }
.gl-balance-chip { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }
.debit-txt  { color: #be123c; }
.credit-txt { color: #16a34a; }

/* GL Table */
.table-wrap { overflow-x: auto; }
.gl-table   { width: 100%; border-collapse: collapse; }
.gl-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.gl-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
.gl-table .text-right { text-align: right !important; }
.gl-row { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.gl-row:hover { background: #f8fafc; }
.gl-row:last-child { border-bottom: none; }
.gl-dr { border-left: 2px solid rgba(190,18,60,.12); }
.gl-cr { border-left: 2px solid rgba(22,163,74,.12); }
.gl-table td { padding: 11px 14px; vertical-align: middle; }
.gl-code     { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 700; color: #1142d4; background: rgba(17,66,212,.06); padding: 2px 7px; border-radius: 5px; }
.acc-name    { font-size: 12px; font-weight: 600; color: #1e293b; }
.acc-type-sub{ font-size: 10px; color: #94a3b8; margin-top: 1px; }
.mono-num    { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; }
.narration   { font-size: 11px; color: #64748b; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; }

/* Chips */
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; white-space: nowrap; text-transform: uppercase; letter-spacing: .05em; }
.chip-dot   { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-grey  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }

/* Error / Loading */
.tv-error   { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 20px; text-align: center; }
.empty-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 30px; }
.empty-title { font-size: 16px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 13px; color: #94a3b8; max-width: 300px; line-height: 1.5; }
.btn-back-inline { padding: 8px 20px; border-radius: 8px; background: #1142d4; color: #fff; border: none; font-size: 13px; font-weight: 700; cursor: pointer; }

/* Skeleton */
.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px; }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-header    { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
.skel-back      { height: 32px; width: 80px; border-radius: 8px; }
.skel-title     { height: 20px; width: 260px; }
.skel-card-title { height: 14px; width: 120px; border-radius: 4px; }
.skel-line-lg   { height: 12px; width: 100%; border-radius: 4px; }
.skel-line-md   { height: 12px; width: 70%; border-radius: 4px; }
.skel-line-sm   { height: 10px; width: 50%; border-radius: 4px; }
.tv-loading .tv-body { display: flex; flex-direction: column; gap: 16px; }
.tv-grid.skel-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
.info-card.skel-card { padding: 20px; }

@media (max-width: 767px)  { .th-hide-sm { display: none; } }
</style>
