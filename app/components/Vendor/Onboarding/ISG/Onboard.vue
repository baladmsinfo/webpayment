<template>
  <div class="isg-root">

    <!-- ── Header ── -->
    <header class="isg-header">
      <div class="header-brand">
        <div class="brand-icon">
          <span class="mdi mdi-credit-card-outline"></span>
        </div>
        <h2 class="brand-title">ISG Onboarding</h2>
      </div>
      <div class="header-right">
        <div class="step-badge">
          <span class="mdi mdi-progress-check"></span>
          Step {{ step }} / {{ totalSteps }}
        </div>
      </div>
    </header>

    <!-- ── Main ── -->
    <main class="isg-main">
      <div class="content-wrapper">

        <!-- ── Stepper Card ── -->
        <div class="stepper-card">
          <div class="stepper-header">
            <div>
              <h3 class="stepper-title">ISG Onboarding Progress</h3>
              <p class="stepper-subtitle">Step {{ step }} of {{ totalSteps }}: {{ currentStepLabel }}</p>
            </div>
            <div class="active-badge">ISG / UPI</div>
          </div>
          <div class="stepper-track">
            <div class="track-bg"></div>
            <div class="track-fill" :style="{ width: ((step - 1) / (totalSteps - 1) * 100) + '%' }"></div>
            <div v-for="(s, i) in steps" :key="s.key" class="step-node">
              <div class="step-circle" :class="{
                'step-active': step === i + 1,
                'step-done': step > i + 1,
                'step-pending': step < i + 1,
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
                    <h2 class="verify-name">{{ merchantProfile.dba_name || merchantProfile.legal_name || '—' }}</h2>
                    <p class="verify-biz">{{ merchantProfile.business_name || '—' }}</p>
                    <span class="verify-badge">ISG / UPI</span>
                  </div>
                </div>

                <p class="verify-instruction">
                  <span class="mdi mdi-information-outline"></span>
                  Please review all merchant details below before proceeding.
                  Clicking <strong>Confirm &amp; Send OTP</strong> will send a verification code to the registered
                  mobile number
                  <strong>{{ merchantProfile.primary_mobile || merchantProfile.mobile_no || '' }}</strong>.
                </p>

                <!-- Business Info -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-briefcase-outline section-icon"></span>
                    <span class="section-label">Business Information</span>
                  </div>
                  <div class="detail-grid">
                    <div class="detail-item"><span class="di-key">Legal Name</span><span class="di-val">{{
                      merchantProfile.legal_name || '—' }}</span></div>
                    <div class="detail-item"><span class="di-key">DBA Name</span><span class="di-val">{{
                        merchantProfile.dba_name || '—' }}</span></div>
                    <div class="detail-item"><span class="di-key">Business Type</span><span class="di-val">{{
                      merchantProfile.business_type || '—' }}</span></div>
                    <div class="detail-item"><span class="di-key">Nature of Business</span><span class="di-val">{{
                      merchantProfile.nature_of_business || '—' }}</span></div>
                    <div class="detail-item"><span class="di-key">MCC</span><span class="di-val">{{ merchantProfile.mcc
                        || '—' }}</span></div>
                    <div class="detail-item"><span class="di-key">Annual Turnover</span><span class="di-val">{{
                      merchantProfile.annual_turn_over || '—' }}</span></div>
                    <div class="detail-item"><span class="di-key">Date of Birth</span><span class="di-val">{{
                      merchantProfile.dob || merchantProfile.business_dob || '—' }}</span></div>
                    <div class="detail-item">
                      <span class="di-key">Gender</span>
                      <span class="di-val">{{
                        merchantProfile.gender === 'M' ? 'Male'
                          : merchantProfile.gender === 'F' ? 'Female'
                            : merchantProfile.gender || '—'
                      }}</span>
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
                    <div class="detail-item"><span class="di-key">Primary Email</span><span class="di-val">{{
                      merchantProfile.primary_email_id || '—' }}</span></div>
                    <div class="detail-item otp-highlight-cell">
                      <span class="di-key">Primary Mobile <span class="otp-will-use-tag">OTP will be sent
                          here</span></span>
                      <span class="di-val">{{ merchantProfile.primary_mobile || merchantProfile.mobile_no || '—'
                        }}</span>
                    </div>
                    <div class="detail-item"><span class="di-key">Beneficiary Email</span><span class="di-val">{{
                      merchantProfile.beneficiary_email || '—' }}</span></div>
                    <div class="detail-item"><span class="di-key">Beneficiary Mobile</span><span class="di-val">{{
                      merchantProfile.beneficiary_mobile || '—' }}</span></div>
                  </div>
                </div>

                <!-- Official Address -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-map-marker-outline section-icon"></span>
                    <span class="section-label">Official Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">{{ [merchantProfile.official_address, merchantProfile.address1,
                    merchantProfile.address2, merchantProfile.address3].filter(Boolean).join(', ') }}</p>
                    <p class="address-line">{{ merchantProfile.city }}, {{ merchantProfile.state }} – {{
                      merchantProfile.pincode }}</p>
                  </div>
                </div>

                <!-- Residential Address -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-home-outline section-icon"></span>
                    <span class="section-label">Residential Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">{{ [merchantProfile.residential_address, merchantProfile.res_address1,
                    merchantProfile.res_address2, merchantProfile.res_address3].filter(Boolean).join(', ') }}</p>
                    <p class="address-line">{{ merchantProfile.res_city }}, {{ merchantProfile.res_state }} – {{
                      merchantProfile.res_pincode }}</p>
                  </div>
                </div>

                <!-- Visitor Address -->
                <div class="detail-section">
                  <div class="section-label-row">
                    <span class="mdi mdi-storefront-outline section-icon"></span>
                    <span class="section-label">Visitor / Shop Address</span>
                  </div>
                  <div class="address-block">
                    <p class="address-line">{{ [merchantProfile.vister_address, merchantProfile.v_address1,
                    merchantProfile.v_address2, merchantProfile.v_address3].filter(Boolean).join(', ') }}</p>
                    <p class="address-line">{{ merchantProfile.v_city }}, {{ merchantProfile.v_state }} – {{
                      merchantProfile.v_pincode }}</p>
                  </div>
                </div>

                <!-- Location -->
                <div class="detail-section" v-if="merchantProfile.lat">
                  <div class="section-label-row">
                    <span class="mdi mdi-crosshairs-gps section-icon"></span>
                    <span class="section-label">Location Coordinates</span>
                  </div>
                  <div class="location-chip-row">
                    <div class="location-chip"><span class="mdi mdi-latitude"></span> Lat: {{ merchantProfile.lat }}
                    </div>
                    <div class="location-chip"><span class="mdi mdi-longitude"></span> Long: {{ merchantProfile.long }}
                    </div>
                  </div>
                </div>

                <!-- Confirm -->
                <label class="confirm-check-wrap">
                  <input type="checkbox" v-model="detailsConfirmed" class="confirm-checkbox" />
                  <span class="confirm-text">I have reviewed all the above details and confirm they are correct.
                    Clicking <strong>Confirm &amp; Send OTP</strong> will send a one-time password to the registered
                    mobile number to proceed with ISG verification.</span>
                </label>
              </template>

              <!-- No merchant -->
              <template v-else>
                <div class="error-state">
                  <div class="error-icon-wrap">
                    <div class="error-icon-ring" style="background:#fef3c7; border-color:#fde68a;">
                      <span class="mdi mdi-account-question" style="font-size:36px; color:#d97706;"></span>
                    </div>
                  </div>
                  <h2 class="error-title" style="color:#92400e;">No Merchant Found</h2>
                  <p class="error-desc">Could not load the merchant profile. Please ensure a valid merchant ID is
                    provided.</p>
                </div>
              </template>
            </div>
          </template>

          <!-- ════ STEP 2 — Verify OTP ════ -->
          <template v-else-if="step === 2">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-shield-check-outline upload-icon"></span>
                    <p class="analyzing-text">Enter OTP</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Enter OTP</h1>
              <p class="card-desc">Enter the 6-digit OTP sent to <strong>{{ otpPhone }}</strong>.</p>

              <div class="form-grid" style="max-width:380px; width:100%; margin-top:24px;">
                <div class="form-field-wrap">
                  <label class="form-label">ONE-TIME PASSWORD <span class="req-star">*</span></label>
                  <div class="form-input-box">
                    <span class="mdi mdi-lock-outline form-icon"></span>
                    <input v-model="otpCode" class="form-input" placeholder="Enter OTP" maxlength="6"
                      inputmode="numeric" style="letter-spacing: 0.3em; font-size: 18px; font-weight: 700;" />
                  </div>
                </div>
              </div>

              <div style="margin-top:12px; font-size:13px; color:#64748b;">
                Didn't receive it?
                <span v-if="otpResendTimer === 0"
                  style="color:#0a3d4a; font-weight:700; cursor:pointer; margin-left:4px;" @click="resendOtp">Resend
                  OTP</span>
                <span v-else style="color:#94a3b8; margin-left:4px;">Resend in {{ otpResendTimer }}s</span>
              </div>

              <div class="info-hint-box" style="max-width:380px; margin-top:16px;">
                <span class="mdi mdi-information-outline"></span>
                <p>OTP expires in 5 minutes. Check SMS on {{ otpPhone }}.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 3 — Verify PAN ════ -->
          <template v-else-if="step === 3">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-card-account-details-outline upload-icon"></span>
                    <p class="analyzing-text">PAN Verify</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Verify PAN</h1>
              <p class="card-desc">Enter PAN details to verify the merchant's identity with ISG. This must match
                government records exactly.</p>

              <div v-if="panVerified" class="verified-banner" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-check-circle"></span>
                <div>
                  <p class="verified-banner__title">PAN Verified Successfully</p>
                  <p class="verified-banner__sub">{{ panVerifiedName }} · {{ panData.pan }}</p>
                </div>
              </div>

              <div v-if="!panVerified" class="form-grid" style="max-width:420px; width:100%;">
                <div class="form-field-wrap">
                  <label class="form-label">PAN NUMBER <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': panErrors.pan }">
                    <span class="mdi mdi-card-account-details-outline form-icon"></span>
                    <input v-model="panData.pan" class="form-input" placeholder="ABCDE1234F" maxlength="10"
                      style="text-transform:uppercase"
                      @input="panData.pan = panData.pan.toUpperCase(); panErrors.pan = ''" />
                  </div>
                  <span v-if="panErrors.pan" class="field-error">{{ panErrors.pan }}</span>
                </div>
                <div class="form-field-wrap">
                  <label class="form-label">NAME AS ON PAN <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': panErrors.name }">
                    <span class="mdi mdi-account-outline form-icon"></span>
                    <input v-model="panData.name" class="form-input" placeholder="Full name as on PAN"
                      @input="panErrors.name = ''" />
                  </div>
                  <span v-if="panErrors.name" class="field-error">{{ panErrors.name }}</span>
                </div>
                <div class="form-field-wrap">
                  <label class="form-label">FATHER'S NAME <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': panErrors.fathername }">
                    <span class="mdi mdi-account-child-outline form-icon"></span>
                    <input v-model="panData.fathername" class="form-input" placeholder="Father's name"
                      @input="panErrors.fathername = ''" />
                  </div>
                  <span v-if="panErrors.fathername" class="field-error">{{ panErrors.fathername }}</span>
                </div>
                <div class="form-field-wrap">
                  <label class="form-label">DATE OF BIRTH <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': panErrors.dob }">
                    <span class="mdi mdi-calendar-outline form-icon"></span>
                    <input v-model="panData.dob" class="form-input" type="date" @change="panErrors.dob = ''" />
                  </div>
                  <span v-if="panErrors.dob" class="field-error">{{ panErrors.dob }}</span>
                </div>
              </div>

              <div class="info-hint-box" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-information-outline"></span>
                <p>PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). Name and DOB must match exactly as on
                  the PAN card.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 4 — Verify Bank Account ════ -->
          <template v-else-if="step === 4">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle">
                  <div class="illustration-inner">
                    <span class="mdi mdi-bank-outline upload-icon"></span>
                    <p class="analyzing-text">Bank Verify</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading">Verify Bank Account</h1>
              <p class="card-desc">Enter the merchant's settlement bank account details for ISG verification.</p>

              <div v-if="accountVerified" class="verified-banner" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-check-circle"></span>
                <div>
                  <p class="verified-banner__title">Bank Account Verified</p>
                  <p class="verified-banner__sub">{{ accountVerifiedName }} · {{ accountData.accountNumber }}</p>
                </div>
              </div>

              <div v-if="!accountVerified" class="form-grid" style="max-width:420px; width:100%;">
                <div class="form-field-wrap">
                  <label class="form-label">ACCOUNT HOLDER NAME <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': accountErrors.accountHolderName }">
                    <span class="mdi mdi-account-outline form-icon"></span>
                    <input v-model="accountData.accountHolderName" class="form-input" placeholder="Full name"
                      @input="accountErrors.accountHolderName = ''" />
                  </div>
                  <span v-if="accountErrors.accountHolderName" class="field-error">{{ accountErrors.accountHolderName
                    }}</span>
                </div>
                <div class="form-field-wrap">
                  <label class="form-label">ACCOUNT NUMBER <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': accountErrors.accountNumber }">
                    <span class="mdi mdi-bank-outline form-icon"></span>
                    <input v-model="accountData.accountNumber" class="form-input" placeholder="Bank account number"
                      inputmode="numeric" @input="accountErrors.accountNumber = ''" />
                  </div>
                  <span v-if="accountErrors.accountNumber" class="field-error">{{ accountErrors.accountNumber }}</span>
                </div>
                <div class="form-field-wrap">
                  <label class="form-label">IFSC CODE <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': accountErrors.ifsc }">
                    <span class="mdi mdi-bank-transfer form-icon"></span>
                    <input v-model="accountData.ifsc" class="form-input" placeholder="SBIN0001234" maxlength="11"
                      style="text-transform:uppercase"
                      @input="accountData.ifsc = accountData.ifsc.toUpperCase(); accountErrors.ifsc = ''" />
                  </div>
                  <span v-if="accountErrors.ifsc" class="field-error">{{ accountErrors.ifsc }}</span>
                </div>
              </div>

              <div v-if="accountVerified && accountSummary" class="account-summary-card"
                style="max-width:420px; margin-top:16px;">
                <div class="summary-row"><span class="summary-key">Bank</span><span class="summary-val">{{
                    accountSummary.bank_name }}</span></div>
                <div class="summary-row"><span class="summary-key">IFSC</span><span class="summary-val">{{
                  accountSummary.bank_ifsc_code }}</span></div>
                <div class="summary-row">
                  <span class="summary-key">Name Match</span>
                  <span class="summary-val" :class="accountSummary.account_holder_result ? 'text-green' : 'text-red'">
                    {{ accountSummary.account_holder_result ? '✓ Matched' : '✗ Mismatch' }}
                    ({{ Math.round((accountSummary.account_holder_score || 0) * 100) }}%)
                  </span>
                </div>
              </div>

              <div class="info-hint-box" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-information-outline"></span>
                <p>The bank account provided will be used as the settlement account. Ensure the account holder name
                  matches the PAN name for successful verification.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 5 — Document Collection ════ -->
          <template v-else-if="step === 5">
            <div class="card-body step1-body">

              <template v-if="fetchingCompliance">
                <div class="compliance-loading">
                  <div class="compliance-spinner"></div>
                  <p class="compliance-loading-text">Fetching required documents...</p>
                </div>
              </template>

              <template v-else>
                <div style="margin-bottom:20px;">
                  <h2 class="verify-name">Verification Documents</h2>
                  <p class="verify-biz" style="margin-top:4px;">Upload the required documents to complete verification
                  </p>
                </div>

                <div v-if="!isComplianceComplete" class="warn-alert" style="margin-bottom:16px;">
                  <span class="mdi mdi-alert-outline warn-alert__icon"></span>
                  <p>Please complete all required document categories before proceeding.</p>
                </div>

                <div v-if="isComplianceComplete" class="success-alert" style="margin-bottom:16px;">
                  <span class="mdi mdi-check-circle-outline success-alert__icon"></span>
                  <p>All required documents uploaded successfully. You are ready to proceed.</p>
                </div>

                <!-- Doc Sub-Window 0: Category Grid -->
                <template v-if="docStep === 0">
                  <div class="doc-category-grid">
                    <div v-for="group in requiredDocs" :key="group.category" class="doc-category-card"
                      :class="{ 'doc-category-card--done': group.compliant, 'doc-category-card--pending': !group.compliant }"
                      @click="openCategory(group)">
                      <div class="doc-cat-header">
                        <div class="doc-cat-icon"
                          :class="group.compliant ? 'doc-cat-icon--done' : 'doc-cat-icon--pending'">
                          <span class="mdi"
                            :class="group.compliant ? 'mdi-check-circle' : 'mdi-file-upload-outline'"></span>
                        </div>
                        <div class="doc-cat-chip"
                          :class="group.compliant ? 'doc-cat-chip--done' : 'doc-cat-chip--pending'">
                          {{ group.uploaded }} / {{ group.required }}
                        </div>
                      </div>
                      <div class="doc-cat-name">{{ group.category.replaceAll('_', ' ') }}</div>
                      <div class="doc-cat-progress-track">
                        <div class="doc-cat-progress-fill"
                          :class="group.compliant ? 'doc-cat-progress-fill--done' : 'doc-cat-progress-fill--pending'"
                          :style="{ width: group.required ? (group.uploaded / group.required * 100) + '%' : '0%' }">
                        </div>
                      </div>
                      <p class="doc-cat-hint">Click to manage documents</p>
                    </div>
                  </div>
                </template>

                <!-- Doc Sub-Window 1: Document List in Category -->
                <template v-else-if="docStep === 1">
                  <div class="doc-subheader">
                    <button class="doc-back-btn" @click="docStep = 0"><span class="mdi mdi-arrow-left"></span></button>
                    <div>
                      <div class="doc-subheader-title">{{ activeCategory?.category?.replaceAll('_', ' ') }}</div>
                      <div class="doc-subheader-sub">Upload all required documents below</div>
                    </div>
                  </div>
                  <div class="doc-category-grid">
                    <div v-for="doc in activeCategory?.documents" :key="doc.code" class="doc-item-card"
                      :class="{ 'doc-item-card--done': doc.uploaded }">
                      <div class="doc-item-status-icon">
                        <span class="mdi"
                          :class="doc.uploaded ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"
                          :style="{ color: doc.uploaded ? '#16a34a' : '#ef4444' }"></span>
                      </div>
                      <div class="doc-item-name">{{ doc.name }}</div>
                      <div class="doc-item-chip"
                        :class="doc.uploaded ? 'doc-item-chip--done' : 'doc-item-chip--pending'">
                        {{ doc.uploaded ? 'Uploaded' : 'Pending' }}
                      </div>
                      <button class="doc-item-btn"
                        :disabled="doc.uploaded || (activeCategory?.category !== 'STORE_IMAGE' && activeCategory?.uploaded > 0)"
                        @click="openDocUpload(doc.code)">
                        {{ doc.uploaded ? 'Added' : 'Add Document' }}
                      </button>
                    </div>
                  </div>
                </template>

                <!-- Doc Sub-Window 2: Upload Form -->
                <template v-else-if="docStep === 2">
                  <div class="doc-subheader">
                    <button class="doc-back-btn" @click="docStep = 1"><span class="mdi mdi-arrow-left"></span></button>
                    <div>
                      <div class="doc-subheader-title">Upload {{ activeDocType?.replaceAll('_', ' ') }}</div>
                      <div class="doc-subheader-sub">Ensure images are clear and readable</div>
                    </div>
                  </div>

                  <div class="doc-upload-form">

                    <!-- ══ AADHAAR: two-step front then back ══ -->
                    <template v-if="activeDocType === 'AADHAAR'">
                      <div class="aadhaar-steps-wrap" style="max-width:420px; width:100%; margin-top:16px;">

                        <!-- Step 1: Front -->
                        <div class="aadhaar-step-row" :class="{
                          'aadhaar-step-row--done': aadhaarFrontId,
                          'aadhaar-step-row--active': !aadhaarFrontId,
                        }">
                          <div class="aadhaar-step-badge">
                            <span class="mdi"
                              :class="aadhaarFrontId ? 'mdi-check-circle' : 'mdi-numeric-1-circle-outline'"></span>
                            <span>Aadhaar Front</span>
                          </div>

                          <template v-if="!aadhaarFrontId">
                            <div class="file-drop-zone" @click="triggerAadhaarInput('front')" @dragover.prevent
                              @drop.prevent="handleAadhaarDrop($event, 'front')">
                              <span class="mdi mdi-card-account-details-outline file-drop-icon"></span>
                              <p class="file-drop-text">
                                {{ aadhaarFrontFile ? aadhaarFrontFile.name : 'Click or drag — Aadhaar Front side' }}
                              </p>
                              <p class="file-drop-hint">Accepted: JPG, PNG, WEBP</p>
                              <input ref="aadhaarFrontInputRef" type="file" accept="image/*" style="display:none"
                                @change="handleAadhaarFileSelect($event, 'front')" />
                            </div>

                            <!-- Preview chip after file selected -->
                            <div v-if="aadhaarFrontFile" class="file-chips" style="margin-top:8px;">
                              <div class="file-chip">
                                <span class="mdi mdi-image-outline"></span>
                                <span class="file-chip-name">{{ aadhaarFrontFile.name }}</span>
                              </div>
                            </div>

                            <button class="btn-save-doc" style="width:100%; margin-top:12px;"
                              :disabled="!aadhaarFrontFile || uploadingAadhaar" @click="uploadAadhaarSide('front')">
                              <span v-if="uploadingAadhaar && aadhaarStep === 0" class="spinner-btn"></span>
                              <template v-else>
                                <span class="mdi mdi-upload"></span> Upload Front
                              </template>
                            </button>
                          </template>

                          <div v-else class="aadhaar-uploaded-chip">
                            <span class="mdi mdi-check-circle"></span> Front uploaded successfully
                          </div>
                        </div>

                        <!-- Step 2: Back — locked until front is done -->
                        <div class="aadhaar-step-row" :class="{
                          'aadhaar-step-row--done': aadhaarBackId,
                          'aadhaar-step-row--active': aadhaarFrontId && !aadhaarBackId,
                          'aadhaar-step-row--locked': !aadhaarFrontId,
                        }">
                          <div class="aadhaar-step-badge">
                            <span class="mdi"
                              :class="aadhaarBackId ? 'mdi-check-circle' : 'mdi-numeric-2-circle-outline'"></span>
                            <span>Aadhaar Back</span>
                          </div>

                          <!-- Locked state -->
                          <div v-if="!aadhaarFrontId" class="aadhaar-locked-hint">
                            <span class="mdi mdi-lock-outline"></span> Upload front side first
                          </div>

                          <!-- Active: back upload -->
                          <template v-else-if="aadhaarFrontId && !aadhaarBackId">
                            <div class="file-drop-zone" @click="triggerAadhaarInput('back')" @dragover.prevent
                              @drop.prevent="handleAadhaarDrop($event, 'back')">
                              <span class="mdi mdi-card-account-details-outline file-drop-icon"></span>
                              <p class="file-drop-text">
                                {{ aadhaarBackFile ? aadhaarBackFile.name : 'Click or drag — Aadhaar Back side' }}
                              </p>
                              <p class="file-drop-hint">Accepted: JPG, PNG, WEBP</p>
                              <input ref="aadhaarBackInputRef" type="file" accept="image/*" style="display:none"
                                @change="handleAadhaarFileSelect($event, 'back')" />
                            </div>

                            <!-- Preview chip after file selected -->
                            <div v-if="aadhaarBackFile" class="file-chips" style="margin-top:8px;">
                              <div class="file-chip">
                                <span class="mdi mdi-image-outline"></span>
                                <span class="file-chip-name">{{ aadhaarBackFile.name }}</span>
                              </div>
                            </div>

                            <button class="btn-save-doc" style="width:100%; margin-top:12px;"
                              :disabled="!aadhaarBackFile || uploadingAadhaar" @click="uploadAadhaarSide('back')">
                              <span v-if="uploadingAadhaar && aadhaarStep === 1" class="spinner-btn"></span>
                              <template v-else>
                                <span class="mdi mdi-upload"></span> Upload Back
                              </template>
                            </button>
                          </template>

                          <!-- Done -->
                          <div v-else class="aadhaar-uploaded-chip">
                            <span class="mdi mdi-check-circle"></span> Back uploaded successfully
                          </div>
                        </div>

                        <!-- Step 3: Aadhaar number + final Save — only after both sides uploaded -->
                        <div v-if="aadhaarFrontId && aadhaarBackId" class="aadhaar-finalize">
                          <div class="form-field-wrap" style="width:100%;">
                            <label class="form-label">AADHAAR NUMBER <span class="req-star">*</span></label>
                            <div class="form-input-box">
                              <span class="mdi mdi-identifier form-icon"></span>
                              <input v-model="docUploads['AADHAAR'].docNumber" class="form-input"
                                placeholder="12-digit Aadhaar number" maxlength="12" inputmode="numeric" />
                            </div>
                          </div>
                          <button class="btn-save-doc" style="width:100%; margin-top:16px;"
                            :disabled="savingDoc || !docUploads['AADHAAR']?.docNumber || docUploads['AADHAAR'].docNumber.length < 12"
                            @click="saveAadhaarDoc">
                            <span v-if="savingDoc" class="spinner-btn"></span>
                            <template v-else>
                              <span class="mdi mdi-content-save-outline"></span> Save Aadhaar
                            </template>
                          </button>
                        </div>

                      </div>
                    </template>

                    <!-- ══ All other doc types ══ -->
                    <template v-else>

                      <!-- Document Number field -->
                      <div v-if="showDocNumber && activeDocType !== 'BANK_PASSBOOK'" class="form-field-wrap"
                        style="max-width:420px; width:100%;">
                        <label class="form-label">{{ docNumberLabel }} <span class="req-star">*</span></label>
                        <div class="form-input-box">
                          <span class="mdi mdi-identifier form-icon"></span>
                          <input v-model="docUploads[activeDocType].docNumber" class="form-input"
                            :placeholder="docNumberLabel" />
                        </div>
                      </div>

                      <!-- BANK PASSBOOK FIELDS -->
                      <div v-if="activeDocType === 'BANK_PASSBOOK'" class="form-grid"
                        style="max-width:420px; width:100%;">
                        <div class="form-field-wrap">
                          <label class="form-label">ACCOUNT HOLDER NAME <span class="req-star">*</span></label>
                          <div class="form-input-box"><span class="mdi mdi-account-outline form-icon"></span><input
                              v-model="docUploads.BANK_PASSBOOK.settlement.accountHolderName" class="form-input"
                              placeholder="Account holder name" /></div>
                        </div>
                        <div class="form-field-wrap">
                          <label class="form-label">ACCOUNT NUMBER <span class="req-star">*</span></label>
                          <div class="form-input-box"><span class="mdi mdi-bank-outline form-icon"></span><input
                              v-model="docUploads.BANK_PASSBOOK.settlement.accountNumber" class="form-input"
                              placeholder="Account number" inputmode="numeric" /></div>
                        </div>
                        <div class="form-field-wrap">
                          <label class="form-label">BANK NAME <span class="req-star">*</span></label>
                          <div class="form-input-box"><span class="mdi mdi-bank form-icon"></span><input
                              v-model="docUploads.BANK_PASSBOOK.settlement.bankName" class="form-input"
                              placeholder="Bank name" /></div>
                        </div>
                        <div class="form-field-wrap">
                          <label class="form-label">IFSC CODE <span class="req-star">*</span></label>
                          <div class="form-input-box"><span class="mdi mdi-bank-transfer form-icon"></span><input
                              v-model="docUploads.BANK_PASSBOOK.settlement.ifsc" class="form-input"
                              placeholder="SBIN0001234" maxlength="11" style="text-transform:uppercase"
                              @input="docUploads.BANK_PASSBOOK.settlement.ifsc = docUploads.BANK_PASSBOOK.settlement.ifsc.toUpperCase()" />
                          </div>
                        </div>
                        <div class="form-field-wrap">
                          <label class="form-label">CITY <span class="req-star">*</span></label>
                          <div class="form-input-box"><span class="mdi mdi-city-variant-outline form-icon"></span><input
                              v-model="docUploads.BANK_PASSBOOK.settlement.city" class="form-input"
                              placeholder="City" /></div>
                        </div>
                        <div class="form-field-wrap">
                          <label class="form-label">STATE <span class="req-star">*</span></label>
                          <div class="form-input-box"><span class="mdi mdi-map-outline form-icon"></span><input
                              v-model="docUploads.BANK_PASSBOOK.settlement.state" class="form-input"
                              placeholder="State" /></div>
                        </div>
                        <div class="form-field-wrap">
                          <label class="form-label">ACCOUNT TYPE <span class="req-star">*</span></label>
                          <div class="form-input-box">
                            <span class="mdi mdi-wallet-outline form-icon"></span>
                            <select v-model="docUploads.BANK_PASSBOOK.settlement.account_type" class="form-input"
                              style="cursor:pointer;">
                              <option value="">Select type</option>
                              <option value="SAVING">Saving</option>
                              <option value="CURRENT">Current</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <!-- PAN FIELDS — pre-filled from verified PAN, read-only -->
                      <div
                        v-if="activeDocType === 'INDIVIDUAL_PAN' || activeDocType === 'PARTNER1_INDIVIDUAL_PAN' || activeDocType === 'PARTNER2_INDIVIDUAL_PAN'"
                        class="pan-prefilled-block" style="max-width:420px; width:100%;">
                        <div class="pan-prefill-notice">
                          <span class="mdi mdi-information-outline"></span>
                          <p>PAN details are pre-filled from your verified PAN. Please upload a clear image of your PAN
                            card below.</p>
                        </div>
                        <div class="pan-prefill-grid">
                          <div class="pan-prefill-item">
                            <span class="pan-prefill-key">PAN NUMBER</span>
                            <span class="pan-prefill-val">{{ merchantProfile.pan || '—' }}</span>
                          </div>
                          <div class="pan-prefill-item">
                            <span class="pan-prefill-key">PAN HOLDER NAME</span>
                            <span class="pan-prefill-val">{{ merchantProfile.pan_name || '—' }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- File Upload -->
                      <div class="file-upload-area" style="max-width:420px; width:100%; margin-top:16px;">
                        <label class="form-label">UPLOAD {{ requiredImageCount }} IMAGE(S) <span
                            class="req-star">*</span></label>
                        <div class="file-drop-zone" @click="triggerFileInput" @dragover.prevent
                          @drop.prevent="handleFileDrop">
                          <span class="mdi mdi-cloud-upload-outline file-drop-icon"></span>
                          <p class="file-drop-text">
                            {{ docUploads[activeDocType]?.files?.length
                              ? `${docUploads[activeDocType].files.length} / ${requiredImageCount} file(s) selected`
                              : `Click or drag to upload ${requiredImageCount} image(s)` }}
                          </p>
                          <p class="file-drop-hint">Accepted: JPG, PNG, WEBP</p>
                          <input ref="fileInputRef" type="file" multiple accept="image/*" style="display:none"
                            @change="handleFileSelect" />
                        </div>
                        <div v-if="docUploads[activeDocType]?.files?.length" class="file-chips">
                          <div v-for="(f, i) in docUploads[activeDocType].files" :key="i" class="file-chip">
                            <span class="mdi mdi-image-outline"></span>
                            <span class="file-chip-name">{{ f.name }}</span>
                          </div>
                        </div>
                      </div>

                      <button class="btn-save-doc"
                        :disabled="savingDoc || docUploads[activeDocType]?.files?.length !== requiredImageCount || (showDocNumber && !docUploads[activeDocType]?.docNumber)"
                        @click="saveDocUpload" style="max-width:420px; width:100%; margin-top:20px;">
                        <span v-if="savingDoc" class="spinner-btn"></span>
                        <template v-else><span class="mdi mdi-content-save-outline"></span> Save Document</template>
                      </button>

                    </template>
                    <!-- ══ end non-Aadhaar ══ -->

                  </div>
                </template>
              </template>
            </div>
          </template>

          <!-- ════ STEP 6 — Review & Submit ════ -->
          <template v-else-if="step === 6">
            <div class="card-body step1-body">
              <div style="margin-bottom:20px;">
                <h2 class="verify-name">Review & Submit ISG Onboarding</h2>
                <p class="verify-biz" style="margin-top:4px;">All verifications complete. Review your verified details
                  and submit to ISG.</p>
              </div>

              <div class="verification-status-grid">
                <div class="vstatus-card" :class="otpVerified ? 'vstatus-card--done' : 'vstatus-card--pending'">
                  <div class="vstatus-icon-wrap"><span class="mdi"
                      :class="otpVerified ? 'mdi-check-circle' : 'mdi-alert-circle-outline'"></span></div>
                  <div class="vstatus-info">
                    <p class="vstatus-title">Mobile Verified</p>
                    <p class="vstatus-sub">{{ otpVerified ? otpPhone : 'Not verified' }}</p>
                  </div>
                  <span class="vstatus-badge" :class="otpVerified ? 'vstatus-badge--done' : 'vstatus-badge--pending'">{{
                    otpVerified ? 'Verified' : 'Pending' }}</span>
                </div>

                <div class="vstatus-card" :class="panVerified ? 'vstatus-card--done' : 'vstatus-card--pending'">
                  <div class="vstatus-icon-wrap"><span class="mdi"
                      :class="panVerified ? 'mdi-check-circle' : 'mdi-alert-circle-outline'"></span></div>
                  <div class="vstatus-info">
                    <p class="vstatus-title">PAN Verification</p>
                    <p class="vstatus-sub">{{ panVerified ? (panVerifiedName || panData.pan) : 'Not verified' }}</p>
                  </div>
                  <span class="vstatus-badge" :class="panVerified ? 'vstatus-badge--done' : 'vstatus-badge--pending'">{{
                    panVerified ? 'Verified' : 'Pending' }}</span>
                </div>

                <div class="vstatus-card" :class="accountVerified ? 'vstatus-card--done' : 'vstatus-card--pending'">
                  <div class="vstatus-icon-wrap"><span class="mdi"
                      :class="accountVerified ? 'mdi-check-circle' : 'mdi-alert-circle-outline'"></span></div>
                  <div class="vstatus-info">
                    <p class="vstatus-title">Bank Account</p>
                    <p class="vstatus-sub">{{ accountVerified ? (accountSummary?.bank_name || accountData.accountNumber)
                      : 'Not verified' }}</p>
                  </div>
                  <span class="vstatus-badge"
                    :class="accountVerified ? 'vstatus-badge--done' : 'vstatus-badge--pending'">{{ accountVerified ?
                    'Verified' : 'Pending' }}</span>
                </div>

                <div class="vstatus-card"
                  :class="isComplianceComplete ? 'vstatus-card--done' : 'vstatus-card--pending'">
                  <div class="vstatus-icon-wrap"><span class="mdi"
                      :class="isComplianceComplete ? 'mdi-check-circle' : 'mdi-alert-circle-outline'"></span></div>
                  <div class="vstatus-info">
                    <p class="vstatus-title">Documents</p>
                    <p class="vstatus-sub">{{ isComplianceComplete ? 'All documents uploaded' : 'Some documents missing'
                      }}</p>
                  </div>
                  <span class="vstatus-badge"
                    :class="isComplianceComplete ? 'vstatus-badge--done' : 'vstatus-badge--pending'">{{
                      isComplianceComplete ? 'Complete' : 'Pending' }}</span>
                </div>
              </div>

              <div v-if="!panVerified || !accountVerified || !isComplianceComplete" class="warn-alert"
                style="margin-top:16px;">
                <span class="mdi mdi-alert-outline warn-alert__icon"></span>
                <p>
                  <span v-if="!panVerified">PAN verification is required. </span>
                  <span v-if="!accountVerified">Bank account verification is required. </span>
                  <span v-if="!isComplianceComplete">All required documents must be uploaded. </span>
                  Please go back and complete the missing steps.
                </p>
              </div>

              <div v-if="panVerified && accountVerified && isComplianceComplete" class="success-alert"
                style="margin-top:16px;">
                <span class="mdi mdi-check-circle-outline success-alert__icon"></span>
                <p>All verifications completed. You can now submit the ISG onboarding.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 7 — Complete ════ -->
          <template v-else-if="step === 7">
            <div class="card-body">
              <div class="illustration-wrap">
                <div class="illustration-circle"
                  style="background:linear-gradient(135deg,rgba(34,197,94,0.08),rgba(34,197,94,0.18));">
                  <div class="illustration-inner">
                    <span class="mdi mdi-check-decagram" style="font-size:52px; color:#16a34a; display:block;"></span>
                    <p class="analyzing-text" style="color:#16a34a;">Complete</p>
                  </div>
                </div>
              </div>
              <h1 class="card-heading" style="color:#16a34a;">ISG Onboarding Submitted!</h1>
              <p class="card-desc">Your ISG onboarding has been successfully submitted. Terminal activation will be
                completed shortly.</p>

              <div v-if="submitResult" class="result-chips">
                <div v-if="submitResult.tid" class="result-chip">
                  <span class="mdi mdi-identifier result-chip__icon"></span>
                  <div>
                    <p class="result-chip__label">Terminal ID</p>
                    <p class="result-chip__val">{{ submitResult.tid }}</p>
                  </div>
                </div>
                <div v-if="submitResult.vpa" class="result-chip">
                  <span class="mdi mdi-qrcode result-chip__icon"></span>
                  <div>
                    <p class="result-chip__label">VPA</p>
                    <p class="result-chip__val">{{ submitResult.vpa }}</p>
                  </div>
                </div>
                <div v-if="submitResult.appID" class="result-chip">
                  <span class="mdi mdi-application-outline result-chip__icon"></span>
                  <div>
                    <p class="result-chip__label">App ID</p>
                    <p class="result-chip__val">{{ submitResult.appID }}</p>
                  </div>
                </div>
              </div>

              <div class="complete-chips">
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Details Confirmed</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Mobile Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> PAN Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Account Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Documents Uploaded</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Submitted to ISG</div>
              </div>

              <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:28px;">
                <button class="btn-continue" style="background:#16a34a; box-shadow:0 4px 14px rgba(22,163,74,0.3);"
                  @click="goToDashboard">
                  <span class="mdi mdi-view-dashboard-outline"></span> Go to Dashboard
                </button>
              </div>
            </div>
          </template>

          <!-- ── Card Footer ── -->
          <div class="card-footer" v-if="step !== 7">

            <!-- Back: not on step 1; on step 2 go back to step 1 -->
            <button v-if="step > 1" class="btn-back" @click="goBack">
              <span class="mdi mdi-arrow-left"></span> Back
            </button>
            <div v-else style="flex:1;"></div>

            <div class="footer-right-btns">

              <!-- Step 1: Verify Merchant Details → Confirm & Send OTP -->
              <button v-if="step === 1" class="btn-continue"
                :disabled="loading || fetchingMerchant || !detailsConfirmed || !merchantProfile"
                @click="handleStep1Confirm">
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Confirm &amp; Send OTP <span class="mdi mdi-send"></span></template>
              </button>

              <!-- Step 2: Verify OTP -->
              <button v-else-if="step === 2" class="btn-continue" :disabled="loading || !otpCode || otpCode.length < 4"
                @click="handleStep2VerifyOtp">
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>Verify OTP <span class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 3: Verify PAN -->
              <button v-else-if="step === 3" class="btn-continue" :disabled="loading" @click="handleStep3Pan">
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>{{ panVerified ? 'Continue' : 'Verify PAN' }} <span
                    class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 4: Verify Account -->
              <button v-else-if="step === 4" class="btn-continue" :disabled="loading" @click="handleStep4Account">
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>{{ accountVerified ? 'Continue' : 'Verify Account' }} <span
                    class="mdi mdi-arrow-right"></span></template>
              </button>

              <!-- Step 5: Documents -->
              <button v-else-if="step === 5" class="btn-continue"
                :disabled="!isComplianceComplete || fetchingCompliance" @click="handleStep5Docs">
                {{ isComplianceComplete ? 'Continue' : 'Upload Documents' }}
                <span class="mdi mdi-arrow-right"></span>
              </button>

              <!-- Step 6: Submit -->
              <button v-else-if="step === 6" class="btn-continue"
                :disabled="!panVerified || !accountVerified || !isComplianceComplete || submitting"
                @click="handleStep6Submit">
                <span v-if="submitting" class="spinner-btn"></span>
                <template v-else>Submit to ISG <span class="mdi mdi-check"></span></template>
              </button>

            </div>
          </div>

        </div>

        <!-- ── Info Cards ── -->
        <div class="info-cards">
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-store-outline info-icon"></span></div>
            <div>
              <p class="info-title">Merchant Details Review</p>
              <p class="info-desc">Review all merchant details first. OTP will be auto-sent to the registered mobile
                number.</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-card-account-details-outline info-icon"></span></div>
            <div>
              <p class="info-title">PAN Verification Required</p>
              <p class="info-desc">Keep PAN card handy. Name, father's name and DOB must match exactly.</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-bank-outline info-icon"></span></div>
            <div>
              <p class="info-title">Bank Account Verification</p>
              <p class="info-desc">Settlement account IFSC and account holder name will be verified via ISG.</p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <footer class="isg-footer">
      © {{ new Date().getFullYear() }} Merchant Portal. All rights reserved. •
      <a href="#" class="footer-link">Privacy Policy</a> •
      <a href="#" class="footer-link">Terms of Service</a>
    </footer>

    <!-- ── Snackbar ── -->
    <transition name="snack">
      <div v-if="snackbar.show" class="snackbar" :class="'snackbar-' + snackbar.color">
        <span class="mdi"
          :class="snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
        <span class="snack-msg">{{ snackbar.message }}</span>
        <button class="snack-close" @click="snackbar.show = false"><span class="mdi mdi-close"></span></button>
      </div>
    </transition>

    <!-- ── Processing overlay ── -->
    <transition name="fade">
      <div v-if="loading || submitting" class="processing-overlay">
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
import { useIsgOnboardingApi } from "@/composables/apis/useIsgOnboardingApi";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useRouter, useRoute } from "vue-router";

