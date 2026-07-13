<template>
  <div class="dash-root">

    <!-- ── Page Header ── -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Dashboard</h1>
        <p class="dash-sub">{{ today }} · Live overview of your collections</p>
      </div>
      <div class="header-actions">
        <div class="live-badge">
          <span class="live-dot"></span>
          Live
        </div>
      </div>
    </div>

    <div class="hero-row">

      <!-- Wallet Summary Card -->
      <div class="balance-panel">
        <template v-if="!balanceLoading">
          <div class="bp-top">
            <span class="bp-label">Available Balance</span>
            <span class="bp-status-dot" :class="balanceData.walletActive ? 'dot-active' : 'dot-inactive'"></span>
          </div>
          <div class="bp-amount">
            <span class="bp-currency">₹</span>
            <span class="bp-value">{{ formatCurrency(balanceData.balance) }}</span>
          </div>
          <div class="bp-wallet-hint">
            <span class="mdi mdi-information-outline"></span>
            Manage your balance, add money and withdraw from the Wallet page
          </div>
          <div class="bp-actions">
            <NuxtLink to="/merchant/wallet" class="bp-btn bp-btn--add">
              <span class="mdi mdi-wallet-outline"></span>
              Manage Wallet
            </NuxtLink>
            <button class="bp-btn bp-btn--account" @click="navigateTo('/merchant/account')">
              <span class="mdi mdi-bank-outline"></span>
              View Account
            </button>
          </div>
        </template>
        <template v-else>
          <div class="skel skel-sm mb-2"></div>
          <div class="skel skel-xl mb-3"></div>
          <div class="skel skel-md mb-4"></div>
          <div class="skel skel-sm"></div>
        </template>
      </div>

            <!-- Donut -->
      <div class="card donut-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4">
              <span class="mdi mdi-chart-donut"></span>
            </div>
            <h2 class="card-title">Transaction Status</h2>
          </div>
        </div>
        <div class="chart-wrap">
          <apexchart type="donut" width="100%" :options="statusDonutOptions" :series="statusDonutSeries" />
        </div>
      </div>

    </div>

    <!-- ── Domestic Money Transfer entry point ── -->
    <div class="dmt-entry-card">
      <div class="dmt-entry-left">
        <div class="dmt-entry-icon"><span class="mdi mdi-bank-transfer"></span></div>
        <div>
          <h2 class="dmt-entry-title">Domestic Money Transfer</h2>
          <p class="dmt-entry-sub">Send money for your customers in under 60 seconds</p>
        </div>
      </div>
      <div class="dmt-entry-stats">
        <div class="dmt-stat">
          <span class="dmt-stat-label">Today's Transfer</span>
          <span class="dmt-stat-value">₹{{ fmtAmt(dmtStore.todaysSessionSummary.amount) }}</span>
        </div>
        <div class="dmt-stat">
          <span class="dmt-stat-label">Today's Commission</span>
          <span class="dmt-stat-value dmt-stat-green">₹{{ fmtAmt(dmtStore.todaysSessionSummary.commission) }}</span>
        </div>
        <div class="dmt-stat">
          <span class="dmt-stat-label">Remaining Wallet Balance</span>
          <span class="dmt-stat-value">₹{{ fmtAmt(balanceData.balance) }}</span>
        </div>
      </div>
      <NuxtLink to="/merchant/dmt" class="dmt-entry-cta">
        <span class="mdi mdi-send"></span>
        Send Money
      </NuxtLink>
    </div>

    <!-- ── AEPS entry point ── -->
    <div class="dmt-entry-card">
      <div class="dmt-entry-left">
        <div class="dmt-entry-icon"><span class="mdi mdi-fingerprint"></span></div>
        <div>
          <h2 class="dmt-entry-title">AEPS Services</h2>
          <p class="dmt-entry-sub">Cash withdrawal, balance enquiry &amp; mini statement via Aadhaar</p>
        </div>
      </div>
      <div class="dmt-entry-stats">
        <div class="dmt-stat">
          <span class="dmt-stat-label">Today's AEPS Txns</span>
          <span class="dmt-stat-value">{{ aepsStore.todaysSessionSummary.count }}</span>
        </div>
        <div class="dmt-stat">
          <span class="dmt-stat-label">Cash Disbursed</span>
          <span class="dmt-stat-value dmt-stat-green">₹{{ fmtAmt(aepsStore.todaysSessionSummary.cashDisbursed) }}</span>
        </div>
        <div class="dmt-stat">
          <span class="dmt-stat-label">Wallet Balance</span>
          <span class="dmt-stat-value">₹{{ fmtAmt(balanceData.balance) }}</span>
        </div>
      </div>
      <NuxtLink to="/merchant/aeps" class="dmt-entry-cta">
        <span class="mdi mdi-fingerprint"></span>
        Start Transaction
      </NuxtLink>
    </div>

    <!-- ── 4 Collection Stat Cards + Donut ── -->
    <!-- ── Transaction Status Summary Strip ── -->
    <div class="status-strip">
      <div class="status-pill status-success">
        <div class="sp-icon"><span class="mdi mdi-check-circle-outline"></span></div>
        <div class="sp-body">
          <p class="sp-label">Successful</p>
          <p class="sp-count">{{ stats?.byStatus?.SUCCESS?.count?.toLocaleString() ?? '0' }}</p>
          <p class="sp-amount">₹{{ fmtAmt(stats?.byStatus?.SUCCESS?.amount) }}</p>
        </div>
      </div>
      <div class="status-pill status-failed">
        <div class="sp-icon"><span class="mdi mdi-close-circle-outline"></span></div>
        <div class="sp-body">
          <p class="sp-label">Failed</p>
          <p class="sp-count">{{ stats?.byStatus?.FAILED?.count?.toLocaleString() ?? '0' }}</p>
          <p class="sp-amount">₹{{ fmtAmt(stats?.byStatus?.FAILED?.amount) }}</p>
        </div>
      </div>
      <div class="status-pill status-pending">
        <div class="sp-icon"><span class="mdi mdi-clock-outline"></span></div>
        <div class="sp-body">
          <p class="sp-label">Pending</p>
          <p class="sp-count">{{ stats?.byStatus?.PENDING?.count?.toLocaleString() ?? '0' }}</p>
          <p class="sp-amount">₹{{ fmtAmt(stats?.byStatus?.PENDING?.amount) }}</p>
        </div>
      </div>
      <div class="status-pill status-today">
        <div class="sp-icon"><span class="mdi mdi-calendar-today"></span></div>
        <div class="sp-body">
          <p class="sp-label">Today</p>
          <p class="sp-count">{{ stats?.today?.count?.toLocaleString() ?? '0' }} txns</p>
          <p class="sp-amount">₹{{ fmtAmt(stats?.today?.amount) }}</p>
        </div>
      </div>
      <div class="status-pill status-month">
        <div class="sp-icon"><span class="mdi mdi-calendar-month-outline"></span></div>
        <div class="sp-body">
          <p class="sp-label">This Month</p>
          <p class="sp-count">{{ stats?.thisMonth?.count?.toLocaleString() ?? '0' }} txns</p>
          <p class="sp-amount">₹{{ fmtAmt(stats?.thisMonth?.amount) }}</p>
        </div>
      </div>
    </div>

    <!-- ── Top Grid (4 Collection Cards + Donut: Txn Count by Method) ── -->
    <div class="top-grid">

      <div class="stats-four">

        <div class="stat-card" :style="{ '--accent': '#1142d4' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap"><span class="mdi mdi-calendar-today stat-icon"></span></div>
          <div class="stat-body">
            <p class="stat-label">Today Payments</p>
            <p class="stat-value"><span class="currency-prefix">₹</span>{{ collections.dailyCollection.toFixed(2) }}</p>
            <p class="stat-sub">{{ collections.dailyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="todayProgress" color="#1142d4" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.dailyCount }} / 1,000,000</span>
          </div>
        </div>

        <div class="stat-card" :style="{ '--accent': '#7c3aed' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap" style="background:rgba(124,58,237,.1)"><span class="mdi mdi-calendar-week stat-icon" style="color:#7c3aed"></span></div>
          <div class="stat-body">
            <p class="stat-label">Weekly Payments</p>
            <p class="stat-value"><span class="currency-prefix">₹</span>{{ collections.weeklyCollection.toFixed(2) }}</p>
            <p class="stat-sub">{{ collections.weeklyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="weeklyProgress" color="#7c3aed" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.weeklyCount }} / 1,000</span>
          </div>
        </div>

        <div class="stat-card" :style="{ '--accent': '#059669' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap" style="background:rgba(5,150,105,.1)"><span class="mdi mdi-calendar-month-outline stat-icon" style="color:#059669"></span></div>
          <div class="stat-body">
            <p class="stat-label">Monthly Payments</p>
            <p class="stat-value"><span class="currency-prefix">₹</span>{{ collections.monthlyCollection.toFixed(2) }}</p>
            <p class="stat-sub">{{ collections.monthlyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="monthlyProgress" color="#059669" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.monthlyCount }} / 1,000</span>
          </div>
        </div>

        <div class="stat-card" :style="{ '--accent': '#d97706' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap" style="background:rgba(217,119,6,.1)"><span class="mdi mdi-calendar-star stat-icon" style="color:#d97706"></span></div>
          <div class="stat-body">
            <p class="stat-label">Yearly Payments</p>
            <p class="stat-value"><span class="currency-prefix">₹</span>{{ collections.yearlyCollection.toFixed(2) }}</p>
            <p class="stat-sub">{{ collections.yearlyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="yearlyProgress" color="#d97706" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.yearlyCount }} / 1,000</span>
          </div>
        </div>

      </div>

      <!-- Donut: Txn Count by Payment Method -->
      <div class="card donut-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4">
              <span class="mdi mdi-chart-donut"></span>
            </div>
            <h2 class="card-title">Txns by Method</h2>
          </div>
          <span class="chart-tag">All time</span>
        </div>
        <div class="chart-wrap">
          <apexchart type="donut" width="100%" :options="donutOptions" :series="donutSeries" />
        </div>
      </div>

    </div>

    <!-- ── Settlement Info ── -->
    <div class="settlement-grid" v-if="stats?.settlement">

      <!-- Pending Settlement -->
      <div class="card stl-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706">
              <span class="mdi mdi-bank-transfer-out"></span>
            </div>
            <h2 class="card-title">Pending Settlement</h2>
          </div>
          <span class="stl-badge badge-amber">{{ stats.settlement.pending.count }} txns</span>
        </div>
        <div class="stl-amount">₹{{ fmtAmt(stats.settlement.pending.netSettlement || stats.settlement.pending.amount) }}</div>
        <p class="stl-sub">Awaiting bank transfer</p>
      </div>

      <!-- Last Settlement -->
      <div class="card stl-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669">
              <span class="mdi mdi-check-decagram-outline"></span>
            </div>
            <h2 class="card-title">Last Settlement</h2>
          </div>
          <span class="stl-badge badge-green">Settled</span>
        </div>
        <div class="stl-amount">₹{{ fmtAmt(stats.settlement.lastSettled?.netSettlement) }}</div>
        <p class="stl-sub">{{ stats.settlement.lastSettled?.settledAt ? fmtDate(stats.settlement.lastSettled.settledAt) : 'No settlements yet' }}</p>
        <p class="stl-ref mono" v-if="stats.settlement.lastSettled?.settlementRef">{{ stats.settlement.lastSettled.settlementRef }}</p>
      </div>

      <!-- Recent Settlements -->
      <div class="card stl-recent">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4">
              <span class="mdi mdi-history"></span>
            </div>
            <h2 class="card-title">Recent Settlements</h2>
          </div>
        </div>
        <div class="stl-list" v-if="stats.settlement.recent?.length">
          <div v-for="s in stats.settlement.recent" :key="s.id" class="stl-row">
            <div class="stl-row-left">
              <span class="chip chip-xs" :class="stlChip(s.status)">{{ s.status }}</span>
              <span class="stl-row-ref mono">{{ s.settlementRef ?? '—' }}</span>
            </div>
            <div class="stl-row-right">
              <span class="stl-row-amt">₹{{ fmtAmt(s.netSettlement ?? s.amount) }}</span>
              <span class="stl-row-date">{{ s.settledAt ? fmtDate(s.settledAt) : fmtDate(s.createdAt) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="stl-empty">No settlement records yet</div>
      </div>

    </div>

    <!-- ── Analytics Row 1: Payment Method Bar + Success Rate ── -->
    <div class="analytics-row two-three">

      <!-- Payment by Method (amount) -->
      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4">
              <span class="mdi mdi-credit-card-multiple-outline"></span>
            </div>
            <h2 class="card-title">Payments by Method</h2>
          </div>
          <span class="chart-tag">All time</span>
        </div>
        <apexchart type="bar" height="230" :options="methodOptions" :series="methodSeries" />
      </div>

      <!-- Success Rate Radial -->
      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669">
              <span class="mdi mdi-target"></span>
            </div>
            <h2 class="card-title">Success Rate</h2>
          </div>
        </div>
        <apexchart type="radialBar" height="200" :options="successRateOptions" :series="successRateSeries" />
        <div class="rate-stats">
          <div class="rate-stat">
            <span class="rate-dot dot-green"></span>
            <span class="rate-label">Success</span>
            <span class="rate-val">{{ stats?.byStatus?.SUCCESS?.count?.toLocaleString() ?? 0 }}</span>
          </div>
          <div class="rate-stat">
            <span class="rate-dot dot-red"></span>
            <span class="rate-label">Failed</span>
            <span class="rate-val">{{ stats?.byStatus?.FAILED?.count?.toLocaleString() ?? 0 }}</span>
          </div>
          <div class="rate-stat">
            <span class="rate-dot dot-amber"></span>
            <span class="rate-label">Pending</span>
            <span class="rate-val">{{ stats?.byStatus?.PENDING?.count?.toLocaleString() ?? 0 }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Peak Hours (full width) ── -->
    <div class="card chart-card">
      <div class="card-header">
        <div class="card-title-wrap">
          <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706">
            <span class="mdi mdi-clock-time-four-outline"></span>
          </div>
          <h2 class="card-title">Peak Hours</h2>
        </div>
        <span class="chart-tag">Today</span>
      </div>
      <apexchart type="bar" height="200" :options="hourlyOptions" :series="hourlySeries" />
    </div>

    <!-- ── Payment Trends Line Chart ── -->
    <div class="card line-card">
      <div class="card-header">
        <div class="card-title-wrap">
          <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4">
            <span class="mdi mdi-chart-line"></span>
          </div>
          <h2 class="card-title">Payment Trends</h2>
        </div>
      </div>
      <div class="tab-strip">
        <button v-for="t in tabs" :key="t.value" class="tab-btn" :class="{ active: tab === t.value }" @click="tab = t.value">{{ t.label }}</button>
      </div>
      <div class="mt-4">
        <apexchart type="line" height="300" :options="lineOptions" :series="lineSeries" />
      </div>
    </div>

    <!-- ── Recent Transactions ── -->
    <div class="mt-4">
      <MerchantTransactions />
    </div>


    <!-- ── Toast ── -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="toast.show" class="toast-bar" :class="'toast-bar--' + toast.type">
          <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="toast.show = false">
            <span class="mdi mdi-close"></span>
          </button>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePaymentsStore } from "~/stores/payments";
import { useDmtStore } from "~/stores/dmt";
import { useAepsStore } from "~/stores/aeps";
import { usePaymentsApi } from "~/composables/apis/usepaymentsApi";
import { useMerchantBalanceApi } from "~/composables/apis/useMerchantBalanceApi";
import VueApexCharts from "vue3-apexcharts";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const apexchart = VueApexCharts;

// ── Payments store / api ───────────────────────────────────────
const store = usePaymentsStore();
const dmtStore = useDmtStore();
const aepsStore = useAepsStore();
const { getMerchantCollections, getPaymentsByGranularity, getMerchantDashboardStats } = usePaymentsApi();
const { totalCollection: collections } = storeToRefs(store);

// ── Balance composable ─────────────────────────────────────────
const {
  balanceData, balanceLoading,
  fetchBalance, formatCurrency,
} = useMerchantBalanceApi();

// ── Chart tabs ─────────────────────────────────────────────────
const tab = ref("day");
const tabs = [
  { value: "day",     label: "Today"    },
  { value: "week",    label: "Weekly"   },
  { value: "month",   label: "Monthly"  },
  { value: "year",    label: "Yearly"   },
  { value: "5years",  label: "5 Years"  },
  { value: "10years", label: "10 Years" },
];

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

// ── Collection progress ────────────────────────────────────────
const stats = ref(null);

// ── Status donut (hero-row) — computed from stats.byStatus ────────────────
const statusDonutSeries = computed(() => {
  if (!stats.value?.byStatus) return [];
  const s = stats.value.byStatus;
  return [s.SUCCESS?.count ?? 0, s.FAILED?.count ?? 0, s.PENDING?.count ?? 0];
});
const statusDonutOptions = ref({
  labels: ['Success', 'Failed', 'Pending'],
  colors: ['#059669', '#ef4444', '#d97706'],
  legend: { position: 'bottom', fontFamily: 'DM Sans', fontSize: '12px' },
  dataLabels: { style: { fontFamily: 'DM Sans', fontSize: '11px' } },
  stroke: { width: 2 },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name:  { show: true, fontSize: '13px', fontFamily: 'DM Sans', offsetY: -10 },
          value: { show: true, fontSize: '20px', fontWeight: 800, fontFamily: 'DM Mono, monospace', offsetY: 8, formatter: (val) => Math.round(val).toLocaleString() },
          total: { show: true, label: 'Total Txns', fontSize: '12px', fontWeight: 700, fontFamily: 'DM Sans', formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() },
        },
      },
    },
  },
  tooltip: { enabled: true, y: { formatter: (val) => `${Math.round(val).toLocaleString()} txns` } },
});

