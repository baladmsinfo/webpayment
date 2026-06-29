<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Accounting</h1>
        <p class="page-sub">General ledger, journal entries and trial balance</p>
      </div>
      <div class="header-actions">
        <button class="btn-seed" @click="doSeedAccounts" :disabled="seedLoading">
          <span v-if="seedLoading" class="mdi mdi-loading spin-icon"></span>
          <span v-else class="mdi mdi-database-plus-outline"></span>
          Seed Accounts
        </button>
        <button class="icon-btn" @click="refresh" :class="{ spinning: loading }">
          <span class="mdi mdi-refresh"></span>
        </button>
      </div>
    </div>

    <div v-if="seedMsg" class="seed-banner" :class="seedMsg.ok ? 'banner-ok' : 'banner-err'">
      <span class="mdi" :class="seedMsg.ok ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
      {{ seedMsg.text }}
    </div>

    <!-- ── Tabs ── -->
    <div class="tab-bar">
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'accounts' }" @click="switchTab('accounts')">
        <span class="mdi mdi-format-list-bulleted-square"></span> Chart of Accounts
      </button>
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'entries' }" @click="switchTab('entries')">
        <span class="mdi mdi-book-open-outline"></span> Journal Entries
      </button>
      <button class="tab-btn" :class="{ 'tab-active': activeTab === 'trial' }" @click="switchTab('trial')">
        <span class="mdi mdi-scale-balance"></span> Trial Balance
      </button>
    </div>

    <!-- ── Chart of Accounts Filters ── -->
    <div class="filter-card" v-show="activeTab === 'accounts'">
      <div class="filter-card-header">
        <div class="filter-title-wrap">
          <div class="filter-icon"><span class="mdi mdi-filter-outline"></span></div>
          <span class="filter-title">Filters</span>
        </div>
        <div class="filter-btns">
          <button class="btn-clear" @click="clearAccountFilters">
            <span class="mdi mdi-close-circle-outline"></span>Clear
          </button>
          <button class="btn-apply" @click="loadAccounts">
            <span class="mdi mdi-magnify"></span>Apply
          </button>
        </div>
      </div>
      <div class="filter-fields-row">
        <div class="filter-field-group">
          <label class="filter-label">Account Type</label>
          <select class="filter-select" v-model="accFilters.type" @change="loadAccounts">
            <option value="">All Types</option>
            <option>ASSET</option><option>LIABILITY</option>
            <option>REVENUE</option><option>EXPENSE</option><option>EQUITY</option>
          </select>
        </div>
        <div class="filter-field-group">
          <label class="filter-label">Category</label>
          <select class="filter-select" v-model="accFilters.category" @change="loadAccounts">
            <option value="">All Categories</option>
            <option>CASH</option><option>BANK</option><option>WALLET</option>
            <option>PAYABLE</option><option>RECEIVABLE</option><option>REVENUE</option>
            <option>COMMISSION</option><option>SETTLEMENT</option><option>TAX</option>
            <option>EXPENSE</option><option>SUSPENSE</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ── Journal Entries Filters ── -->
    <div class="filter-card" v-show="activeTab === 'entries'">
      <div class="filter-card-header">
        <div class="filter-title-wrap">
          <div class="filter-icon"><span class="mdi mdi-filter-outline"></span></div>
          <span class="filter-title">Filters</span>
        </div>
        <div class="filter-btns">
          <button class="btn-clear" @click="clearEntryFilters"><span class="mdi mdi-close-circle-outline"></span>Clear</button>
          <button class="btn-apply" @click="loadEntries"><span class="mdi mdi-magnify"></span>Apply</button>
        </div>
      </div>
      <div class="filter-fields-row filter-fields-3">
        <div class="filter-field-group">
          <label class="filter-label">From Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.from }">
            <span class="mdi mdi-calendar-start-outline filter-field-icon"></span>
            <input v-model="entryFilters.fromDate" type="date" class="filter-input"
              @focus="focuses.from = true" @blur="focuses.from = false" />
          </div>
        </div>
        <div class="filter-field-group">
          <label class="filter-label">To Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.to }">
            <span class="mdi mdi-calendar-end-outline filter-field-icon"></span>
            <input v-model="entryFilters.toDate" type="date" class="filter-input"
              @focus="focuses.to = true" @blur="focuses.to = false" />
          </div>
        </div>
        <div class="filter-field-group">
          <label class="filter-label">Entry Type</label>
          <select class="filter-select" v-model="entryFilters.entryType">
            <option value="">All</option>
            <option value="DEBIT">Debit</option>
            <option value="CREDIT">Credit</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ── Trial Balance Date Filter ── -->
    <div class="filter-card" v-show="activeTab === 'trial'">
      <div class="filter-card-header">
        <div class="filter-title-wrap">
          <div class="filter-icon"><span class="mdi mdi-filter-outline"></span></div>
          <span class="filter-title">Period</span>
        </div>
        <div class="filter-btns">
          <button class="btn-clear" @click="clearTrialFilters"><span class="mdi mdi-close-circle-outline"></span>Clear</button>
          <button class="btn-apply" @click="loadTrialBalance"><span class="mdi mdi-magnify"></span>Run</button>
        </div>
      </div>
      <div class="filter-fields-row">
        <div class="filter-field-group">
          <label class="filter-label">From Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.tf }">
            <span class="mdi mdi-calendar-start-outline filter-field-icon"></span>
            <input v-model="trialFilters.fromDate" type="date" class="filter-input"
              @focus="focuses.tf = true" @blur="focuses.tf = false" />
          </div>
        </div>
        <div class="filter-field-group">
          <label class="filter-label">To Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.tt }">
            <span class="mdi mdi-calendar-end-outline filter-field-icon"></span>
            <input v-model="trialFilters.toDate" type="date" class="filter-input"
              @focus="focuses.tt = true" @blur="focuses.tt = false" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── Chart of Accounts Table ── -->
    <div class="table-card" v-show="activeTab === 'accounts'">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Code</th>
              <th>Account Name</th>
              <th class="th-hide-sm">Category</th>
              <th>Type</th>
              <th class="th-hide-md">Entries</th>
            </tr>
          </thead>
          <tbody v-if="loading">
            <tr v-for="n in accLimit" :key="'ask-'+n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td><div class="skel skel-line-sm"></div></td>
              <td><div class="skel skel-line-lg"></div></td>
              <td class="th-hide-sm"><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td class="th-hide-md"><div class="skel skel-sm"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(a, idx) in accounts" :key="a.id" class="data-row" :class="typeRowClass(a.type)">
              <td class="td-sno">{{ (accPage-1)*accLimit + idx + 1 }}</td>
              <td><span class="gl-code">{{ a.code }}</span></td>
              <td>
                <p class="acc-name">{{ a.name }}</p>
              </td>
              <td class="th-hide-sm">
                <span class="badge-cat">{{ a.category }}</span>
              </td>
              <td>
                <span class="chip" :class="typeChip(a.type)">
                  <span class="chip-dot"></span>{{ a.type }}
                </span>
              </td>
              <td class="th-hide-md">
                <span class="entries-count">{{ a._count?.entries ?? 0 }}</span>
              </td>
            </tr>
            <tr v-if="accounts.length === 0">
              <td colspan="6" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-format-list-bulleted-square"></span></div>
                  <p class="empty-title">No accounts found</p>
                  <p class="empty-desc">Click "Seed Accounts" to initialize the chart of accounts</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">Showing {{ accounts.length === 0 ? 0 : (accPage-1)*accLimit+1 }}–{{ Math.min(accPage*accLimit, accTotal) }} of {{ accTotal }}</span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="accLimitVal" @change="onAccLimitChange(accLimitVal)">
            <option v-for="n in [10,25,50,100]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="accPage <= 1" @click="onAccPageChange(accPage-1)"><span class="mdi mdi-chevron-left"></span></button>
          <template v-for="p in accPageWindow" :key="p">
            <button class="pag-btn" :class="{ 'pag-btn-active': p === accPage }" @click="onAccPageChange(p)">{{ p }}</button>
          </template>
          <button class="pag-btn" :disabled="accPage >= accTotalPages" @click="onAccPageChange(accPage+1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <!-- ── Journal Entries Table ── -->
    <div class="table-card" v-show="activeTab === 'entries'">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Transaction ID</th>
              <th class="th-hide-sm">Account</th>
              <th>Type</th>
              <th>Amount</th>
              <th class="th-hide-md">Narration</th>
              <th class="th-hide-md">Date</th>
            </tr>
          </thead>
          <tbody v-if="entryLoading">
            <tr v-for="n in entryLimit" :key="'esk-'+n" class="skel-row">
              <td><div class="skel skel-sm"></div></td>
              <td><div class="skel skel-line-lg"></div></td>
              <td class="th-hide-sm"><div class="skel skel-line-md"></div></td>
              <td><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-line-md"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-lg"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(e, idx) in entries" :key="e.id" class="data-row">
              <td class="td-sno">{{ (entryPage-1)*entryLimit + idx + 1 }}</td>
              <td>
                <p class="txn-id">{{ e.transactionId }}</p>
              </td>
              <td class="th-hide-sm">
                <p class="acc-name">{{ e.account?.name }}</p>
                <p class="gl-code-small">{{ e.account?.code }}</p>
              </td>
              <td>
                <span class="chip" :class="e.entryType === 'DEBIT' ? 'chip-red' : 'chip-green'">
                  <span class="chip-dot"></span>{{ e.entryType }}
                </span>
              </td>
              <td>
                <span class="amount-val" :class="e.entryType === 'DEBIT' ? 'text-debit' : 'text-credit'">
                  ₹{{ fmtAmt(e.amount) }}
                </span>
              </td>
              <td class="th-hide-md">
                <span class="narration-text">{{ e.narration || '—' }}</span>
              </td>
              <td class="th-hide-md">
                <div class="date-cell">
                  <span class="date-main">{{ formatDate(e.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(e.createdAt) }}</span>
                </div>
              </td>
            </tr>
            <tr v-if="entries.length === 0">
              <td colspan="7" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-book-open-outline"></span></div>
                  <p class="empty-title">No journal entries</p>
                  <p class="empty-desc">GL entries are auto-posted when transactions are processed</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">Showing {{ entries.length === 0 ? 0 : (entryPage-1)*entryLimit+1 }}–{{ Math.min(entryPage*entryLimit, entryTotal) }} of {{ entryTotal }}</span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="entryLimitVal" @change="onEntryLimitChange(entryLimitVal)">
            <option v-for="n in [10,25,50,100]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="entryPage <= 1" @click="onEntryPageChange(entryPage-1)"><span class="mdi mdi-chevron-left"></span></button>
          <template v-for="p in entryPageWindow" :key="p">
            <button class="pag-btn" :class="{ 'pag-btn-active': p === entryPage }" @click="onEntryPageChange(p)">{{ p }}</button>
          </template>
          <button class="pag-btn" :disabled="entryPage >= entryTotalPages" @click="onEntryPageChange(entryPage+1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <!-- ── Trial Balance ── -->
    <div class="table-card" v-show="activeTab === 'trial'">
      <!-- Summary Bar -->
      <div v-if="trialBalance" class="trial-summary">
        <div class="trial-sum-cell">
          <span class="trial-sum-label">Total Debits</span>
          <span class="trial-sum-val debit-val">₹{{ fmtAmt(trialBalance.totals?.totalDebits) }}</span>
        </div>
        <div class="trial-sum-sep"></div>
        <div class="trial-sum-cell">
          <span class="trial-sum-label">Total Credits</span>
          <span class="trial-sum-val credit-val">₹{{ fmtAmt(trialBalance.totals?.totalCredits) }}</span>
        </div>
        <div class="trial-sum-sep"></div>
        <div class="trial-sum-cell">
          <span class="trial-sum-label">Balance</span>
          <span class="trial-sum-val" :class="trialBalance.totals?.balanced ? 'balanced-val' : 'imbalanced-val'">
            {{ trialBalance.totals?.balanced ? 'Balanced ✓' : 'Imbalanced ✗' }}
          </span>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Account Name</th>
              <th class="th-hide-sm">Type</th>
              <th class="text-right">Debit (₹)</th>
              <th class="text-right">Credit (₹)</th>
              <th class="text-right th-hide-md">Balance (₹)</th>
            </tr>
          </thead>
          <tbody v-if="trialLoading">
            <tr v-for="n in 8" :key="'tsk-'+n" class="skel-row">
              <td><div class="skel skel-line-sm"></div></td>
              <td><div class="skel skel-line-lg"></div></td>
              <td class="th-hide-sm"><div class="skel skel-chip"></div></td>
              <td><div class="skel skel-line-md" style="margin-left:auto"></div></td>
              <td><div class="skel skel-line-md" style="margin-left:auto"></div></td>
              <td class="th-hide-md"><div class="skel skel-line-md" style="margin-left:auto"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <template v-for="group in trialGroups" :key="group.type">
              <tr class="group-header">
                <td colspan="6">
                  <span class="group-label">{{ group.type }}</span>
                  <span class="group-count">{{ group.accounts.length }} accounts</span>
                </td>
              </tr>
              <tr v-for="a in group.accounts" :key="a.id" class="data-row">
                <td><span class="gl-code">{{ a.code }}</span></td>
                <td><span class="acc-name">{{ a.name }}</span></td>
                <td class="th-hide-sm">
                  <span class="badge-cat">{{ a.category }}</span>
                </td>
                <td class="text-right">
                  <span class="mono-num debit-val">{{ a.totalDebits > 0 ? fmtAmt(a.totalDebits) : '—' }}</span>
                </td>
                <td class="text-right">
                  <span class="mono-num credit-val">{{ a.totalCredits > 0 ? fmtAmt(a.totalCredits) : '—' }}</span>
                </td>
                <td class="text-right th-hide-md">
                  <span class="mono-num" :class="a.balance >= 0 ? 'credit-val' : 'debit-val'">
                    {{ fmtAmt(Math.abs(a.balance)) }}{{ a.balance < 0 ? ' (Dr)' : ' (Cr)' }}
                  </span>
                </td>
              </tr>
            </template>
            <tr v-if="!trialLoading && (!trialBalance || !trialBalance.accounts?.length)">
              <td colspan="6" class="empty-td">
                <div class="empty-state">
                  <div class="empty-icon"><span class="mdi mdi-scale-balance"></span></div>
                  <p class="empty-title">No trial balance data</p>
                  <p class="empty-desc">Select a date range and click Run to generate the trial balance</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useAccountingApi } from "@/composables/apis/useAccountingApi";

