<template>
  <div class="wallet-root">
    <!-- Page header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Account &amp; Balance</h1>
        <p class="page-sub">Manage your available balance and transfer history</p>
      </div>
      <div class="header-actions">
        <button class="btn-outline" @click="showHistory = true">
          <span class="mdi mdi-history"></span> History
        </button>
        <button class="btn-primary" @click="showAddMoney = true">
          <span class="mdi mdi-plus-circle-outline"></span> Add Money
        </button>
        <button class="btn-danger" @click="openWithdraw">
          <span class="mdi mdi-bank-transfer-out"></span> Withdraw
        </button>
      </div>
    </div>

    <!-- Balance + Account Info row -->
    <div class="top-row">
      <!-- Balance card -->
      <div class="balance-card">
        <div class="balance-card-bg"></div>
        <div class="balance-card-content">
          <div class="balance-label-row">
            <span class="mdi mdi-wallet-outline balance-icon"></span>
            <span class="balance-label">Available Balance</span>
            <span v-if="balanceLoading" class="live-badge">Loading…</span>
            <span v-else-if="balanceData.walletActive" class="live-badge live-active">
              <span class="live-dot"></span>Active
            </span>
            <span v-else class="live-badge live-inactive">Inactive</span>
          </div>

          <div class="balance-amount">
            <span class="currency-symbol">₹</span>
            <span v-if="balanceLoading" class="amount-skeleton"></span>
            <span v-else class="amount-value">{{ formatCurrency(balanceData.balance) }}</span>
          </div>

          <div class="balance-meta">
            <div class="meta-item">
              <span class="mdi mdi-identifier meta-icon"></span>
              <span class="meta-label">Wallet ID</span>
              <span class="meta-val mono">{{ balanceData.walletId ?? '—' }}</span>
            </div>
            <div v-if="balanceData.settlementAccount" class="meta-item">
              <span class="mdi mdi-bank-outline meta-icon"></span>
              <span class="meta-label">Settlement A/C</span>
              <span class="meta-val mono">{{ maskAccount(balanceData.settlementAccount) }}</span>
            </div>
          </div>

          <div class="balance-actions">
            <button class="bal-btn" :disabled="addMoneyLoading" @click="showAddMoney = true">
              <span class="mdi mdi-arrow-collapse-down"></span>
              Add Money
            </button>
            <button class="bal-btn bal-btn-outline" :disabled="withdrawLoading" @click="openWithdraw">
              <span class="mdi mdi-arrow-top-right"></span>
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <!-- Stats cards -->
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-icon-wrap stat-credit">
            <span class="mdi mdi-arrow-collapse-down"></span>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Credits</span>
            <span class="stat-val mono">₹{{ formatCurrency(totalCredits) }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-debit">
            <span class="mdi mdi-arrow-top-right"></span>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Debits</span>
            <span class="stat-val mono">₹{{ formatCurrency(totalDebits) }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-tx">
            <span class="mdi mdi-swap-horizontal"></span>
          </div>
          <div class="stat-info">
            <span class="stat-label">Transactions</span>
            <span class="stat-val mono">{{ historyMeta.total }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrap stat-status" :class="balanceData.walletActive ? 'stat-active' : 'stat-idle'">
            <span class="mdi" :class="balanceData.walletActive ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
          </div>
          <div class="stat-info">
            <span class="stat-label">Wallet Status</span>
            <span class="stat-val" :class="balanceData.walletActive ? 'text-green' : 'text-amber'">
              {{ balanceData.walletActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer History -->
    <div class="history-card">
      <div class="history-header">
        <div class="history-title-row">
          <h2 class="section-title">Transfer History</h2>
          <span class="count-chip">{{ historyMeta.total }} records</span>
        </div>

        <!-- Filters -->
        <div class="filter-row">
          <div class="tab-strip">
            <button
              v-for="t in typeOptions"
              :key="t.value"
              class="tab-btn"
              :class="{ active: filterType === t.value }"
              @click="setType(t.value)"
            >{{ t.label }}</button>
          </div>

          <div class="filter-right">
            <input v-model="searchQ" class="search-input" placeholder="Search description…" @input="debouncedFetch" />
            <input v-model="dateFrom" type="date" class="date-input" @change="doFetch" />
            <input v-model="dateTo" type="date" class="date-input" @change="doFetch" />
            <button class="icon-btn" title="Clear filters" @click="clearFilters">
              <span class="mdi mdi-filter-remove-outline"></span>
            </button>
            <button class="icon-btn" title="Refresh" @click="doFetch">
              <span class="mdi mdi-refresh" :class="{ spin: historyLoading }"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrap">
        <table class="hist-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date &amp; Time</th>
              <th>Type</th>
              <th>Description</th>
              <th class="text-right">Amount</th>
              <th class="text-right">Balance After</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="historyLoading">
              <td colspan="7" class="loading-row">
                <span class="mdi mdi-loading spin"></span> Loading…
              </td>
            </tr>
            <tr v-else-if="!historyData.length">
              <td colspan="7" class="empty-row">
                <span class="mdi mdi-inbox-outline"></span>
                <span>No transactions found</span>
              </td>
            </tr>
            <template v-else>
              <tr v-for="(row, i) in historyData" :key="row.id ?? i">
                <td class="idx-cell">{{ (historyMeta.page - 1) * historyMeta.limit + i + 1 }}</td>
                <td class="date-cell">
                  <span class="date-main">{{ fmtDate(row.createdAt) }}</span>
                  <span class="date-time">{{ fmtTime(row.createdAt) }}</span>
                </td>
                <td>
                  <span class="type-chip" :class="row.type === 'CREDIT' ? 'chip-credit' : 'chip-debit'">
                    <span class="mdi" :class="row.type === 'CREDIT' ? 'mdi-arrow-collapse-down' : 'mdi-arrow-top-right'"></span>
                    {{ row.type }}
                  </span>
                </td>
                <td class="desc-cell">{{ row.description ?? '—' }}</td>
                <td class="text-right amount-cell">
                  <span :class="row.type === 'CREDIT' ? 'amt-credit' : 'amt-debit'">
                    {{ row.type === 'CREDIT' ? '+' : '-' }}₹{{ formatCurrency(row.amount) }}
                  </span>
                </td>
                <td class="text-right mono text-sm">₹{{ formatCurrency(row.balanceAfter) }}</td>
                <td class="ref-cell mono text-xs">{{ row.referenceId ?? row.id ?? '—' }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="historyMeta.totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="historyMeta.page <= 1" @click="goPage(historyMeta.page - 1)">
          <span class="mdi mdi-chevron-left"></span>
        </button>
        <span class="page-info">Page {{ historyMeta.page }} / {{ historyMeta.totalPages }}</span>
        <button class="page-btn" :disabled="historyMeta.page >= historyMeta.totalPages" @click="goPage(historyMeta.page + 1)">
          <span class="mdi mdi-chevron-right"></span>
        </button>
      </div>
    </div>

    <!-- ── Add Money Modal ── -->
    <Teleport to="body">
      <div v-if="showAddMoney" class="modal-backdrop" @click.self="showAddMoney = false">
        <div class="modal-box">
          <div class="modal-header">
            <h3 class="modal-title">
              <span class="mdi mdi-plus-circle-outline modal-icon icon-blue"></span>
              Add Money
            </h3>
            <button class="modal-close" @click="showAddMoney = false">
              <span class="mdi mdi-close"></span>
            </button>
          </div>
          <div class="modal-body">
            <label class="field-label">Amount (₹)</label>
            <div class="amount-field">
              <span class="field-prefix">₹</span>
              <input
                v-model.number="addAmount"
                type="number"
                min="1"
                class="field-input"
                placeholder="0.00"
                @keyup.enter="submitAddMoney"
              />
            </div>
            <label class="field-label mt-14">Description (optional)</label>
            <input v-model="addDesc" class="field-input full" placeholder="e.g. Account top-up" />
            <p v-if="addError" class="field-error">{{ addError }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-ghost" @click="showAddMoney = false">Cancel</button>
            <button class="btn-primary" :disabled="addMoneyLoading || !addAmount" @click="submitAddMoney">
              <span v-if="addMoneyLoading" class="mdi mdi-loading spin"></span>
              {{ addMoneyLoading ? 'Processing…' : 'Add Money' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Withdraw Modal (2-step) ── -->
    <Teleport to="body">
      <div v-if="showWithdraw" class="modal-backdrop" @click.self="closeWithdraw">
        <div class="modal-box">
          <!-- Step 1 -->
          <template v-if="withdrawStep === 1">
            <div class="modal-header">
              <h3 class="modal-title">
                <span class="mdi mdi-bank-transfer-out modal-icon icon-amber"></span>
                Withdraw Funds
              </h3>
              <button class="modal-close" @click="closeWithdraw">
                <span class="mdi mdi-close"></span>
              </button>
            </div>
            <div class="modal-body">
              <div class="withdraw-balance-row">
                <span class="mdi mdi-wallet-outline"></span>
                Available: <strong>₹{{ formatCurrency(balanceData.balance) }}</strong>
              </div>
              <label class="field-label mt-14">Withdraw Amount (₹)</label>
              <div class="amount-field">
                <span class="field-prefix">₹</span>
                <input
                  v-model.number="withdrawAmount"
                  type="number"
                  min="1"
                  :max="balanceData.balance"
                  class="field-input"
                  placeholder="0.00"
                />
              </div>
              <label class="field-label mt-14">Description (optional)</label>
              <input v-model="withdrawDesc" class="field-input full" placeholder="e.g. Monthly withdrawal" />
              <p v-if="withdrawError" class="field-error">{{ withdrawError }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn-ghost" @click="closeWithdraw">Cancel</button>
              <button class="btn-amber" :disabled="!withdrawAmount || withdrawAmount > balanceData.balance" @click="withdrawStep = 2">
                Continue <span class="mdi mdi-arrow-right"></span>
              </button>
            </div>
          </template>

          <!-- Step 2 — Confirm -->
          <template v-else>
            <div class="modal-header">
              <h3 class="modal-title">
                <span class="mdi mdi-shield-check-outline modal-icon icon-blue"></span>
                Confirm Withdrawal
              </h3>
              <button class="modal-close" @click="closeWithdraw">
                <span class="mdi mdi-close"></span>
              </button>
            </div>
            <div class="modal-body">
              <div class="confirm-summary">
                <div class="confirm-row">
                  <span class="confirm-label">Withdraw Amount</span>
                  <span class="confirm-val mono">₹{{ formatCurrency(withdrawAmount) }}</span>
                </div>
                <div class="confirm-row">
                  <span class="confirm-label">Balance After</span>
                  <span class="confirm-val mono">₹{{ formatCurrency(balanceData.balance - withdrawAmount) }}</span>
                </div>
                <div v-if="withdrawDesc" class="confirm-row">
                  <span class="confirm-label">Description</span>
                  <span class="confirm-val">{{ withdrawDesc }}</span>
                </div>
                <div v-if="balanceData.settlementAccount" class="confirm-row">
                  <span class="confirm-label">Settlement A/C</span>
                  <span class="confirm-val mono">{{ maskAccount(balanceData.settlementAccount) }}</span>
                </div>
              </div>
              <p v-if="withdrawError" class="field-error">{{ withdrawError }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn-ghost" @click="withdrawStep = 1">
                <span class="mdi mdi-arrow-left"></span> Back
              </button>
              <button class="btn-danger" :disabled="withdrawLoading" @click="submitWithdraw">
                <span v-if="withdrawLoading" class="mdi mdi-loading spin"></span>
                {{ withdrawLoading ? 'Processing…' : 'Confirm Withdraw' }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <div v-if="toast.show" class="toast" :class="'toast-' + toast.type">
      <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
      {{ toast.message }}
      <button class="toast-close" @click="toast.show = false">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMerchantBalanceApi } from '~/composables/apis/useMerchantBalanceApi';

definePageMeta({ layout: 'mlayer', middleware: 'auth' });

const {
  balanceData, historyData, historyMeta,
  balanceLoading, historyLoading, addMoneyLoading, withdrawLoading,
  fetchBalance, addMoney, withdraw, fetchHistory,
  formatCurrency, maskAccount,
} = useMerchantBalanceApi();

// ── Filter state ──
const filterType = ref('');
const searchQ    = ref('');
const dateFrom   = ref('');
const dateTo     = ref('');

const typeOptions = [
  { label: 'All',    value: '' },
  { label: 'Credit', value: 'CREDIT' },
  { label: 'Debit',  value: 'DEBIT' },
];

// ── Computed stats ──
const totalCredits = computed(() =>
  historyData.value.filter(r => r.type === 'CREDIT').reduce((s, r) => s + (r.amount ?? 0), 0)
);
const totalDebits = computed(() =>
  historyData.value.filter(r => r.type === 'DEBIT').reduce((s, r) => s + (r.amount ?? 0), 0)
);

// ── Add Money ──
const showAddMoney = ref(false);
const addAmount    = ref(null);
const addDesc      = ref('');
const addError     = ref('');

async function submitAddMoney() {
  addError.value = '';
  if (!addAmount.value || addAmount.value <= 0) { addError.value = 'Enter a valid amount'; return; }
  try {
    const res = await addMoney(addAmount.value, addDesc.value);
    if (res?.statusCode === '00') {
      showToast('success', 'Money added successfully');
      showAddMoney.value = false;
      addAmount.value = null;
      addDesc.value = '';
      doFetch();
    } else {
      addError.value = res?.message || 'Failed to add money';
    }
  } catch {
    addError.value = 'Network error. Please try again.';
  }
}

// ── Withdraw ──
const showWithdraw   = ref(false);
const withdrawStep   = ref(1);
const withdrawAmount = ref(null);
const withdrawDesc   = ref('');
const withdrawError  = ref('');

function openWithdraw() { showWithdraw.value = true; withdrawStep.value = 1; withdrawError.value = ''; }
function closeWithdraw() { showWithdraw.value = false; withdrawStep.value = 1; withdrawAmount.value = null; withdrawDesc.value = ''; withdrawError.value = ''; }

async function submitWithdraw() {
  withdrawError.value = '';
  try {
    const res = await withdraw(withdrawAmount.value, withdrawDesc.value);
    if (res?.statusCode === '00') {
      showToast('success', 'Withdrawal successful');
      closeWithdraw();
      doFetch();
    } else {
      withdrawError.value = res?.message || 'Withdrawal failed';
    }
  } catch {
    withdrawError.value = 'Network error. Please try again.';
  }
}

// ── History ──
const showHistory = ref(false);

function setType(val) { filterType.value = val; doFetch(); }

async function doFetch(page = 1) {
  await fetchHistory({
    page,
    type:   filterType.value || undefined,
    search: searchQ.value   || undefined,
    from:   dateFrom.value  || undefined,
    to:     dateTo.value    || undefined,
  });
}

function goPage(p) { doFetch(p); }

function clearFilters() {
  filterType.value = '';
  searchQ.value    = '';
  dateFrom.value   = '';
  dateTo.value     = '';
  doFetch();
}

let debounceTimer = null;
function debouncedFetch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => doFetch(), 400);
}

// ── Date helpers ──
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ── Toast ──
const toast = ref({ show: false, type: 'success', message: '' });
function showToast(type, message) {
  toast.value = { show: true, type, message };
  setTimeout(() => { toast.value.show = false; }, 4000);
}

onMounted(async () => {
  await Promise.all([fetchBalance(), doFetch()]);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.wallet-root {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Page header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title { font-size: 1.45rem; font-weight: 700; color: #0f1728; margin: 0 0 2px; }
.page-sub   { font-size: .85rem; color: #6b7589; margin: 0; }

.header-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  background: #1142d4; color: #fff;
  border: none; border-radius: 9px; padding: 9px 18px;
  font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: background .17s;
}
.btn-primary:hover:not(:disabled) { background: #0e35a8; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }

.btn-danger {
  display: inline-flex; align-items: center; gap: 6px;
  background: #ef4444; color: #fff;
  border: none; border-radius: 9px; padding: 9px 18px;
  font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: background .17s;
}
.btn-danger:hover:not(:disabled) { background: #dc2626; }
.btn-danger:disabled { opacity: .6; cursor: not-allowed; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff; color: #1142d4;
  border: 1.5px solid #c7d2fe; border-radius: 9px; padding: 8px 16px;
  font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: border-color .17s, background .17s;
}
.btn-outline:hover { background: #eef2ff; }

/* ── Top row ── */
.top-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 900px) { .top-row { grid-template-columns: 1fr; } }

/* ── Balance card ── */
.balance-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  min-height: 260px;
  color: #fff;
}
.balance-card-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #1142d4 0%, #1e3fbe 50%, #0e35a8 100%);
}
.balance-card-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 80% 10%, rgba(255,255,255,.08) 0%, transparent 60%);
}
.balance-card-content {
  position: relative;
  padding: 28px 30px;
  display: flex; flex-direction: column; gap: 18px;
  height: 100%;
}

.balance-label-row { display: flex; align-items: center; gap: 10px; }
.balance-icon { font-size: 1.35rem; opacity: .85; }
.balance-label { font-size: .875rem; font-weight: 600; opacity: .85; flex: 1; }

.live-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px;
  font-size: .72rem; font-weight: 600;
  background: rgba(255,255,255,.18); color: #fff;
}
.live-active { background: rgba(5,150,105,.35); }
.live-inactive { background: rgba(217,119,6,.35); }
.live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #4ade80;
  animation: pulse-g 1.8s infinite;
}
@keyframes pulse-g {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .5; transform: scale(.75); }
}

.balance-amount {
  display: flex; align-items: flex-end; gap: 6px;
}
.currency-symbol { font-size: 1.4rem; font-weight: 700; margin-bottom: 6px; opacity: .9; }
.amount-value { font-size: 2.6rem; font-weight: 700; font-family: 'DM Mono', monospace; line-height: 1; }
.amount-skeleton {
  height: 2.6rem; width: 160px; border-radius: 8px;
  background: rgba(255,255,255,.2); animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0%   { opacity: .5; }
  50%  { opacity: 1; }
  100% { opacity: .5; }
}

.balance-meta { display: flex; flex-direction: column; gap: 8px; }
.meta-item { display: flex; align-items: center; gap: 8px; font-size: .8rem; }
.meta-icon { opacity: .7; }
.meta-label { opacity: .7; min-width: 90px; }
.meta-val { font-weight: 600; }

.balance-actions { display: flex; gap: 12px; margin-top: auto; }
.bal-btn {
  flex: 1;
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  background: rgba(255,255,255,.2); color: #fff;
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 10px; padding: 10px 14px;
  font-size: .85rem; font-weight: 600; cursor: pointer;
  transition: background .17s;
}
.bal-btn:hover:not(:disabled) { background: rgba(255,255,255,.3); }
.bal-btn:disabled { opacity: .5; cursor: not-allowed; }
.bal-btn-outline { background: transparent; }
.bal-btn-outline:hover:not(:disabled) { background: rgba(255,255,255,.15); }

/* ── Stat cards ── */
.stat-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.stat-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  padding: 18px 20px;
  display: flex; align-items: center; gap: 14px;
}
.stat-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; flex-shrink: 0;
}
.stat-credit { background: #d1fae5; color: #059669; }
.stat-debit  { background: #fee2e2; color: #ef4444; }
.stat-tx     { background: #e0e7ff; color: #4f46e5; }
.stat-active { background: #d1fae5; color: #059669; }
.stat-idle   { background: #fef3c7; color: #d97706; }
.stat-label  { font-size: .78rem; color: #6b7589; display: block; margin-bottom: 4px; }
.stat-val    { font-size: 1.1rem; font-weight: 700; color: #0f1728; }
.text-green  { color: #059669; }
.text-amber  { color: #d97706; }

/* ── History card ── */
.history-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  overflow: hidden;
}
.history-header { padding: 20px 22px 0; }
.history-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.section-title { font-size: 1.05rem; font-weight: 700; color: #0f1728; margin: 0; }
.count-chip {
  background: #e0e7ff; color: #4338ca;
  font-size: .72rem; font-weight: 700;
  padding: 2px 10px; border-radius: 20px;
}

.filter-row {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  padding-bottom: 16px; border-bottom: 1px solid #f0f2f7;
}
.tab-strip { display: flex; gap: 4px; background: #f6f7fa; padding: 3px; border-radius: 9px; }
.tab-btn {
  padding: 6px 14px; border: none; border-radius: 7px;
  font-size: .8rem; font-weight: 600; cursor: pointer;
  background: transparent; color: #6b7589;
  transition: background .15s, color .15s;
}
.tab-btn.active { background: #fff; color: #1142d4; box-shadow: 0 1px 4px rgba(0,0,0,.08); }

.filter-right { display: flex; gap: 8px; align-items: center; margin-left: auto; flex-wrap: wrap; }
.search-input, .date-input {
  border: 1.5px solid #e8edf3; border-radius: 8px;
  padding: 7px 12px; font-size: .82rem; font-family: inherit;
  color: #0f1728; background: #fff; outline: none;
  transition: border-color .15s;
}
.search-input { min-width: 180px; }
.search-input:focus, .date-input:focus { border-color: #1142d4; }
.icon-btn {
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  border: 1.5px solid #e8edf3; border-radius: 8px; background: #fff;
  font-size: 1rem; color: #6b7589; cursor: pointer;
  transition: border-color .15s, color .15s;
}
.icon-btn:hover { border-color: #1142d4; color: #1142d4; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.hist-table {
  width: 100%; border-collapse: collapse;
  font-size: .84rem;
}
.hist-table thead tr { background: #f8f9fc; }
.hist-table th {
  padding: 12px 16px; text-align: left;
  font-size: .75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .04em; color: #8a93a8;
  border-bottom: 1px solid #f0f2f7;
}
.hist-table td {
  padding: 12px 16px; border-bottom: 1px solid #f6f7fa;
  color: #2d3748; vertical-align: middle;
}
.hist-table tbody tr:last-child td { border-bottom: none; }
.hist-table tbody tr:hover td { background: #fafbff; }

.loading-row, .empty-row {
  text-align: center; padding: 40px 16px !important;
  color: #8a93a8; font-size: .9rem;
}
.empty-row { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.empty-row .mdi { font-size: 2rem; opacity: .4; }
.text-right { text-align: right !important; }
.idx-cell { color: #8a93a8; font-size: .78rem; width: 40px; }
.date-cell { display: flex; flex-direction: column; gap: 1px; }
.date-main { font-weight: 600; color: #0f1728; font-size: .83rem; }
.date-time { font-size: .75rem; color: #8a93a8; }
.desc-cell { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ref-cell  { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #8a93a8; }
.amount-cell { font-weight: 700; }
.amt-credit { color: #059669; }
.amt-debit  { color: #ef4444; }
.mono { font-family: 'DM Mono', monospace; }
.text-sm { font-size: .8rem; }
.text-xs { font-size: .75rem; }

.type-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 20px;
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
}
.chip-credit { background: #d1fae5; color: #059669; }
.chip-debit  { background: #fee2e2; color: #ef4444; }

/* ── Pagination ── */
.pagination {
  display: flex; align-items: center; justify-content: center; gap: 14px;
  padding: 16px; border-top: 1px solid #f0f2f7;
}
.page-btn {
  width: 34px; height: 34px; border: 1.5px solid #e8edf3;
  border-radius: 8px; background: #fff; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #1142d4; transition: border-color .15s;
}
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-btn:not(:disabled):hover { border-color: #1142d4; }
.page-info { font-size: .83rem; color: #6b7589; font-weight: 600; }

/* ── Modals ── */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(15,23,40,.45); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
  z-index: 9000; padding: 20px;
}
.modal-box {
  background: #fff; border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0,0,0,.18);
  width: 100%; max-width: 440px;
  overflow: hidden;
  animation: modal-in .2s ease;
}
@keyframes modal-in {
  from { opacity: 0; transform: translateY(12px) scale(.97); }
  to   { opacity: 1; transform: none; }
}
.modal-header {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 22px 16px;
  border-bottom: 1px solid #f0f2f7;
}
.modal-title { font-size: 1rem; font-weight: 700; color: #0f1728; margin: 0; flex: 1; display: flex; align-items: center; gap: 8px; }
.modal-icon { font-size: 1.2rem; }
.icon-blue  { color: #1142d4; }
.icon-amber { color: #d97706; }
.modal-close {
  width: 30px; height: 30px; border: none; border-radius: 8px;
  background: #f6f7fa; color: #6b7589; cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.modal-close:hover { background: #e8edf3; }
.modal-body  { padding: 20px 22px; display: flex; flex-direction: column; gap: 4px; }
.modal-footer {
  padding: 14px 22px 20px;
  border-top: 1px solid #f0f2f7;
  display: flex; justify-content: flex-end; gap: 10px;
}

.field-label { font-size: .8rem; font-weight: 600; color: #4a5568; margin-bottom: 6px; display: block; }
.mt-14 { margin-top: 14px; }
.amount-field {
  display: flex; align-items: center;
  border: 1.5px solid #e8edf3; border-radius: 10px;
  overflow: hidden; background: #f8f9fc;
  transition: border-color .15s;
}
.amount-field:focus-within { border-color: #1142d4; background: #fff; }
.field-prefix { padding: 10px 14px; font-size: 1rem; font-weight: 700; color: #6b7589; border-right: 1px solid #e8edf3; }
.field-input  {
  flex: 1; border: none; background: transparent;
  padding: 10px 14px; font-size: .95rem; font-family: 'DM Mono', monospace;
  color: #0f1728; outline: none;
}
.field-input.full {
  width: 100%; border: 1.5px solid #e8edf3; border-radius: 10px;
  background: #f8f9fc; padding: 10px 14px;
  transition: border-color .15s;
}
.field-input.full:focus { border-color: #1142d4; background: #fff; }
.field-error { color: #ef4444; font-size: .8rem; margin-top: 8px; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f6f7fa; color: #4a5568;
  border: none; border-radius: 9px; padding: 9px 18px;
  font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: background .17s;
}
.btn-ghost:hover { background: #e8edf3; }

.btn-amber {
  display: inline-flex; align-items: center; gap: 6px;
  background: #d97706; color: #fff;
  border: none; border-radius: 9px; padding: 9px 18px;
  font-size: .875rem; font-weight: 600; cursor: pointer;
  transition: background .17s;
}
.btn-amber:hover:not(:disabled) { background: #b45309; }
.btn-amber:disabled { opacity: .6; cursor: not-allowed; }

.withdraw-balance-row {
  display: flex; align-items: center; gap: 8px;
  background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 10px; padding: 11px 14px;
  font-size: .88rem; color: #1e40af;
}
.withdraw-balance-row strong { font-family: 'DM Mono', monospace; }

.confirm-summary { display: flex; flex-direction: column; gap: 12px; }
.confirm-row { display: flex; justify-content: space-between; align-items: center; }
.confirm-label { font-size: .82rem; color: #6b7589; }
.confirm-val { font-size: .9rem; font-weight: 600; color: #0f1728; }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 10px;
  padding: 13px 18px; border-radius: 12px;
  font-size: .875rem; font-weight: 600;
  box-shadow: 0 8px 30px rgba(0,0,0,.15);
  z-index: 9999; animation: slide-in .25s ease;
}
@keyframes slide-in {
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: none; }
}
.toast-success { background: #059669; color: #fff; }
.toast-error   { background: #ef4444; color: #fff; }
.toast-close {
  background: transparent; border: none; color: inherit;
  cursor: pointer; font-size: 1rem; margin-left: auto;
  display: flex; align-items: center;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
