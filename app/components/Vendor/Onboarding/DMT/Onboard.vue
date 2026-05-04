<template>
  <div class="dmt-root">

    <!-- ── Header ── -->
    <header class="dmt-header">
      <div class="dmt-header__inner">
        <div class="dmt-header__brand">
          <div class="brand-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2"/>
              <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
          </div>
          <span class="brand-title">DMT Onboarding</span>
        </div>
        <div class="dmt-header__right">
          <span class="step-pill">Step {{ step }} / {{ steps.length }}</span>
        </div>
      </div>
    </header>

    <!-- ── Main ── -->
    <main class="dmt-main">
      <div class="dmt-wrapper">

        <!-- ── Stepper ── -->
        <div class="stepper-card">
          <div class="stepper-top">
            <div>
              <p class="stepper-title">{{ steps[step - 1].label }}</p>
              <p class="stepper-sub">{{ steps[step - 1].desc }}</p>
            </div>
            <span class="stepper-badge">{{ step === steps.length ? 'Done' : 'Active' }}</span>
          </div>
          <div class="stepper-track">
            <div class="track-bg"></div>
            <div class="track-fill" :style="{ width: ((step - 1) / (steps.length - 1)) * 100 + '%' }"></div>
            <div v-for="(s, i) in steps" :key="s.key" class="step-node">
              <div :class="['step-circle', step > i + 1 ? 'step-done' : step === i + 1 ? 'step-active' : 'step-idle']">
                <svg v-if="step > i + 1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="s.iconPath"></svg>
              </div>
              <span :class="['step-label', step === i + 1 ? 'step-label--active' : '']">{{ s.label }}</span>
            </div>
          </div>
        </div>

        <!-- ── Step Card ── -->
        <div class="step-card">

          <!-- ════ STEP 1: Verify & Initialize ════ -->
          <template v-if="step === 1">
            <div class="step-body step-body--left">

              <!-- Loading skeleton -->
              <template v-if="fetchingMerchant">
                <div class="skeleton-block">
                  <div class="skel skel--title"></div>
                  <div v-for="n in 8" :key="n" class="skel skel--row" :style="{ width: (n % 2 === 0 ? 70 : 90) + '%' }"></div>
                </div>
              </template>

              <!-- Error -->
              <template v-else-if="initError">
                <div class="err-state">
                  <div class="err-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <p class="err-title">Initialization Failed</p>
                  <p class="err-desc">{{ initErrorMsg }}</p>
                  <button class="btn-retry" @click="retryInit">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                    </svg>
                    Retry
                  </button>
                </div>
              </template>

              <!-- Merchant profile -->
              <template v-else-if="merchantProfile">
                <!-- Merchant Header -->
                <div class="merchant-hd">
                  <div class="merchant-avatar">{{ initials(merchantProfile.merchant_name || merchantProfile.business_name || 'M') }}</div>
                  <div class="merchant-hd__info">
                    <p class="merchant-hd__name">{{ merchantProfile.merchant_name || merchantProfile.business_name || '—' }}</p>
                    <p class="merchant-hd__biz">{{ merchantProfile.business_name || merchantProfile.dba_name || '—' }}</p>
                    <span class="merchant-hd__tag">{{ merchantProfile.business_type || 'DMT' }}</span>
                  </div>
                </div>

                <!-- Notice -->
                <div class="notice-box">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:1px;">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>Review details carefully. Clicking <strong>Verify & Continue</strong> will call the NSDL initialize API to register this merchant for DMT services.</span>
                </div>

                <!-- Business Info -->
                <div class="info-section">
                  <div class="info-section__head">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                    Business Information
                  </div>
                  <div class="info-grid">
                    <div class="info-item"><span class="info-key">DBA Name</span><span class="info-val">{{ merchantProfile.dba_name || '—' }}</span></div>
                    <div class="info-item"><span class="info-key">Business Type</span><span class="info-val">{{ merchantProfile.business_type || '—' }}</span></div>
                    <div class="info-item"><span class="info-key">Nature of Business</span><span class="info-val">{{ merchantProfile.nature_of_business || '—' }}</span></div>
                    <div class="info-item"><span class="info-key">Annual Turnover</span><span class="info-val">{{ merchantProfile.annual_turn_over || '—' }}</span></div>
                    <div class="info-item"><span class="info-key">Date of Birth</span><span class="info-val">{{ merchantProfile.business_dob || formatDate(merchantProfile.dob) || '—' }}</span></div>
                    <div class="info-item"><span class="info-key">Gender</span><span class="info-val">{{ merchantProfile.gender === 'M' ? 'Male' : merchantProfile.gender === 'F' ? 'Female' : merchantProfile.gender || '—' }}</span></div>
                    <div class="info-item"><span class="info-key">Mobile</span><span class="info-val">{{ merchantProfile.primary_mobile || merchantProfile.mobile_no || '—' }}</span></div>
                    <div class="info-item"><span class="info-key">Email</span><span class="info-val">{{ merchantProfile.primary_email_id || '—' }}</span></div>
                  </div>
                </div>

                <!-- Official Address -->
                <div class="info-section" v-if="merchantProfile.official_address || merchantProfile.address1">
                  <div class="info-section__head">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    Official Address
                  </div>
                  <div class="addr-block">
                    <p>{{ [merchantProfile.official_address, merchantProfile.address1, merchantProfile.address2, merchantProfile.address3].filter(Boolean).join(', ') }}</p>
                    <p>{{ [merchantProfile.city, merchantProfile.state].filter(Boolean).join(', ') }} {{ merchantProfile.pincode ? '– ' + merchantProfile.pincode : '' }}</p>
                  </div>
                </div>

                <!-- Confirm -->
                <label class="confirm-row">
                  <input type="checkbox" v-model="detailsConfirmed" class="confirm-check"/>
                  <span class="confirm-text">I have reviewed the above details and confirm they are correct. Proceeding will initialize DMT registration with NSDL.</span>
                </label>
              </template>

              <!-- No merchant -->
              <template v-else>
                <div class="err-state">
                  <div class="err-icon" style="background:#fef3c7; border-color:#fde68a; color:#d97706;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <p class="err-title">No Merchant Found</p>
                  <p class="err-desc">Could not load the merchant profile. Ensure a valid merchant ID is provided.</p>
                </div>
              </template>
            </div>
          </template>

          <!-- ════ STEP 2: Agent Registration ════ -->
          <template v-else-if="step === 2">
            <div class="step-body step-body--left">
              <div class="step2-header">
                <div class="step2-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <p class="step2-title">Agent Registration</p>
                  <p class="step2-sub">Complete the form below to register this merchant as a DMT agent with NSDL.</p>
                </div>
              </div>

              <div class="form-grid">

                <!-- Name -->
                <div class="form-field">
                  <label class="form-label">First Name <span class="req">*</span></label>
                  <div :class="['form-input-wrap', formErrors.name ? 'form-input-wrap--err' : '']">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="field-icon">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input v-model="agentForm.name" type="text" placeholder="e.g. John Snow" class="form-input" @input="formErrors.name = ''" />
                  </div>
                  <span v-if="formErrors.name" class="form-err-msg">{{ formErrors.name }}</span>
                </div>

                <!-- Last Name -->
                <div class="form-field">
                  <label class="form-label">Last Name <span class="req">*</span></label>
                  <div :class="['form-input-wrap', formErrors.lastname ? 'form-input-wrap--err' : '']">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="field-icon">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <input v-model="agentForm.lastname" type="text" placeholder="e.g. Parker Snow" class="form-input" @input="formErrors.lastname = ''" />
                  </div>
                  <span v-if="formErrors.lastname" class="form-err-msg">{{ formErrors.lastname }}</span>
                </div>

                <!-- PAN Card -->
                <div class="form-field">
                  <label class="form-label">PAN Card <span class="req">*</span></label>
                  <div :class="['form-input-wrap', formErrors.pancard ? 'form-input-wrap--err' : '']">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="field-icon">
                      <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
                    </svg>
                    <input v-model="agentForm.pancard" type="text" placeholder="ABCDE1234F" class="form-input font-mono" maxlength="10" @input="agentForm.pancard = agentForm.pancard.toUpperCase(); formErrors.pancard = ''" />
                  </div>
                  <span v-if="formErrors.pancard" class="form-err-msg">{{ formErrors.pancard }}</span>
                </div>


              </div>
            </div>
          </template>

          <!-- ════ STEP 3: Complete ════ -->
          <template v-else-if="step === 3">
            <div class="step-body">
              <div class="success-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 class="success-title">DMT Onboarding Complete!</h2>
              <p class="success-desc">This merchant has been successfully registered as a DMT agent with NSDL. All services are now active.</p>

              <div class="success-chips">
                <div class="s-chip">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Initialized
                </div>
                <div class="s-chip">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Agent Registered
                </div>
                <div class="s-chip">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  NSDL Confirmed
                </div>
              </div>

              <!-- Agent detail response -->
              <div v-if="agentResult" class="result-card">
                <div class="result-card__head">Agent Registration Response</div>
                <div class="result-grid">
                  <template v-for="(val, key) in flatResult" :key="key">
                    <span class="result-key">{{ key }}</span>
                    <span class="result-val">{{ val }}</span>
                  </template>
                </div>
              </div>

              <div class="success-actions">
                <button class="btn-dashboard" @click="goToDashboard">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
                  </svg>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </template>

          <!-- ── Footer ── -->
          <div class="step-footer" v-if="step < 3">
            <button v-if="step > 1" class="btn-back" @click="step--">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <div class="footer-right">
              <button
                v-if="step === 1"
                class="btn-continue"
                :disabled="loading || fetchingMerchant || !detailsConfirmed || initError"
                @click="handleStep1"
              >
                <span v-if="loading" class="spin"></span>
                <template v-else>
                  Verify &amp; Continue
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </template>
              </button>
              <button
                v-else-if="step === 2"
                class="btn-continue"
                :disabled="loading"
                @click="handleStep2"
              >
                <span v-if="loading" class="spin"></span>
                <template v-else>
                  Register Agent
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </template>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Info cards ── -->
        <div class="info-cards">
          <div class="info-card">
            <div class="info-card__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div>
              <p class="info-card__title">Required Documents</p>
              <p class="info-card__desc">Keep the merchant's PAN card handy for agent registration.</p>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
            </div>
            <div>
              <p class="info-card__title">Secure Processing</p>
              <p class="info-card__desc">All registration data is securely transmitted to NSDL servers.</p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- ── Footer ── -->
    <footer class="dmt-footer">
      <span>© {{ new Date().getFullYear() }} Merchant Portal. All rights reserved.</span>
      <span class="footer-sep">•</span>
      <a href="#" class="footer-link">Privacy Policy</a>
    </footer>

    <!-- ── Processing overlay ── -->
    <Transition name="fade">
      <div v-if="loading" class="proc-overlay">
        <div class="proc-card">
          <div class="proc-spin"></div>
          <p class="proc-title">{{ processingMsg }}</p>
          <p class="proc-sub">Please wait, do not close this page</p>
        </div>
      </div>
    </Transition>

    <!-- ── Snackbar ── -->
    <Transition name="snack">
      <div v-if="snackbar.show" :class="['snackbar', snackbar.color === 'success' ? 'snackbar--ok' : 'snackbar--err']">
        <svg v-if="snackbar.color === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ snackbar.message }}</span>
        <button class="snackbar__close" @click="snackbar.show = false">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboadingApi } from '~/composables/apis/useOnboadingApi'
