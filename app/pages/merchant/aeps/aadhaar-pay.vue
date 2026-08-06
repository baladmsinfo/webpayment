<template>
  <MerchantDmtShell title="Aadhaar Pay" :subtitle="subtitle" back-to="/merchant/aeps" :show-back="step !== 'result'">
    <MerchantDmtWalletStrip ref="walletStripRef" class="mb-4" />

    <MerchantAepsCustomerBankForm
      v-if="step === 'form'"
      with-amount
      amount-label="Payment Amount"
      :max-amount="walletBalance"
      @continue="onFormContinue"
    />

    <MerchantAepsBiometricCapture
      v-else-if="step === 'biometric'"
      @captured="onCaptured"
      @error="(m) => notify(m, 'error')"
    />

    <MerchantAepsResultCard v-else-if="step === 'result'" :result="aepsStore.currentResult" />

    <div class="btn-row mt-4" v-if="step === 'result'">
      <v-btn variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="tryAgain">
        <v-icon start size="17">mdi-reload</v-icon>New Payment
      </v-btn>
      <v-btn variant="flat" :color="BX.primary" class="flex-1 action-btn" @click="goHome">Home</v-btn>
    </div>

    <MerchantDmtProcessingOverlay :show="aepsStore.isProcessing" text="Processing Aadhaar Pay…" />
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
const walletBalance = computed(() => walletStripRef.value?.balanceData?.balance ?? 0);

const subtitle = computed(() => ({
  form: "Step 1 of 3 · Customer & amount",
  biometric: "Step 2 of 3 · Biometric authentication",
  result: "Step 3 of 3 · Payment result",
}[step.value]));

onBeforeRouteLeave(() => { if (aepsStore.isProcessing) return false; });
const beforeUnloadGuard = (e) => { if (aepsStore.isProcessing) { e.preventDefault(); e.returnValue = ""; } };
onMounted(async () => {
  aepsStore.resetDraft();
  window.addEventListener("beforeunload", beforeUnloadGuard);
  // Direct-navigation safety net — the dashboard already gates these links behind
  // agent authentication, but a bookmark/back-button could land here first.
  if (!aepsStore.authChecked) await aepsStore.checkAuthStatus();
  if (!aepsStore.authenticated) router.replace("/merchant/aeps/agent-auth");
});
onBeforeUnmount(() => window.removeEventListener("beforeunload", beforeUnloadGuard));

const onFormContinue = (payload) => {
  aepsStore.draft = payload;
  step.value = "biometric";
};

const onCaptured = async ({ pidData, coords }) => {
  aepsStore.pidData = pidData;
  aepsStore.geoCoords = coords;
  const res = await aepsStore.performAadhaarPay();
  if (!res.status) { notify(res.message || "A transaction is already in progress", "error"); return; }
  step.value = "result";
  if (res.status === "SUCCESS") { notify("Aadhaar Pay successful", "success"); walletStripRef.value?.fetchBalance(); }
  else if (res.status === "FAILED") notify(aepsStore.currentResult?.reason || "Payment failed", "error");
  else notify("No confirmation received — check the reference number", "error");
};

const tryAgain = () => { aepsStore.resetDraft(); step.value = "form"; };
const goHome = () => { aepsStore.resetDraft(); router.push("/merchant/aeps"); };
</script>

<style scoped>
.btn-row { display: flex; gap: 10px; }
.flex-1 { flex: 1; }
.action-btn { text-transform: none; font-weight: 700; }
</style>
