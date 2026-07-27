<template>
  <div class="view-root">

    <!-- Loading -->
    <div v-if="detailLoading" class="page-loader">
      <div class="loader-spinner"></div>
      <p class="loader-text">Loading application…</p>
    </div>

    <!-- Error -->
    <div v-else-if="detailError" class="empty-state">
      <div class="empty-icon-wrap"><span class="mdi mdi-alert-circle-outline"></span></div>
      <p class="empty-title">{{ detailError }}</p>
      <button class="btn-primary" @click="load"><span class="mdi mdi-refresh"></span> Try Again</button>
    </div>

    <template v-else-if="currentApplication">

      <!-- ── Header ── -->
      <div class="view-header">
        <div class="view-header__left">
          <button class="btn-back" @click="router.push('/aggregator/cards')">
            <span class="mdi mdi-arrow-left"></span> Back
          </button>
          <div class="view-brand-text">
            <h1 class="view-merchant-name mono">{{ currentApplication.enquiryNo }}</h1>
            <p class="view-sub">Card Apply — Application Detail</p>
          </div>
        </div>
      </div>

      <!-- ── Status Banner ── -->
      <div class="card status-banner" :class="`banner--${currentApplication.status?.toLowerCase()}`">
        <div class="banner-left">
          <span class="mdi" :class="statusIcon(currentApplication.status)" style="font-size:22px"></span>
          <div>
            <p class="banner-status">{{ currentApplication.status }}</p>
            <p class="banner-msg">{{ statusMessage(currentApplication.status) }}</p>
          </div>
        </div>
        <div class="banner-right">
          <div class="banner-item">
            <span class="bi-label">Payment</span>
            <span :class="['pill pill--sm', paymentStatusPill(currentApplication.paymentStatus)]">{{ currentApplication.paymentStatus }}</span>
          </div>
          <div class="banner-item">
            <span class="bi-label">Fulfillment</span>
            <span :class="['pill pill--sm', fulfillmentStatusPill(currentApplication.fulfillmentStatus)]">{{ currentApplication.fulfillmentStatus }}</span>
          </div>
        </div>
      </div>

      <!-- ── Main Grid ── -->
      <div class="detail-grid">
        <div class="left-col">

          <div class="card">
            <div class="card-header"><h3 class="card-title">Order Details</h3></div>
            <div class="info-grid info-grid--1">
              <div class="info-item">
                <label>Cards Requested</label>
                <p class="big-value">{{ currentApplication.noOfCards }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title">Payment Details</h3></div>
            <div class="info-grid info-grid--2">
              <div class="info-item">
                <label>Payment Status</label>
                <p><span :class="['pill pill--sm', paymentStatusPill(currentApplication.paymentStatus)]">{{ currentApplication.paymentStatus }}</span></p>
              </div>
              <div class="info-item">
                <label>Instructions</label>
                <p class="small-value">{{ paymentInstruction(currentApplication.paymentStatus) }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title">Fulfillment &amp; Delivery</h3></div>
            <div class="info-grid info-grid--2">
              <div class="info-item">
                <label>Fulfillment Status</label>
                <p><span :class="['pill pill--sm', fulfillmentStatusPill(currentApplication.fulfillmentStatus)]">{{ currentApplication.fulfillmentStatus }}</span></p>
              </div>
              <div class="info-item">
                <label>Tracking Number</label>
                <p class="mono">{{ currentApplication.trackingNumber || '—' }}</p>
              </div>
              <div class="info-item">
                <label>Dispatched On</label>
                <p>{{ currentApplication.dispatchedAt ? fmtDateTime(currentApplication.dispatchedAt) : '—' }}</p>
              </div>
              <div class="info-item">
                <label>Delivered On</label>
                <p>{{ currentApplication.deliveredAt ? fmtDateTime(currentApplication.deliveredAt) : '—' }}</p>
              </div>
            </div>
          </div>

          <div class="card" v-if="currentApplication.address">
            <div class="card-header"><h3 class="card-title">Delivery Address</h3></div>
            <div style="padding:16px 18px">
              <p style="font-weight:700;color:#0f172a;margin-bottom:6px">{{ currentApplication.address.official_address }}</p>
              <p style="font-size:12.5px;color:#475569;line-height:1.7">
                {{ currentApplication.address.address1 }}<span v-if="currentApplication.address.address2">, {{ currentApplication.address.address2 }}</span><br />
                {{ currentApplication.address.city }}, {{ currentApplication.address.state }} – {{ currentApplication.address.pincode }}
              </p>
              <p v-if="currentApplication.address.mobile_number" style="font-size:12px;color:#94a3b8;margin-top:6px">
                <span class="mdi mdi-phone-outline"></span> {{ currentApplication.address.mobile_number }}
              </p>
            </div>
          </div>
        </div>

        <div class="right-col">
          <div class="card">
            <div class="card-header"><h3 class="card-title">Application Info</h3></div>
            <div class="meta-list">
              <div class="meta-row"><span class="meta-label">App No</span><span class="meta-val mono">{{ currentApplication.enquiryNo }}</span></div>
              <div class="meta-row"><span class="meta-label">Applied On</span><span class="meta-val">{{ fmtDateTime(currentApplication.createdAt) }}</span></div>
              <div class="meta-row"><span class="meta-label">Last Updated</span><span class="meta-val">{{ fmtDateTime(currentApplication.updatedAt) }}</span></div>
            </div>
          </div>

          <div class="card" v-if="cardsStats.total > 0">
            <div class="card-header"><h3 class="card-title">Cards Summary</h3></div>
            <div class="cs-grid">
              <div class="cs-item"><span class="cs-num">{{ cardsStats.total }}</span><span class="cs-label">Total</span></div>
              <div class="cs-item" v-if="cardsStats.pendingCount"><span class="cs-num" style="color:#d97706">{{ cardsStats.pendingCount }}</span><span class="cs-label">Pending</span></div>
              <div class="cs-item" v-if="cardsStats.activeCount"><span class="cs-num" style="color:#059669">{{ cardsStats.activeCount }}</span><span class="cs-label">Active</span></div>
              <div class="cs-item" v-if="cardsStats.blockedCount"><span class="cs-num" style="color:#dc2626">{{ cardsStats.blockedCount }}</span><span class="cs-label">Blocked</span></div>
            </div>
          </div>

          <div class="card" v-if="currentApplication.remarks">
            <div class="card-header"><h3 class="card-title">Remarks</h3></div>
            <p style="padding:16px 18px;font-size:12.5px;color:#334155;line-height:1.6">{{ currentApplication.remarks }}</p>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title">Status History</h3></div>
            <div class="timeline">
              <div v-for="event in timelineEvents" :key="event.label" class="tl-event" :class="{ done: event.done, active: event.active }">
                <div class="tl-dot"><span class="mdi" :class="event.icon" style="font-size:10px"></span></div>
                <div class="tl-body">
                  <span class="tl-label">{{ event.label }}</span>
                  <span class="tl-hint">{{ event.hint }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Cards Under This Application ── -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706"><span class="mdi mdi-credit-card-multiple-outline"></span></div>
          <h3 class="card-title">Cards Under This Application</h3>
          <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ cardsPagination.total }} record(s)</span></span>
        </div>

        <div class="cards-filter-bar">
          <div class="cf-field cf-field--search">
            <span class="mdi mdi-magnify cf-search-icon"></span>
            <input class="cf-input cf-input--search" v-model="cardFilter.search" placeholder="Search card ref ID, holder or PAN…" @input="debouncedSearch" />
          </div>
          <select class="cf-select" v-model="cardFilter.status" @change="loadCards">
            <option value="">All Status</option>
            <option v-for="s in CARD_STATUSES" :key="s" :value="s">{{ statusLabel(s) }}</option>
          </select>
          <button class="cf-reset-btn" title="Refresh" @click="loadCards"><span class="mdi mdi-refresh" :class="{ spin: cardsLoading }"></span></button>
          <button class="export-btn" :disabled="cardsLoading || !cardsPagination.total" @click="openExportModal">
            <span class="mdi mdi-file-excel-outline"></span> Download Excel
          </button>
        </div>

        <div v-if="cardsLoading" class="w-loading-row">Loading cards…</div>
        <div v-else-if="cardsError" class="empty-state">
          <div class="empty-icon-wrap"><span class="mdi mdi-alert-circle-outline"></span></div>
          <p class="empty-title">{{ cardsError }}</p>
        </div>
        <div v-else-if="!cardsList.length" class="empty-state">
          <div class="empty-icon-wrap"><span class="mdi mdi-credit-card-off-outline"></span></div>
          <p class="empty-title">No cards found for this application</p>
        </div>
        <template v-else>
          <div class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th><th>Card Ref ID</th><th>Holder</th><th>Masked PAN</th><th>Type</th><th>Status</th>
                  <th>KYC</th><th>PIN Set</th><th>Daily Limit</th><th>Created</th><th></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(c, idx) in cardsList" :key="c.id">
                  <tr class="clickable-row" @click="toggleExpand(c.id)">
                    <td>{{ (cardsPagination.page - 1) * cardsPagination.limit + idx + 1 }}</td>
                    <td class="mono">{{ c.cardRefId || '—' }}</td>
                    <td>{{ c.cardHolderName }}</td>
                    <td class="mono">{{ c.maskedPan }}</td>
                    <td>{{ c.type }}</td>
                    <td><span :class="['pill pill--sm', cardStatusPill(c.status)]">{{ statusLabel(c.status) }}</span></td>
                    <td><span class="mdi" :class="c.kycVerified ? 'mdi-check-circle' : 'mdi-close-circle-outline'" :style="{ color: c.kycVerified ? '#059669' : '#cbd5e1' }"></span></td>
                    <td><span class="mdi" :class="c.pinSet ? 'mdi-check-circle' : 'mdi-close-circle-outline'" :style="{ color: c.pinSet ? '#059669' : '#cbd5e1' }"></span></td>
                    <td>{{ fmtLimit(c.dailyLimit) }}</td>
                    <td>{{ fmtDate(c.createdAt) }}</td>
                    <td><span class="mdi mdi-chevron-down expand-icon" :class="{ rotated: expandedCardId === c.id }"></span></td>
                  </tr>
                  <tr v-if="expandedCardId === c.id" class="expand-row">
                    <td colspan="11">
                      <div class="expand-panel">
                        <div class="expand-grid">
                          <div class="expand-item"><span class="expand-label">Available Limit</span><span>{{ fmtLimit(c.availableLimit) }}</span></div>
                          <div class="expand-item"><span class="expand-label">Per Txn Limit</span><span>{{ fmtLimit(c.perTxnLimit) }}</span></div>
                          <div class="expand-item"><span class="expand-label">PIN Retry Count</span><span>{{ c.pinRetry ?? '—' }}</span></div>
                          <div class="expand-item"><span class="expand-label">Network</span><span>{{ c.network }}</span></div>
                          <div class="expand-item"><span class="expand-label">Issuer</span><span>{{ c.issuerBank }}</span></div>
                          <div class="expand-item"><span class="expand-label">Last Updated</span><span>{{ fmtDateTime(c.updatedAt) }}</span></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="cards-pagination" v-if="cardsPagination.totalPages > 1">
            <button class="cf-page-btn" :disabled="!cardsPagination.hasPrev" @click="changePage(cardsPagination.page - 1)"><span class="mdi mdi-chevron-left"></span></button>
            <span class="cf-page-info">Page {{ cardsPagination.page }} of {{ cardsPagination.totalPages }} · {{ cardsPagination.total }} cards</span>
            <button class="cf-page-btn" :disabled="!cardsPagination.hasNext" @click="changePage(cardsPagination.page + 1)"><span class="mdi mdi-chevron-right"></span></button>
          </div>
        </template>
      </div>
    </template>

    <Teleport to="body">

      <!-- ░░ EXPORT TO EXCEL MODAL ░░ -->
      <Transition name="dialog-fade">
        <div v-if="showExportModal" class="dialog-overlay" @click.self="closeExportModal">
          <div class="dialog dialog--export">
            <div class="dialog-hdr">
              <div>
                <p class="dialog-title">Export Card Request</p>
                <p class="dialog-sub">{{ currentApplication?.enquiryNo }}</p>
              </div>
              <button class="icon-close" @click="closeExportModal"><span class="mdi mdi-close"></span></button>
            </div>

            <div class="dialog-body">
              <div v-if="exportLoading" class="w-loading-row"><span class="mdi mdi-loading spin"></span> Loading cards…</div>
              <template v-else>
                <div class="dialog-section-lbl">Bank Details</div>
                <div class="term-form-grid term-form-grid--2">
                  <div class="term-field">
                    <label>4-digit CDM Corp Code <span class="req">*</span></label>
                    <input v-model="bankDetails.corpCode" class="term-input" maxlength="4" placeholder="e.g. 1234" @input="bankDetails.corpCode = sanitizeDigits(bankDetails.corpCode, 4)" />
                    <span v-if="bankErrors.corpCode" class="field-error">{{ bankErrors.corpCode }}</span>
                  </div>
                  <div class="term-field">
                    <label>CDM Card Linked A/c Number <span class="req">*</span></label>
                    <input v-model="bankDetails.accountNumber" class="term-input" maxlength="20" placeholder="Non-operative A/c number" @input="bankDetails.accountNumber = sanitizeAlnumNoSpace(bankDetails.accountNumber, 20)" />
                    <span v-if="bankErrors.accountNumber" class="field-error">{{ bankErrors.accountNumber }}</span>
                  </div>
                </div>

                <div class="dialog-section-lbl">Preview ({{ exportRows.length }} cards) — only Additional Info is editable</div>
                <div class="table-scroll" style="max-height:280px;border:1px solid #e2e8f0;border-radius:10px">
                  <table class="data-table">
                    <thead>
                      <tr><th>#</th><th>Corp Code</th><th>A/c Number</th><th>Embossed Code</th><th>Additional Info</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, idx) in exportRows" :key="row.id">
                        <td>{{ idx + 1 }}</td>
                        <td>{{ bankDetails.corpCode || '—' }}</td>
                        <td>{{ bankDetails.accountNumber || '—' }}</td>
                        <td class="mono">{{ row.embossedCode }}</td>
                        <td>
                          <input v-model="row.additionalInfo" class="term-input" maxlength="35" placeholder="Name / Location (optional)" @input="row.additionalInfo = sanitizeAlnumSpace(row.additionalInfo, 35)" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </div>

            <div class="w-modal-footer">
              <button class="w-btn-ghost" @click="closeExportModal">Cancel</button>
              <button class="w-btn-primary" :disabled="exportLoading || !exportRows.length" @click="downloadExportExcel">
                <span class="mdi mdi-file-excel-outline"></span> Download Excel
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ TOAST ░░ -->
      <Transition name="toast">
        <div v-if="toast.show" :class="['toast', `toast--${toast.type}`]">
          <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
          {{ toast.message }}
        </div>
      </Transition>

    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAggregatorCardApplicationApi } from "~/composables/apis/useAggregatorCardApplicationApi";
