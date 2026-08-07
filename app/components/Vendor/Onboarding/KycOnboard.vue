<template>
  <div class="vo-root">

    <!-- ── HEADER ── -->
    <header class="vo-header">
      <div class="vo-header__brand">
        <div class="vo-header__icon">
          <span class="mdi mdi-file-document-check-outline"></span>
        </div>
        <div class="vo-header__text">
          <h2 class="vo-header__title">Distributor KYC</h2>
          <p class="vo-header__sub">{{ steps[step - 1]?.label }}</p>
        </div>
      </div>
      <div class="vo-header__right">
        <div class="vo-header__step-badge">
          <span class="mdi mdi-progress-check"></span>
          Step {{ step }} / {{ steps.length }}
        </div>
      </div>
    </header>

    <!-- ── PROGRESS BAR ── -->
    <div class="vo-progress-strip">
      <div class="vo-progress-strip__fill" :style="{ width: ((step - 1) / (steps.length - 1) * 100) + '%' }"></div>
    </div>

    <!-- ── MAIN CONTENT ── -->
    <main class="vo-main">
      <div class="vo-content">

        <!-- ── FORM CARD ── -->
        <div class="vo-card">

          <!-- ════ STEP 1 — Business Type ════ -->
          <template v-if="step === 1">
            <div class="vo-card__head">
              <div class="vo-card-icon-wrap">
                <span class="mdi mdi-briefcase-outline"></span>
              </div>
              <div>
                <h2 class="vo-card__heading">Business Type</h2>
                <p class="vo-card__desc">Select the legal structure that best describes your business.</p>
              </div>
            </div>

            <div class="vo-card__body">
              <div class="vo-btype-grid">
                <label v-for="btype in businessTypeList" :key="btype.value"
                  class="vo-btype-card"
                  :class="{ 'vo-btype-card--selected': selectedBusinessType === btype.value }"
                  @click="selectedBusinessType = btype.value">
                  <div class="vo-btype-radio">
                    <div class="vo-btype-radio-dot" :class="{ 'vo-btype-radio-dot--on': selectedBusinessType === btype.value }"></div>
                  </div>
                  <div class="vo-btype-icon">
                    <span class="mdi mdi-briefcase-variant-outline"></span>
                  </div>
                  <div class="vo-btype-body">
                    <p class="vo-btype-name">{{ btype.label }}</p>
                    <p v-if="selectedBusinessType === btype.value" class="vo-btype-hint">
                      {{ BUSINESS_TYPE_RULES[btype.value]?.partners > 0
                        ? `Requires ${BUSINESS_TYPE_RULES[btype.value].partners} partner(s)`
                        : 'No partners required' }}
                    </p>
                  </div>
                  <span v-if="selectedBusinessType === btype.value" class="mdi mdi-check-circle vo-btype-check"></span>
                </label>
              </div>

              <div v-if="selectedBusinessType" class="vo-info-alert">
                <span class="mdi mdi-information-outline vo-info-alert__icon"></span>
                <p class="vo-info-alert__text">
                  You selected <strong>{{ businessTypeList.find(t => t.value === selectedBusinessType)?.label }}</strong>.
                  {{ BUSINESS_TYPE_RULES[selectedBusinessType]?.partners > 0
                    ? `This business type requires ${BUSINESS_TYPE_RULES[selectedBusinessType].partners} partner document(s).`
                    : 'No partner documents are required for this type.' }}
                </p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 2 — Documents ════ -->
          <template v-else-if="step === 2">
            <div class="vo-card__head">
              <div class="vo-card-icon-wrap">
                <span class="mdi mdi-file-document-multiple-outline"></span>
              </div>
              <div>
                <h2 class="vo-card__heading">Verification Documents</h2>
                <p class="vo-card__desc">Upload all required documents to complete compliance verification.</p>
              </div>
            </div>

            <div class="vo-card__body">
              <!-- Status alerts -->
              <div v-if="!isComplianceComplete" class="vo-warn-alert">
                <span class="mdi mdi-alert-outline vo-warn-alert__icon"></span>
                <p>Please complete all required document categories before submitting.</p>
              </div>
              <div v-if="isComplianceComplete" class="vo-success-alert">
                <span class="mdi mdi-check-circle-outline vo-success-alert__icon"></span>
                <p>All required documents submitted. You're ready to submit for verification.</p>
              </div>

              <!-- Category grid -->
              <div v-if="docStep === 0" class="vo-doc-grid">
                <div v-for="group in requiredDocs" :key="group.category"
                  class="vo-doc-card"
                  :class="group.compliant ? 'vo-doc-card--done' : 'vo-doc-card--pending'"
                  @click="openCategory(group)">
                  <div class="vo-doc-card__header">
                    <div class="vo-doc-card__icon" :class="group.compliant ? 'vo-doc-card__icon--done' : 'vo-doc-card__icon--pending'">
                      <span class="mdi" :class="group.compliant ? 'mdi-check-decagram' : 'mdi-file-upload-outline'"></span>
                    </div>
                    <span class="vo-doc-card__count" :class="group.compliant ? 'vo-doc-card__count--done' : 'vo-doc-card__count--pending'">
                      {{ group.uploaded }}/{{ group.required }}
                    </span>
                  </div>
                  <p class="vo-doc-card__name">{{ group.category.replaceAll('_', ' ') }}</p>
                  <div class="vo-doc-progress">
                    <div class="vo-doc-progress__fill"
                      :class="group.compliant ? 'vo-doc-progress__fill--done' : 'vo-doc-progress__fill--active'"
                      :style="{ width: (group.required ? (group.uploaded / group.required) * 100 : 0) + '%' }"></div>
                  </div>
                  <p class="vo-doc-card__cta">Manage <span class="mdi mdi-arrow-right"></span></p>
                </div>
              </div>

              <!-- Doc type list -->
              <div v-if="docStep === 1">
                <button class="vo-back-btn" @click="docStep = 0">
                  <span class="mdi mdi-arrow-left"></span> Back to Categories
                </button>
                <p class="vo-address-sub-title vo-mt">{{ activeCategory?.category?.replaceAll('_', ' ') }}</p>
                <div class="vo-doctype-grid">
                  <div v-for="doc in activeCategory?.documents" :key="doc.code"
                    class="vo-doctype-card"
                    :class="[
                      doc.uploaded ? 'vo-doctype-card--done' : 'vo-doctype-card--pending',
                      (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'vo-doctype-card--locked' : ''
                    ]">
                    <span class="mdi vo-doctype-card__icon"
                      :class="doc.uploaded ? 'mdi-check-circle-outline' : (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'mdi-lock-outline vo-doctype-card__icon--locked' : 'mdi-alert-circle-outline'"></span>
                    <p class="vo-doctype-card__name">{{ doc.name }}</p>
                    <span class="vo-doctype-card__status"
                      :class="doc.uploaded ? 'vo-doctype-card__status--done' : (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'vo-doctype-card__status--locked' : 'vo-doctype-card__status--pending'">
                      {{ doc.uploaded ? 'Uploaded' : (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'Not Required' : 'Pending' }}
                    </span>
                    <button class="vo-doctype-card__btn"
                      :disabled="doc.uploaded || (activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1)"
                      @click="openDocUpload(doc.code)">
                      {{ doc.uploaded ? 'Added ✓' : '+ Add' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Upload form -->
              <div v-if="docStep === 2">
                <button class="vo-back-btn" @click="docStep = 1">
                  <span class="mdi mdi-arrow-left"></span> Back to Documents
                </button>
                <div class="vo-upload-card vo-mt">
                  <p class="vo-address-sub-title">UPLOAD {{ activeDocType?.replaceAll('_', ' ') }}</p>

                  <!-- Doc number -->
                  <div v-if="showDocNumber && activeDocType !== 'BANK_PASSBOOK'" class="vo-field-wrap vo-mt-sm">
                    <label class="vo-label">{{ docNumberLabel }}</label>
                    <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads[activeDocType]?.docNumber?.trim() }">
                      <span class="mdi mdi-identifier vo-input-icon"></span>
                      <input v-model="docUploads[activeDocType].docNumber" class="vo-input" :placeholder="'Enter ' + docNumberLabel" />
                    </div>
                    <span v-if="showDocErrors && !docUploads[activeDocType]?.docNumber?.trim()" class="vo-field-error">{{ docNumberLabel }} is required</span>
                  </div>

                  <!-- Bank fields -->
                  <div v-if="activeDocType === 'BANK_PASSBOOK'" class="vo-grid vo-grid--2 vo-mt-sm">
                    <div class="vo-field-wrap">
                      <label class="vo-label">ACCOUNT HOLDER NAME</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountHolderName?.trim() }">
                        <span class="mdi mdi-account-outline vo-input-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.accountHolderName" class="vo-input" placeholder="Account holder full name" />
                      </div>
                      <span v-if="showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountHolderName?.trim()" class="vo-field-error">Required</span>
                    </div>
                    <div class="vo-field-wrap">
                      <label class="vo-label">ACCOUNT NUMBER</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountNumber?.trim() }">
                        <span class="mdi mdi-bank-outline vo-input-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.accountNumber" class="vo-input" placeholder="Bank account number" />
                      </div>
                      <span v-if="showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountNumber?.trim()" class="vo-field-error">Required</span>
                    </div>
                    <div class="vo-field-wrap">
                      <label class="vo-label">BANK NAME</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.bankName?.trim() }">
                        <span class="mdi mdi-bank vo-input-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.bankName" class="vo-input" placeholder="Bank name" />
                      </div>
                      <span v-if="showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.bankName?.trim()" class="vo-field-error">Required</span>
                    </div>
                    <div class="vo-field-wrap">
                      <label class="vo-label">IFSC CODE</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && (!docUploads.BANK_PASSBOOK?.settlement?.ifsc?.trim() || docUploads.BANK_PASSBOOK.settlement.ifsc.trim().length < 11) }">
                        <span class="mdi mdi-bank-transfer vo-input-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.ifsc" class="vo-input" placeholder="e.g. SBIN0001234" style="text-transform:uppercase" />
                      </div>
                      <span v-if="showDocErrors && (!docUploads.BANK_PASSBOOK?.settlement?.ifsc?.trim() || docUploads.BANK_PASSBOOK.settlement.ifsc.trim().length < 11)" class="vo-field-error">Enter valid 11-character IFSC</span>
                    </div>
                    <div class="vo-field-wrap">
                      <label class="vo-label">ACCOUNT TYPE</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.account_type }">
                        <span class="mdi mdi-swap-horizontal vo-input-icon"></span>
                        <select v-model="docUploads.BANK_PASSBOOK.settlement.account_type" class="vo-input vo-select">
                          <option value="">Select type</option>
                          <option value="SAVING">Saving</option>
                          <option value="CURRENT">Current</option>
                        </select>
                      </div>
                      <span v-if="showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.account_type" class="vo-field-error">Required</span>
                    </div>
                  </div>

                  <!-- PAN fields -->
                  <div v-if="['INDIVIDUAL_PAN','PARTNER1_INDIVIDUAL_PAN','PARTNER2_INDIVIDUAL_PAN'].includes(activeDocType)"
                    class="vo-grid vo-grid--2 vo-mt-sm">
                    <div class="vo-field-wrap">
                      <label class="vo-label">PAN NUMBER</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && docUploads[activeDocType]?.pan && !/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(docUploads[activeDocType].pan.pan || '') }">
                        <span class="mdi mdi-card-account-details-outline vo-input-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan" class="vo-input" placeholder="e.g. ABCDE1234F" maxlength="10" style="text-transform:uppercase" />
                      </div>
                      <span v-if="showDocErrors && docUploads[activeDocType]?.pan && !/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(docUploads[activeDocType].pan.pan || '')" class="vo-field-error">Enter valid PAN (e.g. ABCDE1234F)</span>
                    </div>
                    <div class="vo-field-wrap">
                      <label class="vo-label">PAN HOLDER NAME</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads[activeDocType]?.pan?.pan_name?.trim() }">
                        <span class="mdi mdi-account-outline vo-input-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan_name" class="vo-input" placeholder="Name as on PAN" />
                      </div>
                      <span v-if="showDocErrors && !docUploads[activeDocType]?.pan?.pan_name?.trim()" class="vo-field-error">Required</span>
                    </div>
                    <div class="vo-field-wrap">
                      <label class="vo-label">FATHER'S NAME</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads[activeDocType]?.pan?.pan_father_name?.trim() }">
                        <span class="mdi mdi-account-child-outline vo-input-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan_father_name" class="vo-input" placeholder="Father's name" />
                      </div>
                      <span v-if="showDocErrors && !docUploads[activeDocType]?.pan?.pan_father_name?.trim()" class="vo-field-error">Required</span>
                    </div>
                    <div class="vo-field-wrap">
                      <label class="vo-label">DATE OF BIRTH</label>
                      <div class="vo-input-box" :class="{ 'vo-input-box--error': showDocErrors && !docUploads[activeDocType]?.pan?.pan_dob }">
                        <span class="mdi mdi-calendar-outline vo-input-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan_dob" type="date" class="vo-input" />
                      </div>
                      <span v-if="showDocErrors && !docUploads[activeDocType]?.pan?.pan_dob" class="vo-field-error">Required</span>
                    </div>
                  </div>

                  <!-- File upload zone -->
                  <div class="vo-upload-zone vo-mt-sm">
                    <span class="mdi mdi-cloud-upload-outline vo-upload-zone__icon"></span>
                    <p class="vo-upload-zone__label">Upload {{ requiredImageCount }} image{{ requiredImageCount > 1 ? 's' : '' }}</p>
                    <p class="vo-upload-zone__sub">JPG or PNG format accepted</p>
                    <label class="vo-upload-zone__btn">
                      <span class="mdi mdi-folder-open-outline"></span>
                      Choose File{{ requiredImageCount > 1 ? 's' : '' }}
                      <input type="file" multiple accept="image/*" class="vo-upload-zone__input" @change="handleFileChange" />
                    </label>
                    <p v-if="docUploads[activeDocType]?.files?.length" class="vo-upload-zone__count">
                      {{ docUploads[activeDocType].files.length }} / {{ requiredImageCount }} selected
                    </p>
                  </div>

                  <!-- Validation summary -->
                  <div v-if="showDocErrors && !canSaveDoc" class="vo-doc-validation-hint">
                    <span class="mdi mdi-information-outline"></span>
                    Please fill all required fields above to enable saving.
                  </div>

                  <button class="vo-save-btn" :disabled="!canSaveDoc" @click="saveDocUpload">
                    <span class="mdi mdi-content-save-outline"></span>
                    Save Document
                  </button>
                </div>
              </div>

            </div>
          </template>

          <!-- ── CARD FOOTER ACTIONS ── -->
          <div class="vo-card-footer">
            <p class="vo-footer-terms">
              Documents are encrypted and reviewed by our compliance team.
            </p>
            <div class="vo-footer-actions">
              <button v-if="step > 1" class="vo-btn-secondary" @click="prevStep">
                <span class="mdi mdi-arrow-left"></span>
                Back
              </button>
              <button v-if="step < steps.length" class="vo-btn-primary" :disabled="loading" @click="next">
                <span v-if="loading" class="vo-spinner"></span>
                <template v-else>
                  Continue
                  <span class="mdi mdi-arrow-right"></span>
                </template>
              </button>
              <button v-else class="vo-btn-primary" :disabled="!isComplianceComplete || submitting" @click="submit">
                <span v-if="submitting" class="vo-spinner"></span>
                <template v-else>
                  Submit for Verification
                  <span class="mdi mdi-check"></span>
                </template>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- ── SNACKBAR ── -->
    <transition name="snack">
      <div v-if="snackbar.show" class="vo-snackbar" :class="'vo-snackbar--' + snackbar.color">
        <span class="mdi" :class="snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
        <span>{{ snackbar.message }}</span>
        <button class="vo-snackbar__close" @click="snackbar.show = false">
          <span class="mdi mdi-close"></span>
        </button>
      </div>
    </transition>

    <!-- ── PROCESSING OVERLAY ── -->
    <transition name="fade">
      <div v-if="submitting" class="vo-overlay">
        <div class="vo-overlay__card">
          <div class="vo-overlay__spinner"></div>
          <p class="vo-overlay__title">Submitting for verification</p>
          <p class="vo-overlay__sub">Please wait, do not close this page</p>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useVendorApi } from "@/composables/apis/useVendorApi";
