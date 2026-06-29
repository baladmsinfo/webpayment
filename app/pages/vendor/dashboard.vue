<template>
  <div class="dash-root">

    <!-- ── Page Header ── -->
    <div class="dash-page-header">
      <div>
        <h1 class="dash-page-title">Dashboard</h1>
        <p class="dash-page-sub">Welcome back — here's what's happening today</p>
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

          <!-- <div class="bp-account" v-if="balanceData.settlementAccount">
            <span class="mdi mdi-bank-outline bp-bank-icon"></span>
            <span class="bp-bank-name">{{ balanceData.settlementAccount.bank_name }}</span>
            <span class="bp-bank-acc">{{ maskAccount(balanceData.settlementAccount.bank_account_no) }}</span>
          </div>
          <div class="bp-account bp-account--missing" v-else>
            <span class="mdi mdi-alert-circle-outline bp-bank-icon"></span>
            <span class="bp-bank-name">No settlement account linked</span>
          </div> -->

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
            <button class="bp-btn bp-btn--account" @click="navigateTo('/vendor/account')">
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

      <!-- Merchant Stats (right side) -->
      <div class="merchant-stats-panel">
        <template v-if="!loading">
          <div v-for="(stat, i) in overallStats.slice(0, 2)" :key="i"
            class="merchant-stat-card"
            :class="i === 0 ? 'merchant-stat-card--accent' : ''">
            <div class="msc-header">
              <span class="msc-label">{{ stat.title }}</span>
              <div class="msc-icon-wrap" :class="'msc-icon-' + i">
                <span class="mdi" :class="statIcons[i]"></span>
              </div>
            </div>
            <div class="msc-value">{{ stat.value }}</div>
            <div class="msc-sub" v-if="stat.sub">{{ stat.sub }}</div>
          </div>
        </template>
        <template v-else>
          <div v-for="i in 2" :key="i" class="merchant-stat-card">
            <div class="skel skel-sm mb-2"></div>
            <div class="skel skel-lg mb-2"></div>
            <div class="skel skel-md"></div>
          </div>
        </template>
      </div>

    </div>

    <!-- ── Row 2: Payment Methods + Transaction Status ── -->
    <div class="mid-grid">

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
            <div class="empty-icon-wrap">
              <span class="mdi mdi-credit-card-off-outline"></span>
            </div>
            <p class="empty-title">No Payment Transactions</p>
            <p class="empty-desc">Payment methods will appear once transactions are recorded</p>
          </div>
        </template>
        <template v-else>
          <div class="chart-skeleton">
            <div class="skel-donut"></div>
            <div class="skel-legend">
              <div class="skel skel-legend-item" v-for="n in 4" :key="n"></div>
            </div>
          </div>
        </template>
      </div>

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
            <div class="empty-icon-wrap">
              <span class="mdi mdi-calendar-remove"></span>
            </div>
            <p class="empty-title">No Transactions Today</p>
            <p class="empty-desc">There are no transactions recorded for today</p>
          </div>
        </template>
        <template v-else>
          <div class="chart-skeleton">
            <div class="skel-donut"></div>
            <div class="skel-legend">
              <div class="skel skel-legend-item" v-for="n in 2" :key="n"></div>
            </div>
          </div>
        </template>
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
            <div class="trophy-wrap">
              <span class="mdi mdi-trophy-variant-outline trophy-icon"></span>
            </div>
          </div>
          <div class="merchant-list">
            <div v-for="(m, idx) in list" :key="m.id" class="merchant-item" :class="{ 'merchant-item-top': idx === 0 }">
              <div class="merchant-rank" :class="rankClass(idx)">{{ idx + 1 }}</div>
              <div class="merchant-info">
                <p class="merchant-name">{{ m.name }}</p>
                <p class="merchant-txn">{{ m.txnCount }} transactions</p>
              </div>
              <div class="merchant-amount">
                <span class="amount-currency">₹</span>{{ m.totalAmount.toLocaleString() }}
              </div>
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

    <!-- ══════════════════════════════════════════════════
         ADD FUNDS MODAL
    ══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-header-icon modal-header-icon--add">
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
                type="number"
                min="1"
                placeholder="Enter amount"
                class="form-input"
                @keyup.enter="handleAddMoney"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Note <span class="form-optional">(optional)</span></label>
              <input
                v-model="addNote"
                type="text"
                placeholder="e.g. Monthly top-up"
                class="form-input"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn modal-btn--secondary" @click="showAddModal = false">Cancel</button>
            <button
              class="modal-btn modal-btn--primary"
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
            <div class="modal-header-icon modal-header-icon--withdraw">
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

          <!-- Step 1: Enter amount -->
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
                  type="number"
                  min="1"
                  :max="balanceData.balance"
                  placeholder="Enter amount"
                  class="form-input"
                />
                <span class="form-hint">
                  Available: ₹{{ formatCurrency(balanceData.balance) }}
                </span>
              </div>
              <div class="form-group">
                <label class="form-label">Note <span class="form-optional">(optional)</span></label>
                <input v-model="withdrawNote" type="text" placeholder="e.g. Settlement payout" class="form-input" />
              </div>
            </div>
            <div class="modal-footer">
              <button class="modal-btn modal-btn--secondary" @click="closeWithdraw">Cancel</button>
              <button
                class="modal-btn modal-btn--primary"
                @click="withdrawStep = 2"
                :disabled="!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > balanceData.balance"
              >
                Continue
              </button>
            </div>
          </template>

          <!-- Step 2: Confirm settlement account -->
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
              <button class="modal-btn modal-btn--secondary" @click="withdrawStep = 1">Back</button>
              <button
                class="modal-btn modal-btn--danger"
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
            <div class="modal-header-icon modal-header-icon--history">
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
              v-for="tab in historyTabs"
              :key="tab.value"
              class="history-tab"
              :class="{ 'history-tab--active': historyFilter === tab.value }"
              @click="changeHistoryFilter(tab.value)"
            >{{ tab.label }}</button>
          </div>

          <div class="modal-body modal-body--scroll">
            <div v-if="historyLoading" class="history-loading">
              <div class="skel skel-row mb-2" v-for="n in 5" :key="n"></div>
            </div>

            <div v-else-if="historyData.length === 0" class="empty-state">
              <div class="empty-icon-wrap">
                <span class="mdi mdi-swap-horizontal"></span>
              </div>
              <p class="empty-title">No Records Found</p>
              <p class="empty-desc">No transfer history for the selected filter</p>
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
                <button
                  class="page-btn"
                  :disabled="historyMeta.page <= 1"
                  @click="changePage(historyMeta.page - 1)"
                >
                  <span class="mdi mdi-chevron-left"></span>
                </button>
                <span class="page-info">
                  {{ historyMeta.page }} / {{ historyMeta.totalPages }}
                </span>
                <button
                  class="page-btn"
                  :disabled="historyMeta.page >= historyMeta.totalPages"
                  @click="changePage(historyMeta.page + 1)"
                >
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
import { computed, onMounted, ref, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useVendorApi } from "~/composables/apis/useVendorApi";
import { useVendorBalanceApi } from "~/composables/apis/useVendorBalanceApi";
import { useAuthStore } from "~/stores/auth";