import { useAggregatorApplicationCardsApi } from "~/composables/apis/useAggregatorApplicationCardsApi";
import * as XLSX from "xlsx-js-style";

const props = defineProps({ applicationId: String });
const router = useRouter();

const { currentApplication, detailLoading, detailError, fetchApplication } = useAggregatorCardApplicationApi();

const {
  cardsList, cardsPagination, cardsLoading, cardsError, cardsStats,
  fetchApplicationCards, fetchApplicationCardsStats,
} = useAggregatorApplicationCardsApi();

const CARD_STATUSES = ["PENDING", "ACTIVE", "BLOCKED", "INACTIVE", "HOTLISTED", "EXPIRED", "AVAILABIL"];

const expandedCardId = ref(null);
const toggleExpand = (id) => { expandedCardId.value = expandedCardId.value === id ? null : id; };

const cardFilter = reactive({ search: "", status: "", page: 1, limit: 50 });

const load = () => fetchApplication(props.applicationId);

let cardSearchTimer = null;
const loadCards = async () => {
  expandedCardId.value = null;
  await fetchApplicationCards(props.applicationId, {
    page: cardFilter.page, limit: cardFilter.limit,
    search: cardFilter.search || undefined,
    status: cardFilter.status || undefined,
  });
};

const debouncedSearch = () => {
  clearTimeout(cardSearchTimer);
  cardSearchTimer = setTimeout(() => { cardFilter.page = 1; loadCards(); }, 400);
};

