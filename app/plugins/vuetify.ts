// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import { themes } from "@/utils/theme";

import "vuetify/styles";
import { createVuetify } from "vuetify";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import { fa } from "vuetify/iconsets/fa4";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: "mdi", // mdi by default
      aliases,
      sets: {
        mdi,
        fa,
      },
    },
    theme: {
      defaultTheme: "light",
      themes,
    },
  });

  app.vueApp.use(vuetify);
});
