<template>
  <div class="page-root">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Settings</h1>
        <p class="page-sub">{{ profile?.data?.dba_name || 'Manage your wallet account' }}</p>
      </div>
      <div class="vendor-status-badge" v-if="profile">
        <span class="status-dot"></span>
        <span>Active Account</span>
      </div>
    </div>

    <!-- ── Content Grid ── -->
    <div class="settings-grid">

      <!-- Profile Card -->
      <div class="profile-card">
        <template v-if="profile">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar">{{ initials(profile?.data?.name) }}</div>
            <div class="profile-online-ring"></div>
          </div>
          <div class="profile-name">{{ profile?.data?.name }}</div>
          <div class="profile-email">{{ profile?.data?.primary_email_id }}</div>
          <div class="profile-chip">
            <span class="mdi mdi-identifier"></span>
            {{ profile?.code }}
          </div>
          <div class="profile-chip profile-chip-balance">
            <span class="mdi mdi-wallet-outline"></span>
            ₹ {{ profile?.balance }}
          </div>
        </template>
        <template v-else>
          <div class="skel skel-avatar-lg"></div>
          <div class="skel skel-line-md mt-3"></div>
          <div class="skel skel-line-sm mt-2"></div>
        </template>
      </div>

      <!-- Info Details Card -->
      <div class="info-card">
        <div class="info-card-header">
          <h2 class="info-card-title">Account Details</h2>
          <span class="info-card-badge">Read Only</span>
        </div>

        <template v-if="profile">
          <div class="info-rows">

            <div class="info-row">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-store-outline"></span></div>
                <span class="info-row-label">Business Name</span>
              </div>
              <span class="info-row-value info-row-value-plain">{{ profile?.data?.dba_name }}</span>
            </div>

            <div class="info-row">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-account-outline"></span></div>
                <span class="info-row-label">Full Name</span>
              </div>
              <span class="info-row-value info-row-value-plain">{{ profile?.data?.name }}</span>
            </div>

            <div class="info-row">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-identifier"></span></div>
                <span class="info-row-label">Wallet Code</span>
              </div>
              <div class="info-row-value">
                <span class="mono-val">{{ profile?.code }}</span>
                <button class="copy-btn" @click="copy(profile?.code)" title="Copy Code">
                  <span class="mdi" :class="copied === profile?.code ? 'mdi-check' : 'mdi-content-copy'"></span>
                </button>
              </div>
            </div>

            <div class="info-row">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-key-outline"></span></div>
                <span class="info-row-label">Wallet ID</span>
              </div>
              <div class="info-row-value">
                <span class="mono-val mono-val-truncate">{{ profile?.data?.id }}</span>
                <button class="copy-btn" @click="copy(profile?.data?.id)" title="Copy ID">
                  <span class="mdi" :class="copied === profile?.data?.id ? 'mdi-check' : 'mdi-content-copy'"></span>
                </button>
              </div>
            </div>

            <div class="info-row">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-email-outline"></span></div>
                <span class="info-row-label">Email Address</span>
              </div>
              <div class="info-row-value">
                <span class="info-text">{{ profile?.data?.primary_email_id }}</span>
                <button class="copy-btn" @click="copy(profile?.data?.primary_email_id)">
                  <span class="mdi" :class="copied === profile?.data?.primary_email_id ? 'mdi-check' : 'mdi-content-copy'"></span>
                </button>
              </div>
            </div>

            <div class="info-row">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-phone-outline"></span></div>
                <span class="info-row-label">Mobile</span>
              </div>
              <span class="info-row-value info-row-value-plain">{{ profile?.data?.primary_mobile }}</span>
            </div>

            <div class="info-row">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-shield-check-outline"></span></div>
                <span class="info-row-label">KYC Status</span>
              </div>
              <span
                class="kyc-badge"
                :class="profile?.data?.kyc ? 'kyc-verified' : 'kyc-pending'"
              >
                <span class="mdi" :class="profile?.data?.kyc ? 'mdi-check-circle-outline' : 'mdi-clock-outline'"></span>
                {{ profile?.data?.kyc ? 'Verified' : 'Pending' }}
              </span>
            </div>

            <div class="info-row" style="border-bottom: none;">
              <div class="info-row-left">
                <div class="info-row-icon"><span class="mdi mdi-wallet-outline"></span></div>
                <span class="info-row-label">Balance</span>
              </div>
              <span class="balance-val">₹ {{ profile?.balance }}</span>
            </div>

          </div>
        </template>

        <template v-else>
          <div class="info-rows">
            <div class="info-row" v-for="i in 7" :key="i" :style="i === 7 ? 'border-bottom:none' : ''">
              <div class="skel skel-line-icon"></div>
              <div class="skel skel-line-md"></div>
              <div class="skel skel-line-val"></div>
            </div>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({ layout: "walletservicelayer", middleware: "auth" });

const authStore = useAuthStore();

// walletProfile is { statusCode, message, data: { balance, code, data: {...}, id, kyc, ... } }
const profile = computed(() => authStore.walletProfile?.data);

