<template>
  <MerchantDmtShell title="Beneficiaries" :subtitle="`${store.customer.name || 'Customer'} · ${store.beneficiaries.length} linked accounts`" back-to="/merchant/dmt/remitter">
    <template #header-action>
      <v-btn icon size="34" variant="tonal" :color="BX.primary" :loading="loading" @click="refresh">
        <v-icon size="18">mdi-refresh</v-icon>
      </v-btn>
    </template>

    <MerchantDmtWalletStrip class="mb-4" :remaining-limit="store.remitter.remainingLimit" />

    <div v-if="loading" class="ben-list">
      <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-avatar-two-line" class="skel-item" />
    </div>

    <div v-else-if="store.beneficiaries.length" class="ben-list">
      <MerchantDmtBeneficiaryCard
        v-for="b in store.beneficiaries"
        :key="b.id"
        :beneficiary="b"
        class="mb-3"
        @transfer="onTransfer"
        @edit="onEdit"
        @delete="onDeleteRequest"
      />
    </div>

    <div v-else class="empty-wrap">
      <v-icon size="52" color="grey-lighten-1">mdi-account-cash-outline</v-icon>
      <p class="empty-title">No beneficiaries yet</p>
      <p class="empty-sub">Add this customer's first beneficiary to start transferring money.</p>
    </div>

    <v-btn
      icon
      size="56"
      :color="BX.primary"
      class="fab"
      elevation="4"
      @click="router.push('/merchant/dmt/beneficiaries/add')"
    >
      <v-icon size="26">mdi-plus</v-icon>
    </v-btn>

    <v-dialog v-model="deleteDialog" max-width="360">
      <v-card rounded="lg" class="pa-4">
        <p class="del-title">Delete beneficiary?</p>
        <p class="del-sub">Remove <b>{{ toDelete?.name }}</b> from this customer's beneficiary list. This can't be undone.</p>
        <div class="d-flex ga-2 mt-4">
          <v-btn variant="tonal" block @click="deleteDialog = false">Cancel</v-btn>
          <v-btn :color="BX.error" variant="flat" block @click="confirmDelete">Delete</v-btn>
        </div>
      </v-card>
    </v-dialog>
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

const loading = ref(false);
const deleteDialog = ref(false);
const toDelete = ref(null);

onMounted(async () => {
  if (!store.remitter.senderId) { router.replace("/merchant/dmt/remitter"); return; }
  // Defensive re-fetch: if the remitter was loaded but the beneficiary list came back
  // empty (stale cache, direct navigation, or a prior mapping bug), retry once here so
  // the page is self-sufficient rather than silently trusting the remitter step's fetch.
  if (!store.beneficiaries.length) await refresh();
});

const refresh = async () => {
  const mobile = store.remitter.mobile || store.customer.mobile;
  if (!mobile) return;
  loading.value = true;
  try {
    const res = await store.loadRemitter(mobile);
    if (!res.ok) notify(res.message || "Could not refresh beneficiaries", "error");
  } finally {
    loading.value = false;
  }
};

const onTransfer = (ben) => {
  store.selectBeneficiary(ben);
  router.push("/merchant/dmt/transfer");
};

const onEdit = (ben) => {
  router.push({
    path: "/merchant/dmt/beneficiaries/add",
    query: { editId: ben.id, name: ben.name, mobile: ben.mobile, ifsc: ben.ifsc },
  });
};

const onDeleteRequest = (ben) => { toDelete.value = ben; deleteDialog.value = true; };

const confirmDelete = () => {
  // NSDL's documented DMT operation set has no beneficiary-delete endpoint yet —
  // this removes it from the agent's local list only. Wire a real call here once
  // paymentSystem exposes one.
  store.removeBeneficiary(toDelete.value.id);
  notify(`${toDelete.value.name} removed from beneficiary list`, "success");
  deleteDialog.value = false;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&display=swap');
.ben-list { font-family: 'DM Sans', sans-serif; }
.skel-item { border-radius: 16px; margin-bottom: 12px; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 56px 16px 20px; font-family: 'DM Sans', sans-serif; }
.empty-title { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 14px; }
.empty-sub { font-size: 12.5px; color: #94a3b8; margin-top: 6px; max-width: 260px; line-height: 1.5; }
.fab { position: fixed; right: 24px; bottom: 32px; z-index: 20; }
.del-title { font-size: 15px; font-weight: 800; color: #0f172a; font-family: 'DM Sans', sans-serif; }
.del-sub { font-size: 12.5px; color: #64748b; margin-top: 6px; font-family: 'DM Sans', sans-serif; }
</style>
