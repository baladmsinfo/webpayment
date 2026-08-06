<template>
  <MerchantDmtShell title="Agent Authentication" :subtitle="subtitle" back-to="/merchant/aeps" :show-back="step !== 'result'">
    <MerchantAepsCustomerBankForm
      v-if="step === 'form'"
      :with-bank="false"
      @continue="onFormContinue"
    />

    <MerchantAepsBiometricCapture
      v-else-if="step === 'biometric'"
      @captured="onCaptured"
      @error="(m) => notify(m, 'error')"
    />

    <div v-else-if="step === 'result'">
      <MerchantDmtStatusIllustration
        :status="resultStatus"
        :title="resultStatus === 'SUCCESS' ? 'Authentication Successful' : 'Authentication Failed'"
        :subtitle="resultStatus === 'SUCCESS' ? 'AEPS services are now unlocked for this terminal for the next 24 hours.' : resultMessage"
      />

      <div class="btn-row mt-4">
        <v-btn v-if="resultStatus !== 'SUCCESS'" variant="outlined" :color="BX.primary" class="flex-1 action-btn" @click="tryAgain">
          <v-icon start size="17">mdi-reload</v-icon>Try Again
        </v-btn>
        <v-btn variant="flat" :color="BX.primary" class="flex-1 action-btn" @click="goHome">
          {{ resultStatus === 'SUCCESS' ? 'Continue to AEPS Services' : 'Home' }}
        </v-btn>
      </div>
    </div>

    <MerchantDmtProcessingOverlay :show="aepsStore.isProcessing" text="Authenticating agent…" />
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

const step = ref("form"); // form -> biometric -> result
const resultStatus = ref("PENDING");
const resultMessage = ref("");

const subtitle = computed(() => ({
  form: "Step 1 of 3 · Agent & bank details",
  biometric: "Step 2 of 3 · Biometric authentication",
  result: "Step 3 of 3 · Authentication result",
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
  const res = await aepsStore.performReqAuth();
  if (res.busy) { notify(res.message, "error"); return; }
  resultStatus.value = res.ok ? "SUCCESS" : "FAILED";
  resultMessage.value = res.message || "Agent authentication could not be completed";
  step.value = "result";
  if (res.ok) notify("Agent authentication successful", "success");
  else notify(resultMessage.value, "error");
};

const tryAgain = () => { aepsStore.resetDraft(); step.value = "form"; };
const goHome = () => { aepsStore.resetDraft(); router.push("/merchant/aeps"); };
</script>

<style scoped>
.btn-row { display: flex; gap: 10px; }
.flex-1 { flex: 1; }
.action-btn { text-transform: none; font-weight: 700; }
</style>
