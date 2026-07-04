<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="page-sub">Transactions, commissions, GST &amp; settlement reporting</p>
      </div>
      <div class="header-actions">
        <button class="icon-btn" @click="refreshActive" :class="{ spinning: activeLoading }">
          <span class="mdi mdi-refresh"></span>
        </button>
      </div>
    </div>

    <!-- ── Stats Strip (Overall Summary) ── -->
    <div class="stats-strip">
      <div class="stat-pill" style="--c:#1142d4">
        <span class="pill-label">Transactions</span>
        <span class="pill-val">{{ fmtInt(summary?.count) }}</span>
      </div>
      <div class="stat-pill" style="--c:#059669">
        <span class="pill-label">Gross Amount</span>
        <span class="pill-val">₹{{ fmtAmt(summary?.amount) }}</span>
      </div>
      <div class="stat-pill" style="--c:#7c3aed">
        <span class="pill-label">Total Commission</span>
        <span class="pill-val">₹{{ fmtAmt(summary?.totalCommission) }}</span>
      </div>
      <div class="stat-pill" style="--c:#d97706">
        <span class="pill-label">GST</span>
        <span class="pill-val">₹{{ fmtAmt(summary?.gstAmount) }}</span>
      </div>
      <div class="stat-pill" style="--c:#0891b2">
        <span class="pill-label">Net Amount</span>
        <span class="pill-val">₹{{ fmtAmt(summary?.netAmount) }}</span>
      </div>
    </div>

    <!-- ── Filter Card ── -->
    <div class="filter-card">
      <div class="filter-card-header">
        <div class="filter-title-wrap">
          <div class="filter-icon"><span class="mdi mdi-filter-outline"></span></div>
          <span class="filter-title">Filters</span>
        </div>
        <div class="filter-btns">
          <button class="btn-clear" @click="clearFilters"><span class="mdi mdi-close-circle-outline"></span>Clear</button>
          <button class="btn-apply" @click="applyFilters"><span class="mdi mdi-magnify"></span>Apply Filters</button>
        </div>
      </div>

      <div class="filter-fields">
        <!-- From Date -->
        <div class="filter-field-group">
          <label class="filter-label">From Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.from }">
            <span class="mdi mdi-calendar-start-outline filter-field-icon"></span>
            <input v-model="filters.fromDate" type="date" class="filter-input"
              @focus="focuses.from = true" @blur="focuses.from = false" />
          </div>
        </div>

        <!-- To Date -->
        <div class="filter-field-group">
          <label class="filter-label">To Date</label>
          <div class="filter-input-wrap" :class="{ focused: focuses.to }">
            <span class="mdi mdi-calendar-end-outline filter-field-icon"></span>
            <input v-model="filters.toDate" type="date" class="filter-input"
              @focus="focuses.to = true" @blur="focuses.to = false" />
          </div>
        </div>

        <!-- Merchant Autocomplete -->
        <div class="filter-field-group">
          <label class="filter-label">Merchant</label>
          <div class="entity-dropdown-wrap">
            <div class="filter-input-wrap entity-input-wrap" :class="{ focused: merchantDropOpen }" @click="merchantDropOpen = !merchantDropOpen">
              <span class="mdi mdi-store-outline filter-field-icon"></span>
              <input v-model="merchantSearch" class="filter-input" placeholder="All merchants"
                @focus="merchantDropOpen = true" @input="merchantDropOpen = true" @blur="onMerchantBlur" autocomplete="off" />
              <button v-if="filters.merchantId" class="search-clear" @mousedown.prevent="clearMerchant"><span class="mdi mdi-close-circle"></span></button>
              <span class="mdi mdi-chevron-down entity-chevron" :class="{ open: merchantDropOpen }"></span>
            </div>
            <div class="entity-drop" v-if="merchantDropOpen && filteredMerchants.length">
              <div class="entity-drop-item" v-for="m in filteredMerchants" :key="m.id" @mousedown.prevent="selectMerchant(m)" :class="{ 'drop-item-active': filters.merchantId === m.id }">
                <div class="drop-avatar" :style="{ background: avatarColor(m.legal_name || m.business_name || '?') }">{{ initials(m.legal_name || m.business_name || '?') }}</div>
                <div>
                  <p class="drop-name">{{ m.legal_name || m.business_name }}</p>
                  <p class="drop-sub">{{ m.mid }}</p>
                </div>
                <span v-if="filters.merchantId === m.id" class="mdi mdi-check drop-check"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Vendor Autocomplete -->
        <div class="filter-field-group">
          <label class="filter-label">Vendor</label>
          <div class="entity-dropdown-wrap">
            <div class="filter-input-wrap entity-input-wrap" :class="{ focused: vendorDropOpen }" @click="vendorDropOpen = !vendorDropOpen">
              <span class="mdi mdi-factory filter-field-icon"></span>
              <input v-model="vendorSearch" class="filter-input" placeholder="All vendors"
                @focus="vendorDropOpen = true" @input="vendorDropOpen = true" @blur="onVendorBlur" autocomplete="off" />
              <button v-if="filters.vendorId" class="search-clear" @mousedown.prevent="clearVendor"><span class="mdi mdi-close-circle"></span></button>
              <span class="mdi mdi-chevron-down entity-chevron" :class="{ open: vendorDropOpen }"></span>
            </div>
            <div class="entity-drop" v-if="vendorDropOpen && filteredVendors.length">
              <div class="entity-drop-item" v-for="v in filteredVendors" :key="v.id" @mousedown.prevent="selectVendor(v)" :class="{ 'drop-item-active': filters.vendorId === v.id }">
                <div class="drop-avatar" :style="{ background: avatarColor(v.name || '?') }">{{ initials(v.name || '?') }}</div>
                <div>
                  <p class="drop-name">{{ v.name }}</p>
                  <p class="drop-sub">{{ v.code }}</p>
                </div>
                <span v-if="filters.vendorId === v.id" class="mdi mdi-check drop-check"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="filter-field-group">
          <label class="filter-label">Status</label>
          <select class="filter-select" v-model="filters.status">
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <!-- Settlement Status -->
        <div class="filter-field-group">
          <label class="filter-label">Settlement Status</label>
          <select class="filter-select" v-model="filters.settlementStatus">
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <!-- Txn Type -->
        <div class="filter-field-group">
          <label class="filter-label">Txn Type</label>
          <select class="filter-select" v-model="filters.txnType">
            <option value="">All Types</option>
            <option v-for="t in txnTypeOptions" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <!-- Provider -->
        <div class="filter-field-group">
          <label class="filter-label">Provider</label>
          <select class="filter-select" v-model="filters.provider">
            <option value="">All Providers</option>
            <option v-for="p in providerOptions" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="tab-bar">
      <button v-for="t in tabs" :key="t.key" class="tab-btn" :class="{ 'tab-active': activeTab === t.key }" @click="switchTab(t.key)">
        <span class="mdi" :class="t.icon"></span> {{ t.label }}
      </button>
    </div>

    <!-- ── OVERVIEW TAB (filtered transaction list) ── -->
    <div v-show="activeTab === 'overview'" class="table-card">
      <div class="tab-toolbar">
        <span class="tab-toolbar-title">Transactions <span class="tab-toolbar-count">({{ fmtInt(txnTotal) }})</span></span>
        <button class="btn-download" :disabled="exporting || txnTotal === 0" @click="exportOverviewCsv">
          <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
        </button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-sno">S.No</th>
              <th>Reference</th>
              <th>Merchant</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Settlement</th>
              <th class="text-right">Commission</th>
              <th class="text-right">GST</th>
              <th class="text-right">Net</th>
              <th class="th-hide-md">Date</th>
              <th class="th-action">Action</th>
            </tr>
          </thead>
          <tbody v-if="txnLoading">
            <tr v-for="n in txnLimit" :key="'tsk-'+n" class="skel-row">
              <td colspan="13"><div class="skel skel-line-lg"></div></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(t, idx) in transactions" :key="t.id" class="data-row">
              <td class="td-sno">{{ (txnPage-1)*txnLimit + idx + 1 }}</td>
              <td><span class="mono-sm">{{ t.tr || t.transactionid || '—' }}</span></td>
              <td>{{ merchantName(t.merchantId) }}</td>
              <td>{{ vendorName(t.vendorId) }}</td>
              <td><span class="amount-val">₹{{ fmtAmt(t.amount) }}</span></td>
              <td><span class="chip chip-blue">{{ t.provider }}</span></td>
              <td><span class="chip" :class="statusClass(t.status)"><span class="chip-dot"></span>{{ t.status }}</span></td>
              <td><span class="chip" :class="statusClass(t.settlementStatus)">{{ t.settlementStatus ?? 'N/A' }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(t.totalCommission) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(t.gstAmount) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(t.netAmount) }}</span></td>
              <td class="th-hide-md">
                <div class="date-cell"><span class="date-main">{{ fmtDate(t.createdAt) }}</span><span class="date-time">{{ fmtTime(t.createdAt) }}</span></div>
              </td>
              <td>
                <button class="btn-view" title="View Detail" @click="goToDetail(t.tr)"><span class="mdi mdi-eye-outline"></span></button>
              </td>
            </tr>
            <tr v-if="transactions.length === 0">
              <td colspan="13" class="empty-td">
                <div class="empty-state"><div class="empty-icon"><span class="mdi mdi-swap-horizontal"></span></div><p class="empty-title">No transactions found</p><p class="empty-desc">Try adjusting your filters</p></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <span class="pag-info">Showing {{ transactions.length === 0 ? 0 : (txnPage-1)*txnLimit+1 }}–{{ Math.min(txnPage*txnLimit, txnTotal) }} of {{ txnTotal }}</span>
        <div class="pag-controls">
          <select class="pag-limit" v-model.number="txnLimitVal" @change="onTxnLimitChange(txnLimitVal)">
            <option v-for="n in [10,20,50,100]" :key="n" :value="n">{{ n }} / page</option>
          </select>
          <button class="pag-btn" :disabled="txnPage <= 1" @click="onTxnPageChange(txnPage-1)"><span class="mdi mdi-chevron-left"></span></button>
          <template v-for="p in txnPageWindow" :key="p"><button class="pag-btn" :class="{ 'pag-btn-active': p === txnPage }" @click="onTxnPageChange(p)">{{ p }}</button></template>
          <button class="pag-btn" :disabled="txnPage >= txnTotalPages" @click="onTxnPageChange(txnPage+1)"><span class="mdi mdi-chevron-right"></span></button>
        </div>
      </div>
    </div>

    <!-- ── DAILY TREND TAB ── -->
    <div v-show="activeTab === 'trend'" class="table-card trend-card">
      <div class="tab-toolbar">
        <span class="tab-toolbar-title">Daily Trend <span class="tab-toolbar-count">({{ fmtInt(trend.length) }} days)</span></span>
        <button class="btn-download" :disabled="exporting || trend.length === 0" @click="exportTrendCsv">
          <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
        </button>
      </div>
      <template v-if="!trendLoading && trend.length">
        <div class="row-2col">
          <div class="chart-block">
            <p class="chart-block-title">Amount &amp; Commission Trend</p>
            <apexchart type="area" height="240" :options="trendAmountOptions" :series="trendAmountSeries" />
          </div>
          <div class="chart-block">
            <p class="chart-block-title">Transaction Count</p>
            <apexchart type="bar" height="240" :options="trendCountOptions" :series="trendCountSeries" />
          </div>
        </div>
        <div class="table-wrap" style="margin-top:14px">
          <table class="data-table">
            <thead>
              <tr><th>Day</th><th class="text-right">Count</th><th class="text-right">Amount</th><th class="text-right">Total Fee</th><th class="text-right">Commission</th><th class="text-right">GST</th><th class="text-right">Net</th></tr>
            </thead>
            <tbody>
              <tr v-for="d in trend" :key="d.day" class="data-row">
                <td>{{ fmtDate(d.day) }}</td>
                <td class="text-right">{{ fmtInt(d.count) }}</td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(d.amount) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(d.totalfee) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(d.totalCommission) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(d.gstAmount) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(d.netAmount) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <div v-else-if="trendLoading" class="skeleton-area"><div v-for="i in 2" :key="i" class="skel-card"><div class="skel" style="height:200px"></div></div></div>
      <div v-else class="empty-state"><div class="empty-icon"><span class="mdi mdi-chart-line"></span></div><p class="empty-title">No trend data</p><p class="empty-desc">Try adjusting the date range</p></div>
    </div>

    <!-- ── VENDOR COMMISSION TAB ── -->
    <div v-show="activeTab === 'vendorCommission'" class="table-card">
      <div class="tab-toolbar">
        <span class="tab-toolbar-title">Vendor Commission <span class="tab-toolbar-count">({{ fmtInt(vendorCommRows.length) }})</span></span>
        <button class="btn-download" :disabled="exporting || vendorCommRows.length === 0" @click="exportGroupedCsv('vendor-commission', vendorCommRows)">
          <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
        </button>
      </div>
      <AggregatorReportsGroupedCommissionTable :loading="vendorCommLoading" :rows="vendorCommRows" name-label="Vendor" empty-icon="mdi-factory" empty-text="No vendor commission data" />
    </div>

    <!-- ── MERCHANT COMMISSION TAB ── -->
    <div v-show="activeTab === 'merchantCommission'" class="table-card">
      <div class="tab-toolbar">
        <span class="tab-toolbar-title">Merchant Commission <span class="tab-toolbar-count">({{ fmtInt(merchantCommRows.length) }})</span></span>
        <button class="btn-download" :disabled="exporting || merchantCommRows.length === 0" @click="exportGroupedCsv('merchant-commission', merchantCommRows)">
          <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
        </button>
      </div>
      <AggregatorReportsGroupedCommissionTable :loading="merchantCommLoading" :rows="merchantCommRows" name-label="Merchant" empty-icon="mdi-store-outline" empty-text="No merchant commission data" />
    </div>

    <!-- ── AGGREGATOR COMMISSION TAB (admin only) ── -->
    <div v-show="activeTab === 'aggregatorCommission'" class="table-card">
      <div v-if="aggregatorCommForbidden" class="empty-state"><div class="empty-icon"><span class="mdi mdi-lock-outline"></span></div><p class="empty-title">Admin Access Required</p><p class="empty-desc">This report is restricted to platform admins.</p></div>
      <template v-else>
        <div class="tab-toolbar">
          <span class="tab-toolbar-title">Aggregator Commission <span class="tab-toolbar-count">({{ fmtInt(aggregatorCommRows.length) }})</span></span>
          <button class="btn-download" :disabled="exporting || aggregatorCommRows.length === 0" @click="exportGroupedCsv('aggregator-commission', aggregatorCommRows)">
            <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
          </button>
        </div>
        <AggregatorReportsGroupedCommissionTable :loading="aggregatorCommLoading" :rows="aggregatorCommRows" name-label="Aggregator" empty-icon="mdi-domain" empty-text="No aggregator commission data" />
      </template>
    </div>

    <!-- ── BANK COMMISSION TAB (admin only) ── -->
    <div v-show="activeTab === 'bankCommission'" class="table-card">
      <div v-if="bankCommForbidden" class="empty-state"><div class="empty-icon"><span class="mdi mdi-lock-outline"></span></div><p class="empty-title">Admin Access Required</p><p class="empty-desc">This report is restricted to platform admins.</p></div>
      <template v-else>
        <div class="tab-toolbar">
          <span class="tab-toolbar-title">Bank Commission <span class="tab-toolbar-count">({{ fmtInt(bankCommRows.length) }})</span></span>
          <button class="btn-download" :disabled="exporting || bankCommRows.length === 0" @click="exportBankCsv">
            <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
          </button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>Provider</th><th class="text-right">Count</th><th class="text-right">Success Txns</th><th class="text-right">Amount</th><th class="text-right">Total Fee</th><th class="text-right">Bank Comm</th><th class="text-right">Total Commission</th><th class="text-right">GST</th><th class="text-right">Net</th></tr>
            </thead>
            <tbody v-if="bankCommLoading"><tr class="skel-row"><td colspan="9"><div class="skel skel-line-lg"></div></td></tr></tbody>
            <tbody v-else>
              <tr v-for="r in bankCommRows" :key="r.provider" class="data-row">
                <td><span class="chip chip-blue">{{ r.provider }}</span></td>
                <td class="text-right">{{ fmtInt(r.count) }}</td>
                <td class="text-right">{{ fmtInt(r.successCount) }}</td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.amount) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.totalfee) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.bankCommission) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.totalCommission) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.gstAmount) }}</span></td>
                <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.netAmount) }}</span></td>
              </tr>
              <tr v-if="bankCommRows.length === 0"><td colspan="9" class="empty-td"><div class="empty-state"><div class="empty-icon"><span class="mdi mdi-bank-outline"></span></div><p class="empty-title">No bank commission data</p></div></td></tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- ── GST REPORT TAB ── -->
    <div v-show="activeTab === 'gst'" class="table-card">
      <div class="gst-toolbar">
        <label class="filter-label">Group By</label>
        <select class="filter-select" v-model="gstGroupBy" @change="loadGst">
          <option value="day">Day</option>
          <option value="merchant">Merchant</option>
          <option value="vendor">Vendor</option>
          <option value="aggregator">Aggregator</option>
          <option value="none">None (Total)</option>
        </select>
        <button class="btn-download" style="margin-left:auto" :disabled="exporting || gstLoading || (gstGroupBy !== 'none' && gstRows.length === 0)" @click="exportGstCsv">
          <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
        </button>
      </div>

      <div v-if="gstLoading" class="skeleton-area"><div v-for="i in 3" :key="i" class="skel-card"><div class="skel skel-line"></div></div></div>

      <div v-else-if="gstGroupBy === 'none' && gstNone" class="commission-summary-grid" style="padding:16px 18px">
        <div class="mini-stat"><span class="mini-stat-label">Transactions</span><span class="mini-stat-val">{{ fmtInt(gstNone.count) }}</span></div>
        <div class="mini-stat"><span class="mini-stat-label">GST Amount</span><span class="mini-stat-val">₹{{ fmtAmt(gstNone.gstAmount) }}</span></div>
        <div class="mini-stat"><span class="mini-stat-label">Total Fee</span><span class="mini-stat-val">₹{{ fmtAmt(gstNone.totalfee) }}</span></div>
        <div class="mini-stat"><span class="mini-stat-label">Amount</span><span class="mini-stat-val">₹{{ fmtAmt(gstNone.amount) }}</span></div>
      </div>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>{{ gstGroupBy === 'day' ? 'Day' : (gstGroupBy.charAt(0).toUpperCase() + gstGroupBy.slice(1)) }}</th>
              <th class="text-right">Count</th>
              <th class="text-right">GST Amount</th>
              <th class="text-right">Total Fee</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, idx) in gstRows" :key="idx" class="data-row">
              <td>{{ gstGroupBy === 'day' ? fmtDate(r.day) : gstEntityLabel(r.id) }}</td>
              <td class="text-right">{{ fmtInt(r.count) }}</td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.gstAmount) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.totalfee) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.amount) }}</span></td>
            </tr>
            <tr v-if="gstRows.length === 0"><td colspan="5" class="empty-td"><div class="empty-state"><div class="empty-icon"><span class="mdi mdi-receipt-text-outline"></span></div><p class="empty-title">No GST data</p></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── SETTLEMENT REPORT TAB ── -->
    <div v-show="activeTab === 'settlement'" class="table-card">
      <div class="tab-toolbar">
        <span class="tab-toolbar-title">Settlement Reconciliation <span class="tab-toolbar-count">({{ fmtInt(settlementRows.length) }})</span></span>
        <button class="btn-download" :disabled="exporting || settlementRows.length === 0" @click="exportSettlementCsv">
          <span class="mdi" :class="exporting ? 'mdi-loading spin-icon' : 'mdi-download'"></span> Download CSV
        </button>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Settlement Status</th><th class="text-right">Count</th><th class="text-right">Amount</th><th class="text-right">Total Fee</th><th class="text-right">Total Commission</th><th class="text-right">GST</th><th class="text-right">Net Amount</th></tr>
          </thead>
          <tbody v-if="settlementLoading"><tr class="skel-row"><td colspan="7"><div class="skel skel-line-lg"></div></td></tr></tbody>
          <tbody v-else>
            <tr v-for="r in settlementRows" :key="r.settlementStatus" class="data-row">
              <td><span class="chip" :class="statusClass(r.settlementStatus)"><span class="chip-dot"></span>{{ r.settlementStatus ?? 'N/A' }}</span></td>
              <td class="text-right">{{ fmtInt(r.count) }}</td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.amount) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.totalfee) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.totalCommission) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.gstAmount) }}</span></td>
              <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.netAmount) }}</span></td>
            </tr>
            <tr v-if="settlementRows.length === 0"><td colspan="7" class="empty-td"><div class="empty-state"><div class="empty-icon"><span class="mdi mdi-bank-transfer-out"></span></div><p class="empty-title">No settlement data</p></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import { useReportsApi } from "~/composables/apis/useReportsApi";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { downloadCsv } from "@/utils/exportCsv";

