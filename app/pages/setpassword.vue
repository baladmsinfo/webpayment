<template>
  <div class="login-root">

    <!-- ── Left Panel ── -->
    <div class="login-left">
      <div class="left-inner">
        <!-- Brand -->
        <div class="left-brand">
          <div class="brand-icon">
            <span class="mdi mdi-wallet-outline"></span>
          </div>
          <span class="brand-name">BUCKSBOX</span>
        </div>

        <!-- Illustration -->
        <div class="illustration-wrap">
          <img
            src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7963.jpg"
            alt="Reset Password Illustration"
            class="illustration-img"
          />
        </div>

        <!-- Copy -->
        <div class="left-copy">
          <h2 class="left-headline">Almost there —<br/>set your new password.</h2>
          <p class="left-sub">Choose a strong, unique password to keep your merchant account safe and protected.</p>
        </div>

        <!-- Tips -->
        <div class="password-tips">
          <p class="tips-heading">
            <span class="mdi mdi-shield-key-outline tips-shield"></span>
            Strong password tips
          </p>
          <div class="tip-row">
            <span class="mdi mdi-check-circle-outline tip-check"></span>
            At least 8 characters long
          </div>
          <div class="tip-row">
            <span class="mdi mdi-check-circle-outline tip-check"></span>
            Mix uppercase, numbers & symbols
          </div>
          <div class="tip-row">
            <span class="mdi mdi-check-circle-outline tip-check"></span>
            Avoid personal information
          </div>
        </div>
      </div>
    </div>

    <!-- ── Right Panel ── -->
    <div class="login-right">
      <div class="login-form-wrap">

        <!-- Mobile brand -->
        <div class="mobile-brand">
          <div class="brand-icon brand-icon-solid">
            <span class="mdi mdi-wallet-outline"></span>
          </div>
          <span class="brand-name brand-name-dark">BUCKSBOX</span>
        </div>

        <!-- Icon -->
        <div class="form-icon-wrap">
          <div class="form-icon-circle" :class="{ 'form-icon-success': succeeded }">
            <span class="mdi" :class="succeeded ? 'mdi-check-bold' : 'mdi-lock-reset'"></span>
          </div>
          <div class="form-icon-ring" :class="{ 'ring-success': succeeded }"></div>
        </div>

        <!-- Heading -->
        <div class="form-heading">
          <h1 class="form-title">{{ succeeded ? 'Password Updated!' : 'Set New Password' }}</h1>
          <p class="form-sub">
            {{ succeeded
              ? 'Your password has been changed successfully. Redirecting you to login…'
              : 'Enter and confirm your new password below to complete the reset.' }}
          </p>
        </div>

        <!-- Success state -->
        <transition name="t-slide">
          <div v-if="succeeded" class="success-box">
            <div class="success-progress">
              <div class="success-progress-fill" :style="{ width: redirectProgress + '%' }"></div>
            </div>
            <p class="success-redirect-text">Redirecting in {{ redirectCountdown }}s…</p>
            <button class="btn-go-now" @click="router.push('/')">
              <span class="mdi mdi-login"></span>
              Go to Login Now
            </button>
          </div>
        </transition>

        <!-- Alert -->
        <transition name="t-alert">
          <div v-if="message && messageType === 'error'" class="alert-box">
            <span class="mdi mdi-alert-circle-outline alert-icon"></span>
            <span class="alert-msg">{{ message }}</span>
            <button class="alert-close" @click="message = ''">
              <span class="mdi mdi-close"></span>
            </button>
          </div>
        </transition>

        <!-- Form -->
        <div v-if="!succeeded" class="form-fields">

          <!-- New Password -->
          <div class="field-group">
            <label class="field-label">New Password</label>
            <div class="input-wrap" :class="{ 'input-focused': focuses.new, 'input-error': errors.new }">
              <span class="mdi mdi-lock-outline input-icon"></span>
              <input
                v-model="newPassword"
                :type="show.new ? 'text' : 'password'"
                class="field-input"
                placeholder="Enter new password"
                :disabled="loading"
                @focus="focuses.new = true"
                @blur="focuses.new = false; validateNew()"
                @input="validateNew(); validateConfirm()"
              />
              <button class="pw-toggle" @click="show.new = !show.new" tabindex="-1">
                <span class="mdi" :class="show.new ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
              </button>
            </div>
            <p v-if="errors.new" class="field-error-msg">
              <span class="mdi mdi-alert-circle-outline"></span> {{ errors.new }}
            </p>
            <!-- Strength bar -->
            <div v-if="newPassword" class="strength-wrap">
              <div class="strength-bar">
                <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPct + '%' }"></div>
              </div>
              <span class="strength-label" :class="strengthClass">{{ strengthLabel }}</span>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="field-group">
            <label class="field-label">Confirm New Password</label>
            <div
              class="input-wrap"
              :class="{
                'input-focused': focuses.confirm,
                'input-error': errors.confirm,
                'input-success': confirmPassword && !errors.confirm && newPassword === confirmPassword
              }"
            >
              <span class="mdi mdi-lock-check-outline input-icon"></span>
              <input
                v-model="confirmPassword"
                :type="show.confirm ? 'text' : 'password'"
                class="field-input"
                placeholder="Re-enter new password"
                :disabled="loading"
                @focus="focuses.confirm = true"
                @blur="focuses.confirm = false; validateConfirm()"
              />
              <span
                v-if="confirmPassword && newPassword === confirmPassword"
                class="match-check mdi mdi-check-circle"
              ></span>
              <button class="pw-toggle" @click="show.confirm = !show.confirm" tabindex="-1">
                <span class="mdi" :class="show.confirm ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
              </button>
            </div>
            <p v-if="errors.confirm" class="field-error-msg">
              <span class="mdi mdi-alert-circle-outline"></span> {{ errors.confirm }}
            </p>
          </div>

          <!-- Submit -->
          <button
            class="btn-submit"
            :disabled="loading || !canSubmit"
            @click="onSubmit"
          >
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else class="mdi mdi-lock-check-outline"></span>
            {{ loading ? 'Updating…' : 'Update Password' }}
          </button>

        </div>

        <!-- Back to login -->
        <div class="back-row">
          <button class="back-btn" @click="router.push('/')">
            <span class="mdi mdi-arrow-left"></span>
            Back to Login
          </button>
        </div>

        <!-- Footer -->
        <p class="form-footer">
          <span class="mdi mdi-shield-check-outline footer-shield"></span>
          Your data is encrypted and secure
        </p>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersApi } from "../composables/apis/useUsersApi";

