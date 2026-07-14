// Reusable source of truth for VERIFIED merchant services (AEPS / DMT / UPI / ...).
// Backed by the auth store so mlayer.vue and dashboard.vue share a single
// fetchMerchant() call instead of duplicating the request/filter logic.
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useUsersApi } from "~/composables/apis/useUsersApi";

let loadingPromise: Promise<Array<Record<string, any>>> | null = null;

export function useMerchantServices() {
  const auth = useAuthStore();
  const { fetchMerchant } = useUsersApi();

  const loadMerchantServices = async (force = false) => {
    if (auth.merchantServicesLoaded && !force) return auth.merchantServices;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      let verified: Array<Record<string, any>> = [];
      try {
        const res = await fetchMerchant();
        verified = (res?.data?.services ?? []).filter((s: any) => s.status === "VERIFIED");
      } catch (e) {
        console.error("Failed to fetch merchant services:", e);
      } finally {
        auth.setMerchantServices(verified);
        loadingPromise = null;
      }
      return verified;
    })();

    return loadingPromise;
  };

  const verifiedServices = computed(() => auth.merchantServices);
  const servicesLoaded = computed(() => auth.merchantServicesLoaded);
  const serviceNames = computed(() => verifiedServices.value.map((s: any) => String(s.service).toUpperCase()));

  const hasAEPS = computed(() => serviceNames.value.includes("AEPS"));
  const hasDMT = computed(() => serviceNames.value.includes("DMT"));
  const hasUPI = computed(() => serviceNames.value.includes("UPI"));
  const hasWallet = computed(() => hasAEPS.value || hasDMT.value);

  return {
    verifiedServices,
    servicesLoaded,
    loadMerchantServices,
    serviceNames,
    hasAEPS,
    hasDMT,
    hasUPI,
    hasWallet,
  };
}
