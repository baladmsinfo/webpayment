<template>
  <AggregatorMerchantsOnboarding :merchant-id="merchantId" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AggregatorMerchantsOnboarding from "~/components/Aggregator/Merchants/Onboarding.vue";

definePageMeta({ layout: 'aggregatorlayer', middleware: 'auth' });

const route = useRoute();
const merchantId = computed(() => route.params.id);
</script>
