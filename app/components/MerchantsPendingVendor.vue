<template>
  <div class="page-root">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Pending Merchants</h1>
        <p class="page-sub">{{ store.totalKycPending }} merchants awaiting KYC completion</p>
      </div>
      <button class="btn-add" @click="router.push('/vendor/merchants/create')">
        <span class="mdi mdi-plus"></span>
        <span>Add Merchant</span>
      </button>
    </div>

    <!-- ── Stats Strip ── -->
    <div class="stats-strip">
      <div class="stat-pill">
        <span class="mdi mdi-clock-outline stat-pill-icon stat-pill-orange"></span>
        <div>
          <p class="stat-pill-val">{{ pendingCount }}</p>
          <p class="stat-pill-label">Pending</p>
        </div>
      </div>
      <div class="stat-pill">
        <span class="mdi mdi-check-circle-outline stat-pill-icon stat-pill-green"></span>
        <div>
          <p class="stat-pill-val">{{ approvedCount }}</p>
          <p class="stat-pill-label">Approved</p>
        </div>
      </div>
      <div class="stat-pill">
        <span class="mdi mdi-shield-check-outline stat-pill-icon stat-pill-blue"></span>
        <div>
          <p class="stat-pill-val">{{ activeCount }}</p>
          <p class="stat-pill-label">Active</p>
        </div>
      </div>
      <div class="stat-pill">
        <span class="mdi mdi-alert-circle-outline stat-pill-icon stat-pill-red"></span>
        <div>
          <p class="stat-pill-val">{{ inactiveCount }}</p>
          <p class="stat-pill-label">Inactive</p>
        </div>
      </div>
    </div>

    <!-- ── Table Card ── -->
    <div class="table-card">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="search-wrap">
          <span class="mdi mdi-magnify search-icon"></span>
          <input
            v-model="searchQuery"
            class="search-input"
            placeholder="Search merchant name, MID…"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <span class="mdi mdi-close"></span>
          </button>
        </div>
        <div class="toolbar-right">
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>
          <button class="btn-refresh" @click="loadPendingMerchants" :class="{ spinning: loading }">
            <span class="mdi mdi-refresh"></span>
          </button>
        </div>
      </div>

      <!-- ── Desktop Table ── -->
      <div class="table-wrap" v-if="!loading">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Merchant Name</th>
              <th class="th-hide-sm">MID</th>
              <th>Merchant Status</th>
              <th class="th-hide-sm">KYC Status</th>
              <th class="th-hide-md">Risk Flag</th>
              <th class="th-hide-md">Applied On</th>
              <th class="th-action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredItems"
              :key="item.id"
              class="table-row"
              @click="goToMerchant(item)"
            >
              <td class="td-sno">
                {{ (kycPendingPage - 1) * kycPendingLimit + index + 1 }}
              </td>
              <td>
                <div class="merchant-cell">
                  <div class="merchant-avatar">{{ initials(item.legal_name) }}</div>
                  <div>
                    <p class="merchant-name">{{ item.legal_name }}</p>
                    <p class="merchant-mid-mobile th-hide-lg">{{ item.mid || '—' }}</p>
                  </div>
                </div>
              </td>
              <td class="th-hide-sm">
                <span class="mid-text">{{ item.mid || '—' }}</span>
              </td>
              <td>
                <span class="chip" :class="mstatusClass(item.mstatus)">{{ item.mstatus }}</span>
              </td>
              <td class="th-hide-sm">
                <span class="chip" :class="statusClass(item.status)">{{ formatStatus(item.status) }}</span>
              </td>
              <td class="th-hide-md">
                <span class="chip" :class="item.riskflag === 1 ? 'chip-green' : 'chip-red'">
                  {{ item.riskflag === 1 ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="th-hide-md">
                <div class="date-cell">
                  <p class="date-primary">{{ formatDate(item.createdAt) }}</p>
                  <p class="date-sub">{{ formatTime(item.createdAt) }}</p>
                </div>
              </td>
              <td class="td-action" @click.stop>
                <button class="btn-view" @click="goToMerchant(item)">
                  <span class="mdi mdi-arrow-right"></span>
                </button>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="filteredItems.length === 0">
              <td colspan="8" class="empty-row">
                <div class="empty-state">
                  <div class="empty-icon-wrap">
                    <span class="mdi mdi-store-search-outline"></span>
                  </div>
                  <p class="empty-title">No merchants found</p>
                  <p class="empty-desc">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Loading Skeleton ── -->
      <div v-else class="skeleton-wrap">
        <div v-for="i in 6" :key="i" class="skeleton-row">
          <div class="skel skel-circle"></div>
          <div class="skel-lines">
            <div class="skel skel-line-lg"></div>
            <div class="skel skel-line-sm"></div>
          </div>
          <div class="skel skel-chip"></div>
          <div class="skel skel-chip"></div>
          <div class="skel skel-date"></div>
        </div>
      </div>

      <!-- ── Pagination ── -->
      <div class="pagination-bar">
        <div class="pagination-info">
          Showing
          <strong>{{ (kycPendingPage - 1) * kycPendingLimit + 1 }}–{{ Math.min(kycPendingPage * kycPendingLimit, store.totalKycPending) }}</strong>
          of <strong>{{ store.totalKycPending }}</strong> merchants
        </div>

        <div class="pagination-controls">
          <select v-model.number="kycPendingLimit" class="per-page-select" @change="onKycLimitChange(kycPendingLimit)">
            <option :value="10">10 / page</option>
            <option :value="25">25 / page</option>
            <option :value="50">50 / page</option>
          </select>

          <div class="page-btns">
            <button class="page-btn" :disabled="kycPendingPage <= 1" @click="onKycPageChange(kycPendingPage - 1)">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <template v-for="p in pageNumbers" :key="p">
              <button
                class="page-btn"
                :class="{ 'page-btn-active': p === kycPendingPage }"
                @click="onKycPageChange(p)"
              >{{ p }}</button>
            </template>
            <button class="page-btn" :disabled="kycPendingPage >= totalPages" @click="onKycPageChange(kycPendingPage + 1)">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMerchantsStore } from '~/stores/merchants';
import { useVendorApi } from '~/composables/apis/useVendorApi';

const store = useMerchantsStore();
const { getPendingMerchants } = useVendorApi();
const router = useRouter();

const loading        = ref(false);
const searchQuery    = ref('');
const statusFilter   = ref('');
const kycPendingPage  = ref(store.kycPendingPage  || 1);
const kycPendingLimit = ref(store.kycPendingLimit || 10);

/* ── Load ── */
const loadPendingMerchants = async () => {
  loading.value = true;
  try {
    const res = await getPendingMerchants({ page: kycPendingPage.value, limit: kycPendingLimit.value });
    store.setKycPending({
      list: res.data, total: res.pagination.total,
      page: res.pagination.page, limit: res.pagination.limit,
      totalPages: res.pagination.totalPages,
    });
  } finally {
    loading.value = false;
  }
};

/* ── Pagination ── */
const totalPages = computed(() => Math.ceil(store.totalKycPending / kycPendingLimit.value) || 1);
const pageNumbers = computed(() => {
  const total = totalPages.value, cur = kycPendingPage.value;
  const pages: number[] = [];
  const start = Math.max(1, cur - 1), end = Math.min(total, cur + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});
const onKycPageChange  = (p: number) => { kycPendingPage.value = p;  loadPendingMerchants(); };
const onKycLimitChange = (l: number) => { kycPendingLimit.value = l; kycPendingPage.value = 1; loadPendingMerchants(); };

/* ── Computed ── */
const kycPending = computed(() => store.kycPending || []);

const filteredItems = computed(() => {
  let items = kycPending.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(i =>
      i.legal_name?.toLowerCase().includes(q) || i.mid?.toLowerCase().includes(q)
    );
  }
  if (statusFilter.value) {
    items = items.filter(i => i.mstatus === statusFilter.value);
  }
  return items;
});

/* ── Stats ── */
const pendingCount  = computed(() => kycPending.value.filter(i => i.mstatus === 'PENDING').length);
const approvedCount = computed(() => kycPending.value.filter(i => i.mstatus === 'APPROVED').length);
const activeCount   = computed(() => kycPending.value.filter(i => formatStatus(i.status) === 'ACTIVE').length);
const inactiveCount = computed(() => kycPending.value.filter(i => formatStatus(i.status) === 'INACTIVE').length);

/* ── Utils ── */
const initials    = (name: string) => (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const formatDate  = (d: string)    => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatTime  = (d: string)    => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const formatStatus = (s: any)      => (s === true || s === 'ACTIVE') ? 'ACTIVE' : 'INACTIVE';

const mstatusClass = (s: string) =>
  s === 'PENDING' ? 'chip-orange' : s === 'APPROVED' ? 'chip-green' : 'chip-grey';
const statusClass  = (s: any)    =>
  formatStatus(s) === 'ACTIVE' ? 'chip-green' : 'chip-red';

/* ── Row Click ── */
const goToMerchant = (item: any) => {
  if (item.merchantinfo !== null) router.push(`/vendor/merchants/view/${item.id}`);
  else router.push(`/vendor/onboarding/${item.id}`);
};

onMounted(() => loadPendingMerchants());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root {
  font-family: 'DM Sans', sans-serif;
  display: flex; flex-direction: column; gap: 16px;
}

/* ── Header ── */
.page-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.page-title { font-size: 20px; font-weight: 700; color: #0f172a; }
@media (min-width: 640px) { .page-title { font-size: 24px; } }
.page-sub   { font-size: 12px; color: #64748b; margin-top: 3px; }

.btn-add {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 9px;
  background: #1142d4; color: #fff;
  border: none; font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17,66,212,.25);
  transition: filter .15s; white-space: nowrap;
}
.btn-add:hover { filter: brightness(1.08); }
.btn-add .mdi  { font-size: 17px; }

/* ── Stats Strip ── */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
@media (min-width: 640px) { .stats-strip { grid-template-columns: repeat(4, 1fr); } }

.stat-pill {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 10px; padding: 12px 14px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.stat-pill-icon { font-size: 22px; flex-shrink: 0; }
.stat-pill-orange { color: #f59e0b; }
.stat-pill-green  { color: #22c55e; }
.stat-pill-blue   { color: #1142d4; }
.stat-pill-red    { color: #ef4444; }
.stat-pill-val    { font-size: 18px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; }
.stat-pill-label  { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; margin-top: 1px; }

/* ── Table Card ── */
.table-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 12px; box-shadow: 0 1px 6px rgba(0,0,0,.05);
  overflow: hidden;
}

/* ── Toolbar ── */
.table-toolbar {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px; border-bottom: 1px solid #f1f5f9;
  flex-wrap: wrap;
}
.search-wrap {
  flex: 1; min-width: 180px;
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 0 10px; height: 38px;
}
.search-icon  { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.search-input {
  flex: 1; border: none; background: transparent;
  font-size: 13px; color: #334155; outline: none;
  font-family: 'DM Sans', sans-serif;
}
.search-input::placeholder { color: #94a3b8; }
.search-clear {
  background: none; border: none; cursor: pointer;
  color: #94a3b8; font-size: 15px; padding: 0;
  display: flex; align-items: center;
}

.toolbar-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.filter-select {
  height: 38px; padding: 0 10px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  font-size: 12px; font-weight: 600; color: #475569;
  font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer;
}

.btn-refresh {
  width: 38px; height: 38px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; color: #475569; cursor: pointer;
  transition: background .14s, color .14s;
}
.btn-refresh:hover { background: rgba(17,66,212,.07); color: #1142d4; }
@keyframes spin-anim { to { transform: rotate(360deg); } }
.spinning .mdi { display: inline-block; animation: spin-anim .7s linear infinite; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }

.data-table {
  width: 100%; border-collapse: collapse;
  font-size: 13px;
}

.data-table thead tr {
  background: #f8fafc; border-bottom: 1px solid #e8edf3;
}
.data-table th {
  padding: 11px 14px; text-align: left;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em;
  color: #64748b; white-space: nowrap;
}
.th-sno   { text-align: center; width: 60px; }
.th-action { text-align: center; width: 60px; }

.table-row {
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer; transition: background .13s;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: rgba(17,66,212,.03); }

.data-table td { padding: 12px 14px; vertical-align: middle; }
.td-sno { text-align: center; font-size: 12px; color: #94a3b8; font-family: 'DM Mono', monospace; }

/* Merchant cell */
.merchant-cell { display: flex; align-items: center; gap: 10px; }
.merchant-avatar {
  width: 34px; height: 34px; border-radius: 9px;
  background: rgba(17,66,212,.08); color: #1142d4;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.merchant-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.merchant-mid-mobile { font-size: 11px; color: #94a3b8; margin-top: 1px; font-family: 'DM Mono', monospace; }

.mid-text { font-size: 12px; color: #64748b; font-family: 'DM Mono', monospace; }

/* Chips */
.chip {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .05em;
  white-space: nowrap;
}
.chip-orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.chip-green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-grey   { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }

/* Date cell */
.date-cell { }
.date-primary { font-size: 12px; font-weight: 600; color: #334155; }
.date-sub     { font-size: 10px; color: #94a3b8; margin-top: 2px; }

/* Action button */
.td-action { text-align: center; }
.btn-view {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 15px; color: #475569; cursor: pointer;
  transition: background .13s, color .13s, border-color .13s;
}
.btn-view:hover { background: #1142d4; color: #fff; border-color: #1142d4; }

/* Responsive column hiding */
@media (max-width: 767px) {
  .th-hide-sm  { display: none; }
}
@media (max-width: 1023px) {
  .th-hide-md  { display: none; }
}
@media (max-width: 480px) {
  .th-hide-lg  { display: none; }
}

/* ── Empty ── */
.empty-row { padding: 0 !important; }
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 48px 24px; text-align: center;
}
.empty-icon-wrap {
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(17,66,212,.06); color: #1142d4;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; margin-bottom: 14px;
}
.empty-title { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 4px; }
.empty-desc  { font-size: 12px; color: #94a3b8; }

/* ── Skeleton ── */
.skeleton-wrap { display: flex; flex-direction: column; padding: 8px 0; }
.skeleton-row  {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
}
.skeleton-row:last-child { border-bottom: none; }
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px; flex-shrink: 0;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-circle   { width: 34px; height: 34px; border-radius: 9px; }
.skel-lines    { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.skel-line-lg  { height: 13px; width: 55%; }
.skel-line-sm  { height: 10px; width: 35%; }
.skel-chip     { width: 64px; height: 22px; border-radius: 9999px; }
.skel-date     { width: 80px; height: 30px; }

/* ── Pagination ── */
.pagination-bar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
  padding: 12px 16px; border-top: 1px solid #f1f5f9;
}
.pagination-info { font-size: 12px; color: #64748b; }
.pagination-info strong { color: #334155; }

.pagination-controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.per-page-select {
  height: 32px; padding: 0 8px; border-radius: 7px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  font-size: 12px; font-weight: 600; color: #475569;
  font-family: 'DM Sans', sans-serif; outline: none; cursor: pointer;
}

.page-btns { display: flex; gap: 4px; }
.page-btn {
  min-width: 32px; height: 32px; padding: 0 6px;
  border-radius: 7px; border: 1px solid #e2e8f0;
  background: #f8fafc; color: #475569;
  font-size: 12px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .13s, color .13s, border-color .13s;
}
.page-btn:hover:not(:disabled) { background: rgba(17,66,212,.07); color: #1142d4; border-color: rgba(17,66,212,.2); }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-btn-active {
  background: #1142d4 !important; color: #fff !important;
  border-color: #1142d4 !important;
  box-shadow: 0 2px 8px rgba(17,66,212,.25);
}
</style>