const apexchart = VueApexCharts;
const router = useRouter();

const {
  getTransactions, getSummary, getDailyTrend,
  getVendorCommissionReport, getMerchantCommissionReport,
  getAggregatorCommissionReport, getBankCommissionReport,
  getGstReport, getSettlementReport,
} = useReportsApi();

const { getMerchants, getVendors } = useAggregatorApi();

/* ── Static options ── */
const providerOptions = ["ISG", "MOS", "WORLD", "BUCKSBOX", "AXIS", "NSDL", "FINO", "CANARA"];
const txnTypeOptions = ["CASH_WITHDRAWAL", "BALANCE_ENQUIRY", "MINI_STATEMENT", "CASH_DEPOSIT", "DMT", "PUS", "PURCHASE", "PAYIN", "ADD_MONEY", "TOPUP", "TRANSFER", "CARD_MAINTENANCE_FEE"];

const tabs = [
  { key: "overview", label: "Overview", icon: "mdi-view-dashboard-outline" },
  { key: "trend", label: "Daily Trend", icon: "mdi-chart-line" },
  { key: "vendorCommission", label: "Vendor Commission", icon: "mdi-factory" },
  { key: "merchantCommission", label: "Merchant Commission", icon: "mdi-store-outline" },
  { key: "aggregatorCommission", label: "Aggregator Commission", icon: "mdi-domain" },
  { key: "bankCommission", label: "Bank Commission", icon: "mdi-bank-outline" },
  { key: "gst", label: "GST Report", icon: "mdi-receipt-text-outline" },
  { key: "settlement", label: "Settlement", icon: "mdi-bank-transfer-out" },
] as const;

