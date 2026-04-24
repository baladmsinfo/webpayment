<template>
    <div class="merchant-root">

        <main class="merchant-main">

            <!-- TOP HEADER -->
            <header class="merchant-header">
                <h2 class="header-title">Merchant Creation</h2>
            </header>

            <!-- SCROLLABLE FORM -->
            <div class="form-scroll">
                <div class="form-inner">

                    <v-form ref="merchantForm" v-model="validForm">

                        <!-- ── MERCHANT PROFILE ── -->
                        <section class="form-section">
                            <h3 class="section-title">
                                <v-icon class="section-icon" size="20">mdi-account-circle-outline</v-icon>
                                Merchant Profile
                            </h3>

                            <v-row dense>
                                <v-col cols="12" sm="12" md="6" lg="4">
                                    <label class="field-label">MERCHANT NAME</label>
                                    <v-text-field v-model.trim="form.legal_name" placeholder="As per PAN"
                                        variant="outlined" density="comfortable" :rules="[req]"
                                        prepend-inner-icon="mdi-badge-account-outline" class="mh-field" 
                                        hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">EMAIL ADDRESS</label>
                                    <v-text-field v-model="form.primary_email_id" placeholder="primary@email.com"
                                        variant="outlined" density="comfortable" :rules="[req, emailRule]"
                                        prepend-inner-icon="mdi-email-outline" class="mh-field" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">MOBILE NUMBER</label>
                                    <v-text-field v-model="form.primary_mobile" placeholder="Mobile Number" prefix="+91"
                                        variant="outlined" density="comfortable" :rules="[req, phoneRule]"
                                        prepend-inner-icon="mdi-phone-outline" class="mh-field" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">DATE OF BIRTH</label>
                                    <v-text-field v-model="form.dob" type="date" variant="outlined"
                                        density="comfortable" :rules="[req]" :max="maxDob"
                                        prepend-inner-icon="mdi-calendar-outline" class="mh-field"
                                        hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">GENDER</label>
                                    <v-select v-model="form.gender" :items="['M', 'F', 'O']" placeholder="Select Gender"
                                        variant="outlined" density="comfortable" :rules="[req]"
                                        prepend-inner-icon="mdi-gender-male-female" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                            </v-row>
                        </section>

                        <div class="section-divider"></div>

                        <!-- ── BUSINESS LOCATION ── -->
                        <section class="form-section">
                            <h3 class="section-title">
                                <v-icon class="section-icon" size="20">mdi-map-marker-outline</v-icon>
                                Business Location
                            </h3>

                            <div class="location-layout">
                                <div class="location-fields">
                                    <v-row dense>
                                        <v-col cols="12" sm="6">
                                            <v-text-field v-model.trim="form.lat" placeholder="Latitude"
                                                variant="outlined" density="comfortable" :rules="[req, latRule]"
                                                prepend-inner-icon="mdi-compass-outline" class="mh-field"
                                                hide-details="auto" />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field v-model.trim="form.long" placeholder="Longitude"
                                                variant="outlined" density="comfortable" :rules="[req, lngRule]"
                                                prepend-inner-icon="mdi-compass-outline" class="mh-field"
                                                hide-details="auto" />
                                        </v-col>
                                    </v-row>
                                    <p class="location-hint">Drag the pin on the map to automatically fill
                                        coordinates.</p>
                                </div>
                                <div class="map-placeholder">
                                    <div class="map-pin-wrap">
                                        <v-icon color="#002d5a" size="28" class="map-pin">mdi-map-marker</v-icon>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div class="section-divider"></div>

                        <!-- ── BUSINESS DETAILS (includes Business Type) ── -->
                        <section class="form-section">
                            <h3 class="section-title">
                                <v-icon class="section-icon" size="20">mdi-storefront-outline</v-icon>
                                Business Details
                            </h3>

                            <v-row dense>

                                
                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">BUSINESS NAME</label>
                                    <v-text-field v-model.trim="form.business_name" placeholder="Business Name"
                                        variant="outlined" density="comfortable" :rules="[req]"
                                        prepend-inner-icon="mdi-store-outline" class="mh-field" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">DBA / TRADE NAME</label>
                                    <v-text-field v-model.trim="form.dba_name" placeholder="DBA / Trade Name"
                                        variant="outlined" density="comfortable" :rules="[req]"
                                        prepend-inner-icon="mdi-tag-outline" class="mh-field" hide-details="auto" />
                                </v-col>

                                <!-- Business Type dropdown — moved here -->
                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">BUSINESS TYPE</label>
                                    <v-select v-model="form.business_type" :items="businessTypeList" item-title="label"
                                        item-value="value" placeholder="Choose Business Type" variant="outlined"
                                        density="comfortable" :rules="[req]" prepend-inner-icon="mdi-briefcase-outline"
                                        class="mh-field" hide-details="auto" />
                                </v-col>

                                <!-- MCC / Nature of Business -->
                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">NATURE OF BUSINESS</label>
                                    <v-combobox v-model="mcc" :items="mccOptions" item-title="descr" item-value="id"
                                        placeholder="Search nature of business" clearable variant="outlined"
                                        density="comfortable" :loading="loading" :rules="[req]"
                                        prepend-inner-icon="mdi-shape-outline" class="mh-field" hide-details="auto"
                                        @update:search="onSearch">
                                        <template #selection="{ item }">
                                            <v-chip v-if="item === Object(item)" :text="item.raw.descr" size="small"
                                                closable variant="flat" color="primary" @click:close="mcc = null" />
                                        </template>
                                    </v-combobox>
                                </v-col>

                                <!-- Annual Turnover -->
                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">ANNUAL TURNOVER</label>
                                    <v-autocomplete v-model="form.annual_turn_over" :items="turnOverList.data"
                                        item-title="label" item-value="value" placeholder="Select Annual Turnover"
                                        variant="outlined" density="comfortable" :rules="[req]"
                                        prepend-inner-icon="mdi-currency-rupee" class="mh-field" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">WEBSITE (OPTIONAL)</label>
                                    <v-text-field v-model="form.website" placeholder="www.example.com"
                                        variant="outlined" density="comfortable" prepend-inner-icon="mdi-web"
                                        class="mh-field" hide-details="auto" />
                                </v-col>

                            </v-row>
                        </section>

                        <div class="section-divider"></div>

                        <!-- ── BENEFICIARY CONTACT ── -->
                        <section class="form-section">
                            <h3 class="section-title">
                                <v-icon class="section-icon" size="20">mdi-card-account-mail-outline</v-icon>
                                Beneficiary Contact
                            </h3>

                            <v-row dense>
                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">BENEFICIARY EMAIL</label>
                                    <v-text-field v-model.trim="form.beneficiary_email" placeholder="Beneficiary Email"
                                        variant="outlined" density="comfortable" :rules="[emailOrEmpty]"
                                        prepend-inner-icon="mdi-email-outline" class="mh-field" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="6" lg="4">
                                    <label class="field-label">BENEFICIARY MOBILE</label>
                                    <v-text-field v-model.trim="form.beneficiary_mobile"
                                        placeholder="Beneficiary Mobile" prefix="+91" variant="outlined"
                                        density="comfortable" :rules="[phoneOrEmpty]"
                                        prepend-inner-icon="mdi-phone-outline" class="mh-field" hide-details="auto" />
                                </v-col>
                            </v-row>
                        </section>

                        <div class="section-divider"></div>

                        <!-- ── ADDRESS DETAILS ── -->
                        <section class="form-section">
                            <h3 class="section-title">
                                <v-icon class="section-icon" size="20">mdi-home-city-outline</v-icon>
                                Address Details
                            </h3>

                            <!-- Official Address -->
                            <p class="address-sub-title">OFFICIAL REGISTERED OFFICE</p>
                            <v-row dense>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.official_address"
                                        placeholder="Door No / Office Address" variant="outlined" density="comfortable"
                                        :rules="[req]" class="mh-field" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.address1" placeholder="Street Address Line 1"
                                        variant="outlined" density="comfortable" :rules="[req]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.address2" placeholder="Street Address Line 2"
                                        variant="outlined" density="comfortable" :rules="[req]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.address3" placeholder="Landmark (optional)"
                                        variant="outlined" density="comfortable" class="mh-field" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model="form.phone" placeholder="Contact Number (optional)"
                                        prefix="+91" variant="outlined" density="comfortable" class="mh-field"
                                        hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-combobox v-model="opincode" :items="opincodeOptions" item-title="pincode"
                                        item-value="pincode" placeholder="Search Pincode" variant="outlined"
                                        density="comfortable" return-object :loading="loading" class="mh-field"
                                        hide-details="auto" @update:search="opinSearch">
                                        <template #selection="{ item }">
                                            <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                                                closable variant="flat" color="primary"
                                                @click:close="opincode = null" />
                                        </template>
                                    </v-combobox>
                                </v-col>

                                <v-col cols="6" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.pincode" placeholder="Pincode" variant="outlined"
                                        density="comfortable" disabled :rules="[pincodeRule]"
                                        class="mh-field mh-field--disabled" hide-details="auto" />
                                </v-col>

                                <v-col cols="6" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.city" placeholder="City" variant="outlined"
                                        density="comfortable" disabled :rules="[req]"
                                        class="mh-field mh-field--disabled" hide-details="auto" />
                                </v-col>

                                <v-col cols="12" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.state" placeholder="State" variant="outlined"
                                        density="comfortable" disabled :rules="[req]"
                                        class="mh-field mh-field--disabled" hide-details="auto" />
                                </v-col>
                            </v-row>

                            <!-- Residential Address Toggle -->
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
                                    <input type="checkbox" v-model="sameAsOfficialResidential"
                                        @change="copyOfficialToResidential" class="toggle-input" />
                                    <div class="toggle-track">
                                        <div class="toggle-thumb"></div>
                                    </div>
                                </label>
                            </div>

                            <v-row v-if="!sameAsOfficialResidential" dense class="mt-3">
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.residential_address"
                                        placeholder="Door No / Residential Address" variant="outlined"
                                        density="comfortable" :rules="[requiredIf(!sameAsOfficialResidential)]"
                                        class="mh-field" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.res_address1" placeholder="Street Address 1"
                                        variant="outlined" density="comfortable"
                                        :rules="[requiredIf(!sameAsOfficialResidential)]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.res_address2" placeholder="Street Address 2"
                                        variant="outlined" density="comfortable"
                                        :rules="[requiredIf(!sameAsOfficialResidential)]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.res_address3" placeholder="Landmark (optional)"
                                        variant="outlined" density="comfortable" class="mh-field" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model="form.res_mobile" placeholder="Residential Mobile (optional)"
                                        prefix="+91" variant="outlined" density="comfortable" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model="form.res_phone_number"
                                        placeholder="Residential Phone (optional)" variant="outlined"
                                        density="comfortable" class="mh-field" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-combobox v-model="resPincode" :items="respincodeOptions" item-title="pincode"
                                        item-value="pincode" placeholder="Search Pincode" variant="outlined"
                                        density="comfortable" return-object :loading="loading" class="mh-field"
                                        hide-details="auto" @update:search="respinSearch" />
                                </v-col>
                                <v-col cols="6" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.res_pincode" placeholder="Pincode"
                                        variant="outlined" density="comfortable" disabled :rules="[pincodeRule]"
                                        class="mh-field mh-field--disabled" hide-details="auto" />
                                </v-col>
                                <v-col cols="6" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.res_city" placeholder="City" variant="outlined"
                                        density="comfortable" disabled class="mh-field mh-field--disabled"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.res_state" placeholder="State" variant="outlined"
                                        density="comfortable" disabled class="mh-field mh-field--disabled"
                                        hide-details="auto" />
                                </v-col>
                            </v-row>

                            <!-- Visitor Address Toggle -->
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
                                    <input type="checkbox" v-model="sameAsOfficialVisitor"
                                        @change="copyOfficialToVisitor" class="toggle-input" />
                                    <div class="toggle-track">
                                        <div class="toggle-thumb"></div>
                                    </div>
                                </label>
                            </div>

                            <v-row v-if="!sameAsOfficialVisitor" dense class="mt-3">
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.vister_address"
                                        placeholder="Door No / Visitor Address" variant="outlined" density="comfortable"
                                        :rules="[requiredIf(!sameAsOfficialVisitor)]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.v_address1" placeholder="Street Address 1"
                                        variant="outlined" density="comfortable"
                                        :rules="[requiredIf(!sameAsOfficialVisitor)]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.v_address2" placeholder="Street Address 2"
                                        variant="outlined" density="comfortable"
                                        :rules="[requiredIf(!sameAsOfficialVisitor)]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model.trim="form.v_address3" placeholder="Landmark (optional)"
                                        variant="outlined" density="comfortable" class="mh-field" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model="form.v_mobile" placeholder="Visitor Mobile (optional)"
                                        prefix="+91" variant="outlined" density="comfortable" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-text-field v-model="form.v_phone_number" placeholder="Visitor Phone (optional)"
                                        variant="outlined" density="comfortable" class="mh-field" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="6" md="4" lg="3">
                                    <v-combobox v-model="vPincode" :items="vpincodeOptions" item-title="pincode"
                                        item-value="pincode" placeholder="Search Pincode" variant="outlined"
                                        density="comfortable" return-object :loading="loading" class="mh-field"
                                        hide-details="auto" @update:search="vpinSearch" />
                                </v-col>
                                <v-col cols="6" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.v_pincode" placeholder="Pincode" variant="outlined"
                                        density="comfortable" :rules="[pincodeRule]" class="mh-field"
                                        hide-details="auto" />
                                </v-col>
                                <v-col cols="6" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.v_city" placeholder="City" variant="outlined"
                                        density="comfortable" class="mh-field" hide-details="auto" />
                                </v-col>
                                <v-col cols="12" sm="4" md="3" lg="2">
                                    <v-text-field v-model.trim="form.v_state" placeholder="State" variant="outlined"
                                        density="comfortable" class="mh-field" hide-details="auto" />
                                </v-col>
                            </v-row>

                        </section>

                        <!-- ── FOOTER ACTIONS ── -->
                        <div class="form-footer">
                            <p class="footer-terms">
                                By submitting, you agree to our
                                <a href="#" class="footer-link">Terms of Service</a>.
                            </p>
                            <div class="footer-actions">
                                <button type="button" class="btn-secondary" @click="router.back()">
                                    Cancel
                                </button>
                                <button type="button" class="btn-primary" :disabled="!confirmDetails || submitting"
                                    @click="submitMerchant">
                                    <span v-if="submitting">Submitting...</span>
                                    <template v-else>
                                        Submit Merchant
                                        <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
                                    </template>
                                </button>
                            </div>
                        </div>

                    </v-form>
                </div>
            </div>
        </main>

        <!-- ── SNACKBARS ── -->
        <v-snackbar v-model="businessSnackbar.show" :timeout="4000" location="top right" elevation="8" rounded="xl"
            color="info">
            <div class="d-flex align-center ga-3">
                <v-icon size="22" color="white">mdi-information-outline</v-icon>
                <div class="text-body-2 font-weight-medium">
                    You selected {{businessTypeList.find(t => t.value === form.business_type)?.label}} as your
                    business type.
                </div>
                <v-spacer />
                <v-btn icon size="x-small" variant="text" @click="businessSnackbar.show = false">
                    <v-icon size="18">mdi-close</v-icon>
                </v-btn>
            </div>
        </v-snackbar>

        <v-snackbar v-model="snackbar.show" :timeout="4000" location="top right" elevation="8" rounded="xl"
            color="primary">
            <div class="d-flex align-center ga-3">
                <v-icon size="22" :color="snackbar.color">
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
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useOnboardingStore } from "@/stores/onboading";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useFileUpload } from "@/composables/apis/useUploader";

