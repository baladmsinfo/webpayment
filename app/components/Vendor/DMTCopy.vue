<template>
  <div class="merchant-root">

    <!-- ── Header ── -->
    <header class="merchant-header">
      <div class="header-brand">
        <div class="brand-icon">
          <span class="mdi mdi-wallet-outline"></span>
        </div>
        <h2 class="brand-title">DMT Onboarding</h2>
      </div>
      <div class="header-right">
        <div class="step-badge">
          <span class="mdi mdi-progress-check"></span>
          Step {{ step }} / {{ steps.length }}
        </div>
      </div>
    </header>

    <!-- ── Main ── -->
    <main class="merchant-main">
      <div class="content-wrapper">

        <!-- ── Stepper Card ── -->
        <div class="stepper-card">
          <div class="stepper-header">
            <div>
              <h3 class="stepper-title">Onboarding Progress</h3>
              <p class="stepper-subtitle">Step {{ step }} of {{ steps.length }}: {{ stepSubtitles[step - 1] }}</p>
            </div>
            <div class="active-badge">ACTIVE</div>
          </div>

          <div class="stepper-track">
            <div class="track-bg"></div>
            <div class="track-fill" :style="{ width: ((step - 1) / (steps.length - 1) * 100) + '%' }"></div>
            <div v-for="(s, i) in steps" :key="s.key" class="step-node">
              <div class="step-circle" :class="{
                'step-active': step === i + 1,
                'step-done':   step > i + 1,
                'step-pending':step < i + 1
              }">
                <span v-if="step > i + 1" class="mdi mdi-check step-icon"></span>
                <span v-else class="mdi step-icon" :class="s.icon"></span>
              </div>
              <span class="step-label" :class="{ 'step-label-active': step === i + 1 }">{{ s.label }}</span>
            </div>
          </div>
        </div>

        <!-- ── Main Card ── -->
        <div class="main-card">

          <!-- ════ STEP 1 — Verify Merchant Details ════ -->
          <template v-if="step === 1">
            <div class="card-body step1-body">

              <!-- Loading skeleton -->
              <template v-if="fetchingMerchant">
                <div class="skeleton-wrap">
                  <div class="skeleton-title"></div>
                  <div class="skeleton-row" v-for="n in 6" :key="n"></div>
                </div>
              </template>

              <!-- Initiate error state -->
              <template v-else-if="initiateError">
                <div class="error-state">
                  <div class="error-icon-wrap">
                    <div class="error-icon-ring">
                      <span class="mdi mdi-alert-circle error-icon-mdi"></span>
                    </div>
                    <div class="error-pulse"></div>
                  </div>
                  <h2 class="error-title">Onboarding Failed</h2>
                  <p class="error-desc">{{ initiateErrorMsg }}</p>
                  <div class="error-detail-box">
                    <span class="mdi mdi-information-outline"></span>
                    <span>{{ initiateErrorDetail }}</span>
                  </div>
                  <button class="btn-retry-error" @click="retryInitiate">
                    <span class="mdi mdi-refresh"></span> Try Again
                  </button>
                </div>
              </template>

              <!-- Merchant profile loaded -->
              <template v-else-if="merchantProfile">
                <div class="verify-header">
                  <div class="verify-avatar">
                    <span class="mdi mdi-store-outline"></span>
                  </div>
                  <div class="verify-header-text">
                    <h2 class="verify-name">{{ merchantProfile.merchant_name || merchantProfile.name }}</h2>
                    <p class="verify-biz">{{ merchantProfile.business_name || '—' }}</p>
                    <span class="verify-badge">{{ merchantProfile.business_type || 'DMT' }}</span>
                  </div>
                </div>

                <p class="verify-instruction">
                  <span class="mdi mdi-information-outline"></span>
                  Please review your details carefully before proceeding. Clicking
                  <strong>Verify &amp; Continue</strong> will initiate DMT registration with NSDL and
                  trigger an OTP to your registered mobile number.
                </p>

                <!-- Business Info -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-briefcase-outline section-icon"></span>
                    <span class="section-label">Business Information</span>
                  </div>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="di-key">DBA Name</span>
                      <span class="di-val">{{ merchantProfile.dba_name || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Business Type</span>
                      <span class="di-val">{{ merchantProfile.business_type || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Nature of Business</span>
                      <span class="di-val">{{ merchantProfile.nature_of_business || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Annual Turnover</span>
                      <span class="di-val">{{ merchantProfile.annual_turn_over || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Date of Birth</span>
                      <span class="di-val">{{ merchantProfile.business_dob || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Gender</span>
                      <span class="di-val">{{
                        merchantProfile.gender === 'M' ? 'Male'
                        : merchantProfile.gender === 'F' ? 'Female'
                        : merchantProfile.gender || '—'
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Website</span>
                      <span class="di-val di-val-link">{{ merchantProfile.website || '—' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Contact -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-phone-outline section-icon"></span>
                    <span class="section-label">Contact Details</span>
                  </div>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="di-key">Primary Email</span>
                      <span class="di-val">{{ merchantProfile.primary_email_id || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Primary Mobile</span>
                      <span class="di-val">{{ merchantProfile.primary_mobile || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Beneficiary Email</span>
                      <span class="di-val">{{ merchantProfile.beneficiary_email || '—' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Beneficiary Mobile</span>
                      <span class="di-val">{{ merchantProfile.beneficiary_mobile || '—' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Official Address -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-map-marker-outline section-icon"></span>
                    <span class="section-label">Official Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">{{
                      [merchantProfile.official_address, merchantProfile.address1,
                       merchantProfile.address2, merchantProfile.address3].filter(Boolean).join(', ')
                    }}</p>
                    <p class="address-line">{{ merchantProfile.city }}, {{ merchantProfile.state }} – {{ merchantProfile.pincode }}</p>
                    <p class="address-line" v-if="merchantProfile.phone">📞 {{ merchantProfile.phone }}</p>
                  </div>
                </div>

                <!-- Residential Address -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-home-outline section-icon"></span>
                    <span class="section-label">Residential Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">{{
                      [merchantProfile.residential_address, merchantProfile.res_address1,
                       merchantProfile.res_address2, merchantProfile.res_address3].filter(Boolean).join(', ')
                    }}</p>
                    <p class="address-line">{{ merchantProfile.res_city }}, {{ merchantProfile.res_state }} – {{ merchantProfile.res_pincode }}</p>
                  </div>
                </div>

                <!-- Visitor / Shop Address -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-storefront-outline section-icon"></span>
                    <span class="section-label">Visitor / Shop Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">{{
                      [merchantProfile.vister_address, merchantProfile.v_address1,
                       merchantProfile.v_address2, merchantProfile.v_address3].filter(Boolean).join(', ')
                    }}</p>
                    <p class="address-line">{{ merchantProfile.v_city }}, {{ merchantProfile.v_state }} – {{ merchantProfile.v_pincode }}</p>
                  </div>
                </div>

                <!-- Location -->
                <div class="detail-section" v-if="merchantProfile.location?.latitude">
                  <div class="section-label-row">
                    <span class="mdi mdi-crosshairs-gps section-icon"></span>
                    <span class="section-label">Location Coordinates</span>
                  </div>
                  <div class="location-chip-row">
                    <div class="location-chip"><span class="mdi mdi-latitude"></span> Lat: {{ merchantProfile.location.latitude }}</div>
                    <div class="location-chip"><span class="mdi mdi-longitude"></span> Long: {{ merchantProfile.location.longitude }}</div>
                  </div>
                </div>

                <!-- Confirm checkbox -->
                <label class="confirm-check-wrap">
                  <input type="checkbox" v-model="detailsConfirmed" class="confirm-checkbox" />
                  <span class="confirm-text">I have reviewed all the above details and confirm they are correct. I understand that initiating verification will send an OTP to the registered mobile number.</span>
                </label>
              </template>

              <!-- Fallback: no profile -->
              <template v-else-if="!fetchingMerchant">
                <div class="error-state">
                  <div class="error-icon-wrap">
                    <div class="error-icon-ring" style="background:#fef3c7; border-color:#fde68a;">
                      <span class="mdi mdi-account-question" style="font-size:36px; color:#d97706;"></span>
                    </div>
                  </div>
                  <h2 class="error-title" style="color:#92400e;">No Merchant Found</h2>
                  <p class="error-desc">Could not load the merchant profile. Please ensure a valid merchant ID is provided.</p>
                </div>
              </template>
            </div>
          </template>

          <!-- ════ STEP 2 — OTP Validation ════ -->
          <template v-else-if="step === 2">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-shield-key-outline upload-icon"></span>
                    <p class="analyzing-text">OTP Verification</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Enter OTP</h1>
              <p class="card-desc">A one-time password has been sent to your registered mobile number via NSDL. Enter the 6-digit OTP below to continue.</p>

              <div class="otp-input-wrap">
                <input
                  v-for="(digit, idx) in otpDigits"
                  :key="idx"
                  :ref="el => otpRefs[idx] = el"
                  v-model="otpDigits[idx]"
                  class="otp-box"
                  maxlength="1"
                  inputmode="numeric"
                  @input="onOtpInput(idx)"
                  @keydown.backspace="onOtpBackspace(idx)"
                />
              </div>

              <div v-if="OTPreqid" class="reqid-chip">
                <span class="mdi mdi-identifier"></span>
                <span>OTP Ref ID: {{ OTPreqid }}</span>
              </div>

              <p class="resend-text">
                Didn't receive the OTP?
                <button class="resend-btn" :disabled="resendCooldown > 0" @click="resendOtp">
                  {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP' }}
                </button>
              </p>
            </div>
          </template>

          <!-- ════ STEP 3 — Aadhaar Verification ════ -->
          <template v-else-if="step === 3">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-fingerprint upload-icon"></span>
                    <p class="analyzing-text">Aadhaar Verification</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Aadhaar Verification</h1>
              <p class="card-desc">Enter your 12-digit Aadhaar number. It will be encrypted (AES-ECB) before being sent to NSDL for verification. Your data is secure.</p>

              <div class="form-field-wrap" style="max-width:380px; width:100%; margin-top:24px;">
                <label class="form-label">AADHAAR NUMBER <span class="req-star">*</span></label>
                <div class="form-input-box" :class="{ 'form-input-box--error': aadhaarError }">
                  <span class="mdi mdi-card-bulleted-outline form-icon"></span>
                  <input
                    v-model="aadhaarNumber"
                    class="form-input"
                    placeholder="XXXX XXXX XXXX"
                    maxlength="14"
                    inputmode="numeric"
                    @input="onAadhaarInput"
                  />
                </div>
                <span v-if="aadhaarError" class="field-error">{{ aadhaarError }}</span>
              </div>

              <div class="info-hint-box" style="max-width:380px;">
                <span class="mdi mdi-shield-lock-outline"></span>
                <p>Your Aadhaar number is encrypted before transmission. We never store the raw number.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 4 — Biometric Verification ════ -->
          <template v-else-if="step === 4">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-fingerprint upload-icon" :class="{ 'icon-pulse': biometricScanning }"></span>
                    <p class="analyzing-text">{{ biometricScanning ? 'Scanning...' : 'Biometric' }}</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Biometric Verification</h1>
              <p class="card-desc">Place your finger on the connected biometric device to capture your fingerprint. The PID XML from the device will be submitted to NSDL for eKYC.</p>

              <!-- Device status list -->
              <div class="status-list">
                <div class="status-item" :class="deviceConnected ? 'status-done' : 'status-loading'">
                  <span v-if="deviceConnected" class="mdi mdi-check-circle status-icon-green"></span>
                  <div v-else class="spinner-small"></div>
                  <span class="status-text">{{ deviceConnected ? 'Biometric device connected' : 'Detecting biometric device…' }}</span>
                </div>
                <div class="status-item" :class="biometricCaptured ? 'status-done' : 'status-pending'">
                  <span v-if="biometricCaptured" class="mdi mdi-check-circle status-icon-green"></span>
                  <span v-else class="mdi mdi-radiobox-blank status-icon-grey"></span>
                  <span class="status-text" :class="{ 'status-italic': !biometricCaptured }">
                    {{ biometricCaptured ? 'Fingerprint captured successfully' : 'Awaiting fingerprint scan' }}
                  </span>
                </div>
                <div class="status-item" :class="biometricSubmitted ? 'status-done' : 'status-pending'">
                  <span v-if="biometricSubmitted" class="mdi mdi-check-circle status-icon-green"></span>
                  <span v-else class="mdi mdi-radiobox-blank status-icon-grey"></span>
                  <span class="status-text" :class="{ 'status-italic': !biometricSubmitted }">
                    {{ biometricSubmitted ? 'Biometric submitted to NSDL' : 'Pending NSDL submission' }}
                  </span>
                </div>
              </div>

              <!-- Aadhaar confirm for biometric payload -->
              <div class="form-field-wrap" style="max-width:340px; width:100%; margin-top:20px;">
                <label class="form-label">CONFIRM AADHAAR NUMBER <span class="req-star">*</span></label>
                <div class="form-input-box" :class="{ 'form-input-box--error': bioAadhaarError }">
                  <span class="mdi mdi-card-bulleted-outline form-icon"></span>
                  <input
                    :value="bioAadhaar"
                    class="form-input"
                    placeholder="XXXX XXXX XXXX"
                    maxlength="14"
                    disabled
                    />
                </div>
                <span v-if="bioAadhaarError" class="field-error">{{ bioAadhaarError }}</span>
              </div>

              <!-- Capture button -->
              <div style="margin-top:20px; width:100%; max-width:340px;">
                <button
                  class="btn-capture"
                  :disabled="biometricScanning || biometricCaptured"
                  @click="captureBiometric"
                >
                  <span v-if="biometricScanning" class="spinner-btn"></span>
                  <span v-else class="mdi mdi-fingerprint"></span>
                  {{ biometricScanning ? 'Scanning…' : biometricCaptured ? 'Fingerprint Captured ✓' : 'Capture Fingerprint' }}
                </button>
              </div>

              <!-- Success alert -->
              <div v-if="biometricCaptured" class="alert-box" style="margin-top:16px; max-width:340px; width:100%;">
                <span class="mdi mdi-check-circle alert-icon" style="color:#22c55e;"></span>
                <p class="alert-text" style="color:#166534;">
                  <strong>Fingerprint captured.</strong> Click <em>Submit Biometric</em> below to complete eKYC with NSDL.
                </p>
              </div>

              <!-- PID debug (dev only) -->
              <div v-if="biometricPidData && isDev" class="pid-debug-box">
                <p class="pid-debug-label">PID XML Preview (dev)</p>
                <pre class="pid-debug-pre">{{ biometricPidData.slice(0, 200) }}…</pre>
              </div>
            </div>
          </template>

          <!-- ════ STEP 5 — Complete ════ -->
          <template v-else-if="step === 5">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle" style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.18));">
                  <div class="illustration-inner">
                    <span class="mdi mdi-check-decagram" style="font-size:52px; color:#16a34a; display:block;"></span>
                    <p class="analyzing-text" style="color:#16a34a;">Complete</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading" style="color:#16a34a;">DMT Onboarding Complete!</h1>
              <p class="card-desc">Your DMT (Digital Money Transfer) onboarding with NSDL has been successfully completed. The confirmation has been submitted and your account is now active.</p>

              <div class="complete-chips">
                <div class="chip chip--green"><span class="mdi mdi-check"></span> OTP Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Aadhaar Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Biometric Done</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> NSDL Confirmed</div>
              </div>

              <div v-if="agentDetail" class="agent-detail-card">
                <div class="section-label-row" style="margin-bottom:12px;">
                  <span class="mdi mdi-badge-account-outline section-icon"></span>
                  <span class="section-label">Agent Details</span>
                </div>
                <div class="detail-grid">
                  <div class="detail-item" v-for="(val, key) in agentDetail" :key="key">
                    <span class="di-key">{{ key }}</span>
                    <span class="di-val">{{ val }}</span>
                  </div>
                </div>
              </div>

              <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:24px;">
                <button class="btn-continue" style="background:#16a34a; box-shadow:0 4px 14px rgba(22,163,74,0.3);" @click="fetchAgentDetail">
                  <span class="mdi mdi-account-details-outline"></span> View Agent Details
                </button>
                <button class="btn-back" style="border:1.5px solid #c5d8e8;" @click="goToDashboard">
                  <span class="mdi mdi-view-dashboard-outline"></span> Go to Dashboard
                </button>
              </div>
            </div>
          </template>

          <div class="card-footer" v-if="step !== 5">
            <button v-if="step > 1" class="btn-back" @click="goBack">
              <span class="mdi mdi-arrow-left"></span> Back
            </button>

            <div class="footer-right-btns">
              <!-- Step 1 -->
              <button
                v-if="step === 1 && !initiateError"
                class="btn-continue"
                :disabled="loading || fetchingMerchant || !detailsConfirmed"
                @click="handleStep1Continue"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Verify &amp; Continue <span class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 2 -->
              <button
                v-else-if="step === 2"
                class="btn-continue"
                :disabled="loading || otpDigits.join('').length < 6"
                @click="handleStep2OTP"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Verify OTP <span class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 3 -->
              <button
                v-else-if="step === 3"
                class="btn-continue"
                :disabled="loading"
                @click="handleStep3Aadhaar"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Verify Aadhaar <span class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 4 -->
              <button
                v-else-if="step === 4"
                class="btn-continue"
                :disabled="loading || !biometricCaptured || !biometricPidData"
                @click="handleStep4Biometric"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Submit Biometric <span class="mdi mdi-check"></span></template>
              </button>
            </div>
          </div>
        </div>

        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-file-document-outline info-icon"></span></div>
            <div>
              <p class="info-title">Required Documents</p>
              <p class="info-desc">Keep your Aadhaar number and biometric device ready for the verification steps.</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-shield-check-outline info-icon"></span></div>
            <div>
              <p class="info-title">Secure Processing</p>
              <p class="info-desc">All sensitive data (Aadhaar) is encrypted using AES-ECB before being sent to NSDL servers.</p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <footer class="merchant-footer">
      © {{ new Date().getFullYear() }} Merchant Portal. All rights reserved. •
      <a href="#" class="footer-link">Privacy Policy</a> •
      <a href="#" class="footer-link">Terms of Service</a>
    </footer>

    <transition name="snack">
      <div v-if="snackbar.show" class="snackbar" :class="'snackbar-' + snackbar.color">
        <span class="mdi" :class="snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
        <span class="snack-msg">{{ snackbar.message }}</span>
        <button class="snack-close" @click="snackbar.show = false"><span class="mdi mdi-close"></span></button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="loading && step > 1" class="processing-overlay">
        <div class="processing-card">
          <div class="processing-spinner"></div>
          <p class="processing-title">{{ processingMsg }}</p>
          <p class="processing-sub">Please wait, do not close this page</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { useDmtOnboardingApi } from "@/composables/apis/useDmtOnboardingApi";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useRouter, useRoute } from "vue-router";

const {
  dmtOnboarding,
  dmtRequestOtp,
  dmtValidateOtp,
  dmtVerifyAadhaar,
  dmtSubmitBiometric,
  dmtGetAgentDetail,
} = useDmtOnboardingApi();

const { getMerchantForOnboarding } = useOnboadingApi();
const router = useRouter();
const route  = useRoute();

const props = defineProps({ merchantId: String });

const kycStatus = reactive({
  otp_status:       route.query.otp_status === "true" || route.query.otp_status === true,
  aadhaar_status:   route.query.aadhaar_status   || "PENDING",
  biometric_status: route.query.biometric_status === "true" || false,
});

const isDev = computed(() => import.meta.env?.DEV ?? false);

const steps = [
  { key: "verify",    label: "Verify",   icon: "mdi-account-check-outline" },
  { key: "otp",       label: "OTP",      icon: "mdi-shield-key-outline" },
  { key: "aadhaar",   label: "Aadhaar",  icon: "mdi-card-bulleted-outline" },
  { key: "biometric", label: "Biometric",icon: "mdi-hand-wave-outline" },
];

const stepSubtitles = [
  "Verify Merchant Details",
  "OTP Validation",
  "Aadhaar Verification",
  "Biometric Verification",
];

const step             = ref(1);
const loading          = ref(false);
const processingMsg    = ref("Processing...");
const fetchingMerchant = ref(true);
const merchantProfile  = ref(null);
const detailsConfirmed = ref(false);
const agentDetail      = ref(null);

const initiateError       = ref(false);
const initiateErrorMsg    = ref("");
const initiateErrorDetail = ref("");

const OTPreqid       = ref(null);
const otpDigits      = ref(["", "", "", "", "", ""]);
const otpRefs        = ref([]);
const resendCooldown = ref(0);
let   resendTimer    = null;

const aadhaarNumber = ref("");
const aadhaarError  = ref("");

const biometricScanning  = ref(false);
const biometricCaptured  = ref(false);
const biometricSubmitted = ref(false);
const biometricPidData   = ref("");
const deviceConnected    = ref(false);
const bioAadhaar         = ref("");
const bioAadhaarError    = ref("");

const snackbar = reactive({ show: false, message: "", color: "success" });

function showSnack(message, color = "success") {
  snackbar.message = message;
  snackbar.color   = color;
  snackbar.show    = true;
  setTimeout(() => (snackbar.show = false), 4500);
}

function goBack() { if (step.value > 1) step.value--; }
function goToDashboard() { router.push("/vendor/merchants"); }

function onOtpInput(idx) {
  otpDigits.value[idx] = otpDigits.value[idx].replace(/\D/g, "");
  if (otpDigits.value[idx] && idx < 5) otpRefs.value[idx + 1]?.focus();
}

function onOtpBackspace(idx) {
  if (!otpDigits.value[idx] && idx > 0) {
    otpDigits.value[idx - 1] = "";
    otpRefs.value[idx - 1]?.focus();
  }
}

function onAadhaarInput() {
  let v = aadhaarNumber.value.replace(/\D/g, "").slice(0, 12);
  aadhaarNumber.value = v.replace(/(\d{4})(?=\d)/g, "$1 ");
  aadhaarError.value  = "";
}

function onBioAadhaarInput() {
  let v = bioAadhaar.value.replace(/\D/g, "").slice(0, 12);
  bioAadhaar.value      = v.replace(/(\d{4})(?=\d)/g, "$1 ");
  bioAadhaarError.value = "";
}

function startResendCooldown() {
  resendCooldown.value = 60;
  resendTimer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) clearInterval(resendTimer);
  }, 1000);
}

async function resendOtp() {
  if (resendCooldown.value > 0) return;
  loading.value       = true;
  processingMsg.value = "Sending OTP...";
  try {
    const res = await dmtRequestOtp({ merchantId: props.merchantId });
    if (res?.statusCode === "00") {
      OTPreqid.value  = res.data?.otpreqid || res.data?.otp_reqid || OTPreqid.value;
      otpDigits.value = ["", "", "", "", "", ""];
      otpRefs.value[0]?.focus();
      showSnack("OTP resent successfully!", "success");
      startResendCooldown();
    } else {
      showSnack(res?.message || "Failed to resend OTP", "error");
    }
  } catch {
    showSnack("Network error. Please try again.", "error");
  } finally {
    loading.value = false;
  }
}

function retryInitiate() {
  initiateError.value = false;
  handleStep1Continue();
}

// ── Step 1 dmt onboarding ────
async function handleStep1Continue() {
  if (!detailsConfirmed.value) {
    showSnack("Please confirm you have reviewed the details", "error");
    return;
  }
  initiateError.value = false;
  loading.value       = true;
  processingMsg.value = "Initiating DMT registration with NSDL...";

  try {
    const res = await dmtOnboarding({ merchantId: props.merchantId });

    if (res?.statusCode === "00" && res?.otp_status === true) {
      OTPreqid.value = res?.otp_reqid || res?.data?.otp_reqid || null;
      showSnack(res?.message || "Merchant registered. OTP sent to mobile!", "success");
      startResendCooldown();
      step.value = 2;
      return;
    }

    if (res?.otp_status === true) {
      OTPreqid.value = res?.otp_reqid || res?.data?.otp_reqid || "";
      showSnack("DMT already initiated. Proceeding to OTP verification.", "success");
      startResendCooldown();
      step.value = 2;
      return;
    }

    initiateError.value       = true;
    initiateErrorMsg.value    = res?.data?.response || res?.message || "Failed to initiate DMT Onboarding";
    initiateErrorDetail.value = `Error: ${res?.data?.error || res?.error || "Unknown"} · Code: ${res?.statusCode || res?.data?.statusCode || "N/A"}`;
    showSnack(initiateErrorMsg.value, "error");

  } catch (err) {
    initiateError.value       = true;
    initiateErrorMsg.value    = "Network error. Please check your connection.";
    initiateErrorDetail.value = err?.message || "Unknown error";
    showSnack("Connection failed. Please retry.", "error");
  } finally {
    loading.value = false;
  }
}

// ── Step 2 validate_otp ──
async function handleStep2OTP() {
  const otp = otpDigits.value.join("");
  if (otp.length < 6) { showSnack("Please enter the complete 6-digit OTP", "error"); return; }
  if (!OTPreqid.value) { showSnack("OTP request ID missing. Please go back and retry.", "error"); return; }

  loading.value       = true;
  processingMsg.value = "Validating OTP with NSDL...";

  try {
    const res = await dmtValidateOtp({ otp, otpreqid: OTPreqid.value, merchantId: props.merchantId });

    if (res?.statusCode === "00") {
      showSnack(res?.data?.message || res?.message || "OTP verified successfully!", "success");
      step.value = 3;
    } else {
      showSnack(res?.data?.message || res?.message || "OTP verification failed. Please try again.", "error");
    }
  } catch (e) {
    showSnack("OTP verification failed. Please try again.", "error");
  } finally {
    loading.value = false;
  }
}

// ── Step 3 update_UID ────
async function handleStep3Aadhaar() {
  const raw = aadhaarNumber.value.replace(/\s/g, "");
  if (raw.length < 12) {
    aadhaarError.value = "Please enter a valid 12-digit Aadhaar number";
    showSnack("Please enter a valid 12-digit Aadhaar number", "error");
    return;
  }

  loading.value       = true;
  processingMsg.value = "Verifying Aadhaar with NSDL...";

  try {
    const res = await dmtVerifyAadhaar({ aadhaarno: raw, merchantId: props.merchantId });

    if (res?.statusCode === "00") {
      showSnack(res?.data?.message || res?.message || "Aadhaar verified successfully!", "success");
      bioAadhaar.value = aadhaarNumber.value; // pre-fill for biometric step
      step.value = 4;
      detectBiometricDevice();
    } else {
      showSnack(res?.data?.message || res?.message || "Aadhaar verification failed. Please try again.", "error");
    }
  } catch (e) {
    showSnack("Aadhaar verification failed. Please try again.", "error");
  } finally {
    loading.value = false;
  }
}

// ── Step 4 updatebiodetail ───
async function handleStep4Biometric() {
  if (!biometricCaptured.value || !biometricPidData.value) {
    showSnack("Please capture your fingerprint first.", "error");
    return;
  }
  const rawAadhaar = bioAadhaar.value.replace(/\s/g, "");
  if (rawAadhaar.length < 12) {
    bioAadhaarError.value = "Please enter a valid 12-digit Aadhaar number";
    showSnack("Please confirm your Aadhaar number", "error");
    return;
  }

  loading.value       = true;
  processingMsg.value = "Submitting biometric data to NSDL...";

  try {
    const res = await dmtSubmitBiometric({ PidData: biometricPidData.value, aadhaarno: rawAadhaar, merchantId: props.merchantId });

    if (res?.statusCode === "00") {
      biometricSubmitted.value = true;
      showSnack(res?.data?.message || res?.message || "Biometric submitted successfully!", "success");
      step.value = 5;
      await fetchAgentDetail();
    } else {
      showSnack(res?.data?.message || res?.message || "Biometric submission failed. Please retry.", "error");
    }
  } catch (e) {
    showSnack("Biometric submission failed. Please try again.", "error");
  } finally {
    loading.value = false;
  }
}

// ── Biometric ─────
async function detectBiometricDevice() {
  try {
    const res = await fetch("http://127.0.0.1:11100/getDeviceInfo", { method: "RDSERVICE" });
    deviceConnected.value = res.ok;
  } catch {
    deviceConnected.value = false;
  }
}

// ── Capture fingerprint ──────────
async function captureBiometric() {
  const rawAadhaar = bioAadhaar.value.replace(/\s/g, "");
  if (rawAadhaar.length < 12) {
    bioAadhaarError.value = "Please enter your Aadhaar number before capturing";
    showSnack("Enter your Aadhaar number first", "error");
    return;
  }

  biometricScanning.value = true;

  try {
    const captureXml = `<?xml version="1.0"?><PidOptions ver="1.0"><Opts fCount="1" fType="2" iCount="0" pCount="0" format="0" pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" /><CustOpts><Param name="wadh" value="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" /></CustOpts></PidOptions>`;

    const response = await fetch("http://127.0.0.1:11100/capture", { method: "CAPTURE", body: captureXml });
    if (!response.ok) throw new Error("RD Service capture failed");

    const pidXml = await response.text();

    if (pidXml.includes('errCode="0"') || pidXml.includes("errCode=0")) {
      biometricPidData.value  = pidXml;
      biometricCaptured.value = true;
      deviceConnected.value   = true;
      showSnack("Fingerprint captured successfully!", "success");
    } else {
      const errMatch = pidXml.match(/errInfo="([^"]+)"/);
      throw new Error(errMatch ? errMatch[1] : "Capture failed. Please try again.");
    }
  } catch (err) {
    showSnack(err?.message || "Failed to capture fingerprint. Check device connection.", "error");
    deviceConnected.value = false;
  } finally {
    biometricScanning.value = false;
  }
}

async function fetchAgentDetail() {
  try {
    const res = await dmtGetAgentDetail({ merchantId: props.merchantId });
    if (res?.statusCode === "00" && res?.data) agentDetail.value = res.data;
  } catch (e) {
    console.warn("[DMT] Could not fetch agent detail:", e);
  }
}

onMounted(async () => {
  if (props.merchantId) {
    try {
      const res = await getMerchantForOnboarding(props.merchantId);
      if (res?.statusCode === "00" && res?.data) {
        merchantProfile.value = res.data;
      } else {
        showSnack("Failed to load merchant details", "error");
      }
    } catch {
      showSnack("Could not fetch merchant profile", "error");
    } finally {
      fetchingMerchant.value = false;
    }
  } else {
    fetchingMerchant.value = false;
  }

  const isVerified = (s) => s === "VERIFIED";

  if (!kycStatus.otp_status) {
    step.value = 1;
  } else if (!isVerified(kycStatus.aadhaar_status)) {
    step.value = 3;
  } else if (!kycStatus.biometric_status) {
    step.value = 4;
    detectBiometricDevice();
  } else {
    step.value = 5;
  }
});

onUnmounted(() => {
  if (resendTimer) clearInterval(resendTimer);
});
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.merchant-root { font-family: 'Inter', sans-serif; background: #f6f6f8; min-height: 100vh; display: flex; flex-direction: column; }

/* Header */
.merchant-header { display: flex; align-items: center; justify-content: space-between; background: #002d5a; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 14px 24px; position: sticky; top: 0; z-index: 50; }
@media (min-width: 768px) { .merchant-header { padding: 14px 40px; } }
.header-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { width: 32px; height: 32px; background: rgba(255,255,255,0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; }
.brand-title { font-size: 16px; font-weight: 700; color: #fff; }
.header-right { flex-shrink: 0; }
.step-badge { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); padding: 5px 12px; border-radius: 9999px; white-space: nowrap; }

/* Main */
.merchant-main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 24px 16px 40px; }
.content-wrapper { width: 100%; max-width: 820px; display: flex; flex-direction: column; gap: 20px; }

/* Stepper */
.stepper-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.stepper-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 8px; }
.stepper-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.stepper-subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
.active-badge { font-size: 10px; font-weight: 700; color: #002d5a; background: rgba(0,45,90,0.08); padding: 4px 10px; border-radius: 9999px; white-space: nowrap; flex-shrink: 0; border: 1px solid rgba(0,45,90,0.15); }
.stepper-track { position: relative; display: flex; align-items: center; justify-content: space-between; }
.track-bg { position: absolute; top: 20px; left: 0; right: 0; height: 4px; background: #f1f5f9; border-radius: 4px; z-index: 0; }
.track-fill { position: absolute; top: 20px; left: 0; height: 4px; background: #002d5a; border-radius: 4px; z-index: 1; transition: width 0.5s ease; }
.step-node { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: all 0.3s; }
.step-active  { background: #002d5a; color: #fff; box-shadow: 0 4px 16px rgba(0,45,90,0.3); }
.step-done    { background: #002d5a; color: #fff; }
.step-pending { background: #f1f5f9; color: #94a3b8; }
.step-icon { font-size: 17px; }
.step-label { font-size: 10px; font-weight: 500; color: #94a3b8; text-align: center; }
.step-label-active { color: #002d5a; font-weight: 700; }

/* Main card */
.main-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.07); overflow: hidden; }

/* Step 1 */
.step1-body { padding: 24px !important; align-items: stretch !important; text-align: left !important; }
@media (min-width: 640px) { .step1-body { padding: 32px !important; } }

/* Skeleton */
.skeleton-wrap { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.skeleton-title { width: 55%; height: 18px; border-radius: 6px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skeleton-row { height: 13px; border-radius: 6px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skeleton-row:nth-child(odd) { width: 100%; } .skeleton-row:nth-child(even) { width: 78%; }
@keyframes shimmer { to { background-position: -200% 0; } }

/* Error */
.error-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 16px 0 8px; gap: 14px; }
.error-icon-wrap { position: relative; width: 80px; height: 80px; }
.error-icon-ring { width: 80px; height: 80px; border-radius: 50%; background: #fff1f2; border: 2px solid #fecdd3; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
.error-icon-mdi { font-size: 36px; color: #e11d48; }
.error-pulse { position: absolute; inset: -6px; border-radius: 50%; border: 2px solid rgba(225,29,72,0.25); animation: errRipple 2s ease-out infinite; }
@keyframes errRipple { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
.error-title { font-size: 20px; font-weight: 800; color: #0f172a; }
.error-desc  { font-size: 14px; color: #64748b; max-width: 340px; line-height: 1.5; }
.error-detail-box { display: flex; align-items: center; gap: 8px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #e11d48; font-weight: 600; max-width: 380px; }
.error-detail-box .mdi { font-size: 14px; flex-shrink: 0; }
.btn-retry-error { display: flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 10px; background: #002d5a; color: #fff; border: none; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(0,45,90,0.3); font-family: inherit; transition: filter 0.15s; }
.btn-retry-error:hover { filter: brightness(1.1); }

/* Verify header */
.verify-header { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg,rgba(0,45,90,0.05),rgba(0,45,90,0.02)); border: 1px solid rgba(0,45,90,0.12); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.verify-avatar { width: 52px; height: 52px; border-radius: 14px; background: #002d5a; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; flex-shrink: 0; box-shadow: 0 4px 14px rgba(0,45,90,0.3); }
.verify-header-text { flex: 1; min-width: 0; }
.verify-name { font-size: 16px; font-weight: 800; color: #0f172a; }
.verify-biz  { font-size: 12px; color: #64748b; margin-top: 2px; }
.verify-badge { display: inline-block; margin-top: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; background: rgba(0,45,90,0.1); color: #002d5a; padding: 3px 10px; border-radius: 9999px; }
.verify-instruction { display: flex; align-items: flex-start; gap: 8px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #92400e; line-height: 1.5; margin-bottom: 20px; }
.verify-instruction .mdi { font-size: 14px; color: #d97706; flex-shrink: 0; margin-top: 1px; }

/* Detail sections */
.detail-section { margin-bottom: 20px; }
.section-label-row { display: flex; align-items: center; gap: 7px; margin-bottom: 10px; }
.section-icon { font-size: 15px; color: #002d5a; }
.section-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #002d5a; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
@media (max-width: 480px) { .detail-grid { grid-template-columns: 1fr; } }
.detail-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; }
.di-key { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.di-val { font-size: 13px; font-weight: 600; color: #0f172a; word-break: break-word; }
.di-val-link { color: #002d5a; word-break: break-all; }
.address-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
.address-line { font-size: 13px; color: #334155; line-height: 1.5; }
.location-chip-row { display: flex; gap: 10px; flex-wrap: wrap; }
.location-chip { display: flex; align-items: center; gap: 6px; background: #f0f4ff; border: 1px solid rgba(0,45,90,0.15); border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 700; color: #002d5a; }
.confirm-check-wrap { display: flex; align-items: flex-start; gap: 10px; background: #f0f4ff; border: 1.5px solid rgba(0,45,90,0.2); border-radius: 10px; padding: 14px 16px; cursor: pointer; margin-top: 8px; }
.confirm-checkbox { width: 16px; height: 16px; accent-color: #002d5a; flex-shrink: 0; margin-top: 2px; cursor: pointer; }
.confirm-text { font-size: 13px; font-weight: 500; color: #1e3a8a; line-height: 1.5; }

/* Card body */
.card-body { padding: 32px 24px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; }
@media (min-width: 768px) { .card-body { padding: 48px; } }

/* Illustration */
.illustration-wrap { position: relative; width: 100%; max-width: 260px; margin-bottom: 28px; }
.illustration-circle { aspect-ratio: 1; background: linear-gradient(135deg,rgba(0,45,90,0.05),rgba(0,45,90,0.15)); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.illustration-inner { width: 55%; height: 55%; background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.12); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 20px; }
.upload-icon { font-size: 48px; color: #002d5a; display: block; }
.analyzing-text { font-size: 8px; font-weight: 700; color: #002d5a; letter-spacing: 0.12em; text-transform: uppercase; }
.card-heading { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
@media (min-width: 640px) { .card-heading { font-size: 26px; } }
.card-desc { font-size: 14px; color: #64748b; line-height: 1.65; max-width: 420px; margin: 0 auto; }

/* OTP */
.otp-input-wrap { display: flex; gap: 10px; margin-top: 24px; justify-content: center; flex-wrap: wrap; }
.otp-box { width: 48px; height: 54px; border: 2px solid #e2e8f0; border-radius: 10px; text-align: center; font-size: 20px; font-weight: 700; color: #0f172a; outline: none; transition: border-color 0.2s; background: #f8fafc; font-family: inherit; }
.otp-box:focus { border-color: #002d5a; background: #fff; }
.reqid-chip { display: inline-flex; align-items: center; gap: 6px; background: #f0f4ff; border: 1px solid rgba(0,45,90,0.18); border-radius: 8px; padding: 6px 14px; font-size: 11px; font-weight: 600; color: #002d5a; margin-top: 14px; }
.resend-text { margin-top: 14px; font-size: 13px; color: #64748b; }
.resend-btn { color: #002d5a; font-weight: 600; background: none; border: none; cursor: pointer; text-decoration: underline; font-size: 13px; font-family: inherit; }
.resend-btn:disabled { color: #94a3b8; cursor: not-allowed; text-decoration: none; }

/* Form */
.form-field-wrap { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.form-label { font-size: 11px; font-weight: 700; color: #5a7d9a; text-transform: uppercase; letter-spacing: 0.08em; }
.req-star { color: #e11d48; }
.form-input-box { display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; transition: border-color 0.2s, box-shadow 0.2s; overflow: hidden; }
.form-input-box:focus-within { border-color: #002d5a; box-shadow: 0 0 0 3px rgba(0,45,90,0.1); background: #fff; }
.form-input-box--error { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
.form-icon { font-size: 15px; color: #8aafc8; padding: 0 0 0 12px; flex-shrink: 0; pointer-events: none; transition: color 0.2s; }
.form-input-box:focus-within .form-icon { color: #002d5a; }
.form-input { flex: 1; padding: 11px 12px; font-size: 14px; color: #0f172a; background: transparent; border: none; outline: none; font-family: inherit; }
.form-input::placeholder { color: #9fb8cc; }
.field-error { font-size: 11px; font-weight: 600; color: #ef4444; }
.info-hint-box { display: flex; align-items: flex-start; gap: 8px; background: #f0f6fb; border: 1px solid #c5d8e8; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #334155; line-height: 1.5; margin-top: 16px; text-align: left; }
.info-hint-box .mdi { font-size: 14px; color: #002d5a; flex-shrink: 0; margin-top: 1px; }

/* Biometric */
.status-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; width: 100%; max-width: 360px; }
.status-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; text-align: left; }
.status-done    { background: #eefaf3; border-color: rgba(34,197,94,0.3); }
.status-loading { background: #f0f6fb; border-color: #c5d8e8; }
.status-pending { background: #f8fafc; border-color: #e2e8f0; }
.status-icon-green { font-size: 18px; color: #22c55e; flex-shrink: 0; }
.status-icon-grey  { font-size: 18px; color: #94a3b8; flex-shrink: 0; }
.status-text   { font-size: 13px; font-weight: 500; color: #334155; }
.status-italic { font-style: italic; color: #94a3b8; }
.spinner-small { width: 18px; height: 18px; flex-shrink: 0; border: 2px solid #c5d8e8; border-top-color: #002d5a; border-radius: 50%; animation: spin 0.75s linear infinite; }
.btn-capture { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px 24px; border-radius: 10px; background: #002d5a; color: #fff; border: none; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; box-shadow: 0 4px 16px rgba(0,45,90,0.28); transition: filter 0.15s, opacity 0.15s; }
.btn-capture:hover:not(:disabled) { filter: brightness(1.08); }
.btn-capture:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-capture .mdi { font-size: 18px; }
.alert-box { display: flex; align-items: flex-start; gap: 10px; background: #eefaf3; border: 1px solid rgba(34,197,94,0.35); border-radius: 8px; padding: 12px 14px; text-align: left; }
.alert-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.alert-text { font-size: 13px; line-height: 1.5; }
.pid-debug-box { margin-top: 12px; padding: 10px 14px; background: #1e293b; border-radius: 8px; text-align: left; max-width: 400px; width: 100%; }
.pid-debug-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; }
.pid-debug-pre   { font-size: 10px; color: #86efac; word-break: break-all; white-space: pre-wrap; }

/* Complete */
.complete-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 20px; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
.chip--green { background: rgba(34,197,94,0.12); color: #15803d; border: 1px solid rgba(34,197,94,0.25); }
.agent-detail-card { margin-top: 24px; width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; text-align: left; }

/* Footer */
.card-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; display: flex; flex-direction: column; align-items: stretch; gap: 12px; }
@media (min-width: 640px) { .card-footer { flex-direction: row; align-items: center; justify-content: space-between; padding: 18px 32px; } }
.btn-back { display: flex; align-items: center; gap: 6px; padding: 10px 20px; font-size: 13px; font-weight: 600; color: #475569; background: none; border: none; border-radius: 8px; cursor: pointer; transition: background 0.15s; justify-content: center; font-family: inherit; }
.btn-back:hover { background: #f1f5f9; color: #002d5a; }
.footer-right-btns { display: flex; gap: 12px; align-items: center; }
@media (max-width: 639px) { .footer-right-btns { width: 100%; } }
.btn-continue { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 28px; font-size: 13px; font-weight: 700; color: #fff; background: #002d5a; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 14px rgba(0,45,90,0.28); transition: filter 0.15s, opacity 0.15s; font-family: inherit; white-space: nowrap; }
.btn-continue:hover:not(:disabled) { filter: brightness(1.08); }
.btn-continue:disabled { opacity: 0.45; cursor: not-allowed; }
@media (min-width: 640px) { .btn-continue { flex: none; } }

/* Spinners */
.spinner-btn { width: 15px; height: 15px; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes iconPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.7; } }
.icon-pulse { animation: iconPulse 1s ease-in-out infinite; }

/* Info cards */
.info-cards { display: flex; flex-direction: column; gap: 14px; }
@media (min-width: 640px) { .info-cards { flex-direction: row; } }
.info-card { flex: 1; display: flex; align-items: flex-start; gap: 14px; padding: 18px; border: 1.5px dashed #c5d8e8; border-radius: 12px; background: #fff; }
.info-icon-wrap { padding: 8px; background: rgba(0,45,90,0.08); border-radius: 8px; color: #002d5a; flex-shrink: 0; }
.info-icon { font-size: 20px; display: block; }
.info-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.info-desc  { font-size: 12px; color: #64748b; margin-top: 4px; line-height: 1.5; }

/* Page footer */
.merchant-footer { padding: 24px; text-align: center; font-size: 11px; color: #94a3b8; }
.footer-link { color: #94a3b8; text-decoration: underline; }
.footer-link:hover { color: #002d5a; }

/* Snackbar */
.snackbar { position: fixed; top: 20px; right: 20px; display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 500; color: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 9999; max-width: calc(100vw - 40px); }
.snackbar-success { background: #002d5a; }
.snackbar-error   { background: #ef4444; }
.snack-msg  { flex: 1; }
.snack-close { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; font-size: 16px; }
.snack-enter-active, .snack-leave-active { transition: all 0.3s ease; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translateY(-10px); }

/* Processing overlay */
.processing-overlay { position: fixed; inset: 0; background: rgba(0,22,46,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9998; }
.processing-card { background: #fff; border-radius: 14px; padding: 40px 48px; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.2); }
.processing-spinner { width: 44px; height: 44px; border: 3px solid #e8f0f7; border-top-color: #002d5a; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
.processing-title { font-size: 15px; font-weight: 700; color: #002d5a; }
.processing-sub   { font-size: 12px; color: #5a7d9a; margin-top: 6px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>