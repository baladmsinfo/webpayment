<template>
  <div class="vo-root">

    <!-- ── STICKY HEADER ── -->
    <header class="vo-header">
      <div class="vo-header__brand">
        <div class="vo-header__icon">
          <span class="mdi mdi-truck-outline"></span>
        </div>
        <div class="vo-header__text">
          <h2 class="vo-header__title">Distributor Registration</h2>
          <p class="vo-header__sub">{{ steps[step - 1]?.label }}</p>
        </div>
      </div>
      <div class="vo-header__right">
        <div class="vo-header__step-badge">
          <span class="mdi mdi-progress-check"></span>
          Step {{ step }} / {{ steps.length }}
        </div>
      </div>
    </header>

    <!-- ── PROGRESS BAR (thin strip under header) ── -->
    <div class="vo-progress-strip">
      <div class="vo-progress-strip__fill" :style="{ width: ((step - 1) / (steps.length - 1) * 100) + '%' }"></div>
    </div>

    <!-- ── MAIN CONTENT ── -->
    <main class="vo-main">
      <div class="vo-content">

        <!-- ── STEPPER DOTS ── -->
        <div class="vo-stepper-bar">
          <div v-for="(s, i) in steps" :key="s.key" class="vo-stepper-item">
            <div class="vo-stepper-node" :class="{
              'vo-node--active': step === i + 1,
              'vo-node--done': step > i + 1,
              'vo-node--pending': step < i + 1
            }">
              <span v-if="step > i + 1" class="mdi mdi-check vo-node-icon"></span>
              <span v-else class="mdi vo-node-icon" :class="s.icon"></span>
            </div>
            <span class="vo-stepper-label" :class="{ 'vo-stepper-label--active': step === i + 1 }">{{ s.short }}</span>
          </div>
          <div class="vo-stepper-track">
            <div class="vo-stepper-track__fill" :style="{ width: ((step - 1) / (steps.length - 1) * 100) + '%' }"></div>
          </div>
        </div>

        <!-- ── FORM CARD ── -->
        <div class="vo-card">

          <!-- ════ STEP 1 — Business Details + Login ════ -->
          <template v-if="step === 1">
            <div class="vo-card__head">
              <div class="vo-card-icon-wrap">
                <span class="mdi mdi-domain"></span>
              </div>
              <div>
                <h2 class="vo-card__heading">Business Details</h2>
                <p class="vo-card__desc">Enter your distributor identity, primary contact &amp; set a login password.</p>
              </div>
            </div>

            <div class="vo-card__body">
              <div class="vo-grid vo-grid--3">
                <div class="vo-field-wrap">
                  <label class="vo-label">DISTRIBUTOR / COMPANY NAME</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-office-building-outline vo-input-icon"></span>
                    <input v-model.trim="form.name" class="vo-input" placeholder="Enter distributor or company name" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">PRIMARY EMAIL</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-email-outline vo-input-icon"></span>
                    <input v-model="form.primary_email_id" class="vo-input" placeholder="example@company.com" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">PRIMARY MOBILE</label>
                  <div class="vo-input-box">
                    <span class="vo-prefix">+91</span>
                    <input v-model="form.primary_mobile" class="vo-input vo-input--prefix" placeholder="10-digit mobile" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">PASSWORD</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-lock-outline vo-input-icon"></span>
                    <input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="vo-input"
                      placeholder="Min. 8 characters" />
                    <button type="button" class="vo-input-eye" @click="showPassword = !showPassword" tabindex="-1">
                      <span class="mdi" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                    </button>
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">CONFIRM PASSWORD</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-lock-check-outline vo-input-icon"></span>
                    <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="vo-input"
                      placeholder="Re-enter password" />
                    <button type="button" class="vo-input-eye" @click="showConfirmPassword = !showConfirmPassword" tabindex="-1">
                      <span class="mdi" :class="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ════ STEP 2 — Official Address ════ -->
          <template v-else-if="step === 2">
            <div class="vo-card__head">
              <div class="vo-card-icon-wrap">
                <span class="mdi mdi-map-marker-outline"></span>
              </div>
              <div>
                <h2 class="vo-card__heading">Official Address</h2>
                <p class="vo-card__desc">Registered office address for your distributor account.</p>
              </div>
            </div>

            <div class="vo-card__body">
              <div class="vo-grid vo-grid--4">
                <div class="vo-field-wrap vo-span2">
                  <label class="vo-label">DOOR NO / OFFICE ADDRESS</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-home-outline vo-input-icon"></span>
                    <input v-model.trim="form.official_address" class="vo-input" placeholder="Door number or office address" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STREET LINE 1</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-road-variant vo-input-icon"></span>
                    <input v-model.trim="form.address1" class="vo-input" placeholder="Street address line 1" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STREET LINE 2</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-road-variant vo-input-icon"></span>
                    <input v-model.trim="form.address2" class="vo-input" placeholder="Street address line 2" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">LANDMARK</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-sign-direction vo-input-icon"></span>
                    <input v-model.trim="form.address3" class="vo-input" placeholder="Landmark (optional)" />
                  </div>
                </div>
                <div class="vo-field-wrap vo-pincode-wrap">
                  <label class="vo-label">SEARCH PINCODE</label>
                  <div class="vo-input-box" :class="{ 'vo-input-box--focus': opPinFocus }">
                    <span class="mdi mdi-map-search-outline vo-input-icon"></span>
                    <input
                      v-model="opPincodeQuery"
                      class="vo-input"
                      placeholder="Type area or pincode"
                      autocomplete="off"
                      @focus="opPinFocus = true; opPinOpen = true"
                      @blur="setTimeout(() => { opPinFocus = false; opPinOpen = false }, 180)"
                      @input="opinSearch(opPincodeQuery)"
                    />
                    <span v-if="loading && opPinFocus" class="mdi mdi-loading vo-input-spinner"></span>
                  </div>
                  <div v-if="opPinOpen && opincodeOptions.length" class="vo-pin-dropdown">
                    <div
                      v-for="opt in opincodeOptions"
                      :key="opt.pincode"
                      class="vo-pin-option"
                      @mousedown.prevent="selectOpincode(opt)"
                    >
                      <span class="mdi mdi-map-marker-outline vo-pin-option__icon"></span>
                      <div>
                        <p class="vo-pin-option__code">{{ opt.pincode }}</p>
                        <p class="vo-pin-option__sub">{{ opt.city }}, {{ opt.statename }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="opPinOpen && !opincodeOptions.length && opPincodeQuery.length >= 2 && !loading" class="vo-pin-dropdown">
                    <p class="vo-pin-empty">No results found</p>
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">PINCODE</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-pound vo-input-icon"></span>
                    <input v-model.trim="form.pincode" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">CITY</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-city-variant-outline vo-input-icon"></span>
                    <input v-model.trim="form.city" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STATE</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-map-outline vo-input-icon"></span>
                    <input v-model.trim="form.state" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ════ STEP 3 — Residential & Visitor Address ════ -->
          <template v-else-if="step === 3">
            <div class="vo-card__head">
              <div class="vo-card-icon-wrap">
                <span class="mdi mdi-home-city-outline"></span>
              </div>
              <div>
                <h2 class="vo-card__heading">Address Details</h2>
                <p class="vo-card__desc">Residential and visitor / shop address information.</p>
              </div>
            </div>

            <div class="vo-card__body">

              <!-- Sub-section label -->
              <p class="vo-address-sub-title">RESIDENTIAL ADDRESS</p>

              <!-- Toggle card -->
              <div class="vo-toggle-card">
                <div class="vo-toggle-info">
                  <div class="vo-toggle-icon">
                    <span class="mdi mdi-home-outline"></span>
                  </div>
                  <div>
                    <p class="vo-toggle-title">Residential Address</p>
                    <p class="vo-toggle-sub">Same as official address?</p>
                  </div>
                </div>
                <label class="vo-switch">
                  <input type="checkbox" v-model="sameAsOfficialResidential" @change="copyOfficialToResidential" class="vo-switch-input" />
                  <div class="vo-switch-track">
                    <div class="vo-switch-thumb"></div>
                  </div>
                </label>
              </div>

              <div v-if="!sameAsOfficialResidential" class="vo-grid vo-grid--4 vo-mt">
                <div class="vo-field-wrap">
                  <label class="vo-label">DOOR NO / RES ADDRESS</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-home-outline vo-input-icon"></span>
                    <input v-model.trim="form.residential_address" class="vo-input" placeholder="Residential door no." />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STREET LINE 1</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-road-variant vo-input-icon"></span>
                    <input v-model.trim="form.res_address1" class="vo-input" placeholder="Street address 1" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STREET LINE 2</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-road-variant vo-input-icon"></span>
                    <input v-model.trim="form.res_address2" class="vo-input" placeholder="Street address 2" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">LANDMARK</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-sign-direction vo-input-icon"></span>
                    <input v-model.trim="form.res_address3" class="vo-input" placeholder="Landmark (optional)" />
                  </div>
                </div>
                <div class="vo-field-wrap vo-pincode-wrap">
                  <label class="vo-label">SEARCH PINCODE</label>
                  <div class="vo-input-box" :class="{ 'vo-input-box--focus': resPinFocus }">
                    <span class="mdi mdi-map-search-outline vo-input-icon"></span>
                    <input
                      v-model="resPincodeQuery"
                      class="vo-input"
                      placeholder="Type area or pincode"
                      autocomplete="off"
                      @focus="resPinFocus = true; resPinOpen = true"
                      @blur="setTimeout(() => { resPinFocus = false; resPinOpen = false }, 180)"
                      @input="respinSearch(resPincodeQuery)"
                    />
                    <span v-if="loading && resPinFocus" class="mdi mdi-loading vo-input-spinner"></span>
                  </div>
                  <div v-if="resPinOpen && respincodeOptions.length" class="vo-pin-dropdown">
                    <div
                      v-for="opt in respincodeOptions"
                      :key="opt.pincode"
                      class="vo-pin-option"
                      @mousedown.prevent="selectResPincode(opt)"
                    >
                      <span class="mdi mdi-map-marker-outline vo-pin-option__icon"></span>
                      <div>
                        <p class="vo-pin-option__code">{{ opt.pincode }}</p>
                        <p class="vo-pin-option__sub">{{ opt.city }}, {{ opt.statename }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="resPinOpen && !respincodeOptions.length && resPincodeQuery.length >= 2 && !loading" class="vo-pin-dropdown">
                    <p class="vo-pin-empty">No results found</p>
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">PINCODE</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-pound vo-input-icon"></span>
                    <input v-model.trim="form.res_pincode" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">CITY</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-city-variant-outline vo-input-icon"></span>
                    <input v-model.trim="form.res_city" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STATE</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-map-outline vo-input-icon"></span>
                    <input v-model.trim="form.res_state" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
              </div>

              <div class="vo-section-divider"></div>

              <p class="vo-address-sub-title">VISITOR / SHOP ADDRESS</p>

              <!-- Toggle card visitor -->
              <div class="vo-toggle-card">
                <div class="vo-toggle-info">
                  <div class="vo-toggle-icon">
                    <span class="mdi mdi-storefront-outline"></span>
                  </div>
                  <div>
                    <p class="vo-toggle-title">Visitor / Shop Address</p>
                    <p class="vo-toggle-sub">Same as official address?</p>
                  </div>
                </div>
                <label class="vo-switch">
                  <input type="checkbox" v-model="sameAsOfficialVisitor" @change="copyOfficialToVisitor" class="vo-switch-input" />
                  <div class="vo-switch-track">
                    <div class="vo-switch-thumb"></div>
                  </div>
                </label>
              </div>

              <div v-if="!sameAsOfficialVisitor" class="vo-grid vo-grid--4 vo-mt">
                <div class="vo-field-wrap">
                  <label class="vo-label">DOOR NO / VISITOR ADDRESS</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-storefront-outline vo-input-icon"></span>
                    <input v-model.trim="form.vister_address" class="vo-input" placeholder="Visitor/shop door no." />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STREET LINE 1</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-road-variant vo-input-icon"></span>
                    <input v-model.trim="form.v_address1" class="vo-input" placeholder="Street address 1" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STREET LINE 2</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-road-variant vo-input-icon"></span>
                    <input v-model.trim="form.v_address2" class="vo-input" placeholder="Street address 2" />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">LANDMARK</label>
                  <div class="vo-input-box">
                    <span class="mdi mdi-sign-direction vo-input-icon"></span>
                    <input v-model.trim="form.v_address3" class="vo-input" placeholder="Landmark (optional)" />
                  </div>
                </div>
                <div class="vo-field-wrap vo-pincode-wrap">
                  <label class="vo-label">SEARCH PINCODE</label>
                  <div class="vo-input-box" :class="{ 'vo-input-box--focus': vPinFocus }">
                    <span class="mdi mdi-map-search-outline vo-input-icon"></span>
                    <input
                      v-model="vPincodeQuery"
                      class="vo-input"
                      placeholder="Type area or pincode"
                      autocomplete="off"
                      @focus="vPinFocus = true; vPinOpen = true"
                      @blur="setTimeout(() => { vPinFocus = false; vPinOpen = false }, 180)"
                      @input="vpinSearch(vPincodeQuery)"
                    />
                    <span v-if="loading && vPinFocus" class="mdi mdi-loading vo-input-spinner"></span>
                  </div>
                  <div v-if="vPinOpen && vpincodeOptions.length" class="vo-pin-dropdown">
                    <div
                      v-for="opt in vpincodeOptions"
                      :key="opt.pincode"
                      class="vo-pin-option"
                      @mousedown.prevent="selectVPincode(opt)"
                    >
                      <span class="mdi mdi-map-marker-outline vo-pin-option__icon"></span>
                      <div>
                        <p class="vo-pin-option__code">{{ opt.pincode }}</p>
                        <p class="vo-pin-option__sub">{{ opt.city }}, {{ opt.statename }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="vPinOpen && !vpincodeOptions.length && vPincodeQuery.length >= 2 && !loading" class="vo-pin-dropdown">
                    <p class="vo-pin-empty">No results found</p>
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">PINCODE</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-pound vo-input-icon"></span>
                    <input v-model.trim="form.v_pincode" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">CITY</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-city-variant-outline vo-input-icon"></span>
                    <input v-model.trim="form.v_city" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
                <div class="vo-field-wrap">
                  <label class="vo-label">STATE</label>
                  <div class="vo-input-box vo-input-box--disabled">
                    <span class="mdi mdi-map-outline vo-input-icon"></span>
                    <input v-model.trim="form.v_state" class="vo-input" placeholder="Auto-filled" disabled />
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ── CARD FOOTER ACTIONS ── -->
          <div class="vo-card-footer">
            <p class="vo-footer-terms">
              By continuing, you agree to our
              <a href="#" class="vo-footer-link">Terms of Service</a>.
            </p>
            <div class="vo-footer-actions">
              <button v-if="step > 1" class="vo-btn-secondary" @click="prevStep">
                <span class="mdi mdi-arrow-left"></span>
                Back
              </button>
              <button class="vo-btn-primary" :disabled="loading" @click="next">
                <span v-if="loading" class="vo-spinner"></span>
                <template v-else-if="step === steps.length">
                  Create Distributor Account
                  <span class="mdi mdi-check"></span>
                </template>
                <template v-else>
                  Continue
                  <span class="mdi mdi-arrow-right"></span>
                </template>
              </button>
            </div>
          </div>
        </div>

        <!-- ── HELPER INFO CARDS ── -->
        <div class="vo-info-row">
          <div class="vo-info-card">
            <div class="vo-info-card__icon">
              <span class="mdi mdi-file-document-outline"></span>
            </div>
            <div>
              <p class="vo-info-card__title">Documents Come Next</p>
              <p class="vo-info-card__desc">After registering, you'll be prompted from your dashboard to select a business type and upload verification documents.</p>
            </div>
          </div>
          <div class="vo-info-card">
            <div class="vo-info-card__icon">
              <span class="mdi mdi-shield-check-outline"></span>
            </div>
            <div>
              <p class="vo-info-card__title">Secure Processing</p>
              <p class="vo-info-card__desc">Your data is encrypted using industry-standard protocols.</p>
            </div>
          </div>
        </div>

        <p class="vo-login-row">
          Already registered?
          <span class="vo-login-link" @click="router.push('/')">Log In</span>
        </p>

      </div>
    </main>

    <!-- ── SNACKBAR ── -->
    <transition name="snack">
      <div v-if="snackbar.show" class="vo-snackbar" :class="'vo-snackbar--' + snackbar.color">
        <span class="mdi" :class="snackbar.color === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
        <span>{{ snackbar.message }}</span>
        <button class="vo-snackbar__close" @click="snackbar.show = false">
          <span class="mdi mdi-close"></span>
        </button>
      </div>
    </transition>

    <!-- ── PROCESSING OVERLAY ── -->
    <transition name="fade">
      <div v-if="submitting" class="vo-overlay">
        <div class="vo-overlay__card">
          <div class="vo-overlay__spinner"></div>
          <p class="vo-overlay__title">Processing your registration</p>
          <p class="vo-overlay__sub">Please wait, do not close this page</p>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useUsersApi } from "@/composables/apis/useUsersApi";
import { useRouter } from "vue-router";

const { pincodeSearch } = useOnboadingApi();
const { registerVendor } = useUsersApi();
const router = useRouter();

// ── State ──────────────────────────────────────────────────────────
const step = ref(1);
const loading = ref(false);
const submitting = ref(false);
const sameAsOfficialResidential = ref(false);
const sameAsOfficialVisitor = ref(false);
const snackbar = reactive({ show: false, message: "", color: "success" });
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Pincode dropdown query state
const opPincodeQuery = ref('');
const resPincodeQuery = ref('');
const vPincodeQuery = ref('');
const opPinFocus = ref(false);
const resPinFocus = ref(false);
const vPinFocus = ref(false);
const opPinOpen = ref(false);
const resPinOpen = ref(false);
const vPinOpen = ref(false);

const opincodeOptions = ref([]);
const respincodeOptions = ref([]);
const vpincodeOptions = ref([]);

const steps = [
  { key: "business",  label: "Business Details",  short: "Business",  icon: "mdi-domain" },
  { key: "official",  label: "Official Address",   short: "Official",  icon: "mdi-map-marker-outline" },
  { key: "addresses", label: "Address Details",    short: "Addresses", icon: "mdi-home-city-outline" },
];

const form = reactive({
  name: "", primary_email_id: "", primary_mobile: "", password: "", confirmPassword: "",
  official_address: "", address1: "", address2: "", address3: "", phone: "", city: "", state: "", pincode: "",
  residential_address: "", res_address1: "", res_address2: "", res_address3: "", res_mobile: "", res_phone_number: "", res_city: "", res_state: "", res_pincode: "",
  vister_address: "", v_address1: "", v_address2: "", v_address3: "", v_mobile: "", v_phone_number: "", v_city: "", v_state: "", v_pincode: "",
  lat: "", long: "",
});

// ── Helpers ────────────────────────────────────────────────────────
function showSnack(message, color = "success") {
  snackbar.message = message; snackbar.color = color; snackbar.show = true;
  setTimeout(() => snackbar.show = false, 4000);
}

function copyOfficialToResidential() {
  if (sameAsOfficialResidential.value) {
    Object.assign(form, {
      residential_address: form.official_address, res_address1: form.address1,
      res_address2: form.address2, res_address3: form.address3,
      res_city: form.city, res_state: form.state, res_pincode: form.pincode
    });
  }
}

function copyOfficialToVisitor() {
  if (sameAsOfficialVisitor.value) {
    Object.assign(form, {
      vister_address: form.official_address, v_address1: form.address1,
      v_address2: form.address2, v_address3: form.address3,
      v_city: form.city, v_state: form.state, v_pincode: form.pincode
    });
  }
}

// ── Pincode search handlers ────────────────────────────────────────
const opinSearch = async (query) => {
  if (!query || query.length < 2) { opincodeOptions.value = []; return; }
  loading.value = true;
  try { const res = await pincodeSearch(query); opincodeOptions.value = res.data.data; }
  catch (err) { console.error("Official pincode search failed", err); }
  finally { loading.value = false; }
};

const respinSearch = async (query) => {
  if (!query || query.length < 2) { respincodeOptions.value = []; return; }
  loading.value = true;
  try { const res = await pincodeSearch(query); respincodeOptions.value = res.data.data; }
  catch (err) { console.error("Residential pincode search failed", err); }
  finally { loading.value = false; }
};

const vpinSearch = async (query) => {
  if (!query || query.length < 2) { vpincodeOptions.value = []; return; }
  loading.value = true;
  try { const res = await pincodeSearch(query); vpincodeOptions.value = res.data.data; }
  catch (err) { console.error("Visitor pincode search failed", err); }
  finally { loading.value = false; }
};

function selectOpincode(opt) {
  form.city = opt.city; form.state = opt.statename; form.pincode = opt.pincode;
  opPincodeQuery.value = opt.pincode; opPinOpen.value = false; opincodeOptions.value = [];
}

function selectResPincode(opt) {
  form.res_city = opt.city; form.res_state = opt.statename; form.res_pincode = opt.pincode;
  resPincodeQuery.value = opt.pincode; resPinOpen.value = false; respincodeOptions.value = [];
}

function selectVPincode(opt) {
  form.v_city = opt.city; form.v_state = opt.statename; form.v_pincode = opt.pincode;
  vPincodeQuery.value = opt.pincode; vPinOpen.value = false; vpincodeOptions.value = [];
}

function prevStep() { if (step.value > 1) step.value--; }

const next = async () => {
  loading.value = true;
  try {
    if (step.value === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[6-9]\d{9}$/;

      if (!form.name.trim()) {
        showSnack("Distributor name is required", "error"); return;
      }
      if (!form.primary_email_id.trim() || !emailRegex.test(form.primary_email_id.trim())) {
        showSnack("Enter a valid email address", "error"); return;
      }
      if (!form.primary_mobile.trim() || !mobileRegex.test(form.primary_mobile.trim())) {
        showSnack("Enter a valid 10-digit Indian mobile number", "error"); return;
      }
      if (!form.password || form.password.length < 8) {
        showSnack("Password must be at least 8 characters", "error"); return;
      }
      if (form.password !== form.confirmPassword) {
        showSnack("Passwords do not match", "error"); return;
      }
    }

    if (step.value === 2) {
      const pincodeRegex = /^\d{6}$/;

      if (!form.official_address || !form.address1 || !form.address2 || !form.city || !form.state || !form.pincode) {
        showSnack("Please fill all required fields", "error"); return;
      }
      if (!form.official_address.trim()) {
        showSnack("Door no / office address is required", "error"); return;
      }
      if (!form.address1.trim()) {
        showSnack("Street line 1 is required", "error"); return;
      }
      if (!form.city.trim()) {
        showSnack("City is required — please search and select a pincode", "error"); return;
      }
      if (!form.state.trim()) {
        showSnack("State is required — please search and select a pincode", "error"); return;
      }
      if (!form.pincode.trim() || !pincodeRegex.test(form.pincode.trim())) {
        showSnack("Please search and select a valid pincode", "error"); return;
      }
    }

    if (step.value === 3) {
      if (!form.residential_address || !form.res_address1 || !form.res_address2 || !form.res_city || !form.res_state || !form.res_pincode) {
        showSnack("Please fill all required residential address fields", "error"); return;
      }
      if (!form.vister_address || !form.v_address1 || !form.v_address2 || !form.v_city || !form.v_state || !form.v_pincode) {
        showSnack("Please fill all required visitor address fields", "error"); return;
      }

      const pincodeRegex = /^\d{6}$/;

      if (!form.residential_address.trim()) {
        showSnack("Residential door no / address is required", "error"); return;
      }
      if (!form.res_address1.trim()) {
        showSnack("Residential street line 1 is required", "error"); return;
      }
      if (!form.res_city.trim() || !form.res_state.trim() || !form.res_pincode.trim()) {
        showSnack("Please select a valid residential pincode", "error"); return;
      }
      if (!pincodeRegex.test(form.res_pincode.trim())) {
        showSnack("Residential pincode must be 6 digits", "error"); return;
      }

      if (!form.vister_address.trim()) {
        showSnack("Visitor / shop door no / address is required", "error"); return;
      }
      if (!form.v_address1.trim()) {
        showSnack("Visitor street line 1 is required", "error"); return;
      }
      if (!form.v_city.trim() || !form.v_state.trim() || !form.v_pincode.trim()) {
        showSnack("Please select a valid visitor / shop pincode", "error"); return;
      }
      if (!pincodeRegex.test(form.v_pincode.trim())) {
        showSnack("Visitor pincode must be 6 digits", "error"); return;
      }

      const payload = {
        email: form.primary_email_id,
        password: form.password,
        mobile_no: form.primary_mobile,
        name: form.name,
        lat: form.lat || null,
        long: form.long || null,
        addresses: {
          official: { address: form.official_address, address1: form.address1, address2: form.address2, address3: form.address3 || null, city: form.city, state: form.state, pincode: form.pincode, phone: form.phone || null },
          residential: { address: form.residential_address, address1: form.res_address1, address2: form.res_address2, address3: form.res_address3 || null, city: form.res_city, state: form.res_state, pincode: form.res_pincode, mobile: form.res_mobile || null },
          visitor: { address: form.vister_address, address1: form.v_address1, address2: form.v_address2, address3: form.v_address3 || null, city: form.v_city, state: form.v_state, pincode: form.v_pincode, mobile: form.v_mobile || null },
        }
      };

      submitting.value = true;
      try {
        const result = await registerVendor(payload);
        if (result?.statusCode === "00") {
          showSnack("Distributor account created! Redirecting to your dashboard…", "success");
          setTimeout(() => router.push("/vendor/dashboard"), 1200);
        } else {
          showSnack(result?.message || "Error creating distributor account", "error");
        }
      } finally { submitting.value = false; }
      return;
    }

    if (step.value < steps.length) step.value++;
  } finally { loading.value = false; }
};
</script>

<style scoped>
/* ── RESET ──────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── ROOT ───────────────────────────────────────────────────────── */
.vo-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #f0f4f8;
}

/* ── HEADER ─────────────────────────────────────────────────────── */
.vo-header {
  padding: 0.875rem 1.25rem;
  background: #002d5a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 0.75rem;
}

@media (min-width: 640px) { .vo-header { padding: 0.875rem 1.75rem; } }
@media (min-width: 1024px) { .vo-header { padding: 0.875rem 2.5rem; } }

.vo-header__brand { display: flex; align-items: center; gap: 0.625rem; min-width: 0; }

.vo-header__icon {
  width: 2.125rem;
  height: 2.125rem;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.vo-header__text { min-width: 0; }

.vo-header__title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vo-header__sub {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vo-header__right { flex-shrink: 0; }

.vo-header__step-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.12);
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  white-space: nowrap;
  border: 1px solid rgba(255,255,255,0.15);
}

/* ── PROGRESS STRIP ─────────────────────────────────────────────── */
.vo-progress-strip {
  height: 3px;
  background: #d0dae6;
  position: sticky;
  top: 56px;
  z-index: 49;
}

.vo-progress-strip__fill {
  height: 100%;
  background: linear-gradient(90deg, #0052a3, #0077cc);
  transition: width 0.5s ease;
}

/* ── MAIN ───────────────────────────────────────────────────────── */
.vo-main {
  flex: 1;
  padding: 1.25rem 1rem 2rem;
  display: flex;
  justify-content: center;
}

@media (min-width: 640px) { .vo-main { padding: 1.5rem 1.5rem 2.5rem; } }
@media (min-width: 1024px) { .vo-main { padding: 2rem 2rem 3rem; } }

.vo-content {
  width: 100%;
  max-width: 960px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── STEPPER BAR ────────────────────────────────────────────────── */
.vo-stepper-bar {
  background: #ffffff;
  border: 1px solid #d0dae6;
  border-radius: 10px;
  padding: 1.125rem 1.25rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.vo-stepper-track {
  position: absolute;
  top: calc(1.125rem + 20px);
  left: calc(1.25rem + 20px);
  right: calc(1.25rem + 20px);
  height: 3px;
  background: #e5edf5;
  border-radius: 3px;
  z-index: 0;
}

.vo-stepper-track__fill {
  height: 100%;
  background: #002d5a;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.vo-stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
  flex: 1;
}

.vo-stepper-node {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.vo-node--active {
  background: #002d5a;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0,45,90,0.3);
}

.vo-node--done {
  background: #002d5a;
  color: #fff;
}

.vo-node--pending {
  background: #e5edf5;
  color: #8aafc8;
}

.vo-node-icon { font-size: 1rem; }

.vo-stepper-label {
  font-size: 0.6rem;
  font-weight: 500;
  color: #8aafc8;
  text-align: center;
  line-height: 1.3;
  white-space: nowrap;
}

.vo-stepper-label--active {
  color: #002d5a;
  font-weight: 700;
}

/* ── MAIN FORM CARD ─────────────────────────────────────────────── */
.vo-card {
  background: #ffffff;
  border: 1px solid #d0dae6;
  border-radius: 10px;
  overflow: hidden;
}

/* ── CARD HEAD ──────────────────────────────────────────────────── */
.vo-card__head {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.375rem 1.375rem 0;
  margin-bottom: 1.125rem;
}

@media (min-width: 640px) { .vo-card__head { padding: 1.625rem 1.75rem 0; } }

.vo-card-icon-wrap {
  width: 2.625rem;
  height: 2.625rem;
  background: #002d5a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,45,90,0.25);
}

.vo-card__heading {
  font-size: 1rem;
  font-weight: 700;
  color: #002d5a;
}

@media (min-width: 640px) { .vo-card__heading { font-size: 1.125rem; } }

.vo-card__desc {
  font-size: 0.78rem;
  color: #5a7d9a;
  margin-top: 0.2rem;
  line-height: 1.5;
}

/* ── CARD BODY ──────────────────────────────────────────────────── */
.vo-card__body {
  padding: 0 1.375rem 1.375rem;
}

@media (min-width: 640px) { .vo-card__body { padding: 0 1.75rem 1.75rem; } }

/* ── GRIDS ──────────────────────────────────────────────────────── */
.vo-grid {
  display: grid;
  gap: 0.75rem;
}

.vo-grid--2 { grid-template-columns: 1fr; }
@media (min-width: 480px) { .vo-grid--2 { grid-template-columns: repeat(2, 1fr); } }

.vo-grid--3 { grid-template-columns: 1fr; }
@media (min-width: 560px) { .vo-grid--3 { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 820px) { .vo-grid--3 { grid-template-columns: repeat(3, 1fr); } }

.vo-grid--4 { grid-template-columns: 1fr; }
@media (min-width: 480px) { .vo-grid--4 { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 900px) { .vo-grid--4 { grid-template-columns: repeat(4, 1fr); } }

.vo-span2 { grid-column: span 1; }
@media (min-width: 480px) { .vo-span2 { grid-column: span 2; } }

/* ── FIELD ──────────────────────────────────────────────────────── */
.vo-field-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.vo-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #5a7d9a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-left: 0.1rem;
}

.vo-input-box {
  display: flex;
  align-items: center;
  position: relative;
  background: #ffffff;
  border: 1.5px solid #c5d8e8;
  border-radius: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.vo-input-box:focus-within {
  border-color: #002d5a;
  box-shadow: 0 0 0 3px rgba(0,45,90,0.1);
}

.vo-input-box--disabled {
  background: #f0f5f9 !important;
  border-color: #d8e6f0 !important;
  box-shadow: none !important;
}

.vo-input-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.9375rem;
  color: #8aafc8;
  pointer-events: none;
  flex-shrink: 0;
  transition: color 0.2s;
}

.vo-input-box:focus-within .vo-input-icon { color: #002d5a; }
.vo-input-box--disabled .vo-input-icon { color: #b8cfe0; }

.vo-prefix {
  padding: 0 0.375rem 0 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #4a6a85;
  white-space: nowrap;
  flex-shrink: 0;
}

.vo-input {
  flex: 1;
  padding: 0.625rem 0.75rem 0.625rem 2.25rem;
  font-size: 0.8125rem;
  color: #0d1b2a;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  min-width: 0;
}

.vo-input--prefix { padding-left: 0.375rem; }

.vo-input::placeholder { color: #9fb8cc; }

.vo-input:disabled {
  color: #8aafc8;
  -webkit-text-fill-color: #8aafc8;
  cursor: not-allowed;
}

.vo-select {
  appearance: none;
  cursor: pointer;
}

.vo-input-eye {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.75rem;
  color: #8aafc8;
  font-size: 1rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.vo-input-eye:hover { color: #002d5a; }

/* ── ADDRESS SUB-TITLE ──────────────────────────────────────────── */
.vo-address-sub-title {
  font-size: 0.65rem;
  font-weight: 700;
  color: #5a7d9a;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

/* ── SECTION DIVIDER ────────────────────────────────────────────── */
.vo-section-divider {
  border: none;
  border-top: 1px solid #e8f0f7;
  margin: 1.25rem 0;
}

/* ── TOGGLE CARD ────────────────────────────────────────────────── */
.vo-toggle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.125rem;
  background: #f0f6fb;
  border: 1px solid #c5d8e8;
  border-radius: 8px;
  gap: 0.75rem;
}

.vo-toggle-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vo-toggle-icon {
  width: 2.125rem;
  height: 2.125rem;
  background: #fff;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #002d5a;
  font-size: 1rem;
  box-shadow: 0 1px 4px rgba(0,45,90,0.1);
  flex-shrink: 0;
}

.vo-toggle-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #002d5a;
}

.vo-toggle-sub {
  font-size: 0.75rem;
  color: #7a9bb5;
  margin-top: 0.1rem;
}

/* ── SWITCH ─────────────────────────────────────────────────────── */
.vo-switch {
  position: relative;
  display: inline-block;
  cursor: pointer;
  flex-shrink: 0;
}

.vo-switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.vo-switch-track {
  width: 2.75rem;
  height: 1.5rem;
  background: #b8cfe0;
  border-radius: 9999px;
  position: relative;
  transition: background 0.22s;
}

.vo-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 5px rgba(0,0,0,0.18);
  transition: transform 0.22s;
}

.vo-switch-input:checked ~ .vo-switch-track { background: #002d5a; }
.vo-switch-input:checked ~ .vo-switch-track .vo-switch-thumb { transform: translateX(1.25rem); }

/* ── BUSINESS TYPE GRID ─────────────────────────────────────────── */
.vo-btype-grid {
  display: grid;
  gap: 0.625rem;
  grid-template-columns: 1fr;
  margin-bottom: 1rem;
}

@media (min-width: 460px) { .vo-btype-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 720px) { .vo-btype-grid { grid-template-columns: repeat(3, 1fr); } }

.vo-btype-card {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1rem;
  background: #f8fbfd;
  border: 1.5px solid #c5d8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.vo-btype-card:hover {
  border-color: #002d5a;
  background: #f0f5fb;
}

.vo-btype-card--selected {
  border-color: #002d5a;
  background: #eaf1f9;
  box-shadow: 0 0 0 2px rgba(0,45,90,0.1);
}

.vo-btype-radio {
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 50%;
  border: 1.5px solid #c5d8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s;
}

.vo-btype-card--selected .vo-btype-radio { border-color: #002d5a; }

.vo-btype-radio-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: transparent;
  transition: background 0.2s;
}

.vo-btype-radio-dot--on { background: #002d5a; }

.vo-btype-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 7px;
  background: #e8f0f7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #002d5a;
  font-size: 1rem;
  flex-shrink: 0;
}

.vo-btype-body { flex: 1; min-width: 0; }
.vo-btype-name { font-size: 0.8125rem; font-weight: 700; color: #002d5a; }
.vo-btype-hint { font-size: 0.7rem; color: #5a7d9a; margin-top: 0.15rem; }

.vo-btype-check {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.9rem;
  color: #002d5a;
}

/* ── ALERTS ─────────────────────────────────────────────────────── */
.vo-info-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #e8f1fa;
  border: 1px solid #b8d0e8;
  border-radius: 8px;
  padding: 0.75rem 0.875rem;
}

.vo-info-alert__icon { font-size: 0.9375rem; color: #002d5a; flex-shrink: 0; margin-top: 1px; }
.vo-info-alert__text { font-size: 0.8125rem; color: #003d72; line-height: 1.5; }

.vo-warn-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #fff8ee;
  border: 1px solid #fbd89d;
  border-radius: 8px;
  padding: 0.75rem 0.875rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #7a4800;
  line-height: 1.5;
}

.vo-warn-alert__icon { font-size: 0.9375rem; color: #d97706; flex-shrink: 0; margin-top: 1px; }

.vo-success-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #eefaf3;
  border: 1px solid #a7e0bc;
  border-radius: 8px;
  padding: 0.75rem 0.875rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #145b32;
  line-height: 1.5;
}

.vo-success-alert__icon { font-size: 0.9375rem; color: #22c55e; flex-shrink: 0; margin-top: 1px; }

/* ── DOC GRID ───────────────────────────────────────────────────── */
.vo-doc-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 600px) { .vo-doc-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 860px) { .vo-doc-grid { grid-template-columns: repeat(4, 1fr); } }

.vo-doc-card {
  background: #f8fbfd;
  border: 1.5px solid #c5d8e8;
  border-radius: 8px;
  padding: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.vo-doc-card:hover { border-color: #002d5a; transform: translateY(-1px); }

.vo-doc-card--done {
  border-color: rgba(34,197,94,0.4);
  background: #eefaf3;
}

.vo-doc-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.625rem;
}

.vo-doc-card__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.vo-doc-card__icon--done { background: rgba(34,197,94,0.15); color: #22c55e; }
.vo-doc-card__icon--pending { background: #e8f0f7; color: #002d5a; }

.vo-doc-card__count {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}

.vo-doc-card__count--done { background: rgba(34,197,94,0.15); color: #15803d; }
.vo-doc-card__count--pending { background: #e8f0f7; color: #002d5a; }

.vo-doc-card__name {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #002d5a;
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.vo-doc-progress {
  height: 3px;
  background: #d8e6f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.vo-doc-progress__fill { height: 100%; border-radius: 3px; transition: width 0.4s; }
.vo-doc-progress__fill--done { background: #22c55e; }
.vo-doc-progress__fill--active { background: #002d5a; }

.vo-doc-card__cta { font-size: 0.65rem; color: #7a9bb5; }

/* ── DOC TYPE GRID ──────────────────────────────────────────────── */
.vo-doctype-grid {
  display: grid;
  gap: 0.625rem;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 0.75rem;
}

@media (min-width: 560px) { .vo-doctype-grid { grid-template-columns: repeat(3, 1fr); } }

.vo-doctype-card {
  background: #f8fbfd;
  border: 1.5px solid #c5d8e8;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.375rem;
}

.vo-doctype-card--done {
  border-color: rgba(34,197,94,0.4);
  background: #eefaf3;
}

.vo-doctype-card--locked {
  border-color: #d8e6f0;
  background: #f5f8fb;
  opacity: 0.72;
}

.vo-doctype-card__icon--locked { color: #8aafc8; }

.vo-doctype-card__icon { font-size: 1.5rem; }
.vo-doctype-card--done .vo-doctype-card__icon { color: #22c55e; }
.vo-doctype-card--pending .vo-doctype-card__icon { color: #f59e0b; }

.vo-doctype-card__name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #002d5a;
}

.vo-doctype-card__status {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.vo-doctype-card__status--done { background: rgba(34,197,94,0.15); color: #15803d; }
.vo-doctype-card__status--pending { background: rgba(245,158,11,0.12); color: #b45309; }
.vo-doctype-card__status--locked { background: #e8f0f7; color: #7a9bb5; }

.vo-doctype-card__btn {
  margin-top: auto;
  padding: 0.375rem 0.875rem;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-family: inherit;
  background: #002d5a;
  color: #fff;
  transition: all 0.15s;
}

.vo-doctype-card__btn:disabled { opacity: 0.45; cursor: not-allowed; }
.vo-doctype-card__btn:not(:disabled):hover { background: #003d7a; }

/* ── BACK BUTTON ────────────────────────────────────────────────── */
.vo-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #3a5f7a;
  background: #f0f5f9;
  border: 1.5px solid #c5d8e8;
  border-radius: 7px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.vo-back-btn:hover { background: #e0edf5; border-color: #002d5a; color: #002d5a; }

/* ── UPLOAD CARD ────────────────────────────────────────────────── */
.vo-upload-card {
  background: #f8fbfd;
  border: 1px solid #d0dae6;
  border-radius: 8px;
  padding: 1.25rem;
}

.vo-upload-zone {
  border: 2px dashed #c5d8e8;
  border-radius: 8px;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  background: #fff;
  transition: border-color 0.2s;
}

.vo-upload-zone:hover { border-color: #002d5a; }

.vo-upload-zone__icon { font-size: 2.25rem; color: #8aafc8; }
.vo-upload-zone__label { font-size: 0.875rem; font-weight: 600; color: #002d5a; }
.vo-upload-zone__sub { font-size: 0.75rem; color: #7a9bb5; }
.vo-upload-zone__count { font-size: 0.75rem; font-weight: 700; color: #002d5a; }

.vo-upload-zone__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.25rem;
  background: #e8f0f7;
  border: 1.5px solid #b8d0e8;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #002d5a;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.vo-upload-zone__btn:hover { background: #d8e8f4; }

.vo-upload-zone__input { position: absolute; opacity: 0; width: 0; height: 0; }

.vo-save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #002d5a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0,45,90,0.28);
  transition: background 0.18s, opacity 0.15s;
}

.vo-save-btn:hover:not(:disabled) { background: #003d7a; }
.vo-save-btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* ── CARD FOOTER ────────────────────────────────────────────────── */
.vo-card-footer {
  background: #f8fbfd;
  border-top: 1px solid #d8e6f0;
  padding: 1rem 1.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 600px) {
  .vo-card-footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.75rem;
  }
}

.vo-footer-terms {
  font-size: 0.75rem;
  color: #7a9bb5;
}

.vo-footer-link {
  color: #002d5a;
  font-weight: 600;
  text-decoration: none;
}

.vo-footer-link:hover { text-decoration: underline; }

.vo-footer-actions {
  display: flex;
  gap: 0.625rem;
  width: 100%;
}

@media (min-width: 600px) { .vo-footer-actions { width: auto; } }

.vo-btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.625rem 1.25rem;
  background: #fff;
  border: 1.5px solid #c5d8e8;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #3a5f7a;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
  white-space: nowrap;
}

@media (min-width: 600px) { .vo-btn-secondary { flex: none; } }

.vo-btn-secondary:hover {
  background: #f0f6fb;
  border-color: #002d5a;
  color: #002d5a;
}

.vo-btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.625rem 1.75rem;
  background: #002d5a;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  box-shadow: 0 3px 10px rgba(0,45,90,0.28);
  transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
  white-space: nowrap;
}

@media (min-width: 600px) { .vo-btn-primary { flex: none; } }

.vo-btn-primary:hover { background: #003d7a; box-shadow: 0 5px 16px rgba(0,45,90,0.35); }
.vo-btn-primary:active { transform: scale(0.98); }
.vo-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

/* ── SPINNER ────────────────────────────────────────────────────── */
.vo-spinner {
  width: 0.9375rem;
  height: 0.9375rem;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── INFO ROW ───────────────────────────────────────────────────── */
.vo-info-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 560px) { .vo-info-row { flex-direction: row; } }

.vo-info-card {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.125rem;
  background: #fff;
  border: 1px solid #d8e6f0;
  border-radius: 10px;
}

.vo-info-card__icon {
  padding: 0.5rem;
  background: #e8f0f7;
  border-radius: 7px;
  color: #002d5a;
  flex-shrink: 0;
  font-size: 1.125rem;
  line-height: 1;
}

.vo-info-card__title { font-size: 0.8125rem; font-weight: 700; color: #002d5a; }
.vo-info-card__desc { font-size: 0.75rem; color: #5a7d9a; margin-top: 0.2rem; line-height: 1.5; }

/* ── LOGIN ROW ──────────────────────────────────────────────────── */
.vo-login-row {
  text-align: center;
  font-size: 0.8rem;
  color: #5a7d9a;
  padding-bottom: 0.5rem;
}

.vo-login-link {
  color: #002d5a;
  font-weight: 700;
  cursor: pointer;
}

.vo-login-link:hover { text-decoration: underline; }

/* ── SNACKBAR ───────────────────────────────────────────────────── */
.vo-snackbar {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.125rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 9999;
  max-width: calc(100vw - 2.5rem);
}

.vo-snackbar--success { background: #002d5a; }
.vo-snackbar--error { background: #c62828; }

.vo-snackbar__close {
  background: none;
  border: none;
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-size: 1rem;
  margin-left: auto;
  flex-shrink: 0;
}

.snack-enter-active, .snack-leave-active { transition: all 0.3s ease; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translateY(-12px); }

/* ── PROCESSING OVERLAY ─────────────────────────────────────────── */
.vo-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,22,46,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  backdrop-filter: blur(4px);
}

.vo-overlay__card {
  background: #fff;
  border-radius: 14px;
  padding: 2.5rem 3rem;
  text-align: center;
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
}

.vo-overlay__spinner {
  width: 2.75rem;
  height: 2.75rem;
  border: 3px solid #e8f0f7;
  border-top-color: #002d5a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.25rem;
}

.vo-overlay__title { font-size: 1rem; font-weight: 700; color: #002d5a; }
.vo-overlay__sub { font-size: 0.75rem; color: #5a7d9a; margin-top: 0.375rem; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── PINCODE DROPDOWN ───────────────────────────────────────────── */
.vo-pincode-wrap {
  position: relative;
}

.vo-input-box--focus {
  border-color: #002d5a !important;
  box-shadow: 0 0 0 3px rgba(0, 45, 90, 0.1) !important;
}

.vo-input-spinner {
  position: absolute;
  right: 0.75rem;
  font-size: 1rem;
  color: #8aafc8;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

.vo-pin-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1.5px solid #c5d8e8;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 45, 90, 0.12);
  z-index: 100;
  overflow: hidden;
  max-height: 13rem;
  overflow-y: auto;
}

.vo-pin-dropdown::-webkit-scrollbar { width: 4px; }
.vo-pin-dropdown::-webkit-scrollbar-track { background: transparent; }
.vo-pin-dropdown::-webkit-scrollbar-thumb { background: #c5d8e8; border-radius: 4px; }

.vo-pin-option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f0f5f9;
}

.vo-pin-option:last-child { border-bottom: none; }

.vo-pin-option:hover { background: #f0f6fb; }

.vo-pin-option__icon {
  font-size: 1rem;
  color: #002d5a;
  flex-shrink: 0;
}

.vo-pin-option__code {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #002d5a;
}

.vo-pin-option__sub {
  font-size: 0.7rem;
  color: #7a9bb5;
  margin-top: 0.05rem;
}

.vo-pin-empty {
  padding: 0.875rem;
  font-size: 0.8rem;
  color: #8aafc8;
  text-align: center;
}

/* ── SPACING UTILITIES ──────────────────────────────────────────── */
.vo-mt { margin-top: 1rem; }
.vo-mt-sm { margin-top: 0.75rem; }

/* ── FIELD VALIDATION ───────────────────────────────────────────── */
.vo-input-box--error {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
}

.vo-input-box--error .vo-input-icon { color: #dc2626 !important; }

.vo-field-error {
  font-size: 0.65rem;
  font-weight: 600;
  color: #dc2626;
  padding-left: 0.1rem;
  margin-top: -0.1rem;
}

.vo-doc-validation-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #fff8ee;
  border: 1px solid #fbd89d;
  border-radius: 7px;
  font-size: 0.78rem;
  color: #7a4800;
  font-weight: 500;
  margin-top: 0.875rem;
}

.vo-doc-validation-hint .mdi { font-size: 0.9375rem; color: #d97706; flex-shrink: 0; }
</style>
