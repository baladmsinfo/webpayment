<template>
  <MerchantServiceKycStatus service="DMT" />
</template>

<script setup>
// DMT KYC status page — /merchant/dmt/* redirects here until DMT KYC is VERIFIED
// (see middleware/merchant-service-kyc.global.ts).
definePageMeta({ layout: "mlayer", middleware: "auth" });
</script>
