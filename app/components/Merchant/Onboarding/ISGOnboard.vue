<template>
  <div class="mob-isg-root">

    <!-- ── Sticky Header ── -->
    <div class="mob-header">
      <button class="mob-back-btn" @click="handleBack">
        <v-icon size="20" class="mob-back-icon">mdi-arrow-left</v-icon>
      </button>
      <div class="mob-header-center">
        <p class="mob-header-title">KYC Verification</p>
        <p class="mob-header-sub">Step {{ step }} of {{ totalSteps }}</p>
      </div>
      <div class="mob-step-dot-wrap">
        <div v-for="i in totalSteps" :key="i" class="mob-step-dot"
          :class="{ 'mob-step-dot--done': i < step, 'mob-step-dot--active': i === step }" />
      </div>
    </div>

    <!-- ── Progress Bar ── -->
    <div class="mob-progress-track">
      <div class="mob-progress-fill" :style="{ width: ((step - 1) / (totalSteps - 1) * 100) + '%' }" />
    </div>

    <!-- ── Step Labels ── -->
    <div class="mob-step-label-row">
      <div v-for="(s, i) in steps" :key="s.key" class="mob-step-label-item"
        :class="{ 'mob-step-label-item--active': step === i + 1, 'mob-step-label-item--done': step > i + 1 }">
        <div class="mob-step-circle"
          :class="{ 'mob-step-circle--active': step === i + 1, 'mob-step-circle--done': step > i + 1 }">
          <v-icon v-if="step > i + 1" size="12" class="mob-step-check">mdi-check</v-icon>
          <span v-else class="mob-step-num">{{ i + 1 }}</span>
        </div>
        <span class="mob-step-txt">{{ s.short }}</span>
      </div>
    </div>

    <!-- ── Scroll Body ── -->
    <div class="mob-body" ref="bodyRef">

      <!-- ── Initializing Overlay (KYC init) ── -->
      <template v-if="initializingKyc">
        <div class="mob-init-state">
          <div class="mob-init-spinner" />
          <p class="mob-init-title">Setting up Onboarding</p>
          <p class="mob-init-sub">Initializing UPI service KYC...</p>
        </div>
      </template>

      <template v-else>

      <!-- ════════════════════════════════════════
           STEP 1 — PAN Verification
      ════════════════════════════════════════ -->
      <template v-if="step === 1">
        <div class="mob-step-card">
          <div class="mob-step-icon-badge mob-step-icon-badge--amber">
            <v-icon size="22" class="mob-badge-icon">mdi-card-account-details-outline</v-icon>
          </div>
          <h2 class="mob-card-title">PAN Verification</h2>
          <p class="mob-card-desc">Enter PAN details to verify your identity. This must match government records
            exactly.</p>
        </div>

        <div v-if="panVerified" class="mob-verified-chip">
          <v-icon size="16" class="mob-verified-icon">mdi-check-circle</v-icon>
          <div>
            <p class="mob-verified-title">PAN Verified Successfully</p>
            <p class="mob-verified-sub">{{ panVerifiedName }} · {{ panData.pan }}</p>
          </div>
        </div>

        <template v-if="!panVerified">
          <div class="mob-form-stack">
            <div class="mob-form-field">
              <label class="mob-form-label">PAN NUMBER *</label>
              <div class="mob-input-box" :class="{ 'mob-input-box--err': panErrors.pan }">
                <v-icon size="15" class="mob-input-icon">mdi-card-account-details-outline</v-icon>
                <input v-model="panData.pan" class="mob-input" placeholder="ABCDE1234F" maxlength="10"
                  style="text-transform:uppercase; letter-spacing:0.1em;"
                  @input="panData.pan = panData.pan.toUpperCase(); panErrors.pan = ''" />
              </div>
              <span v-if="panErrors.pan" class="mob-field-err">{{ panErrors.pan }}</span>
            </div>
            <div class="mob-form-field">
              <label class="mob-form-label">NAME AS ON PAN *</label>
              <div class="mob-input-box" :class="{ 'mob-input-box--err': panErrors.name }">
                <v-icon size="15" class="mob-input-icon">mdi-account-outline</v-icon>
                <input v-model="panData.name" class="mob-input" placeholder="Full name as on PAN"
                  @input="panErrors.name = ''" />
              </div>
              <span v-if="panErrors.name" class="mob-field-err">{{ panErrors.name }}</span>
            </div>
            <div class="mob-form-field">
              <label class="mob-form-label">FATHER'S NAME *</label>
              <div class="mob-input-box" :class="{ 'mob-input-box--err': panErrors.fathername }">
                <v-icon size="15" class="mob-input-icon">mdi-account-child-outline</v-icon>
                <input v-model="panData.fathername" class="mob-input" placeholder="Father's name"
                  @input="panErrors.fathername = ''" />
              </div>
              <span v-if="panErrors.fathername" class="mob-field-err">{{ panErrors.fathername }}</span>
            </div>
            <div class="mob-form-field">
              <label class="mob-form-label">DATE OF BIRTH *</label>
              <div class="mob-input-box" :class="{ 'mob-input-box--err': panErrors.dob }">
                <v-icon size="15" class="mob-input-icon">mdi-calendar-outline</v-icon>
                <input v-model="panData.dob" class="mob-input" type="date" @change="panErrors.dob = ''" />
              </div>
              <span v-if="panErrors.dob" class="mob-field-err">{{ panErrors.dob }}</span>
            </div>
          </div>

          <div class="mob-info-box" style="margin-top:12px;">
            <v-icon size="13" class="mob-info-box-icon">mdi-information-outline</v-icon>
            <span>PAN format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F). Name and DOB must match exactly as
              on the PAN card.</span>
          </div>
        </template>
      </template>

      <!-- ════════════════════════════════════════
           STEP 2 — Bank Account Verification
      ════════════════════════════════════════ -->
      <template v-else-if="step === 2">
        <div class="mob-step-card">
          <div class="mob-step-icon-badge mob-step-icon-badge--green">
            <v-icon size="22" class="mob-badge-icon">mdi-bank-outline</v-icon>
          </div>
          <h2 class="mob-card-title">Verify Bank Account</h2>
          <p class="mob-card-desc">Enter the settlement bank account details for verification.</p>
        </div>

        <div v-if="accountVerified" class="mob-verified-chip">
          <v-icon size="16" class="mob-verified-icon">mdi-check-circle</v-icon>
          <div>
            <p class="mob-verified-title">Bank Account Verified</p>
            <p class="mob-verified-sub">{{ accountVerifiedName }} · {{ accountData.accountNumber }}</p>
          </div>
        </div>

        <template v-if="accountVerified && accountSummary">
          <div class="mob-account-summary">
            <div class="mob-summary-row">
              <span class="mob-summary-key">Bank</span>
              <span class="mob-summary-val">{{ accountSummary.bank_name }}</span>
            </div>
            <div class="mob-summary-row">
              <span class="mob-summary-key">IFSC</span>
              <span class="mob-summary-val">{{ accountSummary.bank_ifsc_code }}</span>
            </div>
            <div class="mob-summary-row">
              <span class="mob-summary-key">Name Match</span>
              <span class="mob-summary-val"
                :class="accountSummary.account_holder_result ? 'mob-text-green' : 'mob-text-red'">
                {{ accountSummary.account_holder_result ? '✓ Matched' : '✗ Mismatch' }}
                ({{ Math.round((accountSummary.account_holder_score || 0) * 100) }}%)
              </span>
            </div>
          </div>
        </template>

        <template v-if="!accountVerified">
          <div class="mob-form-stack">
            <div class="mob-form-field">
              <label class="mob-form-label">ACCOUNT HOLDER NAME *</label>
              <div class="mob-input-box" :class="{ 'mob-input-box--err': accountErrors.accountHolderName }">
                <v-icon size="15" class="mob-input-icon">mdi-account-outline</v-icon>
                <input v-model="accountData.accountHolderName" class="mob-input" placeholder="Full name"
                  @input="accountErrors.accountHolderName = ''" />
              </div>
              <span v-if="accountErrors.accountHolderName" class="mob-field-err">{{
                accountErrors.accountHolderName }}</span>
            </div>
            <div class="mob-form-field">
              <label class="mob-form-label">ACCOUNT NUMBER *</label>
              <div class="mob-input-box" :class="{ 'mob-input-box--err': accountErrors.accountNumber }">
                <v-icon size="15" class="mob-input-icon">mdi-bank-outline</v-icon>
                <input v-model="accountData.accountNumber" class="mob-input" placeholder="Bank account number"
                  inputmode="numeric" @input="accountErrors.accountNumber = ''" />
              </div>
              <span v-if="accountErrors.accountNumber" class="mob-field-err">{{ accountErrors.accountNumber
                }}</span>
            </div>
            <div class="mob-form-field">
              <label class="mob-form-label">IFSC CODE *</label>
              <div class="mob-input-box" :class="{ 'mob-input-box--err': accountErrors.ifsc }">
                <v-icon size="15" class="mob-input-icon">mdi-bank-transfer</v-icon>
                <input v-model="accountData.ifsc" class="mob-input" placeholder="SBIN0001234" maxlength="11"
                  style="text-transform:uppercase; letter-spacing:0.06em;"
                  @input="accountData.ifsc = accountData.ifsc.toUpperCase(); accountErrors.ifsc = ''" />
              </div>
              <span v-if="accountErrors.ifsc" class="mob-field-err">{{ accountErrors.ifsc }}</span>
            </div>
          </div>

          <div class="mob-info-box" style="margin-top:12px;">
            <v-icon size="13" class="mob-info-box-icon">mdi-information-outline</v-icon>
            <span>The bank account provided will be used as the settlement account. Ensure the account holder
              name matches the PAN name.</span>
          </div>
        </template>
      </template>

      <!-- ════════════════════════════════════════
           STEP 3 — Documents
      ════════════════════════════════════════ -->
      <template v-else-if="step === 3">
        <div class="mob-step-card">
          <div class="mob-step-icon-badge mob-step-icon-badge--purple">
            <v-icon size="22" class="mob-badge-icon">mdi-file-document-multiple-outline</v-icon>
          </div>
          <h2 class="mob-card-title">Verification Documents</h2>
          <p class="mob-card-desc">
            Upload the required documents for
            <strong>{{ merchantBusinessType ? merchantBusinessType.replaceAll('_', ' ') : 'your business type'
              }}</strong>
            to complete verification.
          </p>
        </div>

        <template v-if="fetchingCompliance">
          <div class="mob-loading-state">
            <div class="mob-spinner" />
            <p class="mob-loading-text">Fetching required documents...</p>
          </div>
        </template>

        <template v-else>
          <div v-if="isComplianceComplete" class="mob-alert mob-alert--success">
            <v-icon size="15" class="mob-alert-icon">mdi-check-circle-outline</v-icon>
            <span>All required documents uploaded successfully. You are ready to proceed!</span>
          </div>
          <div v-else class="mob-alert mob-alert--warn">
            <v-icon size="15" class="mob-alert-icon">mdi-alert-outline</v-icon>
            <span>Please complete all required document categories before proceeding.</span>
          </div>

          <!-- Sub-window 0: Category Grid -->
          <template v-if="docStep === 0">
            <div class="mob-doc-grid">
              <div v-for="group in requiredDocs" :key="group.category" class="mob-doc-cat-card"
                :class="{ 'mob-doc-cat-card--done': group.compliant, 'mob-doc-cat-card--pending': !group.compliant }"
                @click="openCategory(group)">
                <div class="mob-doc-cat-top">
                  <div class="mob-doc-cat-icon"
                    :class="group.compliant ? 'mob-doc-cat-icon--done' : 'mob-doc-cat-icon--pend'">
                    <v-icon size="18">{{ group.compliant ? 'mdi-check-circle' : 'mdi-file-upload-outline'
                      }}</v-icon>
                  </div>
                  <span class="mob-doc-cat-chip"
                    :class="group.compliant ? 'mob-doc-cat-chip--done' : 'mob-doc-cat-chip--pend'">
                    {{ group.uploaded }}/{{ group.required }}
                  </span>
                </div>
                <p class="mob-doc-cat-name">{{ group.category.replaceAll('_', ' ') }}</p>
                <div class="mob-doc-prog-track">
                  <div class="mob-doc-prog-fill"
                    :class="group.compliant ? 'mob-doc-prog-fill--done' : 'mob-doc-prog-fill--pend'"
                    :style="{ width: group.required ? (group.uploaded / group.required * 100) + '%' : '0%' }" />
                </div>
                <p class="mob-doc-cat-hint">Tap to manage documents</p>
              </div>
            </div>
          </template>

          <!-- Sub-window 1: Document list in category -->
          <template v-else-if="docStep === 1">
            <div class="mob-doc-subheader">
              <button class="mob-doc-back" @click="docStep = 0">
                <v-icon size="16">mdi-arrow-left</v-icon>
              </button>
              <div>
                <p class="mob-doc-sub-title">{{ activeCategory?.category?.replaceAll('_', ' ') }}</p>
                <p class="mob-doc-sub-hint">Upload all required documents below</p>
              </div>
            </div>
            <div class="mob-doc-item-list">
              <div v-for="doc in activeCategory?.documents" :key="doc.code" class="mob-doc-item"
                :class="{ 'mob-doc-item--done': doc.uploaded }">
                <v-icon size="18" :color="doc.uploaded ? '#16a34a' : (doc.mandatory ? '#ef4444' : '#94a3b8')">
                  {{ doc.uploaded ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
                </v-icon>
                <div class="mob-doc-item-text">
                  <p class="mob-doc-item-name">{{ doc.name }}</p>
                  <span class="mob-doc-item-chip" :class="doc.uploaded ? 'mob-chip-done' : 'mob-chip-pend'">
                    {{ doc.uploaded ? 'Uploaded' : (doc.mandatory ? 'Mandatory' : 'Optional') }}
                  </span>
                </div>
                <button class="mob-doc-item-btn" :disabled="doc.uploaded" @click="openDocUpload(doc.code)">
                  {{ doc.uploaded ? '✓ Added' : 'Add Document' }}
                </button>
              </div>
            </div>
          </template>

          <!-- Sub-window 2: Upload form -->
          <template v-else-if="docStep === 2">
            <div class="mob-doc-subheader">
              <button class="mob-doc-back" @click="docStep = 1">
                <v-icon size="16">mdi-arrow-left</v-icon>
              </button>
              <div>
                <p class="mob-doc-sub-title">Upload {{ activeDocType?.replaceAll('_', ' ') }}</p>
                <p class="mob-doc-sub-hint">Ensure images are clear and readable</p>
              </div>
            </div>

            <!-- Front/back two-step upload — applies to every doc where docIsBack is true -->
            <template v-if="activeDocMeta.requiresFrontBack">
              <div class="mob-aadhaar-wrap">
                <!-- Front -->
                <div class="mob-aadhaar-step" :class="{
                  'mob-aadhaar-step--active': !docUploads[activeDocType]?.frontId,
                  'mob-aadhaar-step--done': docUploads[activeDocType]?.frontId,
                }">
                  <div class="mob-aadhaar-step-label">
                    <v-icon size="16" :color="docUploads[activeDocType]?.frontId ? '#16a34a' : '#1142d4'">
                      {{ docUploads[activeDocType]?.frontId ? 'mdi-check-circle' : 'mdi-numeric-1-circle-outline'
                      }}
                    </v-icon>
                    <span>{{ activeDocMeta.docName }} Front</span>
                  </div>
                  <template v-if="!docUploads[activeDocType]?.frontId">
                    <div class="mob-file-drop" @click="triggerFrontBackInput('front')">
                      <v-icon size="28" class="mob-drop-icon">mdi-card-account-details-outline</v-icon>
                      <p class="mob-drop-text">{{ docUploads[activeDocType]?.frontFile ?
                        docUploads[activeDocType].frontFile.name : 'Tap to upload front side' }}</p>
                      <p class="mob-drop-hint">Accepted: JPG, PNG, WEBP</p>
                      <input ref="frontInputRef" type="file" accept="image/*" style="display:none"
                        @change="handleFrontBackFileSelect($event, 'front')" />
                    </div>
                    <div v-if="docUploads[activeDocType]?.frontFile" class="mob-file-chips">
                      <div class="mob-file-chip">
                        <v-icon size="13">mdi-image-outline</v-icon>
                        <span>{{ docUploads[activeDocType].frontFile.name }}</span>
                      </div>
                    </div>
                    <button class="mob-upload-btn"
                      :disabled="!docUploads[activeDocType]?.frontFile || uploadingSide"
                      @click="uploadFrontBackSide('front')">
                      <span v-if="uploadingSide && sideUploading === 'front'" class="mob-btn-spinner" />
                      <template v-else><v-icon size="14">mdi-upload</v-icon> Upload Front</template>
                    </button>
                  </template>
                  <div v-else class="mob-uploaded-chip">
                    <v-icon size="14">mdi-check-circle</v-icon> Front uploaded successfully
                  </div>
                </div>

                <!-- Back -->
                <div class="mob-aadhaar-step" :class="{
                  'mob-aadhaar-step--active': docUploads[activeDocType]?.frontId && !docUploads[activeDocType]?.backId,
                  'mob-aadhaar-step--done': docUploads[activeDocType]?.backId,
                  'mob-aadhaar-step--locked': !docUploads[activeDocType]?.frontId
                }">
                  <div class="mob-aadhaar-step-label">
                    <v-icon size="16"
                      :color="docUploads[activeDocType]?.backId ? '#16a34a' : !docUploads[activeDocType]?.frontId ? '#c7d2e6' : '#1142d4'">
                      {{ docUploads[activeDocType]?.backId ? 'mdi-check-circle' : 'mdi-numeric-2-circle-outline' }}
                    </v-icon>
                    <span>{{ activeDocMeta.docName }} Back</span>
                  </div>
                  <div v-if="!docUploads[activeDocType]?.frontId" class="mob-locked-hint">
                    <v-icon size="13">mdi-lock-outline</v-icon> Upload front side first
                  </div>
                  <template v-else-if="!docUploads[activeDocType]?.backId">
                    <div class="mob-file-drop" @click="triggerFrontBackInput('back')">
                      <v-icon size="28" class="mob-drop-icon">mdi-card-account-details-outline</v-icon>
                      <p class="mob-drop-text">{{ docUploads[activeDocType]?.backFile ?
                        docUploads[activeDocType].backFile.name : 'Tap to upload back side' }}</p>
                      <p class="mob-drop-hint">Accepted: JPG, PNG, WEBP</p>
                      <input ref="backInputRef" type="file" accept="image/*" style="display:none"
                        @change="handleFrontBackFileSelect($event, 'back')" />
                    </div>
                    <div v-if="docUploads[activeDocType]?.backFile" class="mob-file-chips">
                      <div class="mob-file-chip">
                        <v-icon size="13">mdi-image-outline</v-icon>
                        <span>{{ docUploads[activeDocType].backFile.name }}</span>
                      </div>
                    </div>
                    <button class="mob-upload-btn"
                      :disabled="!docUploads[activeDocType]?.backFile || uploadingSide"
                      @click="uploadFrontBackSide('back')">
                      <span v-if="uploadingSide && sideUploading === 'back'" class="mob-btn-spinner" />
                      <template v-else><v-icon size="14">mdi-upload</v-icon> Upload Back</template>
                    </button>
                  </template>
                  <div v-else class="mob-uploaded-chip">
                    <v-icon size="14">mdi-check-circle</v-icon> Back uploaded successfully
                  </div>
                </div>

                <!-- Document number (if required) + save -->
                <div v-if="docUploads[activeDocType]?.frontId && docUploads[activeDocType]?.backId"
                  class="mob-aadhaar-finalize">
                  <div v-if="activeDocMeta.requiresNumber" class="mob-form-field">
                    <label class="mob-form-label">{{ docNumberLabel }} *</label>
                    <div class="mob-input-box">
                      <v-icon size="15" class="mob-input-icon">mdi-identifier</v-icon>
                      <input v-model="docUploads[activeDocType].docNumber" class="mob-input"
                        :placeholder="docNumberLabel" :maxlength="activeDocMeta.validationRules?.length"
                        inputmode="numeric" />
                    </div>
                  </div>
                  <button class="mob-save-btn" :disabled="savingDoc || activeDocNumberInvalid"
                    @click="saveFrontBackDoc">
                    <span v-if="savingDoc" class="mob-btn-spinner" />
                    <template v-else><v-icon size="14">mdi-content-save-outline</v-icon> Save {{
                      activeDocMeta.docName }}</template>
                  </button>
                </div>
              </div>
            </template>

            <!-- Single-image doc types -->
            <template v-else>
              <!-- PAN pre-fill notice -->
              <div v-if="activeDocType === 'INDIVIDUAL_PAN'" class="mob-pan-prefill-block">
                <div class="mob-pan-prefill-notice">
                  <v-icon size="14" class="mob-info-box-icon">mdi-information-outline</v-icon>
                  <p>PAN details are pre-filled from your verified PAN. Please upload a clear image of your PAN
                    card below.</p>
                </div>
                <div class="mob-detail-grid" style="margin-top:8px;">
                  <div class="mob-detail-item">
                    <span class="mob-di-key">PAN NUMBER</span>
                    <span class="mob-di-val">{{ merchantProfile?.pan || panData.pan || '—' }}</span>
                  </div>
                  <div class="mob-detail-item">
                    <span class="mob-di-key">PAN HOLDER NAME</span>
                    <span class="mob-di-val">{{ panVerifiedName || panData.name || '—' }}</span>
                  </div>
                </div>
              </div>

              <!-- Doc number field -->
              <div v-if="showDocNumber" class="mob-form-field" style="margin-bottom:12px;">
                <label class="mob-form-label">{{ docNumberLabel }} *</label>
                <div class="mob-input-box">
                  <v-icon size="15" class="mob-input-icon">mdi-identifier</v-icon>
                  <input v-model="docUploads[activeDocType].docNumber" class="mob-input"
                    :placeholder="docNumberLabel" />
                </div>
              </div>

              <!-- File upload -->
              <div class="mob-form-field">
                <label class="mob-form-label">UPLOAD {{ requiredImageCount }} IMAGE(S) *</label>
                <div class="mob-file-drop" @click="triggerFileInput">
                  <v-icon size="28" class="mob-drop-icon">mdi-cloud-upload-outline</v-icon>
                  <p class="mob-drop-text">
                    {{ docUploads[activeDocType]?.files?.length
                      ? `${docUploads[activeDocType].files.length} / ${requiredImageCount} file(s) selected`
                      : `Tap to upload ${requiredImageCount} image(s)` }}
                  </p>
                  <p class="mob-drop-hint">Accepted: JPG, PNG, WEBP</p>
                  <input ref="fileInputRef" type="file" multiple accept="image/*" style="display:none"
                    @change="handleFileSelect" />
                </div>
                <div v-if="docUploads[activeDocType]?.files?.length" class="mob-file-chips">
                  <div v-for="(f, i) in docUploads[activeDocType].files" :key="i" class="mob-file-chip">
                    <v-icon size="13">mdi-image-outline</v-icon>
                    <span>{{ f.name }}</span>
                  </div>
                </div>
              </div>

              <button class="mob-save-btn"
                :disabled="savingDoc || docUploads[activeDocType]?.files?.length !== requiredImageCount || (showDocNumber && !docUploads[activeDocType]?.docNumber)"
                @click="saveDocUpload">
                <span v-if="savingDoc" class="mob-btn-spinner" />
                <template v-else><v-icon size="14">mdi-content-save-outline</v-icon> Save Document</template>
              </button>
            </template>
          </template>
        </template>
      </template>

      <!-- ════════════════════════════════════════
           STEP 4 — Review & Submit
      ════════════════════════════════════════ -->
      <template v-else-if="step === 4">
        <div class="mob-step-card">
          <div class="mob-step-icon-badge mob-step-icon-badge--teal">
            <v-icon size="22" class="mob-badge-icon">mdi-clipboard-check-outline</v-icon>
          </div>
          <h2 class="mob-card-title">Review &amp; Submit</h2>
          <p class="mob-card-desc">All verifications complete. Review your verified details and submit.</p>
        </div>

        <div class="mob-review-list">
          <div class="mob-review-item" :class="panVerified ? 'mob-review-item--done' : 'mob-review-item--pend'">
            <div class="mob-review-icon-wrap">
              <v-icon size="18">{{ panVerified ? 'mdi-check-circle' : 'mdi-alert-circle-outline' }}</v-icon>
            </div>
            <div class="mob-review-info">
              <p class="mob-review-title">PAN Verification</p>
              <p class="mob-review-sub">{{ panVerified ? (panVerifiedName || panData.pan) : 'Not verified' }}</p>
            </div>
            <span class="mob-review-badge" :class="panVerified ? 'mob-badge-done' : 'mob-badge-pend'">
              {{ panVerified ? 'Verified' : 'Pending' }}
            </span>
          </div>

          <div class="mob-review-item"
            :class="accountVerified ? 'mob-review-item--done' : 'mob-review-item--pend'">
            <div class="mob-review-icon-wrap">
              <v-icon size="18">{{ accountVerified ? 'mdi-check-circle' : 'mdi-alert-circle-outline' }}</v-icon>
            </div>
            <div class="mob-review-info">
              <p class="mob-review-title">Bank Account</p>
              <p class="mob-review-sub">{{ accountVerified ? (accountSummary?.bank_name ||
                accountData.accountNumber) : 'Not verified' }}</p>
            </div>
            <span class="mob-review-badge" :class="accountVerified ? 'mob-badge-done' : 'mob-badge-pend'">
              {{ accountVerified ? 'Verified' : 'Pending' }}
            </span>
          </div>

          <div class="mob-review-item"
            :class="isComplianceComplete ? 'mob-review-item--done' : 'mob-review-item--pend'">
            <div class="mob-review-icon-wrap">
              <v-icon size="18">{{ isComplianceComplete ? 'mdi-check-circle' : 'mdi-alert-circle-outline'
                }}</v-icon>
            </div>
            <div class="mob-review-info">
              <p class="mob-review-title">Documents</p>
              <p class="mob-review-sub">{{ isComplianceComplete ? 'All documents uploaded' : 'Some documents missing' }}</p>
            </div>
            <span class="mob-review-badge" :class="isComplianceComplete ? 'mob-badge-done' : 'mob-badge-pend'">
              {{ isComplianceComplete ? 'Complete' : 'Pending' }}
            </span>
          </div>
        </div>

        <div v-if="!panVerified || !accountVerified || !isComplianceComplete" class="mob-alert mob-alert--warn"
          style="margin-top:16px;">
          <v-icon size="14" class="mob-alert-icon">mdi-alert-outline</v-icon>
          <span>
            <span v-if="!panVerified">PAN verification is required. </span>
            <span v-if="!accountVerified">Bank account verification is required. </span>
            <span v-if="!isComplianceComplete">All required documents must be uploaded. </span>
            Please go back and complete the missing steps.
          </span>
        </div>

        <div v-if="panVerified && accountVerified && isComplianceComplete" class="mob-alert mob-alert--success"
          style="margin-top:16px;">
          <v-icon size="14" class="mob-alert-icon">mdi-check-circle-outline</v-icon>
          <span>All verifications completed. You can now submit the onboarding.</span>
        </div>
      </template>

      <!-- ════════════════════════════════════════
           STEP 5 — Complete
      ════════════════════════════════════════ -->
      <template v-else-if="step === 5">
        <div class="mob-success-wrap">
          <div class="mob-success-ring">
            <div class="mob-success-inner">
              <v-icon size="48" class="mob-success-icon">mdi-check-decagram</v-icon>
            </div>
          </div>
          <h2 class="mob-success-title">Onboarding Submitted!</h2>
          <p class="mob-success-desc">Your onboarding has been successfully submitted. Terminal activation will be
            completed shortly.</p>

          <div v-if="submitResult" class="mob-result-chips">
            <div v-if="submitResult.tid" class="mob-result-chip">
              <v-icon size="14" class="mob-result-chip-icon">mdi-identifier</v-icon>
              <div>
                <p class="mob-result-chip-label">Terminal ID</p>
                <p class="mob-result-chip-val">{{ submitResult.tid }}</p>
              </div>
            </div>
            <div v-if="submitResult.vpa" class="mob-result-chip">
              <v-icon size="14" class="mob-result-chip-icon">mdi-qrcode</v-icon>
              <div>
                <p class="mob-result-chip-label">UPI VPA</p>
                <p class="mob-result-chip-val">{{ submitResult.vpa }}</p>
              </div>
            </div>
            <div v-if="submitResult.appID" class="mob-result-chip">
              <v-icon size="14" class="mob-result-chip-icon">mdi-application-outline</v-icon>
              <div>
                <p class="mob-result-chip-label">App ID</p>
                <p class="mob-result-chip-val">{{ submitResult.appID }}</p>
              </div>
            </div>
          </div>

          <div class="mob-complete-chips">
            <div class="mob-complete-chip"><v-icon size="11">mdi-check</v-icon> PAN Verified</div>
            <div class="mob-complete-chip"><v-icon size="11">mdi-check</v-icon> Account Verified</div>
            <div class="mob-complete-chip"><v-icon size="11">mdi-check</v-icon> Docs Uploaded</div>
            <div class="mob-complete-chip"><v-icon size="11">mdi-check</v-icon> Submitted</div>
          </div>

          <button class="mob-dashboard-btn" @click="goToDashboard">
            <v-icon size="16">mdi-view-dashboard-outline</v-icon>
            Go to Dashboard
          </button>
        </div>
      </template>

      <!-- ── Toast ── -->
      <div v-if="toastMsg" class="mob-toast" :class="'mob-toast--' + toastColor">
        <v-icon size="14">{{ toastColor === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'
          }}</v-icon>
        <span>{{ toastMsg }}</span>
      </div>

      <div style="height: 100px;" />

      </template>
    </div>

    <!-- ── Bottom Action Bar ── -->
    <div class="mob-action-bar" v-if="!initializingKyc && step !== 5">
      <button v-if="step > 1 && !(step === 3 && docStep > 0)" class="mob-back-action" @click="goBack">
        <v-icon size="16">mdi-arrow-left</v-icon>
      </button>

      <!-- Step 1 — PAN -->
      <button v-if="step === 1" class="mob-primary-btn" :disabled="loading" @click="handleStep3Pan">
        <span v-if="loading" class="mob-btn-spinner" />
        <template v-else>{{ panVerified ? 'Continue' : 'Verify PAN' }} <v-icon
            size="14">mdi-arrow-right</v-icon></template>
      </button>

      <!-- Step 2 — Bank Account -->
      <button v-else-if="step === 2" class="mob-primary-btn" :disabled="loading" @click="handleStep4Account">
        <span v-if="loading" class="mob-btn-spinner" />
        <template v-else>{{ accountVerified ? 'Continue' : 'Verify Account' }} <v-icon
            size="14">mdi-arrow-right</v-icon></template>
      </button>

      <!-- Step 3 — Documents -->
      <button v-else-if="step === 3" class="mob-primary-btn" :disabled="!isComplianceComplete || fetchingCompliance"
        @click="handleStep5Docs">
        {{ isComplianceComplete ? 'Continue' : 'Upload Documents' }}
        <v-icon size="14">mdi-arrow-right</v-icon>
      </button>

      <!-- Step 4 — Submit -->
      <button v-else-if="step === 4" class="mob-primary-btn mob-primary-btn--green"
        :disabled="!panVerified || !accountVerified || !isComplianceComplete || submitting"
        @click="handleStep6Submit">
        <span v-if="submitting" class="mob-btn-spinner" />
        <template v-else>Submit <v-icon size="14">mdi-check</v-icon></template>
      </button>
    </div>

    <!-- ── Full-screen processing overlay ── -->
    <transition name="mob-fade">
      <div v-if="loading || submitting" class="mob-overlay">
        <div class="mob-overlay-card">
          <div class="mob-overlay-spinner" />
          <p class="mob-overlay-title">{{ processingMsg }}</p>
          <p class="mob-overlay-sub">Please don't close this screen</p>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useIsgOnboardingApi } from "~/composables/apis/Useisgonboardingapi";
