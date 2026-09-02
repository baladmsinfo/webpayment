<template>
  <div class="bx-root">
    <div class="bx-header">
      <button class="bx-back-btn" @click="router.back()">
        <span class="mdi mdi-arrow-left"></span>
      </button>
      <div>
        <p class="bx-header__eyebrow">UPI · BUCKSBOX</p>
        <h1 class="bx-header__title">BUCKSBOX Onboarding</h1>
        <p class="bx-header__sub" v-if="merchant">
          {{ merchant.legal_name || merchant.business_name || 'Merchant' }} · {{ merchant.mid }}
        </p>
      </div>
    </div>

    <div v-if="loadingProfile" class="bx-card bx-card--loading">
      <p>Loading merchant details…</p>
    </div>

    <template v-else>
      <div v-if="submitResult" class="bx-card bx-result bx-result--success">
        <span class="mdi mdi-check-circle-outline bx-result__icon"></span>
        <h2>Submitted for review</h2>
        <p>{{ submitResult.message }}</p>
        <button class="bx-btn bx-btn--primary" @click="goBackToMerchant">Back to merchant</button>
      </div>

      <template v-else>
        <p class="bx-review-hint">
          Review the merchant's existing details below — everything shown is already on file.
          Clicking <strong>Submit Onboarding</strong> submits this merchant's UPI · BUCKSBOX service for review.
        </p>

        <div v-if="formError" class="bx-error-banner">
          <span class="mdi mdi-alert-circle-outline"></span> {{ formError }}
        </div>

        <div class="bx-card">
          <section v-for="sec in sections" :key="sec.title" class="bx-section">
            <h3 class="bx-section__title">{{ sec.title }}</h3>
            <div class="bx-grid">
              <div v-for="f in sec.fields" :key="f.label" class="bx-field" :class="{ 'bx-field--full': f.full }">
                <label>
                  {{ f.label }}<span v-if="f.optional" class="bx-optional"> (optional)</span>
                </label>
                <p class="bx-value" :class="{ 'bx-value--empty': !f.value }">
                  {{ f.value ? (f.mask ? maskAccountNumber(f.value) : f.value) : 'Not on file' }}
                </p>
              </div>
            </div>
          </section>

          <p v-if="missingFieldLabels.length" class="bx-missing-note">
            <span class="mdi mdi-alert-outline"></span>
            Not on file yet: {{ missingFieldLabels.join(', ') }}. You can still submit — these can be completed later.
          </p>

          <div class="bx-footer">
            <button type="button" class="bx-btn bx-btn--ghost" @click="router.back()">Cancel</button>
            <button type="button" class="bx-btn bx-btn--primary" :disabled="submitting" @click="handleSubmit">
              <span v-if="submitting" class="bx-spinner"></span>
              {{ submitting ? 'Submitting…' : 'Submit Onboarding' }}
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
import { useBucksboxApi } from "~/composables/apis/useBucksboxApi";

const props = defineProps({ merchantId: String });

const router = useRouter();
const { getMerchantById } = useOnboadingApi();
const { markBucksboxSubmitted } = useBucksboxApi();

const merchant = ref(null);
const loadingProfile = ref(true);
const submitting = ref(false);
const submitResult = ref(null);
const formError = ref("");

// Every value here comes straight from the database — nothing typed in by
// the vendor. BUCKSBOX is Bucksbox's own first-party interface (no external
// provider fields to collect), so this page is purely a review-and-submit
// step: confirm the merchant's existing on-file details, then flag this
// merchant's UPI · BUCKSBOX service as submitted for review.
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
    console.error("[BUCKSBOX onboarding] Failed to load merchant profile:", err);
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
    const res = await markBucksboxSubmitted(props.merchantId);
    if (res?.statusCode === "00") {
      submitResult.value = res;
    } else {
      formError.value = res?.message || "Failed to submit. Please try again.";
    }
  } catch (err) {
    formError.value = "An unexpected error occurred. Please try again.";
    console.error("[BUCKSBOX onboarding] Submit error:", err);
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.bx-root {
  max-width: 880px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  font-family: inherit;
}

.bx-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.bx-back-btn {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: #eef2ff; border: 1.5px solid #d7e0fb; color: #1142d4;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.bx-back-btn:hover { background: #e0e9fe; }
.bx-header__eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: .08em; color: #7c3aed;
  text-transform: uppercase; margin: 0 0 2px;
}
.bx-header__title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0; }
.bx-header__sub { font-size: .85rem; color: #64748b; margin: 2px 0 0; }

.bx-review-hint { font-size: .83rem; color: #64748b; margin: 0 0 16px; line-height: 1.5; }

.bx-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .04);
}
.bx-card--loading { text-align: center; color: #64748b; padding: 48px 24px; }

.bx-error-banner {
  display: flex; align-items: center; gap: 8px;
  background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
  border-radius: 10px; padding: 10px 14px; font-size: .82rem; margin-bottom: 18px;
}

.bx-section { margin-bottom: 24px; }
.bx-section:last-of-type { margin-bottom: 0; }
.bx-section__title {
  font-size: .78rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: #475569; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;
}

.bx-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (max-width: 640px) { .bx-grid { grid-template-columns: 1fr; } }

.bx-field { display: flex; flex-direction: column; gap: 4px; }
.bx-field--full { grid-column: 1 / -1; }
.bx-field label {
  font-size: .72rem; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: .04em;
}
.bx-value { font-size: .88rem; color: #0f172a; font-weight: 600; margin: 0; word-break: break-word; }
.bx-value--empty { color: #94a3b8; font-weight: 500; font-style: italic; }
.bx-optional { font-weight: 400; text-transform: none; color: #94a3b8; }

.bx-missing-note {
  display: flex; align-items: flex-start; gap: 8px;
  background: #fffbeb; border: 1px solid #fde68a; color: #92400e;
  border-radius: 10px; padding: 10px 14px; font-size: .78rem; margin: 4px 0 0; line-height: 1.5;
}

.bx-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 20px; padding-top: 18px; border-top: 1px solid #f1f5f9;
}

.bx-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 10px; font-size: .85rem; font-weight: 700;
  cursor: pointer; border: none; font-family: inherit;
}
.bx-btn--primary { background: #1142d4; color: #fff; }
.bx-btn--primary:hover:not(:disabled) { background: #0e37ad; }
.bx-btn--primary:disabled { opacity: .6; cursor: not-allowed; }
.bx-btn--ghost { background: #fff; color: #475569; border: 1px solid #cbd5e1; }
.bx-btn--ghost:hover { background: #f8fafc; }

.bx-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff;
  animation: bx-spin .7s linear infinite;
}
@keyframes bx-spin { to { transform: rotate(360deg); } }

.bx-result { text-align: center; padding: 48px 24px; }
.bx-result__icon { font-size: 2.6rem; color: #16a34a; }
.bx-result h2 { font-size: 1.1rem; color: #0f172a; margin: 12px 0 6px; }
.bx-result p { font-size: .85rem; color: #64748b; margin: 0 0 20px; }
</style>