const todayProgress   = computed(() => (collections.value.dailyCollection   / 1000000) * 100);
const weeklyProgress  = computed(() => (collections.value.weeklyCollection  / 1000)    * 100);
const monthlyProgress = computed(() => (collections.value.monthlyCollection / 1000)    * 100);
const yearlyProgress  = computed(() => (collections.value.yearlyCollection  / 1000)    * 100);

// ── Helpers ────────────────────────────────────────────────────
const fmtAmt  = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const stlChip = (s) => {
  if (s === 'SUCCESS')    return 'chip-green';
  if (s === 'FAILED')     return 'chip-red';
  if (s === 'PROCESSING') return 'chip-blue';
  return 'chip-amber';
};

// ── Donut: Transaction count by payment method ────────────────────────────
const METHOD_COLORS = ["#1142d4","#7c3aed","#059669","#d97706","#ef4444","#0891b2","#ec4899","#14b8a6","#f97316","#84cc16","#a855f7"];
const donutSeries  = ref([]);
const donutOptions = ref({
  labels: [],
  colors: METHOD_COLORS,
  legend: { position: "bottom", fontFamily: "DM Sans", fontSize: "12px" },
  dataLabels: { style: { fontFamily: "DM Sans", fontSize: "11px" } },
  stroke: { width: 2 },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          name:  { show: true, fontSize: "13px", fontFamily: "DM Sans", offsetY: -10 },
          value: { show: true, fontSize: "20px", fontWeight: 800, fontFamily: "DM Mono, monospace", offsetY: 8, formatter: (val) => Math.round(val).toLocaleString() },
          total: {
            show: true, label: "Total Txns", fontSize: "12px", fontWeight: 700, fontFamily: "DM Sans",
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString(),
          },
        },
      },
    },
  },
  tooltip: { enabled: true, y: { formatter: (val) => `${Math.round(val).toLocaleString()} txns` } },
});