const loadCardsStats = () => fetchApplicationCardsStats(props.applicationId);
const changePage = (page) => { cardFilter.page = page; loadCards(); };

onMounted(async () => {
  await load();
  await Promise.all([loadCards(), loadCardsStats()]);
});

// ── Status helpers ─────────────────────────────────────────────────────
const statusIcon = (s) => ({
  SUBMITTED: "mdi-clock-outline", APPROVED: "mdi-check-circle-outline",
  REJECTED: "mdi-close-circle-outline", CANCELLED: "mdi-cancel",
}[s] || "mdi-information-outline");

const statusMessage = (s) => ({
  SUBMITTED: "Your application is under review. You'll be notified on approval.",
  APPROVED:  "Application approved! Cards are being prepared for dispatch.",
  REJECTED:  "This application was rejected. Please contact support for details.",
  CANCELLED: "This application has been cancelled.",
}[s] || "");

const paymentInstruction = (s) => ({
  UNPAID: "Payment is pending. Our team will reach out with payment details.",
  PAID: "Payment received. Cards will be dispatched shortly.",
  FAILED: "Payment failed. Please contact support.",
  REFUNDED: "A refund has been processed for this application.",
}[s] || "");

const paymentStatusPill = (s) => ({
  UNPAID: "pill--amber", PAID: "pill--emerald", FAILED: "pill--red", REFUNDED: "pill--violet",
}[s] || "pill--slate");
const fulfillmentStatusPill = (s) => ({
  PENDING: "pill--amber", PROCESSING: "pill--sky", DISPATCHED: "pill--indigo",
  DELIVERED: "pill--emerald", FAILED: "pill--red",
}[s] || "pill--slate");
const cardStatusPill = (s) => { if (s === "ACTIVE" || s === "AVAILABIL") return "pill--emerald"; if (["BLOCKED", "EXPIRED", "HOTLISTED"].includes(s)) return "pill--red"; return "pill--amber"; };

