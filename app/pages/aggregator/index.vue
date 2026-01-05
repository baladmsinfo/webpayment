<template>
    <div class="pa-4">
        <v-container fluid class="pa-0">
            <v-row dense>
                <v-col cols="12" sm="4" v-for="(stat, i) in overallStats.slice(0, 3)" :key="i">
                    <v-card class="pa-6 d-flex flex-column justify-space-between" elevation="2" rounded="lg"
                        style="min-height: 125px">
                        <template v-if="!loading">
                            <div class="d-flex align-center mb-2">
                                <h3 class="text-caption font-weight-medium text-uppercase mb-0">
                                    {{ stat.title }}
                                </h3>
                            </div>
                            <div class="d-flex align-center">
                                <div class="d-flex flex-column">
                                    <span class="text-h5 font-weight-bold me-1">{{ stat.value }}</span>
                                    <span class="text-caption text-medium-emphasis">{{ stat.sub }}</span>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <v-skeleton-loader type="heading" class="mb-4"
                                style="height: 20px; width: 60%; opacity: 0.7" />
                            <v-skeleton-loader type="text" style="height: 30px; width: 40%; opacity: 0.7" />
                            <v-skeleton-loader type="text" style="height: 15px; width: 50%; opacity: 0.7" />
                        </template>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <v-row dense>
            <v-col cols="12" md="4">
                <v-card class="pa-4" elevation="2" rounded="lg" style="height: 100%">
                    <template v-if="!loading">
                        <div class="mb-4">
                            <h2>
                                Payment Methods
                            </h2>
                        </div>
                        <apexchart type="donut" height="300" :options="donutOptions" :series="donutSeries" />
                    </template>
                    <template v-else>
                        <v-skeleton-loader type="card" height="300" class="rounded-lg" style="opacity: 0.7" />
                    </template>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="pa-4" elevation="2" rounded="lg" style="height: 100%">
                    <!-- Daily Transaction Status -->
                    <template v-if="!noTransactionsToday">
                        <div class="mb-4">
                            <h2>
                                Today's Transaction Status
                            </h2>
                        </div>
                        <apexchart type="donut" height="300" :options="statusDonutOptions"
                            :series="statusDonutSeries" />
                    </template>

                    <template v-else-if="!loading">
                        <v-card flat class="d-flex flex-column align-center justify-center" style="height: 300px">
                            <v-icon size="56" color="primary">
                                mdi-calendar-remove
                            </v-icon>

                            <h3 class="text-subtitle-1 font-weight-medium mt-4">
                                No Transactions Today
                            </h3>

                            <p class="text-caption text-medium-emphasis">
                                There are no transactions recorded for today
                            </p>
                        </v-card>
                    </template>

                    <template v-else>
                        <v-skeleton-loader type="card" height="300" class="rounded-lg" style="opacity: 0.7" />
                    </template>
                </v-card>
            </v-col>

            <!-- Next 3 Stats stacked -->
            <v-col cols="12" md="4">
                <v-row dense>
                    <v-col cols="12" v-for="(stat, i) in overallStats.slice(3, 6)" :key="i">
                        <v-card class="pa-6 d-flex flex-column justify-space-between" elevation="2" rounded="lg"
                            style="min-height: 125px">
                            <template v-if="!loading">
                                <div class="d-flex align-center mb-2">
                                    <h3 class="text-caption font-weight-medium text-uppercase mb-0">
                                        {{ stat.title }}
                                    </h3>
                                </div>
                                <div class="d-flex align-center">
                                    <div class="d-flex flex-column">
                                        <span class="text-h5 font-weight-bold me-1">{{ stat.value }}</span>
                                        <span class="text-caption text-medium-emphasis">{{ stat.sub }}</span>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <v-skeleton-loader type="heading" class="mb-4"
                                    style="height: 20px; width: 60%; opacity: 0.7" />
                                <v-skeleton-loader type="text" style="height: 30px; width: 40%; opacity: 0.7" />
                                <v-skeleton-loader type="text" style="height: 15px; width: 50%; opacity: 0.7" />
                            </template>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Top Merchants Podium-style Cards -->
        <v-row dense class="mt-6" align="stretch">
            <v-col cols="12" md="4" v-for="(list, period) in topMerchants" :key="period">
                <v-card class="pa-4" elevation="4" rounded="lg"
                    style="background: #fafafa; display: flex; flex-direction: column; height: 100%;">

                    <template v-if="!loading">
                        <div class="d-flex justify-space-between align-center mb-4">
                            <h3 class="text-h6 font-weight-bold">
                                Top Merchants - {{ period.charAt(0).toUpperCase() + period.slice(1) }}
                            </h3>
                            <v-icon color="#a78bfa">mdi-trophy-variant-outline</v-icon>
                        </div>

                        <div class="flex-grow-1">
                            <div v-for="(m, idx) in list" :key="m.id"
                                class="pa-3 mb-3 rounded-lg d-flex align-center justify-space-between hoverable"
                                :style="{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f8ff', transition: 'all 0.3s' }">
                                <div class="d-flex align-center">
                                    <v-avatar size="36" class="mr-3" color="#ddd">
                                        <span class="text-body-2 font-weight-bold">{{ idx + 1 }}</span>
                                    </v-avatar>
                                    <div>
                                        <p class="mb-1 font-weight-medium" style="color: #4c1d95;">{{ m.name }}</p>
                                        <span class="text-caption grey--text">{{ m.txnCount }} Transactions</span>
                                    </div>
                                </div>

                                <div>
                                    <p class="font-weight-bold" style="color: #4c1d95;">₹{{
                                        m.totalAmount.toLocaleString() }}</p>
                                </div>
                            </div>
                        </div>

                        <div v-if="list.length === 0" class="text-center py-6 grey--text text-caption">
                            No merchants found
                        </div>
                    </template>

                    <template v-else>
                        <!-- Skeleton Loader -->
                        <v-skeleton-loader type="card" height="200px" class="mb-4"
                            style="opacity: 0.7; border-radius: 8px" />
                        <v-skeleton-loader type="card" height="200px" class="mb-4"
                            style="opacity: 0.7; border-radius: 8px" />
                        <v-skeleton-loader type="card" height="200px" style="opacity: 0.7; border-radius: 8px" />
                    </template>

                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { useAuthStore } from "~/stores/auth";

