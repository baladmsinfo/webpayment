<template>
  <div class="merchant-root">
    <!-- ── Top Navigation ── -->
    <header class="merchant-header">
      <div class="header-brand">
        <div class="brand-icon">
          <span class="mdi mdi-wallet-outline"></span>
        </div>
        <h2 class="brand-title">Merchant Onboarding</h2>
      </div>
      <!-- Mobile-only step pill -->
      <div class="header-step-pill">
        <span class="mdi mdi-layers-outline"></span>
        {{ step }} / {{ steps.length }}
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
              <p class="stepper-subtitle">
                Step {{ step }} of {{ steps.length }}:
                {{ stepSubtitles[step - 1] }}
              </p>
            </div>
            <div class="active-badge">ACTIVE</div>
          </div>

          <!-- Desktop track (≥560px) -->
          <div class="stepper-track desktop-stepper">
            <div class="track-bg"></div>
            <div
              class="track-fill"
              :style="{ width: ((step - 1) / (steps.length - 1)) * 100 + '%' }"
            ></div>
            <div v-for="(s, i) in steps" :key="s.key" class="step-node">
              <div
                class="step-circle"
                :class="{
                  'step-active': step === i + 1,
                  'step-done': step > i + 1,
                  'step-pending': step < i + 1,
                }"
              >
                <span
                  v-if="step > i + 1"
                  class="mdi mdi-check step-icon"
                ></span>
                <span
                  v-else-if="step === i + 1 && i === 0"
                  class="mdi mdi-account-check-outline step-icon"
                ></span>
                <span
                  v-else-if="step === i + 1 && i === 1"
                  class="mdi mdi-shield-key-outline step-icon"
                ></span>
                <span
                  v-else-if="step === i + 1 && i === 2"
                  class="mdi mdi-card-account-details-outline step-icon"
                ></span>
                <span
                  v-else-if="step === i + 1 && i === 3"
                  class="mdi mdi-fingerprint step-icon"
                ></span>
                <span v-else class="step-num">{{ i + 1 }}</span>
              </div>
              <span
                class="step-label"
                :class="{ 'step-label-active': step === i + 1 }"
                >{{ s.label }}</span
              >
            </div>
          </div>

          <!-- Mobile track (<560px) -->
          <div class="mobile-stepper">
            <div class="mobile-stepper-bar">
              <div class="mobile-bar-bg"></div>
              <div
                class="mobile-bar-fill"
                :style="{
                  width: ((step - 1) / (steps.length - 1)) * 100 + '%',
                }"
              ></div>
              <div v-for="(s, i) in steps" :key="s.key" class="mobile-dot-wrap">
                <div
                  class="mobile-dot"
                  :class="{
                    'mobile-dot-active': step === i + 1,
                    'mobile-dot-done': step > i + 1,
                    'mobile-dot-pending': step < i + 1,
                  }"
                >
                  <span
                    v-if="step > i + 1"
                    class="mdi mdi-check"
                    style="font-size: 10px"
                  ></span>
                  <span v-else style="font-size: 9px; font-weight: 700">{{
                    i + 1
                  }}</span>
                </div>
              </div>
            </div>
            <p class="mobile-step-label">
              <span
                class="mdi mdi-chevron-right"
                style="font-size: 13px; vertical-align: middle"
              ></span>
              {{ stepSubtitles[step - 1] }}
            </p>
          </div>
        </div>

        <!-- ── Main Card ── -->
        <div class="main-card">
          <!-- STEP 1: Merchant Verification -->
          <template v-if="step === 1">
            <div class="card-body step1-body">
              <template v-if="fetchingMerchant">
                <div class="skeleton-wrap">
                  <div class="skeleton-title"></div>
                  <div class="skeleton-row" v-for="n in 6" :key="n"></div>
                </div>
              </template>
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
                    <span class="mdi mdi-information-outline"></span
                    ><span>{{ initiateErrorDetail }}</span>
                  </div>
                  <button class="btn-retry-error" @click="retryInitiate">
                    <span class="mdi mdi-refresh"></span> Try Again
                  </button>
                </div>
              </template>
              <template v-else-if="merchantProfile">
                <div class="verify-header">
                  <div class="verify-avatar">
                    <span class="mdi mdi-store-outline"></span>
                  </div>
                  <div class="verify-header-text">
                    <h2 class="verify-name">
                      {{ merchantProfile.merchant_name }}
                    </h2>
                    <p class="verify-biz">
                      {{ merchantProfile.business_name }}
                    </p>
                    <span class="verify-badge">{{
                      merchantProfile.business_type
                    }}</span>
                  </div>
                </div>
                <p class="verify-instruction">
                  <span class="mdi mdi-information-outline"></span>Please review
                  your details carefully before proceeding. Once confirmed, you
                  cannot edit these.
                </p>
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-briefcase-outline section-icon"></span
                    ><span class="section-label">Business Information</span>
                  </div>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="di-key">DBA Name</span
                      ><span class="di-val">{{
                        merchantProfile.dba_name || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Business Type</span
                      ><span class="di-val">{{
                        merchantProfile.business_type || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Nature of Business</span
                      ><span class="di-val">{{
                        merchantProfile.nature_of_business || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Annual Turnover</span
                      ><span class="di-val">{{
                        merchantProfile.annual_turn_over || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Date of Birth</span
                      ><span class="di-val">{{
                        merchantProfile.business_dob || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Gender</span
                      ><span class="di-val">{{
                        merchantProfile.gender === "M"
                          ? "Male"
                          : merchantProfile.gender === "F"
                          ? "Female"
                          : merchantProfile.gender || "—"
                      }}</span>
                    </div>
                    <div class="detail-item di-full">
                      <span class="di-key">Website</span
                      ><span class="di-val di-val-link">{{
                        merchantProfile.website || "—"
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-phone-outline section-icon"></span
                    ><span class="section-label">Contact Details</span>
                  </div>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <span class="di-key">Primary Email</span
                      ><span class="di-val">{{
                        merchantProfile.primary_email_id || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Primary Mobile</span
                      ><span class="di-val">{{
                        merchantProfile.primary_mobile || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Beneficiary Email</span
                      ><span class="di-val">{{
                        merchantProfile.beneficiary_email || "—"
                      }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="di-key">Beneficiary Mobile</span
                      ><span class="di-val">{{
                        merchantProfile.beneficiary_mobile || "—"
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-map-marker-outline section-icon"></span
                    ><span class="section-label">Official Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">
                      {{
                        [
                          merchantProfile.official_address,
                          merchantProfile.address1,
                          merchantProfile.address2,
                          merchantProfile.address3,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      }}
                    </p>
                    <p class="address-line">
                      {{ merchantProfile.city }}, {{ merchantProfile.state }} –
                      {{ merchantProfile.pincode }}
                    </p>
                    <p class="address-line" v-if="merchantProfile.phone">
                      📞 {{ merchantProfile.phone }}
                    </p>
                  </div>
                </div>
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-home-outline section-icon"></span
                    ><span class="section-label">Residential Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">
                      {{
                        [
                          merchantProfile.residential_address,
                          merchantProfile.res_address1,
                          merchantProfile.res_address2,
                          merchantProfile.res_address3,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      }}
                    </p>
                    <p class="address-line">
                      {{ merchantProfile.res_city }},
                      {{ merchantProfile.res_state }} –
                      {{ merchantProfile.res_pincode }}
                    </p>
                    <p class="address-line" v-if="merchantProfile.res_mobile">
                      📞 {{ merchantProfile.res_mobile }}
                    </p>
                  </div>
                </div>
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-storefront-outline section-icon"></span
                    ><span class="section-label">Visitor / Shop Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">
                      {{
                        [
                          merchantProfile.vister_address,
                          merchantProfile.v_address1,
                          merchantProfile.v_address2,
                          merchantProfile.v_address3,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      }}
                    </p>
                    <p class="address-line">
                      {{ merchantProfile.v_city }},
                      {{ merchantProfile.v_state }} –
                      {{ merchantProfile.v_pincode }}
                    </p>
                    <p class="address-line" v-if="merchantProfile.v_mobile">
                      📞 {{ merchantProfile.v_mobile }}
                    </p>
                  </div>
                </div>
                <div
                  class="detail-section"
                  v-if="merchantProfile.location?.latitude"
                >
                  <div class="section-label-row">
                    <span class="mdi mdi-crosshairs-gps section-icon"></span
                    ><span class="section-label">Location Coordinates</span>
                  </div>
                  <div class="location-chip-row">
                    <div class="location-chip">
                      <span class="mdi mdi-latitude"></span>Lat:
                      {{ merchantProfile.location.latitude }}
                    </div>
                    <div class="location-chip">
                      <span class="mdi mdi-longitude"></span>Long:
                      {{ merchantProfile.location.longitude }}
                    </div>
                  </div>
                </div>
                <label class="confirm-check-wrap">
                  <input
                    type="checkbox"
                    v-model="detailsConfirmed"
                    class="confirm-checkbox"
                  />
                  <span class="confirm-text"
                    >I have reviewed all the above details and confirm they are
                    correct.</span
                  >
                </label>
              </template>
            </div>
          </template>

          <!-- STEP 2: OTP -->
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
              <p class="card-desc">
                A one-time password has been sent to your registered mobile
                number. Please enter it below to proceed.
              </p>
              <div class="otp-input-wrap">
                <input
                  v-for="(digit, idx) in otpDigits"
                  :key="idx"
                  :ref="(el) => (otpRefs[idx] = el)"
                  v-model="otpDigits[idx]"
                  class="otp-box"
                  maxlength="1"
                  inputmode="numeric"
                  @input="onOtpInput(idx)"
                  @keydown.backspace="onOtpBackspace(idx)"
                />
              </div>
              <p class="resend-text">
                Didn't receive the OTP?
                <button class="resend-btn" @click="resendOtp">Resend</button>
              </p>
            </div>
          </template>

          <!-- STEP 3: PAN -->
          <template v-else-if="step === 3">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span
                      class="mdi mdi-card-account-details-outline upload-icon"
                    ></span>
                    <p class="analyzing-text">PAN Verification</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">PAN Card Verification</h1>
              <p class="card-desc">
                Enter your PAN details to verify your identity. This is required
                for KYC compliance.
              </p>
              <div class="form-field-wrap">
                <label class="form-label">PAN Number</label
                ><input
                  v-model="panNumber"
                  class="form-input"
                  placeholder="e.g. ABCDE1234F"
                  maxlength="10"
                  style="text-transform: uppercase"
                />
              </div>
              <div class="form-field-wrap">
                <label class="form-label">Full Name (as on PAN)</label
                ><input
                  v-model="panName"
                  class="form-input"
                  placeholder="e.g. Jon Snow"
                />
              </div>
              <div class="form-field-wrap">
                <label class="form-label">Date of Birth</label
                ><input v-model="panDob" class="form-input" type="date" />
              </div>
            </div>
          </template>

          <!-- STEP 4: Aadhaar -->
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
              <p class="card-desc">
                Enter your 12-digit Aadhaar number for identity verification.
                Your data is encrypted and secure.
              </p>
              <div class="form-field-wrap">
                <label class="form-label">Aadhaar Number</label
                ><input
                  v-model="aadhaarNumber"
                  class="form-input"
                  placeholder="XXXX XXXX XXXX"
                  maxlength="14"
                  inputmode="numeric"
                  @input="formatAadhaar"
                />
              </div>
            </div>
          </template>

          <!-- STEP 5: Biometric -->
          <template v-else-if="step === 5">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span
                      class="mdi mdi-fingerprint upload-icon"
                      :class="{ 'icon-pulse': biometricScanning }"
                    ></span>
                    <p class="analyzing-text">
                      {{ biometricScanning ? "Scanning..." : "Biometric" }}
                    </p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Biometric Verification</h1>
              <p class="card-desc">
                Place your finger on the biometric device to capture your
                fingerprint. Ensure the device is connected before proceeding.
              </p>
              <div class="status-list">
                <div
                  class="status-item"
                  :class="deviceConnected ? 'status-done' : 'status-loading'"
                >
                  <span
                    v-if="deviceConnected"
                    class="mdi mdi-check-circle status-icon-green"
                  ></span>
                  <div v-else class="spinner-small"></div>
                  <span class="status-text">{{
                    deviceConnected
                      ? "Biometric device connected"
                      : "Detecting biometric device…"
                  }}</span>
                </div>
                <div
                  class="status-item"
                  :class="biometricCaptured ? 'status-done' : 'status-pending'"
                >
                  <span
                    v-if="biometricCaptured"
                    class="mdi mdi-check-circle status-icon-green"
                  ></span>
                  <span
                    v-else
                    class="mdi mdi-radiobox-blank status-icon-grey"
                  ></span>
                  <span
                    class="status-text"
                    :class="{ 'status-italic': !biometricCaptured }"
                    >{{
                      biometricCaptured
                        ? "Fingerprint captured successfully"
                        : "Awaiting fingerprint scan"
                    }}</span
                  >
                </div>
              </div>
              <div class="form-field-wrap" style="margin-top: 20px">
                <button
                  class="btn-capture"
                  :disabled="biometricCaptured"
                  @click="openBiometricDialog"
                >
                  <span class="mdi mdi-fingerprint"></span>
                  {{
                    biometricCaptured
                      ? "Fingerprint Captured ✓"
                      : "Capture Fingerprint"
                  }}
                </button>
              </div>
              <div
                v-if="biometricCaptured"
                class="alert-box"
                style="margin-top: 16px"
              >
                <span
                  class="mdi mdi-check-circle alert-icon"
                  style="color: #22c55e"
                ></span>
                <p class="alert-text" style="color: #166534">
                  <strong>Ready to submit.</strong> Biometric data captured.
                  Click <em>Continue</em> to complete verification.
                </p>
              </div>
              <div v-if="biometricUID" class="uid-chip">
                <span class="uid-chip-label">UID</span>
                <span class="uid-chip-value">{{ biometricUID }}</span>
              </div>
            </div>
          </template>

          <!-- ── Card Footer ── -->
          <div class="card-footer">
            <button v-if="step !== 1" class="btn-back" @click="goBack">
              <span class="mdi mdi-arrow-left"></span>
              <span class="btn-back-label">Back</span>
            </button>
            <div class="footer-right-btns">
              <button
                v-if="step === 1 && !initiateError"
                class="btn-continue"
                :disabled="loading || fetchingMerchant || !detailsConfirmed"
                @click="handleStep1Continue"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>
                  <span class="btn-label-full">Verify &amp; Continue</span>
                  <span class="btn-label-short">Verify</span>
                  <span class="mdi mdi-arrow-right"></span>
                </template>
              </button>
              <template v-if="step !== 1">
                <button class="btn-continue" :disabled="loading" @click="next">
                  <span v-if="loading" class="spinner-btn"></span>
                  <template v-else
                    >Continue <span class="mdi mdi-arrow-right"></span
                  ></template>
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- ── Info Cards ── -->
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon-wrap">
              <span class="mdi mdi-file-document-outline info-icon"></span>
            </div>
            <div>
              <p class="info-title">Required Documents</p>
              <p class="info-desc">
                Make sure you have your PAN and Aadhaar details ready for the
                next steps.
              </p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon-wrap">
              <span class="mdi mdi-shield-check-outline info-icon"></span>
            </div>
            <div>
              <p class="info-title">Secure Processing</p>
              <p class="info-desc">
                Your data is encrypted using industry-standard protocols and is
                100% secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="merchant-footer">
      © 2024 Merchant Portal. All rights reserved.
      <span class="footer-sep">•</span
      ><a href="#" class="footer-link">Privacy Policy</a>
      <span class="footer-sep">•</span
      ><a href="#" class="footer-link">Terms of Service</a>
    </footer>

    <!-- ── Snackbar ── -->
    <transition name="snack">
      <div
        v-if="snackbar.show"
        class="snackbar"
        :class="'snackbar-' + snackbar.color"
      >
        <span
          class="mdi"
          :class="
            snackbar.color === 'success'
              ? 'mdi-check-circle-outline'
              : 'mdi-alert-circle-outline'
          "
        ></span>
        <span class="snack-msg">{{ snackbar.message }}</span>
        <button class="snack-close" @click="snackbar.show = false">
          <span class="mdi mdi-close"></span>
        </button>
      </div>
    </transition>

    <!-- ════════════════════════════════
             BIOMETRIC DIALOG
        ════════════════════════════════ -->
    <transition name="dialog-fade">
      <div
        v-if="bioDialog.open"
        class="bio-overlay"
        @click.self="closeBioDialog"
      >
        <div class="bio-dialog" role="dialog" aria-modal="true">
          <!-- Mobile drag handle -->
          <div class="bio-drag-handle"></div>

          <!-- Header -->
          <div class="bio-dialog-header">
            <div class="bio-dialog-title-row">
              <div class="bio-header-icon">
                <span class="mdi mdi-fingerprint"></span>
              </div>
              <div>
                <h3 class="bio-dialog-title">Biometric Capture</h3>
                <p class="bio-dialog-sub">RD Device · Port 11100</p>
              </div>
            </div>
            <button
              class="bio-close-btn"
              @click="closeBioDialog"
              :disabled="bioDialog.scanning"
            >
              <span class="mdi mdi-close"></span>
            </button>
          </div>

          <!-- Body -->
          <div class="bio-dialog-body">
            <!-- Scanner -->
            <div class="bio-scanner-wrap">
              <div
                class="bio-ripple"
                :class="{ 'bio-ripple-active': bioDialog.state === 'scanning' }"
              ></div>
              <div
                class="bio-ripple bio-ripple-2"
                :class="{ 'bio-ripple-active': bioDialog.state === 'scanning' }"
              ></div>
              <div
                class="bio-ring-arc"
                :class="{
                  'bio-ring-spin':
                    bioDialog.state === 'detecting' ||
                    bioDialog.state === 'scanning',
                }"
              ></div>
              <div
                class="bio-core"
                :class="{
                  'bio-core-scanning': bioDialog.state === 'scanning',
                  'bio-core-success': bioDialog.state === 'captured',
                  'bio-core-error': bioDialog.state === 'error',
                }"
              >
                <div
                  class="bio-scan-line"
                  :class="{ 'bio-scan-active': bioDialog.state === 'scanning' }"
                ></div>
                <span
                  class="mdi bio-fp-icon"
                  :class="{
                    'mdi-fingerprint': bioDialog.state !== 'captured',
                    'mdi-check-circle-outline': bioDialog.state === 'captured',
                    'bio-fp-idle':
                      bioDialog.state === 'idle' ||
                      bioDialog.state === 'detecting',
                    'bio-fp-scanning': bioDialog.state === 'scanning',
                    'bio-fp-success': bioDialog.state === 'captured',
                    'bio-fp-error': bioDialog.state === 'error',
                  }"
                ></span>
                <span
                  class="bio-core-label"
                  :class="{
                    'bio-label-scanning': bioDialog.state === 'scanning',
                    'bio-label-success': bioDialog.state === 'captured',
                  }"
                  >{{ bioDialog.coreLabel }}</span
                >
              </div>
            </div>

            <!-- Status -->
            <div class="bio-status-block">
              <p class="bio-status-title">{{ bioDialog.statusTitle }}</p>
              <p class="bio-status-desc">{{ bioDialog.statusDesc }}</p>
            </div>

            <!-- Progress -->
            <div class="bio-progress-track">
              <div
                class="bio-progress-fill"
                :style="{ width: bioDialog.progress }"
              ></div>
            </div>

            <!-- Checklist -->
            <div class="bio-checklist">
              <div
                class="bio-check-row"
                :class="{ 'bio-check-done': bioDialog.deviceConnected }"
              >
                <div
                  v-if="bioDialog.state === 'detecting'"
                  class="spinner-small"
                ></div>
                <span
                  v-else-if="bioDialog.deviceConnected"
                  class="mdi mdi-check-circle status-icon-green"
                ></span>
                <span
                  v-else
                  class="mdi mdi-alert-circle"
                  style="color: #ef4444; font-size: 18px"
                ></span>
                <span class="bio-check-text">{{
                  bioDialog.deviceConnected
                    ? "RD device connected"
                    : bioDialog.state === "detecting"
                    ? "Detecting biometric device…"
                    : "No device found"
                }}</span>
                <span
                  v-if="bioDialog.deviceConnected"
                  class="bio-badge bio-badge-ok"
                  >OK</span
                >
                <span
                  v-else-if="bioDialog.state === 'detecting'"
                  class="bio-badge bio-badge-scanning"
                  >Detecting</span
                >
              </div>
              <div
                class="bio-check-row"
                :class="{ 'bio-check-done': bioDialog.state === 'captured' }"
              >
                <div
                  v-if="bioDialog.state === 'scanning'"
                  class="spinner-small"
                ></div>
                <span
                  v-else-if="bioDialog.state === 'captured'"
                  class="mdi mdi-check-circle status-icon-green"
                ></span>
                <span
                  v-else
                  class="mdi mdi-radiobox-blank"
                  style="color: #94a3b8; font-size: 18px"
                ></span>
                <span class="bio-check-text">{{
                  bioDialog.state === "scanning"
                    ? "Capturing — keep finger still…"
                    : bioDialog.state === "captured"
                    ? "Fingerprint captured"
                    : "Awaiting fingerprint scan"
                }}</span>
                <span
                  v-if="bioDialog.state === 'scanning'"
                  class="bio-badge bio-badge-scanning"
                  >Live</span
                >
                <span
                  v-else-if="bioDialog.state === 'captured'"
                  class="bio-badge bio-badge-ok"
                  >Done</span
                >
              </div>
            </div>

            <!-- Error -->
            <div v-if="bioDialog.state === 'error'" class="bio-error-box">
              <span
                class="mdi mdi-alert-circle"
                style="color: #ef4444; font-size: 16px; flex-shrink: 0"
              ></span>
              <p class="bio-error-text">
                <strong>Error:</strong> {{ bioDialog.errorMsg }}
              </p>
            </div>

            <!-- Log -->
            <div class="bio-log" ref="bioLogEl">
              <div
                v-for="(l, i) in bioDialog.logs"
                :key="i"
                class="bio-log-row"
              >
                <span class="bio-log-time">{{ l.time }}</span>
                <span :class="'bio-log-' + l.type">{{ l.msg }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bio-dialog-footer">
            <button
              v-if="bioDialog.state === 'error'"
              class="bio-btn bio-btn-retry"
              @click="retryBioDetection"
            >
              <span class="mdi mdi-refresh"></span><span>Retry</span>
            </button>
            <button
              class="bio-btn bio-btn-cancel"
              @click="closeBioDialog"
              :disabled="bioDialog.scanning"
            >
              Cancel
            </button>
            <button
              v-if="bioDialog.state !== 'captured'"
              class="bio-btn bio-btn-capture"
              :class="{
                'bio-btn-scanning-mode': bioDialog.state === 'scanning',
              }"
              :disabled="
                !bioDialog.deviceConnected ||
                bioDialog.state === 'scanning' ||
                bioDialog.state === 'detecting' ||
                bioDialog.state === 'error'
              "
              @click="runCapture"
            >
              <span
                v-if="bioDialog.state === 'scanning'"
                class="spinner-btn"
              ></span>
              <span v-else class="mdi mdi-fingerprint"></span>
              <span>{{
                bioDialog.state === "detecting"
                  ? "Detecting…"
                  : bioDialog.state === "scanning"
                  ? "Scanning…"
                  : "Capture"
              }}</span>
            </button>
            <button
              v-if="bioDialog.state === 'captured'"
              class="bio-btn bio-btn-confirm"
              @click="confirmCapture"
            >
              <span class="mdi mdi-check-circle-outline"></span
              ><span>Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useOnboardingStore } from "@/stores/onboading";
import { useRouter } from "vue-router";

const {
  VendorOnboardingAEPS,
  getMerchantForOnboarding,
  validateAEPSOTP,
  verifyAadhaarAEPS,
  verifyPANAEPS,
  submitBiometricAEPS,
} = useOnboadingApi();
const Onboarding = useOnboardingStore();
const router = useRouter();
const props = defineProps({ merchantId: String });

const snackbar = reactive({ show: false, message: "", color: "success" });
const steps = [
  { key: "verify-details", label: "Verify" },
  { key: "validate-otp", label: "OTP" },
  { key: "pan-verification", label: "PAN" },
  { key: "aadhar-verification", label: "Aadhaar" },
  { key: "Biometric-Verification", label: "Biometric" },
];
const stepSubtitles = [
  "Verify Merchant Details",
  "OTP Validation",
  "PAN Verification",
  "Aadhaar Verification",
  "Biometric Verification",
];

const step = ref(1);
const loading = ref(false);
const fetchingMerchant = ref(true);
const merchantProfile = ref(null);
const detailsConfirmed = ref(false);
const OTPreqid = ref(null);
const initiateError = ref(false);
const initiateErrorMsg = ref("");
const initiateErrorDetail = ref("");
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const panNumber = ref("");
const panName = ref("");
const panDob = ref("");
const aadhaarNumber = ref("");
const biometricUID = ref("");
const biometricCaptured = ref(false);
const biometricScanning = ref(false);
const deviceConnected = ref(false);

// ── Biometric dialog ──────────────────────────────────────────
const bioLogEl = ref(null);
const PID_OPTIONS_XML = `<?xml version="1.0"?><PidOptions ver="1.0"><Opts fCount="1" fType="2" iCount="0" iType="0" pCount="0" pType="0" format="0" pidVer="2.0" timeout="10000" posh="UNKNOWN" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="/></PidOptions>`;

const bioDialog = reactive({
  open: false,
  state: "detecting",
  deviceConnected: false,
  scanning: false,
  errorMsg: "",
  logs: [],
  coreLabel: "Detect",
  statusTitle: "Detecting Device…",
  statusDesc: "Looking for a connected RD device on port 11100…",
  progress: "10%",
});

function bioLog(msg, type = "info") {
  bioDialog.logs.push({
    time: new Date().toTimeString().slice(0, 8),
    msg,
    type,
  });
  nextTick(() => {
    if (bioLogEl.value) bioLogEl.value.scrollTop = bioLogEl.value.scrollHeight;
  });
}
function updateBioDisplay() {
  const map = {
    detecting: {
      coreLabel: "Detect",
      statusTitle: "Detecting Device…",
      statusDesc: "Looking for a connected RD device on port 11100…",
      progress: "15%",
    },
    idle: {
      coreLabel: "Ready",
      statusTitle: "Device Ready",
      statusDesc: "Place your finger on the sensor and click Capture.",
      progress: "30%",
    },
    scanning: {
      coreLabel: "Scan",
      statusTitle: "Scanning Fingerprint",
      statusDesc: "Keep your finger still on the sensor. Please wait…",
      progress: "65%",
    },
    captured: {
      coreLabel: "Done",
      statusTitle: "Capture Successful",
      statusDesc: "Fingerprint captured. Click Confirm to continue.",
      progress: "100%",
    },
    error: {
      coreLabel: "Error",
      statusTitle: "Device Error",
      statusDesc: "Could not communicate with the biometric device.",
      progress: "15%",
    },
  };
  Object.assign(bioDialog, map[bioDialog.state] || map.detecting);
}
async function detectDevice() {
  bioDialog.state = "detecting";
  bioDialog.deviceConnected = false;
  updateBioDisplay();
  bioLog("Initiating device detection on 127.0.0.1:11100…", "info");
  try {
    const res = await fetch("http://127.0.0.1:11100/rd/info", {
      method: "DEVICEINFO",
      headers: { "Content-Type": "text/xml" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const dpId =
      xml.match(/dpId="([^"]+)"/)?.[1] ||
      xml.match(/<dpId>([^<]+)<\/dpId>/)?.[1];
    const rdsId =
      xml.match(/rdsId="([^"]+)"/)?.[1] ||
      xml.match(/<rdsId>([^<]+)<\/rdsId>/)?.[1];
    if (!dpId || !rdsId) throw new Error("Incomplete DeviceInfo");
    bioLog(`Device found → dpId: ${dpId}`, "success");
    bioDialog.deviceConnected = true;
    deviceConnected.value = true;
    bioDialog.state = "idle";
  } catch (err) {
    const msg = err.message || "";
    if (
      [
        "Failed to fetch",
        "NetworkError",
        "timeout",
        "abort",
        "Load failed",
      ].some((s) => msg.includes(s))
    ) {
      bioLog("No real RD device — running in DEMO mode", "info");
      await delay(1200);
      bioLog("Demo device connected (simulated)", "success");
      bioDialog.deviceConnected = true;
      deviceConnected.value = true;
      bioDialog.state = "idle";
    } else {
      bioLog(`Device error: ${msg}`, "error");
      bioDialog.errorMsg = msg;
      bioDialog.state = "error";
    }
  }
  updateBioDisplay();
}
async function runCapture() {
  if (
    !bioDialog.deviceConnected ||
    bioDialog.state === "scanning" ||
    bioDialog.state === "captured"
  )
    return;
  bioDialog.state = "scanning";
  biometricScanning.value = true;
  updateBioDisplay();
  bioLog("Starting fingerprint capture…", "info");
  try {
    const res = await fetch("http://127.0.0.1:11100/rd/capture", {
      method: "CAPTURE",
      headers: {
        "Content-Type": "text/xml",
        "Content-Length": String(
          new TextEncoder().encode(PID_OPTIONS_XML).length
        ),
      },
      body: PID_OPTIONS_XML,
      signal: AbortSignal.timeout(20000),
    });
    const xml = await res.text();
    const errCode = xml.match(/errCode="([^"]+)"/)?.[1];
    const errInfo = xml.match(/errInfo="([^"]+)"/)?.[1];
    if (errCode && errCode !== "0")
      throw new Error(errInfo || `errCode ${errCode}`);
    const uid = xml.match(/uid="([^"]+)"/)?.[1] || generateUID();
    console.log("PID DATA:", xml )
    biometricUID.value = uid;
    bioDialog.state = "captured";
    bioLog(`Fingerprint captured. UID: ${uid}`, "success");
  } catch (err) {
    const msg = err.message || "";
    if (
      [
        "Failed to fetch",
        "NetworkError",
        "timeout",
        "abort",
        "Load failed",
      ].some((s) => msg.includes(s))
    ) {
      bioLog("Demo mode: simulating fingerprint scan…", "info");
      await delay(2500);
      const uid = generateUID();
      biometricUID.value = uid;
      bioDialog.state = "captured";
      bioLog(`Demo fingerprint captured. UID: ${uid}`, "success");
    } else {
      bioLog(`Capture error: ${msg}`, "error");
      bioDialog.errorMsg = msg;
      bioDialog.state = "error";
    }
  }
  biometricScanning.value = false;
  updateBioDisplay();
}
function confirmCapture() {
  biometricCaptured.value = true;
  deviceConnected.value = true;
  bioDialog.open = false;
  showSnack("Fingerprint captured successfully!", "success");
}
function openBiometricDialog() {
  if (!biometricCaptured.value) {
    bioDialog.logs = [];
    bioDialog.errorMsg = "";
    bioDialog.state = "detecting";
    bioDialog.deviceConnected = false;
    updateBioDisplay();
  }
  bioDialog.open = true;
  if (!biometricCaptured.value) nextTick(() => detectDevice());
}
function closeBioDialog() {
  if (bioDialog.scanning) return;
  bioDialog.open = false;
}
async function retryBioDetection() {
  bioDialog.logs = [];
  bioDialog.errorMsg = "";
  await detectDevice();
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function generateUID() {
  return (
    "BIO-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase()
  );
}
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
function resendOtp() {
  showSnack("OTP resent successfully", "success");
}
function showSnack(message, color = "success") {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
  setTimeout(() => (snackbar.show = false), 4000);
}
function goBack() {
  if (step.value > 1) step.value--;
}

async function handleStep1Continue() {
  if (!detailsConfirmed.value) {
    showSnack("Please confirm you have reviewed the details", "error");
    return;
  }
  initiateError.value = false;
  loading.value = true;
  try {
    const res = await VendorOnboardingAEPS({ merchantId: props.merchantId });
    if (res.statusCode === "00" && res.otp_status === true) {
      OTPreqid.value = res.data?.otp_reqid || res.otp_reqid || null;
      showSnack(res.data?.message || res.message || "OTP sent!", "success");
      step.value = 2;
      return;
    }
    if (res.otp_status === true) {
      OTPreqid.value = res.data?.otp_reqid || res.otp_reqid || "";
      showSnack("OTP already sent.", "success");
      step.value = 2;
      return;
    }
    initiateError.value = true;
    initiateErrorMsg.value =
      res.data?.response || res.message || "Failed to initiate AEPS Onboarding";
    initiateErrorDetail.value = `Ref: ${res.data?.error || res.error} · Code: ${
      res.statusCode || res.data?.statusCode
    }`;
    showSnack(initiateErrorMsg.value, "error");
  } catch (err) {
    initiateError.value = true;
    initiateErrorMsg.value = "Network error.";
    initiateErrorDetail.value = err.message || "";
    showSnack("Failed to connect.", "error");
  } finally {
    loading.value = false;
  }
}
function retryInitiate() {
  handleStep1Continue();
}

const next = async () => {
  if (step.value === 2) {
    const otp = otpDigits.value.join("");
    if (otp.length < 6) {
      showSnack("Please enter the complete 6-digit OTP", "error");
      return;
    }
    if (!OTPreqid.value) {
      showSnack("OTP request ID missing.", "error");
      step.value = 1;
      return;
    }
    try {
      loading.value = true;
      const res = await validateAEPSOTP({
        otp,
        otpreqid: OTPreqid.value,
        merchantId: props.merchantId,
      });
      if (res.statusCode == "00")
        showSnack(res.data?.message || "OTP verified!", "success");
      else {
        showSnack(res.data?.message || "OTP verification failed.", "error");
        return;
      }
    } catch {
      showSnack("OTP verification failed.", "error");
      return;
    } finally {
      loading.value = false;
    }
  }
  if (step.value === 3) {
    if (panNumber.value.length < 10) {
      showSnack("Please enter a valid 10-character PAN number", "error");
      return;
    }
    if (!panName.value.trim()) {
      showSnack("Please enter your full name", "error");
      return;
    }
    if (!panDob.value) {
      showSnack("Please enter your date of birth", "error");
      return;
    }
    const [y, m, d] = panDob.value.split("-");
    try {
      loading.value = true;
      const res = await verifyPANAEPS({
        pan: panNumber.value.toUpperCase(),
        name: panName.value.trim().toUpperCase(),
        dob: `${d}/${m}/${y}`,
        merchantId: props.merchantId,
      });
      if (res.statusCode == "00")
        showSnack(res.data?.message || "PAN verified!", "success");
      else {
        showSnack(res.data?.message || "PAN verification failed.", "error");
        return;
      }
    } catch {
      showSnack("PAN verification failed.", "error");
      return;
    } finally {
      loading.value = false;
    }
  }
  if (step.value === 4) {
    const raw = aadhaarNumber.value.replace(/\s/g, "");
    if (raw.length < 12) {
      showSnack("Please enter a valid 12-digit Aadhaar number", "error");
      return;
    }
    try {
      loading.value = true;
      const res = await verifyAadhaarAEPS({
        aadhaarno: raw,
        merchantId: props.merchantId,
      });
      if (res.statusCode == "00")
        showSnack(res.data?.message || "Aadhaar verified!", "success");
      else {
        showSnack(res.data?.message || "Aadhaar verification failed.", "error");
        return;
      }
    } catch {
      showSnack("Aadhaar verification failed.", "error");
      return;
    } finally {
      loading.value = false;
    }
  }
  if (step.value === 5) {
    if (!biometricCaptured.value || !biometricUID.value) {
      showSnack("Please capture your fingerprint before continuing.", "error");
      return;
    }
    try {
      loading.value = true;
      const res = await submitBiometricAEPS({
        uid: biometricUID.value,
        merchantId: props.merchantId,
      });
      if (res.statusCode == "00")
        showSnack(res.data?.message || "Biometric verified!", "success");
      else {
        showSnack(
          res.data?.message || "Biometric verification failed.",
          "error"
        );
        return;
      }
    } catch {
      showSnack("Biometric verification failed.", "error");
      return;
    } finally {
      loading.value = false;
    }
  }
  if (step.value < steps.length) {
    loading.value = true;
    await delay(600);
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
      if (res?.statusCode === "00" && res.data)
        merchantProfile.value = res.data;
      else showSnack("Failed to load merchant details", "error");
    } catch {
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
/* ════════════════════════════════════════════════════
   RESET
════════════════════════════════════════════════════ */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════ */
.merchant-root {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background: #f6f6f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ════════════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════════ */
.merchant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
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
  flex-shrink: 0;
}
.brand-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}
@media (min-width: 480px) {
  .brand-title {
    font-size: 18px;
  }
}
.header-step-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #1142d4;
  background: rgba(17, 66, 212, 0.08);
  padding: 5px 10px;
  border-radius: 9999px;
  flex-shrink: 0;
}
@media (min-width: 640px) {
  .header-step-pill {
    display: none;
  }
}

/* ════════════════════════════════════════════════════
   MAIN & LAYOUT
════════════════════════════════════════════════════ */
.merchant-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 12px 40px;
}
@media (min-width: 640px) {
  .merchant-main {
    padding: 24px 20px 40px;
  }
}
@media (min-width: 768px) {
  .merchant-main {
    padding: 32px 24px 40px;
  }
}
.content-wrapper {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (min-width: 640px) {
  .content-wrapper {
    gap: 24px;
  }
}

/* ════════════════════════════════════════════════════
   STEPPER CARD
════════════════════════════════════════════════════ */
.stepper-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
@media (min-width: 640px) {
  .stepper-card {
    padding: 24px;
  }
}
.stepper-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
}
@media (min-width: 640px) {
  .stepper-header {
    margin-bottom: 24px;
  }
}
.stepper-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
@media (min-width: 480px) {
  .stepper-title {
    font-size: 17px;
  }
}
.stepper-subtitle {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}
@media (min-width: 480px) {
  .stepper-subtitle {
    font-size: 13px;
  }
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

/* Desktop stepper */
.desktop-stepper {
  position: relative;
  display: none;
  align-items: center;
  justify-content: space-between;
}
@media (min-width: 560px) {
  .desktop-stepper {
    display: flex;
  }
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

/* Mobile stepper */
.mobile-stepper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
@media (min-width: 560px) {
  .mobile-stepper {
    display: none;
  }
}
.mobile-stepper-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}
.mobile-bar-bg {
  position: absolute;
  top: 50%;
  left: 4px;
  right: 4px;
  height: 3px;
  background: #f1f5f9;
  border-radius: 3px;
  transform: translateY(-50%);
  z-index: 0;
}
.mobile-bar-fill {
  position: absolute;
  top: 50%;
  left: 4px;
  height: 3px;
  background: #1142d4;
  border-radius: 3px;
  transform: translateY(-50%);
  z-index: 1;
  transition: width 0.4s ease;
}
.mobile-dot-wrap {
  position: relative;
  z-index: 2;
}
.mobile-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}
.mobile-dot-active {
  background: #1142d4;
  color: #fff;
  box-shadow: 0 2px 10px rgba(17, 66, 212, 0.3);
}
.mobile-dot-done {
  background: #1142d4;
  color: #fff;
}
.mobile-dot-pending {
  background: #f1f5f9;
  color: #94a3b8;
}
.mobile-step-label {
  font-size: 12px;
  font-weight: 600;
  color: #1142d4;
}

/* ════════════════════════════════════════════════════
   MAIN CARD
════════════════════════════════════════════════════ */
.main-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}
.card-body {
  padding: 18px 14px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
@media (min-width: 480px) {
  .card-body {
    padding: 28px 24px 20px;
  }
}
@media (min-width: 768px) {
  .card-body {
    padding: 48px;
  }
}
.step1-body {
  padding: 14px !important;
  align-items: stretch !important;
  text-align: left !important;
}
@media (min-width: 480px) {
  .step1-body {
    padding: 20px !important;
  }
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
  gap: 12px;
  padding: 4px 0;
}
.skeleton-title {
  width: 55%;
  height: 18px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-row {
  height: 13px;
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

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 12px 0 8px;
  gap: 12px;
}
.error-icon-wrap {
  position: relative;
  width: 68px;
  height: 68px;
}
@media (min-width: 480px) {
  .error-icon-wrap {
    width: 80px;
    height: 80px;
  }
}
.error-icon-ring {
  width: 100%;
  height: 100%;
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
  font-size: 30px;
  color: #e11d48;
}
@media (min-width: 480px) {
  .error-icon-mdi {
    font-size: 36px;
  }
}
.error-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(225, 29, 72, 0.25);
  animation: errorRipple 2s ease-out infinite;
}
@keyframes errorRipple {
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
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}
@media (min-width: 480px) {
  .error-title {
    font-size: 20px;
  }
}
.error-desc {
  font-size: 13px;
  color: #64748b;
  max-width: 320px;
  line-height: 1.5;
}
.error-detail-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #e11d48;
  font-weight: 600;
  max-width: 360px;
  width: 100%;
  text-align: left;
}
.error-detail-box .mdi {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
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

/* Verify */
.verify-header {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(
    135deg,
    rgba(17, 66, 212, 0.05),
    rgba(17, 66, 212, 0.02)
  );
  border: 1px solid rgba(17, 66, 212, 0.12);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}
@media (min-width: 480px) {
  .verify-header {
    gap: 14px;
    padding: 16px;
    margin-bottom: 16px;
  }
}
.verify-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1142d4, #2255e8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(17, 66, 212, 0.3);
}
@media (min-width: 480px) {
  .verify-avatar {
    width: 52px;
    height: 52px;
    font-size: 24px;
  }
}
.verify-header-text {
  flex: 1;
  min-width: 0;
}
.verify-name {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (min-width: 480px) {
  .verify-name {
    font-size: 17px;
  }
}
.verify-biz {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.verify-badge {
  display: inline-block;
  margin-top: 5px;
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
  padding: 9px 12px;
  font-size: 12px;
  color: #92400e;
  line-height: 1.5;
  margin-bottom: 14px;
}
.verify-instruction .mdi {
  font-size: 13px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Detail sections */
.detail-section {
  margin-bottom: 14px;
}
.section-label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.section-icon {
  font-size: 14px;
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
  grid-template-columns: 1fr;
  gap: 6px;
}
@media (min-width: 400px) {
  .detail-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.detail-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 11px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.di-full {
  grid-column: 1/-1;
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
  padding: 10px 12px;
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
  gap: 8px;
  flex-wrap: wrap;
}
.location-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f4ff;
  border: 1px solid rgba(17, 66, 212, 0.15);
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #1142d4;
}
.location-chip .mdi {
  font-size: 13px;
}
.confirm-check-wrap {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f0f4ff;
  border: 1.5px solid rgba(17, 66, 212, 0.2);
  border-radius: 10px;
  padding: 12px 14px;
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

/* Illustration */
.illustration-wrap {
  position: relative;
  width: 100%;
  max-width: 160px;
  margin-bottom: 20px;
}
@media (min-width: 480px) {
  .illustration-wrap {
    max-width: 220px;
    margin-bottom: 28px;
  }
}
@media (min-width: 640px) {
  .illustration-wrap {
    max-width: 280px;
    margin-bottom: 32px;
  }
}
.illustration-circle {
  aspect-ratio: 1;
  background: linear-gradient(
    135deg,
    rgba(17, 66, 212, 0.05),
    rgba(17, 66, 212, 0.15)
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.illustration-inner {
  width: 55%;
  height: 55%;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
}
.upload-icon {
  font-size: 36px;
  color: #1142d4;
  display: block;
}
@media (min-width: 480px) {
  .upload-icon {
    font-size: 48px;
  }
}
@media (min-width: 640px) {
  .upload-icon {
    font-size: 52px;
  }
}
.analyzing-text {
  font-size: 8px;
  font-weight: 700;
  color: #1142d4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.card-heading {
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}
@media (min-width: 480px) {
  .card-heading {
    font-size: 24px;
  }
}
@media (min-width: 640px) {
  .card-heading {
    font-size: 28px;
  }
}
.card-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  max-width: 420px;
  margin: 0 auto;
}
@media (min-width: 480px) {
  .card-desc {
    font-size: 15px;
  }
}
@keyframes icon-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.7;
  }
}
.icon-pulse {
  animation: icon-pulse 1s ease-in-out infinite;
}

/* OTP */
.otp-input-wrap {
  display: flex;
  gap: 6px;
  margin-top: 18px;
  justify-content: center;
}
@media (min-width: 380px) {
  .otp-input-wrap {
    gap: 8px;
  }
}
@media (min-width: 480px) {
  .otp-input-wrap {
    gap: 10px;
  }
}
.otp-box {
  width: 38px;
  height: 46px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  text-align: center;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s;
  background: #f8fafc;
}
@media (min-width: 380px) {
  .otp-box {
    width: 42px;
    height: 50px;
  }
}
@media (min-width: 480px) {
  .otp-box {
    width: 48px;
    height: 54px;
    font-size: 20px;
  }
}
.otp-box:focus {
  border-color: #1142d4;
  background: #fff;
}
.resend-text {
  margin-top: 14px;
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

/* Form */
.form-field-wrap {
  width: 100%;
  max-width: 420px;
  margin-top: 16px;
  text-align: left;
}
@media (min-width: 480px) {
  .form-field-wrap {
    margin-top: 24px;
  }
}
.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 7px;
}
.form-input {
  width: 100%;
  padding: 11px 14px;
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

/* Step 5 status */
.status-list {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}
.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.status-icon-green {
  color: #22c55e;
  font-size: 18px;
}
.status-icon-grey {
  color: #94a3b8;
  font-size: 18px;
}
.status-text {
  font-size: 12px;
  color: #475569;
  flex: 1;
}
@media (min-width: 480px) {
  .status-text {
    font-size: 13px;
  }
}
.status-italic {
  font-style: italic;
  color: #94a3b8;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(17, 66, 212, 0.2);
  border-top-color: #1142d4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}
.spinner-btn {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

/* Alert / uid */
.alert-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 13px;
  border-radius: 10px;
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  width: 100%;
  max-width: 420px;
  text-align: left;
}
.alert-icon {
  font-size: 18px;
  flex-shrink: 0;
}
.alert-text {
  font-size: 12px;
  line-height: 1.5;
}
@media (min-width: 480px) {
  .alert-text {
    font-size: 13px;
  }
}
.uid-chip {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f4ff;
  border: 1px solid rgba(17, 66, 212, 0.2);
  border-radius: 8px;
  width: 100%;
  max-width: 420px;
}
.uid-chip-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  flex-shrink: 0;
}
.uid-chip-value {
  font-size: 11px;
  font-weight: 600;
  color: #1142d4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: "Courier New", monospace;
}

/* Capture button */
.btn-capture {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  max-width: 420px;
  padding: 13px 20px;
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

/* Card footer */
.card-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 12px 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
@media (min-width: 480px) {
  .card-footer {
    padding: 16px 20px;
  }
}
@media (min-width: 640px) {
  .card-footer {
    padding: 20px 32px;
  }
}
.btn-back {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 10px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
}
@media (min-width: 480px) {
  .btn-back {
    padding: 10px 16px;
  }
}
.btn-back:hover {
  background: #f1f5f9;
}
.btn-back-label {
  display: none;
}
@media (min-width: 360px) {
  .btn-back-label {
    display: inline;
  }
}
.footer-right-btns {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}
.btn-continue {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: #1142d4;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(17, 66, 212, 0.25);
  transition: filter 0.15s, opacity 0.15s;
  white-space: nowrap;
}
@media (min-width: 480px) {
  .btn-continue {
    padding: 10px 24px;
  }
}
.btn-continue:hover:not(:disabled) {
  filter: brightness(1.08);
}
.btn-continue:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-label-full {
  display: none;
}
.btn-label-short {
  display: inline;
}
@media (min-width: 400px) {
  .btn-label-full {
    display: inline;
  }
  .btn-label-short {
    display: none;
  }
}

/* Info cards */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
@media (min-width: 560px) {
  .info-cards {
    flex-direction: row;
    gap: 16px;
  }
}
.info-card {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1.5px dashed #cbd5e1;
  border-radius: 12px;
  background: #fff;
}
@media (min-width: 480px) {
  .info-card {
    padding: 20px;
    gap: 14px;
  }
}
.info-icon-wrap {
  padding: 8px;
  background: rgba(17, 66, 212, 0.08);
  border-radius: 8px;
  color: #1142d4;
  flex-shrink: 0;
}
.info-icon {
  font-size: 18px;
  display: block;
}
@media (min-width: 480px) {
  .info-icon {
    font-size: 20px;
  }
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
  padding: 18px 16px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.footer-sep {
  color: #cbd5e1;
}
.footer-link {
  color: #94a3b8;
  text-decoration: underline;
  transition: color 0.15s;
}
.footer-link:hover {
  color: #1142d4;
}

/* Snackbar — bottom on mobile, top-right on desktop */
.snackbar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  z-index: 9999;
  width: calc(100vw - 32px);
  max-width: 400px;
}
@media (min-width: 640px) {
  .snackbar {
    top: 20px;
    bottom: auto;
    left: auto;
    right: 20px;
    transform: none;
    width: auto;
    max-width: 380px;
  }
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
  padding: 0;
  flex-shrink: 0;
}
.snack-enter-active,
.snack-leave-active {
  transition: all 0.3s ease;
}
.snack-enter-from,
.snack-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
@media (min-width: 640px) {
  .snack-enter-from,
  .snack-leave-to {
    opacity: 0;
    transform: translateY(-12px);
  }
}

/* ════════════════════════════════════════════════════
   BIOMETRIC DIALOG
════════════════════════════════════════════════════ */
/* Overlay — bottom sheet on mobile, centred on desktop */
.bio-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
  padding: 0;
}
@media (min-width: 560px) {
  .bio-overlay {
    align-items: center;
    padding: 16px;
  }
}

/* Dialog shell */
.bio-dialog {
  background: #fff;
  width: 100%;
  max-height: 94dvh;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.2);
}
@media (min-width: 560px) {
  .bio-dialog {
    max-width: 480px;
    border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
    max-height: 90dvh;
  }
}

/* Drag handle (mobile only) */
.bio-drag-handle {
  width: 36px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 10px auto 0;
  flex-shrink: 0;
}
@media (min-width: 560px) {
  .bio-drag-handle {
    display: none;
  }
}

/* Dialog header */
.bio-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, rgba(17, 66, 212, 0.04), transparent);
  flex-shrink: 0;
}
@media (min-width: 480px) {
  .bio-dialog-header {
    padding: 16px 20px;
  }
}
.bio-dialog-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bio-header-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #1142d4, #2255e8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 17px;
  box-shadow: 0 3px 10px rgba(17, 66, 212, 0.3);
  flex-shrink: 0;
}
@media (min-width: 480px) {
  .bio-header-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
.bio-dialog-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
@media (min-width: 480px) {
  .bio-dialog-title {
    font-size: 16px;
  }
}
.bio-dialog-sub {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 1px;
  font-family: "Courier New", monospace;
}
.bio-close-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: background 0.15s;
  flex-shrink: 0;
}
.bio-close-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
}
.bio-close-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Dialog body */
.bio-dialog-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}
@media (min-width: 480px) {
  .bio-dialog-body {
    padding: 20px;
    gap: 16px;
  }
}

/* Scanner */
.bio-scanner-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
@media (min-width: 480px) {
  .bio-scanner-wrap {
    width: 130px;
    height: 130px;
  }
}
.bio-ripple {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid #1142d4;
  opacity: 0;
}
.bio-ripple-active {
  animation: bioRipple 2s ease-out infinite;
}
.bio-ripple-2.bio-ripple-active {
  animation-delay: 0.7s;
}
@keyframes bioRipple {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
.bio-ring-arc {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #1142d4;
  border-right-color: rgba(17, 66, 212, 0.35);
  opacity: 0;
  transition: opacity 0.3s;
}
.bio-ring-spin {
  opacity: 1;
  animation: bioSpin 1.1s linear infinite;
}
@keyframes bioSpin {
  to {
    transform: rotate(360deg);
  }
}
.bio-core {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  position: relative;
  overflow: hidden;
  z-index: 2;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
@media (min-width: 480px) {
  .bio-core {
    width: 86px;
    height: 86px;
  }
}
.bio-core-scanning {
  background: rgba(17, 66, 212, 0.05);
  border-color: rgba(17, 66, 212, 0.35);
  box-shadow: 0 0 20px rgba(17, 66, 212, 0.12);
}
.bio-core-success {
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
}
.bio-core-error {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.35);
}
.bio-scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(17, 66, 212, 0.7),
    transparent
  );
  top: 0;
  left: 0;
  opacity: 0;
}
.bio-scan-active {
  opacity: 1;
  animation: bioScanSweep 1.4s ease-in-out infinite;
}
@keyframes bioScanSweep {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}
.bio-fp-icon {
  font-size: 28px;
  transition: color 0.3s, text-shadow 0.3s, transform 0.3s;
}
@media (min-width: 480px) {
  .bio-fp-icon {
    font-size: 36px;
  }
}
.bio-fp-idle {
  color: #94a3b8;
}
.bio-fp-scanning {
  color: #1142d4;
  animation: bioFpPulse 1s ease-in-out infinite;
}
.bio-fp-success {
  color: #22c55e;
  animation: bioFpBounce 0.5s ease;
}
.bio-fp-error {
  color: #ef4444;
  animation: bioFpShake 0.4s ease;
}
@keyframes bioFpPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.75;
  }
}
@keyframes bioFpBounce {
  0% {
    transform: scale(0.8);
  }
  60% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bioFpShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
.bio-core-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  transition: color 0.3s;
}
.bio-label-scanning {
  color: #1142d4;
}
.bio-label-success {
  color: #22c55e;
}

/* Status */
.bio-status-block {
  text-align: center;
}
.bio-status-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
@media (min-width: 480px) {
  .bio-status-title {
    font-size: 15px;
  }
}
.bio-status-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
  line-height: 1.5;
}

/* Progress */
.bio-progress-track {
  height: 3px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}
.bio-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1142d4, #4f81ff);
  border-radius: 3px;
  transition: width 0.4s ease;
  box-shadow: 0 0 6px rgba(17, 66, 212, 0.3);
}

/* Checklist */
.bio-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 13px;
}
.bio-check-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bio-check-text {
  font-size: 12px;
  color: #475569;
  flex: 1;
}
.bio-check-done .bio-check-text {
  color: #0f172a;
  font-weight: 600;
}
.bio-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  flex-shrink: 0;
}
.bio-badge-ok {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.25);
}
.bio-badge-scanning {
  background: rgba(17, 66, 212, 0.1);
  color: #1142d4;
  border: 1px solid rgba(17, 66, 212, 0.25);
  animation: badgeBlink 1s ease-in-out infinite;
}
@keyframes badgeBlink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

/* Error box */
.bio-error-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fff1f2;
}
.bio-error-text {
  font-size: 12px;
  color: #dc2626;
  line-height: 1.5;
}

/* Log */
.bio-log {
  background: #0f172a;
  border-radius: 8px;
  padding: 8px 11px;
  max-height: 64px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #334155 transparent;
}
.bio-log-row {
  display: flex;
  gap: 8px;
  font-family: "Courier New", monospace;
  font-size: 10px;
  line-height: 1.8;
}
.bio-log-time {
  color: #475569;
  flex-shrink: 0;
}
.bio-log-info {
  color: #60a5fa;
}
.bio-log-success {
  color: #4ade80;
}
.bio-log-error {
  color: #f87171;
}

/* Dialog footer */
.bio-dialog-footer {
  padding: 10px 14px 14px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  background: #f8fafc;
  flex-shrink: 0;
  flex-wrap: wrap;
}
@media (min-width: 480px) {
  .bio-dialog-footer {
    padding: 14px 20px 18px;
    gap: 10px;
    flex-wrap: nowrap;
  }
}

/* All footer buttons share base */
.bio-btn {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: filter 0.15s, opacity 0.15s, background 0.15s;
  white-space: nowrap;
}
@media (min-width: 480px) {
  .bio-btn {
    flex: unset;
    padding: 10px 18px;
  }
}
.bio-btn-capture {
  background: #1142d4;
  color: #fff;
  border: none;
  box-shadow: 0 4px 14px rgba(17, 66, 212, 0.25);
}
.bio-btn-capture:hover:not(:disabled) {
  filter: brightness(1.08);
}
.bio-btn-capture:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.bio-btn-scanning-mode {
  animation: bioCapturePulse 1.5s ease-in-out infinite;
}
@keyframes bioCapturePulse {
  0%,
  100% {
    box-shadow: 0 4px 14px rgba(17, 66, 212, 0.25);
  }
  50% {
    box-shadow: 0 4px 24px rgba(17, 66, 212, 0.5);
  }
}
.bio-btn-confirm {
  background: #16a34a;
  color: #fff;
  border: none;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);
}
.bio-btn-confirm:hover {
  filter: brightness(1.08);
}
.bio-btn-retry {
  background: #fff;
  color: #dc2626;
  border: 1px solid #fca5a5;
}
.bio-btn-retry:hover {
  background: #fff1f2;
}
.bio-btn-cancel {
  background: #fff;
  color: #475569;
  border: 1px solid #e2e8f0;
}
.bio-btn-cancel:hover:not(:disabled) {
  background: #f8fafc;
}
.bio-btn-cancel:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Dialog transitions — slide up from bottom on mobile, scale-in on desktop */
.dialog-fade-enter-active {
  animation: dlgSlideUp 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.dialog-fade-leave-active {
  animation: dlgSlideUp 0.2s ease reverse;
}
@keyframes dlgSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (min-width: 560px) {
  .dialog-fade-enter-active {
    animation: dlgScaleIn 0.25s ease;
  }
  .dialog-fade-leave-active {
    animation: dlgScaleIn 0.2s ease reverse;
  }
  @keyframes dlgScaleIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
}
</style>