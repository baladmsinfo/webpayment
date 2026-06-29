<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Reconciliation</h1>
        <p class="page-sub">Monitor GL posting and transaction settlement matching</p>
      </div>
      <div class="header-actions">
        <button class="btn-trigger" @click="openRunModal">
          <span class="mdi mdi-play-circle-outline"></span>
          Run Batch
        </button>
        <button class="icon-btn" @click="refresh" :class="{ spinning: loading }">
          <span class="mdi mdi-refresh"></span>
        </button>
      </div>
    </div>

    <!-- ── Stats Strip ── -->
    <div class="stats-strip">
      <div class="stat-pill" v-for="s in statsStrip" :key="s.label" :style="{ '--c': s.color }">
        <span class="stat-pill-dot"></span>
        <span class="stat-pill-val">{{ s.value }}</span>
        <span class="stat-pill-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="tab-bar">
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'matched' }" @click="switchTab('matched')">
        <span class="mdi mdi-check-all"></span> Reconciled
      </button>
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'exceptions' }" @click="switchTab('exceptions')">
        <span class="mdi mdi-alert-circle-outline"></span> Unreconciled
      </button>
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'batches' }" @click="switchTab('batches')">
        <span class="mdi mdi-history"></span> Batch History
      </button>
    </div>

    <!-- ── Date Filter (shared) ── -->
    <div class="filter-card" v-if="activeTab !== 'batches'">
      <div class="filter-card-header">
        <div class="filter-title-wrap">
          <div class="filter-icon"><span class="mdi mdi-filter-outline"></span></div>
          <span class="filter-title">Filters</span>
        </div>
        <div class="filter-btns">
          <button class="btn-clear" @click="clearFilters">
            <span class="mdi mdi-close-circle-outline"></span>Clear
          </button>
          <button class="btn-apply" @click="applyFilters">
            <span class="mdi mdi-magnify"></span>Apply
          </button>
        </div>
      </div>
      <div class="filter-fields-row">
        <div class="filter-field-group">
          <label class="filter-label">From Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.from }">
            <span class="mdi mdi-calendar-start-outline filter-field-icon"></span>
            <input v-model="filters.fromDate" type="date" class="filter-input"
              @focus="focuses.from = true" @blur="focuses.from = false" />
          </div>
        </div>
        <div class="filter-field-group">
          <label class="filter-label">To Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.to }">
            <span class="mdi mdi-calendar-end-outline filter-field-icon"></span>
            <input v-model="filters.toDate" type="date" class="filter-input"
              @focus="focuses.to = true" @blur="focuses.to = false" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Matched / Reconciled Table ── -->
    <div class="table-card" v-show="activeTab === 'matched'">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Transaction ID</th>
              <th class="th-hide-sm">Payment Method</th>
              <th>Amount</th>
              <th class="th-hide-md">Net Settlement</th>
              <th>GL Posted</th>
              <th>Settled</th>
              <th class="th-hide-md">Reconciled At</th>
            </tr>
          </thead>
          <tbody v-if="loading">
            <tr v-for="n in limit" :key="'sk-'+n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td><div class="skel skel-line-lg"></div><div class="skel skel-line-sm mt-1"></div></td>
              <td class="th-hide-sm"><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-line-md"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(item, idx) in matched" :key="item.id" class="data-row">
              <td class="td-sno">{{ (page - 1) * limit + idx + 1 }}</td>
              <td>
                <div class="txn-id-cell">
                  <div class="txn-status-dot dot-green"></div>
                  <div>
                    <p class="txn-id">{{ item.transactionId }}</p>
                    <p class="txn-method-sub th-hide-lg">{{ item.transaction?.paymentMethod }}</p>
                  </div>
                </div>
              </td>
              <td class="th-hide-sm">
                <span class="chip chip-blue">{{ item.transaction?.paymentMethod || '—' }}</span>
              </td>
              <td><span class="amount-val">₹{{ fmtAmt(item.transaction?.amount) }}</span></td>
              <td class="th-hide-md"><span class="amount-val net-amt">₹{{ fmtAmt(item.transaction?.settlement?.netSettlement) }}</span></td>
              <td><span class="chip" :class="item.posted ? 'chip-green' : 'chip-amber'"><span class="chip-dot"></span>{{ item.posted ? 'Posted' : 'Pending' }}</span></td>
              <td><span class="chip" :class="item.settled ? 'chip-green' : 'chip-amber'"><span class="chip-dot"></span>{{ item.settled ? 'Settled' : 'Pending' }}</span></td>
              <td class="th-hide-md">
                <div class="date-cell" v-if="item.reconciledAt">
                  <span class="date-main">{{ formatDate(item.reconciledAt) }}</span>
                  <span class="date-time">{{ formatTime(item.reconciledAt) }}</span>
                </div>
                <span v-else class="text-muted">—</span>
              </td>
            </tr>
            <tr v-if="matched.length === 0">
              <td colspan="8" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-check-all"></span></div>
                  <p class="empty-title">No reconciled transactions</p>
                  <p class="empty-desc">Run a reconciliation batch to match GL entries with settlements</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">Showing {{ matched.length === 0 ? 0 : (page-1)*limit+1 }}–{{ Math.min(page*limit, total) }} of {{ total }}</span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="limitVal" @change="onLimitChange(limitVal)">
            <option v-for="n in [5,10,25,50]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="page <= 1" @click="onPageChange(page-1)"><span class="mdi mdi-chevron-left"></span></button>
          <template v-for="p in pageWindow" :key="p">
            <button class="pag-btn" :class="{ 'pag-btn-active': p === page }" @click="onPageChange(p)">{{ p }}</button>
          </template>
          <button class="pag-btn" :disabled="page >= totalPages" @click="onPageChange(page+1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <!-- ── Exceptions / Unreconciled Table ── -->
    <div class="table-card" v-show="activeTab === 'exceptions'">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Transaction ID</th>
              <th class="th-hide-sm">Merchant</th>
              <th>Amount</th>
              <th>GL Posted</th>
              <th>Settled</th>
              <th class="th-hide-md">Date</th>
            </tr>
          </thead>
          <tbody v-if="excLoading">
            <tr v-for="n in 5" :key="'esk-'+n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td><div class="skel skel-line-lg"></div></td>
              <td class="th-hide-sm"><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(item, idx) in exceptions" :key="item.id" class="data-row">
              <td class="td-sno">{{ idx + 1 }}</td>
              <td>
                <div class="txn-id-cell">
                  <div class="txn-status-dot dot-amber"></div>
                  <p class="txn-id">{{ item.transactionId }}</p>
                </div>
              </td>
              <td class="th-hide-sm"><p class="merchant-name">{{ item.transaction?.merchantId || '—' }}</p></td>
              <td><span class="amount-val">₹{{ fmtAmt(item.transaction?.amount) }}</span></td>
              <td><span class="chip" :class="item.posted ? 'chip-green' : 'chip-red'"><span class="chip-dot"></span>{{ item.posted ? 'Yes' : 'No' }}</span></td>
              <td><span class="chip" :class="item.settled ? 'chip-green' : 'chip-red'"><span class="chip-dot"></span>{{ item.settled ? 'Yes' : 'No' }}</span></td>
              <td class="th-hide-md">
                <div class="date-cell">
                  <span class="date-main">{{ formatDate(item.transaction?.createdAt) }}</span>
                </div>
              </td>
            </tr>
            <tr v-if="exceptions.length === 0">
              <td colspan="7" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-check-circle-outline"></span></div>
                  <p class="empty-title">No exceptions found</p>
                  <p class="empty-desc">All transactions are fully reconciled</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">Showing {{ exceptions.length }} unreconciled records</span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="excLimitVal" @change="onExcLimitChange(excLimitVal)">
            <option v-for="n in [5,10,25,50]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="excPage <= 1" @click="onExcPageChange(excPage-1)"><span class="mdi mdi-chevron-left"></span></button>
          <template v-for="p in excPageWindow" :key="p">
            <button class="pag-btn" :class="{ 'pag-btn-active': p === excPage }" @click="onExcPageChange(p)">{{ p }}</button>
          </template>
          <button class="pag-btn" :disabled="excPage >= excTotalPages" @click="onExcPageChange(excPage+1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <!-- ── Batch History Table ── -->
    <div class="table-card" v-show="activeTab === 'batches'">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Batch Ref</th>
              <th class="th-hide-sm">Date Range</th>
              <th>Total</th>
              <th class="th-hide-md">Matched</th>
              <th class="th-hide-md">Exceptions</th>
              <th>Status</th>
              <th class="th-hide-md">Run At</th>
            </tr>
          </thead>
          <tbody v-if="batchLoading">
            <tr v-for="n in 5" :key="'bsk-'+n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td><div class="skel skel-line-lg"></div></td>
              <td class="th-hide-sm"><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-line-sm"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-sm"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-sm"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(b, idx) in batchHistory" :key="b.id" class="data-row">
              <td class="td-sno">{{ (batchPage-1)*batchLimit + idx + 1 }}</td>
              <td><p class="txn-id">{{ b.batchRef }}</p></td>
              <td class="th-hide-sm">
                <p class="date-main">{{ formatDate(b.fromDate) }} → {{ formatDate(b.toDate) }}</p>
              </td>
              <td><span class="amount-val">{{ b.totalTxns ?? 0 }}</span></td>
              <td class="th-hide-md"><span class="amount-val">{{ b.matchedCount ?? 0 }}</span></td>
              <td class="th-hide-md">
                <span class="amount-val" :class="{ 'text-danger': (b.exceptionCount ?? 0) > 0 }">{{ b.exceptionCount ?? 0 }}</span>
              </td>
              <td>
                <span class="chip" :class="batchChip(b.status)">
                  <span class="chip-dot"></span>{{ b.status }}
                </span>
              </td>
              <td class="th-hide-md">
                <div class="date-cell">
                  <span class="date-main">{{ formatDate(b.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(b.createdAt) }}</span>
                </div>
              </td>
            </tr>
            <tr v-if="batchHistory.length === 0">
              <td colspan="8" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-history"></span></div>
                  <p class="empty-title">No batch runs yet</p>
                  <p class="empty-desc">Click "Run Batch" to start a reconciliation run</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">Showing {{ batchHistory.length === 0 ? 0 : (batchPage-1)*batchLimit+1 }}–{{ Math.min(batchPage*batchLimit, batchTotal) }} of {{ batchTotal }}</span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="batchLimitVal" @change="onBatchLimitChange(batchLimitVal)">
            <option v-for="n in [5,10,25,50]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="batchPage <= 1" @click="onBatchPageChange(batchPage-1)"><span class="mdi mdi-chevron-left"></span></button>
          <template v-for="p in batchPageWindow" :key="p">
            <button class="pag-btn" :class="{ 'pag-btn-active': p === batchPage }" @click="onBatchPageChange(p)">{{ p }}</button>
          </template>
          <button class="pag-btn" :disabled="batchPage >= batchTotalPages" @click="onBatchPageChange(batchPage+1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <!-- ── Run Batch Modal ── -->
    <div class="modal-overlay" v-if="runModal" @click.self="runModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <span class="modal-title">Run Reconciliation Batch</span>
          <button class="modal-close" @click="runModal = false"><span class="mdi mdi-close"></span></button>
        </div>
        <div class="modal-body">
          <p class="modal-hint">Reconciles all settled transactions in the selected date window. GL entries are matched against settlement records.</p>
          <div class="modal-field">
            <label class="filter-label">From Date <span class="required">*</span></label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.from }">
              <span class="mdi mdi-calendar-start-outline filter-field-icon"></span>
              <input v-model="runForm.fromDate" type="date" class="filter-input"
                @focus="mFocuses.from = true" @blur="mFocuses.from = false" />
            </div>
          </div>
          <div class="modal-field">
            <label class="filter-label">To Date <span class="required">*</span></label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.to }">
              <span class="mdi mdi-calendar-end-outline filter-field-icon"></span>
              <input v-model="runForm.toDate" type="date" class="filter-input"
                @focus="mFocuses.to = true" @blur="mFocuses.to = false" />
            </div>
          </div>
          <div class="modal-field">
            <label class="filter-label">Remarks</label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.rem }">
              <span class="mdi mdi-text-short filter-field-icon"></span>
              <input v-model="runForm.remarks" class="filter-input" placeholder="Optional"
                @focus="mFocuses.rem = true" @blur="mFocuses.rem = false" />
            </div>
          </div>
          <div v-if="runResult" class="trigger-result" :class="runResult.ok ? 'result-ok' : 'result-err'">
            <span class="mdi" :class="runResult.ok ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
            {{ runResult.message }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-clear" @click="runModal = false">Cancel</button>
          <button class="btn-apply" @click="doRunBatch" :disabled="runLoading">
            <span v-if="runLoading" class="mdi mdi-loading spin-icon"></span>
            <span v-else class="mdi mdi-play-circle-outline"></span>
            {{ runLoading ? 'Running…' : 'Run Batch' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useReconciliationApi } from "@/composables/apis/useReconciliationApi";

const { getReconciliationStatus, getMatchedTransactions, getExceptions, getReconciliationBatches, runReconciliationBatch } = useReconciliationApi();

/* ── State ── */
const loading    = ref(false);
const excLoading = ref(false);
const batchLoading = ref(false);
const activeTab  = ref<'matched'|'exceptions'|'batches'>('matched');

const status   = ref<any>(null);
const matched  = ref<any[]>([]);
const exceptions = ref<any[]>([]);
const batchHistory = ref<any[]>([]);

const page = ref(1); const limit = ref(10); const limitVal = ref(10); const total = ref(0);
const excPage = ref(1); const excLimit = ref(10); const excLimitVal = ref(10); const excTotal = ref(0);
const batchPage = ref(1); const batchLimit = ref(10); const batchLimitVal = ref(10); const batchTotal = ref(0);

const focuses  = reactive({ from: false, to: false });
const mFocuses = reactive({ from: false, to: false, rem: false });
const filters  = ref({ fromDate: null as string|null, toDate: null as string|null });

const runModal   = ref(false);
const runLoading = ref(false);
const runResult  = ref<{ ok: boolean; message: string }|null>(null);
const runForm    = reactive({ fromDate: '', toDate: '', remarks: '' });

/* ── Helpers ── */
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : '';
const fmtAmt     = (v: any)    => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const statsStrip = computed(() => {
  const s = status.value;
  return [
    { label: 'Total',      value: s?.total      ?? 0, color: '#1142d4' },
    { label: 'Reconciled', value: s?.reconciled ?? 0, color: '#22c55e' },
    { label: 'Pending',    value: s?.pending    ?? 0, color: '#f59e0b' },
    { label: 'Exceptions', value: s?.exceptions ?? 0, color: '#ef4444' },
  ];
});

const batchChip = (s: string) => ({
  'chip-green': s === 'COMPLETED',
  'chip-amber': s === 'RUNNING',
  'chip-red':   s === 'FAILED',
  'chip-grey':  !['COMPLETED','RUNNING','FAILED'].includes(s),
});

/* ── Pagination ── */
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));
const pageWindow = computed(() => { const c = page.value, t = totalPages.value; const p: number[] = []; for (let i = Math.max(1,c-1); i <= Math.min(t,c+1); i++) p.push(i); return p; });
const excTotalPages  = computed(() => Math.max(1, Math.ceil(excTotal.value / excLimit.value)));
const excPageWindow  = computed(() => { const c = excPage.value, t = excTotalPages.value; const p: number[] = []; for (let i = Math.max(1,c-1); i <= Math.min(t,c+1); i++) p.push(i); return p; });
const batchTotalPages = computed(() => Math.max(1, Math.ceil(batchTotal.value / batchLimit.value)));
const batchPageWindow = computed(() => { const c = batchPage.value, t = batchTotalPages.value; const p: number[] = []; for (let i = Math.max(1,c-1); i <= Math.min(t,c+1); i++) p.push(i); return p; });

