<template>
  <AggregatorMerchantsView :merchant-id="merchantId" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AggregatorMerchantsView from "~/components/Aggregator/Merchants/View.vue";

definePageMeta({ layout: 'aggregatorlayer', middleware: 'auth' });

const route = useRoute();
const merchantId = computed(() => route.params.id);
</script>
