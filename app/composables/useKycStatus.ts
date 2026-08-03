// Reusable source of truth for whether the merchant has completed ISG/UPI KYC.
// Mirrors useMerchantServices.ts's caching-in-the-auth-store pattern so mlayer.vue
// and the onboarding page share a single status call.
//
// Derives the banner state from GET /merchant/me's `mstatus` field:
//   PENDING              -> documents not yet submitted (show "submit docs" card)
//   SUBMITTED / ONBOARDED -> documents submitted, awaiting verification (show "pending review" card)
//   anything else         -> compliant, no banner
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useUsersApi } from "~/composables/apis/useUsersApi";

const PENDING_STATUSES   = ["PENDING"];
const SUBMITTED_STATUSES = ["SUBMITTED", "ONBOARDED"];

let loadingPromise: Promise<boolean> | null = null;

export function useKycStatus() {
  const auth = useAuthStore();
  const { getProfile } = useUsersApi();

  const loadKycStatus = async (force = false) => {
    if (auth.kycStatusLoaded && !force) return auth.kycCompliant;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      let compliant = false;
      try {
        const res     = await getProfile();
        const mstatus = res?.data?.data?.mstatus ?? null;
        auth.setKycMstatus(mstatus);
        compliant = !PENDING_STATUSES.includes(mstatus) && !SUBMITTED_STATUSES.includes(mstatus);
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

  const isKycComplete  = computed(() => auth.kycCompliant === true);
  const isKycPending   = computed(() => PENDING_STATUSES.includes(auth.kycMstatus ?? ""));
  const isKycSubmitted = computed(() => SUBMITTED_STATUSES.includes(auth.kycMstatus ?? ""));
  const kycStatusLoaded = computed(() => auth.kycStatusLoaded);

  return {
    isKycComplete,
    isKycPending,
    isKycSubmitted,
    kycStatusLoaded,
    loadKycStatus,
    refreshKycStatus,
  };
}
