<template>
  <div class="dash-root">

    <!-- ── Page Header ── -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Dashboard</h1>
        <p class="dash-sub">{{ today }} · Live overview across your merchants</p>
      </div>
      <div class="header-actions">
        <div class="live-badge">
          <span class="live-dot"></span>
          Live
        </div>
      </div>
    </div>

    <!-- ── Hero Row: Balance + Merchant Stats ── -->
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
            <NuxtLink to="/vendor/wallet" class="bp-btn bp-btn--add">
              <span class="mdi mdi-wallet-outline"></span>
              Manage Wallet
            </NuxtLink>
            <button class="bp-btn bp-btn--account" @click="navigateTo('/vendor/account')">
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

      <!-- Merchant Stats (right panel) -->
      <div class="merchant-stats-panel">
        <template v-if="!loading">
          <div
            v-for="(stat, i) in merchantStatCards"
            :key="i"
            class="msc-card"
            :class="i === 0 ? 'msc-card--accent' : ''"
          >
            <div class="msc-header">
              <span class="msc-label">{{ stat.title }}</span>
              <div class="msc-icon-wrap" :class="'msc-icon-' + i">
                <span class="mdi" :class="stat.icon"></span>
              </div>
            </div>
            <div class="msc-value">{{ stat.value }}</div>
            <div class="msc-sub" v-if="stat.sub">{{ stat.sub }}</div>
          </div>
        </template>
        <template v-else>
          <div v-for="i in 2" :key="i" class="msc-card">
            <div class="skel skel-sm mb-2"></div>
            <div class="skel skel-xl mb-2"></div>
            <div class="skel skel-md"></div>
          </div>
        </template>
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

    <!-- ── Charts: Payment Methods + Transaction Status ── -->
    <div class="mid-grid">

      <!-- Payment Methods Donut -->
      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4">
              <span class="mdi mdi-credit-card-multiple-outline"></span>
            </div>
            <h2 class="card-title">Payment Methods</h2>
          </div>
          <span class="chart-tag">All time</span>
        </div>
        <template v-if="!loading && donutSeries.length">
          <apexchart type="donut" height="260" :options="donutOptions" :series="donutSeries" />
        </template>
        <template v-else-if="!loading">
          <div class="empty-state">
            <div class="empty-icon-wrap"><span class="mdi mdi-credit-card-off-outline"></span></div>
            <p class="empty-title">No Payment Data</p>
            <p class="empty-desc">Payment method breakdown will appear once transactions are recorded</p>
          </div>
        </template>
        <template v-else>
          <div class="chart-skeleton"><div class="skel-donut"></div></div>
        </template>
      </div>

      <!-- Transaction Status Donut -->
      <div class="card chart-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669">
              <span class="mdi mdi-chart-donut"></span>
            </div>
            <h2 class="card-title">Transaction Status</h2>
          </div>
          <span class="chart-tag">Today</span>
        </div>
        <template v-if="!loading && statusDonutSeries.length">
          <apexchart type="donut" height="260" :options="statusDonutOptions" :series="statusDonutSeries" />
        </template>
        <template v-else-if="!loading">
          <div class="empty-state">
            <div class="empty-icon-wrap"><span class="mdi mdi-calendar-remove"></span></div>
            <p class="empty-title">No Transactions Today</p>
            <p class="empty-desc">Status breakdown will appear once transactions are recorded for today</p>
          </div>
        </template>
        <template v-else>
          <div class="chart-skeleton"><div class="skel-donut"></div></div>
        </template>
      </div>

    </div>

    <!-- ── Settlement Info ── -->
    <div class="settlement-grid" v-if="stats?.settlement">
      <div class="card stl-card">
        <div class="card-header">
          <div class="card-title-wrap">
            <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706">
              <span class="mdi mdi-bank-transfer-out"></span>
            </div>
            <h2 class="card-title">Pending Settlement</h2>
          </div>
          <span class="stl-badge badge-amber">{{ stats.settlement.pending.count }} pending</span>
        </div>
        <div class="stl-amount">₹{{ fmtAmt(stats.settlement.pending.netSettlement || stats.settlement.pending.amount) }}</div>
        <p class="stl-sub">Across all merchants · awaiting bank transfer</p>
      </div>

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
    <div class="section-header">
      <h2 class="section-title">Recent Transactions</h2>
      <p class="section-sub">Latest activity across all your merchants</p>
    </div>
    <VendorTransactions />


    <!-- ── Toast ── -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="toast.show" class="toast-bar" :class="'toast-bar--' + toast.type">
          <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" @click="toast.show = false"><span class="mdi mdi-close"></span></button>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useVendorApi } from "~/composables/apis/useVendorApi";
