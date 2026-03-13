<template>
  <div class="page-root">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Onboarded Merchants</h1>
        <p class="page-sub">{{ store.total }} merchants successfully onboarded</p>
      </div>
      <!-- <div class="header-right">
        <div class="live-dot-wrap">
          <span class="live-dot"></span>
          <span class="live-label">Live Data</span>
        </div>
      </div> -->
    </div>

    <!-- ── Stats Strip ── -->
    <div class="stats-strip">
      <div class="stat-pill">
        <div class="stat-pill-icon-wrap stat-blue">
          <span class="mdi mdi-store-check-outline"></span>
        </div>
        <div>
          <p class="stat-pill-val">{{ store.total || 0 }}</p>
          <p class="stat-pill-label">Total Onboarded</p>
        </div>
      </div>
      <div class="stat-pill">
        <div class="stat-pill-icon-wrap stat-green">
          <span class="mdi mdi-check-decagram-outline"></span>
        </div>
        <div>
          <p class="stat-pill-val">{{ approvedCount }}</p>
          <p class="stat-pill-label">Approved</p>
        </div>
      </div>
      <div class="stat-pill">
        <div class="stat-pill-icon-wrap stat-emerald">
          <span class="mdi mdi-shield-check-outline"></span>
        </div>
        <div>
          <p class="stat-pill-val">{{ activeCount }}</p>
          <p class="stat-pill-label">Active</p>
        </div>
      </div>
      <div class="stat-pill">
        <div class="stat-pill-icon-wrap stat-red">
          <span class="mdi mdi-store-off-outline"></span>
        </div>
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
            placeholder="Search name, MID…"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <span class="mdi mdi-close"></span>
          </button>
        </div>
        <div class="toolbar-right">
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>
          <select v-model="kycFilter" class="filter-select">
            <option value="">All KYC</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <button class="btn-refresh" :class="{ spinning: loading }" @click="loadMerchants">
            <span class="mdi mdi-refresh"></span>
          </button>
        </div>
      </div>

      <!-- ── Desktop Table ── -->
      <div class="table-wrap" v-if="!loading">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">#</th>
              <th>Merchant</th>
              <th class="th-hide-sm">MID</th>
              <th>Status</th>
              <th class="th-hide-sm">KYC</th>
              <th class="th-hide-md">Risk</th>
              <th class="th-hide-md">Onboarded</th>
              <th class="th-action"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in filteredItems"
              :key="item.id"
              class="table-row"
              @click="goToMerchant(item)"
            >
              <!-- S.No -->
              <td class="td-sno">
                {{ (page - 1) * limit + index + 1 }}
              </td>

              <!-- Merchant -->
              <td>
                <div class="merchant-cell">
                  <div class="merchant-avatar" :style="{ background: avatarBg(item.legal_name) }">
                    {{ initials(item.legal_name) }}
                  </div>
                  <div class="merchant-meta">
                    <p class="merchant-name">{{ item.legal_name }}</p>
                    <p class="merchant-mid-sub">{{ item.mid || '—' }}</p>
                  </div>
                </div>
              </td>

              <!-- MID -->
              <td class="th-hide-sm">
                <span class="mono-text">{{ item.mid || '—' }}</span>
              </td>

              <!-- Merchant Status -->
              <td>
                <span class="chip" :class="mstatusChip(item.mstatus)">
                  {{ item.mstatus }}
                </span>
              </td>

              <!-- KYC Status -->
              <td class="th-hide-sm">
                <span class="chip" :class="statusChip(item.status)">
                  {{ formatStatus(item.status) }}
                </span>
              </td>

              <!-- Risk Flag -->
              <td class="th-hide-md">
                <div class="risk-cell">
                  <span
                    class="risk-dot"
                    :class="item.riskflag === 1 ? 'risk-dot-green' : 'risk-dot-red'"
                  ></span>
                  <span class="risk-label">{{ item.riskflag === 1 ? 'Active' : 'Inactive' }}</span>
                </div>
              </td>

              <!-- Date -->
              <td class="th-hide-md">
                <div class="date-cell">
                  <p class="date-primary">{{ formatDate(item.createdAt) }}</p>
                  <p class="date-sub">{{ formatTime(item.createdAt) }}</p>
                </div>
              </td>

              <!-- Action -->
              <td class="td-action" @click.stop>
                <button class="btn-view" @click="goToMerchant(item)" title="View merchant">
                  <span class="mdi mdi-arrow-right"></span>
                </button>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="filteredItems.length === 0">
              <td colspan="8" class="empty-row">
                <div class="empty-state">
                  <div class="empty-icon-wrap">
                    <span class="mdi mdi-store-search-outline"></span>
                  </div>
                  <p class="empty-title">No merchants found</p>
                  <p class="empty-desc">Try adjusting your search or filter</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Skeleton ── -->
      <div v-else class="skeleton-wrap">
        <div v-for="i in 8" :key="i" class="skeleton-row">
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
        <p class="pagination-info">
          Showing
          <strong>{{ Math.min((page - 1) * limit + 1, store.total) }}–{{ Math.min(page * limit, store.total) }}</strong>
          of <strong>{{ store.total }}</strong>
        </p>

        <div class="pagination-controls">
          <select v-model.number="limit" class="per-page-select" @change="onLimitChange(limit)">
            <option :value="10">10 / page</option>
            <option :value="25">25 / page</option>
            <option :value="50">50 / page</option>
          </select>
          <div class="page-btns">
            <button class="page-btn" :disabled="page <= 1" @click="onPageChange(page - 1)">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <template v-for="p in pageNumbers" :key="p">
              <button
                class="page-btn"
                :class="{ 'page-btn-active': p === page }"
                @click="onPageChange(p)"
              >{{ p }}</button>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMerchantsStore } from '~/stores/merchants';
