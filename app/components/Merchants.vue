<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Onboarded Merchants</h1>
        <p class="page-sub">All approved and active merchants on the platform</p>
      </div>
      <div class="header-actions">
        <div class="live-badge">
          <span class="live-dot"></span>
          Live Data
        </div>
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

    <!-- ── Toolbar ── -->
    <div class="toolbar">
      <div class="search-wrap" :class="{ focused: searchFocused }">
        <span class="mdi mdi-magnify search-icon"></span>
        <input
          v-model="search"
          class="search-input"
          placeholder="Search by name or MID…"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <span class="mdi mdi-close-circle"></span>
        </button>
      </div>

      <div class="filter-row">
        <select class="filter-select" v-model="filterMStatus">
          <option value="">All Merchant Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select class="filter-select" v-model="filterStatus">
          <option value="">All KYC Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>

    <!-- ── Table Card ── -->
    <div class="table-card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Merchant</th>
              <th class="th-hide-sm">MID</th>
              <th>Merchant Status</th>
              <th>KYC Status</th>
              <th class="th-hide-md">Risk Flag</th>
              <th class="th-hide-md">Applied On</th>
              <th class="th-action">Action</th>
            </tr>
          </thead>

          <!-- Loading skeleton -->
          <tbody v-if="loading">
            <tr v-for="n in limit" :key="'sk-' + n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td>
                <div class="skel-merchant">
                  <div class="skel skel-avatar"></div>
                  <div>
                    <div class="skel skel-line-md"></div>
                    <div class="skel skel-line-sm mt-1"></div>
                  </div>
                </div>
              </td>
              <td class="th-hide-sm"><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-btn"></div></td>
            </tr>
          </tbody>

          <!-- Data rows -->
          <tbody v-else>
            <tr
              v-for="(item, idx) in filteredList"
              :key="item.id"
              class="data-row"
              @click="goToMerchant(item)"
            >
              <td class="td-sno">{{ (page - 1) * limit + idx + 1 }}</td>

              <!-- Merchant -->
              <td>
                <div class="merchant-cell">
                  <div class="merchant-avatar" :style="{ background: avatarColor(item.legal_name) }">
                    {{ initials(item.legal_name) }}
                  </div>
                  <div>
                    <p class="merchant-name">{{ item.legal_name }}</p>
                    <p class="merchant-mid th-hide-lg">{{ item.mid }}</p>
                  </div>
                </div>
              </td>

              <!-- MID -->
              <td class="th-hide-sm">
                <span class="mid-val">{{ item.mid }}</span>
              </td>

              <!-- Merchant Status -->
              <td>
                <span class="chip" :class="mstatusClass(item.mstatus)">
                  {{ item.mstatus }}
                </span>
              </td>

              <!-- KYC Status -->
              <td>
                <span class="chip" :class="statusClass(item.status)">
                  {{ formatStatus(item.status) }}
                </span>
              </td>

              <!-- Risk Flag -->
              <td class="th-hide-md">
                <div class="risk-cell">
                  <span class="risk-dot" :class="item.riskflag === 1 ? 'risk-ok' : 'risk-bad'"></span>
                  <span class="risk-label" :class="item.riskflag === 1 ? 'risk-ok-text' : 'risk-bad-text'">
                    {{ item.riskflag === 1 ? 'Low' : 'High' }}
                  </span>
                </div>
              </td>

              <!-- Date -->
              <td class="th-hide-md">
                <div class="date-cell">
                  <span class="date-main">{{ formatDate(item.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(item.createdAt) }}</span>
                </div>
              </td>

              <!-- Action -->
              <td @click.stop>
                <button class="btn-view" @click="goToMerchant(item)" title="View Merchant">
                  <span class="mdi mdi-eye-outline"></span>
                </button>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="filteredList.length === 0">
              <td colspan="8" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon">
                    <span class="mdi mdi-store-off-outline"></span>
                  </div>
                  <p class="empty-title">No merchants found</p>
                  <p class="empty-desc">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Pagination ── -->
      <div class="pagination-bar">
        <span class="pag-info">
          Showing {{ filteredList.length === 0 ? 0 : (page - 1) * limit + 1 }}–{{ Math.min(page * limit, store.total) }} of {{ store.total }}
        </span>

        <div class="pag-controls">
          <select class="pag-limit" v-model.number="limitVal" @change="onLimitChange(limitVal)">
            <option v-for="n in [10, 25, 50]" :key="n" :value="n">{{ n }} / page</option>
          </select>

          <button class="pag-btn" :disabled="page <= 1" @click="onPageChange(page - 1)">
            <span class="mdi mdi-chevron-left"></span>
          </button>

          <template v-for="p in pageWindow" :key="p">
            <button
              class="pag-btn"
              :class="{ 'pag-btn-active': p === page }"
              @click="onPageChange(p)"
            >{{ p }}</button>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMerchantsStore } from '~/stores/merchants';
