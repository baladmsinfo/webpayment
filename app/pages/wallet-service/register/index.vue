<template>
  <div class="wp-root">

    <main class="wp-main">

      <!-- TOP HEADER -->
      <header class="wp-header">
        <div class="header-left">
          <div class="header-badge">
            <v-icon size="18" color="#7ecfff">mdi-wallet-outline</v-icon>
          </div>
          <h2 class="header-title">Registration</h2>
        </div>
        <span class="header-step">New Account</span>
      </header>

      <!-- SCROLLABLE FORM -->
      <div class="form-scroll">
        <div class="form-inner">

          <v-form ref="wpForm" v-model="validForm">

            <!-- ── IDENTITY ── -->
            <section class="form-section">
              <h3 class="section-title">
                <v-icon class="section-icon" size="20">mdi-account-circle-outline</v-icon>
                Contact Details
              </h3>

              <v-row dense>
                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">FULL NAME</label>
                  <v-text-field v-model.trim="form.name" placeholder="As per PAN / Aadhaar"
                    variant="outlined" density="comfortable" :rules="[req]"
                    prepend-inner-icon="mdi-badge-account-outline" class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">EMAIL ADDRESS</label>
                  <v-text-field v-model.trim="form.email" placeholder="service@email.com"
                    variant="outlined" density="comfortable" :rules="[req, emailRule]"
                    prepend-inner-icon="mdi-email-outline" class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">MOBILE NUMBER</label>
                  <v-text-field v-model="form.mobile_no" placeholder="10-digit mobile" prefix="+91"
                    variant="outlined" density="comfortable" :rules="[req, phoneRule]"
                    prepend-inner-icon="mdi-phone-outline" class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">PASSWORD</label>
                  <v-text-field :rules="[req]" v-model="form.password" placeholder="Enter New Password"
                    :type="showPass ? 'text' : 'password'"
                    variant="outlined" density="comfortable"
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    @click:append-inner="showPass = !showPass"
                    class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">DATE OF BIRTH</label>
                  <v-text-field v-model="form.dob" type="date" variant="outlined"
                    density="comfortable" :rules="[req]" :max="maxDob"
                    prepend-inner-icon="mdi-calendar-outline" class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">GENDER</label>
                  <v-select v-model="form.gender" :items="['M', 'F', 'O']" placeholder="Select Gender"
                    variant="outlined" density="comfortable" :rules="[req]"
                    prepend-inner-icon="mdi-gender-male-female" class="wp-field" hide-details="auto" />
                </v-col>
              </v-row>
            </section>

            <!-- ── BUSINESS DETAILS ── -->
            <section class="form-section">
              <h3 class="section-title">
                <v-icon class="section-icon" size="20">mdi-store-outline</v-icon>
                Business Details
              </h3>

              <v-row dense>
                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">DBA / TRADE NAME</label>
                  <v-text-field v-model.trim="form.dba_name" placeholder="Trade / Brand Name"
                    variant="outlined" density="comfortable" :rules="[req]"
                    prepend-inner-icon="mdi-tag-outline" class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">NATURE OF BUSINESS (MCC)</label>
                  <v-combobox v-model="mccSelected" :items="mccOptions" item-title="descr" item-value="id"
                    placeholder="Search nature of business" clearable variant="outlined"
                    density="comfortable" :loading="loadingMcc" :rules="[req]"
                    prepend-inner-icon="mdi-shape-outline" class="wp-field" hide-details="auto"
                    @update:search="onMccSearch">
                    <template #selection="{ item }">
                      <v-chip v-if="item === Object(item)" :text="item.raw.descr" size="small"
                        closable variant="flat" color="primary" @click:close="mccSelected = null" />
                    </template>
                  </v-combobox>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">ANNUAL TURNOVER</label>
                  <v-autocomplete v-model="form.annual_turn_over" :items="turnOverList.data || []"
                    item-title="label" item-value="value" placeholder="Select Annual Turnover"
                    variant="outlined" density="comfortable" :rules="[req]"
                    prepend-inner-icon="mdi-currency-rupee" class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4">
                  <label class="field-label">WEBSITE <span class="optional-tag">(optional)</span></label>
                  <v-text-field v-model="form.website" placeholder="www.example.com"
                    variant="outlined" density="comfortable" prepend-inner-icon="mdi-web"
                    class="wp-field" hide-details="auto" />
                </v-col>
              </v-row>
            </section>

            <!-- ── LOCATION ── -->
            <section class="form-section">
              <h3 class="section-title">
                <v-icon class="section-icon" size="20">mdi-map-marker-outline</v-icon>
                Geo Location
              </h3>
              <div class="location-layout">
                <div class="location-fields">
                  <v-row dense>
                    <v-col cols="12" sm="6">
                      <label class="field-label">LATITUDE</label>
                      <v-text-field v-model.trim="form.lat" placeholder="e.g. 12.9716"
                        variant="outlined" density="comfortable" :rules="[req, latRule]"
                        prepend-inner-icon="mdi-compass-outline" class="wp-field" hide-details="auto" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <label class="field-label">LONGITUDE</label>
                      <v-text-field v-model.trim="form.long" placeholder="e.g. 77.5946"
                        variant="outlined" density="comfortable" :rules="[req, lngRule]"
                        prepend-inner-icon="mdi-compass-outline" class="wp-field" hide-details="auto" />
                    </v-col>
                  </v-row>
                  <p class="location-hint">Use device GPS or drag the pin on the map to fill coordinates.</p>
                </div>
                <div class="map-placeholder">
                  <div class="map-pin-wrap">
                    <v-icon color="#002d5a" size="28" class="map-pin">mdi-map-marker</v-icon>
                  </div>
                </div>
              </div>
            </section>

            <!-- ── ADDRESS ── -->
            <section class="form-section">
              <h3 class="section-title">
                <v-icon class="section-icon" size="20">mdi-home-city-outline</v-icon>
                Address Details
              </h3>

              <!-- Official -->
              <p class="address-sub-title">OFFICIAL / REGISTERED ADDRESS</p>
              <v-row dense>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.official_address" placeholder="Door No / Building"
                    variant="outlined" density="comfortable" :rules="[req]" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.address1" placeholder="Street Address Line 1"
                    variant="outlined" density="comfortable" :rules="[req]" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.address2" placeholder="Street Address Line 2"
                    variant="outlined" density="comfortable" :rules="[req]" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.address3" placeholder="Landmark (optional)"
                    variant="outlined" density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model="form.phone" placeholder="Contact Number (optional)" prefix="+91"
                    variant="outlined" density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>

                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-combobox v-model="opPincode" :items="opPincodeOptions" item-title="pincode"
                    item-value="pincode" placeholder="Search Pincode" variant="outlined"
                    density="comfortable" return-object :loading="loadingPin" class="wp-field"
                    hide-details="auto" @update:search="opPinSearch">
                    <template #selection="{ item }">
                      <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                        closable variant="flat" color="primary" @click:close="opPincode = null" />
                    </template>
                  </v-combobox>
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.pincode" placeholder="Pincode" variant="outlined"
                    density="comfortable" disabled :rules="[pincodeRule]"
                    class="wp-field wp-field--disabled" hide-details="auto" />
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.city" placeholder="City" variant="outlined"
                    density="comfortable" disabled :rules="[req]"
                    class="wp-field wp-field--disabled" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.state" placeholder="State" variant="outlined"
                    density="comfortable" disabled :rules="[req]"
                    class="wp-field wp-field--disabled" hide-details="auto" />
                </v-col>
              </v-row>

              <!-- Residential toggle -->
              <div class="address-toggle-card mt-6">
                <div class="address-toggle-info">
                  <div class="address-toggle-icon-wrap">
                    <v-icon color="#002d5a" size="20">mdi-home-outline</v-icon>
                  </div>
                  <div>
                    <p class="address-toggle-title">Residential Address</p>
                    <p class="address-toggle-sub">Same as official address?</p>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="sameResidential" @change="copyToResidential" class="toggle-input" />
                  <div class="toggle-track"><div class="toggle-thumb"></div></div>
                </label>
              </div>

              <v-row v-if="!sameResidential" dense class="mt-3">
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.residential_address" placeholder="Door No / Residential"
                    variant="outlined" density="comfortable" :rules="[requiredIf(!sameResidential)]"
                    class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.res_address1" placeholder="Street Address 1"
                    variant="outlined" density="comfortable" :rules="[requiredIf(!sameResidential)]"
                    class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.res_address2" placeholder="Street Address 2"
                    variant="outlined" density="comfortable" :rules="[requiredIf(!sameResidential)]"
                    class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.res_address3" placeholder="Landmark (optional)"
                    variant="outlined" density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model="form.res_mobile" placeholder="Residential Mobile" prefix="+91"
                    variant="outlined" density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-combobox v-model="resPincode" :items="resPincodeOptions" item-title="pincode"
                    item-value="pincode" placeholder="Search Pincode" variant="outlined"
                    density="comfortable" return-object :loading="loadingPin" class="wp-field"
                    hide-details="auto" @update:search="resPinSearch" />
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.res_pincode" placeholder="Pincode" variant="outlined"
                    density="comfortable" disabled :rules="[pincodeRule]"
                    class="wp-field wp-field--disabled" hide-details="auto" />
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.res_city" placeholder="City" variant="outlined"
                    density="comfortable" disabled class="wp-field wp-field--disabled" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.res_state" placeholder="State" variant="outlined"
                    density="comfortable" disabled class="wp-field wp-field--disabled" hide-details="auto" />
                </v-col>
              </v-row>

              <!-- Visitor toggle -->
              <div class="address-toggle-card mt-4">
                <div class="address-toggle-info">
                  <div class="address-toggle-icon-wrap">
                    <v-icon color="#002d5a" size="20">mdi-map-marker-outline</v-icon>
                  </div>
                  <div>
                    <p class="address-toggle-title">Visitor Address</p>
                    <p class="address-toggle-sub">Same as official address?</p>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="sameVisitor" @change="copyToVisitor" class="toggle-input" />
                  <div class="toggle-track"><div class="toggle-thumb"></div></div>
                </label>
              </div>

              <v-row v-if="!sameVisitor" dense class="mt-3">
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.vister_address" placeholder="Door No / Visitor"
                    variant="outlined" density="comfortable" :rules="[requiredIf(!sameVisitor)]"
                    class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.v_address1" placeholder="Street Address 1"
                    variant="outlined" density="comfortable" :rules="[requiredIf(!sameVisitor)]"
                    class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.v_address2" placeholder="Street Address 2"
                    variant="outlined" density="comfortable" :rules="[requiredIf(!sameVisitor)]"
                    class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model.trim="form.v_address3" placeholder="Landmark (optional)"
                    variant="outlined" density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-text-field v-model="form.v_mobile" placeholder="Visitor Mobile" prefix="+91"
                    variant="outlined" density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="6" md="4" lg="3">
                  <v-combobox v-model="visPincode" :items="visPincodeOptions" item-title="pincode"
                    item-value="pincode" placeholder="Search Pincode" variant="outlined"
                    density="comfortable" return-object :loading="loadingPin" class="wp-field"
                    hide-details="auto" @update:search="visPinSearch" />
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.v_pincode" placeholder="Pincode" variant="outlined"
                    density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="6" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.v_city" placeholder="City" variant="outlined"
                    density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
                <v-col cols="12" sm="4" md="3" lg="2">
                  <v-text-field v-model.trim="form.v_state" placeholder="State" variant="outlined"
                    density="comfortable" class="wp-field" hide-details="auto" />
                </v-col>
              </v-row>
            </section>

            <!-- ── FOOTER ── -->
            <div class="form-footer">
              <p class="footer-terms">
                By submitting, you agree to our
                <a href="#" class="footer-link">Terms of Service</a>.
              </p>
              <div class="footer-actions">
                <button type="button" class="btn-secondary" @click="router.back()">Cancel</button>
                <button type="button" class="btn-primary"
                  :disabled="!validForm || submitting" @click="submitForm">
                  <span v-if="submitting">Registering…</span>
                  <template v-else>
                    Register
                    <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
                  </template>
                </button>
              </div>
            </div>

          </v-form>
        </div>
      </div>
    </main>

    <!-- SNACKBAR -->
    <v-snackbar v-model="snackbar.show" :timeout="4000" location="top right"
      elevation="8" rounded="xl" :color="snackbar.color">
      <div class="d-flex align-center ga-3">
        <v-icon size="22" color="white">
          {{ snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
        </v-icon>
        <div class="text-body-2 font-weight-medium">{{ snackbar.message }}</div>
        <v-spacer />
        <v-btn icon size="x-small" variant="text" @click="snackbar.show = false">
          <v-icon size="18">mdi-close</v-icon>
        </v-btn>
      </div>
    </v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useOnboardingStore } from "@/stores/onboading";
import { storeToRefs } from "pinia";

// ── Composable — single source for ALL API calls ──────────────────
const {
  MCCSearch,
  businessTurnOver,
  pincodeSearch,
  createWalletService,     // ← the only submit call needed
} = useOnboadingApi();

const router   = useRouter();
const Onboarding = useOnboardingStore();
const { turnOverList } = storeToRefs(Onboarding);

// ── UI state ──────────────────────────────────────────────────────
const wpForm     = ref(null);
const validForm  = ref(false);
const submitting = ref(false);
const showPass   = ref(false);
const loadingMcc = ref(false);
const loadingPin = ref(false);

const snackbar = reactive({ show: false, message: "", color: "success" });

const sameResidential = ref(false);
const sameVisitor     = ref(false);

// MCC
const mccSelected = ref(null);
const mccOptions  = ref([]);

// Pincodes
const opPincode         = ref(null);
const resPincode        = ref(null);
const visPincode        = ref(null);
const opPincodeOptions  = ref([]);
const resPincodeOptions = ref([]);
const visPincodeOptions = ref([]);

// ── Max DOB (must be 18+) ─────────────────────────────────────────
const maxDob = computed(() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
});

