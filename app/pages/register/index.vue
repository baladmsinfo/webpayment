<template>
  <div class="register-root">

    <!-- ── LEFT PANEL (desktop) ── -->
    <div class="reg-left">
      <div class="left-inner">
        <div class="left-brand">
          <span class="brand-name">BUCKSBOX</span>
        </div>

        <div class="left-copy">
          <h2 class="left-headline">Become a<br />Bucksbox Merchant</h2>
          <p class="left-sub">
            Register once to unlock UPI, AEPS, DMT and BBPS collections from a single dashboard — built for
            businesses of every size.
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
          <div class="feature-pill"><span class="mdi mdi-qrcode-scan"></span> UPI</div>
          <div class="feature-pill"><span class="mdi mdi-fingerprint"></span> AEPS</div>
          <div class="feature-pill"><span class="mdi mdi-bank-transfer"></span> DMT</div>
          <div class="feature-pill"><span class="mdi mdi-lightning-bolt-outline"></span> BBPS</div>
        </div>
      </div>
    </div>

    <!-- ── RIGHT PANEL ── -->
    <div class="reg-right">
      <div class="reg-form-wrap">

        <!-- Mobile brand -->
        <div class="mobile-brand">
          <div class="brand-icon-solid"><span class="mdi mdi-shield-crown-outline"></span></div>
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

          <!-- ─────────── STEP 1: Account Setup ─────────── -->
          <div v-if="step === 1" class="step-pane">
            <p class="step-desc">Set up your login credentials to access the merchant portal.</p>

            <v-row dense>
              <v-col cols="12">
                <label class="field-label">EMAIL ADDRESS</label>
                <v-text-field v-model.trim="form.email" placeholder="merchant@email.com" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-email-outline" class="reg-field" hide-details="auto"
                  :error-messages="errors.email ? [errors.email] : []" @update:model-value="clearError('email')" />
              </v-col>

              <v-col cols="12">
                <label class="field-label">MOBILE NUMBER</label>
                <v-text-field v-model="form.mobile_no" placeholder="10-digit mobile" prefix="+91" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-phone-outline" class="reg-field" hide-details="auto"
                  maxlength="10" :error-messages="errors.mobile_no ? [errors.mobile_no] : []"
                  @update:model-value="clearError('mobile_no')" />
              </v-col>

              <v-col cols="12">
                <label class="field-label">PASSWORD</label>
                <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'"
                  placeholder="Min. 8 characters" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  @click:append-inner="showPassword = !showPassword" class="reg-field" hide-details="auto"
                  :error-messages="errors.password ? [errors.password] : []"
                  @update:model-value="clearError('password')" />
              </v-col>
            </v-row>

            <!-- Password strength -->
            <div v-if="form.password" class="strength-bar">
              <div v-for="i in 4" :key="i" class="seg" :class="strengthClass(i)" />
            </div>
            <p v-if="form.password" class="strength-label">{{ strengthLabel }}</p>
          </div>

          <!-- ─────────── STEP 2: Merchant Profile ─────────── -->
          <div v-if="step === 2" class="step-pane">
            <p class="step-desc">Tell us about your business identity and contact details.</p>

            <v-row dense>
              <v-col cols="12" sm="6">
                <label class="field-label">MERCHANT LEGAL NAME</label>
                <v-text-field v-model.trim="form.legal_name" placeholder="As per legal documents" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-account-outline" class="reg-field"
                  hide-details="auto" :error-messages="errors.legal_name ? [errors.legal_name] : []"
                  @update:model-value="clearError('legal_name')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">BUSINESS / STORE NAME</label>
                <v-text-field v-model.trim="form.business_name" placeholder="Display name" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-store-outline" class="reg-field"
                  hide-details="auto" :error-messages="errors.business_name ? [errors.business_name] : []"
                  @update:model-value="clearError('business_name')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">DBA / TRADE NAME <span class="optional-tag">(optional)</span></label>
                <v-text-field v-model.trim="form.dba_name" placeholder="Trade / Brand name" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-tag-outline" class="reg-field" hide-details="auto" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">DATE OF BIRTH</label>
                <v-text-field v-model="form.dob" type="date" variant="outlined" density="comfortable" :max="maxDob"
                  prepend-inner-icon="mdi-calendar-outline" class="reg-field" hide-details="auto"
                  :error-messages="errors.dob ? [errors.dob] : []" @update:model-value="clearError('dob')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">GENDER</label>
                <v-select v-model="form.gender" :items="['M', 'F', 'O']" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-gender-male-female" class="reg-field" hide-details="auto" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">PRIMARY EMAIL <span class="optional-tag">(optional)</span></label>
                <v-text-field v-model.trim="form.primary_email_id" placeholder="Defaults to login email"
                  variant="outlined" density="comfortable" prepend-inner-icon="mdi-email-outline" class="reg-field"
                  hide-details="auto" />
              </v-col>
            </v-row>
          </div>

          <!-- ─────────── STEP 3: Business Details ─────────── -->
          <div v-if="step === 3" class="step-pane">
            <p class="step-desc">Help us understand what your business does.</p>

            <v-row dense>
              <v-col cols="12">
                <label class="field-label">BUSINESS TYPE</label>
                <v-select v-model="form.business_type" :items="businessTypeList" item-title="label"
                  item-value="value" placeholder="Choose business type" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-domain" class="reg-field" hide-details="auto"
                  :error-messages="errors.business_type ? [errors.business_type] : []"
                  @update:model-value="clearError('business_type')" />
              </v-col>

              <v-col cols="12">
                <label class="field-label">NATURE OF BUSINESS (MCC)</label>
                <v-combobox v-model="mcc" :items="mccOptions" item-title="descr" item-value="id"
                  placeholder="Search e.g. Apparel" clearable variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-shape-outline" class="reg-field" hide-details="auto"
                  :error-messages="errors.mcc ? [errors.mcc] : []" @update:search="onMccSearch">
                  <template #selection="{ item }">
                    <v-chip v-if="item === Object(item)" :text="item.raw.descr" size="small" closable variant="flat"
                      color="primary" @click:close="mcc = null" />
                  </template>
                </v-combobox>
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">ANNUAL TURNOVER</label>
                <v-autocomplete v-model="form.annual_turn_over" :items="turnOverList" item-title="label"
                  item-value="value" placeholder="Select turnover range" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-currency-rupee" class="reg-field" hide-details="auto"
                  :error-messages="errors.annual_turn_over ? [errors.annual_turn_over] : []"
                  @update:model-value="clearError('annual_turn_over')" />
              </v-col>

              <v-col cols="12" sm="6">
                <label class="field-label">WEBSITE <span class="optional-tag">(optional)</span></label>
                <v-text-field v-model.trim="form.website" placeholder="www.yourbusiness.com" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-web" class="reg-field" hide-details="auto" />
              </v-col>
            </v-row>
          </div>

          <!-- ─────────── STEP 4: Store Location ─────────── -->
          <div v-if="step === 4" class="step-pane">
            <p class="step-desc">Your store's GPS location will appear on the customer map.</p>

            <div class="location-status" :class="locationDetected ? 'detected' : 'detecting'">
              <v-icon size="18">{{ locationDetected ? 'mdi-check-circle-outline' : 'mdi-crosshairs-gps' }}</v-icon>
              <span>{{ locationDetected ? 'Location detected automatically' : 'Waiting for GPS permission…' }}</span>
            </div>

            <v-row dense class="mt-3">
              <v-col cols="6">
                <label class="field-label">LATITUDE</label>
                <v-text-field v-model="form.lat" placeholder="0.00000" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-compass-outline" class="reg-field" hide-details="auto" />
              </v-col>
              <v-col cols="6">
                <label class="field-label">LONGITUDE</label>
                <v-text-field v-model="form.long" placeholder="0.00000" variant="outlined" density="comfortable"
                  prepend-inner-icon="mdi-compass-outline" class="reg-field" hide-details="auto" />
              </v-col>
            </v-row>

            <button type="button" class="btn-locate" @click="detectLocation">
              <v-icon size="16">mdi-crosshairs-gps</v-icon> Use my current location
            </button>
          </div>

          <!-- ─────────── STEP 5: Address Details ─────────── -->
          <div v-if="step === 5" class="step-pane">
            <p class="step-desc">Enter your registered business office address.</p>

            <p class="address-sub-title">OFFICIAL / REGISTERED ADDRESS</p>
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-text-field v-model.trim="form.official_address" placeholder="Flat / Shop / Building"
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

            <!-- Residential toggle -->
            <div class="address-toggle-card mt-4">
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
                <div class="address-toggle-icon-wrap"><v-icon size="19">mdi-map-marker-outline</v-icon></div>
                <div>
                  <p class="address-toggle-title">Visitor Address</p>
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
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.v_pincode ? [errors.v_pincode] : []" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.v_city" placeholder="City" variant="outlined" density="comfortable"
                  class="reg-field" hide-details="auto" :error-messages="errors.v_city ? [errors.v_city] : []" />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model.trim="form.v_state" placeholder="State" variant="outlined"
                  density="comfortable" class="reg-field" hide-details="auto"
                  :error-messages="errors.v_state ? [errors.v_state] : []" />
              </v-col>
            </v-row>
          </div>

          <!-- ─────────── STEP 6: Beneficiary & Review ─────────── -->
          <div v-if="step === 6" class="step-pane">
            <p class="step-desc">Optional contact for settlement notifications.</p>

            <v-row dense>
              <v-col cols="12" sm="6">
                <label class="field-label">BENEFICIARY EMAIL <span class="optional-tag">(optional)</span></label>
                <v-text-field v-model.trim="form.beneficiary_email" placeholder="beneficiary@email.com"
                  variant="outlined" density="comfortable" prepend-inner-icon="mdi-email-outline" class="reg-field"
                  hide-details="auto" />
              </v-col>
              <v-col cols="12" sm="6">
                <label class="field-label">BENEFICIARY MOBILE <span class="optional-tag">(optional)</span></label>
                <v-text-field v-model="form.beneficiary_mobile" prefix="+91" placeholder="10-digit mobile"
                  variant="outlined" density="comfortable" prepend-inner-icon="mdi-phone-outline" class="reg-field"
                  hide-details="auto" maxlength="10" />
              </v-col>
            </v-row>

            <div class="review-card">
              <h3 class="review-title"><v-icon size="16" class="mr-1">mdi-clipboard-text-outline</v-icon>Review Your
                Details</h3>
              <div class="review-grid">
                <div class="review-row"><span>Email</span><span>{{ form.email || '—' }}</span></div>
                <div class="review-row"><span>Mobile</span><span>{{ form.mobile_no || '—' }}</span></div>
                <div class="review-row"><span>Legal Name</span><span>{{ form.legal_name || '—' }}</span></div>
                <div class="review-row"><span>Business</span><span>{{ form.business_name || '—' }}</span></div>
                <div class="review-row"><span>Type</span><span>{{ businessTypeLabel || '—' }}</span></div>
                <div class="review-row"><span>MCC</span><span>{{ mcc?.descr || '—' }}</span></div>
                <div class="review-row"><span>City</span><span>{{ form.city || '—' }}</span></div>
                <div class="review-row"><span>Pincode</span><span>{{ form.pincode || '—' }}</span></div>
              </div>
            </div>

            <p class="terms-text">
              By submitting, you agree to our <a href="#" class="terms-link">Terms of Service</a> and
              <a href="#" class="terms-link">Privacy Policy</a>.
            </p>
          </div>

        </div>

        <!-- Footer actions -->
        <div class="reg-footer">
          <button class="btn-next" :disabled="submitting" @click="handleNext">
            <span v-if="submitting" class="btn-spinner" />
            <template v-else>
              <span>{{ step === totalSteps ? 'Register' : 'Continue' }}</span>
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
import { useUsersApi } from "@/composables/apis/useUsersApi";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useOnboardingStore } from "@/stores/onboading";
import { storeToRefs } from "pinia";