import { useOnboardingStore } from "@/stores/onboading";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const emit = defineEmits(["submitted"]);

const {
  businessType, fetchCompliance, vendorCompliance, complianceInitVendor,
  uploadDoc, onboadingVendor, updateVendor
} = useOnboadingApi();
const { getVendor } = useVendorApi();
const auth = useAuthStore();
const Onboarding = useOnboardingStore();
const { businessTypeList } = storeToRefs(Onboarding);
const router = useRouter();

// ── State ──────────────────────────────────────────────────────────
const step = ref(1);
const loading = ref(false);
const submitting = ref(false);
const selectedBusinessType = ref(null);
const complianceResponse = ref(null);
const complianceList = ref([]);
const docStep = ref(0);
const activeCategory = ref(null);
const activeDocType = ref(null);
const docUploads = reactive({});
const snackbar = reactive({ show: false, message: "", color: "success" });

const steps = [
  { key: "btype",     label: "Business Type" },
  { key: "documents", label: "Verification Docs" },
];

// ── Business Type Rules ────────────────────────────────────────────
const BUSINESS_TYPE_RULES = computed(() => {
  const rules = {};
  complianceList.value.forEach(bt => {
    const hasPartnerDocs = (bt.categories || []).some(c => c.category === 'PARTNER_DOCS');
    rules[bt.type] = { partners: hasPartnerDocs ? 2 : 0 };
  });
  return rules;
});

