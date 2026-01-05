<template>
  <v-container fluid>
    <MerchantView :merchant-id="merchantId" />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import MerchantView from "~/components/MerchantView.vue";


const route = useRoute();
const merchantId = computed(() => route.params.id);

onMounted(() => {
  console.log("Merchant ID from route:", merchantId.value);
});
</script>