const { MCCSearch, businessTurnOver, businessType, pincodeSearch, createMerchant } = useOnboadingApi();

const Onboarding = useOnboardingStore();
const { turnOverList, businessTypeList } = storeToRefs(Onboarding);
const router = useRouter();

const snackbar = reactive({ show: false, message: "", color: "success" });
const businessSnackbar = reactive({ show: false });

const submitting = ref(false);
const loading = ref(false);
const validForm = ref(false);

const maxDob = computed(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
});

const confirmDetails = computed(() => validForm.value);


// const form = reactive({
//     legal_name: "",
//     business_name: "",
//     dba_name: null,
//     dob: "",
//     primary_email_id: "",
//     primary_mobile: "",
//     business_type: null,
//     nature_of_business: null,
//     annual_turn_over: null,
//     gender: "",
//     lat: "",
//     long: "",
//     website: "",
//     beneficiary_email: "",
//     beneficiary_mobile: "",
//     official_address: "",
//     address1: "",
//     address2: "",
//     address3: "",
//     phone: "",
//     city: "",
//     state: "",
//     pincode: "",
//     residential_address: "",
//     res_address1: "",
//     res_address2: "",
//     res_address3: "",
//     res_mobile: "",
//     res_phone_number: "",
//     res_city: "",
//     res_state: "",
//     res_pincode: "",
//     vister_address: "",
//     v_address1: "",
//     v_address2: "",
//     v_address3: "",
//     v_mobile: "",
//     v_phone_number: "",
//     v_city: "",
//     v_state: "",
//     v_pincode: "",
//     mcc: "",
//     std_code: "091",
//     lead_source: "BUCKSBOX",
//     lg_code: "",
//     ckyc: false
// });