/* ── API ── */
async function loadStatus() {
  try { const res = await getReconciliationStatus(); status.value = res.data; } catch {}
}

async function loadMatched() {
  loading.value = true;
  try {
    const res = await getMatchedTransactions({ page: page.value, limit: limit.value, fromDate: filters.value.fromDate ?? undefined, toDate: filters.value.toDate ?? undefined });
    matched.value = res.data    || [];
    total.value   = res.meta?.total || 0;
  } finally { loading.value = false; }
}

async function loadExceptions() {
  excLoading.value = true;
  try {
    const res = await getExceptions({ page: excPage.value, limit: excLimit.value });
    exceptions.value = res.data?.unreconciled?.records || [];
    excTotal.value   = res.data?.unreconciled?.total   || 0;
  } finally { excLoading.value = false; }
}

async function loadBatches() {
  batchLoading.value = true;
  try {
    const res = await getReconciliationBatches({ page: batchPage.value, limit: batchLimit.value });
    batchHistory.value = res.data       || [];
    batchTotal.value   = res.meta?.total || 0;
  } finally { batchLoading.value = false; }
}

function switchTab(tab: 'matched'|'exceptions'|'batches') {
  activeTab.value = tab;
  if (tab === 'matched')    loadMatched();
  if (tab === 'exceptions') loadExceptions();
  if (tab === 'batches')    loadBatches();
}