// ── Composables ──────────────────────────────────────────────────────────────
const {
  isgSendOtp,
  isgVerifyOtp,
  isgGetMerchantForOnboarding,
  isgVerifyPan,
  isgVerifyAccount,
  isgSubmitOnboarding,
  uploadDoc,
  complianceInit,
} = useIsgOnboardingApi();

const { complianceStatus } = useOnboadingApi();

const router = useRouter();
const route = useRoute();

const kycStatus = ref();

// ── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({ merchantId: String });

// ── Steps definition — 7 total (removed manual phone entry step) ─────────────
const steps = [
  { key: "verify", label: "Verify", icon: "mdi-account-check-outline" },
  { key: "otp", label: "OTP", icon: "mdi-shield-check-outline" },
  { key: "pan", label: "PAN", icon: "mdi-card-account-details-outline" },
  { key: "account", label: "Account", icon: "mdi-bank-outline" },
  { key: "docs", label: "Documents", icon: "mdi-file-document-multiple-outline" },
  { key: "review", label: "Review", icon: "mdi-clipboard-check-outline" },
  { key: "complete", label: "Complete", icon: "mdi-check-decagram" },
];

const stepLabels = [
  "Verify Merchant Details",
  "Verify OTP",
  "PAN Verification",
  "Bank Account Verification",
  "Document Collection",
  "Review & Submit",
  "Complete",
];

