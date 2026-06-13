<template>
  <div class="ma-5">
    <WalletServiceSettings />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "walletservicelayer",
  middleware: "auth",
});
</script>