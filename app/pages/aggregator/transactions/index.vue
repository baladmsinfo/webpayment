<template>
  <div>
    <Transactions />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "aggregatorlayer",
  middleware: "auth",
});
</script>