const totalSteps = computed(() => steps.length);
const currentStepLabel = computed(() => stepLabels[step.value - 1] || "");

// ── Core state ───────────────────────────────────────────────────────────────
const step = ref(1);
const loading = ref(false);
const submitting = ref(false);
const processingMsg = ref("Processing...");
const fetchingMerchant = ref(false);
const merchantProfile = ref(null);
const detailsConfirmed = ref(false);

// ── OTP state — phone is always fetched from merchant profile ────────────────
const otpPhone = ref("");
const otpCode = ref("");
const otpVerified = ref(false);
const otpResendTimer = ref(0);
let resendInterval = null;

const aadhaarStep = ref(0); // 0 = front, 1 = back
const aadhaarFrontFile = ref(null);
const aadhaarBackFile = ref(null);
const aadhaarFrontId = ref(null);
const aadhaarBackId = ref(null);

function startResendTimer() {
  otpResendTimer.value = 30;
  if (resendInterval) clearInterval(resendInterval);
  resendInterval = setInterval(() => {
    if (otpResendTimer.value > 0) {
      otpResendTimer.value--;
    } else {
      clearInterval(resendInterval);
    }
  }, 1000);
}

// ── PAN state ────────────────────────────────────────────────────────────────
const panData = reactive({ pan: "", name: "", fathername: "", dob: "" });
const panErrors = reactive({ pan: "", name: "", fathername: "", dob: "" });
const panVerified = ref(false);
const panVerifiedName = ref("");