// Form state
const form = reactive({
  legal_name: "",
  business_name: "",
  dba_name: "",
  dob: "",
  primary_email_id: "",
  primary_mobile: "",
  business_type: "",
  nature_of_business: "",
  annual_turn_over: "",
  gender: "M",

  lat: "10.3673",
  long: "77.9803",

  website: "",

  beneficiary_email: "",
  beneficiary_mobile: "",

  official_address: "",
  address1: "",
  address2: "",
  address3: "",
  phone: "",
  city: "",
  state: "",
  pincode: "",

  residential_address: "",
  res_address1: "",
  res_address2: "",
  res_address3: "",
  res_mobile: "",
  res_phone_number: "",
  res_city: "",
  res_state: "",
  res_pincode: "",

  vister_address: "",
  v_address1: "",
  v_address2: "",
  v_address3: "",
  v_mobile: "",
  v_phone_number: "",
  v_city: "",
  v_state: "",
  v_pincode: "",

  mcc: "", // Furniture Stores MCC code

  std_code: "",
  lead_source: "BUCKSBOX",
  lg_code: "",
  ckyc: true
});

const sameAsOfficialResidential = ref(false);
const sameAsOfficialVisitor = ref(false);

function copyOfficialToResidential() {
    if (sameAsOfficialResidential.value) {
        Object.assign(form, {
            residential_address: form.official_address,
            res_address1: form.address1,
            res_address2: form.address2,
            res_address3: form.address3,
            res_city: form.city,
            res_state: form.state,
            res_pincode: form.pincode
        });
    }
}

