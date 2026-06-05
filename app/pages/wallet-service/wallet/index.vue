<template>
  <div class="wallet-page">

    <!-- Loading Skeleton -->
    <div v-if="walletLoading" class="skeleton-loader">
      <div class="skeleton-left">
        <div class="skeleton-card sk-balance"></div>
        <div class="skeleton-card sk-cards"></div>
      </div>
      <div class="skeleton-right">
        <div class="skeleton-card sk-quick"></div>
        <div class="skeleton-card sk-stats"></div>
        <div class="skeleton-card sk-chart"></div>
      </div>
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

        <!-- Total Balance Card (live from API) -->
        <div class="panel balance-card">
          <div class="field-label">Current Balance</div>
          <div class="balance-big">
            ₹{{ formatCurrency(parseFloat(wallet.balance)) }}
            <span class="balance-currency">INR</span>
          </div>
          <div class="balance-meta">
            <span class="balance-date">{{ today }}</span>
            <span class="badge badge-green" v-if="totalCredits > 0">
              <v-icon size="12">mdi-trending-up</v-icon>
              +{{ ((totalCredits / (totalCredits + totalDebits || 1)) * 100).toFixed(1) }}%
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

        <!-- My Cards -->
        <div class="panel cards-panel">
          <div class="panel-header">
            <span class="panel-title">My Cards</span>
            <span class="wallet-status-badge" :class="wallet.status ? 'active' : 'inactive'">
              {{ wallet.status ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <!-- Active Card Visual -->
          <div class="card-visual" :class="activeCard.cardClass">
            <svg class="card-bg-svg" viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg">
              <circle cx="240" cy="-10" r="100" fill="rgba(255,255,255,0.07)" />
              <circle cx="280" cy="110" r="75" fill="rgba(255,255,255,0.05)" />
              <circle cx="30" cy="150" r="80" fill="rgba(255,255,255,0.04)" />
              <circle cx="-20" cy="40" r="60" fill="rgba(255,255,255,0.04)" />
            </svg>

            <div class="cv-top">
              <span class="cv-label">Card Holder</span>
              <span class="cv-network" :class="activeCard.network === 'VISA' ? 'visa-text' : 'mc-text'">
                {{ activeCard.network }}
              </span>
            </div>

            <!-- <div class="cv-balance">{{ activeCard.balance }}</div> -->

            <div class="cv-balance">{{ activeCard.customer_name }}</div>

            <div class="cv-chip">
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                <rect x="0" y="0" width="32" height="24" rx="4" fill="rgba(255,220,100,0.85)" />
                <line x1="0" y1="8" x2="32" y2="8" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
                <line x1="0" y1="16" x2="32" y2="16" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
                <line x1="11" y1="0" x2="11" y2="24" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
                <line x1="21" y1="0" x2="21" y2="24" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
              </svg>
            </div>

            <div class="cv-bottom">
              <span class="cv-number">5294 2436 4780 {{ activeCard.last4 }}</span>
              <span class="cv-expiry">{{ activeCard.expiry }}</span>
            </div>
          </div>

          <!-- Card Switcher -->
          <div class="card-switcher">
            <div v-for="(card, idx) in cards" :key="idx" class="card-switch-item"
              :class="{ active: selectedCard === idx }" @click="selectCard(idx)">
              <div class="cs-chip" :class="card.cardClass"></div>
              <div class="cs-info">
                <span class="cs-label">{{ card.label }}</span>
                <span class="cs-num">•••• {{ card.last4 }}</span>
              </div>
              <span class="cs-balance">{{ card.balance }}</span>
            </div>
          </div>

          <button class="apply-btn" @click="navigateTo('/wallet-service/card-enquiries')">
            <v-icon size="15" class="mr-1">mdi-credit-card-multiple-outline</v-icon>
            Manage Cards
          </button>
        </div>
      </div>

      <!-- ═══ RIGHT COLUMN ═══ -->
      <div class="right-col">

        <!-- Quick Links -->
        <div class="panel quick-panel">
          <div class="panel-header">
            <span class="panel-title">Quick Links</span>
          </div>
          <div class="quick-links">
            <button v-for="link in quickLinks" :key="link.label" class="quick-btn" @click="handleQuickLink(link)">
              <div class="quick-icon-wrap">
                <v-icon size="20">{{ link.icon }}</v-icon>
              </div>
              <span>{{ link.label }}</span>
            </button>
          </div>
        </div>

        <!-- Stats Row (live from API) -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-header">
              <span class="field-label">Total Credits</span>
              <button class="dots-btn"><v-icon size="16">mdi-dots-horizontal</v-icon></button>
            </div>
            <div class="stat-value-row">
              <span class="stat-amount">₹{{ formatCurrency(totalCredits) }}</span>
              <span class="badge badge-green">
                <v-icon size="10">mdi-trending-up</v-icon>
                {{wallet.ledger.filter(t => t.type === 'CREDIT').length}} txns
              </span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <span class="field-label">Total Debits</span>
              <button class="dots-btn"><v-icon size="16">mdi-dots-horizontal</v-icon></button>
            </div>
            <div class="stat-value-row">
              <span class="stat-amount">₹{{ formatCurrency(totalDebits) }}</span>
              <span class="badge badge-red">
                <v-icon size="10">mdi-trending-down</v-icon>
                {{wallet.ledger.filter(t => t.type === 'DEBIT').length}} txns
              </span>
            </div>
          </div>
        </div>

        <!--Money Flow Chart -->
        <div class="panel chart-panel">
          <div class="chart-header">
            <span class="panel-title">Money Flow</span>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-dot" style="background:#1a6fc4;"></span>Credits
              </span>
              <span class="legend-item">
                <span class="legend-dot" style="background:#b4b2a9;"></span>Debits
              </span>
              <button class="month-btn" @click="loadWalletData">
                <v-icon size="14">mdi-refresh</v-icon> Refresh
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="wallet.ledger.length === 0" class="empty-state">
            <v-icon size="32" color="#d0ccc0">mdi-swap-horizontal</v-icon>
            <p>No transactions yet</p>
          </div>

          <!-- Chart -->
          <div v-else class="chart-wrap">
            <canvas ref="moneyChart"></canvas>
          </div>
        </div>

        <!-- Recent Transactions List -->
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
            <div v-for="txn in recentTransactions" :key="txn.id" class="transaction-item">
              <div class="txn-left">
                <div class="txn-icon" :class="txn.type.toLowerCase()">
                  <v-icon size="16">{{ txn.type === 'CREDIT' ? 'mdi-plus' : 'mdi-minus' }}</v-icon>
                </div>
                <div class="txn-content">
                  <span class="txn-description">{{ txn.description || 'Transaction' }}</span>
                  <span class="txn-date">{{ formatDateTime(txn.createdAt) }}</span>
                </div>
              </div>
              <div class="txn-amount" :class="txn.type.toLowerCase()">
                {{ txn.type === 'CREDIT' ? '+' : '-' }}₹{{ formatCurrency(parseFloat(txn.amount)) }}
              </div>
            </div>
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
            <input v-model.number="depositAmount" type="number" min="1" placeholder="Enter amount" class="form-input" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <input v-model="depositDescription" type="text" placeholder="Optional description" class="form-input" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDepositModal = false">Cancel</button>
          <button class="btn-primary" @click="handleDeposit"
            :disabled="!depositAmount || depositAmount <= 0 || depositProcessing">
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
            <input v-model.number="withdrawAmount" type="number" min="1" :max="parseFloat(wallet.balance)"
              placeholder="Enter amount" class="form-input" />
            <span class="form-hint">Available: ₹{{ formatCurrency(parseFloat(wallet.balance)) }}</span>
          </div>
          <div class="form-group">
            <label>Description</label>
            <input v-model="withdrawDescription" type="text" placeholder="Optional description" class="form-input" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showWithdrawModal = false">Cancel</button>
          <button class="btn-primary" @click="handleWithdraw"
            :disabled="!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > parseFloat(wallet.balance) || withdrawProcessing">
            <span v-if="!withdrawProcessing">Withdraw</span>
            <span v-else>Processing...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
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
definePageMeta({
  layout: "walletservicelayer",
  middleware: "auth",
});

import { ref, computed, onMounted } from "vue";
import { useWalletApi } from "@/composables/apis/useWalletApi";

useHead({
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
      defer: true,
    },
  ],
});

