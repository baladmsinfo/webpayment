<template>
  <MerchantDmtShell title="Transaction History" :subtitle="`${filtered.length} transactions`" back-to="/merchant/dashboard">
    <v-text-field
      v-model="search"
      variant="outlined"
      density="comfortable"
      placeholder="Search RRN, mobile, transaction ID or beneficiary"
      prepend-inner-icon="mdi-magnify"
      class="mb-3"
      clearable
    />

    <div class="chip-row mb-2">
      <v-chip v-for="d in dateFilters" :key="d.value" :variant="dateFilter === d.value ? 'flat' : 'outlined'" :color="dateFilter === d.value ? BX.primary : undefined" class="mr-2 mb-2" @click="applyDateFilter(d.value)">
        {{ d.label }}
      </v-chip>
      <v-menu v-model="customMenu" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-chip v-bind="props" :variant="dateFilter === 'custom' ? 'flat' : 'outlined'" :color="dateFilter === 'custom' ? BX.primary : undefined" class="mr-2 mb-2">
            <v-icon start size="14">mdi-calendar-range</v-icon>Custom
          </v-chip>
        </template>
        <v-card class="pa-3" width="260">
          <v-text-field v-model="customFrom" type="date" label="From" density="compact" variant="outlined" class="mb-2" />
          <v-text-field v-model="customTo" type="date" label="To" density="compact" variant="outlined" />
          <v-btn block :color="BX.primary" class="mt-2" @click="applyCustomRange">Apply</v-btn>
        </v-card>
      </v-menu>
    </div>

    <div class="chip-row mb-4">
      <v-chip
        v-for="s in statusFilters"
        :key="s.value"
        :variant="statusFilter === s.value ? 'flat' : 'outlined'"
        :color="statusFilter === s.value ? s.color : undefined"
        class="mr-2"
        @click="statusFilter = statusFilter === s.value ? '' : s.value"
      >
        {{ s.label }}
      </v-chip>
    </div>

    <div v-if="loading" class="hist-list">
      <v-skeleton-loader v-for="i in 5" :key="i" type="list-item-two-line" class="skel-item" />
    </div>

    <div v-else-if="filtered.length" class="hist-list">
      <v-card v-for="t in filtered" :key="t.id" rounded="lg" elevation="0" class="hist-row mb-2 pa-3" @click="openDetail(t)">
        <div class="hist-ic" :style="{ background: statusMeta(t.status).bg, color: statusMeta(t.status).color }">
          <v-icon size="18">{{ statusMeta(t.status).icon }}</v-icon>
        </div>
        <div class="hist-body">
          <p class="hist-name">{{ t.beneficiaryName || 'DMT Transfer' }}</p>
          <p class="hist-sub">{{ t.bankName || t.rrn || t.id }} · {{ formatDateTime(t.createdAt) }}</p>
        </div>
        <div class="hist-right">
          <p class="hist-amt">{{ formatCurrencyShort(t.amount) }}</p>
          <v-chip size="x-small" :color="statusMeta(t.status).color" variant="tonal">{{ t.status }}</v-chip>
        </div>
      </v-card>
    </div>

    <div v-else class="empty-wrap">
      <v-icon size="52" color="grey-lighten-1">mdi-receipt-text-outline</v-icon>
      <p class="empty-title">No transactions found</p>
      <p class="empty-sub">Try adjusting your filters or search.</p>
    </div>
  </MerchantDmtShell>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUsersApi } from "~/composables/apis/useUsersApi";
import { useDmtStore } from "~/stores/dmt";
import { useDmtFormat } from "~/composables/useDmtFormat";
import { useSnackbar } from "~/composables/useSnackbar";
import { BX } from "~/utils/dmtTheme";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const router = useRouter();
const store = useDmtStore();
const { getAllMerchantTransactions } = useUsersApi();
const { formatDateTime, formatCurrencyShort } = useDmtFormat();
const { notify } = useSnackbar();

const loading = ref(false);
const rawItems = ref([]);
const search = ref("");
const statusFilter = ref("");
const dateFilter = ref("today");
const customMenu = ref(false);
const customFrom = ref("");
const customTo = ref("");

const dateFilters = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This Week" },
];
const statusFilters = [
  { value: "SUCCESS", label: "Success", color: BX.success2 },
  { value: "PENDING", label: "Pending", color: BX.warning },
  { value: "FAILED", label: "Failed", color: BX.error },
];