type TabKey = typeof tabs[number]["key"];
const activeTab = ref<TabKey>("overview");
const loadedTabs = reactive<Record<string, boolean>>({});

/* ── Filters ── */
const focuses = reactive({ from: false, to: false });
const today = new Date();
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
const toISO = (d: Date) => d.toISOString().slice(0, 10);

const filters = reactive({
  fromDate: toISO(monthStart),
  toDate: toISO(today),
  merchantId: null as string | null,
  vendorId: null as string | null,
  status: "",
  settlementStatus: "",
  txnType: "",
  provider: "",
});

const commonParams = computed(() => ({
  from: filters.fromDate || undefined,
  to: filters.toDate || undefined,
  merchantId: filters.merchantId || undefined,
  vendorId: filters.vendorId || undefined,
  status: filters.status || undefined,
  settlementStatus: filters.settlementStatus || undefined,
  txnType: filters.txnType || undefined,
  provider: filters.provider || undefined,
}));

/* ── Merchant / Vendor dropdowns ── */
const merchants = ref<any[]>([]);
const vendors = ref<any[]>([]);
const merchantSearch = ref("");
const vendorSearch = ref("");
const merchantDropOpen = ref(false);
const vendorDropOpen = ref(false);

const merchantNameById = computed(() => {
  const map: Record<string, string> = {};
  for (const m of merchants.value) map[m.id] = m.legal_name || m.business_name || m.mid;
  return map;
});
const vendorNameById = computed(() => {
  const map: Record<string, string> = {};
  for (const v of vendors.value) map[v.id] = v.name;
  return map;
});
const merchantName = (id: string) => id ? (merchantNameById.value[id] || id) : "—";
const vendorName = (id: string) => id ? (vendorNameById.value[id] || id) : "—";
const gstEntityLabel = (id: string) => {
  if (!id) return "—";
  if (gstGroupBy.value === "merchant") return merchantName(id);
  if (gstGroupBy.value === "vendor") return vendorName(id);
  return id;
};

