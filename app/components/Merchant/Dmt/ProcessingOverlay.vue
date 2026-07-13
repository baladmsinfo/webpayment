<template>
  <v-overlay :model-value="show" persistent class="processing-overlay" scrim="#0f172a" opacity="0.75">
    <div class="processing-box">
      <v-progress-circular indeterminate size="56" width="4" :color="BX.primary" />
      <p class="processing-text">{{ text }}</p>
      <p class="processing-sub">Please don't close this screen</p>
    </div>
  </v-overlay>
</template>

<script setup>
import { BX } from "~/utils/dmtTheme";

defineProps({
  show: { type: Boolean, default: false },
  text: { type: String, default: "Processing your transfer…" },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700;800&display=swap');
.processing-overlay :deep(.v-overlay__content) { display: flex; align-items: center; justify-content: center; inset: 0; position: fixed; }
.processing-box { text-align: center; font-family: 'DM Sans', sans-serif; color: #fff; }
.processing-text { font-size: 15px; font-weight: 800; margin-top: 18px; }
.processing-sub { font-size: 12px; color: rgba(255,255,255,.65); margin-top: 6px; }
</style>
