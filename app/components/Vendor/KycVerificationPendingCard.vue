<template>
  <div class="kyc-banner">
    <div class="kyc-banner-accent" />

    <div class="kyc-banner-icon">
      <v-icon size="22" color="#0e7490">mdi-clock-outline</v-icon>
    </div>

    <div class="kyc-banner-body">
      <p class="kyc-banner-title">Verification in Progress</p>
      <p class="kyc-banner-sub">
        Your documents have been submitted and are currently under review. We'll notify you once your distributor
        account is approved — this usually takes 24-48 hours.
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.kyc-banner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #ecfeff 0%, #f0f9ff 100%);
  border: 1px solid #a5f3fc;
  border-radius: 16px;
  padding: 16px 20px 16px 22px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(14, 116, 144, 0.06);
}

.kyc-banner-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #22d3ee, #0e7490);
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
  box-shadow: 0 2px 8px rgba(14, 116, 144, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kyc-banner-body { flex: 1; min-width: 0; }

.kyc-banner-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: #155e75;
  margin: 0 0 3px;
  letter-spacing: -0.1px;
}

.kyc-banner-sub {
  font-size: 0.8rem;
  color: #0e7490;
  margin: 0;
  line-height: 1.55;
}
</style>
