<template>
  <MerchantDmtShell title="Verify Mobile" subtitle="Step 2 of 4 · OTP verification" back-to="/merchant/dmt/customer/register">
    <v-progress-linear :model-value="50" :color="BX.primary" bg-color="#eef1f7" height="5" rounded class="mb-5" />

    <v-card rounded="lg" elevation="0" class="pa-5 text-center otp-card">
      <template v-if="!verified">
        <v-icon size="32" :color="BX.primary" class="mb-2">mdi-cellphone-message</v-icon>
        <p class="otp-title">Enter 6-digit OTP</p>
        <p class="otp-sub">Sent to +91 {{ store.customer.mobile }}</p>

        <MerchantDmtOtpInput
          ref="otpRef"
          class="mt-5"
          :error="otpError"
          :disabled="verifying"
          @complete="onVerify"
          @resend="onResend"
        />

        <v-btn block size="x-large" rounded="lg" :color="BX.primary" class="cta-btn mt-5" :loading="verifying" @click="verifyCurrent">
          Verify &amp; Continue
        </v-btn>
      </template>

      <template v-else>
        <MerchantDmtStatusIllustration status="SUCCESS" title="Mobile Verified" subtitle="Now let's verify Aadhaar to complete KYC" />
      </template>
    </v-card>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { notify } = useSnackbar();

const otpRef = ref(null);
const otpValue = ref("");
const otpError = ref("");
const verifying = ref(false);
const verified = ref(false);

onMounted(() => {
  if (!store.customer.referenceid) router.replace("/merchant/dmt/customer/register");
});

const onVerify = (value) => { otpValue.value = value; verifyCurrent(); };

const verifyCurrent = async () => {
  if (!otpValue.value || otpValue.value.length < 6) { otpError.value = "Enter the complete 6-digit code"; return; }
  verifying.value = true;
  otpError.value = "";
  try {
    const res = await store.verifyCustomerOtp(otpValue.value);
    if (res.ok) {
      verified.value = true;
      notify("Mobile number verified", "success");
      setTimeout(() => router.push("/merchant/dmt/customer/aadhaar"), 1100);
    } else {
      otpError.value = res.message;
      notify(res.message, "error");
      otpRef.value?.reset();
    }
  } finally {
    verifying.value = false;
  }
};

const onResend = async () => {
  const res = await store.resendCustomerOtp();
  notify(res.ok ? "OTP resent successfully" : (res.message || "Could not resend OTP"), res.ok ? "success" : "error");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&display=swap');
.otp-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.otp-title { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 4px; }
.otp-sub { font-size: 12px; color: #64748b; margin-top: 3px; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
</style>