function copyOfficialToVisitor() {
    if (sameAsOfficialVisitor.value) {
        Object.assign(form, {
            vister_address: form.official_address,
            v_address1: form.address1,
            v_address2: form.address2,
            v_address3: form.address3,
            v_city: form.city,
            v_state: form.state,
            v_pincode: form.pincode
        });
    }
}

// MCC & Pincode refs
const mcc = ref();
const opincode = ref();
const resPincode = ref();
const vPincode = ref();
const mccOptions = ref([]);
const opincodeOptions = ref([]);
const respincodeOptions = ref([]);
const vpincodeOptions = ref([]);

// Validation rules
const req = v => !!v || v === 0 || "Required";
const emailRule = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email";
const emailOrEmpty = v => !v || emailRule(v) === true || "Invalid email";
const phone10 = v => /^\d{10}$/.test(String(v || ""));
const phoneRule = v => phone10(v) || "Enter 10-digit mobile";
const phoneOrEmpty = v => !v || phone10(v) || "Enter 10-digit mobile";
const pincode6 = v => /^\d{6}$/.test(String(v || ""));
const pincodeRule = v => pincode6(v) || "6-digit pincode";
const latRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -90 && Number(v) <= 90) || "Lat -90 to 90";
const lngRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -180 && Number(v) <= 180) || "Lng -180 to 180";
const requiredIf = condition => v => condition || !!v || "This field is required";