import { useVendorBalanceApi } from "~/composables/apis/useVendorBalanceApi";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "vendorlayer", middleware: "auth" });

const apexchart = VueApexCharts;

// ── API hooks ──────────────────────────────────────────────────
const { getVendor, getTransactions, getTransactionStatusSummary, getPaymentMethodSummary, getVendorDashboardStats } = useVendorApi();
const {
  balanceData, balanceLoading,
  fetchBalance, formatCurrency,
} = useVendorBalanceApi();

const authStore = useAuthStore();
const loading   = ref(true);
const stats     = ref(null);

const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// ── Helpers ────────────────────────────────────────────────────
const fmtAmt  = (v) => v != null ? Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const stlChip = (s) => {
  if (s === 'SUCCESS')    return 'chip-green';
  if (s === 'FAILED')     return 'chip-red';
  if (s === 'PROCESSING') return 'chip-blue';
  return 'chip-amber';
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const rankClass  = (idx) => {
  if (idx === 0) return 'rank-gold';
  if (idx === 1) return 'rank-silver';
  if (idx === 2) return 'rank-bronze';
  return 'rank-default';
};

// ── Merchant stat cards (hero-row right panel) ─────────────────
const merchantStatCards = computed(() => [
  { title: 'Active Merchants', value: `${authStore.merchants?.active ?? 0}`, sub: 'Onboarded & active', icon: 'mdi-account-check-outline' },
  { title: 'Total Merchants',  value: `${authStore.merchants?.total  ?? 0}`, sub: 'All merchants',      icon: 'mdi-account-group-outline' },
]);

const topMerchants = computed(() => authStore.topMerchants ?? {});

// ── Payment Method Donut ───────────────────────────────────────
const METHOD_COLORS = ['#1142d4','#7c3aed','#059669','#d97706','#ef4444','#0891b2','#ec4899','#14b8a6'];

const donutSeries = computed(() => {
  const pm = authStore.paymentSummary;
  if (!pm) return [];
  return Object.values(pm).map((m) => m.amount ?? 0);
});

const donutOptions = computed(() => {
  const pm      = authStore.paymentSummary ?? {};
  const methods = Object.keys(pm);
  const values  = Object.values(pm).map((m) => m.amount ?? 0);
  const total   = values.reduce((a, b) => a + b, 0);
  return {
    labels: methods,
    colors: METHOD_COLORS,
    legend: { position: 'bottom', fontFamily: 'DM Sans', fontSize: '12px' },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#fff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: { show: true, label: 'Total', fontSize: '12px', fontWeight: 600, color: '#64748b', fontFamily: 'DM Sans', formatter: () => `₹${total.toLocaleString()}` },
          },
        },
      },
    },
    tooltip: { y: { formatter: (val) => `₹${Number(val).toLocaleString()}` } },
    chart: { fontFamily: 'DM Sans' },
  };
});

// ── Transaction Status Donut ───────────────────────────────────
const statusDonutSeries = computed(() => {
  const ts = authStore.transactionStatusSummary;
  if (!ts) return [];
  return Object.values(ts).map((t) => t.count ?? 0);
});