// ── Account state ────────────────────────────────────────────────────────────
const accountData = reactive({ accountHolderName: "", accountNumber: "", ifsc: "" });
const accountErrors = reactive({ accountHolderName: "", accountNumber: "", ifsc: "" });
const accountVerified = ref(false);
const accountVerifiedName = ref("");
const accountSummary = ref(null);

// ── Compliance / Documents state ─────────────────────────────────────────────
const fetchingCompliance = ref(false);
const complianceResponse = ref(null);
const docStep = ref(0);
const activeCategory = ref(null);
const activeDocType = ref(null);
const savingDoc = ref(false);
const fileInputRef = ref(null);

// ── Submit result ────────────────────────────────────────────────────────────
const submitResult = ref(null);

// ── Snackbar ─────────────────────────────────────────────────────────────────
const snackbar = reactive({ show: false, message: "", color: "success" });

// ── DOC RULES ────────────────────────────────────────────────────────────────
const DOC_RULES = {
  DEFAULT: {
    label: "Document Number", images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds, docType) => {
      const now = new Date();
      const docNumber = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");
      return { doc_type: docType, doc_number: docNumber, images: imageIds };
    }
  },
  AADHAAR: {
    label: "Aadhaar Number", images: 2, requiresNumber: true,
    buildPayload: (doc, imageIds, docType = "AADHAAR") => ({ doc_type: docType, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER1_AADHAAR: {
    label: "Aadhaar Number", images: 2, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER1_AADHAAR", partner: 1, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER2_AADHAAR: {
    label: "Aadhaar Number", images: 2, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER2_AADHAAR", partner: 2, doc_number: doc.docNumber, images: imageIds })
  },
  DRIVING_LICENSE: {
    label: "Driving License Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds, docType = "DRIVING_LICENSE") => ({ doc_type: docType, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER1_DRIVING_LICENSE: {
    label: "Driving License Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER1_DRIVING_LICENSE", partner: 1, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER2_DRIVING_LICENSE: {
    label: "Driving License Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER2_DRIVING_LICENSE", partner: 2, doc_number: doc.docNumber, images: imageIds })
  },
  VOTER_ID: {
    label: "Voter ID Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds, docType = "VOTER_ID") => ({ doc_type: docType, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER1_VOTER_ID: {
    label: "Voter ID Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER1_VOTER_ID", partner: 1, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER2_VOTER_ID: {
    label: "Voter ID Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER2_VOTER_ID", partner: 2, doc_number: doc.docNumber, images: imageIds })
  },
  PASSPORT: {
    label: "Passport Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds, docType = "PASSPORT") => ({ doc_type: docType, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER1_PASSPORT: {
    label: "Passport Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER1_PASSPORT", partner: 1, doc_number: doc.docNumber, images: imageIds })
  },
  PARTNER2_PASSPORT: {
    label: "Passport Number", images: 1, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER2_PASSPORT", partner: 2, doc_number: doc.docNumber, images: imageIds })
  },
  INDIVIDUAL_PAN: {
    label: "PAN Number", images: 1, requiresNumber: false,
    formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } },
    buildPayload: (doc, imageIds, docType = "INDIVIDUAL_PAN") => ({ doc_type: docType, doc_number: doc.pan.pan, pan: { ...doc.pan }, images: imageIds })
  },
  PARTNER1_INDIVIDUAL_PAN: {
    label: "PAN Number", images: 1, requiresNumber: false,
    formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } },
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER1_INDIVIDUAL_PAN", partner: 1, doc_number: doc.pan.pan, pan: { ...doc.pan, partner: true }, images: imageIds })
  },
  PARTNER2_INDIVIDUAL_PAN: {
    label: "PAN Number", images: 1, requiresNumber: false,
    formSchema: { pan: { pan: "", pan_name: "", pan_dob: "", pan_father_name: "" } },
    buildPayload: (doc, imageIds) => ({ doc_type: "PARTNER2_INDIVIDUAL_PAN", partner: 2, doc_number: doc.pan.pan, pan: { ...doc.pan, partner: true }, images: imageIds })
  },
  BANK_PASSBOOK: {
    label: "Bank Account Number", images: 1, requiresNumber: false,
    formSchema: { settlement: { accountHolderName: "", account_type: "", bankName: "", accountNumber: "", ifsc: "", city: "", state: "", consent: "Y", additionalData: true } },
    buildPayload: (doc, imageIds) => ({ doc_type: "BANK_PASSBOOK", doc_number: doc.settlement.accountNumber, settlement: { ...doc.settlement }, images: imageIds })
  },
  INDOOR_STORE_IMAGE: {
    label: null, images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds) => ({ doc_type: "INDOOR_STORE_IMAGE", doc_number: doc.docNumber, images: imageIds })
  },
  OUTDOOR_STORE_IMAGE: {
    label: null, images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds) => ({ doc_type: "OUTDOOR_STORE_IMAGE", doc_number: doc.docNumber, images: imageIds })
  },
};

