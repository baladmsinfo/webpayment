<template>
  <div>
    <Kyc :merchantId="merchantId" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const merchantId = route.query.merchantId
</script>
