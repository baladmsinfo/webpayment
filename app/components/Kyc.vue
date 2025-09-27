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
        <v-card variant="flat" class="mx-auto my-6" max-width="1100">
            <v-window v-model="step" class="px-4 py-4 pb-4">
                <!-- STEP 1: Business Info -->
                <v-window-item :value="1">
                    <v-form ref="formBusiness" v-model="validBusiness">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.trim="form.legal_name" :disabled="form.legal_name"
                                    variant="outlined" label="Legal Name" :rules="[req]" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.trim="form.dba_name" variant="outlined" label="DBA (Trade Name)"
                                    :rules="[req]" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-combobox v-model="mcc" :items="mccOptions" item-title="descr" item-value="id"
                                    label="Search nature of Business" clearable density="comfortable" variant="outlined"
                                    :loading="loading" :rules="[req]" @update:search="onSearch">
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip v-if="item === Object(item)" :text="item.raw.descr" size="small"
                                            variant="flat" closable label @click:close="removeSelection(index)" />
                                    </template>
                                </v-combobox>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete v-model="form.annual_turn_over" :items="turnOverList.data"
                                    item-title="label" item-value="value" label="Select Turnover" variant="outlined"
                                    :rules="[req]" chips hide-details />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete v-model="form.business_type" :items="businessTypeList" item-title="type"
                                    item-value="type" label="Business type" variant="outlined" :rules="[req]" chips
                                    hide-details />

                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.primary_email_id" :disabled="loading || false"
                                    variant="outlined" label="Enter Email" :rules="[req, emailRule]" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.primary_mobile" :disabled="loading || false" prefix="+91"
                                    variant="outlined" label="Enter Mobile No" :rules="[req, phoneRule]" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.trim="form.beneficiary_email" variant="outlined"
                                    label="Secondary Email" :rules="[emailOrEmpty]" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.trim="form.beneficiary_mobile" variant="outlined" prefix="+91"
                                    label="Secondary Mobile" :rules="[phoneOrEmpty]" />
                            </v-col>
                            <v-col cols="6" md="3">
                                <v-text-field v-model.trim="form.lat" label="Latitude" :rules="[latRule]" />
                            </v-col>
                            <v-col cols="6" md="3">
                                <v-text-field v-model.trim="form.long" label="Longitude" :rules="[lngRule]" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-window-item>

                <!-- STEP 2: Official Address -->
                <v-window-item :value="2">
                    <v-form ref="formOfficial" v-model="validOfficial">
                        <v-row>
                            <v-col md="3"><v-text-field v-model.trim="form.official_address" variant="outlined"
                                    label="Door No / Official Address" :rules="[req]" /></v-col>
                            <v-col cols="12" md="4"><v-text-field v-model.trim="form.address1" variant="outlined"
                                    label="Street Address 1" :rules="[req]" /></v-col>
                            <v-col cols="12" md="4"><v-text-field v-model.trim="form.address2" variant="outlined"
                                    label="Street Address 2" :rules="[req]" /></v-col>
                            <v-col cols="12" md="4"><v-text-field v-model.trim="form.address3" variant="outlined"
                                    label="Landmark" /></v-col>
                            <v-col cols="6" md="3">
                                <v-combobox v-model="opincode" :items="opincodeOptions" item-title="pincode"
                                    item-value="pincode" label="Search pincode" density="comfortable" variant="outlined"
                                    return-object :loading="loading" :rules="[req]" @update:search="opinSearch">
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                                            variant="flat" closable label @click:close="removeSelection(index)" />
                                    </template>
                                </v-combobox>
                            </v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.pincode" disabled variant="outlined"
                                    label="Pincode" :rules="[pincodeRule]" /></v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.city" disabled variant="outlined"
                                    label="City" :rules="[req]" /></v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.state" disabled variant="outlined"
                                    label="State" :rules="[req]" /></v-col>
                        </v-row>
                    </v-form>
                </v-window-item>

                <!-- STEP 3: Residential Address -->
                <v-window-item :value="3">
                    <v-form ref="formResidential" v-model="validResidential">
                        <v-row>
                            <v-col cols="12">
                                <v-checkbox v-model="sameAsOfficialResidential" label="Same as Official Address"
                                    @change="copyOfficialToResidential" />
                            </v-col>
                            <v-col cols="12" md="6"><v-text-field v-model.trim="form.residential_address"
                                    variant="outlined" label="Door No / Residential Address" /></v-col>
                            <v-col cols="12" md="6"><v-text-field v-model.trim="form.res_address1"
                                    label="Street Address 1" /></v-col>
                            <v-col cols="12" md="6"><v-text-field v-model.trim="form.res_address2"
                                    label="Street Address 2" /></v-col>
                            <v-col cols="12" md="6"><v-text-field v-model.trim="form.res_address3"
                                    label="Landmark" /></v-col>
                            <v-col cols="6" md="3">
                                <v-combobox v-model="resPincode" :items="respincodeOptions" item-title="pincode"
                                    item-value="pincode" label="Search pincode" density="comfortable" variant="outlined"
                                    return-object :loading="loading" @update:search="respinSearch">
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                                            variant="flat" closable label @click:close="removeSelection(index)" />
                                    </template>
                                </v-combobox>
                            </v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.res_pincode" variant="outlined"
                                    disabled label="Pincode" :rules="[pincodeOrEmpty]" /></v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.res_city" disabled
                                    variant="outlined" label="City" /></v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.res_state" disabled
                                    variant="outlined" label="State" /></v-col>
                        </v-row>
                    </v-form>

                    <!-- Visitor Address -->
                    <v-list-subheader>Visitor Address</v-list-subheader>
                    <v-form ref="formVisitor" v-model="validVisitor">
                        <v-row>
                            <v-col cols="12"><v-checkbox v-model="sameAsOfficialVisitor"
                                    label="Same as Official Address" @change="copyOfficialToVisitor" /></v-col>
                            <v-col cols="12" md="6"><v-text-field v-model.trim="form.visitor_address"
                                    label="Door No / Visitor Address" /></v-col>
                            <v-col cols="12" md="4"><v-text-field v-model.trim="form.v_address1"
                                    label="Street Address 1" /></v-col>
                            <v-col cols="12" md="4"><v-text-field v-model.trim="form.v_address2"
                                    label="Street Address 2" /></v-col>
                            <v-col cols="12" md="4"><v-text-field v-model.trim="form.v_address3"
                                    label="Landmark" /></v-col>
                            <v-col cols="6" md="3">
                                <v-combobox v-model="vPincode" :items="vpincodeOptions" item-title="pincode"
                                    item-value="pincode" label="Search pincode" density="comfortable" variant="outlined"
                                    return-object :loading="loading" @update:search="vpinSearch">
                                    <template v-slot:selection="{ item, index }">
                                        <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                                            variant="flat" closable label @click:close="removeSelection(index)" />
                                    </template>
                                </v-combobox>
                            </v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.v_pincode" label="Pincode"
                                    :rules="[pincodeOrEmpty]" /></v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.v_city" label="City" /></v-col>
                            <v-col cols="6" md="3"><v-text-field v-model.trim="form.v_state" label="State" /></v-col>
                        </v-row>
                    </v-form>
                </v-window-item>


                <v-window-item :value="4">
                    <v-list-subheader>Pan Verification</v-list-subheader>
                    <v-form class="mt-3" ref="formPan" v-model="validPan">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="pannum" variant="solo" color="purple darken-2"
                                    label="PAN Number *" counter type="text" required
                                    @input="pannum = pannum.toUpperCase()" outlined maxlength="10" :rules="[req]"
                                    dense></v-text-field>
                                <v-text-field v-model="panholdername" variant="solo" label="PAN Card Name *" type="text"
                                    class="mt-5" outlined dense maxlength="30" :rules="[req]"></v-text-field>
                                <v-text-field v-model="fathername" variant="solo" label="father Name *" type="text"
                                    class="mt-5" outlined dense maxlength="30" :rules="[req]"></v-text-field>
                                <v-text-field class="mt-3" v-model="form.dob" label="Date of Birth" variant="outlined"
                                    type="date" :rules="[req, dobPastRule]" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-btn :disabled="!validPan" color="primary" :loading="loading" @click="panverify()"
                                    depressed>
                                    Verify PAN
                                    <template v-slot:loader>
                                        <span>Verifying...</span>
                                    </template>
                                </v-btn>
                                <v-alert class="mt-6" v-if="panresult != null" density="compact" :text="panresult"
                                    title="PAN VERIFICATION" type="warning"></v-alert>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-window-item>

                <v-window-item :value="5">
                    <v-list-subheader>Account Verification</v-list-subheader>
                    <v-form class="mt-3" ref="formAccount" v-model="validAccount">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="accountname" variant="solo" maxlength="200" outlined dense
                                    label="Enter account holder name*" :rules="[req]"></v-text-field>
                                <v-text-field v-model="accountnumber" variant="solo" maxlength="20"
                                    label="Enter account number*" type="number" outlined dense counter
                                    :rules="[req, accNumberRule]"></v-text-field>
                                <v-text-field v-model="ifsccode" variant="solo" maxlength="65" outlined
                                    placeholder="Ex: HDFC0001234" dense @input="ifsccode = ifsccode.toUpperCase()"
                                    label="Enter Branch IFSC*" :rules="[req, ifscRule]"></v-text-field>
                                <v-autocomplete v-model="accounttype" variant="solo" :items="account_type" dense
                                    outlined item-text="name" item-value="id" label="Account Type" return-object
                                    class="text-caption" :rules="[req]">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-btn color="primary" class="mb-2" :disabled="!validAccount" :loading="loading"
                                    @click="accountverify()" depressed>
                                    Verify Account
                                    <template v-slot:loader>
                                        <span>Verifying...</span>
                                    </template>
                                </v-btn>
                                <v-alert class="mt-6" v-if="accresult != null" density="compact" :text="accresult"
                                    title="ACCOUNT VERIFICATION" type="warning"></v-alert>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-window-item>

                <v-window-item :value="6">
                    <v-list-subheader>Image Verification</v-list-subheader>
                    <v-card variants="flat" class="mt-4">
                        <v-card-title>Upload Pan Image</v-card-title>
                        <v-img contain height="400" width="300" class="mt-2 mb-2" v-if="panUrl != null" :src="panUrl" />
                        <v-card-text v-if="panUrl == null">
                            <div class="Neon Neon-theme-dragdropbox mt-8">
                                <div class="Neon-input-dragDrop">
                                    <div class="Neon-input-inner">
                                        <div class="Neon-input-text">
                                            <span style="display: inline-block; margin: 15px 0"></span>
                                        </div>
                                        <a @click="takePhotoDesktop('63_Pan_Card_front', props.merchantId)"
                                            class="Neon-input-choose-btn white--text primary">Upload pan Document</a>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card class="mt-2">
                        <v-card-title>Upload Aadhar Front image</v-card-title>
                        <v-img v-if="AadharFrontUrl != null" :src="AadharFrontUrl" />
                        <v-card-text v-if="AadharFrontUrl == null">
                            <div class="Neon Neon-theme-dragdropbox mt-8">
                                <div class="Neon-input-dragDrop">
                                    <div class="Neon-input-inner">
                                        <div class="Neon-input-text">
                                            <span style="display: inline-block; margin: 15px 0"></span>
                                        </div>
                                        <a @click="takePhotoDesktop('55_Aadhar_Card_front', props.merchantId)"
                                            class="Neon-input-choose-btn white--text primary">Upload Aadhar Front
                                            image</a>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card class="mt-2">
                        <v-card-title>Upload Aadhar back image</v-card-title>
                        <v-img v-if="AadharBackUrl != null" :src="AadharBackUrl" />
                        <v-card-text v-if="AadharBackUrl == null">
                            <div class="Neon Neon-theme-dragdropbox mt-8">
                                <div class="Neon-input-dragDrop">
                                    <div class="Neon-input-inner">
                                        <div class="Neon-input-text">
                                            <span style="display: inline-block; margin: 15px 0"></span>
                                        </div>
                                        <a @click="takePhotoDesktop('55_Aadhar_Card_back', props.merchantId)"
                                            class="Neon-input-choose-btn white--text primary">Upload Aadhar back
                                            image</a>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card class="mt-2">
                        <v-card-title>Upload Store image</v-card-title>
                        <v-img v-if="STOREURL != null" :src="STOREURL" />
                        <v-card-text v-if="STOREURL == null">
                            <div class="Neon Neon-theme-dragdropbox mt-8">
                                <div class="Neon-input-dragDrop">
                                    <div class="Neon-input-inner">
                                        <div class="Neon-input-text">
                                            <span style="display: inline-block; margin: 15px 0"></span>
                                        </div>
                                        <a @click="takePhotoDesktop('999_STORE_1', props.merchantId)"
                                            class="Neon-input-choose-btn white--text primary">Upload Store image</a>
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                    <!--<v-btn @click="takePhoto" :loading="loading">Take Photo</v-btn>
          <div v-if="previewUrl">
            <img :src="previewUrl" alt="Preview" class="w-40 h-40 object-cover rounded" />
          </div>-->
                </v-window-item>

                <!-- 6. Review & Submit -->
                <v-window-item :value="7">
                    <div class="pa-2">
                        <v-alert type="info" variant="tonal" class="mb-4">
                            Review the captured information. You can go back to edit before submitting.
                        </v-alert>

                        <v-expansion-panels variant="accordion">
                            <v-expansion-panel title="Business Information">
                                <v-expansion-panel-text>
                                    <pre class="text-body-2">{{
                                        pick(form, [
                                            "legal_name",
                                            "dba_name",
                                            "mcc",
                                            "nature_of_business",
                                            "annual_turn_over",
                                            "website",
                                            "dob",
                                            "lat",
                                            "long",
                                            "lead_source",
                                        ])
                                    }}</pre>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel title="Contacts">
                                <v-expansion-panel-text>
                                    <pre class="text-body-2">{{
                                        pick(form, [
                                            "primary_email_id",
                                            "primary_mobile",
                                            "beneficiary_email",
                                            "beneficiary_mobile",
                                            "std_code",
                                        ])
                                    }}</pre>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel title="Official Address">
                                <v-expansion-panel-text>
                                    <pre class="text-body-2">{{
                                        pick(form, [
                                            "official_address",
                                            "address1",
                                            "address2",
                                            "address3",
                                            "phone",
                                            "city",
                                            "state",
                                            "pincode",
                                        ])
                                    }}</pre>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel title="Residential Address">
                                <v-expansion-panel-text>
                                    <pre class="text-body-2">{{
                                        pick(form, [
                                            "residential_address",
                                            "res_address1",
                                            "res_address2",
                                            "res_address3",
                                            "res_phone_number",
                                            "res_city",
                                            "res_state",
                                            "res_pincode",
                                        ])
                                    }}</pre>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel title="Visitor Address">
                                <v-expansion-panel-text>
                                    <pre class="text-body-2">{{
                                        pick(form, [
                                            "visitor_address",
                                            "v_address1",
                                            "v_address2",
                                            "v_address3",
                                            "v_phone_number",
                                            "v_city",
                                            "v_state",
                                            "v_pincode",
                                        ])
                                    }}</pre>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>
                </v-window-item>
            </v-window>

            <!-- Footer -->
            <v-divider />
            <v-footer app>
                <v-btn variant="tonal" :disabled="step === 1" @click="prev">Back</v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="step < steps.length - 1" color="primary" @click="next">Next</v-btn>
                <v-btn v-else color="primary" :disabled="!isValid" @click="submit" :loading="submitting">Submit</v-btn>
            </v-footer>
        </v-card>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.message }}</v-snackbar>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps, computed, watch, onMounted } from "vue";
