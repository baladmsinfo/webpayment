<template>
  <div class="onb-root" :class="{ 'onb-root--has-fixed-bar': showSubmitBar && !submitResult }">

    <!-- ── Loading ── -->
    <div v-if="loading" class="onb-loading">
      <div class="onb-spinner"></div>
      <p>Loading merchant details…</p>
    </div>

    <template v-else-if="merchant">

      <!-- ── Header ── -->
      <div class="onb-header">
        <button class="onb-back-btn" @click="goBack">
          <span class="mdi mdi-arrow-left"></span> Back
        </button>
        <div class="onb-header-info">
          <h1 class="onb-title">{{ merchant.dba_name || merchant.business_name || merchant.legal_name || 'Merchant' }}</h1>
          <div class="onb-header-meta">
            <span class="onb-mid mono">{{ merchant.mid }}</span>
            <span :class="['onb-pill', mstatusPillClass(merchant.mstatus)]">{{ merchant.mstatus }}</span>
          </div>
        </div>
      </div>

      <!-- ── Onboarding Target — the specific service/interface row clicked ── -->
      <div v-if="selectedSvc" class="onb-target">
        <div class="onb-target__icon"><span class="mdi" :class="serviceIcon(selectedSvc.service)"></span></div>
        <div class="onb-target__info">
          <p class="onb-target__label">Onboarding</p>
          <p class="onb-target__name">{{ selectedSvc.service }} <span class="onb-target__via">via</span> {{ selectedSvc.interface }}</p>
        </div>
        <span :class="['onb-pill', docStatusPillClass(selectedSvc.status)]">{{ selectedSvc.status || 'PENDING' }}</span>
      </div>

      <!-- Not actionable right now — already past review (PENDING/SUBMITTED are both handled by the fixed submit bar) -->
      <div v-if="!showSubmitBar && !submitResult" class="onb-alert onb-alert--success">
        <span class="mdi mdi-check-circle-outline"></span>
        <template v-if="selectedSvc">
          This {{ selectedSvc.service }} / {{ selectedSvc.interface }} service is already {{ selectedSvc.status }}.
        </template>
        <template v-else>
          This merchant has already been onboarded.
        </template>
      </div>

      <!-- ── Tabs ── -->
      <div class="onb-tabs">
        <button v-for="t in tabs" :key="t.key" class="onb-tab" :class="{ 'onb-tab--active': activeTab === t.key }"
          @click="activeTab = t.key">
          <span class="mdi" :class="t.icon"></span>
          {{ t.label }}
          <span v-if="t.count !== undefined" class="onb-tab__count">{{ t.count }}</span>
        </button>
      </div>

      <!-- ── Tab: Service KYC Detail ── -->
      <div class="onb-card" v-if="activeTab === 'kyc' && selectedSvc">
        <div class="onb-card-head">
          <span class="mdi mdi-shield-search-outline"></span>
          <h3>{{ selectedSvc.service }} KYC Detail</h3>
        </div>
        <div class="onb-grid">
          <div class="onb-field"><label>Risk Level</label><p><span :class="['onb-pill onb-pill--sm', riskPillClass(selectedSvc.riskLevel)]">{{ selectedSvc.riskLevel || '—' }}</span></p></div>
          <div class="onb-field"><label>Risk Score</label><p class="mono">{{ selectedSvc.riskScore ?? '—' }}</p></div>
          <div class="onb-field"><label>AML Flag</label><p>{{ selectedSvc.amlFlag ? 'Flagged' : 'Clear' }}</p></div>
          <div class="onb-field"><label>Sanction Match</label><p>{{ selectedSvc.sanctionMatch ? 'Match' : 'None' }}</p></div>
          <div class="onb-field"><label>PAN Status</label><p><span :class="['onb-pill onb-pill--sm', docStatusPillClass(selectedSvc.pan_status)]">{{ selectedSvc.pan_status || '—' }}</span></p></div>
          <div class="onb-field"><label>Aadhaar Status</label><p><span :class="['onb-pill onb-pill--sm', docStatusPillClass(selectedSvc.aadhaar_status)]">{{ selectedSvc.aadhaar_status || '—' }}</span></p></div>
          <div class="onb-field"><label>Bank Status</label><p><span :class="['onb-pill onb-pill--sm', docStatusPillClass(selectedSvc.bank_status)]">{{ selectedSvc.bank_status || '—' }}</span></p></div>
          <div class="onb-field"><label>GST Status</label><p><span :class="['onb-pill onb-pill--sm', docStatusPillClass(selectedSvc.gst_status)]">{{ selectedSvc.gst_status || '—' }}</span></p></div>
          <div class="onb-field"><label>Store Image</label><p><span :class="['onb-pill onb-pill--sm', docStatusPillClass(selectedSvc.store_img_status)]">{{ selectedSvc.store_img_status || '—' }}</span></p></div>
          <div class="onb-field"><label>OTP Verified</label><p>{{ selectedSvc.otpStatus ? 'Yes' : 'No' }}</p></div>
          <div class="onb-field"><label>Biometric Required</label><p>{{ selectedSvc.biometricRequired ? 'Yes' : 'No' }}</p></div>
          <div class="onb-field"><label>Physical Verification</label><p>{{ selectedSvc.physicalVerificationRequired ? 'Required' : 'Not Required' }}</p></div>
        </div>
      </div>

      <!-- ── Tab: Business Identity ── -->
      <div class="onb-card" v-if="activeTab === 'identity'">
        <div class="onb-card-head">
          <span class="mdi mdi-domain"></span>
          <h3>Business Identity</h3>
        </div>
        <div class="onb-grid">
          <div class="onb-field"><label>Legal Name</label><p>{{ merchant.legal_name || '—' }}</p></div>
          <div class="onb-field"><label>Business Name</label><p>{{ merchant.business_name || '—' }}</p></div>
          <div class="onb-field"><label>DBA Name</label><p>{{ merchant.dba_name || '—' }}</p></div>
          <div class="onb-field"><label>Business Type</label><p>{{ merchant.businesstype?.type || '—' }}</p></div>
          <div class="onb-field"><label>Nature of Business</label><p>{{ merchant.merchantinfo?.nature_of_business || '—' }}</p></div>
          <div class="onb-field"><label>Annual Turnover</label><p>{{ merchant.merchantinfo?.annual_turn_over || '—' }}</p></div>
          <div class="onb-field"><label>Primary Mobile</label><p>{{ merchant.merchantinfo?.primary_mobile || '—' }}</p></div>
          <div class="onb-field"><label>Primary Email</label><p>{{ merchant.merchantinfo?.primary_email_id || '—' }}</p></div>
        </div>
      </div>

      <!-- ── Tab: PAN ── -->
      <div class="onb-card" v-if="activeTab === 'pan'">
        <div class="onb-card-head">
          <span class="mdi mdi-card-account-details-outline"></span>
          <h3>PAN Information</h3>
        </div>
        <div v-if="merchant.merchantpan?.length" class="onb-table-scroll">
          <table class="onb-table">
            <thead><tr><th>PAN</th><th>Name</th><th>Father Name</th><th>DOB</th></tr></thead>
            <tbody>
              <tr v-for="pan in merchant.merchantpan" :key="pan.id">
                <td class="mono">{{ pan.pan || '—' }}</td>
                <td>{{ pan.pan_name || '—' }}</td>
                <td>{{ pan.pan_father_name || '—' }}</td>
                <td>{{ fmtDate(pan.pan_dob) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="onb-empty">No PAN record found.</p>
      </div>

      <!-- ── Tab: Bank Account ── -->
      <div class="onb-card" v-if="activeTab === 'bank'">
        <div class="onb-card-head">
          <span class="mdi mdi-bank-outline"></span>
          <h3>Settlement Account</h3>
        </div>
        <div v-if="merchant.settlementaccount" class="onb-grid">
          <div class="onb-field"><label>Account Holder</label><p>{{ merchant.settlementaccount.account_holder_name || '—' }}</p></div>
          <div class="onb-field"><label>Bank Name</label><p>{{ merchant.settlementaccount.bank_name || '—' }}</p></div>
          <div class="onb-field"><label>Account No</label><p class="mono">{{ merchant.settlementaccount.bank_account_no || '—' }}</p></div>
          <div class="onb-field"><label>IFSC Code</label><p class="mono">{{ merchant.settlementaccount.bank_ifsc_code || '—' }}</p></div>
          <div class="onb-field"><label>Branch</label><p>{{ merchant.settlementaccount.branch_name || '—' }}</p></div>
          <div class="onb-field"><label>City</label><p>{{ merchant.settlementaccount.city || '—' }}</p></div>
        </div>
        <p v-else class="onb-empty">No settlement account on file.</p>
      </div>

      <!-- ── Tab: Address ── -->
      <div class="onb-card" v-if="activeTab === 'address'">
        <div class="onb-card-head">
          <span class="mdi mdi-map-marker-outline"></span>
          <h3>Address</h3>
        </div>
        <div v-if="merchant.address" class="onb-addr-grid">
          <div class="onb-addr-card">
            <p class="onb-addr-label">Official</p>
            <p class="onb-addr-main">{{ merchant.address.official_address || '—' }}</p>
            <p class="onb-addr-line">{{ [merchant.address.address1, merchant.address.address2, merchant.address.address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
            <p class="onb-addr-city">{{ merchant.address.city }}, {{ merchant.address.state }} – {{ merchant.address.pincode }}</p>
          </div>
          <div class="onb-addr-card">
            <p class="onb-addr-label">Residential</p>
            <p class="onb-addr-main">{{ merchant.address.residential_address || '—' }}</p>
            <p class="onb-addr-line">{{ [merchant.address.res_address1, merchant.address.res_address2, merchant.address.res_address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
            <p class="onb-addr-city">{{ merchant.address.res_city }}, {{ merchant.address.res_state }} – {{ merchant.address.res_pincode }}</p>
          </div>
          <div class="onb-addr-card">
            <p class="onb-addr-label">Visitor / Shop</p>
            <p class="onb-addr-main">{{ merchant.address.vister_address || '—' }}</p>
            <p class="onb-addr-line">{{ [merchant.address.v_address1, merchant.address.v_address2, merchant.address.v_address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
            <p class="onb-addr-city">{{ merchant.address.v_city }}, {{ merchant.address.v_state }} – {{ merchant.address.v_pincode }}</p>
          </div>
        </div>
        <p v-else class="onb-empty">No address information available.</p>
      </div>

      <!-- ── Tab: Documents ── -->
      <div class="onb-card" v-if="activeTab === 'documents'">
        <div class="onb-card-head">
          <span class="mdi mdi-file-document-outline"></span>
          <h3>Documents</h3>
          <span class="onb-count-chip">{{ merchant.documents?.length || 0 }}</span>
        </div>
        <div v-if="merchant.documents?.length" class="onb-doc-grid">
          <div class="onb-doc-item onb-doc-item--clickable" v-for="doc in merchant.documents" :key="doc.id" @click="openDoc(doc)">
            <div class="onb-doc-top">
              <span class="onb-doc-name">{{ doc.doc_name || doc.doc_type || '—' }}</span>
              <span :class="['onb-pill onb-pill--sm', docStatusPillClass(doc.doc_status)]">{{ doc.doc_status || 'PENDING' }}</span>
            </div>
            <p class="onb-doc-num mono">{{ doc.doc_number || '—' }}</p>
            <p class="onb-doc-count"><span class="mdi mdi-image-multiple-outline"></span> {{ doc.images?.length || 0 }} image(s)</p>
            <p class="onb-doc-view"><span class="mdi mdi-eye-outline"></span> View document</p>
          </div>
        </div>
        <p v-else class="onb-empty">No documents uploaded.</p>
      </div>

      <!-- ── Missing documents / submission error (inline, above the fixed bar) ── -->
      <div v-if="missingDocuments.length" class="onb-alert onb-alert--warn">
        <span class="mdi mdi-alert-outline"></span>
        <div>
          <p style="margin:0 0 4px;font-weight:700;">Missing mandatory documents</p>
          <ul style="margin:0;padding-left:18px;">
            <li v-for="(d, i) in missingDocuments" :key="i">{{ d.name || d.category || d }}</li>
          </ul>
        </div>
      </div>
      <div v-if="submitError" class="onb-alert onb-alert--danger">
        <span class="mdi mdi-close-circle-outline"></span>
        {{ submitError }}
      </div>

      <!-- ── Submission result ── -->
      <div class="onb-card onb-submit-card" v-if="submitResult">
        <div class="onb-success">
          <span class="mdi mdi-check-decagram onb-success-icon"></span>
          <h3>Onboarding Submitted!</h3>
          <p v-if="submitResult.provider === 'ISG'">The merchant has been submitted to ISG and is now marked as onboarded.</p>
          <p v-else-if="submitResult.provider === 'EASEBUZZ'">The merchant has been submitted to Easebuzz as a sub-merchant.</p>
          <p v-else>{{ submitResult.message }}</p>
          <div class="onb-result-chips" v-if="submitResult.tid || submitResult.vpa || submitResult.appID">
            <div v-if="submitResult.tid" class="onb-result-chip"><label>Terminal ID</label><span>{{ submitResult.tid }}</span></div>
            <div v-if="submitResult.vpa" class="onb-result-chip"><label>UPI VPA</label><span>{{ submitResult.vpa }}</span></div>
            <div v-if="submitResult.appID" class="onb-result-chip"><label>App ID</label><span>{{ submitResult.appID }}</span></div>
          </div>
          <button class="onb-submit-btn" @click="goBack">
            <span class="mdi mdi-arrow-left"></span> Back to Merchant
          </button>
        </div>
      </div>

    </template>

    <div v-else class="onb-loading">
      <p>Merchant not found.</p>
    </div>

    <div v-if="toast.show" :class="['onb-toast', 'onb-toast--' + toast.type]">
      <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
      {{ toast.message }}
    </div>

    <!-- ── Fixed bottom action bar ── -->
    <div v-if="showSubmitBar && !submitResult" class="onb-fixed-bar">
      <div class="onb-fixed-bar__inner">
        <button class="onb-fixed-submit-btn" :disabled="submitting" @click="providerMenuOpen = !providerMenuOpen">
          <span v-if="submitting" class="onb-btn-spinner"></span>
          <template v-else><span class="mdi mdi-send-outline"></span> Submit Merchant &amp; Proceed Onboard</template>
        </button>
      </div>
    </div>

    <!-- ── Provider choice popover ── -->
    <Teleport to="body">
      <div v-if="providerMenuOpen" class="onb-menu-backdrop" @click="providerMenuOpen = false"></div>
      <Transition name="onb-dialog-fade">
        <div v-if="providerMenuOpen" class="onb-provider-menu">
          <p class="onb-provider-menu__label">Choose onboarding provider</p>
          <button class="onb-provider-menu__item" @click="chooseProvider('ISG')">
            <span class="mdi mdi-qrcode"></span>
            <span>
              <strong>Onboard to ISG</strong>
              <small>Real-time ISG UPI onboarding</small>
            </span>
          </button>
          <button class="onb-provider-menu__item" @click="chooseProvider('EASEBUZZ')">
            <span class="mdi mdi-bank-transfer"></span>
            <span>
              <strong>Onboard to EASEBUZZ</strong>
              <small>Create a sub-merchant via Easebuzz</small>
            </span>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Easebuzz — collect the fields Bucksbox doesn't track ── -->
    <Teleport to="body">
      <Transition name="onb-dialog-fade">
        <div v-if="easebuzzModal.open" class="onb-dialog-overlay" @click.self="easebuzzModal.open = false">
          <div class="onb-dialog onb-dialog--form">
            <div class="onb-dialog-hdr">
              <div>
                <p class="onb-dialog-title">Complete Easebuzz Details</p>
                <p class="onb-dialog-sub">Everything else is pulled from the merchant's existing record.</p>
              </div>
              <button class="onb-icon-close" @click="easebuzzModal.open = false"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="onb-dialog-body">
              <div v-if="easebuzzFormError" class="onb-alert onb-alert--danger" style="margin-bottom:14px;">
                <span class="mdi mdi-close-circle-outline"></span> {{ easebuzzFormError }}
              </div>
              <div class="onb-form-field">
                <label>Category Code (MCC) <span class="onb-req">*</span></label>
                <select v-model="easebuzzForm.category_code">
                  <option value="" disabled>Select category code</option>
                  <option v-for="opt in EASEBUZZ_CATEGORY_CODES" :key="opt.code" :value="opt.code">{{ opt.code }} — {{ opt.label }}</option>
                </select>
              </div>
              <div class="onb-form-field">
                <label>Business Type Code <span class="onb-req">*</span></label>
                <select v-model="easebuzzForm.business_type_code">
                  <option value="" disabled>Select business type code</option>
                  <option v-for="opt in EASEBUZZ_BUSINESS_TYPE_CODES" :key="opt.code" :value="opt.code">{{ opt.code }} — {{ opt.label }}</option>
                </select>
              </div>
              <div class="onb-form-field">
                <label>Entity Type <span class="onb-req">*</span></label>
                <select v-model="easebuzzForm.entity_type">
                  <option value="" disabled>Select entity type</option>
                  <option v-for="opt in EASEBUZZ_ENTITY_TYPES" :key="opt.code" :value="opt.code">{{ opt.code }} — {{ opt.label }}</option>
                </select>
              </div>
              <div class="onb-form-field">
                <label>GSTIN <span class="onb-optional">(optional)</span></label>
                <input v-model.trim="easebuzzForm.gstin" placeholder="GST number" />
              </div>
              <div class="onb-form-field">
                <label>Primary VPA <span class="onb-optional">(optional)</span></label>
                <input v-model.trim="easebuzzForm.primary_vpa" placeholder="merchant@upi" />
              </div>
            </div>
            <div class="onb-dialog-footer">
              <button class="onb-btn-ghost" @click="easebuzzModal.open = false">Cancel</button>
              <button class="onb-submit-btn" :disabled="submitting" @click="confirmEasebuzzSubmit">
                <span v-if="submitting" class="onb-btn-spinner"></span>
                {{ submitting ? 'Submitting…' : 'Confirm & Submit to Easebuzz' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Document Viewer ── -->
    <Teleport to="body">
      <Transition name="onb-dialog-fade">
        <div v-if="docDialog" class="onb-dialog-overlay" @click.self="docDialog = false">
          <div class="onb-dialog">
            <div class="onb-dialog-hdr">
              <div>
                <p class="onb-dialog-title">{{ selectedDoc?.doc_name || selectedDoc?.doc_type || 'Document' }}</p>
                <p class="onb-dialog-sub">{{ selectedDoc?.doc_type }}</p>
              </div>
              <div class="onb-dialog-hdr-actions">
                <span :class="['onb-pill onb-pill--sm', docStatusPillClass(selectedDoc?.doc_status)]">{{ selectedDoc?.doc_status || 'PENDING' }}</span>
                <button class="onb-icon-close" @click="docDialog = false"><span class="mdi mdi-close"></span></button>
              </div>
            </div>
            <div class="onb-dialog-body" v-if="selectedDoc">
              <div class="onb-grid" style="margin-bottom:16px;">
                <div class="onb-field"><label>Doc Number</label><p class="mono">{{ selectedDoc.doc_number || '—' }}</p></div>
                <div class="onb-field"><label>Verified By</label><p>{{ selectedDoc.doc_verified_by || '—' }}</p></div>
                <div class="onb-field"><label>Result</label><p><span :class="['onb-pill onb-pill--sm', selectedDoc.doc_verified_result ? 'onb-pill--emerald' : 'onb-pill--amber']">{{ selectedDoc.doc_verified_result ? 'Verified' : 'Pending' }}</span></p></div>
              </div>
              <p class="onb-dialog-section-lbl">Document Images</p>
              <div class="onb-doc-img-grid" v-if="selectedDoc.images?.length">
                <template v-for="img in selectedDoc.images" :key="img.id">
                  <img v-if="!isPdfDoc(img)" :src="img.url" class="onb-doc-img-thumb" @click="openDocImage(img)" />
                  <div v-else class="onb-doc-pdf-thumb" @click="openDocImage(img)">
                    <span class="mdi mdi-file-pdf-box"></span>
                    <span>View PDF</span>
                  </div>
                </template>
              </div>
              <p v-else class="onb-empty">No images uploaded for this document.</p>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="onb-dialog-fade">
        <div v-if="imgPreview" class="onb-dialog-overlay" @click.self="imgPreview = false">
          <div class="onb-dialog onb-dialog--img">
            <div class="onb-dialog-hdr">
              <p class="onb-dialog-title">Image Preview</p>
              <button class="onb-icon-close" @click="imgPreview = false"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="onb-dialog-body onb-dialog-body--img"><img :src="previewUrl" class="onb-img-preview" /></div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { useIsgOnboardingApi } from "~/composables/apis/Useisgonboardingapi";
import { useEasebuzzApi } from "~/composables/apis/useEasebuzzApi";

const props = defineProps({
  merchantId: { type: String, required: true },
  // The specific MerchantServiceKyc row id clicked from the KYC & Services
  // list — determines which service/interface this review is confirming.
  // Optional for backward compatibility with old links that only had
  // merchantId (falls back to the legacy ISG-only flow below).
  serviceKycId: { type: String, default: null },
});

const router = useRouter();
const { getMerchantById } = useAggregatorApi();
const { isgSubmitOnboarding } = useIsgOnboardingApi();
const { createEasebuzzSubMerchant } = useEasebuzzApi();

const merchant = ref(null);
const loading = ref(true);

const selectedSvc = computed(() =>
  merchant.value?.merchantservicekyc?.find(s => s.id === props.serviceKycId) || null
);

// The submit action (fixed bottom bar) is actionable while this service is
// still PENDING (nothing submitted yet — the aggregator can push it through
// directly) or once it's been SUBMITTED for review — same gate as the
// "Onboard" button on Merchants/View.vue that brought the aggregator here.
const showSubmitBar = computed(() =>
  selectedSvc.value
    ? selectedSvc.value.status === 'PENDING' || selectedSvc.value.status === 'SUBMITTED'
    : merchant.value?.mstatus !== 'ONBOARDED'
);

const SERVICE_ICONS = {
  AEPS: "mdi-fingerprint", DMT: "mdi-bank-transfer", UPI: "mdi-qrcode",
  BBPS: "mdi-receipt-text-outline", MATM: "mdi-atm", POS: "mdi-point-of-sale",
};
const serviceIcon = (service) => SERVICE_ICONS[service] || "mdi-apps";

// ── Tabs ──────────────────────────────────────────────────────────
const activeTab = ref('identity');
const tabs = computed(() => {
  const list = [];
  if (selectedSvc.value) list.push({ key: 'kyc', label: `${selectedSvc.value.service} KYC`, icon: 'mdi-shield-search-outline' });
  list.push({ key: 'identity', label: 'Business Identity', icon: 'mdi-domain' });
  list.push({ key: 'pan', label: 'PAN', icon: 'mdi-card-account-details-outline' });
  list.push({ key: 'bank', label: 'Bank', icon: 'mdi-bank-outline' });
  list.push({ key: 'address', label: 'Address', icon: 'mdi-map-marker-outline' });
  list.push({ key: 'documents', label: 'Documents', icon: 'mdi-file-document-outline', count: merchant.value?.documents?.length || 0 });
  return list;
});

const submitting = ref(false);
const submitResult = ref(null);
const submitError = ref("");
const missingDocuments = ref([]);

const docDialog = ref(false);
const selectedDoc = ref(null);
const imgPreview = ref(false);
const previewUrl = ref(null);
const openDoc = (doc) => { selectedDoc.value = doc; docDialog.value = true; };
const openPreview = (url) => { previewUrl.value = url; imgPreview.value = true; };

const isPdfDoc = (img) => {
  if (!img) return false;
  if (img.mimetype) return img.mimetype === 'application/pdf';
  return /\.pdf(\?|$)/i.test(img.url || img.filename || '');
};
const openDocImage = (img) => {
  if (isPdfDoc(img)) window.open(img.url, '_blank', 'noopener');
  else openPreview(img.url);
};

const toast = reactive({ show: false, type: "success", message: "" });
let toastTimer = null;
const showToast = (message, type = "success") => {
  clearTimeout(toastTimer);
  toast.message = message;
  toast.type = type;
  toast.show = true;
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const mstatusPillClass = (s) => {
  if (['APPROVED', 'ONBOARDED', 'ACTIVE'].includes(s)) return 'onb-pill--emerald';
  if (['SUSPENDED', 'BLOCKED'].includes(s)) return 'onb-pill--red';
  if (['SUBMITTED', 'UNDER_REVIEW'].includes(s)) return 'onb-pill--sky';
  return 'onb-pill--amber';
};

const docStatusPillClass = (s) => {
  if (['VERIFIED', 'APPROVED'].includes(s)) return 'onb-pill--emerald';
  if (['REJECTED', 'FAILED'].includes(s)) return 'onb-pill--red';
  return 'onb-pill--amber';
};

const riskPillClass = (s) => {
  if (s === 'LOW') return 'onb-pill--emerald';
  if (s === 'MEDIUM') return 'onb-pill--amber';
  if (s === 'HIGH') return 'onb-pill--red';
  return 'onb-pill--amber';
};

const goBack = () => router.push(`/aggregator/merchants/view/${props.merchantId}`);

const fetchMerchant = async () => {
  loading.value = true;
  try {
    // getMerchantById() resolves to the raw backend body
    // { statusCode, merchantInfoExists, message, data: {...merchant} } — the
    // actual merchant fields live under `.data`, same as View.vue's fetch.
    const res = await getMerchantById(props.merchantId);
    merchant.value = res?.data || null;
  } catch {
    merchant.value = null;
  } finally {
    loading.value = false;
  }
};

// ── Provider choice (fixed bar → popover) ───────────────────────────
const providerMenuOpen = ref(false);

function chooseProvider(provider) {
  providerMenuOpen.value = false;
  submitError.value = "";
  missingDocuments.value = [];
  if (provider === 'ISG') submitToIsg();
  else if (provider === 'EASEBUZZ') openEasebuzzModal();
}

async function submitToIsg() {
  submitting.value = true;
  try {
    const res = await isgSubmitOnboarding({ merchantId: props.merchantId });
    if (res?.statusCode === "00" && res?.data) {
      submitResult.value = { provider: 'ISG', ...res.data };
      showToast(res?.message || "ISG onboarding submitted successfully!");
      if (merchant.value) merchant.value.mstatus = "ONBOARDED";
      if (selectedSvc.value) selectedSvc.value.status = "VERIFIED";
    } else if (res?.missingDocuments) {
      missingDocuments.value = res.missingDocuments;
      submitError.value = res?.message || "Missing mandatory documents";
    } else if (res?.compliantStaus) {
      submitError.value = `Merchant KYC is not fully verified yet (status: ${res.compliantStaus}). Complete PAN, bank, OTP and Aadhaar verification before onboarding.`;
    } else {
      submitError.value = res?.message || "Submission failed. Please retry.";
    }
  } catch (err) {
    submitError.value = "An error occurred during submission.";
  } finally {
    submitting.value = false;
  }
}

// ── Easebuzz — real Create Sub-Merchant call ────────────────────────
// Most fields come straight from the merchant record already loaded on this
// page. category_code / business_type_code / entity_type aren't tracked in
// Bucksbox at all (they're Easebuzz-specific classification codes), so
// they're collected here rather than invented.
const easebuzzModal = reactive({ open: false });
const easebuzzForm = reactive({ category_code: "", business_type_code: "", entity_type: "", gstin: "", primary_vpa: "" });
const easebuzzFormError = ref("");

// Easebuzz's fixed classification code lists (per their onboarding docs) —
// shown as selects instead of free text so the aggregator can't submit a
// code Easebuzz doesn't recognise.
const EASEBUZZ_BUSINESS_TYPE_CODES = [
  { code: "3", label: "Companies registered under AcT" },
  { code: "4", label: "Govt / Govt Undertakings" },
  { code: "1", label: "Individual- HUF" },
  { code: "42", label: "Individuals / Professionals" },
  { code: "45", label: "LLPs" },
  { code: "2", label: "Partnership" },
  { code: "41", label: "Proprietor" },
  { code: "44", label: "Regd Trusts" },
];

const EASEBUZZ_ENTITY_TYPES = [
  { code: "0", label: "Individual/Freelancers" },
  { code: "4", label: "Society/Trust - Education" },
  { code: "5", label: "HUF Hindu Undivided Family" },
  { code: "7", label: "Limited Liability Partnership" },
  { code: "9", label: "Partnership Firm" },
  { code: "10", label: "Sole Proprietor" },
  { code: "11", label: "Private Ltd/Public Ltd/OPC" },
  { code: "12", label: "Trust/NGO - Donations" },
  { code: "13", label: "Government Entity" },
  { code: "14", label: "Co-operative Credit Society/JV/AOP" },
];

const EASEBUZZ_CATEGORY_CODES = [
  { code: "0742", label: "Veterinary services" },
  { code: "0743", label: "Wine producers" },
  { code: "0744", label: "Champagne producers" },
  { code: "0763", label: "Agricultural co-operatives" },
  { code: "0780", label: "Landscaping and horticultural services" },
  { code: "0820", label: "Fertilizer Dealers" },
  { code: "0821", label: "Pesticides / Insecticides" },
  { code: "0822", label: "Seeds" },
  { code: "0823", label: "Farm Equipment" },
  { code: "0824", label: "Agricultural Machinery" },
  { code: "0825", label: "Other Agri Inputs" },
  { code: "1520", label: "General contractors residential and commercial" },
  { code: "1711", label: "Heating, plumbing and air-conditioning contractors" },
  { code: "1731", label: "Electrical contractors" },
  { code: "1740", label: "Masonry, stonework, tile setting, plastering and insulation contractors" },
  { code: "1750", label: "Carpentry contractors" },
  { code: "1761", label: "Roofing, siding and sheet metal work contractors" },
  { code: "1771", label: "Concrete work contractors" },
  { code: "1799", label: "Special trade contractors not elsewhere classified" },
  { code: "2791", label: "Typesetting, platemaking and related services" },
  { code: "2842", label: "Speciality cleaning, polishing and sanitation preparations" },
  { code: "3020", label: "AIR-INDIA" },
  { code: "4011", label: "Railroads" },
  { code: "4111", label: "Local and suburban commuter passenger transportation, including ferries" },
  { code: "4112", label: "Passenger railways" },
  { code: "4119", label: "Ambulance services" },
  { code: "4121", label: "Taxi-cabs and limousines" },
  { code: "4131", label: "Bus lines" },
  { code: "4214", label: "Motor freight carriers and trucking local and long distance, moving and storage companies and local delivery" },
  { code: "4215", label: "Courier services air and ground and freight forwarders" },
  { code: "4225", label: "Public warehousing and storage farm products, refrigerated goods and household goods" },
  { code: "4411", label: "Steamships and cruise lines" },
  { code: "4457", label: "Boat rentals and leasing" },
  { code: "4468", label: "Marinas, marine service and supplies" },
  { code: "4511", label: "Airlines and air carriers" },
  { code: "4582", label: "Airports, flying fields and airport terminals" },
  { code: "4722", label: "Travel agencies and tour operators" },
  { code: "4784", label: "Tolls and bridge fees" },
  { code: "4789", label: "Transportation services not elsewhere classified" },
  { code: "4812", label: "Telecommunication equipment and telephone sales" },
  { code: "4814", label: "Telecommunication services, including local and long distance calls, credit card calls, calls through use of magnetic stripe reading telephones and faxes" },
  { code: "4816", label: "Computer network/information services" },
  { code: "4829", label: "Wire transfers and money orders" },
  { code: "4899", label: "Cable and other pay television services" },
  { code: "4900", label: "Utilities electric, gas, water and sanitary" },
  { code: "5013", label: "Motor vehicle supplies and new parts" },
  { code: "5021", label: "Office and commercial furniture" },
  { code: "5039", label: "Construction materials not elsewhere classified" },
  { code: "5044", label: "Office, photographic, photocopy and microfilm equipment" },
  { code: "5045", label: "Computers, computer peripheral equipment not elsewhere classified" },
  { code: "5046", label: "Commercial equipment not elsewhere classified" },
  { code: "5047", label: "Dental/laboratory/medical/ophthalmic hospital equipment and supplies" },
  { code: "5051", label: "Metal service centres and offices" },
  { code: "5065", label: "Electrical parts and equipment" },
  { code: "5072", label: "Hardware equipment and supplies" },
  { code: "5074", label: "Plumbing and heating equipment and supplies" },
  { code: "5085", label: "Industrial supplies not elsewhere classified" },
  { code: "5094", label: "Precious stones and metals, watches and jewellery" },
  { code: "5099", label: "Durable goods not elsewhere classified" },
  { code: "5111", label: "Stationery, office supplies and printing and writing paper" },
  { code: "5122", label: "Drugs, drug proprietors" },
  { code: "5131", label: "Piece goods, notions and other dry goods" },
  { code: "5137", label: "Mens, womens and childrens uniforms and commercial clothing" },
  { code: "5139", label: "Commercial footwear" },
  { code: "5169", label: "Chemicals and allied products not elsewhere classified" },
  { code: "5172", label: "Petroleum and petroleum products" },
  { code: "5192", label: "Books, periodicals and newspapers" },
  { code: "5193", label: "Florists supplies, nursery stock and flowers" },
  { code: "5198", label: "Paints, varnishes and supplies" },
  { code: "5199", label: "Non-durable goods not elsewhere classified" },
  { code: "5200", label: "Home supply warehouse outlets" },
  { code: "5211", label: "Lumber and building materials outlets" },
  { code: "5231", label: "Glass, paint and wallpaper shops" },
  { code: "5251", label: "Hardware shops" },
  { code: "5261", label: "Lawn and garden supply outlets, including nurseries" },
  { code: "5271", label: "Mobile home dealers" },
  { code: "5300", label: "Wholesale clubs" },
  { code: "5309", label: "Duty-free shops" },
  { code: "5310", label: "Discount shops" },
  { code: "5311", label: "Department stores" },
  { code: "5331", label: "Variety stores" },
  { code: "5411", label: "Groceries and supermarkets" },
  { code: "5422", label: "Freezer and locker meat provisioners" },
  { code: "5441", label: "Candy, nut and confectionery shops" },
  { code: "5451", label: "Dairies" },
  { code: "5462", label: "Bakeries" },
  { code: "5511", label: "Car and truck dealers (new and used) sales, services, repairs, parts and leasing" },
  { code: "5521", label: "Car and truck dealers (used only) sales, service, repairs, parts and leasing" },
  { code: "5531", label: "Auto and home supply outlets" },
  { code: "5532", label: "Automotive tyre outlets" },
  { code: "5533", label: "Automotive parts and accessories outlets" },
  { code: "5541", label: "Service stations (with or without ancillary services)" },
  { code: "5542", label: "Automated fuel dispensers" },
  { code: "5551", label: "Boat dealers" },
  { code: "5561", label: "Camper, recreational and utility trailer dealers" },
  { code: "5571", label: "Motorcycle shops and dealers" },
  { code: "5592", label: "Motor home dealers" },
  { code: "5598", label: "Snowmobile dealers" },
  { code: "5611", label: "Mens and boys clothing and accessory shops" },
  { code: "5621", label: "Womens ready-to-wear shops" },
  { code: "5631", label: "Womens accessory and speciality shops" },
  { code: "5641", label: "Childrens and infants wear shops" },
  { code: "5651", label: "Family clothing shops" },
  { code: "5655", label: "Sports and riding apparel shops" },
  { code: "5661", label: "Shoe shops" },
  { code: "5681", label: "Furriers and fur shops" },
  { code: "5691", label: "Mens and womens clothing shops" },
  { code: "5697", label: "Tailors, seamstresses, mending and alterations" },
  { code: "5698", label: "Wig and toupee shops" },
  { code: "5712", label: "Furniture, home furnishings and equipment shops and manufacturers, except appliances" },
  { code: "5713", label: "Floor covering services" },
  { code: "5714", label: "Drapery, window covering and upholstery shops" },
  { code: "5715", label: "Alcoholic beverage wholesalers" },
  { code: "5718", label: "Fireplaces, fireplace screens and accessories shops" },
  { code: "5722", label: "Household appliance shops" },
  { code: "5732", label: "Electronics shops" },
  { code: "5733", label: "Music shops musical instruments, pianos and sheet music" },
  { code: "5734", label: "Computer software outlets" },
  { code: "5735", label: "Record shops" },
  { code: "5811", label: "Caterers" },
  { code: "5812", label: "Eating places and restaurants" },
  { code: "5813", label: "Drinking places (alcoholic beverages) bars, taverns, night-clubs, cocktail lounges and discothques" },
  { code: "5814", label: "Fast food restaurants" },
  { code: "5815", label: "Digital Goods: Media, Books, Movies, Music" },
  { code: "5816", label: "Digital Goods: Games" },
  { code: "5817", label: "Digital Goods: Applications (Excludes Games)" },
  { code: "5818", label: "Digital Goods: Large Digital Goods Merchant" },
  { code: "5832", label: "Antique Shops - Sales, Repairs, and Restoration Services" },
  { code: "5912", label: "Drug stores and pharmacies" },
  { code: "5921", label: "Package shops beer, wine and liquor" },
  { code: "5931", label: "Used merchandise and second-hand shops" },
  { code: "5932", label: "Antique shops - sales, repairs and restoration services" },
  { code: "5933", label: "Pawn shops" },
  { code: "5935", label: "Wrecking and salvage yards" },
  { code: "5937", label: "Antique reproduction shops" },
  { code: "5940", label: "Bicycle shops sales and service" },
  { code: "5941", label: "Sporting goods shops" },
  { code: "5942", label: "Bookshops" },
  { code: "5943", label: "Stationery, office and school supply shops" },
  { code: "5944", label: "Jewellery, watch, clock and silverware shops" },
  { code: "5945", label: "Hobby, toy and game shops" },
  { code: "5946", label: "Camera and photographic supply shops" },
  { code: "5947", label: "Gift, card, novelty and souvenir shops" },
  { code: "5948", label: "Luggage and leather goods shops" },
  { code: "5949", label: "Sewing, needlework, fabric and piece goods shops" },
  { code: "5950", label: "Glassware and crystal shops" },
  { code: "5960", label: "Direct marketing - insurance services" },
  { code: "5962", label: "Telemarketing travel-related arrangement services" },
  { code: "5963", label: "Door-to-door sales" },
  { code: "5964", label: "Direct marketing catalogue merchants" },
  { code: "5965", label: "Direct marketing combination catalogue and retail merchants" },
  { code: "5966", label: "Direct marketing outbound telemarketing merchants" },
  { code: "5967", label: "Direct marketing inbound telemarketing merchants" },
  { code: "5968", label: "Direct marketing continuity/subscription merchants" },
  { code: "5969", label: "Direct marketing/direct marketers not elsewhere classified" },
  { code: "5970", label: "Artist supply and craft shops" },
  { code: "5971", label: "Art dealers and galleries" },
  { code: "5972", label: "Stamp and coin shops" },
  { code: "5973", label: "Religious goods and shops" },
  { code: "5975", label: "Hearing aids sales, service and supplies" },
  { code: "5976", label: "Orthopaedic goods and prosthetic devices" },
  { code: "5977", label: "Cosmetic Stores" },
  { code: "5978", label: "Typewriter outlets sales, service and rentals" },
  { code: "5983", label: "Fuel dealers fuel oil, wood, coal and liquefied petroleum" },
  { code: "5992", label: "Florists" },
  { code: "5993", label: "Cigar shops and stands" },
  { code: "5994", label: "Newsagents and news-stands" },
  { code: "5995", label: "Pet shops, pet food and supplies" },
  { code: "5996", label: "Swimming pools sales, supplies and services" },
  { code: "5997", label: "Electric razor outlets sales and service" },
  { code: "5998", label: "Tent and awning shops" },
  { code: "6010", label: "Financial institutions manual cash disbursements" },
  { code: "6011", label: "Financial institutions automated cash disbursements" },
  { code: "6012", label: "Financial institutions merchandise and services" },
  { code: "6051", label: "Non-financial institutions foreign currency, money orders (not wire transfer), scrip and travellers checks" },
  { code: "6211", label: "Securities brokers and dealers" },
  { code: "6300", label: "Insurance sales, underwriting and premiums" },
  { code: "6513", label: "Real Estate Agents and Managers - Rentals" },
  { code: "6529", label: "LIC" },
  { code: "6540", label: "Debit card to wallet credit (Wallet top up)" },
  { code: "7011", label: "Lodging hotels, motels and resorts" },
  { code: "7012", label: "Timeshares" },
  { code: "7032", label: "Sporting and recreational camps" },
  { code: "7033", label: "Trailer parks and camp-sites" },
  { code: "7210", label: "Laundry, cleaning and garment services" },
  { code: "7211", label: "Laundry services family and commercial" },
  { code: "7216", label: "Dry cleaners" },
  { code: "7217", label: "Carpet and upholstery cleaning" },
  { code: "7221", label: "Photographic studios" },
  { code: "7230", label: "Beauty and barber shops" },
  { code: "7251", label: "Shoe repair shops, shoe shine parlours and hat cleaning shops" },
  { code: "7261", label: "Funeral services and crematoriums" },
  { code: "7273", label: "Dating and escort services" },
  { code: "7276", label: "Tax preparation services" },
  { code: "7277", label: "Counselling services debt, marriage and personal" },
  { code: "7278", label: "Buying and shopping services and clubs" },
  { code: "7296", label: "Clothing rentals costumes, uniforms and formal wear" },
  { code: "7297", label: "Massage parlours" },
  { code: "7298", label: "Health and beauty spas" },
  { code: "7311", label: "Advertising services" },
  { code: "7321", label: "Consumer credit reporting agencies" },
  { code: "7322", label: "Debt collection agencies" },
  { code: "7332", label: "Blueprinting and Photocopying Services" },
  { code: "7333", label: "Commercial photography, art and graphics" },
  { code: "7338", label: "Quick copy, reproduction and blueprinting services" },
  { code: "7339", label: "Stenographic and secretarial support services" },
  { code: "7342", label: "Exterminating and disinfecting services" },
  { code: "7349", label: "Cleaning, maintenance and janitorial services" },
  { code: "7361", label: "Employment agencies and temporary help services" },
  { code: "7372", label: "Computer programming, data processing and integrated systems design services" },
  { code: "7375", label: "Information retrieval services" },
  { code: "7379", label: "Computer maintenance and repair services not elsewhere classified" },
  { code: "7392", label: "Management, consulting and public relations services" },
  { code: "7393", label: "Detective agencies, protective agencies and security services, including armoured cars and guard dogs" },
  { code: "7394", label: "Equipment, tool, furniture and appliance rentals and leasing" },
  { code: "7395", label: "Photofinishing laboratories and photo developing" },
  { code: "7399", label: "Business services not elsewhere classified" },
  { code: "7407", label: "P2PM Merchant" },
  { code: "7511", label: "Truck Stop" },
  { code: "7512", label: "Automobile rentals" },
  { code: "7513", label: "Truck and utility trailer rentals" },
  { code: "7519", label: "Motor home and recreational vehicle rentals" },
  { code: "7523", label: "Parking lots and garages" },
  { code: "7531", label: "Automotive body repair shops" },
  { code: "7534", label: "Tyre retreading and repair shops" },
  { code: "7535", label: "Automotive paint shops" },
  { code: "7538", label: "Automotive service shops (non-dealer)" },
  { code: "7542", label: "Car washes" },
  { code: "7549", label: "Towing services" },
  { code: "7622", label: "Electronics repair shops" },
  { code: "7623", label: "Air conditioning and refrigeration repair shops" },
  { code: "7629", label: "Electrical and small appliance repair shops" },
  { code: "7631", label: "Watch, clock and jewellery repair shops" },
  { code: "7641", label: "Furniture reupholstery, repair and refinishing" },
  { code: "7692", label: "Welding services" },
  { code: "7829", label: "Motion picture and video tape production and distribution" },
  { code: "7832", label: "Motion picture theatres" },
  { code: "7841", label: "Video tape rentals" },
  { code: "7911", label: "Dance halls, studios and schools" },
  { code: "7922", label: "Theatrical producers (except motion pictures) and ticket agencies" },
  { code: "7929", label: "Bands, orchestras and miscellaneous entertainers not elsewhere classified" },
  { code: "7932", label: "Billiard and pool establishments" },
  { code: "7933", label: "Bowling alleys" },
  { code: "7941", label: "Commercial sports, professional sports clubs, athletic fields and sports promoters" },
  { code: "7991", label: "Tourist attractions and exhibits" },
  { code: "7992", label: "Public golf courses" },
  { code: "7993", label: "Video amusement game supplies" },
  { code: "7994", label: "Video game arcades and establishments" },
  { code: "7995", label: "Betting, including lottery tickets, casino gaming chips, off-track betting and wagers at race tracks" },
  { code: "7996", label: "Amusement parks, circuses, carnivals and fortune tellers" },
  { code: "7997", label: "Membership clubs (sports, recreation, athletic), country clubs and private golf courses" },
  { code: "7998", label: "Aquariums, seaquariums and dolphinariums" },
  { code: "7999", label: "Recreation services not elsewhere classified" },
  { code: "8011", label: "Doctors and physicians not elsewhere classified" },
  { code: "8021", label: "Dentists and orthodontists" },
  { code: "8031", label: "Osteopaths" },
  { code: "8042", label: "Optometrists and ophthalmologists" },
  { code: "8043", label: "Opticians, optical goods and eyeglasses" },
  { code: "8049", label: "Podiatrists and chiropodists" },
  { code: "8050", label: "Nursing and personal care facilities" },
  { code: "8062", label: "Hospitals" },
  { code: "8071", label: "Medical and dental laboratories" },
  { code: "8099", label: "Medical services and health practitioners not elsewhere classified" },
  { code: "8111", label: "Legal services and attorneys" },
  { code: "8211", label: "Elementary and secondary schools" },
  { code: "8220", label: "Colleges, universities, professional schools and junior colleges" },
  { code: "8241", label: "Correspondence schools" },
  { code: "8244", label: "Business and secretarial schools" },
  { code: "8249", label: "Trade and vocational schools" },
  { code: "8299", label: "Schools and educational services not elsewhere classified" },
  { code: "8351", label: "Child care services" },
  { code: "8398", label: "Charitable and social service organizations" },
  { code: "8641", label: "Civic, social and fraternal associations" },
  { code: "8651", label: "Political organizations" },
  { code: "8661", label: "Religious organizations" },
  { code: "8675", label: "Automobile associations" },
  { code: "8699", label: "Membership organization not elsewhere classified" },
  { code: "8734", label: "Testing laboratories (non-medical)" },
  { code: "8911", label: "Architectural, engineering and surveying services" },
  { code: "8931", label: "Accounting, auditing and bookkeeping services" },
  { code: "8999", label: "Professional services not elsewhere classified" },
  { code: "9211", label: "Court costs, including alimony and child support" },
  { code: "9222", label: "Fines" },
  { code: "9223", label: "Bail and bond payments" },
  { code: "9311", label: "Tax payments" },
  { code: "9399", label: "Government services not elsewhere classified" },
  { code: "9400", label: "PMNRF" },
  { code: "9402", label: "Postal services government only" },
];

function openEasebuzzModal() {
  easebuzzForm.category_code = "";
  easebuzzForm.business_type_code = "";
  easebuzzForm.entity_type = "";
  easebuzzForm.gstin = merchant.value?.merchantgst?.gstin || "";
  easebuzzForm.primary_vpa = "";
  easebuzzFormError.value = "";
  easebuzzModal.open = true;
}

async function confirmEasebuzzSubmit() {
  easebuzzFormError.value = "";
  if (!easebuzzForm.category_code || !easebuzzForm.business_type_code || !easebuzzForm.entity_type) {
    easebuzzFormError.value = "Category code, business type code and entity type are all required.";
    return;
  }
  easebuzzModal.open = false;
  await submitToEasebuzz();
}

async function submitToEasebuzz() {
  submitting.value = true;
  try {
    const m = merchant.value;
    const pan = m?.merchantpan?.[0] || null;
    const settlement = m?.settlementaccount || null;
    const businessAddress = m?.address?.official_address || m?.address?.address1 || "";

    const payload = {
      merchantId: props.merchantId,
      name: m?.legal_name || "",
      name_on_bank: settlement?.account_holder_name || "",
      email: m?.merchantinfo?.primary_email_id || "",
      phone: m?.merchantinfo?.primary_mobile || "",
      business_name: m?.business_name || "",
      state: m?.address?.state || "",
      nature_of_business: m?.merchantinfo?.nature_of_business || "",
      business_address: businessAddress,
      bank_name: settlement?.bank_name || "",
      bank_branch: settlement?.branch_name || "",
      account_number: settlement?.bank_account_no || "",
      account_ifsc: settlement?.bank_ifsc_code || "",
      category_code: easebuzzForm.category_code,
      pan_number: pan?.pan || "",
      business_type_code: easebuzzForm.business_type_code,
      address: businessAddress,
      city: m?.address?.city || "",
      pincode: m?.address?.pincode ? String(m.address.pincode) : "",
      entity_type: easebuzzForm.entity_type,
      gstin: easebuzzForm.gstin || undefined,
      primary_vpa: easebuzzForm.primary_vpa || undefined,
    };

    const res = await createEasebuzzSubMerchant(payload);
    if (res?.statusCode === "00") {
      submitResult.value = { provider: 'EASEBUZZ', message: res.message || "Easebuzz sub-merchant created successfully!", data: res.data };
      showToast(res?.message || "Easebuzz sub-merchant created successfully!");
      if (selectedSvc.value) selectedSvc.value.status = "VERIFIED";
    } else {
      submitError.value = res?.message || "Easebuzz submission failed. Please retry.";
    }
  } catch (err) {
    submitError.value = "An error occurred during submission.";
  } finally {
    submitting.value = false;
  }
}

onMounted(fetchMerchant);
</script>

<style scoped>
.onb-root { max-width: 1000px; margin: 0 auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.onb-root--has-fixed-bar { padding-bottom: 96px; }
.onb-loading { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0; color: #64748b; }
.onb-spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #1142d4; border-radius: 50%; animation: onb-spin .8s linear infinite; }
@keyframes onb-spin { to { transform: rotate(360deg); } }

.onb-header { display: flex; align-items: center; gap: 16px; }
.onb-back-btn { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; color: #334155; }
.onb-back-btn:hover { background: #f8fafc; }
.onb-header-info { display: flex; flex-direction: column; gap: 4px; }
.onb-title { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
.onb-header-meta { display: flex; align-items: center; gap: 8px; }
.onb-mid { font-size: 12px; color: #64748b; }

.onb-card { background: #fff; border: 1px solid #eef1f6; border-radius: 14px; padding: 18px 20px; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
.onb-card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.onb-card-head h3 { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0; }
.onb-card-head .mdi { color: #1142d4; font-size: 18px; }
.onb-count-chip { margin-left: auto; font-size: 11px; font-weight: 700; color: #4338ca; background: #e0e7ff; padding: 2px 8px; border-radius: 6px; }

.onb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px 20px; }
.onb-field label { display: block; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 3px; }
.onb-field p { margin: 0; font-size: 13px; font-weight: 600; color: #0f172a; }
.mono { font-family: 'DM Mono', monospace; }

.onb-table-scroll { overflow-x: auto; }
.onb-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.onb-table th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .4px; color: #94a3b8; padding: 8px 10px; border-bottom: 1px solid #eef1f6; }
.onb-table td { padding: 8px 10px; border-bottom: 1px solid #f5f6fa; color: #0f172a; font-weight: 600; }

.onb-empty { color: #94a3b8; font-size: 13px; margin: 0; }

.onb-doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.onb-doc-item { border: 1px solid #eef1f6; border-radius: 10px; padding: 12px; }
.onb-doc-item--clickable { cursor: pointer; transition: border-color .15s, box-shadow .15s; }
.onb-doc-item--clickable:hover { border-color: #c7d2fe; box-shadow: 0 2px 8px rgba(17,66,212,.08); }
.onb-doc-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px; }
.onb-doc-name { font-size: 12px; font-weight: 700; color: #0f172a; }
.onb-doc-num { font-size: 11px; color: #64748b; margin: 0 0 4px; }
.onb-doc-count { font-size: 11px; color: #94a3b8; margin: 0 0 6px; display: flex; align-items: center; gap: 4px; }
.onb-doc-view { font-size: 11px; color: #1142d4; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 4px; }

.onb-dialog-overlay { position: fixed; inset: 0; z-index: 400; background: rgba(15,23,42,.45); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.onb-dialog { background: #fff; border-radius: 16px; width: 100%; max-width: 760px; box-shadow: 0 24px 64px rgba(0,0,0,.2); overflow: hidden; max-height: 90dvh; display: flex; flex-direction: column; }
.onb-dialog--img { max-width: 600px; }
.onb-dialog--form { max-width: 460px; }
.onb-dialog-hdr { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.onb-dialog-hdr-actions { display: flex; align-items: center; gap: 8px; }
.onb-dialog-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
.onb-dialog-sub { font-size: 12px; color: #64748b; margin: 2px 0 0; }
.onb-dialog-body { padding: 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
.onb-dialog-body--img { padding: 8px; }
.onb-dialog-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid #f1f5f9; flex-shrink: 0; }
.onb-dialog-section-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; margin: 0 0 8px; }
.onb-icon-close { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; cursor: pointer; color: #64748b; font-size: 16px; transition: all .15s; }
.onb-icon-close:hover { background: #f1f5f9; color: #0f172a; }
.onb-doc-img-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.onb-doc-pdf-thumb { width: 100%; aspect-ratio: 4/3; border-radius: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: #fef2f2; border: 1px solid #fee2e2; transition: opacity .13s; }
.onb-doc-pdf-thumb:hover { opacity: .82; }
.onb-doc-pdf-thumb .mdi { font-size: 30px; color: #dc2626; }
.onb-doc-pdf-thumb span:last-child { font-size: 11px; font-weight: 700; color: #b91c1c; }
.onb-doc-img-thumb { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 8px; cursor: pointer; transition: opacity .13s; }
.onb-doc-img-thumb:hover { opacity: .82; }
.onb-img-preview { width: 100%; max-height: 520px; object-fit: contain; border-radius: 8px; }
.onb-dialog-fade-enter-active, .onb-dialog-fade-leave-active { transition: opacity .2s ease; }
.onb-dialog-fade-enter-from, .onb-dialog-fade-leave-to { opacity: 0; }

.onb-pill { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: #fef3c7; color: #b45309; white-space: nowrap; }
.onb-pill--sm { font-size: 10px; padding: 2px 7px; }
.onb-pill--emerald { background: #d1fae5; color: #047857; }
.onb-pill--red { background: #fee2e2; color: #b91c1c; }
.onb-pill--sky { background: #e0f2fe; color: #0369a1; }
.onb-pill--amber { background: #fef3c7; color: #b45309; }

.onb-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; }
.onb-alert--success { background: #d1fae5; color: #047857; }
.onb-alert--warn { background: #fef3c7; color: #92400e; }
.onb-alert--danger { background: #fee2e2; color: #b91c1c; }
.onb-alert .mdi { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

.onb-target { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%); border: 1px solid #e0e7ff; border-radius: 14px; padding: 14px 18px; }
.onb-target__icon { width: 40px; height: 40px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 1px 4px rgba(17,66,212,.12); }
.onb-target__icon .mdi { font-size: 19px; color: #1142d4; }
.onb-target__info { flex: 1; min-width: 0; }
.onb-target__label { font-size: 10px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: .5px; margin: 0 0 2px; }
.onb-target__name { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0; }
.onb-target__via { font-size: 12px; font-weight: 500; color: #94a3b8; }

.onb-addr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.onb-addr-card { border: 1px solid #eef1f6; border-radius: 10px; padding: 12px 14px; }
.onb-addr-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .4px; margin: 0 0 6px; }
.onb-addr-main { font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.onb-addr-line { font-size: 12px; color: #475569; margin: 0 0 3px; line-height: 1.5; }
.onb-addr-city { font-size: 12px; color: #64748b; margin: 0; font-weight: 600; }
@media (max-width: 720px) { .onb-addr-grid { grid-template-columns: 1fr; } }

/* ── Tabs ── */
.onb-tabs { display: flex; gap: 6px; flex-wrap: wrap; border-bottom: 1px solid #eef1f6; padding-bottom: 2px; }
.onb-tab {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 14px; border: none; background: none; cursor: pointer;
  font-size: 12.5px; font-weight: 700; color: #64748b;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: color .15s, border-color .15s;
}
.onb-tab .mdi { font-size: 15px; }
.onb-tab:hover { color: #1142d4; }
.onb-tab--active { color: #1142d4; border-bottom-color: #1142d4; }
.onb-tab__count { font-size: 10px; font-weight: 700; color: #4338ca; background: #e0e7ff; padding: 1px 6px; border-radius: 999px; }

/* ── Fixed bottom action bar ── */
.onb-fixed-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 300;
  background: #fff; border-top: 1px solid #eef1f6;
  box-shadow: 0 -4px 16px rgba(15,23,42,.06);
  padding: 14px 20px; display: flex; justify-content: center;
}
.onb-fixed-bar__inner { width: 100%; max-width: 1000px; display: flex; justify-content: flex-end; }
.onb-fixed-submit-btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 700; padding: 13px 26px; border-radius: 10px;
  border: none; background: #1142d4; color: #fff; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17,66,212,.3);
}
.onb-fixed-submit-btn:hover:not(:disabled) { background: #0d34a8; }
.onb-fixed-submit-btn:disabled { opacity: .6; cursor: not-allowed; }

/* ── Provider choice popover ── */
.onb-menu-backdrop { position: fixed; inset: 0; z-index: 310; background: transparent; }
.onb-provider-menu {
  position: fixed; right: 20px; bottom: 76px; z-index: 320;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15,23,42,.16); padding: 8px; width: 280px;
}
.onb-provider-menu__label { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; padding: 6px 10px; margin: 0; }
.onb-provider-menu__item {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 10px; border: none; background: none; border-radius: 9px;
  cursor: pointer; text-align: left;
}
.onb-provider-menu__item:hover { background: #f8fafc; }
.onb-provider-menu__item .mdi { font-size: 20px; color: #1142d4; flex-shrink: 0; }
.onb-provider-menu__item strong { display: block; font-size: 13px; font-weight: 700; color: #0f172a; }
.onb-provider-menu__item small { display: block; font-size: 11px; color: #94a3b8; margin-top: 1px; }

/* ── Easebuzz form ── */
.onb-form-field { display: flex; flex-direction: column; gap: 5px; }
.onb-form-field label { font-size: 11.5px; font-weight: 700; color: #334155; }
.onb-form-field input, .onb-form-field select {
  border: 1px solid #cbd5e1; border-radius: 8px; padding: 9px 12px;
  font-size: .85rem; color: #0f172a; outline: none; font-family: inherit;
  background: #fff;
}
.onb-form-field select { appearance: auto; cursor: pointer; }
.onb-form-field input:focus, .onb-form-field select:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.1); }
.onb-req { color: #dc2626; }
.onb-optional { font-weight: 400; color: #94a3b8; }
.onb-btn-ghost {
  background: #fff; color: #475569; border: 1px solid #cbd5e1; border-radius: 9px;
  padding: 9px 18px; font-size: .82rem; font-weight: 600; cursor: pointer;
}
.onb-btn-ghost:hover { background: #f8fafc; }

.onb-submit-card { text-align: center; }
.onb-submit-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 10px; border: none; background: #1142d4; color: #fff; cursor: pointer; margin-top: 8px; }
.onb-submit-btn:hover:not(:disabled) { background: #0d34a8; }
.onb-submit-btn:disabled { opacity: .6; cursor: not-allowed; }
.onb-btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: onb-spin .7s linear infinite; }

.onb-success { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 0; }
.onb-success-icon { font-size: 48px; color: #10b981; }
.onb-success h3 { margin: 4px 0 0; font-size: 16px; color: #0f172a; }
.onb-success p { margin: 0; color: #64748b; font-size: 13px; }
.onb-result-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 14px 0; }
.onb-result-chip { display: flex; flex-direction: column; gap: 2px; padding: 8px 14px; border-radius: 10px; background: #f8fafc; border: 1px solid #eef1f6; }
.onb-result-chip label { font-size: 9.5px; text-transform: uppercase; letter-spacing: .4px; color: #94a3b8; font-weight: 700; }
.onb-result-chip span { font-size: 13px; font-weight: 700; color: #0f172a; }

.onb-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; color: #fff; background: #0f172a; box-shadow: 0 8px 24px rgba(0,0,0,.2); z-index: 999; }
.onb-toast--success { background: #059669; }
.onb-toast--error { background: #dc2626; }

@media (max-width: 720px) {
  .onb-grid { grid-template-columns: repeat(2, 1fr); }
  .onb-provider-menu { right: 12px; left: 12px; width: auto; }
}
</style>
