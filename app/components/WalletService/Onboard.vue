<template>
  <div class="ws-root">

    <!-- ── Header ── -->
    <header class="ws-header">
      <div class="header-brand">
        <div class="brand-icon">
          <span class="mdi mdi-wallet-outline"></span>
        </div>
        <h2 class="brand-title">KYC Verification</h2>
      </div>
      <div class="header-right">
        <div class="step-badge">
          <span class="mdi mdi-progress-check"></span>
          Step {{ step }} / {{ totalSteps }}
        </div>
      </div>
    </header>

    <!-- ── Main ── -->
    <main class="ws-main">
      <div class="content-wrapper">

        <!-- ── Stepper Card ── -->
        <div class="stepper-card">
          <div class="stepper-header">
            <div>
              <h3 class="stepper-title">KYC Verification Progress</h3>
              <p class="stepper-subtitle">Step {{ step }} of {{ totalSteps }}: {{ currentStepLabel }}</p>
            </div>
            <div class="active-badge">Account Service</div>
          </div>
          <div class="stepper-track">
            <div class="track-bg"></div>
            <div class="track-fill" :style="{ width: ((step - 1) / (totalSteps - 1) * 100) + '%' }"></div>
            <div v-for="(s, i) in steps" :key="s.key" class="step-node">
              <div class="step-circle" :class="{
                'step-active': step === i + 1,
                'step-done':   step > i + 1,
                'step-pending':step < i + 1,
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

          <!-- ════ STEP 1 — Verify PAN ════ -->
          <template v-if="step === 1">
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
              <p class="card-desc">Enter PAN details to verify the account service identity. All fields must match government records exactly.</p>

              <div v-if="panVerified" class="verified-banner" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-check-circle"></span>
                <div>
                  <p class="verified-banner__title">PAN Verified Successfully</p>
                  <p class="verified-banner__sub">{{ panVerifiedName }} · {{ panData.pan }}</p>
                </div>
              </div>

              <div v-if="!panVerified" class="form-grid" style="max-width:420px; width:100%; margin-top:24px;">
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
                <p>PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). Name and DOB must match exactly as on the PAN card.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 2 — Verify Bank Account ════ -->
          <template v-else-if="step === 2">
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
              <p class="card-desc">Enter the settlement bank account details for verification. This account will be used for account service settlements.</p>

              <div v-if="accountVerified" class="verified-banner" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-check-circle"></span>
                <div>
                  <p class="verified-banner__title">Bank Account Verified</p>
                  <p class="verified-banner__sub">{{ accountVerifiedName }} · {{ accountData.accountNumber }}</p>
                </div>
              </div>

              <div v-if="!accountVerified" class="form-grid" style="max-width:420px; width:100%; margin-top:24px;">
                <div class="form-field-wrap">
                  <label class="form-label">ACCOUNT HOLDER NAME <span class="req-star">*</span></label>
                  <div class="form-input-box" :class="{ 'form-input-box--error': accountErrors.accountHolderName }">
                    <span class="mdi mdi-account-outline form-icon"></span>
                    <input v-model="accountData.accountHolderName" class="form-input" placeholder="Full name"
                      @input="accountErrors.accountHolderName = ''" />
                  </div>
                  <span v-if="accountErrors.accountHolderName" class="field-error">{{ accountErrors.accountHolderName }}</span>
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

              <!-- Account summary after verification -->
              <div v-if="accountVerified && accountSummary" class="account-summary-card"
                style="max-width:420px; margin-top:16px;">
                <div class="summary-row">
                  <span class="summary-key">Bank</span>
                  <span class="summary-val">{{ accountSummary.bank_name }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-key">IFSC</span>
                  <span class="summary-val">{{ accountSummary.bank_ifsc_code }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-key">Name Match</span>
                  <span class="summary-val"
                    :class="accountSummary.account_holder_result ? 'text-green' : 'text-red'">
                    {{ accountSummary.account_holder_result ? '✓ Matched' : '✗ Mismatch' }}
                    ({{ Math.round((accountSummary.account_holder_score || 0) * 100) }}%)
                  </span>
                </div>
              </div>

              <div class="info-hint-box" style="max-width:420px; margin-top:16px;">
                <span class="mdi mdi-information-outline"></span>
                <p>The bank account provided will be used as the settlement account. The account holder name should match the PAN name for best results.</p>
              </div>
            </div>
          </template>

          <!-- ════ STEP 3 — Document Collection ════ -->
          <template v-else-if="step === 3">
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
                  <p class="verify-biz" style="margin-top:4px;">Upload the required documents to complete account service verification</p>
                </div>

                <div v-if="!isComplianceComplete" class="warn-alert" style="margin-bottom:16px;">
                  <span class="mdi mdi-alert-outline warn-alert__icon"></span>
                  <p>Please complete all required document categories before proceeding.</p>
                </div>

                <div v-if="isComplianceComplete" class="success-alert" style="margin-bottom:16px;">
                  <span class="mdi mdi-check-circle-outline success-alert__icon"></span>
                  <p>All required documents uploaded successfully. You are ready to proceed.</p>
                </div>

                <!-- Sub-window 0: Category Grid -->
                <template v-if="docStep === 0">
                  <div class="doc-category-grid">
                    <div v-for="group in requiredDocs" :key="group.category"
                      class="doc-category-card"
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
                      <div class="doc-cat-name">{{ group.category.replaceAll('_', ' ') === "IDENTITY" ? "AADHAAR" : group.category.replaceAll('_', ' ') === "STORE IMAGE" ? "BUSINESS IMAGE" : group.category.replaceAll('_', ' ') }}</div>
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

                <!-- Sub-window 1: Document list in category -->
                <template v-else-if="docStep === 1">
                  <div class="doc-subheader">
                    <button class="doc-back-btn" @click="docStep = 0">
                      <span class="mdi mdi-arrow-left"></span>
                    </button>
                    <div>
                      <div class="doc-subheader-title">{{ activeCategory?.category?.replaceAll('_', ' ') === "IDENTITY" ? "AADHAAR" : activeCategory?.category?.replaceAll('_', ' ') === "STORE IMAGE" ? "BUSINESS IMAGE" : activeCategory?.category?.replaceAll('_', ' ') }}</div>
                      <div class="doc-subheader-sub">Upload all required documents below</div>
                    </div>
                  </div>
                  <div class="doc-category-grid">
                    <div v-for="doc in activeCategory?.documents" :key="doc.code"
                      class="doc-item-card"
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

                <!-- Sub-window 2: Upload form -->
                <template v-else-if="docStep === 2">
                  <div class="doc-subheader">
                    <button class="doc-back-btn" @click="docStep = 1">
                      <span class="mdi mdi-arrow-left"></span>
                    </button>
                    <div>
                      <div class="doc-subheader-title">Upload {{ activeDocType?.replaceAll('_', ' ') }}</div>
                      <div class="doc-subheader-sub">Ensure images are clear and readable</div>
                    </div>
                  </div>

                  <div class="doc-upload-form">

                    <!-- ── AADHAAR: two-step front then back ── -->
                    <template v-if="activeDocType === 'AADHAAR'">
                      <div class="aadhaar-steps-wrap" style="max-width:420px; width:100%; margin-top:16px;">

                        <!-- Step 1: Front -->
                        <div class="aadhaar-step-row"
                          :class="{ 'aadhaar-step-row--done': aadhaarFrontId, 'aadhaar-step-row--active': !aadhaarFrontId }">
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
                            <div v-if="aadhaarFrontFile" class="file-chips" style="margin-top:8px;">
                              <div class="file-chip">
                                <span class="mdi mdi-image-outline"></span>
                                <span class="file-chip-name">{{ aadhaarFrontFile.name }}</span>
                              </div>
                            </div>
                            <button class="btn-save-doc" style="width:100%; margin-top:12px;"
                              :disabled="!aadhaarFrontFile || uploadingAadhaar"
                              @click="uploadAadhaarSide('front')">
                              <span v-if="uploadingAadhaar && aadhaarSideUploading === 'front'" class="spinner-btn"></span>
                              <template v-else><span class="mdi mdi-upload"></span> Upload Front</template>
                            </button>
                          </template>
                          <div v-else class="aadhaar-uploaded-chip">
                            <span class="mdi mdi-check-circle"></span> Front uploaded successfully
                          </div>
                        </div>

                        <!-- Step 2: Back -->
                        <div class="aadhaar-step-row"
                          :class="{
                            'aadhaar-step-row--done':   aadhaarBackId,
                            'aadhaar-step-row--active': aadhaarFrontId && !aadhaarBackId,
                            'aadhaar-step-row--locked': !aadhaarFrontId,
                          }">
                          <div class="aadhaar-step-badge">
                            <span class="mdi"
                              :class="aadhaarBackId ? 'mdi-check-circle' : 'mdi-numeric-2-circle-outline'"></span>
                            <span>Aadhaar Back</span>
                          </div>
                          <div v-if="!aadhaarFrontId" class="aadhaar-locked-hint">
                            <span class="mdi mdi-lock-outline"></span> Upload front side first
                          </div>
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
                            <div v-if="aadhaarBackFile" class="file-chips" style="margin-top:8px;">
                              <div class="file-chip">
                                <span class="mdi mdi-image-outline"></span>
                                <span class="file-chip-name">{{ aadhaarBackFile.name }}</span>
                              </div>
                            </div>
                            <button class="btn-save-doc" style="width:100%; margin-top:12px;"
                              :disabled="!aadhaarBackFile || uploadingAadhaar"
                              @click="uploadAadhaarSide('back')">
                              <span v-if="uploadingAadhaar && aadhaarSideUploading === 'back'" class="spinner-btn"></span>
                              <template v-else><span class="mdi mdi-upload"></span> Upload Back</template>
                            </button>
                          </template>
                          <div v-else class="aadhaar-uploaded-chip">
                            <span class="mdi mdi-check-circle"></span> Back uploaded successfully
                          </div>
                        </div>

                        <!-- Step 3: Aadhaar number + Save -->
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

                    <!-- ── All other doc types ── -->
                    <template v-else>
                      <!-- Doc Number field -->
                      <div v-if="showDocNumber" class="form-field-wrap" style="max-width:420px; width:100%;">
                        <label class="form-label">{{ docNumberLabel }} <span class="req-star">*</span></label>
                        <div class="form-input-box">
                          <span class="mdi mdi-identifier form-icon"></span>
                          <input v-model="docUploads[activeDocType].docNumber" class="form-input"
                            :placeholder="docNumberLabel" />
                        </div>
                      </div>

                      <!-- PAN pre-filled block -->
                      <div v-if="activeDocType === 'INDIVIDUAL_PAN'"
                        class="pan-prefilled-block" style="max-width:420px; width:100%;">
                        <div class="pan-prefill-notice">
                          <span class="mdi mdi-information-outline"></span>
                          <p>PAN details are pre-filled from your verified PAN. Please upload a clear image of your PAN card.</p>
                        </div>
                        <div class="pan-prefill-grid">
                          <div class="pan-prefill-item">
                            <span class="pan-prefill-key">PAN NUMBER</span>
                            <span class="pan-prefill-val">{{ panData.pan || '—' }}</span>
                          </div>
                          <div class="pan-prefill-item">
                            <span class="pan-prefill-key">PAN HOLDER NAME</span>
                            <span class="pan-prefill-val">{{ panVerifiedName || '—' }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- File Upload -->
                      <div class="file-upload-area" style="max-width:420px; width:100%; margin-top:16px;">
                        <label class="form-label">
                          UPLOAD {{ requiredImageCount }} IMAGE(S) <span class="req-star">*</span>
                        </label>
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
                        <template v-else>
                          <span class="mdi mdi-content-save-outline"></span> Save Document
                        </template>
                      </button>
                    </template>

                  </div>
                </template>
              </template>
            </div>
          </template>

          <!-- ════ STEP 4 — Complete ════ -->
          <template v-else-if="step === 4">
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
              <h1 class="card-heading" style="color:#16a34a;">Onboarding Complete!</h1>
              <p class="card-desc">
                account service onboarding has been successfully submitted. Your profile is now
                {{ approveResult?.mstatus === 'APPROVED' ? 'approved and active.' : 'under review.' }}
              </p>

              <div class="complete-chips">
                <div class="chip chip--green"><span class="mdi mdi-check"></span> PAN Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Account Verified</div>
                <div class="chip chip--green"><span class="mdi mdi-check"></span> Documents Uploaded</div>
                <div class="chip chip--green" v-if="approveResult?.mstatus === 'APPROVED'">
                  <span class="mdi mdi-check"></span> Profile Approved
                </div>
              </div>

              <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-top:28px;">
                <button class="btn-continue"
                  style="background:#16a34a; box-shadow:0 4px 14px rgba(22,163,74,0.3);"
                  @click="goToDashboard">
                  <span class="mdi mdi-view-dashboard-outline"></span> Go to Dashboard
                </button>
              </div>
            </div>
          </template>

          <!-- ── Card Footer ── -->
          <div class="card-footer" v-if="step !== 4">

            <button v-if="step > 1" class="btn-back" @click="goBack">
              <span class="mdi mdi-arrow-left"></span> Back
            </button>
            <div v-else style="flex:1;"></div>

            <div class="footer-right-btns">

              <!-- Step 1: Verify PAN -->
              <button v-if="step === 1" class="btn-continue" :disabled="loading" @click="handleStep1Pan">
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>
                  {{ panVerified ? 'Continue' : 'Verify PAN' }}
                  <span class="mdi mdi-arrow-right"></span>
                </template>
              </button>

              <!-- Step 2: Verify Account -->
              <button v-else-if="step === 2" class="btn-continue" :disabled="loading" @click="handleStep2Account">
                <span v-if="loading" class="spinner-btn"></span>
                <template v-else>
                  {{ accountVerified ? 'Continue' : 'Verify Account' }}
                  <span class="mdi mdi-arrow-right"></span>
                </template>
              </button>

              <!-- Step 3: Documents -->
              <button v-else-if="step === 3" class="btn-continue"
                :disabled="!isComplianceComplete || fetchingCompliance || submitting"
                @click="handleStep3Submit">
                <span v-if="submitting" class="spinner-btn"></span>
                <template v-else>
                  {{ isComplianceComplete ? 'Complete Onboarding' : 'Upload Documents' }}
                  <span class="mdi mdi-check"></span>
                </template>
              </button>

            </div>
          </div>

        </div>

        <!-- ── Info Cards ── -->
        <div class="info-cards">
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
              <p class="info-desc">Settlement account IFSC and account holder name will be verified.</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon-wrap"><span class="mdi mdi-file-document-multiple-outline info-icon"></span></div>
            <div>
              <p class="info-title">Document Upload</p>
              <p class="info-desc">Upload Aadhaar (front & back), PAN card image, and store photos to complete KYC.</p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <footer class="ws-footer">
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
        <button class="snack-close" @click="snackbar.show = false">
          <span class="mdi mdi-close"></span>
        </button>
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
import { ref, reactive, computed, onMounted } from "vue";
import { useWalletServiceOnboardingApi } from "@/composables/apis/useWalletServiceOnboardingApi";
import { useRouter } from "vue-router";

// ── Composable ────────────────────────────────────────────────────────────────
const {
  wsVerifyPan,
  wsVerifyAccount,
  wsUploadDoc,
  wsComplianceInit,
  wsComplianceStatus,
  wsGetProfile,
  wsApprove,
} = useWalletServiceOnboardingApi();

const router = useRouter();

// ── Props ─────────────────────────────────────────────────────────────────────
const props = defineProps({ walletProfileId: String });

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  { key: "pan",      label: "PAN",       icon: "mdi-card-account-details-outline" },
  { key: "account",  label: "Account",   icon: "mdi-bank-outline" },
  { key: "docs",     label: "Documents", icon: "mdi-file-document-multiple-outline" },
  { key: "complete", label: "Complete",  icon: "mdi-check-decagram" },
];

const stepLabels = [
  "PAN Verification",
  "Bank Account Verification",
  "Document Collection",
  "Complete",
];

const totalSteps        = computed(() => steps.length);
const currentStepLabel  = computed(() => stepLabels[step.value - 1] || "");

// ── Core state ────────────────────────────────────────────────────────────────
const step          = ref(1);
const loading       = ref(false);
const submitting    = ref(false);
const processingMsg = ref("Processing...");

// ── PAN state ─────────────────────────────────────────────────────────────────
const panData       = reactive({ pan: "", name: "", fathername: "", dob: "" });
const panErrors     = reactive({ pan: "", name: "", fathername: "", dob: "" });
const panVerified   = ref(false);
const panVerifiedName = ref("");

// ── Account state ─────────────────────────────────────────────────────────────
const accountData = reactive({ accountHolderName: "", accountNumber: "", ifsc: "" });
const accountErrors = reactive({ accountHolderName: "", accountNumber: "", ifsc: "" });
const accountVerified     = ref(false);
const accountVerifiedName = ref("");
const accountSummary      = ref(null);

// ── Compliance / Documents state ──────────────────────────────────────────────
const fetchingCompliance  = ref(false);
const complianceResponse  = ref(null);
const docStep             = ref(0);
const activeCategory      = ref(null);
const activeDocType       = ref(null);
const savingDoc           = ref(false);
const fileInputRef        = ref(null);

// ── Aadhaar two-step ──────────────────────────────────────────────────────────
const aadhaarFrontFile        = ref(null);
const aadhaarBackFile         = ref(null);
const aadhaarFrontId          = ref(null);
const aadhaarBackId           = ref(null);
const uploadingAadhaar        = ref(false);
const aadhaarSideUploading    = ref(null);
const aadhaarFrontInputRef    = ref(null);
const aadhaarBackInputRef     = ref(null);

// ── Approve result ────────────────────────────────────────────────────────────
const approveResult = ref(null);

// ── Snackbar ──────────────────────────────────────────────────────────────────
const snackbar = reactive({ show: false, message: "", color: "success" });

// ── DOC RULES — mirrors ISG pattern ──────────────────────────────────────────
const DOC_RULES = {
  DEFAULT: {
    label: "Document Number", images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds, docType) => {
      const now = new Date();
      const docNumber =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");
      return { doc_type: docType, doc_number: docNumber, images: imageIds };
    },
  },
  AADHAAR: {
    label: "Aadhaar Number", images: 2, requiresNumber: true,
    buildPayload: (doc, imageIds) => ({ doc_type: "AADHAAR", doc_number: doc.docNumber, images: imageIds }),
  },
  INDIVIDUAL_PAN: {
    label: "PAN Number", images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds) => ({ doc_type: "INDIVIDUAL_PAN", doc_number: doc.docNumber || doc.pan?.pan || "", images: imageIds }),
  },
  INDOOR_STORE_IMAGE: {
    label: null, images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds) => ({ doc_type: "INDOOR_STORE_IMAGE", doc_number: doc.docNumber, images: imageIds }),
  },
  OUTDOOR_STORE_IMAGE: {
    label: null, images: 1, requiresNumber: false,
    buildPayload: (doc, imageIds) => ({ doc_type: "OUTDOOR_STORE_IMAGE", doc_number: doc.docNumber, images: imageIds }),
  },
};