import { useVendorApi } from '~/composables/apis/useVendorApi';

const store = useMerchantsStore();
const { getMerchants } = useVendorApi();
const router = useRouter();

const loading     = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const kycFilter    = ref('');
const page  = ref(store.page  || 1);
const limit = ref(store.limit || 10);

/* ── Load ── */
const loadMerchants = async () => {
  loading.value = true;
  try {
    await getMerchants({ page: page.value, limit: limit.value });
  } finally {
    loading.value = false;
  }
};

/* ── Pagination ── */
const totalPages = computed(() => Math.ceil((store.total || 0) / limit.value) || 1);
const pageNumbers = computed(() => {
  const t = totalPages.value, c = page.value;
  const pages: number[] = [];
  for (let i = Math.max(1, c - 1); i <= Math.min(t, c + 1); i++) pages.push(i);
  return pages;
});
const onPageChange  = (p: number) => { page.value = p;  loadMerchants(); };
const onLimitChange = (l: number) => { limit.value = l; page.value = 1; loadMerchants(); };

/* ── Filtered ── */
const filteredItems = computed(() => {
  let items: any[] = store.list || [];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(i =>
      i.legal_name?.toLowerCase().includes(q) || i.mid?.toLowerCase().includes(q)
    );
  }
  if (statusFilter.value) items = items.filter(i => i.mstatus === statusFilter.value);
  if (kycFilter.value)    items = items.filter(i => formatStatus(i.status) === kycFilter.value);
  return items;
});

/* ── Stats ── */
const approvedCount = computed(() => (store.list || []).filter((i: any) => i.mstatus === 'APPROVED').length);
const activeCount   = computed(() => (store.list || []).filter((i: any) => formatStatus(i.status) === 'ACTIVE').length);
const inactiveCount = computed(() => (store.list || []).filter((i: any) => formatStatus(i.status) === 'INACTIVE').length);

/* ── Utils ── */
const initials   = (n: string) => (n || '?').split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const formatStatus = (s: any) => (s === true || s === 'ACTIVE') ? 'ACTIVE' : 'INACTIVE';

const AVATAR_COLORS = ['#1142d4','#0891b2','#059669','#7c3aed','#db2777','#d97706','#dc2626'];
const avatarBg = (name: string) => {
  const idx = (name || 'A').charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] + '18'; // soft tint
};

const mstatusChip = (s: string) =>
  s === 'APPROVED' ? 'chip-green' : s === 'PENDING' ? 'chip-orange' : 'chip-grey';
const statusChip = (s: any) =>
  formatStatus(s) === 'ACTIVE' ? 'chip-green' : 'chip-red';

/* ── Row Click ── */
const goToMerchant = (item: any) =>
  router.push(`/vendor/merchants/view/${item.id}`);