const { getAggregator, getTransactions, getTransactionStatusSummary, getPaymentMethodSummary } = useAggregatorApi();
const authStore = useAuthStore();
const apexchart = VueApexCharts;

const loading = ref();

const overallStats = computed(() => [
    { title: "Active Merchants", value: `${authStore.merchants.active} Nos` || 0, sub: "" },
    { title: "Total Merchants", value: `${authStore.merchants.total} Nos` || 0, sub: "" },
    { title: "Today Collection", value: authStore.summary.today.totalAmount.toFixed(2), sub: `/ ${authStore.summary.today.count}` },
    { title: "Weekly Collection", value: authStore.summary.week.totalAmount.toFixed(2), sub: `/ ${authStore.summary.week.count}` },
    { title: "Monthly Collection", value: authStore.summary.month.totalAmount.toFixed(2), sub: `/ ${authStore.summary.month.count}` },
    { title: "Yearly Collection", value: authStore.summary.year.totalAmount.toFixed(2), sub: `/ ${authStore.summary.year.count}` },
]);

definePageMeta({
    layout: "aggregatorlayer",
    middleware: "auth",
});

const topMerchants = computed(() => authStore.topMerchants);

const noTransactionsToday = computed(() => {
    const data = Object.values(authStore.transactionStatusSummary || {});
    return (
        data.length === 0 ||
        data.every((t) => t.count === 0)
    );
});

const statusDonutSeries = computed(() =>
    Object.values(authStore.transactionStatusSummary).map((t) => t.count)
);

const statusDonutOptions = computed(() => {
    const data = Object.values(authStore.transactionStatusSummary);
    const labels = data.map((t) => t.status);
    const total = data.reduce((sum, t) => sum + t.count, 0);

    return {
        labels,
        colors: ['red', 'blue'],
        legend: { position: "bottom" },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total Txns",
                            formatter: () => total.toLocaleString(),
                        },
                    },
                },
            },
        },
        tooltip: {
            y: {
                formatter: (val, opts) => {
                    const t = data[opts.seriesIndex];
                    return `${t.count} Txns | Amount: ₹${t.amount} | Response Code: ${t.responceCode}`;
                },
            },
        },
    };
});

const donutSeries = computed(() =>
    Object.values(authStore.paymentSummary).map((m) => m.amount)
);

const donutOptions = computed(() => {
    const methods = Object.keys(authStore.paymentSummary);
    const values = Object.values(authStore.paymentSummary).map((m) => m.amount);
    const totalAmount = values.reduce((acc, val) => acc + val, 0);

    return {
        labels: methods,
        colors: ['#4CAF50', '#F44336', '#FF9800', '#2196F3'],
        legend: { position: "bottom" },
        plotOptions: {
            pie: { donut: { labels: { show: true, total: { show: true, label: "Total", formatter: () => `₹${totalAmount.toLocaleString()}` } } } }
        },
        dataLabels: { enabled: true, formatter: (val, opts) => `₹${values[opts.seriesIndex].toLocaleString()}` },
        tooltip: { y: { formatter: (val) => `₹${val.toLocaleString()}` } },
    };
});

onMounted(async () => {
    console.log("check", authStore.merchants.total);
    if (authStore.merchants.total !== 0) {
        loading.value = false;
    } else {
        loading.value = true;
    }
    try {
        await Promise.all([getAggregator(), getTransactions(), getTransactionStatusSummary(), getPaymentMethodSummary()]);
        loading.value = false;
    } catch (err) {
        console.error("Dashboard load error:", err);
    }
});
</script>