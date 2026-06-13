<template>
  <div class="txn-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-wrap">
        <router-link to="/wallet-service" class="back-btn">
          <v-icon size="18">mdi-arrow-left</v-icon>
        </router-link>
        <div>
          <h1 class="page-title">Transactions</h1>
          <p class="page-sub">All wallet ledger entries</p>
        </div>
      </div>
      <button class="export-btn" @click="handleExport">
        <v-icon size="16" class="mr-1">mdi-download-outline</v-icon>
        Export CSV
      </button>
    </div>

    <!-- ── Filters Bar ── -->
    <div class="filters-bar">
      <!-- Search -->
      <div class="search-wrap">
        <v-icon size="16" class="search-icon">mdi-magnify</v-icon>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search description…"
          class="search-input"
          @input="debouncedFetch"
        />
        <button v-if="filters.search" class="search-clear" @click="filters.search = ''; doFetch()">
          <v-icon size="14">mdi-close</v-icon>
        </button>
      </div>

      <!-- Type filter -->
      <div class="filter-tabs">
        <button
          v-for="t in typeOptions"
          :key="t.value"
          class="filter-tab"
          :class="{ active: filters.type === t.value }"
          @click="filters.type = t.value; doFetch()"
        >
          <span v-if="t.dot" class="tab-dot" :class="t.dotClass"></span>
          {{ t.label }}
        </button>
      </div>

      <!-- Date range -->
      <div class="date-range">
        <div class="date-input-wrap">
          <v-icon size="14" class="date-icon">mdi-calendar-start</v-icon>
          <input v-model="filters.from" type="date" class="date-input" @change="doFetch" />
        </div>
        <span class="date-sep">–</span>
        <div class="date-input-wrap">
          <v-icon size="14" class="date-icon">mdi-calendar-end</v-icon>
          <input v-model="filters.to" type="date" class="date-input" @change="doFetch" />
        </div>
        <button v-if="filters.from || filters.to" class="clear-dates" @click="filters.from = ''; filters.to = ''; doFetch()">
          <v-icon size="14">mdi-close-circle-outline</v-icon>
        </button>
      </div>

      <!-- Items per page -->
      <div class="per-page-wrap">
        <label class="per-page-label">Rows</label>
        <select v-model.number="filters.limit" class="per-page-select" @change="filters.page = 1; doFetch()">
          <option v-for="n in limitOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- ── Summary chips ── -->
    <div class="summary-row" v-if="!txnLoading && txnList.length">
      <div class="summary-chip">
        <span class="sc-label">Showing</span>
        <span class="sc-value">{{ txnList.length }} of {{ pagination.total }}</span>
      </div>
      <div class="summary-chip credit">
        <v-icon size="12">mdi-arrow-down-circle</v-icon>
        <span class="sc-label">Credits</span>
        <span class="sc-value">₹{{ formatCurrency(pageCredits) }}</span>
      </div>
      <div class="summary-chip debit">
        <v-icon size="12">mdi-arrow-up-circle</v-icon>
        <span class="sc-label">Debits</span>
        <span class="sc-value">₹{{ formatCurrency(pageDebits) }}</span>
      </div>
    </div>

    <!-- ── Table ── -->
    <div class="panel table-panel">

      <!-- Loading skeleton -->
      <div v-if="txnLoading" class="skeleton-rows">
        <div v-for="i in filters.limit" :key="i" class="skeleton-row">
          <div class="sk sk-icon"></div>
          <div class="sk sk-desc"></div>
          <div class="sk sk-badge"></div>
          <div class="sk sk-date"></div>
          <div class="sk sk-amount"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="txnError" class="empty-state error-state">
        <v-icon size="40" color="#ba1a1a">mdi-alert-circle-outline</v-icon>
        <p>{{ txnError }}</p>
        <button class="retry-btn" @click="doFetch">
          <v-icon size="14">mdi-refresh</v-icon> Retry
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="!txnList.length" class="empty-state">
        <v-icon size="48" color="#d0ccc0">mdi-swap-horizontal</v-icon>
        <p>No transactions found</p>
        <span v-if="hasActiveFilters" class="empty-hint">
          Try clearing your filters
        </span>
      </div>

      <!-- Table content -->
      <template v-else>
        <div class="table-wrap">
          <table class="txn-table">
            <thead>
              <tr>
                <th class="th-type">Type</th>
                <th class="th-desc">Description</th>
                <th class="th-status">Status</th>
                <th class="th-date">Date & Time</th>
                <th class="th-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="txn in txnList"
                :key="txn.id"
                class="txn-row"
                :class="txn.type.toLowerCase()"
              >
                <!-- Type icon -->
                <td class="td-type">
                  <div class="type-badge" :class="txn.type.toLowerCase()">
                    <v-icon size="14">
                      {{ txn.type === 'CREDIT' ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
                    </v-icon>
                    <span>{{ txn.type }}</span>
                  </div>
                </td>

                <!-- Description -->
                <td class="td-desc">
                  <span class="desc-text">{{ txn.description || '—' }}</span>
                  <span class="txn-id">{{ txn.id.slice(0, 8) }}…</span>
                </td>

                <!-- Status -->
                <td class="td-status">
                  <span class="status-pill" :class="statusClass(txn.txn?.status)">
                    {{ txn.txn?.status || 'N/A' }}
                  </span>
                </td>

                <!-- Date -->
                <td class="td-date">
                  <span class="date-main">{{ formatDate(txn.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(txn.createdAt) }}</span>
                </td>

                <!-- Amount -->
                <td class="td-amount" :class="txn.type.toLowerCase()">
                  <span class="amount-sign">{{ txn.type === 'CREDIT' ? '+' : '−' }}</span>
                  ₹{{ formatCurrency(parseFloat(txn.amount)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ── Pagination ── -->
        <div class="pagination-bar">
          <span class="pag-info">
            Page <strong>{{ pagination.page }}</strong> of <strong>{{ pagination.totalPages }}</strong>
            &nbsp;·&nbsp; {{ pagination.total }} total
          </span>

          <div class="pag-controls">
            <!-- First -->
            <button
              class="pag-btn"
              :disabled="!pagination.hasPrev"
              @click="goTo(1)"
              title="First page"
            >
              <v-icon size="16">mdi-page-first</v-icon>
            </button>

            <!-- Prev -->
            <button
              class="pag-btn"
              :disabled="!pagination.hasPrev"
              @click="goTo(pagination.page - 1)"
              title="Previous"
            >
              <v-icon size="16">mdi-chevron-left</v-icon>
            </button>

            <!-- Page numbers -->
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="pag-ellipsis">…</span>
              <button
                v-else
                class="pag-btn pag-num"
                :class="{ current: p === pagination.page }"
                @click="goTo(p)"
              >
                {{ p }}
              </button>
            </template>

            <!-- Next -->
            <button
              class="pag-btn"
              :disabled="!pagination.hasNext"
              @click="goTo(pagination.page + 1)"
              title="Next"
            >
              <v-icon size="16">mdi-chevron-right</v-icon>
            </button>

            <!-- Last -->
            <button
              class="pag-btn"
              :disabled="!pagination.hasNext"
              @click="goTo(pagination.totalPages)"
              title="Last page"
            >
              <v-icon size="16">mdi-page-last</v-icon>
            </button>
          </div>

          <!-- Jump to page -->
          <div class="pag-jump">
            <span class="pag-jump-label">Go to</span>
            <input
              v-model.number="jumpPage"
              type="number"
              min="1"
              :max="pagination.totalPages"
              class="pag-jump-input"
              @keyup.enter="goTo(jumpPage)"
            />
            <button class="pag-jump-btn" @click="goTo(jumpPage)">Go</button>
          </div>
        </div>
      </template>
    </div>

    <!-- Toast -->
    <div v-if="toastMsg" class="toast" :class="toastType">
      <v-icon size="16">{{ toastType === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      <span>{{ toastMsg }}</span>
      <button class="toast-close" @click="toastMsg = ''">
        <v-icon size="14">mdi-close</v-icon>
      </button>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: "walletservicelayer",
  middleware: "auth",
});

import { ref, reactive, computed, onMounted } from "vue";
import { useWalletApi } from "@/composables/apis/useWalletApi";

const { txnList, txnPagination, txnLoading, txnError, fetchTransactions } = useWalletApi();

const pagination = txnPagination;

// ── Filter state ───────────────────────────────────────────────
const filters = reactive({
  page:   1,
  limit:  10,
  type:   "",
  from:   "",
  to:     "",
  search: "",
});

const limitOptions = [5, 10, 25, 50, 100];
const typeOptions  = [
  { label: "All",    value: "",       dot: false },
  { label: "Credit", value: "CREDIT", dot: true, dotClass: "dot-credit" },
  { label: "Debit",  value: "DEBIT",  dot: true, dotClass: "dot-debit"  },
];

const jumpPage = ref(1);
const toastMsg  = ref("");
const toastType = ref("success");

// ── Computed ───────────────────────────────────────────────────
const hasActiveFilters = computed(
  () => filters.type || filters.from || filters.to || filters.search
);

const pageCredits = computed(() =>
  txnList.value
    .filter(t => t.type === "CREDIT")
    .reduce((s, t) => s + parseFloat(t.amount), 0)
);

const pageDebits = computed(() =>
  txnList.value
    .filter(t => t.type === "DEBIT")
    .reduce((s, t) => s + parseFloat(t.amount), 0)
);

// Smart page window: first, ..., [cur-1, cur, cur+1], ..., last
const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const cur   = pagination.value.page;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  pages.push(1);
  if (cur > 3) pages.push("...");

  const start = Math.max(2, cur - 1);
  const end   = Math.min(total - 1, cur + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (cur < total - 2) pages.push("...");
  pages.push(total);
  return pages;
});

// ── Fetch helpers ──────────────────────────────────────────────
const doFetch = async () => {
  jumpPage.value = filters.page;
  try {
    await fetchTransactions({
      page:   filters.page,
      limit:  filters.limit,
      type:   filters.type || undefined,
      from:   filters.from || undefined,
      to:     filters.to   || undefined,
      search: filters.search || undefined,
    });
  } catch {
    showToast("Failed to load transactions", "error");
  }
};

let debounceTimer = null;
const debouncedFetch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    filters.page = 1;
    doFetch();
  }, 400);
};

const goTo = (p) => {
  const clamped = Math.max(1, Math.min(p, pagination.value.totalPages));
  filters.page = clamped;
  doFetch();
};

// ── Utils ──────────────────────────────────────────────────────
const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v || 0);

const formatDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }) : "—";