// Search handlers
const onSearch = async (query) => {
    if (!query || query.length < 2) { mccOptions.value = []; return; }
    loading.value = true;
    try {
        const res = await MCCSearch(query);
        mccOptions.value = res.data.data;
    } catch (err) { console.error("MCC search failed", err); }
    finally { loading.value = false; }
};

const opinSearch = async (query) => {
    if (!query || query.length < 2) { opincodeOptions.value = []; return; }
    loading.value = true;
    try {
        const res = await pincodeSearch(query);
        opincodeOptions.value = res.data.data;
    } catch (err) { console.error("Official pincode search failed", err); }
    finally { loading.value = false; }
};

const respinSearch = async (query) => {
    if (!query || query.length < 2) { respincodeOptions.value = []; return; }
    loading.value = true;
    try {
        const res = await pincodeSearch(query);
        respincodeOptions.value = res.data.data;
    } catch (err) { console.error("Residential pincode search failed", err); }
    finally { loading.value = false; }
};

const vpinSearch = async (query) => {
    if (!query || query.length < 2) { vpincodeOptions.value = []; return; }
    loading.value = true;
    try {
        const res = await pincodeSearch(query);
        vpincodeOptions.value = res.data.data;
    } catch (err) { console.error("Visitor pincode search failed", err); }
    finally { loading.value = false; }
};

