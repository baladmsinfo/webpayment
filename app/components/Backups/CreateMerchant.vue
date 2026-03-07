<template>
    <div>
        <!-- App Bar + Progress -->
        <v-app-bar color="primary" density="comfortable" flat>
            <v-toolbar-title class="text-caption">{{ title }}</v-toolbar-title>
            <v-spacer />
            <v-chip class="pr-2" size="small" variant="flat">Step {{ step }} / {{ steps.length }}</v-chip>
            <template v-slot:extension>
                <v-progress-linear :model-value="(step / steps.length) * 100" height="8" rounded class="mx-2" />
            </template>
        </v-app-bar>

        <!-- Main Card -->
        <v-card variant="flat" color="transparent" class="pa-0">

            <v-window v-model="step" class="px-2 py-4 pb-4">

                <v-window-item :value="1">
                    <v-container class="pa-6 d-flex justify-center">
                        <v-card max-width="700" width="100%" class="pa-8 rounded-xl" elevation="2">

                            <!-- TITLE -->
                            <div class="mb-6">
                                <h3 class="text-h6 font-weight-bold">
                                    Select Business Type
                                </h3>
                            </div>

                            <!-- RADIO CARDS -->
                            <v-radio-group v-model="form.business_type" class="mt-2">

                                <v-card v-for="type in businessTypeList" :key="type.id" class="pa-4 mb-4 business-card"
                                    :class="{
                                        'business-card-active': form.business_type === type.value
                                    }" elevation="0"  @click="selectBusinessType(type.value)">
                                    <div class="d-flex align-center">

                                        <v-radio :value="type.value" color="primary" hide-details />

                                        <span class="ml-3 text-body-1 font-weight-medium">
                                            {{ type.label }}
                                        </span>

                                    </div>
                                </v-card>

                            </v-radio-group>

                        </v-card>
                    </v-container>
                </v-window-item>

                <v-window-item :value="2">
                    <v-container class="pa-6">

                        <v-form ref="formBusiness" v-model="validBusiness">

                            <v-container fluid class="pa-2">

                                <!-- MERCHANT PROFILE -->
                                <v-card class="mb-6 pa-6" rounded="xl" elevation="2">
                                    <v-card-title class="text-h6 font-weight-bold">
                                        Merchant Profile
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row dense>

                                            <v-col cols="12">
                                                <v-text-field v-model.trim="form.legal_name" label="Legal Name"
                                                    variant="outlined" :rules="[req]" dense />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="form.primary_email_id" label="Primary Email"
                                                    variant="outlined" :rules="[req, emailRule]"
                                                    prepend-inner-icon="mdi-email-outline" dense />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="form.primary_mobile" label="Primary Mobile"
                                                    prefix="+91" variant="outlined" :rules="[req, phoneRule]"
                                                    prepend-inner-icon="mdi-phone-outline" dense />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="form.dob" label="Date of Birth" type="date"
                                                    variant="outlined" :rules="[req]" :max="maxDob" />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-select v-model="form.gender" :rules="[req]" :items="['M', 'F', 'O']"
                                                    label="Gender" variant="outlined" dense />
                                            </v-col>

                                        </v-row>
                                    </v-card-text>
                                </v-card>

                                <!-- LOCATION -->
                                <v-card class="pa-6" rounded="xl" elevation="2">
                                    <v-card-title class="text-h6 font-weight-bold">
                                        Business Location
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row dense>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model.trim="form.lat" label="Latitude"
                                                    variant="outlined" :rules="[req, latRule]"
                                                    prepend-inner-icon="mdi-map-marker" dense />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model.trim="form.long" label="Longitude"
                                                    variant="outlined" :rules="[req, lngRule]"
                                                    prepend-inner-icon="mdi-map-marker-outline" dense />
                                            </v-col>

                                        </v-row>
                                    </v-card-text>
                                </v-card>

                            </v-container>
                        </v-form>
                    </v-container>
                </v-window-item>

                <v-window-item :value="3">
                    <v-container class="pa-6">

                        <v-form ref="formAdditional" v-model="validAdditional">

                            <v-container fluid class="pa-2">

                                <!-- BUSINESS DETAILS -->
                                <v-card class="mb-6 pa-6" rounded="xl" elevation="2">
                                    <v-card-title class="text-h6 font-weight-bold">
                                        Business Details
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row dense>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model.trim="form.business_name" label="Business Name"
                                                    variant="outlined" :rules="[req]" dense />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model.trim="form.dba_name" label="DBA / Trade Name"
                                                    variant="outlined" :rules="[req]" dense />
                                            </v-col>

                                            <v-col cols="12">
                                                <v-combobox v-model="mcc" :items="mccOptions" item-title="descr"
                                                    item-value="id" label="Nature of Business" clearable
                                                    variant="outlined" :loading="loading" :rules="[req]"
                                                    @update:search="onSearch" dense>
                                                    <template #selection="{ item, index }">
                                                        <v-chip v-if="item === Object(item)" :text="item.raw.descr"
                                                            size="small" closable variant="flat"
                                                            @click:close="removeSelection(index)" />
                                                    </template>
                                                </v-combobox>
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model="form.website" label="Website"
                                                    placeholder="www.example.com (Optional)" variant="outlined"
                                                    prepend-inner-icon="mdi-web" dense />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-autocomplete v-model="form.annual_turn_over"
                                                    :items="turnOverList.data" item-title="label" item-value="value"
                                                    label="Annual Turnover" variant="outlined" :rules="[req]" dense />
                                            </v-col>

                                        </v-row>
                                    </v-card-text>
                                </v-card>


                                <!-- BENEFICIARY -->
                                <v-card class="pa-6" rounded="xl" elevation="2">
                                    <v-card-title class="text-h6 font-weight-bold">
                                        Beneficiary Contact
                                    </v-card-title>

                                    <v-card-text>
                                        <v-row dense>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model.trim="form.beneficiary_email"
                                                    label="Beneficiary Email (Optional)" variant="outlined"
                                                    :rules="[emailOrEmpty]" prepend-inner-icon="mdi-email" dense />
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <v-text-field v-model.trim="form.beneficiary_mobile"
                                                    label="Beneficiary Mobile (Optional)" prefix="+91"
                                                    variant="outlined" :rules="[phoneOrEmpty]"
                                                    prepend-inner-icon="mdi-phone" dense />
                                            </v-col>

                                        </v-row>
                                    </v-card-text>
                                </v-card>

                            </v-container>

                        </v-form>
                    </v-container>
                </v-window-item>

                <!-- STEP 2: Official Address -->
                <v-window-item :value="4">
                    <v-container class="pa-6" rounded="xl">
                        <v-form ref="formOfficial" v-model="validOfficial">
                            <v-card class="pa-6" rounded="xl" elevation="1">
                                <v-row class="mb-4" dense>
                                    <v-col cols="12">
                                        <h3 class="text-h6 font-weight-bold mb-3">Official Address</h3>
                                    </v-col>

                                    <v-col cols="12" md="3">
                                        <v-text-field v-model.trim="form.official_address"
                                            label="Door No / Official Address"
                                            placeholder="Enter door number or office address" variant="outlined"
                                            :rules="[req]" dense />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.trim="form.address1" label="Street Address 1"
                                            placeholder="Enter street address line 1" variant="outlined" :rules="[req]"
                                            dense />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.trim="form.address2" label="Street Address 2"
                                            placeholder="Enter street address line 2" variant="outlined" :rules="[req]"
                                            dense />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.trim="form.address3" label="Landmark"
                                            placeholder="Enter landmark (optional)" variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="form.phone" label="Contact Number (Optional)"
                                            prefix="+91" variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-combobox v-model="opincode" :items="opincodeOptions" item-title="pincode"
                                            item-value="pincode" label="Search Pincode"
                                            placeholder="Search your area pincode" density="comfortable"
                                            variant="outlined" return-object :loading="loading"
                                            @update:search="opinSearch" dense>
                                            <template v-slot:selection="{ item, index }">
                                                <v-chip v-if="item === Object(item)" :text="item.raw.pincode"
                                                    size="small" variant="flat" closable label
                                                    @click:close="removeSelection(index)" />
                                            </template>
                                        </v-combobox>
                                    </v-col>
                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.pincode" label="Pincode"
                                            placeholder="Auto-filled" disabled variant="outlined" :rules="[pincodeRule]"
                                            dense />
                                    </v-col>
                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.city" label="City" placeholder="Auto-filled"
                                            disabled variant="outlined" :rules="[req]" dense />
                                    </v-col>
                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.state" label="State" placeholder="Auto-filled"
                                            disabled variant="outlined" :rules="[req]" dense />
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-form>
                    </v-container>
                </v-window-item>

                <!-- STEP 3: Residential & Visitor Address -->
                <v-window-item :value="5">
                    <v-container class="pa-6" rounded="xl">

                        <!-- ░░ RESIDENTIAL ADDRESS ░░ -->
                        <v-form ref="formResidential" v-model="validResidential">
                            <v-card class="pa-6" rounded="xl" elevation="1">
                                <v-row dense>

                                    <v-col cols="12">
                                        <h3 class="text-h6 font-weight-bold mb-3">Residential Address</h3>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-checkbox v-model="sameAsOfficialResidential" label="Same as Official Address"
                                            @change="copyOfficialToResidential" />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model.trim="form.residential_address"
                                            label="Door No / Residential Address" variant="outlined" dense
                                            :rules="[requiredIf(sameAsOfficialResidential)]" />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model.trim="form.res_address1" label="Street Address 1"
                                            variant="outlined" dense :rules="[requiredIf(sameAsOfficialResidential)]" />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model.trim="form.res_address2" label="Street Address 2"
                                            variant="outlined" dense :rules="[requiredIf(sameAsOfficialResidential)]" />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model.trim="form.res_address3" label="Landmark (optional)"
                                            variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="form.res_mobile" label="Residential Mobile (optional)"
                                            prefix="+91" variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="form.res_phone_number"
                                            label="Residential Phone (optional)" variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-combobox v-model="resPincode" :items="respincodeOptions" item-title="pincode"
                                            item-value="pincode" label="Search Pincode" variant="outlined" dense
                                            return-object :loading="loading" @update:search="respinSearch" />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.res_pincode" label="Pincode" variant="outlined"
                                            dense disabled :rules="[pincodeRule]" />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.res_city" label="City" variant="outlined" dense
                                            disabled />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.res_state" label="State" variant="outlined"
                                            dense disabled />
                                    </v-col>

                                </v-row>
                            </v-card>
                        </v-form>
                    </v-container>

                    <!-- ░░ VISITOR ADDRESS ░░ -->
                    <v-container class="pa-6" rounded="xl">
                        <v-form ref="formVisitor" v-model="validVisitor">
                            <v-card class="pa-6" rounded="xl" elevation="1">
                                <v-row dense>

                                    <v-col cols="12">
                                        <h3 class="text-h6 font-weight-bold mb-3">Visitor Address</h3>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-checkbox v-model="sameAsOfficialVisitor" label="Same as Official Address"
                                            @change="copyOfficialToVisitor" />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model.trim="form.vister_address"
                                            label="Door No / Visitor Address" variant="outlined" dense
                                            :rules="[requiredIf(sameAsOfficialVisitor)]" />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.trim="form.v_address1" label="Street Address 1"
                                            variant="outlined" dense :rules="[requiredIf(sameAsOfficialVisitor)]" />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.trim="form.v_address2" label="Street Address 2"
                                            variant="outlined" dense :rules="[requiredIf(sameAsOfficialVisitor)]" />
                                    </v-col>

                                    <v-col cols="12" md="4">
                                        <v-text-field v-model.trim="form.v_address3" label="Landmark (optional)"
                                            variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="form.v_mobile" label="Visitor Mobile (optional)"
                                            prefix="+91" variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="form.v_phone_number" label="Visitor Phone (optional)"
                                            variant="outlined" dense />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-combobox v-model="vPincode" :items="vpincodeOptions" item-title="pincode"
                                            item-value="pincode" label="Search Pincode" variant="outlined" dense
                                            return-object :loading="loading" @update:search="vpinSearch" />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.v_pincode" label="Pincode" variant="outlined"
                                            dense :rules="[pincodeRule]" />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.v_city" label="City" variant="outlined"
                                            dense />
                                    </v-col>

                                    <v-col cols="6" md="3">
                                        <v-text-field v-model.trim="form.v_state" label="State" variant="outlined"
                                            dense />
                                    </v-col>

                                </v-row>
                            </v-card>
                        </v-form>
                    </v-container>

                </v-window-item>

            </v-window>

            <!-- Footer -->
            <v-divider />
            <v-footer app class="px-8 py-4">
                <v-btn variant="text" :disabled="step === 1" @click="prev" class="text-grey-darken-1">
                    Back
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn v-if="step < steps.length" color="#001f3f" size="large" class="px-8" @click="next">
                    Next
                </v-btn>

                <v-btn v-else color="#001f3f" size="large" class="px-8" :disabled="step !== 5 || !confirmDetails"
                    @click="submit" :loading="submitting">
                    Submit
                </v-btn>
            </v-footer>
        </v-card>

        <v-snackbar v-model="businessSnackbar.show" :timeout="4000" location="top right" elevation="8" rounded="xl"
            class="snackbar-modern" color="info">
            <div class="d-flex align-center ga-3">

                <v-icon size="22" color="info">
                    mdi-information-outline
                </v-icon>

                <div class="text-body-2 font-weight-medium">
                    You selected
                    {{
                        businessTypeList.find(t => t.value === form.business_type)?.label
                    }}
                    as your business type. Click Next to proceed.
                </div>

                <v-spacer />

                <v-btn icon size="x-small" variant="text" @click="businessSnackbar.show = false">
                    <v-icon size="18">mdi-close</v-icon>
                </v-btn>

            </div>

            <div class="snackbar-strip info" />
        </v-snackbar>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :timeout="4000" location="top right" elevation="8" rounded="xl"
            class="snackbar-modern" color="primary">
            <div class="d-flex align-center ga-3">
                <v-icon size="22" :color="snackbar.color">
                    {{ snackbar.color === 'success'
                        ? 'mdi-check-circle-outline'
                        : 'mdi-alert-circle-outline'
                    }}
                </v-icon>

                <div class="text-body-2 font-weight-medium">
                    {{ snackbar.message }}
                </div>

                <v-spacer />

                <v-btn icon size="x-small" variant="text" @click="snackbar.show = false">
                    <v-icon size="18">mdi-close</v-icon>
                </v-btn>
            </div>

            <div class="snackbar-strip" :class="snackbar.color" />
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

