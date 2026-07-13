<template>
  <MerchantDmtShell title="Mini Statement" :subtitle="subtitle" back-to="/merchant/aeps" :show-back="step !== 'result'">
    <MerchantDmtWalletStrip ref="walletStripRef" class="mb-4" />

    <MerchantAepsCustomerBankForm v-if="step === 'form'" @continue="onFormContinue" />

    <MerchantAepsBiometricCapture
      v-else-if="step === 'biometric'"
      @captured="onCaptured"
      @error="(m) => notify(m, 'error')"
    />

    <template v-else-if="step === 'result'">
      <MerchantAepsResultCard :result="aepsStore.currentResult" />

      <div class="btn-row mt-4" v-if="aepsStore.currentResult?.status === 'SUCCESS'">
        <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="onDownload">
          <v-icon start size="17">mdi-download-outline</v-icon>Download
        </v-btn>
        <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="onShare">
          <v-icon start size="17">mdi-share-variant-outline</v-icon>Share
        </v-btn>
      </div>
      <div class="btn-row mt-2">
        <v-btn variant="outlined" class="flex-1 action-btn" @click="tryAgain">
          <v-icon start size="17">mdi-reload</v-icon>New Statement
        </v-btn>
        <v-btn variant="flat" :color="BX.primary" class="flex-1 action-btn" @click="goHome">Home</v-btn>
      </div>
    </template>

    <MerchantDmtProcessingOverlay :show="aepsStore.isProcessing" text="Fetching mini statement…" />
  </MerchantDmtShell>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useAepsStore } from "~/stores/aeps";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const aepsStore = useAepsStore();
const { notify } = useSnackbar();

const step = ref("form");
const walletStripRef = ref(null);

const subtitle = computed(() => ({
  form: "Step 1 of 3 · Customer & bank",
  biometric: "Step 2 of 3 · Biometric authentication",
  result: "Step 3 of 3 · Statement result",
}[step.value]));

onBeforeRouteLeave(() => { if (aepsStore.isProcessing) return false; });
const beforeUnloadGuard = (e) => { if (aepsStore.isProcessing) { e.preventDefault(); e.returnValue = ""; } };
onMounted(() => {
  aepsStore.resetDraft();
  window.addEventListener("beforeunload", beforeUnloadGuard);
});
onBeforeUnmount(() => window.removeEventListener("beforeunload", beforeUnloadGuard));

const onFormContinue = (payload) => {
  aepsStore.draft = payload;
  step.value = "biometric";
};

const onCaptured = async ({ pidData, coords }) => {
  aepsStore.pidData = pidData;
  aepsStore.geoCoords = coords;
  const res = await aepsStore.performMiniStatement();
  if (!res.status) { notify(res.message || "A transaction is already in progress", "error"); return; }
  step.value = "result";
  if (res.status === "SUCCESS") { notify("Mini statement retrieved", "success"); walletStripRef.value?.fetchBalance(); }
  else if (res.status === "FAILED") notify(aepsStore.currentResult?.reason || "Mini statement failed", "error");
  else notify("No confirmation received — check the reference number", "error");
};

const onDownload = () => {
  // Plain-text receipt — mirrors the DMT PDF receipt pattern but the statement itself
  // is best kept as readable text since NSDL returns it as a delimited string, not
  // structured line items.
  const r = aepsStore.currentResult;
  const lines = [
    "BucksBox — AEPS Mini Statement",
    `Customer: ${r.customerName}`,
    `Aadhaar: ${r.aadhaarMasked}`,
    `Bank: ${r.bankName}`,
    `Reference: ${r.retailerReferenceNumber}`,
    "",
    ...(r.statementLines?.length ? r.statementLines : ["No recent transactions returned."]),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AEPS-MiniStatement-${r.retailerReferenceNumber || Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  notify("Statement downloaded", "success");
};

const onShare = () => notify("Share sheet not available in the browser preview", "error");

const tryAgain = () => { aepsStore.resetDraft(); step.value = "form"; };
const goHome = () => { aepsStore.resetDraft(); router.push("/merchant/aeps"); };
</script>

<style scoped>
.btn-row { display: flex; gap: 10px; }
.flex-1 { flex: 1; }
.action-btn { text-transform: none; font-weight: 700; }
</style>
