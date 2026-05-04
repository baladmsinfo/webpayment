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

    <!-- ── Top Stats + Donut ── -->
    <div class="top-grid">

      <!-- 4 Collection Stat Cards -->
      <div class="stats-four">

        <div class="stat-card" :style="{ '--accent': '#1142d4' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap">
            <span class="mdi mdi-calendar-today stat-icon"></span>
          </div>
          <div class="stat-body">
            <p class="stat-label">Today Payments</p>
            <p class="stat-value">
              <span class="currency-prefix">₹</span>{{ collections.dailyCollection.toFixed(2) }}
            </p>
            <p class="stat-sub">{{ collections.dailyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="todayProgress" color="#1142d4" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.dailyCount }} / 1,000,000</span>
          </div>
        </div>

        <div class="stat-card" :style="{ '--accent': '#7c3aed' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap" style="background:rgba(124,58,237,.1)">
            <span class="mdi mdi-calendar-week stat-icon" style="color:#7c3aed"></span>
          </div>
          <div class="stat-body">
            <p class="stat-label">Weekly Payments</p>
            <p class="stat-value">
              <span class="currency-prefix">₹</span>{{ collections.weeklyCollection.toFixed(2) }}
            </p>
            <p class="stat-sub">{{ collections.weeklyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="weeklyProgress" color="#7c3aed" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.weeklyCount }} / 1,000</span>
          </div>
        </div>

        <div class="stat-card" :style="{ '--accent': '#059669' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap" style="background:rgba(5,150,105,.1)">
            <span class="mdi mdi-calendar-month-outline stat-icon" style="color:#059669"></span>
          </div>
          <div class="stat-body">
            <p class="stat-label">Monthly Payments</p>
            <p class="stat-value">
              <span class="currency-prefix">₹</span>{{ collections.monthlyCollection.toFixed(2) }}
            </p>
            <p class="stat-sub">{{ collections.monthlyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="monthlyProgress" color="#059669" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.monthlyCount }} / 1,000</span>
          </div>
        </div>

        <div class="stat-card" :style="{ '--accent': '#d97706' }">
          <div class="stat-accent-bar"></div>
          <div class="stat-icon-wrap" style="background:rgba(217,119,6,.1)">
            <span class="mdi mdi-calendar-star stat-icon" style="color:#d97706"></span>
          </div>
          <div class="stat-body">
            <p class="stat-label">Yearly Payments</p>
            <p class="stat-value">
              <span class="currency-prefix">₹</span>{{ collections.yearlyCollection.toFixed(2) }}
            </p>
            <p class="stat-sub">{{ collections.yearlyCount }} transactions</p>
          </div>
          <div class="progress-wrap">
            <v-progress-linear :model-value="yearlyProgress" color="#d97706" height="5" rounded class="prog" />
            <span class="prog-label">{{ collections.yearlyCount }} / 1,000</span>
          </div>
        </div>

      </div>

      <!-- Donut Chart Card -->
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
          <apexchart type="donut" width="100%" :options="donutOptions" :series="donutSeries" />
        </div>
      </div>

    </div>

    <!-- ── Line Chart ── -->
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
        <button
          v-for="t in tabs"
          :key="t.value"
          class="tab-btn"
          :class="{ active: tab === t.value }"
          @click="tab = t.value"
        >{{ t.label }}</button>
      </div>

      <div class="mt-4">
        <apexchart type="line" height="300" :options="lineOptions" :series="lineSeries" />
      </div>
    </div>

    <!-- ── Payments Table ── -->
    <div class="mt-4">
      <payments />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePaymentsStore } from "~/stores/payments";
import { usePaymentsApi } from "~/composables/apis/usepaymentsApi";
import VueApexCharts from "vue3-apexcharts";

definePageMeta({
  layout: "mlayer",
  middleware: "auth",
});

const apexchart = VueApexCharts;

const store = usePaymentsStore();
const { getMerchantCollections, getTransactionStatus, getPaymentsByGranularity } = usePaymentsApi();
const { totalCollection: collections } = storeToRefs(store);

const tab = ref("day");
const tabs = [
  { value: "day",     label: "Today"   },
  { value: "week",    label: "Weekly"  },
  { value: "month",   label: "Monthly" },
  { value: "year",    label: "Yearly"  },
  { value: "5years",  label: "5 Years" },
  { value: "10years", label: "10 Years"},
];

const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

const todayProgress   = computed(() => (collections.value.dailyCollection   / 1000000) * 100);
const weeklyProgress  = computed(() => (collections.value.weeklyCollection  / 1000)    * 100);
const monthlyProgress = computed(() => (collections.value.monthlyCollection / 1000)    * 100);
const yearlyProgress  = computed(() => (collections.value.yearlyCollection  / 1000)    * 100);

