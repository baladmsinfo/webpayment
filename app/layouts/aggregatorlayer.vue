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
    role: "aggregator",
    url: "/aggregator",
  },
  {
    title: "Merchants",
    icon: "mdi-credit-card-outline",
    enable: true,
    color: "red",
    url: "/aggregator/merchants",
  },
  {
    title: "Settings",
    icon: "mdi-cog",
    enable: false,
    role: "aggregator",
    url: "/aggregator/settings",
  },
]);

</script>