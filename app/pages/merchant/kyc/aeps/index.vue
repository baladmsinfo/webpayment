<template>
  <MerchantServiceKycStatus service="AEPS" />
</template>

<script setup>
// AEPS KYC status page — /merchant/aeps/* redirects here until AEPS KYC is VERIFIED
// (see middleware/merchant-service-kyc.global.ts).
definePageMeta({ layout: "mlayer", middleware: "auth" });
</script>
