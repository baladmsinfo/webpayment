<template>
  <MerchantDmtShell :title="isEdit ? 'Edit Beneficiary' : 'Add Beneficiary'" subtitle="/dmt/txn/v1/beneficiary/add" back-to="/merchant/dmt/beneficiaries">
    <v-card rounded="lg" elevation="0" class="pa-4 form-card">
      <v-text-field v-model="form.receivername" label="Receiver Name" variant="outlined" density="comfortable" class="mb-1" @input="unlockVerify" />
      <v-text-field v-model="form.receivermobilenumber" label="Mobile Number" variant="outlined" density="comfortable" maxlength="10" inputmode="numeric" class="mb-1" @input="unlockVerify" />
      <v-text-field v-model="form.receiver_account_no" label="Account Number" variant="outlined" density="comfortable" inputmode="numeric" class="mb-1" @input="unlockVerify" />
      <v-text-field
        v-model="confirmAccount"
        label="Confirm Account Number"
        variant="outlined"
        density="comfortable"
        inputmode="numeric"
        class="mb-1"
        :error-messages="accountMismatch ? 'Account numbers do not match' : ''"
        @input="unlockVerify"
      />
      <v-text-field
        v-model="form.receiverIfscCode"
        label="IFSC Code"
        variant="outlined"
        density="comfortable"
        maxlength="11"
        class="mb-1"
        @input="onIfscInput"
      />
      <v-alert v-if="detectedBank" type="success" variant="tonal" density="compact" class="mb-3" :text="`Bank detected: ${detectedBank}`" />

      <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mb-3" :text="errorMsg" />

      <v-card v-if="verifiedHolder" flat rounded="lg" class="verified-box mb-3 pa-3">
        <div class="d-flex align-center ga-2">
          <v-icon :color="BX.success2" size="20">mdi-check-decagram</v-icon>
          <div>
            <p class="verified-name">✓ Verified Account Holder</p>
            <p class="verified-sub">{{ verifiedHolder.name }}</p>
          </div>
        </div>
      </v-card>

      <v-btn
        v-if="!verifiedHolder"
        block
        size="x-large"
        rounded="lg"
        variant="tonal"
        :color="BX.primary"
        class="cta-btn mb-2"
        :disabled="!canVerify"
        :loading="verifying"
        @click="onVerifyAccount"
      >
        <v-icon start size="18">mdi-shield-search</v-icon>
        Verify Account
      </v-btn>

      <v-btn
        block
        size="x-large"
        rounded="lg"
        :color="BX.primary"
        class="cta-btn"
        :disabled="!verifiedHolder"
        :loading="adding"
        @click="onAddBeneficiary"
      >
        {{ isEdit ? 'Save Beneficiary' : 'Add Beneficiary' }}
      </v-btn>
    </v-card>
  </MerchantDmtShell>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX, bankNameFromIfsc } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const route = useRoute();
const router = useRouter();
const store = useDmtStore();
const { notify } = useSnackbar();

const isEdit = computed(() => !!route.query.editId);

const form = reactive({
  receivername: route.query.name || "",
  receivermobilenumber: route.query.mobile || "",
  receiver_account_no: "",
  receiverIfscCode: route.query.ifsc || "",
});
const confirmAccount = ref("");
const detectedBank = ref(bankNameFromIfsc(form.receiverIfscCode));
const verifiedHolder = ref(null);
const errorMsg = ref("");
const verifying = ref(false);
const adding = ref(false);

onMounted(() => {
  if (!store.remitter.senderId) router.replace("/merchant/dmt/remitter");
});

const accountMismatch = computed(() => confirmAccount.value && form.receiver_account_no !== confirmAccount.value);

const canVerify = computed(() =>
  form.receivername.trim() &&
  /^\d{10}$/.test(form.receivermobilenumber) &&
  form.receiver_account_no.length >= 6 &&
  !accountMismatch.value &&
  /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.receiverIfscCode)
);

const onIfscInput = () => {
  form.receiverIfscCode = form.receiverIfscCode.toUpperCase();
  detectedBank.value = bankNameFromIfsc(form.receiverIfscCode);
  unlockVerify();
};
const unlockVerify = () => { verifiedHolder.value = null; errorMsg.value = ""; };

const onVerifyAccount = async () => {
  errorMsg.value = "";
  verifying.value = true;
  try {
    const res = await store.verifyBeneficiaryAccount({
      receiver_account_no: form.receiver_account_no,
      receiverIfscCode: form.receiverIfscCode,
      receivername: form.receivername,
      receivermobilenumber: form.receivermobilenumber,
    });
    if (res.ok) {
      verifiedHolder.value = { name: res.holderName };
      notify("Account verified", "success");
    } else {
      errorMsg.value = res.message;
      notify(res.message, "error");
    }
  } finally {
    verifying.value = false;
  }
};

const onAddBeneficiary = async () => {
  adding.value = true;
  try {
    const res = await store.addBeneficiary({
      receivername: form.receivername,
      receivermobilenumber: form.receivermobilenumber,
      receiverIfscCode: form.receiverIfscCode,
      receiver_account_no: form.receiver_account_no,
      bankName: detectedBank.value,
    });
    if (res.ok) {
      if (isEdit.value) store.removeBeneficiary(String(route.query.editId));
      notify("Beneficiary added successfully", "success");
      router.push("/merchant/dmt/beneficiaries");
    } else {
      notify(res.message, "error");
    }
  } finally {
    adding.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&display=swap');
.form-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.verified-box { background: #f0fdf4 !important; border: 1px solid #bbf7d0 !important; }
.verified-name { font-size: 12.5px; font-weight: 800; color: #0f172a; }
.verified-sub { font-size: 12px; color: #64748b; margin-top: 1px; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; }
</style>
