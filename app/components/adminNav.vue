<template>
  <div>
    <v-app-bar :color="color">
      <!-- Drawer toggle -->
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
        v-if="!goback"
      />

      <!-- Back button -->
      <template #prepend>
        <v-icon class="ml-4" @click="$router.go(-1)" v-if="goback">
          mdi-arrow-left
        </v-icon>
      </template>

      <!-- Title -->
      <v-app-bar-title class="text-subtitle-1 font-weight-bold mt-1">
        {{ title }}
      </v-app-bar-title>

      <!-- Custom buttons/slot -->
      <template #append>
        <slot></slot>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" tile scrim>
      <v-list>
        <v-list-item v-for="item in menus" :key="item.url" :to="item.url">
          <template #prepend>
            <v-icon :color="color" size="x-small" :icon="item.icon" />
          </template>
          <v-list-item-title
            class="text-overline font-weight-black pt-1"
            v-text="item.title"
          />
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn :loading="loading" @click="logout" color="primary" block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useDisplay } from "vuetify"

const display = useDisplay()

// Props
const props = defineProps({
  title: { type: String, default: "BUCKSBOX" },
  color: { type: String, default: "primary" },
  buttons: { type: Array, default: () => [] },
  menus: { type: Array, default: () => [] }, // ✅ renamed to menus
  goback: { type: Boolean, default: false },
})

// State
const drawer = ref(true)
const loading = ref(false)

onMounted(() => {
  drawer.value = display.mdAndUp.value
})

// Methods
function logout() {
  const authToken = useCookie("authToken")
  authToken.value = null
  navigateTo("/login")
}
</script>
