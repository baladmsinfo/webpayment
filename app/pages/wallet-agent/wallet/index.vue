<template>
  <div class="wallet-page">

    <!-- Top Bar -->
    <div class="top-bar">
      <span class="page-title">My Wallet</span>
    </div>

    <!-- Outer two-column layout -->
    <div class="outer-grid">

      <!-- ═══ LEFT COLUMN ═══ -->
      <div class="left-col">

        <!-- Total Balance Card (WALLET balance — fixed, not card balance) -->
        <div class="panel balance-card">
          <div class="field-label">Total Balance</div>
          <div class="balance-big">
            {{ walletBalance }}
            <span class="balance-currency">INR</span>
          </div>
          <div class="balance-meta">
            <span class="balance-date">{{ today }}</span>
            <span class="badge badge-green">
              <v-icon size="12">mdi-trending-up</v-icon>
              +2.05%
            </span>
          </div>
          <button class="withdraw-btn">
            <v-icon size="14" class="mr-1">mdi-cash-minus</v-icon>
            Withdraw All Earning
          </button>
        </div>

        <!-- My Cards -->
        <div class="panel cards-panel">
          <div class="panel-header">
            <span class="panel-title">My Cards</span>
          </div>

          <!-- Active Card Visual -->
          <div class="card-visual" :class="activeCard.cardClass">
            <!-- Decorative background shapes -->
            <svg class="card-bg-svg" viewBox="0 0 300 170" xmlns="http://www.w3.org/2000/svg">
              <circle cx="240" cy="-10" r="100" fill="rgba(255,255,255,0.07)" />
              <circle cx="280" cy="110" r="75" fill="rgba(255,255,255,0.05)" />
              <circle cx="30"  cy="150" r="80" fill="rgba(255,255,255,0.04)" />
              <circle cx="-20" cy="40"  r="60" fill="rgba(255,255,255,0.04)" />
            </svg>

            <!-- Top row: label + network -->
            <div class="cv-top">
              <span class="cv-label">Current Balance</span>
              <span class="cv-network" :class="activeCard.network === 'VISA' ? 'visa-text' : 'mc-text'">
                {{ activeCard.network }}
              </span>
            </div>

            <!-- Balance -->
            <div class="cv-balance">{{ activeCard.balance }}</div>

            <!-- Chip icon -->
            <div class="cv-chip">
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                <rect x="0" y="0" width="32" height="24" rx="4" fill="rgba(255,220,100,0.85)" />
                <line x1="0" y1="8" x2="32" y2="8" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
                <line x1="0" y1="16" x2="32" y2="16" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
                <line x1="11" y1="0" x2="11" y2="24" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
                <line x1="21" y1="0" x2="21" y2="24" stroke="rgba(180,140,0,0.4)" stroke-width="1" />
              </svg>
            </div>

            <!-- Bottom row: number + expiry -->
            <div class="cv-bottom">
              <span class="cv-number">5294 2436 4780 {{ activeCard.last4 }}</span>
              <span class="cv-expiry">{{ activeCard.expiry }}</span>
            </div>
          </div>

          <!-- Card switcher list -->
          <div class="card-switcher">
            <div
              v-for="(card, idx) in cards"
              :key="idx"
              class="card-switch-item"
              :class="{ active: selectedCard === idx }"
              @click="selectCard(idx)"
            >
              <div class="cs-chip" :class="card.cardClass"></div>
              <div class="cs-info">
                <span class="cs-label">{{ card.label }}</span>
                <span class="cs-num">•••• {{ card.last4 }}</span>
              </div>
              <span class="cs-balance">{{ card.balance }}</span>
            </div>
          </div>

          <button class="apply-btn">
            <v-icon size="15" class="mr-1">mdi-credit-card-plus-outline</v-icon>
            Apply Card
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
            <button
              v-for="link in quickLinks"
              :key="link.label"
              class="quick-btn"
              @click="handleQuickLink(link)"
            >
              <div class="quick-icon-wrap">
                <v-icon size="20">{{ link.icon }}</v-icon>
              </div>
              <span>{{ link.label }}</span>
            </button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-card" v-for="stat in stats" :key="stat.label">
            <div class="stat-header">
              <span class="field-label">{{ stat.label }}</span>
              <button class="dots-btn">
                <v-icon size="16">mdi-dots-horizontal</v-icon>
              </button>
            </div>
            <div class="stat-value-row">
              <span class="stat-amount">{{ stat.amount }}</span>
              <span class="badge" :class="stat.positive ? 'badge-green' : 'badge-red'">
                {{ stat.change }}
              </span>
            </div>
          </div>
        </div>

        <!-- Money Flow Chart -->
        <div class="panel chart-panel">
          <div class="chart-header">
            <span class="panel-title">Money Flow</span>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-dot" style="background:#1a6fc4;"></span>Income
              </span>
              <span class="legend-item">
                <span class="legend-dot" style="background:#b4b2a9;"></span>Expenses
              </span>
              <button class="month-btn">
                This Month <v-icon size="14">mdi-chevron-down</v-icon>
              </button>
            </div>
          </div>
          <div class="chart-wrap">
            <canvas ref="moneyChart"></canvas>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "walletagentlayer",
  middleware: "auth",
});

import { ref, computed, onMounted } from "vue";

useHead({
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js",
      defer: true,
    },
  ],
});

const selectedCard = ref(0);
const moneyChart = ref(null);

const today = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// ── Wallet balance is SEPARATE from card balances ──
const walletBalance = "₹88,232.00";

