<template>
  <MerchantDmtShell title="Biometric Capture" subtitle="Step 4 of 4 · Fingerprint verification" back-to="/merchant/dmt/customer/aadhaar">
    <v-progress-linear :model-value="100" :color="BX.primary" bg-color="#eef1f7" height="5" rounded class="mb-5" />

    <MerchantSharedRdDeviceSelector v-if="!verified" class="mb-4" />

    <v-card rounded="lg" elevation="0" class="pa-5 text-center bio-card">
      <template v-if="!verified">
        <div class="scan-illo" :class="{ scanning }">
          <div class="ring"></div><div class="ring r2"></div><div class="ring r3"></div>
          <div class="scan-circle"><v-icon size="46" color="white">mdi-fingerprint</v-icon></div>
        </div>

        <p class="bio-title">{{ scanning ? 'Scanning fingerprint…' : 'Place finger on scanner' }}</p>
        <p class="bio-sub">Ask the customer to place their index finger firmly on the biometric device.</p>

        <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mt-4 mb-1 text-left" :text="errorMsg" />

        <v-btn block size="x-large" rounded="lg" :color="BX.primary" class="cta-btn mt-4" :loading="capturing" :disabled="capturing" @click="onCapture">
          <v-icon start size="18">mdi-fingerprint</v-icon>
          Capture Fingerprint
        </v-btn>
      </template>

      <template v-else>
        <MerchantDmtStatusIllustration status="SUCCESS" title="Customer Verified" subtitle="KYC complete — continuing to remitter details" />
      </template>
    </v-card>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useRdService } from "~/composables/useRdService";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { notify } = useSnackbar();
const { deviceConnected, detectDevice, captureFingerprint } = useRdService();

const capturing = ref(false);
const scanning = ref(false);
const verified = ref(false);
const errorMsg = ref("");

onMounted(() => {
  if (!store.customer.aadhaarMasked) router.replace("/merchant/dmt/customer/aadhaar");
});

const onCapture = async () => {
  if (capturing.value) return; // guards a double-tap slipping in before :disabled takes effect
  errorMsg.value = "";
  capturing.value = true;
  scanning.value = true;
  try {
    if (!deviceConnected.value) {
      const det = await detectDevice();
      if (!det.ok) { errorMsg.value = det.message; notify(det.message, "error"); return; }
    }
    const cap = await captureFingerprint();
    if (!cap.ok) { errorMsg.value = cap.message; notify(cap.message, "error"); return; }

    const res = await store.submitBiometric(cap.pidDataXml);
    if (res.ok) {
      verified.value = true;
      notify("Customer verified successfully", "success");
      setTimeout(() => router.push("/merchant/dmt/remitter"), 1100);
    } else {
      errorMsg.value = res.message;
      notify(res.message, "error");
    }
  } finally {
    capturing.value = false;
    scanning.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&display=swap');
.bio-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.scan-illo { width: 160px; height: 160px; margin: 18px auto 10px; position: relative; color: #1142d4; }
.ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid currentColor; opacity: .15; }
.ring.r2 { inset: 16px; opacity: .25; }
.ring.r3 { inset: 32px; opacity: .35; }
.scan-circle { position: absolute; inset: 40px; border-radius: 50%; background: currentColor; display: flex; align-items: center; justify-content: center; }
.scan-illo.scanning .scan-circle { animation: pulse-scan 1.2s ease-in-out infinite; }
@keyframes pulse-scan {
  0%, 100% { box-shadow: 0 0 0 0 rgba(17,66,212,.35); }
  50%      { box-shadow: 0 0 0 20px rgba(17,66,212,0); }
}
.bio-title { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 6px; }
.bio-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
@media (prefers-reduced-motion: reduce) { .scan-illo.scanning .scan-circle { animation: none; } }
</style>