const statusDonutOptions = computed(() => {
  const ts    = authStore.transactionStatusSummary ?? {};
  const data  = Object.values(ts);
  const total = data.reduce((sum, t) => sum + (t.count ?? 0), 0);
  return {
    labels: data.map((t) => t.status ?? ''),
    colors: ['#059669', '#ef4444', '#d97706', '#1142d4'],
    legend: { position: 'bottom', fontFamily: 'DM Sans', fontSize: '12px' },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ['#fff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: { show: true, label: 'Total Txns', fontSize: '12px', fontWeight: 600, color: '#64748b', fontFamily: 'DM Sans', formatter: () => total.toLocaleString() },
          },
        },
      },
    },
    tooltip: { y: { formatter: (val, opts) => { const t = data[opts.seriesIndex]; return `${t.count} txns · ₹${fmtAmt(t.amount)}`; } } },
    chart: { fontFamily: 'DM Sans' },
  };
});

// ── Toast ──────────────────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 4000);
};

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  loading.value = authStore.merchants?.total === 0;
  try {
    await Promise.all([
      getVendor(),
      getTransactions(),
      getTransactionStatusSummary(),
      getPaymentMethodSummary(),
      fetchBalance(),
      getVendorDashboardStats().then(d => { stats.value = d; }),
    ]);
  } catch (err) {
    console.error('Dashboard load error:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Root ── */
.dash-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; padding-bottom: 24px; }

/* ── Header ── */
.dash-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dash-title  { font-size: 22px; font-weight: 800; color: #0f172a; }
@media (min-width: 640px) { .dash-title { font-size: 26px; } }
.dash-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 10px; }

/* ── Live Badge ── */
.live-badge { display: flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e2e8f0; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.live-dot   { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.25); animation: pulse-g 2s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulse-g { 0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,.25); } 50% { box-shadow: 0 0 0 5px rgba(34,197,94,.08); } }

/* ── Hero Row ── */
.hero-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: stretch; }
@media (max-width: 900px) { .hero-row { grid-template-columns: 1fr; } }

