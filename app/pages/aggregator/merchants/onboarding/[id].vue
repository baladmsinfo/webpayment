<template>
  <AggregatorMerchantsOnboarding :merchant-id="merchantId" :service-kyc-id="serviceKycId" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AggregatorMerchantsOnboarding from "~/components/Aggregator/Merchants/Onboarding.vue";

definePageMeta({ layout: 'aggregatorlayer', middleware: 'auth' });

const route = useRoute();
const merchantId = computed(() => route.params.id);
// ?svc=<MerchantServiceKyc id> — which row on the KYC & Services list this
// review is confirming. Optional, for backward-compat with old bare links.
const serviceKycId = computed(() => route.query.svc || null);
</script>