definePageMeta({ middleware: "guest" });

const router = useRouter();
const Onboarding = useOnboardingStore();
const { businessTypeList, turnOverList } = storeToRefs(Onboarding);

const { MCCSearch, businessTurnOver, businessType, pincodeSearch } = useOnboadingApi();
const { registor } = useUsersApi();

// ── Step control ──
const step = ref(1);
const totalSteps = 6;
const submitting = ref(false);

const stepTitles = [
  "Account Setup",
  "Merchant Profile",
  "Business Details",
  "Store Location",
  "Address Details",
  "Beneficiary & Review",
];
const stepTitle = computed(() => stepTitles[step.value - 1]);

// ── Form state ──
const showPassword = ref(false);
const locationDetected = ref(false);

const form = reactive({
  // Step 1
  email: "",
  mobile_no: "",
  password: "",

  // Step 2
  legal_name: "",
  business_name: "",
  dba_name: "",
  dob: "",
  gender: "M",
  primary_email_id: "",
  primary_mobile: "",

  // Step 3
  business_type: "",
  annual_turn_over: "",
  website: "",
  mcc: "",
  nature_of_business: "",

  // Step 4
  lat: "",
  long: "",

  // Step 5 — Official
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

  // Step 6
  beneficiary_email: "",
  beneficiary_mobile: "",

  // Metadata — same defaults paymentapp sends
  std_code: "091",
  lead_source: "BUCKSBOX",
  lg_code: "",
  ckyc: true,
  interface: "MOS",
});

