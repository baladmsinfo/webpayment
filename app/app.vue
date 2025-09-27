<template>
  <v-app>
    <v-main>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </v-main>
  </v-app>
</template>

<script setup>
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);
</script>