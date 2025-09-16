<template>
  <div class="pa-4">
    <v-row dense>
      <v-col cols="12" md="8">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-card class="pa-6" elevation="2" rounded="lg">
              <h3 class="text-caption font-weight-medium text-uppercase">Today Payments</h3>
              <div class="d-flex align-center">
                <span class="text-h5 font-weight-bold me-1">
                  {{ collections.dailyCollection.toFixed(2) }}
                </span>
                <span class="text-caption text-medium-emphasis">/ {{ collections.dailyCount }}</span>
              </div>
              <v-progress-linear :model-value="todayProgress" color="deep-purple" height="6" rounded class="mt-2" />
              <div class="text-caption text-medium-emphasis mt-1">
                {{ collections.dailyCount }}/1000000
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card class="pa-6" elevation="2" rounded="lg">
              <h3 class="text-caption font-weight-medium text-uppercase">Weekly Payments</h3>
              <div class="d-flex align-center">
                <span class="text-h5 font-weight-bold me-1">
                  {{ collections.weeklyCollection.toFixed(2) }}
                </span>
                <span class="text-caption text-medium-emphasis">/ {{ collections.weeklyCount }}</span>
              </div>
              <v-progress-linear :model-value="weeklyProgress" color="deep-purple" height="6" rounded class="mt-2" />
              <div class="text-caption text-medium-emphasis mt-1">
                {{ collections.weeklyCount }}/1000
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card class="pa-6" elevation="2" rounded="lg">
              <h3 class="text-caption font-weight-medium text-uppercase">Monthly Payments</h3>
              <div class="d-flex align-center">
                <span class="text-h5 font-weight-bold me-1">
                  {{ collections.monthlyCollection.toFixed(2) }}
                </span>
                <span class="text-caption text-medium-emphasis">/ {{ collections.monthlyCount }}</span>
              </div>
              <v-progress-linear :model-value="monthlyProgress" color="deep-purple" height="6" rounded class="mt-2" />
              <div class="text-caption text-medium-emphasis mt-1">
                {{ collections.monthlyCount }}/1000
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card class="pa-6" elevation="2" rounded="lg">
              <h3 class="text-caption font-weight-medium text-uppercase">Yearly Payments</h3>
              <div class="d-flex align-center">
                <span class="text-h5 font-weight-bold me-1">
                  {{ collections.yearlyCollection.toFixed(2) }}
                </span>
                <span class="text-caption text-medium-emphasis">/ {{ collections.yearlyCount }}</span>
              </div>
              <v-progress-linear :model-value="yearlyProgress" color="deep-purple" height="6" rounded class="mt-2" />
              <div class="text-caption text-medium-emphasis mt-1">
                {{ collections.yearlyCount }}/1000
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4 d-flex justify-center align-center" elevation="2" rounded="lg">
          <apexchart type="donut" width="100%" :options="donutOptions" :series="donutSeries" />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mt-6">
      <v-col cols="12">
        <v-card class="pa-4 px-8" elevation="2" rounded="lg">
          <v-tabs v-model="tab" color="deep-purple">
            <v-tab value="day">Today</v-tab>
            <v-tab value="week">Weekly</v-tab>
            <v-tab value="month">Monthly</v-tab>
            <v-tab value="year">Yearly</v-tab>
            <v-tab value="5years">5 Years</v-tab>
            <v-tab value="10years">10 Years</v-tab>
          </v-tabs>
          <div class="mt-4">
            <apexchart type="line" height="300" :options="lineOptions" :series="lineSeries" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div class="mt-6">
      <payments />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { usePaymentsStore } from "~/stores/payments";
import { usePaymentsApi } from "~/composables/apis/usePaymentsApi";
import VueApexCharts from "vue3-apexcharts";

definePageMeta({
  layout: "mlayer",
  middleware: "auth",
});

const apexchart = VueApexCharts;

const store = usePaymentsStore();
const { getMerchantCollections, getTransactionStatus, getPaymentsByGranularity } = usePaymentsApi();
const { totalCollection: collections } = storeToRefs(store);

const tab = ref("day");

const todayProgress = computed(() => (collections.value.dailyCollection / 1000000) * 100);
const weeklyProgress = computed(() => (collections.value.weeklyCollection / 1000) * 100);
const monthlyProgress = computed(() => (collections.value.monthlyCollection / 1000) * 100);
const yearlyProgress = computed(() => (collections.value.yearlyCollection / 1000) * 100);

const donutSeries = ref([]);
const donutOptions = ref({
  labels: [],
  colors: ["#00BFFF", "#FF6384", "#FFCE56", "#FF9F40", "#8A2BE2", "#FF4500"],
  legend: { position: "bottom" },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: "16px",
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: "18px",
            fontWeight: 600,
            offsetY: 10,
            formatter: (val) => val.toFixed(2),
          },
          total: {
            show: true,
            label: "Total",
            fontSize: "18px",
            fontWeight: 600,
            formatter: (w) => {
              // ✅ If hovering a slice, show that slice's value
              const index = w.globals.seriesIndex;
              if (index >= 0) {
                return w.globals.series[index].toFixed(2);
              }
              // ✅ Otherwise show the sum of all values
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
            },
          },
        },
      },
    },
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val) => val.toFixed(2),
    },
  },
});

const lineSeries = ref([{ name: "Payments", data: [] }]);
const lineOptions = ref({ xaxis: { categories: [] } });

const loadTimeSeries = async (granularity) => {
  try {
    const res = await getPaymentsByGranularity(granularity);
    console.log("Granularity response:", res?.data);

    if (res?.data?.totals && res?.data?.labels) {
      lineSeries.value = [{ name: "Payments", data: res.data.totals }];
      lineOptions.value = { xaxis: { categories: res.data.labels } };
    }
  } catch (err) {
    console.error("Error loading time series:", err);
  }
};

const loadTransactionStatus = async () => {
  try {
    const res = await getTransactionStatus();
    console.log("Transaction status data:", res);

    if (res.statusCode === "00") {
      donutSeries.value = res.data.values;
      donutOptions.value = {
        ...donutOptions.value,
        labels: res.data.labels.map((label) => label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()),
        colors: res.data.colors || donutOptions.value.colors,
      };
    }
  } catch (err) {
    console.error("Error loading transaction status:", err);
  }
};

watch(tab, (newTab) => loadTimeSeries(newTab));

onMounted(async () => {
  await getMerchantCollections();
  await loadTransactionStatus();
  await loadTimeSeries(tab.value);
});
</script>

<style scoped></style>