/* ── Balance Panel ── */
.balance-panel {
  background: linear-gradient(135deg, #1142d4 0%, #1e3fbe 50%, #0e35a8 100%);
  border-radius: 16px; padding: 28px 28px 24px; color: #fff;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(17,66,212,.30);
  transition: box-shadow .2s; display: flex; flex-direction: column; justify-content: space-between;
}
.balance-panel::before { content: ''; position: absolute; width: 320px; height: 320px; border-radius: 50%; background: rgba(255,255,255,.05); top: -100px; right: -80px; pointer-events: none; }
.balance-panel::after  { content: ''; position: absolute; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,.04); bottom: -60px; left: -40px; pointer-events: none; }
.balance-panel:hover   { box-shadow: 0 12px 40px rgba(17,66,212,.40); }
.bp-top      { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.bp-label    { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.65); }
.bp-status-dot { width: 9px; height: 9px; border-radius: 50%; }
.dot-active   { background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,.3); }
.dot-inactive { background: #f87171; box-shadow: 0 0 0 3px rgba(248,113,113,.3); }
.bp-amount   { display: flex; align-items: baseline; gap: 6px; margin-bottom: 16px; position: relative; z-index: 1; }
.bp-currency { font-size: 22px; font-weight: 600; color: rgba(255,255,255,.70); }
.bp-value    { font-size: 44px; font-weight: 700; color: #fff; font-family: 'DM Mono', monospace; letter-spacing: -2px; line-height: 1; }
.bp-actions  { display: flex; gap: 10px; position: relative; z-index: 1; }
.bp-btn      { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 12px; border-radius: 11px; border: none; font-size: 12px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s; white-space: nowrap; }
.bp-wallet-hint {
  display: flex; align-items: center; gap: 6px;
  font-size: .78rem; opacity: .75; position: relative; z-index: 1;
}
.bp-btn--add      { background: #fff; color: #0f172a; text-decoration: none; }
.bp-btn--add:hover { background: rgba(255,255,255,.85); }
.bp-btn--withdraw { background: #fff; color: #0f172a; }
.bp-btn--withdraw:hover:not(:disabled) { background: rgba(255,255,255,.85); }
.bp-btn--withdraw:disabled { opacity: .4; cursor: not-allowed; }
.bp-btn--account  { background: #fff; color: #0f172a; }
.bp-btn--account:hover { background: rgba(255,255,255,.85); }

/* ── Merchant Stats Panel ── */
.merchant-stats-panel { display: flex; flex-direction: column; gap: 12px; }
.msc-card {
  background: #fff; border: 1px solid #e8edf3; border-radius: 14px;
  padding: 20px 22px; box-shadow: 0 1px 4px rgba(0,0,0,.04);
  transition: box-shadow .2s, transform .2s; position: relative; overflow: hidden; flex: 1;
}
.msc-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg,#1142d4,#4169e1); opacity: 0; transition: opacity .2s; }
.msc-card:hover { box-shadow: 0 6px 20px rgba(17,66,212,.10); transform: translateY(-2px); }
.msc-card:hover::before { opacity: 1; }
.msc-card--accent { background: linear-gradient(135deg,#1142d4 0%,#2255e8 100%); border-color: transparent; }
.msc-card--accent::before { opacity: 0 !important; }
.msc-card--accent .msc-label { color: rgba(255,255,255,.65); }
.msc-card--accent .msc-value { color: #fff; }
.msc-card--accent .msc-sub   { color: rgba(255,255,255,.60); }
.msc-card--accent .msc-icon-wrap { background: rgba(255,255,255,.18); color: #fff; }
.msc-card--accent:hover { box-shadow: 0 8px 24px rgba(17,66,212,.35); }
.msc-header   { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.msc-label    { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #94a3b8; }
.msc-icon-wrap { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; }
.msc-icon-0   { background: rgba(255,255,255,.18); color: #fff; }
.msc-icon-1   { background: rgba(17,66,212,.08); color: #1142d4; }
.msc-value    { font-size: 32px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; letter-spacing: -1px; line-height: 1; margin-bottom: 4px; }
.msc-sub      { font-size: 12px; color: #94a3b8; }

/* ── Status Strip ── */
.status-strip { display: flex; gap: 10px; flex-wrap: wrap; }
.status-pill  { flex: 1; min-width: 140px; background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 4px rgba(0,0,0,.04); display: flex; align-items: center; gap: 12px; transition: box-shadow .2s; }
.status-pill:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.sp-icon   { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.sp-body   { display: flex; flex-direction: column; gap: 1px; }
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

/* ── Mid Grid (two donuts) ── */
.mid-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 768px) { .mid-grid { grid-template-columns: repeat(2, 1fr); } }

/* ── Cards ── */
.card       { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden; }
.chart-card { padding: 20px; }
.stl-card   { padding: 20px; }
.stl-recent { padding: 20px; }
.card-header      { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.card-title-wrap  { display: flex; align-items: center; gap: 10px; }
.card-icon-dot    { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.card-title       { font-size: 14px; font-weight: 700; color: #0f172a; }
.chart-tag { font-size: 10px; font-weight: 700; color: #94a3b8; background: #f8fafc; border: 1px solid #e8edf3; border-radius: 9999px; padding: 3px 10px; text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }
.chart-skeleton { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 0; }
.skel-donut { width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }

/* ── Empty State ── */
.empty-state     { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; text-align: center; min-height: 220px; }
.empty-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: rgba(17,66,212,.06); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 14px; }
.empty-title     { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px; }
.empty-desc      { font-size: 12px; color: #94a3b8; max-width: 200px; line-height: 1.5; }
.empty-state-sm  { min-height: 80px; padding: 20px; }
.empty-icon-sm   { font-size: 28px; color: #cbd5e1; display: block; margin-bottom: 8px; }

/* ── Settlement Grid ── */
.settlement-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 640px)  { .settlement-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .settlement-grid { grid-template-columns: 1fr 1fr 1.6fr; } }
.stl-amount { font-size: 24px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; margin: 8px 0 4px; }
.stl-sub  { font-size: 12px; color: #64748b; }
.stl-ref  { font-family: 'DM Mono', monospace; font-size: 10px; color: #94a3b8; margin-top: 4px; }
.stl-badge   { padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; flex-shrink: 0; }
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
.mono { font-family: 'DM Mono', monospace; }

/* ── Chips ── */
.chip    { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; white-space: nowrap; }
.chip-xs { padding: 2px 7px; font-size: 9px; }
.chip-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.15); }

/* ── Section Header ── */
.section-header { margin: 4px 0 10px; }
.section-title  { font-size: 17px; font-weight: 700; color: #0f172a; }
.section-sub    { font-size: 12px; color: #64748b; margin-top: 2px; }

/* ── Merchants Grid ── */
.merchants-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 640px)  { .merchants-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .merchants-grid { grid-template-columns: repeat(3, 1fr); } }
.merchant-card        { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.merchant-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.merchant-period      { font-size: 14px; font-weight: 700; color: #0f172a; }
.merchant-period-sub  { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.trophy-wrap { width: 34px; height: 34px; border-radius: 10px; background: rgba(245,158,11,.1); display: flex; align-items: center; justify-content: center; }
.trophy-icon { font-size: 18px; color: #f59e0b; }
.merchant-list   { display: flex; flex-direction: column; gap: 8px; }
.merchant-item   { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; background: #f8fafc; border: 1px solid transparent; transition: all .2s; }
.merchant-item:hover      { background: rgba(17,66,212,.04); border-color: rgba(17,66,212,.12); }
.merchant-item-top        { background: linear-gradient(90deg,rgba(17,66,212,.05),rgba(17,66,212,.02)); border-color: rgba(17,66,212,.1); }
.merchant-rank   { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.rank-gold    { background: #fef3c7; color: #d97706; }
.rank-silver  { background: #f1f5f9; color: #64748b; }
.rank-bronze  { background: #fef2e8; color: #c2763a; }
.rank-default { background: #f1f5f9; color: #94a3b8; }
.merchant-info   { flex: 1; min-width: 0; }
.merchant-name   { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.merchant-txn    { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.merchant-amount { font-size: 13px; font-weight: 700; color: #1142d4; font-family: 'DM Mono', monospace; white-space: nowrap; flex-shrink: 0; }
.amount-currency { font-size: 10px; margin-right: 1px; }

/* ── Modals ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9000; padding: 16px; animation: fadeIn .2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal-card { background: #fff; border-radius: 16px; width: 100%; max-width: 420px; box-shadow: 0 16px 48px rgba(0,0,0,.18); animation: slideUp .25s ease; overflow: hidden; }
.modal-card--wide { max-width: 600px; }
@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; align-items: center; gap: 12px; padding: 18px 20px 14px; border-bottom: 1px solid #f1f5f9; }
.modal-hicon  { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 19px; flex-shrink: 0; }
.modal-hicon--add      { background: rgba(17,66,212,.08); color: #1142d4; }
.modal-hicon--withdraw { background: rgba(220,38,38,.08); color: #dc2626; }
.modal-hicon--history  { background: rgba(100,116,139,.08); color: #64748b; }
.modal-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
.modal-sub   { font-size: 12px; color: #94a3b8; margin: 2px 0 0; }
.modal-close { margin-left: auto; width: 30px; height: 30px; border-radius: 8px; border: none; background: none; cursor: pointer; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 17px; transition: background .15s; }
.modal-close:hover { background: #f1f5f9; color: #475569; }
.modal-body  { padding: 18px 20px; }
.modal-body--scroll { max-height: 420px; overflow-y: auto; padding: 14px 20px; }
.modal-footer { display: flex; gap: 10px; padding: 14px 20px; border-top: 1px solid #f1f5f9; }
.mbtn { flex: 1; padding: 10px 14px; border-radius: 9px; border: none; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all .2s; }
.mbtn--primary   { background: #1142d4; color: #fff; }
.mbtn--primary:hover:not(:disabled)   { background: #0e35a8; box-shadow: 0 4px 12px rgba(17,66,212,.3); }
.mbtn--danger    { background: #dc2626; color: #fff; }
.mbtn--danger:hover:not(:disabled)    { background: #b91c1c; box-shadow: 0 4px 12px rgba(220,38,38,.3); }
.mbtn--secondary { background: #f1f5f9; color: #475569; }
.mbtn--secondary:hover { background: #e2e8f0; }
.mbtn:disabled   { opacity: .5; cursor: not-allowed; }

/* ── Forms ── */
.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 5px; }
.form-opt   { font-weight: 400; color: #9ca3af; }
.form-input { width: 100%; padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #1e293b; transition: border-color .2s, box-shadow .2s; outline: none; }
.form-input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.10); }
.form-hint  { display: block; font-size: 11px; color: #94a3b8; margin-top: 4px; }
.settlement-preview { display: flex; align-items: center; gap: 12px; background: #f0f4ff; border: 1px solid rgba(17,66,212,.15); border-radius: 10px; padding: 11px 13px; margin-bottom: 16px; }
.sp-icon   { font-size: 19px; color: #1142d4; }
.sp-info   { display: flex; flex-direction: column; gap: 2px; }
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

/* ── History Modal ── */
.history-tabs { display: flex; gap: 4px; padding: 0 20px 10px; border-bottom: 1px solid #f1f5f9; }
.history-tab  { padding: 5px 13px; border-radius: 8px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; background: none; color: #94a3b8; transition: all .15s; }
.history-tab:hover { background: #f1f5f9; color: #475569; }
.history-tab--active { background: #eff6ff; color: #1142d4; }
.history-loading { padding: 12px 0; }
.h-empty       { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 30px 16px; text-align: center; }
.h-empty-icon  { font-size: 32px; color: #cbd5e1; }
.h-empty-title { font-size: 13px; font-weight: 600; color: #334155; }
.h-empty-sub   { font-size: 12px; color: #94a3b8; }
.history-tbl      { width: 100%; }
.history-tbl-head { display: grid; grid-template-columns: 28px 1fr 120px 90px 72px; padding: 7px 10px; background: #f8fafc; border-radius: 8px; margin-bottom: 3px; }
.hth   { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; }
.hth-r { text-align: right; }
.hth-c { text-align: center; }
.history-tbl-row { display: grid; grid-template-columns: 28px 1fr 120px 90px 72px; padding: 10px; border-bottom: 1px solid #f1f5f9; align-items: center; transition: background .1s; border-radius: 6px; }
.history-tbl-row:hover      { background: #f8fafc; }
.history-tbl-row:last-child { border-bottom: none; }
.htd       { font-size: 12px; color: #475569; display: flex; align-items: center; gap: 7px; }
.htd-seq   { font-size: 11px; color: #cbd5e1; font-weight: 600; }
.htd-desc  { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.htd-date  { font-size: 11px; color: #94a3b8; }
.htd-r     { justify-content: flex-end; }
.htd-dot   { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
.htd-dot.credit { background: #dcfce7; color: #16a34a; }
.htd-dot.debit  { background: #fee2e2; color: #dc2626; }
.htd-amount { font-size: 13px; font-weight: 700; }
.htd-amount.credit { color: #16a34a; }
.htd-amount.debit  { color: #dc2626; }
.htd-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: .3px; }
.htd-pill.credit { background: #dcfce7; color: #16a34a; }
.htd-pill.debit  { background: #fee2e2; color: #dc2626; }
.history-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding-top: 12px; }
.page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; color: #475569; transition: all .15s; }
.page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-info { font-size: 12px; font-weight: 600; color: #64748b; }

/* ── Toast ── */
.toast-bar { position: fixed; bottom: 24px; right: 24px; display: flex; align-items: center; gap: 10px; padding: 11px 15px; border-radius: 12px; font-size: 13px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,.14); z-index: 9999; max-width: 340px; font-family: 'DM Sans', sans-serif; }
.toast-bar--success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.toast-bar--error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; padding: 2px; display: flex; align-items: center; margin-left: auto; }
.toast-slide-enter-active { animation: toastIn .3s ease; }
.toast-slide-leave-active { animation: toastIn .2s ease reverse; }
@keyframes toastIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ── Skeletons ── */
.skel { background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skel-sm  { height: 12px; width: 55%; }
.skel-md  { height: 10px; width: 60%; }
.skel-xl  { height: 42px; width: 70%; }
.skel-row { height: 40px; width: 100%; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
</style>
