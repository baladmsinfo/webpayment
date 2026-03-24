<template>
    <AggregatorVendorsView :vendor-id="vendorId" />
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";


const route = useRoute();
const vendorId = computed(() => route.params.id);

onMounted(() => {
  console.log("Vendor ID from route:", vendorId.value);
});
</script>