const { MCCSearch,
    businessTurnOver,
    businessType,
    pincodeSearch,
    fetchCompliance,
    complianceStatus,
    complianceInit,
    uploadDoc,
    getMerchantById,
    createMerchant,
    onboadingAEPS,
    updateMerchant,
    updateMerchantInfo,
    initiateOnboarding } = useOnboadingApi();

const Onboarding = useOnboardingStore();
const { turnOverList, businessTypeList } = storeToRefs(Onboarding);
const router = useRouter();

const snackbar = reactive({ show: false, message: "", color: "success" });

const confirmDetails = ref(false)
const businessSnackbar = reactive({
  show: false
})

const {
    previewUrl,
    file,
    error,
    takePhoto,
    uploadFile,
    panUrl,
    uploadFileDesktop,
    takePhotoDesktop,
    AadharFrontUrl,
    AadharBackUrl,
    STOREURL,
    isValid,
} = useFileUpload();

const submitting = ref(false);

const steps = [
    { key: "business-type", label: "Business Type" },
    { key: "business", label: "Business Details" },
    { key: "merchantinfo", label: "Other Information" },
    { key: "official", label: "Official Address" },
    { key: "residential/visitor", label: "Address Details" },
];

const title = computed(() => {
    switch (step.value) {
        case 1: return "SELECT BUSINESS TYPE"
        case 2: return "BUSINESS DETAILS"
        case 3: return "OTHER INFORMATION"
        case 4: return "OFFICIAL ADDRESS"
        case 5: return "ADDRESS DETAILS"
        case 6: return "REVIEW & CONFIRM"
        default: return "MERCHANT CREATION"
    }
});

