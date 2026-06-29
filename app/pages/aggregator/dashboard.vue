<template>
  <div class="dash-root">

    <!-- ── Page Header ── -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Aggregator Dashboard</h1>
        <p class="dash-sub">{{ today }} · Platform monitoring & analytics</p>
      </div>
      <div class="header-actions">
        <button class="refresh-btn" @click="reload" :class="{ spinning: loading }">
          <span class="mdi mdi-refresh"></span>
        </button>
        <div class="live-badge"><span class="live-dot"></span>Live</div>
      </div>
    </div>

    <!-- ── KPI Strip ── -->
    <div class="kpi-strip">
      <div class="kpi-card" style="--kc:#1142d4">
        <div class="kpi-icon-wrap" style="background:rgba(17,66,212,.1)"><span class="mdi mdi-store-check-outline" style="color:#1142d4"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Active Merchants</p>
          <p class="kpi-value mono" v-if="!loading">{{ authStore.merchants.active }}</p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#7c3aed">
        <div class="kpi-icon-wrap" style="background:rgba(124,58,237,.1)"><span class="mdi mdi-store-outline" style="color:#7c3aed"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Total Merchants</p>
          <p class="kpi-value mono" v-if="!loading">{{ authStore.merchants.total }}</p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#059669">
        <div class="kpi-icon-wrap" style="background:rgba(5,150,105,.1)"><span class="mdi mdi-account-group-outline" style="color:#059669"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Total Vendors</p>
          <p class="kpi-value mono" v-if="!loading">{{ analytics?.vendors?.total ?? '—' }}</p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#059669">
        <div class="kpi-icon-wrap" style="background:rgba(5,150,105,.1)"><span class="mdi mdi-target" style="color:#059669"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Overall Success Rate</p>
          <p class="kpi-value mono" v-if="!loading">{{ analytics?.successRate?.overall ?? '—' }}%</p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#d97706">
        <div class="kpi-icon-wrap" style="background:rgba(217,119,6,.1)"><span class="mdi mdi-check-circle-outline" style="color:#d97706"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Today Success Rate</p>
          <p class="kpi-value mono" v-if="!loading">{{ analytics?.successRate?.today ?? '—' }}%</p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#0891b2">
        <div class="kpi-icon-wrap" style="background:rgba(8,145,178,.1)"><span class="mdi mdi-cash-multiple" style="color:#0891b2"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Net Revenue (Month)</p>
          <p class="kpi-value mono" v-if="!loading"><span class="cur">₹</span>{{ fmtAmt(analytics?.netRevenue?.thisMonth) }}</p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#db2777">
        <div class="kpi-icon-wrap" style="background:rgba(219,39,119,.1)"><span class="mdi mdi-percent" style="color:#db2777"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Commission (Month)</p>
          <p class="kpi-value mono" v-if="!loading"><span class="cur">₹</span>{{ fmtAmt(analytics?.commission?.thisMonth) }}</p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#ef4444">
        <div class="kpi-icon-wrap" style="background:rgba(239,68,68,.1)"><span class="mdi mdi-bank-transfer-out" style="color:#ef4444"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Pending Settlements</p>
          <p class="kpi-value mono" v-if="!loading">{{ analytics?.pendingSettlements?.count ?? 0 }} <span class="kpi-sub-inline">/ ₹{{ fmtAmt(analytics?.pendingSettlements?.amount) }}</span></p>
          <div class="skel skel-value" v-else></div>
        </div>
      </div>
    </div>

    <!-- ── Collection Stat Cards (Today / Week / Month / Year) ── -->
    <div class="row-4col">
      <div class="stat-card" v-for="(stat, i) in collectionStats" :key="'col-' + i" :style="{ '--accent': collectionColors[i] }">
        <template v-if="!loading">
          <div class="stat-icon-wrap"><span class="mdi stat-icon" :class="collectionIcons[i]"></span></div>
          <div class="stat-body">
            <p class="stat-label">{{ stat.title }}</p>
            <p class="stat-value stat-value-md"><span class="currency-prefix">₹</span>{{ stat.value }}</p>
            <p class="stat-sub" v-if="stat.sub">{{ stat.sub }} txns</p>
          </div>
          <div class="stat-accent-bar"></div>
        </template>
        <template v-else>
          <div class="skel skel-icon"></div>
          <div class="stat-body"><div class="skel skel-label"></div><div class="skel skel-value mt-2"></div><div class="skel skel-sub mt-1"></div></div>
        </template>
      </div>
    </div>

    <!-- ── Charts Row 1: Payment Methods + Daily Status ── -->
    <div class="row-2col">
      <div class="card chart-card">
        <template v-if="!loading && !noPaymentTransactions">
          <div class="card-header">
            <div class="card-title-wrap">
              <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-credit-card-outline"></span></div>
              <h2 class="card-title">Payment Methods</h2>
            </div>
            <span class="chart-tag">All time</span>
          </div>
          <apexchart type="donut" height="280" :options="donutOptions" :series="donutSeries" />
        </template>
        <template v-else-if="!loading">
          <div class="empty-state"><div class="empty-icon-wrap"><span class="mdi mdi-credit-card-off-outline"></span></div><p class="empty-title">No Payment Data</p><p class="empty-desc">Payment methods appear once transactions are recorded</p></div>
        </template>
        <template v-else><div class="chart-skel-wrap"><div class="skel skel-donut"></div></div></template>
      </div>

      <div class="card chart-card">
        <template v-if="!loading && !noTransactionsToday">
          <div class="card-header">
            <div class="card-title-wrap">
              <div class="card-icon-dot" style="background:rgba(16,185,129,.1);color:#10b981"><span class="mdi mdi-chart-donut"></span></div>
              <h2 class="card-title">Today's Transaction Status</h2>
            </div>
            <span class="chart-tag">Today</span>
          </div>
          <apexchart type="donut" height="280" :options="statusDonutOptions" :series="statusDonutSeries" />
        </template>
        <template v-else-if="!loading">
          <div class="empty-state"><div class="empty-icon-wrap" style="background:rgba(251,191,36,.1);color:#f59e0b"><span class="mdi mdi-calendar-remove-outline"></span></div><p class="empty-title">No Transactions Today</p><p class="empty-desc">There are no transactions recorded for today</p></div>
        </template>
        <template v-else><div class="chart-skel-wrap"><div class="skel skel-donut"></div></div></template>
      </div>
    </div>

    <!-- ── Charts Row 2: 30-Day Trend + Hourly Volume ── -->
    <div class="row-2col">

      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-chart-line"></span></div>
            <h2 class="card-title">30-Day Volume Trend</h2>
          </div>
          <span class="chart-tag">Last 30 days</span>
        </div>
        <template v-if="!loading && analytics">
          <apexchart type="area" height="240" :options="trendOptions" :series="trendSeries" />
        </template>
        <template v-else><div class="chart-skel-wrap" style="height:240px"><div class="skel" style="height:100%;border-radius:8px"></div></div></template>
      </div>

      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706"><span class="mdi mdi-clock-time-four-outline"></span></div>
            <h2 class="card-title">Today's Peak Hours</h2>
          </div>
          <span class="chart-tag">Today</span>
        </div>
        <template v-if="!loading && analytics">
          <apexchart type="bar" height="240" :options="hourlyOptions" :series="hourlySeries" />
        </template>
        <template v-else><div class="chart-skel-wrap" style="height:240px"><div class="skel" style="height:100%;border-radius:8px"></div></div></template>
      </div>

    </div>

    <!-- ── Charts Row 3: Failed Reasons + Merchant Health ── -->
    <div class="row-2col">

      <!-- Failed by Reason -->
      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(239,68,68,.1);color:#ef4444"><span class="mdi mdi-alert-circle-outline"></span></div>
            <h2 class="card-title">Failed Txns by Reason</h2>
          </div>
          <span class="chart-tag">Today</span>
        </div>
        <template v-if="!loading && analytics?.failedByReason?.length">
          <apexchart type="bar" height="240" :options="failedOptions" :series="failedSeries" />
        </template>
        <template v-else-if="!loading">
          <div class="empty-state" style="min-height:200px"><div class="empty-icon-wrap" style="background:rgba(16,185,129,.1);color:#10b981"><span class="mdi mdi-check-all"></span></div><p class="empty-title">No Failed Transactions Today</p><p class="empty-desc">All transactions are successful today</p></div>
        </template>
        <template v-else><div class="chart-skel-wrap" style="height:240px"><div class="skel" style="height:100%;border-radius:8px"></div></div></template>
      </div>

      <!-- Merchant Health -->
      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(124,58,237,.1);color:#7c3aed"><span class="mdi mdi-heart-pulse"></span></div>
            <h2 class="card-title">Merchant Health</h2>
          </div>
          <span class="chart-tag">All time</span>
        </div>
        <template v-if="!loading && analytics?.merchantHealth?.length">
          <div class="health-list">
            <div class="health-row" v-for="m in analytics.merchantHealth" :key="m.id">
              <div class="health-avatar" :style="{ background: avatarColor(m.name) }">{{ initials(m.name) }}</div>
              <div class="health-info">
                <div class="health-name-row">
                  <span class="health-name">{{ m.name }}</span>
                  <span class="health-rate" :class="rateClass(m.rate)">{{ m.rate }}%</span>
                </div>
                <div class="health-bar-track">
                  <div class="health-bar-fill" :style="{ width: m.rate + '%', background: rateColor(m.rate) }"></div>
                </div>
                <div class="health-counts">
                  <span class="hc hc-green">{{ m.success }} ok</span>
                  <span class="hc hc-red">{{ m.failed }} fail</span>
                  <span class="hc hc-amber">{{ m.pending }} pending</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="!loading">
          <div class="empty-state" style="min-height:200px"><div class="empty-icon-wrap"><span class="mdi mdi-storefront-outline"></span></div><p class="empty-title">No Merchant Data</p></div>
        </template>
        <template v-else>
          <div class="health-list">
            <div class="health-row" v-for="n in 5" :key="n">
              <div class="skel" style="width:32px;height:32px;border-radius:9px;flex-shrink:0"></div>
              <div style="flex:1"><div class="skel skel-label mb-1"></div><div class="skel" style="height:6px;border-radius:3px"></div></div>
            </div>
          </div>
        </template>
      </div>

    </div>

    <!-- ── Top Merchants ── -->
    <div class="section-header">
      <h2 class="section-title"><span class="mdi mdi-trophy-variant-outline trophy-icon"></span>Top Merchants</h2>
    </div>
    <div class="merchants-grid">
      <div class="card merchant-card" v-for="(list, period) in topMerchants" :key="period">
        <template v-if="!loading">
          <div class="card-header">
            <div class="card-title-wrap">
              <div class="card-icon-dot" style="background:rgba(245,158,11,.1);color:#f59e0b"><span class="mdi mdi-trophy-outline"></span></div>
              <h2 class="card-title">{{ capitalize(period) }}</h2>
            </div>
            <span class="period-chip">{{ periodLabel(period) }}</span>
          </div>
          <div class="merchant-list" v-if="list.length > 0">
            <div class="merchant-row" v-for="(m, idx) in list" :key="m.id">
              <div class="rank-badge" :class="'rank-' + (idx + 1)">
                <span v-if="idx < 3" class="mdi" :class="rankIcons[idx]"></span>
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div class="merchant-avatar" :style="{ background: avatarColor(m.name) }">{{ initials(m.name) }}</div>
              <div class="merchant-info">
                <p class="merchant-name">{{ m.name }}</p>
                <p class="merchant-txns">{{ m.txnCount }} transactions</p>
              </div>
              <div class="merchant-amount">₹{{ m.totalAmount.toLocaleString('en-IN') }}</div>
            </div>
          </div>
          <div v-else class="merchant-empty"><span class="mdi mdi-storefront-outline"></span> No merchants found</div>
        </template>
        <template v-else>
          <div class="card-header"><div class="skel skel-label" style="width:120px"></div></div>
          <div class="merchant-list">
            <div class="merchant-row" v-for="n in 3" :key="n">
              <div class="skel" style="width:26px;height:26px;border-radius:8px;flex-shrink:0"></div>
              <div class="skel" style="width:34px;height:34px;border-radius:9px;flex-shrink:0"></div>
              <div class="stat-body" style="flex:1"><div class="skel skel-label"></div><div class="skel skel-sub mt-1" style="width:60%"></div></div>
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

