<template>
  <div>
    <!-- ── Mobile Overlay ── -->
    <transition name="fade-overlay">
      <div
        v-if="drawer && isMobile"
        class="drawer-overlay"
        @click="drawer = false"
      ></div>
    </transition>

    <!-- ── Top App Bar ── -->
    <header class="app-bar">
      <div class="app-bar-left">
        <button v-if="!goback" class="icon-btn" @click="drawer = !drawer" aria-label="Toggle menu">
          <span class="mdi" :class="drawer && !isMobile ? 'mdi-menu-open' : 'mdi-menu'"></span>
        </button>
        <button v-else class="icon-btn" @click="$router.go(-1)" aria-label="Go back">
          <span class="mdi mdi-arrow-left"></span>
        </button>

        <div class="app-bar-brand">
          <!-- <div class="brand-dot">
            <span class="mdi mdi-shield-crown-outline"></span>
          </div> -->
          <span class="brand-label">Bucksbox</span>
        </div>
      </div>

      <div class="app-bar-right">
        <slot></slot>
      </div>
    </header>

    <!-- ── Sidebar Drawer ── -->
    <aside class="drawer" :class="{ 'drawer-open': drawer, 'drawer-mobile': isMobile }">

      <!-- <div class="drawer-brand">
        <div class="drawer-brand-icon">
          <span class="mdi mdi-shield-crown-outline"></span>
        </div>
        <div>
          <p class="drawer-brand-name">{{ title }}</p>
          <p class="drawer-brand-role">Merchant Portal</p>
        </div>
        <button v-if="isMobile" class="drawer-close-btn" @click="drawer = false">
          <span class="mdi mdi-close"></span>
        </button>
      </div> -->

      <!-- Nav Items -->
      <nav class="drawer-nav">
        <p class="drawer-section-label">Main Menu</p>
        
        <div v-for="item in menus" :key="item.title" class="nav-group">

          <NuxtLink
            v-if="!item.children?.length"
            :to="item.url"
            class="nav-item"
            :class="{ 'nav-item-active': isActive(item.url) }"
            @click="isMobile && (drawer = false)"
          >
            <span class="mdi nav-icon" :class="item.icon"></span>
            <span class="nav-label">{{ item.title }}</span>
            <span v-if="isActive(item.url)" class="nav-active-dot"></span>
          </NuxtLink>

          <button
            v-else
            class="nav-item"
            :class="{ 'nav-item-active': isParentActive(item) }"
            @click="item.open = !item.open"
          >
            <span class="mdi nav-icon" :class="item.icon"></span>
            <span class="nav-label">{{ item.title }}</span>
            <span
              class="mdi mdi-chevron-down nav-chevron"
              :class="{ 'nav-chevron-open': item.open }"
            ></span>
          </button>

          <!-- Children dropdown -->
          <transition name="expand">
            <div v-if="item.children?.length && item.open" class="nav-children">
              <NuxtLink
                v-for="child in item.children"
                :key="child.url"
                :to="child.url"
                class="nav-child-item"
                :class="{ 'nav-child-active': isActive(child.url) }"
                @click="isMobile && (drawer = false)"
              >
                <span class="mdi nav-child-icon" :class="child.icon"></span>
                <span class="nav-label">{{ child.title }}</span>
                <span v-if="isActive(child.url)" class="nav-active-dot"></span>
              </NuxtLink>
            </div>
          </transition>

        </div>
      </nav>

      <div class="drawer-spacer"></div>

      <div class="drawer-footer">
        <div class="drawer-user">
          <div class="user-avatar">
            <span class="mdi mdi-account-outline"></span>
          </div>
          <div class="user-info">
            <p class="user-name">{{ title }}</p>
            <p class="user-role">Merchant Access</p>
          </div>
        </div>
        <button class="logout-btn" @click="logout" :disabled="loading">
          <span v-if="loading" class="logout-spinner"></span>
          <span v-else class="mdi mdi-logout"></span>
          <span>{{ loading ? 'Logging out…' : 'Sign Out' }}</span>
        </button>
      </div>
    </aside>

    <!-- ── Page content wrapper ── -->
    <div class="page-content" :class="{ 'page-content-shifted': drawer && !isMobile }">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { useAuthStore } from "@/stores/auth";
import { useUsersApi } from "@/composables/apis/useUsersApi";

const auth = useAuthStore();
const { logout: apiLogout } = useUsersApi();

const props = defineProps({
  title:  { type: String,  default: "BUCKSBOX" },
  color:  { type: String,  default: "primary" },
  menus:  { type: Array,   default: () => [] },
  goback: { type: Boolean, default: false },
})

const route   = useRoute()
const drawer  = ref(true)
const loading = ref(false)
const windowW = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

const isMobile = computed(() => windowW.value < 960)

function onResize() {
  windowW.value = window.innerWidth
  if (windowW.value >= 960) drawer.value = true
  else drawer.value = false
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  onResize()

  /* Auto-expand a parent menu if the current route matches one of its children */
  props.menus.forEach(item => {
    if (item.children?.some(child => isActive(child.url))) {
      item.open = true
    }
  })
})
onBeforeUnmount(() => window.removeEventListener('resize', onResize))

function isActive(url) {
  if (!url) return false
  return route.path === url || route.path.startsWith(url + '/')
}

function isParentActive(item) {
  if (isActive(item.url)) return true
  return item.children?.some(child => isActive(child.url)) ?? false
}

