// Reusable source of truth for whether the vendor (distributor) has completed KYC.
// Mirrors useKycStatus.ts's caching-in-the-auth-store pattern so vendorlayer.vue
// and the vendor onboarding page share a single status call.
//
// Derives the banner state from GET /vendor/me's `mstatus` field:
//   PENDING              -> documents not yet submitted (show "submit docs" card)
//   SUBMITTED / ONBOARDED -> documents submitted, awaiting verification (show "pending review" card)
//   anything else         -> compliant, no banner
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useVendorApi } from "~/composables/apis/useVendorApi";

const PENDING_STATUSES   = ["PENDING"];
const SUBMITTED_STATUSES = ["SUBMITTED", "ONBOARDED"];

let loadingPromise: Promise<boolean> | null = null;

export function useVendorKycStatus() {
  const auth = useAuthStore();
  const { getVendor } = useVendorApi();

  const loadKycStatus = async (force = false) => {
    if (auth.vendorKycStatusLoaded && !force) return auth.vendorKycCompliant;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      let compliant = false;
      try {
        const res     = await getVendor();
        const mstatus = res?.data?.data?.mstatus ?? null;
        auth.setVendorKycMstatus(mstatus);
        compliant = !PENDING_STATUSES.includes(mstatus) && !SUBMITTED_STATUSES.includes(mstatus);
      } catch (e) {
        console.error("Failed to fetch vendor KYC compliance status:", e);
      } finally {
        auth.setVendorKycCompliant(compliant);
        loadingPromise = null;
      }
      return compliant;
    })();

    return loadingPromise;
  };

  const refreshKycStatus = () => loadKycStatus(true);

  const isKycComplete  = computed(() => auth.vendorKycCompliant === true);
  const isKycPending   = computed(() => PENDING_STATUSES.includes(auth.vendorKycMstatus ?? ""));
  const isKycSubmitted = computed(() => SUBMITTED_STATUSES.includes(auth.vendorKycMstatus ?? ""));
  const kycStatusLoaded = computed(() => auth.vendorKycStatusLoaded);

  return {
    isKycComplete,
    isKycPending,
    isKycSubmitted,
    kycStatusLoaded,
    loadKycStatus,
    refreshKycStatus,
  };
}