import { useDmtBcApi } from '~/composables/apis/useDmtBcApi'

const props = defineProps({ merchantId: String })
const router = useRouter()

const { getMerchantForOnboarding } = useOnboadingApi()
const { dmtAgentInitialize, dmtAgentRegister } = useDmtBcApi()

// ── Steps ──────────────────────────────────────────
const steps = [
  {
    key: 'verify',
    label: 'Verify Details',
    desc: 'Review merchant profile and initialize DMT',
    iconPath: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
  },
  {
    key: 'register',
    label: 'Agent Registration',
    desc: 'Provide PAN and service details',
    iconPath: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>'
  },
  {
    key: 'complete',
    label: 'Complete',
    desc: 'Onboarding finalized',
    iconPath: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
  }
]

// ── State ──────────────────────────────────────────
const step             = ref(1)
const loading          = ref(false)
const processingMsg    = ref('Processing...')
const fetchingMerchant = ref(true)
const merchantProfile  = ref(null)
const detailsConfirmed = ref(false)
const initError        = ref(false)
const initErrorMsg     = ref('')
const agentResult      = ref(null)

const snackbar = reactive({ show: false, message: '', color: 'success' })

const agentForm = reactive({
  name:        '',
  lastname:    '',
  pancard:     '',
  dmt:         1,
  aeps:        0,
  cardpin:     0,
  accountopen: 0,
})