const { getAggregator, getTransactions, getTransactionStatusSummary, getPaymentMethodSummary, getDashboardAnalytics } = useAggregatorApi();
const authStore = useAuthStore();
const apexchart = VueApexCharts;
const loading   = ref(true);
const analytics = ref(null);

definePageMeta({ layout: "aggregatorlayer", middleware: "auth" });

/* ── Helpers ── */
const today      = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const periodLabel = (p) => ({ daily: 'Today', weekly: 'This Week', monthly: 'This Month', yearly: 'This Year' }[p] || p);
const initials   = (n) => (n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
const fmtAmt     = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';

const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarColor   = (n) => AVATAR_COLORS[(n || '?').charCodeAt(0) % AVATAR_COLORS.length];
const rankIcons     = ['mdi-medal', 'mdi-medal-outline', 'mdi-podium'];

const rateClass = (r) => r >= 90 ? 'rate-green' : r >= 70 ? 'rate-amber' : 'rate-red';
const rateColor = (r) => r >= 90 ? '#059669'   : r >= 70 ? '#d97706'   : '#ef4444';

/* ── Computed ── */
const collectionIcons  = ['mdi-cash-multiple','mdi-calendar-week','mdi-calendar-month-outline','mdi-calendar-star'];
const collectionColors = ['#059669','#d97706','#db2777','#0891b2'];
const collectionStats  = computed(() => [
  { title: 'Today',   value: authStore.summary.today.totalAmount.toFixed(2), sub: authStore.summary.today.count },
  { title: 'Weekly',  value: authStore.summary.week.totalAmount.toFixed(2),  sub: authStore.summary.week.count  },
  { title: 'Monthly', value: authStore.summary.month.totalAmount.toFixed(2), sub: authStore.summary.month.count },
  { title: 'Yearly',  value: authStore.summary.year.totalAmount.toFixed(2),  sub: authStore.summary.year.count  },
]);
const topMerchants = computed(() => authStore.topMerchants);

const noTransactionsToday  = computed(() => { const d = Object.values(authStore.transactionStatusSummary || {}); return !d.length || d.every(t => t.count === 0); });
const noPaymentTransactions = computed(() => { const d = Object.values(authStore.paymentSummary || {}); return !d.length || d.every(m => !m.amount || m.amount === 0); });

/* ── Existing Charts ── */
const CHART_BASE = {
  legend: { position: 'bottom', fontFamily: 'DM Sans', fontSize: '12px' },
  dataLabels: { style: { fontFamily: 'DM Sans', fontSize: '11px' } },
  stroke: { width: 2 },
  plotOptions: { pie: { donut: { size: '68%', labels: { show: true, total: { show: true, fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 700 } } } } },
};

const DONUT_COLORS = ['#1142d4','#10b981','#f59e0b','#ef4444','#7c3aed','#0891b2','#ec4899','#14b8a6'];

const donutSeries = computed(() => Object.values(authStore.paymentSummary).map(m => m.amount));
const donutOptions = computed(() => {
  const methods = Object.keys(authStore.paymentSummary);
  const values  = Object.values(authStore.paymentSummary).map(m => m.amount);
  const total   = values.reduce((a, v) => a + v, 0);
  return {
    ...CHART_BASE,
    labels:  methods,
    colors:  DONUT_COLORS,
    plotOptions: { ...CHART_BASE.plotOptions, pie: { donut: { ...CHART_BASE.plotOptions.pie.donut, labels: { ...CHART_BASE.plotOptions.pie.donut.labels, total: { ...CHART_BASE.plotOptions.pie.donut.labels.total, label: 'Total', formatter: () => `₹${total.toLocaleString('en-IN')}` } } } } },
    dataLabels: { enabled: true, formatter: (val, opts) => `₹${values[opts.seriesIndex].toLocaleString('en-IN')}` },
    tooltip: { y: { formatter: val => `₹${val.toLocaleString('en-IN')}` } },
  };
});

const statusDonutSeries = computed(() => Object.values(authStore.transactionStatusSummary).map(t => t.count));
const statusDonutOptions = computed(() => {
  const data  = Object.values(authStore.transactionStatusSummary);
  const labels = data.map(t => t.status);
  const total  = data.reduce((s, t) => s + t.count, 0);
  return {
    ...CHART_BASE,
    labels,
    colors: ['#10b981','#ef4444','#f59e0b','#1142d4'],
    plotOptions: { ...CHART_BASE.plotOptions, pie: { donut: { ...CHART_BASE.plotOptions.pie.donut, labels: { ...CHART_BASE.plotOptions.pie.donut.labels, total: { ...CHART_BASE.plotOptions.pie.donut.labels.total, label: 'Total Txns', formatter: () => total.toLocaleString('en-IN') } } } } },
    tooltip: { y: { formatter: (val, opts) => { const t = data[opts.seriesIndex]; return `${t.count} Txns · ₹${t.amount} · Code: ${t.responseCode}`; } } },
  };
});

/* ── 30-Day Volume Trend (area) ── */
const trendSeries = computed(() => analytics.value ? [
  { name: 'Volume (₹)', data: analytics.value.dailyTrend.map(d => d.amount) },
  { name: 'Transactions', data: analytics.value.dailyTrend.map(d => d.count) },
] : []);
const trendOptions = computed(() => ({
  chart:  { type: 'area', toolbar: { show: false }, fontFamily: 'DM Sans' },
  stroke: { curve: 'smooth', width: [2, 2] },
  colors: ['#1142d4', '#10b981'],
  fill:   { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02 } },
  grid:   { borderColor: '#f1f5f9' },
  xaxis:  {
    categories: analytics.value?.dailyTrend.map(d => d.label) ?? [],
    tickAmount: 8,
    labels: { style: { fontFamily: 'DM Sans', fontSize: '10px', colors: '#94a3b8' } },
  },
  yaxis: [
    { labels: { style: { fontFamily: 'DM Sans', fontSize: '10px', colors: '#94a3b8' }, formatter: v => v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}` } },
    { opposite: true, labels: { style: { fontFamily: 'DM Sans', fontSize: '10px', colors: '#94a3b8' } } },
  ],
  tooltip: { style: { fontFamily: 'DM Sans' }, y: [{ formatter: v => `₹${Number(v).toLocaleString('en-IN')}` }, { formatter: v => `${v} txns` }] },
  legend:  { position: 'top', fontFamily: 'DM Sans', fontSize: '12px' },
  dataLabels: { enabled: false },
}));

/* ── Today's Hourly Volume (bar) ── */
const hourlySeries = computed(() => analytics.value ? [{ name: 'Transactions', data: analytics.value.hourly.map(h => h.count) }] : [{ name: 'Transactions', data: Array(24).fill(0) }]);
const hourlyOptions = {
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'DM Sans' },
  plotOptions: { bar: { borderRadius: 3, columnWidth: '65%' } },
  colors: ['#d97706'],
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
  xaxis: {
    categories: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,'0')}h`),
    labels: { style: { fontFamily: 'DM Sans', fontSize: '9px', colors: '#94a3b8' } },
    tickAmount: 12,
  },
  yaxis: { labels: { style: { fontFamily: 'DM Sans', fontSize: '10px', colors: '#94a3b8' } } },
  tooltip: {
    x: { formatter: (_, { dataPointIndex: i }) => `${String(i).padStart(2,'0')}:00 – ${String(i+1).padStart(2,'0')}:00` },
    y: { formatter: val => `${val} txn${val !== 1 ? 's' : ''}` },
  },
};

/* ── Failed by Reason (horizontal bar) ── */
const failedSeries  = computed(() => analytics.value?.failedByReason?.length ? [{ name: 'Failed Txns', data: analytics.value.failedByReason.map(r => r.count) }] : []);
const failedOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'DM Sans' },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '55%' } },
  colors: ['#ef4444'],
  dataLabels: { enabled: false },
  grid: { borderColor: '#f1f5f9' },
  xaxis: { labels: { style: { fontFamily: 'DM Sans', fontSize: '10px', colors: '#94a3b8' } } },
  yaxis: {
    categories: analytics.value?.failedByReason?.map(r => r.reason) ?? [],
    labels: { style: { fontFamily: 'DM Sans', fontSize: '10px', colors: '#475569', fontWeight: 600 }, maxWidth: 160 },
  },
  tooltip: { y: { formatter: val => `${val} failed txns` } },
}));

