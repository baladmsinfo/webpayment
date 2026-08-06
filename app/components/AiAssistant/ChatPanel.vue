<template>
  <v-row no-gutters class="chat-root">
    <!-- ── Conversation list ── -->
    <v-col cols="12" md="3" class="conv-col">
      <div class="conv-header">
        <span class="text-subtitle-2 font-weight-bold">Conversations</span>
        <v-btn size="small" variant="tonal" color="primary" @click="startNewConversation">
          <v-icon size="16" class="mr-1">mdi-plus</v-icon>
          New
        </v-btn>
      </div>

      <v-list density="compact" nav class="conv-list">
        <v-list-item
          v-for="c in conversations"
          :key="c.id"
          :active="c.id === activeConversationId"
          @click="openConversation(c.id)"
        >
          <v-list-item-title class="text-truncate">
            {{ c.title || 'New conversation' }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ formatWhen(c.updatedAt) }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item v-if="!conversations.length && !loadingConversations">
          <v-list-item-subtitle class="text-caption">No conversations yet</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>

    <!-- ── Chat ── -->
    <v-col cols="12" md="9" class="chat-col">
      <v-alert v-if="health && !health.ollama" type="warning" variant="tonal" density="compact" class="mb-2">
        AI Assistant is currently unavailable ({{ health.enabled ? 'Ollama unreachable' : 'disabled by admin' }}). You can still browse past conversations.
      </v-alert>

      <div ref="messageListEl" class="message-list">
        <div v-if="!messages.length && !sending" class="empty-state">
          <v-icon size="40" color="primary">mdi-robot-outline</v-icon>
          <p class="text-body-2 text-medium-emphasis mt-2 mb-4">
            Ask about transactions, AEPS/DMT/UPI performance, commission, settlement, or reconciliation.
          </p>
          <div class="suggestion-wrap">
            <v-chip
              v-for="(q, i) in suggestions"
              :key="i"
              class="mb-2 mr-2"
              variant="outlined"
              color="primary"
              @click="ask(q)"
            >
              {{ q }}
            </v-chip>
          </div>
        </div>

        <div
          v-for="(m, i) in messages"
          :key="i"
          class="msg-row"
          :class="m.role === 'user' ? 'msg-row-user' : 'msg-row-assistant'"
        >
          <div class="msg-bubble" :class="m.role === 'user' ? 'bubble-user' : 'bubble-assistant'">
            <div class="msg-text">{{ m.content }}</div>
            <div v-if="m.toolCalls && m.toolCalls.length" class="tool-chips">
              <v-chip
                v-for="(t, ti) in m.toolCalls"
                :key="ti"
                size="x-small"
                variant="tonal"
                :color="t.success === false ? 'error' : 'primary'"
                class="mr-1 mt-1"
              >
                <v-icon size="12" class="mr-1">mdi-function-variant</v-icon>
                {{ t.name }}
              </v-chip>
            </div>
          </div>
        </div>

        <div v-if="sending" class="msg-row msg-row-assistant">
          <div class="msg-bubble bubble-assistant typing">
            <v-progress-circular indeterminate size="16" width="2" class="mr-2" />
            Thinking…
          </div>
        </div>
      </div>

      <div class="composer">
        <v-textarea
          v-model="draft"
          placeholder="Ask a question…"
          density="compact"
          variant="outlined"
          rows="1"
          auto-grow
          max-rows="4"
          hide-details
          :disabled="sending"
          @keydown.enter.exact.prevent="submit"
        />
        <v-btn
          icon
          color="primary"
          class="ml-2"
          :loading="sending"
          :disabled="!draft.trim() || sending"
          @click="submit"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useAiApi, type AiHealth } from "~/composables/apis/useAiApi";
import { useSnackbar } from "~/composables/useSnackbar";

interface DisplayMessage {
  role: "user" | "assistant";
  content: string;
  toolCalls?: Array<{ name: string; success?: boolean }>;
}

