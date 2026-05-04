<template>
  <div class="page-root">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">{{ merchant?.legal_name || 'Manage your account preferences' }}</p>
      </div>
      <div class="vendor-status-badge" v-if="merchant">
        <span class="status-dot"></span>
        <span>{{ merchant?.status ? 'Active Account' : 'Inactive' }}</span>
      </div>
    </div>

    <!-- ── Tab Nav ── -->
    <div class="tab-nav">
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'merchant' }" @click="tab = 'merchant'">
        <span class="mdi mdi-store-outline tab-icon"></span>
        Merchant
      </button>
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'terminals' }" @click="tab = 'terminals'">
        <span class="mdi mdi-devices tab-icon"></span>
        Terminals
      </button>
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'account' }" @click="tab = 'account'">
        <span class="mdi mdi-file-account-outline tab-icon"></span>
        Account KYC
      </button>
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'reset' }" @click="tab = 'reset'">
        <span class="mdi mdi-lock-reset tab-icon"></span>
        Reset Password
      </button>
    </div>

    <!-- ══════════════ MERCHANT TAB ══════════════ -->
    <div v-if="tab === 'merchant'" class="tab-pane">
      <div class="settings-grid">

        <!-- Profile Card -->
        <div class="profile-card">
          <template v-if="merchant">
            <div class="profile-avatar-wrap">
              <div class="profile-avatar">{{ initials(merchant.legal_name) }}</div>
              <div class="profile-online-ring" :class="merchant.status ? '' : 'ring-inactive'"></div>
            </div>
            <div class="profile-name">{{ merchant.legal_name }}</div>
            <div class="profile-email">{{ merchant.data?.primary_email_id }}</div>
            <div class="profile-chip">
              <span class="mdi mdi-identifier"></span>
              {{ merchant.mid }}
            </div>
            <div class="profile-rate-chip" :class="merchant.status ? 'chip-green-pill' : 'chip-red-pill'">
              <span class="mdi" :class="merchant.status ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"></span>
              {{ merchant.status ? 'Active' : 'Inactive' }}
            </div>
          </template>
          <template v-else>
            <div class="skel skel-avatar-lg"></div>
            <div class="skel skel-line-md mt-3"></div>
            <div class="skel skel-line-sm mt-2"></div>
            <div class="skel skel-line-sm mt-2"></div>
          </template>
        </div>

        <!-- Info Details Card -->
        <div class="info-card">
          <div class="info-card-header">
            <h2 class="info-card-title">Account Details</h2>
            <span class="info-card-badge">Read Only</span>
          </div>

          <template v-if="merchant">
            <div class="info-rows">

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-identifier"></span></div>
                  <span class="info-row-label">Merchant ID (MID)</span>
                </div>
                <div class="info-row-value">
                  <span class="mono-val">{{ merchant.mid }}</span>
                  <button class="copy-btn" @click="copy(merchant.mid)">
                    <span class="mdi" :class="copied === merchant.mid ? 'mdi-check' : 'mdi-content-copy'"></span>
                  </button>
                </div>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-key-outline"></span></div>
                  <span class="info-row-label">App ID</span>
                </div>
                <div class="info-row-value">
                  <span class="mono-val mono-val-truncate">{{ merchant.appid }}</span>
                  <button class="copy-btn" @click="copy(merchant.appid)">
                    <span class="mdi" :class="copied === merchant.appid ? 'mdi-check' : 'mdi-content-copy'"></span>
                  </button>
                </div>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-account-outline"></span></div>
                  <span class="info-row-label">Legal Name</span>
                </div>
                <span class="info-row-value info-row-value-plain">{{ merchant.legal_name }}</span>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-store-outline"></span></div>
                  <span class="info-row-label">DBA Name</span>
                </div>
                <span class="info-row-value info-row-value-plain">{{ merchant.data?.dba_name || '—' }}</span>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-email-outline"></span></div>
                  <span class="info-row-label">Email</span>
                </div>
                <div class="info-row-value">
                  <span class="info-text">{{ merchant.data?.primary_email_id }}</span>
                  <button class="copy-btn" @click="copy(merchant.data?.primary_email_id)">
                    <span class="mdi" :class="copied === merchant.data?.primary_email_id ? 'mdi-check' : 'mdi-content-copy'"></span>
                  </button>
                </div>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-phone-outline"></span></div>
                  <span class="info-row-label">Mobile</span>
                </div>
                <span class="info-row-value info-row-value-plain">{{ merchant.data?.primary_mobile }}</span>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-flag-outline"></span></div>
                  <span class="info-row-label">Risk Flag</span>
                </div>
                <span class="info-row-value">
                  <span class="rate-badge">{{ merchant.riskflag || '—' }}</span>
                </span>
              </div>

              <div class="info-row" style="border-bottom:none">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-note-text-outline"></span></div>
                  <span class="info-row-label">Remarks</span>
                </div>
                <span class="info-row-value info-row-value-plain">{{ merchant.remarks ?? '—' }}</span>
              </div>

            </div>
          </template>
          <template v-else>
            <div class="info-rows">
              <div class="info-row" v-for="i in 8" :key="i" :style="i === 8 ? 'border-bottom:none' : ''">
                <div class="skel skel-line-icon"></div>
                <div class="skel skel-line-md"></div>
                <div class="skel skel-line-val"></div>
              </div>
            </div>
          </template>
        </div>

      </div>
    </div>

    <!-- ══════════════ TERMINALS TAB ══════════════ -->
    <div v-if="tab === 'terminals'" class="tab-pane">
      <div class="table-card">
        <div class="table-card-header">
          <div class="table-card-title-wrap">
            <div class="table-card-icon"><span class="mdi mdi-devices"></span></div>
            <h2 class="table-card-title">Terminals</h2>
          </div>
          <span class="info-card-badge">{{ terminals.length }} total</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>TID</th>
                <th>VPA</th>
                <th class="th-hide-sm">Channel</th>
                <th class="th-hide-sm">Type</th>
                <th class="th-hide-md">Interface Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody v-if="loadingTerminals">
              <tr v-for="n in 3" :key="n" class="skel-row">
                <td><div class="skel skel-line-md"></div></td>
                <td><div class="skel skel-line-lg"></div></td>
                <td class="th-hide-sm"><div class="skel skel-chip"></div></td>
                <td class="th-hide-sm"><div class="skel skel-chip"></div></td>
                <td class="th-hide-md"><div class="skel skel-line-md"></div></td>
                <td><div class="skel skel-chip"></div></td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="item in terminals" :key="item.tid" class="data-row">
                <td><span class="mono-val">{{ item.tid }}</span></td>
                <td><span class="mono-val">{{ item.vpa }}</span></td>
                <td class="th-hide-sm">
                  <span class="chip chip-blue">{{ item.interface || '—' }}</span>
                </td>
                <td class="th-hide-sm">
                  <span class="chip chip-purple">{{ item.type?.toUpperCase() }}</span>
                </td>
                <td class="th-hide-md">
                  <span class="info-text">{{ item.interfaceType || '—' }}</span>
                </td>
                <td>
                  <span class="chip" :class="item.status ? 'chip-green' : 'chip-red'">
                    <span class="chip-dot"></span>
                    {{ item.status ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>
              <tr v-if="terminals.length === 0">
                <td colspan="6" class="empty-td">
                  <div class="empty-state">
                    <div class="empty-icon"><span class="mdi mdi-devices"></span></div>
                    <p class="empty-title">No terminals found</p>
                    <p class="empty-desc">Your terminal devices will appear here once configured</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ══════════════ ACCOUNT KYC TAB ══════════════ -->
    <div v-if="tab === 'account'" class="tab-pane">
      <div class="kyc-grid">

        <!-- Business Details -->
        <div class="info-card kyc-full">
          <div class="info-card-header">
            <div class="info-card-title-wrap">
              <div class="info-row-icon"><span class="mdi mdi-domain"></span></div>
              <h2 class="info-card-title">Business Details</h2>
            </div>
          </div>
          <div class="info-rows">
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-office-building-outline"></span></div><span class="info-row-label">Name</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.business?.name || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-briefcase-outline"></span></div><span class="info-row-label">Business Type</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.business?.type || '—' }}</span>
            </div>
            <div class="info-row" style="border-bottom:none">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-tag-outline"></span></div><span class="info-row-label">MCC</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.business?.mcc || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- PAN Details -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="info-card-title-wrap">
              <div class="info-row-icon"><span class="mdi mdi-card-account-details-outline"></span></div>
              <h2 class="info-card-title">PAN Details</h2>
            </div>
          </div>
          <div class="info-rows">
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-numeric"></span></div><span class="info-row-label">PAN</span></div>
              <span class="mono-val">{{ account?.pan?.pan || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-account-outline"></span></div><span class="info-row-label">PAN Name</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.pan?.pan_name || '—' }}</span>
            </div>
            <div class="info-row" style="border-bottom:none">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-domain"></span></div><span class="info-row-label">Entity PAN</span></div>
              <span class="mono-val">{{ account?.pan?.entity_pan || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- GST Details -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="info-card-title-wrap">
              <div class="info-row-icon"><span class="mdi mdi-receipt-outline"></span></div>
              <h2 class="info-card-title">GST Details</h2>
            </div>
          </div>
          <div class="info-rows">
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-numeric"></span></div><span class="info-row-label">GSTIN</span></div>
              <span class="mono-val">{{ account?.gst?.gstin || '—' }}</span>
            </div>
            <div class="info-row" style="border-bottom:none">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-office-building-outline"></span></div><span class="info-row-label">Business Name</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.gst?.business_name || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Settlement Account -->
        <div class="info-card">
          <div class="info-card-header">
            <div class="info-card-title-wrap">
              <div class="info-row-icon"><span class="mdi mdi-bank-outline"></span></div>
              <h2 class="info-card-title">Settlement Account</h2>
            </div>
          </div>
          <div class="info-rows">
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-account-outline"></span></div><span class="info-row-label">Account Holder</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.settlement?.account_holder_name || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-bank-outline"></span></div><span class="info-row-label">Account Type</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.settlement?.account_type || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-numeric"></span></div><span class="info-row-label">Account Number</span></div>
              <span class="mono-val">{{ account?.settlement?.bank_account_no || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-bank"></span></div><span class="info-row-label">Bank</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.settlement?.bank_name || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-transit-connection-variant"></span></div><span class="info-row-label">IFSC</span></div>
              <span class="mono-val">{{ account?.settlement?.bank_ifsc_code || '—' }}</span>
            </div>
            <div class="info-row" style="border-bottom:none">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-map-marker-outline"></span></div><span class="info-row-label">City</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.settlement?.city || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="info-card kyc-full">
          <div class="info-card-header">
            <div class="info-card-title-wrap">
              <div class="info-row-icon"><span class="mdi mdi-map-marker-outline"></span></div>
              <h2 class="info-card-title">Address</h2>
            </div>
          </div>
          <div class="info-rows">
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-home-outline"></span></div><span class="info-row-label">Official Address</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.address?.official_address || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-city-variant-outline"></span></div><span class="info-row-label">City</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.address?.city || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-map-outline"></span></div><span class="info-row-label">State</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.address?.state || '—' }}</span>
            </div>
            <div class="info-row">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-mailbox-outline"></span></div><span class="info-row-label">Pincode</span></div>
              <span class="mono-val">{{ account?.address?.pincode || '—' }}</span>
            </div>
            <div class="info-row" style="border-bottom:none">
              <div class="info-row-left"><div class="info-row-icon"><span class="mdi mdi-web"></span></div><span class="info-row-label">Website</span></div>
              <span class="info-row-value info-row-value-plain">{{ account?.address?.website || '—' }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══════════════ RESET PASSWORD TAB ══════════════ -->
    <div v-if="tab === 'reset'" class="tab-pane">
      <div class="reset-outer">

        <!-- Reset Form Card -->
        <div class="reset-card">
          <div class="reset-card-header">
            <div class="reset-header-icon">
              <span class="mdi mdi-lock-reset"></span>
            </div>
            <h2 class="reset-title">Reset Password</h2>
            <p class="reset-sub">Enter your old password and set a new one.</p>
          </div>

          <!-- Alert -->
          <transition name="t-alert">
            <div v-if="showAlert" class="alert-box" :class="alertType === 'success' ? 'alert-success' : 'alert-error'">
              <span class="mdi alert-icon" :class="alertType === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
              <span class="alert-msg">{{ alertMessage }}</span>
              <button class="alert-close" @click="showAlert = false"><span class="mdi mdi-close"></span></button>
            </div>
          </transition>

          <!-- Form -->
          <div class="reset-form">

            <div class="form-field">
              <label class="form-label">Current Password</label>
              <div class="password-wrap" :class="{ focused: focuses.old }">
                <span class="mdi mdi-lock-outline pw-icon"></span>
                <input v-model="oldPassword" :type="show.old ? 'text' : 'password'" class="pw-input" placeholder="Enter old password" @focus="focuses.old = true" @blur="focuses.old = false" />
                <button class="pw-toggle" @click="show.old = !show.old" tabindex="-1">
                  <span class="mdi" :class="show.old ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                </button>
              </div>
            </div>

            <div class="form-field">
              <label class="form-label">New Password</label>
              <div class="password-wrap" :class="{ focused: focuses.new }">
                <span class="mdi mdi-lock-plus-outline pw-icon"></span>
                <input v-model="newPassword" :type="show.new ? 'text' : 'password'" class="pw-input" placeholder="Minimum 6 characters" @focus="focuses.new = true" @blur="focuses.new = false" />
                <button class="pw-toggle" @click="show.new = !show.new" tabindex="-1">
                  <span class="mdi" :class="show.new ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                </button>
              </div>
              <div v-if="newPassword" class="strength-wrap">
                <div class="strength-bar">
                  <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPct + '%' }"></div>
                </div>
                <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
              </div>
            </div>

            <div class="form-field">
              <label class="form-label">Confirm New Password</label>
              <div class="password-wrap"
                :class="{
                  focused: focuses.confirm,
                  'pw-error':   confirmPassword && newPassword !== confirmPassword,
                  'pw-success': confirmPassword && newPassword === confirmPassword && newPassword.length >= 6,
                }">
                <span class="mdi mdi-lock-check-outline pw-icon"></span>
                <input v-model="confirmPassword" :type="show.confirm ? 'text' : 'password'" class="pw-input" placeholder="Re-enter new password" @focus="focuses.confirm = true" @blur="focuses.confirm = false" />
                <span v-if="confirmPassword && newPassword === confirmPassword && newPassword.length >= 6" class="mdi mdi-check-circle pw-check"></span>
                <button class="pw-toggle" @click="show.confirm = !show.confirm" tabindex="-1">
                  <span class="mdi" :class="show.confirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                </button>
              </div>
              <p v-if="confirmPassword && newPassword !== confirmPassword" class="field-error">
                <span class="mdi mdi-alert-circle-outline"></span> Passwords do not match
              </p>
            </div>

            <button class="btn-reset" :disabled="!canSubmit || resetting" @click="handleReset">
              <span v-if="resetting" class="btn-spinner"></span>
              <span v-else class="mdi mdi-lock-reset"></span>
              {{ resetting ? 'Resetting…' : 'Reset Password' }}
            </button>
          </div>
        </div>

        <!-- Tips Card -->
        <div class="tips-card">
          <h3 class="tips-title">
            <span class="mdi mdi-shield-check-outline tips-icon"></span>
            Password Tips
          </h3>
          <ul class="tips-list">
            <li><span class="mdi mdi-check-circle-outline tip-check"></span>Use at least 8 characters</li>
            <li><span class="mdi mdi-check-circle-outline tip-check"></span>Mix uppercase and lowercase letters</li>
            <li><span class="mdi mdi-check-circle-outline tip-check"></span>Include numbers and symbols</li>
            <li><span class="mdi mdi-check-circle-outline tip-check"></span>Avoid using personal information</li>
            <li><span class="mdi mdi-check-circle-outline tip-check"></span>Don't reuse old passwords</li>
          </ul>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue"
import { useUsersApi } from "~/composables/apis/useUsersApi"

const { fetchMerchant, fetchTerminals, fetchAccount, resetPassword } = useUsersApi()

const tab      = ref("merchant")
const merchant = ref(null)
const terminals = ref([])
const account   = ref(null)
const loadingTerminals = ref(false)

/* ── Helpers ── */
const initials = (n) => (n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

/* ── Copy ── */
const copied = ref('')
async function copy(val) {
  if (!val) return
  try {
    await navigator.clipboard.writeText(val)
    copied.value = val
    setTimeout(() => { copied.value = '' }, 2000)
  } catch {}
}

/* ── Password Reset ── */
const oldPassword     = ref('')
const newPassword     = ref('')
const confirmPassword = ref('')
const resetting       = ref(false)
const showAlert       = ref(false)
const alertMessage    = ref('')
const alertType       = ref('success')
const show    = reactive({ old: false, new: false, confirm: false })
const focuses = reactive({ old: false, new: false, confirm: false })

const valid = ref(false)

const canSubmit = computed(() =>
  oldPassword.value &&
  newPassword.value.length >= 6 &&
  newPassword.value === confirmPassword.value
)

const strengthPct = computed(() => {
  const p = newPassword.value
  if (!p) return 0
  let score = 0
  if (p.length >= 6)           score += 20
  if (p.length >= 10)          score += 20
  if (/[A-Z]/.test(p))        score += 20
  if (/[0-9]/.test(p))        score += 20
  if (/[^A-Za-z0-9]/.test(p)) score += 20
  return score
})
const strengthClass = computed(() => {
  const p = strengthPct.value
  if (p <= 20) return 'str-weak'
  if (p <= 60) return 'str-fair'
  if (p <= 80) return 'str-good'
  return 'str-strong'
})
const strengthLabel = computed(() => {
  const p = strengthPct.value
  if (p <= 20) return 'Weak'
  if (p <= 60) return 'Fair'
  if (p <= 80) return 'Good'
  return 'Strong'
})

async function handleReset() {
  resetting.value = true
  showAlert.value = false
  try {
    const res = await resetPassword({ oldPassword: oldPassword.value, newPassword: newPassword.value })
    console.log("Password reset response:", res)
    if (res.data.statusCode === "00") {
      alertMessage.value = "Password reset successful!"
      alertType.value    = "success"
      oldPassword.value = newPassword.value = confirmPassword.value = ''
    } else {
      alertMessage.value = res.data.message || "Password reset failed"
      alertType.value    = "error"
    }
  } catch (e) {
    console.error("Password reset failed:", e)
    alertMessage.value = "⚠️ Something went wrong. Please try again."
    alertType.value    = "error"
  } finally {
    resetting.value = false
    showAlert.value = true
  }
}

onMounted(() => {
  fetchMerchantVue()
  fetchTerminalsVue()
  fetchAccountVue()
})

async function fetchMerchantVue() {
  try { const res = await fetchMerchant(); merchant.value = res.data } catch (e) { console.error(e) }
}
async function fetchTerminalsVue() {
  loadingTerminals.value = true
  try { const res = await fetchTerminals(); terminals.value = res.data.terminals || [] } catch (e) { console.error(e) } finally { loadingTerminals.value = false }
}
async function fetchAccountVue() {
  try { const res = await fetchAccount(); console.log(res); account.value = res.data } catch (e) { console.error(e) }
}

definePageMeta({ layout: "mlayer", middleware: "auth" })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; }

/* ── Header ── */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.page-title  { font-size: 20px; font-weight: 800; color: #0f172a; }
@media(min-width:640px){ .page-title { font-size: 24px; } }
.page-sub    { font-size: 12px; color: #64748b; margin-top: 3px; }

.vendor-status-badge {
  display: flex; align-items: center; gap: 6px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  padding: 5px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; color: #15803d; align-self: flex-start;
}
.status-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,.25);
  animation: pulse-g 2s ease-in-out infinite;
}
@keyframes pulse-g { 0%,100%{box-shadow:0 0 0 2px rgba(34,197,94,.25)}50%{box-shadow:0 0 0 5px rgba(34,197,94,.08)} }

/* ── Tabs ── */
.tab-nav {
  display: flex; gap: 4px; flex-wrap: wrap;
  background: #f1f5f9; padding: 4px;
  border-radius: 10px; align-self: flex-start;
}
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 7px;
  border: none; background: transparent;
  font-size: 12px; font-weight: 700; color: #64748b;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: background .15s, color .15s; white-space: nowrap;
}
.tab-btn:hover { color: #334155; background: rgba(255,255,255,.6); }
.tab-btn-active { background: #fff !important; color: #1142d4 !important; box-shadow: 0 1px 6px rgba(0,0,0,.08); }
.tab-icon { font-size: 14px; }

.tab-pane { display: flex; flex-direction: column; gap: 14px; }

/* ── Merchant Info Grid ── */
.settings-grid {
  display: grid; grid-template-columns: 1fr; gap: 14px;
}
@media(min-width:768px){ .settings-grid { grid-template-columns: 240px 1fr; } }

/* Profile Card */
.profile-card {
  background: linear-gradient(135deg, #1142d4 0%, #2255e8 100%);
  border-radius: 14px; padding: 28px 20px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 8px;
  box-shadow: 0 8px 24px rgba(17,66,212,.2);
  position: relative; overflow: hidden;
}
.profile-card::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,.07);
}
.profile-card::after {
  content: ''; position: absolute; bottom: -30px; left: -30px;
  width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,.05);
}
.profile-avatar-wrap { position: relative; z-index: 1; }
.profile-avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(255,255,255,.2); border: 3px solid rgba(255,255,255,.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; font-weight: 800; color: #fff;
}
.profile-online-ring {
  position: absolute; bottom: 3px; right: 3px;
  width: 14px; height: 14px; border-radius: 50%;
  background: #22c55e; border: 2px solid #fff;
}
.ring-inactive { background: #ef4444; }
.profile-name  { font-size: 15px; font-weight: 700; color: #fff; position: relative; z-index: 1; }
.profile-email { font-size: 11px; color: rgba(255,255,255,.7); position: relative; z-index: 1; }
.profile-chip, .profile-rate-chip {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
  padding: 4px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; color: #fff;
  position: relative; z-index: 1;
}
.chip-green-pill { background: rgba(34,197,94,.2); border-color: rgba(34,197,94,.4); }
.chip-red-pill   { background: rgba(239,68,68,.2);  border-color: rgba(239,68,68,.4); }
.profile-chip .mdi, .profile-rate-chip .mdi { font-size: 13px; }

/* Info Card */
.info-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden;
}
.info-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-bottom: 1px solid #f1f5f9;
}
.info-card-title-wrap { display: flex; align-items: center; gap: 8px; }
.info-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.info-card-badge {
  font-size: 10px; font-weight: 700;
  background: #f1f5f9; color: #64748b;
  padding: 3px 10px; border-radius: 9999px;
  text-transform: uppercase; letter-spacing: .05em;
}

.info-rows { display: flex; flex-direction: column; }
.info-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; border-bottom: 1px solid #f8fafc;
  gap: 12px; flex-wrap: wrap;
}
.info-row-left  { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.info-row-icon  {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
}
.info-row-label { font-size: 12px; font-weight: 600; color: #64748b; white-space: nowrap; }
.info-row-value {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #1e293b; min-width: 0;
}
.info-row-value-plain { font-size: 13px; font-weight: 600; color: #1e293b; text-align: right; }
.mono-val          { font-family: 'DM Mono', monospace; font-size: 12px; color: #334155; }
.mono-val-truncate { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.info-text         { font-size: 13px; color: #334155; }
.rate-badge {
  background: rgba(17,66,212,.07); color: #1142d4;
  border: 1px solid rgba(17,66,212,.2);
  padding: 3px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
}
.copy-btn {
  width: 24px; height: 24px; border-radius: 6px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: #94a3b8; cursor: pointer; transition: all .13s; flex-shrink: 0;
}
.copy-btn:hover { background: rgba(17,66,212,.07); color: #1142d4; border-color: rgba(17,66,212,.2); }
.copy-btn .mdi-check { color: #22c55e; }

/* ── Terminals Table ── */
.table-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.table-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid #f1f5f9;
}
.table-card-title-wrap { display: flex; align-items: center; gap: 8px; }
.table-card-icon {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.table-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.table-wrap   { overflow-x: auto; }
.data-table   { width: 100%; border-collapse: collapse; }
.data-table thead tr { background: #f8fafc; border-bottom: 1px solid #e8edf3; }
.data-table th {
  padding: 10px 14px; text-align: left;
  font-size: 10px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .08em; white-space: nowrap;
}
.data-row { border-bottom: 1px solid #f8fafc; transition: background .12s; }
.data-row:hover { background: #f8fafc; }
.data-row:last-child { border-bottom: none; }
.data-table td { padding: 11px 14px; vertical-align: middle; }

/* Chips */
.chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 700; white-space: nowrap;
  text-transform: uppercase; letter-spacing: .05em;
}
.chip-dot    { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.chip-green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.chip-red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.chip-blue   { background: rgba(17,66,212,.07); color: #1142d4; border: 1px solid rgba(17,66,212,.2); }
.chip-purple { background: rgba(124,58,237,.07); color: #7c3aed; border: 1px solid rgba(124,58,237,.2); }

/* Empty */
.empty-td { padding: 40px 20px !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.empty-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 26px;
}
.empty-title { font-size: 14px; font-weight: 700; color: #334155; }
.empty-desc  { font-size: 12px; color: #94a3b8; max-width: 260px; line-height: 1.5; }

/* Skel row */
.skel-row td { padding: 12px 14px; }

/* ── KYC Grid ── */
.kyc-grid {
  display: grid; grid-template-columns: 1fr; gap: 14px;
}
@media(min-width:768px)  { .kyc-grid { grid-template-columns: repeat(2, 1fr); } }
.kyc-full { grid-column: 1 / -1; }

/* ── Reset Password ── */
.reset-outer {
  display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start;
}
@media(min-width:768px){ .reset-outer { grid-template-columns: 1fr 280px; } }

.reset-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px; overflow: hidden; box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.reset-card-header {
  padding: 28px 28px 20px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; border-bottom: 1px solid #f1f5f9;
}
.reset-header-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: rgba(17,66,212,.08); color: #1142d4;
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; margin-bottom: 12px;
  box-shadow: 0 4px 14px rgba(17,66,212,.12);
}
.reset-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
.reset-sub   { font-size: 12px; color: #64748b; }

/* Alert */
.alert-box {
  display: flex; align-items: center; gap: 10px;
  margin: 16px 24px 0;
  padding: 11px 14px; border-radius: 9px; font-size: 13px; font-weight: 500;
}
.alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
.alert-error   { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; }
.alert-icon    { font-size: 17px; flex-shrink: 0; }
.alert-msg     { flex: 1; }
.alert-close   { background: none; border: none; cursor: pointer; font-size: 15px; color: inherit; opacity: .6; display: flex; align-items: center; }
.t-alert-enter-active, .t-alert-leave-active { transition: all .22s ease; }
.t-alert-enter-from, .t-alert-leave-to { opacity: 0; transform: translateY(-6px); }

/* Form */
.reset-form { padding: 24px 24px 28px; display: flex; flex-direction: column; gap: 16px; }
.form-field  { display: flex; flex-direction: column; gap: 6px; }
.form-label  { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .07em; }

.password-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 9px; padding: 0 12px; height: 44px;
  transition: border-color .15s, background .15s;
}
.password-wrap.focused   { border-color: #1142d4; background: #fff; }
.password-wrap.pw-error  { border-color: #ef4444; }
.password-wrap.pw-success{ border-color: #22c55e; }
.pw-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.pw-input {
  flex: 1; border: none; background: transparent;
  font-size: 14px; color: #334155; outline: none; font-family: 'DM Sans', sans-serif;
}
.pw-input::placeholder { color: #94a3b8; }
.pw-toggle {
  background: none; border: none; cursor: pointer;
  font-size: 16px; color: #94a3b8; padding: 0;
  display: flex; align-items: center; transition: color .13s;
}
.pw-toggle:hover { color: #475569; }
.pw-check  { font-size: 17px; color: #22c55e; flex-shrink: 0; }

/* Strength */
.strength-wrap  { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
.strength-bar   { flex: 1; height: 4px; background: #f1f5f9; border-radius: 9999px; overflow: hidden; }
.strength-fill  { height: 100%; border-radius: 9999px; transition: width .3s, background .3s; }
.str-weak  { color: #ef4444; } .str-weak  .strength-fill { background: #ef4444; }
.str-fair  { color: #f59e0b; } .str-fair  .strength-fill { background: #f59e0b; }
.str-good  { color: #3b82f6; } .str-good  .strength-fill { background: #3b82f6; }
.str-strong{ color: #22c55e; } .str-strong .strength-fill { background: #22c55e; }
.strength-label { font-size: 11px; font-weight: 700; width: 48px; text-align: right; }

.field-error { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #ef4444; margin-top: 2px; }

.btn-reset {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 13px; border-radius: 9px;
  background: #1142d4; color: #fff; border: none;
  font-size: 14px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17,66,212,.25); transition: filter .15s, opacity .15s; margin-top: 4px;
}
.btn-reset:hover:not(:disabled) { filter: brightness(1.08); }
.btn-reset:disabled { opacity: .5; cursor: not-allowed; }
.btn-reset .mdi { font-size: 17px; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
  border-radius: 50%; animation: spin .7s linear infinite;
}

/* Tips Card */
.tips-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px; padding: 20px; box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.tips-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 14px;
}
.tips-icon  { font-size: 16px; color: #1142d4; }
.tips-list  { display: flex; flex-direction: column; gap: 10px; list-style: none; }
.tips-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #475569; line-height: 1.5; }
.tip-check  { font-size: 14px; color: #22c55e; flex-shrink: 0; margin-top: 1px; }

/* ── Responsive ── */
@media(max-width:767px)  { .th-hide-sm { display: none; } }
@media(max-width:1023px) { .th-hide-md { display: none; } }

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px;
}
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-avatar-lg { width: 72px; height: 72px; border-radius: 50%; }
.skel-line-lg   { height: 12px; width: 140px; }
.skel-line-md   { height: 12px; width: 100px; }
.skel-line-sm   { height: 10px; width: 70px; }
.skel-line-icon { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; }
.skel-line-val  { height: 12px; width: 30%; margin-left: auto; }
.skel-chip      { height: 20px; width: 64px; border-radius: 9999px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
</style>