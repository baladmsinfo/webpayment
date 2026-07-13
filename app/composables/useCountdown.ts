// composables/useCountdown.ts
// Simple mm:ss countdown used by both OTP screens (customer verification + transfer OTP).
import { ref, onBeforeUnmount } from "vue";

export function useCountdown(seconds = 30) {
  const remaining = ref(seconds);
  const running = ref(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  const clear = () => {
    if (timer) { clearInterval(timer); timer = null; }
    running.value = false;
  };

  const start = (from = seconds) => {
    clear();
    remaining.value = from;
    running.value = true;
    timer = setInterval(() => {
      remaining.value -= 1;
      if (remaining.value <= 0) clear();
    }, 1000);
  };

  onBeforeUnmount(clear);

  return { remaining, running, start, clear };
}