// ── Form model ────────────────────────────────────────────────────
const form = reactive({
  // Identity
  name: "", email: "", mobile_no: "", password: "",
  dob: "", gender: "M",

  // Business
  dba_name: "", mcc: "", nature_of_business: "",
  annual_turn_over: "", website: "",

  // Location
  lat: "", long: "",

  // Official address
  official_address: "", address1: "", address2: "", address3: "",
  phone: "", city: "", state: "", pincode: "",

  // Residential address
  residential_address: "", res_address1: "", res_address2: "",
  res_address3: "", res_mobile: "", res_phone_number: "",
  res_city: "", res_state: "", res_pincode: "",

  // Visitor address
  vister_address: "", v_address1: "", v_address2: "",
  v_address3: "", v_mobile: "", v_phone_number: "",
  v_city: "", v_state: "", v_pincode: "",
});

// ── Validation rules ──────────────────────────────────────────────
const req         = v => !!v || v === 0 || "Required";
const emailRule   = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email";
const phone10     = v => /^\d{10}$/.test(String(v || ""));
const phoneRule   = v => phone10(v) || "Enter 10-digit mobile";
const pincodeRule = v => /^\d{6}$/.test(String(v || "")) || "6-digit pincode";
const latRule     = v => !v || (Number(v) >= -90  && Number(v) <= 90)  || "Lat -90 to 90";
const lngRule     = v => !v || (Number(v) >= -180 && Number(v) <= 180) || "Lng -180 to 180";
const requiredIf  = cond => v => cond || !!v || "This field is required";