// Submit
async function submitMerchant() {
    submitting.value = true;

    console.log("Mcc selected:", mcc.value);

    if (mcc.value) {
        form.mcc = mcc.value.id
        form.nature_of_business = mcc.value.descr
    }

    console.log("Mcc and Nature of Business:", form.mcc, form.nature_of_business);

    try {
        const payload = {
            dba_name: form.dba_name,
            merchant_name: form.legal_name,
            business_name: form.business_name,
            mcc: form.mcc,

            business_type: form.business_type,

            location: {
                latitude: Number(form.lat),
                longitude: Number(form.long)
            },

            business_dob: form.dob,

            primary_email_id: form.primary_email_id,
            primary_mobile: form.primary_mobile,

            official_address: form.official_address,
            address1: form.address1,
            address2: form.address2,
            address3: form.address3,
            phone: form.phone,

            city: form.city,
            state: form.state,
            pincode: form.pincode,

            residential_address: form.residential_address,
            res_address1: form.res_address1,
            res_address2: form.res_address2,
            res_address3: form.res_address3,
            res_mobile: form.res_mobile,
            res_phone_number: form.res_phone_number,
            res_city: form.res_city,
            res_state: form.res_state,
            res_pincode: form.res_pincode,

            vister_address: form.vister_address,
            v_address1: form.v_address1,
            v_address2: form.v_address2,
            v_address3: form.v_address3,
            v_mobile: form.v_mobile,
            v_phone_number: form.v_phone_number,
            v_city: form.v_city,
            v_state: form.v_state,
            v_pincode: form.v_pincode,

            website: form.website,

            beneficiary_email: form.beneficiary_email,
            beneficiary_mobile: form.beneficiary_mobile,

            gender: form.gender,

            nature_of_business: form.nature_of_business,

            std_code: "091",

            lead_source: "BUCKSBOX",

            lg_code: "",

            annual_turn_over: form.annual_turn_over,

            ckyc: form.ckyc || false
        }

        console.log("Create Merchant Payload:", payload);

        const res = await createMerchant(payload);
        if (res.statusCode == "00" || res.data?.statusCode == "00") {
            snackbar.message = res.data?.message || res.message;
            snackbar.color = "success";
            snackbar.show = true;
            setTimeout(() => {
                router.push("/vendor/merchants/success");
            }, 2000);
        } else {
            snackbar.message = res.data?.message || res.message;
            snackbar.color = "error";
            snackbar.show = true;
        }
    } catch (e) {
        console.error(e);
    } finally {
        submitting.value = false;
    }
}

// Watchers
watch(mcc, (val) => {
    if (val) {
        form.mcc = val.id
        form.nature_of_business = val.descr
    } else {
        form.mcc = null
        form.nature_of_business = ""
    }
})

watch(opincode, val => {
    if (!val) return;
    form.city = val.city;
    form.state = val.statename;
    form.pincode = val.pincode;
});
watch(resPincode, val => {
    if (!val) return;
    form.res_city = val.city;
    form.res_state = val.statename;
    form.res_pincode = val.pincode;
});
watch(vPincode, val => {
    if (!val) return;
    form.v_city = val.city;
    form.v_state = val.statename;
    form.v_pincode = val.pincode;
});

onMounted(async () => {
    try {
        await businessTurnOver();
    } catch (err) { console.error("Failed to load turnover options:", err); }
});

onMounted(async () => {
    try {
        await businessType();
    } catch (err) { console.error("Failed to load business types:", err); }
});
</script>


<style scoped>
/* ── ROOT ──────────────────────────────────────────────────────── */
.merchant-root {
    display: flex;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #f0f4f8;
}

/* ── MAIN ──────────────────────────────────────────────────────── */
.merchant-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
}

/* ── HEADER ────────────────────────────────────────────────────── */
.merchant-header {
    padding: 0.875rem 1.5rem;
    border-bottom: 1px solid #d0dae6;
    display: flex;
    align-items: center;
    background: #002d5a;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 30;
}

.header-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    letter-spacing: 0.01em;
}

/* ── SCROLL AREA ───────────────────────────────────────────────── */
.form-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 1.5rem 2rem;
}

