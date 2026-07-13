<template>
  <MerchantDmtShell title="Send Money" subtitle="Search customer by registered mobile number" :show-back="false" back-to="/merchant/dashboard">
    <MerchantDmtWalletStrip class="mb-4" />

    <v-card rounded="lg" elevation="0" class="pa-4 search-card">
      <label class="field-label">Customer Mobile Number</label>
      <v-text-field
        v-model="mobile"
        variant="outlined"
        density="comfortable"
        maxlength="10"
        inputmode="numeric"
        prefix="+91"
        placeholder="Enter 10-digit mobile number"
        :error-messages="mobileError"
        @keyup.enter="onContinue"
        autofocus
      />

      <v-alert v-if="store.lastError" type="error" variant="tonal" density="compact" class="mb-3" :text="store.lastError" />

      <v-btn
        block
        size="x-large"
        rounded="lg"
        :color="BX.primary"
        class="cta-btn"
        :loading="loading"
        :disabled="loading"
        @click="onContinue"
      >
        Continue
        <v-icon end size="18">mdi-arrow-right</v-icon>
      </v-btn>
    </v-card>

    <p class="hint-text">Connected to <b class="mono">/dmt/customer/GetDetail</b> — we'll automatically detect whether this customer is already onboarded.</p>
  </MerchantDmtShell>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useSnackbar } from "~/composables/useSnackbar";
import { withRetry } from "~/composables/useNetworkStatus";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { notify } = useSnackbar();

const mobile = ref("");
const mobileError = ref("");
const loading = ref(false);

const validate = () => {
  mobileError.value = "";
  if (!/^\d{10}$/.test(mobile.value)) {
    mobileError.value = "Enter a valid 10-digit mobile number";
    return false;
  }
  return true;
};

const onContinue = async () => {
  if (loading.value || !validate()) return;
  loading.value = true;
  try {
    const result = await withRetry(() => store.searchCustomer(mobile.value));
    if (result === "found") {
      notify(`Welcome back, ${store.customer.name || "customer"}`, "success");
      router.push("/merchant/dmt/remitter");
    } else if (result === "not-found") {
      notify("New customer — let's get them onboarded", "success");
      router.push("/merchant/dmt/customer/register");
    } else {
      notify(store.lastError || "Could not verify customer", "error");
    }
  } catch (e) {
    notify("Network error — please check your connection and retry", "error");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=DM+Mono:wght@500;600&display=swap');
.field-label { display: block; font-size: 11.5px; font-weight: 700; color: #64748b; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }
.search-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; letter-spacing: 0; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
.hint-text { font-size: 11.5px; color: #94a3b8; text-align: center; margin-top: 14px; font-family: 'DM Sans', sans-serif; }
.mono { font-family: 'DM Mono', monospace; }
</style>