const step = ref(1);
const prev = () => (step.value = Math.max(1, step.value - 1));

// Form state
const form = reactive({
    legal_name: "",
    business_name: "",
    dba_name: null,
    dob: "",
    primary_email_id: "",
    primary_mobile: "",

    business_type: null,
    nature_of_business: null,
    annual_turn_over: null,

    gender: "",
    lat: "",
    long: "",

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

    mcc: "",
    std_code: "091",
    lead_source: "BUCKSBOX",
    lg_code: "",
    ckyc: false
});

const sameAsOfficialResidential = ref(false);
const sameAsOfficialVisitor = ref(false);
function copyOfficialToResidential() { if (sameAsOfficialResidential.value) { Object.assign(form, { residential_address: form.official_address, res_address1: form.address1, res_address2: form.address2, res_address3: form.address3, res_city: form.city, res_state: form.state, res_pincode: form.pincode }); } }
function copyOfficialToVisitor() { if (sameAsOfficialVisitor.value) { Object.assign(form, { vister_address: form.official_address, v_address1: form.address1, v_address2: form.address2, v_address3: form.address3, v_city: form.city, v_state: form.state, v_pincode: form.pincode }); } }

// MCC & Pincode
const mcc = ref(), opincode = ref(), resPincode = ref(), vPincode = ref();
const mccOptions = ref([]), opincodeOptions = ref([]), respincodeOptions = ref([]), vpincodeOptions = ref([]);

