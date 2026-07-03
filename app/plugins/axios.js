// plugins/axios.js
import axios from "axios";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: runtimeConfig.public.API_ENDPOINT || "http://localhost:3010",
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
        const auth = useAuthStore();
        const data = error.response?.data;

        if (data?.statusCode === "SESSION_DISPLACED") {
          auth.markDisplaced(data.message);
        } else {
          auth.logout();
        }

        router.push("/");
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
