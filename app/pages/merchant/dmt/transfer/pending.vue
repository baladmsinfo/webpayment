<template>
  <MerchantDmtShell title="Transaction Processing" :show-back="false">
    <MerchantDmtStatusIllustration
      status="PENDING"
      title="Transaction Processing"
      :subtitle="`Your bank is confirming the transfer. Checking automatically… (attempt ${store.pollAttempts}/${store.pollMax})`"
    />

    <v-progress-linear :model-value="pollPct" height="6" rounded :color="BX.warning" bg-color="#eef1f7" class="my-4" />

    <MerchantDmtReceiptCard v-if="store.currentTransaction" :txn="store.currentTransaction" class="mb-4" />

    <v-btn block size="x-large" rounded="lg" variant="tonal" :color="BX.warning" class="cta-btn" :loading="refreshing" @click="manualRefresh">
      <v-icon start size="18">mdi-refresh</v-icon>
      Refresh Status
    </v-btn>
    <v-btn block size="large" variant="text" class="mt-2" @click="goHome">Home</v-btn>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDmtStore } from "~/stores/dmt";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { notify } = useSnackbar();

const refreshing = ref(false);
let cancelled = false;

const pollPct = computed(() => Math.min(100, (store.pollAttempts / store.pollMax) * 100));

const routeOnResolution = (status) => {
  if (status === "SUCCESS") router.replace("/merchant/dmt/transfer/success");
  else if (status === "FAILED") router.replace("/merchant/dmt/transfer/failed");
};

onMounted(() => {
  if (!store.currentTransaction) { router.replace("/merchant/dmt"); return; }
  if (store.currentTransaction.status !== "PENDING") { routeOnResolution(store.currentTransaction.status); return; }
  store.pollTransactionStatus((status) => { if (!cancelled) routeOnResolution(status); });
});
onBeforeUnmount(() => { cancelled = true; });

const manualRefresh = async () => {
  refreshing.value = true;
  try {
    const status = await store.manualRequery();
    if (status === "PENDING") notify("Still processing — check again shortly", "error");
    else routeOnResolution(status);
  } finally {
    refreshing.value = false;
  }
};

const goHome = () => router.push("/merchant/dashboard");
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&display=swap');
.cta-btn { text-transform: none; font-weight: 800; font-size: 15px; }
</style>