import { useOnboadingApi } from "~/composables/apis/useOnboadingApi";
import { useAuthStore } from "~/stores/auth";
import { useDocumentUpload } from "~/composables/useDocumentUpload";
import { getDocMeta } from "~/utils/documentRegistry";

const emit = defineEmits(["submitted"]);

const router = useRouter();
const auth = useAuthStore();

const {
  isgGetOwnMerchantForOnboarding,
  isgVerifyPan,
  isgVerifyAccount,
  isgSubmitOnboarding,
  isgMarkKycSubmitted,
  setVerifyOtp,
} = useIsgOnboardingApi();

const { complianceStatus, createKyc } = useOnboadingApi();
const { createUploadState, uploadImage, saveDocument } = useDocumentUpload();

const steps = [
  { key: "pan", short: "PAN" },
  { key: "bank", short: "Bank" },
  { key: "docs", short: "Docs" },
  { key: "review", short: "Review" },
  { key: "done", short: "Done" },
];
const totalSteps = computed(() => steps.length);

const step = ref(1);
const loading = ref(false);
const submitting = ref(false);
const processingMsg = ref("Processing...");
const initializingKyc = ref(false);
const merchantProfile = ref(null);
const bodyRef = ref(null);
const kycStatusRef = ref(null);

const toastMsg = ref("");
const toastColor = ref("success");
let toastTimer = null;
function showToast(msg, color = "success") {
  toastMsg.value = msg;
  toastColor.value = color;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMsg.value = ""), 3500);
}

