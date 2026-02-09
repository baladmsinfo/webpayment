<template>
  <div class="pa-4">
    <aggregator-nav :menus="menus" />
    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue"

const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    url: "/aggregator",
  },

  {
    title: "Merchants",
    icon: "mdi-storefront", // 🏪 Merchant icon
    children: [
      {
        title: "Onboarded Merchants",
        icon: "mdi-store-check",
        url: "/aggregator/merchants/onboarded",
      },
      {
        title: "Pending Merchants",
        icon: "mdi-store-clock",
        url: "/aggregator/merchants/pending",
      },
    ],
  },

  {
    title: "Vendors",
    icon: "mdi-factory", // 🏭 Vendor icon
    children: [
      {
        title: "Onboarded Vendors",
        icon: "mdi-account-check",
        url: "/aggregator/vendor/onboarded",
      },
      {
        title: "Pending Vendors",
        icon: "mdi-account-clock",
        url: "/aggregator/vendor/pending",
      },
    ],
  },

  {
    title: "Transactions",
    icon: "mdi-cash-multiple",
    url: "/aggregator/transactions",
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    url: "/aggregator/settings",
  },
])
</script>