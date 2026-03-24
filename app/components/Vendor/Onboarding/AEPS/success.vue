<template>
  <div class="success-root">

    <!-- TOP HEADER -->
    <header class="merchant-header">
      <div class="header-brand">
        <div class="brand-icon">
          <span class="mdi mdi-wallet-outline"></span>
        </div>
        <h2 class="brand-title">Merchant Onboarding</h2>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <div class="success-scroll">
      <div class="success-inner">

        <!-- Confetti burst (CSS-only particles) -->
        <div class="confetti-wrap" aria-hidden="true">
          <span v-for="n in 18" :key="n" class="confetti-dot" :style="confettiStyle(n)"></span>
        </div>

        <!-- Success Card -->
        <div class="success-card">

          <!-- ── Animated Icon ── -->
          <div class="icon-ring">
            <div class="icon-ring__halo"></div>
            <div class="icon-ring__outer">
              <div class="icon-ring__inner">
                <svg class="checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                  <circle class="checkmark__circle" cx="26" cy="26" r="24" fill="none" />
                  <path class="checkmark__check" fill="none" d="M14 27 l8 8 l16-18" />
                </svg>
              </div>
            </div>
          </div>

          <!-- ── Title & Description ── -->
          <div class="success-text">
            <div class="success-eyebrow">
              <span class="mdi mdi-check-decagram eyebrow-icon"></span>
              AEPS Onboarding Complete
            </div>
            <h1 class="success-title">You're All Set!</h1>
            <p class="success-desc">
              Your AEPS onboarding has been successfully completed. Your biometric, PAN, and Aadhaar details have been verified and linked to your merchant account.
            </p>
          </div>

          <!-- ── Journey Summary ── -->
          <div class="journey-card">
            <div class="journey-header">
              <span class="mdi mdi-format-list-checks journey-header-icon"></span>
              <span>Verification Summary</span>
            </div>
            <div class="journey-steps">

              <div class="journey-step journey-step--done">
                <div class="jstep-left">
                  <div class="jstep-icon">
                    <span class="mdi mdi-account-check-outline"></span>
                  </div>
                  <div class="jstep-connector"></div>
                </div>
                <div class="jstep-body">
                  <p class="jstep-title">Merchant Details Verified</p>
                  <p class="jstep-sub">Business & contact information confirmed</p>
                </div>
                <span class="jstep-badge jstep-badge--done">
                  <span class="mdi mdi-check"></span> Done
                </span>
              </div>

              <div class="journey-step journey-step--done">
                <div class="jstep-left">
                  <div class="jstep-icon">
                    <span class="mdi mdi-shield-key-outline"></span>
                  </div>
                  <div class="jstep-connector"></div>
                </div>
                <div class="jstep-body">
                  <p class="jstep-title">OTP Validated</p>
                  <p class="jstep-sub">Mobile number ownership confirmed</p>
                </div>
                <span class="jstep-badge jstep-badge--done">
                  <span class="mdi mdi-check"></span> Done
                </span>
              </div>

              <div class="journey-step journey-step--done">
                <div class="jstep-left">
                  <div class="jstep-icon">
                    <span class="mdi mdi-card-account-details-outline"></span>
                  </div>
                  <div class="jstep-connector"></div>
                </div>
                <div class="jstep-body">
                  <p class="jstep-title">PAN Verified</p>
                  <p class="jstep-sub">PAN card linked for KYC compliance</p>
                </div>
                <span class="jstep-badge jstep-badge--done">
                  <span class="mdi mdi-check"></span> Done
                </span>
              </div>

              <div class="journey-step journey-step--done">
                <div class="jstep-left">
                  <div class="jstep-icon">
                    <span class="mdi mdi-credit-card-scan-outline"></span>
                  </div>
                  <div class="jstep-connector"></div>
                </div>
                <div class="jstep-body">
                  <p class="jstep-title">Aadhaar Verified</p>
                  <p class="jstep-sub">Identity linked to your AEPS account</p>
                </div>
                <span class="jstep-badge jstep-badge--done">
                  <span class="mdi mdi-check"></span> Done
                </span>
              </div>

              <div class="journey-step journey-step--done" style="margin-bottom:0;">
                <div class="jstep-left">
                  <div class="jstep-icon">
                    <span class="mdi mdi-fingerprint"></span>
                  </div>
                  <!-- no connector on last step -->
                </div>
                <div class="jstep-body">
                  <p class="jstep-title">Biometric Captured</p>
                  <p class="jstep-sub">Fingerprint recorded and encrypted</p>
                </div>
                <span class="jstep-badge jstep-badge--done">
                  <span class="mdi mdi-check"></span> Done
                </span>
              </div>

            </div>
          </div>

          <!-- ── What's Next ── -->
          <div class="whats-next">
            <p class="whats-next-title">
              <span class="mdi mdi-information-outline"></span>
              What happens next?
            </p>
            <ul class="whats-next-list">
              <li>
                <span class="mdi mdi-clock-fast"></span>
                Your AEPS account will be activated within <strong>24–48 hours</strong>.
              </li>
              <li>
                <span class="mdi mdi-bell-outline"></span>
                You'll receive an SMS &amp; email confirmation once approved.
              </li>
              <li>
                <span class="mdi mdi-storefront-outline"></span>
                You can start transacting on approval from the merchant dashboard.
              </li>
            </ul>
          </div>

          <!-- ── Status Badge ── -->
          <div class="status-badge">
            <div class="status-badge__dot"></div>
            <span class="status-badge__label">Status:</span>
            <span class="status-badge__value">Onboarding Submitted — Pending Activation</span>
          </div>

          <!-- ── Action Buttons ── -->
          <div class="action-row">
            <button class="btn-primary" @click="goToDashboard">
              <span class="mdi mdi-view-dashboard-outline btn-icon-mdi"></span>
              Go to Dashboard
            </button>
            <button class="btn-secondary" @click="goToMerchants">
              <span class="mdi mdi-account-group-outline btn-icon-mdi"></span>
              View Merchants
            </button>
          </div>

          <!-- ── Footer note ── -->
          <p class="footer-note">
            <span class="mdi mdi-shield-lock-outline"></span>
            Your data is encrypted and stored securely as per RBI guidelines.
          </p>

        </div>

      </div>
    </div>

    <!-- ── Footer ── -->
    <footer class="merchant-footer">
      © 2024 Merchant Portal. All rights reserved. •
      <a href="#" class="footer-link">Privacy Policy</a> •
      <a href="#" class="footer-link">Terms of Service</a>
    </footer>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  merchantId: String,
});

