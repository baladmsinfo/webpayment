<template>
  <div>
    <VendorOnboardingEasebuzzOnboard :merchant-id="merchantId" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const merchantId = computed(() => route.params.id);
</script>
