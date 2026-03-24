<template>
  <div class="success-root">

    <!-- TOP HEADER (matches vo-header) -->
    <header class="vo-header">
      <div class="vo-header__brand">
        <div class="vo-header__icon">
          <span class="mdi mdi-wallet-outline"></span>
        </div>
        <div class="vo-header__text">
          <h2 class="vo-header__title">Vendor Onboarding</h2>
          <p class="vo-header__sub">Onboarding Complete</p>
        </div>
      </div>
      <div class="vo-header__right">
        <div class="vo-header__step-badge">
          <span class="mdi mdi-progress-check"></span>
          Step 5 / 5
        </div>
      </div>
    </header>

    <!-- PROGRESS BAR — 100% complete -->
    <div class="vo-progress-strip">
      <div class="vo-progress-strip__fill" style="width: 100%"></div>
    </div>

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
            <h1 class="success-title">Vendor Onboarding Submitted!</h1>
            <p class="success-desc">
              Your vendor information and all verification documents have been
              successfully submitted. Our team will review and approve your account shortly.
            </p>
          </div>

          <!-- Status Badge -->
          <div class="status-badge">
            <div class="status-badge__dot"></div>
            <span class="status-badge__label">Current Status:</span>
            <span class="status-badge__value">Pending Approval</span>
            <svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/>
            </svg>
          </div>

          <!-- Info Steps — 5-step onboarding journey -->
          <div class="steps-row">

            <!-- Step 1: Business -->
            <div class="step-item step-item--done">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H3m2 0h2M9 7h6M9 11h6M9 15h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="step-item__label">Business</span>
            </div>

            <div class="step-connector"></div>

            <!-- Step 2: Address -->
            <div class="step-item step-item--done">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="step-item__label">Address</span>
            </div>

            <div class="step-connector"></div>

            <!-- Step 3: Addresses -->
            <div class="step-item step-item--done">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="step-item__label">Res & Shop</span>
            </div>

            <div class="step-connector"></div>

            <!-- Step 4: Business Type -->
            <div class="step-item step-item--done">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="step-item__label">Biz Type</span>
            </div>

            <div class="step-connector"></div>

            <!-- Step 5: Docs — active/current final -->
            <div class="step-item step-item--done">
              <div class="step-item__icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="step-item__label">Submitted</span>
            </div>

          </div>

          <!-- Summary Chips Row -->
          <div class="summary-chips">
            <div class="chip chip--green">
              <svg viewBox="0 0 24 24" fill="none" class="chip__icon">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Docs Verified
            </div>
            <div class="chip chip--blue">
              <svg viewBox="0 0 24 24" fill="none" class="chip__icon">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Address Saved
            </div>
            <div class="chip chip--amber">
              <svg viewBox="0 0 24 24" fill="none" class="chip__icon">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Under Review
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-row">
            <button class="btn-primary" @click="goToVendors">
              <svg viewBox="0 0 24 24" fill="none" class="btn-icon">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              View Vendors
            </button>
            <button class="btn-secondary" @click="addAnother">
              <svg viewBox="0 0 24 24" fill="none" class="btn-icon">
                <path d="M12 4v16m8-8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Add Another Vendor
            </button>
          </div>

          <!-- Footer note -->
          <p class="footer-note">
            You can track the approval status on the vendor management page.
          </p>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
const router = useRouter()

function goToVendors() {
  router.push('/aggregator/vendor')
}

