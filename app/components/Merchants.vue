<template>
  <v-container fluid>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-8">
      <h1 class="text-h5 font-weight-bold mb-0">Onboarded Merchants</h1>
    </div>

    <!-- Onboarded Merchants Table -->
    <v-data-table
      :headers="headers"
      :items="store.list"
      :server-items-length="store.total"
      :items-per-page="limit"
      :page="page"
      item-key="id"
      class="elevation-1 mb-12"
      show-current-page
      show-items-per-page
      @update:page="onPageChange"
      @update:items-per-page="onLimitChange"
      @click:row="goToMerchant"
    >
      <template #item.index="{ index }">
        <div class="text-center">
          {{ (page - 1) * limit + index + 1 }}
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

      <template #item.mid="{ item }">
        <div>{{ item.mid }}</div>
      </template>

      <template #item.status="{ item }">
        <v-chip :color="statusColor(item.status)" size="small" text-color="white">
          {{ formatStatus(item.status) }}
        </v-chip>
      </template>

      <template #item.riskflag="{ item }">
        <v-chip
          :color="item.riskflag === 1 ? 'green' : 'red'"
          size="small"
          text-color="white"
        >
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMerchantsStore } from '~/stores/merchants';
import { useAggregatorApi } from '~/composables/apis/useAggregatorApi';

const store = useMerchantsStore();
const { getMerchants } = useAggregatorApi();
const router = useRouter();

/* Pagination */
const page = ref(store.page);
const limit = ref(store.limit);

/* Headers */
const headers = [
  { title: 'S.No', key: 'index', align: 'center', width: '70px' },
  { title: 'Merchant Name', key: 'legal_name' },
  { title: 'Merchant Status', key: 'mstatus' },
  { title: 'MID', key: 'mid' },
  { title: 'Status', key: 'status' },
  { title: 'Risk Flag', key: 'riskflag' },
  { title: 'Application Date', key: 'createdAt' },
];

/* Fetch */
const loadMerchants = async () => await getMerchants({ page: page.value, limit: limit.value });

/* Pagination */
const onPageChange = (newPage: number) => { page.value = newPage; loadMerchants(); };
const onLimitChange = (newLimit: number) => { limit.value = newLimit; page.value = 1; loadMerchants(); };

/* Utils */
const formatDate = (date: string) => new Date(date).toISOString().split('T')[0];
const formatTime = (date: string) => new Date(date).toLocaleTimeString();
const statusColor = (status: any) => status === 'ACTIVE' ? 'green' : status === 'INACTIVE' ? 'red' : 'grey';
const formatStatus = (status: any) => status === true || status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
const merchantStatusColor = (status: string) => status === 'PENDING' ? 'orange' : status === 'APPROVED' ? 'green' : 'grey';

/* Row Click */
const goToMerchant = (event: PointerEvent, row: any) =>
  router.push(`/aggregator/merchants/view/${row.item.id}`);

/* Lifecycle */
onMounted(() => loadMerchants());
</script>