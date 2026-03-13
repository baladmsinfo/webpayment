<template>
  <div class="login-root">

    <!-- ── Left Panel (illustration) ── -->
    <div class="login-left">
      <div class="left-inner">
        <!-- Brand -->
        <div class="left-brand">
          <div class="brand-icon">
            <span class="mdi mdi-shield-crown-outline"></span>
          </div>
          <span class="brand-name">BUCKSBOX</span>
        </div>

        <!-- Illustration -->
        <div class="illustration-wrap">
          <img
            src="https://img.freepik.com/free-vector/scan-pay-concept-illustration_114360-7415.jpg"
            alt="Admin Dashboard Illustration"
            class="illustration-img"
          />
        </div>

        <!-- Copy -->
        <div class="left-copy">
          <h2 class="left-headline">Manage everything<br />from one place.</h2>
          <p class="left-sub">Monitor merchants, track transactions, and maintain full control of your platform — securely and efficiently.</p>
        </div>

        <!-- Feature pills -->
        <div class="feature-pills">
          <div class="feature-pill">
            <span class="mdi mdi-store-check-outline"></span>
            Merchant Management
          </div>
          <div class="feature-pill">
            <span class="mdi mdi-chart-line"></span>
            Live Analytics
          </div>
          <div class="feature-pill">
            <span class="mdi mdi-shield-lock-outline"></span>
            Secure Access
          </div>
        </div>
      </div>
    </div>

    <!-- ── Right Panel (form) ── -->
    <div class="login-right">
      <div class="login-form-wrap">

        <!-- Mobile brand (only shows on small screens) -->
        <div class="mobile-brand">
          <div class="brand-icon brand-icon-blue">
            <span class="mdi mdi-shield-crown-outline"></span>
          </div>
          <span class="brand-name brand-name-dark">BUCKSBOX</span>
        </div>

        <!-- Heading -->
        <div class="form-heading">
          <h1 class="form-title">Admin Login</h1>
          <p class="form-sub">Manage merchants, track activity, and access your dashboard securely.</p>
        </div>

        <!-- Alert -->
        <transition name="t-alert">
          <div v-if="alert.show" class="alert-box">
            <span class="mdi mdi-alert-circle-outline alert-icon"></span>
            <span class="alert-msg">{{ alert.message }}</span>
            <button class="alert-close" @click="alert.show = false">
              <span class="mdi mdi-close"></span>
            </button>
          </div>
        </transition>

        <!-- Form -->
        <div class="form-fields">

          <!-- Email / Mobile -->
          <div class="field-group">
            <label class="field-label">Email or Mobile Number</label>
            <div class="input-wrap" :class="{ 'input-focused': focuses.mobile, 'input-error': errors.mobile }">
              <span class="mdi mdi-account-outline input-icon"></span>
              <input
                v-model="mobilenumber"
                class="field-input"
                placeholder="Enter email or mobile"
                :disabled="loading"
                @focus="focuses.mobile = true"
                @blur="focuses.mobile = false; validateMobile()"
                @keyup.enter="focusPassword"
              />
              <button v-if="mobilenumber" class="input-clear" @click="mobilenumber = ''" tabindex="-1">
                <span class="mdi mdi-close-circle"></span>
              </button>
            </div>
            <p v-if="errors.mobile" class="field-error-msg">
              <span class="mdi mdi-alert-circle-outline"></span> {{ errors.mobile }}
            </p>
          </div>

          <!-- Password -->
          <div class="field-group">
            <div class="field-label-row">
              <label class="field-label">Password</label>
              <button class="forgot-link" @click.prevent="router.push('/forgotpassword')">
                Forgot Password?
              </button>
            </div>
            <div class="input-wrap" :class="{ 'input-focused': focuses.password, 'input-error': errors.password }">
              <span class="mdi mdi-lock-outline input-icon"></span>
              <input
                ref="passwordRef"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="Enter your password"
                :disabled="loading"
                @focus="focuses.password = true"
                @blur="focuses.password = false; validatePassword()"
                @keyup.enter="onSubmit"
              />
              <button class="pw-toggle" @click="showPassword = !showPassword" tabindex="-1">
                <span class="mdi" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
              </button>
            </div>
            <p v-if="errors.password" class="field-error-msg">
              <span class="mdi mdi-alert-circle-outline"></span> {{ errors.password }}
            </p>
          </div>

          <!-- Submit -->
          <button
            class="btn-login"
            :disabled="loading || !canSubmit"
            @click="onSubmit"
          >
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else class="mdi mdi-login"></span>
            {{ loading ? 'Signing in…' : 'Login' }}
          </button>

        </div>

        <!-- Footer -->
        <p class="form-footer">
          <span class="mdi mdi-shield-check-outline footer-shield"></span>
          Secured with 256-bit encryption
        </p>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useUsersApi } from "@/composables/apis/useUsersApi";
