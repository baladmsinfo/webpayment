import { useApi } from "./useApi";

export function useWebhookApi() {
  const { get, post, put, del } = useApi();

  // ── Event catalog ──────────────────────────────────────────────────────────
  const getEvents = () => get("/webhook/events");

  // ── Endpoint CRUD ──────────────────────────────────────────────────────────
  const getEndpoints = (params?: { page?: number; limit?: number; status?: string }) =>
    get("/webhook/endpoints", { params });

  const getEndpoint = (id: string) => get(`/webhook/endpoints/${id}`);

  const createEndpoint = (data: {
    url: string;
    events?: string[];
    description?: string;
    headers?: Record<string, string>;
    timeout?: number;
    maxRetries?: number;
  }) => post("/webhook/endpoints", data);

  const updateEndpoint = (
    id: string,
    data: {
      url?: string;
      events?: string[];
      description?: string;
      status?: string;
      timeout?: number;
      maxRetries?: number;
    }
  ) => put(`/webhook/endpoints/${id}`, data);

  const deleteEndpoint = (id: string) => del(`/webhook/endpoints/${id}`);

  // ── Secret rotation ────────────────────────────────────────────────────────
  const rotateSecret = (id: string) => post(`/webhook/endpoints/${id}/rotate-secret`, {});

  // ── Test ping ──────────────────────────────────────────────────────────────
  const testEndpoint = (id: string) => post(`/webhook/endpoints/${id}/test`, {});

  // ── Delivery history ───────────────────────────────────────────────────────
  const getDeliveries = (
    endpointId: string,
    params?: { page?: number; limit?: number; status?: string; event?: string }
  ) => get(`/webhook/endpoints/${endpointId}/deliveries`, { params });

  // ── Manual retry ───────────────────────────────────────────────────────────
  const retryDelivery = (deliveryId: string) =>
    post(`/webhook/deliveries/${deliveryId}/retry`, {});

  return {
    getEvents,
    getEndpoints,
    getEndpoint,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    rotateSecret,
    testEndpoint,
    getDeliveries,
    retryDelivery,
  };
}
