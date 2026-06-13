<template>
  <div>
    <VendorTransactions :transactionType="transactionType" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"

definePageMeta({
  layout: "vendorlayer",
  middleware: "auth",
})

const route = useRoute()

const transactionType = computed(() => {
  const service = route.params.service
  return service ? service.toUpperCase() : "DMT"
})

</script>