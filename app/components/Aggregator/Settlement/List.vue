<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Settlement</h1>
        <p class="page-sub">Manage and trigger merchant settlement batches</p>
      </div>
      <div class="header-actions">
        <button class="btn-trigger" @click="openTriggerModal">
          <span class="mdi mdi-bank-transfer-out"></span>
          Trigger Batch
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

    <!-- ── Filter Card ── -->
    <div class="filter-card">
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
            <span class="mdi mdi-magnify"></span>Apply Filters
          </button>
        </div>
      </div>
      <div class="filter-fields">
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
        <div class="filter-field-group filter-field-wide">
          <label class="filter-label">Merchant</label>
          <div class="merchant-dropdown-wrap">
            <div class="filter-input-wrap merchant-input-wrap" :class="{ focused: merchantDropOpen }"
              @click="merchantDropOpen = !merchantDropOpen">
              <span class="mdi mdi-store-outline filter-field-icon"></span>
              <input v-model="merchantSearch" class="filter-input" placeholder="Search merchant…"
                @focus="merchantDropOpen = true" @input="merchantDropOpen = true"
                @blur="onMerchantBlur" autocomplete="off" />
              <button v-if="filters.merchantId" class="search-clear" @mousedown.prevent="clearMerchant">
                <span class="mdi mdi-close-circle"></span>
              </button>
              <span class="mdi mdi-chevron-down merchant-chevron" :class="{ open: merchantDropOpen }"></span>
            </div>
            <div class="merchant-drop" v-if="merchantDropOpen && filteredMerchants.length">
              <div class="merchant-drop-item" v-for="m in filteredMerchants" :key="m.id"
                @mousedown.prevent="selectMerchant(m)" :class="{ 'drop-item-active': filters.merchantId === m.id }">
                <div class="drop-avatar" :style="{ background: avatarColor(m.legal_name) }">
                  {{ initials(m.legal_name) }}
                </div>
                <div>
                  <p class="drop-name">{{ m.legal_name }}</p>
                  <p class="drop-mid">{{ m.mid }}</p>
                </div>
                <span v-if="filters.merchantId === m.id" class="mdi mdi-check drop-check"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="tab-bar">
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'pending' }" @click="activeTab = 'pending'">
        <span class="mdi mdi-clock-outline"></span> Pending Settlements
      </button>
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'batches' }" @click="switchToBatches">
        <span class="mdi mdi-layers-outline"></span> Settlement Batches
      </button>
    </div>

    <!-- ── Pending Settlements Table ── -->
    <div class="table-card" v-show="activeTab === 'pending'">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Transaction ID</th>
              <th class="th-hide-sm">Merchant</th>
              <th>Amount</th>
              <th class="th-hide-md">Commission</th>
              <th>Net Settlement</th>
              <th>Status</th>
              <th class="th-hide-md">Date</th>
              <th class="th-action">Action</th>
            </tr>
          </thead>
          <tbody v-if="loading">
            <tr v-for="n in limit" :key="'sk-' + n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td><div class="skel skel-line-lg"></div><div class="skel skel-line-sm mt-1"></div></td>
              <td class="th-hide-sm"><div class="skel-merchant"><div class="skel skel-avatar"></div><div><div class="skel skel-line-md"></div><div class="skel skel-line-sm mt-1"></div></div></div></td>
              <td><div class="skel skel-line-md"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-sm"></div></td>
              <td><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div><div class="skel skel-line-sm mt-1"></div></td>
              <td><div class="skel skel-btn"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(item, idx) in settlements" :key="item.id" class="data-row">
              <td class="td-sno">{{ (page - 1) * limit + idx + 1 }}</td>
              <td>
                <div class="txn-id-cell">
                  <div class="txn-status-dot" :class="stlDotClass(item.status)"></div>
                  <div>
                    <p class="txn-id">{{ item.transactionId }}</p>
                    <p class="txn-method-sub th-hide-lg">{{ item.transaction?.paymentMethod }}</p>
                  </div>
                </div>
              </td>
              <td class="th-hide-sm">
                <p class="merchant-name">{{ item.merchantId }}</p>
              </td>
              <td><span class="amount-val">₹{{ fmtAmt(item.amount) }}</span></td>
              <td class="th-hide-md"><span class="amount-small">₹{{ fmtAmt(item.commission) }}</span></td>
              <td><span class="amount-val net-amt">₹{{ fmtAmt(item.netSettlement) }}</span></td>
              <td>
                <span class="chip" :class="stlClass(item.status)">
                  <span class="chip-dot"></span>{{ item.status }}
                </span>
              </td>
              <td class="th-hide-md">
                <div class="date-cell">
                  <span class="date-main">{{ formatDate(item.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(item.createdAt) }}</span>
                </div>
              </td>
              <td>
                <button class="btn-view" @click="openStatusModal(item)" title="Update Status">
                  <span class="mdi mdi-pencil-outline"></span>
                </button>
              </td>
            </tr>
            <tr v-if="settlements.length === 0">
              <td colspan="9" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-bank-transfer"></span></div>
                  <p class="empty-title">No pending settlements</p>
                  <p class="empty-desc">All settlements are processed or use the trigger batch to begin</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">
          Showing {{ settlements.length === 0 ? 0 : (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }} of {{ total }}
        </span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="limitVal" @change="onLimitChange(limitVal)">
            <option v-for="n in [5, 10, 25, 50]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="page <= 1" @click="onPageChange(page - 1)">
            <span class="mdi mdi-chevron-left"></span>
          </button>
          <template v-for="p in pageWindow" :key="p">
            <button class="pag-btn" :class="{ 'pag-btn-active': p === page }" @click="onPageChange(p)">{{ p }}</button>
          </template>
          <button class="pag-btn" :disabled="page >= totalPages" @click="onPageChange(page + 1)">
            <span class="mdi mdi-chevron-right"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Batches Table ── -->
    <div class="table-card" v-show="activeTab === 'batches'">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Batch Ref</th>
              <th class="th-hide-sm">Triggered By</th>
              <th>Total</th>
              <th class="th-hide-md">Settled</th>
              <th class="th-hide-md">Failed</th>
              <th>Status</th>
              <th class="th-hide-md">Date</th>
            </tr>
          </thead>
          <tbody v-if="batchLoading">
            <tr v-for="n in 5" :key="'bsk-' + n" class="skel-row">
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
            <tr v-for="(b, idx) in batches" :key="b.id" class="data-row">
              <td class="td-sno">{{ (batchPage - 1) * batchLimit + idx + 1 }}</td>
              <td>
                <p class="txn-id">{{ b.batchRef }}</p>
                <p class="txn-method-sub">{{ b.remarks || '—' }}</p>
              </td>
              <td class="th-hide-sm"><span class="badge-user">{{ b.triggeredBy }}</span></td>
              <td><span class="amount-val">{{ b.totalCount }}</span></td>
              <td class="th-hide-md"><span class="amount-val">{{ b.settledCount ?? '—' }}</span></td>
              <td class="th-hide-md"><span class="amount-val">{{ b.failedCount ?? '—' }}</span></td>
              <td>
                <span class="chip" :class="stlClass(b.status)">
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
            <tr v-if="batches.length === 0">
              <td colspan="8" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-layers-outline"></span></div>
                  <p class="empty-title">No batches yet</p>
                  <p class="empty-desc">Trigger a settlement batch to see records here</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">Showing {{ batches.length === 0 ? 0 : (batchPage - 1) * batchLimit + 1 }}–{{ Math.min(batchPage * batchLimit, batchTotal) }} of {{ batchTotal }}</span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="batchLimitVal" @change="onBatchLimitChange(batchLimitVal)">
            <option v-for="n in [5, 10, 25, 50]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="batchPage <= 1" @click="onBatchPageChange(batchPage - 1)"><span class="mdi mdi-chevron-left"></span></button>
          <template v-for="p in batchPageWindow" :key="p">
            <button class="pag-btn" :class="{ 'pag-btn-active': p === batchPage }" @click="onBatchPageChange(p)">{{ p }}</button>
          </template>
          <button class="pag-btn" :disabled="batchPage >= batchTotalPages" @click="onBatchPageChange(batchPage + 1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <!-- ── Trigger Batch Modal ── -->
    <div class="modal-overlay" v-if="triggerModal" @click.self="triggerModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <span class="modal-title">Trigger Settlement Batch</span>
          <button class="modal-close" @click="triggerModal = false"><span class="mdi mdi-close"></span></button>
        </div>
        <div class="modal-body">
          <div class="modal-field">
            <label class="filter-label">From Date <span class="required">*</span></label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.from }">
              <span class="mdi mdi-calendar-start-outline filter-field-icon"></span>
              <input v-model="triggerForm.fromDate" type="date" class="filter-input"
                @focus="mFocuses.from = true" @blur="mFocuses.from = false" />
            </div>
          </div>
          <div class="modal-field">
            <label class="filter-label">To Date <span class="required">*</span></label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.to }">
              <span class="mdi mdi-calendar-end-outline filter-field-icon"></span>
              <input v-model="triggerForm.toDate" type="date" class="filter-input"
                @focus="mFocuses.to = true" @blur="mFocuses.to = false" />
            </div>
          </div>
          <div class="modal-field">
            <label class="filter-label">Remarks</label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.rem }">
              <span class="mdi mdi-text-short filter-field-icon"></span>
              <input v-model="triggerForm.remarks" class="filter-input" placeholder="Optional remarks"
                @focus="mFocuses.rem = true" @blur="mFocuses.rem = false" />
            </div>
          </div>
          <div v-if="triggerResult" class="trigger-result" :class="triggerResult.ok ? 'result-ok' : 'result-err'">
            <span class="mdi" :class="triggerResult.ok ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
            {{ triggerResult.message }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-clear" @click="triggerModal = false">Cancel</button>
          <button class="btn-apply" @click="doTriggerBatch" :disabled="triggerLoading">
            <span v-if="triggerLoading" class="mdi mdi-loading spin-icon"></span>
            <span v-else class="mdi mdi-send"></span>
            {{ triggerLoading ? 'Processing…' : 'Trigger Batch' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Status Update Modal ── -->
    <div class="modal-overlay" v-if="statusModal" @click.self="statusModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <span class="modal-title">Update Settlement Status</span>
          <button class="modal-close" @click="statusModal = false"><span class="mdi mdi-close"></span></button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">Settlement: <span class="mono">{{ selectedSettlement?.transactionId }}</span></p>
          <div class="modal-field">
            <label class="filter-label">New Status <span class="required">*</span></label>
            <select class="filter-select full-w" v-model="statusForm.status">
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILED">FAILED</option>
            </select>
          </div>
          <div class="modal-field">
            <label class="filter-label">Settlement Ref (UTR)</label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.ref }">
              <span class="mdi mdi-identifier filter-field-icon"></span>
              <input v-model="statusForm.settlementRef" class="filter-input" placeholder="Bank UTR / Reference"
                @focus="mFocuses.ref = true" @blur="mFocuses.ref = false" />
            </div>
          </div>
          <div class="modal-field">
            <label class="filter-label">Remarks</label>
            <div class="filter-input-wrap" :class="{ focused: mFocuses.srem }">
              <span class="mdi mdi-text-short filter-field-icon"></span>
              <input v-model="statusForm.remarks" class="filter-input" placeholder="Optional remarks"
                @focus="mFocuses.srem = true" @blur="mFocuses.srem = false" />
            </div>
          </div>
          <div v-if="statusResult" class="trigger-result" :class="statusResult.ok ? 'result-ok' : 'result-err'">
            <span class="mdi" :class="statusResult.ok ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
            {{ statusResult.message }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-clear" @click="statusModal = false">Cancel</button>
          <button class="btn-apply" @click="doUpdateStatus" :disabled="statusLoading">
            <span v-if="statusLoading" class="mdi mdi-loading spin-icon"></span>
            <span v-else class="mdi mdi-check"></span>
            {{ statusLoading ? 'Saving…' : 'Update Status' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useSettlementApi } from "@/composables/apis/useSettlementApi";
import { useAggregatorApi } from "@/composables/apis/useAggregatorApi";

const { getSettlementDashboard, getPendingSettlements, getSettlementBatches, triggerSettlementBatch, updateSettlementStatus } = useSettlementApi();
const { getMerchants } = useAggregatorApi();

/* ── State ── */
const loading    = ref(false);
const settlements = ref<any[]>([]);
const merchants   = ref<any[]>([]);
const page        = ref(1);
const limit       = ref(10);
const limitVal    = ref(10);
const total       = ref(0);

const batchLoading  = ref(false);
const batches       = ref<any[]>([]);
const batchPage     = ref(1);
const batchLimit    = ref(10);
const batchLimitVal = ref(10);
const batchTotal    = ref(0);

const dashboard = ref<any>(null);
const activeTab = ref<'pending' | 'batches'>('pending');

const merchantSearch   = ref('');
const merchantDropOpen = ref(false);
const focuses = reactive({ from: false, to: false });
const mFocuses = reactive({ from: false, to: false, rem: false, ref: false, srem: false });

const filters = ref({ fromDate: null as string | null, toDate: null as string | null, merchantId: null as string | null });

const triggerModal   = ref(false);
const triggerLoading = ref(false);
const triggerResult  = ref<{ ok: boolean; message: string } | null>(null);
const triggerForm    = reactive({ fromDate: '', toDate: '', remarks: '' });

const statusModal   = ref(false);
const statusLoading = ref(false);
const statusResult  = ref<{ ok: boolean; message: string } | null>(null);
const statusForm    = reactive({ status: 'SUCCESS', settlementRef: '', remarks: '' });
const selectedSettlement = ref<any>(null);

/* ── Helpers ── */
const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor = (n: string) => AVATAR_COLORS[((n||'?').charCodeAt(0)) % AVATAR_COLORS.length];
const initials    = (n: string) => (n||'?').split(' ').map((w:string)=>w[0]).slice(0,2).join('').toUpperCase();
const formatDate  = (d: string) => new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const formatTime  = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
const fmtAmt      = (v: any)    => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const stlClass = (s: string) => ({
  'chip-green': s === 'SUCCESS' || s === 'COMPLETED',
  'chip-red':   s === 'FAILED',
  'chip-amber': s === 'PENDING',
  'chip-blue':  s === 'PROCESSING' || s === 'PARTIALLY_SETTLED',
  'chip-grey':  !['SUCCESS','FAILED','PENDING','PROCESSING','COMPLETED','PARTIALLY_SETTLED'].includes(s),
});
const stlDotClass = (s: string) => ({
  'dot-green': s === 'SUCCESS',
  'dot-red':   s === 'FAILED',
  'dot-amber': s === 'PENDING',
  'dot-blue':  s === 'PROCESSING',
  'dot-grey':  !['SUCCESS','FAILED','PENDING','PROCESSING'].includes(s),
});

/* ── Merchant dropdown ── */
const filteredMerchants = computed(() => {
  const q = merchantSearch.value.toLowerCase();
  if (!q) return merchants.value.slice(0, 40);
  return merchants.value.filter((m:any) =>
    (m.legal_name||'').toLowerCase().includes(q) || (m.mid||'').toLowerCase().includes(q)
  ).slice(0, 20);
});
function selectMerchant(m: any) { filters.value.merchantId = m.id; merchantSearch.value = m.legal_name; merchantDropOpen.value = false; }
function clearMerchant()        { filters.value.merchantId = null; merchantSearch.value = ''; }
function onMerchantBlur()       { setTimeout(() => { merchantDropOpen.value = false; }, 150); }

/* ── Pagination ── */
const totalPages     = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));
const pageWindow     = computed(() => { const c = page.value, t = totalPages.value; const p: number[] = []; for (let i = Math.max(1,c-1); i <= Math.min(t,c+1); i++) p.push(i); return p; });
const batchTotalPages = computed(() => Math.max(1, Math.ceil(batchTotal.value / batchLimit.value)));
const batchPageWindow = computed(() => { const c = batchPage.value, t = batchTotalPages.value; const p: number[] = []; for (let i = Math.max(1,c-1); i <= Math.min(t,c+1); i++) p.push(i); return p; });

/* ── Stats ── */
const statsStrip = computed(() => {
  const d = dashboard.value;
  return [
    { label: 'Pending',        value: d?.pending ?? 0,                                        color: '#f59e0b' },
    { label: 'Today Settled',  value: `₹${fmtAmt(d?.today?.netSettlement ?? 0)}`,             color: '#22c55e' },
    { label: 'Month Settled',  value: `₹${fmtAmt(d?.thisMonth?.netSettlement ?? 0)}`,         color: '#1142d4' },
    { label: 'Today Count',    value: d?.today?.count ?? 0,                                    color: '#059669' },
  ];
});

/* ── API ── */
async function loadSettlements() {
  loading.value = true;
  try {
    const res = await getPendingSettlements({
      page: page.value, limit: limit.value,
      merchantId: filters.value.merchantId,
      fromDate:   filters.value.fromDate   ?? undefined,
      toDate:     filters.value.toDate     ?? undefined,
    });
    settlements.value = res.data    || [];
    total.value       = res.meta?.total || 0;
  } finally { loading.value = false; }
}

async function loadBatches() {
  batchLoading.value = true;
  try {
    const res = await getSettlementBatches({ page: batchPage.value, limit: batchLimit.value });
    batches.value    = res.data      || [];
    batchTotal.value = res.meta?.total || 0;
  } finally { batchLoading.value = false; }
}

async function loadDashboard() {
  try { const res = await getSettlementDashboard(); dashboard.value = res.data; } catch {}
}

async function loadMerchants() {
  try { const res = await getMerchants({ page: '1', limit: '1000' }); merchants.value = res.data || []; } catch {}
}

function switchToBatches() { activeTab.value = 'batches'; loadBatches(); }
async function refresh() { await Promise.all([loadSettlements(), loadDashboard()]); }
function applyFilters()  { page.value = 1; loadSettlements(); }
function clearFilters()  { filters.value = { fromDate: null, toDate: null, merchantId: null }; merchantSearch.value = ''; page.value = 1; loadSettlements(); }
function onPageChange(p: number)  { page.value = p; loadSettlements(); }
function onLimitChange(l: number) { limit.value = l; page.value = 1; loadSettlements(); }
function onBatchPageChange(p: number)  { batchPage.value = p; loadBatches(); }
function onBatchLimitChange(l: number) { batchLimit.value = l; batchPage.value = 1; loadBatches(); }

function openTriggerModal() {
  triggerResult.value = null;
  const today = new Date().toISOString().slice(0, 10);
  triggerForm.fromDate = today;
  triggerForm.toDate   = today;
  triggerForm.remarks  = '';
  triggerModal.value   = true;
}

async function doTriggerBatch() {
  if (!triggerForm.fromDate || !triggerForm.toDate) return;
  triggerLoading.value = true;
  triggerResult.value  = null;
  try {
    const res = await triggerSettlementBatch({ fromDate: triggerForm.fromDate, toDate: triggerForm.toDate, remarks: triggerForm.remarks });
    if (res.statusCode === '00') {
      triggerResult.value = { ok: true, message: `Batch triggered: ${res.data?.settled ?? 0} settled, ${res.data?.failed ?? 0} failed` };
      loadSettlements();
      loadDashboard();
    } else {
      triggerResult.value = { ok: false, message: res.message || 'Batch trigger failed' };
    }
  } catch (e: any) {
    triggerResult.value = { ok: false, message: e?.response?.data?.message || 'Network error' };
  } finally { triggerLoading.value = false; }
}

function openStatusModal(item: any) {
  selectedSettlement.value = item;
  statusForm.status        = item.status;
  statusForm.settlementRef = '';
  statusForm.remarks       = '';
  statusResult.value       = null;
  statusModal.value        = true;
}

async function doUpdateStatus() {
  if (!selectedSettlement.value) return;
  statusLoading.value = true;
  statusResult.value  = null;
  try {
    const res = await updateSettlementStatus(selectedSettlement.value.id, {
      status:        statusForm.status,
      settlementRef: statusForm.settlementRef || undefined,
      remarks:       statusForm.remarks       || undefined,
    });
    if (res.statusCode === '00') {
      statusResult.value = { ok: true, message: 'Status updated successfully' };
      loadSettlements();
      loadDashboard();
    } else {
      statusResult.value = { ok: false, message: res.message || 'Update failed' };
    }
  } catch (e: any) {
    statusResult.value = { ok: false, message: e?.response?.data?.message || 'Network error' };
  } finally { statusLoading.value = false; }
}

onMounted(() => { loadSettlements(); loadDashboard(); loadMerchants(); });
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

.btn-trigger {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 9px;
  background: linear-gradient(135deg, #1142d4, #1654f8);
  color: #fff; border: none;
  font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
  cursor: pointer; box-shadow: 0 3px 12px rgba(17,66,212,.25); transition: filter .13s;
}
.btn-trigger:hover { filter: brightness(1.08); }
.btn-trigger .mdi  { font-size: 16px; }

.icon-btn {
  width: 36px; height: 36px; border-radius: 9px;
  background: #fff; border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #64748b; cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: background .13s, color .13s;
}
.icon-btn:hover { background: #f1f5f9; color: #1142d4; }
.icon-btn.spinning .mdi { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.stats-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.stat-pill { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e8edf3; padding: 6px 14px; border-radius: 9999px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.stat-pill-dot   { width: 7px; height: 7px; border-radius: 50%; background: var(--c,#1142d4); flex-shrink: 0; }
.stat-pill-val   { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.stat-pill-label { font-size: 11px; font-weight: 600; color: #64748b; }

.filter-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.filter-card-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.filter-title-wrap  { display: flex; align-items: center; gap: 8px; }
.filter-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(17,66,212,.08); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.filter-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.filter-btns  { display: flex; gap: 8px; }
.btn-clear {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc;
  font-size: 12px; font-weight: 600; color: #64748b; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .13s;
}
.btn-clear:hover { border-color: #ef4444; color: #ef4444; background: #fff1f2; }
.btn-apply {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 16px; border-radius: 8px;
  background: linear-gradient(135deg,#1142d4,#1654f8); color: #fff; border: none;
  font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif;
  cursor: pointer; box-shadow: 0 3px 10px rgba(17,66,212,.22); transition: filter .13s;
}
.btn-apply:hover { filter: brightness(1.07); }
.btn-apply:disabled { opacity: .6; cursor: not-allowed; }

.filter-fields { display: grid; grid-template-columns: 1fr; gap: 12px; padding: 16px 18px; }
@media(min-width:640px)  { .filter-fields { grid-template-columns: repeat(2,1fr); } }
@media(min-width:1024px) { .filter-fields { grid-template-columns: 1fr 1fr 2fr; } }
.filter-field-group { display: flex; flex-direction: column; gap: 5px; }
.filter-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.filter-input-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 9px; padding: 0 10px; height: 42px; transition: border-color .15s, box-shadow .15s; }
.filter-input-wrap.focused { border-color: #1142d4; background: #fff; box-shadow: 0 0 0 3px rgba(17,66,212,.09); }
.filter-field-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.filter-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif; }
.filter-input::placeholder { color: #94a3b8; }
.filter-input[type="date"] { min-width: 0; }

.merchant-dropdown-wrap { position: relative; }
.merchant-input-wrap    { cursor: pointer; }
.merchant-chevron { font-size: 18px; color: #94a3b8; transition: transform .2s; flex-shrink: 0; }
.merchant-chevron.open { transform: rotate(180deg); }
.merchant-drop { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,.1); max-height: 240px; overflow-y: auto; }
.merchant-drop-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; cursor: pointer; transition: background .12s; border-bottom: 1px solid #f8fafc; }
.merchant-drop-item:last-child { border-bottom: none; }
.merchant-drop-item:hover { background: #f8fafc; }
.drop-item-active { background: rgba(17,66,212,.05) !important; }
.drop-avatar { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; }
.drop-name { font-size: 12px; font-weight: 700; color: #1e293b; }
.drop-mid  { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; }
.drop-check { font-size: 15px; color: #1142d4; margin-left: auto; flex-shrink: 0; }
.search-clear { background: none; border: none; cursor: pointer; font-size: 16px; color: #cbd5e1; display: flex; align-items: center; transition: color .13s; }

.tab-bar { display: flex; gap: 4px; background: #f1f5f9; border-radius: 10px; padding: 4px; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.tab-btn .mdi { font-size: 15px; }
.tab-active { background: #fff; color: #1142d4; box-shadow: 0 1px 4px rgba(0,0,0,.08); }

.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.table-wrap  { overflow-x: auto; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th { padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
.th-sno    { width: 56px; text-align: center; }
.th-action { width: 56px; text-align: center; }
.data-row  { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; vertical-align: middle; }
.td-sno { text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; font-family: 'DM Mono', monospace; }
.skel-merchant { display: flex; align-items: center; gap: 8px; }

.txn-id-cell { display: flex; align-items: center; gap: 8px; }
.txn-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.2); }
.dot-red   { background: #ef4444; box-shadow: 0 0 0 2px rgba(239,68,68,.2); }
.dot-amber { background: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,.2); }
.dot-blue  { background: #1142d4; box-shadow: 0 0 0 2px rgba(17,66,212,.2); }
.dot-grey  { background: #94a3b8; }
.txn-id        { font-family: 'DM Mono', monospace; font-size: 11px; color: #334155; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.txn-method-sub{ font-size: 10px; color: #94a3b8; margin-top: 2px; }
.merchant-name { font-size: 12px; font-weight: 700; color: #1e293b; }
.amount-val    { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; color: #0f172a; }
.amount-small  { font-family: 'DM Mono', monospace; font-size: 11px; color: #64748b; }
.net-amt       { color: #059669; }
.badge-user    { font-size: 11px; font-weight: 600; color: #1142d4; background: rgba(17,66,212,.07); padding: 2px 8px; border-radius: 5px; }
.mono          { font-family: 'DM Mono', monospace; font-size: 11px; }

.chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; white-space: nowrap; text-transform: uppercase; letter-spacing: .05em; }
.chip-dot   { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-grey  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }

.date-cell { display: flex; flex-direction: column; gap: 2px; }
.date-main { font-size: 12px; font-weight: 600; color: #334155; }
.date-time { font-size: 11px; color: #94a3b8; }

.btn-view { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #64748b; cursor: pointer; margin: 0 auto; transition: all .13s; }
.btn-view:hover { background: #1142d4; color: #fff; border-color: #1142d4; }

.empty-td { padding: 48px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon  { width: 60px; height: 60px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 280px; line-height: 1.5; }

.pagination-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
.pag-info     { font-size: 12px; color: #64748b; font-weight: 500; }
.pag-controls { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.pag-limit    { height: 32px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 11px; font-weight: 600; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; margin-right: 4px; }
.pag-btn      { min-width: 32px; height: 32px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 700; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .13s; }
.pag-btn:hover:not(:disabled) { border-color: #1142d4; color: #1142d4; background: rgba(17,66,212,.05); }
.pag-btn:disabled   { opacity: .4; cursor: not-allowed; }
.pag-btn-active     { background: #1142d4 !important; color: #fff !important; border-color: #1142d4 !important; }
.pag-btn .mdi       { font-size: 16px; }

.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px; }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-row td { padding: 13px 14px; }
.skel-sm      { height: 12px; width: 28px; }
.skel-avatar  { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; }
.skel-line-lg { height: 12px; width: 160px; }
.skel-line-md { height: 12px; width: 100px; }
.skel-line-sm { height: 10px; width: 70px; }
.skel-chip    { height: 20px; width: 64px; border-radius: 9999px; }
.skel-btn     { height: 28px; width: 28px; border-radius: 8px; margin: 0 auto; }
.mt-1         { margin-top: 4px; }

@media (max-width: 1023px) { .th-hide-md { display: none; } }
@media (max-width: 767px)  { .th-hide-sm { display: none; } }
@media (min-width: 768px)  { .th-hide-lg { display: none; } }

/* ── Modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.4); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-card    { background: #fff; border-radius: 16px; width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,.18); overflow: hidden; }
.modal-header  { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.modal-title   { font-size: 15px; font-weight: 800; color: #0f172a; }
.modal-close   { width: 30px; height: 30px; border-radius: 7px; border: none; background: #f1f5f9; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #64748b; transition: all .13s; }
.modal-close:hover { background: #fee2e2; color: #dc2626; }
.modal-body    { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.modal-footer  { display: flex; gap: 10px; justify-content: flex-end; padding: 14px 20px; border-top: 1px solid #f1f5f9; }
.modal-field   { display: flex; flex-direction: column; gap: 5px; }
.modal-desc    { font-size: 12px; color: #64748b; }
.required      { color: #ef4444; }
.filter-select { height: 42px; padding: 0 12px; border-radius: 9px; border: 1.5px solid #e2e8f0; background: #f8fafc; font-size: 13px; font-weight: 600; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; transition: border-color .15s; width: auto; }
.filter-select:focus { border-color: #1142d4; }
.full-w { width: 100%; }
.trigger-result { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 9px; font-size: 12px; font-weight: 600; }
.result-ok  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.result-err { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.trigger-result .mdi { font-size: 16px; }
.spin-icon { animation: spin .7s linear infinite; }
</style>
