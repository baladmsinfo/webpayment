// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";
import vuetify,{ transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,

  runtimeConfig: {
    public: {
      API_ENDPOINT: process.env.NUXT_PUBLIC_API_URL,
      BRAND_NAME: process.env.NUXT_PUBLIC_BRAND_NAME,
      // BucksBox web SDK (sdk/websdk). Local dev serves the locally built
      // dist/bucksbox.web.js at /bucksbox-sdk (see $development below);
      // stage/prod point BUCKSBOX_SDK_URL at the deployed copy.
      BUCKSBOX_SDK_URL:
        process.env.NUXT_PUBLIC_BUCKSBOX_SDK_URL || "/bucksbox-sdk/bucksbox.web.js",
      // "staging" | "production" — resolved to a gateway URL inside the SDK.
      BUCKSBOX_ENV: process.env.NUXT_PUBLIC_BUCKSBOX_ENV || "staging",
      // Optional override (e.g. a local gateway); takes precedence over BUCKSBOX_ENV.
      BUCKSBOX_GATEWAY_URL: process.env.NUXT_PUBLIC_BUCKSBOX_GATEWAY_URL || "",
      // SDK credentials — public config, so they end up in the browser bundle.
      BUCKSBOX_CLIENT_ID: process.env.NUXT_PUBLIC_BUCKSBOX_CLIENT_ID || "",
      BUCKSBOX_KEY: process.env.NUXT_PUBLIC_BUCKSBOX_KEY || "",
    },
  },

  // Dev only: expose ../sdk/websdk/dist so `npm run dev` always picks up the
  // latest `npm run build` of the SDK without copying files into public/.
  $development: {
    nitro: {
      publicAssets: [
        {
          dir: fileURLToPath(new URL("../sdk/websdk/dist", import.meta.url)),
          baseURL: "/bucksbox-sdk",
          maxAge: 0,
        },
      ],
    },
  },

  // when enabling ssr option you need to disable inlineStyles and maybe devLogs
  features: {
    inlineStyles: false,
    devLogs: false,
  },
  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ["vuetify"],
    },
  },
});
