<template>
  <MerchantDmtShell title="Confirm Transfer" subtitle="/dmt/txn/v1/transaction/instant" :show-back="!store.isProcessing" back-to="/merchant/dmt/transfer">
    <v-card rounded="lg" elevation="0" class="pa-4 text-center summary-card mb-4">
      <p class="summary-label">You're sending</p>
      <p class="summary-amount">{{ formatCurrency(store.amount) }}</p>
      <p class="summary-sub">to {{ store.selectedBeneficiary?.name }} · {{ store.selectedBeneficiary?.bankName }}</p>
    </v-card>

    <v-card rounded="lg" elevation="0" class="pa-5 text-center otp-card">
      <MerchantDmtOtpInput
        ref="otpRef"
        :error="otpError"
        :disabled="store.isProcessing"
        @complete="onOtpComplete"
        @resend="onResend"
      />

      <v-btn
        block
        size="x-large"
        rounded="lg"
        :color="BX.primary"
        class="cta-btn mt-5"
        :disabled="store.isProcessing || otpValue.length < 6"
        :loading="store.isProcessing"
        @click="confirmNow"
      >
        Confirm Transfer
      </v-btn>
    </v-card>

    <MerchantDmtProcessingOverlay :show="store.isProcessing" text="Processing your transfer…" />
  </MerchantDmtShell>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useDmtFormat } from "~/composables/useDmtFormat";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { formatCurrency } = useDmtFormat();
const { notify } = useSnackbar();

const otpRef = ref(null);
const otpValue = ref("");
const otpError = ref("");

onMounted(() => {
  if (!store.transferOtpRequested || !store.selectedBeneficiary) router.replace("/merchant/dmt/transfer");
});

// Business rule: disable back navigation while a transfer is in flight.
onBeforeRouteLeave(() => {
  if (store.isProcessing) return false;
});
const beforeUnloadGuard = (e) => { if (store.isProcessing) { e.preventDefault(); e.returnValue = ""; } };
onMounted(() => window.addEventListener("beforeunload", beforeUnloadGuard));
onBeforeUnmount(() => window.removeEventListener("beforeunload", beforeUnloadGuard));

const onOtpComplete = (value) => { otpValue.value = value; confirmNow(); };

const confirmNow = async () => {
  if (store.isProcessing || otpValue.value.length < 6) return; // guards double-tap
  otpError.value = "";
  const res = await store.confirmTransfer(otpValue.value);

  if (!res.status) {
    // Only hit when a duplicate tap was ignored before the API call — nothing to navigate to.
    notify(res.message || "Transfer already in progress", "error");
    return;
  }
  if (res.status === "SUCCESS") {
    notify("Transfer completed successfully", "success");
    router.push("/merchant/dmt/transfer/success");
  } else if (res.status === "PENDING") {
    notify("Transfer is being processed by the bank", "success");
    router.push("/merchant/dmt/transfer/pending");
  } else {
    router.push("/merchant/dmt/transfer/failed");
  }
};

const onResend = async () => {
  const res = await store.requestTransferOtp();
  notify(res.ok ? "OTP resent successfully" : (res.message || "Could not resend OTP"), res.ok ? "success" : "error");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@700;800&display=swap');
.summary-card, .otp-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.summary-label { font-size: 12px; color: #64748b; }
.summary-amount { font-size: 26px; font-weight: 800; font-family: 'DM Mono', monospace; color: #0f172a; margin: 4px 0; }
.summary-sub { font-size: 12px; color: #64748b; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
</style>
