<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">List of Vendors</h1>
        <p class="page-sub">All approved and active vendors on the platform</p>
      </div>
      <div class="header-actions">
        <button class="icon-btn" @click="refresh" :class="{ spinning: loading }">
          <span class="mdi mdi-refresh"></span>
        </button>
        <button class="btn-add" @click="router.push('/aggregator/vendor/onboarding')">
          <span class="mdi mdi-plus"></span>
          Add Vendor
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
          placeholder="Search by name or email…"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
        />
        <button v-if="search" class="search-clear" @click="search = ''">
          <span class="mdi mdi-close-circle"></span>
        </button>
      </div>
      <div class="filter-row">
        <select class="filter-select" v-model="filterMStatus">
          <option value="">All Approval Status</option>
          <option value="APPROVED">Approved</option>
          <option value="ONBOARDED">Onboarded</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select class="filter-select" v-model="filterStatus">
          <option value="">All Active Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>

    <!-- ── Table Card ── -->
    <div class="table-card">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-expand"></th>
              <th class="th-sno">S.No</th>
              <th>Vendor</th>
              <th class="th-hide-sm">Email</th>
              <th>Approval</th>
              <th class="th-hide-sm">Active</th>
              <th class="th-hide-md">Risk</th>
              <th class="th-hide-md">Merchants</th>
              <th class="th-hide-lg2">Active Merchants</th>
              <th class="th-hide-md">Created On</th>
              <th class="th-action">Action</th>
            </tr>
          </thead>

          <!-- Skeleton -->
          <tbody v-if="loading">
            <tr v-for="n in limit" :key="'sk-' + n" class="skel-row">
              <td><div class="skel" style="width:20px;height:20px;border-radius:5px;margin:0 auto"></div></td>
              <td><div class="skel skel-sm"></div></td>
              <td>
                <div class="skel-vendor">
                  <div class="skel skel-avatar"></div>
                  <div>
                    <div class="skel skel-line-md"></div>
                    <div class="skel skel-line-sm mt-1"></div>
                  </div>
                </div>
              </td>
              <td class="th-hide-sm"><div class="skel skel-line-lg"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-sm"><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-sm" style="width:30px"></div></td>
              <td class="th-hide-lg2"><div class="skel skel-sm" style="width:30px"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-btn"></div></td>
            </tr>
          </tbody>

          <!-- Data -->
          <tbody v-else>
            <template v-for="(item, idx) in filteredList" :key="item.id">
              <!-- Main row -->
              <tr
                class="data-row"
                :class="{ 'row-expanded': expandedIds.has(item.id) }"
                @click="goToVendor(item)"
              >
                <!-- Expand toggle -->
                <td class="td-expand" @click.stop="toggleExpand(item.id)">
                  <button class="expand-btn" :class="{ 'expand-btn-open': expandedIds.has(item.id) }">
                    <span class="mdi mdi-chevron-right"></span>
                  </button>
                </td>

                <!-- S.No -->
                <td class="td-sno">{{ (page - 1) * limit + idx + 1 }}</td>

                <!-- Vendor -->
                <td>
                  <div class="vendor-cell">
                    <div class="vendor-avatar" :style="{ background: avatarColor(item.name) }">
                      {{ initials(item.name) }}
                    </div>
                    <div>
                      <p class="vendor-name">{{ item.name }}</p>
                      <p class="vendor-email th-hide-lg">{{ item.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Email desktop -->
                <td class="th-hide-sm">
                  <span class="email-val">{{ item.email }}</span>
                </td>

                <!-- Approval Status -->
                <td>
                  <span class="chip" :class="mstatusClass(item.mstatus)">
                    <span class="chip-dot"></span>
                    {{ item.mstatus || '—' }}
                  </span>
                </td>

                <!-- Active -->
                <td class="th-hide-sm">
                  <span class="chip" :class="item.status ? 'chip-green' : 'chip-red'">
                    {{ item.status ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <!-- Risk -->
                <td class="th-hide-md">
                  <div class="risk-cell">
                    <span class="risk-dot" :class="riskDotClass(item.riskflag)"></span>
                    <span :class="riskTextClass(item.riskflag)">{{ riskLabel(item.riskflag) }}</span>
                  </div>
                </td>

                <!-- Merchants count -->
                <td class="th-hide-md">
                  <div class="count-cell">
                    <span class="mdi mdi-store-outline count-icon"></span>
                    <span class="count-val">{{ item.merchants?.length || 0 }}</span>
                  </div>
                </td>

                <!-- Active Merchants -->
                <td class="th-hide-lg2">
                  <div class="count-cell">
                    <span class="mdi mdi-store-check-outline count-icon count-icon-green"></span>
                    <span class="count-val">{{ item.merchants?.filter((m:any) => m.status === true).length || 0 }}</span>
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
                  <button class="btn-view" @click="goToVendor(item)" title="View Vendor">
                    <span class="mdi mdi-eye-outline"></span>
                  </button>
                </td>
              </tr>

              <!-- Expanded row -->
              <transition name="expand-row" appear>
                <tr v-if="expandedIds.has(item.id)" class="expanded-row">
                  <td :colspan="11" class="expanded-td">
                    <div class="expanded-inner">

                      <!-- Merchants panel -->
                      <div class="expand-panel">
                        <div class="expand-panel-header">
                          <div class="expand-panel-icon" style="background:rgba(17,66,212,.08);color:#1142d4">
                            <span class="mdi mdi-store-outline"></span>
                          </div>
                          <h3 class="expand-panel-title">Merchants</h3>
                          <span class="expand-count-badge">{{ item.merchants?.length || 0 }}</span>
                        </div>

                        <div class="expand-panel-body" v-if="item.merchants?.length">
                          <div class="expand-row-item" v-for="m in item.merchants" :key="m.id">
                            <div class="expand-row-left">
                              <span class="expand-mid">{{ m.mid }}</span>
                              <span class="expand-sub">{{ m.interface }}</span>
                            </div>
                            <span class="chip chip-sm" :class="mstatusClass(m.mstatus)">
                              {{ m.mstatus }}
                            </span>
                          </div>
                        </div>
                        <div class="expand-empty" v-else>
                          <span class="mdi mdi-store-off-outline"></span>
                          No merchants linked
                        </div>
                      </div>

                      <!-- Commissions panel -->
                      <div class="expand-panel">
                        <div class="expand-panel-header">
                          <div class="expand-panel-icon" style="background:rgba(16,185,129,.08);color:#10b981">
                            <span class="mdi mdi-percent-outline"></span>
                          </div>
                          <h3 class="expand-panel-title">Commissions</h3>
                          <span class="expand-count-badge">{{ item.commissions?.length || 0 }}</span>
                        </div>

                        <div class="expand-panel-body" v-if="item.commissions?.length">
                          <div class="expand-row-item" v-for="c in item.commissions" :key="c.id">
                            <div class="expand-row-left">
                              <span class="expand-mid">{{ c.paymentMethod }}</span>
                              <span class="expand-sub">{{ c.provider }}</span>
                            </div>
                            <span class="rate-badge">
                              {{ c.commissionRate }}{{ c.rateType === 'PERCENTAGE' ? '%' : ' ₹' }}
                            </span>
                          </div>
                        </div>
                        <div class="expand-empty" v-else>
                          <span class="mdi mdi-cash-remove"></span>
                          No commission rules
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>
              </transition>
            </template>

            <!-- Empty -->
            <tr v-if="filteredList.length === 0">
              <td colspan="11" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon">
                    <span class="mdi mdi-factory"></span>
                  </div>
                  <p class="empty-title">No pending vendors</p>
                  <p class="empty-desc">All vendors are up to date, or try adjusting your filters</p>
                  <button class="btn-add btn-add-sm" @click="router.push('/aggregator/vendor/onboarding')">
                    <span class="mdi mdi-plus"></span>
                    Add New Vendor
                  </button>
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
          {{ filteredList.length === 0 ? 0 : (page - 1) * limit + 1 }}–{{ Math.min(page * limit, store.total) }}
          of {{ store.total }}
        </span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="limitVal" @change="onLimitChange(limitVal)">
            <option v-for="n in [10, 25, 50]" :key="n" :value="n">{{ n }} / page</option>
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
import { computed, onMounted, ref, reactive } from 'vue';
import { useVendorStore } from '~/stores/vendors';
import { useAggregatorApi } from '~/composables/apis/useAggregatorApi';
import { useRouter } from 'vue-router';

const router = useRouter();
const store  = useVendorStore();
const { getVendors } = useAggregatorApi();

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
const expandedIds   = reactive(new Set<string>());

/* ── Expand toggle ── */
function toggleExpand(id: string) {
  if (expandedIds.has(id)) expandedIds.delete(id);
  else expandedIds.add(id);
}

/* ── Helpers ── */
const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor = (n: string) => AVATAR_COLORS[((n||'?').charCodeAt(0)) % AVATAR_COLORS.length];
const initials    = (n: string) => (n||'?').split(' ').map((w:string) => w[0]).slice(0,2).join('').toUpperCase();

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
const formatTime = (d: string) => new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

const mstatusClass = (s: string) => ({
  'chip-green':  s === 'APPROVED',
  'chip-blue':   s === 'ONBOARDED',
  'chip-amber':  s === 'PENDING' || !s,
  'chip-red':    s === 'REJECTED',
});
const riskDotClass  = (r: number) => r === 1 ? 'risk-ok' : r === 0 ? 'risk-warn' : 'risk-bad';
const riskTextClass = (r: number) => r === 1 ? 'risk-ok-text' : r === 0 ? 'risk-warn-text' : 'risk-bad-text';
const riskLabel     = (r: number) => r === 1 ? 'Low' : r === 0 ? 'Medium' : 'High';

/* ── Computed ── */
const vendors = computed(() => store.list || []);

const filteredList = computed(() => {
  let list = vendors.value;
  const q = search.value.toLowerCase();
  if (q) list = list.filter((v: any) =>
    (v.name||'').toLowerCase().includes(q) || (v.email||'').toLowerCase().includes(q)
  );
  if (filterMStatus.value) list = list.filter((v: any) => v.mstatus === filterMStatus.value);
  if (filterStatus.value)  list = list.filter((v: any) => String(v.status) === filterStatus.value);
  return list;
});

const statsStrip = computed(() => {
  const all = vendors.value;
  return [
    { label: 'Total',     value: store.total,                                                  color: '#1142d4' },
    { label: 'Active',    value: store.active || all.filter((v:any) => v.status).length,       color: '#22c55e' },
    { label: 'Approved',  value: all.filter((v:any) => v.mstatus === 'APPROVED').length,       color: '#10b981' },
    { label: 'Onboarded', value: all.filter((v:any) => v.mstatus === 'ONBOARDED').length,      color: '#7c3aed' },
  ];
});

const totalPages = computed(() => Math.max(1, Math.ceil(store.total / limit.value)));
const pageWindow = computed(() => {
  const cur = page.value, total = totalPages.value;
  const pages: number[] = [];
  for (let i = Math.max(1, cur - 1); i <= Math.min(total, cur + 1); i++) pages.push(i);
  return pages;
});

/* ── API ── */
async function load() {
  loading.value = true;
  try {
    const res = await getVendors({ page: page.value, limit: limit.value });
    store.setVendors({
      list: res.data, active: res.active || 0,
      total: res.pagination.total, page: res.pagination.page,
      limit: res.pagination.limit, totalPages: res.pagination.totalPages,
    });
  } finally { loading.value = false; }
}

async function refresh() { await load(); }
const onPageChange  = (p: number) => { page.value = p; load(); };
const onLimitChange = (l: number) => { limit.value = l; page.value = 1; load(); };

const goToVendor = (item: any) => {
  console.log("vendor", item.mstatus);

  if ( item.mstatus === "PENDING" ) {
    router.push(`/aggregator/vendor/onboarding/${item.id}`)
  } else {
    router.push(`/aggregator/vendor/view/${item.id}`)
  }
}

onMounted(load);
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

/* ── Toolbar ── */
.toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.search-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 0 12px; height: 40px;
  flex: 1; min-width: 180px; transition: border-color .15s, box-shadow .15s;
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
  font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; transition: border-color .15s;
}
.filter-select:focus { border-color: #1142d4; }

/* ── Table Card ── */
.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.table-wrap  { overflow-x: auto; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th {
  padding: 11px 12px; text-align: left;
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .08em; white-space: nowrap;
}
.th-expand { width: 40px; }
.th-sno    { width: 50px; text-align: center; }
.th-action { width: 56px; text-align: center; }

.data-row { border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row.row-expanded { background: rgba(17,66,212,.03); border-bottom: none; }
.data-table td { padding: 11px 12px; vertical-align: middle; }

/* Expand toggle */
.td-expand { text-align: center; }
.expand-btn {
  width: 24px; height: 24px; border-radius: 6px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #94a3b8; cursor: pointer; margin: 0 auto;
  transition: all .18s;
}
.expand-btn:hover { background: rgba(17,66,212,.08); color: #1142d4; border-color: rgba(17,66,212,.2); }
.expand-btn-open .mdi { transform: rotate(90deg); color: #1142d4; }
.expand-btn .mdi { transition: transform .2s; }

.td-sno { text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; font-family: 'DM Mono', monospace; }

/* Vendor cell */
.vendor-cell  { display: flex; align-items: center; gap: 10px; }
.vendor-avatar {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff;
}
.vendor-name  { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; }
.vendor-email { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.email-val    { font-size: 12px; color: #475569; }

.btn-add {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 9px;
  background: linear-gradient(135deg, #1142d4, #1654f8);
  color: #fff; border: none;
  font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17,66,212,.25);
  transition: filter .15s, box-shadow .15s;
}
.btn-add:hover { filter: brightness(1.07); box-shadow: 0 6px 20px rgba(17,66,212,.35); }
.btn-add .mdi  { font-size: 16px; }

.btn-add-sm  { margin-top: 6px; padding: 8px 16px; font-size: 12px; }

/* Chips */
.chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 700; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .05em;
}
.chip-sm { padding: 2px 8px; font-size: 9px; }
.chip-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }
.chip-grey   { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }

/* Risk */
.risk-cell      { display: flex; align-items: center; gap: 6px; }
.risk-dot       { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.risk-ok        { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.2); }
.risk-warn      { background: #f59e0b; box-shadow: 0 0 0 2px rgba(245,158,11,.2); }
.risk-bad       { background: #ef4444; box-shadow: 0 0 0 2px rgba(239,68,68,.2); }
.risk-ok-text   { font-size: 12px; font-weight: 600; color: #16a34a; }
.risk-warn-text { font-size: 12px; font-weight: 600; color: #b45309; }
.risk-bad-text  { font-size: 12px; font-weight: 600; color: #dc2626; }

/* Counts */
.count-cell      { display: flex; align-items: center; gap: 5px; }
.count-icon      { font-size: 14px; color: #94a3b8; }
.count-icon-green{ color: #22c55e; }
.count-val       { font-size: 13px; font-weight: 700; color: #334155; font-family: 'DM Mono', monospace; }

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
.btn-view:hover { background: #1142d4; color: #fff; border-color: #1142d4; }

/* ── Expanded Row ── */
.expanded-row { background: #fafcff; }
.expanded-td  { padding: 0 !important; border-bottom: 2px solid rgba(17,66,212,.1) !important; }
.expanded-inner {
  display: grid; grid-template-columns: 1fr;
  gap: 12px; padding: 16px 16px 20px;
}
@media(min-width:768px){ .expanded-inner { grid-template-columns: 1fr 1fr; } }

.expand-panel {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.expand-panel-header {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px; border-bottom: 1px solid #f1f5f9;
}
.expand-panel-icon {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.expand-panel-title { font-size: 13px; font-weight: 700; color: #0f172a; flex: 1; }
.expand-count-badge {
  font-size: 10px; font-weight: 800;
  background: #f1f5f9; color: #64748b;
  padding: 2px 8px; border-radius: 9999px;
}

.expand-panel-body { display: flex; flex-direction: column; gap: 0; }
.expand-row-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border-bottom: 1px solid #f8fafc;
  gap: 12px;
}
.expand-row-item:last-child { border-bottom: none; }
.expand-row-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.expand-mid { font-size: 12px; font-weight: 700; color: #1e293b; font-family: 'DM Mono', monospace; }
.expand-sub { font-size: 11px; color: #94a3b8; }

.rate-badge {
  font-size: 12px; font-weight: 800; color: #059669;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  padding: 3px 10px; border-radius: 9999px;
  white-space: nowrap;
}

.expand-empty {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 24px; font-size: 12px; color: #94a3b8;
}
.expand-empty .mdi { font-size: 16px; }

/* Expand row transition */
.expand-row-enter-active { transition: all .22s ease; overflow: hidden; }
.expand-row-leave-active { transition: all .18s ease; overflow: hidden; }
.expand-row-enter-from   { opacity: 0; transform: translateY(-6px); }
.expand-row-leave-to     { opacity: 0; transform: translateY(-4px); }

/* ── Empty ── */
.empty-td { padding: 48px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: rgba(124,58,237,.07); color: #7c3aed;
  display: flex; align-items: center; justify-content: center; font-size: 28px;
}
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; }

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
@media (max-width: 1279px) { .th-hide-lg2 { display: none; } }
@media (max-width: 1023px) { .th-hide-md  { display: none; } }
@media (max-width: 767px)  { .th-hide-sm  { display: none; } }
@media (min-width: 768px)  { .th-hide-lg  { display: none; } }

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px;
}
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-row td  { padding: 13px 12px; }
.skel-sm      { height: 12px; width: 28px; }
.skel-avatar  { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; }
.skel-line-lg { height: 12px; width: 140px; }
.skel-line-md { height: 12px; width: 100px; }
.skel-line-sm { height: 10px; width: 70px; }
.skel-chip    { height: 20px; width: 64px; border-radius: 9999px; }
.skel-btn     { height: 30px; width: 30px; border-radius: 8px; margin: 0 auto; }
.skel-vendor  { display: flex; align-items: center; gap: 10px; }
.mt-1         { margin-top: 4px; }
</style>