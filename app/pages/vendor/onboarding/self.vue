<template>
  <div class="onboard-wrap">
    <VendorOnboardingKycOnboard @submitted="onSubmitted" />
  </div>
</template>

<script setup>
import { useVendorKycStatus } from "~/composables/useVendorKycStatus";

definePageMeta({ middleware: "auth", layout: "vendorlayer" });

const { refreshKycStatus } = useVendorKycStatus();

function onSubmitted() {
  refreshKycStatus();
}
</script>

<style scoped>
.onboard-wrap {
  max-width: 860px;
  margin: 0 auto;
}
</style>
