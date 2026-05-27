<template>
  <div class="wallet-page">
    <!-- Loading Skeleton -->
    <div v-if="walletLoading" class="skeleton-loader">
      <div class="skeleton-card balance-card"></div>
      <div class="skeleton-card cards-panel"></div>
      <div class="skeleton-card chart-panel"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="walletError" class="error-container">
      <div class="error-icon">
        <v-icon size="48">mdi-alert-circle-outline</v-icon>
      </div>
      <h2>Failed to Load Wallet</h2>
      <p>{{ walletError }}</p>
      <button class="retry-btn" @click="loadWalletData">
        <v-icon size="16" class="mr-1">mdi-refresh</v-icon>
        Try Again
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="outer-grid">
      <!-- ═══ LEFT COLUMN ═══ -->
      <div class="left-col">
        <!-- Total Balance Card (WALLET balance from API) -->
        <div class="panel balance-card">
          <div class="field-label">Total Balance</div>
          <div class="balance-big">
            ₹{{ formatCurrency(parseFloat(wallet.balance)) }}
            <span class="balance-currency">INR</span>
          </div>
          <div class="balance-meta">
            <span class="balance-date">{{ today }}</span>
            <span class="badge badge-green" v-if="totalCredits > 0">
              <v-icon size="12">mdi-trending-up</v-icon>
              +{{ ((totalCredits / (totalCredits + totalDebits)) * 100).toFixed(1) }}%
            </span>
          </div>
          <div class="balance-actions">
            <button class="withdraw-btn" @click="showWithdrawModal = true">
              <v-icon size="14" class="mr-1">mdi-cash-minus</v-icon>
              Withdraw
            </button>
            <button class="deposit-btn" @click="showDepositModal = true">
              <v-icon size="14" class="mr-1">mdi-cash-plus</v-icon>
              Deposit
            </button>
          </div>
        </div>

        <!-- Wallet Info Card -->
        <div class="panel info-card">
          <div class="info-row">
            <span class="info-label">Wallet ID</span>
            <span class="info-value">{{ truncateId(wallet.id) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status</span>
            <span class="info-value">
              <span class="status-badge" :class="wallet.status ? 'active' : 'inactive'">
                {{ wallet.status ? "Active" : "Inactive" }}
              </span>
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">Created</span>
            <span class="info-value">{{ formatDate(wallet.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Last Updated</span>
            <span class="info-value">{{ formatDate(wallet.updatedAt) }}</span>
          </div>
        </div>

        <!-- Transaction Stats -->
        <div class="panel stats-card">
          <div class="stat-item">
            <div class="stat-icon credit">
              <v-icon size="18">mdi-plus-circle</v-icon>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Credits</span>
              <span class="stat-amount">₹{{ formatCurrency(totalCredits) }}</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="stat-item">
            <div class="stat-icon debit">
              <v-icon size="18">mdi-minus-circle</v-icon>
            </div>
            <div class="stat-content">
              <span class="stat-label">Total Debits</span>
              <span class="stat-amount">₹{{ formatCurrency(totalDebits) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ RIGHT COLUMN ═══ -->
      <div class="right-col">
        <!-- Transaction History -->
        <div class="panel transactions-panel">
          <div class="panel-header">
            <span class="panel-title">Recent Transactions</span>
            <router-link to="/wallet-service/transactions" class="view-all-link">
              View All
            </router-link>
          </div>

          <div v-if="recentTransactions.length === 0" class="empty-state">
            <v-icon size="32" color="#d0ccc0">mdi-swap-horizontal</v-icon>
            <p>No transactions yet</p>
          </div>

          <div v-else class="transactions-list">
            <div
              v-for="txn in recentTransactions"
              :key="txn.id"
              class="transaction-item"
            >
              <div class="txn-left">
                <div class="txn-icon" :class="txn.type.toLowerCase()">
                  <v-icon size="16">
                    {{ txn.type === "CREDIT" ? "mdi-plus" : "mdi-minus" }}
                  </v-icon>
                </div>
                <div class="txn-content">
                  <span class="txn-description">{{ txn.description }}</span>
                  <span class="txn-date">{{ formatDateTime(txn.createdAt) }}</span>
                </div>
              </div>
              <div class="txn-amount" :class="txn.type.toLowerCase()">
                {{ txn.type === "CREDIT" ? "+" : "-" }}₹{{ formatCurrency(parseFloat(txn.amount)) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="panel quick-actions-panel">
          <div class="panel-header">
            <span class="panel-title">Quick Actions</span>
          </div>
          <div class="quick-actions">
            <button class="action-btn" @click="showDepositModal = true">
              <div class="action-icon deposit">
                <v-icon size="18">mdi-cash-plus</v-icon>
              </div>
              <span>Add Money</span>
            </button>
            <button class="action-btn" @click="showWithdrawModal = true">
              <div class="action-icon withdraw">
                <v-icon size="18">mdi-cash-minus</v-icon>
              </div>
              <span>Withdraw</span>
            </button>
            <button class="action-btn" @click="copyWalletId">
              <div class="action-icon info">
                <v-icon size="18">mdi-content-copy</v-icon>
              </div>
              <span>Copy ID</span>
            </button>
            <button class="action-btn" @click="loadWalletData">
              <div class="action-icon refresh">
                <v-icon size="18">mdi-refresh</v-icon>
              </div>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Ledger Summary Chart -->
        <div class="panel chart-panel" v-if="transactionsByDay.length > 0">
          <div class="chart-header">
            <span class="panel-title">Transaction Trends</span>
          </div>
          <div class="chart-wrap">
            <canvas ref="trendChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Deposit Modal -->
    <div v-if="showDepositModal" class="modal-overlay" @click.self="showDepositModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Add Money to Wallet</h3>
          <button class="modal-close" @click="showDepositModal = false">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Amount (₹)</label>
            <input
              v-model.number="depositAmount"
              type="number"
              min="1"
              placeholder="Enter amount"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Description</label>
            <input
              v-model="depositDescription"
              type="text"
              placeholder="Optional description"
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDepositModal = false">Cancel</button>
          <button
            class="btn-primary"
            @click="handleDeposit"
            :disabled="!depositAmount || depositAmount <= 0 || depositProcessing"
          >
            <span v-if="!depositProcessing">Add Money</span>
            <span v-else>Processing...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div v-if="showWithdrawModal" class="modal-overlay" @click.self="showWithdrawModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3>Withdraw from Wallet</h3>
          <button class="modal-close" @click="showWithdrawModal = false">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Amount (₹)</label>
            <input
              v-model.number="withdrawAmount"
              type="number"
              min="1"
              :max="parseFloat(wallet.balance)"
              placeholder="Enter amount"
              class="form-input"
            />
            <span class="form-hint">Available: ₹{{ formatCurrency(parseFloat(wallet.balance)) }}</span>
          </div>
          <div class="form-group">
            <label>Description</label>
            <input
              v-model="withdrawDescription"
              type="text"
              placeholder="Optional description"
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showWithdrawModal = false">Cancel</button>
          <button
            class="btn-primary"
            @click="handleWithdraw"
            :disabled="!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > parseFloat(wallet.balance) || withdrawProcessing"
          >
            <span v-if="!withdrawProcessing">Withdraw</span>
            <span v-else>Processing...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="toastMessage" class="toast" :class="toastType">
      <v-icon size="18">{{ toastType === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      <span>{{ toastMessage }}</span>
      <button @click="toastMessage = ''" class="toast-close">
        <v-icon size="16">mdi-close</v-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useWalletApi } from "@/composables/apis/useWalletApi";

definePageMeta({
  layout: "walletservicelayer",
  middleware: "auth",
});

useHead({
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
      defer: true,
    },
  ],
});

// ════════════════════════════════════════════════════════════════
// API & DATA MANAGEMENT
// ════════════════════════════════════════════════════════════════

const { walletData, loading: walletLoading, error: walletError, fetchWallet, addMoney, debitMoney } =
  useWalletApi();

const wallet = walletData;

// ════════════════════════════════════════════════════════════════
// UI STATE
// ════════════════════════════════════════════════════════════════

const showDepositModal = ref(false);
const showWithdrawModal = ref(false);
const depositAmount = ref(null);
const depositDescription = ref("");
const withdrawAmount = ref(null);
const withdrawDescription = ref("");
const depositProcessing = ref(false);
const withdrawProcessing = ref(false);
const trendChart = ref(null);

const toastMessage = ref("");
const toastType = ref("success");

const today = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// ════════════════════════════════════════════════════════════════
// COMPUTED PROPERTIES
// ════════════════════════════════════════════════════════════════

const totalCredits = computed(() => {
  return wallet.ledger
    .filter((txn) => txn.type === "CREDIT")
    .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);
});

const totalDebits = computed(() => {
  return wallet.ledger
    .filter((txn) => txn.type === "DEBIT")
    .reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);
});

const recentTransactions = computed(() => {
  return wallet.ledger.slice(0, 5);
});

const transactionsByDay = computed(() => {
  const groupedByDay = {};

  wallet.ledger.forEach((txn) => {
    const date = new Date(txn.createdAt).toLocaleDateString("en-IN");
    if (!groupedByDay[date]) {
      groupedByDay[date] = { credits: 0, debits: 0 };
    }

    if (txn.type === "CREDIT") {
      groupedByDay[date].credits += parseFloat(txn.amount || 0);
    } else {
      groupedByDay[date].debits += parseFloat(txn.amount || 0);
    }
  });

  return Object.entries(groupedByDay).map(([date, data]) => ({
    date,
    ...data,
  }));
});

// ════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncateId = (id) => {
  if (!id) return "N/A";
  return id.substring(0, 8) + "..." + id.substring(id.length - 8);
};

const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = "";
  }, 4000);
};

const copyWalletId = () => {
  navigator.clipboard.writeText(wallet.id);
  showToast("Wallet ID copied to clipboard!");
};

// ════════════════════════════════════════════════════════════════
// API OPERATIONS
// ════════════════════════════════════════════════════════════════

const loadWalletData = async () => {
  try {
    await fetchWallet("profile");
    showToast("Wallet data refreshed!");
    initChart();
  } catch (err) {
    showToast("Failed to load wallet data", "error");
  }
};

const handleDeposit = async () => {
  if (!depositAmount.value || depositAmount.value <= 0) {
    showToast("Please enter a valid amount", "error");
    return;
  }

  depositProcessing.value = true;

  try {
    await addMoney(
      depositAmount.value,
      depositDescription.value || "Wallet Top-up",
      "profile"
    );

    showToast(
      `₹${formatCurrency(depositAmount.value)} added successfully!`
    );
    showDepositModal.value = false;
    depositAmount.value = null;
    depositDescription.value = "";
    initChart();
  } catch (err) {
    showToast(err.message || "Failed to add money", "error");
  } finally {
    depositProcessing.value = false;
  }
};

const handleWithdraw = async () => {
  if (!withdrawAmount.value || withdrawAmount.value <= 0) {
    showToast("Please enter a valid amount", "error");
    return;
  }

  if (withdrawAmount.value > parseFloat(wallet.balance)) {
    showToast("Insufficient balance", "error");
    return;
  }

  withdrawProcessing.value = true;

  try {
    await debitMoney(
      withdrawAmount.value,
      withdrawDescription.value || "Wallet Withdrawal",
      "WALLET",
      "ALL",
      "profile"
    );

    showToast(
      `₹${formatCurrency(withdrawAmount.value)} withdrawn successfully!`
    );
    showWithdrawModal.value = false;
    withdrawAmount.value = null;
    withdrawDescription.value = "";
    initChart();
  } catch (err) {
    showToast(err.message || "Failed to withdraw", "error");
  } finally {
    withdrawProcessing.value = false;
  }
};

// ════════════════════════════════════════════════════════════════
// CHART INITIALIZATION
// ════════════════════════════════════════════════════════════════

const initChart = () => {
  const tryInit = () => {
    if (!trendChart.value || typeof window.Chart === "undefined") {
      setTimeout(tryInit, 100);
      return;
    }

    const chartData = transactionsByDay.value;
    const labels = chartData.map((d) => d.date);
    const creditData = chartData.map((d) => d.credits);
    const debitData = chartData.map((d) => d.debits);

    const ctx = trendChart.value.getContext("2d");
    new window.Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Credits",
            data: creditData,
            backgroundColor: "rgba(59, 109, 17, 0.7)",
            borderColor: "#3b6d11",
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: "Debits",
            data: debitData,
            backgroundColor: "rgba(186, 26, 26, 0.7)",
            borderColor: "#ba1a1a",
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: { size: 12 },
              color: "#888780",
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: (c) => {
                const label = c.dataset.label || "";
                return label + ": ₹" + formatCurrency(c.parsed.y);
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#aaa8a0", font: { size: 11 } },
          },
          y: {
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: {
              color: "#aaa8a0",
              font: { size: 11 },
              callback: (v) => "₹" + formatCurrency(v),
            },
          },
        },
      },
    });
  };

  tryInit();
};

