<template>
  <div class="dash-root">

    <!-- ── Page Header ── -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Dashboard</h1>
        <p class="dash-sub">{{ today }} · Live overview of your platform</p>
      </div>
      <div class="header-actions">
        <button class="refresh-btn" @click="reload" :class="{ spinning: loading }">
          <span class="mdi mdi-refresh"></span>
        </button>
        <div class="live-badge">
          <span class="live-dot"></span>
          Live
        </div>
      </div>
    </div>

    <!-- ── Top 3 Stat Cards ── -->
    <div class="stats-grid-top">
      <div
        class="stat-card"
        v-for="(stat, i) in overallStats.slice(0, 3)"
        :key="'top-' + i"
        :style="{ '--accent': statColors[i] }"
      >
        <template v-if="!loading">
          <div class="stat-icon-wrap">
            <span class="mdi stat-icon" :class="statIcons[i]"></span>
          </div>
          <div class="stat-body">
            <p class="stat-label">{{ stat.title }}</p>
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-sub" v-if="stat.sub">{{ stat.sub }}</p>
          </div>
          <div class="stat-accent-bar"></div>
        </template>
        <template v-else>
          <div class="skel skel-icon"></div>
          <div class="stat-body">
            <div class="skel skel-label"></div>
            <div class="skel skel-value mt-2"></div>
            <div class="skel skel-sub mt-1"></div>
          </div>
        </template>
      </div>
    </div>

    <!-- ── Middle Row: 2 Charts + 3 Stacked Stats ── -->
    <div class="mid-grid">

      <!-- Payment Methods Donut -->
      <div class="card chart-card">
        <template v-if="!loading && !noPaymentTransactions">
          <div class="card-header">
            <div class="card-title-wrap">
              <div class="card-icon-dot" style="background: rgba(17,66,212,.1); color:#1142d4">
                <span class="mdi mdi-credit-card-outline"></span>
              </div>
              <h2 class="card-title">Payment Methods</h2>
            </div>
          </div>
          <div class="chart-wrap">
            <apexchart type="donut" height="280" :options="donutOptions" :series="donutSeries" />
          </div>
        </template>
        <template v-else-if="!loading && noPaymentTransactions">
          <div class="empty-state">
            <div class="empty-icon-wrap">
              <span class="mdi mdi-credit-card-off-outline"></span>
            </div>
            <p class="empty-title">No Payment Transactions</p>
            <p class="empty-desc">Payment methods will appear once transactions are recorded</p>
          </div>
        </template>
        <template v-else>
          <div class="card-header">
            <div class="skel skel-label" style="width:140px"></div>
          </div>
          <div class="chart-wrap">
            <div class="skel" style="width:200px;height:200px;border-radius:50%;margin:0 auto 16px"></div>
            <div class="skel skel-sub" style="width:60%;margin:0 auto 8px"></div>
            <div class="skel skel-sub" style="width:50%;margin:0 auto"></div>
          </div>
        </template>
      </div>

      <!-- Daily Transaction Status Donut -->
      <div class="card chart-card">
        <template v-if="!loading && !noTransactionsToday">
          <div class="card-header">
            <div class="card-title-wrap">
              <div class="card-icon-dot" style="background:rgba(16,185,129,.1); color:#10b981">
                <span class="mdi mdi-chart-donut"></span>
              </div>
              <h2 class="card-title">Daily Transaction Status</h2>
            </div>
          </div>
          <div class="chart-wrap">
            <apexchart type="donut" height="280" :options="statusDonutOptions" :series="statusDonutSeries" />
          </div>
        </template>
        <template v-else-if="!loading && noTransactionsToday">
          <div class="empty-state">
            <div class="empty-icon-wrap" style="background:rgba(251,191,36,.1);color:#f59e0b">
              <span class="mdi mdi-calendar-remove-outline"></span>
            </div>
            <p class="empty-title">No Transactions Today</p>
            <p class="empty-desc">There are no transactions recorded for today</p>
          </div>
        </template>
        <template v-else>
          <div class="card-header">
            <div class="skel skel-label" style="width:160px"></div>
          </div>
          <div class="chart-wrap">
            <div class="skel" style="width:200px;height:200px;border-radius:50%;margin:0 auto 16px"></div>
            <div class="skel skel-sub" style="width:60%;margin:0 auto 8px"></div>
            <div class="skel skel-sub" style="width:50%;margin:0 auto"></div>
          </div>
        </template>
      </div>

      <!-- 3 Stacked Collection Stats -->
      <div class="stacked-stats">
        <div
          class="stat-card stat-card-sm"
          v-for="(stat, i) in overallStats.slice(3, 6)"
          :key="'btm-' + i"
          :style="{ '--accent': statColors[i + 3] }"
        >
          <template v-if="!loading">
            <div class="stat-icon-wrap stat-icon-sm">
              <span class="mdi stat-icon" :class="statIcons[i + 3]"></span>
            </div>
            <div class="stat-body">
              <p class="stat-label">{{ stat.title }}</p>
              <p class="stat-value stat-value-sm">
                <span class="currency-prefix">₹</span>{{ stat.value }}
              </p>
              <p class="stat-sub" v-if="stat.sub">{{ stat.sub }} txns</p>
            </div>
            <div class="stat-accent-bar"></div>
          </template>
          <template v-else>
            <div class="skel skel-icon skel-icon-sm"></div>
            <div class="stat-body">
              <div class="skel skel-label"></div>
              <div class="skel skel-value mt-2" style="width:50%"></div>
            </div>
          </template>
        </div>
      </div>

    </div>

    <!-- ── Top Merchants ── -->
    <div class="section-header">
      <h2 class="section-title">
        <span class="mdi mdi-trophy-variant-outline trophy-icon"></span>
        Top Merchants
      </h2>
    </div>

    <div class="merchants-grid">
      <div
        class="card merchant-card"
        v-for="(list, period) in topMerchants"
        :key="period"
      >
        <template v-if="!loading">
          <div class="card-header">
            <div class="card-title-wrap">
              <div class="card-icon-dot" style="background:rgba(245,158,11,.1);color:#f59e0b">
                <span class="mdi mdi-trophy-outline"></span>
              </div>
              <h2 class="card-title">{{ capitalize(period) }}</h2>
            </div>
            <span class="period-chip">{{ periodLabel(period) }}</span>
          </div>

          <div class="merchant-list" v-if="list.length > 0">
            <div
              class="merchant-row"
              v-for="(m, idx) in list"
              :key="m.id"
            >
              <!-- Rank -->
              <div class="rank-badge" :class="'rank-' + (idx + 1)">
                <span v-if="idx < 3" class="mdi" :class="rankIcons[idx]"></span>
                <span v-else>{{ idx + 1 }}</span>
              </div>

              <!-- Info -->
              <div class="merchant-avatar" :style="{ background: avatarColor(m.name) }">
                {{ initials(m.name) }}
              </div>
              <div class="merchant-info">
                <p class="merchant-name">{{ m.name }}</p>
                <p class="merchant-txns">{{ m.txnCount }} transactions</p>
              </div>

              <!-- Amount -->
              <div class="merchant-amount">
                ₹{{ m.totalAmount.toLocaleString('en-IN') }}
              </div>
            </div>
          </div>

          <div v-else class="merchant-empty">
            <span class="mdi mdi-storefront-outline"></span>
            No merchants found
          </div>
        </template>

        <template v-else>
          <div class="card-header">
            <div class="skel skel-label" style="width:120px"></div>
          </div>
          <div class="merchant-list">
            <div class="merchant-row" v-for="n in 3" :key="n">
              <div class="skel skel-icon-sm" style="border-radius:50%;flex-shrink:0"></div>
              <div class="skel skel-icon-sm" style="border-radius:50%;flex-shrink:0"></div>
              <div class="stat-body" style="flex:1">
                <div class="skel skel-label"></div>
                <div class="skel skel-sub mt-1" style="width:60%"></div>
              </div>
              <div class="skel skel-label" style="width:70px"></div>
            </div>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { useAuthStore } from "~/stores/auth";

