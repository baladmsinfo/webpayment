<template>
  <div class="success-wrapper" color="background">
    <div class="success-content text-center">
      <!-- Icon -->
      <div class="icon-wrapper mb-6">
        <v-icon size="64" color="success">
          mdi-check
        </v-icon>
      </div>

      <!-- Title -->
      <h1 class="text-h4 font-weight-bold mb-3">
        Onboarding Submitted
      </h1>

      <!-- Description -->
      <p class="text-body-1 text-medium-emphasis mb-6">
        Your merchant onboarding information has been successfully submitted.
        Our verification team will review the details and update the status shortly.
      </p>

      <!-- Status -->
      <v-sheet
        rounded="lg"
        class="pa-4 mb-8 status-box mx-auto"
        max-width="420"
        elevation="0"
      >
        <div class="d-flex align-center justify-center">
          <v-icon color="info" class="mr-2">mdi-timer-sand</v-icon>
          <span class="text-body-2 font-weight-medium">
            Current Status:
            <strong>Pending Verification</strong>
          </span>
        </div>
      </v-sheet>

      <!-- Actions -->
      <div class="action-buttons">
        <v-btn
          color="primary"
          size="large"
          class="mb-2"
          @click="goToPending"
        >
          View Pending Merchants
        </v-btn>

        <v-btn
          variant="outlined"
          size="large"
          prepend-icon="mdi-plus"
          @click="addAnother"
        >
          Add Another Merchant
        </v-btn>
      </div>

      <!-- Footer -->
      <p class="text-caption text-medium-emphasis mt-8">
        You can edit merchant details anytime while it’s under review.
      </p>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

function goToPending() {
  router.push('/aggregator/merchants/pending')
}

function addAnother() {
  router.push('/aggregator/onboarding')
}
</script>

<style scoped>
.success-wrapper {
  min-height: 100vh;       
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

/* Content wrapper */
.success-content {
  max-width: 520px;
  width: 100%;
}

/* Icon ring */
.icon-wrapper {
  width: 96px;
  height: 96px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 6px rgba(76, 175, 80, 0.18);
}

/* Status box */
.status-box {
  background-color: rgba(18, 101, 169, 0.08);
}

/* Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