// ── Computed ──────────────────────────────────────────────────────────────────
const WS_CATEGORIES = ["STORE_IMAGE", "INDIVIDUAL_PAN", "IDENTITY"];

const requiredDocs = computed(() => {
  if (!complianceResponse.value?.categories) return [];

  return complianceResponse.value.categories
    .filter((cat) => WS_CATEGORIES.includes(cat.category))
    .map((cat) => {

      const documents =
        cat.category === "IDENTITY"
          ? (cat.documents || []).filter((d) => d.code === "AADHAAR")
          : (cat.documents || []);

      const uploadedCount  = documents.filter((d) => d.uploaded).length;
      const isStoreImage   = cat.category === "STORE_IMAGE";
      const required       = isStoreImage ? documents.length : 1;
      const uploaded       = uploadedCount;
      const compliant      = isStoreImage ? uploadedCount === documents.length : uploadedCount > 0;
      const missing        = isStoreImage ? Math.max(documents.length - uploadedCount, 0) : compliant ? 0 : 1;

      return { category: cat.category, documents, required, uploaded, missing, compliant };
    });
});

const isComplianceComplete = computed(() => {
  if (!requiredDocs.value.length) return false;
  return requiredDocs.value.every((cat) => cat.compliant);
});

const activeDocRule       = computed(() => DOC_RULES[activeDocType.value] || DOC_RULES["DEFAULT"]);
const showDocNumber       = computed(() => activeDocRule.value.requiresNumber);
const docNumberLabel      = computed(() => activeDocRule.value.label || "Document Number");
const requiredImageCount  = computed(() => activeDocRule.value.images || 1);

