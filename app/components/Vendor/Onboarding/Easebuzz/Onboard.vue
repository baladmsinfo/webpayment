<template>
  <div class="eb-root">
    <div class="eb-header">
      <button class="eb-back-btn" @click="router.back()">
        <span class="mdi mdi-arrow-left"></span>
      </button>
      <div>
        <p class="eb-header__eyebrow">UPI · EASEBUZZ</p>
        <h1 class="eb-header__title">Create Sub-Merchant</h1>
        <p class="eb-header__sub" v-if="merchant">
          {{ merchant.legal_name || merchant.business_name || 'Merchant' }} · {{ merchant.mid }}
        </p>
      </div>
    </div>

    <div v-if="loadingProfile" class="eb-card eb-card--loading">
      <p>Loading merchant details…</p>
    </div>

    <template v-else>
      <div v-if="submitResult" class="eb-card eb-result eb-result--success">
        <span class="mdi mdi-check-circle-outline eb-result__icon"></span>
        <h2>Submitted for review</h2>
        <p>{{ submitResult.message }}</p>
        <button class="eb-btn eb-btn--primary" @click="goBackToMerchant">Back to merchant</button>
      </div>

      <template v-else>
        <p class="eb-review-hint">
          Review the merchant's existing details below — everything shown is already on file.
          Clicking <strong>Create Sub-Merchant</strong> submits this merchant's UPI · EASEBUZZ service for review.
        </p>

        <div v-if="formError" class="eb-error-banner">
          <span class="mdi mdi-alert-circle-outline"></span> {{ formError }}
        </div>

        <div class="eb-card">
          <section v-for="sec in sections" :key="sec.title" class="eb-section">
            <h3 class="eb-section__title">{{ sec.title }}</h3>
            <div class="eb-grid">
              <div v-for="f in sec.fields" :key="f.label" class="eb-field" :class="{ 'eb-field--full': f.full }">
                <label>
                  {{ f.label }}<span v-if="f.optional" class="eb-optional"> (optional)</span>
                </label>
                <p class="eb-value" :class="{ 'eb-value--empty': !f.value }">
                  {{ f.value ? (f.mask ? maskAccountNumber(f.value) : f.value) : 'Not on file' }}
                </p>
              </div>
            </div>
          </section>

          <p v-if="missingFieldLabels.length" class="eb-missing-note">
            <span class="mdi mdi-alert-outline"></span>
            Not on file yet: {{ missingFieldLabels.join(', ') }}. You can still submit — these can be completed later.
          </p>

          <div class="eb-footer">
            <button type="button" class="eb-btn eb-btn--ghost" @click="router.back()">Cancel</button>
            <button type="button" class="eb-btn eb-btn--primary" :disabled="submitting" @click="handleSubmit">
              <span v-if="submitting" class="eb-spinner"></span>
              {{ submitting ? 'Submitting…' : 'Create Sub-Merchant' }}
            </button>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOnboadingApi } from "~/composables/apis/useOnboadingApi";
import { useEasebuzzApi } from "~/composables/apis/useEasebuzzApi";

const props = defineProps({ merchantId: String });

const router = useRouter();
const { getMerchantById } = useOnboadingApi();
const { markEasebuzzSubmitted } = useEasebuzzApi();

const merchant = ref(null);
const loadingProfile = ref(true);
const submitting = ref(false);
const submitResult = ref(null);
const formError = ref("");

// Every value here comes straight from the database — nothing typed in by
// the vendor. Fields Easebuzz's real API would need but we don't store
// (category_code, business_type_code, entity_type, primary_vpa) are
// intentionally not shown, since this page only submits a review request,
// not the actual Easebuzz create-sub-merchant call.
const review = reactive({
  name: null, business_name: null, email: null, phone: null,
  nature_of_business: null, state: null, pan_number: null, gstin: null,
  business_address: null, city: null, pincode: null,
  name_on_bank: null, bank_name: null, bank_branch: null, account_number: null, account_ifsc: null,
});

const sections = computed(() => [
  {
    title: "Contact Details",
    fields: [
      { label: "Merchant Name", value: review.name },
      { label: "Business Name", value: review.business_name },
      { label: "Email", value: review.email },
      { label: "Phone", value: review.phone },
    ],
  },
  {
    title: "Business Details",
    fields: [
      { label: "Nature of Business", value: review.nature_of_business },
      { label: "State", value: review.state },
      { label: "PAN Number", value: review.pan_number },
      { label: "GSTIN", value: review.gstin, optional: true },
    ],
  },
  {
    title: "Address",
    fields: [
      { label: "Business Address", value: review.business_address, full: true },
      { label: "City", value: review.city },
      { label: "Pincode", value: review.pincode },
    ],
  },
  {
    title: "Bank Details",
    fields: [
      { label: "Name on Bank Account", value: review.name_on_bank },
      { label: "Bank Name", value: review.bank_name },
      { label: "Bank Branch", value: review.bank_branch },
      { label: "Account Number", value: review.account_number, mask: true },
      { label: "Account IFSC", value: review.account_ifsc },
    ],
  },
]);

const missingFieldLabels = computed(() =>
  sections.value
    .flatMap((sec) => sec.fields)
    .filter((f) => !f.optional && !f.value)
    .map((f) => f.label)
);

