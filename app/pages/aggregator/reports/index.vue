<template>
  <div class="rpt-root">

    <!-- Header -->
    <div class="rpt-header">
      <div>
        <h1 class="rpt-title">GL Reports</h1>
        <p class="rpt-sub">Double-entry ledger · Source of truth</p>
      </div>
      <div class="header-right">
        <!-- Date range -->
        <div class="date-row">
          <input type="date" v-model="fromDate" class="date-input" />
          <span class="date-sep">→</span>
          <input type="date" v-model="toDate" class="date-input" />
          <button class="apply-btn" @click="loadAll">Apply</button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="mdi" :class="tab.icon"></span>
        {{ tab.label }}
      </button>
    </div>

    <!-- ── Tab: DMT Summary ── -->
    <div v-if="activeTab === 'dmt'" class="tab-content">
      <div v-if="dmt.loading" class="loading-wrap"><div class="spinner"></div></div>
      <div v-else-if="dmt.error" class="error-box">{{ dmt.error }}</div>
      <template v-else-if="dmt.data">
        <div class="kpi-row">
          <div class="kpi" style="--c:#1142d4">
            <p class="kpi-label">Total Transactions</p>
            <p class="kpi-val">{{ dmt.data.total }}</p>
          </div>
          <div class="kpi" style="--c:#059669">
            <p class="kpi-label">Success</p>
            <p class="kpi-val">{{ dmt.data.success }}</p>
          </div>
          <div class="kpi" style="--c:#ef4444">
            <p class="kpi-label">Failed</p>
            <p class="kpi-val">{{ dmt.data.failed }}</p>
          </div>
          <div class="kpi" style="--c:#d97706">
            <p class="kpi-label">Pending</p>
            <p class="kpi-val">{{ dmt.data.pending }}</p>
          </div>
          <div class="kpi" style="--c:#0891b2">
            <p class="kpi-label">Total Amount</p>
            <p class="kpi-val">₹{{ fmt(dmt.data.totalAmount) }}</p>
          </div>
          <div class="kpi" style="--c:#7c3aed">
            <p class="kpi-label">Total Fee</p>
            <p class="kpi-val">₹{{ fmt(dmt.data.totalFee) }}</p>
          </div>
          <div class="kpi" style="--c:#db2777">
            <p class="kpi-label">Total Commission</p>
            <p class="kpi-val">₹{{ fmt(dmt.data.totalCommission) }}</p>
          </div>
        </div>
        <p class="range-note">Period: {{ fmtDate(dmt.data.from) }} → {{ fmtDate(dmt.data.to) }}</p>
      </template>
    </div>

    <!-- ── Tab: Commission Summary ── -->
    <div v-if="activeTab === 'commission'" class="tab-content">
      <div v-if="comm.loading" class="loading-wrap"><div class="spinner"></div></div>
      <div v-else-if="comm.error" class="error-box">{{ comm.error }}</div>
      <template v-else-if="comm.data">
        <div class="kpi-row">
          <div class="kpi" style="--c:#1142d4">
            <p class="kpi-label">Snapshots</p>
            <p class="kpi-val">{{ comm.data.count }}</p>
          </div>
          <div class="kpi" style="--c:#7c3aed">
            <p class="kpi-label">Aggregator</p>
            <p class="kpi-val">₹{{ fmt(comm.data.aggregatorCommission) }}</p>
          </div>
          <div class="kpi" style="--c:#059669">
            <p class="kpi-label">Vendor</p>
            <p class="kpi-val">₹{{ fmt(comm.data.vendorCommission) }}</p>
          </div>
          <div class="kpi" style="--c:#d97706">
            <p class="kpi-label">Merchant</p>
            <p class="kpi-val">₹{{ fmt(comm.data.merchantCommission) }}</p>
          </div>
          <div class="kpi" style="--c:#0891b2">
            <p class="kpi-label">Super Dist.</p>
            <p class="kpi-val">₹{{ fmt(comm.data.superDistCommission) }}</p>
          </div>
          <div class="kpi" style="--c:#db2777">
            <p class="kpi-label">Platform Profit</p>
            <p class="kpi-val">₹{{ fmt(comm.data.platformProfit) }}</p>
          </div>
          <div class="kpi" style="--c:#ef4444">
            <p class="kpi-label">Bank Share</p>
            <p class="kpi-val">₹{{ fmt(comm.data.bankShare) }}</p>
          </div>
          <div class="kpi" style="--c:#64748b">
            <p class="kpi-label">GST</p>
            <p class="kpi-val">₹{{ fmt(comm.data.gst) }}</p>
          </div>
        </div>
        <div class="total-row">
          Total Commission: <strong>₹{{ fmt(comm.data.totalCommission) }}</strong>
        </div>
        <p class="range-note">Period: {{ fmtDate(comm.data.from) }} → {{ fmtDate(comm.data.to) }}</p>
      </template>
    </div>

    <!-- ── Tab: Settlement Position ── -->
    <div v-if="activeTab === 'settlement'" class="tab-content">
      <div v-if="settle.loading" class="loading-wrap"><div class="spinner"></div></div>
      <div v-else-if="settle.error" class="error-box">{{ settle.error }}</div>
      <template v-else-if="settle.data">
        <div class="settle-grid">

          <div class="settle-card">
            <div class="settle-title"><span class="mdi mdi-store-outline"></span> Merchant Settlement Payable <span class="acct-badge">2203</span></div>
            <div class="settle-row"><span>Credited (owed)</span><span class="cr-amt">₹{{ fmt(settle.data.merchantSettlementPayable.credited) }}</span></div>
            <div class="settle-row"><span>Debited (paid)</span><span class="dr-amt">₹{{ fmt(settle.data.merchantSettlementPayable.debited) }}</span></div>
            <div class="settle-row settle-balance"><span>Net Balance</span><span :class="settle.data.merchantSettlementPayable.balance >= 0 ? 'cr-amt' : 'dr-amt'">₹{{ fmt(settle.data.merchantSettlementPayable.balance) }}</span></div>
          </div>

          <div class="settle-card">
            <div class="settle-title"><span class="mdi mdi-factory"></span> Vendor Commission Payable <span class="acct-badge">2002</span></div>
            <div class="settle-row"><span>Credited (owed)</span><span class="cr-amt">₹{{ fmt(settle.data.vendorCommissionPayable.credited) }}</span></div>
            <div class="settle-row"><span>Debited (paid)</span><span class="dr-amt">₹{{ fmt(settle.data.vendorCommissionPayable.debited) }}</span></div>
            <div class="settle-row settle-balance"><span>Net Balance</span><span :class="settle.data.vendorCommissionPayable.balance >= 0 ? 'cr-amt' : 'dr-amt'">₹{{ fmt(settle.data.vendorCommissionPayable.balance) }}</span></div>
          </div>

          <div class="settle-card">
            <div class="settle-title"><span class="mdi mdi-account-group-outline"></span> Aggregator Commission Payable <span class="acct-badge">2003</span></div>
            <div class="settle-row"><span>Credited (owed)</span><span class="cr-amt">₹{{ fmt(settle.data.aggregatorCommissionPayable.credited) }}</span></div>
            <div class="settle-row"><span>Debited (paid)</span><span class="dr-amt">₹{{ fmt(settle.data.aggregatorCommissionPayable.debited) }}</span></div>
            <div class="settle-row settle-balance"><span>Net Balance</span><span :class="settle.data.aggregatorCommissionPayable.balance >= 0 ? 'cr-amt' : 'dr-amt'">₹{{ fmt(settle.data.aggregatorCommissionPayable.balance) }}</span></div>
          </div>

        </div>
        <div class="total-row">
          Total Payable: <strong>₹{{ fmt(settle.data.totalPayable) }}</strong>
        </div>
        <p class="range-note">Period: {{ fmtDate(settle.data.from) }} → {{ fmtDate(settle.data.to) }}</p>
      </template>
    </div>

    <!-- ── Tab: NSDL EMD Movement ── -->
    <div v-if="activeTab === 'emd'" class="tab-content">
      <div v-if="emd.loading" class="loading-wrap"><div class="spinner"></div></div>
      <div v-else-if="emd.error" class="error-box">{{ emd.error }}</div>
      <template v-else-if="emd.data">
        <div class="kpi-row">
          <div class="kpi" style="--c:#059669">
            <p class="kpi-label">Total Credits</p>
            <p class="kpi-val">₹{{ fmt(emd.data.totalCredits) }}</p>
          </div>
          <div class="kpi" style="--c:#ef4444">
            <p class="kpi-label">Total Debits</p>
            <p class="kpi-val">₹{{ fmt(emd.data.totalDebits) }}</p>
          </div>
          <div class="kpi" style="--c:#1142d4">
            <p class="kpi-label">Net Balance</p>
            <p class="kpi-val">₹{{ fmt(emd.data.netBalance) }}</p>
          </div>
          <div class="kpi" style="--c:#64748b">
            <p class="kpi-label">Entries</p>
            <p class="kpi-val">{{ emd.data.pagination.total }}</p>
          </div>
        </div>

        <!-- Ledger entries table -->
        <div class="table-wrap">
          <table class="ledger-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Narration</th>
                <th>Txn ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in emd.data.entries" :key="e.id" :class="e.entryType === 'CREDIT' ? 'row-cr' : 'row-dr'">
                <td class="mono-sm">{{ fmtDatetime(e.createdAt) }}</td>
                <td><span class="entry-badge" :class="e.entryType === 'CREDIT' ? 'badge-cr' : 'badge-dr'">{{ e.entryType }}</span></td>
                <td class="mono-sm">₹{{ fmt(e.amount) }}</td>
                <td class="narr-cell">{{ e.narration || '—' }}</td>
                <td class="mono-sm tid-cell">{{ e.transactionId || '—' }}</td>
              </tr>
              <tr v-if="!emd.data.entries.length">
                <td colspan="5" class="empty-row">No ledger entries for this period</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="emd.data.pagination.pages > 1">
          <button class="pg-btn" :disabled="emdPage <= 1" @click="emdPage--; loadEmd()">‹ Prev</button>
          <span class="pg-info">Page {{ emd.data.pagination.page }} / {{ emd.data.pagination.pages }}</span>
          <button class="pg-btn" :disabled="emdPage >= emd.data.pagination.pages" @click="emdPage++; loadEmd()">Next ›</button>
        </div>

        <p class="range-note">{{ emd.data.account }} · Period: {{ fmtDate(emd.data.from) }} → {{ fmtDate(emd.data.to) }}</p>
      </template>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAggregatorApi } from '~/composables/apis/useAggregatorApi';

