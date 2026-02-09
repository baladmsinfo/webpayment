<template>
    <v-container fluid>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-8">
            <h1 class="text-h5 font-weight-bold mb-0">Onboarded Vendors</h1>
        </div>

        <!-- Vendors Table -->
        <v-data-table :headers="headers" :items="vendors" item-key="id" show-expand class="elevation-1"
            :server-items-length="store.total" :page="page" :items-per-page="limit" show-current-page
            show-items-per-page @click:row="goToVendor" @update:page="onPageChange"
            @update:items-per-page="onLimitChange">
            <!-- Index -->
            <template #item.index="{ index }">
                {{ (page - 1) * limit + index + 1 }}
            </template>

            <!-- Vendor -->
            <template #item.name="{ item }">
                <div class="font-weight-medium">{{ item.name }}</div>
                <div class="text-caption text-grey">{{ item.email }}</div>
            </template>

            <!-- Approval Status -->
            <template #item.mstatus="{ item }">
                <v-chip :color="statusColor(item.mstatus)" size="small">
                    {{ item.mstatus }}
                </v-chip>
            </template>

            <!-- Active -->
            <template #item.status="{ item }">
                <v-chip :color="item.status ? 'green' : 'red'" size="small">
                    {{ item.status ? 'ACTIVE' : 'INACTIVE' }}
                </v-chip>
            </template>

            <!-- Risk -->
            <template #item.riskflag="{ item }">
                <v-chip size="small" :color="item.riskflag === 1 ? 'green' : item.riskflag === 0 ? 'orange' : 'purple'">
                    {{ item.riskflag }}
                </v-chip>
            </template>

            <!-- Merchants -->
            <template #item.merchantCount="{ item }">
                {{ item.merchants?.length || 0 }}
            </template>

            <!-- Active Merchants -->
            <template #item.activeMerchants="{ item }">
                {{item.merchants?.filter(m => m.status === true).length || 0}}
            </template>

            <!-- Created -->
            <template #item.createdAt="{ item }">
                <div>{{ formatDate(item.createdAt) }}</div>
                <div class="text-caption text-grey">
                    {{ formatTime(item.createdAt) }}
                </div>
            </template>

            <!-- Expanded Row -->
            <template #expanded-row="{ item }">
                <td :colspan="headers.length" class="py-4 px-10">
                    <v-row dense>
                        <!-- Merchants -->
                        <v-col cols="12" md="6">
                            <v-card class="expand-card" flat>
                                <div class="card-title">
                                    <v-icon size="18" class="me-1">mdi-store</v-icon>
                                    Merchants
                                </div>

                                <div class="card-body">
                                    <div v-for="m in item.merchants" :key="m.id" class="card-row">
                                        <div>
                                            <strong>{{ m.mid }}</strong>
                                            <div class="text-caption text-medium-emphasis">
                                                {{ m.interface }}
                                            </div>
                                        </div>

                                        <v-chip size="x-small" variant="tonal" :color="statusColor(m.mstatus)">
                                            {{ m.mstatus }}
                                        </v-chip>
                                    </div>

                                    <div v-if="!item.merchants?.length" class="empty-text">
                                        No merchants linked
                                    </div>
                                </div>
                            </v-card>
                        </v-col>

                        <!-- Commissions -->
                        <v-col cols="12" md="6">
                            <v-card class="expand-card" flat>
                                <div class="card-title">
                                    <v-icon size="18" class="me-1">mdi-percent</v-icon>
                                    Commissions
                                </div>

                                <div class="card-body">
                                    <div v-for="c in item.commissions" :key="c.id" class="card-row">
                                        <div>
                                            <strong>{{ c.paymentMethod }}</strong>
                                            <div class="text-caption text-medium-emphasis">
                                                {{ c.provider }}
                                            </div>
                                        </div>

                                        <span class="rate">
                                            {{ c.commissionRate }}
                                            {{ c.rateType === 'PERCENTAGE' ? '%' : '₹' }}
                                        </span>
                                    </div>

                                    <div v-if="!item.commissions?.length" class="empty-text">
                                        No commission rules
                                    </div>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                </td>
            </template>
        </v-data-table>
    </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVendorStore } from '~/stores/vendors'
import { useAggregatorApi } from '~/composables/apis/useAggregatorApi'
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useVendorStore()
const { getVendors } = useAggregatorApi()

/* Headers */
const headers = [
  { title: 'S.No', key: 'index' },
  { title: 'Vendor', key: 'name' },
  { title: 'Approval Status', key: 'mstatus' },
  { title: 'Active', key: 'status' },
  { title: 'Risk', key: 'riskflag' },
  { title: 'Merchants', key: 'merchantCount' },
  { title: 'Active Merchants', key: 'activeMerchants' },
  { title: 'Created', key: 'createdAt' },
]

/* Pagination */
const page = ref(store.page)
const limit = ref(store.limit)

const onPageChange = (newPage: number) => {
    page.value = newPage
    load()
}

const onLimitChange = (newLimit: number) => {
    limit.value = newLimit
    page.value = 1
    load()
}

const goToVendor = (event: PointerEvent, row: any) =>
  router.push(`/aggregator/vendor/view/${row.item.id}`);

/* Load */
const load = async () => {
    const res = await getVendors({
        page: page.value,
        limit: limit.value,
    })

    store.setVendors({
        list: res.data,
        active: res.active || 0,
        total: res.pagination.total,
        page: res.pagination.page,
        limit: res.pagination.limit,
        totalPages: res.pagination.totalPages,
    })
}

/* Computed */
const vendors = computed(() => store.list)

/* Utils */
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

.empty-text {
    text-align: center;
    font-size: 13px;
    color: #9e9e9e;
    margin-top: auto;
}
</style>