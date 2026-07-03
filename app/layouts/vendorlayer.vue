<template>
  <div class="admin-layout">
    <VendorNavbar :menus="menus" :title="Title" />

    <main class="admin-main" :class="{ 'admin-main-shifted': drawerOpen && !isMobile }">
      <div class="admin-main-inner">
        <slot />
      </div>
    </main>

    <IdleWarning
      :show="showWarning"
      :countdown="countdown"
      @keep-alive="keepAlive"
      @logout="doLogout"
    />
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted, onBeforeUnmount } from "vue"
import { useVendorLinkedServiceApi } from '~/composables/apis/useVendorLinkedServiceApi'
import { useAuthStore } from "@/stores/auth";
import { useVendorApi } from "@/composables/apis/useVendorApi";
import { useIdleTimer } from "~/composables/useIdleTimer";

const { getVendor } = useVendorApi();
const auth = useAuthStore();
const { showWarning, countdown, keepAlive, doLogout } = useIdleTimer();

const Title = ref();

const { getMyLinkedServices } = useVendorLinkedServiceApi()

const drawerOpen = ref(false)
provide("drawerOpen", drawerOpen)

const winW = ref(typeof window !== "undefined" ? window.innerWidth : 1280)
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
    title: "Wallet",
    icon: "mdi-wallet-outline",
    url: "/vendor/wallet",
    open: false,
  },
  {
    title: "Merchants",
    icon: "mdi-store-outline",
    url: "/vendor/merchants",
    open: false,
    // children: [
    //   { title: "Onboarded Merchants", icon: "mdi-account-check-outline", url: "/vendor/merchants/onboarding" },
    //   { title: "Pending Merchants",   icon: "mdi-account-clock-outline",  url: "/vendor/merchants/pending"   },
    // ],
  },
  {
    title: "Transactions",
    icon: "mdi-swap-horizontal",
    url: "/vendor/payments",
    open: false,
    children: [],
  },
  {
    title: "Settings",
    icon: "mdi-cog-outline",
    url: "/vendor/settings",
    open: false,
    children: [
      {
        title: "Profile",
        icon: "mdi-account-circle",
        url: "/vendor/settings",
      },
      {
        title: "Account Details",
        icon: "mdi-card-account-details-outline",
        url: "/vendor/account",
      },
    ]
  },
])

const serviceIconMap = {
  DMT: "mdi-bank-transfer",
  AEPS: "mdi-fingerprint",
  UPI: "mdi-qrcode",
  BBPS: "mdi-receipt-text-outline",
  MATM: "mdi-atm",
  POS: "mdi-point-of-sale",
}

onMounted(async () => {
  window.addEventListener("resize", onResize)
  if(!auth.vendor) {
    try {
      await getVendor();
    } catch (error) {
      console.log("Error:", error);
    }
  }
  
  Title.value = auth.vendor?.name || "Bucksbox";

  try {
    const res = await getMyLinkedServices()
    
    const services = res?.services ?? res?.data?.services ?? []

    const txMenu = menus.value.find(m => m.title === "Transactions")

    if (!services.length) {
      menus.value = menus.value.filter(m => m.title !== "Transactions")
    }

    if (services.length && txMenu) {
      txMenu.children = services.map((data) => ({
        title: `${data.service} Transactions`,
        icon: serviceIconMap[data.service] ?? "mdi-clipboard-list-outline",
        url: `/vendor/transactions/${data.service.toLowerCase()}`,
      }))
    }

    // if (txMenu) {
    //   txMenu.children = services.map((data) => ({
    //     title: `${data.service} Transactions`,
    //     icon:  serviceIconMap[data.service] ?? "mdi-clipboard-list-outline",
    //     url:   `/vendor/transactions/${data.service.toLowerCase()}`,
    //   }))
    // }
  } catch (e) {
    console.error("Failed to fetch vendor linked services:", e)
  }
})

onBeforeUnmount(() => window.removeEventListener("resize", onResize))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

*,
*::before,
*::after {
  box-sizing: border-box;
}

.admin-layout {
  font-family: 'DM Sans', sans-serif;
  background: #f6f6f8;
  min-height: 100dvh;
}

.admin-main {
  padding-top: 56px;
  min-height: 100dvh;
  margin-left: 0;
  /* default: no shift */
  transition: margin-left .27s cubic-bezier(.4, 0, .2, 1);
  /* smooth like Vuetify */
}

/* Only shift when drawer is open AND we're on desktop — controlled by JS class */
.admin-main-shifted {
  margin-left: 260px;
}

.admin-main-inner {
  padding: 18px 16px;
  max-width: 1480px;
}

@media (min-width: 640px) {
  .admin-main-inner {
    padding: 22px;
  }
}

@media (min-width: 1200px) {
  .admin-main-inner {
    padding: 28px 30px;
  }
}
</style>