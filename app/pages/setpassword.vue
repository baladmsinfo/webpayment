<template>
  <div class="auth-wrapper auth-v1">
    <v-row class="bg-purple-darken-2" justify="center" align="center">
      <!-- Left Side Image -->
      <v-col cols="12" md="6" class="d-none d-md-flex">
        <v-img
          src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7963.jpg"
          max-height="100vh"
          class="h-screen"
          cover
        />
      </v-col>

      <!-- Set Password Card -->
      <v-col cols="12" md="6" class="d-flex align-center justify-center">
        <v-card width="420" class="pa-8" elevation="4" rounded="xl">
          <h2 class="text-h5 font-weight-bold text-center mb-2">Set New Password</h2>
          <p class="text-body-2 text-center mb-6 text-medium-emphasis">
            Please enter your new password below.
          </p>

          <v-form ref="formRef" v-model="valid" @submit.prevent="onSubmit">
            <v-text-field
              v-model="newPassword"
              label="New Password"
              type="password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock"
              :rules="[required, minLength]"
              class="mb-4"
            />

            <v-text-field
              v-model="confirmPassword"
              label="Confirm New Password"
              type="password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-check"
              :rules="[required, matchPassword]"
              class="mb-6"
            />

            <v-btn
              type="submit"
              block
              size="large"
              color="primary"
              class="rounded-lg"
              :loading="loading"
              :disabled="loading || confirmPassword !== newPassword || !newPassword || !confirmPassword"
            >
              Update Password
            </v-btn>
          </v-form>

          <!-- Feedback alert -->
          <v-alert
            v-if="message"
            class="mt-6"
            :type="messageType"
            variant="tonal"
            border="start"
            closable
            @click:close="message = ''"
          >
            {{ message }}
          </v-alert>

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
import { useRoute, useRouter } from "vue-router";
import { useUsersApi } from "../composables/apis/useUsersApi";

const { setPassword } = useUsersApi();

const route = useRoute();
const router = useRouter();

const token = route.query.token || "";
const formRef = ref(null);
const valid = ref(false);
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);

// feedback state
const message = ref("");
const messageType = ref("success");

const required = (v) => !!v || "This field is required";
const minLength = (v) => (v && v.length >= 6) || "Minimum 6 characters required";
const matchPassword = (v) => v === newPassword.value || "Passwords do not match";

async function onSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  message.value = "";

  try {
    const res = await setPassword({
      token,
      newPassword: newPassword.value,
    });

    if (res.data.statusCode === "00") {
      message.value = "Password updated successfully! Redirecting to login...";
      messageType.value = "success";
      setTimeout(() => router.push("/"), 2000);
    } else {
      message.value = res.message || "Failed to update password.";
      messageType.value = "error";
    }
  } catch (e) {
    console.error(e);
    message.value = "⚠️ Server error. Please try again.";
    messageType.value = "error";
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