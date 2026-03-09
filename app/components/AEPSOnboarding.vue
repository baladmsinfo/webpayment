<template>
    <div class="merchant-root">
        <!-- Top Navigation -->
        <header class="merchant-header">
            <div class="header-brand">
                <div class="brand-icon">
                    <span class="mdi mdi-wallet-outline"></span>
                </div>
                <h2 class="brand-title">Merchant Onboarding</h2>
            </div>
        </header>

        <!-- Main Content -->
        <main class="merchant-main">
            <div class="content-wrapper">

                <!-- Stepper Progress Card -->
                <div class="stepper-card">
                    <div class="stepper-header">
                        <div>
                            <h3 class="stepper-title">Onboarding Progress</h3>
                            <p class="stepper-subtitle">Step {{ step }} of {{ steps.length }}: {{ stepSubtitles[step -
                                1] }}</p>
                        </div>
                        <div class="active-badge">ACTIVE</div>
                    </div>

                    <div class="stepper-track">
                        <div class="track-bg"></div>
                        <div class="track-fill" :style="{ width: ((step - 1) / (steps.length - 1) * 100) + '%' }"></div>
                        <div v-for="(s, i) in steps" :key="s.key" class="step-node">
                            <div class="step-circle" :class="{
                                'step-active': step === i + 1,
                                'step-done': step > i + 1,
                                'step-pending': step < i + 1
                            }">
                                <span v-if="step > i + 1" class="mdi mdi-check step-icon"></span>
                                <span v-else-if="step === i + 1 && i === 0"
                                    class="mdi mdi-account-check-outline step-icon"></span>
                                <span v-else-if="step === i + 1 && i === 1"
                                    class="mdi mdi-shield-key-outline step-icon"></span>
                                <span v-else-if="step === i + 1 && i === 2"
                                    class="mdi mdi-card-account-details-outline step-icon"></span>
                                <span v-else-if="step === i + 1 && i === 3"
                                    class="mdi mdi-fingerprint step-icon"></span>
                                <span v-else class="step-num">{{ i + 1 }}</span>
                            </div>
                            <span class="step-label" :class="{ 'step-label-active': step === i + 1 }">{{ s.label
                                }}</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Card -->
                <div class="main-card">

                    <!-- ─── STEP 1: Merchant Verification ─── -->
                    <template v-if="step === 1">
                        <div class="card-body step1-body">

                            <!-- Loading skeleton while fetching -->
                            <template v-if="fetchingMerchant">
                                <div class="skeleton-wrap">
                                    <div class="skeleton-title"></div>
                                    <div class="skeleton-row" v-for="n in 6" :key="n"></div>
                                </div>
                            </template>

                            <!-- Error state: initiate onboard failed -->
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
                                        <span class="mdi mdi-refresh"></span>
                                        Try Again
                                    </button>
                                </div>
                            </template>

                            <!-- Merchant details verification -->
                            <template v-else-if="merchantProfile">
                                <div class="verify-header">
                                    <div class="verify-avatar">
                                        <span class="mdi mdi-store-outline"></span>
                                    </div>
                                    <div class="verify-header-text">
                                        <h2 class="verify-name">{{ merchantProfile.merchant_name }}</h2>
                                        <p class="verify-biz">{{ merchantProfile.business_name }}</p>
                                        <span class="verify-badge">{{ merchantProfile.business_type }}</span>
                                    </div>
                                </div>

                                <p class="verify-instruction">
                                    <span class="mdi mdi-information-outline"></span>
                                    Please review your details carefully before proceeding. Once confirmed, you cannot
                                    edit these.
                                </p>

                                <!-- Section: Business Info -->
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
                                            <span class="di-val">{{ merchantProfile.gender === 'M' ? 'Male' :
                                                merchantProfile.gender === 'F' ? 'Female' : merchantProfile.gender ||
                                                    '—' }}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="di-key">Website</span>
                                            <span class="di-val di-val-link">{{ merchantProfile.website || '—' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Section: Contact -->
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

                                <!-- Section: Official Address -->
                                <div class="detail-section">
                                    <div class="section-label-row">
                                        <span class="mdi mdi-map-marker-outline section-icon"></span>
                                        <span class="section-label">Official Address</span>
                                    </div>
                                    <div class="address-block">
                                        <p class="address-line">{{ [merchantProfile.official_address,
                                        merchantProfile.address1, merchantProfile.address2,
                                        merchantProfile.address3].filter(Boolean).join(', ') }}</p>
                                        <p class="address-line">{{ merchantProfile.city }}, {{ merchantProfile.state }}
                                            – {{ merchantProfile.pincode }}</p>
                                        <p class="address-line" v-if="merchantProfile.phone">📞 {{ merchantProfile.phone
                                            }}</p>
                                    </div>
                                </div>

                                <!-- Section: Residential Address -->
                                <div class="detail-section">
                                    <div class="section-label-row">
                                        <span class="mdi mdi-home-outline section-icon"></span>
                                        <span class="section-label">Residential Address</span>
                                    </div>
                                    <div class="address-block">
                                        <p class="address-line">{{ [merchantProfile.residential_address,
                                        merchantProfile.res_address1, merchantProfile.res_address2,
                                        merchantProfile.res_address3].filter(Boolean).join(', ') }}</p>
                                        <p class="address-line">{{ merchantProfile.res_city }}, {{
                                            merchantProfile.res_state }} – {{ merchantProfile.res_pincode }}</p>
                                        <p class="address-line" v-if="merchantProfile.res_mobile">📞 {{
                                            merchantProfile.res_mobile }}</p>
                                    </div>
                                </div>

                                <!-- Section: Visitor Address -->
                                <div class="detail-section">
                                    <div class="section-label-row">
                                        <span class="mdi mdi-storefront-outline section-icon"></span>
                                        <span class="section-label">Visitor / Shop Address</span>
                                    </div>
                                    <div class="address-block">
                                        <p class="address-line">{{ [merchantProfile.vister_address,
                                        merchantProfile.v_address1, merchantProfile.v_address2,
                                        merchantProfile.v_address3].filter(Boolean).join(', ') }}</p>
                                        <p class="address-line">{{ merchantProfile.v_city }}, {{ merchantProfile.v_state
                                            }} – {{ merchantProfile.v_pincode }}</p>
                                        <p class="address-line" v-if="merchantProfile.v_mobile">📞 {{
                                            merchantProfile.v_mobile }}</p>
                                    </div>
                                </div>

                                <!-- Location -->
                                <div class="detail-section" v-if="merchantProfile.location?.latitude">
                                    <div class="section-label-row">
                                        <span class="mdi mdi-crosshairs-gps section-icon"></span>
                                        <span class="section-label">Location Coordinates</span>
                                    </div>
                                    <div class="location-chip-row">
                                        <div class="location-chip">
                                            <span class="mdi mdi-latitude"></span>
                                            Lat: {{ merchantProfile.location.latitude }}
                                        </div>
                                        <div class="location-chip">
                                            <span class="mdi mdi-longitude"></span>
                                            Long: {{ merchantProfile.location.longitude }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Confirm checkbox -->
                                <label class="confirm-check-wrap">
                                    <input type="checkbox" v-model="detailsConfirmed" class="confirm-checkbox" />
                                    <span class="confirm-text">I have reviewed all the above details and confirm they
                                        are correct.</span>
                                </label>
                            </template>
                        </div>
                    </template>

                    <!-- ─── STEP 2: OTP Validation ─── -->
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
                            <p class="card-desc">A one-time password has been sent to your registered mobile number.
                                Please enter it below to proceed.</p>
                            <div class="otp-input-wrap">
                                <input v-for="(digit, idx) in otpDigits" :key="idx" :ref="el => otpRefs[idx] = el"
                                    v-model="otpDigits[idx]" class="otp-box" maxlength="1" inputmode="numeric"
                                    @input="onOtpInput(idx)" @keydown.backspace="onOtpBackspace(idx)" />
                            </div>
                            <p class="resend-text">Didn't receive the OTP? <button class="resend-btn"
                                    @click="resendOtp">Resend</button></p>
                        </div>
                    </template>

                    <!-- ─── STEP 3: PAN Verification ─── -->
                    <template v-else-if="step === 3">
                        <div class="card-body">
                            <div class="illustration-wrap">
                                <div class="illustration-circle">
                                    <div class="illustration-inner">
                                        <span class="mdi mdi-card-account-details-outline upload-icon"></span>
                                        <p class="analyzing-text">PAN Verification</p>
                                    </div>
                                </div>
                            </div>
                            <h1 class="card-heading">PAN Card Verification</h1>
                            <p class="card-desc">Enter your PAN details to verify your identity. This is required for
                                KYC compliance.</p>

                            <div class="form-field-wrap">
                                <label class="form-label">PAN Number</label>
                                <input v-model="panNumber" class="form-input" placeholder="e.g. ABCDE1234F"
                                    maxlength="10" style="text-transform:uppercase" />
                            </div>

                            <div class="form-field-wrap">
                                <label class="form-label">Full Name (as on PAN)</label>
                                <input v-model="panName" class="form-input" placeholder="e.g. Jon Snow" />
                            </div>

                            <div class="form-field-wrap">
                                <label class="form-label">Date of Birth</label>
                                <input v-model="panDob" class="form-input" type="date" />
                            </div>
                        </div>
                    </template>

                    <!-- ─── STEP 4: Aadhaar Verification ─── -->
                    <template v-else-if="step === 4">
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
                            <p class="card-desc">Enter your 12-digit Aadhaar number for identity verification. Your data
                                is encrypted and secure.</p>
                            <div class="form-field-wrap">
                                <label class="form-label">Aadhaar Number</label>
                                <input v-model="aadhaarNumber" class="form-input" placeholder="XXXX XXXX XXXX"
                                    maxlength="14" inputmode="numeric" @input="formatAadhaar" />
                            </div>
                        </div>
                    </template>

                    <!-- ─── STEP 5: Biometric Verification ─── -->
                    <template v-else-if="step === 5">
                        <div class="card-body">
                            <div class="illustration-wrap">
                                <div class="illustration-circle">
                                    <div class="illustration-inner">
                                        <span class="mdi mdi-fingerprint upload-icon"
                                            :class="{ 'icon-pulse': biometricScanning }"></span>
                                        <p class="analyzing-text">{{ biometricScanning ? 'Scanning...' : 'Biometric' }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <h1 class="card-heading">Biometric Verification</h1>
                            <p class="card-desc">Place your finger on the biometric device to capture your fingerprint.
                                Ensure the device is connected before proceeding.</p>

                            <!-- Device Status -->
                            <div class="status-list">
                                <div class="status-item" :class="deviceConnected ? 'status-done' : 'status-loading'">
                                    <span v-if="deviceConnected" class="mdi mdi-check-circle status-icon-green"></span>
                                    <div v-else class="spinner-small"></div>
                                    <span class="status-text">{{ deviceConnected ? 'Biometric device connected' :
                                        'Detecting biometric device…' }}</span>
                                </div>
                                <div class="status-item" :class="biometricCaptured ? 'status-done' : 'status-pending'">
                                    <span v-if="biometricCaptured"
                                        class="mdi mdi-check-circle status-icon-green"></span>
                                    <span v-else class="mdi mdi-radiobox-blank status-icon-grey"></span>
                                    <span class="status-text" :class="{ 'status-italic': !biometricCaptured }">
                                        {{ biometricCaptured ? `Fingerprint captured successfully` : `Awaiting
                                        fingerprint scan` }}
                                    </span>
                                </div>
                            </div>

                            <!-- Capture Button -->
                            <div class="form-field-wrap" style="margin-top: 20px;">
                                <button class="btn-capture" :disabled="biometricScanning || biometricCaptured"
                                    @click="captureBiometric">
                                    <span v-if="biometricScanning" class="spinner-btn"></span>
                                    <span v-else class="mdi mdi-fingerprint"></span>
                                    {{ biometricScanning ? 'Scanning…' : biometricCaptured ? 'Fingerprint Captured ✓' :
                                        'Capture Fingerprint' }}
                                </button>
                            </div>

                            <!-- UID Preview (optional debug) -->
                            <div v-if="biometricUID" class="alert-box" style="margin-top: 16px;">
                                <span class="mdi mdi-check-circle alert-icon" style="color: #22c55e;"></span>
                                <p class="alert-text" style="color: #166534;">
                                    <strong>Ready to submit.</strong> Biometric data captured. Click <em>Continue</em>
                                    to complete verification.
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Card Footer Actions -->
                    <div class="card-footer">
                        <button v-if="step.value !== 1" class="btn-back" @click="goBack">
                            <span class="mdi mdi-arrow-left"></span>
                            Back
                        </button>
                        <div class="footer-right-btns">
                            <!-- Step 1: only show Continue (no Retry) -->
                            <button v-if="step === 1 && !initiateError" class="btn-continue"
                                :disabled="loading || fetchingMerchant || !detailsConfirmed"
                                @click="handleStep1Continue">
                                <span v-if="loading" class="spinner-btn"></span>
                                <template v-else>
                                    Verify &amp; Continue
                                    <span class="mdi mdi-arrow-right"></span>
                                </template>
                            </button>

                            <!-- Other steps -->
                            <template v-if="step !== 1">
                                <button class="btn-continue" :disabled="loading" @click="next">
                                    <span v-if="loading" class="spinner-btn"></span>
                                    <template v-else>
                                        Continue
                                        <span class="mdi mdi-arrow-right"></span>
                                    </template>
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Info Cards -->
                <div class="info-cards">
                    <div class="info-card">
                        <div class="info-icon-wrap"><span class="mdi mdi-file-document-outline info-icon"></span></div>
                        <div>
                            <p class="info-title">Required Documents</p>
                            <p class="info-desc">Make sure you have your PAN and Aadhaar details ready for the next
                                steps.</p>
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="info-icon-wrap"><span class="mdi mdi-shield-check-outline info-icon"></span></div>
                        <div>
                            <p class="info-title">Secure Processing</p>
                            <p class="info-desc">Your data is encrypted using industry-standard protocols and is 100%
                                secure.</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>

        <footer class="merchant-footer">
            © 2024 Merchant Portal. All rights reserved. •
            <a href="#" class="footer-link">Privacy Policy</a> •
            <a href="#" class="footer-link">Terms of Service</a>
        </footer>

        <!-- Snackbar -->
        <transition name="snack">
            <div v-if="snackbar.show" class="snackbar" :class="'snackbar-' + snackbar.color">
                <span class="mdi"
                    :class="snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
                <span class="snack-msg">{{ snackbar.message }}</span>
                <button class="snack-close" @click="snackbar.show = false"><span class="mdi mdi-close"></span></button>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useOnboardingStore } from "@/stores/onboading";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const { VendorOnboardingAEPS, getMerchantForOnboarding, validateAEPSOTP, verifyAadhaarAEPS, verifyPANAEPS } = useOnboadingApi();
const Onboarding = useOnboardingStore();
const router = useRouter();

const props = defineProps({ merchantId: String });

const snackbar = reactive({ show: false, message: "", color: "success" });

const steps = [
    { key: "verify-details", label: "Verify" },
    { key: "validate-otp", label: "OTP" },
    { key: "pan-verification", label: "PAN" },
    { key: "aadhar-verification", label: "Aadhaar" },
    { key: "Biometric-Verification", label: "Update Biometric" },
];

const stepSubtitles = [
    "Verify Merchant Details",
    "OTP Validation",
    "PAN Verification",
    "Aadhaar Verification",
    "Biometric Verification"
];

const step = ref(1);
const loading = ref(false);
const fetchingMerchant = ref(true);
const merchantProfile = ref(null);
const detailsConfirmed = ref(false);

const OTPreqid = ref(null);

// initiate error state
const initiateError = ref(false);
const initiateErrorMsg = ref("");
const initiateErrorDetail = ref("");

// OTP
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const panNumber = ref("");
const panName = ref("");
const panDob = ref("");
const aadhaarNumber = ref("");

// Biometric state

const biometricUID = ref("");
const biometricCaptured = ref(false);
const biometricScanning = ref(false);
const deviceConnected = ref(false);

function onOtpInput(idx) {
    if (otpDigits.value[idx] && idx < 5) otpRefs.value[idx + 1]?.focus();
}
function onOtpBackspace(idx) {
    if (!otpDigits.value[idx] && idx > 0) otpRefs.value[idx - 1]?.focus();
}
function formatAadhaar() {
    let v = aadhaarNumber.value.replace(/\D/g, "").slice(0, 12);
    aadhaarNumber.value = v.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function resendOtp() { showSnack("OTP resent successfully", "success"); }
function showSnack(message, color = "success") {
    snackbar.message = message;
    snackbar.color = color;
    snackbar.show = true;
    setTimeout(() => (snackbar.show = false), 4000);
}

function goBack() { if (step.value > 1) step.value--; }
function retry() { showSnack("Retrying current step...", "success"); }

// Simulate device detection + SDK capture (replace internals with your actual biometric SDK call)
async function captureBiometric() {
    biometricScanning.value = true;
    try {
        

        // biometricUID.value = "MjAyNi0wMi0xN1QxMzo1...";
        biometricCaptured.value = true;
        deviceConnected.value = true;
        showSnack("Fingerprint captured successfully!", "success");
    } catch (e) {
        showSnack("Failed to capture fingerprint. Please check the device.", "error");
    } finally {
        biometricScanning.value = false;
    }
}

// ── Step 1 Continue ─────────────────────────────────────────
async function handleStep1Continue() {
    if (!detailsConfirmed.value) {
        showSnack("Please confirm you have reviewed the details", "error");
        return;
    }
    initiateError.value = false;
    loading.value = true;
    try {
        const res = await VendorOnboardingAEPS({ merchantId: props.merchantId });

        // Success path: check otp_status
        if (res.statusCode === "00" && res.otp_status === true) {
            OTPreqid.value = res.data?.otp_reqid || res.otp_reqid || null;
            showSnack(res.data?.message || res.message || "OTP sent successfully!", "success");
            step.value = 2;
            return;
        }

        // Some APIs return non-00 but otp_status still true (e.g. "Duplicate Reference")
        if (res.otp_status === true) {
            OTPreqid.value = res.data?.otp_reqid || res.otp_reqid || "";
            showSnack("OTP already sent. Proceeding to verification.", "success");
            step.value = 2;
            return;
        }

        // Failure path
        initiateError.value = true;
        initiateErrorMsg.value = res.data?.response || res.message || "Failed to initiate AEPS Onboarding";
        initiateErrorDetail.value = `Ref: ${res.data?.error || res.error} · Code: ${res.statusCode || res.data?.statusCode}` || "Failed to initiate AEPS Onboarding";
        showSnack(initiateErrorMsg.value, "error");

    } catch (err) {
        initiateError.value = true;
        initiateErrorMsg.value = "Network error. Please check your connection.";
        initiateErrorDetail.value = err.message || "Failed to initiate AEPS Onboarding";
        showSnack("Failed to connect. Please retry.", "error");
        console.error("AEPS Onboarding error", err);
    } finally {
        loading.value = false;
    }
}

function retryInitiate() {
    handleStep1Continue()
}

// ── Other steps Continue ─────────────────────────────────────
const next = async () => {
    if (step.value === 2) {
        const otp = otpDigits.value.join("");
        if (otp.length < 6) { showSnack("Please enter the complete 6-digit OTP", "error"); return; }
        if (!OTPreqid.value) { showSnack("OTP request ID missing. Please retry.", "error"); step.value = 1; return; }
        try {
            loading.value = true
            const payload = {
                otp: otp,
                otpreqid: OTPreqid.value,
                merchantId: props.merchantId,
            }

            console.log("Validate OTP Payload", payload);

            const res = await validateAEPSOTP(payload);

            if (res.statusCode == "00") {
                showSnack(res.data?.message || res.message || "OTP verified successfully!", "success");
            } else {
                showSnack(res.data?.message || res.message || "OTP verification failed. Please try again.", "error");
                return;
            }

            console.log("Validate OTP Response", res);

        } catch (e) {
            showSnack("OTP verification failed. Please try again.", "error");
            return;
        } finally {
            loading.value = false;
        }
    }

    if (step.value === 3) {
        if (panNumber.value.length < 10) {
            showSnack("Please enter a valid 10-character PAN number", "error"); return;
        }
        if (!panName.value.trim()) {
            showSnack("Please enter your full name as on PAN card", "error"); return;
        }
        if (!panDob.value) {
            showSnack("Please enter your date of birth", "error"); return;
        }

        const [y, m, d] = panDob.value.split("-");
        const formattedDob = `${d}/${m}/${y}`;

        try {
            loading.value = true;
            const payload = {
                pan: panNumber.value.toUpperCase(),
                name: panName.value.trim().toUpperCase(),
                dob: formattedDob,
                merchantId: props.merchantId,
            };

            console.log("PAN Verification Payload", payload);

            const res = await verifyPANAEPS(payload);

            if (res.statusCode == "00") {
                showSnack(res.data?.message || res.message || "PAN verified successfully!", "success");
            } else {
                showSnack(res.data?.message || res.message || "PAN verification failed. Please try again.", "error");
                return;
            }

            console.log("PAN Verification Response", res);

        } catch (e) {
            showSnack("PAN verification failed. Please try again.", "error");
            return;
        } finally {
            loading.value = false;
        }
    }

    if (step.value === 4) {
        const raw = aadhaarNumber.value.replace(/\s/g, "");
        if (raw.length < 12) {
            showSnack("Please enter a valid 12-digit Aadhaar number", "error"); return;
        }

        try {
            loading.value = true;
            const payload = {
                aadhaarno: raw,
                merchantId: props.merchantId,
            };

            console.log("Aadhaar Verification Payload", payload);

            const res = await verifyAadhaarAEPS(payload);

            if (res.statusCode == "00") {
                showSnack(res.data?.message || res.message || "Aadhaar verified successfully!", "success");
            } else {
                showSnack(res.data?.message || res.message || "Aadhaar verification failed. Please try again.", "error");
                return;
            }

            console.log("Aadhaar Verification Response", res);

        } catch (e) {
            showSnack("Aadhaar verification failed. Please try again.", "error");
            return;
        } finally {
            loading.value = false;
        }
    }

    if (step.value === 5) {
        if (!biometricCaptured.value || !biometricUID.value) {
            showSnack("Please capture your fingerprint before continuing.", "error"); return;
        }

        try {
            loading.value = true;
            const payload = {
                uid: biometricUID.value,
                merchantId: props.merchantId,
            };

            console.log("Biometric Verification Payload", payload);

            const res = await submitBiometricAEPS(payload); // 👈 replace with your actual composable call

            if (res.statusCode == "00") {
                showSnack(res.data?.message || res.message || "Biometric verified successfully!", "success");
            } else {
                showSnack(res.data?.message || res.message || "Biometric verification failed. Please try again.", "error");
                return;
            }

            console.log("Biometric Verification Response", res);

        } catch (e) {
            showSnack("Biometric verification failed. Please try again.", "error");
            return;
        } finally {
            loading.value = false;
        }
    }

    if (step.value < steps.length) {
        loading.value = true;
        await new Promise(r => setTimeout(r, 600));
        loading.value = false;
        step.value++;
    } else {
        showSnack("Onboarding complete!", "success");
    }
};

onMounted(async () => {
    if (props.merchantId) {
        try {
            const res = await getMerchantForOnboarding(props.merchantId);
            if (res?.statusCode === "00" && res.data) {
                merchantProfile.value = res.data;
            } else {
                showSnack("Failed to load merchant details", "error");
            }
        } catch (e) {
            showSnack("Could not fetch merchant profile", "error");
        } finally {
            fetchingMerchant.value = false;
        }
    } else {
        fetchingMerchant.value = false;
    }
});
</script>

<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.merchant-root {
    font-family: 'Inter', sans-serif;
    background: #f6f6f8;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ── Header ── */
.merchant-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 14px 24px;
    position: sticky;
    top: 0;
    z-index: 50;
}

@media (min-width: 768px) {
    .merchant-header {
        padding: 14px 80px;
    }
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.brand-icon {
    width: 32px;
    height: 32px;
    background: #1142d4;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
}

.brand-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
}

/* ── Main ── */
.merchant-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16px 40px;
}

.content-wrapper {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* ── Stepper ── */
.stepper-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.stepper-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 8px;
}

.stepper-title {
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
}

.stepper-subtitle {
    font-size: 13px;
    color: #64748b;
    margin-top: 2px;
}

.active-badge {
    font-size: 10px;
    font-weight: 700;
    color: #1142d4;
    background: rgba(17, 66, 212, 0.08);
    padding: 4px 10px;
    border-radius: 9999px;
    white-space: nowrap;
    flex-shrink: 0;
}

.stepper-track {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.track-bg {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 4px;
    background: #f1f5f9;
    border-radius: 4px;
    z-index: 0;
}

.track-fill {
    position: absolute;
    top: 20px;
    left: 0;
    height: 4px;
    background: #1142d4;
    border-radius: 4px;
    z-index: 1;
    transition: width 0.4s ease;
}

.step-node {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    transition: all 0.3s;
}

.step-active {
    background: #1142d4;
    color: #fff;
    box-shadow: 0 4px 16px rgba(17, 66, 212, 0.25);
}

.step-done {
    background: #1142d4;
    color: #fff;
}

.step-pending {
    background: #f1f5f9;
    color: #94a3b8;
}

.step-icon {
    font-size: 18px;
}

.step-num {
    font-size: 14px;
    font-weight: 700;
}

.step-label {
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
    text-align: center;
}

.step-label-active {
    color: #0f172a;
    font-weight: 700;
}

/* ── Main Card ── */
.main-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
    overflow: hidden;
}

/* ── Step 1 Specific ── */
.step1-body {
    padding: 24px !important;
    align-items: stretch !important;
    text-align: left !important;
}

@media (min-width: 640px) {
    .step1-body {
        padding: 32px !important;
    }
}

/* Skeleton */
.skeleton-wrap {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 8px 0;
}

.skeleton-title {
    width: 55%;
    height: 20px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton-row {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton-row:nth-child(odd) {
    width: 100%;
}

.skeleton-row:nth-child(even) {
    width: 80%;
}

@keyframes shimmer {
    to {
        background-position: -200% 0;
    }
}

/* Error State */
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px 0 8px;
    gap: 14px;
}

.error-icon-wrap {
    position: relative;
    width: 80px;
    height: 80px;
}

.error-icon-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #fff1f2;
    border: 2px solid #fecdd3;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
}

.error-icon-mdi {
    font-size: 36px;
    color: #e11d48;
}

.error-pulse {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid rgba(225, 29, 72, 0.25);
    animation: error-ripple 2s ease-out infinite;
}

@keyframes error-ripple {
    0% {
        transform: scale(0.9);
        opacity: 1;
    }

    100% {
        transform: scale(1.3);
        opacity: 0;
    }
}

.error-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
}

.error-desc {
    font-size: 14px;
    color: #64748b;
    max-width: 340px;
    line-height: 1.5;
}

.error-detail-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff1f2;
    border: 1px solid #fecdd3;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: #e11d48;
    font-weight: 600;
    max-width: 360px;
}

.error-detail-box .mdi {
    font-size: 15px;
    flex-shrink: 0;
}

.btn-retry-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 28px;
    border-radius: 10px;
    background: #1142d4;
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(17, 66, 212, 0.3);
    transition: filter 0.15s;
}