const cards = [
  {
    label: "Personal",
    last4: "9568",
    network: "VISA",
    cardClass: "cv-blue",
    holder: "Kristin Watson",
    expiry: "12/26",
    balance: "₹14,200.00",
    change: "+2.5%",
    changePositive: true,
  },
  {
    label: "Business",
    last4: "5641",
    network: "VISA",
    cardClass: "cv-dark",
    holder: "James Miller",
    expiry: "12/27",
    balance: "₹12,302.50",
    change: "+1.1%",
    changePositive: true,
  },
  {
    label: "Savings",
    last4: "9007",
    network: "MC",
    cardClass: "cv-teal",
    holder: "Business Corp",
    expiry: "03/26",
    balance: "₹4,890.00",
    change: "-0.4%",
    changePositive: false,
  },
];

const stats = [
  { label: "Total Deposit", amount: "₹18,500.99", change: "+2.5%", positive: true },
  { label: "Total Payout",  amount: "₹11,200.56", change: "+8%",   positive: false },
];

const quickLinks = [
  { label: "Deposit",      icon: "mdi-plus-circle-outline"     },
  { label: "Send",         icon: "mdi-send-outline"            },
  { label: "Invoice",      icon: "mdi-file-document-outline"   },
  { label: "Transactions", icon: "mdi-swap-horizontal"         },
];

const activeCard = computed(() => cards[selectedCard.value]);

function selectCard(idx) {
  selectedCard.value = idx;
}

function handleQuickLink(link) {}

onMounted(() => {
  const tryInit = () => {
    if (!moneyChart.value || typeof window.Chart === "undefined") {
      setTimeout(tryInit, 100);
      return;
    }
    const ctx = moneyChart.value.getContext("2d");
    new window.Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets: [
          {
            label: "Income",
            data: [12000,15000,13500,18000,16000,19000,17500,21000,18500,20000,22000,19500],
            borderColor: "#1a6fc4",
            backgroundColor: "rgba(26,111,196,0.08)",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true,
          },
          {
            label: "Expenses",
            data: [8000,9500,10000,11000,9000,12000,11500,13000,10000,11500,13500,12000],
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
              label: (c) => " ₹" + c.parsed.y.toLocaleString("en-IN"),
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
              callback: (v) => "₹" + (v / 1000).toFixed(0) + "k",
            },
          },
        },
      },
    });
  };
  tryInit();
});
</script>

<style scoped>
* { box-sizing: border-box; }

.wallet-page {
  padding: 24px;
  background: #f7f6f3;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

/* ── Top Bar ── */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

/* ── Outer grid ── */
.outer-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 16px;
  align-items: start;
}

.left-col  { display: flex; flex-direction: column; gap: 16px; }
.right-col { display: flex; flex-direction: column; gap: 16px; }

/* ── Shared panel ── */
.panel {
  background: #ffffff;
  border: 1px solid #eceae3;
  border-radius: 16px;
  padding: 20px;
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
}

/* ── Total Balance Card ── */
.balance-card { padding: 20px; }

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
.balance-date { font-size: 12px; color: #888780; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 500;
}
.badge-green { background: #eaf3de; color: #3b6d11; }
.badge-red   { background: #fcebeb; color: #a32d2d; }

.withdraw-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border-radius: 50px;
  border: none;
  background: #1a6fc4;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.withdraw-btn:hover { background: #155da0; }

/* ── Cards Panel ── */
.cards-panel { padding: 20px; }

/* ── Card Visual ── */
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
.cv-blue { background: linear-gradient(135deg, #1a6fc4 0%, #1557a0 100%); }
.cv-dark { background: linear-gradient(135deg, #2c2c2a 0%, #1a1a18 100%); }
.cv-teal { background: linear-gradient(135deg, #0f6e56 0%, #085041 100%); }

.card-bg-svg {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

.cv-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}
.cv-label { font-size: 11px; color: rgba(255,255,255,0.6); }
.cv-network {
  font-size: 18px;
  font-weight: 800;
  font-style: italic;
  letter-spacing: 1px;
}
.visa-text { color: rgba(255,255,255,0.95); }
.mc-text   { color: #f5a623; }

.cv-balance {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

.cv-chip {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
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
  color: rgba(255,255,255,0.75);
  letter-spacing: 2px;
  font-family: "Courier New", monospace;
}
.cv-expiry { font-size: 12px; color: rgba(255,255,255,0.65); }

/* ── Card Switcher List ── */
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
.cs-chip.cv-blue { background: linear-gradient(135deg, #1a6fc4, #1557a0); }
.cs-chip.cv-dark { background: linear-gradient(135deg, #2c2c2a, #1a1a18); }
.cs-chip.cv-teal { background: linear-gradient(135deg, #0f6e56, #085041); }

.cs-info { flex: 1; }
.cs-label { font-size: 12px; font-weight: 500; color: #1a1a1a; display: block; }
.cs-num   { font-size: 11px; color: #888780; letter-spacing: 1px; }

.cs-balance {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
}

/* ── Apply Button ── */
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
.apply-btn:hover { background: #f5f5f3; }

/* ── Dots button ── */
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
.dots-btn:hover { background: #f5f5f3; }

/* ── Quick Links ── */
.quick-panel { padding: 20px; }

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
.quick-btn:hover { background: #f5f5f3; }

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
.stat-value-row { display: flex; align-items: baseline; gap: 8px; }
.stat-amount { font-size: 18px; font-weight: 600; color: #1a1a1a; }

/* ── Chart ── */
.chart-panel { padding: 20px; }

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
.legend-item { display: flex; align-items: center; gap: 5px; }
.legend-dot {
  width: 8px; height: 8px;
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
}
.chart-wrap { position: relative; height: 180px; }
</style>