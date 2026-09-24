// middleware/merchant-service-kyc.global.ts
//
// Merchant AEPS / DMT pages are only usable once that service's KYC is
// VERIFIED. Until then every /merchant/aeps/* and /merchant/dmt/* route is
// redirected to the service's KYC status page (/merchant/kyc/aeps|dmt), which
// shows "complete KYC", "awaiting approval", "rejected" or "suspended".
//
// Runs after auth.global.js (global middleware run in alphabetical order), so
// the user is already authenticated as a merchant for /merchant/* paths.
import { useMerchantServices } from "~/composables/useMerchantServices";

const GATED: Array<{ prefix: string; service: string }> = [
  { prefix: "/merchant/aeps", service: "AEPS" },
  { prefix: "/merchant/dmt", service: "DMT" },
];

export default defineNuxtRouteMiddleware(async (to) => {
  const gate = GATED.find((g) => to.path === g.prefix || to.path.startsWith(`${g.prefix}/`));
  if (!gate) return;

  const token = useCookie("authToken");
  if (!token.value) return;

  const { loadMerchantServices, serviceKycState } = useMerchantServices();
  await loadMerchantServices();

  // The cache may predate a KYC the merchant just completed — re-check once
  // against the API before blocking.
  if (serviceKycState(gate.service) !== "VERIFIED") {
    await loadMerchantServices(true);
  }

  if (serviceKycState(gate.service) !== "VERIFIED") {
    return navigateTo(`/merchant/kyc/${gate.service.toLowerCase()}`);
  }
});
