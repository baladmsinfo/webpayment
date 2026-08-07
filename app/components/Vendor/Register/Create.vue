<template>
  <div class="register-root">

    <!-- ── LEFT PANEL (desktop) ── -->
    <div class="reg-left">
      <div class="left-inner">
        <div class="left-brand">
          <span class="brand-name">BUCKSBOX</span>
        </div>

        <div class="left-copy">
          <h2 class="left-headline">Become a<br />Bucksbox Partner</h2>
          <p class="left-sub">
            Register as a distributor to onboard merchants, track commissions and grow your network — all from a
            single dashboard.
          </p>
        </div>

        <div class="steps-recap">
          <div v-for="(title, i) in stepTitles" :key="title" class="steps-recap-item"
            :class="{ 'is-done': step > i + 1, 'is-active': step === i + 1 }">
            <div class="steps-recap-dot">
              <v-icon v-if="step > i + 1" size="13">mdi-check</v-icon>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="steps-recap-label">{{ title }}</span>
          </div>
        </div>

        <div class="feature-pills">
          <div class="feature-pill"><span class="mdi mdi-account-group-outline"></span> Onboard Merchants</div>
          <div class="feature-pill"><span class="mdi mdi-percent-outline"></span> Earn Commission</div>
          <div class="feature-pill"><span class="mdi mdi-cash-fast"></span> Fast Payouts</div>
          <div class="feature-pill"><span class="mdi mdi-headset"></span> Dedicated Support</div>
        </div>
      </div>
    </div>

    <!-- ── RIGHT PANEL ── -->
    <div class="reg-right">
      <div class="reg-form-wrap">

        <!-- Mobile brand -->
        <div class="mobile-brand">
          <div class="brand-icon-solid"><span class="mdi mdi-account-tie-outline"></span></div>
          <span class="brand-name brand-name-dark">BUCKSBOX</span>
        </div>

        <!-- Header -->
        <div class="reg-head">
          <button v-if="step > 1" class="back-btn" @click="prevStep">
            <v-icon size="18">mdi-arrow-left</v-icon>
          </button>
          <div class="reg-head-text">
            <p class="header-label">STEP {{ step }} OF {{ totalSteps }}</p>
            <h1 class="header-title">{{ stepTitle }}</h1>
          </div>
          <div class="step-dots">
            <span v-for="s in totalSteps" :key="s" class="dot" :class="{ active: s <= step }" />
          </div>
        </div>

        <div class="progress-track">
          <div class="progress-fill" :style="{ width: (step / totalSteps * 100) + '%' }" />
        </div>

        <!-- Scrollable body -->
        <div class="reg-body">

          <!-- ─────────── STEP 1: Business Details ─────────── -->
          <div v-if="step === 1" class="step-pane">
            <p class="step-desc">Set up your distributor identity, primary contact &amp; login password.</p>

            <v-row dense>
              <v-col cols="12">
                <label class="field-label">DISTRIBUTOR / COMPANY NAME</label>
                <v-text-field v-model.trim="form.name" placeholder="Enter distributor or company name"
                  variant="outlined" density="comfortable" prepend-inner-icon="mdi-office-building-outline"
                  class="reg-field" hide-details="auto" :error-messages="errors.name ? [errors.name] : []"
                  @update:model-value="clearError('name')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">PRIMARY EMAIL</label>
                <v-text-field v-model.trim="form.primary_email_id" placeholder="example@company.com"
                  variant="outlined" density="comfortable" prepend-inner-icon="mdi-email-outline" class="reg-field"
                  hide-details="auto" :error-messages="errors.primary_email_id ? [errors.primary_email_id] : []"
                  @update:model-value="clearError('primary_email_id')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">PRIMARY MOBILE</label>
                <v-text-field v-model="form.primary_mobile" placeholder="10-digit mobile" prefix="+91"
                  variant="outlined" density="comfortable" prepend-inner-icon="mdi-phone-outline" class="reg-field"
                  hide-details="auto" maxlength="10" :error-messages="errors.primary_mobile ? [errors.primary_mobile] : []"
                  @update:model-value="clearError('primary_mobile')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">PASSWORD</label>
                <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'"
                  placeholder="Min. 8 characters" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  @click:append-inner="showPassword = !showPassword" class="reg-field" hide-details="auto"
                  :error-messages="errors.password ? [errors.password] : []"
                  @update:model-value="clearError('password')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">CONFIRM PASSWORD</label>
                <v-text-field v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Re-enter password" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword" class="reg-field" hide-details="auto"
                  :error-messages="errors.confirmPassword ? [errors.confirmPassword] : []"
                  @update:model-value="clearError('confirmPassword')" />
              </v-col>
            </v-row>

            <!-- Password strength -->
            <div v-if="form.password" class="strength-bar">
              <div v-for="i in 4" :key="i" class="seg" :class="strengthClass(i)" />
            </div>
            <p v-if="form.password" class="strength-label">{{ strengthLabel }}</p>
          </div>

          <!-- ─────────── STEP 2: Official Address ─────────── -->
          <div v-if="step === 2" class="step-pane">
            <p class="step-desc">Registered office address for your distributor account.</p>

            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.official_address" placeholder="Door No / Office Address"
                  variant="outlined" density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.official_address ? [errors.official_address] : []"
                  @update:model-value="clearError('official_address')" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.address1" placeholder="Street Address Line 1" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.address1 ? [errors.address1] : []"
                  @update:model-value="clearError('address1')" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.address2" placeholder="Street Address Line 2" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.address2 ? [errors.address2] : []"
                  @update:model-value="clearError('address2')" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.address3" placeholder="Landmark (optional)" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.phone" placeholder="Contact number (optional)" prefix="+91"
                  variant="outlined" density="comfortable" class="reg-field" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-combobox v-model="opPincode" :items="opPincodeOptions" item-title="pincode" item-value="pincode"
                  placeholder="Search pincode" variant="outlined" density="comfortable" return-object
                  class="reg-field" hide-details="auto" @update:search="opPinSearch" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.pincode" placeholder="Pincode" variant="outlined"
                  density="comfortable" disabled :error-messages="errors.pincode ? [errors.pincode] : []"
                  class="reg-field reg-field--disabled" hide-details="auto" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.city" placeholder="City" variant="outlined" density="comfortable"
                  disabled :error-messages="errors.city ? [errors.city] : []" class="reg-field reg-field--disabled"
                  hide-details="auto" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.state" placeholder="State" variant="outlined" density="comfortable"
                  disabled :error-messages="errors.state ? [errors.state] : []" class="reg-field reg-field--disabled"
                  hide-details="auto" />
              </v-col>
            </v-row>
          </div>

          <!-- ─────────── STEP 3: Address Details ─────────── -->
          <div v-if="step === 3" class="step-pane">
            <p class="step-desc">Residential and visitor / shop address information.</p>

            <!-- Residential toggle -->
            <div class="address-toggle-card">
              <div class="address-toggle-info">
                <div class="address-toggle-icon-wrap"><v-icon size="19">mdi-home-outline</v-icon></div>
                <div>
                  <p class="address-toggle-title">Residential Address</p>
                  <p class="address-toggle-sub">Same as official address?</p>
                </div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="sameAsOfficialResidential" @change="copyOfficialToResidential"
                  class="toggle-input" />
                <div class="toggle-track">
                  <div class="toggle-thumb" />
                </div>
              </label>
            </div>

            <v-row v-if="!sameAsOfficialResidential" dense class="mt-3">
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.residential_address" placeholder="Door No / Residential"
                  variant="outlined" density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.residential_address ? [errors.residential_address] : []" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.res_address1" placeholder="Street Address 1" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.res_address1 ? [errors.res_address1] : []" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.res_address2" placeholder="Street Address 2" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.res_address2 ? [errors.res_address2] : []" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.res_mobile" placeholder="Residential mobile (optional)" prefix="+91"
                  variant="outlined" density="comfortable" class="reg-field" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-combobox v-model="resPincode" :items="resPincodeOptions" item-title="pincode"
                  item-value="pincode" placeholder="Search pincode" variant="outlined" density="comfortable"
                  return-object class="reg-field" hide-details="auto" @update:search="resPinSearch" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.res_pincode" placeholder="Pincode" variant="outlined"
                  density="comfortable" disabled class="reg-field reg-field--disabled" hide-details="auto"
                  :error-messages="errors.res_pincode ? [errors.res_pincode] : []" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.res_city" placeholder="City" variant="outlined"
                  density="comfortable" disabled class="reg-field reg-field--disabled" hide-details="auto"
                  :error-messages="errors.res_city ? [errors.res_city] : []" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.res_state" placeholder="State" variant="outlined"
                  density="comfortable" disabled class="reg-field reg-field--disabled" hide-details="auto"
                  :error-messages="errors.res_state ? [errors.res_state] : []" />
              </v-col>
            </v-row>

            <!-- Visitor toggle -->
            <div class="address-toggle-card mt-4">
              <div class="address-toggle-info">
                <div class="address-toggle-icon-wrap"><v-icon size="19">mdi-storefront-outline</v-icon></div>
                <div>
                  <p class="address-toggle-title">Visitor / Shop Address</p>
                  <p class="address-toggle-sub">Same as official address?</p>
                </div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="sameAsOfficialVisitor" @change="copyOfficialToVisitor"
                  class="toggle-input" />
                <div class="toggle-track">
                  <div class="toggle-thumb" />
                </div>
              </label>
            </div>

            <v-row v-if="!sameAsOfficialVisitor" dense class="mt-3">
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.vister_address" placeholder="Door No / Visitor" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.vister_address ? [errors.vister_address] : []" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.v_address1" placeholder="Street Address 1" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.v_address1 ? [errors.v_address1] : []" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.v_address2" placeholder="Street Address 2" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.v_address2 ? [errors.v_address2] : []" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="form.v_mobile" placeholder="Visitor mobile (optional)" prefix="+91"
                  variant="outlined" density="comfortable" class="reg-field" hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-combobox v-model="vPincode" :items="vPincodeOptions" item-title="pincode" item-value="pincode"
                  placeholder="Search pincode" variant="outlined" density="comfortable" return-object
                  class="reg-field" hide-details="auto" @update:search="vPinSearch" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.v_pincode" placeholder="Pincode" variant="outlined"
                  density="comfortable" disabled class="reg-field reg-field--disabled" hide-details="auto"
                  :error-messages="errors.v_pincode ? [errors.v_pincode] : []" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.v_city" placeholder="City" variant="outlined" density="comfortable"
                  disabled class="reg-field reg-field--disabled" hide-details="auto"
                  :error-messages="errors.v_city ? [errors.v_city] : []" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.v_state" placeholder="State" variant="outlined"
                  density="comfortable" disabled class="reg-field reg-field--disabled" hide-details="auto"
                  :error-messages="errors.v_state ? [errors.v_state] : []" />
              </v-col>
            </v-row>
          </div>

          <!-- ─────────── STEP 4: Select Services ─────────── -->
          <div v-if="step === 4" class="step-pane">
            <p class="step-desc">
              Choose the services you'll offer. A default provider is assigned automatically for each. Optional —
              you can skip and add these later from your dashboard.
            </p>

            <div v-if="loadingServices" class="svc-loading">Loading available services…</div>

            <div v-else-if="!serviceList.length" class="svc-empty">No services are available to select right now — you can skip this step.</div>

            <div v-else class="svc-grid">
              <div v-for="svc in serviceList" :key="svc.id" class="svc-card"
                :class="{ 'svc-card--selected': serviceSelections[svc.id]?.selected }">
                <div class="svc-card__head" @click="toggleService(svc)">
                  <div class="svc-checkbox" :class="{ 'svc-checkbox--on': serviceSelections[svc.id]?.selected }">
                    <v-icon v-if="serviceSelections[svc.id]?.selected" size="13">mdi-check</v-icon>
                  </div>
                  <v-icon size="18" color="#1142d4">{{ serviceIcon(svc.service) }}</v-icon>
                  <span class="svc-card__name">{{ svc.service }}</span>
                </div>

                <!-- <div v-if="serviceSelections[svc.id]?.selected" class="svc-card__body">
                  <span v-if="serviceSelections[svc.id]?.interfaceName" class="svc-provider-badge">
                    Provider: {{ serviceSelections[svc.id].interfaceName }}
                  </span>
                  <p v-else class="svc-card__hint">No provider linked to this service yet.</p>
                </div> -->
              </div>
            </div>

            <p v-if="selectedServiceCount" class="svc-summary">
              {{ selectedServiceCount }} service{{ selectedServiceCount > 1 ? 's' : '' }} selected — these will be
              linked to your account as pending until an admin activates them.
            </p>
          </div>

        </div>

        <!-- Footer actions -->
        <div class="reg-footer">
          <button class="btn-next" :disabled="submitting" @click="handleNext">
            <span v-if="submitting" class="btn-spinner" />
            <template v-else>
              <span>{{ step === totalSteps ? 'Create Partner Account' : 'Continue' }}</span>
              <v-icon size="18">mdi-arrow-right</v-icon>
            </template>
          </button>

          <p v-if="step === 1" class="login-footer">
            Already have an account?
            <span class="login-link" @click="router.push('/')">Log In</span>
          </p>
        </div>

      </div>
    </div>

    <!-- ── SNACKBAR ── -->
    <v-snackbar v-model="snackbar.show" :timeout="4000" location="top right" elevation="8" rounded="xl"
      :color="snackbar.color">
      <div class="d-flex align-center ga-3">
        <v-icon size="22" color="white">
          {{ snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
        </v-icon>
        <div class="text-body-2 font-weight-medium">{{ snackbar.message }}</div>
      </div>
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useUsersApi } from "@/composables/apis/useUsersApi";
import { useSetupServicesApi } from "~/composables/apis/useSetupServices";

const router = useRouter();
const { pincodeSearch } = useOnboadingApi();
const { registerVendor } = useUsersApi();
const { getPublicServiceCatalog } = useSetupServicesApi();

// ── Step control ──
const step = ref(1);
const totalSteps = 4;
const submitting = ref(false);

const stepTitles = ["Business Details", "Official Address", "Address Details", "Select Services"];
const stepTitle = computed(() => stepTitles[step.value - 1]);

// ── Services selection ──
const serviceList = ref([]);
const loadingServices = ref(false);
const serviceSelections = reactive({});

const SERVICE_ICONS = {
  AEPS: "mdi-fingerprint", DMT: "mdi-bank-transfer", UPI: "mdi-qrcode",
  BBPS: "mdi-receipt-text-outline", MATM: "mdi-atm", POS: "mdi-point-of-sale",
};
const serviceIcon = (service) => SERVICE_ICONS[service] || "mdi-apps";

// No provider picker shown to the user — each service gets a fixed default
// provider assigned on selection instead.
const DEFAULT_INTERFACE_BY_SERVICE = {
  UPI: "ISG",
  AEPS: "NSDL",
  DMT: "NSDL",
};

function toggleService(svc) {
  const current = serviceSelections[svc.id];
  if (current?.selected) {
    serviceSelections[svc.id] = { selected: false, interfaceId: "", interfaceName: "" };
  } else {
    const preferredName = DEFAULT_INTERFACE_BY_SERVICE[svc.service];
    const preferred = preferredName && (svc.interfaces || []).find(i => i.interface === preferredName);
    const fallback = preferred || svc.interfaces?.[0] || null;
    serviceSelections[svc.id] = {
      selected: true,
      interfaceId: fallback?.id || "",
      interfaceName: fallback?.interface || "",
    };
  }
}

const selectedServiceEntries = computed(() =>
  Object.entries(serviceSelections)
    .filter(([, sel]) => sel.selected && sel.interfaceId)
    .map(([serviceId, sel]) => ({ serviceId, interfaceId: sel.interfaceId }))
);
const selectedServiceCount = computed(() => selectedServiceEntries.value.length);

// ── Form state ──
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  // Step 1
  name: "",
  primary_email_id: "",
  primary_mobile: "",
  password: "",
  confirmPassword: "",

  // Step 2 — Official
  official_address: "",
  address1: "",
  address2: "",
  address3: "",
  phone: "",
  city: "",
  state: "",
  pincode: "",

  // Residential
  residential_address: "",
  res_address1: "",
  res_address2: "",
  res_address3: "",
  res_mobile: "",
  res_phone_number: "",
  res_city: "",
  res_state: "",
  res_pincode: "",

  // Visitor
  vister_address: "",
  v_address1: "",
  v_address2: "",
  v_address3: "",
  v_mobile: "",
  v_phone_number: "",
  v_city: "",
  v_state: "",
  v_pincode: "",

  lat: "",
  long: "",
});

