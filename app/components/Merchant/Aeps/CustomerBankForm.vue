<template>
  <v-card rounded="lg" elevation="0" class="pa-4 form-card">
    <div class="field">
      <label class="field-label">Customer Name</label>
      <v-text-field v-model="customerName" variant="outlined" density="comfortable" placeholder="As per Aadhaar" />
    </div>

    <div class="field">
      <label class="field-label">Aadhaar Number</label>
      <v-text-field
        v-model="aadhaar"
        variant="outlined"
        density="comfortable"
        maxlength="12"
        inputmode="numeric"
        placeholder="12-digit Aadhaar number"
        :error-messages="aadhaarError"
      />
    </div>

    <div class="field">
      <label class="field-label">Select Bank</label>
      <v-select
        v-model="bankIin"
        variant="outlined"
        density="comfortable"
        :items="AEPS_BANKS"
        item-title="name"
        item-value="iin"
        placeholder="Choose issuing bank"
      />
    </div>

    <div class="field" v-if="withAmount">
      <label class="field-label">{{ amountLabel }}</label>
      <v-text-field
        v-model="amountInput"
        variant="outlined"
        density="comfortable"
        inputmode="numeric"
        prefix="₹"
        placeholder="0"
        :error-messages="amountError"
      />
    </div>

    <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mb-3" :text="errorMsg" />

    <v-btn block size="x-large" rounded="lg" :color="BX.primary" class="cta-btn" @click="onContinue">
      Continue
      <v-icon end size="18">mdi-arrow-right</v-icon>
    </v-btn>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { AEPS_BANKS, bankNameByIin } from "~/utils/aepsBanks";
import { BX } from "~/utils/dmtTheme";

const props = defineProps({
  withAmount: { type: Boolean, default: false },
  amountLabel: { type: String, default: "Amount" },
  maxAmount: { type: Number, default: 0 }, // wallet balance ceiling — 0 disables the check
});
const emit = defineEmits(["continue"]);

const customerName = ref("");
const aadhaar = ref("");
const bankIin = ref("");
const amountInput = ref("");
const aadhaarError = ref("");
const amountError = ref("");
const errorMsg = ref("");

const onContinue = () => {
  errorMsg.value = "";
  aadhaarError.value = "";
  amountError.value = "";

  if (!customerName.value.trim()) { errorMsg.value = "Enter the customer's name"; return; }
  if (!/^\d{12}$/.test(aadhaar.value)) { aadhaarError.value = "Enter a valid 12-digit Aadhaar number"; return; }
  if (!bankIin.value) { errorMsg.value = "Select the customer's bank"; return; }

  let amount = 0;
  if (props.withAmount) {
    amount = Number(String(amountInput.value).replace(/[^0-9]/g, "")) || 0;
    if (amount <= 0) { amountError.value = "Enter an amount"; return; }
    if (props.maxAmount > 0 && amount > props.maxAmount) { amountError.value = "Amount exceeds your wallet balance"; return; }
  }

  emit("continue", {
    customerName: customerName.value.trim(),
    aadhaar: aadhaar.value,
    bankIin: bankIin.value,
    bankName: bankNameByIin(bankIin.value),
    amount,
  });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&display=swap');
.form-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; }
.field { margin-bottom: 6px; }
.field-label { display: block; font-size: 11.5px; font-weight: 700; color: #64748b; margin-bottom: 6px; font-family: 'DM Sans', sans-serif; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; margin-top: 4px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
</style>