const panData = reactive({ pan: "", name: "", fathername: "", dob: "" });
const panErrors = reactive({ pan: "", name: "", fathername: "", dob: "" });
const panVerified = ref(false);
const panVerifiedName = ref("");

const accountData = reactive({ accountHolderName: "", accountNumber: "", ifsc: "" });
const accountErrors = reactive({ accountHolderName: "", accountNumber: "", ifsc: "" });
const accountVerified = ref(false);
const accountVerifiedName = ref("");
const accountSummary = ref(null);

const fetchingCompliance = ref(false);
const complianceResponse = ref(null);
const docStep = ref(0);
const activeCategory = ref(null);
const activeDocType = ref(null);
const savingDoc = ref(false);
const fileInputRef = ref(null);
const docUploads = reactive({});

const frontInputRef = ref(null);
const backInputRef = ref(null);
const uploadingSide = ref(false);
const sideUploading = ref(null);

const submitResult = ref(null);

// Business type is already fixed for an existing merchant — read-only, drives
// which categories/documents the backend compliance engine returns.
const merchantBusinessType = computed(() => merchantProfile.value?.business_type || "");

// Every category the backend returns is already business-type filtered AND
// already carries the correct required/uploaded/compliant counts computed by
// service.complianceStatus (isg.documentMatrix.js) — do NOT recompute these
// client-side, that would override the backend's per-business-type rules.
const requiredDocs = computed(() => {
  if (!complianceResponse.value?.categories) return [];
  return complianceResponse.value.categories.map((cat) => ({
    category: cat.category,
    documents: cat.documents || [],
    required: cat.required,
    uploaded: cat.uploaded,
    compliant: cat.compliant,
  }));
});