// ── Required Docs ──────────────────────────────────────────────────
const requiredDocs = computed(() => {
  if (!complianceResponse.value?.categories) return [];
  return complianceResponse.value.categories.map(cat => {
    const uploadedCount = (cat.documents || []).filter(d => d.uploaded).length;
    const isStore = cat.category === 'STORE_IMAGE';
    const required = isStore ? cat.documents.length : 1;
    const uploaded = uploadedCount;
    const compliant = isStore ? uploadedCount === cat.documents.length : uploadedCount > 0;
    return { category: cat.category, documents: cat.documents, required, uploaded, compliant };
  });
});

const isComplianceComplete = computed(() => requiredDocs.value.length > 0 && requiredDocs.value.every(cat => cat.compliant));

// ── Doc Rules ──────────────────────────────────────────────────────
const DOC_RULES = {
  DEFAULT: { label: "Document Number", images: 1, requiresNumber: false },
  AADHAAR: { label: "Aadhaar Number", images: 2, requiresNumber: true },
  INDIVIDUAL_PAN: { label: "PAN Number", images: 1, requiresNumber: false, formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } } },
  PARTNER1_INDIVIDUAL_PAN: { label: "PAN Number", images: 1, requiresNumber: false, formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } } },
  PARTNER2_INDIVIDUAL_PAN: { label: "PAN Number", images: 1, requiresNumber: false, formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } } },
  BANK_PASSBOOK: { label: "Bank Account Number", images: 1, requiresNumber: false, formSchema: { settlement: { accountHolderName: "", account_type: "", bankName: "", accountNumber: "", ifsc: "", consent: "Y", additionalData: true } } },
  DRIVING_LICENSE: { label: "Driving License Number", images: 1, requiresNumber: true },
  VOTER_ID: { label: "Voter ID Number", images: 1, requiresNumber: true },
  PASSPORT: { label: "Passport Number", images: 1, requiresNumber: true },
};