// ── Computed ──────────────────────────────────────────────────────────────────
const isStoreImageCategory = (category) => category === 'STORE_IMAGE';

const requiredDocs = computed(() => {
  if (!complianceResponse.value?.categories) return [];

  const ISG_CATEGORIES = ['STORE_IMAGE', 'INDIVIDUAL_PAN', 'IDENTITY'];

  return complianceResponse.value.categories
    .filter(cat => ISG_CATEGORIES.includes(cat.category))
    .map(cat => {
      const documents = cat.category === 'IDENTITY'
        ? (cat.documents || []).filter(doc => doc.code === 'AADHAAR')
        : (cat.documents || []);

      const uploadedCount = documents.filter(d => d.uploaded).length;
      const isStoreImage = isStoreImageCategory(cat.category);
      const required = isStoreImage ? documents.length : 1;
      const uploaded = uploadedCount;
      const compliant = isStoreImage ? uploadedCount === documents.length : uploadedCount > 0;
      const missing = isStoreImage ? Math.max(documents.length - uploadedCount, 0) : compliant ? 0 : 1;

      return { category: cat.category, documents, required, uploaded, missing, compliant };
    });
});

const isComplianceComplete = computed(() => {
  if (!requiredDocs.value.length) return false;
  return requiredDocs.value.every(cat => cat.compliant);
});

const activeDocRule = computed(() => DOC_RULES[activeDocType.value] || DOC_RULES["DEFAULT"]);
const showDocNumber = computed(() => activeDocRule.value.requiresNumber);
const docNumberLabel = computed(() => activeDocRule.value.label || "Document Number");
const requiredImageCount = computed(() => activeDocRule.value.images || 1);

const docUploads = reactive({});

// ── Helpers ───────────────────────────────────────────────────────────────────
function showSnack(message, color = "success") {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
  setTimeout(() => (snackbar.show = false), 4500);
}

function goBack() {
  // Inside step 5 docs sub-windows: navigate sub-steps first
  if (step.value === 5 && docStep.value > 0) {
    docStep.value--;
    return;
  }
  if (step.value > 1) step.value--;
}