const isComplianceComplete = computed(() => {
  if (!requiredDocs.value.length) return false;
  return requiredDocs.value.every((cat) => cat.compliant);
});

// Doc-code -> upload metadata (docId/docName/docIsBack/requiredImageCount/...)
// resolved from the shared registry.
const activeDocMeta = computed(() => getDocMeta(activeDocType.value || "", merchantBusinessType.value));
const showDocNumber = computed(() => activeDocMeta.value.requiresNumber);
const docNumberLabel = computed(() =>
  activeDocMeta.value.requiresNumber ? `${activeDocMeta.value.docName} Number` : "Document Number"
);
const requiredImageCount = computed(() => activeDocMeta.value.requiredImageCount);

const activeDocNumberInvalid = computed(() => {
  const meta = activeDocMeta.value;
  if (!meta.requiresNumber) return false;
  const value = docUploads[activeDocType.value]?.docNumber || "";
  if (!value) return true;
  const minLength = meta.validationRules?.length;
  return !!minLength && value.length < minLength;
});

function handleBack() {
  if (step.value === 3 && docStep.value > 0) { docStep.value--; return; }
  if (step.value > 1) { step.value--; return; }
  router.back();
}
function goBack() {
  if (step.value === 3 && docStep.value > 0) { docStep.value--; return; }
  if (step.value > 1) step.value--;
}
function goToDashboard() {
  router.push("/merchant/dashboard");
}
function scrollToTop() {
  nextTick(() => bodyRef.value?.scrollTo({ top: 0, behavior: "smooth" }));
}

