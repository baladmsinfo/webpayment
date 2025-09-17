<template>
  <v-container fluid>
    <h1 class="text-h5 font-weight-bold mb-4">Reports</h1>

    <div class="d-flex flex-wrap align-center mb-4" style="gap: 16px;">
      <v-text-field v-model="fromDate" type="date" label="From Date" density="compact" hide-details class="w-auto" />
      <v-text-field v-model="toDate" type="date" label="To Date" density="compact" hide-details class="w-auto" />

      <v-select v-model="status" :items="['PENDING', 'SUCCESS', 'FAILED']" label="Status" density="compact" hide-details
        class="w-auto" clearable />

      <v-select v-model="paymentMethod" :items="['UPI', 'CARD', 'NETBANKING', 'WALLET']" label="Mode" density="compact"
        hide-details class="w-auto" clearable />

      <v-btn color="primary" @click="applyDateFilter">Filter</v-btn>
      <v-btn v-if="isFiltered" color="grey" variant="outlined" @click="clearFilter">Clear</v-btn>
      <v-btn color="success" @click="downloadPDF">
        <v-icon left>mdi-download</v-icon>
        Download PDF
      </v-btn>
    </div>


    <!-- Reports Table -->
    <v-data-table :headers="headers" :items="store.reports" item-key="id" class="elevation-1" :page.sync="page"
      :items-per-page.sync="limit" :server-items-length="store.totalReports" show-current-page show-items-per-page
      @update:page="onPageChange" @update:items-per-page="onLimitChange">
      <template #item.createdAt="{ item }">
        <div>
          <div>{{ formatDate(item.createdAt) }}</div>
          <div class="text-caption text-grey">{{ formatTime(item.createdAt) }}</div>
        </div>
      </template>

      <template #item.amount="{ item }">{{ item.amount }} INR</template>

      <template #item.paymentMethod="{ item }">
        <v-chip color="grey" size="small">{{ item.paymentMethod }}</v-chip>
      </template>

      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" text-color="white" size="small">
          {{ item.status }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon size="small" color="primary" @click="openDetails(item)">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-navigation-drawer v-model="showDetails" location="right" temporary width="400">
      <v-card flat>
        <v-card-title class="d-flex pl-8 py-4 align-center justify-space-between">
          <span class="text-h6 font-weight-bold">Payment Details</span>
          <v-btn icon class="elevation-0" @click="showDetails = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text v-if="selectedPayment">
          <v-list dense>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Payment ID:</v-list-item-title>
              <v-list-item-subtitle>{{ selectedPayment.id }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">Date:</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(selectedPayment.createdAt) }} {{ formatTime(selectedPayment.createdAt) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">Payment Method:</v-list-item-title>
              <v-list-item-subtitle>{{ selectedPayment.paymentMethod }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">Amount:</v-list-item-title>
              <v-list-item-subtitle>{{ selectedPayment.amount }} INR</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">Status:</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip :color="statusColor(selectedPayment.status)" size="small" text-color="white">
                  {{ selectedPayment.status }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title class="font-weight-bold">Gateway Ref ID:</v-list-item-title>
              <v-list-item-subtitle>{{ selectedPayment.gatewayRefid }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item v-if="selectedPayment.reason">
              <v-list-item-title class="font-weight-bold">Reason:</v-list-item-title>
              <v-list-item-subtitle>{{ selectedPayment.reason }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePaymentsStore } from "~/stores/payments";
import { usePaymentsApi } from "~/composables/apis/usepaymentsApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const store = usePaymentsStore();
const { getReports } = usePaymentsApi();

const status = ref<string | null>(null);
const paymentMethod = ref<string | null>(null);

const fromDate = ref<string | null>(null);
const toDate = ref<string | null>(null);
const isFiltered = ref(false);

const page = ref(1);
const limit = ref<number | string>(10);

const showDetails = ref(false);
const selectedPayment = ref<any | null>(null);

const openDetails = (payment: any) => {
  selectedPayment.value = payment;
  showDetails.value = true;
};

const headers = [
  { title: "Payment Date", key: "createdAt" },
  { title: "Transaction Amount", key: "amount" },
  { title: "Mode", key: "paymentMethod" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];

definePageMeta({
  layout: "mlayer",
  middleware: "auth",
});

const onPageChange = async (newPage: number) => {
  page.value = newPage;
  await loadReports();
};

const onLimitChange = async (newLimit: number) => {
  limit.value = newLimit;
  page.value = 1;
  await loadReports();
};

const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Payment Reports", 14, 20);

  const tableColumn = ["Date", "Amount", "Payment Method", "Status"];
  const tableRows: any[] = [];

  store.reports.forEach((report: any) => {
    const reportData = [
      `${formatDate(report.createdAt)} ${formatTime(report.createdAt)}`,
      `${report.amount} INR`,
      report.paymentMethod,
      report.status,
    ];
    tableRows.push(reportData);
  });

  autoTable(doc, {
    startY: 30,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]; // "2025-09-09"

  doc.save(`reports_${dateStr}.pdf`);
};

const loadReports = async () => {
  const params: any = {
    limit: limit.value,
    page: page.value,
  };

  if (isFiltered.value && fromDate.value && toDate.value) {
    params.startDate = fromDate.value;
    params.endDate = toDate.value;
  }
  if (status.value) params.status = status.value;
  if (paymentMethod.value) params.paymentMethod = paymentMethod.value;

  await getReports(params);
};

const applyDateFilter = async () => {
  isFiltered.value = !!(fromDate.value && toDate.value);
  page.value = 1;
  await loadReports();
};

const clearFilter = async () => {
  fromDate.value = null;
  toDate.value = null;
  status.value = null;
  paymentMethod.value = null;
  isFiltered.value = false;
  page.value = 1;
  await loadReports();
};

const formatDate = (dateString: string) =>
  new Date(dateString).toISOString().split("T")[0];
const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString();
const statusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "orange";
    case "SUCCESS":
      return "green";
    case "FAILED":
      return "red";
    default:
      return "grey";
  }
};

onMounted(async () => {
  await loadReports();
});
</script>
