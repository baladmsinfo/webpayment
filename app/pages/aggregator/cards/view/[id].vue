<template>
  <AggregatorCardsApplicationView :application-id="applicationId" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AggregatorCardsApplicationView from "~/components/Aggregator/Cards/ApplicationView.vue";

definePageMeta({ layout: "aggregatorlayer", middleware: "auth" });

const route = useRoute();
const applicationId = computed(() => route.params.id);
</script>