async function initializeServiceKyc(merchantId) {
  try {
    await createKyc({ merchantId, service: "UPI", interfaceName: "ISG" });
  } catch (err) {
    console.error("[ISG] initializeServiceKyc error:", err);
  }
  return true;
}

async function loadMerchantProfile() {
  try {
    const res = await isgGetOwnMerchantForOnboarding();
    if (res?.statusCode === "00" && res?.data) {
      merchantProfile.value = res.data;
    } else {
      showToast("Failed to load merchant details", "error");
    }
  } catch {
    showToast("Network error fetching profile", "error");
  }
}

async function loadComplianceStatus() {
  fetchingCompliance.value = true;
  try {
    const status = await complianceStatus(merchantProfile.value?.id);
    if (status?.statusCode === "00") {
      kycStatusRef.value = status.kycStatus;
      complianceResponse.value = status;
    }
  } catch (err) {
    console.error("[ISG] complianceStatus error:", err);
  } finally {
    fetchingCompliance.value = false;
  }
}

function resumeFromKycStatus() {
  const kyc = kycStatusRef.value;
  if (!kyc) { step.value = 1; return; }
  if (!kyc.pan) { step.value = 1; }
  else if (!kyc.bank) { panVerified.value = true; step.value = 2; }
  else if (!kyc.aadhaar || !kyc.storeImage) {
    panVerified.value = true; accountVerified.value = true; step.value = 3;
  } else {
    panVerified.value = true; accountVerified.value = true; step.value = 4;
  }
}

function formatDOB(date) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

async function handleStep3Pan() {
  if (panVerified.value) { step.value = 2; scrollToTop(); return; }
  panErrors.pan = ""; panErrors.name = ""; panErrors.fathername = ""; panErrors.dob = "";
  const panReg = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panData.pan.trim() || !panReg.test(panData.pan.toUpperCase())) panErrors.pan = "Enter a valid PAN (e.g. ABCDE1234F)";
  if (!panData.name.trim()) panErrors.name = "Name as on PAN is required";
  if (!panData.fathername.trim()) panErrors.fathername = "Father's name is required";
  if (!panData.dob) panErrors.dob = "Date of birth is required";
  if (panErrors.pan || panErrors.name || panErrors.fathername || panErrors.dob) {
    showToast("Please fix the errors above", "error");
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
    });
    if (res?.statusCode === "00") {
      panVerified.value = true;
      panVerifiedName.value = res?.data?.pan_name || panData.name;
      showToast("PAN verified successfully!");
      step.value = 2; scrollToTop();
    } else {
      showToast(res?.message || "PAN verification failed. Please check details.", "error");
    }
  } catch {
    showToast("Network error during PAN verification.", "error");
  } finally {
    loading.value = false;
  }
}

