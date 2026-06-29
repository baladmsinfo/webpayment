<template>
  <div class="history-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-wrap">
        <NuxtLink to="/vendor/dashboard" class="back-btn">
          <span class="mdi mdi-arrow-left"></span>
        </NuxtLink>
        <div>
          <h1 class="page-title">Account Details</h1>
          <p class="page-sub">All fund movements on your account</p>
        </div>
      </div>
      <button class="export-btn" @click="handleExport">
        <span class="mdi mdi-download-outline"></span>
        Export CSV
      </button>
    </div>

    <!-- ── Balance Strip ── -->
    <div class="balance-strip" v-if="!balanceLoading && balanceData.balance != null">
      <div class="bs-item">
        <span class="bs-label">Available Balance</span>
        <span class="bs-value">₹{{ formatCurrency(balanceData.balance) }}</span>
      </div>
      <div class="bs-sep"></div>
      <div class="bs-item" v-if="balanceData.settlementAccount">
        <span class="bs-label">Settlement Account</span>
        <span class="bs-value bs-value--sm">
          {{ balanceData.settlementAccount.bank_name }} ·
          {{ maskAccount(balanceData.settlementAccount.bank_account_no) }}
        </span>
      </div>
      <div class="bs-sep"></div>
      <div class="bs-item">
        <span class="bs-label">Total Records</span>
        <span class="bs-value">{{ pagination.total }}</span>
      </div>
    </div>

    <!-- ── Filters Bar ── -->
    <div class="filters-bar">
      <div class="search-wrap">
        <span class="mdi mdi-magnify search-icon"></span>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search description…"
          class="search-input"
          @input="debouncedFetch"
        />
        <button v-if="filters.search" class="search-clear" @click="filters.search = ''; doFetch()">
          <span class="mdi mdi-close"></span>
        </button>
      </div>

      <div class="filter-tabs">
        <button
          v-for="t in typeOptions"
          :key="t.value"
          class="filter-tab"
          :class="{ active: filters.type === t.value }"
          @click="filters.type = t.value; filters.page = 1; doFetch()"
        >
          <span v-if="t.dot" class="tab-dot" :class="t.dotClass"></span>
          {{ t.label }}
        </button>
      </div>

      <div class="date-range">
        <div class="date-input-wrap">
          <span class="mdi mdi-calendar-start date-icon"></span>
          <input v-model="filters.from" type="date" class="date-input" @change="filters.page = 1; doFetch()" />
        </div>
        <span class="date-sep">–</span>
        <div class="date-input-wrap">
          <span class="mdi mdi-calendar-end date-icon"></span>
          <input v-model="filters.to" type="date" class="date-input" @change="filters.page = 1; doFetch()" />
        </div>
        <button
          v-if="filters.from || filters.to"
          class="clear-dates"
          @click="filters.from = ''; filters.to = ''; filters.page = 1; doFetch()"
        >
          <span class="mdi mdi-close-circle-outline"></span>
        </button>
      </div>

      <div class="per-page-wrap">
        <label class="per-page-label">Rows</label>
        <select
          v-model.number="filters.limit"
          class="per-page-select"
          @change="filters.page = 1; doFetch()"
        >
          <option v-for="n in limitOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- ── Summary Chips ── -->
    <div class="summary-row" v-if="!historyLoading && historyData.length">
      <div class="summary-chip">
        <span class="sc-label">Showing</span>
        <span class="sc-value">{{ historyData.length }} of {{ pagination.total }}</span>
      </div>
      <div class="summary-chip credit">
        <span class="mdi mdi-arrow-down-circle"></span>
        <span class="sc-label">Credits</span>
        <span class="sc-value">₹{{ formatCurrency(pageCredits) }}</span>
      </div>
      <div class="summary-chip debit">
        <span class="mdi mdi-arrow-up-circle"></span>
        <span class="sc-label">Debits</span>
        <span class="sc-value">₹{{ formatCurrency(pageDebits) }}</span>
      </div>
    </div>

    <!-- ── Table Panel ── -->
    <div class="panel table-panel">

      <!-- Loading -->
      <div v-if="historyLoading" class="skeleton-rows">
        <div v-for="i in filters.limit" :key="i" class="skeleton-row">
          <div class="sk sk-icon"></div>
          <div class="sk sk-desc"></div>
          <div class="sk sk-badge"></div>
          <div class="sk sk-date"></div>
          <div class="sk sk-amount"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="historyError" class="empty-state error-state">
        <span class="mdi mdi-alert-circle-outline" style="font-size:40px;color:#ba1a1a"></span>
        <p>{{ historyError }}</p>
        <button class="retry-btn" @click="doFetch">
          <span class="mdi mdi-refresh"></span> Retry
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="!historyData.length" class="empty-state">
        <span class="mdi mdi-swap-horizontal" style="font-size:48px;color:#d0ccc0"></span>
        <p>No transactions found</p>
        <span v-if="hasActiveFilters" class="empty-hint">Try clearing your filters</span>
      </div>

      <!-- Table -->
      <template v-else>
        <div class="table-wrap">
          <table class="txn-table">
            <thead>
              <tr>
                <th style="width:40px">#</th>
                <th class="th-desc">Description</th>
                <th>UTR Number</th>
                <th class="th-date">Date & Time</th>
                <th class="th-amount">Gross</th>
                <th class="th-amount">Charges</th>
                <th class="th-amount">Net Amount</th>
                <th class="th-type">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, idx) in historyData"
                :key="entry.id"
                class="txn-row"
                :class="entry.type.toLowerCase()"
              >
                <!-- Row number -->
                <td class="td-seq">
                  {{ (pagination.page - 1) * filters.limit + idx + 1 }}
                </td>

                <!-- Description -->
                <td class="td-desc">
                  <div class="desc-wrap">
                    <span class="type-dot" :class="entry.type.toLowerCase()">
                      <span class="mdi" :class="entry.type === 'CREDIT' ? 'mdi-arrow-down' : 'mdi-arrow-up'"></span>
                    </span>
                    <div class="desc-stack">
                      <span class="desc-main">{{ entry.description || 'Transaction' }}</span>
                      <span class="desc-id">{{ entry.id.slice(0, 10) }}…</span>
                    </div>
                  </div>
                </td>

                <!-- UTR -->
                <td class="td-utr">
                  <span class="utr-val">{{ entry.transaction?.utrNumber || '—' }}</span>
                </td>

                <!-- Date -->
                <td class="td-date">
                  <span class="date-main">{{ formatDate(entry.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(entry.createdAt) }}</span>
                </td>

                <!-- Gross -->
                <td class="td-amount neutral">
                  <span v-if="entry.grossAmount != null">
                    ₹{{ formatCurrency(parseFloat(entry.grossAmount)) }}
                  </span>
                  <span v-else class="val-null">—</span>
                </td>

                <!-- Charges -->
                <td class="td-amount">
                  <span
                    v-if="entry.chargeAmount != null"
                    :class="parseFloat(entry.chargeAmount) > 0 ? 'val-fee' : 'val-zero'"
                  >
                    {{ parseFloat(entry.chargeAmount) > 0
                        ? `-₹${formatCurrency(parseFloat(entry.chargeAmount))}`
                        : '₹0.00' }}
                  </span>
                  <span v-else class="val-null">—</span>
                </td>

                <!-- Net Amount -->
                <td class="td-amount" :class="entry.type.toLowerCase()">
                  <span class="net-amt">
                    {{ entry.type === 'CREDIT' ? '+' : '−' }}₹{{
                      formatCurrency(parseFloat(entry.netAmount ?? entry.amount))
                    }}
                  </span>
                </td>

                <!-- Type -->
                <td class="td-type">
                  <span class="type-badge" :class="entry.type.toLowerCase()">
                    <span class="mdi" :class="entry.type === 'CREDIT' ? 'mdi-arrow-down' : 'mdi-arrow-up'"></span>
                    {{ entry.type }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ── Pagination ── -->
        <div class="pagination-bar">
          <span class="pag-info">
            Page <strong>{{ pagination.page }}</strong> of
            <strong>{{ pagination.totalPages }}</strong>
            &nbsp;·&nbsp; {{ pagination.total }} total
          </span>

          <div class="pag-controls">
            <button class="pag-btn" :disabled="!pagination.hasPrev" @click="goTo(1)">
              <span class="mdi mdi-page-first"></span>
            </button>
            <button class="pag-btn" :disabled="!pagination.hasPrev" @click="goTo(pagination.page - 1)">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="pag-ellipsis">…</span>
              <button
                v-else
                class="pag-btn pag-num"
                :class="{ current: p === pagination.page }"
                @click="goTo(p)"
              >{{ p }}</button>
            </template>
            <button class="pag-btn" :disabled="!pagination.hasNext" @click="goTo(pagination.page + 1)">
              <span class="mdi mdi-chevron-right"></span>
            </button>
            <button class="pag-btn" :disabled="!pagination.hasNext" @click="goTo(pagination.totalPages)">
              <span class="mdi mdi-page-last"></span>
            </button>
          </div>

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
    <Transition name="toast-slide">
      <div v-if="toast.show" class="toast-bar" :class="'toast-bar--' + toast.type">
        <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
        <span>{{ toast.message }}</span>
        <button class="toast-close" @click="toast.show = false">
          <span class="mdi mdi-close"></span>
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useVendorBalanceApi } from "~/composables/apis/useVendorBalanceApi";

definePageMeta({ layout: "vendorlayer", middleware: "auth" });

const {
  balanceData,
  balanceLoading,
  historyData,
  historyMeta,
  historyLoading,
  historyError,
  fetchBalance,
  fetchHistory,
  formatCurrency,
  maskAccount,
} = useVendorBalanceApi();

// ── Filter state ──────────────────────────────────────────────
const filters = reactive({
  page: 1, limit: 20, type: "", from: "", to: "", search: "",
});

const limitOptions = [10, 20, 50, 100];
const typeOptions = [
  { label: "All",     value: "",       dot: false },
  { label: "Credits", value: "CREDIT", dot: true, dotClass: "dot-credit" },
  { label: "Debits",  value: "DEBIT",  dot: true, dotClass: "dot-debit"  },
];

const jumpPage = ref(1);

// ── Pagination computed ───────────────────────────────────────
const pagination = computed(() => ({
  page:       historyMeta.value.page,
  totalPages: historyMeta.value.totalPages,
  total:      historyMeta.value.total,
  hasPrev:    historyMeta.value.page > 1,
  hasNext:    historyMeta.value.page < historyMeta.value.totalPages,
}));

const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const cur   = pagination.value.page;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (cur > 3) pages.push("...");
  const start = Math.max(2, cur - 1);
  const end   = Math.min(total - 1, cur + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (cur < total - 2) pages.push("...");
  pages.push(total);
  return pages;
});