import { useAggregatorApi } from '~/composables/apis/useAggregatorApi';

const store = useMerchantsStore();
const { getMerchants } = useAggregatorApi();
const router = useRouter();

definePageMeta({ layout: 'aggregatorlayer', middleware: 'auth' });

/* ── State ── */
const page    = ref(store.page  || 1);
const limit   = ref(store.limit || 10);
const limitVal = ref(limit.value);
const loading = ref(false);
const search        = ref('');
const searchFocused = ref(false);
const filterMStatus = ref('');
const filterStatus  = ref('');

/* ── Helpers ── */
const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor = (n: string) => AVATAR_COLORS[((n||'?').charCodeAt(0)) % AVATAR_COLORS.length];
const initials    = (n: string) => (n||'?').split(' ').map((w:string) => w[0]).slice(0,2).join('').toUpperCase();

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
const formatStatus = (s: any)  => (s === true || s === 'ACTIVE') ? 'ACTIVE' : 'INACTIVE';

const mstatusClass = (s: string) => ({
  'chip-amber':  s === 'PENDING',
  'chip-green':  s === 'APPROVED',
  'chip-red':    s === 'REJECTED',
  'chip-grey':   !['PENDING','APPROVED','REJECTED'].includes(s),
});
const statusClass = (s: any) => ({
  'chip-green': formatStatus(s) === 'ACTIVE',
  'chip-red':   formatStatus(s) === 'INACTIVE',
});

/* ── Filtered list ── */
const filteredList = computed(() => {
  let list = store.list || [];
  const q = search.value.toLowerCase();
  if (q) list = list.filter((m: any) =>
    (m.legal_name||'').toLowerCase().includes(q) ||
    (m.mid||'').toLowerCase().includes(q)
  );
  if (filterMStatus.value) list = list.filter((m: any) => m.mstatus === filterMStatus.value);
  if (filterStatus.value)  list = list.filter((m: any) => formatStatus(m.status) === filterStatus.value);
  return list;
});

/* ── Stats strip ── */
const statsStrip = computed(() => {
  const all = store.list || [];
  return [
    { label: 'Total',    value: store.total,                                              color: '#1142d4' },
    { label: 'Approved', value: all.filter((m:any) => m.mstatus === 'APPROVED').length,   color: '#22c55e' },
    { label: 'Pending',  value: all.filter((m:any) => m.mstatus === 'PENDING').length,    color: '#f59e0b' },
    { label: 'Inactive', value: all.filter((m:any) => formatStatus(m.status) === 'INACTIVE').length, color: '#ef4444' },
  ];
});

/* ── Pagination ── */
const totalPages = computed(() => Math.max(1, Math.ceil(store.total / limit.value)));
const pageWindow = computed(() => {
  const cur = page.value, total = totalPages.value;
  const pages: number[] = [];
  for (let i = Math.max(1, cur - 1); i <= Math.min(total, cur + 1); i++) pages.push(i);
  return pages;
});

/* ── API ── */
async function loadMerchants() {
  loading.value = true;
  try { await getMerchants({ page: page.value, limit: limit.value }); }
  finally { loading.value = false; }
}
async function refresh() { await loadMerchants(); }
function onPageChange(p: number)  { page.value = p;     loadMerchants(); }
function onLimitChange(l: number) { limit.value = l; page.value = 1; loadMerchants(); }

/* ── Row click ── */
const goToMerchant = (item: any) => router.push(`/aggregator/merchants/view/${item.id}`);

onMounted(() => loadMerchants());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 14px; }