import { useAggregatorApi } from '@/composables/apis/useAggregatorApi'
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useUsersApi } from "@/composables/apis/useUsersApi";
import { useOnboardingStore } from "@/stores/onboading";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useFileUpload } from "@/composables/apis/useUploader";
import moment from "moment";

const props = defineProps({
    merchantId: {
        type: String,
        required: true
    }
})

const merchant = ref(null)
const { getuserOnboarding } = useAggregatorApi()

const { MCCSearch, businessTurnOver, businessType, pincodeSearch, verifyPan, verifyAccount, onboading } = useOnboadingApi();
const { getProfile } = useUsersApi();
const Onboarding = useOnboardingStore();
const { turnOverList, businessTypeList } = storeToRefs(Onboarding);
const router = useRouter();
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

const pannum = ref("");           // PAN Number input
const panholdername = ref("");    // Name on PAN input
const fathername = ref("");       // Father's name input
const panresult = ref(null);      // PAN verification result message
const isPanVerified = ref(false); // PAN verification status
const formPan = ref();            // v-form ref for validation
const validPan = ref(false);      // v-form validity

const accountname = ref("");         // Account holder name input
const accountnumber = ref("");       // Account number input
const ifsccode = ref("");            // IFSC code input
const accounttype = ref("current");  // Selected account type
const account_type = ref(["saving", "current"]); // Account type options
const accresult = ref(null);         // Account verification result
const isAccountVerified = ref(false); // Account verification status
const formAccount = ref();           // v-form ref for validation
const validAccount = ref(false);     // v-form validity