// Validation
const req = v => !!v || v === 0 || "Required";
const emailRule = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email";
const emailOrEmpty = v => !v || emailRule(v) === true || "Invalid email";
const phone10 = v => /^\d{10}$/.test(String(v || ""));
const phoneRule = v => phone10(v) || "Enter 10-digit mobile";
const phoneOrEmpty = v => !v || phone10(v) || "Enter 10-digit mobile";
const pincode6 = v => /^\d{6}$/.test(String(v || ""));

const passwordRule = v =>
    (!!v && v.length >= 8) || "Password must be at least 8 characters";

const passwordOrEmpty = v =>
    !v || (v.length >= 8) || "Password must be at least 8 characters";

const required = v => !!v || 'This field is required'

const requiredIf = condition => v =>
    condition || !!v || 'This field is required'


const accNumberRule = (v) =>
    /^[0-9]*$/.test(v) || "Account number must contain only digits";

const ifscRule = (v) =>
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v?.toUpperCase()) || "Invalid IFSC code";

const pincodeRule = v => pincode6(v) || "6-digit pincode";
const pincodeOrEmpty = v => !v || pincode6(v) || "6-digit pincode";
const latRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -90 && Number(v) <= 90) || "Lat -90 to 90";
const lngRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -180 && Number(v) <= 180) || "Lng -180 to 180";

