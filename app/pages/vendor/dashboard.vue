<template>
  <div class="dash-root">

    <!-- ── Page Header ── -->
    <div class="dash-page-header">
      <div>
        <h1 class="dash-page-title">Dashboard</h1>
        <p class="dash-page-sub">{{ today }} · Welcome back — here's what's happening</p>
      </div>
      <div class="live-badge">
        <span class="live-dot"></span>
        Live
      </div>
    </div>

    <!-- ── Transaction Status Strip ── -->
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

    <!-- ── Row 1: Merchant Stats + Collection Cards ── -->
    <div class="stats-grid-top">
      <template v-if="!loading">
        <div v-for="(stat, i) in overallStats" :key="i" class="stat-card" :class="i === 0 ? 'stat-card-accent' : ''">
          <div class="stat-card-header">
            <span class="stat-label">{{ stat.title }}</span>
            <div class="stat-icon-wrap" :class="'stat-icon-' + i">
              <span class="mdi" :class="statIcons[i]"></span>
            </div>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-sub" v-if="stat.sub">{{ stat.sub }}</div>
        </div>
      </template>
      <template v-else>
        <div v-for="i in 6" :key="i" class="stat-card stat-skeleton">
          <div class="skel skel-sm"></div>
          <div class="skel skel-lg"></div>
          <div class="skel skel-md"></div>
        </div>
      </template>
    </div>

    <!-- ── Row 2: Payment Methods + Transaction Status ── -->
    <div class="mid-grid">

      <!-- Payment Methods Donut -->
      <div class="chart-card">
        <div class="chart-card-header">
          <div>
            <h2 class="chart-title">Payment Methods</h2>
            <p class="chart-sub">Breakdown by payment type</p>
          </div>
          <div class="chart-badge chart-badge-blue">Today</div>
        </div>
        <template v-if="!loading && !noPaymentTransactions">
          <apexchart type="donut" height="260" :options="donutOptions" :series="donutSeries" />
        </template>
        <template v-else-if="!loading">
          <div class="empty-state">
            <div class="empty-icon-wrap"><span class="mdi mdi-credit-card-off-outline"></span></div>
            <p class="empty-title">No Payment Transactions</p>
            <p class="empty-desc">Payment methods will appear once transactions are recorded</p>
          </div>
        </template>
        <template v-else>
          <div class="chart-skeleton">
            <div class="skel-donut"></div>
            <div class="skel-legend"><div class="skel skel-legend-item" v-for="n in 4" :key="n"></div></div>
          </div>
        </template>
      </div>

      <!-- Transaction Status Donut -->
      <div class="chart-card">
        <div class="chart-card-header">
          <div>
            <h2 class="chart-title">Transaction Status</h2>
            <p class="chart-sub">Today's success vs failure</p>
          </div>
          <div class="chart-badge chart-badge-green">Live</div>
        </div>
        <template v-if="!loading && !noTransactionsToday">
          <apexchart type="donut" height="260" :options="statusDonutOptions" :series="statusDonutSeries" />
        </template>
        <template v-else-if="!loading">
          <div class="empty-state">
            <div class="empty-icon-wrap"><span class="mdi mdi-calendar-remove"></span></div>
            <p class="empty-title">No Transactions Today</p>
            <p class="empty-desc">There are no transactions recorded for today</p>
          </div>
        </template>
        <template v-else>
          <div class="chart-skeleton">
            <div class="skel-donut"></div>
            <div class="skel-legend"><div class="skel skel-legend-item" v-for="n in 2" :key="n"></div></div>
          </div>
        </template>
      </div>

    </div>

    <!-- ── Settlement Info ── -->
    <div class="settlement-grid" v-if="stats?.settlement">

      <!-- Pending Settlement -->
      <div class="chart-card stl-card">
        <div class="chart-card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706"><span class="mdi mdi-bank-transfer-out"></span></div>
            <div><h2 class="chart-title">Pending Settlement</h2><p class="chart-sub">Across all merchants</p></div>
          </div>
          <span class="stl-badge badge-amber">{{ stats.settlement.pending.count }} pending</span>
        </div>
        <div class="stl-amount">₹{{ fmtAmt(stats.settlement.pending.netSettlement || stats.settlement.pending.amount) }}</div>
        <p class="stl-sub">Awaiting bank transfer</p>
      </div>

      <!-- Last Settlement -->
      <div class="chart-card stl-card">
        <div class="chart-card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669"><span class="mdi mdi-check-decagram-outline"></span></div>
            <div><h2 class="chart-title">Last Settlement</h2><p class="chart-sub">Most recent completed</p></div>
          </div>
          <span class="stl-badge badge-green">Settled</span>
        </div>
        <div class="stl-amount">₹{{ fmtAmt(stats.settlement.lastSettled?.netSettlement) }}</div>
        <p class="stl-sub">{{ stats.settlement.lastSettled?.settledAt ? fmtDate(stats.settlement.lastSettled.settledAt) : 'No settlements yet' }}</p>
        <p class="stl-ref mono" v-if="stats.settlement.lastSettled?.settlementRef">{{ stats.settlement.lastSettled.settlementRef }}</p>
      </div>

      <!-- Recent Settlements -->
      <div class="chart-card stl-recent">
        <div class="chart-card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-history"></span></div>
            <div><h2 class="chart-title">Recent Settlements</h2><p class="chart-sub">Last 8 across merchants</p></div>
          </div>
        </div>
        <div class="stl-list" v-if="stats.settlement.recent?.length">
          <div v-for="s in stats.settlement.recent" :key="s.id" class="stl-row">
            <div class="stl-row-left">
              <span class="chip chip-xs" :class="stlChip(s.status)">{{ s.status }}</span>
              <div>
                <p class="stl-row-merchant">{{ s.transaction?.merchant?.legal_name ?? '—' }}</p>
                <p class="stl-row-ref mono">{{ s.settlementRef ?? '—' }}</p>
              </div>
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

    <!-- ── Top Merchants ── -->
    <div class="section-header">
      <h2 class="section-title">Top Merchants</h2>
      <p class="section-sub">Ranked by transaction volume</p>
    </div>

    <div class="merchants-grid">
      <template v-if="!loading">
        <div v-for="(list, period) in topMerchants" :key="period" class="merchant-card">
          <div class="merchant-card-header">
            <div>
              <h3 class="merchant-period">{{ capitalize(period) }}</h3>
              <p class="merchant-period-sub">{{ list.length }} merchants</p>
            </div>
            <div class="trophy-wrap"><span class="mdi mdi-trophy-variant-outline trophy-icon"></span></div>
          </div>
          <div class="merchant-list">
            <div v-for="(m, idx) in list" :key="m.id" class="merchant-item" :class="{ 'merchant-item-top': idx === 0 }">
              <div class="merchant-rank" :class="rankClass(idx)">{{ idx + 1 }}</div>
              <div class="merchant-info">
                <p class="merchant-name">{{ m.name }}</p>
                <p class="merchant-txn">{{ m.txnCount }} transactions</p>
              </div>
              <div class="merchant-amount"><span class="amount-currency">₹</span>{{ m.totalAmount.toLocaleString() }}</div>
            </div>
            <div v-if="list.length === 0" class="empty-state empty-state-sm">
              <span class="mdi mdi-store-off-outline empty-icon-sm"></span>
              <p class="empty-desc">No merchants found</p>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="i in 3" :key="i" class="merchant-card">
          <div class="skel skel-sm mb-3"></div>
          <div v-for="j in 4" :key="j" class="skel skel-row mb-2"></div>
        </div>
      </template>
    </div>

    <!-- ── Recent Transactions ── -->
    <div class="section-header mt-4">
      <h2 class="section-title">Recent Transactions</h2>
      <p class="section-sub">Latest activity across all your merchants</p>
    </div>
    <VendorTransactions />

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useVendorApi } from "~/composables/apis/useVendorApi";
import { useAuthStore } from "~/stores/auth";