function goToDashboard() {
  router.push('/vendor/dashboard');
}

function goToMerchants() {
  router.push('/vendor/merchants/onboarded');
}

// Generates random style for each confetti particle
function confettiStyle(n) {
  const colors = ['#1142d4', '#22c55e', '#f59e0b', '#e11d48', '#8b5cf6', '#06b6d4'];
  const color = colors[n % colors.length];
  const size = 6 + (n % 5) * 2;
  const angle = (n / 18) * 360;
  const radius = 110 + (n % 3) * 30;
  const delay = (n * 0.07).toFixed(2);
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--color': color,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
  };
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ── Root ───────────────────────────────────────────────────── */
.success-root {
  font-family: 'Inter', sans-serif;
  background: #f6f6f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Header ─────────────────────────────────────────────────── */
.merchant-header {
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 14px 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

@media (min-width: 768px) {
  .merchant-header { padding: 14px 80px; }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: #1142d4;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

/* ── Scroll area ─────────────────────────────────────────────── */
.success-scroll {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px 48px;
  overflow-y: auto;
}

@media (min-width: 640px) {
  .success-scroll { align-items: center; }
}

.success-inner {
  width: 100%;
  max-width: 620px;
  position: relative;
}

/* ── Confetti ────────────────────────────────────────────────── */
.confetti-wrap {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 0;
}

.confetti-dot {
  position: absolute;
  border-radius: 50%;
  background: var(--color);
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: confettiBurst 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes confettiBurst {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  60% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1.2); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1); opacity: 0; }
}

/* ── Card ────────────────────────────────────────────────────── */
.success-card {
  position: relative;
  z-index: 1;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 36px 24px 28px;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.07);
  animation: cardFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (min-width: 640px) {
  .success-card { padding: 44px 40px 36px; }
}

@keyframes cardFadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Icon Ring ───────────────────────────────────────────────── */
.icon-ring {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.icon-ring__halo {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  background: rgba(17, 66, 212, 0.06);
  animation: haloPulse 2.5s ease-in-out infinite;
}

@keyframes haloPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  50%       { transform: translate(-50%, -50%) scale(1.18); opacity: 0; }
}

.icon-ring__outer {
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(17,66,212,0.08), rgba(17,66,212,0.16));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.icon-ring__inner {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1142d4, #2255e8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(17, 66, 212, 0.38);
}

/* ── Checkmark SVG ───────────────────────────────────────────── */
.checkmark {
  width: 36px;
  height: 36px;
}

.checkmark__circle {
  stroke: rgba(255,255,255,0.25);
  stroke-width: 2;
}

.checkmark__check {
  stroke: #ffffff;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: drawCheck 0.5s 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

/* ── Success Text ────────────────────────────────────────────── */
.success-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1142d4;
  background: rgba(17, 66, 212, 0.08);
  padding: 4px 12px;
  border-radius: 9999px;
  margin-bottom: 10px;
}

.eyebrow-icon {
  font-size: 13px;
}

.success-title {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

@media (min-width: 640px) {
  .success-title { font-size: 32px; }
}

.success-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  max-width: 440px;
  margin: 0 auto 28px;
}

/* ── Journey / Verification Summary Card ────────────────────── */
.journey-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  text-align: left;
  margin-bottom: 20px;
}

