<template>
  <v-container class="pa-0 mt-4" fluid>
    <h1 class="text-h5 font-weight-bold">Settings</h1>
    <p class="text-caption mb-4">{{ merchant?.legal_name }}</p>

    <v-tabs v-model="tab" color="deep-purple-accent-4" grow>
      <v-tab value="merchant">MERCHANT</v-tab>
      <v-tab value="terminals">TERMINALS</v-tab>
      <v-tab value="account">ACCOUNT KYC</v-tab>
      <v-tab value="reset">RESET PASSWORD</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-4">
      <v-window-item value="merchant">
        <v-card rounded="lg" class="pa-4">
          <v-card-text>
            <div class="d-flex justify-space-between py-2">
              <b>Merchant ID (MID):</b>
              <span>{{ merchant?.mid }}</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>App ID:</b>
              <span>{{ merchant?.appid }}</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>Status:</b>
              <v-chip :color="merchant?.status ? 'green' : 'red'" variant="tonal" size="small">
                {{ merchant?.status ? "Active" : "Inactive" }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>Risk Flag:</b>
              <span>{{ merchant?.riskflag }}</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>Legal Name:</b>
              <span>{{ merchant?.legal_name }}</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>DBA Name:</b>
              <span>{{ merchant?.data?.dba_name || "—" }}</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>Email:</b>
              <span>{{ merchant?.data?.primary_email_id }}</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>Mobile:</b>
              <span>{{ merchant?.data?.primary_mobile }}</span>
            </div>
            <div class="d-flex justify-space-between py-2">
              <b>Remarks:</b>
              <span>{{ merchant?.remarks ?? "—" }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="terminals">
        <v-card rounded="lg">
          <v-card-title class="text-h6">Terminals</v-card-title>

          <v-data-table :headers="terminalHeaders" :items="terminals" :loading="loadingTerminals" dense
            hide-default-footer>
            <template #item.status="{ item }">
              <v-chip :color="item.status ? 'green lighten-2' : 'red lighten-2'" variant="tonal" small>
                {{ item.status ? "Active" : "Inactive" }}
              </v-chip>
            </template>

            <template #item.type="{ item }">
              <v-chip color="purple lighten-3" variant="outlined" small>
                {{ item.type?.toUpperCase() }}
              </v-chip>
            </template>

            <template #item.interface="{ item }">
              <v-chip color="gray lighten-3" variant="tonal" small>
                {{ item.interface || "-" }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <v-window-item value="account">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12">
              <v-card rounded="lg" elevation="2" class="pa-6">
                <v-card-title class="text-h6 text-primary">
                  Business Details
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-text>
                  <v-row v-for="(val, label) in {
                    'Name': account?.business?.name || '—',
                    'Business Type': account?.business?.type || '—',
                    'MCC': account?.business?.mcc || '—'
                  }" :key="label" class="py-2 align-center">
                    <v-col cols="6" class="text-body-2 font-weight-medium text-grey-darken-1">
                      {{ label }}
                    </v-col>
                    <v-col cols="6" class="text-body-2 text-right">
                      {{ val }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="lg" elevation="2" class="pa-6 h-100">
                <v-card-title class="text-h6 text-secondary">
                  PAN Details
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-text>
                  <v-row v-for="(val, label) in {
                    'PAN': account?.pan?.pan || '—',
                    'PAN Name': account?.pan?.pan_name || '—',
                    'Entity PAN': account?.pan?.entity_pan || '—'
                  }" :key="label" class="py-2 align-center">
                    <v-col cols="6" class="text-body-2 font-weight-medium text-grey-darken-1">
                      {{ label }}
                    </v-col>
                    <v-col cols="6" class="text-body-2 text-right">
                      {{ val }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="lg" elevation="2" class="pa-6 h-100">
                <v-card-title class="text-h6 text-secondary">
                  GST Details
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-text>
                  <v-row v-for="(val, label) in {
                    'GSTIN': account?.gst?.gstin || '—',
                    'Business Name': account?.gst?.business_name || '—'
                  }" :key="label" class="py-2 align-center">
                    <v-col cols="6" class="text-body-2 font-weight-medium text-grey-darken-1">
                      {{ label }}
                    </v-col>
                    <v-col cols="6" class="text-body-2 text-right">
                      {{ val }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="lg" elevation="2" class="pa-6 h-100">
                <v-card-title class="text-h6 text-secondary">
                  Settlement Account
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-text>
                  <v-row v-for="(val, label) in {
                    'Account Holder': account?.settlement?.account_holder_name || '—',
                    'Account Type': account?.settlement?.account_type || '—',
                    'Account Number': account?.settlement?.bank_account_no || '—',
                    'Bank': account?.settlement?.bank_name || '—',
                    'IFSC': account?.settlement?.bank_ifsc_code || '—',
                    'City': account?.settlement?.city || '—'
                  }" :key="label" class="py-2 align-center">
                    <v-col cols="6" class="text-body-2 font-weight-medium text-grey-darken-1">
                      {{ label }}
                    </v-col>
                    <v-col cols="6" class="text-body-2 text-right">
                      {{ val }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <v-card rounded="lg" elevation="2" class="pa-6">
                <v-card-title class="text-h6 text-primary">
                  Address
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-text>
                  <v-row v-for="(val, label) in {
                    'Official Address': account?.address?.official_address || '—',
                    'City': account?.address?.city || '—',
                    'State': account?.address?.state || '—',
                    'Pincode': account?.address?.pincode || '—',
                    'Website': account?.address?.website || '—'
                  }" :key="label" class="py-2 align-center">
                    <v-col cols="6" class="text-body-2 font-weight-medium text-grey-darken-1">
                      {{ label }}
                    </v-col>
                    <v-col cols="6" class="text-body-2 text-right">
                      {{ val }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="reset">
        <v-container fluid>
          <v-card class="pa-8 d-flex align-center justify-center" width="100%" elevation="2" rounded="lg">
            <v-card class="pa-8" width="400" elevation="0">

              <!-- ✅ Success/Error Alert -->
              <v-alert v-if="showAlert" :type="alertType" variant="tonal" class="mb-4" closable
                @click:close="showAlert = false">
                {{ alertMessage }}
              </v-alert>

              <h2 class="text-h6 font-weight-bold text-center mb-2">Reset Your Password</h2>
              <p class="text-caption text-center mb-6">
                Enter your old password and set a new one.
              </p>

              <v-form v-model="valid" @submit.prevent="handleReset">
                <v-text-field v-model="oldPassword" type="password" label="Enter your old password" variant="outlined"
                  density="comfortable" class="mb-4" required />

                <v-text-field v-model="newPassword" type="password" label="Enter your new password" variant="outlined"
                  density="comfortable" class="mb-4" required />

                <v-text-field v-model="confirmPassword" type="password" label="Confirm your new password"
                  variant="outlined" density="comfortable" class="mb-6" required />

                <v-btn type="submit" block color="primary" size="large" class="rounded-lg"
                  :disabled="!oldPassword || !newPassword || !confirmPassword || newPassword.length < 6 || newPassword !== confirmPassword">
                  Reset Password
                </v-btn>
              </v-form>
            </v-card>
          </v-card>
        </v-container>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useUsersApi } from "~/composables/apis/useUsersApi"

const { fetchMerchant, fetchTerminals, fetchAccount, resetPassword } = useUsersApi()

const tab = ref("merchant")
const merchant = ref(null)
const terminals = ref([])
const account = ref(null)
const loadingTerminals = ref(false)

const terminalHeaders = [
  { title: "TID", key: "tid" },
  { title: "VPA", key: "vpa" },
  { title: "Channel", key: "interface" },
  { title: "Type", key: "type" },
  { title: "Interface Type", key: "interfaceType" },
  { title: "Status", key: "status" },
]

const oldPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")
const valid = ref(false)
const showAlert = ref(false)
const alertMessage = ref("")
const alertType = ref("success")


async function handleReset() {
  try {
    const res = await resetPassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    })

    console.log("Password reset response:", res)

    if (res.data.statusCode === "00") {
      alertMessage.value = "Password reset successful!"
      alertType.value = "success"
      showAlert.value = true

      oldPassword.value = ""
      newPassword.value = ""
      confirmPassword.value = ""
    } else {
      alertMessage.value = res.data.message || "Password reset failed"
      alertType.value = "error"
      showAlert.value = true
    }
  } catch (e) {
    console.error("Password reset failed:", e)
    alertMessage.value = "⚠️ Something went wrong. Please try again."
    alertType.value = "error"
    showAlert.value = true
  }
}

onMounted(() => {
  fetchMerchantVue()
  fetchTerminalsVue()
  fetchAccountVue()
})

async function fetchMerchantVue() {
  try {
    const res = await fetchMerchant()
    merchant.value = res.data

  } catch (e) {
    console.error("Merchant fetch failed:", e)
  }
}


async function fetchTerminalsVue() {
  loadingTerminals.value = true
  try {
    const res = await fetchTerminals()
    terminals.value = res.data.terminals || []
  } catch (e) {
    console.error("Terminals fetch failed:", e)
  } finally {
    loadingTerminals.value = false
  }
}

async function fetchAccountVue() {
  try {
    const res = await fetchAccount()
    console.log(res);
    account.value = res.data
  } catch (e) {
    console.error("Account fetch failed:", e)
  }
}

definePageMeta({
  layout: "mlayer",
  middleware: "auth",
})

function viewTerminal(item) {
  console.log("View terminal details:", item)
}
</script>