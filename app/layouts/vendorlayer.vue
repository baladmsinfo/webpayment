<template>
  <div class="admin-layout">
    <VendorNavbar :menus="menus" />

    <!-- main shifts right only when drawer is open on desktop -->
    <main class="admin-main" :class="{ 'admin-main-shifted': drawerOpen && !isMobile }">
      <div class="admin-main-inner">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted, onBeforeUnmount } from "vue"

/* ── Shared drawer state — provided to VendorNav via inject ── */
const drawerOpen = ref(false)
provide("drawerOpen", drawerOpen)

/* ── Mirror mobile breakpoint in layout too ── */
const winW     = ref(typeof window !== "undefined" ? window.innerWidth : 1280)
const isMobile = computed(() => winW.value < 960)
function onResize() { winW.value = window.innerWidth }
onMounted(() => window.addEventListener("resize", onResize))
onBeforeUnmount(() => window.removeEventListener("resize", onResize))

const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    url: "/vendor/dashboard",
    open: false,
  },
  {
    title: "Merchants",
    icon: "mdi-store-outline",
    url: "/vendor/merchants",
    // open: false,
    // children: [
    //   { title: "Onboarded Merchants", icon: "mdi-account-check-outline", url: "/vendor/merchants/onboarding" },
    //   { title: "Pending Merchants",   icon: "mdi-account-clock-outline",  url: "/vendor/merchants/pending"   },
    // ],
  },
  {
    title: "Transactions",
    icon: "mdi-swap-horizontal",
    url: "/vendor/transactions",
    open: false,
  },
  {
    title: "Settings",
    icon: "mdi-cog-outline",
    url: "/vendor/settings",
    open: false,
  },
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; }

.admin-layout {
  font-family: 'DM Sans', sans-serif;
  background: #f6f6f8;
  min-height: 100dvh;
}

.admin-main {
  padding-top: 56px;
  min-height: 100dvh;
  margin-left: 0;                                          /* default: no shift */
  transition: margin-left .27s cubic-bezier(.4,0,.2,1);   /* smooth like Vuetify */
}

/* Only shift when drawer is open AND we're on desktop — controlled by JS class */
.admin-main-shifted {
  margin-left: 260px;
}

.admin-main-inner {
  padding: 18px 16px;
  max-width: 1480px;
}
@media (min-width: 640px)  { .admin-main-inner { padding: 22px; } }
@media (min-width: 1200px) { .admin-main-inner { padding: 28px 30px; } }
</style>