const { getAggregator, getTransactions, getTransactionStatusSummary, getPaymentMethodSummary } = useAggregatorApi();
const authStore  = useAuthStore();
const apexchart  = VueApexCharts;
const loading    = ref(true);

definePageMeta({ layout: "aggregatorlayer", middleware: "auth" });

/* ── Helpers ── */
const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const periodLabel = (p) => ({ daily:'Today', weekly:'This Week', monthly:'This Month', yearly:'This Year' }[p] || p);
const initials = (n) => (n || '?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();

const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor   = (n) => AVATAR_COLORS[(n || '?').charCodeAt(0) % AVATAR_COLORS.length];

const rankIcons = ['mdi-medal', 'mdi-medal-outline', 'mdi-podium'];

/* ── Stat config ── */
const statIcons  = ['mdi-store-check-outline','mdi-store-outline','mdi-cash-multiple','mdi-calendar-week','mdi-calendar-month-outline','mdi-calendar-star'];
const statColors = ['#1142d4','#7c3aed','#059669','#d97706','#db2777','#0891b2'];

/* ── Computed stats ── */
const overallStats = computed(() => [
  { title: 'Active Merchants',   value: `${authStore.merchants.active}`,                             sub: 'merchants active' },
  { title: 'Total Merchants',    value: `${authStore.merchants.total}`,                              sub: 'total registered' },
  { title: 'Today Collection',   value: authStore.summary.today.totalAmount.toFixed(2),              sub: `${authStore.summary.today.count} txns` },
  { title: 'Weekly Collection',  value: authStore.summary.week.totalAmount.toFixed(2),               sub: `${authStore.summary.week.count} txns` },
  { title: 'Monthly Collection', value: authStore.summary.month.totalAmount.toFixed(2),              sub: `${authStore.summary.month.count} txns` },
  { title: 'Yearly Collection',  value: authStore.summary.year.totalAmount.toFixed(2),               sub: `${authStore.summary.year.count} txns` },
]);

const topMerchants = computed(() => authStore.topMerchants);

const noTransactionsToday = computed(() => {
  const data = Object.values(authStore.transactionStatusSummary || {});
  return data.length === 0 || data.every(t => t.count === 0);
});
const noPaymentTransactions = computed(() => {
  const data = Object.values(authStore.paymentSummary || {});
  return data.length === 0 || data.every(m => !m.amount || m.amount === 0);
});

/* ── Charts ── */
const CHART_BASE = {
  legend: { position: 'bottom', fontFamily: 'DM Sans', fontSize: '12px' },
  dataLabels: { style: { fontFamily: 'DM Sans', fontSize: '11px' } },
  stroke: { width: 2 },
  plotOptions: { pie: { donut: { size: '70%', labels: { show: true, total: { show: true, fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 700 } } } } },
};

const donutSeries = computed(() => Object.values(authStore.paymentSummary).map(m => m.amount));
const donutOptions = computed(() => {
  const methods = Object.keys(authStore.paymentSummary);
  const values  = Object.values(authStore.paymentSummary).map(m => m.amount);
  const total   = values.reduce((a, v) => a + v, 0);
  return {
    ...CHART_BASE,
    labels: methods,
    colors: ['#1142d4','#10b981','#f59e0b','#ef4444','#7c3aed','#0891b2'],
    plotOptions: { ...CHART_BASE.plotOptions, pie: { donut: { ...CHART_BASE.plotOptions.pie.donut, labels: { ...CHART_BASE.plotOptions.pie.donut.labels, total: { ...CHART_BASE.plotOptions.pie.donut.labels.total, label: 'Total', formatter: () => `₹${total.toLocaleString('en-IN')}` } } } } },
    dataLabels: { enabled: true, formatter: (val, opts) => `₹${values[opts.seriesIndex].toLocaleString('en-IN')}` },
    tooltip: { y: { formatter: val => `₹${val.toLocaleString('en-IN')}` } },
  };
});

const statusDonutSeries  = computed(() => Object.values(authStore.transactionStatusSummary).map(t => t.count));
const statusDonutOptions = computed(() => {
  const data  = Object.values(authStore.transactionStatusSummary);
  const labels = data.map(t => t.status);
  const total  = data.reduce((s, t) => s + t.count, 0);
  return {
    ...CHART_BASE,
    labels,
    colors: ['#10b981','#ef4444','#f59e0b','#1142d4'],
    plotOptions: { ...CHART_BASE.plotOptions, pie: { donut: { ...CHART_BASE.plotOptions.pie.donut, labels: { ...CHART_BASE.plotOptions.pie.donut.labels, total: { ...CHART_BASE.plotOptions.pie.donut.labels.total, label: 'Total Txns', formatter: () => total.toLocaleString('en-IN') } } } } },
    tooltip: { y: { formatter: (val, opts) => { const t = data[opts.seriesIndex]; return `${t.count} Txns | ₹${t.amount} | Code: ${t.responceCode}`; } } },
  };
});

/* ── Actions ── */
async function reload() {
  loading.value = true;
  try {
    await Promise.all([getAggregator(), getTransactions(), getTransactionStatusSummary(), getPaymentMethodSummary()]);
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
}

onMounted(async () => {
  if (authStore.merchants.total !== 0) loading.value = false;
  await reload();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dash-root {
  font-family: 'DM Sans', sans-serif;
  display: flex; flex-direction: column; gap: 16px;
  padding-bottom: 24px;
}

/* ── Header ── */
.dash-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.dash-title { font-size: 22px; font-weight: 800; color: #0f172a; }
@media (min-width: 640px) { .dash-title { font-size: 26px; } }
.dash-sub   { font-size: 12px; color: #64748b; margin-top: 3px; }

.header-actions { display: flex; align-items: center; gap: 10px; }
.refresh-btn {
  width: 36px; height: 36px; border-radius: 9px;
  background: #fff; border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #64748b; cursor: pointer;
  transition: background .13s, color .13s;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.refresh-btn:hover { background: #f1f5f9; color: #1142d4; }
.refresh-btn.spinning .mdi { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

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
  animation: pulse-g 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes pulse-g { 0%,100%{box-shadow:0 0 0 2px rgba(34,197,94,.25)} 50%{box-shadow:0 0 0 5px rgba(34,197,94,.08)} }

/* ── Top Stats Grid ── */
.stats-grid-top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 640px)  { .stats-grid-top { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .stats-grid-top { grid-template-columns: repeat(3, 1fr); } }

/* ── Stat Card ── */
.stat-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  transition: box-shadow .2s, transform .2s;
}
.stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-1px); }

.stat-accent-bar {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 3px;
  background: var(--accent, #1142d4);
  border-radius: 14px 14px 0 0;
}

.stat-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  background: color-mix(in srgb, var(--accent, #1142d4) 10%, transparent);
  display: flex; align-items: center; justify-content: center;
}
.stat-icon { font-size: 22px; color: var(--accent, #1142d4); }
.stat-icon-sm { width: 36px; height: 36px; border-radius: 9px; }
.stat-icon-sm .stat-icon { font-size: 18px; }

.stat-body { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.stat-label {
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .08em;
}
.stat-value {
  font-size: 22px; font-weight: 800; color: #0f172a;
  font-family: 'DM Mono', monospace;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.stat-value-sm { font-size: 17px; }
.currency-prefix { font-size: 12px; font-weight: 600; color: #94a3b8; margin-right: 1px; }
.stat-sub { font-size: 11px; color: #94a3b8; font-weight: 500; }

.stat-card-sm { padding: 14px 16px; border-radius: 11px; }

/* ── Mid Grid ── */
.mid-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 768px)  { .mid-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1200px) { .mid-grid { grid-template-columns: 1fr 1fr 1fr; } }

.stacked-stats { display: flex; flex-direction: column; gap: 12px; }

/* ── Card ── */
.card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  overflow: hidden;
}
.chart-card { padding: 20px; }

.card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.card-title-wrap { display: flex; align-items: center; gap: 10px; }
.card-icon-dot {
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 16px;
}
.card-title { font-size: 14px; font-weight: 700; color: #0f172a; }

.chart-wrap { min-height: 200px; }

/* ── Empty State ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 40px 20px; gap: 10px; text-align: center;
  min-height: 280px;
}
.empty-icon-wrap {
  width: 60px; height: 60px; border-radius: 50%;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 28px;
}
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 220px; line-height: 1.5; }

/* ── Section Header ── */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.section-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 800; color: #0f172a;
}
.trophy-icon { font-size: 18px; color: #f59e0b; }

/* ── Merchants Grid ── */
.merchants-grid {
  display: grid; grid-template-columns: 1fr; gap: 12px;
}
@media (min-width: 768px)  { .merchants-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1200px) { .merchants-grid { grid-template-columns: repeat(3, 1fr); } }

.merchant-card { padding: 18px; }

.period-chip {
  font-size: 10px; font-weight: 700;
  background: #f1f5f9; color: #64748b;
  padding: 3px 10px; border-radius: 9999px;
  text-transform: uppercase; letter-spacing: .05em;
}

.merchant-list { display: flex; flex-direction: column; gap: 8px; }

.merchant-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  background: #f8fafc; border: 1px solid #f1f5f9;
  transition: background .13s, border-color .13s;
  cursor: default;
}
.merchant-row:hover { background: #f1f5f9; border-color: #e2e8f0; }

.rank-badge {
  width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800;
  background: #f1f5f9; color: #94a3b8;
}
.rank-badge.rank-1 { background: rgba(245,158,11,.12); color: #d97706; font-size: 14px; }
.rank-badge.rank-2 { background: rgba(148,163,184,.15); color: #64748b; font-size: 14px; }
.rank-badge.rank-3 { background: rgba(217,119,6,.1); color: #b45309; font-size: 14px; }

.merchant-avatar {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff;
}
.merchant-info { flex: 1; min-width: 0; }
.merchant-name {
  font-size: 13px; font-weight: 700; color: #1e293b;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.merchant-txns { font-size: 11px; color: #94a3b8; margin-top: 1px; }

.merchant-amount {
  font-family: 'DM Mono', monospace;
  font-size: 13px; font-weight: 600; color: #0f172a;
  white-space: nowrap; flex-shrink: 0;
}

.merchant-empty {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 32px; font-size: 13px; color: #94a3b8;
}
.merchant-empty .mdi { font-size: 20px; }

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-icon  { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; }
.skel-icon-sm { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; }
.skel-label { height: 11px; width: 60%; border-radius: 4px; }
.skel-value { height: 24px; width: 40%; border-radius: 4px; }
.skel-sub   { height: 10px; width: 70%; border-radius: 4px; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
</style>