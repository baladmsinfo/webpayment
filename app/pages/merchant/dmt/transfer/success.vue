<template>
  <MerchantDmtShell title="Transfer Complete" :show-back="false">
    <MerchantDmtStatusIllustration status="SUCCESS" title="Transfer Successful" />

    <MerchantDmtReceiptCard
      v-if="store.currentTransaction"
      :txn="store.currentTransaction"
      show-limits
      :wallet-balance="balanceData.balance"
      :remaining-limit="store.remitter.remainingLimit"
      class="mt-4"
    />

    <div class="btn-row mt-4">
      <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="onDownload">
        <v-icon start size="17">mdi-download-outline</v-icon>Download
      </v-btn>
      <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="onShare">
        <v-icon start size="17">mdi-share-variant-outline</v-icon>Share
      </v-btn>
    </div>

    <v-btn block size="x-large" rounded="lg" :color="BX.primary" class="cta-btn mt-3" @click="transferAgain">
      Transfer Again
    </v-btn>
    <v-btn block size="large" variant="text" class="mt-2" @click="goHome">
      Home
    </v-btn>

    <v-bottom-sheet v-model="shareSheet">
      <v-card rounded="t-xl" class="pa-4">
        <p class="sheet-title">Share Receipt</p>
        <div class="share-grid">
          <div class="share-item" @click="shareVia('WhatsApp')">
            <div class="share-ic" style="background:#25D366"><v-icon color="white">mdi-whatsapp</v-icon></div>
            <span>WhatsApp</span>
          </div>
          <div class="share-item" @click="shareVia('SMS')">
            <div class="share-ic" :style="{ background: BX.primary }"><v-icon color="white">mdi-message-text-outline</v-icon></div>
            <span>SMS</span>
          </div>
          <div class="share-item" @click="shareVia('Email')">
            <div class="share-ic" :style="{ background: BX.warning }"><v-icon color="white">mdi-email-outline</v-icon></div>
            <span>Email</span>
          </div>
          <div class="share-item" @click="shareVia('Copy Link')">
            <div class="share-ic" style="background:#64748b"><v-icon color="white">mdi-link-variant</v-icon></div>
            <span>Copy Link</span>
          </div>
        </div>
      </v-card>
    </v-bottom-sheet>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useMerchantBalanceApi } from "~/composables/apis/useMerchantBalanceApi";
import { useDmtReceiptPdf } from "~/composables/useDmtReceiptPdf";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { balanceData, fetchBalance } = useMerchantBalanceApi();
const { downloadReceipt } = useDmtReceiptPdf();
const { notify } = useSnackbar();

const shareSheet = ref(false);

onMounted(() => {
  if (!store.currentTransaction || store.currentTransaction.status !== "SUCCESS") {
    router.replace("/merchant/dmt");
    return;
  }
  fetchBalance();
});

const onDownload = () => { downloadReceipt(store.currentTransaction); notify("Receipt downloaded", "success"); };
const onShare = () => { shareSheet.value = true; };
const shareVia = (channel) => { shareSheet.value = false; notify(`Shared via ${channel}`, "success"); };

const transferAgain = () => {
  store.selectedBeneficiary = null;
  store.resetTransferDraft();
  router.push("/merchant/dmt/beneficiaries");
};
const goHome = () => {
  store.resetCustomerFlow();
  router.push("/merchant/dashboard");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700;800&display=swap');
.btn-row { display: flex; gap: 10px; font-family: 'DM Sans', sans-serif; }
.flex-1 { flex: 1; }
.action-btn { text-transform: none; font-weight: 700; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
.sheet-title { font-size: 14.5px; font-weight: 800; color: #0f172a; margin-bottom: 14px; font-family: 'DM Sans', sans-serif; }
.share-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.share-item { display: flex; flex-direction: column; align-items: center; gap: 7px; cursor: pointer; }
.share-item span { font-size: 10.5px; font-weight: 700; color: #0f172a; font-family: 'DM Sans', sans-serif; }
.share-ic { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
</style>
