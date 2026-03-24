<template>
  <v-container class="pa-0" fluid>
    <VendorMerchantsManage :merchant-id="merchantId" />
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const merchantId = computed(() => route.params.id);

</script>
