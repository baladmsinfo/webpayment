<template>
  <v-container fluid>
    <h1 class="text-h5 font-weight-bold mb-4">AI Assistant</h1>

    <v-card variant="outlined">
      <v-tabs v-model="tab" color="primary">
        <v-tab value="chat">
          <v-icon start>mdi-chat-outline</v-icon>
          Chat
        </v-tab>
        <v-tab value="reports">
          <v-icon start>mdi-file-chart-outline</v-icon>
          Reports
        </v-tab>
      </v-tabs>

      <v-divider />

      <v-window v-model="tab">
        <v-window-item value="chat">
          <div class="pa-3">
            <AiAssistantChatPanel />
          </div>
        </v-window-item>

        <v-window-item value="reports">
          <div class="pa-4">
            <AiAssistantReportPanel />
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tab = ref("chat");
</script>