/* Tablet+ */
@media (min-width: 768px) {
    .form-scroll {
        padding: 1.75rem 2rem 2.5rem;
    }
}

/* Desktop */
@media (min-width: 1280px) {
    .form-scroll {
        padding: 2rem 2.5rem 3rem;
    }
}

.form-scroll::-webkit-scrollbar {
    width: 5px;
}

.form-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.form-scroll::-webkit-scrollbar-thumb {
    background: #b8cfe0;
    border-radius: 10px;
}

/* Full width — no artificial max-width cap */
.form-inner {
    width: 100%;
}

/* ── SECTIONS ──────────────────────────────────────────────────── */
.form-section {
    background: #ffffff;
    border: 1px solid #d8e6f0;
    border-radius: 10px;
    padding: 1.375rem 1.5rem;
    margin-bottom: 1rem;
}

@media (min-width: 768px) {
    .form-section {
        padding: 1.625rem 2rem;
    }
}

.section-divider {
    display: none;
}

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

.section-icon {
    color: #002d5a !important;
    flex-shrink: 0;
}

/* ── VUETIFY FIELD OVERRIDES ───────────────────────────────────── */
.mh-field :deep(.v-field) {
    border-radius: 8px !important;
    background: #ffffff !important;
    font-family: 'Inter', sans-serif !important;
}

/* Default border */
.mh-field :deep(.v-field__outline__start),
.mh-field :deep(.v-field__outline__end),
.mh-field :deep(.v-field__outline__notch) {
    border-color: #c5d8e8 !important;
    transition: border-color 0.2s !important;
}

/* Focused border */
.mh-field :deep(.v-field--focused .v-field__outline__start),
.mh-field :deep(.v-field--focused .v-field__outline__end),
.mh-field :deep(.v-field--focused .v-field__outline__notch) {
    border-color: #002d5a !important;
    border-width: 2px !important;
}

/* Focus ring */
.mh-field :deep(.v-field--focused) {
    box-shadow: 0 0 0 3px rgba(0, 45, 90, 0.1) !important;
}

/* Prepend icons */
.mh-field :deep(.v-field__prepend-inner .v-icon) {
    color: #8aafc8 !important;
    transition: color 0.2s !important;
}

.mh-field :deep(.v-field--focused .v-field__prepend-inner .v-icon) {
    color: #002d5a !important;
}

/* Input text */
.mh-field :deep(.v-field__input) {
    color: #0d1b2a !important;
    font-size: 0.875rem !important;
    font-family: 'Inter', sans-serif !important;
}

/* Placeholder */
.mh-field :deep(input::placeholder),
.mh-field :deep(textarea::placeholder) {
    color: #9fb8cc !important;
    opacity: 1 !important;
}

/* Label */
.mh-field :deep(.v-label) {
    color: #7a9bb5 !important;
    font-size: 0.85rem !important;
}

/* Prefix */
.mh-field :deep(.v-field__prefix) {
    color: #4a6a85 !important;
    font-size: 0.875rem !important;
    padding-right: 4px !important;
}

/* Dropdown arrow */
.mh-field :deep(.v-field__append-inner .v-icon) {
    color: #8aafc8 !important;
}

/* Chip */
.mh-field :deep(.v-chip) {
    background: #e0edf5 !important;
    color: #002d5a !important;
    font-weight: 500 !important;
}

/* Error state */
.mh-field :deep(.v-field--error .v-field__outline__start),
.mh-field :deep(.v-field--error .v-field__outline__end),
.mh-field :deep(.v-field--error .v-field__outline__notch) {
    border-color: #d32f2f !important;
}

/* Disabled */
.mh-field--disabled :deep(.v-field) {
    background: #f0f5f9 !important;
}

.mh-field--disabled :deep(.v-field__input) {
    color: #8aafc8 !important;
    -webkit-text-fill-color: #8aafc8 !important;
}

.mh-field--disabled :deep(.v-field__outline__start),
.mh-field--disabled :deep(.v-field__outline__end),
.mh-field--disabled :deep(.v-field__outline__notch) {
    border-color: #d8e6f0 !important;
    opacity: 0.8 !important;
}

/* Field label above inputs */
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

/* ── LOCATION ──────────────────────────────────────────────────── */
.location-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 768px) {
    .location-layout {
        flex-direction: row;
        align-items: flex-start;
        gap: 1.5rem;
    }
}

