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

      <!-- Custom buttons slot -->
      <template #append>
        <slot></slot>
      </template>
    </v-app-bar>

    <!-- Drawer -->
    <v-navigation-drawer v-model="drawer" tile scrim>
      <v-list density="comfortable">
        <template v-for="item in menus" :key="item.title">
          <!-- Normal menu item -->
          <v-list-item
            v-if="!item.children"
            :to="item.url"
            link
          >
            <template #prepend>
              <v-icon :color="color" size="small">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="text-overline font-weight-black pt-1">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>

          <!-- Parent menu with submenus -->
          <v-list-group
            v-else
            no-action
            v-model="item.open"
          >
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-icon :color="color" size="small">{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title class="text-overline font-weight-black pt-1">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </template>

            <!-- Submenus -->
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.url"
              link
              class="pl-10"
            >
              <template #prepend>
                <v-icon size="x-small" color="grey-darken-1">
                  {{ child.icon || 'mdi-circle-small' }}
                </v-icon>
              </template>
              <v-list-item-title class="text-caption font-weight-medium">
                {{ child.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <!-- Logout -->
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

const props = defineProps({
  title: { type: String, default: "BUCKSBOX" },
  color: { type: String, default: "primary" },
  menus: { type: Array, default: () => [] },
  goback: { type: Boolean, default: false },
})

const display = useDisplay()
const drawer = ref(true)
const loading = ref(false)

onMounted(() => {
  drawer.value = display.mdAndUp.value
})

// Logout handler
function logout() {
  const authToken = useCookie("authToken")
  authToken.value = null
  navigateTo("/admin")
}
</script>