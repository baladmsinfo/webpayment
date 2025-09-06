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
    value: "List of Dashboard",
    icon: "fa:fas fa-tachometer-alt",
    enable: true,
    role: "merchant",
    url: "/merchant",
  },
  {
    title: "Payments",
    value: "List of Payment",
    icon: "fa:fas fa-credit-card",
    enable: true,
    color: "red",
    url: "/merchant/payments",
  },
  {
    title: "Customers",
    value: "List of Customer",
    icon: "fa:fas fa-users",
    enable: true,
    role: "merchant",
    url: "/merchant/customers",
  },
  {
    title: "Reports",
    value: "Reports",
    icon: "fa:fa-solid fa-magnifying-glass-chart",
    enable: false,
    role: "merchant",
    url: "/merchant/reports",
  },
    {
    title: "Settings",
    value: "Settings",
    icon: "fa:fa-solid fa-magnifying-glass-chart",
    enable: false,
    role: "merchant",
    url: "/merchant/settings",
  },
]);

</script>