// plugins/axios.js
import axios from "axios";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();

  console.log(runtimeConfig.public.API_ENDPOINT)

  const axiosInstance = axios.create({
    baseURL: runtimeConfig.public.API_ENDPOINT || "https://feebdev.bucksbox.in",
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore()?.logout?.();
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