// ── Address copy helpers ──────────────────────────────────────────
function copyToResidential() {
  if (!sameResidential.value) return;
  Object.assign(form, {
    residential_address: form.official_address,
    res_address1: form.address1,
    res_address2: form.address2,
    res_address3: form.address3,
    res_city: form.city,
    res_state: form.state,
    res_pincode: form.pincode,
    res_mobile: form.mobile_no,
    res_phone_number: form.phone,
  });
}
function copyToVisitor() {
  if (!sameVisitor.value) return;
  Object.assign(form, {
    vister_address: form.official_address,
    v_address1: form.address1,
    v_address2: form.address2,
    v_address3: form.address3,
    v_city: form.city,
    v_state: form.state,
    v_pincode: form.pincode,
    v_mobile: form.mobile_no,
    v_phone_number: form.phone,
  });
}

// ── MCC search ────────────────────────────────────────────────────
const onMccSearch = async (q) => {
  if (!q || q.length < 2) { mccOptions.value = []; return; }
  loadingMcc.value = true;
  try { mccOptions.value = (await MCCSearch(q)).data.data; }
  catch (e) { console.error(e); }
  finally { loadingMcc.value = false; }
};

// ── Pincode search (shared helper) ───────────────────────────────
async function doPinSearch(q, optRef) {
  if (!q || q.length < 2) { optRef.value = []; return; }
  loadingPin.value = true;
  try { optRef.value = (await pincodeSearch(q)).data.data; }
  catch (e) { console.error(e); }
  finally { loadingPin.value = false; }
}
const opPinSearch  = q => doPinSearch(q, opPincodeOptions);
const resPinSearch = q => doPinSearch(q, resPincodeOptions);
const visPinSearch = q => doPinSearch(q, visPincodeOptions);

