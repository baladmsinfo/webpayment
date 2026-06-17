<template>
  <div class="page-root">

    <div class="page-header">
      <div>
        <h1 class="page-title">Transactions</h1>
        <p class="page-sub">{{ total.toLocaleString() }} total records</p>
      </div>
      <div class="header-badges">
        <div class="badge-pill badge-green">
          <span class="mdi mdi-check-circle-outline"></span>
          {{ successCount }} Success
        </div>
        <div class="badge-pill badge-red">
          <span class="mdi mdi-close-circle-outline"></span>
          {{ failedCount }} Failed
        </div>
        <div class="badge-pill badge-orange">
          <span class="mdi mdi-clock-outline"></span>
          {{ pendingCount }} Pending
        </div>
      </div>
    </div>

    <div class="filter-card">
      <div class="filter-card-header">
        <div class="filter-card-title">
          <span class="mdi mdi-filter-outline filter-title-icon"></span>
          Filters
        </div>
        <button class="btn-clear-all" @click="clearFilters">
          <span class="mdi mdi-refresh"></span> Reset
        </button>
      </div>

      <div class="filter-grid">
        <div class="filter-field">
          <label class="filter-label">From Date</label>
          <div class="input-wrap">
            <span class="mdi mdi-calendar-start input-icon"></span>
            <input v-model="filters.fromDate" type="date" class="filter-input" />
          </div>
        </div>

        <div class="filter-field">
          <label class="filter-label">To Date</label>
          <div class="input-wrap">
            <span class="mdi mdi-calendar-end input-icon"></span>
            <input v-model="filters.toDate" type="date" class="filter-input" />
          </div>
        </div>

        <div class="filter-actions">
          <button class="btn-apply" @click="applyFilters">
            <span class="mdi mdi-magnify"></span>
            Apply
          </button>
        </div>
      </div>
    </div>

    <div class="table-card">

      <div class="table-toolbar">
        <div class="search-wrap">
          <span class="mdi mdi-magnify search-icon"></span>
          <input v-model="searchQuery" class="search-input" placeholder="Search transaction ID…" />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <span class="mdi mdi-close"></span>
          </button>
        </div>
        <div class="toolbar-right">
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
          <button class="btn-refresh" :class="{ spinning: loading }" @click="loadTransactions">
            <span class="mdi mdi-refresh"></span>
          </button>
        </div>
      </div>

      <div class="table-wrap" v-if="!loading">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">#</th>
              <th>Transaction ID</th>
              <th class="th-hide-sm">Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th class="th-hide-md">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in displayedTransactions" :key="item.id" class="table-row">
              <td class="td-sno">{{ (page - 1) * limit + index + 1 }}</td>

              <td>
                <div class="txn-id-cell">
                  <div class="txn-icon" :class="txnIconClass(item.status)">
                    <span class="mdi" :class="txnIcon(item.status)"></span>
                  </div>
                  <div>
                    <p class="txn-id">{{ item.id }}</p>
                    <p class="txn-method-sub th-hide-lg">{{ item.paymentMethod }}</p>
                  </div>
                </div>
              </td>

              <td class="th-hide-sm">
                <span class="chip chip-blue">{{ item.paymentMethod }}</span>
              </td>

              <td>
                <span class="amount-val">₹{{ Number(item.amount).toLocaleString('en-IN') }}</span>
              </td>

              <td>
                <span class="chip" :class="statusChipClass(item.status)">{{ item.status }}</span>
              </td>

              <td class="th-hide-md">
                <div class="date-cell">
                  <p class="date-primary">{{ formatDate(item.createdAt) }}</p>
                  <p class="date-sub">{{ formatTime(item.createdAt) }}</p>
                </div>
              </td>
            </tr>

            <tr v-if="displayedTransactions.length === 0">
              <td colspan="6" class="empty-row">
                <div class="empty-state">
                  <div class="empty-icon-wrap">
                    <span class="mdi mdi-swap-horizontal-bold"></span>
                  </div>
                  <p class="empty-title">No transactions found</p>
                  <p class="empty-desc">Try adjusting your filters or date range</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="skeleton-wrap">
        <div v-for="i in limit" :key="i" class="skeleton-row">
          <div class="skel skel-circle"></div>
          <div class="skel-lines">
            <div class="skel skel-line-lg"></div>
            <div class="skel skel-line-sm"></div>
          </div>
          <div class="skel skel-chip"></div>
          <div class="skel skel-amount"></div>
          <div class="skel skel-chip"></div>
        </div>
      </div>

      <div class="pagination-bar">
        <p class="pagination-info">
          Showing
          <strong>{{ Math.min((page - 1) * limit + 1, total) }}–{{ Math.min(page * limit, total) }}</strong>
          of <strong>{{ total.toLocaleString() }}</strong> transactions
        </p>
        <div class="pagination-controls">
          <select v-model.number="limit" class="per-page-select" @change="onLimitChange">
            <option :value="5">5 / page</option>
            <option :value="10">10 / page</option>
            <option :value="25">25 / page</option>
            <option :value="50">50 / page</option>
          </select>
          <div class="page-btns">
            <button class="page-btn" :disabled="page <= 1" @click="onPageChange(page - 1)">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <template v-for="p in pageNumbers" :key="p">
              <button class="page-btn" :class="{ 'page-btn-active': p === page }" @click="onPageChange(p)">
                {{ p }}
              </button>
            </template>
            <button class="page-btn" :disabled="page >= totalPages" @click="onPageChange(page + 1)">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useUsersApi } from "~/composables/apis/useUsersApi";

