// composables/apis/useAiApi.ts
//
// Talks to the backend AI Assistant module (src/modules/ai on the API side).
// Tenant/role scoping happens entirely server-side from the JWT already
// attached by useApi()'s interceptor — this composable never sends a
// merchantId/vendorId/aggregatorId itself.
import { useApi } from "./useApi";

export interface AiChatResponse {
  success: boolean;
  conversationId: string;
  message: string;
  toolCalls: Array<{ name: string; arguments: Record<string, any> }>;
  metadata: { model?: string; durationMs?: number };
}

export interface AiHealth {
  enabled: boolean;
  ollama: boolean;
  model: string;
}

export interface AiReportResult {
  async: boolean;
  jobId?: string;
  statusUrl?: string;
  summary?: string;
  metrics?: Record<string, any>;
  highlights?: string[];
  risks?: string[];
  anomalies?: string[];
  recommendations?: string[];
}

export function useAiApi() {
  const { get, post } = useApi();

  const getHealth = async (): Promise<AiHealth> => {
    const res = await get("/ai/health");
    return res.data;
  };

  const getSuggestions = async (): Promise<string[]> => {
    const res = await get("/ai/suggestions");
    return res.data?.data?.suggestions ?? [];
  };

  const sendMessage = async (payload: { conversationId?: string | null; message: string }): Promise<AiChatResponse> => {
    const res = await post("/ai/chat", payload);
    return res.data;
  };

  const listConversations = async (params: { page?: number; limit?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const res = await get(`/ai/conversations?${q.toString()}`);
    return { conversations: res.data?.data ?? [], meta: res.data?.meta };
  };

  const getConversation = async (id: string) => {
    const res = await get(`/ai/conversations/${id}`);
    return res.data?.data;
  };

  const generateReport = async (payload: { type: string; from: string; to: string }): Promise<AiReportResult> => {
    const res = await post("/ai/reports", payload);
    return res.data?.data;
  };

  const getReportJob = async (jobId: string) => {
    const res = await get(`/ai/reports/${jobId}`);
    return res.data?.data;
  };

  return {
    getHealth,
    getSuggestions,
    sendMessage,
    listConversations,
    getConversation,
    generateReport,
    getReportJob,
  };
}
