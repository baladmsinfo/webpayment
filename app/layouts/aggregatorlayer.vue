<template>
  <div>
    <aggregator-nav :menus="menus" />
    <v-container>
      <slot />
    </v-container>
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
    icon: "mdi-credit-card-outline",
    // 👇 Two submenu pages
    children: [
      {
        title: "Onboarded Merchants",
        icon: "mdi-account-check",
        url: "/aggregator/merchants/onboarded",
      },
      {
        title: "Pending Merchants",
        icon: "mdi-account-clock",
        url: "/aggregator/merchants/pending",
      },
    ],
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    url: "/aggregator/settings",
  },
])
</script>