import { useRouter } from "vue-router";

const { login } = useUsersApi();
const router    = useRouter();

definePageMeta({ middleware: "guest" });

/* ── State ── */
const mobilenumber  = ref('');
const password      = ref('');
const loading       = ref(false);
const showPassword  = ref(false);
const passwordRef   = ref(null);

const focuses = reactive({ mobile: false, password: false });
const errors  = reactive({ mobile: '',    password: '' });

const alert = ref({ show: false, message: '' });

/* ── Validation ── */
function validateMobile() {
  if (!mobilenumber.value) { errors.mobile = 'Email or mobile is required'; return false; }
  errors.mobile = '';
  return true;
}
function validatePassword() {
  if (!password.value)          { errors.password = 'Password is required'; return false; }
  if (password.value.length < 6) { errors.password = 'Password must be at least 6 characters'; return false; }
  errors.password = '';
  return true;
}
const canSubmit = computed(() =>
  mobilenumber.value.trim() !== '' && password.value.length >= 1
);

function focusPassword() { passwordRef.value?.focus(); }

/* ── Submit ── */
async function onSubmit() {
  const mOk = validateMobile();
  const pOk = validatePassword();
  if (!mOk || !pOk) return;

  loading.value = true;
  try {
    const res = await login(
      { emailOrMobile: mobilenumber.value, password: password.value },
      ["aggregator", "vendor"]
    );

    const role = res.data.user.role;
    if (role === "vendor")      router.push("/vendor/dashboard");
    else if (role === "aggregator") router.push("/aggregator");
    else {
      alert.value = {
        show: true,
        message: "This account belongs to an Aggregator or Vendor. Please use the correct login.",
      };
    }
  } catch (e) {
    alert.value = {
      show: true,
      message: e?.data?.message || "Invalid credentials. Please try again.",
    };
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
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .login-root { flex-direction: row; }
}

/* ─────────────── LEFT PANEL ─────────────── */
.login-left {
  display: none;
  background: linear-gradient(145deg, #0d35b0 0%, #1142d4 45%, #1a52f5 100%);
  position: relative; overflow: hidden;
}
@media (min-width: 768px) {
  .login-left { display: flex; flex: 1; }
}

/* Decorative circles */
.login-left::before {
  content: '';
  position: absolute; top: -80px; right: -80px;
  width: 300px; height: 300px; border-radius: 50%;
  background: rgba(255,255,255,.06);
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
  padding: 40px 44px; gap: 32px;
}

.left-brand {
  display: flex; align-items: center; gap: 10px;
}
.brand-icon {
  width: 36px; height: 36px; border-radius: 10px;
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #fff; flex-shrink: 0;
}
.brand-name {
  font-size: 16px; font-weight: 800; color: #fff;
  letter-spacing: .08em;
}

.illustration-wrap {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 0 20px;
}
.illustration-img {
  width: 100%; max-width: 380px; height: auto;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,.2));
  animation: float 4s ease-in-out infinite;
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}

.left-copy { }
.left-headline {
  font-size: 28px; font-weight: 800; color: #fff; line-height: 1.25;
  margin-bottom: 10px;
}
.left-sub { font-size: 13px; color: rgba(255,255,255,.75); line-height: 1.65; max-width: 380px; }

.feature-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.feature-pill {
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.18);
  padding: 6px 14px; border-radius: 9999px;
  font-size: 12px; font-weight: 600; color: #fff;
}
.feature-pill .mdi { font-size: 14px; }