// ── Watchers — keep form in sync with combobox selections ─────────
watch(mccSelected, val => {
  form.mcc               = val?.id   || "";
  form.nature_of_business = val?.descr || "";
});
watch(opPincode,  val => { if (!val) return; form.pincode = val.pincode; form.city = val.city; form.state = val.statename; });
watch(resPincode, val => { if (!val) return; form.res_pincode = val.pincode; form.res_city = val.city; form.res_state = val.statename; });
watch(visPincode, val => { if (!val) return; form.v_pincode = val.pincode; form.v_city = val.city; form.v_state = val.statename; });

// ── Submit — delegates entirely to the composable ─────────────────
async function submitForm() {
  const { valid } = await wpForm.value.validate();
  if (!valid) {
    snackbar.message = "Please fill all required fields";
    snackbar.color   = "error";
    snackbar.show    = true;
    return;
  }

  submitting.value = true;
  try {
    // Build final payload; flatten same-address toggles before sending
    const payload = { ...form };

    if (sameResidential.value) {
      Object.assign(payload, {
        residential_address: form.official_address,
        res_address1:        form.address1,
        res_address2:        form.address2,
        res_address3:        form.address3,
        res_city:            form.city,
        res_state:           form.state,
        res_pincode:         form.pincode,
        res_mobile:          form.mobile_no,
        res_phone_number:    form.phone,
      });
    }
    if (sameVisitor.value) {
      Object.assign(payload, {
        vister_address:  form.official_address,
        v_address1:      form.address1,
        v_address2:      form.address2,
        v_address3:      form.address3,
        v_city:          form.city,
        v_state:         form.state,
        v_pincode:       form.pincode,
        v_mobile:        form.mobile_no,
        v_phone_number:  form.phone,
      });
    }

    // ── Single composable call — no direct API access here ────────
    const data = await createWalletService(payload);

    if (data?.statusCode === "00") {
      snackbar.message = data.message || "Registered successfully!";
      snackbar.color   = "success";
      snackbar.show    = true;
      setTimeout(() => router.push("/wallet-service/wallet"), 2000);
    } else {
      snackbar.message = data?.message || "Registration failed";
      snackbar.color   = "error";
      snackbar.show    = true;
    }
  } catch (e) {
    console.error(e);
    snackbar.message = "Unexpected error. Please try again.";
    snackbar.color   = "error";
    snackbar.show    = true;
  } finally {
    submitting.value = false;
  }
}