// ── Errors ──
const errors = reactive({});
const clearError = (field) => { delete errors[field]; };

// ── MCC ──
const mcc = ref(null);
const mccOptions = ref([]);
let mccDebounce = null;

const onMccSearch = (q) => {
  clearTimeout(mccDebounce);
  if (!q || q.length < 2) { mccOptions.value = []; return; }
  mccDebounce = setTimeout(async () => {
    try {
      const res = await MCCSearch(q);
      mccOptions.value = res.data?.data || res.data || [];
    } catch (e) { console.error(e); }
  }, 300);
};
watch(mcc, (val) => {
  if (val && typeof val === "object") {
    form.mcc = val.id;
    form.nature_of_business = val.descr;
    clearError("mcc");
  } else if (!val) {
    form.mcc = "";
    form.nature_of_business = "";
  }
});

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
  if (!val) return;
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
  if (!val) return;
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
  if (!val) return;
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

// ── Computed ──
const maxDob = computed(() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().split("T")[0];
});

const businessTypeLabel = computed(() =>
  businessTypeList.value.find((b) => b.value == form.business_type)?.label || ""
);

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

// ── Geolocation (browser API — replaces paymentapp's Capacitor $native.location()) ──
function detectLocation() {
  if (typeof navigator === "undefined" || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      form.lat = String(pos.coords.latitude);
      form.long = String(pos.coords.longitude);
      locationDetected.value = true;
    },
    () => { /* permission denied — silent, merchant can enter manually */ },
    { timeout: 8_000, maximumAge: 60_000 }
  );
}