const docUploads = reactive({});

// ── Helpers ───────────────────────────────────────────────────────────────────
function showSnack(message, color = "success") {
  snackbar.message = message;
  snackbar.color   = color;
  snackbar.show    = true;
  setTimeout(() => (snackbar.show = false), 4500);
}

function formatDOB(date) {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function goBack() {
  if (step.value === 3 && docStep.value > 0) { docStep.value--; return; }
  if (step.value > 1) step.value--;
}

function goToDashboard() {
  router.push("/vendor/wallet-service");
}

// ── Step 1 — Verify PAN ───────────────────────────────────────────────────────
async function handleStep1Pan() {
  if (panVerified.value) { step.value = 2; return; }

  panErrors.pan = ""; panErrors.name = ""; panErrors.fathername = ""; panErrors.dob = "";

  const panReg = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panData.pan.trim() || !panReg.test(panData.pan.trim().toUpperCase()))
    panErrors.pan = "Enter a valid PAN (e.g. ABCDE1234F)";
  if (!panData.name.trim())       panErrors.name       = "Name as on PAN is required";
  if (!panData.fathername.trim()) panErrors.fathername = "Father's name is required";
  if (!panData.dob)               panErrors.dob        = "Date of birth is required";

  if (panErrors.pan || panErrors.name || panErrors.fathername || panErrors.dob) {
    showSnack("Please fix the errors above", "error");
    return;
  }

  loading.value      = true;
  processingMsg.value = "Verifying PAN details...";

  try {
    const res = await wsVerifyPan({
      pan:            panData.pan.toUpperCase().trim(),
      name:           panData.name.trim(),
      fathername:     panData.fathername.trim(),
      dob:            formatDOB(panData.dob),
      walletProfileId: props.walletProfileId,
    });

    if (res?.statusCode === "00") {
      panVerified.value    = true;
      panVerifiedName.value = res?.data?.pan_name || panData.name;

      // Pre-fill account holder name from PAN name
      if (!accountData.accountHolderName) {
        accountData.accountHolderName = panVerifiedName.value || panData.name;
      }

      showSnack("PAN verified successfully!", "success");
      step.value = 2;
    } else {
      showSnack(res?.message || "PAN verification failed. Please check details.", "error");
    }
  } catch {
    showSnack("Network error during PAN verification.", "error");
  } finally {
    loading.value = false;
  }
}

