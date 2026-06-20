<template>
  <v-container fluid>
    <AggregatorMerchantsView :merchant-id="merchantId" />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import AggregatorMerchantsView from "~/components/Aggregator/Merchants/View.vue";

const route = useRoute();
const merchantId = computed(() => route.params.id);

// onMounted(() => {
//   console.log("Merchant ID from route:", merchantId.value);
// });
</script>