async function handleStep4Account() {
  if (accountVerified.value) { await loadComplianceStatus(); step.value = 3; scrollToTop(); return; }
  accountErrors.accountHolderName = ""; accountErrors.accountNumber = ""; accountErrors.ifsc = "";
  if (!accountData.accountHolderName.trim()) accountErrors.accountHolderName = "Account holder name is required";
  if (!accountData.accountNumber.trim()) accountErrors.accountNumber = "Account number is required";
  if (!accountData.ifsc.trim() || accountData.ifsc.length < 11) accountErrors.ifsc = "Valid 11-character IFSC is required";
  if (accountErrors.accountHolderName || accountErrors.accountNumber || accountErrors.ifsc) {
    showToast("Please fix the errors above", "error");
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
    });
    if (res?.statusCode === "00") {
      accountVerified.value = true;
      accountVerifiedName.value = res?.data?.account_holder_name || accountData.accountHolderName;
      accountSummary.value = res?.data || null;
      showToast("Bank account verified successfully!");
      await loadComplianceStatus(); step.value = 3; scrollToTop();
    } else {
      showToast(res?.message || "Account verification failed. Please check details.", "error");
    }
  } catch {
    showToast("Network error during account verification.", "error");
  } finally {
    loading.value = false;
  }
}

function openCategory(group) { activeCategory.value = group; docStep.value = 1; }

function openDocUpload(docType) {
  activeDocType.value = docType;
  docStep.value = 2;
  docUploads[docType] = createUploadState();
}

function triggerFrontBackInput(side) {
  if (side === "front") frontInputRef.value?.click();
  else backInputRef.value?.click();
}

function handleFrontBackFileSelect(e, side) {
  const file = e.target.files?.[0];
  if (!file || !activeDocType.value) return;
  const doc = docUploads[activeDocType.value];
  if (side === "front") doc.frontFile = file; else doc.backFile = file;
}

async function uploadFrontBackSide(side) {
  const docType = activeDocType.value;
  if (!docType) return;
  const doc = docUploads[docType];
  const file = side === "front" ? doc.frontFile : doc.backFile;
  if (!file) return;

  uploadingSide.value = true; sideUploading.value = side;
  try {
    const id = await uploadImage(docType, file, side, merchantBusinessType.value);
    if (side === "front") doc.frontId = id; else doc.backId = id;
    showToast(`${activeDocMeta.value.docName} ${side} uploaded`);
  } catch (err) {
    showToast(err?.message || `Failed to upload ${side} side`, "error");
  } finally {
    uploadingSide.value = false; sideUploading.value = null;
  }
}

async function saveFrontBackDoc() {
  const docType = activeDocType.value;
  if (!docType) return;
  const doc = docUploads[docType];

  if (activeDocMeta.value.requiresNumber && !doc.docNumber) {
    showToast(`Please enter the ${activeDocMeta.value.docName.toLowerCase()} number`, "error");
    return;
  }

  savingDoc.value = true;
  try {
    await saveDocument(docType, doc, {
      merchantId: merchantProfile.value?.id,
      businessType: merchantBusinessType.value,
      uploadedBy: auth?.user?.id,
    });
    await loadComplianceStatus();
    showToast(`${activeDocMeta.value.docName} saved successfully`);
    docStep.value = 0;
  } catch (err) {
    showToast(err?.message || "Failed to save document", "error");
  } finally {
    savingDoc.value = false;
  }
}

function triggerFileInput() { fileInputRef.value?.click(); }
function handleFileSelect(e) {
  const files = Array.from(e.target.files ?? []);
  if (activeDocType.value && docUploads[activeDocType.value]) docUploads[activeDocType.value].files = files;
}

async function saveDocUpload() {
  const docType = activeDocType.value;
  const doc = docUploads[docType];
  const meta = activeDocMeta.value;

  if (doc.files.length !== meta.requiredImageCount) {
    showToast(`Please upload exactly ${meta.requiredImageCount} image(s)`, "error");
    return;
  }
  if (meta.requiresNumber && !doc.docNumber) {
    showToast(`Please enter the ${meta.docName.toLowerCase()} number`, "error");
    return;
  }

  savingDoc.value = true;
  doc.imageIds = [];

  try {
    for (const file of doc.files) {
      try {
        doc.imageIds.push(await uploadImage(docType, file, undefined, merchantBusinessType.value));
      } catch (err) {
        showToast(err?.message || "Image upload failed. Please retry.", "error");
        savingDoc.value = false;
        return;
      }
    }

    await saveDocument(docType, doc, {
      merchantId: merchantProfile.value?.id,
      businessType: merchantBusinessType.value,
      uploadedBy: auth?.user?.id,
    });
    await loadComplianceStatus();
    showToast(`${meta.docName} saved successfully`);
    docStep.value = 0;
  } catch (err) {
    showToast(err?.message || "Failed to save document", "error");
  } finally {
    savingDoc.value = false;
  }
}

function handleStep5Docs() {
  if (!isComplianceComplete.value) {
    showToast("Please upload all required documents", "error");
    return;
  }
  step.value = 4; scrollToTop();
}

async function handleStep6Submit() {
  if (!panVerified.value) { showToast("PAN verification is required before submitting", "error"); return; }
  if (!accountVerified.value) { showToast("Bank account verification is required before submitting", "error"); return; }
  if (!isComplianceComplete.value) { showToast("All required documents must be uploaded before submitting", "error"); return; }

  submitting.value = true;
  processingMsg.value = "Submitting ISG onboarding...";
  try {
    // const res = await isgSubmitOnboarding({ merchantId: merchantProfile.value?.id });
    const res = await isgMarkKycSubmitted();
    if (res?.statusCode === "00") {
      submitResult.value = res?.data || null;
      showToast(res?.message || "ISG onboarding submitted successfully!");
      step.value = 5; scrollToTop();
      emit("submitted", submitResult.value);
      setTimeout(() => { router.push("/merchant/dashboard"); }, 2000);
    } else {
      showToast(res?.message || "Submission failed. Please retry.", "error");
    }
  } catch (err) {
    showToast("An error occurred during submission.", "error");
    console.error("[ISG] Submit error:", err);
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  initializingKyc.value = true;
  try {
    await loadMerchantProfile();
    if (merchantProfile.value?.id) {
      await initializeServiceKyc(merchantProfile.value.id);
      await setVerifyOtp(merchantProfile.value.id);
    }
    await loadComplianceStatus();
    resumeFromKycStatus();
  } catch (err) {
    console.error("[ISG] onMounted error:", err);
    showToast("Could not initialize onboarding", "error");
  } finally {
    initializingKyc.value = false;
  }
});

onUnmounted(() => {
  if (toastTimer) clearTimeout(toastTimer);
});
</script>