// ── Summary ───────────────────────────────────────────────────
const hasActiveFilters = computed(() =>
  filters.type || filters.from || filters.to || filters.search
);

const pageCredits = computed(() =>
  historyData.value
    .filter(t => t.type === "CREDIT")
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0)
);

const pageDebits = computed(() =>
  historyData.value
    .filter(t => t.type === "DEBIT")
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0)
);

// ── Toast ─────────────────────────────────────────────────────
const toast = ref({ show: false, message: "", type: "success" });
const showToast = (message, type = "success") => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 4000);
};

// ── Fetch ─────────────────────────────────────────────────────
const doFetch = async () => {
  jumpPage.value = filters.page;
  try {
    await fetchHistory({
      page:   filters.page,
      limit:  filters.limit,
      type:   filters.type   || undefined,
      from:   filters.from   || undefined,
      to:     filters.to     || undefined,
      search: filters.search || undefined,
    });
  } catch {
    showToast("Failed to load history", "error");
  }
};

let debounceTimer = null;
const debouncedFetch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { filters.page = 1; doFetch(); }, 400);
};

const goTo = (p) => {
  const clamped = Math.max(1, Math.min(p, pagination.value.totalPages));
  filters.page = clamped;
  doFetch();
};

// ── Date helpers ──────────────────────────────────────────────
const formatDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const formatTime = (s) =>
  s ? new Date(s).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

