<template>
  <div class="merchant-root">

    <!-- ── Header ── -->
    <header class="merchant-header">
      <div class="header-brand">
        <div class="brand-icon">
          <span class="mdi mdi-wallet-outline"></span>
        </div>
        <h2 class="brand-title">MOS Onboarding</h2>
      </div>
      <div class="header-right">
        <div class="step-badge">
          <span class="mdi mdi-progress-check"></span>
          Step {{ step }} / {{ totalSteps }}
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
              <p class="stepper-subtitle">Step {{ step }} of {{ totalSteps }}: {{ currentStepSubtitle }}</p>
            </div>
            <div class="active-badge">ACTIVE</div>
          </div>

          <div class="stepper-track">
            <div class="track-bg"></div>
            <div class="track-fill" :style="{ width: ((step - 1) / (totalSteps - 1) * 100) + '%' }"></div>
            <div v-for="(s, i) in visibleSteps" :key="s.key" class="step-node">
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

              <template v-if="fetchingMerchant">
                <div class="skeleton-wrap">
                  <div class="skeleton-title"></div>
                  <div class="skeleton-row" v-for="n in 7" :key="n"></div>
                </div>
              </template>

              <template v-else-if="merchantProfile">
                <div class="verify-header">
                  <div class="verify-avatar">
                    <span class="mdi mdi-store-outline"></span>
                  </div>
                  <div class="verify-header-text">
                    <h2 class="verify-name">{{ merchantProfile.dba_name || merchantProfile.name }}</h2>
                    <p class="verify-biz">{{ merchantProfile.business_name || '—' }}</p>
                    <span class="verify-badge">UPI / MOS</span>
                  </div>
                </div>

                <p class="verify-instruction">
                  <span class="mdi mdi-information-outline"></span>
                  Please review your details before proceeding. Clicking
                  <strong>Initiate MOS</strong> will register your merchant with MOS and
                  begin the CKYC verification process.
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
                  <span class="confirm-text">I have reviewed all the above details and confirm they are correct. I understand that initiating MOS onboarding will begin the CKYC verification process.</span>
                </label>
              </template>

              <!-- No merchant found -->
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

          <!-- ════ STEP 2 — CKYC Verification ════ -->
          <template v-else-if="step === 2">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-account-badge-outline upload-icon"></span>
                    <p class="analyzing-text">CKYC Verify</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">CKYC Verification</h1>
              <p class="card-desc">Enter the merchant's identity details to complete CKYC verification with MOS.</p>

              <div class="form-grid" style="max-width:420px; width:100%;">

                <div class="form-field-wrap">
                  <label class="form-label">MOBILE NUMBER <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': ckycErrors.mobile }">
                    <span class="mdi mdi-phone-outline form-icon"></span>
                    <input
                      v-model="ckycData.mobile"
                      class="form-input"
                      placeholder="9876543210"
                      maxlength="10"
                      inputmode="numeric"
                      @input="ckycErrors.mobile = ''"
                    />
                  </div>
                  <span v-if="ckycErrors.mobile" class="field-error">{{ ckycErrors.mobile }}</span>
                </div>

                <div class="form-field-wrap">
                  <label class="form-label">PAN NUMBER <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': ckycErrors.pan }">
                    <span class="mdi mdi-card-account-details-outline form-icon"></span>
                    <input
                      v-model="ckycData.pan"
                      class="form-input"
                      placeholder="ABCDE1234F"
                      maxlength="10"
                      style="text-transform:uppercase"
                      @input="ckycData.pan = ckycData.pan.toUpperCase(); ckycErrors.pan = ''"
                    />
                  </div>
                  <span v-if="ckycErrors.pan" class="field-error">{{ ckycErrors.pan }}</span>
                </div>

                <div class="form-field-wrap">
                  <label class="form-label">DATE OF BIRTH <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': ckycErrors.dob }">
                    <span class="mdi mdi-calendar-outline form-icon"></span>
                    <input
                      v-model="ckycData.dob"
                      class="form-input"
                      type="date"
                      @change="ckycErrors.dob = ''"
                    />
                  </div>
                  <span v-if="ckycErrors.dob" class="field-error">{{ ckycErrors.dob }}</span>
                </div>
              </div>

              <div class="info-hint-box" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-information-outline"></span>
                <p>PAN must match format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). If CKYC is found, an OTP will be sent to the mobile number for verification.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 3 — CKYC OTP Verify (only shown when ckyc found=true) ════ -->
          <template v-else-if="step === 3">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-shield-key-outline upload-icon"></span>
                    <p class="analyzing-text">OTP Verify</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Verify CKYC OTP</h1>
              <p class="card-desc">A one-time password has been sent to your registered mobile number. Enter the 6-digit OTP to complete CKYC verification.</p>

              <div class="otp-input-wrap">
                <input
                  v-for="(digit, idx) in ckycOtpDigits"
                  :key="idx"
                  :ref="el => ckycOtpRefs[idx] = el"
                  v-model="ckycOtpDigits[idx]"
                  class="otp-box"
                  maxlength="1"
                  inputmode="numeric"
                  @input="onCkycOtpInput(idx)"
                  @keydown.backspace="onCkycOtpBackspace(idx)"
                />
              </div>

              <div v-if="ckycRequestId" class="reqid-chip">
                <span class="mdi mdi-identifier"></span>
                <span>Ref ID: {{ ckycRequestId }}</span>
              </div>

              <p class="resend-text">
                Didn't receive the OTP?
                <button class="resend-btn" @click="resubmitCKYC">Resend OTP</button>
              </p>
            </div>
          </template>

          <!-- ════ STEP 4 — Document Upload ════ -->
          <template v-else-if="step === 4">
            <div class="card-body step1-body">
              <div class="mb-4">
                <h2 class="verify-name">Verification Documents</h2>
                <p class="verify-biz" style="margin-top:4px;">Upload all required documents to complete compliance verification.</p>
              </div>

              <div v-if="!isComplianceComplete" class="warn-alert">
                <span class="mdi mdi-alert-outline warn-alert__icon"></span>
                <p>Please complete all required document categories before submitting.</p>
              </div>

              <div v-if="isComplianceComplete" class="success-alert">
                <span class="mdi mdi-check-circle-outline success-alert__icon"></span>
                <p>All required documents submitted. You're ready to submit.</p>
              </div>

              <!-- Category grid -->
              <div v-if="docStep === 0" class="doc-grid">
                <div
                  v-for="group in requiredDocs"
                  :key="group.category"
                  class="doc-card"
                  :class="group.compliant ? 'doc-card--done' : 'doc-card--pending'"
                  @click="openCategory(group)"
                >
                  <div class="doc-card__header">
                    <div class="doc-card__icon" :class="group.compliant ? 'doc-card__icon--done' : 'doc-card__icon--pending'">
                      <span class="mdi" :class="group.compliant ? 'mdi-check-decagram' : 'mdi-file-upload-outline'"></span>
                    </div>
                    <span class="doc-card__count" :class="group.compliant ? 'doc-card__count--done' : 'doc-card__count--pending'">
                      {{ group.uploaded }}/{{ group.required }}
                    </span>
                  </div>
                  <p class="doc-card__name">{{ group.category.replaceAll('_', ' ') }}</p>
                  <div class="doc-progress">
                    <div class="doc-progress__fill"
                      :class="group.compliant ? 'doc-progress__fill--done' : 'doc-progress__fill--active'"
                      :style="{ width: (group.required ? (group.uploaded / group.required) * 100 : 0) + '%' }"></div>
                  </div>
                  <p class="doc-card__cta">Manage <span class="mdi mdi-arrow-right"></span></p>
                </div>
              </div>

              <!-- Doc type list -->
              <div v-if="docStep === 1">
                <button class="back-btn" @click="docStep = 0">
                  <span class="mdi mdi-arrow-left"></span> Back to Categories
                </button>
                <p class="section-label" style="margin:16px 0 12px;">{{ activeCategory?.category?.replaceAll('_', ' ') }}</p>
                <div class="doctype-grid">
                  <div
                    v-for="doc in activeCategory?.documents"
                    :key="doc.code"
                    class="doctype-card"
                    :class="[
                      doc.uploaded ? 'doctype-card--done' : 'doctype-card--pending',
                      (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'doctype-card--locked' : ''
                    ]"
                  >
                    <span class="mdi doctype-card__icon"
                      :class="doc.uploaded ? 'mdi-check-circle-outline' :
                        (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'mdi-lock-outline doctype-card__icon--locked' :
                        'mdi-alert-circle-outline'"></span>
                    <p class="doctype-card__name">{{ doc.name }}</p>
                    <span class="doctype-card__status"
                      :class="doc.uploaded ? 'doctype-card__status--done' :
                        (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'doctype-card__status--locked' :
                        'doctype-card__status--pending'">
                      {{ doc.uploaded ? 'Uploaded' :
                        (!doc.uploaded && activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1) ? 'Not Required' :
                        'Pending' }}
                    </span>
                    <button
                      class="doctype-card__btn"
                      :disabled="doc.uploaded || (activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded >= 1)"
                      @click="openDocUpload(doc.code)"
                    >
                      {{ doc.uploaded ? 'Added ✓' : '+ Add' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Upload form -->
              <div v-if="docStep === 2">
                <button class="back-btn" @click="docStep = 1">
                  <span class="mdi mdi-arrow-left"></span> Back to Documents
                </button>

                <div class="upload-card" style="margin-top:16px;">
                  <p class="section-label" style="margin-bottom:16px;">UPLOAD {{ activeDocType?.replaceAll('_', ' ') }}</p>

                  <!-- Doc number field -->
                  <div v-if="showDocNumber && activeDocType !== 'BANK_PASSBOOK'" class="form-field-wrap" style="margin-bottom:14px;">
                    <label class="form-label">{{ docNumberLabel }}</label>
                    <div class="form-input-box" :class="{ 'form-input-box--error': showDocErrors && !docUploads[activeDocType]?.docNumber?.trim() }">
                      <span class="mdi mdi-identifier form-icon"></span>
                      <input v-model="docUploads[activeDocType].docNumber" class="form-input" :placeholder="'Enter ' + docNumberLabel" />
                    </div>
                    <span v-if="showDocErrors && !docUploads[activeDocType]?.docNumber?.trim()" class="field-error">{{ docNumberLabel }} is required</span>
                  </div>

                  <!-- Bank passbook fields -->
                  <div v-if="activeDocType === 'BANK_PASSBOOK'" class="form-grid" style="margin-bottom:14px;">
                    <div class="form-field-wrap">
                      <label class="form-label">ACCOUNT HOLDER NAME <span class="req-star">*</span></label>
                      <div class="form-input-box" :class="{ 'form-input-box--error': showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountHolderName?.trim() }">
                        <span class="mdi mdi-account-outline form-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.accountHolderName" class="form-input" placeholder="Full name" />
                      </div>
                      <span v-if="showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountHolderName?.trim()" class="field-error">Required</span>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">ACCOUNT NUMBER <span class="req-star">*</span></label>
                      <div class="form-input-box" :class="{ 'form-input-box--error': showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountNumber?.trim() }">
                        <span class="mdi mdi-bank-outline form-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.accountNumber" class="form-input" placeholder="Bank account number" />
                      </div>
                      <span v-if="showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.accountNumber?.trim()" class="field-error">Required</span>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">BANK NAME <span class="req-star">*</span></label>
                      <div class="form-input-box" :class="{ 'form-input-box--error': showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.bankName?.trim() }">
                        <span class="mdi mdi-bank form-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.bankName" class="form-input" placeholder="Bank name" />
                      </div>
                      <span v-if="showDocErrors && !docUploads.BANK_PASSBOOK?.settlement?.bankName?.trim()" class="field-error">Required</span>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">IFSC CODE <span class="req-star">*</span></label>
                      <div class="form-input-box" :class="{ 'form-input-box--error': showDocErrors && (!docUploads.BANK_PASSBOOK?.settlement?.ifsc?.trim() || docUploads.BANK_PASSBOOK.settlement.ifsc.trim().length < 11) }">
                        <span class="mdi mdi-bank-transfer form-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.ifsc" class="form-input" placeholder="SBIN0001234" style="text-transform:uppercase" />
                      </div>
                      <span v-if="showDocErrors && (!docUploads.BANK_PASSBOOK?.settlement?.ifsc?.trim() || docUploads.BANK_PASSBOOK.settlement.ifsc.trim().length < 11)" class="field-error">Valid 11-character IFSC required</span>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">CITY <span class="req-star">*</span></label>
                      <div class="form-input-box">
                        <span class="mdi mdi-city-variant-outline form-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.city" class="form-input" placeholder="City" />
                      </div>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">STATE <span class="req-star">*</span></label>
                      <div class="form-input-box">
                        <span class="mdi mdi-map-outline form-icon"></span>
                        <input v-model="docUploads.BANK_PASSBOOK.settlement.state" class="form-input" placeholder="State" />
                      </div>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">ACCOUNT TYPE <span class="req-star">*</span></label>
                      <div class="form-input-box">
                        <span class="mdi mdi-swap-horizontal form-icon"></span>
                        <select v-model="docUploads.BANK_PASSBOOK.settlement.account_type" class="form-input" style="appearance:none; cursor:pointer;">
                          <option value="">Select type</option>
                          <option value="SAVING">Saving</option>
                          <option value="CURRENT">Current</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- PAN fields -->
                  <div v-if="['INDIVIDUAL_PAN','PARTNER1_INDIVIDUAL_PAN','PARTNER2_INDIVIDUAL_PAN'].includes(activeDocType)" class="form-grid" style="margin-bottom:14px;">
                    <div class="form-field-wrap">
                      <label class="form-label">PAN NUMBER <span class="req-star">*</span></label>
                      <div class="form-input-box" :class="{ 'form-input-box--error': showDocErrors && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test((docUploads[activeDocType]?.pan?.pan || '').toUpperCase()) }">
                        <span class="mdi mdi-card-account-details-outline form-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan" class="form-input" placeholder="ABCDE1234F" maxlength="10" style="text-transform:uppercase" />
                      </div>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">PAN HOLDER NAME <span class="req-star">*</span></label>
                      <div class="form-input-box">
                        <span class="mdi mdi-account-outline form-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan_name" class="form-input" placeholder="Name as on PAN" />
                      </div>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">FATHER'S NAME <span class="req-star">*</span></label>
                      <div class="form-input-box">
                        <span class="mdi mdi-account-child-outline form-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan_father_name" class="form-input" placeholder="Father's name" />
                      </div>
                    </div>
                    <div class="form-field-wrap">
                      <label class="form-label">DATE OF BIRTH <span class="req-star">*</span></label>
                      <div class="form-input-box">
                        <span class="mdi mdi-calendar-outline form-icon"></span>
                        <input v-model="docUploads[activeDocType].pan.pan_dob" type="date" class="form-input" />
                      </div>
                    </div>
                  </div>

                  <!-- File upload zone -->
                  <div class="upload-zone">
                    <span class="mdi mdi-cloud-upload-outline upload-zone__icon"></span>
                    <p class="upload-zone__label">Upload {{ requiredImageCount }} image{{ requiredImageCount > 1 ? 's' : '' }}</p>
                    <p class="upload-zone__sub">JPG or PNG format accepted</p>
                    <label class="upload-zone__btn">
                      <span class="mdi mdi-folder-open-outline"></span>
                      Choose File{{ requiredImageCount > 1 ? 's' : '' }}
                      <input type="file" multiple accept="image/*" class="upload-zone__input" @change="handleFileChange" />
                    </label>
                    <p v-if="docUploads[activeDocType]?.files?.length" class="upload-zone__count">
                      {{ docUploads[activeDocType].files.length }} / {{ requiredImageCount }} selected
                    </p>
                  </div>

                  <button class="save-btn" :disabled="!canSaveDoc" @click="saveDocUpload">
                    <span class="mdi mdi-content-save-outline"></span>
                    Save Document
                  </button>
                </div>
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
              <h1 class="card-heading" style="color:#16a34a;">MOS Onboarding Complete!</h1>
              <p class="card-desc">Your UPI / MOS onboarding has been successfully completed. Your account is now active.</p>

              <div class="complete-chips">
                <div class="chip chip--green"><span class="mdi mdi-check"></span> MOS Initiated</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> CKYC Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Docs Uploaded</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Submitted</div>
              </div>

              <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:28px;">
                <button class="btn-continue" style="background:#16a34a; box-shadow:0 4px 14px rgba(22,163,74,0.3);" @click="goToDashboard">
                  <span class="mdi mdi-view-dashboard-outline"></span> Go to Dashboard
                </button>
              </div>
            </div>
          </template>

          <!-- ── Card Footer ── -->
          <div class="card-footer" v-if="step !== 5">
            <button v-if="step > 1 && !(step === 4 && docStep > 0)" class="btn-back" @click="goBack">
              <span class="mdi mdi-arrow-left"></span> Back
            </button>

            <div class="footer-right-btns">
              <!-- Step 1: Initiate MOS -->
              <button
                v-if="step === 1"
                class="btn-continue"
                :disabled="loading || fetchingMerchant || !detailsConfirmed"
                @click="handleStep1Initiate"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Initiate MOS <span class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 2: Submit CKYC -->
              <button
                v-else-if="step === 2"
                class="btn-continue"
                :disabled="loading"
                @click="handleStep2CKYC"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Submit CKYC <span class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 3: Verify CKYC OTP -->
              <button
                v-else-if="step === 3"
                class="btn-continue"
                :disabled="loading || ckycOtpDigits.join('').length < 6"
                @click="handleStep3CkycOTP"
              >
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Verify OTP <span class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 4: Submit onboarding -->
              <button
                v-else-if="step === 4 && docStep === 0"
                class="btn-continue"
                :disabled="!isComplianceComplete || submitting"
                @click="handleStep4Submit"
              >
                <span v-if="submitting" class="spinner-btn"></span>
                <template v-else>Submit Onboarding <span class="mdi mdi-check"></span></template>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Info Cards ── -->
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-file-document-outline info-icon"></span></div>
            <div>
              <p class="info-title">Required Documents</p>
              <p class="info-desc">Keep PAN, Aadhaar, and bank details ready for document upload steps.</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-shield-check-outline info-icon"></span></div>
            <div>
              <p class="info-title">Secure Processing</p>
              <p class="info-desc">Your data is encrypted using industry-standard protocols throughout the process.</p>
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

    <!-- ── Snackbar ── -->
    <transition name="snack">
      <div v-if="snackbar.show" class="snackbar" :class="'snackbar-' + snackbar.color">
        <span class="mdi" :class="snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
        <span class="snack-msg">{{ snackbar.message }}</span>
        <button class="snack-close" @click="snackbar.show = false"><span class="mdi mdi-close"></span></button>
      </div>
    </transition>

    <!-- ── Processing overlay ── -->
    <transition name="fade">
      <div v-if="(loading || submitting) && step > 1" class="processing-overlay">
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
import { ref, reactive, computed, onMounted } from "vue";
import { useUpiOnboardingApi } from "@/composables/apis/useUpiOnboardingApi";
import { transformCompliance } from "@/utils/transformCompliance";
import { useRouter } from "vue-router";

// ── Composable ────────────────────────────────────────────────────
const {
  upiGetMerchantForOnboarding,
  upiInitiateMOS,
  upiSubmitCKYC,
  upiVerifyCKYCOTP,
  upiUploadDoc,
  upiComplianceInit,
  upiSubmitOnboarding,
} = useUpiOnboardingApi();

const router = useRouter();

// ── Props ─────────────────────────────────────────────────────────
const props = defineProps({ merchantId: String });

// ── Steps ─────────────────────────────────────────────────────────
const ckycFound      = ref(null);
const ckycOtpSkipped = ref(false);

const allSteps = [
  { key: "verify",    label: "Verify",    icon: "mdi-account-check-outline" },
  { key: "ckyc",      label: "CKYC",      icon: "mdi-account-badge-outline" },
  { key: "ckycotp",   label: "OTP",       icon: "mdi-shield-key-outline" },
  { key: "documents", label: "Documents", icon: "mdi-file-document-outline" },
  { key: "complete",  label: "Complete",  icon: "mdi-check-decagram" },
];

const visibleSteps = computed(() =>
  ckycFound.value === false ? allSteps.filter(s => s.key !== "ckycotp") : allSteps
);

const totalSteps = computed(() => visibleSteps.value.length);

const stepSubtitles = computed(() =>
  ckycFound.value === false
    ? ["Verify Merchant Details", "CKYC Verification", "Document Upload", "Complete"]
    : ["Verify Merchant Details", "CKYC Verification", "CKYC OTP Verification", "Document Upload", "Complete"]
);

const currentStepSubtitle = computed(() => {
  const idx = ckycFound.value === false
    ? [1, 2, 4, 5].indexOf(step.value)
    : step.value - 1;
  return stepSubtitles.value[idx] || stepSubtitles.value[step.value - 1] || "";
});

// ── State ─────────────────────────────────────────────────────────
const step             = ref(1);
const loading          = ref(false);
const submitting       = ref(false);
const processingMsg    = ref("Processing...");
const fetchingMerchant = ref(true);
const merchantProfile  = ref(null);
const detailsConfirmed = ref(false);

const ckycData      = reactive({ mobile: "", pan: "", dob: "" });
const ckycErrors    = reactive({ mobile: "", pan: "", dob: "" });
const ckycRequestId = ref(null);
const ckycOtpDigits = ref(["", "", "", "", "", ""]);
const ckycOtpRefs   = ref([]);

const complianceList     = ref([]);
const complianceCategory = ref([]);
const docStep            = ref(0);
const activeCategory     = ref(null);
const activeDocType      = ref(null);
const docUploads         = reactive({});

const snackbar = reactive({ show: false, message: "", color: "success" });

// ── DOC RULES ─────────────────────────────────────────────────────
const DOC_RULES = {
  DEFAULT: {
    label: "Document Number", images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds, docType) => {
      const now = new Date();
      const docNumber = now.getFullYear().toString()
        + String(now.getMonth()+1).padStart(2,"0")
        + String(now.getDate()).padStart(2,"0")
        + String(now.getHours()).padStart(2,"0")
        + String(now.getMinutes()).padStart(2,"0")
        + String(now.getSeconds()).padStart(2,"0");
      return { doc_type: docType, doc_number: docNumber, images: imageIds };
    }
  },
  AADHAAR:          { label: "Aadhaar Number",         images: 2, requiresNumber: true, buildPayload: (doc, ids, type = "AADHAAR") => ({ doc_type: type, doc_number: doc.docNumber, images: ids }) },
  PARTNER1_AADHAAR: { label: "Aadhaar Number",         images: 2, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER1_AADHAAR", partner: 1, doc_number: doc.docNumber, images: ids }) },
  PARTNER2_AADHAAR: { label: "Aadhaar Number",         images: 2, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER2_AADHAAR", partner: 2, doc_number: doc.docNumber, images: ids }) },
  DRIVING_LICENSE:  { label: "Driving License Number", images: 1, requiresNumber: true, buildPayload: (doc, ids, type = "DRIVING_LICENSE") => ({ doc_type: type, doc_number: doc.docNumber, images: ids }) },
  PARTNER1_DRIVING_LICENSE: { label: "Driving License Number", images: 1, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER1_DRIVING_LICENSE", partner: 1, doc_number: doc.docNumber, images: ids }) },
  PARTNER2_DRIVING_LICENSE: { label: "Driving License Number", images: 1, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER2_DRIVING_LICENSE", partner: 2, doc_number: doc.docNumber, images: ids }) },
  VOTER_ID:         { label: "Voter ID Number",        images: 1, requiresNumber: true, buildPayload: (doc, ids, type = "VOTER_ID") => ({ doc_type: type, doc_number: doc.docNumber, images: ids }) },
  PARTNER1_VOTER_ID: { label: "Voter ID Number",       images: 1, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER1_VOTER_ID", partner: 1, doc_number: doc.docNumber, images: ids }) },
  PARTNER2_VOTER_ID: { label: "Voter ID Number",       images: 1, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER2_VOTER_ID", partner: 2, doc_number: doc.docNumber, images: ids }) },
  PASSPORT:         { label: "Passport Number",        images: 1, requiresNumber: true, buildPayload: (doc, ids, type = "PASSPORT") => ({ doc_type: type, doc_number: doc.docNumber, images: ids }) },
  PARTNER1_PASSPORT: { label: "Passport Number",       images: 1, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER1_PASSPORT", partner: 1, doc_number: doc.docNumber, images: ids }) },
  PARTNER2_PASSPORT: { label: "Passport Number",       images: 1, requiresNumber: true, buildPayload: (doc, ids) => ({ doc_type: "PARTNER2_PASSPORT", partner: 2, doc_number: doc.docNumber, images: ids }) },
  INDIVIDUAL_PAN: {
    label: "PAN Number", images: 1, requiresNumber: false,
    formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } },
    buildPayload: (doc, ids, type = "INDIVIDUAL_PAN") => ({ doc_type: type, doc_number: doc.pan.pan, pan: { ...doc.pan }, images: ids })
  },
  PARTNER1_INDIVIDUAL_PAN: {
    label: "PAN Number", images: 1, requiresNumber: false,
    formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } },
    buildPayload: (doc, ids) => ({ doc_type: "PARTNER1_INDIVIDUAL_PAN", partner: 1, doc_number: doc.pan.pan, pan: { ...doc.pan, partner: true }, images: ids })
  },
  PARTNER2_INDIVIDUAL_PAN: {
    label: "PAN Number", images: 1, requiresNumber: false,
    formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } },
    buildPayload: (doc, ids) => ({ doc_type: "PARTNER2_INDIVIDUAL_PAN", partner: 2, doc_number: doc.pan.pan, pan: { ...doc.pan, partner: true }, images: ids })
  },
  BANK_PASSBOOK: {
    label: "Bank Account Number", images: 1, requiresNumber: false,
    formSchema: { settlement: { accountHolderName: "", account_type: "", bankName: "", accountNumber: "", ifsc: "", city: "", state: "", consent: "Y", additionalData: true } },
    buildPayload: (doc, ids) => ({ doc_type: "BANK_PASSBOOK", doc_number: doc.settlement.accountNumber, settlement: { ...doc.settlement }, images: ids })
  },
  INDOOR_STORE_IMAGE:  { label: null, images: 1, requiresNumber: false, buildPayload: (doc, ids) => ({ doc_type: "INDOOR_STORE_IMAGE",  doc_number: doc.docNumber, images: ids }) },
  OUTDOOR_STORE_IMAGE: { label: null, images: 1, requiresNumber: false, buildPayload: (doc, ids) => ({ doc_type: "OUTDOOR_STORE_IMAGE", doc_number: doc.docNumber, images: ids }) },
};

const activeDocRule      = computed(() => DOC_RULES[activeDocType.value] || DOC_RULES.DEFAULT);
const showDocNumber      = computed(() => activeDocRule.value.requiresNumber);
const docNumberLabel     = computed(() => activeDocRule.value.label);
const requiredImageCount = computed(() => activeDocRule.value.images);

// ── Required docs computed ────────────────────────────────────────
const requiredDocs = computed(() => {
  if (!complianceCategory.value?.length) return [];
  return complianceCategory.value.map(cat => {
    const uploadedCount = (cat.documents || []).filter(d => d.uploaded).length;
    const isStoreImage  = cat.category === "STORE_IMAGE";
    const required  = isStoreImage ? cat.documents.length : 1;
    const uploaded  = uploadedCount;
    const compliant = isStoreImage ? uploadedCount === cat.documents.length : uploadedCount > 0;
    return { category: cat.category, documents: cat.documents, required, uploaded, compliant };
  });
});

const isComplianceComplete = computed(() => requiredDocs.value.every(cat => cat.compliant));

// ── Save doc button validation ────────────────────────────────────
const canSaveDoc = computed(() => {
  const doc = docUploads[activeDocType.value];
  if (!doc) return false;
  if (!doc.files?.length || doc.files.length < requiredImageCount.value) return false;
  const type = activeDocType.value;
  if (['INDIVIDUAL_PAN','PARTNER1_INDIVIDUAL_PAN','PARTNER2_INDIVIDUAL_PAN'].includes(type)) {
    const p = doc.pan;
    if (!p) return false;
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test((p.pan || '').toUpperCase().trim())) return false;
    if (!p.pan_name?.trim() || !p.pan_father_name?.trim() || !p.pan_dob) return false;
    return true;
  }
  if (type === 'BANK_PASSBOOK') {
    const s = doc.settlement;
    if (!s) return false;
    if (!s.accountHolderName?.trim() || !s.accountNumber?.trim() || !s.bankName?.trim()) return false;
    if (!s.ifsc?.trim() || s.ifsc.trim().length < 11 || !s.account_type) return false;
    return true;
  }
  if (activeDocRule.value.requiresNumber && !doc.docNumber?.trim()) return false;
  return true;
});

const showDocErrors = computed(() => !!docUploads[activeDocType.value]?.files?.length);

// ── Helpers ───────────────────────────────────────────────────────
function showSnack(message, color = "success") {
  snackbar.message = message;
  snackbar.color   = color;
  snackbar.show    = true;
  setTimeout(() => (snackbar.show = false), 4500);
}

function goBack() {
  if (step.value === 4 && docStep.value > 0) { docStep.value--; return; }
  if (step.value > 1) step.value--;
}

function goToDashboard() { router.push("/vendor/merchants"); }

// ── OTP handlers ─────────────────────────────────────────────────
function onCkycOtpInput(idx) {
  ckycOtpDigits.value[idx] = ckycOtpDigits.value[idx].replace(/\D/g, "");
  if (ckycOtpDigits.value[idx] && idx < 5) ckycOtpRefs.value[idx + 1]?.focus();
}

function onCkycOtpBackspace(idx) {
  if (!ckycOtpDigits.value[idx] && idx > 0) {
    ckycOtpDigits.value[idx - 1] = "";
    ckycOtpRefs.value[idx - 1]?.focus();
  }
}

// ── Doc helpers ───────────────────────────────────────────────────
function openCategory(group) { activeCategory.value = group; docStep.value = 1; }

function openDocUpload(doc) {
  activeDocType.value = doc;
  docStep.value = 2;
  const rule = DOC_RULES[doc];
  docUploads[doc] = {
    files: [], docNumber: "", imageIds: [],
    ...(rule?.formSchema ? JSON.parse(JSON.stringify(rule.formSchema)) : {})
  };
}

function handleFileChange(e) {
  const files = Array.from(e.target.files);
  if (docUploads[activeDocType.value]) docUploads[activeDocType.value].files = files;
}

function updateComplianceCategory(activeCode) {
  const category = complianceCategory.value.find(c => c.documents.some(d => d.code === activeCode));
  if (!category) return;
  category.documents = category.documents.map(doc => ({ ...doc, uploaded: doc.code === activeCode ? true : doc.uploaded }));
  const uploadedCount = category.documents.filter(d => d.uploaded).length;
  if (category.category === "STORE_IMAGE") {
    category.uploaded  = uploadedCount;
    category.compliant = uploadedCount >= 2;
  } else {
    category.uploaded  = uploadedCount > 0 ? 1 : 0;
    category.compliant = uploadedCount > 0;
  }
}

async function saveDocUpload() {
  const doc  = docUploads[activeDocType.value];
  const rule = DOC_RULES[activeDocType.value] || DOC_RULES.DEFAULT;

  if (!rule.requiresNumber) {
    doc.docNumber = `${activeDocType.value}_${Date.now()}`;
  }

  doc.imageIds = [];
  for (const file of doc.files) {
    const res = await upiUploadDoc(file, { filename: `${activeDocType.value}_${file.name}` });
    if (res?.data?.statusCode === "00") doc.imageIds.push(res.data.data.id);
  }

  const payload = rule.buildPayload(doc, doc.imageIds, activeDocType.value);
  const res     = await upiComplianceInit(payload, props.merchantId);

  if (res?.data?.statusCode === "00") {
    updateComplianceCategory(activeDocType.value);
    showSnack("Document uploaded successfully", "success");
  } else {
    showSnack(res?.data?.message || "Upload failed. Please retry.", "error");
  }
  docStep.value = 0;
}

function applyCompliance(rawCategories) {
  complianceList.value     = rawCategories;
  complianceCategory.value = transformCompliance(rawCategories);
}

// ── Step 1 — Initiate MOS ─────────────────────────────────────────
async function handleStep1Initiate() {
  if (!detailsConfirmed.value) {
    showSnack("Please confirm you have reviewed the details", "error");
    return;
  }
  if (!merchantProfile.value?.primary_mobile) {
    showSnack("Merchant mobile number not found", "error");
    return;
  }

  loading.value       = true;
  processingMsg.value = "Initiating MOS registration...";

  try {
    const payload = { 
        mobile_number: String(merchantProfile.value.primary_mobile), 
        merchantId: props.merchantId
    }
    const res = await upiInitiateMOS(payload);

    if (res?.statusCode === "00" || res?.data?.statusCode === "00") {
      showSnack("MOS initiated successfully. Proceed to CKYC verification.", "success");
      ckycData.mobile = String(merchantProfile.value.primary_mobile);
      step.value = 2;
    } else {
      showSnack(res?.data?.message || res?.message || "Failed to initiate MOS. Please retry.", "error");
    }
  } catch (err) {
    showSnack("Network error. Please retry.", "error");
    console.error("[MOS] Initiate error:", err);
  } finally {
    loading.value = false;
  }
}

// ── Step 2 — Submit CKYC ──────────────────────────────────────────
async function handleStep2CKYC() {
  ckycErrors.mobile = "";
  ckycErrors.pan    = "";
  ckycErrors.dob    = "";

  if (!ckycData.mobile.trim() || !/^\d{10}$/.test(ckycData.mobile.trim())) {
    ckycErrors.mobile = "Enter a valid 10-digit mobile number";
  }
  const panReg = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!ckycData.pan.trim() || !panReg.test(ckycData.pan.trim().toUpperCase())) {
    ckycErrors.pan = "Enter a valid PAN (e.g. ABCDE1234F)";
  }
  if (!ckycData.dob) {
    ckycErrors.dob = "Date of birth is required";
  }

  if (ckycErrors.mobile || ckycErrors.pan || ckycErrors.dob) {
    showSnack("Please fix the errors above", "error");
    return;
  }

  loading.value       = true;
  processingMsg.value = "Verifying CKYC details...";

  try {
    const result = await upiSubmitCKYC({
      dob:    ckycData.dob,
      pan:    ckycData.pan.toUpperCase().trim(),
      mobile: ckycData.mobile.trim(),
    });

    console.log("[MOS] CKYC Submit response:", result);

    if (result?.data?.data?.found) {
      ckycFound.value     = true;
      ckycRequestId.value = result.data.data.otp_response?.vendorRefId || null;
      showSnack("CKYC verified! OTP sent to your mobile.", "success");
      step.value = 3;
    } else if (result?.data?.data?.found === false) {
      ckycFound.value = false;
      const rawCompliance = result?.data?.data?.documents_data?.categories;
      if (rawCompliance) applyCompliance(rawCompliance);
      showSnack("CKYC not found. Please upload required documents.", "error");
      step.value = 4;
    } else {
      showSnack(result?.data?.message || result?.message || "CKYC validation failed", "error");
    }
  } catch (error) {
    showSnack(error?.response?.data?.message || "Something went wrong", "error");
    console.error("[MOS] CKYC error:", error);
  } finally {
    loading.value = false;
  }
}

async function resubmitCKYC() {
  await handleStep2CKYC();
}

// ── Step 3 — Verify CKYC OTP ──────────────────────────────────────
async function handleStep3CkycOTP() {
  const otp = ckycOtpDigits.value.join("");
  if (otp.length < 6)          { showSnack("Please enter the complete 6-digit OTP", "error"); return; }
  if (!ckycRequestId.value)    { showSnack("OTP request ID missing. Please go back.", "error"); return; }

  loading.value       = true;
  processingMsg.value = "Verifying CKYC OTP...";

  try {
    const res = await upiVerifyCKYCOTP({
      request_id: ckycRequestId.value,
      otp,
    });

    console.log("[MOS] CKYC OTP Verify response:", res);

    if (res?.data?.statusCode === "00" || res?.statusCode === "00") {
      const rawCompliance = res?.data?.data?.categories || res?.data?.categories;
      if (rawCompliance) applyCompliance(rawCompliance);
      showSnack("OTP verified successfully!", "success");
      step.value = 4;
    } else {
      showSnack(res?.data?.message || res?.message || "OTP verification failed. Please try again.", "error");
    }
  } catch (err) {
    showSnack("OTP verification failed. Please try again.", "error");
    console.error("[MOS] CKYC OTP error:", err);
  } finally {
    loading.value = false;
  }
}

// ── Step 4 — Submit final onboarding ─────────
async function handleStep4Submit() {
  if (!isComplianceComplete.value) {
    showSnack("Please complete all required document categories first", "error");
    return;
  }

  submitting.value    = true;
  processingMsg.value = "Submitting onboarding...";

  try {
    const profile = merchantProfile.value;

    const res = await upiSubmitOnboarding({
      dba_name:           profile.dba_name,
      business_dob:       profile.business_dob,
      primary_email_id:   profile.primary_email_id,
      primary_mobile:     profile.primary_mobile,
      official_address:   profile.official_address,
      address1:           profile.address1,
      address2:           profile.address2,
      address3:           profile.address3,
      city:               profile.city,
      state:              profile.state,
      pincode:            profile.pincode,
      residential_address: profile.residential_address,
      res_address1:       profile.res_address1,
      res_address2:       profile.res_address2,
      res_address3:       profile.res_address3,
      res_city:           profile.res_city,
      res_state:          profile.res_state,
      res_pincode:        profile.res_pincode,
      vister_address:     profile.vister_address,
      v_address1:         profile.v_address1,
      v_address2:         profile.v_address2,
      v_address3:         profile.v_address3,
      v_city:             profile.v_city,
      v_state:            profile.v_state,
      v_pincode:          profile.v_pincode,
      beneficiary_email:  profile.beneficiary_email,
      beneficiary_mobile: profile.beneficiary_mobile,
      gender:             profile.gender,
      nature_of_business: profile.nature_of_business,
      annual_turn_over:   profile.annual_turn_over,
      website:            profile.website,
      std_code:           "091",
      lead_source:        "BUCKSBOX",
      ckyc:               true,
    });

    if (res?.data?.statusCode === "00" || res?.statusCode === "00") {
      showSnack(res?.data?.message || res?.message || "Onboarding submitted successfully!", "success");
      step.value = 5;
    } else {
      showSnack(res?.data?.message || res?.message || "Submission failed. Please retry.", "error");
    }
  } catch (e) {
    showSnack("An error occurred during submission.", "error");
    console.error("[MOS] Submit error:", e);
  } finally {
    submitting.value = false;
  }
}

// ── Mount ────────────
onMounted(async () => {
  if (props.merchantId) {
    try {
      const res = await upiGetMerchantForOnboarding(props.merchantId);
      if (res?.statusCode === "00" && res?.data) {
        merchantProfile.value = res.data;
        ckycData.mobile = String(merchantProfile.value.primary_mobile || "");
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

/* Step 1 body */
.step1-body { padding: 24px !important; align-items: stretch !important; text-align: left !important; }
@media (min-width: 640px) { .step1-body { padding: 32px !important; } }

/* Skeleton */
.skeleton-wrap { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
.skeleton-title { width: 55%; height: 18px; border-radius: 6px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skeleton-row { height: 13px; border-radius: 6px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skeleton-row:nth-child(odd) { width: 100%; } .skeleton-row:nth-child(even) { width: 78%; }
@keyframes shimmer { to { background-position: -200% 0; } }

/* Verify header */
.verify-header { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg,rgba(0,45,90,0.05),rgba(0,45,90,0.02)); border: 1px solid rgba(0,45,90,0.12); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.verify-avatar { width: 52px; height: 52px; border-radius: 14px; background: #002d5a; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px; flex-shrink: 0; box-shadow: 0 4px 14px rgba(0,45,90,0.3); }
.verify-header-text { flex: 1; min-width: 0; }
.verify-name { font-size: 16px; font-weight: 800; color: #0f172a; }
.verify-biz  { font-size: 12px; color: #64748b; margin-top: 2px; }
.verify-badge { display: inline-block; margin-top: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; background: rgba(0,45,90,0.1); color: #002d5a; padding: 3px 10px; border-radius: 9999px; }
.verify-instruction { display: flex; align-items: flex-start; gap: 8px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #92400e; line-height: 1.5; margin-bottom: 20px; }
.verify-instruction .mdi { font-size: 14px; color: #d97706; flex-shrink: 0; margin-top: 1px; }

/* Error state */
.error-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 16px 0 8px; gap: 14px; }
.error-icon-wrap { position: relative; width: 80px; height: 80px; }
.error-icon-ring { width: 80px; height: 80px; border-radius: 50%; background: #fff1f2; border: 2px solid #fecdd3; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
.error-icon-mdi { font-size: 36px; color: #e11d48; }
.error-title { font-size: 20px; font-weight: 800; color: #0f172a; }
.error-desc  { font-size: 14px; color: #64748b; max-width: 340px; line-height: 1.5; }

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

/* Form fields */
.form-grid { display: flex; flex-direction: column; gap: 16px; width: 100%; }
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
.info-hint-box { display: flex; align-items: flex-start; gap: 8px; background: #f0f6fb; border: 1px solid #c5d8e8; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #334155; line-height: 1.5; text-align: left; }
.info-hint-box .mdi { font-size: 14px; color: #002d5a; flex-shrink: 0; margin-top: 1px; }

/* Compliance alerts */
.warn-alert { display: flex; align-items: flex-start; gap: 8px; background: #fff8ee; border: 1px solid #fbd89d; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; color: #7a4800; line-height: 1.5; }
.warn-alert__icon { font-size: 15px; color: #d97706; flex-shrink: 0; margin-top: 1px; }
.success-alert { display: flex; align-items: flex-start; gap: 8px; background: #eefaf3; border: 1px solid #a7e0bc; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; color: #145b32; line-height: 1.5; }
.success-alert__icon { font-size: 15px; color: #22c55e; flex-shrink: 0; margin-top: 1px; }

/* Doc grid */
.doc-grid { display: grid; gap: 12px; grid-template-columns: repeat(2, 1fr); }
@media (min-width: 600px) { .doc-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 860px) { .doc-grid { grid-template-columns: repeat(4, 1fr); } }

.doc-card { background: #f8fbfd; border: 1.5px solid #c5d8e8; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.2s; }
.doc-card:hover { border-color: #002d5a; transform: translateY(-1px); }
.doc-card--done { border-color: rgba(34,197,94,0.4); background: #eefaf3; }
.doc-card__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.doc-card__icon { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
.doc-card__icon--done { background: rgba(34,197,94,0.15); color: #22c55e; }
.doc-card__icon--pending { background: #e8f0f7; color: #002d5a; }
.doc-card__count { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; }
.doc-card__count--done { background: rgba(34,197,94,0.15); color: #15803d; }
.doc-card__count--pending { background: #e8f0f7; color: #002d5a; }
.doc-card__name { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #002d5a; margin-bottom: 8px; word-break: break-word; }
.doc-progress { height: 3px; background: #d8e6f0; border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
.doc-progress__fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
.doc-progress__fill--done { background: #22c55e; }
.doc-progress__fill--active { background: #002d5a; }
.doc-card__cta { font-size: 10px; color: #7a9bb5; }

/* Doc type grid */
.doctype-grid { display: grid; gap: 10px; grid-template-columns: repeat(2, 1fr); margin-top: 8px; }
@media (min-width: 560px) { .doctype-grid { grid-template-columns: repeat(3, 1fr); } }

.doctype-card { background: #f8fbfd; border: 1.5px solid #c5d8e8; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
.doctype-card--done { border-color: rgba(34,197,94,0.4); background: #eefaf3; }
.doctype-card--locked { border-color: #d8e6f0; background: #f5f8fb; opacity: 0.72; }
.doctype-card__icon { font-size: 22px; }
.doctype-card--done .doctype-card__icon { color: #22c55e; }
.doctype-card--pending .doctype-card__icon { color: #f59e0b; }
.doctype-card__icon--locked { color: #8aafc8; }
.doctype-card__name { font-size: 12px; font-weight: 600; color: #002d5a; }
.doctype-card__status { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; }
.doctype-card__status--done { background: rgba(34,197,94,0.15); color: #15803d; }
.doctype-card__status--pending { background: rgba(245,158,11,0.12); color: #b45309; }
.doctype-card__status--locked { background: #e8f0f7; color: #7a9bb5; }
.doctype-card__btn { margin-top: auto; padding: 6px 14px; font-size: 11px; font-weight: 700; border-radius: 6px; cursor: pointer; border: none; font-family: inherit; background: #002d5a; color: #fff; transition: all 0.15s; }
.doctype-card__btn:disabled { opacity: 0.45; cursor: not-allowed; }
.doctype-card__btn:not(:disabled):hover { background: #003d7a; }

/* Back button */
.back-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; font-size: 12px; font-weight: 600; color: #3a5f7a; background: #f0f5f9; border: 1.5px solid #c5d8e8; border-radius: 7px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.back-btn:hover { background: #e0edf5; border-color: #002d5a; color: #002d5a; }

/* Upload card */
.upload-card { background: #f8fbfd; border: 1px solid #d0dae6; border-radius: 8px; padding: 20px; }
.upload-zone { border: 2px dashed #c5d8e8; border-radius: 8px; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; background: #fff; transition: border-color 0.2s; }
.upload-zone:hover { border-color: #002d5a; }
.upload-zone__icon { font-size: 32px; color: #8aafc8; }
.upload-zone__label { font-size: 13px; font-weight: 600; color: #002d5a; }
.upload-zone__sub { font-size: 12px; color: #7a9bb5; }
.upload-zone__count { font-size: 12px; font-weight: 700; color: #002d5a; }
.upload-zone__btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 18px; background: #e8f0f7; border: 1.5px solid #b8d0e8; border-radius: 7px; font-size: 12px; font-weight: 700; color: #002d5a; cursor: pointer; font-family: inherit; transition: all 0.15s; position: relative; }
.upload-zone__btn:hover { background: #d8e8f4; }
.upload-zone__input { position: absolute; opacity: 0; width: 0; height: 0; }
.save-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin-top: 16px; padding: 12px 24px; background: #002d5a; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; box-shadow: 0 3px 10px rgba(0,45,90,0.28); transition: background 0.18s, opacity 0.15s; }
.save-btn:hover:not(:disabled) { background: #003d7a; }
.save-btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Complete chips */
.complete-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 20px; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
.chip--green { background: rgba(34,197,94,0.12); color: #15803d; border: 1px solid rgba(34,197,94,0.25); }

/* Card footer */
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

/* Info cards */
.info-cards { display: flex; flex-direction: column; gap: 14px; }
@media (min-width: 640px) { .info-cards { flex-direction: row; } }
.info-card { flex: 1; display: flex; align-items: flex-start; gap: 14px; padding: 18px; border: 1.5px dashed #c5d8e8; border-radius: 12px; background: #fff; }
.info-icon-wrap { padding: 8px; background: rgba(0,45,90,0.08); border-radius: 8px; color: #002d5a; flex-shrink: 0; }
.info-icon  { font-size: 20px; display: block; }
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