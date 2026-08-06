<template>
  <div>
    <AggregatorProfilesList />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "aggregatorlayer",
  middleware: "auth",
});
</script>