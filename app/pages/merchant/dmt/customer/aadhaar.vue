<template>
  <MerchantDmtShell title="Aadhaar Verification" subtitle="Step 3 of 4 · e-KYC" back-to="/merchant/dmt/customer/otp">
    <v-progress-linear :model-value="75" :color="BX.primary" bg-color="#eef1f7" height="5" rounded class="mb-5" />

    <v-card rounded="lg" elevation="0" class="pa-4 text-center info-card">
      <v-icon size="36" :color="BX.primary">mdi-card-account-details-outline</v-icon>
      <p class="info-text">Aadhaar is used only for e-KYC verification per NSDL/UIDAI guidelines. The number is masked and never stored in full.</p>
    </v-card>

    <v-card rounded="lg" elevation="0" class="pa-4 mt-4 form-card">
      <v-text-field
        v-model="aadhaar"
        label="Aadhaar Number"
        variant="outlined"
        density="comfortable"
        maxlength="12"
        inputmode="numeric"
        placeholder="12-digit Aadhaar number"
        :error-messages="errorMsg"
      />
      <v-btn block size="x-large" rounded="lg" :color="BX.primary" class="cta-btn" :loading="loading" @click="onVerify">
        <v-icon start size="18">mdi-shield-check-outline</v-icon>
        Verify UID
      </v-btn>
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

const aadhaar = ref("");
const errorMsg = ref("");
const loading = ref(false);

onMounted(() => {
  if (!store.customer.otpVerified) router.replace("/merchant/dmt/customer/otp");
});

const onVerify = async () => {
  errorMsg.value = "";
  if (!/^\d{12}$/.test(aadhaar.value)) { errorMsg.value = "Enter a valid 12-digit Aadhaar number"; return; }
  loading.value = true;
  try {
    const res = await store.verifyAadhaar(aadhaar.value);
    if (res.ok) {
      notify("Aadhaar verified successfully", "success");
      router.push("/merchant/dmt/customer/biometric");
    } else {
      errorMsg.value = res.message;
      notify(res.message, "error");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&display=swap');
.info-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; }
.info-text { font-size: 12.5px; color: #64748b; margin-top: 10px; line-height: 1.5; font-family: 'DM Sans', sans-serif; }
.form-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; margin-top: 4px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
</style>