function goToDashboard() {
  router.push("/vendor/merchants");
}

function formatDOB(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

// ── Step 1 — Confirm merchant details & auto-send OTP ────────────────────────
async function handleStep1Confirm() {
  if (!detailsConfirmed.value) {
    showSnack("Please confirm you have reviewed the details", "error");
    return;
  }
  if (!otpPhone.value) {
    showSnack("No mobile number found on merchant profile", "error");
    return;
  }

  loading.value = true;
  processingMsg.value = "Sending OTP to " + otpPhone.value + "...";
  try {
    const res = await isgSendOtp({ phone: otpPhone.value });
    if (res?.statusCode === "00" || res.data?.statusCode === "00") {
      startResendTimer();
      showSnack("OTP sent to " + otpPhone.value, "success");
      step.value = 2;
    } else {
      showSnack(res?.message || res?.data?.message || "Failed to send OTP", "error");
    }
  } catch {
    showSnack("Network error while sending OTP", "error");
  } finally {
    loading.value = false;
  }
}

// ── Resend OTP ────────────────────────────────────────────────────────────────
async function resendOtp() {
  otpCode.value = "";
  loading.value = true;
  processingMsg.value = "Resending OTP...";
  try {
    const res = await isgSendOtp({ phone: otpPhone.value });
    if (res?.statusCode === "00") {
      startResendTimer();
      showSnack("OTP resent to " + otpPhone.value, "success");
    } else {
      showSnack(res?.message || "Failed to resend OTP", "error");
    }
  } catch {
    showSnack("Network error while resending OTP", "error");
  } finally {
    loading.value = false;
  }
}

// ── Step 2 — Verify OTP ──────────────────────────────────────────────────────
async function handleStep2VerifyOtp() {
  if (!otpCode.value || otpCode.value.length < 4) {
    showSnack("Enter the OTP received on your mobile", "error");
    return;
  }
  loading.value = true;
  processingMsg.value = "Verifying OTP...";
  try {
    const res = await isgVerifyOtp({ phone: otpPhone.value, otp: otpCode.value });
    if (res?.data?.statusCode === "00" || res?.statusCode === "00") {
      otpVerified.value = true;
      showSnack("OTP verified! Proceeding to PAN verification.", "success");
      // Pre-fill PAN & account from already-loaded merchantProfile
      if (merchantProfile.value) {
        if (!panData.name && merchantProfile.value.legal_name)
          panData.name = merchantProfile.value.legal_name;
        if (!panData.dob && (merchantProfile.value.dob || merchantProfile.value.business_dob)) {
          const raw = merchantProfile.value.dob || merchantProfile.value.business_dob;
          if (raw) { try { panData.dob = new Date(raw).toISOString().slice(0, 10); } catch { } }
        }
        if (!accountData.accountHolderName && merchantProfile.value.legal_name)
          accountData.accountHolderName = merchantProfile.value.legal_name;
      }
      step.value = 3;
    } else {
      showSnack(res?.message || "Invalid or expired OTP", "error");
    }
  } catch {
    showSnack("Network error while verifying OTP", "error");
  } finally {
    loading.value = false;
  }
}

// ── Step 3 — Verify PAN ──────────────────────────────────────────────────────
async function handleStep3Pan() {
  if (panVerified.value) { step.value = 4; return; }

  panErrors.pan = ""; panErrors.name = ""; panErrors.fathername = ""; panErrors.dob = "";

  const panReg = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panData.pan.trim() || !panReg.test(panData.pan.trim().toUpperCase())) panErrors.pan = "Enter a valid PAN (e.g. ABCDE1234F)";
  if (!panData.name.trim()) panErrors.name = "Name as on PAN is required";
  if (!panData.fathername.trim()) panErrors.fathername = "Father's name is required";
  if (!panData.dob) panErrors.dob = "Date of birth is required";

  if (panErrors.pan || panErrors.name || panErrors.fathername || panErrors.dob) {
    showSnack("Please fix the errors above", "error");
    return;
  }

  loading.value = true;
  processingMsg.value = "Verifying PAN details...";
  try {
    const res = await isgVerifyPan({
      pan: panData.pan.toUpperCase().trim(),
      name: panData.name.trim(),
      fathername: panData.fathername.trim(),
      dob: formatDOB(panData.dob),
      merchantId: props.merchantId,
    });
    if (res?.statusCode === "00" || res?.data?.statusCode === "00") {
      panVerified.value = true;
      panVerifiedName.value = res?.data?.pan_name || panData.name;
      showSnack("PAN verified successfully!", "success");
      step.value = 4;
    } else {
      showSnack(res?.message || res?.data?.message || "PAN verification failed. Please check details.", "error");
    }
  } catch (err) {
    showSnack("Network error during PAN verification.", "error");
    console.error("[ISG] PAN error:", err);
  } finally {
    loading.value = false;
  }
}

// ── Step 4 — Verify Bank Account + fetch compliance ──────────────────────────
async function handleStep4Account() {
  if (accountVerified.value) { await loadComplianceAndProceed(); step.value = 5; return; }

  accountErrors.accountHolderName = ""; accountErrors.accountNumber = ""; accountErrors.ifsc = "";

  if (!accountData.accountHolderName.trim()) accountErrors.accountHolderName = "Account holder name is required";
  if (!accountData.accountNumber.trim()) accountErrors.accountNumber = "Account number is required";
  if (!accountData.ifsc.trim() || accountData.ifsc.trim().length < 11) accountErrors.ifsc = "Valid 11-character IFSC is required";

  if (accountErrors.accountHolderName || accountErrors.accountNumber || accountErrors.ifsc) {
    showSnack("Please fix the errors above", "error");
    return;
  }

  loading.value = true;
  processingMsg.value = "Verifying bank account...";
  try {
    const res = await isgVerifyAccount({
      accountHolderName: accountData.accountHolderName.trim(),
      accountNumber: accountData.accountNumber.trim(),
      ifsc: accountData.ifsc.toUpperCase().trim(),
      consent: "Y",
      additionalData: "true",
      merchantId: props.merchantId,
    });
    if (res?.statusCode === "00" || res?.data?.statusCode === "00") {
      accountVerified.value = true;
      accountVerifiedName.value = res?.data?.account_holder_name || accountData.accountHolderName;
      accountSummary.value = res?.data || null;
      showSnack("Bank account verified successfully!", "success");
      await loadComplianceAndProceed();
    } else {
      showSnack(res?.message || res?.data?.message || "Account verification failed. Please check details.", "error");
    }
  } catch (err) {
    showSnack("Network error during account verification.", "error");
    console.error("[ISG] Account error:", err);
  } finally {
    loading.value = false;
  }
}

// ── Fetch compliance status and move to step 5 ───────────────────────────────
async function loadComplianceAndProceed() {
  fetchingCompliance.value = true;
  docStep.value = 0;
  try {
    const res = await isgGetMerchantForOnboarding(props.merchantId);

    if (res?.statusCode === "00" && res?.data) {
      merchantProfile.value = res.data;
    }

    const status = await complianceStatus(props.merchantId);
    if (status?.statusCode === "00") {
      kycStatus.value = status.kycStatus;
      complianceResponse.value = status;
    } else {
      showSnack(status?.message || "Failed to load compliance status", "error");
    }
  } catch (err) {
    showSnack("Could not fetch compliance status", "error");
    console.error("[ISG] Compliance status error:", err);
  } finally {
    fetchingCompliance.value = false;
  }
}

// ── Step 5 — Doc helpers ─────────────────────────────────────────────────────
function openCategory(group) {
  activeCategory.value = group;
  docStep.value = 1;
}

// function openDocUpload(docType) {
//   activeDocType.value = docType;
//   docStep.value = 2;
//   const rule = DOC_RULES[docType];
//   docUploads[docType] = {
//     files:    [],
//     docNumber: "",
//     imageIds: [],
//     ...(rule?.formSchema ? JSON.parse(JSON.stringify(rule.formSchema)) : {}),
//   };
// }

function openDocUpload(docType) {
  activeDocType.value = docType;
  docStep.value = 2;

  // Reset aadhaar sub-step when re-opening
  if (docType === 'AADHAAR') {
    aadhaarStep.value = 0;
    aadhaarFrontFile.value = null;
    aadhaarBackFile.value = null;
    aadhaarFrontId.value = null;
    aadhaarBackId.value = null;
  }

  const rule = DOC_RULES[docType];
  const baseSchema = rule?.formSchema ? JSON.parse(JSON.stringify(rule.formSchema)) : {};

  if ((docType === 'INDIVIDUAL_PAN' || docType === 'PARTNER1_INDIVIDUAL_PAN' || docType === 'PARTNER2_INDIVIDUAL_PAN') && baseSchema.pan) {
    baseSchema.pan.pan = panData.pan || '';
    baseSchema.pan.pan_name = panVerifiedName || panData.name || '';
    baseSchema.pan.pan_father_name = panData.fathername || '';
    baseSchema.pan.pan_dob = panData.dob || '';
  }

  docUploads[docType] = { files: [], docNumber: '', imageIds: [], ...baseSchema };
}

// ── AADHAAR two-step upload helpers ──────────────────────────────────────────
const aadhaarFrontInputRef = ref(null);
const aadhaarBackInputRef = ref(null);
const uploadingAadhaar = ref(false);

function triggerAadhaarInput(side) {
  if (side === 'front') aadhaarFrontInputRef.value?.click();
  else aadhaarBackInputRef.value?.click();
}

function handleAadhaarFileSelect(e, side) {
  const file = e.target.files[0];
  if (!file) return;
  if (side === 'front') aadhaarFrontFile.value = file;
  else aadhaarBackFile.value = file;
}

function handleAadhaarDrop(e, side) {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  if (side === 'front') aadhaarFrontFile.value = file;
  else aadhaarBackFile.value = file;
}

async function uploadAadhaarSide(side) {
  const file = side === 'front' ? aadhaarFrontFile.value : aadhaarBackFile.value;
  const filename = side === 'front' ? '55_Aadhar_Card_front' : '55_Aadhar_Card_back';

  uploadingAadhaar.value = true;
  aadhaarStep.value = side === 'front' ? 0 : 1;
  try {
    const res = await uploadDoc(file, { filename, docid: 55, merchantId: props.merchantId });
    if (res.data?.statusCode === "00" || res.statusCode === "00") {
      const id = res.data?.data?.id || res.data?.id;
      if (side === 'front') { aadhaarFrontId.value = id; aadhaarStep.value = 1; }
      else { aadhaarBackId.value = id; aadhaarStep.value = 2; }
      showSnack(`Aadhaar ${side} uploaded`, "success");
    } else {
      showSnack(`Failed to upload Aadhaar ${side}. Please retry.`, "error");
    }
  } catch {
    showSnack(`Error uploading Aadhaar ${side}`, "error");
  } finally {
    uploadingAadhaar.value = false;
  }
}