definePageMeta({ layout: 'aggregatorlayer', middleware: 'auth' });

const { getReportDmtSummary, getReportCommissionSummary, getReportSettlementPosition, getReportNsdlEmdMovement } = useAggregatorApi();

const tabs = [
  { key: 'dmt',        label: 'DMT Summary',        icon: 'mdi-bank-transfer'       },
  { key: 'commission', label: 'Commission',          icon: 'mdi-percent'             },
  { key: 'settlement', label: 'Settlement Position', icon: 'mdi-bank-transfer-out'   },
  { key: 'emd',        label: 'NSDL EMD Pool',       icon: 'mdi-database-outline'    },
];

const activeTab = ref('dmt');
const emdPage   = ref(1);

// Default date range — current month
const now = new Date();
const fromDate = ref(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
const toDate   = ref(now.toISOString().split('T')[0]);

const dmt    = ref({ loading: false, error: null, data: null });
const comm   = ref({ loading: false, error: null, data: null });
const settle = ref({ loading: false, error: null, data: null });
const emd    = ref({ loading: false, error: null, data: null });

const params = () => ({ from: fromDate.value, to: toDate.value });

async function loadDmt() {
  dmt.value = { loading: true, error: null, data: null };
  try { dmt.value.data = await getReportDmtSummary(params()); }
  catch (e) { dmt.value.error = e?.message || 'Failed to load DMT summary'; }
  finally { dmt.value.loading = false; }
}

async function loadComm() {
  comm.value = { loading: true, error: null, data: null };
  try { comm.value.data = await getReportCommissionSummary(params()); }
  catch (e) { comm.value.error = e?.message || 'Failed to load commission summary'; }
  finally { comm.value.loading = false; }
}

async function loadSettle() {
  settle.value = { loading: true, error: null, data: null };
  try { settle.value.data = await getReportSettlementPosition(params()); }
  catch (e) { settle.value.error = e?.message || 'Failed to load settlement position'; }
  finally { settle.value.loading = false; }
}

async function loadEmd() {
  emd.value = { loading: true, error: null, data: null };
  try { emd.value.data = await getReportNsdlEmdMovement({ ...params(), page: emdPage.value, limit: 50 }); }
  catch (e) { emd.value.error = e?.message || 'Failed to load EMD movement'; }
  finally { emd.value.loading = false; }
}

async function loadAll() {
  emdPage.value = 1;
  await Promise.all([loadDmt(), loadComm(), loadSettle(), loadEmd()]);
}

const fmt = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const fmtDate     = (s) => s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const fmtDatetime = (s) => s ? new Date(s).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

onMounted(loadAll);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.rpt-root { font-family: 'DM Sans', sans-serif; padding: 20px 16px 60px; display: flex; flex-direction: column; gap: 16px; }

/* Header */
.rpt-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
.rpt-title { font-size: 22px; font-weight: 800; color: #0f172a; }
.rpt-sub   { font-size: 12px; color: #64748b; margin-top: 3px; }
.header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.date-row  { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.date-input { padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; font-family: 'DM Sans', sans-serif; color: #334155; outline: none; background: #fff; }
.date-input:focus { border-color: #1142d4; }
.date-sep  { font-size: 13px; color: #94a3b8; }
.apply-btn { padding: 7px 16px; background: #1142d4; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .13s; }
.apply-btn:hover { background: #0e35a8; }

/* Tabs */
.tabs { display: flex; gap: 6px; flex-wrap: wrap; border-bottom: 2px solid #e8edf3; padding-bottom: 0; }
.tab-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px; border: none; background: transparent;
  font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer;
  font-family: 'DM Sans', sans-serif; border-radius: 8px 8px 0 0;
  border-bottom: 3px solid transparent; margin-bottom: -2px;
  transition: color .13s, border-color .13s, background .13s;
}
.tab-btn:hover { background: #f8fafc; color: #1142d4; }
.tab-btn.active { color: #1142d4; border-bottom-color: #1142d4; background: rgba(17,66,212,.05); }
.tab-btn .mdi { font-size: 16px; }

/* Tab content */
.tab-content { display: flex; flex-direction: column; gap: 16px; }

/* KPI Row */
.kpi-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (min-width: 640px)  { .kpi-row { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .kpi-row { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1280px) { .kpi-row { grid-template-columns: repeat(7, 1fr); } }

.kpi {
  background: #fff; border: 1px solid #e8edf3; border-top: 3px solid var(--c, #1142d4);
  border-radius: 12px; padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.kpi-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 6px; }
.kpi-val   { font-size: 18px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Settlement cards */
.settle-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 768px) { .settle-grid { grid-template-columns: repeat(3, 1fr); } }

.settle-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 18px 20px; box-shadow: 0 1px 4px rgba(0,0,0,.04); display: flex; flex-direction: column; gap: 10px; }
.settle-title { font-size: 13px; font-weight: 700; color: #334155; display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.settle-title .mdi { font-size: 16px; color: #1142d4; }
.acct-badge { font-size: 10px; font-weight: 700; background: #ede9fe; color: #7c3aed; padding: 2px 8px; border-radius: 9999px; margin-left: auto; }
.settle-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #64748b; padding: 6px 0; border-bottom: 1px dashed #f1f5f9; }
.settle-row:last-child { border-bottom: none; }
.settle-balance { font-weight: 700; color: #0f172a; border-top: 1px solid #e8edf3; margin-top: 4px; padding-top: 10px; }
.cr-amt { color: #059669; font-weight: 700; font-family: 'DM Mono', monospace; }
.dr-amt { color: #ef4444; font-weight: 700; font-family: 'DM Mono', monospace; }

/* Total row */
.total-row { background: #f8fafc; border: 1px solid #e8edf3; border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #334155; }
.total-row strong { font-size: 18px; color: #1142d4; font-family: 'DM Mono', monospace; }

/* Range note */
.range-note { font-size: 11px; color: #94a3b8; }

/* Ledger table */
.table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid #e8edf3; }
.ledger-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.ledger-table th {
  background: #f8fafc; padding: 10px 14px; text-align: left;
  font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase;
  letter-spacing: .07em; border-bottom: 1px solid #e8edf3; white-space: nowrap;
}
.ledger-table td { padding: 9px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.ledger-table tr:last-child td { border-bottom: none; }
.row-cr { background: rgba(5,150,105,.02); }
.row-dr { background: rgba(239,68,68,.02); }
.entry-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }
.badge-cr { background: #f0fdf4; color: #15803d; }
.badge-dr { background: #fff1f2; color: #be123c; }
.mono-sm  { font-family: 'DM Mono', monospace; font-size: 11px; }
.narr-cell { max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #64748b; }
.tid-cell  { max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #94a3b8; }
.empty-row { text-align: center; color: #94a3b8; padding: 32px; }

/* Pagination */
.pagination { display: flex; align-items: center; gap: 12px; }
.pg-btn { padding: 7px 14px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600; color: #334155; cursor: pointer; transition: background .13s, color .13s; font-family: 'DM Sans', sans-serif; }
.pg-btn:hover:not(:disabled) { background: #f1f5f9; color: #1142d4; }
.pg-btn:disabled { opacity: .4; cursor: not-allowed; }
.pg-info { font-size: 12px; color: #64748b; }

/* Loading / error */
.loading-wrap { display: flex; align-items: center; justify-content: center; padding: 60px; }
.spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #1142d4; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.error-box { background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 14px 18px; color: #be123c; font-size: 13px; font-weight: 600; }
</style>
