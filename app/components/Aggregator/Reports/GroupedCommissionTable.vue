<template>
  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>{{ nameLabel }}</th>
          <th class="text-right">Txns</th>
          <th class="text-right">Success Txns</th>
          <th class="text-right">Amount</th>
          <th class="text-right">Total Fee</th>
          <th class="text-right">Merchant Comm</th>
          <th class="text-right">Vendor Comm</th>
          <th class="text-right">Aggregator Comm</th>
          <th class="text-right">Bank Comm</th>
          <th class="text-right">Super Dist. Comm</th>
          <th class="text-right">Total Commission</th>
          <th class="text-right">GST</th>
          <th class="text-right">Net Amount</th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr class="skel-row"><td colspan="13"><div class="skel skel-line-lg"></div></td></tr>
      </tbody>
      <tbody v-else>
        <tr v-for="r in rows" :key="r.id" class="data-row">
          <td><span class="row-name">{{ r.name || r.id }}</span></td>
          <td class="text-right">{{ fmtInt(r.count) }}</td>
          <td class="text-right">{{ fmtInt(r.successCount) }}</td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.amount) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.totalfee) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.merchantCommission) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.vendorCommission) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.aggregatorCommission) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.bankCommission) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.superDistributorCommission) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.totalCommission) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.gstAmount) }}</span></td>
          <td class="text-right"><span class="mono-num">₹{{ fmtAmt(r.netAmount) }}</span></td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="13" class="empty-td">
            <div class="empty-state">
              <div class="empty-icon"><span class="mdi" :class="emptyIcon"></span></div>
              <p class="empty-title">{{ emptyText }}</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  rows: any[];
  nameLabel: string;
  emptyIcon: string;
  emptyText: string;
}>();

const fmtAmt = (v: any) => Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const fmtInt = (v: any) => Number(v || 0).toLocaleString("en-IN");
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.table-wrap  { overflow-x: auto; font-family: 'DM Sans', sans-serif; }
.data-table  { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th { padding: 11px 14px; text-align: left; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
.text-right { text-align: right !important; }
.data-row { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 12px 14px; vertical-align: middle; font-size: 12px; color: #334155; }
.row-name { font-size: 12px; font-weight: 700; color: #1e293b; }
.mono-num { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; color: #0f172a; }

.skel { background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-row td { padding: 13px 14px; }
.skel-line-lg { height: 12px; width: 60%; }

.empty-td { padding: 48px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; padding: 32px 20px; }
.empty-icon { width: 60px; height: 60px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 28px; }
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
</style>