// ── Step 2 — Verify Account ───────────────────────────────────────────────────
async function handleStep2Account() {
  if (accountVerified.value) {
    await loadCompliance();
    step.value = 3;
    return;
  }

  accountErrors.accountHolderName = "";
  accountErrors.accountNumber     = "";
  accountErrors.ifsc              = "";

  if (!accountData.accountHolderName.trim())
    accountErrors.accountHolderName = "Account holder name is required";
  if (!accountData.accountNumber.trim())
    accountErrors.accountNumber = "Account number is required";
  if (!accountData.ifsc.trim() || accountData.ifsc.trim().length < 11)
    accountErrors.ifsc = "Valid 11-character IFSC is required";

  if (accountErrors.accountHolderName || accountErrors.accountNumber || accountErrors.ifsc) {
    showSnack("Please fix the errors above", "error");
    return;
  }

  loading.value       = true;
  processingMsg.value = "Verifying bank account...";

  try {
    const res = await wsVerifyAccount({
      accountHolderName: accountData.accountHolderName.trim(),
      accountNumber:     accountData.accountNumber.trim(),
      ifsc:              accountData.ifsc.toUpperCase().trim(),
      consent:           "Y",
      additionalData:    "true",
      walletProfileId:   props.walletProfileId,
    });

    if (res?.statusCode === "00") {
      accountVerified.value     = true;
      accountVerifiedName.value = res?.data?.account_holder_name || accountData.accountHolderName;
      accountSummary.value      = res?.data || null;
      showSnack("Bank account verified and settlement account created!", "success");
      await loadCompliance();
    } else {
      showSnack(res?.message || "Account verification failed. Please check details.", "error");
    }
  } catch {
    showSnack("Network error during account verification.", "error");
  } finally {
    loading.value = false;
  }
}