// ════════════════════════════════════════════════════════════════
// API
// ════════════════════════════════════════════════════════════════

const {
  walletData,
  loading: walletLoading,
  error: walletError,
  fetchWallet,
  addMoney,
  debitMoney,
} = useWalletApi();

const wallet = walletData;

// ════════════════════════════════════════════════════════════════
// STATIC / UI DATA  (cards are UI-only; balance card is live)
// ════════════════════════════════════════════════════════════════

const selectedCard = ref(0);
const moneyChart = ref(null);
let chartInstance = null;

const today = new Date().toLocaleDateString("en-IN", {
  day: "numeric", month: "long", year: "numeric",
});

const cards = [
  { customer_name: "Arun", last4: "9568", network: "VISA", cardClass: "cv-blue", expiry: "12/26", balance: "₹14,200.00" },
  { customer_name: "Vijay", last4: "5641", network: "VISA", cardClass: "cv-dark", expiry: "12/27", balance: "₹12,302.50" },
  { customer_name: "Swathi", last4: "9007", network: "MC", cardClass: "cv-teal", expiry: "03/26", balance: "₹4,890.00" },
];

const quickLinks = [
  { label: "Deposit",      icon: "mdi-plus-circle-outline"      },
  { label: "Send",         icon: "mdi-send-outline"             },
  { label: "Invoice",      icon: "mdi-file-document-outline"    },
  { label: "Transactions", icon: "mdi-swap-horizontal"          },
  { label: "Cards",        icon: "mdi-credit-card-outline"      },
];

