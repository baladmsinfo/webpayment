<template>
  <div class="status-wrap">
    <div class="status-illo" :class="status.toLowerCase()">
      <div class="ring"></div>
      <div class="ring r2"></div>
      <div class="status-circle">
        <v-icon size="46" color="white">{{ icon }}</v-icon>
      </div>
    </div>
    <p class="status-title" :style="{ color: titleColor }">{{ title }}</p>
    <p v-if="subtitle" class="status-sub">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { BX } from "~/utils/dmtTheme";

const props = defineProps({
  status: { type: String, required: true }, // SUCCESS | PENDING | FAILED
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});

const icon = computed(() => ({
  SUCCESS: "mdi-check-bold",
  PENDING: "mdi-clock-outline",
  FAILED: "mdi-close-thick",
}[props.status] || "mdi-help"));

const titleColor = computed(() => ({
  SUCCESS: BX.success2,
  PENDING: BX.warning,
  FAILED: BX.error,
}[props.status] || BX.ink));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700;800&display=swap');
.status-wrap { text-align: center; font-family: 'DM Sans', sans-serif; }
.status-illo { width: 150px; height: 150px; margin: 20px auto 10px; position: relative; }
.status-illo.success { color: #059669; }
.status-illo.pending { color: #d97706; }
.status-illo.failed  { color: #dc2626; }
.ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid currentColor; opacity: .15; }
.ring.r2 { inset: 16px; opacity: .25; }
.status-circle {
  position: absolute; inset: 32px; border-radius: 50%;
  background: currentColor; display: flex; align-items: center; justify-content: center;
}
.status-illo.success .status-circle .v-icon { animation: pop .5s cubic-bezier(.34,1.56,.64,1); }
@keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.status-illo.pending .status-circle { animation: pulse-ring 1.6s ease-in-out infinite; }
@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(217,119,6,.35); }
  50%      { box-shadow: 0 0 0 16px rgba(217,119,6,0); }
}
.status-illo.pending .status-circle .v-icon { animation: spin-slow 2.4s linear infinite; }
@keyframes spin-slow { to { transform: rotate(360deg); } }
.status-illo.failed .status-circle { animation: shake .5s ease; }
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}
.status-title { font-size: 19px; font-weight: 800; margin-top: 4px; }
.status-sub { font-size: 13px; color: #64748b; margin-top: 6px; max-width: 320px; margin-left: auto; margin-right: auto; line-height: 1.5; }
@media (prefers-reduced-motion: reduce) {
  .status-illo .status-circle, .status-illo .status-circle .v-icon { animation: none !important; }
}
</style>
