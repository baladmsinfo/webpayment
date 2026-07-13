<template>
  <div class="otp-wrap">
    <v-otp-input
      v-model="otp"
      :length="6"
      variant="outlined"
      :color="BX.primary"
      :error="!!error"
      :disabled="disabled"
      @finish="onFinish"
    />
    <p v-if="error" class="otp-error">{{ error }}</p>

    <div class="otp-timer">
      <span v-if="remaining > 0" class="muted">Resend OTP in <b class="mono">{{ remaining }}s</b></span>
      <a v-else class="resend-link" @click="handleResend">
        <v-icon size="14" class="mr-1">mdi-refresh</v-icon>Resend OTP
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useCountdown } from "~/composables/useCountdown";
import { BX } from "~/utils/dmtTheme";

const props = defineProps({
  error: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
  seconds: { type: Number, default: 30 },
});
const emit = defineEmits(["complete", "resend"]);

const otp = ref("");
const { remaining, start } = useCountdown(props.seconds);

onMounted(() => start());

const onFinish = (value) => emit("complete", value);

const handleResend = () => {
  otp.value = "";
  start();
  emit("resend");
};

watch(() => props.error, (e) => { if (e) otp.value = ""; });

defineExpose({ reset: () => { otp.value = ""; start(); } });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=DM+Mono:wght@600;700&display=swap');
.otp-wrap { font-family: 'DM Sans', sans-serif; text-align: center; }
.otp-error { color: #dc2626; font-size: 12px; font-weight: 700; margin-top: 6px; }
.otp-timer { margin-top: 14px; font-size: 12.5px; }
.muted { color: #64748b; }
.mono { font-family: 'DM Mono', monospace; color: #0f172a; }
.resend-link { color: #1142d4; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; }
</style>