const formatTime = (s) =>
  s ? new Date(s).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  }) : "";

const statusClass = (s) => ({
  "pill-success": s === "SUCCESS",
  "pill-pending": s === "PENDING",
  "pill-failed":  s === "FAILED",
});

const showToast = (msg, type = "success") => {
  toastMsg.value  = msg;
  toastType.value = type;
  setTimeout(() => { toastMsg.value = ""; }, 4000);
};

// ── Export CSV ─────────────────────────────────────────────────
const handleExport = () => {
  if (!txnList.value.length) {
    showToast("No data to export", "error");
    return;
  }
  const headers = ["ID", "Type", "Description", "Amount", "Status", "Date"];
  const rows = txnList.value.map(t => [
    t.id,
    t.type,
    `"${(t.description || "").replace(/"/g, '""')}"`,
    t.amount,
    t.txn?.status || "",
    new Date(t.createdAt).toISOString(),
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `transactions-page-${filters.page}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported successfully");
};

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(() => doFetch());
</script>

<style scoped>
* { box-sizing: border-box; }

.txn-page {
  padding: 24px;
  background: #f7f6f3;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.back-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #eceae3;
  display: flex; align-items: center; justify-content: center;
  color: #1a1a1a;
  text-decoration: none;
  transition: background .15s;
}
.back-btn:hover { background: #f0ede8; }

.page-title {
  margin: 0;
  font-size: 20px; font-weight: 700; color: #1a1a1a;
}
.page-sub {
  margin: 2px 0 0;
  font-size: 12px; color: #888780;
}

.export-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 9px 18px;
  border-radius: 50px;
  border: 1px solid #dbd7cc;
  background: #fff;
  font-size: 13px; font-weight: 500; color: #1a1a1a;
  cursor: pointer;
  transition: background .15s;
}
.export-btn:hover { background: #f5f5f3; }

/* ── Filters Bar ── */
.filters-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  background: #fff;
  border: 1px solid #eceae3;
  border-radius: 14px;
  padding: 14px 16px;
}

/* Search */
.search-wrap {
  position: relative;
  display: flex; align-items: center;
  flex: 1; min-width: 180px;
}
.search-icon { position: absolute; left: 10px; color: #888780; pointer-events: none; }
.search-input {
  width: 100%;
  padding: 8px 30px 8px 32px;
  border: 1px solid #e0dcd8;
  border-radius: 8px;
  font-size: 13px; font-family: inherit;
  background: #faf9f7;
  outline: none;
  transition: border .2s;
}
.search-input:focus { border-color: #1a6fc4; background: #fff; }
.search-clear {
  position: absolute; right: 8px;
  background: none; border: none; cursor: pointer;
  color: #888780; display: flex; padding: 2px;
}

/* Type tabs */
.filter-tabs { display: flex; gap: 4px; }
.filter-tab {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px;
  border: 1px solid #e0dcd8;
  border-radius: 20px;
  background: #fff;
  font-size: 12px; font-weight: 500; color: #555552;
  cursor: pointer;
  transition: all .15s;
}
.filter-tab:hover { background: #f5f5f3; }
.filter-tab.active { background: #1a6fc4; color: #fff; border-color: #1a6fc4; }

.tab-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  display: inline-block;
}
.dot-credit { background: #3b6d11; }
.dot-debit  { background: #ba1a1a; }
.filter-tab.active .tab-dot { opacity: .85; }

/* Date range */
.date-range {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
}
.date-input-wrap {
  position: relative; display: flex; align-items: center;
}
.date-icon { position: absolute; left: 8px; color: #888780; pointer-events: none; }
.date-input {
  padding: 7px 10px 7px 26px;
  border: 1px solid #e0dcd8;
  border-radius: 8px;
  font-size: 12px; font-family: inherit;
  background: #faf9f7; outline: none;
  color: #1a1a1a;
  transition: border .2s;
}
.date-input:focus { border-color: #1a6fc4; background: #fff; }
.date-sep { font-size: 13px; color: #888780; }
.clear-dates {
  background: none; border: none; cursor: pointer;
  color: #888780; display: flex; padding: 3px;
}

/* Per page */
.per-page-wrap { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.per-page-label { font-size: 12px; color: #888780; }
.per-page-select {
  padding: 7px 10px;
  border: 1px solid #e0dcd8;
  border-radius: 8px;
  font-size: 12px; font-family: inherit;
  background: #faf9f7; outline: none; cursor: pointer;
}

/* ── Summary chips ── */
.summary-row {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.summary-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #eceae3;
  font-size: 12px;
}
.sc-label { color: #888780; }
.sc-value { font-weight: 600; color: #1a1a1a; }
.summary-chip.credit { background: #eaf3de; border-color: #c2e0a0; color: #3b6d11; }
.summary-chip.credit .sc-value { color: #2a5e11; }
.summary-chip.debit  { background: #fcebeb; border-color: #f5ccc8; color: #a32d2d; }
.summary-chip.debit  .sc-value { color: #a32d2d; }

/* ── Panel ── */
.panel {
  background: #fff;
  border: 1px solid #eceae3;
  border-radius: 16px;
  overflow: hidden;
}

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.txn-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.txn-table thead tr {
  background: #faf9f7;
  border-bottom: 1px solid #eceae3;
}
.txn-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: #888780;
  text-transform: uppercase;
  letter-spacing: .4px;
  white-space: nowrap;
}
.th-amount { text-align: right; }

.txn-row {
  border-bottom: 1px solid #f0ede8;
  transition: background .12s;
}
.txn-row:last-child { border-bottom: none; }
.txn-row:hover { background: #faf9f7; }

.txn-table td { padding: 12px 16px; vertical-align: middle; }

/* Type badge */
.type-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px; font-weight: 600;
  white-space: nowrap;
}
.type-badge.credit { background: #eaf3de; color: #3b6d11; }
.type-badge.debit  { background: #fcebeb; color: #a32d2d; }

/* Description */
.td-desc { max-width: 260px; }
.desc-text {
  display: block;
  font-weight: 500; color: #1a1a1a;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.txn-id {
  display: block;
  font-size: 11px; color: #aaa8a0;
  margin-top: 2px;
  font-family: "Courier New", monospace;
}

/* Status pill */
.status-pill {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px; font-weight: 600;
  white-space: nowrap;
}
.pill-success { background: #eaf3de; color: #3b6d11; }
.pill-pending { background: #fff8e0; color: #7a5c00; }
.pill-failed  { background: #fcebeb; color: #a32d2d; }

/* Date */
.td-date { white-space: nowrap; }
.date-main { display: block; font-weight: 500; color: #1a1a1a; font-size: 13px; }
.date-time { display: block; font-size: 11px; color: #888780; margin-top: 2px; }

/* Amount */
.td-amount {
  text-align: right;
  font-size: 14px; font-weight: 700;
  white-space: nowrap;
}
.td-amount.credit { color: #3b6d11; }
.td-amount.debit  { color: #ba1a1a; }
.amount-sign { margin-right: 1px; }

/* ── Pagination bar ── */
.pagination-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid #eceae3;
  background: #faf9f7;
}

.pag-info {
  font-size: 12px; color: #888780;
  white-space: nowrap;
}
.pag-info strong { color: #1a1a1a; }

.pag-controls {
  display: flex; align-items: center; gap: 4px;
  margin-left: auto;
}

.pag-btn {
  min-width: 32px; height: 32px;
  border: 1px solid #e0dcd8;
  border-radius: 8px;
  background: #fff;
  color: #1a1a1a;
  font-size: 12px; font-weight: 500;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  padding: 0 6px;
  transition: all .15s;
}
.pag-btn:hover:not(:disabled) { background: #f0ede8; border-color: #d0ccc0; }
.pag-btn:disabled { opacity: .35; cursor: default; }
.pag-btn.current {
  background: #1a6fc4; color: #fff;
  border-color: #1a6fc4;
  font-weight: 700;
}

.pag-ellipsis {
  padding: 0 4px;
  font-size: 14px; color: #888780;
  line-height: 32px;
}

/* Jump to page */
.pag-jump {
  display: flex; align-items: center; gap: 6px;
}
.pag-jump-label { font-size: 12px; color: #888780; white-space: nowrap; }
.pag-jump-input {
  width: 50px;
  padding: 6px 8px;
  border: 1px solid #e0dcd8;
  border-radius: 8px;
  font-size: 12px; font-family: inherit;
  text-align: center; outline: none;
  background: #fff;
}
.pag-jump-input:focus { border-color: #1a6fc4; }
.pag-jump-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: #1a6fc4; color: #fff;
  font-size: 12px; font-weight: 600;
  cursor: pointer;
  transition: background .15s;
}
.pag-jump-btn:hover { background: #155da0; }

/* ── Skeleton ── */
.skeleton-rows { padding: 8px 0; }
.skeleton-row {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid #f0ede8;
}
.skeleton-row:last-child { border-bottom: none; }
.sk {
  background: linear-gradient(90deg, #f0ede8 0%, #e5e0d7 50%, #f0ede8 100%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.8s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.sk-icon  { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
.sk-desc  { flex: 1; height: 14px; }
.sk-badge { width: 60px; height: 22px; border-radius: 20px; }
.sk-date  { width: 90px; height: 14px; }
.sk-amount{ width: 70px; height: 16px; }

/* ── Empty / Error ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px;
  padding: 60px 20px;
  color: #d0ccc0;
}
.empty-state p { font-size: 14px; color: #888780; margin: 0; }
.empty-hint { font-size: 12px; color: #aaa8a0; }
.error-state { color: #ba1a1a; }

.retry-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 9px 18px;
  border: none; border-radius: 50px;
  background: #ba1a1a; color: #fff;
  font-size: 13px; font-weight: 600;
  cursor: pointer;
}
.retry-btn:hover { background: #9e1515; }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 20px; right: 20px;
  background: #fff;
  border: 1px solid #dbd7cc;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex; align-items: center; gap: 10px;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  z-index: 1999; max-width: 340px;
  animation: slideIn .3s ease;
}
@keyframes slideIn {
  from { transform: translateX(400px); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}
.toast.success { border-color: #b7e4c3; background: #f1fdf6; color: #2a5e3f; }
.toast.error   { border-color: #f5ccc8; background: #fef5f4; color: #a32d2d; }
.toast-close {
  background: none; border: none; cursor: pointer;
  color: inherit; padding: 2px; display: flex; margin-left: auto;
}

@media (max-width: 700px) {
  .filters-bar { flex-direction: column; align-items: stretch; }
  .per-page-wrap { margin-left: 0; }
  .pag-controls { margin-left: 0; }
  .pagination-bar { justify-content: center; }
}
</style>