<template>
  <div class="kyc-banner">
    <div class="kyc-banner-accent" />

    <div class="kyc-banner-icon">
      <v-icon size="22" color="#b45309">mdi-alert-circle-outline</v-icon>
    </div>

    <div class="kyc-banner-body">
      <p class="kyc-banner-title">Complete your KYC Verification</p>
      <p class="kyc-banner-sub">
        Your distributor account is almost ready. Please select your business type and upload the required
        documents to submit them for verification.
      </p>
    </div>

    <button class="kyc-banner-btn" @click="router.push('/vendor/onboarding/self')">
      Complete KYC
      <v-icon size="16">mdi-arrow-right</v-icon>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped>
.kyc-banner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%);
  border: 1px solid #fde9b8;
  border-radius: 16px;
  padding: 16px 20px 16px 22px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(180, 83, 9, 0.06);
}

.kyc-banner-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #f59e0b, #b45309);
}

@media (max-width: 640px) {
  .kyc-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}

.kyc-banner-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(180, 83, 9, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kyc-banner-body { flex: 1; min-width: 0; }

.kyc-banner-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: #92400e;
  margin: 0 0 3px;
  letter-spacing: -0.1px;
}

.kyc-banner-sub {
  font-size: 0.8rem;
  color: #a16207;
  margin: 0;
  line-height: 1.55;
}

.kyc-banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #1142d4 0%, #1a52f5 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  font-size: 0.83rem;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(17, 66, 212, 0.28);
  transition: filter 0.15s, box-shadow 0.15s, transform 0.1s;
}

.kyc-banner-btn:hover { filter: brightness(1.07); box-shadow: 0 6px 18px rgba(17, 66, 212, 0.34); }
.kyc-banner-btn:active { transform: scale(0.98); }

@media (max-width: 640px) {
  .kyc-banner-btn { width: 100%; justify-content: center; }
}
</style>