// ── Errors ──
const errors = reactive({});
const clearError = (field) => { delete errors[field]; };

// ── Pincode (official) ──
const opPincode = ref(null);
const opPincodeOptions = ref([]);
let pinDebounce = null;

const opPinSearch = (q) => {
  clearTimeout(pinDebounce);
  if (!q || q.length < 2) { opPincodeOptions.value = []; return; }
  pinDebounce = setTimeout(async () => {
    try {
      const res = await pincodeSearch(q);
      opPincodeOptions.value = res.data?.data || res.data || [];
    } catch (e) { console.error(e); }
  }, 300);
};
watch(opPincode, (val) => {
  if (!val || typeof val !== "object") return;
  form.city = val.city;
  form.state = val.statename;
  form.pincode = val.pincode;
});

// ── Pincode (residential) ──
const resPincode = ref(null);
const resPincodeOptions = ref([]);
let resPinDebounce = null;

const resPinSearch = (q) => {
  clearTimeout(resPinDebounce);
  if (!q || q.length < 2) { resPincodeOptions.value = []; return; }
  resPinDebounce = setTimeout(async () => {
    try {
      const res = await pincodeSearch(q);
      resPincodeOptions.value = res.data?.data || res.data || [];
    } catch (e) { console.error(e); }
  }, 300);
};
watch(resPincode, (val) => {
  if (!val || typeof val !== "object") return;
  form.res_city = val.city;
  form.res_state = val.statename;
  form.res_pincode = val.pincode;
});

