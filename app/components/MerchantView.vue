<template>
    <v-container fluid v-if="merchant">
        <v-container class="d-flex align-center justify-space-between mb-4" fluid v-if="merchant">
            <div class="d-flex align-center justify-start mb-4">
                <v-btn class="mr-3" icon @click="$router.back()">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>

                <h1 class="text-h4 font-weight-bold ml-4">
                    {{ merchant.legal_name }} - {{ merchant.mid }}
                </h1>
            </div>

            <div class="mb-6" v-if="merchant.riskflag === 0">
                <v-btn color="primary" @click="$router.push({
                    path: '/aggregator/onboarding/kyc',
                    query: { merchantId: merchant.id }
                })">
                    Complete KYC
                </v-btn>
            </div>
        </v-container>

        <!-- Tabs -->
        <v-tabs v-model="tab" background-color="white" color="primary" grow>
            <v-tab>General Information</v-tab>
            <v-tab>Contact & Address</v-tab>
            <v-tab>Business & GST</v-tab>
            <v-tab>PAN & Settlement</v-tab>
            <v-tab>Recent Transactions</v-tab>
        </v-tabs>

        <v-divider class="my-4"></v-divider>

        <!-- Tab Content -->
        <v-window v-model="tab">
            <!-- General Information -->
            <v-window-item>
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-subtitle-1 font-weight-bold mb-4">General Information</h2>
                    <v-row dense class="text-body-1">
                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Merchant ID</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.mid }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">App ID</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.appid }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Legal Name</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.legal_name }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Interface</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.interface }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Status</v-col>
                        <v-col cols="6" class="py-2 text-right">
                            <v-chip :color="merchant.status ? '#4caf50' : '#f44336'" text-color="white" small>
                                {{ merchant.status ? "Active" : "Inactive" }}
                            </v-chip>
                        </v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Approval Status</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.mstatus }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Risk Flag</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.riskflag }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Created At</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ formatDate(merchant.createdAt)
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Verified At</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ formatDate(merchant.verifiedAt)
                        }}</v-col>
                    </v-row>
                </v-card>
            </v-window-item>

            <!-- Contact & Address -->
            <v-window-item>
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-subtitle-1 font-weight-bold mb-4">Contact & Address</h2>
                    <v-row dense class="text-body-1">
                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Mobile</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.mobile_number
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Primary Email</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.primary_email_id
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Primary Mobile</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.primary_mobile
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Gender</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.gender }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">DOB</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ formatDate(merchant.merchantinfo.dob)
                        }}</v-col>

                        <v-divider class="my-4" cols="12"></v-divider>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Official Address</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{
                            merchant.merchantinfo.address.official_address }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">City</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.address.city
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">State</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.address.state
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Pincode</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.address.pincode
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Website</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.address.website
                        }}</v-col>
                    </v-row>
                </v-card>
            </v-window-item>

            <!-- Business & GST -->
            <v-window-item>
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-subtitle-1 font-weight-bold mb-4">Business & GST</h2>
                    <v-row dense class="text-body-1">
                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Doing Business As</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.dba_name
                        }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">Nature of Business</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{
                            merchant.merchantinfo.nature_of_business }}</v-col>

                        <v-col cols="6" class="py-2 font-weight-medium text-gray-700">MCC</v-col>
                        <v-col cols="6" class="py-2 text-right text-gray-900">{{ merchant.merchantinfo.mcc }}</v-col>

                        <v-divider class="my-4" cols="12"></v-divider>

                        <v-col v-if="merchant.merchantgst" cols="6"
                            class="py-2 font-weight-medium text-gray-700">GSTIN</v-col>
                        <v-col v-if="merchant.merchantgst" cols="6" class="py-2 text-right text-gray-900">{{
                            merchant.merchantgst.gstin }}</v-col>

                        <v-col v-if="merchant.merchantgst" cols="6"
                            class="py-2 font-weight-medium text-gray-700">Business Name</v-col>
                        <v-col v-if="merchant.merchantgst" cols="6" class="py-2 text-right text-gray-900">{{
                            merchant.merchantgst.business_name }}</v-col>
                    </v-row>
                </v-card>
            </v-window-item>

            <!-- PAN & Settlement -->
            <v-window-item>
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-subtitle-1 font-weight-bold mb-4">PAN & Settlement</h2>
                    <v-row dense class="text-body-1">
                        <v-col v-if="merchant.merchantpan" cols="6" class="py-2 font-weight-medium text-gray-700">PAN
                            Number</v-col>
                        <v-col v-if="merchant.merchantpan" cols="6" class="py-2 text-right text-gray-900">{{
                            merchant.merchantpan.pan }}</v-col>

                        <v-col v-if="merchant.settlementaccount" cols="6"
                            class="py-2 font-weight-medium text-gray-700">Account Number</v-col>
                        <v-col v-if="merchant.settlementaccount" cols="6" class="py-2 text-right text-gray-900">{{
                            merchant.settlementaccount.bank_account_no }}</v-col>

                        <v-col v-if="merchant.settlementaccount" cols="6"
                            class="py-2 font-weight-medium text-gray-700">Bank Name</v-col>
                        <v-col v-if="merchant.settlementaccount" cols="6" class="py-2 text-right text-gray-900">{{
                            merchant.settlementaccount.bank_name }}</v-col>

                        <v-col v-if="merchant.settlementaccount?.account_holder_result !== undefined" cols="6"
                            class="py-2 font-weight-medium text-gray-700">Verification Result</v-col>
                        <v-col v-if="merchant.settlementaccount?.account_holder_result !== undefined" cols="6"
                            class="py-2 text-right text-gray-900">
                            {{ merchant.settlementaccount.account_holder_result ? 'Verified' : 'Not Verified' }}
                        </v-col>
                    </v-row>
                </v-card>
            </v-window-item>

            <!-- Transactions -->
            <v-window-item>
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-subtitle-1 font-weight-bold ma-4">Recent Transactions</h2>

                    <v-data-table :headers="transactionHeaders" :items="transactions.data" :page.sync="transactionPage"
                        :items-per-page.sync="transactionLimit"
                        :server-items-length="transactions.pagination.total || transactions.data.length"
                        @update:page="onTransactionPageChange" @update:items-per-page="onTransactionLimitChange"
                        class="elevation-0">
                        <template #item.createdAt="{ item }">
                            {{ formatDate(item.createdAt) }}
                        </template>
                        <template #item.status="{ item }">
                            <v-chip :color="statusColor(item.status)" text-color="white" small>{{ item.status
                            }}</v-chip>
                        </template>
                    </v-data-table>
                </v-card>
            </v-window-item>
        </v-window>
    </v-container>

    <v-container v-else>
        <v-progress-circular indeterminate color="primary" />
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { defineProps } from "vue";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({ merchantId: String });