const initials = (n) =>
  (n || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const copied = ref("");
async function copy(val) {
  if (!val) return;
  try {
    await navigator.clipboard.writeText(val);
    copied.value = val;
    setTimeout(() => { copied.value = ""; }, 2000);
  } catch {}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.page-root {
  font-family: 'DM Sans', sans-serif;
  display: flex; flex-direction: column; gap: 16px;
  padding: 16px;
}

/* ── Header ── */
.page-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.page-title { font-size: 20px; font-weight: 700; color: #0f172a; }
@media (min-width: 640px) { .page-title { font-size: 24px; } }
.page-sub { font-size: 12px; color: #64748b; margin-top: 3px; }

.vendor-status-badge {
  display: flex; align-items: center; gap: 6px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  padding: 5px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; color: #15803d;
  align-self: flex-start;
}
.status-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,.25);
  animation: pulse-g 2s ease-in-out infinite;
}
@keyframes pulse-g { 0%,100%{box-shadow:0 0 0 2px rgba(34,197,94,.25)} 50%{box-shadow:0 0 0 5px rgba(34,197,94,.08)} }

/* ── Grid ── */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 768px) {
  .settings-grid { grid-template-columns: 240px 1fr; }
}

/* ── Profile Card ── */
.profile-card {
  background: linear-gradient(135deg, #1142d4 0%, #2255e8 100%);
  border-radius: 14px; padding: 28px 20px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 8px;
  box-shadow: 0 8px 24px rgba(17,66,212,.2);
  position: relative; overflow: hidden;
}
.profile-card::before {
  content: ''; position: absolute; top: -40px; right: -40px;
  width: 120px; height: 120px; border-radius: 50%;
  background: rgba(255,255,255,.07);
}
.profile-card::after {
  content: ''; position: absolute; bottom: -30px; left: -30px;
  width: 90px; height: 90px; border-radius: 50%;
  background: rgba(255,255,255,.05);
}

.profile-avatar-wrap { position: relative; z-index: 1; }
.profile-avatar {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(255,255,255,.2);
  border: 3px solid rgba(255,255,255,.4);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px; font-weight: 800; color: #fff;
}
.profile-online-ring {
  position: absolute; bottom: 3px; right: 3px;
  width: 14px; height: 14px; border-radius: 50%;
  background: #22c55e; border: 2px solid #fff;
}
.profile-name  { font-size: 15px; font-weight: 700; color: #fff; position: relative; z-index: 1; }
.profile-email { font-size: 11px; color: rgba(255,255,255,.7); position: relative; z-index: 1; }
.profile-chip {
  display: flex; align-items: center; gap: 5px;
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.2);
  padding: 4px 12px; border-radius: 9999px;
  font-size: 11px; font-weight: 700; color: #fff;
  position: relative; z-index: 1; margin-top: 4px;
}
.profile-chip .mdi { font-size: 13px; }
.profile-chip-balance {
  background: rgba(34,197,94,.25); border-color: rgba(34,197,94,.4);
}

/* ── Info Card ── */
.info-card {
  background: #fff; border: 1px solid #e8edf3;
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(0,0,0,.04);
  overflow: hidden;
}
.info-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
}
.info-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.info-card-badge {
  font-size: 10px; font-weight: 700;
  background: #f1f5f9; color: #64748b;
  padding: 3px 10px; border-radius: 9999px;
  text-transform: uppercase; letter-spacing: .05em;
}

.info-rows { display: flex; flex-direction: column; }
.info-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 20px; border-bottom: 1px solid #f8fafc;
  gap: 12px; flex-wrap: wrap;
}
.info-row-left { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.info-row-icon {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(17,66,212,.07); color: #1142d4;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.info-row-label { font-size: 12px; font-weight: 600; color: #64748b; white-space: nowrap; }
.info-row-value {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #1e293b; min-width: 0;
}
.info-row-value-plain { font-size: 13px; font-weight: 600; color: #1e293b; }
.mono-val { font-family: 'DM Mono', monospace; font-size: 12px; color: #334155; }
.mono-val-truncate { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.info-text { font-size: 13px; color: #334155; }

.copy-btn {
  width: 24px; height: 24px; border-radius: 6px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: #94a3b8; cursor: pointer;
  transition: all .13s; flex-shrink: 0;
}
.copy-btn:hover { background: rgba(17,66,212,.07); color: #1142d4; border-color: rgba(17,66,212,.2); }
.copy-btn .mdi-check { color: #22c55e; }

/* KYC badge */
.kyc-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 9999px;
  font-size: 11px; font-weight: 700;
}
.kyc-verified { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.kyc-pending  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

/* Balance value */
.balance-val {
  font-size: 15px; font-weight: 800; color: #1142d4;
  font-family: 'DM Mono', monospace;
}

/* ── Skeleton ── */
.skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e8edf3 50%,#f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.skel-avatar-lg  { width: 72px; height: 72px; border-radius: 50%; }
.skel-line-md    { height: 14px; width: 70%; }
.skel-line-sm    { height: 11px; width: 50%; }
.skel-line-icon  { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; }
.skel-line-val   { height: 12px; width: 30%; margin-left: auto; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
</style>