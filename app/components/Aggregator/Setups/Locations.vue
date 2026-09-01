<template>
  <div class="page-root">

    <!-- ── Header ── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Locations & Pincodes</h1>
        <p class="page-sub">Manage the master list of pincode → city / district / state records</p>
      </div>
      <div class="header-status" v-if="!loading">
        <span class="status-pill status-blue">
          <span class="mdi mdi-map-marker-radius-outline"></span>
          {{ total }} Location{{ total === 1 ? '' : 's' }}
        </span>
      </div>
    </div>

    <!-- ── Toolbar ── -->
    <div class="toolbar-row">
      <div class="search-box">
        <span class="mdi mdi-magnify search-icon"></span>
        <input v-model="search" placeholder="Search by pincode, city, district or state…" class="search-input" />
      </div>
      <button class="btn-primary" @click="openAddModal">
        <span class="mdi mdi-plus"></span> Add Location
      </button>
    </div>

    <!-- ── Table ── -->
    <div class="list-card">
      <div v-if="loading" class="table-skel">
        <div v-for="i in 6" :key="i" class="skel-row"></div>
      </div>

      <div v-else-if="!locations.length" class="empty-state">
        <span class="mdi mdi-map-marker-off-outline empty-icon"></span>
        <p>No locations found{{ search ? ' for this search' : '' }}.</p>
      </div>

      <template v-else>
        <div class="table-wrap">
          <table class="loc-table">
            <thead>
              <tr>
                <th>Pincode</th>
                <th>City</th>
                <th>District</th>
                <th>State</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="loc in locations" :key="loc.id">
                <td class="mono">{{ loc.pincode }}</td>
                <td>{{ loc.city }}</td>
                <td>{{ loc.district }}</td>
                <td>{{ loc.statename }}</td>
                <td class="col-actions">
                  <button class="icon-btn" title="Edit" @click="openEditModal(loc)">
                    <span class="mdi mdi-pencil-outline"></span>
                  </button>
                  <button class="icon-btn icon-btn-danger" title="Delete" @click="openDeleteModal(loc)">
                    <span class="mdi mdi-trash-can-outline"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ── Pagination ── -->
        <div class="pagination-row" v-if="totalPages > 1">
          <button class="page-btn" :disabled="page <= 1" @click="goToPage(page - 1)">
            <span class="mdi mdi-chevron-left"></span>
          </button>
          <span class="page-info">Page {{ page }} of {{ totalPages }} · {{ total }} total</span>
          <button class="page-btn" :disabled="page >= totalPages" @click="goToPage(page + 1)">
            <span class="mdi mdi-chevron-right"></span>
          </button>
        </div>
      </template>
    </div>

    <!-- ── Add / Edit Modal ── -->
    <div v-if="modal.open" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <h3 class="modal-title">{{ modal.mode === 'add' ? 'Add Location' : 'Edit Location' }}</h3>
          <button class="modal-close" @click="closeModal"><span class="mdi mdi-close"></span></button>
        </div>

        <div class="modal-body">
          <p v-if="formError" class="form-error"><span class="mdi mdi-alert-circle-outline"></span> {{ formError }}</p>

          <div class="form-field">
            <label>Pincode <span class="req">*</span></label>
            <input v-model.trim="form.pincode" placeholder="e.g. 624003" maxlength="10" />
          </div>
          <div class="form-field">
            <label>City <span class="req">*</span></label>
            <input v-model.trim="form.city" placeholder="e.g. Karaikudi" />
          </div>
          <div class="form-field">
            <label>District <span class="req">*</span></label>
            <input v-model.trim="form.district" placeholder="e.g. Sivaganga" />
          </div>
          <div class="form-field">
            <label>State <span class="req">*</span></label>
            <input v-model.trim="form.statename" placeholder="e.g. Tamil Nadu" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-cancel" @click="closeModal">Cancel</button>
          <button class="btn-modal-primary" :disabled="saving" @click="saveLocation">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Saving…' : (modal.mode === 'add' ? 'Add Location' : 'Save Changes') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Delete Confirmation Modal ── -->
    <div v-if="deleteModal.open" class="modal-backdrop" @click.self="closeDeleteModal">
      <div class="modal-box modal-box-sm">
        <div class="modal-header">
          <h3 class="modal-title">Delete Location</h3>
          <button class="modal-close" @click="closeDeleteModal"><span class="mdi mdi-close"></span></button>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to delete
            <strong>{{ deleteModal.item?.pincode }} — {{ deleteModal.item?.city }}</strong>? This cannot be undone.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-modal-cancel" @click="closeDeleteModal">Cancel</button>
          <button class="btn-modal-danger" :disabled="deleteModal.loading" @click="executeDelete">
            <span v-if="deleteModal.loading" class="btn-spinner"></span>
            {{ deleteModal.loading ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Toast ── -->
    <div v-if="toast.show" class="toast" :class="toast.type === 'success' ? 'toast-success' : 'toast-error'">
      <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
      <span>{{ toast.message }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useSetupLocationsApi } from "~/composables/apis/useSetupLocations";

const { getLocations, createLocation, updateLocation, deleteLocation } = useSetupLocationsApi();

const locations = ref([]);
const loading = ref(true);
const search = ref("");
const page = ref(1);
const limit = ref(20);
const total = ref(0);
const totalPages = ref(1);
let searchDebounce = null;

const modal = reactive({ open: false, mode: "add", id: null });
const form = reactive({ pincode: "", city: "", district: "", statename: "" });
const saving = ref(false);
const formError = ref("");

const deleteModal = reactive({ open: false, loading: false, item: null });

const toast = reactive({ show: false, message: "", type: "success" });
function showToast(message, type = "success") {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  setTimeout(() => { toast.show = false; }, 3000);
}

async function loadLocations() {
  loading.value = true;
  try {
    const res = await getLocations({ page: page.value, limit: limit.value, search: search.value });
    if (res?.statusCode === "00") {
      locations.value = res.data || [];
      total.value = res.pagination?.total ?? locations.value.length;
      totalPages.value = res.pagination?.totalPages ?? 1;
    } else {
      locations.value = [];
      showToast(res?.message || "Failed to load locations", "error");
    }
  } catch {
    showToast("Failed to load locations", "error");
  } finally {
    loading.value = false;
  }
}

function goToPage(p) {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  loadLocations();
}

watch(search, () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    page.value = 1;
    loadLocations();
  }, 350);
});