const submitting = ref(false);
const FormImage = ref(false);
const formimage = ref();
const selectedFile = ref(null);
const imageName = ref("");
const cropDialog = ref("");

// Stepper
const steps = [
    { key: "business", label: "Business" },
    { key: "official", label: "Official Address" },
    { key: "residential", label: "Residential" },
    { key: "pan", label: "PAN Verification" },
    { key: "account", label: "Account Verification" },
    { key: "image", label: "Image Upload" },
    { key: "review", label: "Review & Submit" },
];
const step = ref(1);
const prev = () => (step.value = Math.max(1, step.value - 1));

// Form state
const form = reactive({
    legal_name: "", dba_name: null, dob: "", primary_email_id: "", primary_mobile: "", mobile_number: "",
    official_address: "", address1: "", address2: "", address3: "", phone: "", city: "", state: "", pincode: "",
    residential_address: "", res_address1: "", res_address2: "", res_address3: "", res_mobile: "", res_phone_number: "", res_city: "", res_state: "", res_pincode: "",
    vister_address: "", v_address1: "", v_address2: "", v_address3: "", v_mobile: "", v_phone_number: "", v_city: "", v_state: "", v_pincode: "",
    website: "", beneficiary_email: "", beneficiary_mobile: "", gender: "", lat: "", long: "", nature_of_business: null,
    business_type: null, mcc: "", std_code: "091", lead_source: "BUCKSBOX", lg_code: "", annual_turn_over: null,
});