async function saveAadhaarDoc() {
  if (!docUploads['AADHAAR']?.docNumber) {
    showSnack("Please enter the Aadhaar number", "error");
    return;
  }

  savingDoc.value = true;
  try {
    const payload = {
      doc_type: 'AADHAAR',
      doc_number: docUploads['AADHAAR'].docNumber,
      images: [aadhaarFrontId.value, aadhaarBackId.value],
    };

    const res = await complianceInit(payload, props.merchantId);
    if (res.data?.statusCode === "00" || res.statusCode === "00") {
      const status = await complianceStatus(props.merchantId);
      if (status?.statusCode === "00") complianceResponse.value = status;
      showSnack("Aadhaar saved successfully", "success");
      docStep.value = 0;
    } else {
      showSnack(res.data?.message || res.message || "Failed to save Aadhaar", "error");
    }
  } catch {
    showSnack("Error saving Aadhaar", "error");
  } finally {
    savingDoc.value = false;
  }
}

function triggerFileInput() { fileInputRef.value?.click(); }

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  if (activeDocType.value && docUploads[activeDocType.value])
    docUploads[activeDocType.value].files = files;
}

function handleFileDrop(e) {
  const files = Array.from(e.dataTransfer.files);
  if (activeDocType.value && docUploads[activeDocType.value])
    docUploads[activeDocType.value].files = files;
}

async function saveDocUpload() {
  const docType = activeDocType.value;
  const doc = docUploads[docType];
  const rule = DOC_RULES[docType] || DOC_RULES["DEFAULT"];

  if (doc.files.length !== rule.images) {
    showSnack(`Please upload exactly ${rule.images} image(s)`, "error");
    return;
  }

  if (!rule.requiresNumber) doc.docNumber = `${docType}_${Date.now()}`;

  savingDoc.value = true;
  doc.imageIds = [];

  try {
    for (const [index, file] of doc.files.entries()) {
      let filename, docid;

      if (activeDocType.value === "INDIVIDUAL_PAN") {
        filename = "63_Pan_Card_front"; docid = 63;
      } else if (activeDocType.value === "INDOOR_STORE_IMAGE") {
        filename = "999_STORE_1"; docid = 999;
      } else if (activeDocType.value === "OUTDOOR_STORE_IMAGE") {
        filename = "999_STORE_2"; docid = 999;
      } else if (activeDocType.value === "AADHAAR") {
        filename = index === 0 ? "55_Aadhar_Card_front" : "55_Aadhar_Card_back";
        docid = 55;
      }

      const res = await uploadDoc(file, { filename, docid, merchantId: props.merchantId });
      if (res.data?.statusCode === "00" || res.statusCode === "00") {
        doc.imageIds.push(res.data?.data?.id || res.data?.id);
      } else {
        showSnack("Failed to upload image. Please retry.", "error");
        savingDoc.value = false;
        return;
      }
    }

    const payload = rule.buildPayload(doc, doc.imageIds, docType);
    const res = await complianceInit(payload, props.merchantId);

    if (res.data?.statusCode === "00" || res.statusCode === "00") {
      const status = await complianceStatus(props.merchantId);
      if (status?.statusCode === "00") complianceResponse.value = status;
      showSnack("Document uploaded successfully", "success");
      docStep.value = 0;
    } else {
      showSnack(res.data?.message || res.message || "Failed to save document", "error");
    }
  } catch (err) {
    showSnack("Error uploading document", "error");
    console.error("[ISG] Doc upload error:", err);
  } finally {
    savingDoc.value = false;
  }
}

// ── Step 5 — Proceed from docs to review ─────────────────────────────────────
function handleStep5Docs() {
  if (!isComplianceComplete.value) {
    showSnack("Please upload all required documents", "error");
    return;
  }
  step.value = 6;
}

// ── Step 6 — Submit ISG Onboarding ───────────────────────────────────────────
async function handleStep6Submit() {
  if (!panVerified.value) { showSnack("PAN verification is required before submitting", "error"); return; }
  if (!accountVerified.value) { showSnack("Bank account verification is required before submitting", "error"); return; }
  if (!isComplianceComplete.value) { showSnack("All required documents must be uploaded before submitting", "error"); return; }

  submitting.value = true;
  processingMsg.value = "Submitting ISG onboarding...";
  try {
    const res = await isgSubmitOnboarding({ merchantId: props.merchantId });
    if (res?.statusCode === "00" || res?.data?.statusCode === "00") {
      submitResult.value = res?.data?.data || res?.data || null;
      showSnack(res?.message || res?.data?.message || "ISG onboarding submitted successfully!", "success");
      step.value = 7;
    } else {
      showSnack(res?.message || res?.data?.message || "Submission failed. Please retry.", "error");
    }
  } catch (err) {
    showSnack("An error occurred during submission.", "error");
    console.error("[ISG] Submit error:", err);
  } finally {
    submitting.value = false;
  }
}

// ── Mount — fetch merchant on load, stay on step 1 ───────────────────────────
onMounted(async () => {
  step.value = 1;
  if (!props.merchantId) return;

  await loadComplianceAndProceed();

  fetchingMerchant.value = true;
  try {
    const res = await isgGetMerchantForOnboarding(props.merchantId);
    if (res?.statusCode === "00" && res?.data) {
      merchantProfile.value = res.data;
      // Extract mobile from merchant profile — used as the OTP destination
      const phone = res.data.primary_mobile || res.data.mobile_no;
      if (phone) otpPhone.value = String(phone);
    } else {
      showSnack("Failed to load merchant details", "error");
    }


    // Determine starting step based on kycStatus
    // Step flow: 1=Verify → 2=OTP → 3=PAN → 4=Bank Account → 5=Documents → 6=Review

    const kyc = kycStatus.value; // { otp, pan, bank, aadhaar, storeImage }

    if (!kyc) {
      // No status at all → start from beginning
      step.value = 1;
    } else if (!kyc.otp) {
      // OTP not done → Step 1 (Verify details & send OTP)
      step.value = 1;
    } else if (!kyc.pan) {
      // OTP done but PAN not verified → Step 3
      otpVerified.value = true;
      step.value = 3;
    } else if (!kyc.bank) {
      // PAN done but bank not verified → Step 4
      otpVerified.value = true;
      panVerified.value = true;
      step.value = 4;
    } else if (!kyc.aadhaar || !kyc.storeImage) {
      // Bank done but documents incomplete → Step 5
      otpVerified.value = true;
      panVerified.value = true;
      accountVerified.value = true;
      step.value = 5;
    } else {
      // Everything done → Review & Submit (Step 6)
      otpVerified.value = true;
      panVerified.value = true;
      accountVerified.value = true;
      step.value = 6;
    }
  } catch {
    showSnack("Could not fetch merchant profile", "error");
  } finally {
    fetchingMerchant.value = false;
  }
});

// ── Cleanup ───────────────────────────────────────────────────────────────────
onUnmounted(() => {
  if (resendInterval) clearInterval(resendInterval);
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

.isg-root {
  font-family: 'Inter', sans-serif;
  background: #f6f6f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.isg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0a3d4a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

@media (min-width: 768px) {
  .isg-header {
    padding: 14px 40px;
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
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.brand-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.header-right {
  flex-shrink: 0;
}

.step-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 5px 12px;
  border-radius: 9999px;
  white-space: nowrap;
}

/* Main */
.isg-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 40px;
}

.content-wrapper {
  width: 100%;
  max-width: 820px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Stepper */
.stepper-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.stepper-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 8px;
}

.stepper-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.stepper-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.active-badge {
  font-size: 10px;
  font-weight: 700;
  color: #0a3d4a;
  background: rgba(10, 61, 74, 0.08);
  padding: 4px 10px;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
  border: 1px solid rgba(10, 61, 74, 0.15);
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
  background: #0a3d4a;
  border-radius: 4px;
  z-index: 1;
  transition: width 0.5s ease;
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
  transition: all 0.3s;
}

.step-active {
  background: #0a3d4a;
  color: #fff;
  box-shadow: 0 4px 16px rgba(10, 61, 74, 0.3);
}

.step-done {
  background: #0a3d4a;
  color: #fff;
}

.step-pending {
  background: #f1f5f9;
  color: #94a3b8;
}

.step-icon {
  font-size: 17px;
}

.step-label {
  font-size: 10px;
  font-weight: 500;
  color: #94a3b8;
  text-align: center;
}

.step-label-active {
  color: #0a3d4a;
  font-weight: 700;
}

/* Main card */
.main-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

/* Step body variants */
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
  gap: 12px;
  padding: 8px 0;
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
  width: 78%;
}

@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}

/* Verify header */
.verify-header {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, rgba(10, 61, 74, 0.05), rgba(10, 61, 74, 0.02));
  border: 1px solid rgba(10, 61, 74, 0.12);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.verify-avatar {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #0a3d4a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(10, 61, 74, 0.3);
}

.verify-header-text {
  flex: 1;
  min-width: 0;
}

.verify-name {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.verify-biz {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.verify-badge {
  display: inline-block;
  margin-top: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  background: rgba(10, 61, 74, 0.1);
  color: #0a3d4a;
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
  font-size: 14px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 1px;
}

/* OTP highlight cell */
.otp-highlight-cell {
  border-color: rgba(10, 61, 74, 0.3) !important;
  background: #f0f7f9 !important;
}

.otp-will-use-tag {
  display: inline-block;
  margin-left: 6px;
  font-size: 9px;
  font-weight: 700;
  background: #0a3d4a;
  color: #fff;
  padding: 1px 6px;
  border-radius: 9999px;
  vertical-align: middle;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Detail sections */
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
  color: #0a3d4a;
}

.section-label {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0a3d4a;
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
  background: #f0f7f9;
  border: 1px solid rgba(10, 61, 74, 0.15);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  color: #0a3d4a;
}

.confirm-check-wrap {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f0f7f9;
  border: 1.5px solid rgba(10, 61, 74, 0.2);
  border-radius: 10px;
  padding: 14px 16px;
  cursor: pointer;
  margin-top: 8px;
}

.confirm-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #0a3d4a;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
}

.confirm-text {
  font-size: 13px;
  font-weight: 500;
  color: #0e3a45;
  line-height: 1.5;
}

/* Error state */
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
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

/* Card body */
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

/* Aadhaar two-step upload */
.aadhaar-steps-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aadhaar-step-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
}

.aadhaar-step-row--active {
  border-color: #0a3d4a;
  background: #f0f7f9;
}

.aadhaar-step-row--done {
  border-color: rgba(34, 197, 94, 0.35);
  background: #eefaf3;
}

.aadhaar-step-row--locked {
  opacity: 0.5;
  pointer-events: none;
}

.aadhaar-step-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.aadhaar-step-badge .mdi {
  font-size: 18px;
  color: #0a3d4a;
}

.aadhaar-step-row--done .aadhaar-step-badge .mdi {
  color: #16a34a;
}

.aadhaar-uploaded-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #15803d;
}

