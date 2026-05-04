<template>
  <div>
    <MerchantTransactions/>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "mlayer",
  middleware: "auth",
});
</script>
