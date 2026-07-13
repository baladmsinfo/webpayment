<template>
  <div>
    <MerchantSharedRdDeviceSelector class="mb-4" />

    <v-card rounded="lg" elevation="0" class="pa-5 text-center bio-card">
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
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRdService } from "~/composables/useRdService";
import { useGeolocation } from "~/composables/useGeolocation";
import { BX } from "~/utils/dmtTheme";

const emit = defineEmits(["captured", "error"]);

// Detection/selection is owned by MerchantSharedRdDeviceSelector above — useRdService()'s
// state is a shared singleton, so this component just reads deviceConnected rather than
// running its own competing detectDevice() on mount.
const { deviceConnected, detectDevice, captureFingerprint } = useRdService();
const { getCurrentPosition } = useGeolocation();

const capturing = ref(false);
const scanning = ref(false);
const errorMsg = ref("");

const onCapture = async () => {
  if (capturing.value) return; // guards a double-tap slipping in before :disabled takes effect
  errorMsg.value = "";
  capturing.value = true;
  scanning.value = true;
  try {
    if (!deviceConnected.value) {
      const det = await detectDevice();
      if (!det.ok) { errorMsg.value = det.message; emit("error", det.message); return; }
    }
    const geo = await getCurrentPosition();
    if (!geo.ok) { errorMsg.value = geo.message; emit("error", geo.message); return; }

    const cap = await captureFingerprint();
    if (!cap.ok) { errorMsg.value = cap.message; emit("error", cap.message); return; }

    emit("captured", { pidData: cap.pidDataXml, coords: geo.coords });
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