const { getMerchantById, getTransactionsByMerchantId } = useAggregatorApi();
const merchant = ref(null);
const tab = ref(0);

const transactionHeaders = [
    { title: "Transaction ID", key: "tr" },
    { title: "RRN", key: "rrn" },
    { title: "Amount", key: "amount" },
    { title: "Status", key: "status" },
    { title: "Payment Method", key: "paymentMethod" },
    { title: "Provider", key: "provider" },
    { title: "Date", key: "createdAt" },
];

const transactions = ref({ data: [], pagination: {} });
const transactionPage = ref(1);
const transactionLimit = ref(10);

const onTransactionLimitChange = (newLimit) => {
    transactionLimit.value = newLimit;
    transactionPage.value = 1;
    getTransactions(props.merchantId, 1, newLimit);
};

const getTransactions = async (merchantId, page = 1, limit = transactionLimit.value) => {
    const res = await getTransactionsByMerchantId(merchantId, page, limit);
    transactions.value = res;
};

const onTransactionPageChange = (page) => {
    transactionPage.value = page;
    getTransactions(props.merchantId, page, transactionLimit.value);
};

const getMerchant = async (id) => {
    try {
        const res = await getMerchantById(id);
        merchant.value = res.data;
    } catch (err) {
        console.error("Failed to fetch merchant:", err);
    }
};

const formatDate = (date) => (date ? new Date(date).toLocaleString() : "N/A");

const statusColor = (status) => {
    if (status === "PAID" || status === "SUCCESS") return "#4caf50";
    if (status === "FAILED" || status === "CANCELLED") return "#f44336";
    return "#ff9800"; // PENDING
};

onMounted(() => {
    getMerchant(props.merchantId);
    getTransactions(props.merchantId);
});
</script>