const activeDocRule = computed(() => DOC_RULES[activeDocType.value] || DOC_RULES.DEFAULT);
const showDocNumber = computed(() => activeDocRule.value.requiresNumber);
const docNumberLabel = computed(() => activeDocRule.value.label);
const requiredImageCount = computed(() => activeDocRule.value.images);

// ── Save button validation — all fields must be filled ─────────────
const canSaveDoc = computed(() => {
  const doc = docUploads[activeDocType.value];
  if (!doc) return false;

  if (!doc.files?.length || doc.files.length < requiredImageCount.value) return false;

  const type = activeDocType.value;

  if (['INDIVIDUAL_PAN', 'PARTNER1_INDIVIDUAL_PAN', 'PARTNER2_INDIVIDUAL_PAN'].includes(type)) {
    const p = doc.pan;
    if (!p) return false;
    const panValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test((p.pan || '').toUpperCase().trim());
    if (!panValid) return false;
    if (!p.pan_name?.trim()) return false;
    if (!p.pan_father_name?.trim()) return false;
    if (!p.pan_dob) return false;
    return true;
  }

  if (type === 'BANK_PASSBOOK') {
    const s = doc.settlement;
    if (!s) return false;
    if (!s.accountHolderName?.trim()) return false;
    if (!s.accountNumber?.trim()) return false;
    if (!/^\d{11,}$/.test(s.accountNumber?.trim())) return false;
    if (!s.bankName?.trim()) return false;
    if (!s.ifsc?.trim() || s.ifsc.trim().length < 11) return false;
    if (!s.account_type) return false;
    return true;
  }

  if (activeDocRule.value.requiresNumber) {
    if (!doc.docNumber?.trim()) return false;
  }

  return true;
});