.journey-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #1142d4;
  margin-bottom: 18px;
}

.journey-header-icon {
  font-size: 15px;
}

.journey-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.journey-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 4px;
}

.jstep-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.jstep-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.journey-step--done .jstep-icon {
  background: linear-gradient(135deg, #1142d4, #2255e8);
  color: #fff;
  box-shadow: 0 3px 10px rgba(17,66,212,0.22);
}

.jstep-connector {
  width: 2px;
  flex: 1;
  min-height: 18px;
  background: linear-gradient(to bottom, #1142d4, rgba(17,66,212,0.1));
  margin: 3px 0;
}

.jstep-body {
  flex: 1;
  min-width: 0;
  padding-top: 6px;
  padding-bottom: 14px;
}

.jstep-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.jstep-sub {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.jstep-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 9999px;
  flex-shrink: 0;
  margin-top: 8px;
}

.jstep-badge--done {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.jstep-badge .mdi {
  font-size: 11px;
}

/* ── What's Next ─────────────────────────────────────────────── */
.whats-next {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 18px;
  text-align: left;
  margin-bottom: 20px;
}

.whats-next-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #92400e;
  margin-bottom: 10px;
}

.whats-next-title .mdi {
  font-size: 14px;
  color: #d97706;
}

.whats-next-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.whats-next-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #78350f;
  line-height: 1.5;
}

.whats-next-list li .mdi {
  font-size: 15px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 1px;
}

.whats-next-list li strong {
  color: #92400e;
}

/* ── Status Badge ────────────────────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f0f4ff;
  border: 1px solid rgba(17,66,212,0.2);
  border-radius: 9999px;
  padding: 7px 16px;
  font-size: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
  50%       { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
}

.status-badge__label {
  color: #64748b;
  font-weight: 500;
}

.status-badge__value {
  color: #0f172a;
  font-weight: 700;
}

/* ── Action Buttons ──────────────────────────────────────────── */
.action-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

@media (min-width: 480px) {
  .action-row {
    flex-direction: row;
    justify-content: center;
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px 28px;
  background: #1142d4;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(17, 66, 212, 0.3);
  transition: filter 0.15s, transform 0.1s;
  white-space: nowrap;
}

.btn-primary:hover {
  filter: brightness(1.1);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px 28px;
  background: #fff;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  white-space: nowrap;
}

.btn-secondary:hover {
  background: #f0f4ff;
  border-color: #1142d4;
  color: #1142d4;
}

.btn-icon-mdi {
  font-size: 16px;
}

@media (max-width: 479px) {
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

/* ── Footer Note ─────────────────────────────────────────────── */
.footer-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.5;
}

.footer-note .mdi {
  font-size: 13px;
  color: #22c55e;
  flex-shrink: 0;
}

/* ── Page Footer ─────────────────────────────────────────────── */
.merchant-footer {
  padding: 28px 24px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
}

.footer-link {
  color: #94a3b8;
  text-decoration: underline;
  transition: color 0.15s;
}

.footer-link:hover {
  color: #1142d4;
}

/* ── Mobile Tweaks ───────────────────────────────────────────── */
@media (max-width: 400px) {
  .success-card {
    padding: 28px 16px 22px;
    border-radius: 12px;
  }

  .icon-ring__outer { width: 76px; height: 76px; }
  .icon-ring__inner { width: 56px; height: 56px; }
  .checkmark { width: 28px; height: 28px; }

  .success-title { font-size: 22px; }
  .success-desc { font-size: 13px; }

  .journey-card { padding: 14px 14px; }
  .jstep-icon { width: 30px; height: 30px; font-size: 14px; }

  .status-badge {
    font-size: 11px;
    padding: 6px 12px;
  }
}
</style>