const { setPassword } = useUsersApi();
const route  = useRoute();
const router = useRouter();

const token = route.query.token || "";

/* ── State ── */
const newPassword     = ref('');
const confirmPassword = ref('');
const loading         = ref(false);
const succeeded       = ref(false);
const message         = ref('');
const messageType     = ref('success');
const redirectCountdown = ref(3);
const redirectProgress  = ref(0);

const show    = reactive({ new: false, confirm: false });
const focuses = reactive({ new: false, confirm: false });
const errors  = reactive({ new: '',    confirm: '' });

/* ── Validation ── */
function validateNew() {
  if (!newPassword.value)            { errors.new = 'Password is required'; return false; }
  if (newPassword.value.length < 6)  { errors.new = 'Minimum 6 characters required'; return false; }
  errors.new = '';
  return true;
}
function validateConfirm() {
  if (!confirmPassword.value)                        { errors.confirm = 'Please confirm your password'; return false; }
  if (confirmPassword.value !== newPassword.value)   { errors.confirm = 'Passwords do not match'; return false; }
  errors.confirm = '';
  return true;
}
const canSubmit = computed(() =>
  newPassword.value.length >= 6 &&
  confirmPassword.value === newPassword.value
);

/* ── Password strength ── */
const strengthPct = computed(() => {
  const p = newPassword.value;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 6)  s += 20;
  if (p.length >= 10) s += 20;
  if (/[A-Z]/.test(p)) s += 20;
  if (/[0-9]/.test(p)) s += 20;
  if (/[^A-Za-z0-9]/.test(p)) s += 20;
  return s;
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

/* ── Redirect countdown ── */
function startRedirect() {
  const total = 3000;
  const interval = 50;
  let elapsed = 0;
  const t = setInterval(() => {
    elapsed += interval;
    redirectProgress.value  = Math.min((elapsed / total) * 100, 100);
    redirectCountdown.value = Math.max(Math.ceil((total - elapsed) / 1000), 0);
    if (elapsed >= total) { clearInterval(t); router.push('/'); }
  }, interval);
}

/* ── Submit ── */
async function onSubmit() {
  const nOk = validateNew();
  const cOk = validateConfirm();
  if (!nOk || !cOk) return;

  loading.value = true;
  message.value = '';
  try {
    const res = await setPassword({ token, newPassword: newPassword.value });

    if (res.data.statusCode === "00") {
      succeeded.value  = true;
      messageType.value = 'success';
      startRedirect();
    } else {
      message.value    = res.message || "Failed to update password.";
      messageType.value = 'error';
    }
  } catch (e) {
    message.value    = "Server error. Please try again.";
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Root ── */
.login-root {
  font-family: 'DM Sans', sans-serif;
  min-height: 100dvh;
  display: flex; flex-direction: column;
}
@media (min-width: 768px) { .login-root { flex-direction: row; } }

/* ─────────────── LEFT PANEL ─────────────── */
.login-left {
  display: none;
  background: linear-gradient(150deg, #0a2fa8 0%, #1142d4 50%, #1654f8 100%);
  position: relative; overflow: hidden;
}
@media (min-width: 768px) { .login-left { display: flex; flex: 1; } }

.login-left::before {
  content: '';
  position: absolute; top: -80px; right: -80px;
  width: 300px; height: 300px; border-radius: 50%;
  background: rgba(255,255,255,.05);
}
.login-left::after {
  content: '';
  position: absolute; bottom: -100px; left: -60px;
  width: 360px; height: 360px; border-radius: 50%;
  background: rgba(255,255,255,.04);
}

.left-inner {
  position: relative; z-index: 1;
  width: 100%; display: flex; flex-direction: column;
  padding: 40px 44px; gap: 28px;
}

.left-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #fff; flex-shrink: 0;
}
.brand-name { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: .08em; }

.illustration-wrap {
  flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 16px;
}
.illustration-img {
  width: 100%; max-width: 340px; height: auto; object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,.2));
  animation: float 4.5s ease-in-out infinite;
}
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

.left-headline { font-size: 26px; font-weight: 800; color: #fff; line-height: 1.3; margin-bottom: 10px; }
.left-sub { font-size: 13px; color: rgba(255,255,255,.72); line-height: 1.65; max-width: 360px; }

/* Tips */
.password-tips {
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15);
  border-radius: 12px; padding: 16px;
  display: flex; flex-direction: column; gap: 8px;
}
.tips-heading {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 2px;
}
.tips-shield { font-size: 15px; }
.tip-row {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: rgba(255,255,255,.78);
}
.tip-check { font-size: 14px; color: #4ade80; flex-shrink: 0; }

/* ─────────────── RIGHT PANEL ─────────────── */
.login-right {
  display: flex; align-items: center; justify-content: center;
  background: #f6f6f8; min-height: 100dvh; padding: 32px 20px;
}
@media (min-width: 768px)  { .login-right { flex: 0 0 440px; } }
@media (min-width: 1024px) { .login-right { flex: 0 0 480px; } }

.login-form-wrap {
  width: 100%; max-width: 400px;
  display: flex; flex-direction: column; gap: 20px;
}

/* Mobile brand */
.mobile-brand {
  display: flex; align-items: center; gap: 8px; justify-content: center;
}
@media (min-width: 768px) { .mobile-brand { display: none; } }
.brand-icon-solid { background: #1142d4; border: none; box-shadow: 0 4px 14px rgba(17,66,212,.3); }
.brand-name-dark  { color: #0f172a; }

/* Form icon */
.form-icon-wrap {
  display: flex; justify-content: center;
  position: relative; margin: 4px 0;
}
.form-icon-circle {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, #1142d4, #1654f8);
  display: flex; align-items: center; justify-content: center;
  font-size: 30px; color: #fff;
  box-shadow: 0 6px 20px rgba(17,66,212,.3);
  position: relative; z-index: 1;
  transition: background .4s ease;
}
.form-icon-success { background: linear-gradient(135deg, #16a34a, #22c55e) !important; box-shadow: 0 6px 20px rgba(34,197,94,.3) !important; }
.form-icon-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 80px; height: 80px; border-radius: 50%;
  border: 2px solid rgba(17,66,212,.15);
  animation: ring-pulse 2.5s ease-in-out infinite;
}
.ring-success { border-color: rgba(34,197,94,.2); }
@keyframes ring-pulse {
  0%,100% { transform: translate(-50%,-50%) scale(1);    opacity: 1; }
  50%      { transform: translate(-50%,-50%) scale(1.15); opacity: .4; }
}

/* Heading */
.form-title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 6px; text-align: center; }
.form-sub   { font-size: 13px; color: #64748b; line-height: 1.55; text-align: center; }

/* Success box */
.success-box {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 12px; padding: 20px;
}
.success-progress {
  width: 100%; height: 4px; background: #dcfce7; border-radius: 9999px; overflow: hidden;
}
.success-progress-fill {
  height: 100%; background: #22c55e; border-radius: 9999px;
  transition: width .05s linear;
}
.success-redirect-text { font-size: 12px; color: #16a34a; font-weight: 600; }
.btn-go-now {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 20px; border-radius: 9px;
  background: #22c55e; color: #fff;
  border: none; font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  transition: filter .13s;
}
.btn-go-now:hover { filter: brightness(1.06); }
.btn-go-now .mdi { font-size: 15px; }

/* Alert */
.alert-box {
  display: flex; align-items: flex-start; gap: 10px;
  background: #fff7ed; border: 1px solid #fed7aa;
  border-radius: 10px; padding: 12px 14px;
  font-size: 13px; font-weight: 500; color: #92400e;
}
.alert-icon  { font-size: 17px; flex-shrink: 0; margin-top: 1px; color: #d97706; }
.alert-msg   { flex: 1; line-height: 1.5; }
.alert-close {
  background: none; border: none; cursor: pointer;
  font-size: 16px; color: #d97706; opacity: .7;
  display: flex; align-items: center; flex-shrink: 0; transition: opacity .13s;
}
.alert-close:hover { opacity: 1; }
.t-alert-enter-active, .t-alert-leave-active { transition: all .22s ease; }
.t-alert-enter-from, .t-alert-leave-to { opacity: 0; transform: translateY(-6px); }
.t-slide-enter-active, .t-slide-leave-active { transition: all .3s ease; }
.t-slide-enter-from, .t-slide-leave-to { opacity: 0; transform: translateY(10px); }

/* Form */
.form-fields { display: flex; flex-direction: column; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label {
  font-size: 11px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: .07em;
}
.input-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 0 12px; height: 46px;
  transition: border-color .15s, box-shadow .15s;
}
.input-wrap.input-focused { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.1); }
.input-wrap.input-error   { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,.08); }
.input-wrap.input-success { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,.1); }
.input-icon { font-size: 17px; color: #94a3b8; flex-shrink: 0; }
.field-input {
  flex: 1; border: none; background: transparent;
  font-size: 14px; color: #1e293b; outline: none;
  font-family: 'DM Sans', sans-serif;
}
.field-input::placeholder { color: #94a3b8; }
.field-input:disabled { opacity: .6; }

.match-check { font-size: 17px; color: #22c55e; flex-shrink: 0; }
.pw-toggle {
  background: none; border: none; cursor: pointer;
  font-size: 17px; color: #94a3b8; padding: 0;
  display: flex; align-items: center; transition: color .13s;
}
.pw-toggle:hover { color: #475569; }
.field-error-msg {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: #ef4444;
}
.field-error-msg .mdi { font-size: 13px; }

/* Strength */
.strength-wrap { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
.strength-bar  { flex: 1; height: 4px; background: #f1f5f9; border-radius: 9999px; overflow: hidden; }
.strength-fill { height: 100%; border-radius: 9999px; transition: width .3s ease, background .3s; }
.str-weak   { color: #ef4444; } .str-weak   .strength-fill { background: #ef4444; }
.str-fair   { color: #f59e0b; } .str-fair   .strength-fill { background: #f59e0b; }
.str-good   { color: #3b82f6; } .str-good   .strength-fill { background: #3b82f6; }
.str-strong { color: #22c55e; } .str-strong .strength-fill { background: #22c55e; }
.strength-label { font-size: 11px; font-weight: 700; width: 44px; text-align: right; }

/* Submit */
.btn-submit {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; height: 48px; border-radius: 10px;
  background: linear-gradient(135deg, #1142d4, #1654f8);
  color: #fff; border: none;
  font-size: 15px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  box-shadow: 0 4px 18px rgba(17,66,212,.3);
  transition: filter .15s, box-shadow .15s, opacity .15s;
}
.btn-submit:hover:not(:disabled) { filter: brightness(1.07); box-shadow: 0 6px 24px rgba(17,66,212,.38); }
.btn-submit:disabled { opacity: .5; cursor: not-allowed; box-shadow: none; }
.btn-submit .mdi { font-size: 18px; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-spinner {
  width: 17px; height: 17px;
  border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
  border-radius: 50%; animation: spin .7s linear infinite;
}

/* Back */
.back-row { display: flex; justify-content: center; }
.back-btn {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #475569;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  padding: 8px 16px; border-radius: 8px;
  transition: background .13s, color .13s;
}
.back-btn:hover { background: #f1f5f9; color: #1142d4; }
.back-btn .mdi { font-size: 16px; }

/* Footer */
.form-footer {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 11px; color: #94a3b8; text-align: center;
}
.footer-shield { font-size: 14px; color: #22c55e; }
</style>