.btn-retry-error:hover {
    filter: brightness(1.1);
}

.btn-retry-error .mdi {
    font-size: 16px;
}

/* Verify Layout */
.verify-header {
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(135deg, rgba(17, 66, 212, 0.05), rgba(17, 66, 212, 0.02));
    border: 1px solid rgba(17, 66, 212, 0.12);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
}

.verify-avatar {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1142d4, #2255e8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(17, 66, 212, 0.3);
}

.verify-header-text {
    flex: 1;
    min-width: 0;
}

.verify-name {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
}

.verify-biz {
    font-size: 13px;
    color: #64748b;
    margin-top: 2px;
}

.verify-badge {
    display: inline-block;
    margin-top: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    background: rgba(17, 66, 212, 0.1);
    color: #1142d4;
    padding: 3px 10px;
    border-radius: 9999px;
}

.verify-instruction {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: #92400e;
    line-height: 1.5;
    margin-bottom: 20px;
}

.verify-instruction .mdi {
    font-size: 15px;
    color: #d97706;
    flex-shrink: 0;
    margin-top: 1px;
}

/* Detail Sections */
.detail-section {
    margin-bottom: 20px;
}

.section-label-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 10px;
}

.section-icon {
    font-size: 15px;
    color: #1142d4;
}

.section-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1142d4;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