const props = defineProps<{
  transactionType?: string;
}>();

const { getAllMerchantTransactions } = useUsersApi();

const loading      = ref(false);
const transactions = ref<any[]>([]);
const page         = ref(1);
const limit        = ref(10);
const total        = ref(0);
const searchQuery  = ref('');
const statusFilter = ref('');

const filters = ref({
  fromDate: null as string | null,
  toDate:   null as string | null,
});

const successCount = computed(() => transactions.value.filter(t => t.status === 'SUCCESS').length);
const failedCount  = computed(() => transactions.value.filter(t => t.status === 'FAILED').length);
const pendingCount = computed(() => transactions.value.filter(t => t.status === 'PENDING').length);

const displayedTransactions = computed(() => {
  let items = transactions.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(t => t.id?.toLowerCase().includes(q));
  }
  if (statusFilter.value) items = items.filter(t => t.status === statusFilter.value);
  return items;
});

const totalPages = computed(() => Math.ceil(total.value / limit.value) || 1);
const pageNumbers = computed(() => {
  const t = totalPages.value, c = page.value;
  const pages: number[] = [];
  for (let i = Math.max(1, c - 2); i <= Math.min(t, c + 2); i++) pages.push(i);
  return pages;
});
const onPageChange  = (p: number) => { page.value = p; };
const onLimitChange = () => { page.value = 1; };

const normalizeDate = (date: string | null, end = false) => {
  if (!date) return undefined;
  return end ? `${date}T23:59:59.999` : `${date}T00:00:00.000`;
};