const filteredMerchants = computed(() => {
  const q = merchantSearch.value.toLowerCase();
  if (!q) return merchants.value.slice(0, 40);
  return merchants.value.filter((m: any) =>
    (m.legal_name || "").toLowerCase().includes(q) || (m.business_name || "").toLowerCase().includes(q) || (m.mid || "").toLowerCase().includes(q)
  ).slice(0, 20);
});
const filteredVendors = computed(() => {
  const q = vendorSearch.value.toLowerCase();
  if (!q) return vendors.value.slice(0, 40);
  return vendors.value.filter((v: any) => (v.name || "").toLowerCase().includes(q) || (v.code || "").toLowerCase().includes(q)).slice(0, 20);
});

function selectMerchant(m: any) { filters.merchantId = m.id; merchantSearch.value = m.legal_name || m.business_name; merchantDropOpen.value = false; }
function clearMerchant() { filters.merchantId = null; merchantSearch.value = ""; }
function onMerchantBlur() { setTimeout(() => { merchantDropOpen.value = false; }, 150); }

function selectVendor(v: any) { filters.vendorId = v.id; vendorSearch.value = v.name; vendorDropOpen.value = false; }
function clearVendor() { filters.vendorId = null; vendorSearch.value = ""; }
function onVendorBlur() { setTimeout(() => { vendorDropOpen.value = false; }, 150); }

