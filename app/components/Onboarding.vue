<template>
    <v-container class="fill-height pa-4" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card class="pa-6" elevation="4" rounded="xl">
                    <v-card-title class="text-h5 text-center mb-4">
                        Create Account
                    </v-card-title>

                    <v-card-text>
                        <v-form v-model="valid" ref="formRef" fast-fail>
                            <v-text-field v-model="formData.name" label="Name" prepend-inner-icon="mdi-account"
                                :rules="[rules.required]" variant="outlined" density="comfortable"
                                @input="onInput('name', formData.name)" />

                            <v-text-field v-model="formData.email" label="Email" prepend-inner-icon="mdi-email"
                                :rules="[rules.required, rules.email]" variant="outlined" density="comfortable"
                                @input="onInput('email', formData.email)" />

                            <v-text-field v-model="formData.mobile_no" label="Mobile Number"
                                prepend-inner-icon="mdi-cellphone" :rules="[rules.required, rules.phone]"
                                variant="outlined" density="comfortable"
                                @input="onInput('mobile_no', formData.mobile_no)" />

                            <v-text-field v-model="formData.password" label="Password" prepend-inner-icon="mdi-lock"
                                :type="showPassword ? 'text' : 'password'"
                                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append-inner="showPassword = !showPassword"
                                :rules="[rules.required, rules.minPassword]" variant="outlined" density="comfortable"
                                @input="onInput('password', formData.password)" />

                            <v-btn block color="primary" class="mt-6" size="large" @click="register" :disabled="!valid">
                                Register
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>

                <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
                    {{ snackbar.message }}
                </v-snackbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUsersApi } from "@/composables/apis/useUsersApi";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
const { registor: registerApi } = useUsersApi();

import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
const { getAggregator } = useAggregatorApi();

const auth = useAuthStore();
const { aggregator } = storeToRefs(auth);

import { useRouter } from "vue-router";
const router = useRouter();

const valid = ref(false);
const showPassword = ref(false);
const formRef = ref(null);

const formData = reactive({
    name: "",
    email: "",
    password: "",
    mobile_no: "",
    interface: "",
    aggregator: "",
});

const rules = {
    required: (v) => !!v || "Required",
    email: (v) => /.+@.+\..+/.test(v) || "Invalid email",
    phone: (v) => /^\d{10}$/.test(v) || "Enter 10-digit number",
    minPassword: (v) => v.length >= 6 || "Min 6 characters",
};

const snackbar = reactive({
    show: false,
    message: "",
    color: "success",
});

const onInput = (field, value) => {
    formData[field] = value;
    if (formRef.value) formRef.value.validate();
};

const register = async () => {
    try {
        if (formRef.value?.validate()) {
            formData.interface = "ISG";
            formData.aggregator = aggregator.value?.id;

            const res = await registerApi(formData);
            console.log(res.data.data, "success");
            const merchantId = res.data.data.user.id;

            console.log("Decoded merchantId:", merchantId);

            if (res.data.statusCode === "00") {
                router.push({
                    path: '/aggregator/onboarding/kyc',
                    query: { merchantId: merchantId }
                });
                snackbar.message = res.data.message;
                snackbar.color = "success";
                snackbar.show = true;
            } else {
                snackbar.message = res.data.message;
                snackbar.color = "error";
                snackbar.show = true;
            }
        }
    } catch (e) {
        console.log("error", e);
        snackbar.message = e.response?.data?.message || "Something went wrong";
        snackbar.color = "error";
        snackbar.show = true;
    }
};

onMounted(async () => {
    await getAggregator();
    if (aggregator.value) {
        formData.aggregator = aggregator.value.id;
    }
});
</script>

<style scoped>
.v-card {
    border-radius: 16px;
    max-width: 450px;
    margin: auto;
}
</style>
