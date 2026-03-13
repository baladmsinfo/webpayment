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
            src="https://img.freepik.com/free-vector/scan-pay-concept-illustration_114360-7415.jpg"
            alt="Reset Password Illustration"
            class="illustration-img"
          />
        </div>

        <!-- Copy -->
        <div class="left-copy">
          <h2 class="left-headline">Account recovery<br/>made simple.</h2>
          <p class="left-sub">Don't worry — it happens to the best of us. We'll help you get back into your account quickly and securely.</p>
        </div>

        <!-- Steps -->
        <div class="recovery-steps">
          <div class="step-item">
            <div class="step-num">1</div>
            <span>Enter your registered email or mobile</span>
          </div>
          <div class="step-item">
            <div class="step-num">2</div>
            <span>Receive a secure reset link</span>
          </div>
          <div class="step-item">
            <div class="step-num">3</div>
            <span>Set your new password</span>
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
          <div class="form-icon-circle">
            <span class="mdi mdi-lock-open-variant-outline"></span>
          </div>
          <div class="form-icon-ring"></div>
        </div>

        <!-- Heading -->
        <div class="form-heading">
          <h1 class="form-title">Forgot Password?</h1>
          <p class="form-sub">Enter your registered email or mobile number and we'll send you reset instructions.</p>
        </div>

        <!-- Success State -->
        <transition name="t-slide">
          <div v-if="submitted && successMessage" class="success-box">
            <div class="success-icon-wrap">
              <span class="mdi mdi-check-circle-outline"></span>
            </div>
            <div>
              <p class="success-title">Check your inbox!</p>
              <p class="success-desc">{{ successMessage }}</p>
            </div>
          </div>
        </transition>

        <!-- Error Alert -->
        <transition name="t-alert">
          <div v-if="errorMessage" class="alert-box">
            <span class="mdi mdi-alert-circle-outline alert-icon"></span>
            <span class="alert-msg">{{ errorMessage }}</span>
            <button class="alert-close" @click="errorMessage = ''">
              <span class="mdi mdi-close"></span>
            </button>
          </div>
        </transition>

        <!-- Form -->
        <div v-if="!submitted || errorMessage" class="form-fields">
          <div class="field-group">
            <label class="field-label">Email or Mobile Number</label>
            <div class="input-wrap" :class="{ 'input-focused': focused, 'input-error': fieldError }">
              <span class="mdi mdi-account-outline input-icon"></span>
              <input
                v-model="identifier"
                class="field-input"
                placeholder="Enter your email or mobile"
                :disabled="loading"
                autocomplete="username"
                @focus="focused = true"
                @blur="focused = false; validateField()"
                @keyup.enter="onSubmit"
              />
              <button v-if="identifier" class="input-clear" @click="identifier = ''" tabindex="-1">
                <span class="mdi mdi-close-circle"></span>
              </button>
            </div>
            <p v-if="fieldError" class="field-error-msg">
              <span class="mdi mdi-alert-circle-outline"></span> {{ fieldError }}
            </p>
          </div>

          <!-- Submit -->
          <button
            class="btn-submit"
            :disabled="loading || !identifier.trim()"
            @click="onSubmit"
          >
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else class="mdi mdi-send-outline"></span>
            {{ loading ? 'Sending…' : 'Send Reset Link' }}
          </button>
        </div>

        <!-- Resend (after success) -->
        <div v-if="submitted && successMessage" class="resend-wrap">
          <p class="resend-hint">Didn't receive it?</p>
          <button
            class="btn-resend"
            :disabled="resendCountdown > 0 || loading"
            @click="onSubmit"
          >
            <span v-if="resendCountdown > 0">Resend in {{ resendCountdown }}s</span>
            <span v-else>Resend Link</span>
          </button>
        </div>

        <!-- Back to login -->
        <div class="back-row">
          <button class="back-btn" @click="router.push('/')">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersApi } from "../composables/apis/useUsersApi";

