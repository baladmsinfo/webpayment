<template>
  <AggregatorProfilesView :profile-id="profileId" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AggregatorProfilesView from "~/components/Aggregator/Profiles/View.vue";

definePageMeta({ layout: 'aggregatorlayer', middleware: 'auth' });

const route = useRoute();
const profileId = computed(() => route.params.id);
</script>