async function logout() {
  loading.value = true;
  await apiLogout();
  navigateTo("/");
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── App Bar ── */
.app-bar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 56px; background: #fff;
  border-bottom: 1px solid #e8edf3;
  box-shadow: 0 1px 8px rgba(0,0,0,.06);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; gap: 12px;
  font-family: 'DM Sans', sans-serif;
}
.app-bar-left  { display: flex; align-items: center; gap: 10px; }
.app-bar-right { display: flex; align-items: center; gap: 8px; }

.icon-btn {
  width: 36px; height: 36px; border-radius: 9px;
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: #475569; transition: background .13s, color .13s;
}
.icon-btn:hover { background: #f1f5f9; color: #1142d4; }

.app-bar-brand { display: flex; align-items: center; gap: 8px; }
.brand-dot {
  width: 28px; height: 28px; border-radius: 8px;
  background: #1142d4; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(17,66,212,.3);
}
.brand-label { font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: .06em; }

/* ── Overlay ── */
.drawer-overlay {
  position: fixed; inset: 0; z-index: 299;
  background: rgba(15,23,42,.35);
  backdrop-filter: blur(2px);
}
.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity .22s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

/* ── Drawer ── */
.drawer {
  position: fixed; top: 56px; left: 0; bottom: 0; z-index: 300;
  width: 256px;
  background: #fff; border-right: 1px solid #e8edf3;
  box-shadow: 2px 0 16px rgba(0,0,0,.06);
  display: flex; flex-direction: column;
  font-family: 'DM Sans', sans-serif;
  transform: translateX(-100%);
  transition: transform .25s cubic-bezier(.4,0,.2,1);
  overflow-y: auto; overflow-x: hidden;
}
.drawer-open { transform: translateX(0); }
.drawer-mobile { z-index: 300; }

.drawer-section-label {
  font-size: 9px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: #94a3b8; padding: 0 8px 10px; margin-top: 12px;
}


@media (min-width: 960px) {
  .drawer { transform: translateX(0); box-shadow: none; }
  .drawer:not(.drawer-open) { transform: translateX(-100%); }
}

/* ── Drawer Brand ── */
.drawer-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 16px 14px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.drawer-brand-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #1142d4, #1654f8);
  color: #fff; font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(17,66,212,.25);
}
.drawer-brand-name { font-size: 13px; font-weight: 800; color: #0f172a; letter-spacing: .06em; }
.drawer-brand-role { font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; margin-top: 1px; }
.drawer-close-btn {
  margin-left: auto; width: 28px; height: 28px;
  border-radius: 7px; border: none; background: #f1f5f9;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: #64748b; cursor: pointer; flex-shrink: 0;
}

/* ── Nav ── */
.drawer-nav { display: flex; flex-direction: column; gap: 2px; padding: 10px 10px 4px; flex-shrink: 0; }
.nav-group { display: flex; flex-direction: column; }

.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 9px;
  font-size: 13px; font-weight: 600; color: #475569;
  text-decoration: none; cursor: pointer;
  transition: background .13s, color .13s;
  position: relative; border: none; background: transparent;
  width: 100%; text-align: left; font-family: 'DM Sans', sans-serif;
}
.nav-item:hover { background: #f8fafc; color: #1e293b; }
.nav-item-active {
  background: rgba(17,66,212,.07) !important;
  color: #1142d4 !important;
}

.nav-icon { font-size: 18px; flex-shrink: 0; }
.nav-label { flex: 1; }
.nav-active-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #1142d4; flex-shrink: 0;
}

/* ── Chevron ── */
.nav-chevron {
  font-size: 16px; flex-shrink: 0; color: #94a3b8;
  transition: transform .2s ease;
}
.nav-chevron-open { transform: rotate(180deg); }

/* ── Children dropdown ── */
.nav-children {
  display: flex; flex-direction: column; gap: 1px;
  padding: 2px 0 4px;
  overflow: hidden;
}
.nav-child-item {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 12px 8px 38px; border-radius: 8px;
  font-size: 12.5px; font-weight: 600; color: #64748b;
  text-decoration: none; cursor: pointer;
  transition: background .13s, color .13s;
  position: relative;
}
.nav-child-item:hover { background: #f8fafc; color: #1e293b; }
.nav-child-active {
  background: rgba(17,66,212,.07) !important;
  color: #1142d4 !important;
}
.nav-child-icon { font-size: 15px; flex-shrink: 0; }

.expand-enter-active, .expand-leave-active {
  transition: max-height .22s ease, opacity .22s ease;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0; opacity: 0;
}
.expand-enter-to, .expand-leave-from {
  max-height: 600px; opacity: 1;
}

/* ── Footer ── */
.drawer-spacer { flex: 1; }
.drawer-footer {
  padding: 12px 10px; border-top: 1px solid #f1f5f9;
  display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;
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

.logout-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 9px; border-radius: 9px;
  background: #fff1f2; border: 1px solid #fecdd3; color: #e11d48;
  font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: background .13s, border-color .13s;
}
.logout-btn:hover { background: #ffe4e6; border-color: #fda4af; }
.logout-btn:disabled { opacity: .5; cursor: not-allowed; }
.logout-btn .mdi { font-size: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.logout-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(225,29,72,.3); border-top-color: #e11d48;
  border-radius: 50%; animation: spin .7s linear infinite;
}

/* ── Page content offset ── */
.page-content {
  margin-top: 56px;
  transition: margin-left .25s cubic-bezier(.4,0,.2,1);
}
.page-content-shifted { margin-left: 256px; }
@media (max-width: 959px) {
  .page-content-shifted { margin-left: 0; }
}
</style>