// Step validation refs
const formBusiness = ref(), formReg = ref(), formOfficial = ref(), formResidential = ref(), formVisitor = ref(), formAdditional = ref();
const validBusiness = ref(false), validOfficial = ref(false), validResidential = ref(false), validVisitor = ref(false), validAdditional = ref(false);

const onSearch = async (query) => {
    if (!query || query.length < 2) {
        mccOptions.value = [];
        return;
    }

    loading.value = true;
    try {
        console.log(query);
        const res = await MCCSearch(query);
        mccOptions.value = res.data.data;
    } catch (err) {
        console.error("MCC search failed", err);
    } finally {
        loading.value = false;
    }
};

const selectBusinessType = (value) => {
  form.business_type = value
  businessSnackbar.show = true
}

const opinSearch = async (query) => {
    if (!query || query.length < 2) {
        opincodeOptions.value = [];
        return;
    }

    loading.value = true;
    try {
        const res = await pincodeSearch(query);
        opincodeOptions.value = res.data.data;
    } catch (err) {
        console.error("Official pincode search failed", err);
    } finally {
        loading.value = false;
    }
};

const respinSearch = async (query) => {
    if (!query || query.length < 2) {
        respincodeOptions.value = [];
        return;
    }

    loading.value = true;
    try {
        const res = await pincodeSearch(query);
        respincodeOptions.value = res.data.data;
    } catch (err) {
        console.error("Residential pincode search failed", err);
    } finally {
        loading.value = false;
    }
};

