<template>
  <v-card class="ben-card" rounded="lg" elevation="0">
    <div class="ben-logo" :style="{ background: bankAccent(beneficiary.ifsc) }">
      {{ initials(beneficiary.bankName || beneficiary.ifsc) }}
    </div>

    <div class="ben-body">
      <div class="ben-name-row">
        <span class="ben-name">{{ beneficiary.name }}</span>
        <v-icon v-if="beneficiary.verified" size="15" :color="BX.success2" title="Verified">mdi-check-decagram</v-icon>
      </div>
      <div class="ben-sub mono">{{ maskAccount(beneficiary.accountNumber) }} · {{ beneficiary.ifsc }}</div>
      <div class="ben-bank">{{ beneficiary.bankName || 'Bank account' }}</div>
    </div>

    <div class="ben-actions">
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="32" variant="text" color="grey-darken-1">
            <v-icon size="19">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="$emit('edit', beneficiary)">
            <template #prepend><v-icon size="17" class="mr-2">mdi-pencil-outline</v-icon></template>
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('delete', beneficiary)">
            <template #prepend><v-icon size="17" class="mr-2" :color="BX.error">mdi-trash-can-outline</v-icon></template>
            <v-list-item-title :style="{ color: BX.error }">Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        size="small"
        :color="BX.primary"
        class="ben-transfer-btn"
        :disabled="!beneficiary.verified"
        @click="$emit('transfer', beneficiary)"
      >
        Transfer
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { useDmtFormat } from "~/composables/useDmtFormat";
import { BX, bankAccent } from "~/utils/dmtTheme";

defineProps({ beneficiary: { type: Object, required: true } });
defineEmits(["transfer", "edit", "delete"]);

const { maskAccount } = useDmtFormat();
const initials = (name) => (name || "??").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "BK";
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=DM+Mono:wght@500;600&display=swap');
.ben-card {
  display: flex; align-items: center; gap: 12px; padding: 14px;
  border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important;
  font-family: 'DM Sans', sans-serif;
}
.ben-logo {
  width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 800; font-size: 12px;
}
.ben-body { flex: 1; min-width: 0; }
.ben-name-row { display: flex; align-items: center; gap: 6px; }
.ben-name { font-size: 13.5px; font-weight: 800; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ben-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
.ben-bank { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.mono { font-family: 'DM Mono', monospace; }
.ben-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.ben-transfer-btn { text-transform: none; font-weight: 700; letter-spacing: 0; }
</style>
