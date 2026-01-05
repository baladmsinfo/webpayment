<template>
  <div>
    <SettingVendor />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "vendorlayer",
  middleware: "auth",
});
</script>