// ── Pincode (visitor) ──
const vPincode = ref(null);
const vPincodeOptions = ref([]);
let vPinDebounce = null;

const vPinSearch = (q) => {
  clearTimeout(vPinDebounce);
  if (!q || q.length < 2) { vPincodeOptions.value = []; return; }
  vPinDebounce = setTimeout(async () => {
    try {
      const res = await pincodeSearch(q);
      vPincodeOptions.value = res.data?.data || res.data || [];
    } catch (e) { console.error(e); }
  }, 300);
};
watch(vPincode, (val) => {
  if (!val || typeof val !== "object") return;
  form.v_city = val.city;
  form.v_state = val.statename;
  form.v_pincode = val.pincode;
});

// ── Address toggles ──
const sameAsOfficialResidential = ref(false);
const sameAsOfficialVisitor = ref(false);

const copyOfficialToResidential = () => {
  if (sameAsOfficialResidential.value) {
    Object.assign(form, {
      residential_address: form.official_address,
      res_address1: form.address1,
      res_address2: form.address2,
      res_address3: form.address3,
      res_city: form.city,
      res_state: form.state,
      res_pincode: form.pincode,
    });
  }
};
const copyOfficialToVisitor = () => {
  if (sameAsOfficialVisitor.value) {
    Object.assign(form, {
      vister_address: form.official_address,
      v_address1: form.address1,
      v_address2: form.address2,
      v_address3: form.address3,
      v_city: form.city,
      v_state: form.state,
      v_pincode: form.pincode,
    });
  }
};

