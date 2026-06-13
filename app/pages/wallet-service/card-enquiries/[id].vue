<template>
  <div class="detail-page">

    <!-- Loading Skeleton -->
    <div v-if="detailLoading" class="sk-page">
      <div class="sk sk-header-row"></div>
      <div class="sk-body">
        <div class="sk sk-main"></div>
        <div class="sk sk-side"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="detailError" class="error-container">
      <v-icon size="48" color="#ba1a1a">mdi-alert-circle-outline</v-icon>
      <h2>Failed to Load Enquiry</h2>
      <p>{{ detailError }}</p>
      <button class="retry-btn" @click="load">
        <v-icon size="16">mdi-refresh</v-icon> Try Again
      </button>
    </div>

    <!-- Main Content -->
    <template v-else-if="currentEnquiry">

      <!-- ── Page Header ── -->
      <div class="page-header">
        <div class="page-title-wrap">
          <router-link to="/wallet-service/card-enquiries" class="back-btn">
            <v-icon size="18">mdi-arrow-left</v-icon>
          </router-link>
          <div>
            <div class="enq-no-title">{{ currentEnquiry.enquiryNo }}</div>
            <p class="page-sub">Card Enquiry Detail</p>
          </div>
        </div>

        <div class="header-actions">
          <button
            v-if="currentEnquiry.status === 'DRAFT'"
            class="submit-btn"
            :disabled="actionLoading"
            @click="handleSubmit"
          >
            <v-icon size="16" class="mr-1">mdi-send-outline</v-icon>
            Submit Enquiry
          </button>

          <button
            v-if="!['CANCELLED','DELIVERED','REJECTED'].includes(currentEnquiry.status)"
            class="cancel-action-btn"
            :disabled="actionLoading"
            @click="cancelConfirm = true"
          >
            <v-icon size="16" class="mr-1">mdi-cancel</v-icon>
            Cancel
          </button>
        </div>
      </div>

      <!-- ── Status Banner ── -->
      <div class="status-banner" :class="bannerClass(currentEnquiry.status)">
        <div class="banner-left">
          <v-icon size="20">{{ statusIcon(currentEnquiry.status) }}</v-icon>
          <div>
            <span class="banner-status">{{ currentEnquiry.status }}</span>
            <span class="banner-msg">{{ statusMessage(currentEnquiry.status) }}</span>
          </div>
        </div>
        <div class="banner-right">
          <div class="banner-item">
            <span class="bi-label">Payment</span>
            <span class="status-pill" :class="paymentStatusClass(currentEnquiry.paymentStatus)">
              {{ currentEnquiry.paymentStatus }}
            </span>
          </div>
          <div class="banner-item">
            <span class="bi-label">Fulfillment</span>
            <span class="status-pill" :class="fulfillmentStatusClass(currentEnquiry.fulfillmentStatus)">
              {{ currentEnquiry.fulfillmentStatus }}
            </span>
          </div>
        </div>
      </div>

      <!-- ── Main Grid ── -->
      <div class="detail-grid">

        <!-- ── Left: Main Details ── -->
        <div class="left-col">

          <!-- Card Order Details Panel -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-credit-card-outline</v-icon>
                Order Details
              </span>
            </div>
            <div class="details-grid">
              <div class="detail-item full highlight">
                <span class="di-label">Cards Requested</span>
                <span class="di-value big">{{ currentEnquiry.noOfCards }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Details Panel -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-currency-inr</v-icon>
                Payment Details
              </span>
            </div>
            <div class="details-grid">
              <div class="detail-item">
                <span class="di-label">Payment Status</span>
                <span class="status-pill" :class="paymentStatusClass(currentEnquiry.paymentStatus)">
                  {{ currentEnquiry.paymentStatus }}
                </span>
              </div>
              <!-- paymentStatus states helper hint -->
              <div class="detail-item">
                <span class="di-label">Instructions</span>
                <span class="di-value small">{{ paymentInstruction(currentEnquiry.paymentStatus) }}</span>
              </div>
            </div>
          </div>

          <!-- Fulfillment & Delivery Panel -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-truck-delivery-outline</v-icon>
                Fulfillment &amp; Delivery
              </span>
            </div>
            <div class="details-grid">
              <div class="detail-item">
                <span class="di-label">Fulfillment Status</span>
                <span class="status-pill" :class="fulfillmentStatusClass(currentEnquiry.fulfillmentStatus)">
                  {{ currentEnquiry.fulfillmentStatus }}
                </span>
              </div>
              <div class="detail-item">
                <span class="di-label">Tracking Number</span>
                <span class="di-value mono">{{ currentEnquiry.trackingNumber || '—' }}</span>
              </div>
              <div class="detail-item">
                <span class="di-label">Dispatched On</span>
                <span class="di-value">{{ currentEnquiry.dispatchedAt ? formatDateTime(currentEnquiry.dispatchedAt) : '—' }}</span>
              </div>
              <div class="detail-item">
                <span class="di-label">Delivered On</span>
                <span class="di-value">{{ currentEnquiry.deliveredAt ? formatDateTime(currentEnquiry.deliveredAt) : '—' }}</span>
              </div>
            </div>

            <!-- Delivery Progress -->
            <div class="delivery-progress">
              <div
                v-for="(step, idx) in deliverySteps"
                :key="step.key"
                class="progress-step"
                :class="{ done: isStepDone(step.key), active: isStepActive(step.key) }"
              >
                <div class="step-icon">
                  <v-icon size="14">{{ step.icon }}</v-icon>
                </div>
                <div class="step-line" v-if="idx < deliverySteps.length - 1"></div>
                <span class="step-label">{{ step.label }}</span>
              </div>
            </div>
          </div>

          <!-- Delivery Address Panel -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-map-marker-outline</v-icon>
                Delivery Address
              </span>
            </div>

            <div v-if="currentEnquiry.address" class="address-card">
              <div class="addr-row">
                <v-icon size="14" color="#1a6fc4" class="mr-1">mdi-office-building-outline</v-icon>
                <span class="addr-official">{{ currentEnquiry.address.official_address }}</span>
              </div>
              <div class="addr-lines">
                <span>{{ currentEnquiry.address.address1 }}</span>
                <span v-if="currentEnquiry.address.address2">{{ currentEnquiry.address.address2 }}</span>
                <span v-if="currentEnquiry.address.address3">{{ currentEnquiry.address.address3 }}</span>
                <span>
                  {{ currentEnquiry.address.city }}, {{ currentEnquiry.address.state }}
                  – {{ currentEnquiry.address.pincode }}
                </span>
              </div>
              <div class="addr-mobile" v-if="currentEnquiry.address.mobile_number">
                <v-icon size="13" class="mr-1">mdi-phone-outline</v-icon>
                {{ currentEnquiry.address.mobile_number }}
              </div>
            </div>

            <div v-else class="no-address-box">
              <v-icon size="20" color="#c4881a">mdi-map-marker-off-outline</v-icon>
              <span>No delivery address linked to this enquiry.</span>
            </div>
          </div>
        </div>

        <!-- ── Right: Meta ── -->
        <div class="right-col">

          <!-- Enquiry Info -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-information-outline</v-icon>
                Enquiry Info
              </span>
            </div>
            <div class="meta-list">
              <div class="meta-row">
                <span class="meta-label">Enquiry No</span>
                <span class="meta-val mono">{{ currentEnquiry.enquiryNo }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Applied On</span>
                <span class="meta-val">{{ formatDateTime(currentEnquiry.createdAt) }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Last Updated</span>
                <span class="meta-val">{{ formatDateTime(currentEnquiry.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Remarks -->
          <div class="panel" v-if="currentEnquiry.remarks">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-comment-text-outline</v-icon>
                Remarks
              </span>
            </div>
            <p class="remarks-text">{{ currentEnquiry.remarks }}</p>
          </div>

          <!-- Quick Actions (DRAFT only) -->
          <div class="panel" v-if="currentEnquiry.status === 'DRAFT'">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-lightning-bolt-outline</v-icon>
                Quick Actions
              </span>
            </div>
            <div class="quick-actions">
              <button class="qa-btn primary" :disabled="actionLoading" @click="handleSubmit">
                <v-icon size="16">mdi-send-outline</v-icon>
                Submit for Approval
              </button>
              <button class="qa-btn danger" :disabled="actionLoading" @click="deleteConfirm = true">
                <v-icon size="16">mdi-trash-can-outline</v-icon>
                Delete Draft
              </button>
            </div>
          </div>

          <!-- Status Timeline (non-DRAFT) -->
          <div class="panel" v-if="currentEnquiry.status !== 'DRAFT'">
            <div class="panel-header">
              <span class="panel-title">
                <v-icon size="16" class="mr-1">mdi-timeline-outline</v-icon>
                Status History
              </span>
            </div>
            <div class="timeline">
              <div
                v-for="event in timelineEvents"
                :key="event.label"
                class="tl-event"
                :class="{ done: event.done, active: event.active }"
              >
                <div class="tl-dot">
                  <v-icon size="10">{{ event.icon }}</v-icon>
                </div>
                <div class="tl-body">
                  <span class="tl-label">{{ event.label }}</span>
                  <span class="tl-hint">{{ event.hint }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ══════════════════════════════════════════════════════════
         CANCEL CONFIRM
    ═══════════════════════════════════════════════════════════ -->
    <div v-if="cancelConfirm" class="modal-backdrop" @click.self="cancelConfirm = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2 class="modal-title">
            <v-icon size="18" class="mr-2" color="#c4881a">mdi-cancel</v-icon>
            Cancel Enquiry
          </h2>
          <button class="modal-close" @click="cancelConfirm = false">
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>
        <div class="modal-body">
          <p class="confirm-text" style="margin-bottom:12px;">
            Cancel enquiry <strong>{{ currentEnquiry?.enquiryNo }}</strong>?
          </p>
          <div class="form-field">
            <label class="field-label">Reason (optional)</label>
            <input
              v-model="cancelReason"
              type="text"
              class="field-input"
              placeholder="Reason for cancellation"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelConfirm = false">Go Back</button>
          <button class="warn-btn" :disabled="actionLoading" @click="doCancel">
            <v-icon v-if="actionLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Confirm Cancel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════
         DELETE CONFIRM
    ═══════════════════════════════════════════════════════════ -->
    <div v-if="deleteConfirm" class="modal-backdrop" @click.self="deleteConfirm = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2 class="modal-title danger-title">
            <v-icon size="18" class="mr-2" color="#ba1a1a">mdi-alert-circle-outline</v-icon>
            Delete Enquiry
          </h2>
          <button class="modal-close" @click="deleteConfirm = false">
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>
        <div class="modal-body">
          <p class="confirm-text">
            Permanently delete <strong>{{ currentEnquiry?.enquiryNo }}</strong>?
            This action cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="deleteConfirm = false">Cancel</button>
          <button class="delete-btn" :disabled="actionLoading" @click="doDelete">
            <v-icon v-if="actionLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMsg" class="toast" :class="toastType">
      <v-icon size="16">{{ toastType === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      <span>{{ toastMsg }}</span>
      <button class="toast-close" @click="toastMsg = ''">
        <v-icon size="14">mdi-close</v-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "walletservicelayer",
  middleware: "auth",
});

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCardEnquiryApi } from "@/composables/apis/useCardEnquiryApi";

const route      = useRoute();
const enquiryId  = route.params.id;

const {
  currentEnquiry, detailLoading, detailError,
  fetchEnquiry, submitEnquiry, cancelEnquiry, deleteEnquiry,
} = useCardEnquiryApi();

const actionLoading = ref(false);
const cancelConfirm = ref(false);
const deleteConfirm = ref(false);
const cancelReason  = ref("");

// ── Load ───────────────────────────────────────────────────────────────────
const load = () => fetchEnquiry(enquiryId);
onMounted(load);

// ── Actions ────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  actionLoading.value = true;
  try {
    const res = await submitEnquiry(enquiryId);
    if (res?.statusCode === "00") {
      showToast("Enquiry submitted for approval!", "success");
      load();
    } else {
      showToast(res?.message || "Submit failed", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    actionLoading.value = false;
  }
};

const doCancel = async () => {
  actionLoading.value = true;
  try {
    const res = await cancelEnquiry(enquiryId, cancelReason.value || undefined);
    if (res?.statusCode === "00") {
      showToast("Enquiry cancelled", "success");
      cancelConfirm.value = false;
      load();
    } else {
      showToast(res?.message || "Cancel failed", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    actionLoading.value = false;
  }
};

const doDelete = async () => {
  actionLoading.value = true;
  try {
    const res = await deleteEnquiry(enquiryId);
    if (res?.statusCode === "00") {
      showToast("Enquiry deleted", "success");
      navigateTo("/wallet-service/card-enquiries");
    } else {
      showToast(res?.message || "Delete failed", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    actionLoading.value = false;
  }
};

// ── Delivery Progress steps ────────────────────────────────────────────────
// Maps across both EnquiryStatus and FulfillmentStatus since the full
// lifecycle spans both enums in the schema.
const deliverySteps = [
  { key: "SUBMITTED",  label: "Submitted",  icon: "mdi-send-outline"                },
  { key: "APPROVED",   label: "Approved",   icon: "mdi-check-circle-outline"         },
  { key: "PROCESSING", label: "Processing", icon: "mdi-cog-outline"                  },
  { key: "DISPATCHED", label: "Dispatched", icon: "mdi-truck-outline"                },
  { key: "DELIVERED",  label: "Delivered",  icon: "mdi-package-variant-closed-check" },
];

const isStepDone = (key) => {
  const enq = currentEnquiry.value;
  if (!enq) return false;
  if (key === "SUBMITTED")  return ["SUBMITTED", "APPROVED", "CANCELLED"].includes(enq.status);
  if (key === "APPROVED")   return enq.status === "APPROVED";
  if (key === "PROCESSING") return ["PROCESSING", "DISPATCHED", "DELIVERED"].includes(enq.fulfillmentStatus);
  if (key === "DISPATCHED") return ["DISPATCHED", "DELIVERED"].includes(enq.fulfillmentStatus);
  if (key === "DELIVERED")  return enq.fulfillmentStatus === "DELIVERED";
  return false;
};

const isStepActive = (key) => {
  const enq = currentEnquiry.value;
  if (!enq) return false;
  if (key === "SUBMITTED"  && enq.status === "SUBMITTED")                                      return true;
  if (key === "APPROVED"   && enq.status === "APPROVED" && enq.fulfillmentStatus === "PENDING") return true;
  if (key === "PROCESSING" && enq.fulfillmentStatus === "PROCESSING")                           return true;
  if (key === "DISPATCHED" && enq.fulfillmentStatus === "DISPATCHED")                           return true;
  return false;
};

// ── Status Timeline (right-col, non-draft) ────────────────────────────────
const timelineEvents = computed(() => {
  const enq = currentEnquiry.value;
  if (!enq) return [];

  const statusOrder = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "CANCELLED"];
  const curIdx      = statusOrder.indexOf(enq.status);

  return [
    {
      label:  "Created",
      hint:   formatDateTime(enq.createdAt),
      icon:   "mdi-plus",
      done:   true,
      active: false,
    },
    {
      label:  "Submitted",
      hint:   ["SUBMITTED","APPROVED","REJECTED","CANCELLED"].includes(enq.status) ? "Sent for review" : "Pending",
      icon:   "mdi-send-outline",
      done:   curIdx >= 1,
      active: enq.status === "SUBMITTED",
    },
    {
      label:  "Approved",
      hint:   enq.status === "APPROVED" ? "Ready for fulfillment" : (enq.status === "REJECTED" ? "Rejected" : "Awaiting"),
      icon:   enq.status === "REJECTED" ? "mdi-close-circle-outline" : "mdi-check-circle-outline",
      done:   enq.status === "APPROVED",
      active: enq.status === "REJECTED",
    },
    {
      label:  "Fulfillment",
      hint:   enq.fulfillmentStatus,
      icon:   "mdi-cog-outline",
      done:   ["PROCESSING","DISPATCHED","DELIVERED"].includes(enq.fulfillmentStatus),
      active: enq.fulfillmentStatus === "PROCESSING",
    },
    {
      label:  "Delivered",
      hint:   enq.deliveredAt ? formatDateTime(enq.deliveredAt) : "Pending",
      icon:   "mdi-package-variant-closed-check",
      done:   enq.fulfillmentStatus === "DELIVERED",
      active: enq.fulfillmentStatus === "DISPATCHED",
    },
  ];
});

// ── Status helpers ─────────────────────────────────────────────────────────
const bannerClass = (s) => ({
  "banner-draft":     s === "DRAFT",
  "banner-submitted": s === "SUBMITTED",
  "banner-approved":  s === "APPROVED",
  "banner-rejected":  s === "REJECTED",
  "banner-cancelled": s === "CANCELLED",
});

const statusIcon = (s) => ({
  DRAFT:     "mdi-pencil-outline",
  SUBMITTED: "mdi-clock-outline",
  APPROVED:  "mdi-check-circle-outline",
  REJECTED:  "mdi-close-circle-outline",
  CANCELLED: "mdi-cancel",
}[s] ?? "mdi-information-outline");

const statusMessage = (s) => ({
  DRAFT:     "This enquiry is saved as a draft. Submit it to begin processing.",
  SUBMITTED: "Your enquiry is under review. You'll be notified on approval.",
  APPROVED:  "Enquiry approved! Cards are being prepared for dispatch.",
  REJECTED:  "This enquiry was rejected. Please contact support for details.",
  CANCELLED: "This enquiry has been cancelled.",
}[s] ?? "");

const paymentInstruction = (s) => ({
  UNPAID:   "Payment is pending. Our team will reach out with payment details.",
  PAID:     "Payment received. Cards will be dispatched shortly.",
  FAILED:   "Payment failed. Please contact support.",
  REFUNDED: "A refund has been processed for this enquiry.",
}[s] ?? "");

const paymentStatusClass = (s) => ({
  "pill-unpaid":   s === "UNPAID",
  "pill-paid":     s === "PAID",
  "pill-failed":   s === "FAILED",
  "pill-refunded": s === "REFUNDED",
});

const fulfillmentStatusClass = (s) => ({
  "pill-pending":    s === "PENDING",
  "pill-processing": s === "PROCESSING",
  "pill-dispatched": s === "DISPATCHED",
  "pill-delivered":  s === "DELIVERED",
  "pill-failed":     s === "FAILED",
});

// ── Utilities ──────────────────────────────────────────────────────────────
const formatDateTime = (s) => {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// Toast
const toastMsg  = ref("");
const toastType = ref("success");
const showToast = (msg, type = "success") => {
  toastMsg.value  = msg;
  toastType.value = type;
  setTimeout(() => { toastMsg.value = ""; }, 4000);
};
</script>

<style scoped>
* { box-sizing: border-box; }

.detail-page {
  padding: 24px;
  background: #f7f6f3;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Header ── */
.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title-wrap { display: flex; align-items: center; gap: 14px; }
.back-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: #fff; border: 1px solid #eceae3;
  display: flex; align-items: center; justify-content: center;
  color: #1a1a1a; text-decoration: none; transition: background .15s;
}
.back-btn:hover { background: #f0ede8; }
.enq-no-title { font-family: "Courier New", monospace; font-size: 20px; font-weight: 700; color: #1a1a1a; letter-spacing: .5px; }
.page-sub { margin: 2px 0 0; font-size: 12px; color: #888780; }
.header-actions { display: flex; gap: 8px; align-items: center; }

.submit-btn, .cancel-action-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 9px 18px; border-radius: 50px;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: background .15s; border: none;
}
.submit-btn { background: #1a6fc4; color: #fff; }
.submit-btn:hover:not(:disabled) { background: #155da0; }
.cancel-action-btn { background: #f5f0e8; color: #c4881a; border: 1px solid #f5d680; }
.cancel-action-btn:hover:not(:disabled) { background: #fff8e0; }
.submit-btn:disabled, .cancel-action-btn:disabled { opacity: .6; cursor: not-allowed; }

/* ── Status Banner ── */
.status-banner {
  border-radius: 14px; padding: 16px 20px;
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
}
.banner-draft     { background: #f5f5f3; border: 1px solid #e0dcd8; color: #555552; }
.banner-submitted { background: #eef5fd; border: 1px solid #c2d9f0; color: #1a6fc4; }
.banner-approved  { background: #eaf3de; border: 1px solid #c2e0a0; color: #3b6d11; }
.banner-rejected  { background: #fcebeb; border: 1px solid #f5ccc8; color: #a32d2d; }
.banner-cancelled { background: #f5f5f3; border: 1px solid #e0dcd8; color: #888780; }

.banner-left  { display: flex; align-items: center; gap: 12px; }
.banner-status { font-size: 14px; font-weight: 700; display: block; }
.banner-msg    { font-size: 12px; opacity: .8; display: block; margin-top: 2px; }
.banner-right  { display: flex; align-items: center; gap: 16px; }
.banner-item   { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
.bi-label      { font-size: 10px; font-weight: 600; text-transform: uppercase; opacity: .7; }

/* ── Grid ── */
.detail-grid {
  display: grid; grid-template-columns: 1fr 320px; gap: 16px; align-items: start;
}
@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } }
.left-col, .right-col { display: flex; flex-direction: column; gap: 16px; }

/* ── Panel ── */
.panel {
  background: #fff; border: 1px solid #eceae3; border-radius: 16px;
  padding: 20px; transition: border-color .2s, box-shadow .2s;
}
.panel:hover { border-color: #dbd7cc; box-shadow: 0 2px 6px rgba(0,0,0,.06); }
.panel-header { display: flex; align-items: center; margin-bottom: 16px; }
.panel-title  { font-size: 13px; font-weight: 600; color: #1a1a1a; display: flex; align-items: center; }

/* ── Details Grid ── */
.details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-item.full { grid-column: 1 / -1; }
.detail-item.highlight { background: #faf9f7; border-radius: 10px; padding: 12px; border: 1px solid #eceae3; }
.di-label { font-size: 11px; font-weight: 600; color: #888780; text-transform: uppercase; letter-spacing: .3px; }
.di-value { font-size: 14px; font-weight: 500; color: #1a1a1a; }
.di-value.big  { font-size: 28px; font-weight: 700; }
.di-value.mono { font-family: "Courier New", monospace; font-size: 12px; }
.di-value.small { font-size: 12px; line-height: 1.5; color: #555552; }

/* ── Delivery Progress ── */
.delivery-progress {
  display: flex; align-items: flex-start;
  margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0ede8;
}
.progress-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.step-icon {
  width: 30px; height: 30px; border-radius: 50%;
  background: #f0ede8; border: 2px solid #e0dcd8;
  display: flex; align-items: center; justify-content: center;
  color: #c0bcb4; transition: all .2s; flex-shrink: 0;
}
.progress-step.done   .step-icon { background: #eaf3de; border-color: #3b6d11; color: #3b6d11; }
.progress-step.active .step-icon { background: #eef5fd; border-color: #1a6fc4; color: #1a6fc4; }
.step-line {
  position: absolute; top: 15px; left: calc(50% + 15px);
  width: calc(100% - 30px); height: 2px; background: #e0dcd8;
}
.progress-step.done .step-line { background: #3b6d11; }
.step-label { font-size: 10px; font-weight: 600; color: #888780; margin-top: 6px; text-align: center; white-space: nowrap; }
.progress-step.done   .step-label { color: #3b6d11; }
.progress-step.active .step-label { color: #1a6fc4; }

/* ── Address Card ── */
.address-card {
  background: #faf9f7; border: 1px solid #eceae3; border-radius: 10px; padding: 14px;
  display: flex; flex-direction: column; gap: 8px;
}
.addr-row { display: flex; align-items: center; }
.addr-official { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.addr-lines { display: flex; flex-direction: column; gap: 2px; }
.addr-lines span { font-size: 13px; color: #555552; }
.addr-mobile { display: flex; align-items: center; font-size: 12px; color: #888780; margin-top: 4px; }
.no-address-box {
  display: flex; align-items: center; gap: 8px;
  background: #fff8e0; border: 1px solid #f5d680;
  border-radius: 10px; padding: 12px;
  font-size: 13px; color: #c4881a;
}

/* ── Status Pills ── */
.status-pill { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; }
.pill-unpaid     { background: #fff8e0; color: #c4881a; }
.pill-paid       { background: #eaf3de; color: #3b6d11; }
.pill-failed     { background: #fcebeb; color: #a32d2d; }
.pill-refunded   { background: #f0ebfa; color: #8b2fc9; }
.pill-pending    { background: #fff8e0; color: #c4881a; }
.pill-processing { background: #eef5fd; color: #1a6fc4; }
.pill-dispatched { background: #e8f4ff; color: #0070c0; }
.pill-delivered  { background: #eaf3de; color: #3b6d11; }

/* ── Meta List ── */
.meta-list { display: flex; flex-direction: column; gap: 10px; }
.meta-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-size: 13px; }
.meta-label { font-size: 11px; color: #888780; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
.meta-val   { font-weight: 500; color: #1a1a1a; text-align: right; }
.meta-val.mono  { font-family: "Courier New", monospace; font-size: 11px; }
.meta-val.small { font-size: 10px; word-break: break-all; }

/* ── Remarks ── */
.remarks-text { font-size: 13px; color: #333; line-height: 1.6; margin: 0; }

/* ── Quick Actions ── */
.quick-actions { display: flex; flex-direction: column; gap: 8px; }
.qa-btn {
  width: 100%; padding: 11px 16px; border-radius: 10px; border: none;
  font-size: 13px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px; transition: all .15s;
}
.qa-btn.primary { background: #1a6fc4; color: #fff; }
.qa-btn.primary:hover:not(:disabled) { background: #155da0; }
.qa-btn.danger  { background: #fcebeb; color: #a32d2d; border: 1px solid #f5ccc8; }
.qa-btn.danger:hover:not(:disabled)  { background: #fbd7d7; }
.qa-btn:disabled { opacity: .6; cursor: not-allowed; }

/* ── Timeline ── */
.timeline { display: flex; flex-direction: column; gap: 0; }
.tl-event { display: flex; align-items: flex-start; gap: 12px; position: relative; padding-bottom: 14px; }
.tl-event:last-child { padding-bottom: 0; }
.tl-event::before {
  content: ""; position: absolute;
  left: 9px; top: 20px;
  width: 2px; height: calc(100% - 20px);
  background: #eceae3;
}
.tl-event:last-child::before { display: none; }
.tl-event.done  ::before { background: #c2e0a0; }
.tl-dot {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
  background: #f0ede8; border: 2px solid #e0dcd8;
  display: flex; align-items: center; justify-content: center;
  color: #c0bcb4; transition: all .2s;
}
.tl-event.done   .tl-dot { background: #eaf3de; border-color: #3b6d11; color: #3b6d11; }
.tl-event.active .tl-dot { background: #eef5fd; border-color: #1a6fc4; color: #1a6fc4; }
.tl-body { display: flex; flex-direction: column; gap: 2px; }
.tl-label { font-size: 12px; font-weight: 600; color: #1a1a1a; }
.tl-hint  { font-size: 11px; color: #888780; }
.tl-event.done  .tl-label { color: #3b6d11; }
.tl-event.active .tl-label { color: #1a6fc4; }

/* ── Skeleton ── */
.sk-page { display: flex; flex-direction: column; gap: 16px; }
.sk { background: linear-gradient(90deg, #f0ede8 0%, #e5e0d7 50%, #f0ede8 100%); background-size: 200% 100%; border-radius: 12px; animation: shimmer 1.8s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.sk-header-row { height: 52px; }
.sk-body { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.sk-main { height: 400px; }
.sk-side { height: 280px; }

/* ── Error ── */
.error-container { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px 20px; text-align: center; }
.error-container h2 { margin: 0; font-size: 20px; font-weight: 600; color: #1a1a1a; }
.error-container p  { margin: 0; font-size: 14px; color: #888780; }
.retry-btn { display: inline-flex; align-items: center; gap: 6px; padding: 11px 20px; background: #1a6fc4; color: #fff; border: none; border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 2000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fadeIn .2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal {
  background: #fff; border-radius: 20px;
  width: 100%; max-width: 420px;
  display: flex; flex-direction: column;
  animation: slideUp .2s ease; overflow: hidden;
}
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #eceae3; }
.modal-title  { font-size: 16px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; margin: 0; }
.danger-title { color: #a32d2d; }
.modal-close  { background: none; border: none; cursor: pointer; color: #888780; display: flex; padding: 4px; }
.modal-close:hover { color: #1a1a1a; }
.modal-body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #eceae3; background: #faf9f7; }

.form-field  { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 12px; font-weight: 600; color: #555552; }
.field-input { padding: 9px 12px; border: 1px solid #e0dcd8; border-radius: 8px; font-size: 13px; font-family: inherit; outline: none; background: #faf9f7; }
.field-input:focus { border-color: #1a6fc4; }

.cancel-btn { padding: 9px 20px; border: 1px solid #e0dcd8; border-radius: 50px; background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; }
.cancel-btn:hover { background: #f5f5f3; }
.delete-btn { padding: 9px 24px; border: none; border-radius: 50px; background: #ba1a1a; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.delete-btn:hover:not(:disabled) { background: #9e1515; }
.delete-btn:disabled { opacity: .6; cursor: not-allowed; }
.warn-btn { padding: 9px 24px; border: none; border-radius: 50px; background: #c4881a; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.warn-btn:hover:not(:disabled) { background: #a87016; }
.warn-btn:disabled { opacity: .6; cursor: not-allowed; }
.confirm-text { font-size: 14px; color: #333; line-height: 1.6; margin: 0; }
.confirm-text strong { color: #1a1a1a; }

.spin { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 20px; right: 20px;
  background: #fff; border: 1px solid #dbd7cc; border-radius: 12px;
  padding: 12px 16px; display: flex; align-items: center; gap: 10px;
  font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,.15);
  z-index: 2999; max-width: 340px; animation: slideIn .3s ease;
}
@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.toast.success { border-color: #b7e4c3; background: #f1fdf6; color: #2a5e3f; }
.toast.error   { border-color: #f5ccc8; background: #fef5f4; color: #a32d2d; }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; display: flex; margin-left: auto; }
</style>