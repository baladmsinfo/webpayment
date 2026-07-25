<template>
  <div class="onboard-wrap">
    <MerchantOnboardingISGOnboard @submitted="onSubmitted" />
  </div>
</template>

<script setup>
import { useKycStatus } from "~/composables/useKycStatus";

definePageMeta({ middleware: "auth", layout: "mlayer" });

const { refreshKycStatus } = useKycStatus();

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
