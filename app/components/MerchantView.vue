<template>
    <v-container class="py-6" v-if="merchantForm && merchantForm.id">
        <!-- HEADER SUMMARY CARD -->
        <v-card class="pa-5 mb-6" elevation="2" rounded="lg">
            <div class="d-flex align-center justify-space-between mb-3">
                <div class="text-h6 font-weight-bold">
                    {{ merchantForm.legal_name }}
                    <v-chip class="ml-2" size="small" color="blue" text-color="white">
                        {{ merchantForm.mstatus }}
                    </v-chip>
                </div>
            </div>

            <v-divider class="mb-4"></v-divider>

            <v-row>
                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">App ID</div>
                    <div class="font-weight-medium">{{ merchantForm.appid }}</div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Merchant ID</div>
                    <div class="font-weight-medium">{{ merchantForm.id }}</div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">MID</div>
                    <div class="font-weight-medium">{{ merchantForm.mid }}</div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Interface</div>
                    <div class="font-weight-medium">{{ merchantForm.interface }}</div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Aggregator</div>
                    <div class="font-weight-medium">
                        {{ merchantForm.aggregator?.name || "—" }}
                    </div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Aggregator Code</div>
                    <div class="font-weight-medium">
                        {{ merchantForm.aggregator?.code || "—" }}
                    </div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Risk Flag</div>
                    <div class="font-weight-medium">{{ merchantForm.riskflag }}</div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Status</div>
                    <v-chip :color="merchantForm.status ? 'green' : 'red'" text-color="white" size="small">
                        {{ merchantForm.status ? "Active" : "Inactive" }}
                    </v-chip>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Created At</div>
                    <div>{{ formatDate(merchantForm.createdAt) }}</div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="text-caption text-grey">Verified At</div>
                    <div>{{ formatDate(merchantForm.verifiedAt) }}</div>
                </v-col>
            </v-row>
        </v-card>

        <!-- TABS -->
        <v-tabs v-model="tab" background-color="white" grow>
            <v-tab value="info">Merchant Info</v-tab>
            <v-tab value="transactions">Transactions</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <div v-if="tab === 'info'">
                <v-card class="pa-4 mb-4" elevation="1">
                    <div class="d-flex justify-space-between align-center mb-3">
                        <h3 class="text-subtitle-1 font-weight-bold mb-0">Merchant Info</h3>
                        <v-btn variant="text" prepend-icon="mdi-pencil" @click="toggleEdit('contact')">
                            Edit
                        </v-btn>
                    </div>
                    <v-divider class="mb-4"></v-divider>

                    <v-row>
                        <!-- Merchant Info Display -->
                        <template v-if="!editMode.contact">
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Legal Name</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.legal_name }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Merchant ID</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.dba_name }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">MID (Email)</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.beneficiary_email }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">MID (Mobile)</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.beneficiary_mobile }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">DOB</div>
                                <div class="font-weight-medium">{{ formatDate(merchantForm.merchantinfo.dob) }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Latitude</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.lat }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Longitude</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.long }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Nature of Business</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.nature_of_business }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Primary Email</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.primary_email_id }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Primary Mobile</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.primary_mobile }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">MCC</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantinfo.mcc }}</div>
                            </v-col>

                            <!-- GST Fields Display -->
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">GSTIN</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantgst?.gstin || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Business Name</div>
                                <div class="font-weight-medium">{{ merchantForm.merchantgst?.business_name || "—" }}
                                </div>
                            </v-col>
                        </template>

                        <!-- Merchant Info Edit -->
                        <template v-else>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.legal_name" label="Legal Name"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.dba_name" label="Merchant ID"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.primary_email_id" label="Primary Email"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.primary_mobile" label="Primary Mobile"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.dob" label="DOB" type="date"
                                    density="compact" variant="outlined" />

                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.lat" label="Latitude" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.long" label="Longitude"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.nature_of_business"
                                    label="Nature of Business" density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.mcc" label="MCC" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.annual_turn_over"
                                    label="Annual Turnover" density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.beneficiary_email" label="MID (Email)"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantinfo.beneficiary_mobile"
                                    label="MID (Mobile)" density="compact" variant="outlined" />
                            </v-col>

                            <!-- GST Fields Edit -->
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantgst.gstin" label="GSTIN" density="compact"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantgst.business_name" label="Business Name"
                                    density="compact" variant="outlined" />
                            </v-col>
                        </template>
                    </v-row>
                </v-card>

                <!-- PAN INFO -->
                <v-card class="pa-4 mb-4" elevation="1">
                    <div class="d-flex justify-space-between align-center mb-3">
                        <h3 class="text-subtitle-1 font-weight-bold mb-0">PAN Information</h3>
                        <v-btn variant="text" prepend-icon="mdi-pencil" @click="toggleEdit('pan')">
                            Edit
                        </v-btn>
                    </div>
                    <v-divider class="mb-4"></v-divider>

                    <v-row>
                        <!-- Display Mode -->
                        <template v-if="!editMode.pan">
                            <v-col cols="6">
                                <div class="text-caption text-grey">PAN</div>
                                <div>{{ merchantForm.merchantpan?.pan || "—" }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-caption text-grey">Name</div>
                                <div>{{ merchantForm.merchantpan?.pan_name || "—" }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-caption text-grey">Entity PAN</div>
                                <div>{{ merchantForm.merchantpan?.entity_pan || "—" }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-caption text-grey">Father Name</div>
                                <div>{{ merchantForm.merchantpan?.father_name || "—" }}</div>
                            </v-col>
                            <v-col cols="6">
                                <div class="text-caption text-grey">PAN DOB</div>
                                <div>{{ formattedPanDob }}</div>
                            </v-col>
                        </template>

                        <!-- Edit Mode -->
                        <template v-else>
                            <v-col cols="6">
                                <v-text-field v-model="merchantForm.merchantpan.pan" label="PAN" density="compact"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="merchantForm.merchantpan.pan_name" label="Name" density="compact"
                                    variant="outlined" />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="merchantForm.merchantpan.entity_pan" label="Entity PAN"
                                    density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field v-model="merchantForm.merchantpan.father_name" label="Father Name"
                                    density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.merchantpan.pan_dob" label="PAN DOB" type="date"
                                    density="compact" variant="outlined" />
                            </v-col>
                        </template>
                    </v-row>
                </v-card>

                <!-- SETTLEMENT ACCOUNT -->
                <v-card class="pa-4 mb-4" elevation="0" outlined>
                    <div class="d-flex justify-space-between align-center mb-3">
                        <h3 class="text-subtitle-1 font-weight-bold mb-0">Settlement Account</h3>
                        <v-btn variant="text" prepend-icon="mdi-pencil" @click="toggleEdit('settlement')">
                            Edit
                        </v-btn>
                    </div>
                    <v-divider class="mb-4"></v-divider>

                    <v-row dense>
                        <template v-if="!editMode.settlement">
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Account Holder Name</div>
                                <div>{{ merchantForm.settlementaccount?.account_holder_name || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Account Holder Verified</div>
                                <div>{{ merchantForm.settlementaccount?.account_holder_result ? "Yes" : "No" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Account Type</div>
                                <div>{{ merchantForm.settlementaccount?.account_type || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Bank Name</div>
                                <div>{{ merchantForm.settlementaccount?.bank_name || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Bank Account No</div>
                                <div>{{ merchantForm.settlementaccount?.bank_account_no || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">IFSC Code</div>
                                <div>{{ merchantForm.settlementaccount?.bank_ifsc_code || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Branch Name</div>
                                <div>{{ merchantForm.settlementaccount?.branch_name || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Branch Contact</div>
                                <div>{{ merchantForm.settlementaccount?.branch_contact || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">City</div>
                                <div>{{ merchantForm.settlementaccount?.city || "—" }}</div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">State</div>
                                <div>{{ merchantForm.settlementaccount?.state || "—" }}</div>
                            </v-col>
                        </template>

                        <template v-else>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.account_holder_name"
                                    label="Account Holder Name" density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-select :items="['Yes', 'No']"
                                    v-model="merchantForm.settlementaccount.account_holder_result"
                                    label="Account Holder Verified" density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.account_type" label="Account Type"
                                    density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.bank_name" label="Bank Name"
                                    density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.bank_account_no"
                                    label="Bank Account No" density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.bank_ifsc_code" label="IFSC Code"
                                    density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.branch_name" label="Branch Name"
                                    density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.branch_contact"
                                    label="Branch Contact" density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.city" label="City"
                                    density="compact" variant="outlined" />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.settlementaccount.state" label="State"
                                    density="compact" variant="outlined" />
                            </v-col>
                        </template>
                    </v-row>
                </v-card>

                <!-- ADDRESS INFO -->
                <v-card class="pa-4 mb-4" elevation="1">
                    <div class="d-flex justify-space-between align-center mb-3">
                        <h3 class="text-subtitle-1 font-weight-bold mb-0">Address Details</h3>
                        <v-btn variant="text" prepend-icon="mdi-pencil" @click="toggleEdit('address')">
                            Edit
                        </v-btn>
                    </div>
                    <v-divider class="mb-4"></v-divider>

                    <v-row>
                        <!-- Display Mode -->
                        <template v-if="!editMode.address">
                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Official Address</div>
                                <div>{{ merchantForm.address?.official_address || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Address1</div>
                                <div>{{ merchantForm.address?.address1 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Address2</div>
                                <div>{{ merchantForm.address?.address2 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Address3</div>
                                <div>{{ merchantForm.address?.address3 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">City</div>
                                <div>{{ merchantForm.address?.city || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">State</div>
                                <div>{{ merchantForm.address?.state || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Pincode</div>
                                <div>{{ merchantForm.address?.pincode || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Phone</div>
                                <div>{{ merchantForm.address?.phone || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Mobile</div>
                                <div>{{ merchantForm.address?.mobile_number || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Website</div>
                                <div>{{ merchantForm.address?.website || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Residential Address</div>
                                <div>{{ merchantForm.address?.residential_address || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res Address1</div>
                                <div>{{ merchantForm.address?.res_address1 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res Address2</div>
                                <div>{{ merchantForm.address?.res_address2 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res Address3</div>
                                <div>{{ merchantForm.address?.res_address3 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res City</div>
                                <div>{{ merchantForm.address?.res_city || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res State</div>
                                <div>{{ merchantForm.address?.res_state || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res Pincode</div>
                                <div>{{ merchantForm.address?.res_pincode || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res Mobile</div>
                                <div>{{ merchantForm.address?.res_mobile || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Res Phone</div>
                                <div>{{ merchantForm.address?.res_phone_number || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor Address</div>
                                <div>{{ merchantForm.address?.vister_address || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor Address1</div>
                                <div>{{ merchantForm.address?.v_address1 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor Address2</div>
                                <div>{{ merchantForm.address?.v_address2 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor Address3</div>
                                <div>{{ merchantForm.address?.v_address3 || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor City</div>
                                <div>{{ merchantForm.address?.v_city || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor State</div>
                                <div>{{ merchantForm.address?.v_state || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor Pincode</div>
                                <div>{{ merchantForm.address?.v_pincode || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor Mobile</div>
                                <div>{{ merchantForm.address?.v_mobile || "—" }}</div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="text-caption text-grey">Visitor Phone</div>
                                <div>{{ merchantForm.address?.v_phone_number || "—" }}</div>
                            </v-col>
                        </template>

                        <!-- Edit Mode -->
                        <template v-else>
                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.official_address" label="Official Address"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.address1" label="Address1" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.address2" label="Address2" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.address3" label="Address3" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.city" label="City" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.state" label="State" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.pincode" label="Pincode" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.phone" label="Phone" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.mobile_number" label="Mobile"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.website" label="Website" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.residential_address"
                                    label="Residential Address" density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_address1" label="Res Address1"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_address2" label="Res Address2"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_address3" label="Res Address3"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_city" label="Res City" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_state" label="Res State"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_pincode" label="Res Pincode"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_mobile" label="Res Mobile"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.res_phone_number" label="Res Phone"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.vister_address" label="Visitor Address"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_address1" label="Visitor Address1"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_address2" label="Visitor Address2"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_address3" label="Visitor Address3"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_city" label="Visitor City"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_state" label="Visitor State"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_pincode" label="Visitor Pincode"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_mobile" label="Visitor Mobile"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="3">
                                <v-text-field v-model="merchantForm.address.v_phone_number" label="Visitor Phone"
                                    density="compact" variant="outlined" />
                            </v-col>
                        </template>
                    </v-row>
                </v-card>

                <!-- TERMINALS -->
                <v-card v-if="merchantForm.terminals && merchantForm.terminals.length > 0" class="pa-4 mb-4"
                    elevation="0" outlined>
                    <h3 class="text-subtitle-1 font-weight-bold mb-3">Terminals</h3>
                    <v-divider class="mb-4"></v-divider>

                    <v-row dense>
                        <v-col v-for="(terminal, i) in merchantForm.terminals" :key="i" cols="12" sm="6" md="4">
                            <v-card class="pa-3" outlined rounded tile>
                                <v-row align="center" class="mb-3">
                                    <v-col cols="auto">
                                        <v-avatar size="36" color="primary" class="white--text">
                                            <v-icon>mdi-credit-card</v-icon>
                                        </v-avatar>
                                    </v-col>

                                    <v-col>
                                        <div class="font-weight-bold">{{ terminal.tid }}</div>
                                        <div class="text-caption grey--text">{{ terminal.type }}</div>
                                    </v-col>

                                    <v-col cols="auto">
                                        <v-chip :color="terminal.status ? 'green lighten-1' : 'red lighten-1'"
                                            text-color="white" small>
                                            <v-icon left small>
                                                {{ terminal.status ? "mdi-check-circle" : "mdi-close-circle" }}
                                            </v-icon>
                                            {{ terminal.status ? "Active" : "Inactive" }}
                                        </v-chip>
                                    </v-col>
                                </v-row>

                                <v-divider class="my-2"></v-divider>

                                <v-row dense>
                                    <v-col cols="6" class="d-flex align-center">
                                        <v-icon small class="mr-1">mdi-credit-card-outline</v-icon>
                                        <span class="text-caption font-weight-medium">MID:</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <span>{{ terminal.mid }}</span>
                                    </v-col>

                                    <v-col cols="6" class="d-flex align-center">
                                        <v-icon small class="mr-1">mdi-cellphone-link</v-icon>
                                        <span class="text-caption font-weight-medium">Interface:</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <span>{{ terminal.interface }}</span>
                                    </v-col>

                                    <v-col cols="6" class="d-flex align-center">
                                        <v-icon small class="mr-1">mdi-application</v-icon>
                                        <span class="text-caption font-weight-medium">Interface Type:</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <span>{{ terminal.interfaceType }}</span>
                                    </v-col>

                                    <v-col cols="6" class="d-flex align-center">
                                        <v-icon small class="mr-1">mdi-volume-high</v-icon>
                                        <span class="text-caption font-weight-medium">Soundbox:</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <span>{{ terminal.soundbox ? "Yes" : "No" }}</span>
                                    </v-col>

                                    <v-col cols="6" class="d-flex align-center">
                                        <v-icon small class="mr-1">mdi-barcode</v-icon>
                                        <span class="text-caption font-weight-medium">Serial Number:</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <span>{{ terminal.serialNumber }}</span>
                                    </v-col>

                                    <v-col cols="6" class="d-flex align-center">
                                        <v-icon small class="mr-1">mdi-qrcode</v-icon>
                                        <span class="text-caption font-weight-medium">VPA / QR:</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <span>{{ terminal.vpa }}</span>
                                    </v-col>

                                    <v-col cols="6" class="d-flex align-center">
                                        <v-icon small class="mr-1">mdi-alert-circle</v-icon>
                                        <span class="text-caption font-weight-medium">Risk Flag:</span>
                                    </v-col>
                                    <v-col cols="6">
                                        <span>{{ terminal.riskflag ? "Yes" : "No" }}</span>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>

                <v-snackbar v-model="snackbar.show" :color="snackbar.color">{{ snackbar.message }}</v-snackbar>

                <!-- FIXED BOTTOM BAR -->
                <v-sheet v-if="isFormChanged" elevation="3" class="fixed-bottom-bar">
                    <v-container fluid>
                        <v-row justify="end">
                            <v-col cols="auto">
                                <v-btn color="primary" large rounded @click="submitForm">
                                    Save Changes and Submit
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-sheet>
            </div>

            <div v-if="tab === 'transactions'">
                <!-- TRANSACTIONS -->
                <v-card class="pa-4 mb-6" elevation="1">
                    <h3 class="text-subtitle-1 font-weight-bold mb-3">Recent Transactions</h3>
                    <v-divider class="mb-4"></v-divider>

                    <v-data-table :headers="transactionHeaders" :items="transactions.data" :page.sync="transactionPage"
                        :items-per-page.sync="transactionLimit"
                        :server-items-length="transactions.pagination.total || transactions.data.length"
                        class="elevation-0">
                        <template #item.createdAt="{ item }">{{ formatDate(item.createdAt) }}</template>
                        <template #item.status="{ item }">
                            <v-chip :color="statusColor(item.status)" text-color="white" small>
                                {{ item.status }}
                            </v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </div>
        </v-tabs-items>
    </v-container>

    <!-- LOADER -->
    <v-container v-else class="d-flex justify-center align-center" style="height: 200px;">
        <v-progress-circular indeterminate color="primary" />
    </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";

const props = defineProps({ merchantId: String });
const router = useRouter();
const { getMerchantById, getTransactionsByMerchantId, verifyOnboarding } = useAggregatorApi();

const merchantForm = reactive({});
const transactions = ref({ data: [], pagination: {} });
const transactionPage = ref(1);
const transactionLimit = ref(10);

const transactionHeaders = [
    { title: "Transaction ID", key: "tr" },
    { title: "RRN", key: "rrn" },
    { title: "Amount", key: "amount" },
    { title: "Status", key: "status" },
    { title: "Payment Method", key: "paymentMethod" },
    { title: "Provider", key: "provider" },
    { title: "Date", key: "createdAt" },
];

const isFormChanged = ref(false);

const editMode = reactive({
    contact: false,
    pan: false,
    settlement: false,
    address: false,
});

const toggleEdit = (section) => {
    if (section === "contact") {
        merchantForm.merchantinfo = merchantForm.merchantinfo || {};
        merchantForm.merchantgst = merchantForm.merchantgst || {};
    }
    if (section === "pan") merchantForm.merchantpan = merchantForm.merchantpan || {};
    if (section === "settlement") merchantForm.settlementaccount = merchantForm.settlementaccount || {};
    if (section === "address") merchantForm.address = merchantForm.address || {};

    editMode[section] = !editMode[section];
};

const snackbar = reactive({ show: false, message: "", color: "success" });
const tab = ref("info");

// Computed to display PAN DOB in DD/MM/YYYY format
const formattedPanDob = computed(() => {
    const dob = merchantForm.merchantpan?.pan_dob;
    if (!dob) return "—";
    const d = new Date(dob);
    if (isNaN(d)) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
});

// Utility functions
const formatKey = (key) => key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
const displayValue = (val) => (typeof val === "object" ? JSON.stringify(val) : val);
const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d)) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const statusColor = (status) => {
    if (["PAID", "SUCCESS"].includes(status)) return "#4caf50";
    if (["FAILED", "CANCELLED"].includes(status)) return "#f44336";
    return "#ff9800";
};

// Watch for changes in the form to enable bottom bar button
watch(
    merchantForm,
    () => {
        isFormChanged.value = Object.values(editMode).some((v) => v);
    },
    { deep: true }
);

// Fetch merchant data
const getMerchant = async (id) => {
    try {
        const res = await getMerchantById(id);
        Object.assign(merchantForm, res.data || {});
    } catch (e) {
        console.error("Failed to fetch merchant:", e);
    }
};

// Fetch transactions
const getTransactions = async (merchantId, page = 1, limit = 10) => {
    try {
        const res = await getTransactionsByMerchantId(merchantId, page, limit);
        transactions.value = res;
    } catch (e) {
        console.error("Failed to fetch transactions:", e);
    }
};

// Submit form
const submitForm = async () => {
    try {
        const payload = {
            legal_name: merchantForm.merchantinfo?.legal_name,
            dba_name: merchantForm.merchantinfo?.dba_name,
            dob: merchantForm.merchantinfo?.dob
                ? new Date(merchantForm.merchantinfo.dob).toISOString().split("T")[0]
                : null,
            primary_email_id: merchantForm.merchantinfo?.primary_email_id,
            primary_mobile: merchantForm.merchantinfo?.primary_mobile,
            beneficiary_email: merchantForm.merchantinfo?.beneficiary_email,
            beneficiary_mobile: merchantForm.merchantinfo?.beneficiary_mobile,
            lat: merchantForm.merchantinfo?.lat,
            long: merchantForm.merchantinfo?.long,
            mcc: merchantForm.merchantinfo?.mcc,
            nature_of_business: merchantForm.merchantinfo?.nature_of_business,
            annual_turn_over: merchantForm.merchantinfo?.annual_turn_over,

            // Additional fields from merchantForm
            business_type: merchantForm.merchantinfo?.business_type,
            std_code: merchantForm.merchantinfo?.std_code,
            lead_source: merchantForm.merchantinfo?.lead_source,
            lg_code: merchantForm.merchantinfo?.lg_code,
            website: merchantForm.merchantinfo?.website,

            pan: {
                pan: merchantForm.merchantpan?.pan,
                name: merchantForm.merchantpan?.pan_name,
                fathername: merchantForm.merchantpan?.father_name,
                dob: merchantForm.merchantpan?.pan_dob
                    ? new Date(merchantForm.merchantpan.pan_dob).toISOString().split("T")[0]
                    : null,
            },

            account: {
                accountNumber: merchantForm.settlementaccount?.bank_account_no,
                accountHolderName: merchantForm.settlementaccount?.account_holder_name,
                ifsc: merchantForm.settlementaccount?.bank_ifsc_code,
                bankName: merchantForm.settlementaccount?.bank_name,
                branchName: merchantForm.settlementaccount?.branch_name,
                additionalData: true,
                consent: "Y",
            },

            official_address: merchantForm.address?.official_address,
            address1: merchantForm.address?.address1,
            address2: merchantForm.address?.address2,
            address3: merchantForm.address?.address3,
            phone: merchantForm.address?.phone,
            city: merchantForm.address?.city,
            state: merchantForm.address?.state,
            pincode: merchantForm.address?.pincode ? String(merchantForm.address.pincode) : "",
            residential_address: merchantForm.address?.residential_address,
            res_address1: merchantForm.address?.res_address1,
            res_address2: merchantForm.address?.res_address2,
            res_address3: merchantForm.address?.res_address3,
            res_mobile: merchantForm.address?.res_mobile,
            res_phone_number: merchantForm.address?.res_phone_number,
            res_city: merchantForm.address?.res_city,
            res_state: merchantForm.address?.res_state,
            res_pincode: merchantForm.address?.res_pincode ? String(merchantForm.address.res_pincode) : "",
            vister_address: merchantForm.address?.vister_address,
            v_address1: merchantForm.address?.v_address1,
            v_address2: merchantForm.address?.v_address2,
            v_address3: merchantForm.address?.v_address3,
            v_mobile: merchantForm.address?.v_mobile,
            v_phone_number: merchantForm.address?.v_phone_number,
            v_city: merchantForm.address?.v_city,
            v_state: merchantForm.address?.v_state,
            v_pincode: merchantForm.address?.v_pincode ? String(merchantForm.address.v_pincode) : "",
            merchantId: props.merchantId,
        };

        const res = await verifyOnboarding(payload);

        if (res.data.statusCode === "00") {
            snackbar.message = res.data.message;
            snackbar.color = "success";
            snackbar.show = true;
            isFormChanged.value = false;
            router.push("/aggregator/merchants/onboarded");
        } else {
            snackbar.message = res.data.message;
            snackbar.color = "error";
            snackbar.show = true;
        }
    } catch (e) {
        console.error(e);
        snackbar.message = "Something went wrong";
        snackbar.color = "error";
        snackbar.show = true;
    }
};

// Fetch data on mount
onMounted(() => {
    getMerchant(props.merchantId);
    getTransactions(props.merchantId);
});
</script>

<style scoped>
.text-caption {
    font-size: 0.75rem;
}

.text-grey {
    color: #777;
}

.font-weight-bold {
    font-weight: 600;
}

.font-weight-medium {
    font-weight: 500;
}

.fixed-bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 1000;
    border-top: 1px solid #e0e0e0;
    /* subtle top border */
}
</style>