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

            <v-window v-model="step" class="px-2 py-4 pb-4">
                <v-window-item :value="1">
                    <v-form ref="formBusiness" v-model="validBusiness">
                        <v-container fluid class="pa-2">
                            <v-card class="mb-6 border-primary" rounded="lg" elevation="0">
                                <v-card-title class="text-h6 font-weight-bold d-flex align-center">
                                    <v-icon color="primary" class="mr-2">mdi-domain</v-icon>
                                    Merchant Details & Contacts
                                </v-card-title>

                                <v-card-text>
                                    <v-row dense>
                                        <!-- LEGAL NAME -->
                                        <v-col cols="12">
                                            <v-text-field v-model.trim="form.name" label="Merchant Name"
                                                :disabled="disableMerchantInput" placeholder="Merchant Name"
                                                variant="outlined" :rules="[req]" dense />
                                        </v-col>

                                        <!-- PRIMARY EMAIL -->
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="form.primary_email_id"
                                                :disabled="disableMerchantInput" label="Primary Email"
                                                placeholder="example@company.com" variant="outlined"
                                                :rules="[req, emailRule]" prepend-inner-icon="mdi-email-outline"
                                                dense />
                                        </v-col>

                                        <!-- PRIMARY MOBILE -->
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="form.primary_mobile" :disabled="disableMerchantInput"
                                                label="Primary Mobile Number" placeholder="Enter mobile number"
                                                prefix="+91" variant="outlined" :rules="[req, phoneRule]"
                                                prepend-inner-icon="mdi-phone-outline" dense />
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>

                            <!-- OTHER BUSINESS DETAILS -->
                            <v-card class="mb-6" rounded="lg" variant="flat">
                                <v-card-title class="text-h6 font-weight-bold">
                                    Business Details
                                </v-card-title>

                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model.trim="form.legal_name"
                                                :disabled="disableMerchantInput" label="Legal Business Name"
                                                placeholder="Registered business name" variant="outlined" :rules="[req]"
                                                dense />
                                        </v-col>

                                        <!-- DATE OF BIRTH -->
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model="form.dob" label="Business DOB" type="date"
                                                variant="outlined" :rules="[req]" :max="maxDob" />
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-text-field v-model.trim="form.dba_name" label="DBA / Trade Name"
                                                placeholder="Public-facing business name" variant="outlined"
                                                :rules="[req]" dense />
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-combobox v-model="mcc" :items="mccOptions" item-title="descr"
                                                item-value="id" label="Nature of Business"
                                                placeholder="Search or select" clearable variant="outlined"
                                                :loading="loading" :rules="[req]" @update:search="onSearch" dense>
                                                <template #selection="{ item, index }">
                                                    <v-chip v-if="item === Object(item)" :text="item.raw.descr"
                                                        size="small" closable variant="flat"
                                                        @click:close="removeSelection(index)" />
                                                </template>
                                            </v-combobox>
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-autocomplete v-model="form.annual_turn_over" :items="turnOverList.data"
                                                item-title="label" item-value="value" label="Annual Turnover"
                                                placeholder="Select turnover range" variant="outlined" :rules="[req]"
                                                dense />
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>

                            <!-- OPTIONAL CONTACT -->
                            <v-card class="mb-6" rounded="lg" variant="flat">
                                <v-card-title class="text-h6 font-weight-bold">
                                    Beneficiary Contact (Optional)
                                </v-card-title>

                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model.trim="form.beneficiary_email"
                                                label="Beneficiary Email" placeholder="Optional" variant="outlined"
                                                :rules="[emailOrEmpty]" dense />
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-text-field v-model.trim="form.beneficiary_mobile"
                                                label="Beneficiary Mobile" placeholder="Optional" prefix="+91"
                                                variant="outlined" :rules="[phoneOrEmpty]" dense />
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>

                            <!-- LOCATION -->
                            <v-card rounded="lg" variant="flat">
                                <v-card-title class="text-h6 font-weight-bold">
                                    Location
                                </v-card-title>

                                <v-card-text>
                                    <v-row dense>
                                        <v-col cols="12" md="6">
                                            <v-text-field v-model.trim="form.lat" label="Latitude" variant="outlined"
                                                :rules="[req, latRule]" dense />
                                        </v-col>

                                        <v-col cols="12" md="6">
                                            <v-text-field v-model.trim="form.long" label="Longitude" variant="outlined"
                                                :rules="[req, lngRule]" dense />
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>

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
                                        return-object :loading="loading" @update:search="opinSearch" dense>
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

                    <!-- ░░ RESIDENTIAL ADDRESS ░░ -->
                    <v-form ref="formResidential" v-model="validResidential">
                        <v-container fluid class="pa-4">
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
                                    <v-text-field v-model.trim="form.res_state" label="State" variant="outlined" dense
                                        disabled />
                                </v-col>

                            </v-row>
                        </v-container>
                    </v-form>

                    <!-- ░░ VISITOR ADDRESS ░░ -->
                    <v-form ref="formVisitor" v-model="validVisitor">
                        <v-container fluid class="pa-4">
                            <v-row dense>

                                <v-col cols="12">
                                    <h3 class="text-h6 font-weight-bold mb-3">Visitor Address</h3>
                                </v-col>

                                <v-col cols="12">
                                    <v-checkbox v-model="sameAsOfficialVisitor" label="Same as Official Address"
                                        @change="copyOfficialToVisitor" />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field v-model.trim="form.visitor_address" label="Door No / Visitor Address"
                                        variant="outlined" dense :rules="[requiredIf(sameAsOfficialVisitor)]" />
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

                                <v-col cols="6" md="3">
                                    <v-combobox v-model="vPincode" :items="vpincodeOptions" item-title="pincode"
                                        item-value="pincode" label="Search Pincode" variant="outlined" dense
                                        return-object :loading="loading" @update:search="vpinSearch" />
                                </v-col>

                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.v_pincode" label="Pincode" variant="outlined" dense
                                        :rules="[pincodeRule]" />
                                </v-col>

                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.v_city" label="City" variant="outlined" dense />
                                </v-col>

                                <v-col cols="6" md="3">
                                    <v-text-field v-model.trim="form.v_state" label="State" variant="outlined" dense />
                                </v-col>

                            </v-row>
                        </v-container>
                    </v-form>

                </v-window-item>

                <v-window-item :value="4">
                    <v-card class="pa-6" elevation="0">
                        <h3 class="text-h6 font-weight-bold mb-4">
                            Select Business Type
                        </h3>

                        <v-radio-group v-model="selectedBusinessType" column>
                            <v-radio v-for="type in businessTypeList" :key="type.id" :label="type.label"
                                :value="type.value" class="mb-2" />
                        </v-radio-group>

                        <!-- Info Alert -->
                        <v-alert v-if="selectedBusinessType" type="info" variant="tonal" class="mt-4">
                            {{
                                BUSINESS_TYPE_RULES[selectedBusinessType]?.partners > 0
                                    ? `This business requires ${BUSINESS_TYPE_RULES[selectedBusinessType].partners} partners`
                                    : "No partners required"
                            }}
                        </v-alert>
                    </v-card>
                </v-window-item>

                <v-window-item :value="5">
                    <v-card class="pa-4" elevation="0">

                        <div class="mb-6">
                            <h3 class="text-h6 font-weight-bold">
                                Verification Documents
                            </h3>
                            <div class="text-caption text-medium-emphasis">
                                Upload the required documents to complete verification
                            </div>
                        </div>

                        <v-alert v-if="!isComplianceComplete" type="warning" variant="tonal" class="my-4">
                            Please complete all required document categories before submitting.
                        </v-alert>

                        <v-alert v-if="isComplianceComplete" type="info" variant="tonal" class="my-4">
                            You have successfully submitted all required documents. You are ready go onboarding.
                        </v-alert>

                        <v-window v-model="docStep">

                            <v-window-item :value="0">
                                <v-row no-gutters>
                                    <v-col v-for="group in requiredDocs" :key="group.category" cols="6" md="4" lg="3"
                                        class="pa-1 pa-md-3 pa-lg-5">
                                        <v-card class="pa-4 h-100 d-flex flex-column cursor-pointer" color="primary"
                                            elevation="1" rounded="lg" @click="openCategory(group)">
                                            <div class="d-flex justify-space-between ga-2 align-center mb-2">
                                                <div class="text-caption font-weight-bold text-uppercase">
                                                    {{ group.category.replaceAll('_', ' ') }}
                                                </div>

                                                <v-chip size="small" variant="outlined"
                                                    :color="group.compliant ? 'success' : 'red'">
                                                    {{ group.uploaded }} / {{ group.required }}
                                                </v-chip>
                                            </div>

                                            <v-progress-linear :model-value="group.required
                                                ? (group.uploaded / group.required) * 100
                                                : 0" height="4" rounded :color="group.compliant ? 'success' : 'red'" />

                                            <v-spacer />

                                            <div class="text-caption mt-4 font-weight-medium">
                                                Click to manage documents
                                            </div>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <v-window-item :value="1">

                                <div class="d-flex align-center mb-6">
                                    <v-btn icon elevation="0" @click="docStep = 0">
                                        <v-icon>mdi-arrow-left</v-icon>
                                    </v-btn>

                                    <div class="ml-3">
                                        <div class="font-weight-medium">
                                            {{ activeCategory.category.replaceAll('_', ' ') }}
                                        </div>
                                        <div class="text-caption text-medium-emphasis">
                                            Upload all required documents below
                                        </div>
                                    </div>
                                </div>

                                <v-row no-gutters>
                                    <v-col v-for="doc in activeCategory.documents" :key="doc.code"
                                        class="pa-1 pa-md-3 pa-lg-5" cols="6" md="4" lg="3">
                                        <v-card class="pa-4 h-100 d-flex flex-column text-center" color="primary"
                                            elevation="1" rounded="lg">
                                            <v-icon size="24" class="mb-3" :color="doc.uploaded ? 'success' : 'red'">
                                                {{ doc.uploaded ? 'mdi-check-circle-outline' :
                                                    'mdi-alert-circle-outline' }}
                                            </v-icon>

                                            <div class="text-body-2 font-weight-medium mb-1">
                                                {{ doc.name }}
                                            </div>

                                            <v-chip size="x-small" variant="outlined" class="mx-auto"
                                                :color="doc.uploaded ? 'success' : 'red'">
                                                {{ doc.uploaded ? 'Uploaded' : 'Pending' }}
                                            </v-chip>

                                            <v-spacer />

                                            <v-btn size="small" block color="background" class="mt-4 font-weight-bold"
                                                :disabled="doc.uploaded ||
                                                    (
                                                        activeCategory.category !== 'STORE_IMAGE' &&
                                                        activeCategory.uploaded > 0
                                                    )" @click="openDocUpload(doc.code)">

                                                {{ doc.uploaded ? 'Added' : 'Add' }}
                                            </v-btn>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-window-item>

                            <v-window-item :value="2">

                                <div class="d-flex align-center mb-6">
                                    <v-btn icon elevation="0" color="background" @click="docStep = 1">
                                        <v-icon>mdi-arrow-left</v-icon>
                                    </v-btn>

                                    <div class="ml-3">
                                        <div class="font-weight-medium">
                                            Upload {{ activeDocType?.replaceAll('_', ' ') }}
                                        </div>
                                        <div class="text-caption text-medium-emphasis">
                                            Ensure images are clear and readable
                                        </div>
                                    </div>
                                </div>

                                <v-card class="pa-6" color="background" elevation="1" rounded="lg">

                                    <v-text-field v-if="showDocNumber
                                        && activeDocType !== 'BANK_PASSBOOK'
                                    " v-model="docUploads[activeDocType].docNumber" :label="docNumberLabel"
                                        variant="outlined" class="mb-4" :rules="[req]" />

                                    <!-- BANK PASSBOOK FIELDS -->
                                    <div v-if="activeDocType === 'BANK_PASSBOOK'">
                                        <v-text-field v-model="docUploads.BANK_PASSBOOK.settlement.accountHolderName"
                                            label="Account Holder Name" :rules="[req]" />

                                        <v-text-field v-model="docUploads.BANK_PASSBOOK.settlement.accountNumber"
                                            label="Account Number" :rules="[req, accNumberRule]" />

                                        <v-text-field v-model="docUploads.BANK_PASSBOOK.settlement.bankName"
                                            label="Bank Name" :rules="[req]" />

                                        <v-text-field v-model="docUploads.BANK_PASSBOOK.settlement.ifsc"
                                            label="IFSC Code" :rules="[req, ifscRule]" />

                                        <v-select v-model="docUploads.BANK_PASSBOOK.settlement.account_type"
                                            :items="['SAVING', 'CURRENT']" label="Account Type" :rules="[req]" />
                                    </div>

                                    <div
                                        v-if="activeDocType === 'INDIVIDUAL_PAN' || activeDocType === 'PARTNER1_INDIVIDUAL_PAN' || activeDocType === 'PARTNER2_INDIVIDUAL_PAN'">
                                        <v-text-field v-model="docUploads[activeDocType].pan.pan" label="PAN Number"
                                            :rules="[req, panRule]" />

                                        <v-text-field v-model="docUploads[activeDocType].pan.pan_name"
                                            label="PAN Holder Name" :rules="[req]" />

                                        <v-text-field v-model="docUploads[activeDocType].pan.pan_father_name"
                                            label="Father's Name" :rules="[req]" />

                                        <v-text-field v-model="docUploads[activeDocType].pan.pan_dob"
                                            label="Date of Birth" type="date" :rules="[req]" />
                                    </div>

                                    <v-file-input v-model="docUploads[activeDocType].files" multiple chips show-size
                                        accept="image/*" :label="`Upload ${requiredImageCount} image(s)`"
                                        prepend-icon="mdi-cloud-upload-outline" />

                                    <v-alert v-if="docUploads[activeDocType]?.files?.length" type="info" variant="tonal"
                                        class="mt-4">
                                        {{ docUploads[activeDocType].files.length }}
                                        / {{ requiredImageCount }} image(s) selected
                                    </v-alert>

                                    <v-btn block size="large" color="primary" class="mt-6" :disabled="docUploads[activeDocType]?.files?.length !== requiredImageCount ||
                                        (showDocNumber && !docUploads[activeDocType]?.docNumber)
                                        " @click="saveDocUpload">
                                        Save Document
                                    </v-btn>
                                </v-card>
                            </v-window-item>

                        </v-window>
                    </v-card>
                </v-window-item>
            </v-window>

            <!-- Footer -->
            <v-divider />
            <v-footer app>
                <v-btn variant="tonal" :disabled="step === 1" @click="prev">Back</v-btn>
                <v-spacer></v-spacer>
                <v-btn v-if="step < steps.length" color="primary" @click="next">Next</v-btn>
                <v-btn v-else color="primary" :disabled="!isComplianceComplete" @click="submit"
                    :loading="submitting">Submit</v-btn>
            </v-footer>
        </v-card>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.message }}</v-snackbar>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps, computed, watch, onMounted } from "vue";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useUsersApi } from "@/composables/apis/useUsersApi";
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
    onboading,
    updateMerchant } = useOnboadingApi();