const sameAsOfficialResidential = ref(false);
const sameAsOfficialVisitor = ref(false);
function copyOfficialToResidential() { if (sameAsOfficialResidential.value) { Object.assign(form, { residential_address: form.official_address, res_address1: form.address1, res_address2: form.address2, res_address3: form.address3, res_city: form.city, res_state: form.state, res_pincode: form.pincode }); } }
function copyOfficialToVisitor() { if (sameAsOfficialVisitor.value) { Object.assign(form, { visitor_address: form.official_address, v_address1: form.address1, v_address2: form.address2, v_address3: form.address3, v_city: form.city, v_state: form.state, v_pincode: form.pincode }); } }

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
const pincodeRule = v => pincode6(v) || "6-digit pincode";
const pincodeOrEmpty = v => !v || pincode6(v) || "6-digit pincode";
const latRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -90 && Number(v) <= 90) || "Lat -90 to 90";
const lngRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -180 && Number(v) <= 180) || "Lng -180 to 180";

// Step validation refs
const formBusiness = ref(), formOfficial = ref(), formResidential = ref(), formVisitor = ref();
const validBusiness = ref(false), validOfficial = ref(false), validResidential = ref(false), validVisitor = ref(false);

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
        /*const res = await axios.get("http://localhost:3000/mcc", {
          params: { q: query },
        });
        mccOptions.value = res.data;*/
    } catch (err) {
        console.error("MCC search failed", err);
    } finally {
        loading.value = false;
    }
};