async function loadEntityLists() {
  try {
    const [mRes, vRes] = await Promise.all([
      getMerchants({ page: 1, limit: 1000 }),
      getVendors({ page: 1, limit: 1000 }),
    ]);
    merchants.value = mRes?.data || [];
    vendors.value = vRes?.data || [];
  } catch (e) {
    console.error("Failed to load merchant/vendor lists", e);
  }
}

/* ── Helpers ── */
const AVATAR_COLORS = ["#1142d4", "#7c3aed", "#db2777", "#059669", "#d97706", "#dc2626", "#0891b2"];
const avatarColor = (n: string) => AVATAR_COLORS[((n || "?").charCodeAt(0)) % AVATAR_COLORS.length];
const initials = (n: string) => (n || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

const fmtAmt = (v: any) => Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtInt = (v: any) => Number(v || 0).toLocaleString("en-IN");
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtTime = (d: string) => d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

const statusClass = (s: string) => ({
  "chip-green": s === "SUCCESS",
  "chip-red": s === "FAILED",
  "chip-amber": s === "PENDING",
  "chip-grey": !["SUCCESS", "FAILED", "PENDING"].includes(s),
});

/* ── Overview / Summary (top stat strip) ── */
const summary = ref<any>(null);
const summaryLoading = ref(false);
async function loadSummary() {
  summaryLoading.value = true;
  try {
    const res = await getSummary(commonParams.value);
    if (res?.statusCode === "00") summary.value = res.data;
  } finally { summaryLoading.value = false; }
}

/* ── Overview tab: filtered transaction list ── */
const transactions = ref<any[]>([]);
const txnLoading = ref(false);
const txnPage = ref(1); const txnLimit = ref(20); const txnLimitVal = ref(20); const txnTotal = ref(0);
const txnTotalPages = computed(() => Math.max(1, Math.ceil(txnTotal.value / txnLimit.value)));
const txnPageWindow = computed(() => { const c = txnPage.value, t = txnTotalPages.value; const p: number[] = []; for (let i = Math.max(1, c - 1); i <= Math.min(t, c + 1); i++) p.push(i); return p; });

async function loadTransactions() {
  txnLoading.value = true;
  try {
    const res = await getTransactions({ ...commonParams.value, page: txnPage.value, limit: txnLimit.value });
    if (res?.statusCode === "00") {
      transactions.value = res.data?.transactions || [];
      txnTotal.value = res.data?.total || 0;
    }
  } finally { txnLoading.value = false; }
}
async function loadOverview() {
  await Promise.all([loadSummary(), loadTransactions()]);
  loadedTabs.overview = true;
}
function onTxnPageChange(p: number) { txnPage.value = p; loadTransactions(); }
function onTxnLimitChange(l: number) { txnLimit.value = l; txnPage.value = 1; loadTransactions(); }
function goToDetail(tr: string) { if (tr) router.push(`/aggregator/reports/view/${tr}`); }

/* ── Daily Trend ── */
const trend = ref<any[]>([]);
const trendLoading = ref(false);
async function loadTrend() {
  trendLoading.value = true;
  try {
    const res = await getDailyTrend(commonParams.value);
    if (res?.statusCode === "00") trend.value = res.data?.trend || [];
  } finally { trendLoading.value = false; loadedTabs.trend = true; }
}
const trendAmountOptions = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: "DM Sans, sans-serif" },
  colors: ["#1142d4", "#7c3aed", "#d97706"],
  xaxis: { categories: trend.value.map(d => fmtDate(d.day)) },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  legend: { position: "top" },
}));
const trendAmountSeries = computed(() => [
  { name: "Amount", data: trend.value.map(d => Number(d.amount || 0)) },
  { name: "Total Commission", data: trend.value.map(d => Number(d.totalCommission || 0)) },
  { name: "GST", data: trend.value.map(d => Number(d.gstAmount || 0)) },
]);
const trendCountOptions = computed(() => ({
  chart: { toolbar: { show: false }, fontFamily: "DM Sans, sans-serif" },
  colors: ["#059669"],
  xaxis: { categories: trend.value.map(d => fmtDate(d.day)) },
  dataLabels: { enabled: false },
  plotOptions: { bar: { borderRadius: 4 } },
}));
const trendCountSeries = computed(() => [{ name: "Transactions", data: trend.value.map(d => Number(d.count || 0)) }]);