// ── Init ──────────────────────────────────────────────────────────
onMounted(async () => {
  try { await businessTurnOver(); }
  catch (e) { console.error("Failed to load turnover list:", e); }
});
</script>

<style scoped>
/* ── ROOT ──────────────────────────────────────────────────────── */
.wp-root {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #f0f4f8;
}

/* ── MAIN ──────────────────────────────────────────────────────── */
.wp-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

/* ── HEADER ────────────────────────────────────────────────────── */
.wp-header {
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid #1a4a7a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #002d5a 0%, #003f7f 100%);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.header-badge {
  width: 2rem;
  height: 2rem;
  background: rgba(126, 207, 255, 0.15);
  border: 1px solid rgba(126, 207, 255, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: 0.01em;
}

.header-step {
  font-size: 0.72rem;
  font-weight: 600;
  color: #7ecfff;
  background: rgba(126, 207, 255, 0.12);
  border: 1px solid rgba(126, 207, 255, 0.25);
  padding: 0.2rem 0.625rem;
  border-radius: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ── SCROLL ────────────────────────────────────────────────────── */
.form-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.5rem 2rem;
}

@media (min-width: 768px)  { .form-scroll { padding: 1.75rem 2rem 2.5rem; } }
@media (min-width: 1280px) { .form-scroll { padding: 2rem 2.5rem 3rem; } }

.form-scroll::-webkit-scrollbar { width: 5px; }
.form-scroll::-webkit-scrollbar-track { background: transparent; }
.form-scroll::-webkit-scrollbar-thumb { background: #b8cfe0; border-radius: 10px; }

.form-inner { width: 100%; }

/* ── SECTIONS ──────────────────────────────────────────────────── */
.form-section {
  background: #ffffff;
  border: 1px solid #d8e6f0;
  border-radius: 10px;
  padding: 1.375rem 1.5rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) { .form-section { padding: 1.625rem 2rem; } }

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #002d5a;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e8f0f7;
}

.section-icon { color: #002d5a !important; flex-shrink: 0; }

/* ── FIELD OVERRIDES ────────────────────────────────────────────── */
.wp-field :deep(.v-field) {
  border-radius: 8px !important;
  background: #ffffff !important;
  font-family: 'Inter', sans-serif !important;
}

.wp-field :deep(.v-field__outline__start),
.wp-field :deep(.v-field__outline__end),
.wp-field :deep(.v-field__outline__notch) {
  border-color: #c5d8e8 !important;
  transition: border-color 0.2s !important;
}

.wp-field :deep(.v-field--focused .v-field__outline__start),
.wp-field :deep(.v-field--focused .v-field__outline__end),
.wp-field :deep(.v-field--focused .v-field__outline__notch) {
  border-color: #002d5a !important;
  border-width: 2px !important;
}

.wp-field :deep(.v-field--focused) { box-shadow: 0 0 0 3px rgba(0,45,90,0.1) !important; }

.wp-field :deep(.v-field__prepend-inner .v-icon) { color: #8aafc8 !important; transition: color 0.2s !important; }
.wp-field :deep(.v-field--focused .v-field__prepend-inner .v-icon) { color: #002d5a !important; }
.wp-field :deep(.v-field__input) { color: #0d1b2a !important; font-size: 0.875rem !important; font-family: 'Inter', sans-serif !important; }
.wp-field :deep(input::placeholder), .wp-field :deep(textarea::placeholder) { color: #9fb8cc !important; opacity: 1 !important; }
.wp-field :deep(.v-label) { color: #7a9bb5 !important; font-size: 0.85rem !important; }
.wp-field :deep(.v-field__prefix) { color: #4a6a85 !important; font-size: 0.875rem !important; padding-right: 4px !important; }
.wp-field :deep(.v-field__append-inner .v-icon) { color: #8aafc8 !important; }
.wp-field :deep(.v-chip) { background: #e0edf5 !important; color: #002d5a !important; font-weight: 500 !important; }

.wp-field :deep(.v-field--error .v-field__outline__start),
.wp-field :deep(.v-field--error .v-field__outline__end),
.wp-field :deep(.v-field--error .v-field__outline__notch) { border-color: #d32f2f !important; }

.wp-field--disabled :deep(.v-field) { background: #f0f5f9 !important; }
.wp-field--disabled :deep(.v-field__input) { color: #8aafc8 !important; -webkit-text-fill-color: #8aafc8 !important; }
.wp-field--disabled :deep(.v-field__outline__start),
.wp-field--disabled :deep(.v-field__outline__end),
.wp-field--disabled :deep(.v-field__outline__notch) { border-color: #d8e6f0 !important; opacity: 0.8 !important; }

/* ── LABELS ─────────────────────────────────────────────────────── */
.field-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  color: #5a7d9a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.3rem;
  padding-left: 0.1rem;
}

.optional-tag {
  font-weight: 400;
  text-transform: none;
  color: #9fb8cc;
  font-size: 0.6rem;
  letter-spacing: 0;
}

/* ── LOCATION ───────────────────────────────────────────────────── */
.location-layout { display: flex; flex-direction: column; gap: 1rem; }
@media (min-width: 768px) { .location-layout { flex-direction: row; align-items: flex-start; gap: 1.5rem; } }
.location-fields { flex: 1; display: flex; flex-direction: column; gap: 0.875rem; }
.location-hint { font-size: 0.78rem; color: #7a9bb5; font-style: italic; margin: 0.25rem 0 0; }

.map-placeholder {
  width: 100%; height: 9rem;
  background-color: #dce8f0;
  background-image: linear-gradient(rgba(0,45,90,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,45,90,0.08) 1px, transparent 1px);
  background-size: 24px 24px;
  border-radius: 10px;
  border: 1px solid #c5d8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
@media (min-width: 768px)  { .map-placeholder { width: 40%; height: 10.5rem; } }
@media (min-width: 1280px) { .map-placeholder { width: 35%; } }

.map-pin-wrap {
  width: 2.75rem; height: 2.75rem; background: #fff; border-radius: 50%;
  box-shadow: 0 3px 14px rgba(0,45,90,0.18);
  display: flex; align-items: center; justify-content: center;
}
.map-pin { animation: mapBounce 1.6s ease-in-out infinite; }
@keyframes mapBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

/* ── ADDRESS ────────────────────────────────────────────────────── */
.address-sub-title {
  font-size: 0.65rem; font-weight: 700; color: #5a7d9a;
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem;
}
.mt-6 { margin-top: 1.5rem; }
.mt-4 { margin-top: 1rem; }
.mt-3 { margin-top: 0.875rem; }

.address-toggle-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1.125rem;
  background: #f0f6fb; border: 1px solid #c5d8e8; border-radius: 8px;
}
.address-toggle-info { display: flex; align-items: center; gap: 0.75rem; }
.address-toggle-icon-wrap {
  width: 2.125rem; height: 2.125rem; background: #fff; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 4px rgba(0,45,90,0.1); flex-shrink: 0;
}
.address-toggle-title { font-weight: 600; font-size: 0.875rem; color: #002d5a; margin: 0; }
.address-toggle-sub { font-size: 0.75rem; color: #7a9bb5; margin: 0.1rem 0 0; }

/* ── TOGGLE SWITCH ──────────────────────────────────────────────── */
.toggle-switch { position: relative; display: inline-block; cursor: pointer; flex-shrink: 0; }
.toggle-input { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
.toggle-track {
  width: 2.75rem; height: 1.5rem; background: #b8cfe0; border-radius: 99px;
  position: relative; transition: background 0.22s ease; display: block;
}
.toggle-thumb {
  position: absolute; top: 2px; left: 2px;
  width: 1.25rem; height: 1.25rem; background: #fff; border-radius: 50%;
  box-shadow: 0 1px 5px rgba(0,0,0,0.18); transition: transform 0.22s ease;
}
.toggle-input:checked ~ .toggle-track { background: #002d5a; }
.toggle-input:checked ~ .toggle-track .toggle-thumb { transform: translateX(1.25rem); }

/* ── FOOTER ─────────────────────────────────────────────────────── */
.form-footer {
  display: flex; flex-direction: column; gap: 0.875rem;
  align-items: flex-start; padding: 1.25rem 0 2.5rem;
  margin-top: 0.25rem; border-top: 1px solid #d8e6f0;
}
@media (min-width: 600px) { .form-footer { flex-direction: row; align-items: center; justify-content: space-between; } }

.footer-terms { font-size: 0.8rem; color: #7a9bb5; margin: 0; }
.footer-link { color: #002d5a; font-weight: 600; text-decoration: none; }
.footer-link:hover { text-decoration: underline; }

.footer-actions { display: flex; gap: 0.625rem; flex-shrink: 0; width: 100%; }
@media (min-width: 600px) { .footer-actions { width: auto; } }

.btn-secondary {
  flex: 1; padding: 0.625rem 1.375rem; background: #fff;
  border: 1.5px solid #c5d8e8; border-radius: 8px;
  font-size: 0.875rem; font-weight: 600; color: #3a5f7a;
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: background 0.18s, border-color 0.18s;
  white-space: nowrap; text-align: center;
}
@media (min-width: 600px) { .btn-secondary { flex: none; } }
.btn-secondary:hover { background: #f0f6fb; border-color: #002d5a; color: #002d5a; }

.btn-primary {
  flex: 1; display: inline-flex; align-items: center; justify-content: center;
  gap: 0.25rem; padding: 0.625rem 1.75rem;
  background: linear-gradient(135deg, #002d5a 0%, #003f7f 100%);
  border: none; border-radius: 8px; font-size: 0.875rem; font-weight: 600;
  color: #fff; cursor: pointer; font-family: 'Inter', sans-serif;
  box-shadow: 0 3px 10px rgba(0,45,90,0.28);
  transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
  white-space: nowrap; line-height: 1;
}
@media (min-width: 600px) { .btn-primary { flex: none; } }
.btn-primary:hover { background: linear-gradient(135deg, #003d7a 0%, #00529e 100%); box-shadow: 0 5px 16px rgba(0,45,90,0.35); }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
</style>