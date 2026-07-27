<template>
  <div>
    <AggregatorCardsList />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "aggregatorlayer",
  middleware: "auth",
});
</script>