/* ─────────────── RIGHT PANEL ─────────────── */
.login-right {
  display: flex; align-items: center; justify-content: center;
  background: #f6f6f8; min-height: 100dvh; padding: 32px 20px;
}
@media (min-width: 768px) {
  .login-right { flex: 0 0 440px; min-height: 100dvh; }
}
@media (min-width: 1024px) {
  .login-right { flex: 0 0 480px; }
}

.login-form-wrap {
  width: 100%; max-width: 400px;
  display: flex; flex-direction: column; gap: 22px;
}

/* Mobile brand */
.mobile-brand {
  display: flex; align-items: center; gap: 8px;
  justify-content: center; margin-bottom: 4px;
}
@media (min-width: 768px) { .mobile-brand { display: none; } }
.brand-icon-blue { background: #1142d4; border: none; }
.brand-name-dark { color: #0f172a; }

/* Heading */
.form-heading { }
.form-title {
  font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 6px;
}
.form-sub { font-size: 13px; color: #64748b; line-height: 1.55; }

/* Alert */
.alert-box {
  display: flex; align-items: flex-start; gap: 10px;
  background: #fff7ed; border: 1px solid #fed7aa;
  border-radius: 10px; padding: 12px 14px;
  font-size: 13px; font-weight: 500; color: #92400e;
}
.alert-icon { font-size: 17px; flex-shrink: 0; margin-top: 1px; color: #d97706; }
.alert-msg  { flex: 1; line-height: 1.5; }
.alert-close {
  background: none; border: none; cursor: pointer;
  font-size: 16px; color: #d97706; opacity: .7;
  display: flex; align-items: center; flex-shrink: 0;
  transition: opacity .13s;
}
.alert-close:hover { opacity: 1; }
.t-alert-enter-active, .t-alert-leave-active { transition: all .22s ease; }
.t-alert-enter-from, .t-alert-leave-to { opacity: 0; transform: translateY(-6px); }

/* Form */
.form-fields { display: flex; flex-direction: column; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }

.field-label-row {
  display: flex; align-items: center; justify-content: space-between;
}
.field-label {
  font-size: 11px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: .07em;
}
.forgot-link {
  font-size: 12px; font-weight: 600; color: #1142d4;
  background: none; border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif; padding: 0;
  transition: opacity .13s;
}
.forgot-link:hover { opacity: .75; }

.input-wrap {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 0 12px; height: 46px;
  transition: border-color .15s, box-shadow .15s;
}
.input-wrap.input-focused {
  border-color: #1142d4;
  box-shadow: 0 0 0 3px rgba(17,66,212,.1);
}
.input-wrap.input-error { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,.08); }
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
  display: flex; align-items: center;
  transition: color .13s;
}
.input-clear:hover { color: #94a3b8; }
.pw-toggle {
  background: none; border: none; cursor: pointer;
  font-size: 17px; color: #94a3b8; padding: 0;
  display: flex; align-items: center;
  transition: color .13s;
}
.pw-toggle:hover { color: #475569; }

.field-error-msg {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: #ef4444; margin-top: 1px;
}
.field-error-msg .mdi { font-size: 13px; }

/* Submit button */
.btn-login {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; height: 48px; border-radius: 10px;
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%);
  color: #fff; border: none;
  font-size: 15px; font-weight: 700;
  font-family: 'DM Sans', sans-serif; cursor: pointer;
  box-shadow: 0 4px 18px rgba(17,66,212,.3);
  transition: filter .15s, box-shadow .15s, opacity .15s;
  margin-top: 4px;
}
.btn-login:hover:not(:disabled) {
  filter: brightness(1.07);
  box-shadow: 0 6px 24px rgba(17,66,212,.38);
}
.btn-login:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }
.btn-login .mdi { font-size: 18px; }

@keyframes spin { to { transform: rotate(360deg); } }
.btn-spinner {
  width: 17px; height: 17px;
  border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
  border-radius: 50%; animation: spin .7s linear infinite;
}

/* Footer note */
.form-footer {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 11px; color: #94a3b8; text-align: center;
}
.footer-shield { font-size: 14px; color: #22c55e; }
</style>