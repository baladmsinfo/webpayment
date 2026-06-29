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

      <!-- Available Balance Card -->
      <div class="balance-panel" :class="{ 'balance-panel--loading': balanceLoading }">
        <template v-if="!balanceLoading">
          <div class="bp-top">
            <span class="bp-label">Available Balance</span>
            <span class="bp-status-dot" :class="balanceData.walletActive ? 'dot-active' : 'dot-inactive'"></span>
          </div>

          <div class="bp-amount">
            <span class="bp-currency">₹</span>
            <span class="bp-value">{{ formatCurrency(balanceData.balance) }}</span>
          </div>

          <div class="bp-actions">
            <button class="bp-btn bp-btn--add" @click="showAddModal = true">
              <span class="mdi mdi-plus-circle-outline"></span>
              Add Money
            </button>
            <button
              class="bp-btn bp-btn--withdraw"
              @click="showWithdrawModal = true"
              :disabled="!balanceData.settlementAccount || balanceData.balance <= 0"
            >
              <span class="mdi mdi-cash-minus"></span>
              Withdraw
            </button>
            <button class="bp-btn bp-btn--account" @click="navigateTo('/merchant/account')">
              <span class="mdi mdi-bank-outline"></span>
              View Account
            </button>
          </div>
        </template>

        <!-- Skeleton -->
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
          <apexchart type="donut" width="100%" :options="donutOptions" :series="donutSeries" />
        </div>
      </div>

    </div>

    <!-- ── 4 Collection Stat Cards + Donut ── -->
    <div class="top-grid">

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

    <!-- ══════════════════════════════════════════════════
         ADD FUNDS MODAL
    ══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-hicon modal-hicon--add">
              <span class="mdi mdi-cash-plus"></span>
            </div>
            <div>
              <h3 class="modal-title">Add Funds</h3>
              <p class="modal-sub">Credits will reflect instantly</p>
            </div>
            <button class="modal-close" @click="showAddModal = false">
              <span class="mdi mdi-close"></span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Amount (₹)</label>
              <input
                v-model.number="addAmount"
                type="number" min="1"
                placeholder="Enter amount"
                class="form-input"
                @keyup.enter="handleAddMoney"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Note <span class="form-opt">(optional)</span></label>
              <input v-model="addNote" type="text" placeholder="e.g. Monthly top-up" class="form-input" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="mbtn mbtn--secondary" @click="showAddModal = false">Cancel</button>
            <button
              class="mbtn mbtn--primary"
              @click="handleAddMoney"
              :disabled="!addAmount || addAmount <= 0 || addMoneyLoading"
            >
              <span class="mdi mdi-loading mdi-spin" v-if="addMoneyLoading"></span>
              <span v-else>Add Funds</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════════════════════════════════════════════
         WITHDRAW MODAL
    ══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showWithdrawModal" class="modal-overlay" @click.self="closeWithdraw">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-hicon modal-hicon--withdraw">
              <span class="mdi mdi-bank-transfer-out"></span>
            </div>
            <div>
              <h3 class="modal-title">Withdraw Funds</h3>
              <p class="modal-sub">Sent to your linked bank account</p>
            </div>
            <button class="modal-close" @click="closeWithdraw">
              <span class="mdi mdi-close"></span>
            </button>
          </div>

          <template v-if="withdrawStep === 1">
            <div class="modal-body">
              <div class="settlement-preview" v-if="balanceData.settlementAccount">
                <span class="mdi mdi-bank-outline sp-icon"></span>
                <div class="sp-info">
                  <span class="sp-name">{{ balanceData.settlementAccount.account_holder_name }}</span>
                  <span class="sp-detail">
                    {{ balanceData.settlementAccount.bank_name }} ·
                    {{ maskAccount(balanceData.settlementAccount.bank_account_no) }}
                  </span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Amount (₹)</label>
                <input
                  v-model.number="withdrawAmount"
                  type="number" min="1"
                  :max="balanceData.balance"
                  placeholder="Enter amount"
                  class="form-input"
                />
                <span class="form-hint">Available: ₹{{ formatCurrency(balanceData.balance) }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">Note <span class="form-opt">(optional)</span></label>
                <input v-model="withdrawNote" type="text" placeholder="e.g. Settlement payout" class="form-input" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="mbtn mbtn--secondary" @click="closeWithdraw">Cancel</button>
              <button
                class="mbtn mbtn--primary"
                @click="withdrawStep = 2"
                :disabled="!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > balanceData.balance"
              >Continue</button>
            </div>
          </template>

          <template v-if="withdrawStep === 2">
            <div class="modal-body">
              <p class="confirm-label">Confirm withdrawal destination</p>
              <div class="confirm-account-card" v-if="balanceData.settlementAccount">
                <div class="cac-row">
                  <span class="cac-key">Account Holder</span>
                  <span class="cac-val">{{ balanceData.settlementAccount.account_holder_name }}</span>
                </div>
                <div class="cac-row">
                  <span class="cac-key">Bank</span>
                  <span class="cac-val">{{ balanceData.settlementAccount.bank_name }}</span>
                </div>
                <div class="cac-row">
                  <span class="cac-key">Account No.</span>
                  <span class="cac-val">{{ maskAccount(balanceData.settlementAccount.bank_account_no) }}</span>
                </div>
                <div class="cac-row" v-if="balanceData.settlementAccount.bank_ifsc_code">
                  <span class="cac-key">IFSC</span>
                  <span class="cac-val">{{ balanceData.settlementAccount.bank_ifsc_code }}</span>
                </div>
                <div class="cac-divider"></div>
                <div class="cac-row cac-row-amount">
                  <span class="cac-key">Amount to Withdraw</span>
                  <span class="cac-amount">₹{{ formatCurrency(withdrawAmount) }}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="mbtn mbtn--secondary" @click="withdrawStep = 1">Back</button>
              <button
                class="mbtn mbtn--danger"
                @click="handleWithdraw"
                :disabled="withdrawLoading"
              >
                <span class="mdi mdi-loading mdi-spin" v-if="withdrawLoading"></span>
                <span v-else>Confirm Withdrawal</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <!-- ══════════════════════════════════════════════════
         HISTORY MODAL
    ══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showHistoryModal" class="modal-overlay" @click.self="showHistoryModal = false">
        <div class="modal-card modal-card--wide">
          <div class="modal-header">
            <div class="modal-hicon modal-hicon--history">
              <span class="mdi mdi-swap-horizontal"></span>
            </div>
            <div>
              <h3 class="modal-title">Transfer History</h3>
              <p class="modal-sub">{{ historyMeta.total }} records total</p>
            </div>
            <button class="modal-close" @click="showHistoryModal = false">
              <span class="mdi mdi-close"></span>
            </button>
          </div>

          <div class="history-tabs">
            <button
              v-for="ht in historyTabs"
              :key="ht.value"
              class="history-tab"
              :class="{ 'history-tab--active': historyFilter === ht.value }"
              @click="changeHistoryFilter(ht.value)"
            >{{ ht.label }}</button>
          </div>

          <div class="modal-body modal-body--scroll">
            <div v-if="historyLoading" class="history-loading">
              <div class="skel skel-row mb-2" v-for="n in 5" :key="n"></div>
            </div>

            <div v-else-if="historyData.length === 0" class="h-empty">
              <span class="mdi mdi-swap-horizontal h-empty-icon"></span>
              <p class="h-empty-title">No Records Found</p>
              <p class="h-empty-sub">No transfer history for the selected filter</p>
            </div>

            <template v-else>
              <div class="history-tbl">
                <div class="history-tbl-head">
                  <span class="hth">#</span>
                  <span class="hth">Description</span>
                  <span class="hth">Date</span>
                  <span class="hth hth-r">Amount</span>
                  <span class="hth hth-c">Type</span>
                </div>
                <div
                  v-for="(entry, idx) in historyData"
                  :key="entry.id"
                  class="history-tbl-row"
                >
                  <span class="htd htd-seq">{{ (historyMeta.page - 1) * historyMeta.limit + idx + 1 }}</span>
                  <span class="htd htd-desc">
                    <span class="htd-dot" :class="entry.type.toLowerCase()">
                      <span class="mdi" :class="entry.type === 'CREDIT' ? 'mdi-arrow-down' : 'mdi-arrow-up'"></span>
                    </span>
                    {{ entry.description || 'Transaction' }}
                  </span>
                  <span class="htd htd-date">{{ formatDateTime(entry.createdAt) }}</span>
                  <span class="htd htd-r">
                    <span class="htd-amount" :class="entry.type.toLowerCase()">
                      {{ entry.type === 'CREDIT' ? '+' : '-' }}₹{{ formatCurrency(parseFloat(entry.amount)) }}
                    </span>
                  </span>
                  <span class="htd hth-c">
                    <span class="htd-pill" :class="entry.type.toLowerCase()">{{ entry.type }}</span>
                  </span>
                </div>
              </div>

              <div class="history-pagination" v-if="historyMeta.totalPages > 1">
                <button class="page-btn" :disabled="historyMeta.page <= 1" @click="changePage(historyMeta.page - 1)">
                  <span class="mdi mdi-chevron-left"></span>
                </button>
                <span class="page-info">{{ historyMeta.page }} / {{ historyMeta.totalPages }}</span>
                <button class="page-btn" :disabled="historyMeta.page >= historyMeta.totalPages" @click="changePage(historyMeta.page + 1)">
                  <span class="mdi mdi-chevron-right"></span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Teleport>

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
import { usePaymentsApi } from "~/composables/apis/usepaymentsApi";
import { useMerchantBalanceApi } from "~/composables/apis/useMerchantBalanceApi";
import VueApexCharts from "vue3-apexcharts";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const apexchart = VueApexCharts;

// ── Payments store / api ───────────────────────────────────────
const store = usePaymentsStore();
const { getMerchantCollections, getTransactionStatus, getPaymentsByGranularity } = usePaymentsApi();
const { totalCollection: collections } = storeToRefs(store);

// ── Balance composable ─────────────────────────────────────────
const {
  balanceData, historyData, historyMeta,
  balanceLoading, historyLoading, addMoneyLoading, withdrawLoading,
  fetchBalance, addMoney, withdraw, fetchHistory,
  formatCurrency, maskAccount,
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
const todayProgress   = computed(() => (collections.value.dailyCollection   / 1000000) * 100);
const weeklyProgress  = computed(() => (collections.value.weeklyCollection  / 1000)    * 100);
const monthlyProgress = computed(() => (collections.value.monthlyCollection / 1000)    * 100);
const yearlyProgress  = computed(() => (collections.value.yearlyCollection  / 1000)    * 100);

// ── Donut chart ────────────────────────────────────────────────
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

// ── Line chart ─────────────────────────────────────────────────
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

// ── Modals ─────────────────────────────────────────────────────
const showAddModal      = ref(false);
const showWithdrawModal = ref(false);
const showHistoryModal  = ref(false);

const addAmount  = ref(null);
const addNote    = ref("");

const withdrawAmount = ref(null);
const withdrawNote   = ref("");
const withdrawStep   = ref(1);

const historyFilter = ref("");
const historyTabs = [
  { label: "All",     value: "" },
  { label: "Credits", value: "CREDIT" },
  { label: "Debits",  value: "DEBIT" },
];

// ── Toast ──────────────────────────────────────────────────────
const toast = ref({ show: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 4000);
};

// ── Handlers ───────────────────────────────────────────────────
const handleAddMoney = async () => {
  if (!addAmount.value || addAmount.value <= 0) return;
  try {
    const res = await addMoney(addAmount.value, addNote.value);
    if (res?.statusCode === "00") {
      showToast(`₹${formatCurrency(addAmount.value)} added successfully`);
      showAddModal.value = false;
      addAmount.value = null;
      addNote.value = "";
    } else {
      showToast(res?.message || "Failed to add funds", "error");
    }
  } catch {
    showToast("Failed to add funds. Please try again.", "error");
  }
};

const handleWithdraw = async () => {
  if (!withdrawAmount.value || withdrawAmount.value <= 0) return;
  try {
    const res = await withdraw(withdrawAmount.value, withdrawNote.value);
    if (res?.statusCode === "00") {
      showToast(`₹${formatCurrency(withdrawAmount.value)} withdrawal initiated`);
      closeWithdraw();
    } else {
      showToast(res?.message || "Withdrawal failed", "error");
    }
  } catch {
    showToast("Withdrawal failed. Please try again.", "error");
  }
};

const closeWithdraw = () => {
  showWithdrawModal.value = false;
  withdrawStep.value = 1;
  withdrawAmount.value = null;
  withdrawNote.value = "";
};

const changeHistoryFilter = (val) => {
  historyFilter.value = val;
  fetchHistory({ page: 1, limit: 20, type: val || undefined });
};

const changePage = (page) => {
  fetchHistory({ page, limit: historyMeta.value.limit, type: historyFilter.value || undefined });
};

watch(showHistoryModal, (val) => {
  if (val && historyData.value.length === 0) fetchHistory({ page: 1, limit: 20 });
});

const formatDateTime = (s) => {
  if (!s) return "N/A";
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    getMerchantCollections(),
    loadTransactionStatus(),
    loadTimeSeries(tab.value),
    fetchBalance(),
  ]);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

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
.bp-btn--add {
  background: rgba(255,255,255,1);
  color: #0f172a;
  border: 1px solid rgba(255,255,255,0.28);
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

.card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden; }
.donut-card { padding: 20px; }
.line-card  { padding: 20px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.card-title-wrap { display: flex; align-items: center; gap: 10px; }
.card-icon-dot { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.chart-wrap { max-height: 200px; }

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
.toast-close { background: none; border: none; cursor: pointer; color: inherit; padding: 2px; display: flex; align-items: center; margin-left: true; }
.toast-slide-enter-active { animation: toastIn .3s ease; }
.toast-slide-leave-active { animation: toastIn .2s ease reverse; }
@keyframes toastIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ── Skeletons ── */
.skel {
  background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skel-sm { height: 12px; width: 55%; }
.skel-md { height: 10px; width: 60%; }
.skel-xl { height: 42px; width: 70%; }
.skel-row { height: 40px; width: 100%; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
</style>