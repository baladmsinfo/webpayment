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

      <div v-if="merchant.mstatus === 'ONBOARDED'" class="onb-alert onb-alert--success">
        <span class="mdi mdi-check-circle-outline"></span>
        This merchant has already been onboarded with ISG.
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

      <!-- ── Documents ── -->
      <div class="onb-card">
        <div class="onb-card-head">
          <span class="mdi mdi-file-document-outline"></span>
          <h3>Documents</h3>
          <span class="onb-count-chip">{{ merchant.documents?.length || 0 }}</span>
        </div>
        <div v-if="merchant.documents?.length" class="onb-doc-grid">
          <div class="onb-doc-item" v-for="doc in merchant.documents" :key="doc.id">
            <div class="onb-doc-top">
              <span class="onb-doc-name">{{ doc.doc_name || doc.doc_type || '—' }}</span>
              <span :class="['onb-pill onb-pill--sm', docStatusPillClass(doc.doc_status)]">{{ doc.doc_status || 'PENDING' }}</span>
            </div>
            <p class="onb-doc-num mono">{{ doc.doc_number || '—' }}</p>
            <p class="onb-doc-count"><span class="mdi mdi-image-multiple-outline"></span> {{ doc.images?.length || 0 }} image(s)</p>
          </div>
        </div>
        <p v-else class="onb-empty">No documents uploaded.</p>
      </div>

      <!-- ── Submission Panel ── -->
      <div class="onb-card onb-submit-card" v-if="merchant.mstatus !== 'ONBOARDED'">
        <template v-if="!submitResult">
          <div class="onb-card-head">
            <span class="mdi mdi-rocket-launch-outline"></span>
            <h3>Submit for ISG Onboarding</h3>
          </div>
          <p class="onb-submit-desc">
            Review the merchant details above, then submit to ISG for UPI onboarding.
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
            <template v-else><span class="mdi mdi-send-outline"></span> Submit Onboarding</template>
          </button>
        </template>

        <template v-else>
          <div class="onb-success">
            <span class="mdi mdi-check-decagram onb-success-icon"></span>
            <h3>Onboarding Submitted!</h3>
            <p>The merchant has been submitted to ISG and is now marked as onboarded.</p>
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

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { useIsgOnboardingApi } from "~/composables/apis/Useisgonboardingapi";

const props = defineProps({ merchantId: { type: String, required: true } });

const router = useRouter();
const { getMerchantById } = useAggregatorApi();
const { isgSubmitOnboarding } = useIsgOnboardingApi();

const merchant = ref(null);
const loading = ref(true);

const submitting = ref(false);
const submitResult = ref(null);
const submitError = ref("");
const missingDocuments = ref([]);

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

const goBack = () => router.push(`/aggregator/merchants/view/${props.merchantId}`);

const fetchMerchant = async () => {
  loading.value = true;
  try {
    merchant.value = await getMerchantById(props.merchantId);
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
    const res = await isgSubmitOnboarding({ merchantId: props.merchantId });
    if (res?.statusCode === "00" && res?.data) {
      submitResult.value = res.data;
      showToast(res?.message || "ISG onboarding submitted successfully!");
      if (merchant.value) merchant.value.mstatus = "ONBOARDED";
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
.onb-doc-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px; }
.onb-doc-name { font-size: 12px; font-weight: 700; color: #0f172a; }
.onb-doc-num { font-size: 11px; color: #64748b; margin: 0 0 4px; }
.onb-doc-count { font-size: 11px; color: #94a3b8; margin: 0; display: flex; align-items: center; gap: 4px; }

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