.aadhaar-uploaded-chip .mdi {
  font-size: 16px;
  color: #16a34a;
}

.aadhaar-locked-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.aadhaar-finalize {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(10, 61, 74, 0.2);
  background: #f0f7f9;
}

/* Illustration */
.illustration-wrap {
  position: relative;
  width: 100%;
  max-width: 220px;
  margin-bottom: 24px;
}

.illustration-circle {
  aspect-ratio: 1;
  background: linear-gradient(135deg, rgba(10, 61, 74, 0.05), rgba(10, 61, 74, 0.15));
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
  font-size: 44px;
  color: #0a3d4a;
  display: block;
}

.analyzing-text {
  font-size: 8px;
  font-weight: 700;
  color: #0a3d4a;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card-heading {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

@media (min-width: 640px) {
  .card-heading {
    font-size: 26px;
  }
}

.card-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.65;
  max-width: 420px;
  margin: 0 auto;
}

/* Verified banner */
.verified-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #eefaf3;
  border: 1.5px solid #a7e0bc;
  border-radius: 10px;
  padding: 14px 18px;
  max-width: 420px;
  width: 100%;
  margin-top: 16px;
  text-align: left;
}

.verified-banner .mdi {
  font-size: 24px;
  color: #16a34a;
  flex-shrink: 0;
}

.verified-banner__title {
  font-size: 13px;
  font-weight: 700;
  color: #145b32;
}

.verified-banner__sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

/* Account summary card */
.account-summary-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
  width: 100%;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid #f1f5f9;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-key {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

.summary-val {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.text-green {
  color: #16a34a !important;
}

.text-red {
  color: #ef4444 !important;
}

/* Compliance loading */
.compliance-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 0;
}

.compliance-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e8f0f7;
  border-top-color: #0a3d4a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.compliance-loading-text {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

/* Doc category grid */
.doc-category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

@media (max-width: 480px) {
  .doc-category-grid {
    grid-template-columns: 1fr;
  }
}

.doc-category-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.doc-category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.doc-category-card--done {
  border-color: rgba(34, 197, 94, 0.35);
  background: #eefaf3;
}

.doc-category-card--pending {
  border-color: #fbd89d;
  background: #fff8ee;
}

.doc-cat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doc-cat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.doc-cat-icon--done {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
}

.doc-cat-icon--pending {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.doc-cat-chip {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 9999px;
}

.doc-cat-chip--done {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.doc-cat-chip--pending {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.doc-cat-name {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  text-transform: capitalize;
}

.doc-cat-progress-track {
  height: 4px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.doc-cat-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.doc-cat-progress-fill--done {
  background: #22c55e;
}

.doc-cat-progress-fill--pending {
  background: #f59e0b;
}

.doc-cat-hint {
  font-size: 11px;
  color: #94a3b8;
}

.doc-subheader {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.doc-back-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #475569;
  transition: background 0.15s;
  flex-shrink: 0;
}

.doc-back-btn:hover {
  background: #e2e8f0;
  color: #0a3d4a;
}

.doc-subheader-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  text-transform: capitalize;
}

.doc-subheader-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.doc-item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  text-align: center;
}

.doc-item-card--done {
  border-color: rgba(34, 197, 94, 0.3);
  background: #eefaf3;
}

.doc-item-status-icon {
  font-size: 22px;
}

.doc-item-name {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.doc-item-chip {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
}

.doc-item-chip--done {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.doc-item-chip--pending {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.doc-item-btn {
  width: 100%;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 7px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #0a3d4a;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.15s;
}

.doc-item-btn:hover:not(:disabled) {
  background: #f0f7f9;
}

.doc-item-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.doc-upload-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 0;
}

.file-drop-zone {
  border: 2px dashed #c5d8e8;
  border-radius: 10px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  cursor: pointer;
  background: #f0f7f9;
  transition: border-color 0.15s, background 0.15s;
}

.file-drop-zone:hover {
  border-color: #0a3d4a;
  background: #e8f2f7;
}

.file-drop-icon {
  font-size: 32px;
  color: #0a3d4a;
}

.file-drop-text {
  font-size: 13px;
  font-weight: 600;
  color: #0a3d4a;
}

.file-drop-hint {
  font-size: 11px;
  color: #94a3b8;
}

.file-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
  width: 100%;
}

.file-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eefaf3;
  border: 1px solid #a7e0bc;
  border-radius: 7px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #145b32;
}

.file-chip-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-save-doc {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 24px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: #0a3d4a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(10, 61, 74, 0.28);
  transition: filter 0.15s, opacity 0.15s;
  font-family: inherit;
}

.btn-save-doc:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn-save-doc:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Verification status grid */
.verification-status-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.vstatus-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
}

.vstatus-card--done {
  border-color: rgba(34, 197, 94, 0.35);
  background: #eefaf3;
}

.vstatus-card--pending {
  border-color: #fbd89d;
  background: #fff8ee;
}

.vstatus-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vstatus-card--done .vstatus-icon-wrap {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  font-size: 20px;
}

.vstatus-card--pending .vstatus-icon-wrap {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
  font-size: 20px;
}

.vstatus-info {
  flex: 1;
  min-width: 0;
}

.vstatus-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.vstatus-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.vstatus-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
  white-space: nowrap;
}

.vstatus-badge--done {
  background: rgba(34, 197, 94, 0.15);
  color: #15803d;
}

.vstatus-badge--pending {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

/* Result chips */
.result-chips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 8px;
}

.result-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f7f9;
  border: 1px solid rgba(10, 61, 74, 0.15);
  border-radius: 10px;
  padding: 10px 16px;
  min-width: 160px;
}

.result-chip__icon {
  font-size: 22px;
  color: #0a3d4a;
  flex-shrink: 0;
}

.result-chip__label {
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.result-chip__val {
  font-size: 13px;
  font-weight: 700;
  color: #0a3d4a;
  margin-top: 2px;
  word-break: break-all;
}

/* Form fields */
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.form-field-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.form-label {
  font-size: 11px;
  font-weight: 700;
  color: #5a7d9a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.req-star {
  color: #e11d48;
}

.form-input-box {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.form-input-box:focus-within {
  border-color: #0a3d4a;
  box-shadow: 0 0 0 3px rgba(10, 61, 74, 0.1);
  background: #fff;
}

.form-input-box--error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.form-icon {
  font-size: 15px;
  color: #8aafc8;
  padding: 0 0 0 12px;
  flex-shrink: 0;
  pointer-events: none;
  transition: color 0.2s;
}

.form-input-box:focus-within .form-icon {
  color: #0a3d4a;
}

.form-input {
  flex: 1;
  padding: 11px 12px;
  font-size: 14px;
  color: #0f172a;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
}

.form-input::placeholder {
  color: #9fb8cc;
}

.field-error {
  font-size: 11px;
  font-weight: 600;
  color: #ef4444;
}

.info-hint-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f0f6fb;
  border: 1px solid #c5d8e8;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #334155;
  line-height: 1.5;
  text-align: left;
}

.info-hint-box .mdi {
  font-size: 14px;
  color: #0a3d4a;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Alerts */
.warn-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fff8ee;
  border: 1px solid #fbd89d;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #7a4800;
  line-height: 1.5;
}

.warn-alert__icon {
  font-size: 15px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 1px;
}

.success-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #eefaf3;
  border: 1px solid #a7e0bc;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #145b32;
  line-height: 1.5;
}

.success-alert__icon {
  font-size: 15px;
  color: #22c55e;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Complete chips */
.complete-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 16px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
}

.chip--green {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

/* Card footer */
.card-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 18px 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 639px) {
  .card-footer {
    flex-wrap: wrap;
    padding: 16px;
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
  font-family: inherit;
}

.btn-back:hover {
  background: #f1f5f9;
  color: #0a3d4a;
}

.footer-right-btns {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn-continue {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 28px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: #0a3d4a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(10, 61, 74, 0.28);
  transition: filter 0.15s, opacity 0.15s;
  font-family: inherit;
  white-space: nowrap;
}

.btn-continue:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn-continue:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Spinners */
.spinner-btn {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Info cards */
.info-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  padding: 18px;
  border: 1.5px dashed #c5d8e8;
  border-radius: 12px;
  background: #fff;
}

.info-icon-wrap {
  padding: 8px;
  background: rgba(10, 61, 74, 0.08);
  border-radius: 8px;
  color: #0a3d4a;
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

/* Page footer */
.isg-footer {
  padding: 24px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
}

.footer-link {
  color: #94a3b8;
  text-decoration: underline;
}

.footer-link:hover {
  color: #0a3d4a;
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
  background: #0a3d4a;
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
  transform: translateY(-10px);
}

/* PAN pre-filled read-only block */
.pan-prefilled-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.pan-prefill-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f0f6fb;
  border: 1px solid #c5d8e8;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #334155;
  line-height: 1.5;
}

.pan-prefill-notice .mdi {
  font-size: 14px;
  color: #0a3d4a;
  flex-shrink: 0;
  margin-top: 1px;
}

.pan-prefill-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

@media (max-width: 480px) {
  .pan-prefill-grid {
    grid-template-columns: 1fr;
  }
}

.pan-prefill-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.pan-prefill-key {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.pan-prefill-val {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  word-break: break-word;
}

/* Processing overlay */
.processing-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 22, 30, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}

.processing-card {
  background: #fff;
  border-radius: 14px;
  padding: 40px 48px;
  text-align: center;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
}

.processing-spinner {
  width: 44px;
  height: 44px;
  border: 3px solid #e8f0f7;
  border-top-color: #0a3d4a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

.processing-title {
  font-size: 15px;
  font-weight: 700;
  color: #0a3d4a;
}

.processing-sub {
  font-size: 12px;
  color: #5a7d9a;
  margin-top: 6px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>