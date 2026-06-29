<template>
  <div class="admin-layout">
    <MerchantNavbar :menus="menus" :title="Title" />

    <main class="admin-main" :class="{ 'admin-main-shifted': drawerOpen && !isMobile }">
      <div class="admin-main-inner">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, provide, watch, onMounted, onBeforeUnmount } from "vue"
import { useUsersApi } from "~/composables/apis/useUsersApi"
import { useAuthStore } from "@/stores/auth";

const { getProfile } = useUsersApi();
const auth = useAuthStore();

const Title = ref();

const { fetchMerchant } = useUsersApi()

/* ── DRAWER STATE — shared with MerchantNavbar via provide ── */
const drawerOpen = ref(false)
provide("drawerOpen", drawerOpen)

/* ── RESPONSIVE ── */
const winW = ref(typeof window !== "undefined" ? window.innerWidth : 1280)
const isMobile = computed(() => winW.value < 960)
function onResize() {
  winW.value = window.innerWidth
  // Auto-close drawer when switching to mobile
  if (winW.value < 960) drawerOpen.value = false
}

/* ── MENUS ── */
const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    url: "/merchant/dashboard",
    open: false,
  },
  {
    title: "Wallet",
    icon: "mdi-wallet-outline",
    url: "/merchant/wallet",
    open: false,
  },
  {
    title: "Transactions",
    icon: "mdi-swap-horizontal",
    url: "/merchant/payments",
    open: false,
    children: [],
  },
  {
    title: "Settings",
    icon: "mdi-cog-outline",
    url: "/merchant/settings",
    open: false,
    children: [
      {
        title: "Profile",
        icon: "mdi-account-circle",
        url: "/merchant/settings",
      },
      {
        title: "Account Details",
        icon: "mdi-card-account-details-outline",
        url: "/merchant/account",
      },
    ]
  },
])

const serviceIconMap = {
  DMT:  "mdi-bank-transfer",
  AEPS: "mdi-fingerprint",
  UPI:  "mdi-qrcode",
  BBPS: "mdi-receipt-text-outline",
  MATM: "mdi-atm",
  POS:  "mdi-point-of-sale",
}

onMounted(async () => {
  window.addEventListener("resize", onResize)

  if (!isMobile.value) drawerOpen.value = true

  if(!auth.merchant) {
    try {
      await getProfile();
    } catch (error) {
      console.log("Error:", error);
    }
  }
  
  Title.value = auth.merchant?.legal_name || auth.merchant?.data?.legal_name || "Bucksbox";

  try {
    const res = await fetchMerchant()
    const services = (res?.data?.services ?? []).filter(s => s.status === "VERIFIED")

    const txMenu = menus.value.find(m => m.title === "Transactions")

    if (!services.length) {
      menus.value = menus.value.filter(m => m.title !== "Transactions")
      return
    }

    if (txMenu) {
      const uniqueServices = [...new Set(services.map(s => s.service))]
      txMenu.children = uniqueServices.map((svc) => ({
        title: `${svc} Transactions`,
        icon:  serviceIconMap[svc] ?? "mdi-clipboard-list-outline",
        url:   `/merchant/payments/${svc.toLowerCase()}`,
      }))
    }
  } catch (e) {
    console.error("Failed to fetch merchant services:", e)
  }
})

onBeforeUnmount(() => window.removeEventListener("resize", onResize))
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
  min-height: 100dvh;
  margin-left: 0;
  transition: margin-left .27s cubic-bezier(.4, 0, .2, 1);
}

.admin-main-shifted { margin-left: 260px; }

.admin-main-inner {
  padding: 18px 16px;
  max-width: 1480px;
}

@media (min-width: 640px)  { .admin-main-inner { padding: 22px; } }
@media (min-width: 1200px) { .admin-main-inner { padding: 28px 30px; } }
</style>