// ── Load compliance status ────────────────────────────────────────────────────
async function loadCompliance() {
  fetchingCompliance.value = true;
  docStep.value = 0;
  try {
    const status = await wsComplianceStatus(props.walletProfileId);
    if (status?.statusCode === "00") {
      complianceResponse.value = status;
    } else {
      showSnack(status?.message || "Failed to load compliance status", "error");
    }
  } catch {
    showSnack("Could not fetch compliance status", "error");
  } finally {
    fetchingCompliance.value = false;
  }
}

// ── Step 3 — Submit (approve) ─────────────────────────────────────────────────
async function handleStep3Submit() {
  if (!isComplianceComplete.value) {
    showSnack("Please upload all required documents", "error");
    return;
  }

  submitting.value    = true;
  processingMsg.value = "Completing onboarding...";

  try {
    const res = await wsApprove(props.walletProfileId);
    if (res?.statusCode === "00") {
      approveResult.value = res?.data || null;
      showSnack("Wallet service onboarding completed successfully!", "success");
      step.value = 4;
    } else {
      showSnack(res?.message || "Approval failed. Please retry.", "error");
    }
  } catch {
    showSnack("An error occurred during approval.", "error");
  } finally {
    submitting.value = false;
  }
}

// ── Doc helpers ───────────────────────────────────────────────────────────────
function openCategory(group) {
  activeCategory.value = group;
  docStep.value        = 1;
}

function openDocUpload(docType) {
  activeDocType.value = docType;
  docStep.value       = 2;

  if (docType === "AADHAAR") {
    aadhaarFrontFile.value     = null;
    aadhaarBackFile.value      = null;
    aadhaarFrontId.value       = null;
    aadhaarBackId.value        = null;
    aadhaarSideUploading.value = null;
  }

  const rule       = DOC_RULES[docType] || DOC_RULES["DEFAULT"];
  const baseSchema = rule?.formSchema ? JSON.parse(JSON.stringify(rule.formSchema)) : {};

  if (docType === "INDIVIDUAL_PAN") {
    baseSchema.pan = {
      pan:            panData.pan || "",
      pan_name:       panVerifiedName.value || panData.name || "",
      pan_father_name: panData.fathername || "",
      pan_dob:        panData.dob || "",
    };
  }

  docUploads[docType] = { files: [], docNumber: "", imageIds: [], ...baseSchema };
}

// ── Aadhaar upload ────────────────────────────────────────────────────────────
function triggerAadhaarInput(side) {
  if (side === "front") aadhaarFrontInputRef.value?.click();
  else                  aadhaarBackInputRef.value?.click();
}

function handleAadhaarFileSelect(e, side) {
  const file = e.target.files[0];
  if (!file) return;
  if (side === "front") aadhaarFrontFile.value = file;
  else                  aadhaarBackFile.value  = file;
}

function handleAadhaarDrop(e, side) {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  if (side === "front") aadhaarFrontFile.value = file;
  else                  aadhaarBackFile.value  = file;
}

async function uploadAadhaarSide(side) {
  const file     = side === "front" ? aadhaarFrontFile.value : aadhaarBackFile.value;
  const filename = side === "front" ? "55_Aadhar_Card_front" : "55_Aadhar_Card_back";

  uploadingAadhaar.value        = true;
  aadhaarSideUploading.value    = side;

  try {
    const res = await wsUploadDoc(file, {
      filename,
      docid:          55,
      walletProfileId: props.walletProfileId,
    });

    const statusCode = res?.data?.statusCode || res?.statusCode;
    if (statusCode === "00") {
      const id = res?.data?.data?.id || res?.data?.id;
      if (side === "front") aadhaarFrontId.value = id;
      else                  aadhaarBackId.value  = id;
      showSnack(`Aadhaar ${side} uploaded`, "success");
    } else {
      showSnack(`Failed to upload Aadhaar ${side}. Please retry.`, "error");
    }
  } catch {
    showSnack(`Error uploading Aadhaar ${side}`, "error");
  } finally {
    uploadingAadhaar.value     = false;
    aadhaarSideUploading.value = null;
  }
}

