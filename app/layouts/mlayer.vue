<template>
  <div class="admin-layout">
    <MerchantNavbar :menus="menus" :title="Title" />

    <main class="admin-main" :class="{ 'admin-main-shifted': drawerOpen && !isMobile }">
      <div class="admin-main-inner">
        <MerchantKycNotificationCard v-if="showKycPendingBanner" />
        <MerchantKycVerificationPendingCard v-if="showKycSubmittedBanner" />
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
import { ref, computed, provide, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import { useUsersApi } from "~/composables/apis/useUsersApi"
import { useAuthStore } from "@/stores/auth";
import { useIdleTimer } from "~/composables/useIdleTimer";
import { useMerchantServices } from "~/composables/useMerchantServices";
import { useKycStatus } from "~/composables/useKycStatus";

const { getProfile } = useUsersApi();
const auth = useAuthStore();
const route = useRoute();

const { public: { BRAND_NAME } } = useRuntimeConfig();
const brandName = BRAND_NAME || "Bucksbox";
const { showWarning, countdown, keepAlive, doLogout } = useIdleTimer();
const { verifiedServices, allServices, hasWallet, loadMerchantServices, serviceKycState } = useMerchantServices();
const { isKycPending, isKycSubmitted, loadKycStatus } = useKycStatus();

const showKycPendingBanner   = computed(() => isKycPending.value   && route.path !== "/merchant/onboarding/isg");
const showKycSubmittedBanner = computed(() => isKycSubmitted.value && route.path !== "/merchant/onboarding/isg");

const Title = ref();

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
// Full menu before service filtering; buildMenus() derives the visible menu
// from it whenever the merchant's service KYC statuses change.
const BASE_MENUS = [
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    url: "/merchant/dashboard",
    open: false,
  },
  {
    title: "Money Transfer",
    icon: "mdi-bank-transfer",
    url: "/merchant/dmt",
    open: false,
    children: [
      { title: "Send Money", icon: "mdi-send-outline", url: "/merchant/dmt" },
      { title: "Transfer History", icon: "mdi-history", url: "/merchant/dmt/history" },
    ],
  },
  {
    title: "AEPS Services",
    icon: "mdi-fingerprint",
    url: "/merchant/aeps",
    open: false,
    children: [
      { title: "Cash Withdrawal", icon: "mdi-cash-multiple", url: "/merchant/aeps/cash-withdrawal" },
      { title: "Balance Enquiry", icon: "mdi-wallet-outline", url: "/merchant/aeps/balance-enquiry" },
      { title: "Mini Statement", icon: "mdi-receipt-text-outline", url: "/merchant/aeps/mini-statement" },
      // { title: "Aadhaar Pay", icon: "mdi-fingerprint", url: "/merchant/aeps/aadhaar-pay" },
    ],
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
      {
        title: "Wallet",
        icon: "mdi-wallet-outline",
        url: "/merchant/wallet",
      },
    ]
  },
]

const menus = ref([])

const serviceIconMap = {
  DMT:  "mdi-bank-transfer",
  AEPS: "mdi-fingerprint",
  UPI:  "mdi-qrcode",
  BBPS: "mdi-receipt-text-outline",
  MATM: "mdi-atm",
  POS:  "mdi-point-of-sale",
}

const serviceHistoryOverride = {
  DMT: "/merchant/dmt/history",
}

// AEPS / DMT menus appear for any linked service, whatever its KYC status.
// Until the service KYC is VERIFIED the menu opens the KYC status page
// (complete KYC / awaiting approval) instead of the transaction pages.
const SERVICE_MENUS = { "Money Transfer": "DMT", "AEPS Services": "AEPS" }

function buildMenus() {
  const base = JSON.parse(JSON.stringify(BASE_MENUS))
  const services = verifiedServices.value

  const txMenu = base.find(m => m.title === "Transactions")
  if (txMenu && services.length) {
    const uniqueServices = [...new Set(services.map(s => s.service))]
    txMenu.children = uniqueServices.map((svc) => ({
      title: `${svc} Transactions`,
      icon:  serviceIconMap[svc] ?? "mdi-clipboard-list-outline",
      url:   serviceHistoryOverride[svc] ?? `/merchant/payments/${svc.toLowerCase()}`,
    }))
  }

  const settingsMenu = base.find(m => m.title === "Settings")
  if (settingsMenu?.children && !hasWallet.value) {
    settingsMenu.children = settingsMenu.children.filter(c => c.title !== "Wallet")
  }

  menus.value = base
    .filter((m) => {
      if (m.title === "Transactions") return services.length > 0
      if (SERVICE_MENUS[m.title])     return serviceKycState(SERVICE_MENUS[m.title]) !== "NONE"
      return true
    })
    .map((m) => {
      const svc = SERVICE_MENUS[m.title]
      if (!svc || serviceKycState(svc) === "VERIFIED") return m
      const { children, ...rest } = m
      return { ...rest, url: `/merchant/kyc/${svc.toLowerCase()}` }
    })
}

// Re-derive when statuses change (e.g. after completing a KYC or "Check status").
watch(allServices, buildMenus)

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
  
  Title.value = auth.merchant?.legal_name || auth.merchant?.data?.legal_name || brandName;

  await loadMerchantServices()
  await loadKycStatus()

  buildMenus()
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
</style  buildMenus()
>