<template>
  <div>
    <aggregator-nav
      title="BUCKSBOX"
      :menus="menus"
    >
      <template #content>
        <div class="layout-body">
          <slot />
        </div>
      </template>
    </aggregator-nav>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    url: "/aggregator/dashboard",
  },
  {
    title: "Merchants",
    icon: "mdi-storefront-outline",
    open: false,
    children: [
      { title: "Onboarded Merchants", icon: "mdi-store-check-outline",  url: "/aggregator/merchants/onboarded" },
      { title: "Pending Merchants",   icon: "mdi-store-clock-outline",  url: "/aggregator/merchants/pending"   },
    ],
  },
  {
    title: "Vendors",
    icon: "mdi-factory",
    open: false,
    children: [
      { title: "Onboarded Vendors", icon: "mdi-account-check-outline", url: "/aggregator/vendor/onboarded" },
      { title: "Pending Vendors",   icon: "mdi-account-clock-outline", url: "/aggregator/vendor/pending"   },
    ],
  },
  {
    title: "Transactions",
    icon: "mdi-swap-horizontal",
    url: "/aggregator/transactions",
  },
  {
    title: "Settings",
    icon: "mdi-cog-outline",
    url: "/aggregator/settings",
  },
]);
</script>

<style scoped>
.layout-body {
  padding: 20px 16px;
  min-height: calc(100dvh - 56px);
  background: #f6f6f8;
}
@media (min-width: 640px) {
  .layout-body { padding: 24px 20px; }
}
@media (min-width: 1024px) {
  .layout-body { padding: 28px 28px; }
}
</style>