const showDocErrors = computed(() => {
  const doc = docUploads[activeDocType.value];
  return !!(doc?.files?.length);
});

// ── Helpers ────────────────────────────────────────────────────────
function showSnack(message, color = "success") {
  snackbar.message = message; snackbar.color = color; snackbar.show = true;
  setTimeout(() => snackbar.show = false, 4000);
}

function openCategory(group) { activeCategory.value = group; docStep.value = 1; }

function openDocUpload(doc) {
  activeDocType.value = doc; docStep.value = 2;
  const rule = DOC_RULES[doc];
  docUploads[doc] = {
    files: [], docNumber: '', imageIds: [],
    ...(rule?.formSchema ? JSON.parse(JSON.stringify(rule.formSchema)) : {})
  };
}

function handleFileChange(e) {
  const files = Array.from(e.target.files);
  if (docUploads[activeDocType.value]) docUploads[activeDocType.value].files = files;
}

function prevStep() { if (step.value > 1) step.value--; }

async function saveDocUpload() {
  if (!canSaveDoc.value) {
    showSnack("Please complete all required fields before saving", "error");
    return;
  }

  if (activeDocType.value === 'AADHAAR') {
    const num = docUploads[activeDocType.value]?.docNumber?.trim();
    if (!/^\d{12}$/.test(num)) {
      showSnack("Aadhaar number must be exactly 12 digits", "error"); return;
    }
  }

  if (activeDocType.value === 'DRIVING_LICENSE') {
    const num = docUploads[activeDocType.value]?.docNumber?.trim();
    if (!/^[A-Z]{2}\d{2}\s?\d{4}\d{7}$/.test(num.toUpperCase())) {
      showSnack("Enter a valid Driving License number (e.g. TN0120240012345)", "error"); return;
    }
  }

  if (activeDocType.value === 'VOTER_ID') {
    const num = docUploads[activeDocType.value]?.docNumber?.trim();
    if (!/^[A-Z]{3}\d{7}$/.test(num.toUpperCase())) {
      showSnack("Enter a valid Voter ID (e.g. ABC1234567)", "error"); return;
    }
  }

  if (activeDocType.value === 'PASSPORT') {
    const num = docUploads[activeDocType.value]?.docNumber?.trim();
    if (!/^[A-Z]\d{7}$/.test(num.toUpperCase())) {
      showSnack("Enter a valid Passport number (e.g. A1234567)", "error"); return;
    }
  }

  const doc = docUploads[activeDocType.value];
  const rule = DOC_RULES[activeDocType.value] || DOC_RULES.DEFAULT;
  if (!rule.requiresNumber) doc.docNumber = `${activeDocType.value}_${Date.now()}`;
  doc.imageIds = [];
  for (const file of doc.files) {
    const res = await uploadDoc(file, { filename: `${activeDocType.value}_${file.name}` });
    if (res?.data?.statusCode === "00") doc.imageIds.push(res.data.data.id);
  }
  const payload = buildDocPayload(doc, doc.imageIds, activeDocType.value);
  const res = await complianceInitVendor(payload, auth.vendor?.id);
  if (res?.data?.statusCode === "00") {
    const status = await vendorCompliance(auth.vendor.id);
    if (status?.data?.statusCode === "00") complianceResponse.value = status.data;
  }
  showSnack("Document uploaded successfully", "success");
  docStep.value = 0;
}

function buildDocPayload(doc, imageIds, docType) {
  if (docType === 'BANK_PASSBOOK') return { doc_type: docType, doc_number: doc.settlement.accountNumber, settlement: { ...doc.settlement }, images: imageIds };
  if (['INDIVIDUAL_PAN', 'PARTNER1_INDIVIDUAL_PAN', 'PARTNER2_INDIVIDUAL_PAN'].includes(docType)) return { doc_type: docType, doc_number: doc.pan.pan, pan: { ...doc.pan }, images: imageIds };
  return { doc_type: docType, doc_number: doc.docNumber, images: imageIds };
}