onMounted(() => loadMerchants());
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
.page-sub { font-size: 12px; color: #64748b; margin-top: 3px; }

.header-right { display: flex; align-items: center; gap: 10px; }
.live-dot-wrap {
  display: flex; align-items: center; gap: 6px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  padding: 5px 12px; border-radius: 9999px;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,.25);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,.25); }
  50%      { box-shadow: 0 0 0 5px rgba(34,197,94,.1); }
}
.live-label { font-size: 11px; font-weight: 700; color: #16a34a; letter-spacing: .04em; }

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
  display: flex; align-items: center; gap: 11px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  transition: box-shadow .15s, transform .15s;
}
.stat-pill:hover { box-shadow: 0 4px 14px rgba(0,0,0,.07); transform: translateY(-1px); }
.stat-pill-icon-wrap {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 19px;
}
.stat-blue    { background: rgba(17,66,212,.08);  color: #1142d4; }
.stat-green   { background: rgba(22,163,74,.1);   color: #16a34a; }
.stat-emerald { background: rgba(5,150,105,.1);   color: #059669; }
.stat-red     { background: rgba(220,38,38,.08);  color: #dc2626; }

.stat-pill-val   { font-size: 20px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; line-height: 1; }
.stat-pill-label { font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; margin-top: 3px; }

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
  flex: 1; min-width: 160px;
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 0 10px; height: 38px;
  transition: border-color .15s;
}
.search-wrap:focus-within { border-color: rgba(17,66,212,.4); }
.search-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
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

.toolbar-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
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
@keyframes spin-a { to { transform: rotate(360deg); } }
.spinning .mdi { display: inline-block; animation: spin-a .7s linear infinite; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th {
  padding: 11px 14px; text-align: left;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .07em;
  color: #64748b; white-space: nowrap;
}
.th-sno { text-align: center; width: 52px; }
.th-action { width: 52px; }

.table-row {
  border-bottom: 1px solid #f1f5f9; cursor: pointer;
  transition: background .12s;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: rgba(17,66,212,.03); }

.data-table td { padding: 11px 14px; vertical-align: middle; }
.td-sno {
  text-align: center; font-size: 11px;
  color: #94a3b8; font-family: 'DM Mono', monospace;
}

/* Merchant cell */
.merchant-cell { display: flex; align-items: center; gap: 10px; }
.merchant-avatar {
  width: 34px; height: 34px; border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; flex-shrink: 0;
  color: #1142d4; background: rgba(17,66,212,.1);
}
.merchant-meta { min-width: 0; }
.merchant-name { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.merchant-mid-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; font-family: 'DM Mono', monospace; }

.mono-text { font-size: 12px; color: #64748b; font-family: 'DM Mono', monospace; }

/* Chips */
.chip {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .05em; white-space: nowrap;
}
.chip-orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.chip-green  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-grey   { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }

/* Risk */
.risk-cell { display: flex; align-items: center; gap: 6px; }
.risk-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.risk-dot-green { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.2); }
.risk-dot-red   { background: #ef4444; box-shadow: 0 0 0 2px rgba(239,68,68,.2); }
.risk-label { font-size: 12px; font-weight: 500; color: #475569; }

/* Date */
.date-primary { font-size: 12px; font-weight: 600; color: #334155; }
.date-sub     { font-size: 10px; color: #94a3b8; margin-top: 2px; }

/* Action */
.td-action { text-align: right; padding-right: 12px !important; }
.btn-view {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 15px; color: #475569; cursor: pointer;
  transition: background .13s, color .13s, border-color .13s;
}
.btn-view:hover { background: #1142d4; color: #fff; border-color: #1142d4; }

/* Responsive hiding */
@media (max-width: 767px)  { .th-hide-sm { display: none; } }
@media (max-width: 1023px) { .th-hide-md { display: none; } }

/* ── Empty ── */
.empty-row { padding: 0 !important; }
.empty-state {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 52px 24px; text-align: center;
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
.skeleton-wrap { display: flex; flex-direction: column; }
.skeleton-row  {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 16px; border-bottom: 1px solid #f1f5f9;
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
.skel-line-lg  { height: 13px; width: 50%; }
.skel-line-sm  { height: 10px; width: 30%; }
.skel-chip     { width: 68px; height: 22px; border-radius: 9999px; }
.skel-date     { width: 80px; height: 28px; }

/* ── Pagination ── */
.pagination-bar {
  display: flex; align-items: center;
  justify-content: space-between; flex-wrap: wrap; gap: 10px;
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