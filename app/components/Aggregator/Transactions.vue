<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Transactions</h1>
        <p class="page-sub">Monitor and filter all platform transactions</p>
      </div>
      <div class="header-actions">
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
          <div class="filter-icon">
            <span class="mdi mdi-filter-outline"></span>
          </div>
          <span class="filter-title">Filters</span>
        </div>
        <div class="filter-btns">
          <button class="btn-clear" @click="clearFilters">
            <span class="mdi mdi-close-circle-outline"></span>
            Clear
          </button>
          <button class="btn-apply" @click="applyFilters">
            <span class="mdi mdi-magnify"></span>
            Apply Filters
          </button>
        </div>
      </div>

      <div class="filter-fields">
        <!-- From Date -->
        <div class="filter-field-group">
          <label class="filter-label">From Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.from }">
            <span class="mdi mdi-calendar-start-outline filter-field-icon"></span>
            <input
              v-model="filters.fromDate"
              type="date"
              class="filter-input"
              @focus="focuses.from = true"
              @blur="focuses.from = false"
            />
          </div>
        </div>

        <!-- To Date -->
        <div class="filter-field-group">
          <label class="filter-label">To Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.to }">
            <span class="mdi mdi-calendar-end-outline filter-field-icon"></span>
            <input
              v-model="filters.toDate"
              type="date"
              class="filter-input"
              @focus="focuses.to = true"
              @blur="focuses.to = false"
            />
          </div>
        </div>

        <!-- Merchant Autocomplete -->
        <div class="filter-field-group filter-field-wide">
          <label class="filter-label">Merchant</label>
          <div class="merchant-dropdown-wrap">
            <div
              class="filter-input-wrap merchant-input-wrap"
              :class="{ focused: merchantDropOpen }"
              @click="merchantDropOpen = !merchantDropOpen"
            >
              <span class="mdi mdi-store-outline filter-field-icon"></span>
              <input
                v-model="merchantSearch"
                class="filter-input"
                placeholder="Search merchant…"
                @focus="merchantDropOpen = true"
                @input="merchantDropOpen = true"
                @blur="onMerchantBlur"
                autocomplete="off"
              />
              <button v-if="filters.merchantId" class="search-clear" @mousedown.prevent="clearMerchant">
                <span class="mdi mdi-close-circle"></span>
              </button>
              <span class="mdi mdi-chevron-down merchant-chevron" :class="{ open: merchantDropOpen }"></span>
            </div>

            <div class="merchant-drop" v-if="merchantDropOpen && filteredMerchants.length">
              <div
                class="merchant-drop-item"
                v-for="m in filteredMerchants"
                :key="m.id"
                @mousedown.prevent="selectMerchant(m)"
                :class="{ 'drop-item-active': filters.merchantId === m.id }"
              >
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

    <!-- ── Toolbar (search + status filter) ── -->
    <div class="toolbar">
      <div class="search-wrap" :class="{ focused: searchFocused }">
        <span class="mdi mdi-magnify search-icon"></span>
        <input
          v-model="search"
          class="search-input"
          placeholder="Search by transaction ID or merchant…"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <span class="mdi mdi-close-circle"></span>
        </button>
      </div>
      <select class="filter-select" v-model="filterStatus">
        <option value="">All Statuses</option>
        <option value="SUCCESS">Success</option>
        <option value="FAILED">Failed</option>
        <option value="PENDING">Pending</option>
      </select>
    </div>

    <!-- ── Table Card ── -->
    <div class="table-card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Transaction ID</th>
              <th class="th-hide-sm">Merchant</th>
              <th class="th-hide-md">Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th class="th-hide-md">Date</th>
              <th class="th-action">Action</th>
            </tr>
          </thead>

          <!-- Skeleton -->
          <tbody v-if="loading">
            <tr v-for="n in limit" :key="'sk-' + n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td>
                <div class="skel skel-line-lg"></div>
                <div class="skel skel-line-sm mt-1"></div>
              </td>
              <td class="th-hide-sm">
                <div class="skel-merchant">
                  <div class="skel skel-avatar"></div>
                  <div>
                    <div class="skel skel-line-md"></div>
                    <div class="skel skel-line-sm mt-1"></div>
                  </div>
                </div>
              </td>
              <td class="th-hide-md"><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-md">
                <div class="skel skel-line-md"></div>
                <div class="skel skel-line-sm mt-1"></div>
              </td>
              <td><div class="skel skel-btn"></div></td>
            </tr>
          </tbody>

          <!-- Data -->
          <tbody v-else>
            <tr
              v-for="(item, idx) in filteredTxns"
              :key="item.id"
              class="data-row"
            >
              <!-- S.No -->
              <td class="td-sno">{{ (page - 1) * limit + idx + 1 }}</td>

              <!-- Transaction ID -->
              <td>
                <div class="txn-id-cell">
                  <div class="txn-status-dot" :class="txnDotClass(item.status)"></div>
                  <div>
                    <p class="txn-id">{{ item.id }}</p>
                    <p class="txn-method-sub th-hide-lg">{{ item.paymentMethod }}</p>
                  </div>
                </div>
              </td>

              <!-- Merchant -->
              <td class="th-hide-sm">
                <div class="merchant-cell">
                  <div class="merchant-avatar" :style="{ background: avatarColor(item.merchant?.legal_name || '?') }">
                    {{ initials(item.merchant?.legal_name || '?') }}
                  </div>
                  <div>
                    <p class="merchant-name">{{ item.merchant?.legal_name || '—' }}</p>
                    <p class="merchant-mid">{{ item.merchant?.mid || '—' }}</p>
                  </div>
                </div>
              </td>

              <!-- Method -->
              <td class="th-hide-md">
                <span class="chip chip-blue">{{ item.paymentMethod }}</span>
              </td>

              <!-- Amount -->
              <td>
                <span class="amount-val">₹{{ Number(item.amount).toLocaleString('en-IN') }}</span>
              </td>

              <!-- Status -->
              <td>
                <span class="chip" :class="statusClass(item.status)">
                  <span class="chip-dot"></span>
                  {{ item.status }}
                </span>
              </td>

              <!-- Date -->
              <td class="th-hide-md">
                <div class="date-cell">
                  <span class="date-main">{{ formatDate(item.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(item.createdAt) }}</span>
                </div>
              </td>

              <!-- Action -->
              <td>
                <button
                  class="btn-view"
                  @click.stop="goToMerchant(item)"
                  :disabled="!item.merchant?.id"
                  title="View Merchant"
                >
                  <span class="mdi mdi-arrow-top-right"></span>
                </button>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="filteredTxns.length === 0">
              <td colspan="8" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon">
                    <span class="mdi mdi-swap-horizontal"></span>
                  </div>
                  <p class="empty-title">No transactions found</p>
                  <p class="empty-desc">Try adjusting the date range, merchant filter, or search query</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Pagination ── -->
      <div class="pagination-bar">
        <span class="pag-info">
          Showing
          {{ filteredTxns.length === 0 ? 0 : (page - 1) * limit + 1 }}–{{ Math.min(page * limit, total) }}
          of {{ total }}
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

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from "vue";
import { useAggregatorApi } from "@/composables/apis/useAggregatorApi";
import { useRouter } from "vue-router";

const router = useRouter();
const { getAllAggregatorTransactions, getMerchants } = useAggregatorApi();

definePageMeta({ layout: 'aggregatorlayer', middleware: 'auth' });

/* ── State ── */
const loading      = ref(false);
const transactions = ref<any[]>([]);
const merchants    = ref<any[]>([]);
const page         = ref(1);
const limit        = ref(10);
const limitVal     = ref(limit.value);
const total        = ref(0);
const search        = ref('');
const searchFocused = ref(false);
const filterStatus  = ref('');
const merchantSearch   = ref('');
const merchantDropOpen = ref(false);
const focuses = reactive({ from: false, to: false });

const filters = ref({
  fromDate:   null as string | null,
  toDate:     null as string | null,
  merchantId: null as string | null,
});

/* ── Helpers ── */
const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor = (n: string) => AVATAR_COLORS[((n||'?').charCodeAt(0)) % AVATAR_COLORS.length];
const initials    = (n: string) => (n||'?').split(' ').map((w:string) => w[0]).slice(0,2).join('').toUpperCase();

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

const normalizeDate = (date: string | null, end = false) => {
  if (!date) return undefined;
  return end ? `${date}T23:59:59.999` : `${date}T00:00:00.000`;
};

const statusClass = (s: string) => ({
  'chip-green': s === 'SUCCESS',
  'chip-red':   s === 'FAILED',
  'chip-amber': s === 'PENDING',
  'chip-grey':  !['SUCCESS','FAILED','PENDING'].includes(s),
});
const txnDotClass = (s: string) => ({
  'dot-green': s === 'SUCCESS',
  'dot-red':   s === 'FAILED',
  'dot-amber': s === 'PENDING',
  'dot-grey':  !['SUCCESS','FAILED','PENDING'].includes(s),
});

/* ── Merchant dropdown ── */
const filteredMerchants = computed(() => {
  const q = merchantSearch.value.toLowerCase();
  if (!q) return merchants.value.slice(0, 40);
  return merchants.value.filter((m: any) =>
    (m.legal_name||'').toLowerCase().includes(q) || (m.mid||'').toLowerCase().includes(q)
  ).slice(0, 20);
});

function selectMerchant(m: any) {
  filters.value.merchantId = m.id;
  merchantSearch.value     = m.legal_name;
  merchantDropOpen.value   = false;
}
function clearMerchant() {
  filters.value.merchantId = null;
  merchantSearch.value     = '';
}
function onMerchantBlur() {
  setTimeout(() => { merchantDropOpen.value = false; }, 150);
}

/* ── Filtered list (client-side on current page) ── */
const filteredTxns = computed(() => {
  let list = transactions.value;
  const q  = search.value.toLowerCase();
  if (q) list = list.filter((t: any) =>
    (t.id||'').toLowerCase().includes(q) ||
    (t.merchant?.legal_name||'').toLowerCase().includes(q) ||
    (t.merchant?.mid||'').toLowerCase().includes(q)
  );
  if (filterStatus.value) list = list.filter((t: any) => t.status === filterStatus.value);
  return list;
});

/* ── Stats ── */
const statsStrip = computed(() => {
  const all = transactions.value;
  const success = all.filter((t:any) => t.status === 'SUCCESS');
  const failed  = all.filter((t:any) => t.status === 'FAILED');
  const pending = all.filter((t:any) => t.status === 'PENDING');
  const totalAmt = success.reduce((s:number, t:any) => s + Number(t.amount || 0), 0);
  return [
    { label: 'Total',    value: total.value,          color: '#1142d4' },
    { label: 'Success',  value: success.length,        color: '#22c55e' },
    { label: 'Failed',   value: failed.length,         color: '#ef4444' },
    { label: 'Pending',  value: pending.length,        color: '#f59e0b' },
    { label: 'Success Amt', value: `₹${totalAmt.toLocaleString('en-IN')}`, color: '#059669' },
  ];
});

/* ── Pagination ── */
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit.value)));
const pageWindow = computed(() => {
  const cur = page.value, tot = totalPages.value;
  const pages: number[] = [];
  for (let i = Math.max(1, cur - 1); i <= Math.min(tot, cur + 1); i++) pages.push(i);
  return pages;
});

