<template>
  <MerchantDmtShell title="Remitter Details" subtitle="/dmt/txn/v1/remitter/details" back-to="/merchant/dmt">
    <MerchantDmtWalletStrip class="mb-4" :remaining-limit="loaded ? store.remitter.remainingLimit : null" />

    <v-skeleton-loader v-if="!loaded" type="article" class="skel-card" />

    <template v-else>
      <v-card rounded="lg" elevation="0" class="pa-4 remitter-card">
        <div class="rc-head">
          <v-avatar size="52" :color="BX.primary">
            <span class="avatar-init">{{ initials(store.remitter.name) }}</span>
          </v-avatar>
          <div class="rc-head-text">
            <p class="rc-name">{{ store.remitter.name || store.customer.name }}</p>
            <p class="rc-mobile mono">+91 {{ maskMobile(store.remitter.mobile) }}</p>
          </div>
          <v-chip :color="BX.success2" variant="tonal" size="small">Active</v-chip>
        </div>

        <v-divider class="my-3" />

        <div class="rc-row"><span class="k">Daily Transfer Limit</span><span class="v">{{ formatCurrencyShort(store.remitter.dailyLimit) }}</span></div>
        <div class="rc-row"><span class="k">Used Today</span><span class="v">{{ formatCurrencyShort(store.remitter.usedToday) }}</span></div>
        <div class="rc-row"><span class="k">Beneficiary Count</span><span class="v">{{ store.remitter.beneficiaryCount }}</span></div>

        <div class="rc-row mt-1">
          <span class="k">Remaining Limit</span>
          <span class="v remaining">{{ formatCurrencyShort(store.remitter.remainingLimit) }}</span>
        </div>
        <v-progress-linear
          :model-value="limitPct"
          height="6"
          rounded
          :color="BX.success2"
          bg-color="#eef1f7"
          class="mt-1"
        />
      </v-card>

      <v-btn block size="x-large" rounded="lg" :color="BX.primary" class="cta-btn mt-4" @click="router.push('/merchant/dmt/beneficiaries')">
        View Beneficiaries
        <v-icon end size="18">mdi-arrow-right</v-icon>
      </v-btn>
    </template>

    <v-alert v-if="errorMsg" type="error" variant="tonal" density="compact" class="mt-4" :text="errorMsg" />
  </MerchantDmtShell>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useDmtFormat } from "~/composables/useDmtFormat";
import { useSnackbar } from "~/composables/useSnackbar";
import { withRetry } from "~/composables/useNetworkStatus";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { formatCurrencyShort, maskMobile } = useDmtFormat();
const { notify } = useSnackbar();

const loaded = ref(false);
const errorMsg = ref("");

const limitPct = computed(() => {
  if (!store.remitter.dailyLimit) return 0;
  return Math.min(100, (store.remitter.remainingLimit / store.remitter.dailyLimit) * 100);
});

const initials = (name) => (name || "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

onMounted(async () => {
  if (!store.customer.mobile) { router.replace("/merchant/dmt"); return; }
  try {
    const res = await withRetry(() => store.loadRemitter(store.customer.mobile));
    if (!res.ok) { errorMsg.value = res.message; notify(res.message, "error"); return; }
    loaded.value = true;
  } catch (e) {
    errorMsg.value = "Network error while loading remitter details";
    notify(errorMsg.value, "error");
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@600;700&display=swap');
.skel-card { border-radius: 16px; }
.remitter-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.rc-head { display: flex; align-items: center; gap: 12px; }
.avatar-init { color: #fff; font-weight: 800; font-size: 16px; }
.rc-head-text { flex: 1; min-width: 0; }
.rc-name { font-size: 14.5px; font-weight: 800; color: #0f172a; }
.rc-mobile { font-size: 11.5px; color: #64748b; margin-top: 1px; }
.mono { font-family: 'DM Mono', monospace; }
.rc-row { display: flex; justify-content: space-between; padding: 6px 0; }
.k { font-size: 12px; color: #64748b; }
.v { font-size: 13px; font-weight: 700; color: #0f172a; font-family: 'DM Mono', monospace; }
.v.remaining { color: #059669; font-size: 16px; }
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; box-shadow: 0 8px 22px rgba(17,66,212,.28); }
</style>