// AVAILABIL is a fixed typo in the DB enum — display-only correction, the raw value is still sent/filtered on.
const CARD_STATUS_LABELS = { AVAILABIL: "AVAILABLE" };
const statusLabel = (s) => CARD_STATUS_LABELS[s] || s;

const timelineEvents = computed(() => {
  const app = currentApplication.value;
  if (!app) return [];
  return [
    { label: "Created", hint: fmtDateTime(app.createdAt), icon: "mdi-plus", done: true, active: false },
    {
      label: "Submitted",
      hint: ["SUBMITTED", "APPROVED", "REJECTED", "CANCELLED"].includes(app.status) ? "Sent for review" : "Pending",
      icon: "mdi-send-outline", done: true, active: app.status === "SUBMITTED",
    },
    {
      label: "Approved",
      hint: app.status === "APPROVED" ? "Ready for fulfillment" : app.status === "REJECTED" ? "Rejected" : "Awaiting",
      icon: app.status === "REJECTED" ? "mdi-close-circle-outline" : "mdi-check-circle-outline",
      done: app.status === "APPROVED", active: app.status === "REJECTED",
    },
    {
      label: "Fulfillment", hint: app.fulfillmentStatus, icon: "mdi-cog-outline",
      done: ["PROCESSING", "DISPATCHED", "DELIVERED"].includes(app.fulfillmentStatus),
      active: app.fulfillmentStatus === "PROCESSING",
    },
    {
      label: "Delivered", hint: app.deliveredAt ? fmtDateTime(app.deliveredAt) : "Pending",
      icon: "mdi-package-variant-closed-check",
      done: app.fulfillmentStatus === "DELIVERED", active: app.fulfillmentStatus === "DISPATCHED",
    },
  ];
});