@media (max-width: 480px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }
}

.detail-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.di-key {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.di-val {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    word-break: break-word;
}

.di-val-link {
    color: #1142d4;
    word-break: break-all;
}

.address-block {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.address-line {
    font-size: 13px;
    color: #334155;
    line-height: 1.5;
}

.location-chip-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.location-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f0f4ff;
    border: 1px solid rgba(17, 66, 212, 0.15);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 700;
    color: #1142d4;
}

.location-chip .mdi {
    font-size: 14px;
}

/* Confirm Checkbox */
.confirm-check-wrap {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #f0f4ff;
    border: 1.5px solid rgba(17, 66, 212, 0.2);
    border-radius: 10px;
    padding: 14px 16px;
    cursor: pointer;
    margin-top: 8px;
}

.confirm-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #1142d4;
    flex-shrink: 0;
    margin-top: 2px;
    cursor: pointer;
}

.confirm-text {
    font-size: 13px;
    font-weight: 500;
    color: #1e3a8a;
    line-height: 1.5;
}

/* ── Default card body ── */
.card-body {
    padding: 32px 24px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

@media (min-width: 768px) {
    .card-body {
        padding: 48px;
    }
}

/* Illustration */
.illustration-wrap {
    position: relative;
    width: 100%;
    max-width: 280px;
    margin-bottom: 32px;
}

.illustration-circle {
    aspect-ratio: 1;
    background: linear-gradient(135deg, rgba(17, 66, 212, 0.05), rgba(17, 66, 212, 0.15));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.illustration-inner {
    width: 55%;
    height: 55%;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 20px;
}

.upload-icon {
    font-size: 52px;
    color: #1142d4;
    display: block;
}

.analyzing-text {
    font-size: 9px;
    font-weight: 700;
    color: #1142d4;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.card-heading {
    font-size: 22px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
}

@media (min-width: 640px) {
    .card-heading {
        font-size: 28px;
    }
}

.card-desc {
    font-size: 15px;
    color: #64748b;
    line-height: 1.6;
    max-width: 420px;
    margin: 0 auto;
}

/* OTP */
.otp-input-wrap {
    display: flex;
    gap: 10px;
    margin-top: 24px;
    justify-content: center;
    flex-wrap: wrap;
}

.otp-box {
    width: 46px;
    height: 52px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    outline: none;
    transition: border-color 0.2s;
    background: #f8fafc;
}

.otp-box:focus {
    border-color: #1142d4;
    background: #fff;
}

.resend-text {
    margin-top: 16px;
    font-size: 13px;
    color: #64748b;
}

.resend-btn {
    color: #1142d4;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
}

/* Form Fields */
.form-field-wrap {
    width: 100%;
    max-width: 380px;
    margin-top: 24px;
    text-align: left;
}

.form-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    display: block;
    margin-bottom: 8px;
}

.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 15px;
    color: #0f172a;
    outline: none;
    transition: border-color 0.2s;
    background: #f8fafc;
    font-family: inherit;
}

