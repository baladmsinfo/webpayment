<template>
  <v-container fluid>
    <VendorOnboarding :vendor-id="vendorId" />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const vendorId = computed(() => route.params.id);

onMounted(() => {
  console.log("vendor ID from route:", vendorId.value);
});
</script>