const formErrors = reactive({
  name:     '',
  lastname: '',
  pancard:  '',
})

// ── Computed ───────────────────────────────────────
const flatResult = computed(() => {
  if (!agentResult.value) return {}
  const flatten = (obj, prefix = '') =>
    Object.entries(obj).reduce((acc, [k, v]) => {
      const key = prefix ? `${prefix}.${k}` : k
      if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flatten(v, key))
      else acc[key] = v
      return acc
    }, {})
  return flatten(agentResult.value)
})

// ── Helpers ────────────────────────────────────────
function showSnack(msg, color = 'success') {
  snackbar.message = msg
  snackbar.color   = color
  snackbar.show    = true
  setTimeout(() => { snackbar.show = false }, 4000)
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
}

function formatDate(d) {
  if (!d) return null
  const dt = new Date(d)
  if (isNaN(dt)) return null
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`
}

function goToDashboard() {
  router.push('/vendor/merchants')
}

function retryInit() {
  initError.value = false
  handleStep1()
}

// ── Step 1: Load merchant + call /agent/initialize ─
async function handleStep1() {
  if (!detailsConfirmed.value) {
    showSnack('Please confirm you have reviewed the details', 'error')
    return
  }
  loading.value       = true
  processingMsg.value = 'Initializing DMT registration with NSDL...'

  try {
    const res = await dmtAgentInitialize({ merchantId: props.merchantId })

    const ok = res?.statusCode === '00' || res?.merchantId

    if (ok) {
      showSnack(res?.message || 'DMT service initialized successfully!', 'success')
      // Pre-fill name from merchant profile if available
      if (merchantProfile.value) {
        const fullName = (merchantProfile.value.merchant_name || merchantProfile.value.business_name || '').split(' ')
        agentForm.name     = agentForm.name     || fullName[0] || ''
        agentForm.lastname = agentForm.lastname || fullName.slice(1).join(' ') || ''
      }
      step.value = 2
    } else {
      initError.value    = true
      initErrorMsg.value = res?.message || 'Failed to initialize DMT. Please retry.'
      showSnack(initErrorMsg.value, 'error')
    }
  } catch (e) {
    initError.value    = true
    initErrorMsg.value = 'Network error. Please check your connection and retry.'
    showSnack('Connection failed. Please retry.', 'error')
  } finally {
    loading.value = false
  }
}

// ── Step 2: Agent registration ─────────────────────
function validateAgentForm() {
  let valid = true
  if (!agentForm.name.trim()) { formErrors.name = 'First name is required'; valid = false }
  if (!agentForm.lastname.trim()) { formErrors.lastname = 'Last name is required'; valid = false }
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/
  if (!agentForm.pancard.trim()) {
    formErrors.pancard = 'PAN card is required'; valid = false
  } else if (!panRegex.test(agentForm.pancard.toUpperCase())) {
    formErrors.pancard = 'Enter a valid PAN (e.g. ABCDE1234F)'; valid = false
  }
  return valid
}

async function handleStep2() {
  if (!validateAgentForm()) {
    showSnack('Please fix the errors above', 'error')
    return
  }

  loading.value       = true
  processingMsg.value = 'Registering agent with NSDL...'

  try {
    const payload = {
      merchantId:  props.merchantId,
      name:        agentForm.name.trim(),
      lastname:    agentForm.lastname.trim(),
      pancard:     agentForm.pancard.trim().toUpperCase(),
      dmt:         agentForm.dmt,
      aeps:        agentForm.aeps,
      cardpin:     agentForm.cardpin,
      accountopen: agentForm.accountopen,
    }

    const res = await dmtAgentRegister(payload)

    const ok = res?.statusCode === '00'

    if (ok) {
      agentResult.value = res?.data || res
      showSnack(res?.message || 'Agent registered successfully!', 'success')
      step.value = 3
    } else {
      showSnack(res?.data?.message || res?.message || 'Agent registration failed. Please retry.', 'error')
    }
  } catch (e) {
    showSnack('Registration failed. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

// ── Mount ──────────────────────────────────────────
onMounted(async () => {
  if (!props.merchantId) {
    fetchingMerchant.value = false
    return
  }
  try {
    const res = await getMerchantForOnboarding(props.merchantId)
    if (res?.statusCode === '00' && res?.data) {
      merchantProfile.value = res.data
    } else {
      showSnack('Failed to load merchant details', 'error')
    }
  } catch {
    showSnack('Could not fetch merchant profile', 'error')
  } finally {
    fetchingMerchant.value = false
  }
})
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dmt-root {
  font-family: 'DM Sans', 'Inter', 'Segoe UI', sans-serif;
  background: #f1f5f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #0f172a;
  padding-bottom: 60px;
}

/* ── Header ─────────────────────────────────── */
.dmt-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #0f172a;
  border-bottom: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
}
.dmt-header__inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 13px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dmt-header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-icon {
  width: 34px;
  height: 34px;
  background: rgba(255,255,255,.1);
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: #fff;
  flex-shrink: 0;
}
.brand-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -.2px;
}
.step-pill {
  font-size: 10.5px;
  font-weight: 700;
  color: rgba(255,255,255,.85);
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.15);
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

/* ── Main ────────────────────────────────────── */
.dmt-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 0;
}
.dmt-wrapper {
  width: 100%;
  max-width: 860px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ── Stepper ─────────────────────────────────── */
.stepper-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 22px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.stepper-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 8px;
}
.stepper-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.stepper-sub {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 2px;
}
.stepper-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .5px;
  background: #e0e7ff;
  color: #4338ca;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}
.stepper-track {
  position: relative;
  display: flex;
  align-items: flex-start;
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
  background: #0f172a;
  border-radius: 4px;
  z-index: 1;
  transition: width .45s ease;
}
.step-node {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}
.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: all .25s;
}
.step-active {
  background: #0f172a;
  color: #fff;
  box-shadow: 0 4px 14px rgba(15,23,42,.28);
}
.step-done {
  background: #0f172a;
  color: #fff;
}
.step-idle {
  background: #f1f5f9;
  color: #94a3b8;
}
.step-label {
  font-size: 10.5px;
  font-weight: 500;
  color: #94a3b8;
  text-align: center;
  line-height: 1.3;
}
.step-label--active {
  color: #0f172a;
  font-weight: 700;
}

/* ── Step Card ───────────────────────────────── */
.step-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,.06);
  overflow: hidden;
}

.step-body {
  padding: 28px 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
}
.step-body--left {
  align-items: stretch;
  text-align: left;
}

/* ── Skeleton ────────────────────────────────── */
.skeleton-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}
.skel {
  height: 13px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skel--title { height: 18px; width: 50%; }
@keyframes shimmer { to { background-position: -200% 0; } }

/* ── Error state ─────────────────────────────── */
.err-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  text-align: center;
}
.err-icon {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #fff1f2;
  border: 1.5px solid #fecdd3;
  color: #e11d48;
  display: grid;
  place-items: center;
}
.err-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}
.err-desc {
  font-size: 13px;
  color: #64748b;
  max-width: 320px;
  line-height: 1.5;
}
.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity .15s;
}
.btn-retry:hover { opacity: .85; }

/* ── Merchant header ─────────────────────────── */
.merchant-hd {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  margin-bottom: 16px;
}
.merchant-avatar {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
}
.merchant-hd__info { min-width: 0; flex: 1; }
.merchant-hd__name { font-size: 15px; font-weight: 700; color: #0f172a; }
.merchant-hd__biz  { font-size: 12px; color: #64748b; margin-top: 1px; }
.merchant-hd__tag  {
  display: inline-block;
  margin-top: 5px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .5px;
  background: #e0e7ff;
  color: #4338ca;
  padding: 2px 8px;
  border-radius: 20px;
}

/* ── Notice ──────────────────────────────────── */
.notice-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 13px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  font-size: 12.5px;
  color: #92400e;
  line-height: 1.55;
  margin-bottom: 18px;
}

/* ── Info sections ───────────────────────────── */
.info-section {
  margin-bottom: 16px;
}
.info-section__head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .7px;
  color: #0f172a;
  margin-bottom: 10px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}
.info-key {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: .6px;
}
.info-val {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  word-break: break-word;
}
.addr-block {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  color: #334155;
  line-height: 1.7;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ── Confirm checkbox ────────────────────────── */
.confirm-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 13px 15px;
  background: #eff6ff;
  border: 1.5px solid rgba(59,130,246,.2);
  border-radius: 10px;
  cursor: pointer;
  margin-top: 4px;
}
.confirm-check {
  width: 15px;
  height: 15px;
  accent-color: #0f172a;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
}
.confirm-text {
  font-size: 12.5px;
  color: #1e40af;
  line-height: 1.55;
  font-weight: 500;
}

/* ── Step 2 header ───────────────────────────── */
.step2-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  margin-bottom: 22px;
}
.step2-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.step2-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.step2-sub   { font-size: 12px; color: #64748b; margin-top: 3px; line-height: 1.5; }

/* ── Form ────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 20px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-field--empty { display: none; }
.form-field--full  { grid-column: 1 / -1; }
.form-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: #64748b;
}
.req { color: #ef4444; margin-left: 2px; }
.form-input-wrap {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  overflow: hidden;
  transition: border-color .15s, box-shadow .15s;
}
.form-input-wrap:focus-within {
  border-color: #0f172a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(15,23,42,.08);
}
.form-input-wrap--err {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,.1) !important;
}
.field-icon {
  flex-shrink: 0;
  color: #94a3b8;
  padding: 0 0 0 12px;
}
.form-input-wrap:focus-within .field-icon { color: #0f172a; }
.form-input {
  flex: 1;
  padding: 10px 12px;
  font-size: 13.5px;
  color: #0f172a;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
}
.form-input::placeholder { color: #cbd5e1; }
.font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; letter-spacing: .5px; }
.form-err-msg { font-size: 11px; color: #ef4444; font-weight: 600; }

/* ── Success step ────────────────────────────── */
.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #d1fae5;
  color: #059669;
  display: grid;
  place-items: center;
  margin-bottom: 16px;
}
.success-title { font-size: 22px; font-weight: 700; color: #059669; margin-bottom: 10px; }
.success-desc  { font-size: 13.5px; color: #64748b; max-width: 420px; line-height: 1.6; margin-bottom: 18px; }
.success-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 22px; }
.s-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  background: #d1fae5;
  color: #065f46;
  border: 1px solid rgba(5,150,105,.2);
}
.result-card {
  width: 100%;
  max-width: 480px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
  overflow: hidden;
  margin-bottom: 22px;
}
.result-card__head {
  padding: 10px 14px;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .6px;
  color: #64748b;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}
.result-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0;
  font-size: 12.5px;
}
.result-key, .result-val {
  padding: 8px 14px;
  border-bottom: 1px solid #f1f5f9;
}
.result-key { font-weight: 600; color: #94a3b8; white-space: nowrap; }
.result-val { color: #0f172a; word-break: break-all; }
.success-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.btn-dashboard {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity .15s;
}
.btn-dashboard:hover { opacity: .85; }

/* ── Footer ──────────────────────────────────── */
.step-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 22px;
  border-top: 1px solid #f1f5f9;
  background: #fafafa;
  gap: 10px;
}
.footer-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 9px 16px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s;
}
.btn-back:hover { background: #f1f5f9; }
.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 14px rgba(15,23,42,.25);
  transition: opacity .15s;
}
.btn-continue:hover:not(:disabled) { opacity: .88; }
.btn-continue:disabled { opacity: .45; cursor: not-allowed; }

/* ── Info cards ───────────────────────────────── */
.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.info-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 12px;
}
.info-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #f1f5f9;
  color: #0f172a;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.info-card__title { font-size: 13px; font-weight: 700; color: #0f172a; }
.info-card__desc  { font-size: 12px; color: #64748b; margin-top: 3px; line-height: 1.5; }

/* ── Footer bar ───────────────────────────────── */
.dmt-footer {
  padding: 20px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
.footer-sep { color: #cbd5e1; }
.footer-link { color: #94a3b8; text-decoration: underline; }
.footer-link:hover { color: #475569; }

/* ── Spinner ──────────────────────────────────── */
.spin {
  display: block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  flex-shrink: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Processing overlay ───────────────────────── */
.proc-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.5);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 9998;
}
.proc-card {
  background: #fff;
  border-radius: 14px;
  padding: 36px 44px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
}
.proc-spin {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin .8s linear infinite;
  margin: 0 auto 18px;
}
.proc-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.proc-sub   { font-size: 12px; color: #64748b; margin-top: 5px; }
.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Snackbar ─────────────────────────────────── */
.snackbar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 16px;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  max-width: calc(100vw - 40px);
  z-index: 9999;
  box-shadow: 0 6px 24px rgba(0,0,0,.14);
}
.snackbar--ok  { background: #059669; }
.snackbar--err { background: #ef4444; }
.snackbar__close {
  background: none;
  border: none;
  color: rgba(255,255,255,.8);
  cursor: pointer;
  padding: 2px;
  margin-left: 2px;
}
.snack-enter-active, .snack-leave-active { transition: all .3s ease; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translateY(8px); }

/* ══════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════ */
@media (max-width: 640px) {
  .dmt-header__inner { padding: 10px 14px; }
  .brand-title { font-size: 14px; }
  .dmt-main { padding: 14px 12px 0; }
  .dmt-wrapper { gap: 12px; }

  /* Stepper */
  .stepper-card { padding: 14px 14px; }
  .stepper-title { font-size: 13px; }
  .step-circle { width: 34px; height: 34px; }
  .step-label { font-size: 9.5px; }

  /* Step card */
  .step-body { padding: 18px 14px 14px; }
  .step-body--left { padding: 16px 14px 12px; }

  /* Info grid: 1 col on small screens */
  .info-grid { grid-template-columns: 1fr; }

  /* Form grid: 1 col */
  .form-grid { grid-template-columns: 1fr; }
  .form-field--empty { display: none; }

  /* Info cards: 1 col */
  .info-cards { grid-template-columns: 1fr; }

  /* Footer */
  .step-footer { flex-wrap: wrap; padding: 12px 14px; }
  .footer-right { width: 100%; }
  .btn-continue { width: 100%; justify-content: center; }

  /* Snackbar */
  .snackbar { bottom: 14px; right: 12px; left: 12px; }
}

@media (max-width: 380px) {
  .step-circle { width: 30px; height: 30px; }
  .step-label { display: none; }
}
</style>