const panverify = async () => {
    loading.value = true;
    try {
        let panData = {
            dob: moment(form.dob).format("DD/MM/YYYY"),
            fathername: fathername.value,
            name: panholdername.value,
            pan: pannum.value,
            merchantId: props.merchantId,
        };
        const res = await verifyPan(panData);
        if (res.statusCode == "00") {
            panresult.value = res.message;
            isPanVerified.value = true;
        } else {
            panresult.value = "Account verification failed";
        }
    } catch (err) {
        panresult.value = "Pan verification failed";
        console.error("Pan verification failed", err);
    } finally {
        loading.value = false;
    }
};

const accountverify = async () => {
    loading.value = true;
    try {
        let accountData = {
            accountNumber: accountnumber.value,
            accountHolderName: accountname.value,
            ifsc: ifsccode.value,
            additionalData: true,
            consent: "Y",
            merchantId: props.merchantId,
        };
        const res = await verifyAccount(accountData);
        if (res.statusCode == "00") {
            accresult.value = res.message;
            isAccountVerified.value = true;
        } else {
            accresult.value = "Account verification failed";
        }
    } catch (err) {
        accresult.value = "Account verification failed";
        console.error("Account verification failed", err);
    } finally {
        loading.value = false;
    }
};

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

const cleanedPayload = computed(() => {
    const clone = JSON.parse(JSON.stringify(form));

    // normalize website
    if (clone.website) {
        clone.website = clone.website.startsWith("http")
            ? clone.website
            : `https://${clone.website}`;
    }

    clone.merchantId = props.merchantId || null;

    // drop empty strings (optional)
    /*Object.keys(clone).forEach((k) => {
      if (clone[k] === "" || clone[k] === null) delete clone[k];
    });*/

    return clone;
});

