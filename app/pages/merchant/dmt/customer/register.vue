<template>
  <MerchantDmtShell title="Register Customer" subtitle="Step 1 of 4 · Basic details" back-to="/merchant/dmt">
    <v-progress-linear :model-value="25" :color="BX.primary" bg-color="#eef1f7" height="5" rounded class="mb-5" />

    <v-card rounded="lg" elevation="0" class="pa-4 form-card">
      <v-text-field v-model="form.name" label="Customer Name" variant="outlined" density="comfortable" class="mb-1" />
      <v-text-field v-model="form.mobile_no" label="Mobile Number" variant="outlined" density="comfortable" prefix="+91" maxlength="10" inputmode="numeric" class="mb-1" readonly />
      <v-text-field v-model="form.email_id" label="Email (optional)" variant="outlined" density="comfortable" class="mb-1" />
      <v-text-field v-model="form.city" label="City" variant="outlined" density="comfortable" class="mb-1" />
      <v-text-field v-model="form.state" label="State" variant="outlined" density="comfortable" />

      <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mb-3" :text="errorMsg" />

      <v-btn block size="x-large" rounded="lg" :color="BX.primary" class="cta-btn" :loading="loading" @click="onContinue">
        Continue
      </v-btn>
    </v-card>
  </MerchantDmtShell>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { notify } = useSnackbar();

const form = reactive({ name: "", mobile_no: "", email_id: "", city: "", state: "" });
const loading = ref(false);
const errorMsg = ref("");

onMounted(() => {
  if (!store.customer.mobile) { router.replace("/merchant/dmt"); return; }
  form.mobile_no = store.customer.mobile;
});

const onContinue = async () => {
  errorMsg.value = "";
  if (!form.name.trim() || !form.city.trim() || !form.state.trim()) {
    errorMsg.value = "Name, city and state are required";
    return;
  }
  loading.value = true;
  try {
    const res = await store.registerCustomer(form);
    if (res.ok) {
      notify("Customer registered — verify their mobile OTP to continue", "success");
      router.push("/merchant/dmt/customer/otp");
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
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@600;700&display=swap');
.form-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; margin-top: 8px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
</style>
