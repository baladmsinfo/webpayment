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
                        <v-container fluid class="pa-4">
                            <!-- Business Names -->
                            <v-row class="mb-4" dense>
                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Business Names</h3>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.legal_name" label="Legal Name"
                                        placeholder="Enter your registered business name" variant="outlined"
                                        :rules="[req]" dense />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.dba_name" label="DBA (Trade Name)"
                                        placeholder="Enter your trade/business alias" variant="outlined" :rules="[req]"
                                        dense />
                                </v-col>
                            </v-row>

                            <!-- Business Details -->
                            <v-row class="mb-4" dense>
                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Business Details</h3>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-combobox v-model="mcc" :items="mccOptions" item-title="descr" item-value="id"
                                        label="Nature of Business" placeholder="Select or search business nature"
                                        clearable variant="outlined" :loading="loading" :rules="[req]"
                                        @update:search="onSearch" dense>
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="item === Object(item)" :text="item.raw.descr" size="small"
                                                variant="flat" closable label @click:close="removeSelection(index)" />
                                        </template>
                                    </v-combobox>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-autocomplete v-model="form.business_type" :items="businessTypeList"
                                        item-title="type" item-value="type" label="Business Type"
                                        placeholder="Select business type" variant="outlined" :rules="[req]" dense />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-autocomplete v-model="form.annual_turn_over" :items="turnOverList.data"
                                        item-title="label" item-value="value" label="Annual Turnover"
                                        placeholder="Select annual turnover" variant="outlined" :rules="[req]" dense />
                                </v-col>
                            </v-row>

                            <!-- Primary Contact -->
                            <v-row class="mb-4" dense>
                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Primary Contact</h3>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.primary_email_id" label="Email"
                                        placeholder="Enter primary email" variant="outlined" :rules="[req, emailRule]"
                                        dense />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.primary_mobile" label="Mobile No"
                                        placeholder="Enter primary mobile number" prefix="+91" variant="outlined"
                                        :rules="[req, phoneRule]" dense />
                                </v-col>
                            </v-row>

                            <!-- Beneficiary Contact -->
                            <v-row class="mb-4" dense>
                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Beneficiary Contact</h3>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.beneficiary_email"
                                        label="Beneficiary Email (optional)"
                                        placeholder="Enter beneficiary email (optional)" variant="outlined"
                                        :rules="[emailOrEmpty]" dense />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.beneficiary_mobile"
                                        label="Beneficiary Mobile (optional)"
                                        placeholder="Enter beneficiary mobile (optional)" prefix="+91"
                                        variant="outlined" :rules="[phoneOrEmpty]" dense />
                                </v-col>
                            </v-row>

                            <!-- Location -->
                            <v-row dense>
                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Location</h3>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.lat" label="Latitude" placeholder="Enter latitude"
                                        variant="outlined" :rules="[req, latRule]" dense />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.long" label="Longitude"
                                        placeholder="Enter longitude" variant="outlined" :rules="[req, lngRule]"
                                        dense />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-window-item>

                <!-- STEP 2: Official Address -->
                <v-window-item :value="2">
                    <v-form ref="formOfficial" v-model="validOfficial">
                        <v-container fluid class="pa-4">
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
                                <v-col cols="6" md="3">
                                    <v-combobox v-model="opincode" :items="opincodeOptions" item-title="pincode"
                                        item-value="pincode" label="Search Pincode"
                                        placeholder="Search your area pincode" density="comfortable" variant="outlined"
                                        return-object :loading="loading" :rules="[req]" @update:search="opinSearch"
                                        dense>
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                                                variant="flat" closable label @click:close="removeSelection(index)" />
                                        </template>
                                    </v-combobox>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.pincode" label="Pincode" placeholder="Auto-filled"
                                        disabled variant="outlined" :rules="[pincodeRule]" dense />
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
                        </v-container>
                    </v-form>
                </v-window-item>

                <!-- STEP 3: Residential & Visitor Address -->
                <v-window-item :value="3">
                    <v-form ref="formResidential" v-model="validResidential">
                        <v-container fluid class="pa-4">
                            <v-row class="mb-4" dense>
                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Residential Address</h3>
                                </v-col>
                                <v-col cols="12">
                                    <v-checkbox v-model="sameAsOfficialResidential" label="Same as Official Address"
                                        @change="copyOfficialToResidential" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.residential_address"
                                        label="Door No / Residential Address"
                                        placeholder="Enter residential door number or address" variant="outlined"
                                        dense />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.res_address1" label="Street Address 1"
                                        placeholder="Enter street address line 1" variant="outlined" dense />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.res_address2" label="Street Address 2"
                                        placeholder="Enter street address line 2" variant="outlined" dense />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.res_address3" label="Landmark"
                                        placeholder="Enter landmark (optional)" variant="outlined" dense />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-combobox v-model="resPincode" :items="respincodeOptions" item-title="pincode"
                                        item-value="pincode" label="Search Pincode"
                                        placeholder="Search your area pincode" density="comfortable" variant="outlined"
                                        return-object :loading="loading" @update:search="respinSearch" dense>
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                                                variant="flat" closable label @click:close="removeSelection(index)" />
                                        </template>
                                    </v-combobox>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.res_pincode" label="Pincode"
                                        placeholder="Auto-filled" disabled variant="outlined" :rules="[pincodeOrEmpty]"
                                        dense />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.res_city" label="City" placeholder="Auto-filled"
                                        disabled variant="outlined" dense />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.res_state" label="State" placeholder="Auto-filled"
                                        disabled variant="outlined" dense />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>

                    <v-form ref="formVisitor" v-model="validVisitor">
                        <v-container fluid class="pa-4">
                            <v-row class="mb-4" dense>
                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Visitor Address</h3>
                                </v-col>
                                <v-col cols="12">
                                    <v-checkbox v-model="sameAsOfficialVisitor" label="Same as Official Address"
                                        @change="copyOfficialToVisitor" />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.visitor_address" label="Door No / Visitor Address"
                                        placeholder="Enter visitor door number or address" variant="outlined" dense />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model.trim="form.v_address1" label="Street Address 1"
                                        placeholder="Enter street address line 1" variant="outlined" dense />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model.trim="form.v_address2" label="Street Address 2"
                                        placeholder="Enter street address line 2" variant="outlined" dense />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model.trim="form.v_address3" label="Landmark"
                                        placeholder="Enter landmark (optional)" variant="outlined" dense />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-combobox v-model="vPincode" :items="vpincodeOptions" item-title="pincode"
                                        item-value="pincode" label="Search Pincode"
                                        placeholder="Search your area pincode" density="comfortable" variant="outlined"
                                        return-object :loading="loading" @update:search="vpinSearch" dense>
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip v-if="item === Object(item)" :text="item.raw.pincode" size="small"
                                                variant="flat" closable label @click:close="removeSelection(index)" />
                                        </template>
                                    </v-combobox>
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.v_pincode" label="Pincode"
                                        placeholder="Auto-filled" variant="outlined" :rules="[pincodeOrEmpty]" dense />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.v_city" label="City" placeholder="Auto-filled"
                                        variant="outlined" dense />
                                </v-col>
                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.v_state" label="State" placeholder="Auto-filled"
                                        variant="outlined" dense />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-window-item>

                <!-- STEP 4: PAN Verification -->
                <v-window-item :value="4">
                    <v-container fluid class="pa-4">
                        <v-row>
                            <!-- Form Column -->
                            <v-col cols="12" md="6">
                                <h3 class="text-h6 font-weight-bold mb-3">PAN Verification</h3>
                                <p class="mb-4">Please enter your PAN details as per your card.</p>

                                <v-form ref="formPan" v-model="validPan" class="pa-0">
                                    <v-text-field v-model="pannum" label="PAN Number *"
                                        placeholder="Enter your 10-character PAN" variant="outlined" dense
                                        maxlength="10" required :rules="[req]" @input="pannum = pannum.toUpperCase()" />
                                    <v-text-field v-model="panholdername" label="PAN Card Name *"
                                        placeholder="Enter your full name as on PAN" variant="outlined" dense
                                        class="mt-4" maxlength="30" :rules="[req]" />
                                    <v-text-field v-model="fathername" label="Father's Name *"
                                        placeholder="Enter your father's full name" variant="outlined" dense
                                        class="mt-4" maxlength="30" :rules="[req]" />
                                    <v-text-field v-model="form.dob" label="Date of Birth" placeholder="DD-MM-YYYY"
                                        variant="outlined" dense type="date" class="mt-4" :rules="[req, dobPastRule]" />
                                </v-form>
                            </v-col>

                            <!-- PAN Card Guide Column -->
                            <v-col class="d-flex align-center" cols="12" md="6">
                                <v-card class="pa-8 bg-black" outlined>
                                    <h4 class="text-title-1 font-weight-bold mb-3 text-white">
                                        How to find your PAN details?
                                    </h4>
                                    <v-list class="bg-black" dense>
                                        <div class="d-flex align-center mb-3">
                                            <v-icon color="primary" class="me-2"
                                                size="24">mdi-information-outline</v-icon>
                                            <div class="text-white" style="white-space: normal;">
                                                Your Permanent Account Number (PAN) is a ten-character alphanumeric
                                                identifier.
                                            </div>
                                        </div>

                                        <div class="d-flex align-center mb-3">
                                            <v-icon color="primary" class="me-2"
                                                size="24">mdi-information-outline</v-icon>
                                            <div class="text-white" style="white-space: normal;">
                                                Ensure the name on the PAN card exactly matches your official documents.
                                            </div>
                                        </div>

                                        <div class="d-flex align-center">
                                            <v-icon color="primary" class="me-2"
                                                size="24">mdi-information-outline</v-icon>
                                            <div class="text-white" style="white-space: normal;">
                                                You can find your PAN details on the PAN card issued by NSDL or UTIITSL.
                                            </div>
                                        </div>
                                    </v-list>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-window-item>

                <!-- STEP 5: Account Verification -->
                <v-window-item :value="5">
                    <v-container fluid class="pa-4">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-card class="pa-8" outlined>
                                    <h3 class="text-h6 font-weight-bold mb-3">Account Verification</h3>
                                    <p class="mb-4">Please enter your bank account details carefully.</p>

                                    <v-form ref="formAccount" v-model="validAccount" class="pa-0">
                                        <v-text-field v-model="accountname" label="Account Holder Name *"
                                            placeholder="Enter account holder name" variant="outlined" dense
                                            maxlength="200" :rules="[req]" />
                                        <v-text-field v-model="accountnumber" label="Account Number *"
                                            placeholder="Enter account number" variant="outlined" dense type="number"
                                            maxlength="20" class="mt-4" :rules="[req, accNumberRule]" />
                                        <v-text-field v-model="ifsccode" label="Branch IFSC *"
                                            placeholder="Ex: HDFC0001234" variant="outlined" dense maxlength="65"
                                            class="mt-4" @input="ifsccode = ifsccode.toUpperCase()"
                                            :rules="[req, ifscRule]" />
                                        <v-autocomplete v-model="accounttype" label="Account Type *"
                                            placeholder="Select account type" variant="outlined" dense class="mt-4"
                                            :items="account_type" item-text="name" item-value="id" return-object
                                            :rules="[req]" />
                                    </v-form>
                                </v-card>
                            </v-col>

                            <v-col class="d-flex align-center" cols="12" md="6">
                                <v-card class="pa-8 bg-black" outlined>
                                    <h4 class="text-title-1 font-weight-bold mb-3 text-white">
                                        How to enter your account details?
                                    </h4>
                                    <v-list class="bg-black" dense>
                                        <div class="d-flex align-center mb-3">
                                            <v-icon color="primary" class="me-2"
                                                size="24">mdi-information-outline</v-icon>
                                            <div class="text-white" style="white-space: normal;">
                                                Ensure the account number matches exactly with your bank records.
                                            </div>
                                        </div>

                                        <div class="d-flex align-center mb-3">
                                            <v-icon color="primary" class="me-2"
                                                size="24">mdi-information-outline</v-icon>
                                            <div class="text-white" style="white-space: normal;">
                                                The IFSC code is required for electronic transactions (NEFT/RTGS/IMPS).
                                            </div>
                                        </div>

                                        <div class="d-flex align-center">
                                            <v-icon color="primary" class="me-2"
                                                size="24">mdi-information-outline</v-icon>
                                            <div class="text-white" style="white-space: normal;">
                                                Select the correct account type (Savings/Current) as per your bank.
                                            </div>
                                        </div>
                                    </v-list>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-window-item>

                <v-window-item :value="6">
                    <v-container fluid class="pa-4">
                        <h3 class="text-h6 font-weight-bold mb-4">Image Verification</h3>
                        <p class="mb-6">Please upload the required documents for verification.</p>

                        <v-row dense>
                            <!-- PAN Image -->
                            <v-col cols="12" md="6">
                                <v-card outlined class="pa-4 mb-4">
                                    <div class="d-flex justify-space-between align-center mb-3">
                                        <div class="font-weight-medium">Upload PAN Image</div>
                                        <span v-if="panUrl" class="text-green">Uploaded</span>
                                        <span v-else class="text-orange">Pending</span>
                                    </div>

                                    <v-img v-if="panUrl" :src="panUrl" contain height="200" class="mb-3" />
                                    <v-btn v-else color="blue" block @click="uploadPhoto('63_Pan_Card_front')">
                                        Upload
                                    </v-btn>
                                </v-card>
                            </v-col>

                            <!-- Aadhar Front -->
                            <v-col cols="12" md="6">
                                <v-card outlined class="pa-4 mb-4">
                                    <div class="d-flex justify-space-between align-center mb-3">
                                        <div class="font-weight-medium">Upload Aadhar Front Image</div>
                                        <span v-if="AadharFrontUrl" class="text-green">Uploaded</span>
                                        <span v-else class="text-orange">Pending</span>
                                    </div>

                                    <v-img v-if="AadharFrontUrl" :src="AadharFrontUrl" contain height="200"
                                        class="mb-3" />
                                    <v-btn v-else color="blue" block @click="uploadPhoto('55_Aadhar_Card_front')">
                                        Upload
                                    </v-btn>
                                </v-card>
                            </v-col>

                            <!-- Aadhar Back -->
                            <v-col cols="12" md="6">
                                <v-card outlined class="pa-4 mb-4">
                                    <div class="d-flex justify-space-between align-center mb-3">
                                        <div class="font-weight-medium">Upload Aadhar Back Image</div>
                                        <span v-if="AadharBackUrl" class="text-green">Uploaded</span>
                                        <span v-else class="text-orange">Pending</span>
                                    </div>

                                    <v-img v-if="AadharBackUrl" :src="AadharBackUrl" contain height="200"
                                        class="mb-3" />
                                    <v-btn v-else color="blue" block @click="uploadPhoto('55_Aadhar_Card_back')">
                                        Upload
                                    </v-btn>
                                </v-card>
                            </v-col>

                            <!-- Store Image -->
                            <v-col cols="12" md="6">
                                <v-card outlined class="pa-4 mb-4">
                                    <div class="d-flex justify-space-between align-center mb-3">
                                        <div class="font-weight-medium">Upload Store Image</div>
                                        <span v-if="STOREURL" class="text-green">Uploaded</span>
                                        <span v-else class="text-orange">Pending</span>
                                    </div>

                                    <v-img v-if="STOREURL" :src="STOREURL" contain height="200" class="mb-3" />
                                    <v-btn v-else color="blue" block @click="uploadPhoto('999_STORE_1')">
                                        Upload
                                    </v-btn>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-window-item>
            </v-window>

            <!-- Footer -->
            <v-divider />
            <v-footer app>
                <v-btn variant="tonal" :disabled="step === 1" @click="prev">Back</v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="step < steps.length" color="primary" @click="next">Next</v-btn>
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

