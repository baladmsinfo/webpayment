<template>
    <v-container fluid>
        <div class="d-flex align-center justify-space-between mb-8">
            <h1 class="text-h5 font-weight-bold mb-0">
                List of Merchants
            </h1>
            <v-btn color="primary" class="d-flex pa-6 align-center text-h6 font-weight-medium" elevation="2" rounded
                @click="router.push('/aggregator/onboarding')">
                <v-icon left>mdi-plus</v-icon>
                Add Merchant
            </v-btn>
        </div>

        <v-data-table :headers="headers" :items="store.list" :server-items-length="store.total" :items-per-page="limit"
            :page="page" item-key="id" class="elevation-1" show-current-page show-items-per-page
            @update:page="onPageChange" @update:items-per-page="onLimitChange" @click:row="goToMerchant">

            <!-- Merchant Name -->
            <template #item.legal_name="{ item }">
                <div>
                    <div class="font-weight-medium">{{ item.legal_name }}</div>
                </div>
            </template>

            <!-- MID -->
            <template #item.mid="{ item }">
                <div>{{ item.mid }}</div>
            </template>

            <!-- Status -->
            <template #item.status="{ item }">
                <v-chip :color="statusColor(item.status)" size="small" text-color="white">
                    {{ formatStatus(item.status) }}
                </v-chip>
            </template>

            <!-- Risk Flag -->
            <template #item.riskflag="{ item }">
                <v-chip :color="item.riskflag === 1 ? 'green' : 'red'" size="small" text-color="white">
                    {{ item.riskflag === 1 ? "Active" : "Inactive" }}
                </v-chip>
            </template>

            <!-- Created Date -->
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMerchantsStore } from "~/stores/merchants";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";

const store = useMerchantsStore();
const { getMerchants } = useAggregatorApi();
const router = useRouter();

const page = ref(1);
const limit = ref(6);

const headers = [
    { title: "Merchant Name", key: "legal_name" },
    { title: "MID", key: "mid" },
    { title: "Status", key: "status" },
    { title: "Risk Flag", key: "riskflag" },
    { title: "Created Date", key: "createdAt" },
];

const loadMerchants = async () => {
    await getMerchants({ page: page.value, limit: limit.value });
};

const onPageChange = (newPage: number) => {
    page.value = newPage;
    loadMerchants();
};

const onLimitChange = (newLimit: number) => {
    limit.value = newLimit;
    page.value = 1;
    loadMerchants();
};

const formatDate = (dateString: string) => new Date(dateString).toISOString().split("T")[0];
const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString();
const formatStatus = (status: any) => (status === true || status === "ACTIVE" ? "ACTIVE" : status === false || status === "INACTIVE" ? "INACTIVE" : "UNKNOWN");
const statusColor = (status: any) => (formatStatus(status) === "ACTIVE" ? "green" : formatStatus(status) === "INACTIVE" ? "red" : "grey");

const goToMerchant = (event: PointerEvent, row: any) => {
    console.log("Clicked merchant row:", row.item);
    router.push(`/aggregator/merchants/view/${row.item.id}`);
};


onMounted(() => loadMerchants());
</script>
