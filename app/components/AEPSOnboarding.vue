<template>
    <div>
        <!-- App Bar + Progress -->
        <v-app-bar color="primary" density="comfortable" flat>
            <v-toolbar-title class="text-caption">{{ title }}</v-toolbar-title>
            <v-spacer />
            <v-chip class="pr-2" size="small" variant="flat">Step {{ step }} / {{ steps.length }}</v-chip>
            <template v-slot:extension>
                <v-progress-linear :model-value="(step / steps.length) * 100" height="8" rounded class="mx-2" />
            </template>
        </v-app-bar>

        <!-- Main Card -->
        <v-card variant="flat" color="transparent" class="pa-0">

            <v-window v-model="step" class="px-2 py-4 pb-4">

                <v-window-item :value="1">
                    <v-container class="pa-6 d-flex justify-center">
                       
                    </v-container>
                </v-window-item>

            </v-window>

            <!-- Footer -->
            <v-divider />
            <v-footer app class="px-8 py-4">
                <v-btn variant="text" :disabled="step <= 2" @click="prev" class="text-grey-darken-1">
                    Back
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn v-if="step < steps.length" color="#001f3f" size="large" class="px-8" @click="next">
                    Next
                </v-btn>

                <!-- <v-btn v-else color="#001f3f" size="large" class="px-8" :disabled=""
                    @click="">
                    Submit
                </v-btn> -->
            </v-footer>
        </v-card>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :timeout="4000" location="top right" elevation="8" rounded="xl"
            class="snackbar-modern" color="primary">
            <div class="d-flex align-center ga-3">
                <v-icon size="22" :color="snackbar.color">
                    {{ snackbar.color === 'success'
                        ? 'mdi-check-circle-outline'
                        : 'mdi-alert-circle-outline'
                    }}
                </v-icon>

                <div class="text-body-2 font-weight-medium">
                    {{ snackbar.message }}
                </div>

                <v-spacer />

                <v-btn icon size="x-small" variant="text" @click="snackbar.show = false">
                    <v-icon size="18">mdi-close</v-icon>
                </v-btn>
            </div>

            <div class="snackbar-strip" :class="snackbar.color" />
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useOnboadingApi } from "@/composables/apis/useOnboadingApi";
import { useOnboardingStore } from "@/stores/onboading";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const { VendorOnboardingAEPS } = useOnboadingApi();

const Onboarding = useOnboardingStore();
const router = useRouter();

const props = defineProps({ merchantId: String });

const snackbar = reactive({ show: false, message: "", color: "success" });

const steps = [
    { key: "onboarding-processing", label: "Onboarding Processing" },
    { key: "validate-otp", label: "OTP Validation" },
    { key: "pan-verification", label: "PAN Verification" },
    { key: "aadhar-verification", label: "Aadhar Verification" },
];

const title = computed(() => {
    switch (step.value) {
        case 1: return "ONBOARDING PROCESSING"
        case 2: return "OTP VALIDATION"
        case 3: return "PAN VERIFICATION"
        case 4: return "AADHAR VERIFICATION"
        default: return "MERCHANT ONBOARDING"
    }
});

const step = ref(1);
const prev = () => (step.value = Math.max(1, step.value - 1));

const next = async () => {

    if (step.value === 1) {
       
    }

    
    step.value++
}

onMounted(async () => {
    try {
        const payload = {
            merchantId: props.merchantId
        }
        console.log("AEPS Onboarding Initiate Payload", payload);
        
        const res = await VendorOnboardingAEPS(payload);
        
    } catch (err) {
        console.error("Failed to load payment methods options:", err);
    }
});
const loading = ref(false);
</script>