function maskAccountNumber(v) {
  const s = String(v);
  return s.length > 4 ? `••••${s.slice(-4)}` : s;
}

onMounted(async () => {
  loadingProfile.value = true;
  try {
    const res = await getMerchantById(props.merchantId);
    if (res?.statusCode === "00" && res?.data) {
      const m = res.data;
      merchant.value = m;

      const pan = m.merchantpan?.[0] || null;
      const settlement = m.settlementaccount || null;

      review.name = m.legal_name || null;
      review.business_name = m.business_name || m.dba_name || null;
      review.email = m.merchantinfo?.primary_email_id || null;
      review.phone = m.merchantinfo?.primary_mobile || (m.mobile_no ? String(m.mobile_no) : null);
      review.nature_of_business = m.merchantinfo?.nature_of_business || null;
      review.state = m.address?.state || null;
      review.pan_number = pan?.pan || null;
      review.gstin = m.merchantgst?.gstin || null;
      review.business_address = m.address?.official_address || m.address?.address1 || null;
      review.city = m.address?.city || null;
      review.pincode = m.address?.pincode ? String(m.address.pincode) : null;
      review.name_on_bank = settlement?.account_holder_name || null;
      review.bank_name = settlement?.bank_name || null;
      review.bank_branch = settlement?.branch_name || null;
      review.account_number = settlement?.bank_account_no || null;
      review.account_ifsc = settlement?.bank_ifsc_code || null;
    } else {
      formError.value = res?.message || "Failed to load merchant details.";
    }
  } catch (err) {
    formError.value = "Failed to load merchant details.";
    console.error("[Easebuzz onboarding] Failed to load merchant profile:", err);
  } finally {
    loadingProfile.value = false;
  }
});

function goBackToMerchant() {
  router.push(`/vendor/merchants/view/${props.merchantId}`);
}

async function handleSubmit() {
  formError.value = "";
  submitting.value = true;
  try {
    const res = await markEasebuzzSubmitted(props.merchantId);
    if (res?.statusCode === "00") {
      submitResult.value = res;
    } else {
      formError.value = res?.message || "Failed to submit. Please try again.";
    }
  } catch (err) {
    formError.value = "An unexpected error occurred. Please try again.";
    console.error("[Easebuzz onboarding] Submit error:", err);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.eb-root {
  max-width: 880px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  font-family: inherit;
}

.eb-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.eb-back-btn {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: #eef2ff; border: 1.5px solid #d7e0fb; color: #1142d4;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.eb-back-btn:hover { background: #e0e9fe; }
.eb-header__eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: .08em; color: #7c3aed;
  text-transform: uppercase; margin: 0 0 2px;
}
.eb-header__title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0; }
.eb-header__sub { font-size: .85rem; color: #64748b; margin: 2px 0 0; }

.eb-review-hint { font-size: .83rem; color: #64748b; margin: 0 0 16px; line-height: 1.5; }

.eb-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .04);
}
.eb-card--loading { text-align: center; color: #64748b; padding: 48px 24px; }

.eb-error-banner {
  display: flex; align-items: center; gap: 8px;
  background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
  border-radius: 10px; padding: 10px 14px; font-size: .82rem; margin-bottom: 18px;
}

.eb-section { margin-bottom: 24px; }
.eb-section:last-of-type { margin-bottom: 0; }
.eb-section__title {
  font-size: .78rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: #475569; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;
}

.eb-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (max-width: 640px) { .eb-grid { grid-template-columns: 1fr; } }

.eb-field { display: flex; flex-direction: column; gap: 4px; }
.eb-field--full { grid-column: 1 / -1; }
.eb-field label {
  font-size: .72rem; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: .04em;
}
.eb-value { font-size: .88rem; color: #0f172a; font-weight: 600; margin: 0; word-break: break-word; }
.eb-value--empty { color: #94a3b8; font-weight: 500; font-style: italic; }
.eb-optional { font-weight: 400; text-transform: none; color: #94a3b8; }

.eb-missing-note {
  display: flex; align-items: flex-start; gap: 8px;
  background: #fffbeb; border: 1px solid #fde68a; color: #92400e;
  border-radius: 10px; padding: 10px 14px; font-size: .78rem; margin: 4px 0 0; line-height: 1.5;
}

.eb-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px; padding-top: 18px; border-top: 1px solid #f1f5f9;
}

.eb-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 10px; font-size: .85rem; font-weight: 700;
  cursor: pointer; border: none; font-family: inherit;
}
.eb-btn--primary { background: #1142d4; color: #fff; }
.eb-btn--primary:hover:not(:disabled) { background: #0e37ad; }
.eb-btn--primary:disabled { opacity: .6; cursor: not-allowed; }
.eb-btn--ghost { background: #fff; color: #475569; border: 1px solid #cbd5e1; }
.eb-btn--ghost:hover { background: #f8fafc; }

.eb-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff;
  animation: eb-spin .7s linear infinite;
}
@keyframes eb-spin { to { transform: rotate(360deg); } }

.eb-result { text-align: center; padding: 48px 24px; }
.eb-result__icon { font-size: 2.6rem; color: #16a34a; }
.eb-result h2 { font-size: 1.1rem; color: #0f172a; margin: 12px 0 6px; }
.eb-result p { font-size: .85rem; color: #64748b; margin: 0 0 20px; }
</style>
