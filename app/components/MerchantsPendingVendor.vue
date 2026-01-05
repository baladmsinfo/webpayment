<template>
    <v-container fluid>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-8">
            <h1 class="text-h5 font-weight-bold mb-0">Pending Merchants</h1>
            <v-btn color="primary" class="d-flex pa-6 align-center text-h6 font-weight-medium" elevation="2" rounded
                @click="router.push('/vendor/onboarding')">
                <v-icon left>mdi-plus</v-icon>
                Add Merchant
            </v-btn>
        </div>

        <!-- KYC Pending Merchants Table -->
        <v-data-table :headers="headers" :items="kycPending" :server-items-length="store.totalKycPending"
            :items-per-page="kycPendingLimit" :page="kycPendingPage" item-key="id" class="elevation-1 mb-12"
            show-current-page show-items-per-page @update:page="onKycPageChange"
            @update:items-per-page="onKycLimitChange" @click:row="goToMerchant">
            <template #item.index="{ index }">
                <div class="text-center">
                    {{ (kycPendingPage - 1) * kycPendingLimit + index + 1 }}
                </div>
            </template>

            <template #item.legal_name="{ item }">
                <div class="font-weight-medium">{{ item.legal_name }}</div>
            </template>

            <template #item.mstatus="{ item }">
                <v-chip :color="merchantStatusColor(item.mstatus)" size="small" text-color="white">
                    {{ item.mstatus }}
                </v-chip>
            </template>


            <template #item.status="{ item }">
                <v-chip :color="statusColor(item.status)" size="small" text-color="white">
                    {{ formatStatus(item.status) }}
                </v-chip>
            </template>

            <template #item.riskflag="{ item }">
                <v-chip :color="item.riskflag === 1 ? 'green' : 'red'" size="small" text-color="white">
                    {{ item.riskflag === 1 ? 'Active' : 'Inactive' }}
                </v-chip>
            </template>

            <template #item.createdAt="{ item }">
                <div>
                    <div>{{ formatDate(item.createdAt) }}</div>
                    <div class="text-caption text-grey">{{ formatTime(item.createdAt) }}</div>
                </div>
            </template>
        </v-data-table>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMerchantsStore } from '~/stores/merchants';
import { useVendorApi } from '~/composables/apis/useVendorApi';

const store = useMerchantsStore();
const { getPendingMerchants } = useVendorApi();
const router = useRouter();

/* Pagination */
const kycPendingPage = ref(store.kycPendingPage);
const kycPendingLimit = ref(store.kycPendingLimit);

/* Table Headers */
const headers = [
    { title: 'S.No', key: 'index', align: 'center', width: '70px' },
    { title: 'Merchant Name', key: 'legal_name' },
    { title: 'Merchant Status', key: 'mstatus' },
    { title: 'MID', key: 'mid' },
    { title: 'Status', key: 'status' },
    { title: 'Risk Flag', key: 'riskflag' },
    { title: 'Application Date', key: 'createdAt' },
];

/* Data Loader */
const loadPendingMerchants = async () => {
    const res = await getPendingMerchants({ page: kycPendingPage.value, limit: kycPendingLimit.value });
    store.setKycPending({
        list: res.data,
        total: res.pagination.total,
        page: res.pagination.page,
        limit: res.pagination.limit,
        totalPages: res.pagination.totalPages,
    });
};

/* Pagination */
const onKycPageChange = (newPage: number) => { kycPendingPage.value = newPage; loadPendingMerchants(); };
const onKycLimitChange = (newLimit: number) => { kycPendingLimit.value = newLimit; kycPendingPage.value = 1; loadPendingMerchants(); };

/* Computed */
const kycPending = computed(() => store.kycPending);

/* Utils */
const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
const formatTime = (date: string) => new Date(date).toLocaleTimeString();
const merchantStatusColor = (status: string) =>
    status === 'PENDING' ? 'orange' : status === 'APPROVED' ? 'green' : 'grey';
const statusColor = (status: any) => status === 'ACTIVE' ? 'green' : status === 'INACTIVE' ? 'red' : 'grey';
const formatStatus = (status: any) => status === true || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';

/* Row Click */
const goToMerchant = (event: PointerEvent, row: any) => {

    if (row.item.merchantinfo !== null) {
        router.push(`/vendor/merchants/view/${row.item.id}`);
    } else {
        router.push(`/vendor/onboarding/${row.item.id}`);
    }

}

/* Lifecycle */
onMounted(() => loadPendingMerchants());
</script>