const { addMerchant } = useUsersApi();
const Onboarding = useOnboardingStore();
const { turnOverList, businessTypeList } = storeToRefs(Onboarding);
const router = useRouter();

const activeMerchant = ref("")
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

const props = defineProps({ merchantId: String });

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

// <div v-for="(docs, category) in requiredDocumentsByCategory" :key="category">
//   <h4>{{ category }}</h4>

//   <v-chip
//     v-for="doc in docs"
//     :key="doc"
//     class="ma-1"
//   >
//     {{ doc }}
//   </v-chip>
// </div>

const { $native } = useNuxtApp();

const selectedBusinessType = ref(null)
const activeDoc = ref(null)

const disableMerchantInput = ref(false)

const accNumberRule = (v) =>
    /^[0-9]*$/.test(v) || "Account number must contain only digits";

const ifscRule = (v) =>
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v?.toUpperCase()) || "Invalid IFSC code";

function toggleDoc(doc) {
    activeDoc.value = activeDoc.value === doc ? null : doc
}

const getMerchant = async (id) => {
    try {
        const res = await getMerchantById(id);
        // Object.assign(merchantForm, res.data || {});
        console.log("Merchant from the props", res.data);

        form.legal_name = res.data.legal_name
        form.name = res.data.user?.name
        form.primary_email_id = res.data.user?.email
        form.primary_mobile = res.data.user?.mobile_no

        disableMerchantInput.value = true

    } catch (e) {
        console.error("Failed to fetch merchant:", e);
    }
};