/* ── Actions ── */
async function reload() {
  loading.value = true;
  try {
    await Promise.all([
      getAggregator(),
      getTransactions(),
      getTransactionStatusSummary(),
      getPaymentMethodSummary(),
      getDashboardAnalytics().then(d => { analytics.value = d; }),
    ]);
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

.dash-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; padding: 20px 16px 40px; }
.mono { font-family: 'DM Mono', monospace; }
.mb-1 { margin-bottom: 4px; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }

/* ── Header ── */
.dash-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dash-title { font-size: 22px; font-weight: 800; color: #0f172a; }
@media (min-width: 640px) { .dash-title { font-size: 26px; } }
.dash-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.refresh-btn { width: 36px; height: 36px; border-radius: 9px; background: #fff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #64748b; cursor: pointer; transition: background .13s, color .13s; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.refresh-btn:hover { background: #f1f5f9; color: #1142d4; }
.refresh-btn.spinning .mdi { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.live-badge { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e2e8f0; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.25); animation: pulse-g 2s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulse-g { 0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,.25); } 50% { box-shadow: 0 0 0 5px rgba(34,197,94,.08); } }

/* ── KPI Strip ── */
.kpi-strip { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (min-width: 600px)  { .kpi-strip { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1100px) { .kpi-strip { grid-template-columns: repeat(8, 1fr); } }

.kpi-card {
  background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 14px 16px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04); border-top: 3px solid var(--kc, #1142d4);
  transition: box-shadow .2s;
}
.kpi-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.kpi-icon-wrap { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.kpi-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.kpi-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; white-space: nowrap; }
.kpi-value { font-size: 16px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.kpi-sub-inline { font-size: 10px; font-weight: 600; color: #64748b; }
.cur { font-size: 10px; color: #94a3b8; }

/* ── Grid Layouts ── */
.row-2col { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 768px) { .row-2col { grid-template-columns: repeat(2, 1fr); } }

.row-4col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (min-width: 1024px) { .row-4col { grid-template-columns: repeat(4, 1fr); } }

/* ── Stat Card ── */
.stat-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 22px; display: flex; align-items: flex-start; gap: 14px; position: relative; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); transition: box-shadow .2s, transform .2s; }
.stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-1px); }
.stat-accent-bar { position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--accent, #1142d4); border-radius: 14px 14px 0 0; }
.stat-icon-wrap { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; background: color-mix(in srgb, var(--accent, #1142d4) 10%, transparent); display: flex; align-items: center; justify-content: center; }
.stat-icon { font-size: 22px; color: var(--accent, #1142d4); }
.stat-body { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.stat-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; }
.stat-value { font-size: 22px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stat-value-md { font-size: 18px; }
.currency-prefix { font-size: 12px; font-weight: 600; color: #94a3b8; margin-right: 1px; }
.stat-sub { font-size: 11px; color: #94a3b8; font-weight: 500; }

/* ── Cards ── */
.card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden; }
.chart-card { padding: 20px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.card-title-wrap { display: flex; align-items: center; gap: 10px; }
.card-icon-dot { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.chart-tag { font-size: 10px; font-weight: 700; color: #94a3b8; background: #f8fafc; border: 1px solid #e8edf3; border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: .06em; }
.chart-skel-wrap { padding: 20px 0; }

/* ── Empty State ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; gap: 10px; text-align: center; min-height: 280px; }
.empty-icon-wrap { width: 60px; height: 60px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 220px; line-height: 1.5; }

/* ── Merchant Health List ── */
.health-list { display: flex; flex-direction: column; gap: 10px; max-height: 260px; overflow-y: auto; padding-right: 4px; }
.health-list::-webkit-scrollbar { width: 4px; }
.health-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
.health-row { display: flex; align-items: flex-start; gap: 10px; }
.health-avatar { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; }
.health-info { flex: 1; min-width: 0; }
.health-name-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.health-name { font-size: 12px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.health-rate { font-size: 12px; font-weight: 800; font-family: 'DM Mono', monospace; }
.rate-green { color: #059669; }
.rate-amber { color: #d97706; }
.rate-red   { color: #ef4444; }
.health-bar-track { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
.health-bar-fill  { height: 100%; border-radius: 3px; transition: width .4s ease; }
.health-counts { display: flex; gap: 8px; }
.hc { font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 9999px; }
.hc-green { background: #f0fdf4; color: #15803d; }
.hc-red   { background: #fff1f2; color: #be123c; }
.hc-amber { background: #fffbeb; color: #92400e; }

/* ── Section header ── */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
.section-title  { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 800; color: #0f172a; }
.trophy-icon    { font-size: 18px; color: #f59e0b; }

/* ── Top Merchants ── */
.merchants-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 768px)  { .merchants-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1200px) { .merchants-grid { grid-template-columns: repeat(3, 1fr); } }
.merchant-card { padding: 18px; }
.period-chip { font-size: 10px; font-weight: 700; background: #f1f5f9; color: #64748b; padding: 3px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: .05em; }
.merchant-list { display: flex; flex-direction: column; gap: 8px; }
.merchant-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: #f8fafc; border: 1px solid #f1f5f9; transition: background .13s, border-color .13s; cursor: default; }
.merchant-row:hover { background: #f1f5f9; border-color: #e2e8f0; }
.rank-badge { width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; background: #f1f5f9; color: #94a3b8; }
.rank-badge.rank-1 { background: rgba(245,158,11,.12); color: #d97706; font-size: 14px; }
.rank-badge.rank-2 { background: rgba(148,163,184,.15); color: #64748b; font-size: 14px; }
.rank-badge.rank-3 { background: rgba(217,119,6,.1); color: #b45309; font-size: 14px; }
.merchant-avatar { width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; }
.merchant-info  { flex: 1; min-width: 0; }
.merchant-name  { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.merchant-txns  { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.merchant-amount { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600; color: #0f172a; white-space: nowrap; flex-shrink: 0; }
.merchant-empty { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 32px; font-size: 13px; color: #94a3b8; }
.merchant-empty .mdi { font-size: 20px; }

/* ── Skeleton ── */
.skel { background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skel-icon    { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; }
.skel-label   { height: 11px; width: 60%; border-radius: 4px; }
.skel-value   { height: 20px; width: 45%; border-radius: 4px; }
.skel-sub     { height: 10px; width: 70%; border-radius: 4px; }
.skel-donut   { width: 200px; height: 200px; border-radius: 50%; margin: 20px auto; }
</style>