const loadTransactions = async () => {
  loading.value = true;
  try {
    const res = await getAllMerchantTransactions({
      page:              page.value,
      limit:             limit.value,
      fromDate:          normalizeDate(filters.value.fromDate),
      toDate:            normalizeDate(filters.value.toDate, true),
      transactionMethod: props.transactionType,
    });
    transactions.value = res.data || [];
    total.value         = res.meta?.total || 0;
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => { page.value = 1; loadTransactions(); };
const clearFilters  = () => {
  filters.value = { fromDate: null, toDate: null };
  page.value = 1;
  loadTransactions();
};

watch([page, limit], () => loadTransactions());
// reload when the user switches between sub-menu items (DMT → AEPS, etc.)
watch(() => props.transactionType, () => { page.value = 1; loadTransactions(); });

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const statusChipClass = (s: string) => {
  if (s === 'SUCCESS') return 'chip-green';
  if (s === 'FAILED')  return 'chip-red';
  if (s === 'PENDING') return 'chip-orange';
  return 'chip-grey';
};
const txnIconClass = (s: string) => {
  if (s === 'SUCCESS') return 'txn-icon-green';
  if (s === 'FAILED')  return 'txn-icon-red';
  return 'txn-icon-orange';
};
const txnIcon = (s: string) => {
  if (s === 'SUCCESS') return 'mdi-check';
  if (s === 'FAILED')  return 'mdi-close';
  return 'mdi-clock-outline';
};

onMounted(() => { loadTransactions(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title { font-size: 20px; font-weight: 700; color: #0f172a; }
@media (min-width: 640px) { .page-title { font-size: 24px; } }
.page-sub { font-size: 12px; color: #64748b; margin-top: 3px; }

.header-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.badge-pill { display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
.badge-green  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.badge-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.badge-orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.badge-pill .mdi { font-size: 13px; }

.filter-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 16px 18px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.filter-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.filter-card-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #334155; }
.filter-title-icon { font-size: 16px; color: #1142d4; }
.btn-clear-all { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #64748b; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: color .14s; }
.btn-clear-all:hover { color: #1142d4; }
.btn-clear-all .mdi { font-size: 14px; }

.filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (min-width: 768px) { .filter-grid { grid-template-columns: 1fr 1fr auto; align-items: end; } }

.filter-field { display: flex; flex-direction: column; gap: 5px; }
.filter-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .06em; }

.input-wrap { position: relative; display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0 10px; height: 40px; transition: border-color .15s; }
.input-wrap:focus-within { border-color: rgba(17,66,212,.4); background: #fff; }
.input-icon { font-size: 15px; color: #94a3b8; flex-shrink: 0; margin-right: 6px; }
.filter-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif; }
.filter-input::placeholder { color: #94a3b8; }

.filter-actions { display: flex; align-items: flex-end; gap: 8px; }
@media (max-width: 767px) { .filter-actions { grid-column: 1 / -1; } }

.btn-apply { display: flex; align-items: center; gap: 6px; height: 40px; padding: 0 20px; border-radius: 8px; background: #1142d4; color: #fff; border: none; font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(17,66,212,.25); transition: filter .14s; white-space: nowrap; }
.btn-apply:hover { filter: brightness(1.08); }
.btn-apply .mdi { font-size: 16px; }

.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; box-shadow: 0 1px 6px rgba(0,0,0,.05); overflow: hidden; }

.table-toolbar { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; }
.search-wrap { flex: 1; min-width: 160px; display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0 10px; height: 38px; transition: border-color .15s; }
.search-wrap:focus-within { border-color: rgba(17,66,212,.4); }
.search-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.search-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif; }
.search-input::placeholder { color: #94a3b8; }
.search-clear { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 15px; display: flex; align-items: center; }
.toolbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.filter-select { height: 38px; padding: 0 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; font-weight: 600; color: #475569; font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer; }
.btn-refresh { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 17px; color: #475569; cursor: pointer; transition: background .14s, color .14s; }
.btn-refresh:hover { background: rgba(17,66,212,.07); color: #1142d4; }
@keyframes spin-a { to { transform: rotate(360deg); } }
.spinning .mdi { display: inline-block; animation: spin-a .7s linear infinite; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th { padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #64748b; white-space: nowrap; }
.th-sno { text-align: center; width: 48px; }

.table-row { border-bottom: 1px solid #f1f5f9; transition: background .12s; }
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: rgba(17,66,212,.03); }
.data-table td { padding: 11px 14px; vertical-align: middle; }
.td-sno { text-align: center; font-size: 11px; color: #94a3b8; font-family: 'DM Mono', monospace; }

.txn-id-cell { display: flex; align-items: center; gap: 10px; }
.txn-icon { width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; }
.txn-icon-green  { background: #f0fdf4; color: #16a34a; }
.txn-icon-red    { background: #fff1f2; color: #be123c; }
.txn-icon-orange { background: #fff7ed; color: #c2410c; }
.txn-id { font-size: 12px; font-weight: 600; color: #334155; font-family: 'DM Mono', monospace; max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.txn-method-sub { font-size: 10px; color: #94a3b8; margin-top: 2px; }

.amount-val { font-size: 13px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; }

.chip { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.chip-green  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.chip-grey   { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }

.date-primary { font-size: 12px; font-weight: 600; color: #334155; }
.date-sub     { font-size: 10px; color: #94a3b8; margin-top: 2px; }

@media (max-width: 767px)  { .th-hide-sm { display: none !important; } }
@media (max-width: 1023px) { .th-hide-md { display: none !important; } }
@media (max-width: 480px)  { .th-hide-lg { display: none !important; } }

.empty-row { padding: 0 !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 52px 24px; text-align: center; }
.empty-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: rgba(17,66,212,.06); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 14px; }
.empty-title { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 4px; }
.empty-desc  { font-size: 12px; color: #94a3b8; }

.skeleton-wrap { display: flex; flex-direction: column; }
.skeleton-row  { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; }
.skeleton-row:last-child { border-bottom: none; }
.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; flex-shrink: 0; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-circle   { width: 30px; height: 30px; border-radius: 8px; }
.skel-lines    { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.skel-line-lg  { height: 12px; width: 60%; }
.skel-line-sm  { height: 10px; width: 35%; }
.skel-chip     { width: 72px; height: 22px; border-radius: 9999px; }
.skel-amount   { width: 70px; height: 16px; }

.pagination-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
.pagination-info { font-size: 12px; color: #64748b; }
.pagination-info strong { color: #334155; }
.pagination-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.per-page-select { height: 32px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; font-weight: 600; color: #475569; font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer; }
.page-btns { display: flex; gap: 4px; }
.page-btn { min-width: 32px; height: 32px; padding: 0 6px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .13s, color .13s, border-color .13s; }
.page-btn:hover:not(:disabled) { background: rgba(17,66,212,.07); color: #1142d4; border-color: rgba(17,66,212,.2); }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-btn-active { background: #1142d4 !important; color: #fff !important; border-color: #1142d4 !important; box-shadow: 0 2px 8px rgba(17,66,212,.25); }
</style>