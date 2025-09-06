// composables/useSnackbar.ts
import { ref } from "vue";

const message = ref<string | null>(null);
const color = ref("success");
const show = ref(false);

export function useSnackbar() {
  function notify(msg: string, type: "success" | "error" = "success") {
    message.value = msg;
    color.value = type === "error" ? "red" : "green";
    show.value = true;
    setTimeout(() => (show.value = false), 3000); // auto-hide
  }

  return { message, color, show, notify };
}

/**
 * 
 * <template>
  <v-app>
    <router-view />

    <!-- Snackbar -->
    <v-snackbar
      v-model="show"
      :color="color"
      location="top"
      timeout="3000"
      multi-line
    >
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useSnackbar } from "@/composables/useSnackbar";

const { message, color, show } = useSnackbar();
</script>

import { useSnackbar } from "@/composables/useSnackbar";
const { notify } = useSnackbar();

usage - notify(`Only ${product.stock} left in stock`, "error");

 */