async function refresh() {
  await Promise.all([loadStatus(), loadMatched()]);
}

function applyFilters() { page.value = 1; if (activeTab.value === 'matched') loadMatched(); }
function clearFilters()  { filters.value = { fromDate: null, toDate: null }; applyFilters(); }
function onPageChange(p: number)  { page.value = p; loadMatched(); }
function onLimitChange(l: number) { limit.value = l; page.value = 1; loadMatched(); }
function onExcPageChange(p: number)  { excPage.value = p; loadExceptions(); }
function onExcLimitChange(l: number) { excLimit.value = l; excPage.value = 1; loadExceptions(); }
function onBatchPageChange(p: number)  { batchPage.value = p; loadBatches(); }
function onBatchLimitChange(l: number) { batchLimit.value = l; batchPage.value = 1; loadBatches(); }

function openRunModal() {
  runResult.value = null;
  const today = new Date().toISOString().slice(0, 10);
  runForm.fromDate = today;
  runForm.toDate   = today;
  runForm.remarks  = '';
  runModal.value   = true;
}

async function doRunBatch() {
  if (!runForm.fromDate || !runForm.toDate) return;
  runLoading.value = true;
  runResult.value  = null;
  try {
    const res = await runReconciliationBatch({ fromDate: runForm.fromDate, toDate: runForm.toDate, remarks: runForm.remarks });
    if (res.statusCode === '00') {
      runResult.value = { ok: true, message: `Batch complete: ${res.data?.matched ?? 0} matched, ${res.data?.exceptions ?? 0} exceptions` };
      loadStatus();
      loadMatched();
    } else {
      runResult.value = { ok: false, message: res.message || 'Batch failed' };
    }
  } catch (e: any) {
    runResult.value = { ok: false, message: e?.response?.data?.message || 'Network error' };
  } finally { runLoading.value = false; }
}