// ── API hooks ──────────────────────────────────────────────────
const { getVendor, getTransactions, getTransactionStatusSummary, getPaymentMethodSummary } = useVendorApi();
const {
  balanceData, historyData, historyMeta,
  balanceLoading, historyLoading, addMoneyLoading, withdrawLoading,
  fetchBalance, addMoney, withdraw, fetchHistory,
  formatCurrency, maskAccount,
} = useVendorBalanceApi();

const authStore = useAuthStore();
const apexchart = VueApexCharts;
const loading = ref(true);

// ── Stat icons ─────────────────────────────────────────────────
const statIcons = [
  "mdi-account-check-outline",
  "mdi-account-group-outline",
];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const rankClass = (idx) => {
  if (idx === 0) return "rank-gold";
  if (idx === 1) return "rank-silver";
  if (idx === 2) return "rank-bronze";
  return "rank-default";
};

definePageMeta({ layout: "vendorlayer", middleware: "auth" });

// ── Overall stats ──────────────────────────────────────────────
const overallStats = computed(() => [
  { title: "Active Merchants", value: `${authStore.merchants.active}`, sub: "Onboarded Merchants" },
  { title: "Total Merchants", value: `${authStore.merchants.total}`, sub: "All Merchants" },
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

const statusDonutSeries = computed(() =>
  Object.values(authStore.transactionStatusSummary).map((t) => t.count)
);

const statusDonutOptions = computed(() => {
  const data = Object.values(authStore.transactionStatusSummary);
  const labels = data.map((t) => t.status);
  const total = data.reduce((sum, t) => sum + t.count, 0);
  return {
    labels,
    colors: ["#22c55e", "#ef4444", "#f59e0b", "#1142d4"],
    legend: { position: "bottom", fontSize: "12px", fontFamily: "DM Sans, sans-serif" },
    chart: { fontFamily: "DM Sans, sans-serif" },
    plotOptions: {
      pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Total Txns", fontSize: "12px", fontWeight: 600, color: "#64748b", formatter: () => total.toLocaleString() } } } },
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ["#fff"] },
    tooltip: { y: { formatter: (val, opts) => { const t = data[opts.seriesIndex]; return `${t.count} Txns | ₹${t.amount}`; } } },
  };
});

const donutSeries = computed(() =>
  Object.values(authStore.paymentSummary).map((m) => m.amount)
);

const donutOptions = computed(() => {
  const methods = Object.keys(authStore.paymentSummary);
  const values = Object.values(authStore.paymentSummary).map((m) => m.amount);
  const totalAmount = values.reduce((acc, val) => acc + val, 0);
  return {
    labels: methods,
    colors: ["#1142d4", "#22c55e", "#f59e0b", "#06b6d4"],
    legend: { position: "bottom", fontSize: "12px", fontFamily: "DM Sans, sans-serif" },
    chart: { fontFamily: "DM Sans, sans-serif" },
    plotOptions: {
      pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Total", fontSize: "12px", fontWeight: 600, color: "#64748b", formatter: () => `₹${totalAmount.toLocaleString()}` } } } },
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, colors: ["#fff"] },
    tooltip: { y: { formatter: (val) => `₹${val.toLocaleString()}` } },
  };
});

// ── Modal state ────────────────────────────────────────────────
const showAddModal = ref(false);
const showWithdrawModal = ref(false);
const showHistoryModal = ref(false);

const addAmount = ref(null);
const addNote = ref("");

const withdrawAmount = ref(null);
const withdrawNote = ref("");
const withdrawStep = ref(1);

const historyFilter = ref("");
const historyTabs = [
  { label: "All",    value: "" },
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
  if (val && historyData.value.length === 0) {
    fetchHistory({ page: 1, limit: 20 });
  }
});

// ── Date formatter ─────────────────────────────────────────────
const formatDateTime = (s) => {
  if (!s) return "N/A";
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  loading.value = authStore.merchants.total === 0;
  try {
    await Promise.all([
      getVendor(),
      getTransactions(),
      getTransactionStatusSummary(),
      getPaymentMethodSummary(),
      fetchBalance(),
    ]);
  } catch (err) {
    console.error("Dashboard load error:", err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after { box-sizing: border-box; }

/* ── Root ── */
.dash-root {
  font-family: 'DM Sans', sans-serif;
  background: #f6f6f8;
  min-height: 100vh;
  padding: 20px 16px 40px;
}
@media (min-width: 768px)  { .dash-root { padding: 28px 28px 48px; } }
@media (min-width: 1200px) { .dash-root { padding: 32px 36px 56px; } }

/* ── Page Header ── */
.dash-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
  gap: 12px;
  flex-wrap: wrap;
}
.dash-page-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}
@media (min-width: 640px) { .dash-page-title { font-size: 26px; } }
.dash-page-sub { font-size: 13px; color: #64748b; margin-top: 3px; }

/* ══════════════════════════════════════════════════
   HERO ROW  (Balance LEFT + Merchant Stats RIGHT)
══════════════════════════════════════════════════ */
.hero-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
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
  margin-bottom: 12px;
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
}
.bp-currency { font-size: 22px; font-weight: 600; color: rgba(255,255,255,0.70); }
.bp-value    { font-size: 44px; font-weight: 700; color: #fff; font-family: 'DM Mono', monospace; letter-spacing: -2px; line-height: 1; }

.bp-account {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.10);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}
.bp-account--missing { background: rgba(248,113,113,0.15); }
.bp-bank-icon { font-size: 17px; color: rgba(255,255,255,0.7); flex-shrink: 0; }
.bp-bank-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); flex: 1; }
.bp-bank-acc  { font-size: 12px; color: rgba(255,255,255,0.50); font-family: 'DM Mono', monospace; }

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
  background: rgba(255,255,255);
  color: black;
  border: 1px solid rgba(255,255,255,0.28);
}
.bp-btn--add:hover { background: rgba(255,255,255,0.30); }
.bp-btn--withdraw {
  background: rgba(255,255,255);
  color: black;
  border: 1px solid rgba(255,255,255,0.15);
}
.bp-btn--withdraw:hover:not(:disabled) { background: rgba(255,255,255,0.20); }
.bp-btn--withdraw:disabled { opacity: 0.4; cursor: not-allowed; }
.bp-btn--account {
  background: rgba(255,255,255);
  color: black;
  border: 1px solid rgba(255,255,255,0.18);
}
.bp-btn--account:hover { background: rgba(255,255,255,0.10); color: #fff; }

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
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  font-family: 'DM Mono', monospace;
  letter-spacing: -1px;
  line-height: 1;
  margin-bottom: 4px;
}
.msc-sub { font-size: 12px; color: #94a3b8; }

/* ── Mid Grid (charts) ── */
.mid-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
@media (max-width: 768px) { .mid-grid { grid-template-columns: 1fr; } }

/* ── Chart Card ── */
.chart-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.chart-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; gap: 8px; }
.chart-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.chart-sub   { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.chart-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; white-space: nowrap; flex-shrink: 0; }
.chart-badge-blue  { background: rgba(17,66,212,0.08); color: #1142d4; }
.chart-badge-green { background: rgba(34,197,94,0.1); color: #16a34a; }

/* ── Empty State ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; text-align: center; min-height: 220px; }
.empty-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: rgba(17,66,212,0.06); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 14px; }
.empty-title { font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 6px; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 200px; line-height: 1.5; }
.empty-state-sm { min-height: 80px; padding: 20px; }
.empty-icon-sm  { font-size: 28px; color: #cbd5e1; display: block; margin-bottom: 8px; }

/* ── Section Header ── */
.section-header { margin: 8px 0 14px; }
.section-title  { font-size: 17px; font-weight: 700; color: #0f172a; }
.section-sub    { font-size: 12px; color: #64748b; margin-top: 2px; }

/* ── Merchants Grid ── */
.merchants-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media (min-width: 640px)  { .merchants-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .merchants-grid { grid-template-columns: repeat(3, 1fr); } }

.merchant-card { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.merchant-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.merchant-period     { font-size: 14px; font-weight: 700; color: #0f172a; }
.merchant-period-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.trophy-wrap  { width: 34px; height: 34px; border-radius: 10px; background: rgba(245,158,11,0.1); display: flex; align-items: center; justify-content: center; }
.trophy-icon  { font-size: 18px; color: #f59e0b; }
.merchant-list { display: flex; flex-direction: column; gap: 8px; }
.merchant-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; background: #f8fafc; border: 1px solid transparent; transition: all 0.2s; }
.merchant-item:hover { background: rgba(17,66,212,0.04); border-color: rgba(17,66,212,0.12); }
.merchant-item-top { background: linear-gradient(90deg, rgba(17,66,212,0.05), rgba(17,66,212,0.02)); border-color: rgba(17,66,212,0.1); }
.merchant-rank { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.rank-gold    { background: #fef3c7; color: #d97706; }
.rank-silver  { background: #f1f5f9; color: #64748b; }
.rank-bronze  { background: #fef2e8; color: #c2763a; }
.rank-default { background: #f1f5f9; color: #94a3b8; }
.merchant-info   { flex: 1; min-width: 0; }
.merchant-name   { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.merchant-txn    { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.merchant-amount { font-size: 13px; font-weight: 700; color: #1142d4; font-family: 'DM Mono', monospace; white-space: nowrap; flex-shrink: 0; }
.amount-currency { font-size: 10px; margin-right: 1px; }

/* ══════════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.55);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9000;
  padding: 16px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal-card {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.18);
  animation: slideUp 0.25s ease;
  overflow: hidden;
}
.modal-card--wide { max-width: 600px; }
@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-header-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.modal-header-icon--add      { background: rgba(17,66,212,0.08); color: #1142d4; }
.modal-header-icon--withdraw { background: rgba(220,38,38,0.08); color: #dc2626; }
.modal-header-icon--history  { background: rgba(100,116,139,0.08); color: #64748b; }

.modal-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
.modal-sub   { font-size: 12px; color: #94a3b8; margin: 2px 0 0; }
.modal-close {
  margin-left: auto;
  width: 32px; height: 32px;
  border-radius: 8px;
  border: none; background: none;
  cursor: pointer; color: #94a3b8;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  transition: background 0.15s;
}
.modal-close:hover { background: #f1f5f9; color: #475569; }

.modal-body { padding: 20px; }
.modal-body--scroll { max-height: 420px; overflow-y: auto; padding: 16px 20px; }

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
}
.modal-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all 0.2s;
}
.modal-btn--primary   { background: #1142d4; color: #fff; }
.modal-btn--primary:hover:not(:disabled)   { background: #0e35a8; box-shadow: 0 4px 12px rgba(17,66,212,0.3); }
.modal-btn--danger    { background: #dc2626; color: #fff; }
.modal-btn--danger:hover:not(:disabled)    { background: #b91c1c; box-shadow: 0 4px 12px rgba(220,38,38,0.3); }
.modal-btn--secondary { background: #f1f5f9; color: #475569; }
.modal-btn--secondary:hover { background: #e2e8f0; }
.modal-btn:disabled   { opacity: 0.5; cursor: not-allowed; }

.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.form-optional { font-weight: 400; color: #9ca3af; }
.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  color: #1e293b;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.form-input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,0.10); }
.form-hint { display: block; font-size: 11px; color: #94a3b8; margin-top: 5px; }

.settlement-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0f4ff;
  border: 1px solid rgba(17,66,212,0.15);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 20px;
}
.sp-icon { font-size: 20px; color: #1142d4; }
.sp-info { display: flex; flex-direction: column; gap: 2px; }
.sp-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.sp-detail { font-size: 12px; color: #64748b; }

.confirm-label { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
.confirm-account-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.cac-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; }
.cac-row-amount { padding-top: 12px; }
.cac-key { font-size: 12px; color: #94a3b8; }
.cac-val { font-size: 12px; font-weight: 600; color: #1e293b; }
.cac-amount { font-size: 18px; font-weight: 700; color: #dc2626; font-family: 'DM Mono', monospace; }
.cac-divider { height: 1px; background: #e2e8f0; margin: 8px 0; }

.history-tabs { display: flex; gap: 4px; padding: 0 20px 12px; border-bottom: 1px solid #f1f5f9; }
.history-tab {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: none;
  color: #94a3b8;
  transition: all 0.15s;
}
.history-tab:hover { background: #f1f5f9; color: #475569; }
.history-tab--active { background: #eff6ff; color: #1142d4; }

.history-loading { padding: 16px 0; }

.history-tbl { width: 100%; }
.history-tbl-head {
  display: grid;
  grid-template-columns: 28px 1fr 120px 90px 72px;
  padding: 8px 10px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 4px;
}
.hth { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
.hth-r { text-align: right; }
.hth-c { text-align: center; }

.history-tbl-row {
  display: grid;
  grid-template-columns: 28px 1fr 120px 90px 72px;
  padding: 10px 10px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background 0.1s;
  border-radius: 6px;
}
.history-tbl-row:hover { background: #f8fafc; }
.history-tbl-row:last-child { border-bottom: none; }

.htd { font-size: 12px; color: #475569; display: flex; align-items: center; gap: 7px; }
.htd-seq   { font-size: 11px; color: #cbd5e1; font-weight: 600; }
.htd-desc  { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; gap: 8px; }
.htd-date  { font-size: 11px; color: #94a3b8; }
.htd-r     { justify-content: flex-end; }

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

.htd-pill { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.3px; }
.htd-pill.credit { background: #dcfce7; color: #16a34a; }
.htd-pill.debit  { background: #fee2e2; color: #dc2626; }

.history-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding-top: 14px; }
.page-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 16px; color: #475569;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-info { font-size: 12px; font-weight: 600; color: #64748b; }

/* ── Toast ── */
.toast-bar {
  position: fixed;
  bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  z-index: 9999;
  max-width: 340px;
  font-family: 'DM Sans', sans-serif;
}
.toast-bar--success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.toast-bar--error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; padding: 2px; display: flex; align-items: center; margin-left: auto; }
.toast-slide-enter-active { animation: toastIn 0.3s ease; }
.toast-slide-leave-active { animation: toastIn 0.2s ease reverse; }
@keyframes toastIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skel-sm  { height: 12px; width: 55%; margin-bottom: 10px; }
.skel-md  { height: 10px; width: 60%; }
.skel-lg  { height: 28px; width: 45%; margin-bottom: 8px; }
.skel-xl  { height: 44px; width: 70%; }
.skel-row { height: 40px; width: 100%; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }

.chart-skeleton { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 16px 0; }
.skel-donut { width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skel-legend { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.skel-legend-item { height: 10px; width: 64px; border-radius: 4px; }
</style>