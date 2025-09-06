import { ref, computed } from 'vue'

export const useQrTimer = () => {
  const duration = ref(60) // timer duration in seconds
  const timeLeft = ref(duration.value)
  const timerId = ref<NodeJS.Timeout | null>(null)
  const isExpired = computed(() => timeLeft.value <= 0)

  function startTimer(seconds?: number) {
    if (seconds) {
      duration.value = seconds
    }
    timeLeft.value = duration.value
    clearTimer()

    timerId.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        clearTimer()
      }
    }, 1000)
  }

  function clearTimer() {
    if (timerId.value) {
      clearInterval(timerId.value)
      timerId.value = null
    }
  }

  function resetTimer() {
    startTimer(duration.value)
  }

  return {
    duration,
    timeLeft,
    isExpired,
    startTimer,
    resetTimer,
    clearTimer
  }
}