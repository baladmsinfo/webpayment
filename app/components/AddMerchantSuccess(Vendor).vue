<template>
  <div class="success-root">

    <!-- TOP HEADER (matches merchant-header) -->
    <header class="merchant-header">
      <h2 class="header-title">Merchant Creation</h2>
    </header>

    <!-- MAIN CONTENT -->
    <div class="success-scroll">
      <div class="success-inner">

        <!-- Success Card -->
        <div class="success-card">

          <!-- Animated Icon -->
          <div class="icon-ring">
            <div class="icon-ring__outer">
              <div class="icon-ring__inner">
                <svg class="checkmark" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                  <circle class="checkmark__circle" cx="26" cy="26" r="24" fill="none" />
                  <path class="checkmark__check" fill="none" d="M14 26 l9 9 l15-18" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Title & Description -->
          <div class="success-text">
            <h1 class="success-title">Merchant Submitted!</h1>
            <p class="success-desc">
              Your merchant information has been successfully submitted.
              Proceed onboarding on the merchant page.
            </p>
          </div>

          <!-- Status Badge -->
          <div class="status-badge">
            <div class="status-badge__dot"></div>
            <span class="status-badge__label">Current Status:</span>
            <span class="status-badge__value">Merchant Created</span>
            <svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/>
            </svg>
          </div>

          <!-- Info Steps -->
          <div class="steps-row">
            <div class="step-item step-item--done">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="step-item__label">Submitted</span>
            </div>
            <div class="step-connector"></div>
            <div class="step-item step-item--active">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="step-item__label">Start Onboard</span>
            </div>
            <div class="step-connector step-connector--pending"></div>
            <div class="step-item step-item--pending">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="step-item__label">Approved</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-row">
            <button class="btn-primary" @click="goToPending">
              <svg viewBox="0 0 24 24" fill="none" class="btn-icon"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              View Merchants
            </button>
            <button class="btn-secondary" @click="addAnother">
              <svg viewBox="0 0 24 24" fill="none" class="btn-icon"><path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Add Another Merchant
            </button>
          </div>

          <!-- Footer note -->
          <p class="footer-note">
            You can verify merchant information at merchant page.
          </p>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
const router = useRouter()

function goToPending() {
  router.push('/vendor/merchants/pending')
}

function addAnother() {
  router.push('/vendor/merchants/create')
}
</script>

<style scoped>
/* ── ROOT ──────────────────────────────────────────────────────── */
.success-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #f0f4f8;
}

/* ── HEADER (identical to merchant-header) ─────────────────────── */
.merchant-header {
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid #d0dae6;
  display: flex;
  align-items: center;
  background: #002d5a;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.01em;
}

/* ── SCROLL AREA ───────────────────────────────────────────────── */
.success-scroll {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem 3rem;
  overflow-y: auto;
}

.success-inner {
  width: 100%;
  max-width: 560px;
}

/* ── CARD ──────────────────────────────────────────────────────── */
.success-card {
  background: #ffffff;
  border: 1px solid #d8e6f0;
  border-radius: 14px;
  padding: 2.5rem 2rem 2rem;
  text-align: center;
  animation: cardFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes cardFadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── ICON RING ─────────────────────────────────────────────────── */
.icon-ring {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.icon-ring__outer {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(0, 45, 90, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ringPulse 2.4s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 45, 90, 0.12); }
  50%       { box-shadow: 0 0 0 12px rgba(0, 45, 90, 0.0); }
}

.icon-ring__inner {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #002d5a;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 45, 90, 0.30);
}

/* ── SVG CHECKMARK ANIMATION ───────────────────────────────────── */
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
  stroke-dasharray: 35;
  stroke-dashoffset: 35;
  animation: drawCheck 0.45s 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

/* ── TEXT ──────────────────────────────────────────────────────── */
.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #002d5a;
  margin: 0 0 0.625rem;
  letter-spacing: -0.01em;
}

.success-desc {
  font-size: 0.875rem;
  color: #5a7d9a;
  line-height: 1.65;
  margin: 0 0 1.75rem;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}

/* ── STATUS BADGE ──────────────────────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f0f6fb;
  border: 1px solid #c5d8e8;
  border-radius: 99px;
  padding: 0.5rem 1.125rem;
  margin-bottom: 2rem;
  font-size: 0.8125rem;
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
  animation: dotPulse 1.8s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2); }
  50%       { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.0); }
}

.status-badge__label {
  color: #5a7d9a;
  font-weight: 500;
}

.status-badge__value {
  color: #002d5a;
  font-weight: 700;
}

.status-badge__icon {
  width: 16px;
  height: 16px;
  color: #f59e0b;
  flex-shrink: 0;
}

/* ── STEPS ROW ─────────────────────────────────────────────────── */
.steps-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: #f8fbfe;
  border: 1px solid #d8e6f0;
  border-radius: 10px;
}

.step-connector {
  flex: 1;
  height: 2px;
  background: #002d5a;
  max-width: 60px;
}

.step-connector--pending {
  background: #d8e6f0;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.step-item__icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-item__icon svg {
  width: 18px;
  height: 18px;
}

