<template>
  <div class="skyc">
    <div v-if="loading" class="skyc-loading">
      <v-progress-circular indeterminate size="28" width="3" color="#1142d4" />
    </div>

    <template v-else>
      <!-- ── Header card: state banner ─────────────────────────────── -->
      <div class="skyc-banner" :class="`skyc-${view.tone}`">
        <div class="skyc-accent" />
        <div class="skyc-icon"><v-icon size="26" :color="view.iconColor">{{ view.icon }}</v-icon></div>
        <div class="skyc-body">
          <p class="skyc-eyebrow">{{ meta.label }} · KYC {{ view.chip }}</p>
          <p class="skyc-title">{{ view.title }}</p>
          <p class="skyc-sub">{{ view.message }}</p>
        </div>
      </div>

      <!-- ── PENDING / REJECTED: what's needed + CTA ────────────────── -->
      <div v-if="state === 'PENDING' || state === 'REJECTED'" class="skyc-grid">
        <div class="skyc-card">
          <p class="skyc-card-title">
            <v-icon size="18" color="#1142d4">mdi-clipboard-check-outline</v-icon>
            Keep these ready
          </p>
          <ol class="skyc-steps">
            <li v-for="(step, i) in meta.steps" :key="i">
              <span class="skyc-step-no">{{ i + 1 }}</span>
              <div>
                <p class="skyc-step-title">{{ step.title }}</p>
                <p class="skyc-step-sub">{{ step.detail }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="skyc-card">
          <p class="skyc-card-title">
            <v-icon size="18" color="#059669">mdi-lock-open-variant-outline</v-icon>
            Unlocks after verification
          </p>
          <ul class="skyc-unlocks">
            <li v-for="u in meta.unlocks" :key="u.title">
              <v-icon size="18" color="#475569">{{ u.icon }}</v-icon>{{ u.title }}
            </li>
          </ul>
          <button class="skyc-btn" :disabled="sdkOpening" @click="startOnboarding">
            <v-icon size="18">{{ state === 'REJECTED' ? 'mdi-refresh' : 'mdi-shield-check-outline' }}</v-icon>
            {{ state === 'REJECTED' ? `Re-submit ${meta.label} KYC` : `Complete ${meta.label} KYC` }}
          </button>
        </div>
      </div>

      <!-- ── IN REVIEW: awaiting approval ───────────────────────────── -->
      <div v-else-if="state === 'IN_REVIEW'" class="skyc-card">
        <p class="skyc-card-title">
          <v-icon size="18" color="#1142d4">mdi-timeline-clock-outline</v-icon>
          Verification progress
        </p>
        <ol class="skyc-timeline">
          <li class="done"><span /> KYC details submitted</li>
          <li class="current"><span /> Under review by the approval team</li>
          <li><span /> {{ meta.label }} services activated</li>
        </ol>
        <p class="skyc-note">
          You'll get an email once your {{ meta.label }} KYC is approved. Nothing else is needed from you right now.
        </p>
        <button class="skyc-btn skyc-btn-outline" :disabled="refreshing" @click="refresh">
          <v-icon size="18" :class="{ spin: refreshing }">mdi-refresh</v-icon>
          {{ refreshing ? 'Checking…' : 'Check status' }}
        </button>
      </div>

      <!-- ── VERIFIED (reached directly) ────────────────────────────── -->
      <div v-else-if="state === 'VERIFIED'" class="skyc-card">
        <button class="skyc-btn" @click="router.push(meta.servicePath)">
          <v-icon size="18">mdi-arrow-right</v-icon>
          Go to {{ meta.label }} services
        </button>
      </div>

      <!-- ── SUSPENDED / NONE ────────────────────────────────────────── -->
      <div v-else class="skyc-card">
        <p class="skyc-note">
          Please contact your distributor or support to have {{ meta.label }} enabled for your account.
        </p>
        <button class="skyc-btn skyc-btn-outline" @click="router.push('/merchant/dashboard')">
          <v-icon size="18">mdi-view-dashboard-outline</v-icon>
          Back to dashboard
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
// Service-KYC status page body for AEPS / DMT. The service's KYC state
// (useMerchantServices.serviceKycState) decides what is shown:
//   PENDING   → requirements + "Complete KYC" (self-onboarding page)
//   IN_REVIEW → submitted, awaiting approval (SUBMITTED/PROCESSING/UNDER_REVIEW)
//   REJECTED  → re-submit
//   SUSPENDED / NONE → contact support
//   VERIFIED  → link to the service
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMerchantServices } from "~/composables/useMerchantServices";
import { useBucksbox } from "~/composables/useBucksbox";
import { useSnackbar } from "~/composables/useSnackbar";
import { useAuthStore } from "~/stores/auth";
import { useUsersApi } from "~/composables/apis/useUsersApi";

const props = defineProps({
  service: { type: String, required: true, validator: (v) => ["AEPS", "DMT"].includes(v) },
});

const router = useRouter();
const { loadMerchantServices, serviceKycState } = useMerchantServices();
const { open: openBucksbox } = useBucksbox();
const { notify } = useSnackbar();
const authStore = useAuthStore();
const { getProfile } = useUsersApi();

