<template>
  <div>
    <div v-if="!ready" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate size="28" width="3" color="#1142d4" />
    </div>
    <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg">{{ error }}</v-alert>
    <!-- Same AEPS onboarding flow vendors use, scoped to the merchant's own id
         (the AEPS APIs ignore any other merchantId for the merchant role). -->
    <VendorOnboardingAEPSOnboard v-else :merchant-id="merchantId" success-path="/merchant/kyc/aeps" />
  </div>
</template>

<script setup>
import { useSelfServiceOnboarding } from "~/composables/useSelfServiceOnboarding";

definePageMeta({ layout: "mlayer", middleware: "auth" });

const { merchantId, ready, error } = useSelfServiceOnboarding("AEPS");
</script>
