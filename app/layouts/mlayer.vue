<template>
  <div>
    <admin-nav :menus="menus" />
    <v-container>
      <slot />
    </v-container>

  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard",
    enable: true,
    role: "merchant",
    url: "/merchant",
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
  {
    title: "Reports",
    icon: "mdi-chart-bar",
    enable: false,
    role: "merchant",
    url: "/merchant/reports",
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    enable: false,
    role: "merchant",
    url: "/merchant/settings",
  },
]);

</script>