const { getuserOnboarding, verifyPan, verifyAccount, onboading } = useAggregatorApi()

const { MCCSearch, businessTurnOver, businessType, pincodeSearch } = useOnboadingApi();
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
    { key: "register", label: "Register" },
    { key: "business", label: "Business" },
    { key: "official", label: "Official Address" },
    { key: "residential", label: "Residential" },
    { key: "pan", label: "PAN Verification" },
    { key: "account", label: "Account Verification" },
];
const step = ref(1);
const prev = () => (step.value = Math.max(1, step.value - 1));

const uploadedDocs = ref([]);

// Form state
const form = reactive({
    password: "",
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

const passwordRule = v =>
    (!!v && v.length >= 8) || "Password must be at least 8 characters";

const passwordOrEmpty = v =>
    !v || (v.length >= 8) || "Password must be at least 8 characters";

const pincodeRule = v => pincode6(v) || "6-digit pincode";
const pincodeOrEmpty = v => !v || pincode6(v) || "6-digit pincode";
const latRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -90 && Number(v) <= 90) || "Lat -90 to 90";
const lngRule = v => v === "" || v === null || v === undefined ? true : (Number(v) >= -180 && Number(v) <= 180) || "Lng -180 to 180";

// Step validation refs
const formBusiness = ref(), formReg = ref(), formOfficial = ref(), formResidential = ref(), formVisitor = ref();
const validBusiness = ref(false), validOfficial = ref(false), validResidential = ref(false), validVisitor = ref(false);

async function uploadPhoto(docType) {
    try {
        const res = await takePhoto(docType);
        if (res.statusCode === "00" && res.data.length > 0) {
            const fileData = res.data[0];

            uploadedDocs.value.push({
                id: fileData.id,
                filename: fileData.filename,
                url: fileData.url
            });

            if (docType.includes("Pan")) panUrl.value = fileData.url;
            if (docType.includes("Aadhar_Card_front")) AadharFrontUrl.value = fileData.url;
            if (docType.includes("Aadhar_Card_back")) AadharBackUrl.value = fileData.url;
            if (docType.includes("STORE")) STOREURL.value = fileData.url;
        }
    } catch (err) {
        console.error("Upload failed", err);
    }
}

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

    if (clone.website) {
        clone.website = clone.website.startsWith("http")
            ? clone.website
            : `https://${clone.website}`;
    }

    if (clone){
        clone.mobile_number = clone.primary_mobile;
        clone.phone = clone.mobile_number;
        clone.res_mobile = clone.primary_mobile;
        clone.res_phone_number = clone.primary_mobile;
        clone.v_mobile = clone.primary_mobile;
        clone.v_phone_number = clone.primary_mobile;
    }

    let cloneDob;

    if (clone.dob) {
        const [year, month, day] = clone.dob.split("-");
        cloneDob = `${day}/${month}/${year}`;
    }

    const panData = {
        pan: pannum.value,
        name: panholdername.value,
        fathername: fathername.value,
        dob: cloneDob,
    };

    const accountData = {
        accountNumber: accountnumber.value,
        accountHolderName: accountname.value,
        ifsc: ifsccode.value,
        additionalData: true,
        consent: "Y",
    };

    const imageData = uploadedDocs.value;

    return {
        ...clone,
        pan: panData,
        account: accountData,
        onboardingImages: imageData,
    };
});

