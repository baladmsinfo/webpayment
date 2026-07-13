<template>
  <MerchantDmtShell title="Send Money" subtitle="/dmt/txn/v1/transaction/otp" back-to="/merchant/dmt/beneficiaries">
    <MerchantDmtWalletStrip class="mb-4" :remaining-limit="store.remitter.remainingLimit" />

    <v-card v-if="store.selectedBeneficiary" rounded="lg" elevation="0" class="pa-3 ben-summary mb-4">
      <v-avatar size="44" :color="bankAccent(store.selectedBeneficiary.ifsc)" class="mr-3">
        <span class="avatar-init">{{ initials(store.selectedBeneficiary.bankName || store.selectedBeneficiary.ifsc) }}</span>
      </v-avatar>
      <div class="ben-info">
        <p class="ben-name">{{ store.selectedBeneficiary.name }}</p>
        <p class="ben-sub">{{ store.selectedBeneficiary.bankName || 'Bank account' }} · {{ maskAccount(store.selectedBeneficiary.accountNumber) }}</p>
      </div>
    </v-card>

    <v-card rounded="lg" elevation="0" class="pa-4 amount-card mb-4">
      <div class="amt-display">
        <span class="cur">₹</span>
        <input
          v-model="amountInput"
          type="text"
          inputmode="numeric"
          class="amt-input"
          placeholder="0"
          @input="onAmountChange"
        />
      </div>
      <div class="amt-chips">
        <v-chip
          v-for="a in quickAmounts"
          :key="a"
          size="small"
          :variant="Number(amountInput) === a ? 'flat' : 'outlined'"
          :color="Number(amountInput) === a ? BX.primary : undefined"
          class="mr-2"
          @click="setAmount(a)"
        >
          ₹{{ a.toLocaleString('en-IN') }}
        </v-chip>
      </div>
      <p v-if="amountError" class="amt-error">{{ amountError }}</p>

      <v-text-field
        v-model="remarks"
        label="Remarks (optional)"
        variant="outlined"
        density="comfortable"
        class="mt-4"
        maxlength="40"
      />
    </v-card>

    <v-card rounded="lg" elevation="0" class="pa-4 fee-card mb-4">
      <div class="fee-row"><span>Transaction Charge</span><b>{{ formatCurrency(store.charges.charge) }}</b></div>
      <div class="fee-row"><span>GST (18%)</span><b>{{ formatCurrency(store.charges.gst) }}</b></div>
      <div class="fee-row"><span>Commission Earned</span><b :style="{ color: BX.success2 }">{{ formatCurrency(store.charges.commission) }}</b></div>
      <v-divider class="my-2" />
      <div class="fee-total">
        <span class="lbl">Total Debit</span>
        <span class="val">{{ formatCurrency(store.charges.totalDebit) }}</span>
      </div>
    </v-card>

    <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mb-3" :text="errorMsg" />

    <v-btn
      block
      size="x-large"
      rounded="lg"
      :color="BX.primary"
      class="cta-btn"
      :disabled="!store.canSendOtp"
      :loading="loading"
      @click="onSendOtp"
    >
      Send OTP
      <v-icon end size="18">mdi-arrow-right</v-icon>
    </v-btn>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useDmtFormat } from "~/composables/useDmtFormat";
import { useMerchantBalanceApi } from "~/composables/apis/useMerchantBalanceApi";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX, bankAccent } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { formatCurrency, maskAccount } = useDmtFormat();
const { balanceData, fetchBalance } = useMerchantBalanceApi();
const { notify } = useSnackbar();

const quickAmounts = [500, 1000, 2000, 5000];
const amountInput = ref(store.amount ? String(store.amount) : "");
const remarks = ref(store.remarks || "");
const amountError = ref("");
const errorMsg = ref("");
const loading = ref(false);
let debounceTimer = null;

const initials = (name) => (name || "??").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "BK";

onMounted(() => {
  if (!store.selectedBeneficiary) { router.replace("/merchant/dmt/beneficiaries"); return; }
  if (!balanceData.value.balance) fetchBalance();
});
onUnmounted(() => { if (debounceTimer) clearTimeout(debounceTimer); });

const validateAmount = (val) => {
  if (!val || val <= 0) return "Enter an amount to transfer";
  if (val > store.remitter.remainingLimit) return "Amount exceeds the remaining daily limit";
  if (val > (balanceData.value.balance || 0)) return "Amount exceeds your wallet balance";
  return "";
};

const setAmount = (a) => { amountInput.value = String(a); onAmountChange(); };

const onAmountChange = () => {
  amountInput.value = amountInput.value.replace(/[^0-9]/g, "");
  const val = Number(amountInput.value || 0);
  amountError.value = validateAmount(val);
  store.remarks = remarks.value;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => store.fetchCharges(val), 350);
};

const onSendOtp = async () => {
  errorMsg.value = "";
  const val = Number(amountInput.value || 0);
  amountError.value = validateAmount(val);
  if (amountError.value) return;

  store.amount = val;
  store.remarks = remarks.value;
  loading.value = true;
  try {
    const res = await store.requestTransferOtp();
    if (res.ok) {
      notify("OTP sent to the customer's registered mobile", "success");
      router.push("/merchant/dmt/transfer/otp");
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
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@600;700;800&display=swap');
.ben-summary { display: flex; align-items: center; border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.avatar-init { color: #fff; font-weight: 800; font-size: 12px; }
.ben-info { flex: 1; min-width: 0; }
.ben-name { font-size: 13.5px; font-weight: 800; color: #0f172a; }
.ben-sub { font-size: 11.5px; color: #64748b; margin-top: 1px; }

.amount-card, .fee-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.amt-display { text-align: center; padding: 6px 0 4px; }
.cur { font-size: 22px; font-weight: 700; color: #94a3b8; vertical-align: top; position: relative; top: 8px; }
.amt-input { border: none; outline: none; background: none; font-family: 'DM Mono', monospace; font-size: 40px; font-weight: 800; color: #0f172a; width: 70%; text-align: center; }
.amt-chips { display: flex; justify-content: center; flex-wrap: wrap; margin-top: 6px; }
.amt-error { color: #dc2626; font-size: 11.5px; font-weight: 700; text-align: center; margin-top: 8px; }

.fee-row { display: flex; justify-content: space-between; font-size: 12.5px; color: #64748b; padding: 4px 0; }
.fee-row b { font-family: 'DM Mono', monospace; color: #0f172a; font-weight: 700; }
.fee-total { display: flex; justify-content: space-between; align-items: center; }
.fee-total .lbl { font-size: 13px; font-weight: 800; color: #0f172a; }
.fee-total .val { font-size: 18px; font-weight: 800; color: #1142d4; font-family: 'DM Mono', monospace; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
</style>