const { getAccounts, getEntries, getTrialBalance, seedAccounts } = useAccountingApi();

/* ── State ── */
const loading     = ref(false);
const entryLoading = ref(false);
const trialLoading = ref(false);
const seedLoading  = ref(false);
const activeTab    = ref<'accounts'|'entries'|'trial'>('accounts');
const seedMsg      = ref<{ ok: boolean; text: string }|null>(null);

const accounts = ref<any[]>([]);
const entries  = ref<any[]>([]);
const trialBalance = ref<any>(null);

const accPage = ref(1); const accLimit = ref(25); const accLimitVal = ref(25); const accTotal = ref(0);
const entryPage = ref(1); const entryLimit = ref(25); const entryLimitVal = ref(25); const entryTotal = ref(0);

const focuses = reactive({ from: false, to: false, tf: false, tt: false });
const accFilters   = reactive({ type: '', category: '' });
const entryFilters = reactive({ fromDate: '', toDate: '', entryType: '' });
const trialFilters = reactive({ fromDate: '', toDate: '' });

/* ── Helpers ── */
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : '';
const fmtAmt     = (v: any)    => Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const typeChip = (t: string) => ({
  'chip-blue':  t === 'ASSET',
  'chip-amber': t === 'LIABILITY',
  'chip-green': t === 'REVENUE',
  'chip-red':   t === 'EXPENSE',
  'chip-grey':  t === 'EQUITY',
});
const typeRowClass = (t: string) => ({ 'row-asset': t === 'ASSET', 'row-revenue': t === 'REVENUE' });