const { getHealth, getSuggestions, sendMessage, listConversations, getConversation } = useAiApi();
const { notify } = useSnackbar();

const health = ref<AiHealth | null>(null);
const suggestions = ref<string[]>([]);
const conversations = ref<any[]>([]);
const loadingConversations = ref(false);
const activeConversationId = ref<string | null>(null);
const messages = ref<DisplayMessage[]>([]);
const draft = ref("");
const sending = ref(false);
const messageListEl = ref<HTMLElement | null>(null);

function formatWhen(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString();
}

async function scrollToBottom() {
  await nextTick();
  if (messageListEl.value) messageListEl.value.scrollTop = messageListEl.value.scrollHeight;
}

async function loadConversations() {
  loadingConversations.value = true;
  try {
    const { conversations: rows } = await listConversations({ limit: 30 });
    conversations.value = rows;
  } catch (e) {
    console.error("Failed to load conversations", e);
  } finally {
    loadingConversations.value = false;
  }
}

function startNewConversation() {
  activeConversationId.value = null;
  messages.value = [];
  draft.value = "";
}

async function openConversation(id: string) {
  activeConversationId.value = id;
  try {
    const data = await getConversation(id);
    messages.value = (data?.messages ?? [])
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({ role: m.role, content: m.content || "" }));
    await scrollToBottom();
  } catch (e) {
    notify("Could not load that conversation", "error");
  }
}

async function ask(question: string) {
  draft.value = question;
  await submit();
}

async function submit() {
  const text = draft.value.trim();
  if (!text || sending.value) return;

  messages.value.push({ role: "user", content: text });
  draft.value = "";
  sending.value = true;
  await scrollToBottom();

  try {
    const res = await sendMessage({ conversationId: activeConversationId.value, message: text });
    activeConversationId.value = res.conversationId;
    messages.value.push({ role: "assistant", content: res.message, toolCalls: res.toolCalls });

    const isNew = !conversations.value.some((c) => c.id === res.conversationId);
    if (isNew) await loadConversations();
  } catch (e: any) {
    const code = e?.response?.data?.statusCode;
    const friendly =
      code === "AI_SERVICE_UNAVAILABLE"
        ? "The AI Assistant is currently unavailable. Please try again shortly."
        : e?.response?.data?.message || "Something went wrong. Please try again.";
    messages.value.push({ role: "assistant", content: friendly });
    notify(friendly, "error");
  } finally {
    sending.value = false;
    await scrollToBottom();
  }
}

onMounted(async () => {
  try {
    health.value = await getHealth();
  } catch {
    health.value = { enabled: false, ollama: false, model: "" };
  }
  try {
    suggestions.value = await getSuggestions();
  } catch {
    suggestions.value = [];
  }
  await loadConversations();
});
</script>

<style scoped>
.chat-root {
  height: 100%;
  min-height: 560px;
}

.conv-col {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.conv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}

.conv-list {
  overflow-y: auto;
  flex: 1;
}

.chat-col {
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 4px;
  min-height: 380px;
}

.empty-state {
  text-align: center;
  padding: 40px 16px;
}

.suggestion-wrap {
  max-width: 560px;
  margin: 0 auto;
}

.msg-row {
  display: flex;
  margin-bottom: 10px;
}

.msg-row-user { justify-content: flex-end; }
.msg-row-assistant { justify-content: flex-start; }

.msg-bubble {
  max-width: 72%;
  padding: 10px 14px;
  border-radius: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble-user {
  background: #1142d4;
  color: #fff;
  border-bottom-right-radius: 2px;
}

.bubble-assistant {
  background: #f0f1f5;
  color: #1a1a1a;
  border-bottom-left-radius: 2px;
}

.msg-text { font-size: 0.9rem; }

.tool-chips { margin-top: 6px; }

.typing {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.composer {
  display: flex;
  align-items: flex-end;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