// ── Export ────────────────────────────────────────────────────
const handleExport = () => {
  if (!historyData.value.length) { showToast("No data to export", "error"); return; }
  const headers = ["#", "Description", "UTR Number", "Date", "Gross", "Charges", "Net Amount", "Type"];
  const rows = historyData.value.map((e, i) => [
    (pagination.value.page - 1) * filters.limit + i + 1,
    `"${(e.description || "").replace(/"/g, '""')}"`,
    e.transaction?.utrNumber || "",
    new Date(e.createdAt).toISOString(),
    e.grossAmount ?? e.amount,
    e.chargeAmount ?? "",
    e.netAmount ?? e.amount,
    e.type,
  ]);
  const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `vendor-history-p${filters.page}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported");
};

onMounted(async () => {
  await Promise.all([fetchBalance(), doFetch()]);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; }

.history-page {
  font-family: 'DM Sans', sans-serif;
  padding: 0;
  background: #f6f6f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (min-width: 768px)  { .history-page { padding: 0; } }
@media (min-width: 1200px) { .history-page { padding: 0; } }

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title-wrap { display: flex; align-items: center; gap: 14px; }
.back-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: #fff; border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  color: #1a1a1a; text-decoration: none; font-size: 18px;
  transition: background .15s; flex-shrink: 0;
}
.back-btn:hover { background: #f1f5f9; }
.page-title { margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; }
@media (min-width: 640px) { .page-title { font-size: 26px; } }
.page-sub   { margin: 2px 0 0; font-size: 12px; color: #64748b; }
.export-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 9999px;
  border: 1px solid #e2e8f0; background: #fff;
  font-size: 13px; font-weight: 500; color: #0f172a;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background .15s;
}
.export-btn:hover { background: #f1f5f9; }

/* ── Balance Strip ── */
.balance-strip {
  display: flex;
  align-items: center;
  gap: 0;
  background: linear-gradient(135deg, #1142d4, #0e35a8);
  border-radius: 14px;
  padding: 16px 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.bs-item { display: flex; flex-direction: column; gap: 3px; }
.bs-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,.60); text-transform: uppercase; letter-spacing: .06em; }
.bs-value { font-size: 18px; font-weight: 700; color: #fff; font-family: 'DM Mono', monospace; }
.bs-value--sm { font-size: 13px; }
.bs-sep { width: 1px; height: 36px; background: rgba(255,255,255,.18); }

/* ── Filters ── */
.filters-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.search-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 180px; }
.search-icon { position: absolute; left: 10px; color: #94a3b8; pointer-events: none; font-size: 16px; }
.search-input {
  width: 100%; padding: 8px 30px 8px 32px;
  border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 13px; font-family: 'DM Sans', sans-serif;
  background: #f8fafc; outline: none; transition: border .2s;
}
.search-input:focus { border-color: #1142d4; background: #fff; }
.search-clear { position: absolute; right: 8px; background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; padding: 2px; }

.filter-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.filter-tab {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border: 1.5px solid #e2e8f0; border-radius: 20px;
  background: #fff; font-size: 12px; font-weight: 600; color: #64748b;
  cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s;
}
.filter-tab:hover { background: #f1f5f9; border-color: #c7d2fe; color: #1142d4; }
.filter-tab.active { background: #1142d4; color: #fff; border-color: #1142d4; }
.tab-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.dot-credit { background: #16a34a; }
.dot-debit  { background: #dc2626; }

.date-range { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.date-input-wrap { position: relative; display: flex; align-items: center; }
.date-icon { position: absolute; left: 8px; color: #94a3b8; pointer-events: none; font-size: 14px; }
.date-input {
  padding: 7px 10px 7px 26px; border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 12px; font-family: 'DM Sans', sans-serif; background: #f8fafc; outline: none; color: #1e293b; transition: border .2s;
}
.date-input:focus { border-color: #1142d4; background: #fff; }
.date-sep { font-size: 13px; color: #94a3b8; }
.clear-dates { background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; padding: 3px; font-size: 16px; }

.per-page-wrap { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.per-page-label { font-size: 12px; color: #64748b; }
.per-page-select {
  padding: 7px 10px; border: 1.5px solid #e2e8f0; border-radius: 9px;
  font-size: 12px; font-family: 'DM Sans', sans-serif; background: #f8fafc; outline: none; cursor: pointer;
}

/* ── Summary chips ── */
.summary-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.summary-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 20px;
  background: #fff; border: 1px solid #e8edf3;
  font-size: 12px;
}
.sc-label { color: #94a3b8; }
.sc-value { font-weight: 700; color: #0f172a; }
.summary-chip.credit { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.summary-chip.credit .sc-value { color: #16a34a; }
.summary-chip.debit  { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
.summary-chip.debit  .sc-value { color: #dc2626; }

/* ── Panel / Table ── */
.panel {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  overflow: hidden;
}
.table-wrap { overflow-x: auto; }

.txn-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: 'DM Sans', sans-serif; }
.txn-table thead tr { background: #f8fafc; border-bottom: 2px solid #e8edf3; }
.txn-table th {
  padding: 12px 16px; text-align: left;
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .05em; white-space: nowrap;
}
.th-amount { text-align: right; }

.txn-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background .1s;
}
.txn-row:hover { background: #f8fafc; }
.txn-row:last-child { border-bottom: none; }
.txn-table td { padding: 13px 16px; vertical-align: middle; }

.td-seq { font-size: 11px; color: #cbd5e1; font-weight: 600; text-align: center; }

.td-desc { min-width: 200px; }
.desc-wrap { display: flex; align-items: center; gap: 10px; }
.type-dot {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; flex-shrink: 0;
}
.type-dot.credit { background: #dcfce7; color: #16a34a; }
.type-dot.debit  { background: #fee2e2; color: #dc2626; }
.desc-stack { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.desc-main { font-size: 13px; font-weight: 500; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.desc-id   { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; }

.td-utr { white-space: nowrap; }
.utr-val { font-size: 12px; color: #64748b; font-family: 'DM Mono', monospace; }

.td-date { white-space: nowrap; }
.date-main { display: block; font-size: 13px; font-weight: 500; color: #1e293b; }
.date-time { display: block; font-size: 11px; color: #94a3b8; margin-top: 2px; }

.td-amount { text-align: right; white-space: nowrap; }
.td-amount.neutral { color: #1e293b; font-weight: 500; }
.td-amount.credit .net-amt { color: #16a34a; font-weight: 700; font-size: 14px; }
.td-amount.debit  .net-amt { color: #dc2626; font-weight: 700; font-size: 14px; }
.net-amt  { font-size: 14px; font-weight: 700; }
.val-fee  { font-size: 13px; font-weight: 500; color: #dc2626; }
.val-zero { font-size: 13px; color: #94a3b8; }
.val-null { font-size: 13px; color: #cbd5e1; }

.td-type { white-space: nowrap; }
.type-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 700;
}
.type-badge.credit { background: #dcfce7; color: #16a34a; }
.type-badge.debit  { background: #fee2e2; color: #dc2626; }

/* ── Pagination ── */
.pagination-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}
.pag-info { font-size: 12px; color: #64748b; white-space: nowrap; }
.pag-info strong { color: #1e293b; }
.pag-controls { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.pag-btn {
  min-width: 32px; height: 32px; border: 1px solid #e2e8f0; border-radius: 8px;
  background: #fff; color: #475569; font-size: 13px; font-weight: 500;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  padding: 0 8px; font-family: 'DM Sans', sans-serif;
  transition: all .15s;
}
.pag-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
.pag-btn:disabled { opacity: .35; cursor: default; }
.pag-btn.current { background: #1142d4; color: #fff; border-color: #1142d4; font-weight: 700; }
.pag-ellipsis { padding: 0 4px; font-size: 14px; color: #94a3b8; line-height: 32px; }
.pag-jump { display: flex; align-items: center; gap: 6px; }
.pag-jump-label { font-size: 12px; color: #64748b; white-space: nowrap; }
.pag-jump-input {
  width: 52px; padding: 6px 8px;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 12px; font-family: 'DM Sans', sans-serif;
  text-align: center; outline: none; background: #fff;
}
.pag-jump-input:focus { border-color: #1142d4; }
.pag-jump-btn {
  padding: 6px 14px; border: none; border-radius: 8px;
  background: #1142d4; color: #fff;
  font-size: 12px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: background .15s;
}
.pag-jump-btn:hover { background: #0e35a8; }

/* ── Empty / Error / Skeleton ── */
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 10px; padding: 60px 20px; text-align: center;
}
.empty-state p { font-size: 14px; color: #64748b; margin: 0; }
.empty-hint    { font-size: 12px; color: #94a3b8; }
.error-state   { color: #ba1a1a; }
.retry-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 9px 18px; border: none; border-radius: 9999px;
  background: #dc2626; color: #fff;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
}
.retry-btn:hover { background: #b91c1c; }

.skeleton-rows { padding: 8px 0; }
.skeleton-row {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 20px; border-bottom: 1px solid #f1f5f9;
}
.skeleton-row:last-child { border-bottom: none; }
.sk {
  background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
  background-size: 200% 100%; border-radius: 6px; animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.sk-icon   { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; }
.sk-desc   { flex: 1; height: 14px; }
.sk-badge  { width: 60px; height: 22px; border-radius: 20px; }
.sk-date   { width: 90px; height: 14px; }
.sk-amount { width: 70px; height: 16px; }

/* ── Toast ── */
.toast-bar {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-radius: 12px;
  font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,.14);
  z-index: 9999; max-width: 340px;
  font-family: 'DM Sans', sans-serif;
}
.toast-bar--success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
.toast-bar--error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; padding: 2px; display: flex; margin-left: auto; }
.toast-slide-enter-active { animation: toastIn .3s ease; }
.toast-slide-leave-active { animation: toastIn .2s ease reverse; }
@keyframes toastIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 768px) {
  .filters-bar { flex-direction: column; align-items: stretch; }
  .per-page-wrap { margin-left: 0; }
  .pag-controls { margin-left: 0; }
  .pagination-bar { justify-content: center; }
  .balance-strip { gap: 10px; }
  .bs-sep { display: none; }
}
</style>