const vpinSearch = async (query) => {
    if (!query || query.length < 2) {
        vpincodeOptions.value = [];
        return;
    }

    loading.value = true;
    try {
        const res = await pincodeSearch(query);
        vpincodeOptions.value = res.data.data;
    } catch (err) {
        console.error("Visitor pincode search failed", err);
    } finally {
        loading.value = false;
    }
};

async function submit() {
    submitting.value = true;

    try {
        const payload = {
            dba_name: form.dba_name,
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
            nature_of_business: mcc.value?.descr,

            std_code: form.std_code,
            lead_source: form.lead_source,
            lg_code: form.lg_code,
            annual_turn_over: form.annual_turn_over,
            ckyc: form.ckyc
        }

        console.log("Create Merchant Payload:", payload)

        const res = await createMerchant(payload);

        console.log("Create Merchant Response:", res);

        if (res.data.statusCode == "00") {
            snackbar.message = res.data.message;
            snackbar.color = "success";
            snackbar.show = true;
            router.push("/aggregator/onboarding/success");
        } else {
            snackbar.message = res.data.message;
            snackbar.color = "error";
            snackbar.show = true;
        }
    } catch (e) {
        console.error(e);
    } finally {
        submitting.value = false;
    }
}

const next = async () => {

    if (step.value === 1) {
        if (!form.business_type) {
            snackbar.message = "Please select a business type"
            snackbar.color = "error"
            snackbar.show = true
            return
        }
    }

    if (step.value === 2) {
        const res = await formBusiness.value.validate()
        if (!res.valid) return
    }

    if (step.value === 3) {
        const res = await formAdditional.value.validate()
        if (!res.valid) return
    }

    if (step.value === 4) {
        const res = await formOfficial.value.validate()
        if (!res.valid) return
    }

    if (step.value === 5) {
        const r1 = await formResidential.value.validate();
        const r2 = await formVisitor.value.validate();
        if (!r1.valid || !r2.valid) return;
    }

    step.value++
}

onMounted(async () => {
    try {
        await businessTurnOver();
        console.log(turnOverList.value);
    } catch (err) {
        console.error("Failed to load payment methods options:", err);
    }
});


onMounted(async () => {
    try {
        await businessType();
        console.log("Loaded Business Types:", businessTypeList.value);
    } catch (err) {
        console.error("Failed to load business types:", err);
    }
});

watch(mcc, () => { if (mcc.value) { form.nature_of_business = mcc.value.descr; form.mcc = mcc.value.id; } });
watch(opincode, val => { if (!val) return; form.city = val.city; form.state = val.statename; form.pincode = val.pincode; });
watch(resPincode, val => { if (!val) return; form.res_city = val.city; form.res_state = val.statename; form.res_pincode = val.pincode; });
watch(vPincode, val => { if (!val) return; form.v_city = val.city; form.v_state = val.statename; form.v_pincode = val.pincode; });

const loading = ref(false);
</script>

<style scoped>
.business-card {
    border: 2px solid #eef2f7;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
}

.business-card:hover {
    border-color: #c7d7ff;
    background: #f8fafc;
}

.business-card-active {
    border-color: #2563eb;
    background: #f8fafc;
    box-shadow: 0 0 0 1px #2563eb;
}
</style>