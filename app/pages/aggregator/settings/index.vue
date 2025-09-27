<template>
  <div>
    <SettingsAggregator />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "aggregatorlayer",
  middleware: "auth",
});
</script>