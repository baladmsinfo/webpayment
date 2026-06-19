<template>
  <div>
    <AggregatorNavbar
      :title="Title"
      :menus="menus"
    >
      <template #content>
        <div class="layout-body">
          <slot />
        </div>
      </template>
    </AggregatorNavbar>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted, onBeforeUnmount } from "vue"
import { useOnboadingApi } from "~/composables/apis/useOnboadingApi";
import { useAuthStore } from "@/stores/auth";
import { useAggregatorApi } from "@/composables/apis/useAggregatorApi";

const { getAggregator } = useAggregatorApi();
const auth = useAuthStore();

const Title = ref();

const { getServices } = useOnboadingApi();

const drawerOpen = ref(false)
provide("drawerOpen", drawerOpen)

const winW     = ref(typeof window !== "undefined" ? window.innerWidth : 1280)
const isMobile = computed(() => winW.value < 960)
function onResize() { winW.value = window.innerWidth }
onMounted(() => window.addEventListener("resize", onResize))
onBeforeUnmount(() => window.removeEventListener("resize", onResize))

const menus = ref([
  {
    title: "Dashboard",
    icon: "mdi-view-dashboard-outline",
    url: "/aggregator/dashboard",
  },
  {
    title: "Merchants",
    icon: "mdi-storefront-outline",
    url: "/aggregator/merchants",
  },
  {
    title: "Vendors",
    icon: "mdi-factory",
    url: "/aggregator/vendor",
    // open: false,
    // children: [
    //   { title: "Onboarded Vendors", icon: "mdi-account-check-outline", url: "/aggregator/vendor/onboarded" },
    //   { title: "Pending Vendors",   icon: "mdi-account-clock-outline", url: "/aggregator/vendor/pending"   },
    // ],
  },
  {
    title: "Transactions",
    icon: "mdi-swap-horizontal",
    url: "/aggregator/transactions",
    children: [],
  },
  {
    title: "Set Ups",
    icon: "mdi-tools",
    url: "/aggregator/setups",
    children: [
      { title: "Services and Interfaces", icon: "mdi-connection", url: "/aggregator/setups/services" },
      // { title: "Pending Vendors",   icon: "mdi-account-clock-outline", url: "/aggregator/vendor/pending"   },
    ],
  },
  {
    title: "Settings",
    icon: "mdi-cog-outline",
    url: "/aggregator/settings",
  },
]);

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

  if(!auth.aggregator) {
    try {
      await getAggregator();
    } catch (error) {
      console.log("Error:", error);
    }
  }  
  
  Title.value = auth.aggregator?.name || "Bucksbox";

  try {
    const res = await getServices()
    const services = res?.services ?? []

    if(!services.length) {
      menus.value = menus.value.filter(m => m.title !== "Transactions") 
    }

    const txMenu = menus.value.find(m => m.title === "Transactions")
    if (services.length &&txMenu) {
      txMenu.children = services.map((data) => ({
        title: `${data.service} Transactions`,
        icon:  serviceIconMap[data.service] ?? "mdi-clipboard-list-outline",
        url:   `/aggregator/transactions/${data.service.toLowerCase()}`,
      }))
    }
  } catch (e) {
    console.error("Failed to fetch vendor linked services:", e)
  }
})

onBeforeUnmount(() => window.removeEventListener("resize", onResize))
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