/* ── Pagination ── */
const accTotalPages   = computed(() => Math.max(1, Math.ceil(accTotal.value / accLimit.value)));
const accPageWindow   = computed(() => { const c = accPage.value, t = accTotalPages.value; const p: number[] = []; for (let i = Math.max(1,c-1); i <= Math.min(t,c+1); i++) p.push(i); return p; });
const entryTotalPages = computed(() => Math.max(1, Math.ceil(entryTotal.value / entryLimit.value)));
const entryPageWindow = computed(() => { const c = entryPage.value, t = entryTotalPages.value; const p: number[] = []; for (let i = Math.max(1,c-1); i <= Math.min(t,c+1); i++) p.push(i); return p; });

/* ── Trial Balance groups ── */
const trialGroups = computed(() => {
  if (!trialBalance.value?.accounts) return [];
  const order = ['ASSET','LIABILITY','REVENUE','EXPENSE','EQUITY'];
  const groups: Record<string, any[]> = {};
  for (const a of trialBalance.value.accounts) {
    if (!groups[a.type]) groups[a.type] = [];
    groups[a.type].push(a);
  }
  return order.filter(t => groups[t]?.length).map(t => ({ type: t, accounts: groups[t] }));
});

/* ── API ── */
async function loadAccounts() {
  loading.value = true;
  try {
    const res = await getAccounts({ page: accPage.value, limit: accLimit.value, type: accFilters.type || undefined, category: accFilters.category || undefined });
    accounts.value = res.data     || [];
    accTotal.value = res.meta?.total || 0;
  } finally { loading.value = false; }
}

