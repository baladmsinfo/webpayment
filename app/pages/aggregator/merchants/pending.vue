<template>
  <div>
    <MerchantsPending />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "aggregatorlayer",
  middleware: "auth",
});
</script>