async function next() {
    if (step.value < steps.length - 2) {
        const ok = await validateCurrentStep();
        if (!ok) return;
    }

    // Extra check for Step 5 (Account Verification)
    if (step.value === 4) {
        // assuming Step 5 is index 5
        if (isPanVerified.value) {
            panresult.value = "Please verify your pan before proceeding";
            return;
        }
    }

    // Extra check for Step 5 (Account Verification)
    if (step.value === 5) {
        // assuming Step 5 is index 5
        if (isAccountVerified.value) {
            accresult.value = "Please verify your account before proceeding";
            return;
        }
    }

    step.value = Math.min(steps.length - 1, step.value + 1);
}

// Dynamic title
const title = computed(() => {
    switch (step.value) {
        case 1: case 2: return "BUSINESS DETAILS";
        case 3: return "ADDRESS DETAILS";
        case 4: return "PAN VERIFICATION";
        case 5: return "ACCOUNT VERIFICATION";
        case 6: return "IMAGE UPLOAD";
        case 7: return "ONBOARDING STATUS";
        default: return "ONBOARDING";
    }
});

// Load initial profile & location
onMounted(async () => {
    await businessTurnOver();
    console.log(turnOverList.value);

    businessType();

    try {
        if (props.merchantId) {
            const { data: profile } = await getuserOnboarding(props.merchantId);
            console.log("getuseronboard", profile);

            if (profile) {
                const p = profile;
                Object.assign(form, {
                    legal_name: p.name || "",
                    primary_email_id: p.email || "",
                    primary_mobile: p.mobile_no || "",
                    mobile_number: p.mobile_no || "",
                    res_mobile: p.mobile_no,
                    res_phone_number: p.mobile_no,
                    beneficiary_mobile: p.mobile_no,
                    beneficiary_email: p.email,
                    phone: p.mobile_no,
                    v_mobile: p.mobile_no,
                    v_phone_number: p.mobile_no,
                });

                console.log("Form:", form);

            }
        }
    } catch (err) { console.error("Failed to load profile:", err); }
});

// MCC & Pincode watchers
watch(mcc, () => { if (mcc.value) { form.nature_of_business = mcc.value.descr; form.mcc = mcc.value.id; } });
watch(opincode, val => { if (!val) return; form.city = val.city; form.state = val.statename; form.pincode = val.pincode; });
watch(resPincode, val => { if (!val) return; form.res_city = val.city; form.res_state = val.statename; form.res_pincode = val.pincode; });
watch(vPincode, val => { if (!val) return; form.v_city = val.city; form.v_state = val.statename; form.v_pincode = val.pincode; });

// Step navigation
async function validateCurrentStep() {
    const map = { 1: formBusiness, 2: formOfficial, 3: formResidential, 4: null, 5: null, 6: null };
    const frm = map[step.value]?.value;
    if (!frm) return true;
    const ok = await frm.validate();
    return ok.valid;
}

const snackbar = reactive({ show: false, message: "", color: "success" });
const loading = ref(false);

async function submit() {
    submitting.value = true;
    try {
        const res = await onboading(cleanedPayload.value);
        if (res.statusCode == "00") {
            snackbar.message = res.message;
            snackbar.color = "success";
            snackbar.show = true;
            router.push("/mobile/dashboard");
        } else {
            snackbar.message = res.message;
            snackbar.color = "error";
            snackbar.show = true;
        }
        //showSuccess.value = true;
    } catch (e) {
        console.error(e);
    } finally {
        submitting.value = false;
    }
}
</script>