.location-fields {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
}

.location-hint {
    font-size: 0.78rem;
    color: #7a9bb5;
    font-style: italic;
    margin: 0.25rem 0 0;
}

.map-placeholder {
    width: 100%;
    height: 9rem;
    background-color: #dce8f0;
    background-image:
        linear-gradient(rgba(0, 45, 90, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 45, 90, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
    border-radius: 10px;
    border: 1px solid #c5d8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
}

@media (min-width: 768px) {
    .map-placeholder {
        width: 40%;
        height: 10.5rem;
    }
}

@media (min-width: 1280px) {
    .map-placeholder {
        width: 35%;
    }
}

.map-pin-wrap {
    width: 2.75rem;
    height: 2.75rem;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 3px 14px rgba(0, 45, 90, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
}

.map-pin {
    animation: mapBounce 1.6s ease-in-out infinite;
}

@keyframes mapBounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-6px);
    }
}

/* ── ADDRESS ───────────────────────────────────────────────────── */
.address-sub-title {
    font-size: 0.65rem;
    font-weight: 700;
    color: #5a7d9a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.75rem;
}

.mt-6 {
    margin-top: 1.5rem;
}

.mt-4 {
    margin-top: 1rem;
}

.mt-3 {
    margin-top: 0.875rem;
}

.address-toggle-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.125rem;
    background: #f0f6fb;
    border: 1px solid #c5d8e8;
    border-radius: 8px;
}

.address-toggle-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.address-toggle-icon-wrap {
    width: 2.125rem;
    height: 2.125rem;
    background: #fff;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(0, 45, 90, 0.1);
    flex-shrink: 0;
}

.address-toggle-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: #002d5a;
    margin: 0;
}

.address-toggle-sub {
    font-size: 0.75rem;
    color: #7a9bb5;
    margin: 0.1rem 0 0;
}

/* ── TOGGLE SWITCH ─────────────────────────────────────────────── */
.toggle-switch {
    position: relative;
    display: inline-block;
    cursor: pointer;
    flex-shrink: 0;
}

.toggle-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

.toggle-track {
    width: 2.75rem;
    height: 1.5rem;
    background: #b8cfe0;
    border-radius: 99px;
    position: relative;
    transition: background 0.22s ease;
    display: block;
}

.toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.25rem;
    height: 1.25rem;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.18);
    transition: transform 0.22s ease;
}

.toggle-input:checked~.toggle-track {
    background: #002d5a;
}

.toggle-input:checked~.toggle-track .toggle-thumb {
    transform: translateX(1.25rem);
}

/* ── FOOTER ────────────────────────────────────────────────────── */
.form-footer {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    align-items: flex-start;
    padding: 1.25rem 0 2.5rem;
    margin-top: 0.25rem;
    border-top: 1px solid #d8e6f0;
}

@media (min-width: 600px) {
    .form-footer {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.footer-terms {
    font-size: 0.8rem;
    color: #7a9bb5;
    margin: 0;
}

.footer-link {
    color: #002d5a;
    font-weight: 600;
    text-decoration: none;
}

.footer-link:hover {
    text-decoration: underline;
}

.footer-actions {
    display: flex;
    gap: 0.625rem;
    flex-shrink: 0;
    width: 100%;
}

@media (min-width: 600px) {
    .footer-actions {
        width: auto;
    }
}

.btn-secondary {
    flex: 1;
    padding: 0.625rem 1.375rem;
    background: #fff;
    border: 1.5px solid #c5d8e8;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #3a5f7a;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.18s, border-color 0.18s;
    white-space: nowrap;
    text-align: center;
}

@media (min-width: 600px) {
    .btn-secondary {
        flex: none;
    }
}

.btn-secondary:hover {
    background: #f0f6fb;
    border-color: #002d5a;
    color: #002d5a;
}

.btn-primary {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.625rem 1.75rem;
    background: #002d5a;
    border: none;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    box-shadow: 0 3px 10px rgba(0, 45, 90, 0.28);
    transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
    white-space: nowrap;
    line-height: 1;
}

@media (min-width: 600px) {
    .btn-primary {
        flex: none;
    }
}

.btn-primary:hover {
    background: #003d7a;
    box-shadow: 0 5px 16px rgba(0, 45, 90, 0.35);
}

.btn-primary:active {
    transform: scale(0.98);
}

.btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
}
</style>