const { getVendor, getTransactions, getTransactionStatusSummary, getPaymentMethodSummary, getVendorDashboardStats } = useVendorApi();
const authStore = useAuthStore();
const apexchart = VueApexCharts;
const loading = ref(true);
const stats   = ref(null);

const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

definePageMeta({ layout: "vendorlayer", middleware: "auth" });

const statIcons = [
  "mdi-account-check-outline",
  "mdi-account-group-outline",
  "mdi-currency-inr",
  "mdi-calendar-week-outline",
  "mdi-calendar-month-outline",
  "mdi-calendar-star-outline",
];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const rankClass  = (idx) => {
  if (idx === 0) return "rank-gold";
  if (idx === 1) return "rank-silver";
  if (idx === 2) return "rank-bronze";
  return "rank-default";
};

const fmtAmt  = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const stlChip = (s) => {
  if (s === 'SUCCESS')    return 'chip-green';
  if (s === 'FAILED')     return 'chip-red';
  if (s === 'PROCESSING') return 'chip-blue';
  return 'chip-amber';
};

const overallStats = computed(() => [
  { title: "Active Merchants",    value: `${authStore.merchants.active}`,                                       sub: "Onboarded Merchants" },
  { title: "Total Merchants",     value: `${authStore.merchants.total}`,                                        sub: "All Merchants" },
  { title: "Today Collection",    value: `₹${authStore.summary.today.totalAmount.toFixed(2)}`,                  sub: `${authStore.summary.today.count} transactions` },
  { title: "Weekly Collection",   value: `₹${authStore.summary.week.totalAmount.toFixed(2)}`,                   sub: `${authStore.summary.week.count} transactions` },
  { title: "Monthly Collection",  value: `₹${authStore.summary.month.totalAmount.toFixed(2)}`,                  sub: `${authStore.summary.month.count} transactions` },
  { title: "Yearly Collection",   value: `₹${authStore.summary.year.totalAmount.toFixed(2)}`,                   sub: `${authStore.summary.year.count} transactions` },
]);

