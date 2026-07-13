<template>
  <MerchantDmtShell title="Transfer Failed" :show-back="false">
    <MerchantDmtStatusIllustration
      status="FAILED"
      title="Transfer Failed"
      :subtitle="store.currentTransaction?.reason || 'The bank declined this transaction. Any amount debited has been reversed to your wallet.'"
    />

    <MerchantDmtReceiptCard v-if="store.currentTransaction" :txn="store.currentTransaction" class="my-4" />

    <div class="btn-row">
      <v-btn variant="flat" :color="BX.error" class="flex-1 action-btn" @click="retryTransfer">
        <v-icon start size="17">mdi-reload</v-icon>Retry Transfer
      </v-btn>
      <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" :loading="checking" @click="viewStatus">
        <v-icon start size="17">mdi-eye-outline</v-icon>View Status
      </v-btn>
    </div>

    <v-btn block size="large" variant="outlined" class="mt-3" @click="onDownload">
      <v-icon start size="17">mdi-download-outline</v-icon>Download Receipt
    </v-btn>
    <v-btn block size="large" variant="text" class="mt-2" @click="goHome">Home</v-btn>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useDmtReceiptPdf } from "~/composables/useDmtReceiptPdf";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { downloadReceipt } = useDmtReceiptPdf();
const { notify } = useSnackbar();

const checking = ref(false);

onMounted(() => {
  if (!store.currentTransaction || store.currentTransaction.status !== "FAILED") router.replace("/merchant/dmt");
});

const retryTransfer = () => {
  store.resetTransferDraft();
  router.push("/merchant/dmt/transfer");
};

const viewStatus = async () => {
  checking.value = true;
  try {
    const status = await store.manualRequery();
    if (status === "SUCCESS") { notify("Good news — the bank confirmed this transfer", "success"); router.replace("/merchant/dmt/transfer/success"); }
    else if (status === "PENDING") { router.replace("/merchant/dmt/transfer/pending"); }
    else notify("Status confirmed as failed by the bank", "error");
  } finally {
    checking.value = false;
  }
};

const onDownload = () => { downloadReceipt(store.currentTransaction); notify("Receipt downloaded", "success"); };
const goHome = () => { store.resetCustomerFlow(); router.push("/merchant/dashboard"); };
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&display=swap');
.btn-row { display: flex; gap: 10px; }
.flex-1 { flex: 1; }
.action-btn { text-transform: none; font-weight: 700; }
</style>
