// src/composables/useApi.ts
import axios from "axios";
import { useAuthStore } from "~/stores/auth";
import { useCookie } from "#app";

export function useApi() {
  const auth = useAuthStore();

  const instance = axios.create({
    baseURL: useRuntimeConfig().public.API_ENDPOINT, // http://localhost:3010
  });

  // Add Authorization header
  instance.interceptors.request.use((config) => {
    let token = auth.token || localStorage.getItem("token");
    if (!token) {
      const cookie = useCookie("authToken");
      token = cookie.value || null;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  });

  const get = (url: string, config = {}) => instance.get(url, config);
  const post = (url: string, data: any, config = {}) =>
    instance.post(url, data, config);

  return { get, post };
}
