<template>
  <div class="pa-4">
    <vendor-nav :menus="menus" />
    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue"

const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    url: "/vendor",
  },
  {
    title: "Merchants",
    icon: "mdi-credit-card-outline",
    // 👇 Two submenu pages
    children: [
      {
        title: "Onboarded Merchants",
        icon: "mdi-account-check",
        url: "/vendor/merchants/onboarded",
      },
      {
        title: "Pending Merchants",
        icon: "mdi-account-clock",
        url: "/vendor/merchants/pending",
      },
    ],
  },
  {
    title: "Transactions",
    icon: "mdi-cash-multiple",
    url: "/vendor/transactions",
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    url: "/vendor/settings",
  },
])
</script>