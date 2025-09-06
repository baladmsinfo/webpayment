<template>
  <div>
    <div  class="auth-wrapper  auth-v1">
      <v-row class="bg-purple-darken-2" justify="space-between">

        <v-col class="bg-white" cols="12" md="7" >
          <v-img
            class="h-screen ma-2 "
            max-height="100vh"
            contain
            src="https://img.freepik.com/free-vector/scan-pay-concept-illustration_114360-7415.jpg"
          />
        </v-col>


        <v-col
          cols="12"
          md="5"
          class="d-flex align-center justify-center bg-purple-darken-2"
        >
          <v-container max-width="400px">
            <h1 class="mb-10">Welcome</h1>
            <v-form ref="webFormRef" @submit.prevent="onSubmit">
              <v-text-field
                v-model="mobilenumber"
                :readonly="loading"
                variant="solo"
                :rules="[required]"
                label="Enter mobile number"
                clearable
                class="mb-4"
              />
              <v-text-field
                v-model="password"
                :readonly="loading"
                type="password"
                variant="solo"
                :rules="[required]"
                label="Enter password"
                clearable
                class="mb-6"
              />
              <v-btn
                :disabled="loading"
                :loading="loading"
                color="primary"
                size="large"
                type="submit"
                block
              >
                Login
              </v-btn>
            </v-form>
          </v-container>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { useUsersApi } from "@/composables/apis/useUsersApi";
const { SendOtp, verifyOtp,login } = useUsersApi();

import { useRouter } from "vue-router";
const router = useRouter();

definePageMeta({
  middleware: "guest",
});

// Refs
const formRef = ref(null);
const webFormRef = ref(null);

const step = ref("phone"); // 'phone' or 'otp'
const phone = ref("");
const mobilenumber = ref("");
const password = ref("");
const session = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

// OTP input state
const codes = ref(["", "", "", "", "", ""]);
const countdown = ref(0);
let timer = null;

// Rules
const required = (v) => !!v || "Required";
const phoneRule = (v) => {
  if (!v) return "Phone is required";
  if (!/^\+?\d{8,15}$/.test(v.replace(/\s/g, ""))) return "Invalid phone";
  return true;
};
const isInvalid = computed(() => codes.value.join("").length !== 6);

function focusNext(i) {
  const nodes = document.querySelectorAll(".otp-field input");
  if (codes.value[i] && i < nodes.length - 1) nodes[i + 1].focus();
}
function onBackspace(e, i) {
  if (!e.target.value && i > 0) {
    const nodes = document.querySelectorAll(".otp-field input");
    nodes[i - 1].focus();
  }
}

async function onSubmit() {
  const { valid } = await webFormRef.value.validate();
  if (!valid) return;

  try {
    // TODO: handle login API
    const res = await login({
      emailOrMobile: mobilenumber.value,
      password: password.value,
    });
    //console.log("RES:", res);
    router.push("/merchant");
    loading.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.rish-card {
  border-radius: 16px;
}
.rish-btn {
  background: linear-gradient(90deg, #5b5bf0, #8b5cf6);
  color: white;
}
.otp-inputs {
  gap: 8px;
}
.otp-field {
  width: 48px;
  text-align: center;
}
</style>