/* ── Grouped Commission Reports ── */
const vendorCommRows = ref<any[]>([]); const vendorCommLoading = ref(false);
async function loadVendorCommission() {
  vendorCommLoading.value = true;
  try { const res = await getVendorCommissionReport(commonParams.value); if (res?.statusCode === "00") vendorCommRows.value = res.data?.rows || []; }
  finally { vendorCommLoading.value = false; loadedTabs.vendorCommission = true; }
}

const merchantCommRows = ref<any[]>([]); const merchantCommLoading = ref(false);
async function loadMerchantCommission() {
  merchantCommLoading.value = true;
  try { const res = await getMerchantCommissionReport(commonParams.value); if (res?.statusCode === "00") merchantCommRows.value = res.data?.rows || []; }
  finally { merchantCommLoading.value = false; loadedTabs.merchantCommission = true; }
}

const aggregatorCommRows = ref<any[]>([]); const aggregatorCommLoading = ref(false); const aggregatorCommForbidden = ref(false);
async function loadAggregatorCommission() {
  aggregatorCommLoading.value = true; aggregatorCommForbidden.value = false;
  try { const res = await getAggregatorCommissionReport(commonParams.value); if (res?.statusCode === "00") aggregatorCommRows.value = res.data?.rows || []; }
  catch (e: any) { if (e?.response?.status === 403) aggregatorCommForbidden.value = true; }
  finally { aggregatorCommLoading.value = false; loadedTabs.aggregatorCommission = true; }
}

const bankCommRows = ref<any[]>([]); const bankCommLoading = ref(false); const bankCommForbidden = ref(false);
async function loadBankCommission() {
  bankCommLoading.value = true; bankCommForbidden.value = false;
  try { const res = await getBankCommissionReport(commonParams.value); if (res?.statusCode === "00") bankCommRows.value = res.data?.rows || []; }
  catch (e: any) { if (e?.response?.status === 403) bankCommForbidden.value = true; }
  finally { bankCommLoading.value = false; loadedTabs.bankCommission = true; }
}

/* ── GST Report ── */
const gstGroupBy = ref<"day" | "merchant" | "vendor" | "aggregator" | "none">("day");
const gstRows = ref<any[]>([]);
const gstNone = ref<any>(null);
const gstLoading = ref(false);
async function loadGst() {
  gstLoading.value = true;
  try {
    const res = await getGstReport({ ...commonParams.value, groupBy: gstGroupBy.value });
    if (res?.statusCode === "00") {
      if (gstGroupBy.value === "none") gstNone.value = res.data;
      else gstRows.value = res.data?.rows || [];
    }
  } finally { gstLoading.value = false; loadedTabs.gst = true; }
}

/* ── Settlement Report ── */
const settlementRows = ref<any[]>([]); const settlementLoading = ref(false);
async function loadSettlement() {
  settlementLoading.value = true;
  try { const res = await getSettlementReport(commonParams.value); if (res?.statusCode === "00") settlementRows.value = res.data?.rows || []; }
  finally { settlementLoading.value = false; loadedTabs.settlement = true; }
}

/* ── Tab orchestration ── */
const loaders: Record<TabKey, () => Promise<void>> = {
  overview: loadOverview,
  trend: loadTrend,
  vendorCommission: loadVendorCommission,
  merchantCommission: loadMerchantCommission,
  aggregatorCommission: loadAggregatorCommission,
  bankCommission: loadBankCommission,
  gst: loadGst,
  settlement: loadSettlement,
};

const activeLoading = computed(() => ({
  overview: summaryLoading.value || txnLoading.value,
  trend: trendLoading.value,
  vendorCommission: vendorCommLoading.value,
  merchantCommission: merchantCommLoading.value,
  aggregatorCommission: aggregatorCommLoading.value,
  bankCommission: bankCommLoading.value,
  gst: gstLoading.value,
  settlement: settlementLoading.value,
} as Record<TabKey, boolean>)[activeTab.value]);

function switchTab(tab: TabKey) {
  activeTab.value = tab;
  if (!loadedTabs[tab]) loaders[tab]();
}
function refreshActive() { loaders[activeTab.value](); }

function applyFilters() {
  txnPage.value = 1;
  for (const key of Object.keys(loadedTabs)) loadedTabs[key] = false;
  loaders[activeTab.value]();
}
function clearFilters() {
  filters.fromDate = toISO(monthStart);
  filters.toDate = toISO(today);
  filters.merchantId = null; merchantSearch.value = "";
  filters.vendorId = null; vendorSearch.value = "";
  filters.status = ""; filters.settlementStatus = ""; filters.txnType = ""; filters.provider = "";
  applyFilters();
}

/* ── CSV Export ── */
const exporting = ref(false);