const statusMeta = (status) => ({
  SUCCESS: { icon: "mdi-check", color: BX.success2, bg: BX.successTint },
  PENDING: { icon: "mdi-clock-outline", color: BX.warning, bg: BX.warningTint },
  FAILED: { icon: "mdi-close", color: BX.error, bg: BX.errorTint },
}[status] || { icon: "mdi-help", color: BX.muted, bg: "#f1f5f9" });

const dateRange = () => {
  const now = new Date();
  if (dateFilter.value === "today") {
    const from = new Date(now); from.setHours(0, 0, 0, 0);
    return { from: from.toISOString(), to: now.toISOString() };
  }
  if (dateFilter.value === "yesterday") {
    const from = new Date(now); from.setDate(from.getDate() - 1); from.setHours(0, 0, 0, 0);
    const to = new Date(from); to.setHours(23, 59, 59, 999);
    return { from: from.toISOString(), to: to.toISOString() };
  }
  if (dateFilter.value === "week") {
    const from = new Date(now); from.setDate(from.getDate() - 7);
    return { from: from.toISOString(), to: now.toISOString() };
  }
  if (dateFilter.value === "custom" && customFrom.value) {
    return { from: `${customFrom.value}T00:00:00.000`, to: customTo.value ? `${customTo.value}T23:59:59.999` : now.toISOString() };
  }
  return { from: undefined, to: undefined };
};

const load = async () => {
  loading.value = true;
  try {
    const { from, to } = dateRange();
    const res = await getAllMerchantTransactions({ page: 1, limit: 50, fromDate: from, toDate: to, transactionMethod: "DMT" });
    const generic = res?.data || [];
    // Enrich generic ledger rows with the richer detail we captured in-session (RRN, beneficiary, etc).
    const enrichedById = new Map(store.sessionTransactions.map((t) => [t.transactionId, t]));
    rawItems.value = generic.map((g) => {
      const rich = enrichedById.get(g.id);
      return rich ? { ...rich, id: g.id } : { id: g.id, amount: Number(g.amount), status: g.status, createdAt: g.createdAt };
    });
    // Session transactions not yet reflected in the generic ledger (e.g. still settling) still show up.
    const knownIds = new Set(rawItems.value.map((r) => r.id));
    for (const t of store.sessionTransactions) {
      if (!knownIds.has(t.transactionId)) rawItems.value.unshift({ ...t, id: t.transactionId });
    }
  } catch (e) {
    notify("Could not load transaction history", "error");
  } finally {
    loading.value = false;
  }
};

const filtered = computed(() => {
  let items = rawItems.value;
  if (statusFilter.value) items = items.filter((t) => t.status === statusFilter.value);
  if (search.value) {
    const q = search.value.toLowerCase();
    items = items.filter((t) =>
      [t.id, t.rrn, t.beneficiaryName, t.mobile, t.transactionId].some((f) => String(f || "").toLowerCase().includes(q))
    );
  }
  return items;
});

const applyDateFilter = (v) => { dateFilter.value = v; load(); };
const applyCustomRange = () => { dateFilter.value = "custom"; customMenu.value = false; load(); };

const openDetail = (t) => router.push(`/merchant/dmt/history/${t.id}`);

onMounted(load);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@600;700&display=swap');
.chip-row { display: flex; flex-wrap: wrap; }
.hist-list { font-family: 'DM Sans', sans-serif; }
.skel-item { border-radius: 14px; margin-bottom: 10px; }
.hist-row { display: flex; align-items: center; gap: 12px; border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 4px rgba(15,23,42,.04) !important; cursor: pointer; }
.hist-ic { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.hist-body { flex: 1; min-width: 0; }
.hist-name { font-size: 13px; font-weight: 700; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hist-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; font-family: 'DM Mono', monospace; }
.hist-right { text-align: right; flex-shrink: 0; }
.hist-amt { font-size: 13px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 56px 16px 20px; font-family: 'DM Sans', sans-serif; }
.empty-title { font-size: 15px; font-weight: 800; color: #0f172a; margin-top: 14px; }
.empty-sub { font-size: 12.5px; color: #94a3b8; margin-top: 6px; }
</style>