const donutSeries = ref([]);
const donutOptions = ref({
  labels: [],
  colors: ["#1142d4", "#10b981", "#f59e0b", "#ef4444", "#7c3aed", "#0891b2"],
  legend: { position: "bottom", fontFamily: "DM Sans", fontSize: "12px" },
  dataLabels: { style: { fontFamily: "DM Sans", fontSize: "11px" } },
  stroke: { width: 2 },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          name:  { show: true, fontSize: "14px", fontFamily: "DM Sans", offsetY: -10 },
          value: {
            show: true, fontSize: "18px", fontWeight: 700,
            fontFamily: "DM Mono, monospace", offsetY: 10,
            formatter: (val) => val.toFixed(2),
          },
          total: {
            show: true, label: "All Txn",
            fontSize: "13px", fontWeight: 700, fontFamily: "DM Sans",
            formatter: (w) => {
              const index = w.globals.seriesIndex;
              if (index >= 0) return w.globals.series[index].toFixed(2);
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
            },
          },
        },
      },
    },
  },
  tooltip: { enabled: true, y: { formatter: (val) => val.toFixed(2) } },
});

const lineSeries  = ref([{ name: "Payments", data: [] }]);
const lineOptions = ref({
  chart: { toolbar: { show: false }, fontFamily: "DM Sans" },
  stroke: { curve: "smooth", width: 3 },
  colors: ["#1142d4"],
  grid:   { borderColor: "#f1f5f9" },
  xaxis:  { categories: [], labels: { style: { fontFamily: "DM Sans", fontSize: "11px", colors: "#94a3b8" } } },
  yaxis:  { labels: { style: { fontFamily: "DM Sans", fontSize: "11px", colors: "#94a3b8" } } },
  tooltip: { style: { fontFamily: "DM Sans" } },
});

const loadTimeSeries = async (granularity) => {
  try {
    const res = await getPaymentsByGranularity(granularity);
    if (res?.data?.totals && res?.data?.labels) {
      lineSeries.value  = [{ name: "Payments", data: res.data.totals }];
      lineOptions.value = { ...lineOptions.value, xaxis: { ...lineOptions.value.xaxis, categories: res.data.labels } };
    }
  } catch (err) { console.error("Error loading time series:", err); }
};

const loadTransactionStatus = async () => {
  try {
    const res = await getTransactionStatus();
    if (res.statusCode === "00") {
      donutSeries.value = res.data.values;
      donutOptions.value = {
        ...donutOptions.value,
        labels: res.data.labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1).toLowerCase()),
        colors: res.data.colors || donutOptions.value.colors,
      };
    }
  } catch (err) { console.error("Error loading transaction status:", err); }
};

watch(tab, (newTab) => loadTimeSeries(newTab));

onMounted(async () => {
  await getMerchantCollections();
  await loadTransactionStatus();
  await loadTimeSeries(tab.value);
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

/* ── Top Grid (4 cards + donut) ── */
.top-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 1024px) {
  .top-grid { grid-template-columns: 1fr 320px; }
}

.stats-four {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 600px)  { .stats-four { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .stats-four { grid-template-columns: repeat(2, 1fr); } }

/* ── Stat Card ── */
.stat-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
  background: rgba(17,66,212,.1);
  display: flex; align-items: center; justify-content: center;
}
.stat-icon { font-size: 20px; color: #1142d4; }

.stat-body { display: flex; flex-direction: column; gap: 3px; }
.stat-label {
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .08em;
}
.stat-value {
  font-size: 20px; font-weight: 800; color: #0f172a;
  font-family: 'DM Mono', monospace;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.currency-prefix { font-size: 11px; font-weight: 600; color: #94a3b8; margin-right: 1px; }
.stat-sub { font-size: 11px; color: #94a3b8; font-weight: 500; }

.progress-wrap { display: flex; flex-direction: column; gap: 4px; }
.prog { border-radius: 9999px; }
.prog-label { font-size: 10px; color: #94a3b8; font-weight: 500; }

/* ── Card base ── */
.card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  overflow: hidden;
}

.donut-card { padding: 20px; }
.line-card  { padding: 20px; }

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

/* ── Tab Strip (replaces v-tabs) ── */
.tab-strip {
  display: flex; flex-wrap: wrap; gap: 6px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}
.tab-btn {
  padding: 5px 14px; border-radius: 9999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 600;
  border: 1px solid #e8edf3;
  background: #f8fafc; color: #64748b;
  cursor: pointer; transition: all .15s;
}
.tab-btn:hover  { background: #f1f5f9; color: #1142d4; border-color: #c7d2fe; }
.tab-btn.active { background: #1142d4; color: #fff; border-color: #1142d4; }

.mt-4 { margin-top: 16px; }
</style>