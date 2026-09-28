// Reusable source of truth for merchant services (AEPS / DMT / UPI / ...).
// Backed by the auth store so mlayer.vue, dashboard.vue and the service-KYC
// middleware share a single fetchMerchant() call.
//
// verifiedServices / hasAEPS / hasDMT keep their original meaning (VERIFIED
// only). allServices + serviceKycState() expose the per-service KYC status so
// menus can show a service while its KYC is still pending / under review.
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useUsersApi } from "~/composables/apis/useUsersApi";

// Service KYC status (backend KycStatus) → what the merchant UI should do.
export type ServiceKycState = "VERIFIED" | "PENDING" | "IN_REVIEW" | "REJECTED" | "SUSPENDED" | "NONE";

const IN_REVIEW_STATUSES = ["SUBMITTED", "PROCESSING", "UNDER_REVIEW", "ONBOARDED"];

let loadingPromise: Promise<Array<Record<string, any>>> | null = null;

export function useMerchantServices() {
  const auth = useAuthStore();
  const { fetchMerchant } = useUsersApi();

  const loadMerchantServices = async (force = false) => {
    if (auth.merchantServicesLoaded && !force) return auth.merchantServices;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      let all: Array<Record<string, any>> = [];
      let verified: Array<Record<string, any>> = [];
      try {
        const res = await fetchMerchant();
        all = res?.data?.services ?? [];
        verified = all.filter((s: any) => s.status === "VERIFIED");
      } catch (e) {
        console.error("Failed to fetch merchant services:", e);
      } finally {
        auth.setMerchantServices(verified, all);
        loadingPromise = null;
      }
      return verified;
    })();

    return loadingPromise;
  };

  const verifiedServices = computed(() => auth.merchantServices);
  const allServices = computed(() => auth.merchantServicesAll ?? []);
  const servicesLoaded = computed(() => auth.merchantServicesLoaded);
  const serviceNames = computed(() => verifiedServices.value.map((s: any) => String(s.service).toUpperCase()));

  const hasAEPS = computed(() => serviceNames.value.includes("AEPS"));
  const hasDMT = computed(() => serviceNames.value.includes("DMT"));
  const hasUPI = computed(() => serviceNames.value.includes("UPI"));
  const hasWallet = computed(() => hasAEPS.value || hasDMT.value);

  // A service can have several interface rows (e.g. AEPS/NSDL); the most
  // advanced one wins: VERIFIED > in review > rejected > suspended > pending.
  const serviceKycState = (service: string): ServiceKycState => {
    const rows = allServices.value.filter((s: any) => String(s.service).toUpperCase() === service.toUpperCase());
    if (!rows.length) return "NONE";
    const statuses = rows.map((r: any) => String(r.status || "PENDING").toUpperCase());
    if (statuses.includes("VERIFIED")) return "VERIFIED";
    if (statuses.some((s) => IN_REVIEW_STATUSES.includes(s))) return "IN_REVIEW";
    if (statuses.includes("REJECTED")) return "REJECTED";
    if (statuses.includes("SUSPENDED")) return "SUSPENDED";
    return "PENDING";
  };

  // Service is linked to the merchant at all (any KYC status) → show its menu.
  const hasServiceAny = (service: string) => serviceKycState(service) !== "NONE";

  return {
    verifiedServices,
    allServices,
    servicesLoaded,
    loadMerchantServices,
    serviceNames,
    hasAEPS,
    hasDMT,
    hasUPI,
    hasWallet,
    serviceKycState,
    hasServiceAny,
  };
}