const loading = ref(true);
const refreshing = ref(false);
const sdkOpening = ref(false);

const SERVICE_META = {
  AEPS: {
    label: "AEPS",
    sdkService: "aeps-onboarding",
    servicePath: "/merchant/aeps",
    onboardPath: "/merchant/kyc/aeps",
    steps: [
      { title: "Registered mobile number", detail: "An OTP is sent to verify the mobile linked to your account." },
      { title: "PAN card", detail: "Your PAN number, name as on PAN and date of birth." },
      { title: "Aadhaar number", detail: "The Aadhaar of the account holder / agent." },
      { title: "Fingerprint device (RD service)", detail: "A registered biometric device (e.g. Mantra MFS110) connected to this computer for the final Aadhaar biometric step." },
    ],
    unlocks: [
      { title: "Cash Withdrawal", icon: "mdi-cash-multiple" },
      { title: "Balance Enquiry", icon: "mdi-wallet-outline" },
      { title: "Mini Statement", icon: "mdi-receipt-text-outline" },
      { title: "Aadhaar Pay", icon: "mdi-fingerprint" },
    ],
  },
  DMT: {
    label: "DMT",
    sdkService: "dmt-onboarding",
    servicePath: "/merchant/dmt",
    onboardPath: "/merchant/kyc/dmt",
    steps: [
      { title: "Agent details", detail: "First and last name exactly as on your PAN card." },
      { title: "PAN card", detail: "Your PAN is used to register you as a Money Transfer agent with the bank (NSDL)." },
      { title: "Services to enable", detail: "Choose DMT (and optionally AEPS / card PIN / account opening) during registration." },
    ],
    unlocks: [
      { title: "Send Money (IMPS / NEFT)", icon: "mdi-send-outline" },
      { title: "Beneficiary management", icon: "mdi-account-multiple-outline" },
      { title: "Transfer history & receipts", icon: "mdi-history" },
    ],
  },
};

const meta = computed(() => SERVICE_META[props.service]);
const state = computed(() => serviceKycState(props.service));

const view = computed(() => {
  const l = meta.value.label;
  switch (state.value) {
    case "PENDING":
      return { tone: "warn", chip: "Pending", icon: "mdi-alert-circle-outline", iconColor: "#b45309",
        title: `Complete your ${l} KYC to get started`,
        message: `${l} is enabled for your account, but its KYC is not completed yet. Finish the verification below to start using ${l} services.` };
    case "REJECTED":
      return { tone: "danger", chip: "Rejected", icon: "mdi-close-octagon-outline", iconColor: "#b91c1c",
        title: `Your ${l} KYC was not approved`,
        message: `Please review your details and submit your ${l} KYC again. Contact support if you need help with the reason for rejection.` };
    case "IN_REVIEW":
      return { tone: "info", chip: "Under review", icon: "mdi-progress-clock", iconColor: "#1142d4",
        title: `Your ${l} KYC is awaiting approval`,
        message: `Thanks — your ${l} KYC has been submitted and is being reviewed. ${l} services will unlock automatically once it is approved.` };
    case "VERIFIED":
      return { tone: "success", chip: "Verified", icon: "mdi-check-decagram", iconColor: "#059669",
        title: `Your ${l} KYC is verified`,
        message: `You can use all ${l} services.` };
    case "SUSPENDED":
      return { tone: "danger", chip: "Suspended", icon: "mdi-pause-octagon-outline", iconColor: "#b91c1c",
        title: `${l} is suspended for your account`,
        message: `${l} services have been suspended. Please contact support.` };
    default:
      return { tone: "neutral", chip: "Not enabled", icon: "mdi-information-outline", iconColor: "#475569",
        title: `${l} is not enabled for your account`,
        message: `${l} has not been activated for your merchant account yet.` };
  }
});

// Opens the BucksBox SDK onboarding widget for this service (AEPS → aeps-onboarding,
// DMT → dmt-onboarding); on success the KYC state is reloaded.
async function startOnboarding() {
  sdkOpening.value = true;
  try {
    // After login the store holds the merchant itself (merchant.id); after /merchant/me
    // (getProfile) it holds the response body (merchant.data.id). Fetch it if missing.
    const readMerchantId = () => authStore.merchant?.id || authStore.merchant?.data?.id;
    if (!readMerchantId()) await getProfile();
    const merchantId = readMerchantId();
    if (!merchantId) throw new Error("Merchant details not loaded. Please sign in again.");

    await openBucksbox({ service: meta.value.sdkService, merchantId }, async (result) => {
      if (result.status === "success") {
        notify(`${meta.value.label} KYC submitted`);
        await refresh();
      } else {
        console.warn(`[bucksbox] ${meta.value.sdkService} failed`, result);
        notify(result.message || `${meta.value.label} KYC could not be completed`, "error");
      }
    });
  } catch (e) {
    console.log(e)
    notify(e?.message || "Unable to open KYC", "error");
  } finally {
    sdkOpening.value = false;
  }
}