const activeCard = computed(() => cards[selectedCard.value]);

function selectCard(idx) { selectedCard.value = idx; }

function handleQuickLink(link) {
  if (link.label === "Deposit") showDepositModal.value = true;
  if (link.label === "Transactions") navigateTo("/wallet-service/transactions");
  if (link.label === "Cards") navigateTo("/wallet-service/card-enquiries");
}


const showDepositModal = ref(false);
const showWithdrawModal = ref(false);
const depositAmount = ref(null);
const depositDescription = ref("");
const withdrawAmount = ref(null);
const withdrawDescription = ref("");
const depositProcessing = ref(false);
const withdrawProcessing = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

// ════════════════════════════════════════════════════════════════
// COMPUTED (live from API ledger)
// ════════════════════════════════════════════════════════════════

const totalCredits = computed(() =>
  wallet.ledger
    .filter(t => t.type === "CREDIT")
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0)
);

const totalDebits = computed(() =>
  wallet.ledger
    .filter(t => t.type === "DEBIT")
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0)
);

const recentTransactions = computed(() => wallet.ledger.slice(0, 5));

const transactionsByDay = computed(() => {
  const map = {};
  wallet.ledger.forEach(txn => {
    const d = new Date(txn.createdAt).toLocaleDateString("en-IN");
    if (!map[d]) map[d] = { credits: 0, debits: 0 };
    txn.type === "CREDIT"
      ? (map[d].credits += parseFloat(txn.amount || 0))
      : (map[d].debits += parseFloat(txn.amount || 0));
  });
  return Object.entries(map).map(([date, data]) => ({ date, ...data }));
});

// ════════════════════════════════════════════════════════════════
// UTILS
// ════════════════════════════════════════════════════════════════

const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

const formatDateTime = (s) => {
  if (!s) return "N/A";
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
};

const showToast = (msg, type = "success") => {
  toastMessage.value = msg;
  toastType.value = type;
  setTimeout(() => { toastMessage.value = ""; }, 4000);
};

// ════════════════════════════════════════════════════════════════
// API OPERATIONS
// ════════════════════════════════════════════════════════════════