// ── Payment trends line chart ─────────────────────────────────────────────
const lineSeries  = ref([{ name: "Payments (₹)", data: [] }]);
const lineOptions = ref({
  chart: { toolbar: { show: false }, fontFamily: "DM Sans" },
  stroke: { curve: "smooth", width: 3 },
  colors: ["#1142d4"],
  grid:   { borderColor: "#f1f5f9" },
  xaxis:  { categories: [], labels: { style: { fontFamily: "DM Sans", fontSize: "11px", colors: "#94a3b8" } } },
  yaxis:  { labels: { style: { fontFamily: "DM Sans", fontSize: "11px", colors: "#94a3b8" }, formatter: (v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}` } },
  tooltip: { style: { fontFamily: "DM Sans" }, y: { formatter: (val) => `₹${Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` } },
});

// ── Payment Method bar chart (amount) ────────────────────────────────────
const methodSeries  = ref([{ name: "Amount (₹)", data: [] }]);
const methodOptions = ref({
  chart: { type: "bar", toolbar: { show: false }, fontFamily: "DM Sans" },
  plotOptions: { bar: { borderRadius: 6, columnWidth: "52%", distributed: true } },
  colors: METHOD_COLORS,
  legend: { show: false },
  dataLabels: { enabled: false },
  grid: { borderColor: "#f1f5f9" },
  xaxis: { categories: [], labels: { style: { fontFamily: "DM Sans", fontSize: "11px", colors: "#94a3b8" } } },
  yaxis: { labels: { style: { fontFamily: "DM Sans", fontSize: "11px", colors: "#94a3b8" }, formatter: (v) => v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}` } },
  tooltip: { y: { formatter: (val) => `₹${Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` } },
});

// ── Success Rate radial bar ──────────────────────────────────────────────
const successRate = computed(() => {
  if (!stats.value?.byStatus) return 0;
  const s = stats.value.byStatus;
  const total = (s.SUCCESS?.count ?? 0) + (s.FAILED?.count ?? 0) + (s.PENDING?.count ?? 0);
  if (!total) return 0;
  return Math.round((s.SUCCESS?.count ?? 0) / total * 100);
});
const successRateSeries  = computed(() => [successRate.value]);
const successRateOptions = ref({
  chart: { type: "radialBar", fontFamily: "DM Sans" },
  plotOptions: {
    radialBar: {
      hollow: { size: "62%" },
      track:  { background: "#f1f5f9", strokeWidth: "100%" },
      dataLabels: {
        name:  { show: true, fontSize: "12px", fontFamily: "DM Sans", color: "#64748b", offsetY: -8 },
        value: { show: true, fontSize: "26px", fontWeight: 800, fontFamily: "DM Mono, monospace", color: "#0f172a", offsetY: 8, formatter: (v) => `${v}%` },
      },
    },
  },
  colors: ["#059669"],
  labels: ["Success Rate"],
  stroke: { lineCap: "round" },
});

// ── Peak Hours column bar ────────────────────────────────────────────────
const hourlySeries  = ref([{ name: "Transactions", data: Array(24).fill(0) }]);
const hourlyOptions = ref({
  chart: { type: "bar", toolbar: { show: false }, fontFamily: "DM Sans" },
  plotOptions: { bar: { borderRadius: 3, columnWidth: "65%" } },
  colors: ["#d97706"],
  dataLabels: { enabled: false },
  grid: { borderColor: "#f1f5f9" },
  xaxis: {
    categories: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2,"0")}h`),
    labels: { style: { fontFamily: "DM Sans", fontSize: "9px", colors: "#94a3b8" } },
    tickAmount: 12,
  },
  yaxis: { labels: { style: { fontFamily: "DM Sans", fontSize: "10px", colors: "#94a3b8" } } },
  tooltip: {
    x: { formatter: (_, { dataPointIndex: i }) => `${String(i).padStart(2,"0")}:00 – ${String(i+1).padStart(2,"0")}:00` },
    y: { formatter: (val) => `${val} txn${val !== 1 ? "s" : ""}` },
  },
});

// ── Populate charts from dashboard stats ─────────────────────────────────
const loadAnalyticsCharts = (data) => {
  // Donut: txn COUNT by payment method
  if (data.byPaymentMethod?.length) {
    const sorted = [...data.byPaymentMethod].sort((a, b) => b.count - a.count);
    donutSeries.value  = sorted.map(r => r.count);
    donutOptions.value = { ...donutOptions.value, labels: sorted.map(r => r.method) };
  }
  // Bar: amount by method
  if (data.byPaymentMethod?.length) {
    const sorted = [...data.byPaymentMethod].sort((a, b) => b.amount - a.amount);
    methodOptions.value = { ...methodOptions.value, xaxis: { ...methodOptions.value.xaxis, categories: sorted.map(r => r.method) } };
    methodSeries.value  = [{ name: "Amount (₹)", data: sorted.map(r => r.amount) }];
  }
  // Hourly: today's peak hours
  if (data.hourly?.length) {
    const counts = Array(24).fill(0);
    for (const h of data.hourly) counts[h.hour] = h.count;
    hourlySeries.value = [{ name: "Transactions", data: counts }];
  }
};

// ── Payment trends time series ────────────────────────────────────────────
const loadTimeSeries = async (granularity) => {
  try {
    const res = await getPaymentsByGranularity(granularity);
    if (res?.data?.totals && res?.data?.labels) {
      lineSeries.value  = [{ name: "Payments (₹)", data: res.data.totals }];
      lineOptions.value = { ...lineOptions.value, xaxis: { ...lineOptions.value.xaxis, categories: res.data.labels } };
    }
  } catch (err) { console.error("Error loading time series:", err); }
};

watch(tab, (newTab) => loadTimeSeries(newTab));

// ── Toast ──────────────────────────────────────────────────────
const toast = ref({ show: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 4000);
};

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    getMerchantCollections(),
    loadTimeSeries(tab.value),
    fetchBalance(),
    getMerchantDashboardStats().then(d => { stats.value = d; if (d) loadAnalyticsCharts(d); }),
  ]);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

.dash-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; }

/* Header */
.dash-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dash-title { font-size: 22px; font-weight: 800; color: #0f172a; }
@media (min-width: 640px) { .dash-title { font-size: 26px; } }
.dash-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
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
@keyframes pulse-g {
  0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,.25); }
  50%      { box-shadow: 0 0 0 5px rgba(34,197,94,.08); }
}

/* Status Strip */
.status-strip { display: flex; gap: 10px; flex-wrap: wrap; }
.status-pill {
  flex: 1; min-width: 140px;
  background: #fff; border: 1px solid #e8edf3; border-radius: 12px;
  padding: 14px 16px; box-shadow: 0 1px 4px rgba(0,0,0,.04);
  display: flex; align-items: center; gap: 12px;
  transition: box-shadow .2s;
}
.status-pill:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.sp-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.sp-body { display: flex; flex-direction: column; gap: 1px; }
.sp-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #94a3b8; }
.sp-count { font-size: 18px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; line-height: 1.2; }
.sp-amount { font-size: 11px; font-weight: 600; color: #64748b; font-family: 'DM Mono', monospace; }

/* ══════════════════════════════════════════════════
   HERO ROW  (Balance LEFT + Merchant Stats RIGHT)
══════════════════════════════════════════════════ */
.hero-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 0;
  align-items: stretch;
}
@media (max-width: 900px) {
  .hero-row { grid-template-columns: 1fr; }
}

/* ── Balance Panel ── */
.balance-panel {
  background: linear-gradient(135deg, #1142d4 0%, #1e3fbe 50%, #0e35a8 100%);
  border-radius: 16px;
  padding: 28px 28px 24px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(17, 66, 212, 0.30);
  transition: box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.balance-panel::before {
  content: '';
  position: absolute;
  width: 320px; height: 320px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  top: -100px; right: -80px;
  pointer-events: none;
}
.balance-panel::after {
  content: '';
  position: absolute;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  bottom: -60px; left: -40px;
  pointer-events: none;
}
.balance-panel:hover { box-shadow: 0 12px 40px rgba(17, 66, 212, 0.40); }

.bp-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
}
.bp-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.65);
}
.bp-status-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
}
.dot-active  { background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,0.3); }
.dot-inactive{ background: #f87171; box-shadow: 0 0 0 3px rgba(248,113,113,0.3); }

.bp-amount {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  flex: 1;
}
.bp-currency { font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.70); }
.bp-value    { font-size: 44px; font-weight: 700; color: #fff; font-family: 'DM Mono', monospace; letter-spacing: -2px; line-height: 1; }

.bp-actions {
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 1;
}
.bp-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 12px;
  border-radius: 11px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.bp-wallet-hint {
  display: flex; align-items: center; gap: 6px;
  font-size: .78rem; opacity: .75; position: relative; z-index: 1;
}
.bp-btn--add {
  background: rgba(255,255,255,1);
  color: #0f172a;
  border: 1px solid rgba(255,255,255,0.28);
  text-decoration: none;
}
.bp-btn--add:hover { background: rgba(255,255,255,0.85); }
.bp-btn--withdraw {
  background: rgba(255,255,255,1);
  color: #0f172a;
  border: 1px solid rgba(255,255,255,0.15);
}
.bp-btn--withdraw:hover:not(:disabled) { background: rgba(255,255,255,0.85); }
.bp-btn--withdraw:disabled { opacity: 0.4; cursor: not-allowed; }
.bp-btn--account {
  background: rgba(255,255,255,1);
  color: #0f172a;
  border: 1px solid rgba(255,255,255,0.18);
}
.bp-btn--account:hover { background: rgba(255,255,255,0.85); }

/* ── Merchant Stats Panel (right side) ── */
.merchant-stats-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.merchant-stat-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
  flex: 1;
}
.merchant-stat-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #1142d4, #4169e1);
  opacity: 0; transition: opacity 0.2s;
}
.merchant-stat-card:hover { box-shadow: 0 6px 20px rgba(17,66,212,0.10); transform: translateY(-2px); }
.merchant-stat-card:hover::before { opacity: 1; }

.merchant-stat-card--accent {
  background: linear-gradient(135deg, #1142d4 0%, #2255e8 100%);
  border-color: transparent;
}
.merchant-stat-card--accent::before { opacity: 0 !important; }
.merchant-stat-card--accent .msc-label { color: rgba(255,255,255,0.65); }
.merchant-stat-card--accent .msc-value { color: #fff; }
.merchant-stat-card--accent .msc-sub   { color: rgba(255,255,255,0.60); }
.merchant-stat-card--accent .msc-icon-wrap { background: rgba(255,255,255,0.18); color: #fff; }
.merchant-stat-card--accent:hover { box-shadow: 0 8px 24px rgba(17,66,212,0.35); }

.msc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.msc-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
}
.msc-icon-wrap {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
}
.msc-icon-0 { background: rgba(255,255,255,0.18); color: #fff; }
.msc-icon-1 { background: rgba(17,66,212,0.08); color: #1142d4; }

.msc-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  font-family: 'DM Mono', monospace;
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.msc-sub { font-size: 12px; color: #94a3b8; }

/* ══════════════════════════════════════════════════
   COLLECTION STATS + DONUT
══════════════════════════════════════════════════ */
.top-grid {
  display: grid; grid-template-columns: 1fr; gap: 12px;
}
@media (min-width: 1024px) { .top-grid { grid-template-columns: 1fr; } }

.stats-four { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 600px)  { .stats-four { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: #fff; border: 1px solid #e8edf3; border-radius: 14px;
  padding: 18px; display: flex; flex-direction: column; gap: 10px;
  position: relative; overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  transition: box-shadow .2s, transform .2s;
}
.stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-1px); }
.stat-accent-bar {
  position: absolute; top: 0; left: 0; width: 100%; height: 3px;
  background: var(--accent, #1142d4); border-radius: 14px 14px 0 0;
}
.status-success .sp-icon { background: #f0fdf4; color: #16a34a; }
.status-success { border-top: 3px solid #16a34a; }
.status-failed  .sp-icon { background: #fff1f2; color: #be123c; }
.status-failed  { border-top: 3px solid #be123c; }
.status-pending .sp-icon { background: #fffbeb; color: #d97706; }
.status-pending { border-top: 3px solid #d97706; }
.status-today   .sp-icon { background: rgba(17,66,212,.08); color: #1142d4; }
.status-today   { border-top: 3px solid #1142d4; }
.status-month   .sp-icon { background: rgba(124,58,237,.08); color: #7c3aed; }
.status-month   { border-top: 3px solid #7c3aed; }

/* Top grid */
.top-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 1024px) { .top-grid { grid-template-columns: 1fr 320px; } }

.stats-four { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 600px)  { .stats-four { grid-template-columns: repeat(2, 1fr); } }

/* Stat Card */
.stat-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 10px; position: relative; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); transition: box-shadow .2s, transform .2s; }
.stat-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.08); transform: translateY(-1px); }
.stat-accent-bar { position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--accent, #1142d4); border-radius: 14px 14px 0 0; }
.stat-icon-wrap { width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0; background: rgba(17,66,212,.1); display: flex; align-items: center; justify-content: center; }
.stat-icon { font-size: 20px; color: #1142d4; }
.stat-body { display: flex; flex-direction: column; gap: 3px; }
.stat-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; }
.stat-value { font-size: 20px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.currency-prefix { font-size: 11px; font-weight: 600; color: #94a3b8; margin-right: 1px; }
.stat-sub { font-size: 11px; color: #94a3b8; font-weight: 500; }
.progress-wrap { display: flex; flex-direction: column; gap: 4px; }
.prog { border-radius: 9999px; }
.prog-label { font-size: 10px; color: #94a3b8; font-weight: 500; }

/* ── Cards ── */
.card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden; }
.donut-card { padding: 20px; }
.line-card  { padding: 20px; }
.chart-card { padding: 20px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.card-title-wrap { display: flex; align-items: center; gap: 10px; }
.card-icon-dot { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.chart-wrap { min-height: 200px; }
.chart-tag  { font-size: 10px; font-weight: 700; color: #94a3b8; background: #f8fafc; border: 1px solid #e8edf3; border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }

.tab-strip { display: flex; flex-wrap: wrap; gap: 6px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
.tab-btn {
  padding: 5px 14px; border-radius: 9999px; font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 600; border: 1px solid #e8edf3;
  background: #f8fafc; color: #64748b; cursor: pointer; transition: all .15s;
}
.tab-btn:hover  { background: #f1f5f9; color: #1142d4; border-color: #c7d2fe; }
.tab-btn.active { background: #1142d4; color: #fff; border-color: #1142d4; }
.mt-4 { margin-top: 16px; }

/* ══════════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9000; padding: 16px;
  animation: fadeIn .2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal-card {
  background: #fff; border-radius: 16px; width: 100%; max-width: 420px;
  box-shadow: 0 16px 48px rgba(0,0,0,.18);
  animation: slideUp .25s ease; overflow: hidden;
}
.modal-card--wide { max-width: 600px; }
@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-header {
  display: flex; align-items: center; gap: 12px;
  padding: 18px 20px 14px; border-bottom: 1px solid #f1f5f9;
}
.modal-hicon {
  width: 38px; height: 38px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 19px; flex-shrink: 0;
}
.modal-hicon--add      { background: rgba(17,66,212,.08); color: #1142d4; }
.modal-hicon--withdraw { background: rgba(220,38,38,.08); color: #dc2626; }
.modal-hicon--history  { background: rgba(100,116,139,.08); color: #64748b; }
.modal-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
.modal-sub   { font-size: 12px; color: #94a3b8; margin: 2px 0 0; }
.modal-close {
  margin-left: auto; width: 30px; height: 30px; border-radius: 8px;
  border: none; background: none; cursor: pointer; color: #94a3b8;
  display: flex; align-items: center; justify-content: center; font-size: 17px;
  transition: background .15s;
}
.modal-close:hover { background: #f1f5f9; color: #475569; }
.modal-body  { padding: 18px 20px; }
.modal-body--scroll { max-height: 420px; overflow-y: auto; padding: 14px 20px; }
.modal-footer { display: flex; gap: 10px; padding: 14px 20px; border-top: 1px solid #f1f5f9; }

.mbtn {
  flex: 1; padding: 10px 14px; border-radius: 9px; border: none;
  font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all .2s;
}
.mbtn--primary   { background: #1142d4; color: #fff; }
.mbtn--primary:hover:not(:disabled)   { background: #0e35a8; box-shadow: 0 4px 12px rgba(17,66,212,.3); }
.mbtn--danger    { background: #dc2626; color: #fff; }
.mbtn--danger:hover:not(:disabled)    { background: #b91c1c; box-shadow: 0 4px 12px rgba(220,38,38,.3); }
.mbtn--secondary { background: #f1f5f9; color: #475569; }
.mbtn--secondary:hover { background: #e2e8f0; }
.mbtn:disabled   { opacity: .5; cursor: not-allowed; }

.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 5px; }
.form-opt   { font-weight: 400; color: #9ca3af; }
.form-input {
  width: 100%; padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; font-family: 'DM Sans', sans-serif; color: #1e293b;
  transition: border-color .2s, box-shadow .2s; outline: none;
}
.form-input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.10); }
.form-hint  { display: block; font-size: 11px; color: #94a3b8; margin-top: 4px; }

.settlement-preview {
  display: flex; align-items: center; gap: 12px;
  background: #f0f4ff; border: 1px solid rgba(17,66,212,.15);
  border-radius: 10px; padding: 11px 13px; margin-bottom: 16px;
}
.sp-icon { font-size: 19px; color: #1142d4; }
.sp-info { display: flex; flex-direction: column; gap: 2px; }
.sp-name   { font-size: 12px; font-weight: 600; color: #1e293b; }
.sp-detail { font-size: 11px; color: #64748b; }

.confirm-label { font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .06em; }
.confirm-account-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
.cac-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; }
.cac-row-amount { padding-top: 10px; }
.cac-key    { font-size: 12px; color: #94a3b8; }
.cac-val    { font-size: 12px; font-weight: 600; color: #1e293b; }
.cac-amount { font-size: 17px; font-weight: 700; color: #dc2626; font-family: 'DM Mono', monospace; }
.cac-divider { height: 1px; background: #e2e8f0; margin: 7px 0; }

.history-tabs { display: flex; gap: 4px; padding: 0 20px 10px; border-bottom: 1px solid #f1f5f9; }
.history-tab {
  padding: 5px 13px; border-radius: 8px; border: none;
  font-size: 12px; font-weight: 600; cursor: pointer; background: none; color: #94a3b8; transition: all .15s;
}
.history-tab:hover { background: #f1f5f9; color: #475569; }
.history-tab--active { background: #eff6ff; color: #1142d4; }

.history-loading { padding: 12px 0; }

.h-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 30px 16px; text-align: center; }
.h-empty-icon  { font-size: 32px; color: #cbd5e1; }
.h-empty-title { font-size: 13px; font-weight: 600; color: #334155; }
.h-empty-sub   { font-size: 12px; color: #94a3b8; }

.history-tbl { width: 100%; }
.history-tbl-head {
  display: grid; grid-template-columns: 28px 1fr 120px 90px 72px;
  padding: 7px 10px; background: #f8fafc; border-radius: 8px; margin-bottom: 3px;
}
.hth   { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
.hth-r { text-align: right; }
.hth-c { text-align: center; }

.history-tbl-row {
  display: grid; grid-template-columns: 28px 1fr 120px 90px 72px;
  padding: 10px 10px; border-bottom: 1px solid #f1f5f9; align-items: center;
  transition: background .1s; border-radius: 6px;
}
.history-tbl-row:hover { background: #f8fafc; }
.history-tbl-row:last-child { border-bottom: none; }

.htd { font-size: 12px; color: #475569; display: flex; align-items: center; gap: 7px; }
.htd-seq  { font-size: 11px; color: #cbd5e1; font-weight: 600; }
.htd-desc { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.htd-date { font-size: 11px; color: #94a3b8; }
.htd-r    { justify-content: flex-end; }

.htd-dot {
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; flex-shrink: 0;
}
.htd-dot.credit { background: #dcfce7; color: #16a34a; }
.htd-dot.debit  { background: #fee2e2; color: #dc2626; }

.htd-amount { font-size: 13px; font-weight: 700; }
.htd-amount.credit { color: #16a34a; }
.htd-amount.debit  { color: #dc2626; }

.htd-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: .3px; }
.htd-pill.credit { background: #dcfce7; color: #16a34a; }
.htd-pill.debit  { background: #fee2e2; color: #dc2626; }

.history-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding-top: 12px; }
.page-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 16px; color: #475569; transition: all .15s;
}
.page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-info { font-size: 12px; font-weight: 600; color: #64748b; }

/* ── Toast ── */
.toast-bar {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 10px;
  padding: 11px 15px; border-radius: 12px;
  font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,.14);
  z-index: 9999; max-width: 340px; font-family: 'DM Sans', sans-serif;
}
.toast-bar--success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.toast-bar--error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; padding: 2px; display: flex; align-items: center; margin-left: auto; }
.toast-slide-enter-active { animation: toastIn .3s ease; }
.toast-slide-leave-active { animation: toastIn .2s ease reverse; }
@keyframes toastIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ── Settlement Grid ── */
.settlement-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 640px)  { .settlement-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .settlement-grid { grid-template-columns: 1fr 1fr 1.5fr; } }
.stl-card   { padding: 20px; }
.stl-recent { padding: 20px; }
.stl-amount { font-size: 24px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; margin-bottom: 4px; }
.stl-sub  { font-size: 12px; color: #64748b; }
.stl-ref  { font-family: 'DM Mono', monospace; font-size: 10px; color: #94a3b8; margin-top: 4px; }
.stl-badge   { padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; }
.badge-amber { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.badge-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.stl-list { display: flex; flex-direction: column; }
.stl-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 0; border-bottom: 1px solid #f1f5f9; }
.stl-row:last-child { border-bottom: none; }
.stl-row-left  { display: flex; align-items: center; gap: 8px; min-width: 0; }
.stl-row-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; }
.stl-row-ref  { font-family: 'DM Mono', monospace; font-size: 10px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; }
.stl-row-amt  { font-size: 13px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; }
.stl-row-date { font-size: 10px; color: #94a3b8; }
.stl-empty { font-size: 12px; color: #94a3b8; padding: 16px 0; text-align: center; }
.mono { font-family: 'DM Mono', monospace; }

/* ── Analytics Row ── */
.analytics-row { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 1024px) { .analytics-row.two-three { grid-template-columns: 2fr 1fr; } }
.rate-stats { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.rate-stat  { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.rate-dot   { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-green  { background: #059669; }
.dot-red    { background: #ef4444; }
.dot-amber  { background: #d97706; }
.rate-label { color: #64748b; flex: 1; }
.rate-val   { font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; }

/* ── Chips ── */
.chip    { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.chip-xs { padding: 2px 7px; font-size: 9px; }
.chip-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }

/* ── DMT Entry Card ── */
.dmt-entry-card {
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  background: #fff; border: 1px solid #e8edf3; border-radius: 16px;
  padding: 20px 22px; box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.dmt-entry-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 220px; }
.dmt-entry-icon {
  width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
  background: linear-gradient(135deg, #1142d4, #4169e1); color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 22px;
}
.dmt-entry-title { font-size: 15px; font-weight: 800; color: #0f172a; }
.dmt-entry-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.dmt-entry-stats { display: flex; gap: 22px; flex-wrap: wrap; }
.dmt-stat { display: flex; flex-direction: column; gap: 2px; }
.dmt-stat-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }
.dmt-stat-value { font-size: 15px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.dmt-stat-green { color: #059669; }
.dmt-entry-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #1142d4, #4169e1); color: #fff;
  padding: 12px 22px; border-radius: 12px; font-size: 13.5px; font-weight: 700;
  text-decoration: none; box-shadow: 0 8px 22px rgba(17,66,212,.28); white-space: nowrap;
  transition: filter .15s;
}
.dmt-entry-cta:hover { filter: brightness(1.08); }
.dmt-entry-cta .mdi { font-size: 16px; }

/* ── Skeletons ── */
.skel { background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skel-sm { height: 12px; width: 55%; }
.skel-md { height: 10px; width: 60%; }
.skel-xl { height: 42px; width: 70%; }
.skel-row { height: 40px; width: 100%; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.mt-4 { margin-top: 16px; }
</style>
