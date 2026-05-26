<template>
  <div>
    <WalletAgentNavbar title="BUCKSBOX" :menus="menus">
      <template #content>
        <div class="layout-body">
          <slot />
        </div>
      </template>
    </WalletAgentNavbar>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    url: "/wallet-agent/dashboard",
  },
  {
    title: "Wallet",
    icon: "mdi-wallet-outline",
    url: "/wallet-agent/wallet",
  },
  {
    title: "Transactions",
    icon: "mdi-swap-horizontal",
    url: "/wallet-agent/transactions",
    // children: [],
  },
  {
    title: "Settings",
    icon: "mdi-cog-outline",
    url: "/wallet-agent/settings",
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
  .layout-body {
    padding: 24px 20px;
  }
}

@media (min-width: 1024px) {
  .layout-body {
    padding: 28px 28px;
  }
}
</style>
