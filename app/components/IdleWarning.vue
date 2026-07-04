<template>
  <teleport to="body">
    <transition name="idle-fade">
      <div v-if="show" class="idle-overlay" role="dialog" aria-modal="true" aria-labelledby="idle-title">

        <div class="idle-card">

          <div class="idle-icon-wrap">
            <span class="idle-ring"></span>
            <span class="mdi mdi-clock-alert-outline idle-icon"></span>
          </div>

          <div class="idle-text">
            <h2 id="idle-title" class="idle-title">Session Expiring</h2>
            <p class="idle-sub">
              You've been inactive for a while. For your security you will be
              automatically signed out in
            </p>
          </div>

          <div class="idle-countdown" :class="{ 'idle-countdown--urgent': countdown <= 10 }">
            <span class="idle-seconds">{{ countdown }}</span>
            <span class="idle-unit">seconds</span>
          </div>

          <div class="idle-progress-track">
            <div
              class="idle-progress-fill"
              :style="{ width: progressPct + '%' }"
              :class="{ 'idle-progress-fill--urgent': countdown <= 10 }"
            ></div>
          </div>

          <div class="idle-actions">
            <button class="idle-btn idle-btn--primary" @click="$emit('keep-alive')">
              <span class="mdi mdi-check-circle-outline"></span>
              Stay Logged In
            </button>
            <button class="idle-btn idle-btn--ghost" @click="$emit('logout')">
              <span class="mdi mdi-logout"></span>
              Sign Out
            </button>
          </div>

        </div>

      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show:      boolean
  countdown: number
}>()

defineEmits<{
  'keep-alive': []
  'logout':     []
}>()

const WARNING_SECS = 60
const progressPct  = computed(() =>
  Math.max(0, (props.countdown / WARNING_SECS) * 100)
)
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────────────────────────── */
.idle-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  padding: 16px;
}

/* ── Card ────────────────────────────────────────────────────────── */
.idle-card {
  background: #fff;
  border-radius: 20px;
  padding: 36px 32px 28px;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow:
    0 0 0 1px rgba(0,0,0,.05),
    0 24px 64px rgba(0,0,0,.18);
}

/* ── Icon ────────────────────────────────────────────────────────── */
.idle-icon-wrap {
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.idle-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #fef3c7;
  animation: idle-pulse 2s ease-in-out infinite;
}

.idle-icon {
  position: relative;
  font-size: 32px;
  color: #d97706;
}

@keyframes idle-pulse {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%       { transform: scale(1.12); opacity: .7; }
}

/* ── Text ────────────────────────────────────────────────────────── */
.idle-text {
  text-align: center;
}

.idle-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.idle-sub {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

/* ── Countdown ───────────────────────────────────────────────────── */
.idle-countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: color .3s;
}

.idle-seconds {
  font-size: 52px;
  font-weight: 800;
  color: #d97706;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color .3s;
}

.idle-unit {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #94a3b8;
}

.idle-countdown--urgent .idle-seconds {
  color: #ef4444;
}

/* ── Progress bar ────────────────────────────────────────────────── */
.idle-progress-track {
  width: 100%;
  height: 5px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.idle-progress-fill {
  height: 100%;
  background: #d97706;
  border-radius: 99px;
  transition: width 1s linear, background .3s;
}

.idle-progress-fill--urgent {
  background: #ef4444;
}

/* ── Buttons ─────────────────────────────────────────────────────── */
.idle-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.idle-btn {
  width: 100%;
  height: 46px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: filter .15s, opacity .15s;
}

.idle-btn .mdi { font-size: 17px; }

.idle-btn--primary {
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(17, 66, 212, .28);
}

.idle-btn--primary:hover { filter: brightness(1.08); }

.idle-btn--ghost {
  background: #f1f5f9;
  color: #64748b;
}

.idle-btn--ghost:hover { background: #e2e8f0; }

/* ── Transition ──────────────────────────────────────────────────── */
.idle-fade-enter-active,
.idle-fade-leave-active { transition: opacity .22s ease, transform .22s ease; }
.idle-fade-enter-from,
.idle-fade-leave-to     { opacity: 0; transform: scale(.96); }
</style>
