<template>
  <div>
    <MerchantsVendor />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "vendorlayer",
  middleware: "auth",
});
</script>