const loadWalletData = async () => {
  try {
    await fetchWallet("profile");
    initChart();
  } catch {
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
    await addMoney(depositAmount.value, depositDescription.value || "Wallet Top-up", "profile");
    showToast(`₹${formatCurrency(depositAmount.value)} added successfully!`);
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
    await debitMoney(withdrawAmount.value, withdrawDescription.value || "Wallet Withdrawal", "WALLET", "ALL", "profile");
    showToast(`₹${formatCurrency(withdrawAmount.value)} withdrawn successfully!`);
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
// CHART  (money-flow line chart — same style as first design)
// ════════════════════════════════════════════════════════════════

const initChart = () => {
  const tryInit = () => {
    if (!moneyChart.value || typeof window.Chart === "undefined") {
      setTimeout(tryInit, 100);
      return;
    }

    // Destroy previous instance to avoid canvas reuse error
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

    const chartData = transactionsByDay.value;
    const labels = chartData.map(d => d.date);
    const creditData = chartData.map(d => d.credits);
    const debitData = chartData.map(d => d.debits);

    // Fallback to static demo data when ledger is empty
    const useDemo = labels.length === 0;
    const demoLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const demoCredit = [12000, 15000, 13500, 18000, 16000, 19000, 17500, 21000, 18500, 20000, 22000, 19500];
    const demoDebit = [8000, 9500, 10000, 11000, 9000, 12000, 11500, 13000, 10000, 11500, 13500, 12000];

    const ctx = moneyChart.value.getContext("2d");
    chartInstance = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: useDemo ? demoLabels : labels,
        datasets: [
          {
            label: "Credits",
            data: useDemo ? demoCredit : creditData,
            borderColor: "#1a6fc4",
            backgroundColor: "rgba(26,111,196,0.08)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true,
          },
          {
            label: "Debits",
            data: useDemo ? demoDebit : debitData,
            borderColor: "#b4b2a9",
            backgroundColor: "rgba(180,178,169,0.06)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => " ₹" + formatCurrency(c.parsed.y),
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: { color: "#aaa8a0", font: { size: 11 } },
          },
          y: {
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: {
              color: "#aaa8a0",
              font: { size: 11 },
              callback: v => "₹" + (v / 1000).toFixed(0) + "k",
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
  font-family: "Inter", sans-serif;
}

/* ── Layout ── */
.outer-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  align-items: start;
}

@media (max-width: 960px) {
  .outer-grid {
    grid-template-columns: 1fr;
  }
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Panel ── */
.panel {
  background: #fff;
  border: 1px solid #eceae3;
  border-radius: 16px;
  padding: 20px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.panel:hover {
  border-color: #dbd7cc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
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
}

.field-label {
  font-size: 11px;
  color: #888780;
  display: block;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* ── Balance Card ── */
.balance-card {
  background: linear-gradient(135deg, #f7f6f3 0%, #ede8dd 100%);
  border: 1px solid #dbd7cc;
}

.balance-big {
  font-size: 34px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
}

.balance-currency {
  font-size: 14px;
  font-weight: 400;
  color: #888780;
}

.balance-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.balance-date {
  font-size: 12px;
  color: #888780;
}

.balance-actions {
  display: flex;
  gap: 10px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  padding: 3px 8px;
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

.withdraw-btn,
.deposit-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 50px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
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

/* ── Wallet status badge (inside cards panel header) ── */
.wallet-status-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.wallet-status-badge.active {
  background: #eaf3de;
  color: #3b6d11;
}

.wallet-status-badge.inactive {
  background: #fcebeb;
  color: #a32d2d;
}

/* ── Card Visual ── */
.cards-panel {
  padding: 20px;
}

.card-visual {
  position: relative;
  border-radius: 16px;
  padding: 18px 20px;
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 14px;
  transition: all 0.3s ease;
}

.cv-blue {
  background: linear-gradient(135deg, #1a6fc4 0%, #1557a0 100%);
}

.cv-dark {
  background: linear-gradient(135deg, #2c2c2a 0%, #1a1a18 100%);
}

.cv-teal {
  background: linear-gradient(135deg, #0f6e56 0%, #085041 100%);
}

.card-bg-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cv-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.cv-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.cv-network {
  font-size: 18px;
  font-weight: 800;
  font-style: italic;
  letter-spacing: 1px;
}

.visa-text {
  color: rgba(255, 255, 255, 0.95);
}

.mc-text {
  color: #f5a623;
}

.cv-balance {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  position: relative;
  z-index: 1;
}

.cv-chip {
  position: relative;
  z-index: 1;
}

.cv-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  z-index: 1;
}

.cv-number {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 2px;
  font-family: "Courier New", monospace;
}

.cv-expiry {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

/* ── Card Switcher ── */
.card-switcher {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

.card-switch-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.card-switch-item:hover {
  background: #f5f5f3;
}

.card-switch-item.active {
  background: #eef5fd;
  border-color: #c2d9f0;
}

.cs-chip {
  width: 34px;
  height: 22px;
  border-radius: 5px;
  flex-shrink: 0;
}

.cs-chip.cv-blue {
  background: linear-gradient(135deg, #1a6fc4, #1557a0);
}

.cs-chip.cv-dark {
  background: linear-gradient(135deg, #2c2c2a, #1a1a18);
}

.cs-chip.cv-teal {
  background: linear-gradient(135deg, #0f6e56, #085041);
}

.cs-info {
  flex: 1;
}

.cs-label {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
  display: block;
}

.cs-num {
  font-size: 11px;
  color: #888780;
  letter-spacing: 1px;
}

.cs-balance {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}

.apply-btn {
  width: 100%;
  padding: 11px;
  border-radius: 10px;
  border: 1px solid #e0dfd8;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.15s;
}

.apply-btn:hover {
  background: #f5f5f3;
}

/* ── Quick Links ── */
.quick-panel {
  padding: 20px;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.quick-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px;
  border-radius: 10px;
  border: 1px solid #eceae3;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  color: #555552;
  transition: background 0.15s;
}

.quick-btn:hover {
  background: #f5f5f3;
}

.quick-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #d6e8f8;
  background: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a6fc4;
}

/* ── Stats Row ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  background: #fff;
  border: 1px solid #eceae3;
  border-radius: 14px;
  padding: 16px 18px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-amount {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.dots-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #888780;
  padding: 2px 4px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.dots-btn:hover {
  background: #f5f5f3;
}

/* ── Chart ── */
.chart-panel {
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #888780;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.month-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 5px 12px;
  border-radius: 8px;
  border: none;
  background: #1a6fc4;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.month-btn:hover {
  background: #155da0;
}

.chart-wrap {
  position: relative;
  height: 180px;
}

/* ── Transactions ── */
.transactions-panel {}

.view-all-link {
  font-size: 12px;
  color: #1a6fc4;
  text-decoration: none;
  font-weight: 500;
}

.view-all-link:hover {
  color: #155da0;
}

.transactions-list {
  display: flex;
  flex-direction: column;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0ede8;
  transition: background 0.15s;
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

/* ── Empty state ── */
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

/* ── Modals ── */
.modal-overlay {
  position: fixed;
  inset: 0;
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
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

/* ── Toast ── */
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
  z-index: 1999;
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

.toast.error {
  border-color: #f5ccc8;
  background: #fef5f4;
  color: #a32d2d;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  padding: 2px;
  display: flex;
  align-items: center;
  margin-left: auto;
}

/* ── Skeleton ── */
.skeleton-loader {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
}

@media (max-width: 960px) {
  .skeleton-loader {
    grid-template-columns: 1fr;
  }
}

.skeleton-left,
.skeleton-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-card {
  background: linear-gradient(90deg, #f0ede8 0%, #e5e0d7 50%, #f0ede8 100%);
  background-size: 200% 100%;
  border-radius: 16px;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.sk-balance {
  height: 160px;
}

.sk-cards {
  height: 360px;
}

.sk-quick {
  height: 100px;
}

.sk-stats {
  height: 80px;
}

.sk-chart {
  height: 220px;
}

/* ── Error ── */
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
}
</style>