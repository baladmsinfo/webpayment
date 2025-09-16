<template>
  <div class="auth-wrapper auth-v1">
    <v-row class="bg-purple-darken-2" justify="center" align="center">
      <!-- Left Side Image -->
      <v-col cols="12" md="6" class="d-none d-md-flex">
        <v-img
          src="https://img.freepik.com/free-vector/scan-pay-concept-illustration_114360-7415.jpg"
          max-height="100vh"
          class="h-screen"
          cover
        />
      </v-col>

      <!-- Forgot Password Card -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center">
        <v-card width="420" class="pa-8" elevation="4" rounded="xl">
          <h2 class="text-h5 font-weight-bold text-center mb-2">Forgot Password?</h2>
          <p class="text-body-2 text-center mb-6 text-medium-emphasis">
            Enter your registered email or mobile number to receive reset instructions.
          </p>

          <v-form ref="formRef" v-model="valid" @submit.prevent="onSubmit">
            <v-text-field
              v-model="identifier"
              label="Email or Mobile"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account"
              :rules="[required]"
              class="mb-6"
              clearable
            />

            <v-btn
              type="submit"
              block
              size="large"
              color="primary"
              class="rounded-lg"
              :loading="loading"
            >
              Send Reset Link
            </v-btn>
          </v-form>

          <!-- Back to login -->
          <div class="text-center mt-6">
            <a
              href="#"
              class="text-primary text-body-2 font-weight-medium"
              @click.prevent="router.push('/')"
            >
              Back to Login
            </a>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersApi } from "../composables/apis/useUsersApi";

const { forgotPassword } = useUsersApi();

const router = useRouter();
const formRef = ref(null);
const valid = ref(false);
const identifier = ref("");
const loading = ref(false);

const required = (v) => !!v || "This field is required";
async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    const res = await forgotPassword(identifier.value);

    console.log("Forgot password API result:", res);

    if (res.statusCode === "00") {
      message.value = res.message || "Password reset instructions sent!";
    } else {
      errorMessage.value = res.message || "Something went wrong";
    }
  } catch (e) {
    console.error(e);
    errorMessage.value = "Server error. Please try again.";
  } finally {
    loading.value = false;
  }
}

</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
}
</style>