// ════════════════════════════════════════════════════════════════
// LIFECYCLE
// ════════════════════════════════════════════════════════════════

onMounted(async () => {
  await loadWalletData();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.wallet-page {
  padding: 24px;
  background: #f7f6f3;
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* ════════════════════════════════════════════════════════════════ */
/* LAYOUT */
/* ════════════════════════════════════════════════════════════════ */

.outer-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .outer-grid {
    grid-template-columns: 1fr;
  }
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ════════════════════════════════════════════════════════════════ */
/* PANEL STYLES */
/* ════════════════════════════════════════════════════════════════ */

.panel {
  background: #ffffff;
  border: 1px solid #eceae3;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.panel:hover {
  border-color: #dbd7cc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.2px;
}

.field-label {
  font-size: 11px;
  color: #888780;
  display: block;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;
}

.view-all-link {
  font-size: 12px;
  color: #1a6fc4;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #155da0;
}

/* ════════════════════════════════════════════════════════════════ */
/* BALANCE CARD */
/* ════════════════════════════════════════════════════════════════ */

.balance-card {
  background: linear-gradient(135deg, #f7f6f3 0%, #ede8dd 100%);
  border: 1px solid #dbd7cc;
}

.balance-big {
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.balance-currency {
  font-size: 14px;
  font-weight: 400;
  color: #888780;
}

.balance-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.balance-date {
  font-size: 12px;
  color: #888780;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.badge-green {
  background: #eaf3de;
  color: #3b6d11;
}

.badge-red {
  background: #fcebeb;
  color: #a32d2d;
}

.balance-actions {
  display: flex;
  gap: 10px;
}

.withdraw-btn,
.deposit-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 16px;
  border-radius: 50px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.withdraw-btn {
  background: #ba1a1a;
  color: #fff;
}

.withdraw-btn:hover {
  background: #9e1515;
  box-shadow: 0 2px 8px rgba(186, 26, 26, 0.3);
}

.deposit-btn {
  background: #3b6d11;
  color: #fff;
}

.deposit-btn:hover {
  background: #2f550d;
  box-shadow: 0 2px 8px rgba(59, 109, 17, 0.3);
}

/* ════════════════════════════════════════════════════════════════ */
/* INFO CARD */
/* ════════════════════════════════════════════════════════════════ */

.info-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0ede8;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: #888780;
  font-weight: 500;
}

.info-value {
  font-size: 13px;
  color: #1a1a1a;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge.active {
  background: #eaf3de;
  color: #3b6d11;
}

.status-badge.inactive {
  background: #fcebeb;
  color: #a32d2d;
}

/* ════════════════════════════════════════════════════════════════ */
/* STATS CARD */
/* ════════════════════════════════════════════════════════════════ */

.stats-card {
  padding: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.credit {
  background: #eaf3de;
  color: #3b6d11;
}

.stat-icon.debit {
  background: #fcebeb;
  color: #a32d2d;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: #888780;
  font-weight: 500;
}

.stat-amount {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.divider {
  height: 1px;
  background: #f0ede8;
  margin: 0;
}

/* ════════════════════════════════════════════════════════════════ */
/* TRANSACTIONS PANEL */
/* ════════════════════════════════════════════════════════════════ */

.transactions-panel {
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px 20px;
  color: #d0ccc0;
}

.empty-state p {
  font-size: 14px;
  color: #888780;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0ede8;
  transition: background 0.2s;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item:hover {
  background: #faf9f7;
  border-radius: 8px;
  padding: 12px 8px;
}

.txn-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.txn-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 600;
}

.txn-icon.credit {
  background: #eaf3de;
  color: #3b6d11;
}

.txn-icon.debit {
  background: #fcebeb;
  color: #a32d2d;
}

.txn-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.txn-description {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.txn-date {
  font-size: 11px;
  color: #888780;
}

.txn-amount {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 12px;
}

.txn-amount.credit {
  color: #3b6d11;
}

.txn-amount.debit {
  color: #a32d2d;
}

/* ════════════════════════════════════════════════════════════════ */
/* QUICK ACTIONS */
/* ════════════════════════════════════════════════════════════════ */

.quick-actions-panel {
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(4, 1fr);
  }
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border: 1px solid #eceae3;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  color: #555552;
  font-weight: 500;
}

.action-btn:hover {
  background: #faf9f7;
  border-color: #dbd7cc;
}

.action-btn:active {
  transform: scale(0.98);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.action-icon.deposit {
  background: #eaf3de;
  color: #3b6d11;
}

.action-icon.withdraw {
  background: #fcebeb;
  color: #a32d2d;
}

.action-icon.info {
  background: #e8f0ff;
  color: #1a6fc4;
}

.action-icon.refresh {
  background: #f0ede8;
  color: #555552;
}

/* ════════════════════════════════════════════════════════════════ */
/* CHART PANEL */
/* ════════════════════════════════════════════════════════════════ */

.chart-panel {
}

.chart-header {
  margin-bottom: 16px;
}

.chart-wrap {
  position: relative;
  height: 240px;
}

/* ════════════════════════════════════════════════════════════════ */
/* MODALS */
/* ════════════════════════════════════════════════════════════════ */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-card {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eceae3;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #888780;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #f0ede8;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #eceae3;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dbd7cc;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1a6fc4;
  box-shadow: 0 0 0 3px rgba(26, 111, 196, 0.1);
}

.form-hint {
  display: block;
  font-size: 11px;
  color: #888780;
  margin-top: 4px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 11px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1a6fc4;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #155da0;
  box-shadow: 0 2px 8px rgba(26, 111, 196, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0ede8;
  color: #1a1a1a;
}

.btn-secondary:hover {
  background: #e0dcd1;
}

/* ════════════════════════════════════════════════════════════════ */
/* TOAST NOTIFICATION */
/* ════════════════════════════════════════════════════════════════ */

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #fff;
  border: 1px solid #dbd7cc;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  z-index: 999;
  max-width: 350px;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast.success {
  border-color: #b7e4c3;
  background: #f1fdf6;
  color: #2a5e3f;
}

.toast.success :deep(svg) {
  color: #3b6d11;
}

.toast.error {
  border-color: #f5ccc8;
  background: #fef5f4;
  color: #a32d2d;
}

.toast.error :deep(svg) {
  color: #ba1a1a;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

/* ════════════════════════════════════════════════════════════════ */
/* LOADING SKELETON */
/* ════════════════════════════════════════════════════════════════ */

.skeleton-loader {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .skeleton-loader {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  background: linear-gradient(90deg, #f0ede8 0%, #e5e0d7 50%, #f0ede8 100%);
  background-size: 200% 100%;
  border-radius: 16px;
  animation: skeleton-loading 2s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-card.balance-card {
  height: 200px;
}

.skeleton-card.cards-panel {
  height: 250px;
}

.skeleton-card.chart-panel {
  height: 300px;
}

/* ════════════════════════════════════════════════════════════════ */
/* ERROR STATE */
/* ════════════════════════════════════════════════════════════════ */

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  color: #ba1a1a;
}

.error-container h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.error-container p {
  margin: 0;
  font-size: 14px;
  color: #888780;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 20px;
  background: #1a6fc4;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #155da0;
  box-shadow: 0 2px 8px rgba(26, 111, 196, 0.3);
}
</style>