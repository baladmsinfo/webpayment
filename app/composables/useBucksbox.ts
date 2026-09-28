// composables/useBucksbox.ts
// Loads the BucksBox web SDK (sdk/websdk → bucksbox.web.js) once per page and
// opens its checkout widget. The script URL and gateway environment come from
// runtimeConfig, so local / stage / production only differ by .env values.

type BucksboxStatus = "success" | "failure" | string;

export interface BucksboxResult {
  status: BucksboxStatus;
  [key: string]: unknown;
}

export interface BucksboxOptions {
  clientId?: string;
  key?: string;
  merchantId?: string;
  service?: string;
  amount?: number;
  token?: string;
  [key: string]: unknown;
}

interface BucksboxInstance {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    bucksbox?: new (options: Record<string, unknown>) => BucksboxInstance;
    bucksboxHandler?: (cb: (e: { data: BucksboxResult }) => void) => () => void;
  }
}

let loader: Promise<void> | null = null;
let unsubscribe: (() => void) | null = null;

function loadScript(src: string): Promise<void> {
  if (window.bucksbox) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loader = null; // allow a retry on the next call
      script.remove();
      reject(new Error(`Failed to load BucksBox SDK from ${src}`));
    };
    document.head.appendChild(script);
  });
  return loader;
}

export function useBucksbox() {
  const config = useRuntimeConfig().public;

  const load = () => loadScript(config.BUCKSBOX_SDK_URL as string);

  const open = async (
    options: BucksboxOptions,
    onResult?: (result: BucksboxResult) => void,
  ) => {
    await load();

    const gatewayUrl = config.BUCKSBOX_GATEWAY_URL as string;
    const instance = new window.bucksbox!({
      ...(gatewayUrl
        ? { gatewayUrl }
        : { environment: config.BUCKSBOX_ENV as string }),
      clientId: config.BUCKSBOX_CLIENT_ID as string,
      key: config.BUCKSBOX_KEY as string,
      ...options,
    });
    instance.open();

    // bucksboxHandler is a global registry, so drop the previous open()'s
    // listener or every earlier callback fires again on the next result.
    unsubscribe?.();
    unsubscribe = window.bucksboxHandler?.((e) => {
      const result = e.data ?? { status: "failure" };
      // Only close on success. On failure the widget stays open showing the
      // error banner with a retry; a ✕ dismissal closes itself.
      if (result.status === "success") {
        instance.close();
        unsubscribe?.();
        unsubscribe = null;
      }
      onResult?.(result);
    }) ?? null;

    return instance;
  };

  return { load, open };
}