// ── Utilities ─────────────────────────────────────────────────────────
const fmtDate = (s) => { if (!s) return "—"; const d = new Date(s); if (isNaN(d)) return "—"; return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); };
const fmtDateTime = (s) => { if (!s) return "—"; const d = new Date(s); if (isNaN(d)) return "—"; return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); };
const fmtLimit = (v) => { if (v === null || v === undefined) return "—"; const n = parseFloat(v); return isNaN(n) ? "—" : `₹${n.toLocaleString("en-IN")}`; };

// ── Toast ─────────────────────────────────────────────────────────────
const toast = reactive({ show: false, type: "success", message: "" });
let toastTimer = null;
const showToast = (message, type = "success") => {
  clearTimeout(toastTimer);
  toast.message = message; toast.type = type; toast.show = true;
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

// ── Export to Excel ───────────────────────────────────────────────────
const DEFAULT_ACCOUNT_NAME  = "Bucksbox Software Pvt Ltd";
const DEFAULT_EMBOSSED_NAME = "BUCKSBOX";

const showExportModal = ref(false);
const exportLoading   = ref(false);
const exportRows      = ref([]);
const bankDetails = reactive({ corpCode: "", accountNumber: "" });
const bankErrors  = reactive({ corpCode: "", accountNumber: "" });

const exportCardsApi = useAggregatorApplicationCardsApi();

const sanitizeDigits       = (val, maxLen) => (val || "").replace(/\D/g, "").slice(0, maxLen);
const sanitizeAlnumSpace   = (val, maxLen) => (val || "").replace(/[^A-Za-z0-9 ]/g, "").slice(0, maxLen);
const sanitizeAlnumNoSpace = (val, maxLen) => (val || "").replace(/[^A-Za-z0-9]/g, "").slice(0, maxLen);

const dedupeEmbossedCodes = (rows) => {
  const seen = new Set();
  rows.forEach((row) => {
    let code = row.embossedCode;
    let suffix = 1;
    while (seen.has(code.toUpperCase())) {
      const suffixStr = String(suffix);
      code = sanitizeAlnumNoSpace(row.embossedCode, 15 - suffixStr.length) + suffixStr;
      suffix++;
    }
    seen.add(code.toUpperCase());
    row.embossedCode = code;
  });
};

const openExportModal = async () => {
  showExportModal.value = true;
  exportLoading.value   = true;
  exportRows.value      = [];

  try {
    await exportCardsApi.fetchApplicationCards(props.applicationId, {
      page: 1,
      limit: cardsPagination.value.total || 1000,
      status: cardFilter.status || undefined,
    });

    exportRows.value = exportCardsApi.cardsList.value.map((card) => ({
      id: card.id,
      embossedCode: card.cardRefId || card.id,
      additionalInfo: "",
    }));
    dedupeEmbossedCodes(exportRows.value);
  } catch (err) {
    showToast(err.message || "Failed to load cards for export", "error");
    showExportModal.value = false;
  } finally {
    exportLoading.value = false;
  }
};

const closeExportModal = () => {
  showExportModal.value = false;
  exportRows.value = [];
  bankErrors.corpCode = bankErrors.accountNumber = "";
};

const validateExportForm = () => {
  let valid = true;
  bankErrors.corpCode = /^\d{4}$/.test(bankDetails.corpCode) ? "" : "Must be exactly 4 digits";
  bankErrors.accountNumber = /^[A-Za-z0-9]{1,20}$/.test(bankDetails.accountNumber) ? "" : "1-20 alphanumeric characters, no spaces";
  if (bankErrors.corpCode || bankErrors.accountNumber) valid = false;
  return valid;
};

const THIN_BORDER = { style: "thin", color: { rgb: "B7B7B7" } };
const CELL_BORDER = { top: THIN_BORDER, bottom: THIN_BORDER, left: THIN_BORDER, right: THIN_BORDER };

const headerCell = (text, fillRgb) => ({
  t: "s", v: text,
  s: {
    font: { bold: true, sz: 11, color: { rgb: "1A1A1A" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: fillRgb } },
    border: CELL_BORDER,
  },
});

const textCell = (value) => ({
  t: "s", v: value, z: "@",
  s: { font: { sz: 10, color: { rgb: "1A1A1A" } }, alignment: { horizontal: "left", vertical: "center" }, border: CELL_BORDER },
});

const colWidth = (values) => Math.min(48, Math.max(14, Math.max(...values.map(v => String(v ?? "").length)) + 4));

const downloadExportExcel = () => {
  if (!validateExportForm()) {
    showToast("Please fix the highlighted fields before exporting", "error");
    return;
  }

  const headers = [
    "4-digit CDM Corp Code",
    "CDM Card linked A/c Number (Non Operative A/c)",
    "Account Name",
    "Embossed name to be printed on card",
    "Embossed code to be printed on card",
    "*Additional info to be mapped",
  ];

  const dataRows = exportRows.value.map(row => [
    bankDetails.corpCode, bankDetails.accountNumber, DEFAULT_ACCOUNT_NAME,
    DEFAULT_EMBOSSED_NAME, row.embossedCode, row.additionalInfo || "-",
  ]);

  const headerFills = ["D9D2E9", "D9D2E9", "D9D2E9", "D9EAD3", "BDD7EE", "BDD7EE"];

  const ws = {};
  headers.forEach((h, c) => { ws[XLSX.utils.encode_cell({ r: 0, c })] = headerCell(h, headerFills[c]); });
  dataRows.forEach((row, r) => {
    row.forEach((val, c) => { ws[XLSX.utils.encode_cell({ r: r + 1, c })] = textCell(val); });
  });

  const lastRow = dataRows.length;
  ws["!ref"]  = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: lastRow, c: headers.length - 1 } });
  ws["!cols"] = headers.map((h, c) => ({ wch: colWidth([h, ...dataRows.map(r => r[c])]) }));
  ws["!rows"] = [{ hpt: 32 }, ...dataRows.map(() => ({ hpt: 18 }))];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Card Request");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob  = new Blob([wbout], { type: "application/octet-stream" });
  const url   = URL.createObjectURL(blob);
  const a     = document.createElement("a");
  a.href = url;
  a.download = `card-request-${currentApplication.value?.enquiryNo || props.applicationId}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);

  showToast("Excel file exported successfully");
  closeExportModal();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.view-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; color: #0f172a; }
.mono { font-family: 'DM Mono', monospace; }
.ml-auto { margin-left: auto; }

/* ── Header ── */
.view-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 14px 18px; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.view-header__left { display: flex; align-items: center; gap: 14px; }
.btn-back { display: flex; align-items: center; gap: 5px; padding: 7px 13px; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 12px; font-weight: 600; background: #f8fafc; color: #475569; cursor: pointer; font-family: inherit; }
.btn-back:hover { background: #f1f5f9; color: #0f172a; }
.view-merchant-name { font-size: 17px; font-weight: 800; color: #0f172a; }
.view-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.btn-primary { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border: none; border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; background: #1142d4; color: #fff; }

/* ── Card ── */
.card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.04); overflow: hidden; }
.card-header { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.card-icon-dot { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.card-title { font-size: 13.5px; font-weight: 700; color: #0f172a; }

/* ── Status banner ── */
.status-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 16px 20px; border-left: 4px solid #94a3b8; }
.banner--submitted { border-left-color: #0369a1; background: #f0f9ff; }
.banner--approved  { border-left-color: #059669; background: #f0fdf4; }
.banner--rejected  { border-left-color: #dc2626; background: #fef2f2; }
.banner--cancelled { border-left-color: #94a3b8; background: #f8fafc; }
.banner-left { display: flex; align-items: center; gap: 12px; }
.banner-status { font-size: 14px; font-weight: 700; color: #0f172a; }
.banner-msg { font-size: 12px; color: #64748b; margin-top: 2px; }
.banner-right { display: flex; align-items: center; gap: 18px; }
.banner-item { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; }
.bi-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; }

/* ── Grid ── */
.detail-grid { display: grid; grid-template-columns: 1fr 320px; gap: 14px; align-items: start; }
@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } }
.left-col, .right-col { display: flex; flex-direction: column; gap: 14px; }

/* ── Info grid ── */
.info-grid { display: grid; gap: 0; }
.info-grid--1 { grid-template-columns: 1fr; }
.info-grid--2 { grid-template-columns: repeat(2, 1fr); }
.info-item { padding: 14px 18px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.info-grid--2 .info-item:nth-child(2n) { border-right: none; }
.info-item label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .7px; display: block; margin-bottom: 4px; }
.info-item p { font-size: 13px; font-weight: 500; color: #0f172a; }
.big-value { font-size: 30px !important; font-weight: 800 !important; color: #1142d4 !important; }
.small-value { font-size: 12px !important; color: #475569 !important; line-height: 1.5; }

/* ── Meta list ── */
.meta-list { display: flex; flex-direction: column; gap: 0; }
.meta-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 11px 18px; border-bottom: 1px solid #f9fafb; font-size: 12.5px; }
.meta-row:last-child { border-bottom: none; }
.meta-label { font-size: 10.5px; color: #94a3b8; font-weight: 700; text-transform: uppercase; white-space: nowrap; }
.meta-val { font-weight: 600; color: #0f172a; text-align: right; }

/* ── Cards summary sidebar ── */
.cs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 14px 18px; }
.cs-item { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.cs-num { font-size: 20px; font-weight: 800; color: #0f172a; }
.cs-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }

/* ── Timeline ── */
.timeline { display: flex; flex-direction: column; gap: 0; padding: 14px 18px; }
.tl-event { display: flex; align-items: flex-start; gap: 12px; position: relative; padding-bottom: 16px; }
.tl-event:last-child { padding-bottom: 0; }
.tl-event::before { content: ''; position: absolute; left: 9px; top: 20px; bottom: 0; width: 2px; background: #e2e8f0; }
.tl-event:last-child::before { display: none; }
.tl-event.done::before { background: #a7f3d0; }
.tl-dot { width: 20px; height: 20px; border-radius: 50%; background: #f1f5f9; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; flex-shrink: 0; z-index: 1; }
.tl-event.done .tl-dot { background: #d1fae5; border-color: #059669; color: #059669; }
.tl-event.active .tl-dot { background: #dbeafe; border-color: #1142d4; color: #1142d4; }
.tl-body { display: flex; flex-direction: column; gap: 1px; padding-top: 1px; }
.tl-label { font-size: 12px; font-weight: 700; color: #334155; }
.tl-hint { font-size: 11px; color: #94a3b8; }

/* ── Pills ── */
.pill { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }
.pill--sm { font-size: 9.5px; padding: 1px 6px; }
.pill--indigo  { background: #e0e7ff; color: #4338ca; }
.pill--emerald { background: #d1fae5; color: #065f46; }
.pill--amber   { background: #fef3c7; color: #92400e; }
.pill--red     { background: #fee2e2; color: #991b1b; }
.pill--sky     { background: #e0f2fe; color: #0369a1; }
.pill--violet  { background: #ede9fe; color: #5b21b6; }
.pill--slate   { background: #f1f5f9; color: #64748b; }

/* ── Table ── */
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table   { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 480px; }
.data-table thead { background: #f8fafc; }
.data-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
.data-table td { padding: 11px 14px; color: #334155; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #f8fafc; }
.clickable-row { cursor: pointer; }
.expand-icon { transition: transform .15s; color: #94a3b8; }
.expand-icon.rotated { transform: rotate(180deg); }
.expand-row td { background: #fafbfc; padding: 0 !important; }
.expand-panel { padding: 14px 18px; }
.expand-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
.expand-item { display: flex; flex-direction: column; gap: 2px; font-size: 12px; }
.expand-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; }

/* ── Filter bar (shared) ── */
.cards-filter-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.cf-field { position: relative; display: flex; align-items: center; }
.cf-field--search { flex: 1 1 240px; min-width: 200px; }
.cf-search-icon { position: absolute; left: 10px; font-size: 15px; color: #94a3b8; pointer-events: none; }
.cf-input, .cf-select { border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px 11px; font-size: 12px; font-family: inherit; color: #0f172a; outline: none; background: #fff; }
.cf-input--search { width: 100%; padding-left: 30px; }
.cf-select { min-width: 118px; cursor: pointer; }
.cf-input:focus, .cf-select:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.08); }
.cf-reset-btn { width: 33px; height: 33px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 9px; background: #fff; color: #64748b; cursor: pointer; font-size: 15px; }
.cf-reset-btn:hover { background: #f1f5f9; }
.export-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid #a7f3d0; border-radius: 9px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; background: #d1fae5; color: #065f46; margin-left: auto; }
.export-btn:hover:not(:disabled) { background: #a7f3d0; }
.export-btn:disabled { opacity: .5; cursor: not-allowed; }

/* ── Pagination ── */
.cards-pagination { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 14px 18px; border-top: 1px solid #f1f5f9; }
.cf-page-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; color: #475569; cursor: pointer; font-size: 16px; }
.cf-page-btn:hover:not(:disabled) { background: #f1f5f9; }
.cf-page-btn:disabled { opacity: .4; cursor: not-allowed; }
.cf-page-info { font-size: 12px; font-weight: 600; color: #64748b; }

/* ── Empty / loader ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 40px 20px; text-align: center; }
.empty-icon-wrap { width: 56px; height: 56px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 26px; }
.empty-title { font-size: 13px; font-weight: 700; color: #334155; }
.w-loading-row { text-align: center; color: #94a3b8; padding: 24px 0; font-size: 13px; }
.page-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 14px; }
.loader-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #1142d4; border-radius: 50%; animation: spin .8s linear infinite; }
.loader-text { font-size: 13px; color: #64748b; font-weight: 600; }

/* ── Dialog ── */
.dialog-overlay { position: fixed; inset: 0; z-index: 400; background: rgba(15,23,42,.45); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.dialog { background: #fff; border-radius: 16px; width: 100%; max-width: 560px; box-shadow: 0 24px 64px rgba(0,0,0,.2); overflow: hidden; max-height: 90dvh; display: flex; flex-direction: column; }
.dialog--export { max-width: 760px; }
.dialog-hdr { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.dialog-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.dialog-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.dialog-body { padding: 20px; overflow-y: auto; flex: 1; }
.dialog-section-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; margin: 14px 0 8px; }
.dialog-section-lbl:first-child { margin-top: 0; }
.icon-close { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; cursor: pointer; color: #64748b; font-size: 16px; }
.icon-close:hover { background: #f1f5f9; }
.dialog-fade-enter-active, .dialog-fade-leave-active { transition: opacity .2s ease; }
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity: 0; }

/* ── Form fields ── */
.term-field { display: flex; flex-direction: column; gap: 5px; }
.term-field label { font-size: 10.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
.term-input { border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px 11px; font-size: 12.5px; font-family: inherit; color: #0f172a; outline: none; background: #fff; }
.term-input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.08); }
.term-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
.term-form-grid--2 { grid-template-columns: repeat(2, 1fr); }
.req { color: #ef4444; margin-left: 2px; }
.field-error { font-size: 11px; color: #ef4444; }

/* ── Modal footer ── */
.w-modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 16px 20px; border-top: 1px solid #f1f5f9; flex-shrink: 0; }
.w-btn-ghost { padding: 9px 18px; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 12.5px; font-weight: 600; background: #f8fafc; color: #475569; cursor: pointer; font-family: inherit; }
.w-btn-ghost:hover:not(:disabled) { background: #f1f5f9; }
.w-btn-primary { display: flex; align-items: center; gap: 6px; padding: 9px 20px; border: none; border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; background: #1142d4; color: #fff; }
.w-btn-primary:hover:not(:disabled) { background: #0e35a8; }
.w-btn-primary:disabled { opacity: .55; cursor: not-allowed; }

/* ── Toast ── */
.toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; align-items: center; gap: 9px; padding: 11px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 8px 28px rgba(0,0,0,.18); max-width: 340px; }
.toast--success { background: #0f172a; color: #fff; }
.toast--error { background: #ef4444; color: #fff; }
.toast-enter-active, .toast-leave-active { transition: all .3s cubic-bezier(.34,1.56,.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px) scale(.95); }

.spin { animation: spin .8s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
