<template>
  <div>
    <MerchantNavbar
      title="BUCKSBOX"
      :menus="menus"
    >
      <template #content>
        <div class="layout-body">
          <slot />
        </div>
      </template>
    </MerchantNavbar>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    enable: true,
    role: "merchant",
    url: "/merchant/dashboard",
  },
  {
    title: "Payments",
    icon: "mdi-credit-card-outline",
    enable: true,
    color: "red",
    url: "/merchant/payments",
  },
  // {
  //   title: "Customers",
  //   icon: "mdi-account-group",
  //   enable: true,
  //   role: "merchant",
  //   url: "/merchant/customers",
  // },
  // {
  //   title: "Reports",
  //   icon: "mdi-chart-bar",
  //   enable: false,
  //   role: "merchant",
  //   url: "/merchant/reports",
  // },
  {
    title: "Settings",
    icon: "mdi-cog",
    enable: false,
    role: "merchant",
    url: "/merchant/settings",
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