/* ── Header ── */
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.page-title { font-size: 20px; font-weight: 800; color: #0f172a; }
@media(min-width:640px){ .page-title { font-size: 24px; } }
.page-sub   { font-size: 12px; color: #64748b; margin-top: 3px; }

.header-actions { display: flex; align-items: center; gap: 8px; }
.live-badge {
  display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1px solid #e2e8f0;
  padding: 5px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; color: #0f172a;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,.25);
  animation: pulse-g 2s ease-in-out infinite; flex-shrink: 0;
}
@keyframes pulse-g { 0%,100%{box-shadow:0 0 0 2px rgba(34,197,94,.25)}50%{box-shadow:0 0 0 5px rgba(34,197,94,.08)} }

.icon-btn {
  width: 36px; height: 36px; border-radius: 9px;
  background: #fff; border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #64748b; cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  transition: background .13s, color .13s;
}
.icon-btn:hover { background: #f1f5f9; color: #1142d4; }
.icon-btn.spinning .mdi { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Stats Strip ── */
.stats-strip {
  display: flex; gap: 8px; flex-wrap: wrap;
}
.stat-pill {
  display: flex; align-items: center; gap: 6px;
  background: #fff; border: 1px solid #e8edf3;
  padding: 6px 14px; border-radius: 9999px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  font-family: 'DM Sans', sans-serif;
}
.stat-pill-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--c, #1142d4); flex-shrink: 0;
}
.stat-pill-val   { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.stat-pill-label { font-size: 11px; font-weight: 600; color: #64748b; }

/* ── Toolbar ── */
.toolbar {
  display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
}
.search-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 0 12px; height: 40px;
  flex: 1; min-width: 180px;
  transition: border-color .15s, box-shadow .15s;
}
.search-wrap.focused { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.09); }
.search-icon  { font-size: 17px; color: #94a3b8; flex-shrink: 0; }
.search-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif; }
.search-input::placeholder { color: #94a3b8; }
.search-clear { background: none; border: none; cursor: pointer; font-size: 16px; color: #cbd5e1; display: flex; align-items: center; transition: color .13s; }
.search-clear:hover { color: #94a3b8; }

.filter-row { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-select {
  height: 40px; padding: 0 12px; border-radius: 9px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-size: 12px; font-weight: 600; color: #475569;
  font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none;
  transition: border-color .15s;
}
.filter-select:focus { border-color: #1142d4; }

/* ── Table Card ── */
.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.table-wrap  { overflow-x: auto; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table thead tr {
  background: #f8fafc; border-bottom: 1px solid #e8edf3;
}
.data-table th {
  padding: 11px 14px; text-align: left;
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .08em; white-space: nowrap;
}
.th-sno    { width: 56px; text-align: center; }
.th-action { width: 60px; text-align: center; }

.data-row {
  border-bottom: 1px solid #f8fafc; cursor: pointer;
  transition: background .12s;
}
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; vertical-align: middle; }

.td-sno { text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; font-family: 'DM Mono', monospace; }

/* Merchant cell */
.merchant-cell { display: flex; align-items: center; gap: 10px; }
.merchant-avatar {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff;
}
.merchant-name { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; }
.merchant-mid  { font-size: 11px; color: #94a3b8; font-family: 'DM Mono', monospace; margin-top: 2px; }

.mid-val { font-family: 'DM Mono', monospace; font-size: 12px; color: #475569; }

/* Chips */
.chip {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 700; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .05em;
}
.chip-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }
.chip-grey  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }

/* Risk */
.risk-cell { display: flex; align-items: center; gap: 6px; }
.risk-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.risk-ok   { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.2); }
.risk-bad  { background: #ef4444; box-shadow: 0 0 0 2px rgba(239,68,68,.2); }
.risk-ok-text  { font-size: 12px; font-weight: 600; color: #16a34a; }
.risk-bad-text { font-size: 12px; font-weight: 600; color: #dc2626; }

/* Date */
.date-cell  { display: flex; flex-direction: column; gap: 2px; }
.date-main  { font-size: 12px; font-weight: 600; color: #334155; }
.date-time  { font-size: 11px; color: #94a3b8; }

/* Action */
.btn-view {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #64748b; cursor: pointer; margin: 0 auto;
  transition: all .13s;
}
.btn-view:hover { background: #1142d4; color: #fff; border-color: #1142d4; }

/* Empty */
.empty-td { padding: 40px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 26px;
}
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; }

/* ── Pagination ── */
.pagination-bar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
  padding: 12px 16px; border-top: 1px solid #f1f5f9;
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
  display: flex; align-items: center; justify-content: center;
  transition: all .13s;
}
.pag-btn:hover:not(:disabled) { border-color: #1142d4; color: #1142d4; background: rgba(17,66,212,.05); }
.pag-btn:disabled { opacity: .4; cursor: not-allowed; }
.pag-btn-active { background: #1142d4 !important; color: #fff !important; border-color: #1142d4 !important; }
.pag-btn .mdi   { font-size: 16px; }

/* ── Responsive column hiding ── */
@media (max-width: 1023px) { .th-hide-md { display: none; } }
@media (max-width: 767px)  { .th-hide-sm { display: none; } }
@media (min-width: 768px)  { .th-hide-lg { display: none; } }

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px;
}
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-row td { padding: 14px; }
.skel-sm      { height: 12px; width: 28px; border-radius: 4px; }
.skel-avatar  { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; }
.skel-line-md { height: 12px; width: 100px; }
.skel-line-sm { height: 10px; width: 70px; }
.skel-chip    { height: 20px; width: 64px; border-radius: 9999px; }
.skel-btn     { height: 30px; width: 30px; border-radius: 8px; margin: 0 auto; }
.skel-merchant{ display: flex; align-items: center; gap: 10px; }
.mt-1         { margin-top: 4px; }
</style>