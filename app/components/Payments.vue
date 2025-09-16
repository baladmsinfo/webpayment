<template>
  <v-container fluid>
    <h1 class="text-h5 font-weight-bold mb-4">Payments</h1>

    <v-data-table
    :headers="headers"
    :items="store.transactions"
    :server-items-length="store.totalTransactions"
    :items-per-page="limit"
    :page="page"
    item-key="rrn"
    class="elevation-1"
    show-current-page
    show-items-per-page
    @update:page="onPageChange"
    @update:items-per-page="onLimitChange"
    >

      <template #item.createdAt="{ item }">
        <div>
          <div>{{ formatDate(item.createdAt) }}</div>
          <div class="text-caption text-grey">{{ formatTime(item.createdAt) }}</div>
        </div>
      </template>

      <template #item.amount="{ item }">
        {{ item.amount }} INR
      </template>

      <template #item.paymentMethod="{ item }">
        <v-chip color="grey" size="small">
          {{ item.paymentMethod }}
        </v-chip>
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
                {{ formatDate(selectedPayment.createdAt) }}
                {{ formatTime(selectedPayment.createdAt) }}
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
import { usePaymentsApi } from "~/composables/apis/usePaymentsApi";

const store = usePaymentsStore();
const { getTransactions } = usePaymentsApi();

const page = ref(1);
const limit = ref(6);

const showDetails = ref(false);
const selectedPayment = ref<any | null>(null);

const openDetails = (payment: any) => {
  selectedPayment.value = payment;
  showDetails.value = true;
};

const headers = [
  { title: "Payment Date", key: "createdAt" },
  { title: "Transaction Amount", key: "amount" },
  { title: "Payment Method", key: "paymentMethod" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];

const loadTransactions = async () => {
  const transactions = await getTransactions({
    page: page.value.toString(),
    limit: limit.value.toString(),
  });
  console.log("Store transactions:", store.transactions);
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadTransactions();
};

const onLimitChange = (newLimit: number) => {
  limit.value = newLimit;
  page.value = 1; 
  loadTransactions();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString();
};

const statusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "orange";
    case "PAID":
      return "green";
    case "FAILED":
      return "red";
    default:
      return "grey";
  }
};

onMounted(() => {
  loadTransactions();
});
</script>
