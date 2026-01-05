<template>
  <div>
    <MerchantsPendingVendor />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "vendorlayer",
  middleware: "auth",
});
</script>