const COMMISSION_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "count", label: "Transactions" },
  { key: "successCount", label: "Success Transactions" },
  { key: "amount", label: "Amount" },
  { key: "totalfee", label: "Total Fee" },
  { key: "baseCommission", label: "Base Commission" },
  { key: "merchantCommission", label: "Merchant Commission" },
  { key: "vendorCommission", label: "Vendor Commission" },
  { key: "aggregatorCommission", label: "Aggregator Commission" },
  { key: "bankCommission", label: "Bank Commission" },
  { key: "superDistributorCommission", label: "Super Distributor Commission" },
  { key: "totalCommission", label: "Total Commission" },
  { key: "gstAmount", label: "GST Amount" },
  { key: "netAmount", label: "Net Amount" },
];

async function exportOverviewCsv() {
  exporting.value = true;
  try {
    const pageSize = 200;
    const maxPages = 20; // cap export at 4,000 rows to avoid runaway loops
    const first = await getTransactions({ ...commonParams.value, page: 1, limit: pageSize });
    if (first?.statusCode !== "00") return;
    let rows = first.data?.transactions || [];
    const totalPages = Math.min(first.data?.totalPages || 1, maxPages);
    for (let p = 2; p <= totalPages; p++) {
      const res = await getTransactions({ ...commonParams.value, page: p, limit: pageSize });
      if (res?.statusCode === "00") rows = rows.concat(res.data?.transactions || []);
    }
    downloadCsv("transactions", rows.map((t: any) => ({
      reference: t.tr || t.transactionid,
      merchant: merchantName(t.merchantId),
      vendor: vendorName(t.vendorId),
      amount: t.amount,
      provider: t.provider,
      status: t.status,
      settlementStatus: t.settlementStatus,
      totalCommission: t.totalCommission,
      gstAmount: t.gstAmount,
      netAmount: t.netAmount,
      createdAt: t.createdAt,
    })), [
      { key: "reference", label: "Reference" },
      { key: "merchant", label: "Merchant" },
      { key: "vendor", label: "Vendor" },
      { key: "amount", label: "Amount" },
      { key: "provider", label: "Provider" },
      { key: "status", label: "Status" },
      { key: "settlementStatus", label: "Settlement Status" },
      { key: "totalCommission", label: "Total Commission" },
      { key: "gstAmount", label: "GST" },
      { key: "netAmount", label: "Net Amount" },
      { key: "createdAt", label: "Date" },
    ]);
  } finally { exporting.value = false; }
}

function exportTrendCsv() {
  downloadCsv("daily-trend", trend.value.map((d: any) => ({ ...d, day: fmtDate(d.day) })), [
    { key: "day", label: "Day" },
    { key: "count", label: "Transactions" },
    { key: "amount", label: "Amount" },
    { key: "totalfee", label: "Total Fee" },
    { key: "merchantCommission", label: "Merchant Commission" },
    { key: "vendorCommission", label: "Vendor Commission" },
    { key: "aggregatorCommission", label: "Aggregator Commission" },
    { key: "bankCommission", label: "Bank Commission" },
    { key: "superDistributorCommission", label: "Super Distributor Commission" },
    { key: "totalCommission", label: "Total Commission" },
    { key: "gstAmount", label: "GST Amount" },
    { key: "netAmount", label: "Net Amount" },
  ]);
}

function exportGroupedCsv(filename: string, rows: any[]) {
  downloadCsv(filename, rows.map((r: any) => ({ ...r, name: r.name || r.id })), COMMISSION_COLUMNS);
}

function exportBankCsv() {
  downloadCsv("bank-commission", bankCommRows.value, [
    { key: "provider", label: "Provider" },
    { key: "count", label: "Transactions" },
    { key: "successCount", label: "Success Transactions" },
    { key: "amount", label: "Amount" },
    { key: "totalfee", label: "Total Fee" },
    { key: "bankCommission", label: "Bank Commission" },
    { key: "totalCommission", label: "Total Commission" },
    { key: "gstAmount", label: "GST Amount" },
    { key: "netAmount", label: "Net Amount" },
  ]);
}

function exportGstCsv() {
  if (gstGroupBy.value === "none") {
    if (!gstNone.value) return;
    downloadCsv("gst-report-total", [gstNone.value], [
      { key: "count", label: "Transactions" },
      { key: "gstAmount", label: "GST Amount" },
      { key: "totalfee", label: "Total Fee" },
      { key: "amount", label: "Amount" },
    ]);
    return;
  }
  downloadCsv(`gst-report-${gstGroupBy.value}`, gstRows.value.map((r: any) => ({
    ...r,
    label: gstGroupBy.value === "day" ? fmtDate(r.day) : gstEntityLabel(r.id),
  })), [
    { key: "label", label: gstGroupBy.value === "day" ? "Day" : (gstGroupBy.value.charAt(0).toUpperCase() + gstGroupBy.value.slice(1)) },
    { key: "count", label: "Transactions" },
    { key: "gstAmount", label: "GST Amount" },
    { key: "totalfee", label: "Total Fee" },
    { key: "amount", label: "Amount" },
  ]);
}

function exportSettlementCsv() {
  downloadCsv("settlement-reconciliation", settlementRows.value, [
    { key: "settlementStatus", label: "Settlement Status" },
    { key: "count", label: "Transactions" },
    { key: "amount", label: "Amount" },
    { key: "totalfee", label: "Total Fee" },
    { key: "totalCommission", label: "Total Commission" },
    { key: "gstAmount", label: "GST Amount" },
    { key: "netAmount", label: "Net Amount" },
  ]);
}