async function saveAadhaarDoc() {
  if (!docUploads["AADHAAR"]?.docNumber) {
    showSnack("Please enter the Aadhaar number", "error");
    return;
  }

  savingDoc.value = true;
  try {
    const payload = {
      doc_type:   "AADHAAR",
      doc_number: docUploads["AADHAAR"].docNumber,
      images:     [aadhaarFrontId.value, aadhaarBackId.value],
    };

    const res = await wsComplianceInit(payload, props.walletProfileId);
    const statusCode = res?.data?.statusCode || res?.statusCode;

    if (statusCode === "00") {
      await loadCompliance();
      showSnack("Aadhaar saved successfully", "success");
      docStep.value = 0;
    } else {
      showSnack(res?.data?.message || res?.message || "Failed to save Aadhaar", "error");
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
  const doc     = docUploads[docType];
  const rule    = DOC_RULES[docType] || DOC_RULES["DEFAULT"];

  if (doc.files.length !== rule.images) {
    showSnack(`Please upload exactly ${rule.images} image(s)`, "error");
    return;
  }

  if (!rule.requiresNumber) doc.docNumber = `${docType}_${Date.now()}`;

  savingDoc.value  = true;
  doc.imageIds     = [];

  try {
    for (const [index, file] of doc.files.entries()) {
      let filename, docid;

      if (docType === "INDIVIDUAL_PAN")     { filename = "63_Pan_Card_front"; docid = 63; }
      else if (docType === "INDOOR_STORE_IMAGE")  { filename = "999_STORE_1";       docid = 999; }
      else if (docType === "OUTDOOR_STORE_IMAGE") { filename = "999_STORE_2";       docid = 999; }
      else {
        filename = `${docid || 0}_${docType}_${index}`;
        docid    = 0;
      }

      const res = await wsUploadDoc(file, { filename, docid, walletProfileId: props.walletProfileId });
      const statusCode = res?.data?.statusCode || res?.statusCode;

      if (statusCode === "00") {
        doc.imageIds.push(res?.data?.data?.id || res?.data?.id);
      } else {
        showSnack("Failed to upload image. Please retry.", "error");
        savingDoc.value = false;
        return;
      }
    }

    const payload = rule.buildPayload(doc, doc.imageIds, docType);
    const res     = await wsComplianceInit(payload, props.walletProfileId);
    const statusCode = res?.data?.statusCode || res?.statusCode;

    if (statusCode === "00") {
      await loadCompliance();
      showSnack("Document uploaded successfully", "success");
      docStep.value = 0;
    } else {
      showSnack(res?.data?.message || res?.message || "Failed to save document", "error");
    }
  } catch (err) {
    showSnack("Error uploading document", "error");
    console.error("[WS] Doc upload error:", err);
  } finally {
    savingDoc.value = false;
  }
}

// ── Mount — check existing status and resume from correct step ────────────────
onMounted(async () => {
  step.value = 3;
  await loadCompliance();
  if (!props.walletProfileId) return;

  try {
    const status = await wsComplianceStatus(props.walletProfileId);

    if (status?.statusCode === "00") {
      complianceResponse.value = status;

      const kyc = status.kycStatus || {};

      if (!kyc.pan) {
        step.value = 1;
      } else if (!kyc.bank) {
        panVerified.value = true;
        step.value        = 2;
      } else if (!kyc.aadhaar || !kyc.storeImage) {
        panVerified.value     = true;
        accountVerified.value = true;
        step.value            = 3;
      } else {
        // All done — could show complete step or stay on review
        panVerified.value     = true;
        accountVerified.value = true;
        step.value            = 3;
      }
    }
  } catch (err) {
    console.error("[WS] Mount compliance check failed:", err);
  }
});
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ws-root {
  font-family: 'Inter', sans-serif;
  background: #f6f6f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.ws-header {
  display: flex; align-items: center; justify-content: space-between;
  background: #1e3a5f;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding: 14px 24px; position: sticky; top: 0; z-index: 50;
}
@media (min-width: 768px) { .ws-header { padding: 14px 40px; } }
.header-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon {
  width: 32px; height: 32px; background: rgba(255,255,255,0.15);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 18px;
}
.brand-title { font-size: 16px; font-weight: 700; color: #fff; }
.step-badge {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18);
  padding: 5px 12px; border-radius: 9999px; white-space: nowrap;
}

/* ── Main ── */
.ws-main {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; padding: 24px 16px 40px;
}
.content-wrapper { width: 100%; max-width: 820px; display: flex; flex-direction: column; gap: 20px; }

/* ── Stepper ── */
.stepper-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 20px 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.stepper-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 8px; }
.stepper-title  { font-size: 15px; font-weight: 700; color: #0f172a; }
.stepper-subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
.active-badge {
  font-size: 10px; font-weight: 700; color: #1e3a5f;
  background: rgba(30,58,95,0.08); padding: 4px 10px;
  border-radius: 9999px; white-space: nowrap; flex-shrink: 0;
  border: 1px solid rgba(30,58,95,0.15);
}
.stepper-track { position: relative; display: flex; align-items: center; justify-content: space-between; }
.track-bg {
  position: absolute; top: 20px; left: 0; right: 0; height: 4px;
  background: #f1f5f9; border-radius: 4px; z-index: 0;
}
.track-fill {
  position: absolute; top: 20px; left: 0; height: 4px;
  background: #1e3a5f; border-radius: 4px; z-index: 1; transition: width 0.5s ease;
}
.step-node { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.step-circle { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: all 0.3s; }
.step-active { background: #1e3a5f; color: #fff; box-shadow: 0 4px 16px rgba(30,58,95,0.3); }
.step-done   { background: #1e3a5f; color: #fff; }
.step-pending { background: #f1f5f9; color: #94a3b8; }
.step-icon   { font-size: 17px; }
.step-label  { font-size: 10px; font-weight: 500; color: #94a3b8; text-align: center; }
.step-label-active { color: #1e3a5f; font-weight: 700; }

/* ── Main card ── */
.main-card {
  background: #fff; border: 1px solid #f1f5f9; border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.07); overflow: hidden;
}
.step1-body { padding: 24px !important; align-items: stretch !important; text-align: left !important; }
@media (min-width: 640px) { .step1-body { padding: 32px !important; } }

/* ── Card body ── */
.card-body {
  padding: 32px 24px 24px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}
@media (min-width: 768px) { .card-body { padding: 48px; } }

/* ── Illustration ── */
.illustration-wrap { position: relative; width: 100%; max-width: 220px; margin-bottom: 24px; }
.illustration-circle {
  aspect-ratio: 1;
  background: linear-gradient(135deg, rgba(30,58,95,0.05), rgba(30,58,95,0.15));
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.illustration-inner {
  width: 55%; height: 55%; background: #fff; border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 20px;
}
.upload-icon   { font-size: 44px; color: #1e3a5f; display: block; }
.analyzing-text { font-size: 8px; font-weight: 700; color: #1e3a5f; letter-spacing: 0.12em; text-transform: uppercase; }

.card-heading { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
@media (min-width: 640px) { .card-heading { font-size: 26px; } }
.card-desc { font-size: 14px; color: #64748b; line-height: 1.65; max-width: 420px; margin: 0 auto; }

/* ── Verified banner ── */
.verified-banner {
  display: flex; align-items: center; gap: 12px;
  background: #eefaf3; border: 1.5px solid #a7e0bc; border-radius: 10px;
  padding: 14px 18px; max-width: 420px; width: 100%; margin-top: 16px; text-align: left;
}
.verified-banner .mdi { font-size: 24px; color: #16a34a; flex-shrink: 0; }
.verified-banner__title { font-size: 13px; font-weight: 700; color: #145b32; }
.verified-banner__sub   { font-size: 12px; color: #64748b; margin-top: 2px; }

/* ── Account summary ── */
.account-summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; width: 100%; }
.summary-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #f1f5f9; }
.summary-row:last-child { border-bottom: none; }
.summary-key { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
.summary-val { font-size: 13px; font-weight: 600; color: #0f172a; }
.text-green  { color: #16a34a !important; }
.text-red    { color: #ef4444 !important; }

/* ── Verify name / biz ── */
.verify-name { font-size: 16px; font-weight: 800; color: #0f172a; }
.verify-biz  { font-size: 12px; color: #64748b; }

/* ── Compliance loading ── */
.compliance-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px 0; }
.compliance-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e8f0f7; border-top-color: #1e3a5f;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
.compliance-loading-text { font-size: 14px; font-weight: 600; color: #64748b; }

/* ── Doc category grid ── */
.doc-category-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; }
@media (max-width: 480px) { .doc-category-grid { grid-template-columns: 1fr; } }
.doc-category-card {
  display: flex; flex-direction: column; gap: 10px; padding: 16px;
  border-radius: 12px; border: 1.5px solid #e2e8f0; background: #f8fafc;
  cursor: pointer; transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
}
.doc-category-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.doc-category-card--done    { border-color: rgba(34,197,94,0.35); background: #eefaf3; }
.doc-category-card--pending { border-color: #fbd89d; background: #fff8ee; }
.doc-cat-header { display: flex; justify-content: space-between; align-items: center; }
.doc-cat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.doc-cat-icon--done    { background: rgba(34,197,94,0.15); color: #16a34a; }
.doc-cat-icon--pending { background: rgba(245,158,11,0.12); color: #f59e0b; }
.doc-cat-chip { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; }
.doc-cat-chip--done    { background: rgba(34,197,94,0.15); color: #15803d; }
.doc-cat-chip--pending { background: rgba(245,158,11,0.12); color: #b45309; }
.doc-cat-name { font-size: 12px; font-weight: 700; color: #0f172a; text-transform: capitalize; }
.doc-cat-progress-track { height: 4px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.doc-cat-progress-fill { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
.doc-cat-progress-fill--done    { background: #22c55e; }
.doc-cat-progress-fill--pending { background: #f59e0b; }
.doc-cat-hint { font-size: 11px; color: #94a3b8; }

.doc-subheader { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.doc-back-btn {
  width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0;
  background: #f8fafc; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 16px; color: #475569; transition: background 0.15s; flex-shrink: 0;
}
.doc-back-btn:hover { background: #e2e8f0; color: #1e3a5f; }
.doc-subheader-title { font-size: 14px; font-weight: 700; color: #0f172a; text-transform: capitalize; }
.doc-subheader-sub   { font-size: 12px; color: #64748b; margin-top: 2px; }

.doc-item-card {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 16px 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #f8fafc; text-align: center;
}
.doc-item-card--done { border-color: rgba(34,197,94,0.3); background: #eefaf3; }
.doc-item-status-icon { font-size: 22px; }
.doc-item-name { font-size: 12px; font-weight: 600; color: #0f172a; }
.doc-item-chip { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; }
.doc-item-chip--done    { background: rgba(34,197,94,0.15); color: #15803d; border: 1px solid rgba(34,197,94,0.25); }
.doc-item-chip--pending { background: rgba(239,68,68,0.08); color: #dc2626; border: 1px solid rgba(239,68,68,0.2); }
.doc-item-btn {
  width: 100%; padding: 8px 12px; font-size: 11px; font-weight: 700;
  border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; color: #1e3a5f;
  cursor: pointer; margin-top: 4px; transition: background 0.15s;
}
.doc-item-btn:hover:not(:disabled) { background: #f0f6fb; }
.doc-item-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.doc-upload-form { display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 0; }

/* ── Aadhaar steps ── */
.aadhaar-steps-wrap   { display: flex; flex-direction: column; gap: 16px; }
.aadhaar-step-row {
  display: flex; flex-direction: column; gap: 10px; padding: 14px;
  border-radius: 10px; border: 1.5px solid #e2e8f0; background: #f8fafc;
}
.aadhaar-step-row--active { border-color: #1e3a5f; background: #f0f6fb; }
.aadhaar-step-row--done   { border-color: rgba(34,197,94,0.35); background: #eefaf3; }
.aadhaar-step-row--locked { opacity: 0.5; pointer-events: none; }
.aadhaar-step-badge { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #0f172a; }
.aadhaar-step-badge .mdi { font-size: 18px; color: #1e3a5f; }
.aadhaar-step-row--done .aadhaar-step-badge .mdi { color: #16a34a; }
.aadhaar-uploaded-chip { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #15803d; }
.aadhaar-uploaded-chip .mdi { font-size: 16px; color: #16a34a; }
.aadhaar-locked-hint { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }
.aadhaar-finalize {
  display: flex; flex-direction: column; gap: 0; padding: 14px;
  border-radius: 10px; border: 1.5px solid rgba(30,58,95,0.2); background: #f0f6fb;
}

/* ── File drop ── */
.file-drop-zone {
  border: 2px dashed #c5d8e8; border-radius: 10px; padding: 24px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  text-align: center; cursor: pointer; background: #f0f6fb;
  transition: border-color 0.15s, background 0.15s;
}
.file-drop-zone:hover { border-color: #1e3a5f; background: #e8f2f7; }
.file-drop-icon { font-size: 32px; color: #1e3a5f; }
.file-drop-text { font-size: 13px; font-weight: 600; color: #1e3a5f; }
.file-drop-hint { font-size: 11px; color: #94a3b8; }
.file-chips     { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; width: 100%; }
.file-chip {
  display: flex; align-items: center; gap: 8px;
  background: #eefaf3; border: 1px solid #a7e0bc; border-radius: 7px;
  padding: 7px 12px; font-size: 12px; font-weight: 500; color: #145b32;
}
.file-chip-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ── Save doc button ── */
.btn-save-doc {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 12px 24px; font-size: 13px; font-weight: 700;
  color: #fff; background: #1e3a5f; border: none; border-radius: 8px; cursor: pointer;
  box-shadow: 0 4px 14px rgba(30,58,95,0.28); transition: filter 0.15s, opacity 0.15s; font-family: inherit;
}
.btn-save-doc:hover:not(:disabled) { filter: brightness(1.1); }
.btn-save-doc:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── PAN pre-fill ── */
.pan-prefilled-block  { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.pan-prefill-notice {
  display: flex; align-items: flex-start; gap: 8px;
  background: #f0f6fb; border: 1px solid #c5d8e8; border-radius: 8px;
  padding: 10px 14px; font-size: 12px; color: #334155; line-height: 1.5;
}
.pan-prefill-notice .mdi { font-size: 14px; color: #1e3a5f; flex-shrink: 0; margin-top: 1px; }
.pan-prefill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
@media (max-width: 480px) { .pan-prefill-grid { grid-template-columns: 1fr; } }
.pan-prefill-item {
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 10px 12px; display: flex; flex-direction: column; gap: 3px;
}
.pan-prefill-key { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.pan-prefill-val { font-size: 13px; font-weight: 600; color: #0f172a; word-break: break-word; }

/* ── Form ── */
.form-grid { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.form-field-wrap { display: flex; flex-direction: column; gap: 6px; width: 100%; }
.form-label { font-size: 11px; font-weight: 700; color: #5a7d9a; text-transform: uppercase; letter-spacing: 0.08em; }
.req-star   { color: #e11d48; }
.form-input-box {
  display: flex; align-items: center; background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 8px; transition: border-color 0.2s, box-shadow 0.2s; overflow: hidden;
}
.form-input-box:focus-within { border-color: #1e3a5f; box-shadow: 0 0 0 3px rgba(30,58,95,0.1); background: #fff; }
.form-input-box--error { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; }
.form-icon { font-size: 15px; color: #8aafc8; padding: 0 0 0 12px; flex-shrink: 0; pointer-events: none; transition: color 0.2s; }
.form-input-box:focus-within .form-icon { color: #1e3a5f; }
.form-input { flex: 1; padding: 11px 12px; font-size: 14px; color: #0f172a; background: transparent; border: none; outline: none; font-family: inherit; }
.form-input::placeholder { color: #9fb8cc; }
.field-error { font-size: 11px; font-weight: 600; color: #ef4444; }

/* ── Hints + alerts ── */
.info-hint-box {
  display: flex; align-items: flex-start; gap: 8px;
  background: #f0f6fb; border: 1px solid #c5d8e8; border-radius: 8px;
  padding: 10px 14px; font-size: 12px; color: #334155; line-height: 1.5; text-align: left;
}
.info-hint-box .mdi { font-size: 14px; color: #1e3a5f; flex-shrink: 0; margin-top: 1px; }

.warn-alert {
  display: flex; align-items: flex-start; gap: 8px;
  background: #fff8ee; border: 1px solid #fbd89d; border-radius: 8px;
  padding: 10px 14px; font-size: 13px; color: #7a4800; line-height: 1.5;
}
.warn-alert__icon { font-size: 15px; color: #d97706; flex-shrink: 0; margin-top: 1px; }

.success-alert {
  display: flex; align-items: flex-start; gap: 8px;
  background: #eefaf3; border: 1px solid #a7e0bc; border-radius: 8px;
  padding: 10px 14px; font-size: 13px; color: #145b32; line-height: 1.5;
}
.success-alert__icon { font-size: 15px; color: #22c55e; flex-shrink: 0; margin-top: 1px; }

/* ── Complete chips ── */
.complete-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 16px; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; }
.chip--green { background: rgba(34,197,94,0.12); color: #15803d; border: 1px solid rgba(34,197,94,0.25); }

/* ── Card footer ── */
.card-footer {
  background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px;
  display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 12px;
}
@media (max-width: 639px) { .card-footer { flex-wrap: wrap; padding: 16px; } }
.btn-back {
  display: flex; align-items: center; gap: 6px; padding: 10px 20px;
  font-size: 13px; font-weight: 600; color: #475569; background: none; border: none;
  border-radius: 8px; cursor: pointer; transition: background 0.15s; font-family: inherit;
}
.btn-back:hover { background: #f1f5f9; color: #1e3a5f; }
.footer-right-btns { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
.btn-continue {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 28px; font-size: 13px; font-weight: 700;
  color: #fff; background: #1e3a5f; border: none; border-radius: 8px; cursor: pointer;
  box-shadow: 0 4px 14px rgba(30,58,95,0.28); transition: filter 0.15s, opacity 0.15s;
  font-family: inherit; white-space: nowrap;
}
.btn-continue:hover:not(:disabled) { filter: brightness(1.1); }
.btn-continue:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── Spinners ── */
.spinner-btn {
  width: 15px; height: 15px; flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Info cards ── */
.info-cards { display: flex; flex-direction: column; gap: 14px; }
@media (min-width: 640px) { .info-cards { flex-direction: row; } }
.info-card {
  flex: 1; display: flex; align-items: flex-start; gap: 14px;
  padding: 18px; border: 1.5px dashed #c5d8e8; border-radius: 12px; background: #fff;
}
.info-icon-wrap { padding: 8px; background: rgba(30,58,95,0.08); border-radius: 8px; color: #1e3a5f; flex-shrink: 0; }
.info-icon      { font-size: 20px; display: block; }
.info-title     { font-size: 13px; font-weight: 700; color: #0f172a; }
.info-desc      { font-size: 12px; color: #64748b; margin-top: 4px; line-height: 1.5; }

/* ── Footer ── */
.ws-footer { padding: 24px; text-align: center; font-size: 11px; color: #94a3b8; }
.footer-link { color: #94a3b8; text-decoration: underline; }
.footer-link:hover { color: #1e3a5f; }

/* ── Snackbar ── */
.snackbar {
  position: fixed; top: 20px; right: 20px;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 18px; border-radius: 12px; font-size: 13px; font-weight: 500; color: #fff;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 9999; max-width: calc(100vw - 40px);
}
.snackbar-success { background: #1e3a5f; }
.snackbar-error   { background: #ef4444; }
.snack-msg   { flex: 1; }
.snack-close { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; font-size: 16px; }
.snack-enter-active, .snack-leave-active { transition: all 0.3s ease; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translateY(-10px); }

/* ── Processing overlay ── */
.processing-overlay {
  position: fixed; inset: 0; background: rgba(0,22,30,0.5);
  backdrop-filter: blur(4px); display: flex; align-items: center;
  justify-content: center; z-index: 9998;
}
.processing-card {
  background: #fff; border-radius: 14px; padding: 40px 48px;
  text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.2);
}
.processing-spinner {
  width: 44px; height: 44px;
  border: 3px solid #e8f0f7; border-top-color: #1e3a5f;
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px;
}
.processing-title { font-size: 15px; font-weight: 700; color: #1e3a5f; }
.processing-sub   { font-size: 12px; color: #5a7d9a; margin-top: 6px; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── File upload area ── */
.file-upload-area { display: flex; flex-direction: column; gap: 8px; }
</style>