.step-item--done .step-item__icon {
  background: #002d5a;
  color: #fff;
}

.step-item--active .step-item__icon {
  background: #e8f4fd;
  border: 2px solid #002d5a;
  color: #002d5a;
  animation: activeGlow 1.8s ease-in-out infinite;
}

@keyframes activeGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 45, 90, 0.15); }
  50%       { box-shadow: 0 0 0 8px rgba(0, 45, 90, 0.0); }
}

.step-item--pending .step-item__icon {
  background: #f0f4f8;
  color: #b8cfe0;
  border: 2px dashed #c5d8e8;
}

.step-item__label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.step-item--done .step-item__label   { color: #002d5a; }
.step-item--active .step-item__label { color: #002d5a; }
.step-item--pending .step-item__label{ color: #b8cfe0; }

/* ── ACTIONS ───────────────────────────────────────────────────── */
.action-row {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
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
  gap: 0.45rem;
  padding: 0.7rem 1.625rem;
  background: #002d5a;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 3px 10px rgba(0, 45, 90, 0.28);
  transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #003d7a;
  box-shadow: 0 5px 16px rgba(0, 45, 90, 0.35);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.7rem 1.625rem;
  background: #fff;
  border: 1.5px solid #c5d8e8;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3a5f7a;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
  white-space: nowrap;
}

.btn-secondary:hover {
  background: #f0f6fb;
  border-color: #002d5a;
  color: #002d5a;
}

.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ── FOOTER NOTE ───────────────────────────────────────────────── */
.footer-note {
  font-size: 0.775rem;
  color: #7a9bb5;
  margin: 0;
}

/* ══════════════════════════════════════════════════════════════════
   MOBILE RESPONSIVE — max 480px (small phones)
══════════════════════════════════════════════════════════════════ */
@media (max-width: 480px) {

  /* Header */
  .merchant-header {
    padding: 0.75rem 1rem;
  }

  .header-title {
    font-size: 0.875rem;
  }

  /* Scroll area — tighter padding */
  .success-scroll {
    padding: 1.25rem 0.875rem 2rem;
    align-items: flex-start;
  }

  /* Card — less padding, full-width feel */
  .success-card {
    padding: 1.75rem 1.125rem 1.5rem;
    border-radius: 12px;
  }

  /* Icon — slightly smaller */
  .icon-ring__outer {
    width: 80px;
    height: 80px;
  }

  .icon-ring__inner {
    width: 56px;
    height: 56px;
  }

  .checkmark {
    width: 28px;
    height: 28px;
  }

  .icon-ring {
    margin-bottom: 1.25rem;
  }

  /* Title */
  .success-title {
    font-size: 1.25rem;
  }

  /* Description */
  .success-desc {
    font-size: 0.8125rem;
    margin-bottom: 1.25rem;
  }

  /* Status badge — wrap on very small screens */
  .status-badge {
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 10px;
    padding: 0.5rem 0.875rem;
    gap: 0.375rem;
    margin-bottom: 1.375rem;
    font-size: 0.75rem;
  }

  /* Steps row */
  .steps-row {
    padding: 1rem 0.75rem;
    margin-bottom: 1.375rem;
    gap: 0;
  }

  .step-item__icon {
    width: 32px;
    height: 32px;
  }

  .step-item__icon svg {
    width: 15px;
    height: 15px;
  }

  .step-item__label {
    font-size: 0.6rem;
    letter-spacing: 0.04em;
  }

  .step-connector {
    max-width: 32px;
  }

  /* Action buttons — full width stacked */
  .action-row {
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 1rem;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-radius: 8px;
  }

  .footer-note {
    font-size: 0.7rem;
  }
}

/* ══════════════════════════════════════════════════════════════════
   SMALL TABLET — 481px to 767px
══════════════════════════════════════════════════════════════════ */
@media (min-width: 481px) and (max-width: 767px) {

  .success-scroll {
    padding: 1.5rem 1.25rem 2.5rem;
    align-items: flex-start;
  }

  .success-card {
    padding: 2rem 1.5rem 1.75rem;
  }

  .action-row {
    flex-direction: row;
    justify-content: center;
    gap: 0.625rem;
  }

  .btn-primary,
  .btn-secondary {
    flex: 1;
    max-width: 220px;
  }
}

/* ══════════════════════════════════════════════════════════════════
   TABLET — 768px to 1023px
══════════════════════════════════════════════════════════════════ */
@media (min-width: 768px) and (max-width: 1023px) {

  .success-scroll {
    padding: 2rem 2rem 3rem;
  }

  .success-inner {
    max-width: 540px;
  }

  .success-card {
    padding: 2.5rem 2.25rem 2rem;
  }
}

/* ══════════════════════════════════════════════════════════════════
   DESKTOP — 1024px+
══════════════════════════════════════════════════════════════════ */
@media (min-width: 1024px) {

  .success-scroll {
    padding: 2.5rem 2.5rem 3.5rem;
  }

  .success-inner {
    max-width: 580px;
  }
}
</style>