const next = async () => {
  loading.value = true;
  try {
    if (step.value === 1) {
      if (!selectedBusinessType.value) { showSnack("Please select a business type", "error"); return; }
      const res = await updateVendor({ businessTypeCode: selectedBusinessType.value, vendorId: auth.vendor?.id });
      if (res?.statusCode === "00") {
        const status = await vendorCompliance(auth.vendor.id);
        if (status.data?.statusCode === "00") { complianceResponse.value = status.data; showSnack(status.message, "success"); }
        else { showSnack(status?.message || "Compliance fetch failed", "error"); return; }
      } else { showSnack(res?.message || "Failed to update business type", "error"); return; }
    }
    if (step.value < steps.length) step.value++;
  } finally { loading.value = false; }
};

async function submit() {
  submitting.value = true;
  try {
    const res = await onboadingVendor(auth.vendor?.id);
    if (res?.data?.statusCode === "00") {
      showSnack("KYC submitted for verification!", "success");
      emit("submitted");
      setTimeout(() => router.push("/vendor/dashboard"), 1500);
    } else showSnack(res?.data?.message || "Submission failed", "error");
  } catch (e) { showSnack("An error occurred", "error"); }
  finally { submitting.value = false; }
}

onMounted(async () => {
  if (!auth.vendor) {
    try { await getVendor(); } catch (e) { console.error(e); }
  }
  try { await businessType(); } catch (e) { console.error(e); }
  try {
    const comp = await fetchCompliance();
    complianceList.value = comp || [];
  } catch (e) { console.error("fetchCompliance failed", e); }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

/* ── RESET ──────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

/* ── ROOT ───────────────────────────────────────────────────────── */
.vo-root {
  display: flex;
  flex-direction: column;
  font-family: 'DM Sans', sans-serif;
}

/* ── HEADER — light card-style, matches dashboard page headers ──── */
.vo-header {
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
}

.vo-header__brand { display: flex; align-items: center; gap: 0.75rem; min-width: 0; }

.vo-header__icon {
  width: 2.375rem;
  height: 2.375rem;
  background: #1142d4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.15rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(17,66,212,.25);
}

.vo-header__text { min-width: 0; }

.vo-header__title {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vo-header__sub {
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vo-header__right { flex-shrink: 0; }

.vo-header__step-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #1142d4;
  background: #eef2ff;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;
  border: 1px solid #d7e0fb;
}

/* ── PROGRESS STRIP ─────────────────────────────────────────────── */
.vo-progress-strip {
  height: 3px;
  background: #e8edf3;
  border-radius: 3px;
  margin-bottom: 18px;
  overflow: hidden;
}

.vo-progress-strip__fill {
  height: 100%;
  background: linear-gradient(90deg, #1142d4, #1a52f5);
  transition: width 0.5s ease;
}

/* ── MAIN ───────────────────────────────────────────────────────── */
.vo-main {
  flex: 1;
  display: flex;
  justify-content: center;
}

.vo-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── MAIN FORM CARD ─────────────────────────────────────────────── */
.vo-card {
  background: #ffffff;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
}

/* ── CARD HEAD ──────────────────────────────────────────────────── */
.vo-card__head {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.375rem 1.375rem 0;
  margin-bottom: 1.125rem;
}

@media (min-width: 640px) { .vo-card__head { padding: 1.625rem 1.75rem 0; } }

.vo-card-icon-wrap {
  width: 2.625rem;
  height: 2.625rem;
  background: #1142d4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(17,66,212,.25);
}

.vo-card__heading {
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}

@media (min-width: 640px) { .vo-card__heading { font-size: 1.125rem; } }

.vo-card__desc {
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 0.2rem;
  line-height: 1.5;
}

/* ── CARD BODY ──────────────────────────────────────────────────── */
.vo-card__body {
  padding: 0 1.375rem 1.375rem;
}

@media (min-width: 640px) { .vo-card__body { padding: 0 1.75rem 1.75rem; } }

/* ── GRIDS ──────────────────────────────────────────────────────── */
.vo-grid {
  display: grid;
  gap: 0.75rem;
}

.vo-grid--2 { grid-template-columns: 1fr; }
@media (min-width: 480px) { .vo-grid--2 { grid-template-columns: repeat(2, 1fr); } }

/* ── FIELD ──────────────────────────────────────────────────────── */
.vo-field-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.vo-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 0.1rem;
}

.vo-input-box {
  display: flex;
  align-items: center;
  position: relative;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.vo-input-box:focus-within {
  border-color: #1142d4;
  box-shadow: 0 0 0 3px rgba(17,66,212,.1);
}

.vo-input-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.9375rem;
  color: #94a3b8;
  pointer-events: none;
  flex-shrink: 0;
  transition: color 0.2s;
}

.vo-input-box:focus-within .vo-input-icon { color: #1142d4; }

.vo-input {
  flex: 1;
  padding: 0.625rem 0.75rem 0.625rem 2.25rem;
  font-size: 0.8125rem;
  color: #1e293b;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  min-width: 0;
}

.vo-input::placeholder { color: #94a3b8; }

.vo-select {
  appearance: none;
  cursor: pointer;
}

/* ── ADDRESS/SECTION SUB-TITLE ─────────────────────────────────── */
.vo-address-sub-title {
  font-size: 0.65rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

/* ── BUSINESS TYPE GRID ─────────────────────────────────────────── */
.vo-btype-grid {
  display: grid;
  gap: 0.625rem;
  grid-template-columns: 1fr;
  margin-bottom: 1rem;
}

@media (min-width: 460px) { .vo-btype-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 720px) { .vo-btype-grid { grid-template-columns: repeat(3, 1fr); } }

.vo-btype-card {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.vo-btype-card:hover {
  border-color: #1142d4;
  background: #f5f8ff;
}

.vo-btype-card--selected {
  border-color: #1142d4;
  background: #eef2ff;
  box-shadow: 0 0 0 2px rgba(17,66,212,.1);
}

.vo-btype-radio {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.vo-btype-card--selected .vo-btype-radio { border-color: #1142d4; }

.vo-btype-radio-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: transparent;
  transition: background 0.2s;
}

.vo-btype-radio-dot--on { background: #1142d4; }

.vo-btype-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1142d4;
  font-size: 1rem;
  flex-shrink: 0;
}

.vo-btype-body { flex: 1; min-width: 0; }
.vo-btype-name { font-size: 0.8125rem; font-weight: 700; color: #0f172a; }
.vo-btype-hint { font-size: 0.7rem; color: #64748b; margin-top: 0.15rem; }

.vo-btype-check {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.9rem;
  color: #1142d4;
}

/* ── ALERTS ─────────────────────────────────────────────────────── */
.vo-info-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #eef2ff;
  border: 1px solid #d7e0fb;
  border-radius: 10px;
  padding: 0.75rem 0.875rem;
}

.vo-info-alert__icon { font-size: 0.9375rem; color: #1142d4; flex-shrink: 0; margin-top: 1px; }
.vo-info-alert__text { font-size: 0.8125rem; color: #1e3a8a; line-height: 1.5; }

.vo-warn-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #fffbeb;
  border: 1px solid #fde9b8;
  border-radius: 10px;
  padding: 0.75rem 0.875rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.5;
}

.vo-warn-alert__icon { font-size: 0.9375rem; color: #d97706; flex-shrink: 0; margin-top: 1px; }

.vo-success-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #ecfdf5;
  border: 1px solid #bbf0d3;
  border-radius: 10px;
  padding: 0.75rem 0.875rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #15803d;
  line-height: 1.5;
}

.vo-success-alert__icon { font-size: 0.9375rem; color: #22c55e; flex-shrink: 0; margin-top: 1px; }

/* ── DOC GRID ───────────────────────────────────────────────────── */
.vo-doc-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 600px) { .vo-doc-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 860px) { .vo-doc-grid { grid-template-columns: repeat(4, 1fr); } }

.vo-doc-card {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.vo-doc-card:hover { border-color: #1142d4; transform: translateY(-1px); }

.vo-doc-card--done {
  border-color: rgba(34,197,94,0.4);
  background: #ecfdf5;
}

.vo-doc-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;
}

.vo-doc-card__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.vo-doc-card__icon--done { background: rgba(34,197,94,0.15); color: #22c55e; }
.vo-doc-card__icon--pending { background: #eef2ff; color: #1142d4; }

.vo-doc-card__count {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}

.vo-doc-card__count--done { background: rgba(34,197,94,0.15); color: #15803d; }
.vo-doc-card__count--pending { background: #eef2ff; color: #1142d4; }

.vo-doc-card__name {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #0f172a;
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.vo-doc-progress {
  height: 3px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.vo-doc-progress__fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
.vo-doc-progress__fill--done { background: #22c55e; }
.vo-doc-progress__fill--active { background: #1142d4; }

.vo-doc-card__cta { font-size: 0.65rem; color: #94a3b8; }

/* ── DOC TYPE GRID ──────────────────────────────────────────────── */
.vo-doctype-grid {
  display: grid;
  gap: 0.625rem;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 0.75rem;
}

@media (min-width: 560px) { .vo-doctype-grid { grid-template-columns: repeat(3, 1fr); } }

.vo-doctype-card {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.375rem;
}

.vo-doctype-card--done {
  border-color: rgba(34,197,94,0.4);
  background: #ecfdf5;
}

.vo-doctype-card--locked {
  border-color: #e2e8f0;
  background: #f1f5f9;
  opacity: 0.72;
}

.vo-doctype-card__icon--locked { color: #94a3b8; }

.vo-doctype-card__icon { font-size: 1.5rem; }
.vo-doctype-card--done .vo-doctype-card__icon { color: #22c55e; }
.vo-doctype-card--pending .vo-doctype-card__icon { color: #f59e0b; }

.vo-doctype-card__name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f172a;
}

.vo-doctype-card__status {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.vo-doctype-card__status--done { background: rgba(34,197,94,0.15); color: #15803d; }
.vo-doctype-card__status--pending { background: rgba(245,158,11,0.12); color: #b45309; }
.vo-doctype-card__status--locked { background: #eef2ff; color: #64748b; }

.vo-doctype-card__btn {
  margin-top: auto;
  padding: 0.375rem 0.875rem;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-family: inherit;
  background: #1142d4;
  color: #fff;
  transition: all 0.15s;
}

.vo-doctype-card__btn:disabled { opacity: 0.45; cursor: not-allowed; }
.vo-doctype-card__btn:not(:disabled):hover { background: #0e35a8; }

/* ── BACK BUTTON ────────────────────────────────────────────────── */
.vo-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.vo-back-btn:hover { background: #eef2ff; border-color: #1142d4; color: #1142d4; }

/* ── UPLOAD CARD ────────────────────────────────────────────────── */
.vo-upload-card {
  background: #f8fafc;
  border: 1px solid #e8edf3;
  border-radius: 10px;
  padding: 1.25rem;
}

.vo-upload-zone {
  border: 2px dashed #e2e8f0;
  border-radius: 10px;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  background: #fff;
  transition: border-color 0.2s;
}

.vo-upload-zone:hover { border-color: #1142d4; }

.vo-upload-zone__icon { font-size: 2.25rem; color: #94a3b8; }
.vo-upload-zone__label { font-size: 0.875rem; font-weight: 600; color: #0f172a; }
.vo-upload-zone__sub { font-size: 0.75rem; color: #94a3b8; }
.vo-upload-zone__count { font-size: 0.75rem; font-weight: 700; color: #1142d4; }

.vo-upload-zone__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.25rem;
  background: #eef2ff;
  border: 1.5px solid #d7e0fb;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1142d4;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.vo-upload-zone__btn:hover { background: #e0e9fe; }

.vo-upload-zone__input { position: absolute; opacity: 0; width: 0; height: 0; }

.vo-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(17,66,212,.28);
  transition: filter 0.15s, box-shadow 0.15s;
}

.vo-save-btn:hover:not(:disabled) { filter: brightness(1.07); box-shadow: 0 6px 18px rgba(17,66,212,.34); }
.vo-save-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

/* ── CARD FOOTER ────────────────────────────────────────────────── */
.vo-card-footer {
  background: #f8fafc;
  border-top: 1px solid #e8edf3;
  padding: 1rem 1.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 600px) {
  .vo-card-footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.75rem;
  }
}

.vo-footer-terms {
  font-size: 0.75rem;
  color: #94a3b8;
}

.vo-footer-actions {
  display: flex;
  gap: 0.625rem;
  width: 100%;
}

@media (min-width: 600px) { .vo-footer-actions { width: auto; } }

.vo-btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.625rem 1.25rem;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
  white-space: nowrap;
}

@media (min-width: 600px) { .vo-btn-secondary { flex: none; } }

.vo-btn-secondary:hover {
  background: #f1f5f9;
  border-color: #1142d4;
  color: #1142d4;
}

.vo-btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.625rem 1.75rem;
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%);
  border: none;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(17,66,212,.28);
  transition: filter 0.18s, transform 0.1s, box-shadow 0.18s;
  white-space: nowrap;
}

@media (min-width: 600px) { .vo-btn-primary { flex: none; } }

.vo-btn-primary:hover:not(:disabled) { filter: brightness(1.07); box-shadow: 0 6px 18px rgba(17,66,212,.34); }
.vo-btn-primary:active { transform: scale(0.98); }
.vo-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

/* ── SPINNER ────────────────────────────────────────────────────── */
.vo-spinner {
  width: 0.9375rem;
  height: 0.9375rem;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── SNACKBAR ───────────────────────────────────────────────────── */
.vo-snackbar {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.125rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 9999;
  max-width: calc(100vw - 2.5rem);
}

.vo-snackbar--success { background: #0f172a; }
.vo-snackbar--error { background: #ef4444; }

.vo-snackbar__close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-size: 1rem;
  margin-left: auto;
  flex-shrink: 0;
}

.snack-enter-active, .snack-leave-active { transition: all 0.3s ease; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translateY(-12px); }

/* ── PROCESSING OVERLAY ─────────────────────────────────────────── */
.vo-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  backdrop-filter: blur(4px);
}

.vo-overlay__card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem 3rem;
  text-align: center;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
}

.vo-overlay__spinner {
  width: 2.75rem;
  height: 2.75rem;
  border: 3px solid #eef2ff;
  border-top-color: #1142d4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.25rem;
}

.vo-overlay__title { font-size: 1rem; font-weight: 700; color: #0f172a; }
.vo-overlay__sub { font-size: 0.75rem; color: #64748b; margin-top: 0.375rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── SPACING UTILITIES ──────────────────────────────────────────── */
.vo-mt { margin-top: 1rem; }
.vo-mt-sm { margin-top: 0.75rem; }

/* ── FIELD VALIDATION ───────────────────────────────────────────── */
.vo-input-box--error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.vo-input-box--error .vo-input-icon { color: #ef4444 !important; }

.vo-field-error {
  font-size: 0.65rem;
  font-weight: 600;
  color: #ef4444;
  padding-left: 0.1rem;
  margin-top: -0.1rem;
}

.vo-doc-validation-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #fffbeb;
  border: 1px solid #fde9b8;
  border-radius: 9px;
  font-size: 0.78rem;
  color: #92400e;
  font-weight: 500;
  margin-top: 0.875rem;
}

.vo-doc-validation-hint .mdi { font-size: 0.9375rem; color: #d97706; flex-shrink: 0; }
</style>