function addAnother() {
  router.push('/aggregator/vendor/onboarding')
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

/* ── HEADER (matches vo-header exactly) ───────────────────────── */
.vo-header {
  padding: 0.875rem 1.25rem;
  background: #002d5a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 0.75rem;
}

@media (min-width: 640px)  { .vo-header { padding: 0.875rem 1.75rem; } }
@media (min-width: 1024px) { .vo-header { padding: 0.875rem 2.5rem; } }

.vo-header__brand { display: flex; align-items: center; gap: 0.625rem; min-width: 0; }

.vo-header__icon {
  width: 2.125rem;
  height: 2.125rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.vo-header__text { min-width: 0; }

.vo-header__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vo-header__sub {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vo-header__right { flex-shrink: 0; }

.vo-header__step-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.12);
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ── PROGRESS STRIP ─────────────────────────────────────────────── */
.vo-progress-strip {
  height: 3px;
  background: #d0dae6;
  position: sticky;
  top: 56px;
  z-index: 49;
}

.vo-progress-strip__fill {
  height: 100%;
  background: linear-gradient(90deg, #0052a3, #0077cc);
  transition: width 0.5s ease;
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
  max-width: 600px;
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
.checkmark { width: 36px; height: 36px; }

.checkmark__circle {
  stroke: rgba(255, 255, 255, 0.25);
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

@keyframes drawCheck { to { stroke-dashoffset: 0; } }

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
  max-width: 440px;
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

.status-badge__label { color: #5a7d9a; font-weight: 500; }
.status-badge__value { color: #002d5a; font-weight: 700; }
.status-badge__icon  { width: 16px; height: 16px; color: #f59e0b; flex-shrink: 0; }

/* ── STEPS ROW (5-step, scrollable on tiny screens) ────────────── */
.steps-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 1.5rem;
  padding: 1.125rem 1rem;
  background: #f8fbfe;
  border: 1px solid #d8e6f0;
  border-radius: 10px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.steps-row::-webkit-scrollbar { display: none; }

.step-connector {
  flex: 1;
  height: 2px;
  background: #002d5a;
  min-width: 18px;
  max-width: 48px;
  flex-shrink: 1;
}

.step-connector--pending { background: #d8e6f0; }

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.step-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-item__icon svg { width: 16px; height: 16px; }

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
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.step-item--done .step-item__label    { color: #002d5a; }
.step-item--active .step-item__label  { color: #002d5a; }
.step-item--pending .step-item__label { color: #b8cfe0; }

/* ── SUMMARY CHIPS ─────────────────────────────────────────────── */
.summary-chips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.75rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.chip__icon { width: 12px; height: 12px; flex-shrink: 0; }

.chip--green {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.chip--blue {
  background: rgba(0, 45, 90, 0.08);
  color: #002d5a;
  border: 1px solid rgba(0, 45, 90, 0.18);
}

.chip--amber {
  background: rgba(245, 158, 11, 0.1);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

/* ── ACTION BUTTONS ────────────────────────────────────────────── */
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

.btn-primary:active { transform: scale(0.98); }

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

.btn-icon { width: 16px; height: 16px; flex-shrink: 0; }

/* ── FOOTER NOTE ───────────────────────────────────────────────── */
.footer-note { font-size: 0.775rem; color: #7a9bb5; margin: 0; }

/* ══════════════════════════════════════════════════════════════════
   MOBILE RESPONSIVE — max 480px (small phones)
══════════════════════════════════════════════════════════════════ */
@media (max-width: 480px) {

  .vo-header { padding: 0.75rem 1rem; }
  .vo-header__title { font-size: 0.875rem; }

  .success-scroll {
    padding: 1.25rem 0.875rem 2rem;
    align-items: flex-start;
  }

  .success-card {
    padding: 1.75rem 1.125rem 1.5rem;
    border-radius: 12px;
  }

  .icon-ring__outer { width: 80px; height: 80px; }
  .icon-ring__inner { width: 56px; height: 56px; }
  .checkmark { width: 28px; height: 28px; }
  .icon-ring { margin-bottom: 1.25rem; }

  .success-title { font-size: 1.2rem; }
  .success-desc { font-size: 0.8125rem; margin-bottom: 1.25rem; }

  .status-badge {
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 10px;
    padding: 0.5rem 0.875rem;
    gap: 0.375rem;
    margin-bottom: 1.375rem;
    font-size: 0.75rem;
  }

  .steps-row {
    padding: 0.875rem 0.75rem;
    margin-bottom: 1.25rem;
    justify-content: flex-start;
  }

  .step-item__icon { width: 30px; height: 30px; }
  .step-item__icon svg { width: 13px; height: 13px; }
  .step-item__label { font-size: 0.55rem; letter-spacing: 0.03em; }
  .step-connector { min-width: 12px; max-width: 28px; }

  .summary-chips { gap: 0.375rem; margin-bottom: 1.375rem; }
  .chip { font-size: 0.65rem; padding: 0.3rem 0.6rem; }

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

  .footer-note { font-size: 0.7rem; }
}

/* ══════════════════════════════════════════════════════════════════
   SMALL TABLET — 481px to 767px
══════════════════════════════════════════════════════════════════ */
@media (min-width: 481px) and (max-width: 767px) {

  .success-scroll {
    padding: 1.5rem 1.25rem 2.5rem;
    align-items: flex-start;
  }

  .success-card { padding: 2rem 1.5rem 1.75rem; }

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

  .success-scroll { padding: 2rem 2rem 3rem; }
  .success-inner { max-width: 580px; }
  .success-card { padding: 2.5rem 2.25rem 2rem; }
}

/* ══════════════════════════════════════════════════════════════════
   DESKTOP — 1024px+
══════════════════════════════════════════════════════════════════ */
@media (min-width: 1024px) {

  .success-scroll { padding: 2.5rem 2.5rem 3.5rem; }
  .success-inner { max-width: 620px; }
}
</style>