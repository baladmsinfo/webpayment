<template>
  <div>
    <VendorMerchantsList />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "vendorlayer",
  middleware: "auth",
});
</script>