const topMerchants = computed(() => authStore.topMerchants);

const noTransactionsToday = computed(() => {
  const data = Object.values(authStore.transactionStatusSummary || {});
  return data.length === 0 || data.every((t) => t.count === 0);
});
const noPaymentTransactions = computed(() => {
  const data = Object.values(authStore.paymentSummary || {});
  return data.length === 0 || data.every((m) => !m.amount || m.amount === 0);
});

const statusDonutSeries = computed(() => Object.values(authStore.transactionStatusSummary).map((t) => t.count));
const statusDonutOptions = computed(() => {
  const data  = Object.values(authStore.transactionStatusSummary);
  const labels = data.map((t) => t.status);
  const total  = data.reduce((sum, t) => sum + t.count, 0);
  return {
    labels,
    colors: ["#22c55e", "#ef4444", "#f59e0b", "#1142d4"],
    legend: { position: "bottom", fontSize: "12px", fontFamily: "DM Sans, sans-serif" },
    chart:  { fontFamily: "DM Sans, sans-serif" },
    plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Total Txns", fontSize: "12px", fontWeight: 600, color: "#64748b", formatter: () => total.toLocaleString() } } } } },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ["#fff"] },
    tooltip: { y: { formatter: (val, opts) => { const t = data[opts.seriesIndex]; return `${t.count} Txns | ₹${t.amount}`; } } },
  };
});

const donutSeries = computed(() => Object.values(authStore.paymentSummary).map((m) => m.amount));
const donutOptions = computed(() => {
  const methods = Object.keys(authStore.paymentSummary);
  const values  = Object.values(authStore.paymentSummary).map((m) => m.amount);
  const total   = values.reduce((acc, val) => acc + val, 0);
  return {
    labels: methods,
    colors: ["#1142d4", "#22c55e", "#f59e0b", "#06b6d4"],
    legend: { position: "bottom", fontSize: "12px", fontFamily: "DM Sans, sans-serif" },
    chart:  { fontFamily: "DM Sans, sans-serif" },
    plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Total", fontSize: "12px", fontWeight: 600, color: "#64748b", formatter: () => `₹${total.toLocaleString()}` } } } } },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ["#fff"] },
    tooltip: { y: { formatter: (val) => `₹${val.toLocaleString()}` } },
  };
});

