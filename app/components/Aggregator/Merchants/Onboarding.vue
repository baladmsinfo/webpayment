<template>
  <div class="onb-root">

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

      <div v-if="selectedSvc ? selectedSvc.status !== 'PENDING' : merchant.mstatus === 'ONBOARDED'" class="onb-alert onb-alert--success">
        <span class="mdi mdi-check-circle-outline"></span>
        <template v-if="selectedSvc">This {{ selectedSvc.service }} / {{ selectedSvc.interface }} service is already {{ selectedSvc.status }}.</template>
        <template v-else>This merchant has already been onboarded with ISG.</template>
      </div>

      <!-- ── Service KYC Detail — the granular checks for the selected row ── -->
      <div class="onb-card" v-if="selectedSvc">
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

      <!-- ── Business Identity ── -->
      <div class="onb-card">
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

      <!-- ── PAN ── -->
      <div class="onb-card">
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

      <!-- ── Settlement Account ── -->
      <div class="onb-card">
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

      <!-- ── Address ── -->
      <div class="onb-card">
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

      <!-- ── Documents ── -->
      <div class="onb-card">
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

      <!-- ── Submission Panel ── -->
      <div class="onb-card onb-submit-card"
        v-if="selectedSvc ? selectedSvc.status === 'PENDING' : merchant.mstatus !== 'ONBOARDED'">
        <template v-if="!submitResult">
          <div class="onb-card-head">
            <span class="mdi mdi-rocket-launch-outline"></span>
            <h3>{{ selectedSvc ? `Submit for ${selectedSvc.service} Onboarding` : 'Submit for ISG Onboarding' }}</h3>
          </div>
          <p class="onb-submit-desc">
            <template v-if="selectedSvc">
              Review the merchant details above, then confirm {{ selectedSvc.service }} onboarding via {{ selectedSvc.interface }}.
            </template>
            <template v-else>
              Review the merchant details above, then submit to ISG for UPI onboarding.
            </template>
          </p>

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

          <button class="onb-submit-btn" :disabled="submitting" @click="submitOnboarding">
            <span v-if="submitting" class="onb-btn-spinner"></span>
            <template v-else><span class="mdi mdi-send-outline"></span> Confirm &amp; Onboard</template>
          </button>
        </template>

        <template v-else>
          <div class="onb-success">
            <span class="mdi mdi-check-decagram onb-success-icon"></span>
            <h3>Onboarding Submitted!</h3>
            <p v-if="isIsgUpi">The merchant has been submitted to ISG and is now marked as onboarded.</p>
            <p v-else-if="selectedSvc">
              {{ selectedSvc.service }} via {{ selectedSvc.interface }} has been submitted and is now Under Review.
            </p>
            <p v-else>The merchant has been submitted to ISG and is now marked as onboarded.</p>
            <div class="onb-result-chips" v-if="submitResult.tid || submitResult.vpa || submitResult.appID">
              <div v-if="submitResult.tid" class="onb-result-chip"><label>Terminal ID</label><span>{{ submitResult.tid }}</span></div>
              <div v-if="submitResult.vpa" class="onb-result-chip"><label>UPI VPA</label><span>{{ submitResult.vpa }}</span></div>
              <div v-if="submitResult.appID" class="onb-result-chip"><label>App ID</label><span>{{ submitResult.appID }}</span></div>
            </div>
            <button class="onb-submit-btn" @click="goBack">
              <span class="mdi mdi-arrow-left"></span> Back to Merchant
            </button>
          </div>
        </template>
      </div>

    </template>

    <div v-else class="onb-loading">
      <p>Merchant not found.</p>
    </div>

    <div v-if="toast.show" :class="['onb-toast', 'onb-toast--' + toast.type]">
      <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
      {{ toast.message }}
    </div>

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

const props = defineProps({
  merchantId: { type: String, required: true },
  // The specific MerchantServiceKyc row id clicked from the KYC & Services
  // list — determines which service/interface this review is confirming.
  // Optional for backward compatibility with old links that only had
  // merchantId (falls back to the legacy ISG-only flow below).
  serviceKycId: { type: String, default: null },
});

const router = useRouter();
const { getMerchantById, submitServiceKyc } = useAggregatorApi();
const { isgSubmitOnboarding } = useIsgOnboardingApi();

const merchant = ref(null);
const loading = ref(true);

const selectedSvc = computed(() =>
  merchant.value?.merchantservicekyc?.find(s => s.id === props.serviceKycId) || null
);

// The only service/interface pair with a real provider integration today —
// everything else goes through the generic "mark under review" confirm.
const isIsgUpi = computed(() => selectedSvc.value?.service === 'UPI' && selectedSvc.value?.interface === 'ISG');

const SERVICE_ICONS = {
  AEPS: "mdi-fingerprint", DMT: "mdi-bank-transfer", UPI: "mdi-qrcode",
  BBPS: "mdi-receipt-text-outline", MATM: "mdi-atm", POS: "mdi-point-of-sale",
};
const serviceIcon = (service) => SERVICE_ICONS[service] || "mdi-apps";

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

const submitOnboarding = async () => {
  submitError.value = "";
  missingDocuments.value = [];
  submitting.value = true;
  try {
    // Legacy links with no serviceKycId, or an explicitly-selected ISG/UPI
    // row, go through the real ISG provider integration (the only service
    // with one today).
    if (!props.serviceKycId || isIsgUpi.value) {
      const res = await isgSubmitOnboarding({ merchantId: props.merchantId });
      if (res?.statusCode === "00" && res?.data) {
        submitResult.value = res.data;
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
      return;
    }

    // Every other service/interface — generic aggregator manual-review confirm.
    const res = await submitServiceKyc(props.serviceKycId);
    if (res?.statusCode === "00") {
      submitResult.value = { service: selectedSvc.value?.service, interface: selectedSvc.value?.interface };
      showToast(res?.message || "Service KYC submitted for review");
      if (selectedSvc.value) selectedSvc.value.status = "UNDER_REVIEW";
    } else {
      submitError.value = res?.message || "Submission failed. Please retry.";
    }
  } catch (err) {
    submitError.value = "An error occurred during submission.";
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchMerchant);
</script>

<style scoped>
.onb-root { max-width: 1000px; margin: 0 auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
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
.onb-dialog-hdr { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.onb-dialog-hdr-actions { display: flex; align-items: center; gap: 8px; }
.onb-dialog-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0; }
.onb-dialog-sub { font-size: 12px; color: #64748b; margin: 2px 0 0; }
.onb-dialog-body { padding: 20px; overflow-y: auto; flex: 1; }
.onb-dialog-body--img { padding: 8px; }
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

.onb-submit-card { text-align: center; }
.onb-submit-desc { color: #64748b; font-size: 13px; margin: 0 0 14px; }
.onb-submit-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 10px; border: none; background: #1142d4; color: #fff; cursor: pointer; margin-top: 8px; }
.onb-submit-btn:hover { background: #0d34a8; }
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
}
</style>