// ── Password strength ──
const passwordStrength = computed(() => {
  const v = form.password;
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s;
});
const strengthLabel = computed(() => ["", "Weak", "Fair", "Good", "Strong"][passwordStrength.value] || "");
const strengthClass = (i) => {
  if (i > passwordStrength.value) return "seg--empty";
  const c = ["", "seg--weak", "seg--fair", "seg--good", "seg--strong"];
  return c[passwordStrength.value];
};

// ── Snackbar ──
const snackbar = reactive({ show: false, message: "", color: "success" });
const showSnack = (message, color = "success") => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

// ── Validation per step ──
const validateStep = () => {
  const newErrors = {};

  if (step.value === 1) {
    if (!form.name || form.name.trim().length < 2)
      newErrors.name = "Distributor / company name is required";
    if (!form.primary_email_id || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.primary_email_id))
      newErrors.primary_email_id = "Enter a valid email address";
    if (!/^[6-9]\d{9}$/.test(String(form.primary_mobile || "")))
      newErrors.primary_mobile = "Enter a valid 10-digit mobile number";
    if (!form.password || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
  }

  if (step.value === 2) {
    if (!form.official_address) newErrors.official_address = "Required";
    if (!form.address1) newErrors.address1 = "Required";
    if (!form.address2) newErrors.address2 = "Required";
    if (!form.pincode) newErrors.pincode = "Required";
    if (!form.city) newErrors.city = "Required";
    if (!form.state) newErrors.state = "Required";
  }

  if (step.value === 3) {
    if (!sameAsOfficialResidential.value) {
      if (!form.residential_address) newErrors.residential_address = "Required";
      if (!form.res_address1) newErrors.res_address1 = "Required";
      if (!form.res_address2) newErrors.res_address2 = "Required";
      if (!form.res_pincode) newErrors.res_pincode = "Required";
      if (!form.res_city) newErrors.res_city = "Required";
      if (!form.res_state) newErrors.res_state = "Required";
    }
    if (!sameAsOfficialVisitor.value) {
      if (!form.vister_address) newErrors.vister_address = "Required";
      if (!form.v_address1) newErrors.v_address1 = "Required";
      if (!form.v_address2) newErrors.v_address2 = "Required";
      if (!form.v_pincode) newErrors.v_pincode = "Required";
      if (!form.v_city) newErrors.v_city = "Required";
      if (!form.v_state) newErrors.v_state = "Required";
    }
  }

  Object.assign(errors, newErrors);
  Object.keys(errors).forEach((k) => { if (!(k in newErrors)) delete errors[k]; });
  return Object.keys(newErrors).length === 0;
};

