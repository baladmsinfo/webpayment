<template>
  <div class="page-root">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">{{ aggregator?.legal_name || aggregator?.name || 'Manage your account preferences' }}</p>
      </div>
      <div class="vendor-status-badge" v-if="aggregator">
        <span class="status-dot"></span>
        <span>Active Account</span>
      </div>
    </div>

    <!-- ── Tab Nav ── -->
    <div class="tab-nav">
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'aggregator' }" @click="tab = 'aggregator'">
        <span class="mdi mdi-shield-account-outline tab-icon"></span>
        Aggregator Info
      </button>
      <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'reset' }" @click="tab = 'reset'">
        <span class="mdi mdi-lock-reset tab-icon"></span>
        Reset Password
      </button>
    </div>

    <!-- ══════════════ AGGREGATOR INFO TAB ══════════════ -->
    <div v-if="tab === 'aggregator'" class="tab-pane">
      <div class="settings-grid">

        <!-- Profile Card -->
        <div class="profile-card">
          <template v-if="aggregator">
            <div class="profile-avatar-wrap">
              <div class="profile-avatar">{{ initials(aggregator.name || aggregator.legal_name) }}</div>
              <div class="profile-online-ring"></div>
            </div>
            <div class="profile-name">{{ aggregator.name || aggregator.legal_name }}</div>
            <div class="profile-email">{{ aggregator.email }}</div>
            <div class="profile-chip">
              <span class="mdi mdi-identifier"></span>
              {{ aggregator.code }}
            </div>
            <div class="profile-rate-chip" v-if="aggregator.rateType">
              <span class="mdi mdi-percent-outline"></span>
              {{ aggregator.rateType }}
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

          <template v-if="aggregator">
            <div class="info-rows">

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-identifier"></span></div>
                  <span class="info-row-label">Aggregator Code</span>
                </div>
                <div class="info-row-value">
                  <span class="mono-val">{{ aggregator.code }}</span>
                  <button class="copy-btn" @click="copy(aggregator.code)">
                    <span class="mdi" :class="copied === aggregator.code ? 'mdi-check' : 'mdi-content-copy'"></span>
                  </button>
                </div>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-key-outline"></span></div>
                  <span class="info-row-label">Aggregator ID</span>
                </div>
                <div class="info-row-value">
                  <span class="mono-val mono-val-truncate">{{ aggregator.id }}</span>
                  <button class="copy-btn" @click="copy(aggregator.id)">
                    <span class="mdi" :class="copied === aggregator.id ? 'mdi-check' : 'mdi-content-copy'"></span>
                  </button>
                </div>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-account-outline"></span></div>
                  <span class="info-row-label">Full Name</span>
                </div>
                <span class="info-row-value info-row-value-plain">{{ aggregator.name || aggregator.legal_name }}</span>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-email-outline"></span></div>
                  <span class="info-row-label">Email Address</span>
                </div>
                <div class="info-row-value">
                  <span class="info-text">{{ aggregator.email }}</span>
                  <button class="copy-btn" @click="copy(aggregator.email)">
                    <span class="mdi" :class="copied === aggregator.email ? 'mdi-check' : 'mdi-content-copy'"></span>
                  </button>
                </div>
              </div>

              <div class="info-row">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-phone-outline"></span></div>
                  <span class="info-row-label">Mobile</span>
                </div>
                <span class="info-row-value info-row-value-plain">{{ aggregator.mobile }}</span>
              </div>

              <div class="info-row" style="border-bottom:none">
                <div class="info-row-left">
                  <div class="info-row-icon"><span class="mdi mdi-percent-outline"></span></div>
                  <span class="info-row-label">Rate Type</span>
                </div>
                <span class="info-row-value">
                  <span class="rate-badge">{{ aggregator.rateType || '—' }}</span>
                </span>
              </div>

            </div>
          </template>

          <template v-else>
            <div class="info-rows">
              <div class="info-row" v-for="i in 6" :key="i" :style="i === 6 ? 'border-bottom:none' : ''">
                <div class="skel skel-line-icon"></div>
                <div class="skel skel-line-md"></div>
                <div class="skel skel-line-val"></div>
              </div>
            </div>
          </template>
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
            <p class="reset-sub">Enter your current password and choose a new one.</p>
          </div>

          <!-- Alert -->
          <transition name="t-alert">
            <div v-if="showAlert" class="alert-box" :class="alertType === 'success' ? 'alert-success' : 'alert-error'">
              <span class="mdi alert-icon"
                :class="alertType === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
              <span class="alert-msg">{{ alertMessage }}</span>
              <button class="alert-close" @click="showAlert = false">
                <span class="mdi mdi-close"></span>
              </button>
            </div>
          </transition>

          <!-- Form -->
          <div class="reset-form">

            <!-- Old Password -->
            <div class="form-field">
              <label class="form-label">Current Password</label>
              <div class="password-wrap" :class="{ focused: focuses.old }">
                <span class="mdi mdi-lock-outline pw-icon"></span>
                <input
                  v-model="oldPassword"
                  :type="show.old ? 'text' : 'password'"
                  class="pw-input"
                  placeholder="Enter current password"
                  @focus="focuses.old = true"
                  @blur="focuses.old = false"
                />
                <button class="pw-toggle" @click="show.old = !show.old" tabindex="-1">
                  <span class="mdi" :class="show.old ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div class="form-field">
              <label class="form-label">New Password</label>
              <div class="password-wrap" :class="{ focused: focuses.new }">
                <span class="mdi mdi-lock-plus-outline pw-icon"></span>
                <input
                  v-model="newPassword"
                  :type="show.new ? 'text' : 'password'"
                  class="pw-input"
                  placeholder="Minimum 6 characters"
                  @focus="focuses.new = true"
                  @blur="focuses.new = false"
                />
                <button class="pw-toggle" @click="show.new = !show.new" tabindex="-1">
                  <span class="mdi" :class="show.new ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                </button>
              </div>
              <!-- Strength bar -->
              <div v-if="newPassword" class="strength-wrap">
                <div class="strength-bar">
                  <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPct + '%' }"></div>
                </div>
                <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-field">
              <label class="form-label">Confirm New Password</label>
              <div class="password-wrap"
                :class="{
                  focused: focuses.confirm,
                  'pw-error': confirmPassword && newPassword !== confirmPassword,
                  'pw-success': confirmPassword && newPassword === confirmPassword && newPassword.length >= 6
                }">
                <span class="mdi mdi-lock-check-outline pw-icon"></span>
                <input
                  v-model="confirmPassword"
                  :type="show.confirm ? 'text' : 'password'"
                  class="pw-input"
                  placeholder="Re-enter new password"
                  @focus="focuses.confirm = true"
                  @blur="focuses.confirm = false"
                />
                <span v-if="confirmPassword && newPassword === confirmPassword && newPassword.length >= 6"
                  class="mdi mdi-check-circle pw-check"></span>
                <button class="pw-toggle" @click="show.confirm = !show.confirm" tabindex="-1">
                  <span class="mdi" :class="show.confirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                </button>
              </div>
              <p v-if="confirmPassword && newPassword !== confirmPassword" class="field-error">
                <span class="mdi mdi-alert-circle-outline"></span> Passwords do not match
              </p>
            </div>

            <!-- Submit -->
            <button
              class="btn-reset"
              :disabled="!canSubmit || resetting"
              @click="handleReset"
            >
              <span v-if="resetting" class="btn-spinner"></span>
              <span v-else class="mdi mdi-lock-reset"></span>
              {{ resetting ? 'Resetting…' : 'Reset Password' }}
            </button>
          </div>
        </div>

        <!-- Security Tips -->
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
import { ref, computed, reactive, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";

const { getAggregator, resetPassword } = useAggregatorApi();
const authStore = useAuthStore();

definePageMeta({ layout: "aggregatorlayer", middleware: "auth" });

/* ── Tab ── */
const tab = ref("aggregator");

/* ── Aggregator ── */
const aggregator = computed(() => authStore.aggregator);
const initials = (n) => (n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

/* ── Copy ── */
const copied = ref('');
async function copy(val) {
  try {
    await navigator.clipboard.writeText(val);
    copied.value = val;
    setTimeout(() => { copied.value = ''; }, 2000);
  } catch {}
}

/* ── Password Reset ── */
const oldPassword     = ref('');
const newPassword     = ref('');
const confirmPassword = ref('');
const resetting       = ref(false);
const showAlert       = ref(false);
const alertMessage    = ref('');
const alertType       = ref('success');
const show    = reactive({ old: false, new: false, confirm: false });
const focuses = reactive({ old: false, new: false, confirm: false });

const canSubmit = computed(() =>
  oldPassword.value &&
  newPassword.value.length >= 6 &&
  newPassword.value === confirmPassword.value
);

/* Password strength */
const strengthPct = computed(() => {
  const p = newPassword.value;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 6)  score += 20;
  if (p.length >= 10) score += 20;
  if (/[A-Z]/.test(p)) score += 20;
  if (/[0-9]/.test(p)) score += 20;
  if (/[^A-Za-z0-9]/.test(p)) score += 20;
  return score;
});
const strengthClass = computed(() => {
  const p = strengthPct.value;
  if (p <= 20) return 'str-weak';
  if (p <= 60) return 'str-fair';
  if (p <= 80) return 'str-good';
  return 'str-strong';
});
const strengthLabel = computed(() => {
  const p = strengthPct.value;
  if (p <= 20) return 'Weak';
  if (p <= 60) return 'Fair';
  if (p <= 80) return 'Good';
  return 'Strong';
});

async function handleReset() {
  resetting.value = true;
  showAlert.value = false;
  try {
    const res = await resetPassword({ oldPassword: oldPassword.value, newPassword: newPassword.value });
    if (res.data.statusCode === "00") {
      alertMessage.value = "Password reset successfully!";
      alertType.value    = "success";
      oldPassword.value = newPassword.value = confirmPassword.value = '';
    } else {
      alertMessage.value = res.data.message || "Password reset failed.";
      alertType.value    = "error";
    }
  } catch {
    alertMessage.value = "Something went wrong. Please try again.";
    alertType.value    = "error";
  } finally {
    resetting.value = false;
    showAlert.value = true;
  }
}

onMounted(async () => {
  try { await getAggregator(); } catch {}
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; }

/* ── Header ── */
.page-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.page-title { font-size: 20px; font-weight: 800; color: #0f172a; }
@media(min-width:640px){ .page-title { font-size: 24px; } }
.page-sub   { font-size: 12px; color: #64748b; margin-top: 3px; }

.vendor-status-badge {
  display: flex; align-items: center; gap: 6px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  padding: 5px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; color: #15803d;
  align-self: flex-start;
}
.status-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,.25);
  animation: pulse-g 2s ease-in-out infinite;
}
@keyframes pulse-g { 0%,100%{box-shadow:0 0 0 2px rgba(34,197,94,.25)}50%{box-shadow:0 0 0 5px rgba(34,197,94,.08)} }

/* ── Tabs ── */
.tab-nav {
  display: flex; gap: 4px;
  background: #f1f5f9; padding: 4px;
  border-radius: 10px; align-self: flex-start;
}
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 7px;
  border: none; background: transparent;
  font-size: 12px; font-weight: 700; color: #64748b;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: background .15s, color .15s; white-space: nowrap;
}
.tab-btn:hover { color: #334155; background: rgba(255,255,255,.6); }
.tab-btn-active { background: #fff !important; color: #1142d4 !important; box-shadow: 0 1px 6px rgba(0,0,0,.08); }
.tab-icon { font-size: 15px; }

/* ── Tab Pane ── */
.tab-pane { display: flex; flex-direction: column; gap: 14px; }

/* ── Aggregator Info ── */
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
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,.07);
}
.profile-card::after {
  content: ''; position: absolute; bottom: -30px; left: -30px;
  width: 90px; height: 90px; border-radius: 50%;
  background: rgba(255,255,255,.05);
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
.profile-name  { font-size: 15px; font-weight: 700; color: #fff; position: relative; z-index: 1; }
.profile-email { font-size: 11px; color: rgba(255,255,255,.7); position: relative; z-index: 1; }
.profile-chip, .profile-rate-chip {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
  padding: 4px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; color: #fff;
  position: relative; z-index: 1;
}
.profile-chip .mdi, .profile-rate-chip .mdi { font-size: 13px; }

/* Info Card */
.info-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px; box-shadow: 0 1px 6px rgba(0,0,0,.04); overflow: hidden;
}
.info-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
}
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
  padding: 13px 20px; border-bottom: 1px solid #f8fafc;
  gap: 12px; flex-wrap: wrap;
}
.info-row-left { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.info-row-icon {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
}
.info-row-label { font-size: 12px; font-weight: 600; color: #64748b; white-space: nowrap; }
.info-row-value {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #1e293b; min-width: 0;
}
.info-row-value-plain { font-size: 13px; font-weight: 600; color: #1e293b; }
.mono-val { font-family: 'DM Mono', monospace; font-size: 12px; color: #334155; }
.mono-val-truncate { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.info-text { font-size: 13px; color: #334155; }

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
  font-size: 13px; color: #94a3b8; cursor: pointer;
  transition: all .13s; flex-shrink: 0;
}
.copy-btn:hover { background: rgba(17,66,212,.07); color: #1142d4; border-color: rgba(17,66,212,.2); }
.copy-btn .mdi-check { color: #22c55e; }

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
.alert-icon  { font-size: 17px; flex-shrink: 0; }
.alert-msg   { flex: 1; }
.alert-close {
  background: none; border: none; cursor: pointer;
  font-size: 15px; color: inherit; opacity: .6;
  display: flex; align-items: center;
}
.t-alert-enter-active, .t-alert-leave-active { transition: all .22s ease; }
.t-alert-enter-from, .t-alert-leave-to { opacity: 0; transform: translateY(-6px); }

/* Form */
.reset-form { padding: 24px 24px 28px; display: flex; flex-direction: column; gap: 16px; }
.form-field  { display: flex; flex-direction: column; gap: 6px; }
.form-label  {
  font-size: 11px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: .07em;
}
.password-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 9px; padding: 0 12px; height: 44px;
  transition: border-color .15s, background .15s;
}
.password-wrap.focused  { border-color: #1142d4; background: #fff; }
.password-wrap.pw-error { border-color: #ef4444; }
.password-wrap.pw-success { border-color: #22c55e; }
.pw-icon { font-size: 16px; color: #94a3b8; flex-shrink: 0; }
.pw-input {
  flex: 1; border: none; background: transparent;
  font-size: 14px; color: #334155; outline: none;
  font-family: 'DM Sans', sans-serif;
}
.pw-input::placeholder { color: #94a3b8; }
.pw-toggle {
  background: none; border: none; cursor: pointer;
  font-size: 16px; color: #94a3b8; padding: 0;
  display: flex; align-items: center; transition: color .13s;
}
.pw-toggle:hover { color: #475569; }
.pw-check { font-size: 17px; color: #22c55e; flex-shrink: 0; }

/* Strength */
.strength-wrap { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
.strength-bar  { flex: 1; height: 4px; background: #f1f5f9; border-radius: 9999px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 9999px; transition: width .3s, background .3s; }
.str-weak   { color: #ef4444; } .str-weak   .strength-fill { background: #ef4444; }
.str-fair   { color: #f59e0b; } .str-fair   .strength-fill { background: #f59e0b; }
.str-good   { color: #3b82f6; } .str-good   .strength-fill { background: #3b82f6; }
.str-strong { color: #22c55e; } .str-strong .strength-fill { background: #22c55e; }
.strength-label { font-size: 11px; font-weight: 700; width: 48px; text-align: right; }

.field-error {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: #ef4444; margin-top: 2px;
}

.btn-reset {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 13px; border-radius: 9px;
  background: #1142d4; color: #fff;
  border: none; font-size: 14px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17,66,212,.25);
  transition: filter .15s, opacity .15s; margin-top: 4px;
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
  border-radius: 14px; padding: 20px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
}
.tips-title {
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 14px;
}
.tips-icon { font-size: 16px; color: #1142d4; }
.tips-list { display: flex; flex-direction: column; gap: 10px; list-style: none; }
.tips-list li {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 12px; color: #475569; line-height: 1.5;
}
.tip-check { font-size: 14px; color: #22c55e; flex-shrink: 0; margin-top: 1px; }

/* Skeleton */
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px;
}
@keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
.skel-avatar-lg { width: 72px; height: 72px; border-radius: 50%; }
.skel-line-md   { height: 14px; width: 70%; }
.skel-line-sm   { height: 11px; width: 50%; }
.skel-line-icon { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; }
.skel-line-val  { height: 12px; width: 30%; margin-left: auto; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
</style>