// ── Validation per step (same rules as paymentapp) ──
const validateStep = () => {
  const newErrors = {};

  if (step.value === 1) {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(String(form.mobile_no || "")))
      newErrors.mobile_no = "Enter a valid 10-digit mobile number";
    if (!form.password || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
  }

  if (step.value === 2) {
    if (!form.legal_name || form.legal_name.length < 3)
      newErrors.legal_name = "Minimum 3 characters required";
    if (!form.business_name || form.business_name.length < 3)
      newErrors.business_name = "Minimum 3 characters required";
    if (!form.dob)
      newErrors.dob = "Date of birth is required";
  }

  if (step.value === 3) {
    if (!form.business_type)
      newErrors.business_type = "Please select a business type";
    if (!form.mcc)
      newErrors.mcc = "Please select nature of business";
    if (!form.annual_turn_over)
      newErrors.annual_turn_over = "Please select annual turnover";
  }

  if (step.value === 5) {
    if (!form.official_address) newErrors.official_address = "Required";
    if (!form.address1) newErrors.address1 = "Required";
    if (!form.address2) newErrors.address2 = "Required";
    if (!form.pincode) newErrors.pincode = "Required";
    if (!form.city) newErrors.city = "Required";
    if (!form.state) newErrors.state = "Required";
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

// ── Submit — creates the merchant only, nothing else ──
const submit = async () => {
  submitting.value = true;
  try {
    const payload = {
      email: form.email,
      password: form.password,
      mobile_no: form.mobile_no,
      interface: form.interface,
      legal_name: form.legal_name,
      business_name: form.business_name,
      dba_name: form.dba_name,
      dob: form.dob,
      gender: form.gender,
      primary_email_id: form.primary_email_id || form.email,
      primary_mobile: form.primary_mobile || String(form.mobile_no),
      business_type: form.business_type,
      mcc: form.mcc,
      nature_of_business: form.nature_of_business,
      annual_turn_over: form.annual_turn_over,
      website: form.website,
      location: {
        latitude: Number(form.lat),
        longitude: Number(form.long),
      },
      official_address: form.official_address,
      address1: form.address1,
      address2: form.address2,
      address3: form.address3,
      phone: form.phone,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      residential_address: sameAsOfficialResidential.value ? form.official_address : form.residential_address,
      res_address1: sameAsOfficialResidential.value ? form.address1 : form.res_address1,
      res_address2: sameAsOfficialResidential.value ? form.address2 : form.res_address2,
      res_address3: sameAsOfficialResidential.value ? form.address3 : form.res_address3,
      res_mobile: form.res_mobile,
      res_phone_number: form.res_phone_number,
      res_city: sameAsOfficialResidential.value ? form.city : form.res_city,
      res_state: sameAsOfficialResidential.value ? form.state : form.res_state,
      res_pincode: sameAsOfficialResidential.value ? form.pincode : form.res_pincode,
      vister_address: sameAsOfficialVisitor.value ? form.official_address : form.vister_address,
      v_address1: sameAsOfficialVisitor.value ? form.address1 : form.v_address1,
      v_address2: sameAsOfficialVisitor.value ? form.address2 : form.v_address2,
      v_address3: sameAsOfficialVisitor.value ? form.address3 : form.v_address3,
      v_mobile: form.v_mobile,
      v_phone_number: form.v_phone_number,
      v_city: sameAsOfficialVisitor.value ? form.city : form.v_city,
      v_state: sameAsOfficialVisitor.value ? form.state : form.v_state,
      v_pincode: sameAsOfficialVisitor.value ? form.pincode : form.v_pincode,
      beneficiary_email: form.beneficiary_email,
      beneficiary_mobile: form.beneficiary_mobile,
      std_code: form.std_code,
      lead_source: form.lead_source,
      lg_code: form.lg_code,
      ckyc: form.ckyc,
    };

    const result = await registor(payload);

    if (result?.statusCode === "00") {
      showSnack(result.data?.existing
        ? "Merchant already exists — please log in to continue."
        : (result.message || "Registration successful! Please log in to continue."));
      setTimeout(() => router.push("/"), 2000);
    } else {
      showSnack(result?.message || "Registration failed", "error");
    }
  } catch (err) {
    showSnack(err?.response?.data?.message || "Something went wrong", "error");
  } finally {
    submitting.value = false;
  }
};

// ── Mount ──
onMounted(async () => {
  detectLocation();

  try { await businessType(); } catch (e) { console.error(e); }
  try { await businessTurnOver(); } catch (e) { console.error(e); }
});

watch(() => form.email, (newVal) => {
  if (newVal && (!form.primary_email_id || form.primary_email_id === "")) {
    form.primary_email_id = newVal;
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');

*, *::before, *::after { box-sizing: border-box; }

/* ════════════════════════════════════
   ROOT — same two-panel pattern as the login page
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
.optional-tag { font-weight: 400; text-transform: none; color: #94a3b8; }

.mt-3 { margin-top: .875rem; }
.mt-4 { margin-top: 1.1rem; }

/* ── field styling — matches the login page's input look ── */
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

/* ── location ── */
.location-status {
  display: flex; align-items: center; gap: 8px;
  font-size: .8rem; padding: .7rem .95rem; border-radius: 10px;
  background: #eef2ff; color: #1e40af; border: 1px solid #dbe4fd;
}
.location-status.detected { color: #15803d; background: #ecfdf5; border-color: #bbf0d3; }

.btn-locate {
  margin-top: 1rem;
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff; border: 1.5px solid #dbe4fd;
  color: #1142d4; border-radius: 10px;
  padding: .5rem 1rem; font-size: .8rem; font-weight: 700; cursor: pointer;
  transition: background .15s, border-color .15s;
}
.btn-locate:hover { background: #eef2ff; border-color: #1142d4; }

/* ── address ── */
.address-sub-title {
  font-size: .65rem; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: .1em; margin-bottom: .75rem;
}

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

/* ── review ── */
.review-card {
  margin-top: 1.4rem; padding: 1.1rem 1.2rem; border-radius: 14px;
  background: #fff; border: 1px solid #e8edf3;
}
.review-title {
  font-size: .85rem; font-weight: 800; margin: 0 0 .7rem; color: #0f172a;
  display: flex; align-items: center;
}
.review-grid { display: flex; flex-direction: column; }
.review-row {
  display: flex; justify-content: space-between; font-size: .8rem;
  padding: .4rem 0; border-bottom: 1px dashed #eef1f5;
}
.review-row:last-child { border-bottom: none; }
.review-row span:first-child { color: #94a3b8; }
.review-row span:last-child { font-weight: 700; color: #1e293b; }

.terms-text { font-size: .75rem; color: #94a3b8; margin-top: 1.1rem; line-height: 1.6; }
.terms-link { color: #1142d4; font-weight: 700; text-decoration: none; }
.terms-link:hover { text-decoration: underline; }

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
