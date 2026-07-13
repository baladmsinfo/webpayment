<template>
  <v-app>
    <v-slide-y-transition>
      <div v-if="!isOnline" class="offline-banner">
        <v-icon size="16" class="mr-2">mdi-wifi-off</v-icon>
        You're offline — some actions won't work until your connection is back.
      </div>
    </v-slide-y-transition>

    <v-main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-main>

    <v-snackbar v-model="show" :color="color" location="top" timeout="3000" multi-line>
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { useSnackbar } from '~/composables/useSnackbar';
import { useNetworkStatus } from '~/composables/useNetworkStatus';

defineCustomElements(window);

const { message, color, show } = useSnackbar();
const { isOnline } = useNetworkStatus();
</script>

<style scoped>
.offline-banner {
  position: fixed; top: 0; left: 0; right: 0; z-index: 3000;
  background: #d97706; color: #fff; text-align: center;
  font-size: 12.5px; font-weight: 700; padding: 8px 12px;
  display: flex; align-items: center; justify-content: center;
}
</style>