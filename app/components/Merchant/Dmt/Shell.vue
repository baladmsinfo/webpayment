<template>
  <div class="dmt-shell">
    <div class="dmt-header" v-if="title">
      <v-btn v-if="showBack" icon size="36" variant="tonal" :color="BX.primary" class="dmt-back" @click="handleBack">
        <v-icon size="19">mdi-arrow-left</v-icon>
      </v-btn>
      <div class="dmt-header-text">
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <slot name="header-action" />
    </div>

    <Transition name="dmt-fade" mode="out-in">
      <div :key="$route.fullPath" class="dmt-body">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { BX } from "~/utils/dmtTheme";

const props = defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  showBack: { type: Boolean, default: true },
  backTo: { type: String, default: "" },
});
const emit = defineEmits(["back"]);
const router = useRouter();

const handleBack = () => {
  emit("back");
  if (props.backTo) router.push(props.backTo);
  else router.back();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&display=swap');
.dmt-shell {
  font-family: 'DM Sans', sans-serif;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 32px;
}
.dmt-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.dmt-back { flex-shrink: 0; margin-top: 2px; }
.dmt-header-text h1 { font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -.2px; }
.dmt-header-text p { font-size: 12px; color: #64748b; margin-top: 2px; }

.dmt-fade-enter-active, .dmt-fade-leave-active { transition: opacity .22s ease, transform .24s cubic-bezier(.22,.9,.35,1); }
.dmt-fade-enter-from { opacity: 0; transform: translateY(10px); }
.dmt-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
