<template>
    <v-container fluid>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-8">
            <h1 class="text-h5 font-weight-bold mb-0">Transactions</h1>
        </div>

        <!-- Filters -->
        <v-card class="mb-6" outlined>
            <v-card-text>
                <v-row dense>
                    <!-- From Date -->
                    <v-col cols="12" md="3">
                        <div class="filter-field">
                            <v-text-field v-model="filters.fromDate" type="date" label="From Date" density="comfortable"
                                clearable hide-details />
                        </div>
                    </v-col>

                    <!-- To Date -->
                    <v-col cols="12" md="3">
                        <div class="filter-field">
                            <v-text-field v-model="filters.toDate" type="date" label="To Date" density="comfortable"
                                clearable hide-details />
                        </div>
                    </v-col>

                    <!-- Merchant -->
                    <v-col cols="12" md="4">
                        <div class="filter-field">
                            <v-autocomplete v-model="filters.merchantId" :items="merchants" item-title="legal_name"
                                item-value="id" label="Merchant" density="comfortable" clearable hide-details>
                                <template #item="{ props, item }">
                                    <v-list-item v-bind="props" :title="item.raw.legal_name"
                                        :subtitle="`MID: ${item.raw.mid}`" />
                                </template>
                            </v-autocomplete>
                        </div>
                    </v-col>

                    <!-- Actions -->
                    <v-col cols="12" md="2">
                        <div class="d-flex align-center justify-end">
                            <v-btn color="primary" height="47" @click="applyFilters">
                                Apply
                            </v-btn>
                            <v-btn variant="text" height="47" @click="clearFilters">
                                Clear
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Transactions Table -->
        <v-data-table-server :headers="headers" :items="transactions" :items-length="total" v-model:page="page"
            v-model:items-per-page="limit" item-key="id" class="elevation-1 mb-12" :loading="loading">
            <!-- S.No -->
            <template #item.index="{ index }">
                <div class="text-center">
                    {{ (page - 1) * limit + index + 1 }}
                </div>
            </template>

            <!-- Amount -->
            <template #item.amount="{ item }">
                <div class="font-weight-medium">
                    ₹ {{ Number(item.amount).toLocaleString() }}
                </div>
            </template>

            <!-- Payment Method -->
            <template #item.paymentMethod="{ item }">
                <v-chip size="small" color="primary" variant="outlined">
                    {{ item.paymentMethod }}
                </v-chip>
            </template>

            <!-- Status -->
            <template #item.status="{ item }">
                <v-chip :color="transactionStatusColor(item.status)" size="small" text-color="white">
                    {{ item.status }}
                </v-chip>
            </template>

            <!-- Created At -->
            <template #item.createdAt="{ item }">
                <div>
                    <div>{{ formatDate(item.createdAt) }}</div>
                    <div class="text-caption text-grey">
                        {{ formatTime(item.createdAt) }}
                    </div>
                </div>
            </template>

            <!-- Merchant -->
            <template #item.merchant="{ item }">
                <div>
                    <div class="font-weight-medium">
                        {{ item.merchant?.legal_name || "-" }}
                    </div>
                    <div class="text-caption text-grey">
                        MID: {{ item.merchant?.mid || "-" }}
                    </div>
                </div>
            </template>

            <!-- Action -->
            <template #item.action="{ item }">
                <v-btn size="small" color="primary" variant="outlined" @click.stop="goToMerchant(item)">
                    View Merchant
                </v-btn>
            </template>

        </v-data-table-server>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAggregatorApi } from "@/composables/apis/useAggregatorApi";
import { useRouter } from "vue-router";

const router = useRouter();

/* API */
const { getAllAggregatorTransactions } = useAggregatorApi();

/* Table State */
const loading = ref(false);
const transactions = ref<any[]>([]);

const page = ref(1);
const limit = ref(5);
const total = ref(0);

const filters = ref({
    fromDate: null as string | null,
    toDate: null as string | null,
    merchantId: null as string | null,
})

const merchants = ref<any[]>([])

const headers = [
    { title: "S.No", key: "index", align: "center", width: "70px" },
    { title: "Transaction ID", key: "id" },
    { title: "Payment Method", key: "paymentMethod" },
    { title: "Amount", key: "amount" },
    { title: "Status", key: "status" },
    { title: "Transaction Date", key: "createdAt" },
    { title: "Merchant", key: "merchant" },
    { title: "Action", key: "action", sortable: false },
];

const normalizeDate = (date: string | null, end = false) => {
    if (!date) return undefined;
    return end
        ? `${date}T23:59:59.999`
        : `${date}T00:00:00.000`;
};

const goToMerchant = (item: any) => {
    if (!item.merchant?.id) return;

    router.push(`/aggregator/merchants/view/${item.merchant.id}`);
};

const loadTransactions = async () => {
    loading.value = true;

    const res = await getAllAggregatorTransactions({
        page: page.value,
        limit: limit.value,
        fromDate: normalizeDate(filters.value.fromDate),
        toDate: normalizeDate(filters.value.toDate, true),
        merchantId: filters.value.merchantId,
    });

    transactions.value = res.data || [];
    total.value = res.meta?.total || 0;

    loading.value = false;
};


const applyFilters = () => {
    page.value = 1
    loadTransactions()
}

const clearFilters = () => {
    filters.value = {
        fromDate: null,
        toDate: null,
        merchantId: null,
    }
    page.value = 1
    loadTransactions()
}

const loadMerchants = async () => {
    const { getMerchants } = useAggregatorApi();
    const res = await getMerchants({ page: "1", limit: "1000" });
    merchants.value = res.data || [];
};


watch([page, limit], () => {
    loadTransactions();
});

/* Utils */
const transactionStatusColor = (status: string) => {
    switch (status) {
        case "SUCCESS":
            return "green";
        case "FAILED":
            return "red";
        case "PENDING":
            return "orange";
        default:
            return "grey";
    }
};

const formatDate = (date: string) =>
    new Date(date).toISOString().split("T")[0];

const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString();

onMounted(() => {
    loadTransactions()
    loadMerchants()
})
</script>