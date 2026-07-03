// composables/useIdleTimer.ts
//
// Tracks user activity across the dashboard. After IDLE_MS of inactivity a
// countdown warning is shown. If the user doesn't respond within WARNING_SECS
// they are automatically logged out.
//
// Usage: call useIdleTimer() inside any layout setup() — the composable
// registers/cleans up its own event listeners via onMounted / onBeforeUnmount.

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUsersApi } from '~/composables/apis/useUsersApi'

const IDLE_MS      = 15 * 60 * 1000   // 15 minutes of inactivity → show warning
const WARNING_SECS = 60                 // seconds to act before auto-logout

const TRACKED_EVENTS = [
  'mousemove', 'mousedown', 'keydown',
  'touchstart', 'scroll', 'wheel', 'click',
] as const

export function useIdleTimer() {
  const { logout } = useUsersApi()

  const showWarning = ref(false)
  const countdown   = ref(WARNING_SECS)

  let idleHandle:      ReturnType<typeof setTimeout>  | null = null
  let countdownHandle: ReturnType<typeof setInterval> | null = null

  // ── countdown ────────────────────────────────────────────────────────────

  function stopCountdown() {
    if (countdownHandle) { clearInterval(countdownHandle); countdownHandle = null }
  }

  function startCountdown() {
    countdown.value   = WARNING_SECS
    showWarning.value = true
    countdownHandle   = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) { stopCountdown(); doLogout() }
    }, 1_000)
  }

  // ── logout ───────────────────────────────────────────────────────────────

  async function doLogout() {
    showWarning.value = false
    stopCountdown()
    if (idleHandle) clearTimeout(idleHandle)
    await logout()
    navigateTo('/')
  }

  // ── activity reset ───────────────────────────────────────────────────────

  function resetTimer() {
    if (idleHandle) clearTimeout(idleHandle)
    if (showWarning.value) {
      // Activity arrived while warning was up — dismiss it
      showWarning.value = false
      stopCountdown()
    }
    idleHandle = setTimeout(startCountdown, IDLE_MS)
  }

  function keepAlive() {
    showWarning.value = false
    stopCountdown()
    resetTimer()
  }

  // ── lifecycle ────────────────────────────────────────────────────────────

  function start() {
    TRACKED_EVENTS.forEach(e =>
      document.addEventListener(e, resetTimer, { passive: true })
    )
    resetTimer()
  }

  function stop() {
    TRACKED_EVENTS.forEach(e => document.removeEventListener(e, resetTimer))
    if (idleHandle)      clearTimeout(idleHandle)
    stopCountdown()
  }

  onMounted(start)
  onBeforeUnmount(stop)

  return { showWarning, countdown, keepAlive, doLogout }
}
