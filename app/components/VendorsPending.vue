<template>
    <v-container fluid>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-8">
            <h1 class="text-h5 font-weight-bold mb-0">Pending Vendors</h1>
            <v-btn color="primary" class="d-flex pa-6 align-center text-h6 font-weight-medium" elevation="2" rounded
                @click="router.push('/aggregator/vendor_onboarding')">
                <v-icon start>mdi-plus</v-icon>
                Add Vendor
            </v-btn>
        </div>

        <!-- Vendors Table -->
        <v-data-table :headers="headers" :items="kycPending" item-key="id" class="elevation-1"
            :server-items-length="store.totalKycPending" :page="kycPendingPage" :items-per-page="kycPendingLimit"
            show-current-page show-items-per-page @update:page="onKycPageChange"
            @update:items-per-page="onKycLimitChange" @click:row="addVendor">

            <!-- Index -->
            <template #item.index="{ index }">
                {{ (kycPendingPage - 1) * kycPendingLimit + index + 1 }}
            </template>

            <!-- Vendor Name -->
            <template #item.name="{ item }">
                <div class="font-weight-medium">{{ item.name }}</div>
                <div class="text-caption text-grey">{{ item.email }}</div>
            </template>

            <!-- Vendor Status -->
            <template #item.mstatus="{ item }">
                <v-chip :color="statusColor(item.mstatus)" size="small">
                    {{ item.mstatus }}
                </v-chip>
            </template>

            <!-- Active Status -->
            <template #item.status="{ item }">
                <v-chip :color="item.status ? 'green' : 'red'" size="small">
                    {{ item.status ? 'ACTIVE' : 'INACTIVE' }}
                </v-chip>
            </template>

            <!-- Risk -->
            <template #item.riskflag="{ item }">
                <v-chip :color="item.riskflag === 1 ? 'green' : item.riskflag === 0 ? 'orange' : 'purple'" size="small">
                    {{ item.riskflag }}
                </v-chip>
            </template>

            <!-- Created -->
            <template #item.createdAt="{ item }">
                <div>{{ formatDate(item.createdAt) }}</div>
                <div class="text-caption text-grey">
                    {{ formatTime(item.createdAt) }}
                </div>
            </template>

        </v-data-table>
    </v-container>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVendorStore } from '~/stores/vendors'
import { useAggregatorApi } from '~/composables/apis/useAggregatorApi'

const router = useRouter()
const store = useVendorStore()
const { getPendingVendors } = useAggregatorApi()

const headers = [
    { title: 'S.No', key: 'index' },
    { title: 'Vendor', key: 'name' },
    { title: 'Approval Status', key: 'mstatus' },
    { title: 'Active', key: 'status' },
    { title: 'Risk', key: 'riskflag' },
    { title: 'Created', key: 'createdAt' },
]

const kycPendingPage = ref(store.kycPendingPage)
const kycPendingLimit = ref(store.kycPendingLimit)

const onKycPageChange = (newPage: number) => {
    kycPendingPage.value = newPage
    load()
}

const onKycLimitChange = (newLimit: number) => {
    kycPendingLimit.value = newLimit
    kycPendingPage.value = 1
    load()
}

const addVendor = (event: PointerEvent, row: any) =>
    router.push(`/aggregator/vendor_onboarding/${row.item.id}`);

const load = async () => {
    const res = await getPendingVendors({
        page: kycPendingPage.value,
        limit: kycPendingLimit.value,
    })

    store.setKycPending({
        list: res.data,
        total: res.pagination.total,
        page: res.pagination.page,
        limit: res.pagination.limit,
        totalPages: res.pagination.totalPages,
    })
}

const kycPending = computed(() => store.kycPending)

const statusColor = (status: string) =>
    status === 'APPROVED'
        ? 'green'
        : status === 'ONBOARDED'
            ? 'orange'
            : 'red'

const formatDate = (d: string) => new Date(d).toLocaleDateString()
const formatTime = (d: string) => new Date(d).toLocaleTimeString()

onMounted(load)
</script>

<style scoped>
.expand-card {
    height: 100%;
    border-radius: 14px;
    padding: 14px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
}

.card-title {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    color: #424242;
    margin-bottom: 10px;
}

.card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 10px;
    background: #f9f9f9;
}

.rate {
    font-weight: 600;
}

.aggregator-body {
    justify-content: center;
}

.aggregator-name {
    font-weight: 600;
    font-size: 16px;
}

.empty-text {
    text-align: center;
    font-size: 13px;
    color: #9e9e9e;
    margin-top: auto;
}
</style>