const { forgotPassword } = useUsersApi();
const router = useRouter();

/* ── State ── */
const identifier      = ref('');
const loading         = ref(false);
const focused         = ref(false);
const fieldError      = ref('');
const successMessage  = ref('');
const errorMessage    = ref('');
const submitted       = ref(false);
const resendCountdown = ref(0);

/* ── Validation ── */
function validateField() {
  if (!identifier.value.trim()) {
    fieldError.value = 'Email or mobile number is required';
    return false;
  }
  fieldError.value = '';
  return true;
}

/* ── Resend countdown ── */
function startCountdown() {
  resendCountdown.value = 30;
  const t = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0) clearInterval(t);
  }, 1000);
}

/* ── Submit ── */
async function onSubmit() {
  errorMessage.value = '';
  if (!validateField()) return;

  loading.value = true;
  try {
    const res = await forgotPassword(identifier.value);

    if (res.statusCode === "00") {
      successMessage.value = res.message || "Password reset instructions have been sent!";
      submitted.value = true;
      startCountdown();
    } else {
      errorMessage.value = res.message || "Something went wrong. Please try again.";
    }
  } catch (e) {
    errorMessage.value = "Server error. Please try again later.";
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

/* Recovery Steps */
.recovery-steps { display: flex; flex-direction: column; gap: 10px; }
.step-item {
  display: flex; align-items: center; gap: 12px;
  font-size: 12px; font-weight: 500; color: rgba(255,255,255,.8);
}
.step-num {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff;
}

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

/* Form Icon */
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
}
.form-icon-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 80px; height: 80px; border-radius: 50%;
  border: 2px solid rgba(17,66,212,.15);
  animation: ring-pulse 2.5s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
  50%      { transform: translate(-50%,-50%) scale(1.15); opacity: .4; }
}

/* Heading */
.form-title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 6px; text-align: center; }
.form-sub   { font-size: 13px; color: #64748b; line-height: 1.55; text-align: center; }

/* Success box */
.success-box {
  display: flex; align-items: flex-start; gap: 12px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 12px; padding: 16px;
}
.success-icon-wrap {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: #dcfce7; color: #16a34a;
  display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.success-title { font-size: 13px; font-weight: 700; color: #15803d; margin-bottom: 3px; }
.success-desc  { font-size: 12px; color: #16a34a; line-height: 1.5; }

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
.t-slide-enter-active, .t-slide-leave-active { transition: all .25s ease; }
.t-slide-enter-from, .t-slide-leave-to { opacity: 0; transform: translateY(8px); }

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
.input-icon { font-size: 17px; color: #94a3b8; flex-shrink: 0; }
.field-input {
  flex: 1; border: none; background: transparent;
  font-size: 14px; color: #1e293b; outline: none;
  font-family: 'DM Sans', sans-serif;
}
.field-input::placeholder { color: #94a3b8; }
.field-input:disabled { opacity: .6; }
.input-clear {
  background: none; border: none; cursor: pointer;
  font-size: 16px; color: #cbd5e1; padding: 0;
  display: flex; align-items: center; transition: color .13s;
}
.input-clear:hover { color: #94a3b8; }
.field-error-msg {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: #ef4444;
}
.field-error-msg .mdi { font-size: 13px; }

/* Submit button */
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
.btn-submit .mdi { font-size: 17px; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-spinner {
  width: 17px; height: 17px;
  border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
  border-radius: 50%; animation: spin .7s linear infinite;
}

/* Resend */
.resend-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.resend-hint { font-size: 12px; color: #94a3b8; }
.btn-resend {
  font-size: 13px; font-weight: 700; color: #1142d4;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: opacity .13s;
}
.btn-resend:disabled { opacity: .45; cursor: not-allowed; color: #94a3b8; }
.btn-resend:not(:disabled):hover { opacity: .75; }

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