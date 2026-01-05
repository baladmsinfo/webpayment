<template>
  <div>
    <TransactionsVendor />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "vendorlayer",
  middleware: "auth",
});
</script>