// ── Navigation ──
const prevStep = () => { if (step.value > 1) step.value--; };

const handleNext = async () => {
  if (!validateStep()) return;

  if (step.value < totalSteps) {
    step.value++;
    return;
  }

  await submit();
};

// ── Submit — creates the distributor (vendor) account ──
const submit = async () => {
  submitting.value = true;
  try {
    const payload = {
      email: form.primary_email_id,
      password: form.password,
      mobile_no: form.primary_mobile,
      name: form.name,
      lat: form.lat || null,
      long: form.long || null,
      addresses: {
        official: {
          address: form.official_address, address1: form.address1, address2: form.address2,
          address3: form.address3 || null, city: form.city, state: form.state, pincode: form.pincode,
          phone: form.phone || null,
        },
        residential: {
          address: sameAsOfficialResidential.value ? form.official_address : form.residential_address,
          address1: sameAsOfficialResidential.value ? form.address1 : form.res_address1,
          address2: sameAsOfficialResidential.value ? form.address2 : form.res_address2,
          address3: (sameAsOfficialResidential.value ? form.address3 : form.res_address3) || null,
          city: sameAsOfficialResidential.value ? form.city : form.res_city,
          state: sameAsOfficialResidential.value ? form.state : form.res_state,
          pincode: sameAsOfficialResidential.value ? form.pincode : form.res_pincode,
          mobile: form.res_mobile || null,
        },
        visitor: {
          address: sameAsOfficialVisitor.value ? form.official_address : form.vister_address,
          address1: sameAsOfficialVisitor.value ? form.address1 : form.v_address1,
          address2: sameAsOfficialVisitor.value ? form.address2 : form.v_address2,
          address3: (sameAsOfficialVisitor.value ? form.address3 : form.v_address3) || null,
          city: sameAsOfficialVisitor.value ? form.city : form.v_city,
          state: sameAsOfficialVisitor.value ? form.state : form.v_state,
          pincode: sameAsOfficialVisitor.value ? form.pincode : form.v_pincode,
          mobile: form.v_mobile || null,
        },
      },
      services: selectedServiceEntries.value,
    };

    const result = await registerVendor(payload);

    if (result?.statusCode === "00") {
      showSnack("Distributor account created! Redirecting to your dashboard…", "success");
      setTimeout(() => router.push("/vendor/dashboard"), 1500);
    } else {
      showSnack(result?.message || "Error creating distributor account", "error");
    }
  } catch (err) {
    showSnack(err?.response?.data?.message || "Something went wrong", "error");
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  loadingServices.value = true;
  try {
    const res = await getPublicServiceCatalog();
    if (res?.statusCode === "00") serviceList.value = res.data || [];
  } finally {
    loadingServices.value = false;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');

*, *::before, *::after { box-sizing: border-box; }

/* ════════════════════════════════════
   ROOT — same two-panel pattern as the login / merchant register page
════════════════════════════════════ */
.register-root {
  font-family: 'DM Sans', sans-serif;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) { .register-root { flex-direction: row; } }

/* ════════════════════════════════════
   LEFT PANEL
════════════════════════════════════ */
.reg-left {
  display: none;
  background: linear-gradient(150deg, #08267a 0%, #1142d4 55%, #1a52f5 100%);
  position: relative;
  overflow: hidden;
}
@media (min-width: 768px) { .reg-left { display: flex; flex: 1; } }

.reg-left::before {
  content: ''; position: absolute; top: -90px; right: -90px;
  width: 320px; height: 320px; border-radius: 50%;
  background: rgba(255,255,255,.05); pointer-events: none;
}
.reg-left::after {
  content: ''; position: absolute; bottom: -110px; left: -70px;
  width: 380px; height: 380px; border-radius: 50%;
  background: rgba(255,255,255,.04); pointer-events: none;
}

.left-inner {
  position: relative; z-index: 1; width: 100%;
  display: flex; flex-direction: column; padding: 44px 48px; gap: 26px;
  overflow-y: auto;
}

.left-brand { display: flex; align-items: center; gap: 10px; }
.brand-name { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: .1em; }

.left-copy { margin-top: 4px; }
.left-headline { font-size: 26px; font-weight: 800; color: #fff; line-height: 1.28; margin-bottom: 10px; }
.left-sub { font-size: 13px; color: rgba(255,255,255,.72); line-height: 1.7; max-width: 360px; }

/* Step recap list */
.steps-recap { display: flex; flex-direction: column; gap: 12px; margin-top: 6px; }
.steps-recap-item {
  display: flex; align-items: center; gap: 12px;
  opacity: .45; transition: opacity .2s;
}
.steps-recap-item.is-active, .steps-recap-item.is-done { opacity: 1; }
.steps-recap-dot {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff;
  background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.28);
}
.steps-recap-item.is-active .steps-recap-dot { background: #fff; color: #1142d4; border-color: #fff; }
.steps-recap-item.is-done .steps-recap-dot { background: #22c55e; border-color: #22c55e; }
.steps-recap-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,.85); }
.steps-recap-item.is-active .steps-recap-label { color: #fff; }

.feature-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: auto; }
.feature-pill {
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
  padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #fff;
}
.feature-pill .mdi { font-size: 14px; }

/* ════════════════════════════════════
   RIGHT PANEL
════════════════════════════════════ */
.reg-right {
  display: flex; flex-direction: column;
  background: #f4f5f7; min-height: 100dvh;
}
@media (min-width: 768px)  { .reg-right { flex: 0 0 520px; } }
@media (min-width: 1024px) { .reg-right { flex: 0 0 560px; } }

.reg-form-wrap { width: 100%; display: flex; flex-direction: column; min-height: 100dvh; }

/* Mobile brand */
.mobile-brand {
  display: flex; align-items: center; gap: 8px; justify-content: center;
  padding: 20px 20px 0;
}
@media (min-width: 768px) { .mobile-brand { display: none; } }
.brand-icon-solid {
  width: 32px; height: 32px; border-radius: 9px;
  background: #1142d4; box-shadow: 0 4px 14px rgba(17,66,212,.3);
  display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px;
}
.brand-name-dark { color: #0f172a; font-size: 15px; font-weight: 800; letter-spacing: .08em; }

/* Header */
.reg-head {
  background: #fff;
  padding: 20px 24px 14px;
  display: flex; align-items: center; gap: 12px;
  position: sticky; top: 0; z-index: 20;
  border-bottom: 1px solid #e8edf3;
}
@media (min-width: 768px) { .reg-head { padding: 28px 32px 16px; } }

.back-btn {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: #eef2ff; border: 1.5px solid #d7e0fb;
  display: flex; align-items: center; justify-content: center;
  color: #1142d4; cursor: pointer;
}
.back-btn:hover { background: #e0e9fe; }

.reg-head-text { flex: 1; }
.header-label {
  font-size: 10.5px; font-weight: 700; letter-spacing: .08em;
  color: #94a3b8; text-transform: uppercase; margin: 0 0 3px;
}
.header-title { font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -.2px; }

.step-dots { display: flex; gap: 5px; flex-shrink: 0; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: #dfe6ee; }
.dot.active { background: #1142d4; }

/* Progress bar */
.progress-track { height: 3px; background: #e8edf3; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #1142d4, #1a52f5); transition: width .25s ease; }

/* Body */
.reg-body {
  flex: 1; overflow-y: auto;
  padding: 22px 24px 28px;
}
@media (min-width: 768px) { .reg-body { padding: 28px 32px 32px; } }

.reg-body::-webkit-scrollbar { width: 5px; }
.reg-body::-webkit-scrollbar-track { background: transparent; }
.reg-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

.step-desc { font-size: .85rem; color: #64748b; margin: 0 0 1.1rem; line-height: 1.5; }

.field-label {
  display: block; font-size: .65rem; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: .3rem;
}

.mt-3 { margin-top: .875rem; }
.mt-4 { margin-top: 1.1rem; }

/* ── field styling — matches the login / merchant register page's input look ── */
.reg-field :deep(.v-field) {
  border-radius: 11px !important;
  background: #fff !important;
  font-family: 'DM Sans', sans-serif !important;
}
.reg-field :deep(.v-field__outline__start),
.reg-field :deep(.v-field__outline__end),
.reg-field :deep(.v-field__outline__notch) {
  border-color: #e2e8f0 !important; transition: border-color .15s !important;
}
.reg-field :deep(.v-field--focused .v-field__outline__start),
.reg-field :deep(.v-field--focused .v-field__outline__end),
.reg-field :deep(.v-field--focused .v-field__outline__notch) {
  border-color: #1142d4 !important; border-width: 1.5px !important;
}
.reg-field :deep(.v-field--focused) { box-shadow: 0 0 0 3px rgba(17,66,212,.1) !important; }
.reg-field :deep(.v-field__prepend-inner .v-icon) { color: #94a3b8 !important; }
.reg-field :deep(.v-field--focused .v-field__prepend-inner .v-icon) { color: #1142d4 !important; }
.reg-field :deep(.v-field__input) { color: #1e293b !important; font-size: .875rem !important; font-family: 'DM Sans', sans-serif !important; }
.reg-field :deep(input::placeholder), .reg-field :deep(textarea::placeholder) { color: #94a3b8 !important; opacity: 1 !important; }
.reg-field :deep(.v-field__prefix) { color: #475569 !important; font-size: .875rem !important; padding-right: 4px !important; }
.reg-field :deep(.v-chip) { background: #e0e9fe !important; color: #1142d4 !important; font-weight: 600 !important; }
.reg-field :deep(.v-field--error .v-field__outline__start),
.reg-field :deep(.v-field--error .v-field__outline__end),
.reg-field :deep(.v-field--error .v-field__outline__notch) { border-color: #ef4444 !important; }

.reg-field--disabled :deep(.v-field) { background: #f1f5f9 !important; }
.reg-field--disabled :deep(.v-field__input) { color: #94a3b8 !important; -webkit-text-fill-color: #94a3b8 !important; }
.reg-field--disabled :deep(.v-field__outline__start),
.reg-field--disabled :deep(.v-field__outline__end),
.reg-field--disabled :deep(.v-field__outline__notch) { border-color: #e2e8f0 !important; opacity: .8 !important; }

/* ── password strength ── */
.strength-bar { display: flex; gap: 4px; margin-top: .65rem; }
.seg { flex: 1; height: 4px; border-radius: 2px; background: #e2e8f0; }
.seg--weak { background: #ef4444; }
.seg--fair { background: #f59e0b; }
.seg--good { background: #3b82f6; }
.seg--strong { background: #22c55e; }
.strength-label { font-size: .7rem; margin-top: .3rem; color: #64748b; }

/* ── address ── */
.address-toggle-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: .9rem 1.1rem;
  background: #fff; border: 1px solid #e8edf3; border-radius: 12px;
}
.address-toggle-info { display: flex; align-items: center; gap: .75rem; }
.address-toggle-icon-wrap {
  width: 2.1rem; height: 2.1rem; border-radius: 8px;
  background: #eef2ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  color: #1142d4;
}
.address-toggle-title { font-weight: 700; font-size: .875rem; margin: 0; color: #0f172a; }
.address-toggle-sub { font-size: .75rem; color: #94a3b8; margin: .1rem 0 0; }

.toggle-switch { position: relative; display: inline-block; cursor: pointer; flex-shrink: 0; }
.toggle-input { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
.toggle-track {
  width: 2.75rem; height: 1.5rem; background: #dfe6ee; border-radius: 99px;
  position: relative; transition: background .22s ease;
}
.toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 1.25rem; height: 1.25rem; background: #fff; border-radius: 50%;
  box-shadow: 0 1px 5px rgba(0,0,0,.18); transition: transform .22s ease;
}
.toggle-input:checked ~ .toggle-track { background: #1142d4; }
.toggle-input:checked ~ .toggle-track .toggle-thumb { transform: translateX(1.25rem); }

/* ── SERVICES ── */
.svc-loading, .svc-empty {
  font-size: .82rem; color: #64748b; padding: 1rem; text-align: center;
  background: #fff; border: 1px dashed #e2e8f0; border-radius: 12px;
}

.svc-grid {
  display: grid; grid-template-columns: 1fr; gap: .625rem;
}
@media (min-width: 460px) { .svc-grid { grid-template-columns: repeat(2, 1fr); } }

.svc-card {
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
  transition: all .15s; overflow: hidden;
}
.svc-card--selected { border-color: #1142d4; box-shadow: 0 0 0 2px rgba(17,66,212,.1); }

.svc-card__head {
  display: flex; align-items: center; gap: .625rem;
  padding: .8rem .9rem; cursor: pointer;
}
.svc-card__name { font-size: .85rem; font-weight: 700; color: #0f172a; }

.svc-checkbox {
  width: 1.125rem; height: 1.125rem; border-radius: 4px;
  border: 1.5px solid #cbd5e1; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: #fff; transition: all .15s;
}
.svc-checkbox--on { background: #1142d4; border-color: #1142d4; }

.svc-card__body { padding: 0 .9rem .9rem; display: flex; flex-direction: column; gap: .3rem; }
.svc-card__hint { font-size: .7rem; color: #ef4444; }

.svc-provider-badge {
  display: inline-flex; align-items: center; width: fit-content;
  font-size: .7rem; font-weight: 700; color: #1142d4;
  background: #eef2ff; border: 1px solid #d7e0fb; border-radius: 9999px;
  padding: .2rem .6rem;
}

.svc-summary {
  margin-top: .875rem; font-size: .78rem; color: #1142d4;
  background: #eef2ff; border: 1px solid #d7e0fb; border-radius: 10px; padding: .7rem .9rem; line-height: 1.5;
}

/* ── FOOTER ── */
.reg-footer {
  padding: 1.1rem 24px 1.5rem;
  border-top: 1px solid #e8edf3;
  background: #fff;
  display: flex; flex-direction: column; align-items: center; gap: .65rem;
  position: sticky; bottom: 0;
}
@media (min-width: 768px) { .reg-footer { padding: 1.2rem 32px 1.6rem; } }

.btn-next {
  width: 100%;
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  height: 50px;
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%);
  color: #fff; border: none; border-radius: 12px;
  font-size: .92rem; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 18px rgba(17,66,212,.3);
  transition: filter .15s, box-shadow .15s;
}
.btn-next:hover:not(:disabled) { filter: brightness(1.07); box-shadow: 0 6px 24px rgba(17,66,212,.38); }
.btn-next:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }

.btn-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.login-footer { font-size: .8rem; color: #64748b; margin: 0; }
.login-link { color: #1142d4; font-weight: 700; cursor: pointer; }
.login-link:hover { text-decoration: underline; }
</style>