/* ── API ── */
async function loadTransactions() {
  loading.value = true;
  try {
    const res = await getAllAggregatorTransactions({
      page: page.value, limit: limit.value,
      fromDate:   normalizeDate(filters.value.fromDate),
      toDate:     normalizeDate(filters.value.toDate, true),
      merchantId: filters.value.merchantId,
    });
    transactions.value = res.data  || [];
    total.value        = res.meta?.total || 0;
  } finally { loading.value = false; }
}

async function loadMerchants() {
  const res = await getMerchants({ page: "1", limit: "1000" });
  merchants.value = res.data || [];
}

async function refresh() { await loadTransactions(); }

function applyFilters() { page.value = 1; loadTransactions(); }
function clearFilters() {
  filters.value = { fromDate: null, toDate: null, merchantId: null };
  merchantSearch.value = '';
  page.value = 1;
  loadTransactions();
}

function onPageChange(p: number)  { page.value = p; loadTransactions(); }
function onLimitChange(l: number) { limit.value = l; page.value = 1; loadTransactions(); }

const goToMerchant = (item: any) => {
  if (!item.merchant?.id) return;
  router.push(`/aggregator/merchants/view/${item.merchant.id}`);
};

watch([page, limit], () => loadTransactions());

onMounted(() => { loadTransactions(); loadMerchants(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 14px; }

/* ── Header ── */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title  { font-size: 20px; font-weight: 800; color: #0f172a; }
@media(min-width:640px){ .page-title { font-size: 24px; } }
.page-sub    { font-size: 12px; color: #64748b; margin-top: 3px; }

.header-actions { display: flex; align-items: center; gap: 8px; }
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

/* ── Stats Strip ── */
.stats-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.stat-pill {
  display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1px solid #e8edf3;
  padding: 6px 14px; border-radius: 9999px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.stat-pill-dot   { width: 7px; height: 7px; border-radius: 50%; background: var(--c, #1142d4); flex-shrink: 0; }
.stat-pill-val   { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.stat-pill-label { font-size: 11px; font-weight: 600; color: #64748b; }

/* ── Filter Card ── */
.filter-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.filter-card-header {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
  padding: 14px 18px; border-bottom: 1px solid #f1f5f9;
}
.filter-title-wrap { display: flex; align-items: center; gap: 8px; }
.filter-icon {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(17,66,212,.08); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.filter-title { font-size: 13px; font-weight: 700; color: #0f172a; }

.filter-btns { display: flex; gap: 8px; }
.btn-clear {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  font-size: 12px; font-weight: 600; color: #64748b;
  font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .13s;
}
.btn-clear:hover { border-color: #ef4444; color: #ef4444; background: #fff1f2; }
.btn-clear .mdi  { font-size: 14px; }
.btn-apply {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 16px; border-radius: 8px;
  background: linear-gradient(135deg, #1142d4, #1654f8);
  color: #fff; border: none;
  font-size: 12px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  box-shadow: 0 3px 10px rgba(17,66,212,.22); transition: filter .13s;
}
.btn-apply:hover { filter: brightness(1.07); }
.btn-apply .mdi  { font-size: 14px; }

.filter-fields {
  display: grid; grid-template-columns: 1fr;
  gap: 12px; padding: 16px 18px;
}
@media(min-width:640px)  { .filter-fields { grid-template-columns: repeat(2, 1fr); } }
@media(min-width:1024px) { .filter-fields { grid-template-columns: 1fr 1fr 2fr; } }

.filter-field-group { display: flex; flex-direction: column; gap: 5px; }
.filter-field-wide  { }
.filter-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }

.filter-input-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 9px; padding: 0 10px; height: 42px;
  transition: border-color .15s, box-shadow .15s;
}
.filter-input-wrap.focused { border-color: #1142d4; background: #fff; box-shadow: 0 0 0 3px rgba(17,66,212,.09); }
.filter-field-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.filter-input {
  flex: 1; border: none; background: transparent;
  font-size: 13px; color: #334155; outline: none;
  font-family: 'DM Sans', sans-serif;
}
.filter-input::placeholder { color: #94a3b8; }
.filter-input[type="date"] { min-width: 0; }

/* Merchant dropdown */
.merchant-dropdown-wrap { position: relative; }
.merchant-input-wrap    { cursor: pointer; }
.merchant-chevron { font-size: 18px; color: #94a3b8; transition: transform .2s; flex-shrink: 0; }
.merchant-chevron.open  { transform: rotate(180deg); }

.merchant-drop {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,.1);
  max-height: 240px; overflow-y: auto;
}
.merchant-drop-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; cursor: pointer;
  transition: background .12s; border-bottom: 1px solid #f8fafc;
}
.merchant-drop-item:last-child { border-bottom: none; }
.merchant-drop-item:hover { background: #f8fafc; }
.drop-item-active { background: rgba(17,66,212,.05) !important; }
.drop-avatar {
  width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff;
}
.drop-name  { font-size: 12px; font-weight: 700; color: #1e293b; }
.drop-mid   { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; }
.drop-check { font-size: 15px; color: #1142d4; margin-left: auto; flex-shrink: 0; }

/* ── Toolbar ── */
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.search-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 0 12px; height: 40px;
  flex: 1; min-width: 200px; transition: border-color .15s, box-shadow .15s;
}
.search-wrap.focused { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.09); }
.search-icon  { font-size: 17px; color: #94a3b8; flex-shrink: 0; }
.search-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif; }
.search-input::placeholder { color: #94a3b8; }
.search-clear { background: none; border: none; cursor: pointer; font-size: 16px; color: #cbd5e1; display: flex; align-items: center; transition: color .13s; }
.search-clear:hover { color: #94a3b8; }
.filter-select {
  height: 40px; padding: 0 12px; border-radius: 9px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-size: 12px; font-weight: 600; color: #475569;
  font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; transition: border-color .15s;
}
.filter-select:focus { border-color: #1142d4; }

/* ── Table Card ── */
.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.table-wrap  { overflow-x: auto; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th {
  padding: 11px 14px; text-align: left;
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .08em; white-space: nowrap;
}
.th-sno    { width: 56px; text-align: center; }
.th-action { width: 56px; text-align: center; }

.data-row { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; vertical-align: middle; }

.td-sno { text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; font-family: 'DM Mono', monospace; }

/* Txn ID cell */
.txn-id-cell { display: flex; align-items: center; gap: 8px; }
.txn-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.2); }
.dot-red   { background: #ef4444; box-shadow: 0 0 0 2px rgba(239,68,68,.2); }
.dot-amber { background: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,.2); }
.dot-grey  { background: #94a3b8; }

.txn-id        { font-family: 'DM Mono', monospace; font-size: 11px; color: #334155; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.txn-method-sub{ font-size: 10px; color: #94a3b8; margin-top: 2px; }

/* Merchant cell */
.merchant-cell  { display: flex; align-items: center; gap: 10px; }
.merchant-avatar {
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff;
}
.merchant-name { font-size: 12px; font-weight: 700; color: #1e293b; white-space: nowrap; }
.merchant-mid  { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; margin-top: 1px; }

/* Amount */
.amount-val { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; color: #0f172a; }

/* Chips */
.chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 700; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .05em;
}
.chip-dot   { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-grey  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }

/* Date */
.date-cell { display: flex; flex-direction: column; gap: 2px; }
.date-main { font-size: 12px; font-weight: 600; color: #334155; }
.date-time { font-size: 11px; color: #94a3b8; }

/* Action */
.btn-view {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #64748b; cursor: pointer; margin: 0 auto;
  transition: all .13s;
}
.btn-view:hover:not(:disabled) { background: #1142d4; color: #fff; border-color: #1142d4; }
.btn-view:disabled { opacity: .35; cursor: not-allowed; }

/* Empty */
.empty-td { padding: 48px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 28px;
}
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 280px; line-height: 1.5; }

/* ── Pagination ── */
.pagination-bar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px; padding: 12px 16px; border-top: 1px solid #f1f5f9;
}
.pag-info { font-size: 12px; color: #64748b; font-weight: 500; }
.pag-controls { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.pag-limit {
  height: 32px; padding: 0 8px; border-radius: 7px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  font-size: 11px; font-weight: 600; color: #475569;
  font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; margin-right: 4px;
}
.pag-btn {
  min-width: 32px; height: 32px; padding: 0 8px; border-radius: 7px;
  border: 1px solid #e2e8f0; background: #fff;
  font-size: 12px; font-weight: 700; color: #475569;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .13s;
}
.pag-btn:hover:not(:disabled) { border-color: #1142d4; color: #1142d4; background: rgba(17,66,212,.05); }
.pag-btn:disabled { opacity: .4; cursor: not-allowed; }
.pag-btn-active { background: #1142d4 !important; color: #fff !important; border-color: #1142d4 !important; }
.pag-btn .mdi   { font-size: 16px; }

/* ── Responsive ── */
@media (max-width: 1023px) { .th-hide-md  { display: none; } }
@media (max-width: 767px)  { .th-hide-sm  { display: none; } }
@media (min-width: 768px)  { .th-hide-lg  { display: none; } }

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px;
}
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-row td   { padding: 13px 14px; }
.skel-sm       { height: 12px; width: 28px; }
.skel-avatar   { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; }
.skel-line-lg  { height: 12px; width: 160px; }
.skel-line-md  { height: 12px; width: 100px; }
.skel-line-sm  { height: 10px; width: 70px; }
.skel-chip     { height: 20px; width: 64px; border-radius: 9999px; }
.skel-btn      { height: 30px; width: 30px; border-radius: 8px; margin: 0 auto; }
.skel-merchant { display: flex; align-items: center; gap: 10px; }
.mt-1          { margin-top: 4px; }
</style>