<template>
    <v-container class="pa-0 mt-4" fluid>
        <h1 class="text-h5 font-weight-bold">Settings</h1>
        <p class="text-caption mb-4">{{ vendor?.name }}</p>

        <v-tabs v-model="tab" color="deep-purple-accent-4" grow>
            <v-tab value="vendor">VENDOR</v-tab>
            <v-tab value="reset">RESET PASSWORD</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
            <!-- Vendor Info -->
            <v-window-item value="vendor">
                <v-card rounded="lg" class="pa-4">
                    <v-card-text>
                        <template v-if="vendor">
                            <div class="d-flex justify-space-between py-2">
                                <b>Vendor Code:</b>
                                <span>{{ vendor.code }}</span>
                            </div>
                            <div class="d-flex justify-space-between py-2">
                                <b>Vendor ID:</b>
                                <span>{{ vendor.id }}</span>
                            </div>
                            <div class="d-flex justify-space-between py-2">
                                <b>Vendor Name:</b>
                                <span>{{ vendor.name }}</span>
                            </div>
                            <div class="d-flex justify-space-between py-2">
                                <b>Email:</b>
                                <span>{{ vendor.email }}</span>
                            </div>
                            <div class="d-flex justify-space-between py-2">
                                <b>Mobile:</b>
                                <span>{{ vendor.mobile }}</span>
                            </div>
                            <!-- <div class="d-flex justify-space-between py-2">
                                <b>Rate Type:</b>
                                <span>{{ vendor.rateType }}</span>
                            </div> -->
                        </template>

                        <template v-else>
                            <v-skeleton-loader type="heading, text, text, text, text, text" />
                        </template>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- Reset Password -->
            <v-window-item value="reset">
                <v-container fluid>
                    <v-card class="pa-8 d-flex align-center justify-center" width="100%" elevation="2" rounded="lg">
                        <v-card class="pa-8" width="400" elevation="0">
                            <v-alert v-if="showAlert" :type="alertType" variant="tonal" class="mb-4" closable
                                @click:close="showAlert = false">
                                {{ alertMessage }}
                            </v-alert>

                            <h2 class="text-h6 font-weight-bold text-center mb-2">Reset Your Password</h2>
                            <p class="text-caption text-center mb-6">
                                Enter your old password and set a new one.
                            </p>

                            <v-form v-model="valid" @submit.prevent="handleReset">
                                <v-text-field v-model="oldPassword" type="password" label="Enter your old password"
                                    variant="outlined" density="comfortable" class="mb-4" required />
                                <v-text-field v-model="newPassword" type="password" label="Enter your new password"
                                    variant="outlined" density="comfortable" class="mb-4" required />
                                <v-text-field v-model="confirmPassword" type="password"
                                    label="Confirm your new password" variant="outlined" density="comfortable"
                                    class="mb-6" required />
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
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useVendorApi } from "~/composables/apis/useVendorApi";

const { getVendor, resetPassword } = useVendorApi();
const authStore = useAuthStore();

const tab = ref("vendor");

const vendor = computed(() => authStore.vendor);


onMounted(async () => {
    try {
        await getAggregator();
    } catch (err) {
        console.error("Failed to load vendor:", err);
    } finally {
    }
});

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const valid = ref(false);
const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("success");

// Reset password handler
async function handleReset() {
    try {
        const res = await resetPassword({
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
        });

        if (res.data.statusCode === "00") {
            alertMessage.value = "Password reset successful!";
            alertType.value = "success";
            showAlert.value = true;
            oldPassword.value = "";
            newPassword.value = "";
            confirmPassword.value = "";
        } else {
            alertMessage.value = res.data.message || "Password reset failed";
            alertType.value = "error";
            showAlert.value = true;
        }
    } catch (e) {
        alertMessage.value = "Something went wrong. Please try again.";
        alertType.value = "error";
        showAlert.value = true;
    }
}

definePageMeta({
    layout: "vendorlayer",
    middleware: "auth",
});
</script>