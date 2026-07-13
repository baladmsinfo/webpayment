<template>
  <MerchantDmtShell title="Transaction Details" back-to="/merchant/dmt/history">
    <v-skeleton-loader v-if="loading" type="article" />

    <template v-else-if="txn">
      <v-card rounded="lg" elevation="0" class="pa-4 text-center summary-card mb-4">
        <p class="summary-amount">{{ formatCurrency(txn.amount) }}</p>
        <v-chip :color="statusColor" variant="tonal" size="small">{{ txn.status }}</v-chip>
      </v-card>

      <p class="section-label">Timeline</p>
      <v-card rounded="lg" elevation="0" class="pa-4 mb-4 timeline-card">
        <v-timeline density="compact" side="end" truncate-line="both">
          <v-timeline-item v-for="(step, i) in timelineSteps" :key="i" :dot-color="step.done ? step.color : '#e6eaf1'" size="small">
            <p class="tl-title">{{ step.label }}</p>
            <p class="tl-time">{{ step.time }}</p>
          </v-timeline-item>
        </v-timeline>
      </v-card>

      <p class="section-label">Reference</p>
      <MerchantDmtReceiptCard :txn="txn" class="mb-4" />

      <div class="btn-row">
        <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="onShare">
          <v-icon start size="17">mdi-share-variant-outline</v-icon>Share Receipt
        </v-btn>
        <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="onDownload">
          <v-icon start size="17">mdi-download-outline</v-icon>Download PDF
        </v-btn>
      </div>
    </template>

    <div v-else class="empty-wrap">
      <v-icon size="48" color="grey-lighten-1">mdi-file-search-outline</v-icon>
      <p class="empty-title">Transaction not found</p>
      <p class="empty-sub">We couldn't locate this transaction. It may be outside the loaded history window.</p>
    </div>

    <v-bottom-sheet v-model="shareSheet">
      <v-card rounded="t-xl" class="pa-4">
        <p class="sheet-title">Share Receipt</p>
        <div class="share-grid">
          <div class="share-item" @click="shareVia('WhatsApp')"><div class="share-ic" style="background:#25D366"><v-icon color="white">mdi-whatsapp</v-icon></div><span>WhatsApp</span></div>
          <div class="share-item" @click="shareVia('SMS')"><div class="share-ic" :style="{ background: BX.primary }"><v-icon color="white">mdi-message-text-outline</v-icon></div><span>SMS</span></div>
          <div class="share-item" @click="shareVia('Email')"><div class="share-ic" :style="{ background: BX.warning }"><v-icon color="white">mdi-email-outline</v-icon></div><span>Email</span></div>
          <div class="share-item" @click="shareVia('Copy Link')"><div class="share-ic" style="background:#64748b"><v-icon color="white">mdi-link-variant</v-icon></div><span>Copy Link</span></div>
        </div>
      </v-card>
    </v-bottom-sheet>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDmtStore, mapTxnStatus } from "~/stores/dmt";
import { useDmtTxnApi } from "~/composables/apis/useDmtTxnApi";
import { useDmtFormat } from "~/composables/useDmtFormat";
import { useDmtReceiptPdf } from "~/composables/useDmtReceiptPdf";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const route = useRoute();
const store = useDmtStore();
const { formatCurrency, formatDateTime } = useDmtFormat();
const { downloadReceipt } = useDmtReceiptPdf();
const { notify } = useSnackbar();

const loading = ref(true);
const txn = ref(null);
const shareSheet = ref(false);

const statusColor = computed(() => ({ SUCCESS: BX.success2, PENDING: BX.warning, FAILED: BX.error }[txn.value?.status] || BX.muted));

const timelineSteps = computed(() => {
  if (!txn.value) return [];
  const created = formatDateTime(txn.value.createdAt);
  const isSuccess = txn.value.status === "SUCCESS";
  const isFailed = txn.value.status === "FAILED";
  return [
    { label: "Created", time: created, done: true, color: BX.success2 },
    { label: "OTP Sent & Verified", time: created, done: true, color: BX.success2 },
    { label: "Bank Processing", time: created, done: true, color: BX.success2 },
    {
      label: isSuccess ? "Completed" : isFailed ? "Failed — reversed to wallet" : "Awaiting confirmation",
      time: isSuccess || isFailed ? created : "—",
      done: isSuccess || isFailed,
      color: isFailed ? BX.error : isSuccess ? BX.success2 : BX.warning,
    },
  ];
});

onMounted(async () => {
  const id = String(route.params.id);
  const cached = store.sessionTransactions.find((t) => t.transactionId === id || t.refId === id);
  if (cached) { txn.value = cached; loading.value = false; return; }

  // Not in this session's cache (fresh reload, or an older transaction) — pull live status.
  const { transactionRequery } = useDmtTxnApi();
  try {
    const res = await transactionRequery({ refId: id, transactionId: id });
    if (res.statusCode === "00" || res.data) {
      const status = mapTxnStatus(res);
      txn.value = {
        transactionId: id,
        refId: res.data?.refId ?? id,
        rrn: res.data?.rrn ?? "",
        bankReference: res.data?.bankReference ?? "",
        amount: Number(res.data?.amount ?? 0),
        beneficiaryName: res.data?.receivername ?? res.data?.beneficiaryName ?? "",
        bankName: res.data?.bankName ?? "",
        accountNumber: res.data?.receiver_account_no ?? "",
        remarks: res.data?.remarks ?? "",
        status,
        reason: status === "FAILED" ? res.message : null,
        createdAt: res.data?.createdAt ?? new Date().toISOString(),
      };
    }
  } catch (e) {
    notify("Could not load transaction details", "error");
  } finally {
    loading.value = false;
  }
});

const onDownload = () => { downloadReceipt(txn.value); notify("PDF downloaded", "success"); };
const onShare = () => { shareSheet.value = true; };
const shareVia = (channel) => { shareSheet.value = false; notify(`Shared via ${channel}`, "success"); };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@700;800&display=swap');
.summary-card, .timeline-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.summary-amount { font-size: 24px; font-weight: 800; font-family: 'DM Mono', monospace; color: #0f172a; margin-bottom: 8px; }
.section-label { font-size: 12.5px; font-weight: 800; color: #0f172a; margin: 4px 0 8px; font-family: 'DM Sans', sans-serif; }
.tl-title { font-size: 12.5px; font-weight: 700; color: #0f172a; font-family: 'DM Sans', sans-serif; }
.tl-time { font-size: 10.5px; color: #94a3b8; font-family: 'DM Mono', monospace; }
.btn-row { display: flex; gap: 10px; }
.flex-1 { flex: 1; }
.action-btn { text-transform: none; font-weight: 700; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 56px 16px 20px; font-family: 'DM Sans', sans-serif; }
.empty-title { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 14px; }
.empty-sub { font-size: 12.5px; color: #94a3b8; margin-top: 6px; }
.sheet-title { font-size: 14.5px; font-weight: 800; color: #0f172a; margin-bottom: 14px; font-family: 'DM Sans', sans-serif; }
.share-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.share-item { display: flex; flex-direction: column; align-items: center; gap: 7px; cursor: pointer; }
.share-item span { font-size: 10.5px; font-weight: 700; color: #0f172a; font-family: 'DM Sans', sans-serif; }
.share-ic { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
</style>