onMounted(async () => {
  loading.value = authStore.merchants.total === 0;
  try {
    await Promise.all([
      getVendor(),
      getTransactions(),
      getTransactionStatusSummary(),
      getPaymentMethodSummary(),
      getVendorDashboardStats().then(d => { stats.value = d; }),
    ]);
  } catch (err) {
    console.error("Dashboard load error:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; }

.dash-root { font-family: 'DM Sans', sans-serif; background: #f6f6f8; min-height: 100vh; padding: 20px 16px 48px; display: flex; flex-direction: column; gap: 16px; }
@media (min-width: 768px)  { .dash-root { padding: 28px 28px 56px; } }
@media (min-width: 1200px) { .dash-root { padding: 32px 36px 64px; } }

/* Header */
.dash-page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dash-page-title { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.2; }
@media (min-width: 640px) { .dash-page-title { font-size: 26px; } }
.dash-page-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
.live-badge { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e2e8f0; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,.04); flex-shrink: 0; }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.25); animation: pulse-g 2s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulse-g { 0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,.25); } 50% { box-shadow: 0 0 0 5px rgba(34,197,94,.08); } }

/* Status strip */
.status-strip { display: flex; gap: 10px; flex-wrap: wrap; }
.status-pill { flex: 1; min-width: 140px; background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 4px rgba(0,0,0,.04); display: flex; align-items: center; gap: 12px; transition: box-shadow .2s; }
.status-pill:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.sp-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.sp-body { display: flex; flex-direction: column; gap: 1px; }
.sp-label  { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #94a3b8; }
.sp-count  { font-size: 18px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; line-height: 1.2; }
.sp-amount { font-size: 11px; font-weight: 600; color: #64748b; font-family: 'DM Mono', monospace; }
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

/* Stat grid */
.stats-grid-top { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
@media (min-width: 768px)  { .stats-grid-top { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .stats-grid-top { grid-template-columns: repeat(6, 1fr); } }
@media (max-width: 480px)  { .stats-grid-top { grid-template-columns: 1fr; } }

/* Stat card */
.stat-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 18px 20px 14px; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: box-shadow .2s, transform .2s; position: relative; overflow: hidden; }
.stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #1142d4, #4169e1); opacity: 0; transition: opacity .2s; }
.stat-card:hover { box-shadow: 0 6px 20px rgba(17,66,212,.10); transform: translateY(-2px); }
.stat-card:hover::before { opacity: 1; }
.stat-card-accent { background: linear-gradient(135deg, #1142d4 0%, #2255e8 100%); border-color: transparent; color: #fff; }
.stat-card-accent::before { background: rgba(255,255,255,.3); opacity: 1; }
.stat-card-accent .stat-label { color: rgba(255,255,255,.75); }
.stat-card-accent .stat-value { color: #fff; }
.stat-card-accent .stat-sub   { color: rgba(255,255,255,.65); }
.stat-card-accent:hover { box-shadow: 0 8px 24px rgba(17,66,212,.35); }
.stat-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; }
.stat-icon-wrap { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.stat-icon-0 { background: rgba(255,255,255,.2); color: #fff; }
.stat-icon-1 { background: rgba(17,66,212,.08);  color: #1142d4; }
.stat-icon-2 { background: rgba(34,197,94,.10);  color: #22c55e; }
.stat-icon-3 { background: rgba(245,158,11,.10); color: #f59e0b; }
.stat-icon-4 { background: rgba(6,182,212,.10);  color: #06b6d4; }
.stat-icon-5 { background: rgba(168,85,247,.10); color: #a855f7; }
.stat-value { font-size: 20px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; letter-spacing: -.5px; line-height: 1.1; }
.stat-sub   { font-size: 11px; color: #94a3b8; margin-top: 3px; }

/* Chart cards */
.mid-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 768px) { .mid-grid { grid-template-columns: 1fr; } }
.chart-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.chart-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; gap: 8px; }
.card-title-wrap { display: flex; align-items: center; gap: 10px; }
.card-icon-dot { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.chart-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.chart-sub   { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.chart-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; white-space: nowrap; flex-shrink: 0; }
.chart-badge-blue  { background: rgba(17,66,212,.08); color: #1142d4; }
.chart-badge-green { background: rgba(34,197,94,.10); color: #16a34a; }

/* Settlement */
.settlement-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 640px)  { .settlement-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .settlement-grid { grid-template-columns: 1fr 1fr 1.6fr; } }
.stl-card   { }
.stl-recent { }
.stl-amount { font-size: 24px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; margin: 8px 0 4px; }
.stl-sub  { font-size: 12px; color: #64748b; }
.stl-ref  { font-family: 'DM Mono', monospace; font-size: 10px; color: #94a3b8; margin-top: 4px; }
.stl-badge { padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; flex-shrink: 0; }
.badge-amber { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.badge-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.stl-list { display: flex; flex-direction: column; }
.stl-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; padding: 9px 0; border-bottom: 1px solid #f1f5f9; }
.stl-row:last-child { border-bottom: none; }
.stl-row-left  { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
.stl-row-right { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; }
.stl-row-merchant { font-size: 12px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
.stl-row-ref  { font-family: 'DM Mono', monospace; font-size: 10px; color: #94a3b8; }
.stl-row-amt  { font-size: 13px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; }
.stl-row-date { font-size: 10px; color: #94a3b8; }
.stl-empty { font-size: 12px; color: #94a3b8; padding: 16px 0; text-align: center; }

/* Chips */
.chip     { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.chip-xs  { padding: 2px 7px; font-size: 9px; }
.chip-green  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber  { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }

/* Empty */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; text-align: center; min-height: 220px; }
.empty-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: rgba(17,66,212,.06); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 14px; }
.empty-title { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 200px; line-height: 1.5; }
.empty-state-sm { min-height: 80px; padding: 20px; }
.empty-icon-sm  { font-size: 28px; color: #cbd5e1; display: block; margin-bottom: 8px; }

/* Section header */
.section-header { margin: 4px 0 10px; }
.section-title { font-size: 17px; font-weight: 700; color: #0f172a; }
.section-sub   { font-size: 12px; color: #64748b; margin-top: 2px; }

/* Merchants grid */
.merchants-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 640px)  { .merchants-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .merchants-grid { grid-template-columns: repeat(3, 1fr); } }

.merchant-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.merchant-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.merchant-period { font-size: 14px; font-weight: 700; color: #0f172a; }
.merchant-period-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.trophy-wrap { width: 34px; height: 34px; border-radius: 10px; background: rgba(245,158,11,.1); display: flex; align-items: center; justify-content: center; }
.trophy-icon { font-size: 18px; color: #f59e0b; }
.merchant-list { display: flex; flex-direction: column; gap: 8px; }
.merchant-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; background: #f8fafc; border: 1px solid transparent; transition: all .2s; }
.merchant-item:hover { background: rgba(17,66,212,.04); border-color: rgba(17,66,212,.12); }
.merchant-item-top { background: linear-gradient(90deg,rgba(17,66,212,.05),rgba(17,66,212,.02)); border-color: rgba(17,66,212,.1); }
.merchant-rank { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.rank-gold    { background: #fef3c7; color: #d97706; }
.rank-silver  { background: #f1f5f9; color: #64748b; }
.rank-bronze  { background: #fef2e8; color: #c2763a; }
.rank-default { background: #f1f5f9; color: #94a3b8; }
.merchant-info { flex: 1; min-width: 0; }
.merchant-name { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.merchant-txn  { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.merchant-amount { font-size: 13px; font-weight: 700; color: #1142d4; font-family: 'DM Mono', monospace; white-space: nowrap; flex-shrink: 0; }
.amount-currency { font-size: 10px; margin-right: 1px; }

/* Skeleton */
.stat-skeleton { pointer-events: none; }
.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-sm { height: 12px; width: 55%; margin-bottom: 10px; }
.skel-lg { height: 28px; width: 45%; margin-bottom: 8px; }
.skel-md { height: 10px; width: 60%; }
.skel-row { height: 40px; width: 100%; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.chart-skeleton { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 16px 0; }
.skel-donut { width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skel-legend { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.skel-legend-item { height: 10px; width: 64px; border-radius: 4px; }

.mono { font-family: 'DM Mono', monospace; }
.mt-4 { margin-top: 8px; }
</style>