async function loadEntries() {
  entryLoading.value = true;
  try {
    const res = await getEntries({ page: entryPage.value, limit: entryLimit.value, fromDate: entryFilters.fromDate || undefined, toDate: entryFilters.toDate || undefined, entryType: entryFilters.entryType || undefined });
    entries.value    = res.data       || [];
    entryTotal.value = res.meta?.total || 0;
  } finally { entryLoading.value = false; }
}

async function loadTrialBalance() {
  trialLoading.value = true;
  try {
    const res = await getTrialBalance({ fromDate: trialFilters.fromDate || undefined, toDate: trialFilters.toDate || undefined });
    trialBalance.value = res.data || null;
  } finally { trialLoading.value = false; }
}

function switchTab(tab: 'accounts'|'entries'|'trial') {
  activeTab.value = tab;
  if (tab === 'accounts') loadAccounts();
  if (tab === 'entries')  loadEntries();
  if (tab === 'trial')    loadTrialBalance();
}

async function refresh() {
  if (activeTab.value === 'accounts') loadAccounts();
  if (activeTab.value === 'entries')  loadEntries();
  if (activeTab.value === 'trial')    loadTrialBalance();
}

async function doSeedAccounts() {
  seedLoading.value = true;
  seedMsg.value = null;
  try {
    const res = await seedAccounts();
    if (res.statusCode === '00') {
      seedMsg.value = { ok: true, text: res.message || 'Accounts seeded successfully' };
      loadAccounts();
    } else {
      seedMsg.value = { ok: false, text: res.message || 'Seed failed' };
    }
  } catch (e: any) {
    seedMsg.value = { ok: false, text: e?.response?.data?.message || 'Network error' };
  } finally {
    seedLoading.value = false;
    setTimeout(() => { seedMsg.value = null; }, 5000);
  }
}

