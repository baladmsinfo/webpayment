<template>
  <div class="enq-page">

    <div class="page-header">
      <div class="page-title-wrap">
        <router-link to="/wallet-service" class="back-btn">
          <v-icon size="18">mdi-arrow-left</v-icon>
        </router-link>
        <div>
          <h1 class="page-title">Card Enquiries</h1>
          <p class="page-sub">Manage card order requests for your profile</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="export-btn" @click="handleExport">
          <v-icon size="16" class="mr-1">mdi-download-outline</v-icon>
          Export CSV
        </button>
        <button class="create-btn" @click="openCreateModal">
          <v-icon size="16" class="mr-1">mdi-plus</v-icon>
          Apply for Card
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row" v-if="!statsLoading">
      <div class="stat-card">
        <div class="stat-icon bg-blue"><v-icon size="18" color="#fff">mdi-clipboard-list-outline</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Total Enquiries</span>
          <span class="stat-value">{{ enquiryStats.totalEnquiries }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green"><v-icon size="18" color="#fff">mdi-credit-card-multiple-outline</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Cards Ordered</span>
          <span class="stat-value">{{ enquiryStats.totalCardsOrdered }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-teal"><v-icon size="18" color="#fff">mdi-check-circle-outline</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Approved</span>
          <span class="stat-value">{{ enquiryStats.approvedCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-amber"><v-icon size="18" color="#fff">mdi-truck-delivery-outline</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Delivered</span>
          <span class="stat-value">{{ enquiryStats.deliveredCount }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-purple"><v-icon size="18" color="#fff">mdi-pencil-outline</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Drafts</span>
          <span class="stat-value">{{ enquiryStats.draftCount }}</span>
        </div>
      </div>
    </div>
    <div class="stats-row" v-else>
      <div v-for="i in 5" :key="i" class="stat-card stat-skeleton">
        <div class="sk sk-icon-s"></div>
        <div class="stat-body">
          <div class="sk sk-label"></div>
          <div class="sk sk-value"></div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-wrap">
        <v-icon size="16" class="search-icon">mdi-magnify</v-icon>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search enquiry no, remarks…"
          class="search-input"
          @input="debouncedFetch"
        />
        <button v-if="filters.search" class="search-clear" @click="filters.search = ''; doFetch()">
          <v-icon size="14">mdi-close</v-icon>
        </button>
      </div>

      <div class="filter-group">
        <select v-model="filters.status" class="mini-select" @change="doFetch">
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select v-model="filters.paymentStatus" class="mini-select" @change="doFetch">
          <option value="">All Payments</option>
          <option value="UNPAID">Unpaid</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>

        <select v-model="filters.fulfillmentStatus" class="mini-select" @change="doFetch">
          <option value="">All Fulfillment</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="DISPATCHED">Dispatched</option>
          <option value="DELIVERED">Delivered</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div class="sort-wrap">
        <select v-model="filters.sortBy" class="sort-select" @change="doFetch">
          <option value="createdAt">Created</option>
          <option value="enquiryNo">Enquiry No</option>
          <option value="noOfCards">Qty</option>
          <option value="status">Status</option>
        </select>
        <button class="sort-dir-btn" @click="toggleSortDir">
          <v-icon size="16">{{ filters.sortDir === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
        </button>
      </div>

      <div class="per-page-wrap">
        <label class="per-page-label">Rows</label>
        <select v-model.number="filters.limit" class="per-page-select" @change="filters.page = 1; doFetch()">
          <option v-for="n in limitOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary-row" v-if="!enquiryLoading && enquiryList.length">
      <div class="summary-chip">
        <span class="sc-label">Showing</span>
        <span class="sc-value">{{ enquiryList.length }} of {{ enquiryPagination.total }}</span>
      </div>
      <div class="summary-chip green" v-if="enquiryStats.paidCount">
        <v-icon size="12">mdi-check-circle-outline</v-icon>
        <span class="sc-label">Paid</span>
        <span class="sc-value">{{ enquiryStats.paidCount }}</span>
      </div>
      <div class="summary-chip amber" v-if="enquiryStats.unpaidCount">
        <v-icon size="12">mdi-clock-outline</v-icon>
        <span class="sc-label">Pending payment</span>
        <span class="sc-value">{{ enquiryStats.unpaidCount }}</span>
      </div>
      <div class="summary-chip blue" v-if="enquiryStats.draftCount">
        <v-icon size="12">mdi-pencil-outline</v-icon>
        <span class="sc-label">Drafts</span>
        <span class="sc-value">{{ enquiryStats.draftCount }}</span>
      </div>
    </div>

    <!-- Table Panel -->
    <div class="panel table-panel">
      <div v-if="enquiryLoading" class="skeleton-rows">
        <div v-for="i in filters.limit" :key="i" class="skeleton-row">
          <div class="sk sk-enq-no"></div>
          <div class="sk sk-qty"></div>
          <div class="sk sk-badge"></div>
          <div class="sk sk-badge"></div>
          <div class="sk sk-badge"></div>
          <div class="sk sk-date"></div>
          <div class="sk sk-action"></div>
        </div>
      </div>

      <div v-else-if="enquiryError" class="empty-state error-state">
        <v-icon size="40" color="#ba1a1a">mdi-alert-circle-outline</v-icon>
        <p>{{ enquiryError }}</p>
        <button class="retry-btn" @click="doFetch">
          <v-icon size="14">mdi-refresh</v-icon> Retry
        </button>
      </div>

      <div v-else-if="!enquiryList.length" class="empty-state">
        <v-icon size="52" color="#d0ccc0">mdi-credit-card-search-outline</v-icon>
        <p>No card enquiries found</p>
        <span v-if="hasActiveFilters" class="empty-hint">Try clearing your filters</span>
        <button v-else class="create-btn-sm" @click="openCreateModal">
          <v-icon size="14">mdi-plus</v-icon> Apply for your first card
        </button>
      </div>

      <template v-else>
        <div class="table-wrap">
          <table class="enq-table">
            <thead>
              <tr>
                <th>Enquiry No</th>
                <th class="th-right">Qty</th>
                <th>Delivery Address</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Applied On</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="enq in enquiryList"
                :key="enq.id"
                class="enq-row"
                @click="viewEnquiry(enq.id)"
              >
                <td class="td-enq-no">
                  <span class="enq-no">{{ enq.enquiryNo }}</span>
                </td>

                <td class="td-qty">
                  <span class="qty-val">{{ enq.noOfCards }}</span>
                </td>

                <td class="td-address">
                  <span v-if="enq.address" class="address-preview">
                    {{ enq.address.address1 }}, {{ enq.address.city }}
                  </span>
                  <span v-else class="no-address">No address set</span>
                </td>

                <td>
                  <span class="status-pill" :class="enquiryStatusClass(enq.status)">
                    {{ enq.status }}
                  </span>
                </td>

                <td>
                  <span class="status-pill" :class="paymentStatusClass(enq.paymentStatus)">
                    {{ enq.paymentStatus }}
                  </span>
                </td>

                <td>
                  <span class="status-pill" :class="fulfillmentStatusClass(enq.fulfillmentStatus)">
                    {{ formatFulfillment(enq.fulfillmentStatus) }}
                  </span>
                </td>

                <td class="td-date">
                  <span class="date-main">{{ formatDate(enq.createdAt) }}</span>
                  <span class="date-time">{{ formatTime(enq.createdAt) }}</span>
                </td>

                <td class="td-actions" @click.stop>
                  <button class="action-btn" title="View" @click="viewEnquiry(enq.id)">
                    <v-icon size="14">mdi-eye-outline</v-icon>
                  </button>
                  <button
                    v-if="enq.status === 'DRAFT'"
                    class="action-btn submit-action"
                    title="Submit"
                    @click="handleSubmit(enq)"
                  >
                    <v-icon size="14">mdi-send-outline</v-icon>
                  </button>
                  <button
                    v-if="enq.status === 'DRAFT'"
                    class="action-btn danger"
                    title="Delete"
                    @click="confirmDelete(enq)"
                  >
                    <v-icon size="14">mdi-trash-can-outline</v-icon>
                  </button>
                  <button
                    v-if="!['CANCELLED','DELIVERED'].includes(enq.status)"
                    class="action-btn warning"
                    title="Cancel"
                    @click="confirmCancel(enq)"
                  >
                    <v-icon size="14">mdi-cancel</v-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar">
          <span class="pag-info">
            Page <strong>{{ enquiryPagination.page }}</strong> of <strong>{{ enquiryPagination.totalPages }}</strong>
            &nbsp;·&nbsp; {{ enquiryPagination.total }} total
          </span>
          <div class="pag-controls">
            <button class="pag-btn" :disabled="!enquiryPagination.hasPrev" @click="goTo(1)">
              <v-icon size="16">mdi-page-first</v-icon>
            </button>
            <button class="pag-btn" :disabled="!enquiryPagination.hasPrev" @click="goTo(enquiryPagination.page - 1)">
              <v-icon size="16">mdi-chevron-left</v-icon>
            </button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="pag-ellipsis">…</span>
              <button v-else class="pag-btn pag-num" :class="{ current: p === enquiryPagination.page }" @click="goTo(p)">{{ p }}</button>
            </template>
            <button class="pag-btn" :disabled="!enquiryPagination.hasNext" @click="goTo(enquiryPagination.page + 1)">
              <v-icon size="16">mdi-chevron-right</v-icon>
            </button>
            <button class="pag-btn" :disabled="!enquiryPagination.hasNext" @click="goTo(enquiryPagination.totalPages)">
              <v-icon size="16">mdi-page-last</v-icon>
            </button>
          </div>
          <div class="pag-jump">
            <span class="pag-jump-label">Go to</span>
            <input v-model.number="jumpPage" type="number" min="1" :max="enquiryPagination.totalPages" class="pag-jump-input" @keyup.enter="goTo(jumpPage)" />
            <button class="pag-jump-btn" @click="goTo(jumpPage)">Go</button>
          </div>
        </div>
      </template>
    </div>

    <!-- ═══════════════════════════════════════════════
         CREATE MODAL — Apply for Card
    ════════════════════════════════════════════════ -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">
            <v-icon size="18" class="mr-2">mdi-credit-card-plus-outline</v-icon>
            Apply for Card
          </h2>
          <button class="modal-close" @click="closeModal"><v-icon size="20">mdi-close</v-icon></button>
        </div>

        <div class="modal-body">
          <!-- Number of Cards -->
          <div class="form-field">
            <label class="field-label">Number of Cards <span class="req">*</span></label>
            <input
              v-model.number="form.noOfCards"
              type="number"
              min="1"
              max="1000"
              class="field-input"
              placeholder="e.g. 50"
            />
            <span v-if="formErrors.noOfCards" class="field-error">{{ formErrors.noOfCards }}</span>
          </div>

          <!-- Remarks -->
          <div class="form-field">
            <label class="field-label">Remarks</label>
            <textarea
              v-model="form.remarks"
              class="field-textarea"
              placeholder="Any special instructions or notes…"
              rows="2"
            ></textarea>
          </div>

          <!-- Delivery Address Section -->
          <div class="address-section">
            <div class="address-section-title">
              <v-icon size="16" class="mr-1">mdi-map-marker-outline</v-icon>
              Delivery Address
            </div>

            <!-- Loading address -->
            <div v-if="addressLoading" class="address-loading">
              <div class="sk sk-address-line"></div>
              <div class="sk sk-address-line short"></div>
            </div>

            <template v-else>
              <!-- Address mode selector -->
              <div class="addr-mode-tabs">
                <button
                  class="addr-tab"
                  :class="{ active: addressMode === 'official' }"
                  @click="addressMode = 'official'"
                  :disabled="!profileAddress"
                >
                  <v-icon size="14">mdi-home-outline</v-icon>
                  Use Official Address
                </button>
                <button
                  class="addr-tab"
                  :class="{ active: addressMode === 'new' }"
                  @click="addressMode = 'new'"
                >
                  <v-icon size="14">mdi-plus-circle-outline</v-icon>
                  Enter New Address
                </button>
              </div>

              <!-- Official address preview -->
              <div v-if="addressMode === 'official'" class="official-addr-card">
                <div v-if="profileAddress" class="addr-confirm-box">
                  <div class="addr-confirm-label">
                    <v-icon size="14" color="#1a6fc4">mdi-check-circle-outline</v-icon>
                    Your registered official address will be used for delivery
                  </div>
                  <div class="addr-lines">
                    <span>{{ profileAddress.official_address }}</span>
                    <span>{{ profileAddress.address1 }}<span v-if="profileAddress.address2">, {{ profileAddress.address2 }}</span></span>
                    <span v-if="profileAddress.address3">{{ profileAddress.address3 }}</span>
                    <span>{{ profileAddress.city }}, {{ profileAddress.state }} – {{ profileAddress.pincode }}</span>
                    <span v-if="profileAddress.mobile_number">📱 {{ profileAddress.mobile_number }}</span>
                  </div>
                </div>
                <div v-else class="addr-no-official">
                  <v-icon size="20" color="#c4881a">mdi-alert-outline</v-icon>
                  <span>No official address found on your profile. Please enter a new address.</span>
                </div>
              </div>

              <!-- New address form -->
              <div v-if="addressMode === 'new'" class="new-addr-form">
                <div class="form-grid">
                  <div class="form-field full">
                    <label class="field-label">Official Address / Company Name <span class="req">*</span></label>
                    <input v-model="newAddr.official_address" type="text" class="field-input" placeholder="Company name or official address" />
                    <span v-if="addrErrors.official_address" class="field-error">{{ addrErrors.official_address }}</span>
                  </div>
                  <div class="form-field full">
                    <label class="field-label">Address Line 1 <span class="req">*</span></label>
                    <input v-model="newAddr.address1" type="text" class="field-input" placeholder="Street / Building / Area" />
                    <span v-if="addrErrors.address1" class="field-error">{{ addrErrors.address1 }}</span>
                  </div>
                  <div class="form-field">
                    <label class="field-label">Address Line 2</label>
                    <input v-model="newAddr.address2" type="text" class="field-input" placeholder="Landmark (optional)" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">Address Line 3</label>
                    <input v-model="newAddr.address3" type="text" class="field-input" placeholder="Additional (optional)" />
                  </div>
                  <div class="form-field">
                    <label class="field-label">City <span class="req">*</span></label>
                    <input v-model="newAddr.city" type="text" class="field-input" placeholder="City" />
                    <span v-if="addrErrors.city" class="field-error">{{ addrErrors.city }}</span>
                  </div>
                  <div class="form-field">
                    <label class="field-label">State <span class="req">*</span></label>
                    <input v-model="newAddr.state" type="text" class="field-input" placeholder="State" />
                    <span v-if="addrErrors.state" class="field-error">{{ addrErrors.state }}</span>
                  </div>
                  <div class="form-field">
                    <label class="field-label">Pincode <span class="req">*</span></label>
                    <input v-model="newAddr.pincode" type="text" class="field-input" placeholder="6-digit pincode" maxlength="6" />
                    <span v-if="addrErrors.pincode" class="field-error">{{ addrErrors.pincode }}</span>
                  </div>
                  <div class="form-field">
                    <label class="field-label">Mobile Number <span class="req">*</span></label>
                    <input v-model="newAddr.mobile_number" type="tel" class="field-input" placeholder="10-digit mobile" maxlength="10" />
                    <span v-if="addrErrors.mobile_number" class="field-error">{{ addrErrors.mobile_number }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="submit-btn" :disabled="modalLoading" @click="submitForm">
            <v-icon v-if="modalLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Submit Enquiry</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2 class="modal-title danger-title">
            <v-icon size="18" class="mr-2" color="#ba1a1a">mdi-alert-circle-outline</v-icon>
            Delete Enquiry
          </h2>
          <button class="modal-close" @click="deleteTarget = null"><v-icon size="20">mdi-close</v-icon></button>
        </div>
        <div class="modal-body">
          <p class="confirm-text">
            Are you sure you want to delete enquiry <strong>{{ deleteTarget.enquiryNo }}</strong>?
            Only DRAFT enquiries can be deleted.
          </p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="deleteTarget = null">Cancel</button>
          <button class="delete-btn" :disabled="actionLoading" @click="doDelete">
            <v-icon v-if="actionLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Cancel Confirm -->
    <div v-if="cancelTarget" class="modal-backdrop" @click.self="cancelTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2 class="modal-title">
            <v-icon size="18" class="mr-2" color="#c4881a">mdi-cancel</v-icon>
            Cancel Enquiry
          </h2>
          <button class="modal-close" @click="cancelTarget = null"><v-icon size="20">mdi-close</v-icon></button>
        </div>
        <div class="modal-body">
          <p class="confirm-text" style="margin-bottom:12px;">
            Cancel enquiry <strong>{{ cancelTarget.enquiryNo }}</strong>?
          </p>
          <div class="form-field">
            <label class="field-label">Reason (optional)</label>
            <input v-model="cancelReason" type="text" class="field-input" placeholder="Reason for cancellation" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="cancelTarget = null">Go Back</button>
          <button class="warn-btn" :disabled="actionLoading" @click="doCancel">
            <v-icon v-if="actionLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Cancel Enquiry</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMsg" class="toast" :class="toastType">
      <v-icon size="16">{{ toastType === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      <span>{{ toastMsg }}</span>
      <button class="toast-close" @click="toastMsg = ''"><v-icon size="14">mdi-close</v-icon></button>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: "walletservicelayer",
  middleware: "auth",
});

import { ref, reactive, computed, onMounted } from "vue";
import { useCardEnquiryApi } from "@/composables/apis/useCardEnquiryApi";

const {
  enquiryList,
  enquiryPagination,
  enquiryStats,
  enquiryLoading,
  enquiryError,
  statsLoading,
  profileAddress,
  addressLoading,
  fetchEnquiries,
  fetchEnquiryStats,
  fetchProfileAddress,
  createEnquiry,
  submitEnquiry,
  cancelEnquiry,
  deleteEnquiry,
} = useCardEnquiryApi();

// ── Filters ────────────────────────────────────────────────────────────────
const filters = reactive({
  page:              1,
  limit:             10,
  search:            "",
  status:            "",
  paymentStatus:     "",
  fulfillmentStatus: "",
  sortBy:            "createdAt",
  sortDir:           "desc",
});
const limitOptions = [5, 10, 25, 50, 100];
const jumpPage     = ref(1);

const hasActiveFilters = computed(() =>
  filters.search || filters.status || filters.paymentStatus || filters.fulfillmentStatus
);

// ── Pagination helper ──────────────────────────────────────────────────────
const visiblePages = computed(() => {
  const total = enquiryPagination.value.totalPages;
  const cur   = enquiryPagination.value.page;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (cur > 3) pages.push("...");
  const start = Math.max(2, cur - 1);
  const end   = Math.min(total - 1, cur + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (cur < total - 2) pages.push("...");
  pages.push(total);
  return pages;
});

// ── Fetch ──────────────────────────────────────────────────────────────────
const doFetch = async () => {
  jumpPage.value = filters.page;
  await fetchEnquiries({
    page:              filters.page,
    limit:             filters.limit,
    search:            filters.search            || undefined,
    status:            filters.status            || undefined,
    paymentStatus:     filters.paymentStatus     || undefined,
    fulfillmentStatus: filters.fulfillmentStatus || undefined,
    sortBy:            filters.sortBy,
    sortDir:           filters.sortDir,
  });
};

let debounceTimer = null;
const debouncedFetch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { filters.page = 1; doFetch(); }, 400);
};

const goTo = (p) => {
  const clamped = Math.max(1, Math.min(p, enquiryPagination.value.totalPages));
  filters.page = clamped;
  doFetch();
};

const toggleSortDir = () => {
  filters.sortDir = filters.sortDir === "asc" ? "desc" : "asc";
  doFetch();
};

const viewEnquiry = (id) => navigateTo(`/wallet-service/card-enquiries/${id}`);

// ── Create Modal ───────────────────────────────────────────────────────────
const showModal    = ref(false);
const modalLoading = ref(false);
const addressMode  = ref("official"); // 'official' | 'new'

const emptyForm = () => ({ noOfCards: null, remarks: "" });
const emptyAddr = () => ({
  official_address: "",
  address1: "",
  address2: "",
  address3: "",
  city: "",
  state: "",
  pincode: "",
  mobile_number: "",
});

const form       = reactive(emptyForm());
const newAddr    = reactive(emptyAddr());
const formErrors = reactive({});
const addrErrors = reactive({});

const openCreateModal = async () => {
  Object.assign(form, emptyForm());
  Object.assign(newAddr, emptyAddr());
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  Object.keys(addrErrors).forEach(k => delete addrErrors[k]);
  addressMode.value = "official";
  showModal.value = true;
  await fetchProfileAddress();
  // If no official address, default to new
  if (!profileAddress.value) addressMode.value = "new";
};

const closeModal = () => { showModal.value = false; };

const validateForm = () => {
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  Object.keys(addrErrors).forEach(k => delete addrErrors[k]);

  if (!form.noOfCards || form.noOfCards < 1)
    formErrors.noOfCards = "Enter at least 1 card";

  if (addressMode.value === "new") {
    if (!newAddr.official_address) addrErrors.official_address = "Required";
    if (!newAddr.address1)         addrErrors.address1         = "Required";
    if (!newAddr.city)             addrErrors.city             = "Required";
    if (!newAddr.state)            addrErrors.state            = "Required";
    if (!newAddr.pincode)          addrErrors.pincode          = "Required";
    if (!newAddr.mobile_number)    addrErrors.mobile_number    = "Required";
  }

  return Object.keys(formErrors).length === 0 && Object.keys(addrErrors).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) return;
  modalLoading.value = true;
  try {
    const payload = {
      noOfCards: form.noOfCards,
      remarks:   form.remarks || undefined,
    };

    if (addressMode.value === "official" && profileAddress.value?.id) {
      payload.addressId = profileAddress.value.id;
    } else if (addressMode.value === "new") {
      payload.newAddress = { ...newAddr };
    }

    const res = await createEnquiry(payload);
    if (res?.statusCode === "00") {
      showToast(res.message || "Enquiry created!", "success");
      closeModal();
      doFetch();
      fetchEnquiryStats();
    } else {
      showToast(res?.message || "Failed to create enquiry", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    modalLoading.value = false;
  }
};

// ── Submit ─────────────────────────────────────────────────────────────────
const actionLoading = ref(false);

const handleSubmit = async (enq) => {
  actionLoading.value = true;
  try {
    const res = await submitEnquiry(enq.id);
    if (res?.statusCode === "00") {
      showToast("Enquiry submitted!", "success");
      doFetch(); fetchEnquiryStats();
    } else {
      showToast(res?.message || "Submit failed", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    actionLoading.value = false;
  }
};

// ── Delete ─────────────────────────────────────────────────────────────────
const deleteTarget = ref(null);
const confirmDelete = (enq) => { deleteTarget.value = enq; };
const doDelete = async () => {
  if (!deleteTarget.value) return;
  actionLoading.value = true;
  try {
    const res = await deleteEnquiry(deleteTarget.value.id);
    if (res?.statusCode === "00") {
      showToast("Enquiry deleted", "success");
      deleteTarget.value = null;
      doFetch(); fetchEnquiryStats();
    } else {
      showToast(res?.message || "Delete failed", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    actionLoading.value = false;
  }
};

// ── Cancel ─────────────────────────────────────────────────────────────────
const cancelTarget = ref(null);
const cancelReason = ref("");
const confirmCancel = (enq) => { cancelTarget.value = enq; cancelReason.value = ""; };
const doCancel = async () => {
  if (!cancelTarget.value) return;
  actionLoading.value = true;
  try {
    const res = await cancelEnquiry(cancelTarget.value.id, cancelReason.value || undefined);
    if (res?.statusCode === "00") {
      showToast("Enquiry cancelled", "success");
      cancelTarget.value = null;
      doFetch(); fetchEnquiryStats();
    } else {
      showToast(res?.message || "Cancel failed", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    actionLoading.value = false;
  }
};

// ── Export CSV ─────────────────────────────────────────────────────────────
const handleExport = () => {
  if (!enquiryList.value.length) { showToast("No data to export", "error"); return; }
  const headers = ["EnquiryNo","Qty","DeliveryCity","Status","Payment","Fulfillment","AppliedOn"];
  const rows = enquiryList.value.map(e => [
    e.enquiryNo, e.noOfCards,
    e.address?.city || "",
    e.status, e.paymentStatus, e.fulfillmentStatus,
    new Date(e.createdAt).toISOString(),
  ]);
  const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `card-enquiries-page-${filters.page}.csv`; a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported");
};

// ── Utilities ──────────────────────────────────────────────────────────────
const formatDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const formatTime = (s) =>
  s ? new Date(s).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

const formatFulfillment = (s) => ({
  PENDING:    "Pending",
  PROCESSING: "Processing",
  DISPATCHED: "Dispatched",
  DELIVERED:  "Delivered",
  FAILED:     "Failed",
}[s] || s);

const enquiryStatusClass = (s) => ({
  "pill-draft":     s === "DRAFT",
  "pill-submitted": s === "SUBMITTED",
  "pill-approved":  s === "APPROVED",
  "pill-rejected":  s === "REJECTED",
  "pill-cancelled": s === "CANCELLED",
});

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

// Toast
const toastMsg  = ref("");
const toastType = ref("success");
const showToast = (msg, type = "success") => {
  toastMsg.value = msg; toastType.value = type;
  setTimeout(() => { toastMsg.value = ""; }, 4000);
};

onMounted(() => { doFetch(); fetchEnquiryStats(); });
</script>

<style scoped>
* { box-sizing: border-box; }

.enq-page {
  padding: 24px;
  background: #f7f6f3;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title-wrap { display: flex; align-items: center; gap: 14px; }
.back-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: #fff; border: 1px solid #eceae3;
  display: flex; align-items: center; justify-content: center;
  color: #1a1a1a; text-decoration: none; transition: background .15s;
}
.back-btn:hover { background: #f0ede8; }
.page-title { margin: 0; font-size: 20px; font-weight: 700; color: #1a1a1a; }
.page-sub   { margin: 2px 0 0; font-size: 12px; color: #888780; }
.header-actions { display: flex; gap: 8px; align-items: center; }
.export-btn, .create-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 9px 18px; border-radius: 50px;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: background .15s;
}
.export-btn { border: 1px solid #dbd7cc; background: #fff; color: #1a1a1a; }
.export-btn:hover { background: #f5f5f3; }
.create-btn { border: none; background: #1a6fc4; color: #fff; }
.create-btn:hover { background: #155da0; }

/* Stats */
.stats-row { display: flex; gap: 12px; flex-wrap: wrap; }
.stat-card {
  flex: 1; min-width: 150px;
  background: #fff; border: 1px solid #eceae3; border-radius: 14px;
  padding: 16px; display: flex; align-items: center; gap: 12px;
}
.stat-skeleton { animation: pulse 1.8s infinite; }
.stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bg-blue   { background: #1a6fc4; }
.bg-green  { background: #3b7c0c; }
.bg-teal   { background: #1a8f8f; }
.bg-amber  { background: #c4881a; }
.bg-purple { background: #8b2fc9; }
.stat-body { display: flex; flex-direction: column; gap: 3px; }
.stat-label { font-size: 11px; color: #888780; font-weight: 500; }
.stat-value { font-size: 20px; font-weight: 700; color: #1a1a1a; line-height: 1; }

/* Filters */
.filters-bar {
  display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
  background: #fff; border: 1px solid #eceae3; border-radius: 14px;
  padding: 14px 16px;
}
.search-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 10px; color: #888780; pointer-events: none; }
.search-input {
  width: 100%; padding: 8px 30px 8px 32px;
  border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 13px; font-family: inherit; background: #faf9f7; outline: none; transition: border .2s;
}
.search-input:focus { border-color: #1a6fc4; background: #fff; }
.search-clear { position: absolute; right: 8px; background: none; border: none; cursor: pointer; color: #888780; }
.filter-group { display: flex; gap: 6px; flex-wrap: wrap; }
.mini-select {
  padding: 8px 10px; border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 12px; font-family: inherit; background: #faf9f7; outline: none; cursor: pointer;
}
.mini-select:focus { border-color: #1a6fc4; }
.sort-wrap { display: flex; gap: 4px; align-items: center; }
.sort-select { padding: 7px 10px; border: 1px solid #e0dcd8; border-radius: 8px; font-size: 12px; font-family: inherit; background: #faf9f7; outline: none; cursor: pointer; }
.sort-dir-btn {
  width: 32px; height: 32px; border: 1px solid #e0dcd8; border-radius: 8px;
  background: #faf9f7; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555552; transition: background .15s;
}
.sort-dir-btn:hover { background: #f0ede8; }
.per-page-wrap { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.per-page-label { font-size: 12px; color: #888780; }
.per-page-select { padding: 7px 10px; border: 1px solid #e0dcd8; border-radius: 8px; font-size: 12px; font-family: inherit; background: #faf9f7; outline: none; cursor: pointer; }

/* Summary */
.summary-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.summary-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; background: #fff; border: 1px solid #eceae3; font-size: 12px; }
.sc-label { color: #888780; }
.sc-value { font-weight: 600; color: #1a1a1a; }
.summary-chip.green { background: #eaf3de; border-color: #c2e0a0; }
.summary-chip.amber { background: #fff8e0; border-color: #f5d680; }
.summary-chip.blue  { background: #eef5fd; border-color: #c2d9f0; }

/* Panel */
.panel { background: #fff; border: 1px solid #eceae3; border-radius: 16px; overflow: hidden; }

/* Table */
.table-wrap { overflow-x: auto; }
.enq-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.enq-table thead tr { background: #faf9f7; border-bottom: 1px solid #eceae3; }
.enq-table th { padding: 12px 14px; text-align: left; font-size: 11px; font-weight: 600; color: #888780; text-transform: uppercase; letter-spacing: .4px; white-space: nowrap; }
.th-right   { text-align: right; }
.th-actions { text-align: right; }
.enq-row { border-bottom: 1px solid #f0ede8; cursor: pointer; transition: background .12s; }
.enq-row:hover { background: #faf9f7; }
.enq-table td { padding: 12px 14px; vertical-align: middle; }
.enq-no { font-family: "Courier New", monospace; font-size: 12px; font-weight: 700; color: #1a1a1a; letter-spacing: .5px; }
.qty-val { font-weight: 700; color: #1a1a1a; }
.td-address .address-preview { font-size: 12px; color: #555552; }
.td-address .no-address { font-size: 12px; color: #aaa8a0; font-style: italic; }

/* Status pills */
.status-pill { display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700; white-space: nowrap; }
.pill-draft      { background: #f5f5f3; color: #888780; }
.pill-submitted  { background: #eef5fd; color: #1a6fc4; }
.pill-approved   { background: #eaf3de; color: #3b6d11; }
.pill-rejected   { background: #fcebeb; color: #a32d2d; }
.pill-cancelled  { background: #f5f5f3; color: #888780; border: 1px solid #e0dcd8; }
.pill-unpaid     { background: #fff8e0; color: #c4881a; }
.pill-paid       { background: #eaf3de; color: #3b6d11; }
.pill-failed     { background: #fcebeb; color: #a32d2d; }
.pill-refunded   { background: #f0ebfa; color: #8b2fc9; }
.pill-pending    { background: #fff8e0; color: #c4881a; }
.pill-processing { background: #eef5fd; color: #1a6fc4; }
.pill-dispatched { background: #e8f4ff; color: #0070c0; }
.pill-delivered  { background: #eaf3de; color: #3b6d11; }

/* Date */
.td-date { white-space: nowrap; }
.date-main { display: block; font-size: 12px; font-weight: 500; color: #1a1a1a; }
.date-time { display: block; font-size: 11px; color: #888780; margin-top: 2px; }

/* Actions */
.td-actions { text-align: right; white-space: nowrap; }
.action-btn {
  width: 28px; height: 28px; border-radius: 7px;
  border: 1px solid #e0dcd8; background: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555552; transition: all .15s; margin-right: 3px;
}
.action-btn:hover { background: #f0ede8; }
.action-btn.submit-action:hover { background: #eef5fd; border-color: #c2d9f0; color: #1a6fc4; }
.action-btn.danger:hover   { background: #fcebeb; border-color: #f5ccc8; color: #a32d2d; }
.action-btn.warning:hover  { background: #fff8e0; border-color: #f5d680; color: #c4881a; }

/* Pagination */
.pagination-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; padding: 14px 20px; border-top: 1px solid #eceae3; background: #faf9f7; }
.pag-info { font-size: 12px; color: #888780; white-space: nowrap; }
.pag-info strong { color: #1a1a1a; }
.pag-controls { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.pag-btn { min-width: 32px; height: 32px; border: 1px solid #e0dcd8; border-radius: 8px; background: #fff; color: #1a1a1a; font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0 6px; transition: all .15s; }
.pag-btn:hover:not(:disabled) { background: #f0ede8; border-color: #d0ccc0; }
.pag-btn:disabled  { opacity: .35; cursor: default; }
.pag-btn.current   { background: #1a6fc4; color: #fff; border-color: #1a6fc4; font-weight: 700; }
.pag-ellipsis { padding: 0 4px; font-size: 14px; color: #888780; line-height: 32px; }
.pag-jump { display: flex; align-items: center; gap: 6px; }
.pag-jump-label { font-size: 12px; color: #888780; white-space: nowrap; }
.pag-jump-input { width: 50px; padding: 6px 8px; border: 1px solid #e0dcd8; border-radius: 8px; font-size: 12px; font-family: inherit; text-align: center; outline: none; background: #fff; }
.pag-jump-input:focus { border-color: #1a6fc4; }
.pag-jump-btn { padding: 6px 12px; border: none; border-radius: 8px; background: #1a6fc4; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; transition: background .15s; }
.pag-jump-btn:hover { background: #155da0; }

/* Skeleton */
.skeleton-rows { padding: 8px 0; }
.skeleton-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f0ede8; }
.sk { background: linear-gradient(90deg, #f0ede8 0%, #e5e0d7 50%, #f0ede8 100%); background-size: 200% 100%; border-radius: 6px; animation: shimmer 1.8s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: .6; } }
.sk-icon-s      { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
.sk-enq-no      { width: 120px; height: 13px; }
.sk-qty         { width: 30px; height: 13px; }
.sk-badge       { width: 70px; height: 20px; border-radius: 20px; }
.sk-date        { width: 70px; height: 13px; }
.sk-action      { width: 60px; height: 28px; border-radius: 8px; }
.sk-label       { height: 10px; width: 60px; }
.sk-value       { height: 22px; width: 40px; margin-top: 4px; }
.sk-address-line { height: 14px; width: 100%; margin-bottom: 8px; }
.sk-address-line.short { width: 60%; }

/* Empty / Error */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 60px 20px; color: #d0ccc0; }
.empty-state p { font-size: 14px; color: #888780; margin: 0; }
.empty-hint    { font-size: 12px; color: #aaa8a0; }
.error-state   { color: #ba1a1a; }
.create-btn-sm { display: inline-flex; align-items: center; gap: 5px; padding: 9px 18px; border: none; border-radius: 50px; background: #1a6fc4; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
.retry-btn { display: inline-flex; align-items: center; gap: 5px; padding: 9px 18px; border: none; border-radius: 50px; background: #ba1a1a; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; display: flex; flex-direction: column; animation: slideUp .2s ease; overflow: hidden; }
.modal-lg { max-width: 620px; }
.modal-sm { max-width: 420px; }
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid #eceae3; }
.modal-title  { font-size: 16px; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; margin: 0; }
.danger-title { color: #a32d2d; }
.modal-close  { background: none; border: none; cursor: pointer; color: #888780; display: flex; padding: 4px; transition: color .15s; }
.modal-close:hover { color: #1a1a1a; }
.modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #eceae3; background: #faf9f7; }

/* Form */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field.full { grid-column: 1 / -1; }
.field-label { font-size: 12px; font-weight: 600; color: #555552; }
.req { color: #ba1a1a; margin-left: 2px; }
.field-input { padding: 9px 12px; border: 1px solid #e0dcd8; border-radius: 8px; font-size: 13px; font-family: inherit; outline: none; background: #faf9f7; color: #1a1a1a; transition: border .2s; }
.field-input:focus { border-color: #1a6fc4; background: #fff; }
.field-textarea { padding: 9px 12px; border: 1px solid #e0dcd8; border-radius: 8px; font-size: 13px; font-family: inherit; outline: none; resize: vertical; background: #faf9f7; color: #1a1a1a; transition: border .2s; }
.field-textarea:focus { border-color: #1a6fc4; background: #fff; }
.field-error { font-size: 11px; color: #ba1a1a; }

/* Address section */
.address-section {
  border: 1px solid #e0dcd8; border-radius: 12px; overflow: hidden;
}
.address-section-title {
  display: flex; align-items: center;
  padding: 12px 16px; background: #faf9f7;
  font-size: 12px; font-weight: 700; color: #555552;
  text-transform: uppercase; letter-spacing: .4px;
  border-bottom: 1px solid #e0dcd8;
}
.address-loading { padding: 16px; display: flex; flex-direction: column; gap: 6px; }

/* Address mode tabs */
.addr-mode-tabs { display: flex; border-bottom: 1px solid #e0dcd8; }
.addr-tab {
  flex: 1; padding: 11px 16px; background: none; border: none;
  font-size: 12px; font-weight: 600; color: #888780; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all .15s; border-bottom: 2px solid transparent;
}
.addr-tab:hover:not(:disabled) { background: #faf9f7; color: #1a1a1a; }
.addr-tab.active { color: #1a6fc4; border-bottom-color: #1a6fc4; background: #fff; }
.addr-tab:disabled { opacity: .4; cursor: not-allowed; }

/* Official address card */
.official-addr-card { padding: 16px; }
.addr-confirm-box {
  background: #eef5fd; border: 1px solid #c2d9f0;
  border-radius: 10px; padding: 14px;
}
.addr-confirm-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; color: #1a6fc4;
  margin-bottom: 10px;
}
.addr-lines { display: flex; flex-direction: column; gap: 3px; }
.addr-lines span { font-size: 13px; color: #333; }
.addr-no-official {
  display: flex; align-items: center; gap: 8px;
  background: #fff8e0; border: 1px solid #f5d680;
  border-radius: 10px; padding: 12px;
  font-size: 13px; color: #c4881a;
}

/* New address form */
.new-addr-form { padding: 16px; }

/* Buttons */
.cancel-btn { padding: 9px 20px; border: 1px solid #e0dcd8; border-radius: 50px; background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; transition: background .15s; }
.cancel-btn:hover { background: #f5f5f3; }
.submit-btn { padding: 9px 24px; border: none; border-radius: 50px; background: #1a6fc4; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background .15s; }
.submit-btn:hover:not(:disabled) { background: #155da0; }
.submit-btn:disabled { opacity: .6; cursor: not-allowed; }
.delete-btn { padding: 9px 24px; border: none; border-radius: 50px; background: #ba1a1a; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background .15s; }
.delete-btn:hover:not(:disabled) { background: #9e1515; }
.delete-btn:disabled { opacity: .6; cursor: not-allowed; }
.warn-btn { padding: 9px 24px; border: none; border-radius: 50px; background: #c4881a; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background .15s; }
.warn-btn:hover:not(:disabled) { background: #a87016; }
.warn-btn:disabled { opacity: .6; cursor: not-allowed; }
.confirm-text { font-size: 14px; color: #333; line-height: 1.6; margin: 0; }
.confirm-text strong { color: #1a1a1a; }

/* Spinner */
.spin { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
.toast { position: fixed; bottom: 20px; right: 20px; background: #fff; border: 1px solid #dbd7cc; border-radius: 12px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,.15); z-index: 2999; max-width: 340px; animation: slideIn .3s ease; }
@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.toast.success { border-color: #b7e4c3; background: #f1fdf6; color: #2a5e3f; }
.toast.error   { border-color: #f5ccc8; background: #fef5f4; color: #a32d2d; }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; display: flex; margin-left: auto; }

@media (max-width: 800px) {
  .filters-bar   { flex-direction: column; align-items: stretch; }
  .per-page-wrap { margin-left: 0; }
  .pag-controls  { margin-left: 0; }
  .pagination-bar { justify-content: center; }
  .form-grid     { grid-template-columns: 1fr; }
  .addr-mode-tabs { flex-direction: column; }
}
</style>