async function submit() {
    submitting.value = true;
    try {
        const payload = {
            ...cleanedPayload.value,
            onboardingImages: [...uploadedDocs.value]
        };
        const res = await onboading(payload);
        console.log("onboading response:", res);

        if (res.data.statusCode == "00") {
            snackbar.message = res.data.message;
            snackbar.color = "success";
            snackbar.show = true;
            router.push("/aggregator/merchants");
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
    let formRef;
    switch (step.value) {
        case 1: formRef = formBusiness; break;
        case 2: formRef = formOfficial; break;
        case 3:
            const resValid = await formResidential.value.validate();
            const visitorValid = await formVisitor.value.validate();
            if (!resValid.valid || !visitorValid.valid) return;
            step.value++;
            return;
        case 4: formRef = formPan; break;
        case 5: formRef = formAccount; break;
    }
    if (formRef?.value) {
        const result = await formRef.value.validate();
        if (!result.valid) return;
    }
    step.value++;
};

// Dynamic title
const title = computed(() => {
    switch (step.value) {
        case 1: return "BUSINESS DETAILS";
        case 2: return "OFFICIAL ADDRESS";
        case 3: return "RESIDENTIAL & VISITOR ADDRESS";
        case 4: return "PAN VERIFICATION";
        case 5: return "ACCOUNT VERIFICATION";
        case 6: return "IMAGE UPLOAD";
        default: return "ONBOARDING";
    }
});

// Load initial profile & location
onMounted(async () => {
    await businessTurnOver();
    console.log(turnOverList.value);

    businessType();
});

// MCC & Pincode watchers
watch(uploadedDocs, val => {
    console.log("Uploaded docs updated:", val);
});
watch(mcc, () => { if (mcc.value) { form.nature_of_business = mcc.value.descr; form.mcc = mcc.value.id; } });
watch(opincode, val => { if (!val) return; form.city = val.city; form.state = val.statename; form.pincode = val.pincode; });
watch(resPincode, val => { if (!val) return; form.res_city = val.city; form.res_state = val.statename; form.res_pincode = val.pincode; });
watch(vPincode, val => { if (!val) return; form.v_city = val.city; form.v_state = val.statename; form.v_pincode = val.pincode; });

// async function validateCurrentStep() {
//     const map = { 1: formBusiness, 2: formOfficial, 3: formResidential, 4: null, 5: null, 6: null };
//     const frm = map[step.value]?.value;
//     if (!frm) return true;
//     const ok = await frm.validate();
//     return ok.valid;
// }

const snackbar = reactive({ show: false, message: "", color: "success" });
const loading = ref(false);
</script>