function resetForm() {
  form.pincode = "";
  form.city = "";
  form.district = "";
  form.statename = "";
  formError.value = "";
}

function openAddModal() {
  resetForm();
  modal.mode = "add";
  modal.id = null;
  modal.open = true;
}

function openEditModal(loc) {
  resetForm();
  modal.mode = "edit";
  modal.id = loc.id;
  form.pincode = loc.pincode;
  form.city = loc.city;
  form.district = loc.district;
  form.statename = loc.statename;
  modal.open = true;
}

function closeModal() {
  modal.open = false;
}

async function saveLocation() {
  formError.value = "";
  if (!form.pincode || !form.city || !form.district || !form.statename) {
    formError.value = "Pincode, city, district and state are all required";
    return;
  }

  saving.value = true;
  try {
    const res = modal.mode === "add"
      ? await createLocation({ ...form })
      : await updateLocation(modal.id, { ...form });

    if (res?.statusCode === "00") {
      showToast(modal.mode === "add" ? "Location added successfully" : "Location updated successfully");
      closeModal();
      loadLocations();
    } else {
      formError.value = res?.message || "Failed to save location";
    }
  } catch {
    formError.value = "Failed to save location";
  } finally {
    saving.value = false;
  }
}

function openDeleteModal(loc) {
  deleteModal.item = loc;
  deleteModal.open = true;
}

function closeDeleteModal() {
  deleteModal.open = false;
  deleteModal.item = null;
}

async function executeDelete() {
  if (!deleteModal.item) return;
  deleteModal.loading = true;
  try {
    const res = await deleteLocation(deleteModal.item.id);
    if (res?.statusCode === "00") {
      showToast("Location deleted successfully");
      closeDeleteModal();
      // Step back a page if we just deleted the last row on this page.
      if (locations.value.length === 1 && page.value > 1) page.value -= 1;
      loadLocations();
    } else {
      showToast(res?.message || "Failed to delete location", "error");
      closeDeleteModal();
    }
  } catch {
    showToast("Failed to delete location", "error");
    closeDeleteModal();
  } finally {
    deleteModal.loading = false;
  }
}

onMounted(loadLocations);
</script>