onMounted(() => { loadStatus(); loadMatched(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.page-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 14px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title  { font-size: 20px; font-weight: 800; color: #0f172a; }
@media(min-width:640px){ .page-title { font-size: 24px; } }
.page-sub    { font-size: 12px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 8px; }
.btn-trigger { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 9px; background: linear-gradient(135deg,#059669,#047857); color: #fff; border: none; font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; box-shadow: 0 3px 12px rgba(5,150,105,.25); transition: filter .13s; }
.btn-trigger:hover { filter: brightness(1.08); }
.btn-trigger .mdi { font-size: 16px; }
.icon-btn { width: 36px; height: 36px; border-radius: 9px; background: #fff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #64748b; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: background .13s, color .13s; }
.icon-btn:hover { background: #f1f5f9; color: #1142d4; }
.icon-btn.spinning .mdi { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.stats-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.stat-pill { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e8edf3; padding: 6px 14px; border-radius: 9999px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.stat-pill-dot   { width: 7px; height: 7px; border-radius: 50%; background: var(--c,#1142d4); flex-shrink: 0; }
.stat-pill-val   { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.stat-pill-label { font-size: 11px; font-weight: 600; color: #64748b; }
.tab-bar { display: flex; gap: 4px; background: #f1f5f9; border-radius: 10px; padding: 4px; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.tab-btn .mdi { font-size: 15px; }
.tab-active { background: #fff; color: #1142d4; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
.filter-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.filter-card-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.filter-title-wrap { display: flex; align-items: center; gap: 8px; }
.filter-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(17,66,212,.08); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.filter-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.filter-btns  { display: flex; gap: 8px; }
.btn-clear { display: flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .13s; }
.btn-clear:hover { border-color: #ef4444; color: #ef4444; background: #fff1f2; }
.btn-apply { display: flex; align-items: center; gap: 5px; padding: 7px 16px; border-radius: 8px; background: linear-gradient(135deg,#1142d4,#1654f8); color: #fff; border: none; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(17,66,212,.22); transition: filter .13s; }
.btn-apply:hover { filter: brightness(1.07); }
.btn-apply:disabled { opacity: .6; cursor: not-allowed; }
.filter-fields-row { display: grid; grid-template-columns: 1fr; gap: 12px; padding: 16px 18px; }
@media(min-width:640px) { .filter-fields-row { grid-template-columns: repeat(2,1fr); } }
.filter-field-group { display: flex; flex-direction: column; gap: 5px; }
.filter-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.filter-input-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 9px; padding: 0 10px; height: 42px; transition: border-color .15s, box-shadow .15s; }
.filter-input-wrap.focused { border-color: #1142d4; background: #fff; box-shadow: 0 0 0 3px rgba(17,66,212,.09); }
.filter-field-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.filter-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif; }
.filter-input::placeholder { color: #94a3b8; }
.filter-input[type="date"] { min-width: 0; }
.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.table-wrap  { overflow-x: auto; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th { padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
.th-sno { width: 56px; text-align: center; }
.data-row { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; vertical-align: middle; }
.td-sno { text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; font-family: 'DM Mono', monospace; }
.txn-id-cell { display: flex; align-items: center; gap: 8px; }
.txn-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.2); }
.dot-amber { background: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,.2); }
.txn-id        { font-family: 'DM Mono', monospace; font-size: 11px; color: #334155; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.txn-method-sub{ font-size: 10px; color: #94a3b8; margin-top: 2px; }
.merchant-name { font-size: 12px; font-weight: 700; color: #1e293b; }
.amount-val    { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; color: #0f172a; }
.net-amt       { color: #059669; }
.text-muted    { font-size: 12px; color: #94a3b8; }
.text-danger   { color: #be123c; }
.date-cell     { display: flex; flex-direction: column; gap: 2px; }
.date-main     { font-size: 12px; font-weight: 600; color: #334155; }
.date-time     { font-size: 11px; color: #94a3b8; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; white-space: nowrap; text-transform: uppercase; letter-spacing: .05em; }
.chip-dot   { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-grey  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }
.empty-td    { padding: 48px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon  { width: 60px; height: 60px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 280px; line-height: 1.5; }
.pagination-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
.pag-info { font-size: 12px; color: #64748b; font-weight: 500; }
.pag-controls { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.pag-limit { height: 32px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 11px; font-weight: 600; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; margin-right: 4px; }
.pag-btn { min-width: 32px; height: 32px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 700; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .13s; }
.pag-btn:hover:not(:disabled) { border-color: #1142d4; color: #1142d4; background: rgba(17,66,212,.05); }
.pag-btn:disabled { opacity: .4; cursor: not-allowed; }
.pag-btn-active { background: #1142d4 !important; color: #fff !important; border-color: #1142d4 !important; }
.pag-btn .mdi   { font-size: 16px; }
.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px; }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-row td { padding: 13px 14px; }
.skel-sm { height: 12px; width: 28px; }
.skel-line-lg { height: 12px; width: 160px; }
.skel-line-md { height: 12px; width: 100px; }
.skel-line-sm { height: 10px; width: 70px; }
.skel-chip { height: 20px; width: 64px; border-radius: 9999px; }
.mt-1 { margin-top: 4px; }
@media (max-width: 1023px) { .th-hide-md { display: none; } }
@media (max-width: 767px)  { .th-hide-sm { display: none; } }
@media (min-width: 768px)  { .th-hide-lg { display: none; } }
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.4); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-card    { background: #fff; border-radius: 16px; width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,.18); overflow: hidden; }
.modal-header  { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.modal-title   { font-size: 15px; font-weight: 800; color: #0f172a; }
.modal-close   { width: 30px; height: 30px; border-radius: 7px; border: none; background: #f1f5f9; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #64748b; transition: all .13s; }
.modal-close:hover { background: #fee2e2; color: #dc2626; }
.modal-body    { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.modal-footer  { display: flex; gap: 10px; justify-content: flex-end; padding: 14px 20px; border-top: 1px solid #f1f5f9; }
.modal-field   { display: flex; flex-direction: column; gap: 5px; }
.modal-hint    { font-size: 12px; color: #64748b; line-height: 1.5; background: #f8fafc; padding: 10px 12px; border-radius: 8px; border-left: 3px solid #1142d4; }
.required      { color: #ef4444; }
.trigger-result { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 9px; font-size: 12px; font-weight: 600; }
.result-ok  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.result-err { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.trigger-result .mdi { font-size: 16px; }
.spin-icon { animation: spin .7s linear infinite; }
</style>