function clearAccountFilters() { accFilters.type = ''; accFilters.category = ''; loadAccounts(); }
function clearEntryFilters()   { entryFilters.fromDate = ''; entryFilters.toDate = ''; entryFilters.entryType = ''; loadEntries(); }
function clearTrialFilters()   { trialFilters.fromDate = ''; trialFilters.toDate = ''; loadTrialBalance(); }

function onAccPageChange(p: number)    { accPage.value = p; loadAccounts(); }
function onAccLimitChange(l: number)   { accLimit.value = l; accPage.value = 1; loadAccounts(); }
function onEntryPageChange(p: number)  { entryPage.value = p; loadEntries(); }
function onEntryLimitChange(l: number) { entryLimit.value = l; entryPage.value = 1; loadEntries(); }

onMounted(() => { loadAccounts(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.page-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 14px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title  { font-size: 20px; font-weight: 800; color: #0f172a; }
@media(min-width:640px){ .page-title { font-size: 24px; } }
.page-sub    { font-size: 12px; color: #64748b; margin-top: 3px; }
.header-actions { display: flex; align-items: center; gap: 8px; }

.btn-seed {
  display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 9px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #fff; border: none;
  font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
  cursor: pointer; box-shadow: 0 3px 12px rgba(124,58,237,.25); transition: filter .13s;
}
.btn-seed:hover { filter: brightness(1.08); }
.btn-seed:disabled { opacity: .6; cursor: not-allowed; }
.btn-seed .mdi { font-size: 16px; }

.icon-btn { width: 36px; height: 36px; border-radius: 9px; background: #fff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #64748b; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: background .13s, color .13s; }
.icon-btn:hover { background: #f1f5f9; color: #1142d4; }
.icon-btn.spinning .mdi { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.seed-banner { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; }
.banner-ok  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.banner-err { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.seed-banner .mdi { font-size: 17px; }

.tab-bar { display: flex; gap: 4px; background: #f1f5f9; border-radius: 10px; padding: 4px; flex-wrap: wrap; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; }
.tab-btn .mdi { font-size: 15px; }
.tab-active { background: #fff; color: #1142d4; box-shadow: 0 1px 4px rgba(0,0,0,.08); }

.filter-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.filter-card-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.filter-title-wrap  { display: flex; align-items: center; gap: 8px; }
.filter-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(17,66,212,.08); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.filter-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.filter-btns  { display: flex; gap: 8px; }
.btn-clear { display: flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .13s; }
.btn-clear:hover { border-color: #ef4444; color: #ef4444; background: #fff1f2; }
.btn-apply { display: flex; align-items: center; gap: 5px; padding: 7px 16px; border-radius: 8px; background: linear-gradient(135deg,#1142d4,#1654f8); color: #fff; border: none; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(17,66,212,.22); transition: filter .13s; }
.btn-apply:hover { filter: brightness(1.07); }
.filter-fields-row { display: grid; grid-template-columns: 1fr; gap: 12px; padding: 16px 18px; }
@media(min-width:640px) { .filter-fields-row { grid-template-columns: repeat(2,1fr); } }
.filter-fields-3 {}
@media(min-width:1024px) { .filter-fields-3 { grid-template-columns: repeat(3,1fr); } }
.filter-field-group { display: flex; flex-direction: column; gap: 5px; }
.filter-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.filter-input-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 9px; padding: 0 10px; height: 42px; transition: border-color .15s, box-shadow .15s; }
.filter-input-wrap.focused { border-color: #1142d4; background: #fff; box-shadow: 0 0 0 3px rgba(17,66,212,.09); }
.filter-field-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.filter-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif; }
.filter-input::placeholder { color: #94a3b8; }
.filter-input[type="date"] { min-width: 0; }
.filter-select { height: 42px; padding: 0 12px; border-radius: 9px; border: 1.5px solid #e2e8f0; background: #f8fafc; font-size: 13px; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; transition: border-color .15s; width: 100%; }
.filter-select:focus { border-color: #1142d4; }

.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.table-wrap  { overflow-x: auto; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th { padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
.th-sno { width: 56px; text-align: center; }
.text-right { text-align: right !important; }
.data-row { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; vertical-align: middle; }
.td-sno { text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; font-family: 'DM Mono', monospace; }
.group-header td { background: #f8fafc; padding: 8px 14px; border-bottom: 1px solid #e8edf3; border-top: 1px solid #e8edf3; }
.group-label { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: .08em; margin-right: 8px; }
.group-count { font-size: 10px; color: #94a3b8; font-weight: 600; }
.row-asset   { border-left: 2px solid rgba(17,66,212,.15); }
.row-revenue { border-left: 2px solid rgba(5,150,105,.15); }
.gl-code       { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; color: #1142d4; background: rgba(17,66,212,.06); padding: 2px 8px; border-radius: 5px; }
.gl-code-small { font-family: 'DM Mono', monospace; font-size: 10px; color: #94a3b8; margin-top: 2px; }
.acc-name { font-size: 13px; font-weight: 600; color: #1e293b; }
.badge-cat { font-size: 10px; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 5px; text-transform: uppercase; letter-spacing: .05em; }
.entries-count { font-family: 'DM Mono', monospace; font-size: 12px; color: #64748b; font-weight: 700; }
.txn-id { font-family: 'DM Mono', monospace; font-size: 11px; color: #334155; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.amount-val { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; color: #0f172a; }
.mono-num   { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; }
.debit-val  { color: #be123c; }
.credit-val { color: #16a34a; }
.text-debit { color: #be123c; }
.text-credit { color: #16a34a; }
.narration-text { font-size: 11px; color: #64748b; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; }
.date-cell { display: flex; flex-direction: column; gap: 2px; }
.date-main { font-size: 12px; font-weight: 600; color: #334155; }
.date-time { font-size: 11px; color: #94a3b8; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; white-space: nowrap; text-transform: uppercase; letter-spacing: .05em; }
.chip-dot   { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-grey  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }

.trial-summary { display: flex; align-items: center; gap: 0; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; gap: 0; }
.trial-sum-cell  { display: flex; flex-direction: column; gap: 3px; padding: 0 24px; }
.trial-sum-cell:first-child { padding-left: 0; }
.trial-sum-sep   { width: 1px; height: 36px; background: #e8edf3; flex-shrink: 0; }
.trial-sum-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.trial-sum-val   { font-family: 'DM Mono', monospace; font-size: 16px; font-weight: 800; color: #0f172a; }
.balanced-val    { color: #16a34a; }
.imbalanced-val  { color: #be123c; }

.empty-td    { padding: 48px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon  { width: 60px; height: 60px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 280px; line-height: 1.5; }
.pagination-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px 16px; border-top: 1px solid #f1f5f9; }
.pag-info { font-size: 12px; color: #64748b; font-weight: 500; }
.pag-controls { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.pag-limit { height: 32px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 11px; font-weight: 600; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; outline: none; margin-right: 4px; }
.pag-btn { min-width: 32px; height: 32px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 700; color: #475569; font-family: 'DM Sans', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .13s; }
.pag-btn:hover:not(:disabled) { border-color: #1142d4; color: #1142d4; background: rgba(17,66,212,.05); }
.pag-btn:disabled { opacity: .4; cursor: not-allowed; }
.pag-btn-active { background: #1142d4 !important; color: #fff !important; border-color: #1142d4 !important; }
.pag-btn .mdi   { font-size: 16px; }
.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 5px; }
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-row td { padding: 13px 14px; }
.skel-sm { height: 12px; width: 28px; }
.skel-line-lg { height: 12px; width: 160px; }
.skel-line-md { height: 12px; width: 100px; }
.skel-line-sm { height: 10px; width: 70px; }
.skel-chip { height: 20px; width: 64px; border-radius: 9999px; }
.mt-1 { margin-top: 4px; }
@media (max-width: 1023px) { .th-hide-md { display: none; } }
@media (max-width: 767px)  { .th-hide-sm { display: none; } }
@media (min-width: 768px)  { .th-hide-lg { display: none; } }
.spin-icon { animation: spin .7s linear infinite; }
</style>