async function refresh() {
  refreshing.value = true;
  try {
    await loadMerchantServices(true);
    if (state.value === "VERIFIED") router.push(meta.value.servicePath);
  } finally {
    refreshing.value = false;
  }
}

onMounted(async () => {
  try {
    await loadMerchantServices(true);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.skyc { font-family: 'DM Sans', sans-serif; max-width: 980px; }
.skyc-loading { display: flex; justify-content: center; padding: 60px 0; }

.skyc-banner {
  position: relative; display: flex; align-items: flex-start; gap: 16px;
  border-radius: 16px; padding: 20px 22px 20px 24px; margin-bottom: 18px; overflow: hidden;
  border: 1px solid; box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}
.skyc-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
.skyc-icon {
  width: 48px; height: 48px; border-radius: 14px; background: #fff; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.1);
}
.skyc-body { flex: 1; min-width: 0; }
.skyc-eyebrow { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; margin: 0 0 4px; opacity: 0.8; }
.skyc-title { font-size: 1.05rem; font-weight: 800; margin: 0 0 4px; letter-spacing: -0.2px; }
.skyc-sub { font-size: 0.85rem; margin: 0; line-height: 1.55; }

.skyc-warn    { background: linear-gradient(135deg, #fffbeb, #fff7ed); border-color: #fde9b8; color: #92400e; }
.skyc-warn .skyc-accent    { background: linear-gradient(180deg, #f59e0b, #b45309); }
.skyc-info    { background: linear-gradient(135deg, #eff4ff, #f5f8ff); border-color: #d6e0fb; color: #1e3a8a; }
.skyc-info .skyc-accent    { background: linear-gradient(180deg, #1a52f5, #1142d4); }
.skyc-danger  { background: linear-gradient(135deg, #fef2f2, #fff5f5); border-color: #fecaca; color: #991b1b; }
.skyc-danger .skyc-accent  { background: linear-gradient(180deg, #ef4444, #b91c1c); }
.skyc-success { background: linear-gradient(135deg, #ecfdf5, #f0fdf8); border-color: #bbf7d0; color: #065f46; }
.skyc-success .skyc-accent { background: linear-gradient(180deg, #10b981, #059669); }
.skyc-neutral { background: #f8fafc; border-color: #e2e8f0; color: #334155; }
.skyc-neutral .skyc-accent { background: #94a3b8; }

.skyc-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 18px; }
@media (max-width: 860px) { .skyc-grid { grid-template-columns: 1fr; } }

.skyc-card {
  background: #fff; border: 1px solid #e8ebf2; border-radius: 16px; padding: 20px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04); display: flex; flex-direction: column;
}
.skyc-card-title { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 800; color: #0f172a; margin: 0 0 14px; }

.skyc-steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.skyc-steps li { display: flex; gap: 12px; }
.skyc-step-no {
  width: 26px; height: 26px; border-radius: 8px; background: #eff4ff; color: #1142d4; flex-shrink: 0;
  font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
}
.skyc-step-title { font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 2px 0 2px; }
.skyc-step-sub { font-size: 0.78rem; color: #64748b; margin: 0; line-height: 1.5; }

.skyc-unlocks { list-style: none; padding: 0; margin: 0 0 18px; display: flex; flex-direction: column; gap: 10px; }
.skyc-unlocks li { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; color: #334155; }

.skyc-timeline { list-style: none; padding: 0; margin: 0 0 14px; }
.skyc-timeline li { position: relative; display: flex; align-items: center; gap: 12px; padding: 0 0 18px; font-size: 0.86rem; color: #94a3b8; font-weight: 600; }
.skyc-timeline li span { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #cbd5e1; background: #fff; flex-shrink: 0; }
.skyc-timeline li:not(:last-child)::after { content: ""; position: absolute; left: 6px; top: 16px; bottom: 2px; width: 2px; background: #e2e8f0; }
.skyc-timeline li.done { color: #059669; }
.skyc-timeline li.done span { background: #059669; border-color: #059669; }
.skyc-timeline li.current { color: #1142d4; }
.skyc-timeline li.current span { border-color: #1142d4; box-shadow: 0 0 0 4px rgba(17, 66, 212, 0.12); }

.skyc-note { font-size: 0.82rem; color: #64748b; line-height: 1.55; margin: 0 0 16px; }

.skyc-btn {
  margin-top: auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%); color: #fff; border: none; border-radius: 10px;
  padding: 0.7rem 1.3rem; font-size: 0.86rem; font-weight: 700; font-family: inherit; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17, 66, 212, 0.28); transition: filter 0.15s, transform 0.1s; align-self: flex-start;
}
.skyc-btn:hover { filter: brightness(1.07); }
.skyc-btn:active { transform: scale(0.98); }
.skyc-btn:disabled { opacity: 0.65; cursor: default; }
.skyc-btn-outline { background: #fff; color: #1142d4; border: 1px solid #c9d6fa; box-shadow: none; }
@media (max-width: 640px) { .skyc-btn { width: 100%; } }

.spin { animation: skyc-spin 0.9s linear infinite; }
@keyframes skyc-spin { to { transform: rotate(360deg); } }
</style>
