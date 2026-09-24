<template>
  <div>
    <div v-if="!ready" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate size="28" width="3" color="#1142d4" />
    </div>
    <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg">{{ error }}</v-alert>
    <!-- Same DMT (NSDL BC agent) onboarding flow vendors use, scoped to the
         merchant's own id (dmt.bc.controller resolves the merchant from the token). -->
    <VendorOnboardingDMTOnboard v-else :merchant-id="merchantId" finish-path="/merchant/dmt" />
  </div>
</template>

<script setup>
import { useSelfServiceOnboarding } from "~/composables/useSelfServiceOnboarding";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const { merchantId, ready, error } = useSelfServiceOnboarding("DMT");
</script>