<style scoped>
.mob-isg-root {
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #f4f5f7;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

/* ── Header ── */
.mob-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  background: #fff;
  border-bottom: 1px solid #e8edf3;
}
.mob-back-btn {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: #eef2ff; border: 1.5px solid #d7e0fb;
  display: flex; align-items: center; justify-content: center;
  color: #1142d4; cursor: pointer;
}
.mob-back-btn:hover { background: #e0e9fe; }
.mob-header-center { flex: 1; text-align: center; }
.mob-header-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
.mob-header-sub { font-size: 0.75rem; color: #94a3b8; margin: 2px 0 0; }
.mob-step-dot-wrap { display: flex; gap: 5px; flex-shrink: 0; width: 36px; justify-content: flex-end; }
.mob-step-dot { width: 6px; height: 6px; border-radius: 50%; background: #dfe6ee; }
.mob-step-dot--active { background: #1142d4; }
.mob-step-dot--done { background: #22c55e; }

/* ── Progress ── */
.mob-progress-track { height: 3px; background: #e8edf3; }
.mob-progress-fill { height: 100%; background: linear-gradient(90deg, #1142d4, #1a52f5); transition: width .25s ease; }

/* ── Step labels ── */
.mob-step-label-row {
  display: flex; justify-content: space-between;
  padding: 16px 22px 6px; background: #fff; border-bottom: 1px solid #e8edf3;
}
.mob-step-label-item { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; opacity: .5; }
.mob-step-label-item--active, .mob-step-label-item--done { opacity: 1; }
.mob-step-circle {
  width: 26px; height: 26px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #eef2ff; border: 1.5px solid #dbe4fd; color: #94a3b8;
  font-size: 11px; font-weight: 700;
}
.mob-step-circle--active { background: #1142d4; border-color: #1142d4; color: #fff; }
.mob-step-circle--done { background: #22c55e; border-color: #22c55e; color: #fff; }
.mob-step-txt { font-size: .68rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }

/* ── Body ── */
.mob-body {
  flex: 1; overflow-y: auto;
  padding: 22px; max-width: 640px; width: 100%; margin: 0 auto;
}
.mob-body::-webkit-scrollbar { width: 5px; }
.mob-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

/* ── Init / loading states ── */
.mob-init-state, .mob-loading-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 3rem 1rem; text-align: center; gap: 4px;
}
.mob-init-spinner, .mob-spinner {
  width: 34px; height: 34px; border-radius: 50%; margin-bottom: 10px;
  border: 3px solid #dbe4fd; border-top-color: #1142d4;
  animation: mob-spin .8s linear infinite;
}
.mob-init-title, .mob-loading-text { font-weight: 700; color: #0f172a; margin: 0; font-size: .9rem; }
.mob-init-sub { color: #94a3b8; font-size: .8rem; margin: 4px 0 0; }
@keyframes mob-spin { to { transform: rotate(360deg); } }

/* ── Step card ── */
.mob-step-card { background: #fff; border: 1px solid #e8edf3; border-radius: 16px; padding: 22px; text-align: center; margin-bottom: 18px; }
.mob-step-icon-badge {
  width: 52px; height: 52px; border-radius: 14px; margin: 0 auto 12px;
  display: flex; align-items: center; justify-content: center;
}
.mob-step-icon-badge--amber { background: rgba(245,158,11,.12); color: #b45309; }
.mob-step-icon-badge--green { background: rgba(34,197,94,.12); color: #15803d; }
.mob-step-icon-badge--purple { background: rgba(139,92,246,.12); color: #7c3aed; }
.mob-step-icon-badge--teal { background: rgba(20,184,166,.12); color: #0f766e; }
.mob-badge-icon { color: inherit !important; }
.mob-card-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
.mob-card-desc { font-size: .82rem; color: #64748b; line-height: 1.55; margin: 0; }

/* ── Verified chip ── */
.mob-verified-chip {
  display: flex; align-items: center; gap: 10px;
  background: #ecfdf5; border: 1px solid #bbf0d3; border-radius: 12px;
  padding: 12px 16px; margin-bottom: 16px; color: #15803d;
}
.mob-verified-icon { color: #16a34a !important; flex-shrink: 0; }
.mob-verified-title { font-weight: 700; font-size: .85rem; margin: 0; }
.mob-verified-sub { font-size: .76rem; opacity: .8; margin: 2px 0 0; }

/* ── Form fields ── */
.mob-form-stack { display: flex; flex-direction: column; gap: 14px; }
.mob-form-field { display: flex; flex-direction: column; gap: 6px; }
.mob-form-label { font-size: .65rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .07em; }
.mob-input-box {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 11px;
  padding: 0 13px; height: 46px;
  transition: border-color .15s, box-shadow .15s;
}
.mob-input-box:focus-within { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.1); }
.mob-input-box--err { border-color: #ef4444; }
.mob-input-icon { color: #94a3b8 !important; flex-shrink: 0; }
.mob-input { flex: 1; border: none; background: transparent; outline: none; font-size: .875rem; color: #1e293b; font-family: 'DM Sans', sans-serif; }
.mob-input::placeholder { color: #94a3b8; }
.mob-field-err { font-size: .72rem; color: #ef4444; }

.mob-info-box {
  display: flex; align-items: flex-start; gap: 8px;
  background: #eef2ff; border: 1px solid #dbe4fd; border-radius: 10px;
  padding: 10px 14px; font-size: .76rem; color: #1e40af; line-height: 1.5;
}
.mob-info-box-icon { color: #1142d4 !important; flex-shrink: 0; margin-top: 1px; }

/* ── Account summary ── */
.mob-account-summary { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; }
.mob-summary-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: .8rem; border-bottom: 1px dashed #eef1f5; }
.mob-summary-row:last-child { border-bottom: none; }
.mob-summary-key { color: #94a3b8; }
.mob-summary-val { font-weight: 700; color: #1e293b; }
.mob-text-green { color: #16a34a !important; }
.mob-text-red { color: #ef4444 !important; }

/* ── Alerts ── */
.mob-alert {
  display: flex; align-items: flex-start; gap: 8px;
  border-radius: 10px; padding: 10px 14px; font-size: .8rem; line-height: 1.5; margin-bottom: 16px;
}
.mob-alert--success { background: #ecfdf5; border: 1px solid #bbf0d3; color: #15803d; }
.mob-alert--warn { background: #fffbeb; border: 1px solid #fde9b8; color: #92400e; }
.mob-alert-icon { flex-shrink: 0; margin-top: 1px; }

/* ── Document category grid ── */
.mob-doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; }
.mob-doc-cat-card {
  background: #fff; border: 1.5px solid #e8edf3; border-radius: 14px; padding: 14px;
  cursor: pointer; transition: border-color .15s, box-shadow .15s;
}
.mob-doc-cat-card:hover { border-color: #c7d2fe; box-shadow: 0 3px 12px rgba(17,66,212,.08); }
.mob-doc-cat-card--done { border-color: #bbf0d3; background: #f4fdf8; }
.mob-doc-cat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.mob-doc-cat-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.mob-doc-cat-icon--done { background: rgba(34,197,94,.14); color: #16a34a; }
.mob-doc-cat-icon--pend { background: #eef2ff; color: #1142d4; }
.mob-doc-cat-chip { font-size: .68rem; font-weight: 800; padding: 3px 8px; border-radius: 999px; }
.mob-doc-cat-chip--done { background: rgba(34,197,94,.14); color: #15803d; }
.mob-doc-cat-chip--pend { background: #eef2ff; color: #1142d4; }
.mob-doc-cat-name { font-size: .8rem; font-weight: 700; color: #0f172a; margin: 0 0 8px; text-transform: capitalize; }
.mob-doc-prog-track { height: 4px; background: #eef1f5; border-radius: 3px; overflow: hidden; margin-bottom: 6px; }
.mob-doc-prog-fill { height: 100%; }
.mob-doc-prog-fill--done { background: #22c55e; }
.mob-doc-prog-fill--pend { background: #1142d4; }
.mob-doc-cat-hint { font-size: .68rem; color: #94a3b8; margin: 0; }

/* ── Doc sub-navigation ── */
.mob-doc-subheader { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.mob-doc-back {
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  background: #eef2ff; border: 1.5px solid #d7e0fb; color: #1142d4;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.mob-doc-sub-title { font-weight: 800; font-size: .9rem; color: #0f172a; margin: 0; text-transform: capitalize; }
.mob-doc-sub-hint { font-size: .74rem; color: #94a3b8; margin: 2px 0 0; }

.mob-doc-item-list { display: flex; flex-direction: column; gap: 10px; }
.mob-doc-item {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 12px 14px;
}
.mob-doc-item--done { border-color: #bbf0d3; background: #f4fdf8; }
.mob-doc-item-text { flex: 1; min-width: 0; }
.mob-doc-item-name { font-size: .82rem; font-weight: 700; color: #0f172a; margin: 0; }
.mob-doc-item-chip { display: inline-block; margin-top: 3px; font-size: .66rem; font-weight: 700; padding: 2px 7px; border-radius: 999px; }
.mob-chip-done { background: rgba(34,197,94,.14); color: #15803d; }
.mob-chip-pend { background: #fef3c7; color: #92400e; }
.mob-doc-item-btn {
  flex-shrink: 0; background: #1142d4; color: #fff; border: none; border-radius: 9px;
  padding: 7px 14px; font-size: .76rem; font-weight: 700; cursor: pointer;
}
.mob-doc-item-btn:disabled { background: #dbe4fd; color: #94a3b8; cursor: not-allowed; }

/* ── File upload ── */
.mob-file-drop {
  border: 1.5px dashed #c7d2fe; border-radius: 12px; padding: 22px 16px; text-align: center;
  cursor: pointer; background: #f8faff; transition: border-color .15s, background .15s;
}
.mob-file-drop:hover { border-color: #1142d4; background: #eef2ff; }
.mob-drop-icon { color: #94a3b8 !important; margin-bottom: 6px; }
.mob-drop-text { font-size: .8rem; font-weight: 600; color: #1e293b; margin: 0; }
.mob-drop-hint { font-size: .7rem; color: #94a3b8; margin: 3px 0 0; }
.mob-file-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.mob-file-chip {
  display: flex; align-items: center; gap: 5px;
  background: #eef2ff; color: #1142d4; border-radius: 999px; padding: 4px 10px; font-size: .72rem; font-weight: 600;
}

.mob-upload-btn, .mob-save-btn {
  width: 100%; margin-top: 10px;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  background: #1142d4; color: #fff; border: none; border-radius: 10px;
  padding: 10px; font-size: .82rem; font-weight: 700; cursor: pointer;
}
.mob-upload-btn:disabled, .mob-save-btn:disabled { background: #dbe4fd; color: #94a3b8; cursor: not-allowed; }
.mob-uploaded-chip {
  display: flex; align-items: center; gap: 6px; color: #16a34a; font-size: .8rem; font-weight: 700;
  background: #ecfdf5; border-radius: 9px; padding: 8px 12px; margin-top: 8px;
}
.mob-locked-hint { display: flex; align-items: center; gap: 6px; font-size: .76rem; color: #94a3b8; margin-top: 6px; }

/* ── Front/back wrap ── */
.mob-aadhaar-wrap { display: flex; flex-direction: column; gap: 16px; }
.mob-aadhaar-step { background: #fff; border: 1.5px solid #e8edf3; border-radius: 14px; padding: 16px; }
.mob-aadhaar-step--active { border-color: #c7d2fe; }
.mob-aadhaar-step--done { border-color: #bbf0d3; background: #f4fdf8; }
.mob-aadhaar-step--locked { opacity: .55; }
.mob-aadhaar-step-label { display: flex; align-items: center; gap: 8px; font-size: .84rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
.mob-aadhaar-finalize { background: #fff; border: 1.5px solid #e8edf3; border-radius: 14px; padding: 16px; }

/* ── PAN prefill ── */
.mob-pan-prefill-block { margin-bottom: 14px; }
.mob-pan-prefill-notice {
  display: flex; align-items: flex-start; gap: 8px;
  background: #eef2ff; border: 1px solid #dbe4fd; border-radius: 10px;
  padding: 10px 14px; font-size: .76rem; color: #1e40af; line-height: 1.5;
}
.mob-pan-prefill-notice p { margin: 0; }
.mob-detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.mob-detail-item { background: #fff; border: 1px solid #e8edf3; border-radius: 10px; padding: 10px 12px; }
.mob-di-key { display: block; font-size: .62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 3px; }
.mob-di-val { font-size: .82rem; font-weight: 700; color: #0f172a; }

/* ── Review list ── */
.mob-review-list { display: flex; flex-direction: column; gap: 10px; }
.mob-review-item {
  display: flex; align-items: center; gap: 12px;
  background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 14px 16px;
}
.mob-review-item--done { border-color: #bbf0d3; background: #f4fdf8; }
.mob-review-icon-wrap { color: #94a3b8; flex-shrink: 0; }
.mob-review-item--done .mob-review-icon-wrap { color: #16a34a; }
.mob-review-info { flex: 1; min-width: 0; }
.mob-review-title { font-size: .84rem; font-weight: 700; color: #0f172a; margin: 0; }
.mob-review-sub { font-size: .74rem; color: #94a3b8; margin: 2px 0 0; }
.mob-review-badge { font-size: .68rem; font-weight: 800; padding: 4px 10px; border-radius: 999px; flex-shrink: 0; }
.mob-badge-done { background: rgba(34,197,94,.14); color: #15803d; }
.mob-badge-pend { background: #fef3c7; color: #92400e; }

/* ── Success ── */
.mob-success-wrap { text-align: center; padding: 20px 8px; }
.mob-success-ring {
  width: 96px; height: 96px; border-radius: 50%; margin: 0 auto 20px;
  background: linear-gradient(135deg, rgba(34,197,94,.1), rgba(34,197,94,.2));
  display: flex; align-items: center; justify-content: center;
}
.mob-success-inner { width: 72px; height: 72px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(34,197,94,.2); }
.mob-success-icon { color: #16a34a !important; }
.mob-success-title { font-size: 1.2rem; font-weight: 800; color: #15803d; margin: 0 0 8px; }
.mob-success-desc { font-size: .84rem; color: #64748b; max-width: 420px; margin: 0 auto 20px; line-height: 1.6; }

.mob-result-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: 18px; }
.mob-result-chip {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 10px 14px;
}
.mob-result-chip-icon { color: #1142d4 !important; }
.mob-result-chip-label { font-size: .64rem; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: .05em; }
.mob-result-chip-val { font-size: .82rem; font-weight: 700; color: #0f172a; margin: 0; }

.mob-complete-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 24px; }
.mob-complete-chip {
  display: flex; align-items: center; gap: 4px;
  background: rgba(34,197,94,.12); color: #15803d; border-radius: 999px;
  padding: 5px 12px; font-size: .72rem; font-weight: 700;
}

.mob-dashboard-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%); color: #fff;
  border: none; border-radius: 12px; padding: 12px 28px;
  font-size: .88rem; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 18px rgba(17,66,212,.3);
}
.mob-dashboard-btn:hover { filter: brightness(1.07); }

/* ── Toast ── */
.mob-toast {
  position: sticky; bottom: 8px; left: 0;
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 10px; font-size: .8rem; font-weight: 600;
  box-shadow: 0 6px 20px rgba(0,0,0,.12); margin-top: 12px;
}
.mob-toast--success { background: #ecfdf5; color: #15803d; border: 1px solid #bbf0d3; }
.mob-toast--error { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

/* ── Action bar ── */
.mob-action-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 22px; background: #fff; border-top: 1px solid #e8edf3;
  position: sticky; bottom: 0;
}
.mob-back-action {
  width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
  background: #eef2ff; border: 1.5px solid #d7e0fb; color: #1142d4;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.mob-primary-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  height: 46px; background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%);
  color: #fff; border: none; border-radius: 12px;
  font-size: .88rem; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17,66,212,.28);
}
.mob-primary-btn:disabled { opacity: .5; cursor: not-allowed; box-shadow: none; }
.mob-primary-btn--green { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); box-shadow: 0 4px 14px rgba(34,197,94,.3); }

.mob-btn-spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  animation: mob-spin .7s linear infinite;
}

/* ── Full-screen overlay ── */
.mob-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.55);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.mob-overlay-card { background: #fff; border-radius: 16px; padding: 28px 32px; text-align: center; max-width: 280px; }
.mob-overlay-spinner {
  width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 14px;
  border: 3px solid #dbe4fd; border-top-color: #1142d4;
  animation: mob-spin .8s linear infinite;
}
.mob-overlay-title { font-weight: 700; color: #0f172a; margin: 0; font-size: .9rem; }
.mob-overlay-sub { font-size: .76rem; color: #94a3b8; margin: 4px 0 0; }

.mob-fade-enter-active, .mob-fade-leave-active { transition: opacity .2s ease; }
.mob-fade-enter-from, .mob-fade-leave-to { opacity: 0; }
</style>