onMounted(async () => {
  await loadEntityLists();
  await loadOverview();
});
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
.icon-btn { width: 36px; height: 36px; border-radius: 9px; background: #fff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #64748b; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: background .13s, color .13s; }
.icon-btn:hover { background: #f1f5f9; color: #1142d4; }
.icon-btn.spinning .mdi { animation: spin .7s linear infinite; }
.spin-icon { animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.stats-strip { display: flex; gap: 10px; flex-wrap: wrap; }
.stat-pill { flex: 1; min-width: 150px; background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,.04); border-top: 3px solid var(--c, #1142d4); display: flex; flex-direction: column; gap: 4px; }
.pill-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.pill-val { font-size: 16px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }

.filter-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.filter-card-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.filter-title-wrap { display: flex; align-items: center; gap: 8px; }
.filter-icon { width: 28px; height: 28px; border-radius: 8px; background: rgba(17,66,212,.08); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.filter-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.filter-btns { display: flex; gap: 8px; }
.btn-clear { display: flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12px; font-weight: 600; color: #64748b; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .13s; }
.btn-clear:hover { border-color: #ef4444; color: #ef4444; background: #fff1f2; }
.btn-apply { display: flex; align-items: center; gap: 5px; padding: 7px 16px; border-radius: 8px; background: linear-gradient(135deg,#1142d4,#1654f8); color: #fff; border: none; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(17,66,212,.22); transition: filter .13s; }
.btn-apply:hover { filter: brightness(1.07); }

.filter-fields { display: grid; grid-template-columns: 1fr; gap: 12px; padding: 16px 18px; }
@media(min-width:640px)  { .filter-fields { grid-template-columns: repeat(2, 1fr); } }
@media(min-width:1024px) { .filter-fields { grid-template-columns: repeat(4, 1fr); } }
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

.entity-dropdown-wrap { position: relative; }
.entity-input-wrap { cursor: pointer; }
.entity-chevron { font-size: 18px; color: #94a3b8; transition: transform .2s; flex-shrink: 0; }
.entity-chevron.open { transform: rotate(180deg); }
.entity-drop { position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,.1); max-height: 240px; overflow-y: auto; }
.entity-drop-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; cursor: pointer; transition: background .12s; border-bottom: 1px solid #f8fafc; }
.entity-drop-item:last-child { border-bottom: none; }
.entity-drop-item:hover { background: #f8fafc; }
.drop-item-active { background: rgba(17,66,212,.05) !important; }
.drop-avatar { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; }
.drop-name { font-size: 12px; font-weight: 700; color: #1e293b; }
.drop-sub  { font-size: 10px; color: #94a3b8; font-family: 'DM Mono', monospace; }
.drop-check { font-size: 15px; color: #1142d4; margin-left: auto; flex-shrink: 0; }
.search-clear { background: none; border: none; cursor: pointer; font-size: 16px; color: #cbd5e1; display: flex; align-items: center; transition: color .13s; }
.search-clear:hover { color: #94a3b8; }

.tab-bar { display: flex; gap: 4px; background: #f1f5f9; border-radius: 10px; padding: 4px; flex-wrap: wrap; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; border: none; background: transparent; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .15s; white-space: nowrap; }
.tab-btn .mdi { font-size: 15px; }
.tab-active { background: #fff; color: #1142d4; box-shadow: 0 1px 4px rgba(0,0,0,.08); }

.tab-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.tab-toolbar-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.tab-toolbar-count { font-size: 11px; font-weight: 600; color: #94a3b8; }
.btn-download { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 8px; background: linear-gradient(135deg,#059669,#0d9488); color: #fff; border: none; font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; box-shadow: 0 3px 10px rgba(5,150,105,.22); transition: filter .13s; }
.btn-download:hover:not(:disabled) { filter: brightness(1.07); }
.btn-download:disabled { opacity: .5; cursor: not-allowed; }
.btn-download .mdi { font-size: 14px; }

.table-card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.table-wrap  { overflow-x: auto; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th { padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
.th-sno { width: 56px; text-align: center; }
.th-action { width: 56px; text-align: center; }
.text-right { text-align: right !important; }
.data-row { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; vertical-align: middle; font-size: 12px; color: #334155; }
.td-sno { text-align: center; font-size: 12px; font-weight: 700; color: #94a3b8; font-family: 'DM Mono', monospace; }
.row-name { font-size: 12px; font-weight: 700; color: #1e293b; }
.mono-sm { font-family: 'DM Mono', monospace; font-size: 11px; color: #475569; }
.mono-num { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; color: #0f172a; }
.amount-val { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; color: #0f172a; }

.date-cell { display: flex; flex-direction: column; gap: 2px; }
.date-main { font-size: 12px; font-weight: 600; color: #334155; }
.date-time { font-size: 11px; color: #94a3b8; }

.chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; white-space: nowrap; text-transform: uppercase; letter-spacing: .05em; }
.chip-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.chip-grey  { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
.chip-blue  { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }

.btn-view { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #64748b; cursor: pointer; margin: 0 auto; transition: all .13s; }
.btn-view:hover { background: #1142d4; color: #fff; border-color: #1142d4; }

.empty-td { padding: 48px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 32px 20px; }
.empty-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 28px; }
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

.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-row td { padding: 13px 14px; }
.skel-line-lg { height: 12px; width: 60%; }
.skeleton-area { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.skel-card { background: #f8fafc; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.skel-title { height: 14px; width: 55%; }
.skel-line { height: 11px; width: 80%; }

.commission-summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 16px 18px; }
@media(min-width:768px) { .commission-summary-grid { grid-template-columns: repeat(4, 1fr); } }
.mini-stat { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
.mini-stat-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; }
.mini-stat-val { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }

.trend-card { padding: 16px 18px; }
.row-2col { display: grid; grid-template-columns: 1fr; gap: 14px; }
@media(min-width:960px) { .row-2col { grid-template-columns: 1fr 1fr; } }
.chart-block { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 12px; }
.chart-block-title { font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 8px; }

.gst-toolbar { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.gst-toolbar .filter-select { width: auto; min-width: 180px; }

@media (max-width: 1023px) { .th-hide-md { display: none; } }
@media (max-width: 767px)  { .th-hide-sm { display: none; } }
</style>
