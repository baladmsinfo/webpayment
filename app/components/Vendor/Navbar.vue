<template>
  <div>
    <!-- ── App Bar ── -->
    <header class="nav-appbar">
      <button
        class="nav-icon-btn"
        @click="goback ? $router.go(-1) : (drawerOpen = !drawerOpen)"
        :aria-label="goback ? 'Go back' : 'Toggle menu'"
      >
        <span class="mdi" :class="goback ? 'mdi-arrow-left' : 'mdi-menu'"></span>
      </button>

      <div class="nav-brand">
        <div class="nav-brand-icon">
          <span class="mdi mdi-shield-crown-outline"></span>
        </div>
        <span class="nav-brand-title">{{ title }}</span>
      </div>

      <div class="nav-appbar-right">
        <slot></slot>
      </div>
    </header>

    <!-- ── Mobile Overlay ── -->
    <transition name="t-fade">
      <div v-if="drawerOpen && isMobile" class="nav-overlay" @click="drawerOpen = false" />
    </transition>

    <!-- ── Navigation Drawer ── -->
    <nav class="nav-drawer" :class="{ 'nav-drawer-open': drawerOpen }">

      <div class="drawer-top">
        <div class="drawer-brand-wrap">
          <div class="drawer-brand-avatar">
            <span class="mdi mdi-shield-crown-outline"></span>
          </div>
          <div>
            <p class="drawer-brand-name">{{ title }}</p>
          </div>
        </div>
      </div>

      <div class="drawer-scroll">
        <p class="drawer-section-label">Main Menu</p>

        <template v-for="item in menus" :key="item.title">
          <template v-if="item.children">
            <button
              class="drawer-item"
              :class="{ 'drawer-item-group-open': item.open }"
              @click="toggleGroup(item)"
            >
              <div class="di-left">
                <div class="di-icon" :class="{ 'di-icon-active': item.open }">
                  <span class="mdi" :class="item.icon"></span>
                </div>
                <span class="di-label" :class="{ 'di-label-active': item.open }">{{ item.title }}</span>
              </div>
              <span class="mdi di-chevron" :class="item.open ? 'mdi-chevron-down' : 'mdi-chevron-right'"></span>
            </button>

            <transition name="t-expand">
              <div v-if="item.open" class="drawer-children">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.url"
                  :to="child.url"
                  class="drawer-child"
                  :class="{ 'drawer-child-active': isActive(child.url) }"
                  @click="handleMobileClose"
                >
                  <span class="child-pip" :class="{ 'child-pip-active': isActive(child.url) }"></span>
                  <span class="child-label">{{ child.title }}</span>
                </NuxtLink>
              </div>
            </transition>
          </template>

          <NuxtLink
            v-else
            :to="item.url"
            class="drawer-item"
            :class="{ 'drawer-item-active': isActive(item.url) }"
            @click="handleMobileClose"
          >
            <div class="di-left">
              <div class="di-icon" :class="{ 'di-icon-active': isActive(item.url) }">
                <span class="mdi" :class="item.icon"></span>
              </div>
              <span class="di-label" :class="{ 'di-label-active': isActive(item.url) }">{{ item.title }}</span>
            </div>
            <span v-if="isActive(item.url)" class="di-active-pill"></span>
          </NuxtLink>
        </template>
      </div>

      <div class="drawer-footer">
        <div class="drawer-user">
          <div class="user-avatar">
            <span class="mdi mdi-account-outline"></span>
          </div>
          <div class="user-info">
            <p class="user-name">Vendor</p>
            <p class="user-role">Admin Access</p>
          </div>
        </div>
        <button class="drawer-logout-btn" :disabled="loading" @click="logout">
          <span v-if="!loading" class="mdi mdi-logout-variant"></span>
          <span v-else class="ls-spinner"></span>
          <span>{{ loading ? 'Signing out…' : 'Sign Out' }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from "vue"

const props = defineProps({
  title:  { type: String,  default: "BUCKSBOX" },
  color:  { type: String,  default: "primary" },
  menus:  { type: Array,   default: () => [] },
  goback: { type: Boolean, default: false },
})

/* ── Shared drawer state from layout via provide/inject ── */
const drawerOpen = inject("drawerOpen")

/* ── Responsive ── */
const winW     = ref(typeof window !== "undefined" ? window.innerWidth : 1280)
const isMobile = computed(() => winW.value < 960)
function onResize() { winW.value = window.innerWidth }

onMounted(() => {
  drawerOpen.value = !isMobile.value   // open on desktop, closed on mobile
  window.addEventListener("resize", onResize)
})
onBeforeUnmount(() => window.removeEventListener("resize", onResize))

/* ── Accordion ── */
function toggleGroup(item) { item.open = !item.open }

/* ── Active route ── */
const route = useRoute()
function isActive(url) {
  if (!url) return false
  return route.path === url || route.path.startsWith(url + "/")
}

function handleMobileClose() {
  if (isMobile.value) drawerOpen.value = false
}

/* ── Logout ── */
const loading = ref(false)
async function logout() {
  loading.value = true
  try {
    const authToken = useCookie("authToken")
    authToken.value = null
    await navigateTo("/")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.nav-appbar {
  position: fixed; top: 0; left: 0; right: 0; height: 56px;
  background: #fff; border-bottom: 1px solid #e8edf3;
  display: flex; align-items: center; padding: 0 14px 0 8px;
  z-index: 400; box-shadow: 0 1px 10px rgba(15,23,42,.06);
  font-family: 'DM Sans', sans-serif; gap: 4px;
}

.drawer-user {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 10px; background: #f8fafc;
}
.user-avatar {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  background: rgba(17,66,212,.1); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.user-name { font-size: 12px; font-weight: 700; color: #1e293b; }
.user-role { font-size: 10px; color: #94a3b8; font-weight: 600; margin-top: 1px; }

.nav-icon-btn {
  width: 38px; height: 38px; border-radius: 9px;
  border: none; background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: #475569; flex-shrink: 0;
  transition: background .15s, color .15s;
}
.nav-icon-btn:hover { background: rgba(17,66,212,.07); color: #1142d4; }

.nav-brand { flex: 1; display: flex; align-items: center; gap: 9px; padding: 0 6px; }
.nav-brand-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: #1142d4; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(17,66,212,.28);
}
.nav-brand-title { font-size: 15px; font-weight: 700; color: #0f172a; letter-spacing: .04em; }
.nav-appbar-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.nav-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,.4); backdrop-filter: blur(3px); z-index: 350;
}
.t-fade-enter-active, .t-fade-leave-active { transition: opacity .22s; }
.t-fade-enter-from, .t-fade-leave-to { opacity: 0; }

.nav-drawer {
  position: fixed; top: 0; left: 0;
  width: 260px; height: 100dvh;
  background: #fff; border-right: 1px solid #e8edf3;
  display: flex; flex-direction: column;
  z-index: 370; box-shadow: 3px 0 24px rgba(15,23,42,.07);
  transform: translateX(-100%);
  transition: transform .27s cubic-bezier(.4,0,.2,1);
  font-family: 'DM Sans', sans-serif; overflow: hidden;
}
.nav-drawer-open { transform: translateX(0); }

.drawer-top { padding: 72px 14px 14px; border-bottom: 1px solid #f1f5f9; }
.drawer-brand-wrap {
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg,rgba(17,66,212,.06),rgba(17,66,212,.02));
  border: 1px solid rgba(17,66,212,.1); border-radius: 12px; padding: 10px 12px;
}
.drawer-brand-avatar {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #1142d4, #2255e8); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0; box-shadow: 0 4px 14px rgba(17,66,212,.3);
}
.drawer-brand-name { font-size: 13px; font-weight: 700; color: #0f172a; }

.drawer-scroll {
  flex: 1; overflow-y: auto; padding: 14px 10px 6px;
  scrollbar-width: thin; scrollbar-color: #e2e8f0 transparent;
}
.drawer-scroll::-webkit-scrollbar { width: 3px; }
.drawer-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }

.drawer-section-label {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: #94a3b8; padding: 0 8px 10px;
}

.drawer-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 10px; border-radius: 9px; margin-bottom: 2px;
  text-decoration: none; cursor: pointer; border: 1px solid transparent;
  background: transparent; width: 100%; text-align: left;
  transition: background .14s, border-color .14s; color: inherit;
}
.drawer-item:hover { background: #f8fafc; }
.drawer-item-active { background: rgba(17,66,212,.07) !important; border-color: rgba(17,66,212,.12) !important; }
.drawer-item-group-open { background: #f8fafc; }

.di-left { display: flex; align-items: center; gap: 10px; }
.di-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: #f1f5f9; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0; transition: background .14s, color .14s;
}
.di-icon-active { background: #1142d4 !important; color: #fff !important; }
.di-label { font-size: 13px; font-weight: 600; color: #334155; transition: color .14s; }
.di-label-active { color: #1142d4 !important; }
.di-chevron { font-size: 15px; color: #94a3b8; flex-shrink: 0; }
.di-active-pill { width: 6px; height: 6px; border-radius: 50%; background: #1142d4; flex-shrink: 0; }

.drawer-children { padding: 2px 0 4px 16px; display: flex; flex-direction: column; gap: 1px; }
.drawer-child {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 10px; border-radius: 8px; text-decoration: none; cursor: pointer;
  border: 1px solid transparent; transition: background .13s, border-color .13s;
}
.drawer-child:hover { background: #f8fafc; }
.drawer-child-active { background: rgba(17,66,212,.06) !important; border-color: rgba(17,66,212,.1) !important; }
.child-pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: #cbd5e1; flex-shrink: 0; margin-left: 4px;
  transition: background .13s, transform .13s;
}
.child-pip-active { background: #1142d4; transform: scale(1.3); }
.child-label { font-size: 12px; font-weight: 500; color: #475569; }
.drawer-child-active .child-label { color: #1142d4; font-weight: 600; }

.t-expand-enter-active, .t-expand-leave-active {
  transition: max-height .24s ease, opacity .2s; overflow: hidden; max-height: 400px;
}
.t-expand-enter-from, .t-expand-leave-to { max-height: 0; opacity: 0; }

.drawer-footer { padding: 10px 10px 14px; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 8px; }
.drawer-logout-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 9px 12px; border-radius: 9px;
  border: 1px solid #fecdd3; background: #fff1f2; color: #e11d48;
  font-size: 12px; font-weight: 700; font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background .14s, border-color .14s;
}
.drawer-logout-btn:hover:not(:disabled) { background: #ffe4e6; border-color: #fda4af; }
.drawer-logout-btn:disabled { opacity: .65; cursor: not-allowed; }
.drawer-logout-btn .mdi { font-size: 15px; }

@keyframes spin { to { transform: rotate(360deg); } }
.ls-spinner {
  width: 13px; height: 13px;
  border: 2px solid #fecdd3; border-top-color: #e11d48;
  border-radius: 50%; animation: spin .7s linear infinite;
}
</style>