// composables/useNetworkStatus.ts
// Offline detection + a lightweight retry helper shared across the DMT module.
import { ref, onMounted, onBeforeUnmount } from "vue";

const isOnline = ref(true);
let listenerCount = 0;

function handleOnline() { isOnline.value = true; }
function handleOffline() { isOnline.value = false; }

export function useNetworkStatus() {
  onMounted(() => {
    if (typeof navigator !== "undefined") isOnline.value = navigator.onLine;
    if (listenerCount === 0 && typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
    listenerCount++;
  });

  onBeforeUnmount(() => {
    listenerCount--;
    if (listenerCount === 0 && typeof window !== "undefined") {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    }
  });

  return { isOnline };
}

/**
 * Runs `fn` and retries on failure up to `retries` times with a short backoff.
 * Used for the network-flaky calls in the DMT flow (search, remitter details, requery)
 * so a dropped connection doesn't force the agent to re-key the whole step.
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 800): Promise<T> {
  let lastErr: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  throw lastErr;
}
