<template>
  <v-card rounded="lg" elevation="0" class="pa-4 rd-card">
    <!-- Connected state — one or more RD services responded -->
    <template v-if="deviceConnected && deviceInfo">
      <div class="rd-connected-head">
        <v-icon :color="BX.success2" size="20">mdi-check-decagram</v-icon>
        <span class="rd-connected-name">{{ deviceInfo.vendor.name }} {{ deviceInfo.modelInfo }}</span>
        <v-chip size="x-small" :color="deviceInfo.healthy ? BX.success2 : BX.warning" variant="tonal">
          {{ deviceInfo.healthy ? 'Firmware Updated' : 'Firmware update recommended' }}
        </v-chip>
      </div>

      <!-- More than one device answered — let the agent switch -->
      <div v-if="foundDevices.length > 1" class="rd-switch-row">
        <span class="rd-switch-label">{{ foundDevices.length }} devices connected:</span>
        <v-chip
          v-for="d in foundDevices"
          :key="d.vendor.id"
          size="small"
          class="mr-2 mb-1"
          :variant="d.vendor.id === deviceInfo.vendor.id ? 'flat' : 'outlined'"
          :color="d.vendor.id === deviceInfo.vendor.id ? BX.primary : undefined"
          @click="chooseDevice(d)"
        >
          {{ d.vendor.name }}
        </v-chip>
      </div>
      <a v-else class="rd-check-others" @click="checkOtherDevices">
        {{ checkingOthers ? 'Checking…' : 'Check for other connected devices' }}
      </a>

      <v-divider class="my-3" />

      <div class="rd-row"><span class="rd-k">RD Status</span><span class="rd-v ok">Connected</span></div>
      <div class="rd-row"><span class="rd-k">Driver Version</span><span class="rd-v mono">{{ deviceInfo.driverVersion }}</span></div>
      <div class="rd-row">
        <span class="rd-k">Device Health</span>
        <span class="rd-v" :class="deviceInfo.healthy ? 'ok' : 'warn'">{{ deviceInfo.healthy ? 'Healthy' : 'Needs Attention' }}</span>
      </div>

      <v-btn block variant="tonal" :color="BX.primary" class="mt-3 reconnect-btn" :loading="scanning" @click="rescan">
        <v-icon start size="16">mdi-refresh</v-icon>Reconnect
      </v-btn>
    </template>

    <!-- Not connected yet — let the agent pick which RD service to use -->
    <template v-else>
      <p class="rd-title">Select RD Service</p>
      <v-radio-group v-model="pendingVendorId" density="compact" hide-details class="rd-radio-group">
        <v-radio v-for="v in RD_VENDORS" :key="v.id" :value="v.id" :label="v.name" :color="BX.primary" />
      </v-radio-group>

      <v-alert v-if="scanError" type="warning" variant="tonal" density="compact" class="mt-2 mb-1" :text="scanError" />

      <v-btn block variant="tonal" :color="BX.primary" class="mt-2 reconnect-btn" :loading="scanning" @click="connect">
        <v-icon start size="16">mdi-fingerprint</v-icon>Detect Device
      </v-btn>
    </template>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRdService, RD_VENDORS } from "~/composables/useRdService";
import { BX } from "~/utils/dmtTheme";

const emit = defineEmits(["ready"]);

const { deviceConnected, deviceInfo, selectedVendor, selectVendor, detectDevice, findFirstConnectedVendor, scanAllVendors } = useRdService();

const pendingVendorId = ref(selectedVendor.value.id);
const scanning = ref(false);
const checkingOthers = ref(false);
const scanError = ref("");
const foundDevices = ref([]);

const chooseDevice = (info) => {
  selectVendor(info.vendor);
  deviceInfo.value = info;
  deviceConnected.value = true;
  emit("ready", info);
};

/** Default scan — tries vendors one at a time and stops at the first match, so a normal
 *  single-device setup never logs connection-refused noise for the other three ports. */
const rescan = async () => {
  scanning.value = true;
  foundDevices.value = [];
  try {
    const info = await findFirstConnectedVendor();
    if (info) {
      foundDevices.value = [info];
      chooseDevice(info);
    } else {
      deviceConnected.value = false;
      deviceInfo.value = null;
    }
  } finally {
    scanning.value = false;
  }
};

/** Opt-in — explicitly probes every vendor port to populate the multi-device switcher.
 *  Only run when the agent asks for it, since it always logs one console error per
 *  vendor that isn't actually connected. */
const checkOtherDevices = async () => {
  checkingOthers.value = true;
  try {
    foundDevices.value = await scanAllVendors();
  } finally {
    checkingOthers.value = false;
  }
};

const connect = async () => {
  scanError.value = "";
  scanning.value = true;
  selectVendor(RD_VENDORS.find((v) => v.id === pendingVendorId.value) ?? RD_VENDORS[0]);
  try {
    const res = await detectDevice();
    if (res.ok) emit("ready", res.info);
    else scanError.value = res.message;
  } finally {
    scanning.value = false;
  }
};

onMounted(rescan);

defineExpose({ rescan });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&family=DM+Mono:wght@600;700&display=swap');
.rd-card { border: 1px solid #e6eaf1 !important; box-shadow: 0 1px 6px rgba(15,23,42,.05) !important; font-family: 'DM Sans', sans-serif; }
.rd-title { font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.rd-radio-group :deep(.v-selection-control) { min-height: 34px; }

.rd-connected-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rd-connected-name { font-size: 13.5px; font-weight: 800; color: #0f172a; }

.rd-switch-row { margin-top: 10px; display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
.rd-switch-label { font-size: 11px; color: #64748b; margin-right: 4px; width: 100%; }
.rd-check-others { display: inline-block; margin-top: 8px; font-size: 11.5px; font-weight: 700; color: #1142d4; cursor: pointer; }

.rd-row { display: flex; justify-content: space-between; padding: 6px 0; }
.rd-k { font-size: 12px; color: #64748b; }
.rd-v { font-size: 12.5px; font-weight: 700; color: #0f172a; }
.rd-v.ok { color: #059669; }
.rd-v.warn { color: #d97706; }
.mono { font-family: 'DM Mono', monospace; }
.reconnect-btn { text-transform: none; font-weight: 700; }
</style>