.form-input:focus {
    border-color: #1142d4;
    background: #fff;
}

/* Card Footer */
.card-footer {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
}

@media (min-width: 640px) {
    .card-footer {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 20px 32px;
    }
}

.btn-back {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
    justify-content: center;
}

.btn-back:hover {
    background: #f1f5f9;
}

.footer-right-btns {
    display: flex;
    gap: 12px;
    align-items: center;
}

@media (max-width: 639px) {
    .footer-right-btns {
        width: 100%;
    }
}

.btn-retry {
    flex: 1;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    background: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-retry:hover {
    background: #f8fafc;
}

@media (min-width: 640px) {
    .btn-retry {
        flex: unset;
    }
}

.btn-continue {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 28px;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    background: #1142d4;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(17, 66, 212, 0.25);
    transition: filter 0.15s, opacity 0.15s;
}

.btn-continue:hover:not(:disabled) {
    filter: brightness(1.08);
}

.btn-continue:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (min-width: 640px) {
    .btn-continue {
        flex: unset;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spinner-btn {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
}

/* Info Cards */
.info-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

@media (min-width: 640px) {
    .info-cards {
        flex-direction: row;
    }
}

.info-card {
    flex: 1;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 20px;
    border: 1.5px dashed #cbd5e1;
    border-radius: 12px;
    background: #fff;
}

.info-icon-wrap {
    padding: 8px;
    background: rgba(17, 66, 212, 0.08);
    border-radius: 8px;
    color: #1142d4;
    flex-shrink: 0;
}

.info-icon {
    font-size: 20px;
    display: block;
}

.info-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
}

.info-desc {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
    line-height: 1.5;
}

/* Footer */
.merchant-footer {
    padding: 28px 24px;
    text-align: center;
    font-size: 11px;
    color: #94a3b8;
}

.footer-link {
    color: #94a3b8;
    text-decoration: underline;
    transition: color 0.15s;
}

.footer-link:hover {
    color: #1142d4;
}

/* Snackbar */
.snackbar {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    z-index: 9999;
    max-width: calc(100vw - 40px);
}

.snackbar-success {
    background: #1142d4;
}

.snackbar-error {
    background: #ef4444;
}

.snack-msg {
    flex: 1;
}

.snack-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    font-size: 16px;
}

.snack-enter-active,
.snack-leave-active {
    transition: all 0.3s ease;
}

.snack-enter-from,
.snack-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}

/* Biometric */

.btn-capture {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    max-width: 320px;
    padding: 12px 24px;
    border-radius: 10px;
    background: #1142d4;
    color: #fff;
    border: none;
    font-size: 14px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(17, 66, 212, 0.25);
    transition: filter 0.15s, opacity 0.15s;
}

.btn-capture:hover:not(:disabled) {
    filter: brightness(1.08);
}

.btn-capture:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-capture .mdi {
    font-size: 18px;
}
</style>