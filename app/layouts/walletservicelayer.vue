<template>
  <div>
    <WalletServiceNavbar :title="Title" :menus="menus">
      <template #content>
        <div class="layout-body">

          <IdleWarning
            :show="showWarning"
            :countdown="countdown"
            @keep-alive="keepAlive"
            @logout="doLogout"
          />

          <div v-if="!docVerified" class="action-banner">
            <div class="banner-left">
              <div class="banner-icon-wrap">
                <v-icon size="22" color="#ba1a1a">mdi-alert-outline</v-icon>
              </div>
              <p class="banner-text">
                <strong>Action Required:</strong>
                Please submit your identification documents to verify your account.
              </p>
            </div>
            <div class="banner-actions">
              <button class="banner-btn" @click="goToDocuments">
                Submit Documents
              </button>
              <button class="banner-close" @click="showBanner = false" aria-label="Dismiss">
                <v-icon size="16" color="#93000a">mdi-close</v-icon>
              </button>
            </div>
          </div>

          <slot />
        </div>
      </template>
    </WalletServiceNavbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUsersApi } from "@/composables/apis/useUsersApi";
import { useIdleTimer } from "~/composables/useIdleTimer";

const {getWalletMe} = useUsersApi();
const auth = useAuthStore();
const { showWarning, countdown, keepAlive, doLogout } = useIdleTimer();

const Title = ref();

const router = useRouter();

const showBanner = ref(true);
const docVerified = ref(true);

function goToDocuments() {
  router.push("/wallet-service/verification");
}

const menus = ref([
  // {
  //   title: "Dashboard",
  //   icon: "mdi-view-dashboard-outline",
  //   url: "/wallet-service/dashboard",
  // },
  {
    title: "Home",
    icon: "mdi-wallet-outline",
    url: "/wallet-service/wallet",
  },
  {
    title: "Transactions",
    icon: "mdi-swap-horizontal",
    url: "/wallet-service/txn",
  },
  {
    title: "Customers",
    icon: "mdi-account-group-outline",
    url: "/wallet-service/customer",
  },
  {
    title: "Cards",
    icon: "mdi-credit-card-outline",
    url: "/wallet-service/card-enquiries",
  },
  {
    title: "Settings",
    icon: "mdi-cog-outline",
    url: "/wallet-service/settings",
  },
]);

onMounted(async () => {
  await getWalletMe();

  docVerified.value = auth.walletProfile.data?.kyc;
  Title.value = auth.walletProfile.data?.data?.dba_name || "Bucksbox";
});
</script>

<style scoped>
/* ── LAYOUT BODY ────────────────────────────────────────────────── */
.layout-body {
  padding: 10px 8px;
  min-height: calc(100dvh - 56px);
  background: #f6f6f8;
}

@media (min-width: 640px) {
  .layout-body {
    padding: 0;
  }
}

@media (min-width: 1024px) {
  .layout-body {
    padding: 10px 0;
  }
}

/* ── ACTION REQUIRED BANNER ─────────────────────────────────────── */
.action-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  /* matches the reference: error-container/30 bg + left border-l-4 */
  background: rgba(255, 218, 214, 0.45);
  border-left: 4px solid #ba1a1a;
  border-radius: 0 10px 10px 0;

  padding: 0.875rem 1rem 0.875rem 1.125rem;
  margin: 10px 8px 0;   
}

@media (min-width: 640px) {
  .action-banner {
    margin: 1.25rem 1.5rem 0;
    padding: 1rem 1.25rem 1rem 1.375rem;
    border-radius: 0 12px 12px 0;
  }
}

@media (min-width: 1024px) {
  .action-banner {
    margin: 1.5rem 2rem 0;
  }
}

/* ── BANNER LEFT ────────────────────────────────────────────────── */
.banner-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.banner-icon-wrap {
  width: 2.125rem;
  height: 2.125rem;
  background: rgba(186, 26, 26, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-text {
  font-family: 'Manrope', 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.45;
  color: #93000a;
  margin: 0;
}

.banner-text strong {
  font-weight: 700;
}

/* ── BANNER ACTIONS ─────────────────────────────────────────────── */
.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.125rem;
  background: #00579e;
  color: #fff;
  border: none;
  border-radius: 9999px;           /* rounded-full like reference */
  font-family: 'Manrope', 'Inter', sans-serif;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 87, 158, 0.25);
  transition: background 0.18s, box-shadow 0.18s, transform 0.1s;
}

.banner-btn:hover {
  background: #1d70c1;
  box-shadow: 0 4px 14px rgba(0, 87, 158, 0.35);
}

.banner-btn:active {
  transform: scale(0.97);
}

.banner-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.15s;
  padding: 0;
}

.banner-close:hover {
  background: rgba(186, 26, 26, 0.1);
}
</style>