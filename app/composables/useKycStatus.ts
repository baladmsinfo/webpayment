// Reusable source of truth for whether the merchant has completed ISG/UPI KYC.
// Mirrors useMerchantServices.ts's caching-in-the-auth-store pattern so mlayer.vue
// and the onboarding page share a single compliance/status call.
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useOnboadingApi } from "~/composables/apis/useOnboadingApi";

let loadingPromise: Promise<boolean> | null = null;

export function useKycStatus() {
  const auth = useAuthStore();
  const { complianceStatus } = useOnboadingApi();

  const loadKycStatus = async (force = false) => {
    if (auth.kycStatusLoaded && !force) return auth.kycCompliant;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      let compliant = false;
      try {
        const res = await complianceStatus(auth.merchant?.mid);
        compliant = res?.summary?.compliant === true || res?.compliantStaus === "VERIFIED";
      } catch (e) {
        console.error("Failed to fetch KYC compliance status:", e);
      } finally {
        auth.setKycCompliant(compliant);
        loadingPromise = null;
      }
      return compliant;
    })();

    return loadingPromise;
  };

  const refreshKycStatus = () => loadKycStatus(true);

  const isKycComplete = computed(() => auth.kycCompliant === true);
  const kycStatusLoaded = computed(() => auth.kycStatusLoaded);

  return {
    isKycComplete,
    kycStatusLoaded,
    loadKycStatus,
    refreshKycStatus,
  };
}