<style scoped>
.page-root { display: flex; flex-direction: column; gap: 18px; padding: 24px; font-family: inherit; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-title { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0; }
.page-sub { font-size: .85rem; color: #64748b; margin: 4px 0 0; }
.header-status { display: flex; gap: 8px; }
.status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 999px; font-size: .78rem; font-weight: 700;
}
.status-blue { background: #eef2ff; color: #1142d4; }

.toolbar-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.search-box {
  display: flex; align-items: center; gap: 7px;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 8px 14px; flex: 1; min-width: 240px;
}
.search-icon { color: #94a3b8; font-size: 16px; }
.search-input { border: none; outline: none; font-size: .85rem; flex: 1; font-family: inherit; color: #0f172a; }
.search-input::placeholder { color: #94a3b8; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  background: #1142d4; color: #fff; border: none; border-radius: 10px;
  padding: 9px 18px; font-size: .85rem; font-weight: 700; cursor: pointer;
  box-shadow: 0 4px 14px rgba(17, 66, 212, .25); transition: filter .15s;
}
.btn-primary:hover { filter: brightness(1.08); }

.list-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
  overflow: hidden;
}

.table-skel { display: flex; flex-direction: column; gap: 1px; background: #f1f5f9; }
.skel-row { height: 44px; background: #fff; position: relative; overflow: hidden; }
.skel-row::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, #f1f5f9, transparent);
  animation: skel-shine 1.4s infinite;
}
@keyframes skel-shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px 16px; color: #94a3b8; }
.empty-icon { font-size: 2.4rem; margin-bottom: 8px; }

.table-wrap { overflow-x: auto; }
.loc-table { width: 100%; border-collapse: collapse; font-size: .85rem; }
.loc-table th {
  text-align: left; padding: 12px 16px; background: #f8fafc;
  font-size: .72rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
  color: #64748b; border-bottom: 1px solid #e2e8f0; white-space: nowrap;
}
.loc-table td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
.loc-table tr:last-child td { border-bottom: none; }
.loc-table .mono { font-family: monospace; font-weight: 700; color: #0f172a; }
.col-actions { text-align: right; white-space: nowrap; }

.icon-btn {
  background: none; border: none; cursor: pointer; color: #64748b;
  padding: 6px; border-radius: 7px; font-size: 1rem; margin-left: 2px;
}
.icon-btn:hover { background: #f1f5f9; color: #1e293b; }
.icon-btn-danger:hover { background: #fee2e2; color: #dc2626; }

.pagination-row {
  display: flex; align-items: center; justify-content: center; gap: 14px;
  padding: 14px 16px; border-top: 1px solid #f1f5f9; font-size: .82rem; color: #64748b;
}
.page-btn {
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e2e8f0;
  background: #fff; color: #334155; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.page-btn:hover:not(:disabled) { background: #f8fafc; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── Modal ── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(15, 23, 42, .45);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;
}
.modal-box {
  background: #fff; border-radius: 14px; width: 100%; max-width: 460px;
  max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0, 0, 0, .18);
}
.modal-box-sm { max-width: 420px; }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 14px; border-bottom: 1px solid #e2e8f0;
}
.modal-title { margin: 0; font-size: 1rem; font-weight: 700; color: #0f172a; }
.modal-close { background: none; border: none; cursor: pointer; font-size: 1.1rem; color: #94a3b8; }
.modal-body { padding: 18px 20px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
.modal-body p { font-size: .85rem; color: #475569; margin: 0; line-height: 1.5; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid #e2e8f0; }

.form-error {
  display: flex; align-items: center; gap: 6px;
  background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c;
  border-radius: 8px; padding: 8px 12px; font-size: .8rem;
}

.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field label { font-size: .75rem; font-weight: 600; color: #334155; }
.form-field input {
  border: 1px solid #cbd5e1; border-radius: 8px; padding: 9px 12px;
  font-size: .85rem; color: #0f172a; outline: none; font-family: inherit;
}
.form-field input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17, 66, 212, .1); }
.req { color: #dc2626; }

.btn-modal-cancel {
  background: #fff; color: #475569; border: 1px solid #cbd5e1; border-radius: 9px;
  padding: 9px 18px; font-size: .82rem; font-weight: 600; cursor: pointer;
}
.btn-modal-cancel:hover { background: #f8fafc; }
.btn-modal-primary {
  display: inline-flex; align-items: center; gap: 7px;
  background: #1142d4; color: #fff; border: none; border-radius: 9px;
  padding: 9px 18px; font-size: .82rem; font-weight: 700; cursor: pointer;
}
.btn-modal-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-modal-danger {
  display: inline-flex; align-items: center; gap: 7px;
  background: #dc2626; color: #fff; border: none; border-radius: 9px;
  padding: 9px 18px; font-size: .82rem; font-weight: 700; cursor: pointer;
}
.btn-modal-danger:disabled { opacity: .6; cursor: not-allowed; }

.btn-spinner {
  width: 13px; height: 13px; border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, .4); border-top-color: #fff;
  animation: spin .7s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Toast ── */
.toast {
  position: fixed; bottom: 24px; right: 24px; z-index: 1100;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 18px; border-radius: 10px; font-size: .85rem; font-weight: 600;
  color: #fff; box-shadow: 0 8px 24px rgba(0, 0, 0, .15);
}
.toast-success { background: #1e293b; }
.toast-error { background: #dc2626; }
</style>