const DOC_RULES = {
    DEFAULT: {
        label: "Document Number",
        images: 1,
        requiresNumber: false,

        buildPayload: (doc, imageIds, docType) => {
            const now = new Date();

            const docNumber =
                now.getFullYear().toString() +
                String(now.getMonth() + 1).padStart(2, "0") +
                String(now.getDate()).padStart(2, "0") +
                String(now.getHours()).padStart(2, "0") +
                String(now.getMinutes()).padStart(2, "0") +
                String(now.getSeconds()).padStart(2, "0");

            return {
                doc_type: docType,
                doc_number: docNumber,
                images: imageIds
            };
        }
    },

    AADHAAR: {
        label: "Aadhaar Number",
        images: 2,
        requiresNumber: true,

        buildPayload: (doc, imageIds, docType = "AADHAAR") => ({
            doc_type: docType,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER1_AADHAAR: {
        label: "Aadhaar Number",
        images: 2,
        requiresNumber: true,

        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER1_AADHAAR",
            partner: 1,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER2_AADHAAR: {
        label: "Aadhaar Number",
        images: 2,
        requiresNumber: true,

        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER2_AADHAAR",
            partner: 2,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    DRIVING_LICENSE: {
        label: "Driving License Number",
        images: 1,
        requiresNumber: true,

        buildPayload: (doc, imageIds, docType = "DRIVING_LICENSE") => ({
            doc_type: docType,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER1_DRIVING_LICENSE: {
        label: "Driving License Number",
        images: 1,
        requiresNumber: true,
        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER1_DRIVING_LICENSE",
            partner: 1,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER2_DRIVING_LICENSE: {
        label: "Driving License Number",
        images: 1,
        requiresNumber: true,
        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER2_DRIVING_LICENSE",
            partner: 2,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    VOTER_ID: {
        label: "Voter ID Number",
        images: 1,
        requiresNumber: true,

        buildPayload: (doc, imageIds, docType = "VOTER_ID") => ({
            doc_type: docType,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER1_VOTER_ID: {
        label: "Voter ID Number",
        images: 1,
        requiresNumber: true,
        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER1_VOTER_ID",
            partner: 1,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER2_VOTER_ID: {
        label: "Voter ID Number",
        images: 1,
        requiresNumber: true,
        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER2_VOTER_ID",
            partner: 2,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PASSPORT: {
        label: "Passport Number",
        images: 1,
        requiresNumber: true,

        buildPayload: (doc, imageIds, docType = "PASSPORT") => ({
            doc_type: docType,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER1_PASSPORT: {
        label: "Passport Number",
        images: 1,
        requiresNumber: true,
        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER1_PASSPORT",
            partner: 1,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    PARTNER2_PASSPORT: {
        label: "Passport Number",
        images: 1,
        requiresNumber: true,
        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER2_PASSPORT",
            partner: 2,
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    INDIVIDUAL_PAN: {
        label: "PAN Number",
        images: 1,
        requiresNumber: false,

        formSchema: {
            pan: {
                pan: "",
                pan_name: "",
                pan_dob: "",
                pan_father_name: ""
            }
        },

        buildPayload: (doc, imageIds, docType = "INDIVIDUAL_PAN") => ({
            doc_type: docType,
            doc_number: doc.pan.pan,
            pan: { ...doc.pan },
            images: imageIds
        })
    },

    PARTNER1_INDIVIDUAL_PAN: {
        label: "PAN Number",
        images: 1,
        requiresNumber: false,


        formSchema: {
            pan: {
                pan: "",
                pan_name: "",
                pan_dob: "",
                pan_father_name: ""
            }
        },

        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER1_INDIVIDUAL_PAN",
            partner: 1,
            doc_number: doc.pan.pan,
            pan: { ...doc.pan, partner: true },
            images: imageIds
        })
    },

    PARTNER2_INDIVIDUAL_PAN: {
        label: "PAN Number",
        images: 1,
        requiresNumber: false,


        formSchema: {
            pan: {
                pan: "",
                pan_name: "",
                pan_dob: "",
                pan_father_name: ""
            }
        },

        buildPayload: (doc, imageIds) => ({
            doc_type: "PARTNER2_INDIVIDUAL_PAN",
            partner: 2,
            doc_number: doc.pan.pan,
            pan: { ...doc.pan, partner: true },
            images: imageIds
        })
    },

    BANK_PASSBOOK: {
        label: "Bank Account Number",
        images: 1,
        requiresNumber: false,

        formSchema: {
            settlement: {
                accountHolderName: "",
                account_type: "",
                bankName: "",
                accountNumber: "",
                ifsc: "",
                consent: "Y",
                additionalData: true
            }
        },

        buildPayload: (doc, imageIds) => ({
            doc_type: "BANK_PASSBOOK",
            doc_number: doc.settlement.accountNumber,
            settlement: { ...doc.settlement },
            images: imageIds
        })
    },

    INDOOR_STORE_IMAGE: {
        label: null,
        images: 1,
        requiresNumber: false,

        buildPayload: (doc, imageIds) => ({
            doc_type: "INDOOR_STORE_IMAGE",
            doc_number: doc.docNumber,
            images: imageIds
        })
    },

    OUTDOOR_STORE_IMAGE: {
        label: null,
        images: 1,
        requiresNumber: false,

        buildPayload: (doc, imageIds) => ({
            doc_type: "OUTDOOR_STORE_IMAGE",
            doc_number: doc.docNumber,
            images: imageIds
        })
    }
}

const incompleteCategories = computed(() => {
    if (!complianceResponse.value?.categories) return []
    return complianceResponse.value.categories.filter(
        cat => cat.uploaded === 0 || cat.missing > 0
    )
})

const activeDocRule = computed(() => {
    return DOC_RULES[activeDocType.value] || {
        label: "Document Number",
        images: 1,
        requiresNumber: false
    }
})

const showDocNumber = computed(() => activeDocRule.value.requiresNumber)

const docNumberLabel = computed(() => activeDocRule.value.label)

const requiredImageCount = computed(() => activeDocRule.value.images)

const complianceList = ref([]);
const complianceResponse = ref(null)

const BUSINESS_TYPE_RULES = computed(() => {
    const rules = {}

    complianceList.value.forEach(bt => {
        const categories = bt.categories || []

        const hasPartnerDocs = categories.some(
            c => c.category === 'PARTNER_DOCS'
        )

        const hasBusinessPan = categories.some(
            c => c.category === 'BUSINESS_PAN'
        )

        const documentsByCategory = {}

        categories.forEach(category => {
            documentsByCategory[category.category] = (category.documents || []).map(
                doc => doc.code
            )
        })

        rules[bt.type] = {
            partners: hasPartnerDocs ? 2 : 0,
            requireBusinessPan: hasBusinessPan,
            documentsByCategory
        }
    })

    return rules
})

const requiresPartners = computed(() => {
    if (!selectedBusinessType.value) return 0
    return BUSINESS_TYPE_RULES.value[selectedBusinessType.value]?.partners || 0
})

const requiredDocumentsByCategory = computed(() => {
    if (!selectedBusinessType.value) return {}
    return (
        BUSINESS_TYPE_RULES.value[selectedBusinessType.value]?.documentsByCategory ||
        {}
    )
})

const isBusinessPan = computed(() => {
    if (!selectedBusinessType.value) return false
    return BUSINESS_TYPE_RULES.value[selectedBusinessType.value]?.requireBusinessPan
})

function isUploaded(doc) {
    return doc.uploaded === true
}

const isStoreImageCategory = (category) =>
    category === 'STORE_IMAGE'


const requiredDocs = computed(() => {
    if (!complianceResponse.value?.categories) return []

    return complianceResponse.value.categories.map(cat => {
        const uploadedCount = (cat.documents || []).filter(d => d.uploaded).length
        const isStoreImage = isStoreImageCategory(cat.category)

        const required = isStoreImage
            ? cat.documents.length
            : 1

        const uploaded = uploadedCount

        const compliant = isStoreImage
            ? uploadedCount === cat.documents.length
            : uploadedCount > 0

        const missing = isStoreImage
            ? Math.max(cat.documents.length - uploadedCount, 0)
            : compliant ? 0 : 1

        return {
            category: cat.category,
            documents: cat.documents,
            required,
            uploaded,
            missing,
            compliant
        }
    })
})

const isComplianceComplete = computed(() => {
    return requiredDocs.value.every(cat => cat.compliant)
})

const documents = reactive({
    BUSINESS_PAN: null,

    INDIVIDUAL_ID: {
        selected: null,
        files: {}
    },

    PARTNERS: []
})

function addPartner() {
    documents.PARTNERS.push({
        pan: null,
        identity: null
    })
}

async function takePartnerDoc(index, type) {
    const res = await takePhoto(`PARTNER_${index}_${type}`)
    if (res?.statusCode === '00' && res.data?.length) {
        documents.PARTNERS[index][type.toLowerCase()] = res.data[0]
        uploadedDocs.value.push(res.data[0])
    }
}

const steps = [
    { key: "business", label: "Business Details" },
    { key: "official", label: "Official Address" },
    { key: "residential", label: "Address Details" },
    { key: "business-type", label: "Business Type" },
    { key: "documents", label: "Documents" },
]

const docStep = ref(0)
const activeCategory = ref(null)

function openCategory(group) {
    activeCategory.value = group
    docStep.value = 1
}

const activeDocType = ref(null)

const docUploads = reactive({
    // AADHAAR: { files: [], docNumber: '', imageIds: [] }
})

function openDocUpload(doc) {
    activeDocType.value = doc
    docStep.value = 2

    const rule = DOC_RULES[doc]

    docUploads[doc] = {
        files: [],
        docNumber: '',
        imageIds: [],
        ...(rule?.formSchema
            ? JSON.parse(JSON.stringify(rule.formSchema))
            : {})
    }
}

async function saveDocUpload() {
    const doc = docUploads[activeDocType.value]
    const rule = DOC_RULES[activeDocType.value] || DOC_RULES.DEFAULT

    if (doc.files.length !== rule.images) {
        snackbar.message = `Please upload exactly ${rule.images} image(s)`
        snackbar.color = "error"
        snackbar.show = true
        return
    }

    if (!rule.requiresNumber) {
        doc.docNumber = `${activeDocType.value}_${Date.now()}`
    }

    doc.imageIds = []

    for (const file of doc.files) {
        const res = await uploadDoc(file, {
            filename: `${activeDocType.value}_${file.name}`
        })

        if (res?.data?.statusCode === "00") {
            doc.imageIds.push(res.data.data.id)
        }
    }

    const payload = rule.buildPayload(doc, doc.imageIds, activeDocType.value)
    const res = await complianceInit(payload, activeMerchant.value.id)

    if (res?.data?.statusCode === "00") {
        const status = await complianceStatus(activeMerchant.value.id)
        if (status?.data?.statusCode === "00") {
            complianceResponse.value = status.data
        }
    }

    doc.files = []

    snackbar.message = "Document uploaded successfully"
    snackbar.color = "success"
    snackbar.show = true

    docStep.value = 0
}

const showSuccess = ref(false);

function pick(obj, keys) {
    const out = {};
    keys.forEach((k) => (out[k] = obj[k]));
    return JSON.stringify(out, null, 2);
}

const title = computed(() => {
    switch (step.value) {
        case 1: return "BUSINESS DETAILS"
        case 2: return "OFFICIAL ADDRESS"
        case 3: return "ADDRESS DETAILS"
        case 4: return "DOCUMENT UPLOAD"
        case 5: return "BUSINESS TYPE"
        default: return "ONBOARDING"
    }
})

const step = ref(1);
const prev = () => (step.value = Math.max(1, step.value - 1));

const uploadedDocs = ref([]);

// Form state
const form = reactive({
    legal_name: "", name: "", dba_name: null, dob: "", primary_email_id: "", primary_mobile: "", mobile_number: "",
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

const required = v => !!v || 'This field is required'

const requiredIf = condition => v =>
    condition || !!v || 'This field is required'

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

    if (clone) {
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
        const res = await onboading(payload, activeMerchant.value.id);
        console.log("onboading response:", res);

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
        const res = await formBusiness.value.validate()
        if (!res.valid) return

        const payload = {
            name: form.name,
            email: form.primary_email_id,
            mobile_no: form.primary_mobile,
            role: "merchant",
            interface: "MOS",
        }

        const user_merchant = await addMerchant(payload)

        console.log("Add Merchant Response", user_merchant)

        if (user_merchant?.statusCode === "00") {

            form.legal_name = user_merchant?.data?.merchant.legal_name
            form.name = user_merchant?.data?.user.name
            form.primary_email_id = user_merchant?.data?.user?.email
            form.primary_mobile = user_merchant?.data?.user?.mobile_no

            activeMerchant.value = user_merchant?.data?.merchant

        } else if (user_merchant?.statusCode === "10") {
            const merchantInfo = user_merchant?.data?.merchant?.merchantinfo
            const address = user_merchant?.data?.merchant?.address

            form.dba_name = merchantInfo?.dba_name || null
            form.mobile_number = merchantInfo?.mobile_number || ""
            form.phone = merchantInfo?.phone || ""

            form.gender = merchantInfo?.gender || ""
            form.lat = merchantInfo?.lat || ""
            form.long = merchantInfo?.long || ""
            form.nature_of_business = merchantInfo?.nature_of_business || null
            form.business_type = merchantInfo?.business_type || null

            selectedBusinessType.value = merchantInfo?.business_type || null

            form.mcc = merchantInfo?.mcc || ""
            form.std_code = merchantInfo?.std_code || "091"
            form.lead_source = merchantInfo?.lead_source || "BUCKSBOX"
            form.lg_code = merchantInfo?.lg_code || ""
            form.annual_turn_over = merchantInfo?.annual_turn_over || null
            form.website = merchantInfo?.website || ""

            form.beneficiary_email = merchantInfo?.beneficiary_email || ""
            form.beneficiary_mobile = merchantInfo?.beneficiary_mobile || ""

            if (address) {
                form.official_address = address?.official_address || ""
                form.address1 = address?.address1 || ""
                form.address2 = address?.address2 || ""
                form.address3 = address?.address3 || ""
                form.city = address?.city || ""
                form.state = address?.state || ""
                form.pincode = address?.pincode || ""
                form.phone = address?.phone || ""
            }

            if (address) {
                form.residential_address = address?.residential_address || ""
                form.res_address1 = address?.res_address1 || ""
                form.res_address2 = address?.res_address2 || ""
                form.res_address3 = address?.res_address3 || ""
                form.res_mobile = address?.res_mobile || ""
                form.res_phone_number = address?.res_phone_number || ""
                form.res_city = address?.res_city || ""
                form.res_state = address?.res_state || ""
                form.res_pincode = address?.res_pincode || ""
            }

            if (address) {
                form.vister_address = address?.vister_address || ""
                form.v_address1 = address?.v_address1 || ""
                form.v_address2 = address?.v_address2 || ""
                form.v_address3 = address?.v_address3 || ""
                form.v_mobile = address?.v_mobile || ""
                form.v_phone_number = address?.v_phone_number || ""
                form.v_city = address?.v_city || ""
                form.v_state = address?.v_state || ""
                form.v_pincode = address?.v_pincode || ""
            }

            activeMerchant.value = user_merchant?.data?.merchant

            snackbar.message =
                user_merchant?.message || "Incomplete merchant onboarding"
            snackbar.color = "error"
            snackbar.show = true
        } else {
            snackbar.message = user_merchant?.message || "Unable to create merchant"
            snackbar.color = "error"
            snackbar.show = true
            return
        }

        console.log("Active Merchant after creation:", activeMerchant.value);
    }

    if (step.value === 2) {
        const res = await formOfficial.value.validate()
        if (!res.valid) return
    }

    if (step.value === 3) {
        const res1 = await formResidential.value.validate()
        const res2 = await formVisitor.value.validate()

        if (!res1.valid || !res2.valid) return
    }

    if (step.value === 4) {
        if (!selectedBusinessType.value) {
            snackbar.message = "Please select a business type"
            snackbar.color = "error"
            snackbar.show = true
            return
        }

        form.business_type = selectedBusinessType.value

        console.log("Active Merchant before update:", activeMerchant.value);

        const payload = {
            businessTypeCode: selectedBusinessType.value,
            merchantId: activeMerchant.value.id
        }

        const res = await updateMerchant(payload)
        console.log("Update Merchant Response", res)

        if (res?.success === true) {
            const merchantId = activeMerchant.value.id
            const res = await complianceStatus(merchantId)
            console.log("Get Compliance Status Response", res)

            if (res?.data.statusCode !== "00") {
                snackbar.message = res.message || ""
                snackbar.color = "error"
                snackbar.show = true
                return
            } else {
                complianceResponse.value = res.data
            }
        } else {
            snackbar.message = res.message || ""
            snackbar.color = "error"
            snackbar.show = true
            return
        }
    }

    if (step.value === 5) {

        if (isBusinessPan.value && !documents.BUSINESS_PAN) {
            snackbar.message = "Business PAN is required"
            snackbar.color = "error"
            snackbar.show = true
            return
        }

        if (
            requiredDocumentsByCategory.value.INDIVIDUAL_DOCS &&
            !documents.INDIVIDUAL_ID.selected
        ) {
            snackbar.message = "Upload one identity document"
            snackbar.color = "error"
            snackbar.show = true
            return
        }

        if (
            requiresPartners.value > 0 &&
            documents.PARTNERS.length < requiresPartners.value
        ) {
            snackbar.message = `Add ${requiresPartners.value} partners`
            snackbar.color = "error"
            snackbar.show = true
            return
        }
    }

    step.value++
}

onMounted(async () => {
    if (props.merchantId) {
        getMerchant(props.merchantId);
    }
    businessTurnOver();
    businessType();

    const res = await fetchCompliance();
    if (res) {
        complianceList.value = res;
    }

});

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