// Shared setup for the merchant self-service KYC onboarding pages
// (/merchant/kyc/aeps/onboard, /merchant/kyc/dmt/onboard).
//
// Resolves the logged-in merchant's own id (GET /merchant/me → merchantId) and
// only allows onboarding while the service KYC is PENDING or REJECTED — an
// in-review or verified service is sent back to its KYC status page.
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/apis/useApi";
import { useMerchantServices } from "~/composables/useMerchantServices";

export function useSelfServiceOnboarding(service: "AEPS" | "DMT") {
  const router = useRouter();
  const { get } = useApi();
  const { loadMerchantServices, serviceKycState } = useMerchantServices();

  const merchantId = ref<string | null>(null);
  const ready = ref(false);
  const error = ref<string | null>(null);

  onMounted(async () => {
    try {
      await loadMerchantServices(true);
      const state = serviceKycState(service);
      if (state !== "PENDING" && state !== "REJECTED") {
        router.replace(`/merchant/kyc/${service.toLowerCase()}`);
        return;
      }

      let res: any = await get("/merchant/me");
      // /merchant/me is cached server-side; an older cached copy may predate
      // the merchantId field — bypass the cache once.
      if (!res?.data?.data?.merchantId) res = await get("/merchant/me?refresh=true");
      merchantId.value = res?.data?.data?.merchantId ?? null;
      if (!merchantId.value) error.value = "Unable to load your merchant account. Please refresh and try again.";
    } catch (e) {
      console.error(`${service} self-onboarding init failed:`, e);
      error.value = "Unable to load your merchant account. Please refresh and try again.";
    } finally {
      ready.value = true;
    }
  });

  return { merchantId, ready, error };
}
