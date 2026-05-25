<template>
    <div class="page-root">

        <!-- ── Header ── -->
        <div class="page-header">
            <div>
                <h1 class="page-title">Services & Interfaces Setup</h1>
                <p class="page-sub">Manage payment services and gateway interfaces</p>
            </div>
            <div class="header-status" v-if="!loading">
                <span class="status-pill status-blue">
                    <span class="mdi mdi-cog-outline"></span>
                    {{ serviceList.length }} Services
                </span>
                <span class="status-pill status-purple">
                    <span class="mdi mdi-api"></span>
                    {{ interfaceList.length }} Interfaces
                </span>
            </div>
        </div>

        <!-- ── Tab Nav ── -->
        <div class="tab-nav">
            <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'services' }" @click="tab = 'services'">
                <span class="mdi mdi-view-grid-outline tab-icon"></span>
                Services
            </button>
            <button class="tab-btn" :class="{ 'tab-btn-active': tab === 'interfaces' }" @click="tab = 'interfaces'">
                <span class="mdi mdi-api tab-icon"></span>
                Interfaces
            </button>
        </div>

        <!-- ══════════ SERVICES TAB ══════════ -->
        <div v-if="tab === 'services'" class="tab-pane">

            <!-- Add Service Card -->
            <div class="action-card">
                <div class="action-card-header">
                    <div class="action-card-title-wrap">
                        <div class="action-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4">
                            <span class="mdi mdi-plus-circle-outline"></span>
                        </div>
                        <h2 class="action-card-title">Add New Service</h2>
                    </div>
                </div>
                <div class="add-form">
                    <!-- Service type input -->
                    <div class="form-field form-field-input">
                        <label class="form-label">Service Type</label>
                        <div class="input-wrap input-unique" :class="{ 'input-error': serviceInputError }">
                            <span class="mdi mdi-cog-outline input-icon"></span>
                            <input v-model="newService.service" class="form-input"
                                placeholder="e.g. AEPS, DMT, UPI, BBPS, MATM, POS" @input="serviceInputError = ''"
                                @keyup.enter="handleAddService" />
                        </div>
                        <p v-if="serviceInputError" class="field-error">
                            <span class="mdi mdi-alert-circle-outline"></span> {{ serviceInputError }}
                        </p>
                        <p class="field-hint">Allowed: AEPS · DMT · UPI · BBPS · MATM · POS</p>
                    </div>
                    <!-- <div class="form-field form-field-toggle">
                        <label class="form-label">Active</label>
                        <button class="toggle-btn" :class="{ 'toggle-on': newService.status }"
                            @click="newService.status = !newService.status">
                            <span class="toggle-knob"></span>
                        </button>
                    </div> -->
                    <div class="form-field form-field-button form-field-btn">
                        <button class="btn-add" :disabled="!newService.service || saving.service"
                            @click="handleAddService">
                            <span v-if="saving.service" class="btn-spinner"></span>
                            <span v-else class="mdi mdi-plus"></span>
                            Add Service
                        </button>
                    </div>
                </div>
            </div>

            <!-- Services List -->
            <div class="list-card">
                <div class="list-card-header">
                    <h2 class="list-card-title">
                        <span class="mdi mdi-view-list-outline"></span>
                        All Services
                    </h2>
                    <span class="count-badge">{{ serviceList.length }}</span>
                </div>

                <!-- Skeleton -->
                <div v-if="loading" class="list-body">
                    <div v-for="i in 4" :key="i" class="skel-service-row">
                        <div class="skel-service-top">
                            <div class="skel skel-icon-sm"></div>
                            <div class="skel-lines">
                                <div class="skel skel-line-md"></div>
                                <div class="skel skel-line-sm mt-1"></div>
                            </div>
                            <div class="skel skel-chip"></div>
                            <div class="skel skel-toggle"></div>
                        </div>
                    </div>
                </div>

                <!-- Actual List -->
                <div v-else class="list-body">
                    <div v-if="serviceList.length === 0" class="empty-state">
                        <div class="empty-icon-wrap">
                            <span class="mdi mdi-cog-off-outline"></span>
                        </div>
                        <p class="empty-title">No services yet</p>
                        <p class="empty-desc">Add your first service above</p>
                    </div>

                    <!-- Service Row (expandable) -->
                    <div v-for="svc in serviceList" :key="svc.id" class="service-block">

                        <!-- ── Service Header Row ── -->
                        <div class="list-row" :class="{ 'row-expanded': expandedService === svc.id }">
                            <div class="row-icon-wrap"
                                :style="{ background: serviceColor(svc.service) + '18', color: serviceColor(svc.service) }">
                                <span class="mdi" :class="serviceIcon(svc.service)"></span>
                            </div>

                            <div class="row-info">
                                <p class="row-name">{{ svc.service }}</p>
                                <p class="row-sub">
                                    <span class="mdi mdi-link-variant" style="font-size:10px"></span>
                                    {{ svc.interfaces?.length || 0 }} interface(s) linked
                                </p>
                            </div>

                            <!-- Linked interface mini-badges -->
                            <div class="linked-badges" v-if="svc.interfaces?.length">
                                <span v-for="iface in svc.interfaces.slice(0, 3)" :key="iface.id"
                                    class="iface-mini-badge">{{ iface.interface }}</span>
                                <span v-if="svc.interfaces.length > 3" class="iface-mini-badge iface-more">
                                    +{{ svc.interfaces.length - 3 }}
                                </span>
                            </div>

                            <span class="status-chip" :class="svc.status ? 'chip-green' : 'chip-grey'">
                                <span class="mdi"
                                    :class="svc.status ? 'mdi-check-circle-outline' : 'mdi-minus-circle-outline'"></span>
                                {{ svc.status ? 'Active' : 'Inactive' }}
                            </span>

                            <button class="toggle-btn" :class="{ 'toggle-on': svc.status }" :disabled="toggling[svc.id]"
                                @click.stop="toggleService(svc)">
                                <span class="toggle-knob"></span>
                            </button>

                            <!-- Expand toggle -->
                            <button class="btn-icon-expand" :class="{ 'expanded': expandedService === svc.id }"
                                @click="toggleExpand(svc.id)" title="Manage linked interfaces">
                                <span class="mdi mdi-chevron-down"></span>
                            </button>

                            <button class="btn-icon-danger" :disabled="deleting[svc.id]"
                                @click.stop="confirmDelete('service', svc)">
                                <span v-if="deleting[svc.id]" class="btn-spinner btn-spinner-sm"></span>
                                <span v-else class="mdi mdi-trash-can-outline"></span>
                            </button>
                        </div>

                        <!-- ── Expanded: Linked Interfaces Panel ── -->
                        <transition name="t-expand">
                            <div v-if="expandedService === svc.id" class="interfaces-panel">
                                <div class="interfaces-panel-header">
                                    <div class="panel-title-wrap">
                                        <span class="mdi mdi-link-variant panel-title-icon"></span>
                                        <span class="panel-title">Linked Interfaces</span>
                                        <span class="count-badge count-badge-sm">{{ svc.interfaces?.length || 0
                                        }}</span>
                                    </div>
                                    <!-- Add interface dropdown -->
                                    <div class="link-add-wrap" v-if="unlinkedInterfaces(svc).length > 0">
                                        <div class="select-wrap select-wrap-sm">
                                            <span class="mdi mdi-api select-icon"></span>
                                            <select v-model="linkSelections[svc.id]" class="form-select">
                                                <option value="">Link an interface…</option>
                                                <option v-for="iface in unlinkedInterfaces(svc)" :key="iface.id"
                                                    :value="iface.id">{{ iface.interface }}</option>
                                            </select>
                                        </div>
                                        <button class="btn-link" :disabled="!linkSelections[svc.id] || linking[svc.id]"
                                            @click="handleLinkInterface(svc)">
                                            <span v-if="linking[svc.id]" class="btn-spinner btn-spinner-sm"></span>
                                            <span v-else class="mdi mdi-link-plus"></span>
                                            Link
                                        </button>
                                    </div>
                                    <p v-else class="all-linked-note">
                                        <span class="mdi mdi-check-all"></span>
                                        All interfaces linked
                                    </p>
                                </div>

                                <!-- Linked interface rows -->
                                <div class="linked-list">
                                    <div v-if="!svc.interfaces?.length" class="linked-empty">
                                        <span class="mdi mdi-link-off"></span>
                                        No interfaces linked yet. Link one above.
                                    </div>

                                    <div v-for="iface in svc.interfaces" :key="iface.id" class="linked-row">
                                        <div class="linked-icon" style="background:rgba(124,58,237,.1);color:#7c3aed">
                                            <span class="mdi mdi-api"></span>
                                        </div>
                                        <div class="linked-info">
                                            <p class="linked-name">{{ iface.interface }}</p>
                                            <p class="linked-sub mono-sub" v-if="iface.apiKey">
                                                <span class="mdi mdi-key-outline" style="font-size:10px"></span>
                                                {{ maskKey(iface.apiKey) }}
                                            </p>
                                            <p class="linked-sub" v-else>No API key</p>
                                        </div>
                                        <span class="status-chip status-chip-xs"
                                            :class="iface.status ? 'chip-green' : 'chip-grey'">
                                            {{ iface.status ? 'Active' : 'Inactive' }}
                                        </span>
                                        <button class="btn-unlink" :disabled="unlinking[svc.id + iface.id]"
                                            @click="handleUnlinkInterface(svc, iface)" title="Unlink">
                                            <span v-if="unlinking[svc.id + iface.id]"
                                                class="btn-spinner btn-spinner-sm btn-spinner-red"></span>
                                            <span v-else class="mdi mdi-link-off"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </transition>

                    </div>
                </div>
            </div>
        </div>

        <!-- ══════════ INTERFACES TAB ══════════ -->
        <div v-if="tab === 'interfaces'" class="tab-pane">

            <!-- Add Interface Card -->
            <div class="action-card">
                <div class="action-card-header">
                    <div class="action-card-title-wrap">
                        <div class="action-icon-dot" style="background:rgba(124,58,237,.1);color:#7c3aed">
                            <span class="mdi mdi-plus-circle-outline"></span>
                        </div>
                        <h2 class="action-card-title">Add New Interface</h2>
                    </div>
                </div>
                <div class="add-form add-form-wide">
                    <!-- Interface type input -->
                    <div class="form-field">
                        <label class="form-label">Interface Type</label>
                        <div class="input-wrap" :class="{ 'input-error': interfaceInputError }">
                            <span class="mdi mdi-api input-icon"></span>
                            <input v-model="newInterface.interface" class="form-input"
                                placeholder="e.g. ISG, MOS, NSDL, FINO, CANARA…" @input="interfaceInputError = ''"
                                @keyup.enter="handleAddInterface" />
                        </div>
                        <p v-if="interfaceInputError" class="field-error">
                            <span class="mdi mdi-alert-circle-outline"></span> {{ interfaceInputError }}
                        </p>

                        <p class="field-hint">Allowed: AEPS · DMT · UPI · BBPS · MATM · POS</p>
                    </div>
                    <div class="form-field form-field-grow">
                        <label class="form-label">API Key <span class="label-optional">(optional)</span></label>
                        <div class="input-wrap">
                            <span class="mdi mdi-key-outline input-icon"></span>
                            <input v-model="newInterface.apiKey" class="form-input" placeholder="Enter API key…" />
                        </div>

                        <p class="field-dummy"></p>
                    </div>

                    <div style="d-flex" class="form-field form-field-btn">
                        <!-- <div class="form-field form-field-toggle">
                            <label class="form-label">Active</label>
                            <button class="toggle-btn" :class="{ 'toggle-on': newInterface.status }"
                                @click="newInterface.status = !newInterface.status">
                                <span class="toggle-knob"></span>
                            </button>
                        </div> -->
                        <button class="btn-add btn-add-purple" :disabled="!newInterface.interface || saving.interface"
                            @click="handleAddInterface">
                            <span v-if="saving.interface" class="btn-spinner"></span>
                            <span v-else class="mdi mdi-plus"></span>
                            Add Interface
                        </button>
                    </div>
                </div>
            </div>

            <!-- Interfaces List -->
            <div class="list-card">
                <div class="list-card-header">
                    <h2 class="list-card-title">
                        <span class="mdi mdi-api" style="color:#7c3aed"></span>
                        All Interfaces
                    </h2>
                    <span class="count-badge count-badge-purple">{{ interfaceList.length }}</span>
                </div>

                <div v-if="loading" class="list-body">
                    <div v-for="i in 4" :key="i" class="list-row">
                        <div class="skel skel-icon-sm"></div>
                        <div class="skel-lines">
                            <div class="skel skel-line-md"></div>
                            <div class="skel skel-line-sm mt-1"></div>
                        </div>
                        <div class="skel skel-chip"></div>
                        <div class="skel skel-toggle"></div>
                    </div>
                </div>

                <div v-else class="list-body">
                    <div v-if="interfaceList.length === 0" class="empty-state">
                        <div class="empty-icon-wrap" style="background:rgba(124,58,237,.08);color:#7c3aed">
                            <span class="mdi mdi-api"></span>
                        </div>
                        <p class="empty-title">No interfaces yet</p>
                        <p class="empty-desc">Add your first interface above</p>
                    </div>

                    <div v-for="iface in interfaceList" :key="iface.id" class="list-row">

                        <template v-if="editingInterface === iface.id">
                            <div class="edit-row">
                                <div class="input-wrap input-wrap-sm">
                                    <span class="mdi mdi-key-outline input-icon"></span>
                                    <input v-model="editApiKey" class="form-input" placeholder="API Key…" />
                                </div>
                                <button class="btn-save" @click="saveInterfaceEdit(iface)"
                                    :disabled="saving.interfaceEdit">
                                    <span v-if="saving.interfaceEdit" class="btn-spinner btn-spinner-sm"></span>
                                    <span v-else class="mdi mdi-check"></span>
                                    Save
                                </button>
                                <button class="btn-cancel" @click="editingInterface = null">
                                    <span class="mdi mdi-close"></span>
                                </button>
                            </div>
                        </template>

                        <template v-else>
                            <div class="row-icon-wrap" style="background:rgba(124,58,237,.1);color:#7c3aed">
                                <span class="mdi mdi-api"></span>
                            </div>

                            <div class="row-info">
                                <p class="row-name">{{ iface.interface }}</p>
                                <p class="row-sub mono-sub" v-if="iface.apiKey">
                                    <span class="mdi mdi-key-outline" style="font-size:10px"></span>
                                    {{ maskKey(iface.apiKey) }}
                                </p>
                                <p class="row-sub" v-else style="color:#cbd5e1">No API key set</p>
                            </div>

                            <!-- Which services this interface is linked to -->
                            <div class="linked-badges" v-if="interfaceLinkedServices(iface.id).length">
                                <span v-for="svc in interfaceLinkedServices(iface.id).slice(0, 3)" :key="svc.id"
                                    class="svc-mini-badge"
                                    :style="{ background: serviceColor(svc.service) + '18', color: serviceColor(svc.service) }">{{
                                        svc.service }}</span>
                                <span v-if="interfaceLinkedServices(iface.id).length > 3"
                                    class="iface-mini-badge iface-more">
                                    +{{ interfaceLinkedServices(iface.id).length - 3 }}
                                </span>
                            </div>
                            <span v-else class="no-links-note">Not linked to any service</span>

                            <span class="status-chip" :class="iface.status ? 'chip-green' : 'chip-grey'">
                                <span class="mdi"
                                    :class="iface.status ? 'mdi-check-circle-outline' : 'mdi-minus-circle-outline'"></span>
                                {{ iface.status ? 'Active' : 'Inactive' }}
                            </span>

                            <button class="toggle-btn" :class="{ 'toggle-on': iface.status }"
                                :disabled="toggling[iface.id]" @click="toggleInterface(iface)">
                                <span class="toggle-knob"></span>
                            </button>

                            <button class="btn-icon-edit" @click="startEditInterface(iface)" title="Edit API Key">
                                <span class="mdi mdi-pencil-outline"></span>
                            </button>

                            <button class="btn-icon-danger" :disabled="deleting[iface.id]"
                                @click="confirmDelete('interface', iface)">
                                <span v-if="deleting[iface.id]" class="btn-spinner btn-spinner-sm"></span>
                                <span v-else class="mdi mdi-trash-can-outline"></span>
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Toast ── -->
        <transition name="t-toast">
            <div v-if="toast.show" class="toast" :class="toast.type === 'success' ? 'toast-success' : 'toast-error'">
                <span class="mdi toast-icon"
                    :class="toast.type === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></span>
                <span>{{ toast.message }}</span>
            </div>
        </transition>

        <!-- ── Delete Confirm Modal ── -->
        <transition name="t-modal">
            <div v-if="deleteModal.show" class="modal-backdrop" @click.self="deleteModal.show = false">
                <div class="modal-card">
                    <div class="modal-icon-wrap modal-icon-danger">
                        <span class="mdi mdi-trash-can-outline"></span>
                    </div>
                    <h3 class="modal-title">Delete {{ deleteModal.type === 'service' ? 'Service' : 'Interface' }}</h3>
                    <p class="modal-desc">
                        Are you sure you want to delete
                        <strong>{{ deleteModal.item?.service || deleteModal.item?.interface }}</strong>?
                        This cannot be undone.
                    </p>
                    <div class="modal-actions">
                        <button class="btn-modal-cancel" @click="deleteModal.show = false">Cancel</button>
                        <button class="btn-modal-danger" :disabled="deleteModal.loading" @click="executeDelete">
                            <span v-if="deleteModal.loading" class="btn-spinner btn-spinner-sm"></span>
                            <span v-else class="mdi mdi-trash-can-outline"></span>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </transition>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useSetupServicesApi } from "~/composables/apis/useSetupServices";

const {
    getAllServices,
    createService,
    updateService,
    deleteService,
    getAllInterfaces,
    createInterface,
    updateInterface,
    deleteInterface,
    linkInterface,
    unlinkInterface,
} = useSetupServicesApi();

definePageMeta({ layout: "aggregatorlayer", middleware: "auth" });

/* ── State ── */
const tab = ref("services");
const loading = ref(true);
const serviceList = ref([]);
const interfaceList = ref([]);

const newService = reactive({ service: "", status: true });
const newInterface = reactive({ interface: "", apiKey: "", status: true });
const saving = reactive({ service: false, interface: false, interfaceEdit: false });
const toggling = reactive({});
const deleting = reactive({});
const linking = reactive({});
const unlinking = reactive({});

const expandedService = ref(null);
const linkSelections = reactive({});  // { [serviceId]: interfaceId }
const editingInterface = ref(null);
const editApiKey = ref("");

const toast = reactive({ show: false, type: "success", message: "" });
const deleteModal = reactive({ show: false, loading: false, type: "", item: null });

const VALID_SERVICES = ["AEPS", "DMT", "UPI", "BBPS", "MATM", "POS"];
const VALID_INTERFACES = ["ISG", "MOS", "WORLD", "BUCKSBOX", "NSDL", "FINO", "CANARA"];

const serviceInputError = ref('');
const interfaceInputError = ref('');

async function handleAddService() {
    const val = newService.service.trim().toUpperCase();
    if (!val) return;

    if (!VALID_SERVICES.includes(val)) {
        serviceInputError.value = `"${val}" is not a valid service. Use: ${VALID_SERVICES.join(', ')}`;
        return;
    }

    if (serviceList.value.some(s => s.service === val)) {
        serviceInputError.value = `${val} already exists`;
        return;
    }

    saving.service = true;
    try {
        const res = await createService({ service: val, status: newService.status });
        if (res?.statusCode === "00") {
            serviceList.value.push({ ...res.data, interfaces: [] });
            newService.service = "";
            newService.status = true;
            showToast("Service added successfully");
        } else {
            serviceInputError.value = res?.message || "Failed to add service";
        }
    } finally {
        saving.service = false;
    }
}

async function handleAddInterface() {
    const val = newInterface.interface.trim().toUpperCase();
    if (!val) return;

    if (!VALID_INTERFACES.includes(val)) {
        interfaceInputError.value = `"${val}" is not a valid interface. Use: ${VALID_INTERFACES.join(', ')}`;
        return;
    }

    if (interfaceList.value.some(i => i.interface === val)) {
        interfaceInputError.value = `${val} already exists`;
        return;
    }

    saving.interface = true;
    try {
        const res = await createInterface({
            interface: val,
            apiKey: newInterface.apiKey || undefined,
            status: newInterface.status,
        });
        if (res?.statusCode === "00") {
            interfaceList.value.push(res.data);
            newInterface.interface = "";
            newInterface.apiKey = "";
            newInterface.status = true;
            showToast("Interface added successfully");
        } else {
            interfaceInputError.value = res?.message || "Failed to add interface";
        }
    } finally {
        saving.interface = false;
    }
}

/* ── Helpers ── */
const serviceIcon = (s) => ({
    AEPS: "mdi-fingerprint", DMT: "mdi-bank-transfer", UPI: "mdi-qrcode",
    BBPS: "mdi-receipt-text-outline", MATM: "mdi-atm", POS: "mdi-point-of-sale",
}[s] || "mdi-cog-outline");

const serviceColor = (s) => ({
    AEPS: "#059669", DMT: "#d97706", UPI: "#1142d4",
    BBPS: "#db2777", MATM: "#7c3aed", POS: "#0891b2",
}[s] || "#64748b");

const maskKey = (key) => key ? key.slice(0, 6) + "••••••" + key.slice(-4) : "";

// Interfaces not yet linked to this service
const unlinkedInterfaces = (svc) => {
    const linkedIds = new Set((svc.interfaces || []).map(i => i.id));
    return interfaceList.value.filter(i => !linkedIds.has(i.id));
};

// Which services have this interface linked (for the interfaces tab)
const interfaceLinkedServices = (ifaceId) => {
    return serviceList.value.filter(svc =>
        (svc.interfaces || []).some(i => i.id === ifaceId)
    );
};

function toggleExpand(serviceId) {
    expandedService.value = expandedService.value === serviceId ? null : serviceId;
}

function showToast(message, type = "success") {
    toast.message = message;
    toast.type = type;
    toast.show = true;
    setTimeout(() => { toast.show = false; }, 3000);
}

/* ── Load ── */
async function loadAll() {
    loading.value = true;
    try {
        const [svcRes, ifaceRes] = await Promise.all([getAllServices(), getAllInterfaces()]);
        serviceList.value = svcRes?.data || [];
        interfaceList.value = ifaceRes?.data || [];
    } catch (e) {
        showToast("Failed to load data", "error");
    } finally {
        loading.value = false;
    }
}

/* ── Service Actions ── */
// async function handleAddService() {
//   saving.service = true;
//   try {
//     const res = await createService({ service: newService.service, status: newService.status });
//     if (res?.statusCode === "00") {
//       serviceList.value.push({ ...res.data, interfaces: [] });
//       newService.service = "";
//       newService.status  = true;
//       showToast("Service added successfully");
//     } else {
//       showToast(res?.message || "Failed to add service", "error");
//     }
//   } finally {
//     saving.service = false;
//   }
// }

async function toggleService(svc) {
    toggling[svc.id] = true;
    try {
        const res = await updateService(svc.id, { status: !svc.status });
        if (res?.statusCode === "00") {
            const idx = serviceList.value.findIndex(s => s.id === svc.id);
            if (idx !== -1) serviceList.value[idx].status = !svc.status;
            showToast(`Service ${!svc.status ? "activated" : "deactivated"}`);
        } else {
            showToast(res?.message || "Failed to update", "error");
        }
    } finally {
        delete toggling[svc.id];
    }
}

/* ── Link / Unlink ── */
async function handleLinkInterface(svc) {
    const interfaceId = linkSelections[svc.id];
    if (!interfaceId) return;
    linking[svc.id] = true;
    try {
        const res = await linkInterface(svc.id, interfaceId);
        if (res?.statusCode === "00") {
            // Find the full interface object and push into the service's interfaces array
            const ifaceObj = interfaceList.value.find(i => i.id === interfaceId);
            if (ifaceObj) {
                const idx = serviceList.value.findIndex(s => s.id === svc.id);
                if (idx !== -1) {
                    serviceList.value[idx].interfaces = [
                        ...(serviceList.value[idx].interfaces || []),
                        ifaceObj,
                    ];
                }
            }
            linkSelections[svc.id] = "";
            showToast("Interface linked successfully");
        } else {
            showToast(res?.message || "Failed to link", "error");
        }
    } finally {
        delete linking[svc.id];
    }
}

async function handleUnlinkInterface(svc, iface) {
    const key = svc.id + iface.id;
    unlinking[key] = true;
    try {
        const res = await unlinkInterface(svc.id, iface.id);
        if (res?.statusCode === "00") {
            const svcIdx = serviceList.value.findIndex(s => s.id === svc.id);
            if (svcIdx !== -1) {
                serviceList.value[svcIdx].interfaces =
                    serviceList.value[svcIdx].interfaces.filter(i => i.id !== iface.id);
            }
            showToast("Interface unlinked");
        } else {
            showToast(res?.message || "Failed to unlink", "error");
        }
    } finally {
        delete unlinking[key];
    }
}

/* ── Interface Actions ── */
// async function handleAddInterface() {
//   saving.interface = true;
//   try {
//     const res = await createInterface({
//       interface: newInterface.interface,
//       apiKey:    newInterface.apiKey || undefined,
//       status:    newInterface.status,
//     });
//     if (res?.statusCode === "00") {
//       interfaceList.value.push(res.data);
//       newInterface.interface = "";
//       newInterface.apiKey    = "";
//       newInterface.status    = true;
//       showToast("Interface added successfully");
//     } else {
//       showToast(res?.message || "Failed to add interface", "error");
//     }
//   } finally {
//     saving.interface = false;
//   }
// }

async function toggleInterface(iface) {
    toggling[iface.id] = true;
    try {
        const res = await updateInterface(iface.id, { status: !iface.status });
        if (res?.statusCode === "00") {
            const idx = interfaceList.value.findIndex(i => i.id === iface.id);
            if (idx !== -1) interfaceList.value[idx].status = !iface.status;
            // Also update in serviceList's embedded interfaces
            serviceList.value.forEach(svc => {
                const iIdx = (svc.interfaces || []).findIndex(i => i.id === iface.id);
                if (iIdx !== -1) svc.interfaces[iIdx].status = !iface.status;
            });
            showToast(`Interface ${!iface.status ? "activated" : "deactivated"}`);
        } else {
            showToast(res?.message || "Failed to update", "error");
        }
    } finally {
        delete toggling[iface.id];
    }
}

function startEditInterface(iface) {
    editingInterface.value = iface.id;
    editApiKey.value = iface.apiKey || "";
}

async function saveInterfaceEdit(iface) {
    saving.interfaceEdit = true;
    try {
        const res = await updateInterface(iface.id, { apiKey: editApiKey.value });
        if (res?.statusCode === "00") {
            const idx = interfaceList.value.findIndex(i => i.id === iface.id);
            if (idx !== -1) interfaceList.value[idx].apiKey = editApiKey.value;
            // Sync in service panels too
            serviceList.value.forEach(svc => {
                const iIdx = (svc.interfaces || []).findIndex(i => i.id === iface.id);
                if (iIdx !== -1) svc.interfaces[iIdx].apiKey = editApiKey.value;
            });
            editingInterface.value = null;
            showToast("API key updated");
        } else {
            showToast(res?.message || "Failed to update", "error");
        }
    } finally {
        saving.interfaceEdit = false;
    }
}

/* ── Delete ── */
function confirmDelete(type, item) {
    deleteModal.type = type;
    deleteModal.item = item;
    deleteModal.show = true;
}

async function executeDelete() {
    const { type, item } = deleteModal;
    deleteModal.loading = true;
    deleting[item.id] = true;
    try {
        const res = type === "service"
            ? await deleteService(item.id)
            : await deleteInterface(item.id);

        if (res?.statusCode === "00") {
            if (type === "service") {
                serviceList.value = serviceList.value.filter(s => s.id !== item.id);
                if (expandedService.value === item.id) expandedService.value = null;
            } else {
                interfaceList.value = interfaceList.value.filter(i => i.id !== item.id);
                // Remove from all services' interfaces arrays too
                serviceList.value.forEach(svc => {
                    svc.interfaces = (svc.interfaces || []).filter(i => i.id !== item.id);
                });
            }
            showToast(`${type === "service" ? "Service" : "Interface"} deleted`);
            deleteModal.show = false;
        } else {
            showToast(res?.message || "Failed to delete", "error");
        }
    } finally {
        deleteModal.loading = false;
        delete deleting[item.id];
    }
}

onMounted(loadAll);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.page-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 32px;
}

/* ── Header ── */
.page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.page-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
}

@media(min-width:640px) {
    .page-title {
        font-size: 24px;
    }
}

.page-sub {
    font-size: 12px;
    color: #64748b;
    margin-top: 3px;
}

.header-status {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.status-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
}

.status-blue {
    background: rgba(17, 66, 212, .08);
    color: #1142d4;
    border: 1px solid rgba(17, 66, 212, .2);
}

.status-purple {
    background: rgba(124, 58, 237, .08);
    color: #7c3aed;
    border: 1px solid rgba(124, 58, 237, .2);
}

.status-pill .mdi {
    font-size: 13px;
}

/* ── Tabs ── */
.tab-nav {
    display: flex;
    gap: 4px;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 10px;
    align-self: flex-start;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 7px;
    border: none;
    background: transparent;
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background .15s, color .15s;
    white-space: nowrap;
}

.tab-btn:hover {
    color: #334155;
    background: rgba(255, 255, 255, .6);
}

.tab-btn-active {
    background: #fff !important;
    color: #1142d4 !important;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .08);
}

.tab-icon {
    font-size: 15px;
}

.tab-pane {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* ── Action Card ── */
.action-card {
    background: #fff;
    border: 1px solid #e8edf3;
    border-radius: 14px;
    padding: 18px 20px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .04);
}

.action-card-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
}

.action-card-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.action-icon-dot {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

.action-card-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
}

.add-form {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    width: 100%;
}

@media(min-width:640px) {
    .add-form {
        grid-template-columns: 1fr auto auto;
    }
}

@media(min-width:640px) {
    .add-form-wide {
        grid-template-columns: 1fr 1.5fr auto auto;
    }
}

.form-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-field-input{
    width: 90%
}

.form-field-grow {
    flex: 1;
}

.form-field-toggle {
    align-items: center;
    flex-direction: row;
    gap: 10px;
    padding-bottom: 2px;
}

.form-field-btn {
    justify-content: flex-end;
}

.form-field-button{
    width: fit-content
}

.form-label {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: .07em;
}

.label-optional {
    font-weight: 400;
    color: #cbd5e1;
    text-transform: none;
    letter-spacing: 0;
}

.select-wrap,
.input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 9px;
    padding: 0 12px;
    height: 42px;
    transition: border-color .14s, background .14s;
}

.select-wrap:focus-within,
.input-wrap:focus-within {
    border-color: #1142d4;
    background: #fff;
}

.select-wrap-sm {
    height: 34px;
    border-radius: 7px;
}

.input-wrap-sm {
    flex: 1;
    height: 36px;
}

.input-unique {
    width: 100%;
}

.select-icon,
.input-icon {
    font-size: 15px;
    color: #94a3b8;
    flex-shrink: 0;
}

.form-select,
.form-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 13px;
    color: #334155;
    outline: none;
    font-family: 'DM Sans', sans-serif;
}

.form-select {
    cursor: pointer;
}

.form-input::placeholder {
    color: #94a3b8;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 42px;
    padding: 0 20px;
    border-radius: 9px;
    background: #1142d4;
    color: #fff;
    border: none;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(17, 66, 212, .22);
    transition: filter .14s;
    white-space: nowrap;
}

.btn-add:hover:not(:disabled) {
    filter: brightness(1.08);
}

.btn-add:disabled {
    opacity: .5;
    cursor: not-allowed;
}

.btn-add-purple {
    background: #7c3aed;
    box-shadow: 0 3px 10px rgba(124, 58, 237, .22);
}

.btn-add .mdi {
    font-size: 16px;
}

/* ── List Card ── */
.list-card {
    background: #fff;
    border: 1px solid #e8edf3;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .04);
}

.list-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-bottom: 1px solid #f1f5f9;
}

.list-card-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    flex: 1;
}

.list-card-title .mdi {
    font-size: 16px;
    color: #1142d4;
}

.count-badge {
    background: rgba(17, 66, 212, .08);
    color: #1142d4;
    border: 1px solid rgba(17, 66, 212, .2);
    padding: 2px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
}

.count-badge-purple {
    background: rgba(124, 58, 237, .08);
    color: #7c3aed;
    border-color: rgba(124, 58, 237, .2);
}

.count-badge-sm {
    padding: 1px 7px;
    font-size: 10px;
}

.list-body {
    display: flex;
    flex-direction: column;
}

/* ── Service Block (row + expandable panel) ── */
.service-block {
    border-bottom: 1px solid #f1f5f9;
}

.service-block:last-child {
    border-bottom: none;
}

.list-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 20px;
    transition: background .12s;
    flex-wrap: wrap;
}

.list-row:hover {
    background: rgba(17, 66, 212, .02);
}

.row-expanded {
    background: rgba(17, 66, 212, .02);
    border-bottom: 1px solid #f1f5f9;
}

.row-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.row-info {
    flex: 1;
    min-width: 0;
}

.row-name {
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
}

.row-sub {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 3px;
}

.mono-sub {
    font-family: 'DM Mono', monospace;
}

/* ── Mini Badges ── */
.linked-badges {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
    flex-shrink: 0;
}

.iface-mini-badge {
    background: rgba(124, 58, 237, .08);
    color: #7c3aed;
    border: 1px solid rgba(124, 58, 237, .2);
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
}

.svc-mini-badge {
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
    border: 1px solid transparent;
}

.iface-more {
    background: #f1f5f9;
    color: #64748b;
    border-color: #e2e8f0;
}

.no-links-note {
    font-size: 11px;
    color: #cbd5e1;
    white-space: nowrap;
    flex-shrink: 0;
}

/* ── Status Chip ── */
.status-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    white-space: nowrap;
    flex-shrink: 0;
}

.status-chip-xs {
    padding: 2px 7px;
    font-size: 9px;
}

.chip-green {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
}

.chip-grey {
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
}

.status-chip .mdi {
    font-size: 11px;
}

/* ── Toggle ── */
.toggle-btn {
    width: 44px;
    height: 24px;
    border-radius: 9999px;
    flex-shrink: 0;
    background: #e2e8f0;
    border: none;
    cursor: pointer;
    position: relative;
    transition: background .2s;
    padding: 0;
}

.toggle-btn:disabled {
    opacity: .5;
    cursor: not-allowed;
}

.toggle-btn.toggle-on {
    background: #22c55e;
}

.toggle-knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .15);
}

.toggle-on .toggle-knob {
    transform: translateX(20px);
}

/* ── Icon Buttons ── */
.btn-icon-danger,
.btn-icon-edit,
.btn-icon-expand {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    flex-shrink: 0;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    cursor: pointer;
    transition: background .13s, color .13s, border-color .13s, transform .2s;
}

.btn-icon-danger {
    color: #94a3b8;
}

.btn-icon-danger:hover:not(:disabled) {
    background: #fff1f2;
    color: #be123c;
    border-color: #fecdd3;
}

.btn-icon-danger:disabled {
    opacity: .4;
    cursor: not-allowed;
}

.btn-icon-edit {
    color: #94a3b8;
}

.btn-icon-edit:hover {
    background: rgba(17, 66, 212, .07);
    color: #1142d4;
    border-color: rgba(17, 66, 212, .2);
}

.btn-icon-expand {
    color: #94a3b8;
}

.btn-icon-expand:hover {
    background: rgba(17, 66, 212, .07);
    color: #1142d4;
    border-color: rgba(17, 66, 212, .2);
}

.btn-icon-expand.expanded {
    color: #1142d4;
    background: rgba(17, 66, 212, .07);
    border-color: rgba(17, 66, 212, .2);
}

.btn-icon-expand.expanded .mdi {
    transform: rotate(180deg);
}

.btn-icon-expand .mdi {
    transition: transform .22s;
}

/* ── Expanded Interfaces Panel ── */
.interfaces-panel {
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
    padding: 16px 20px 18px;
}

.interfaces-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 14px;
}

.panel-title-wrap {
    display: flex;
    align-items: center;
    gap: 7px;
}

.panel-title-icon {
    font-size: 15px;
    color: #1142d4;
}

.panel-title {
    font-size: 12px;
    font-weight: 700;
    color: #334155;
}

.link-add-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-link {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 34px;
    padding: 0 14px;
    border-radius: 7px;
    background: #1142d4;
    color: #fff;
    border: none;
    font-size: 12px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: filter .13s;
    white-space: nowrap;
}

.btn-link:hover:not(:disabled) {
    filter: brightness(1.08);
}

.btn-link:disabled {
    opacity: .5;
    cursor: not-allowed;
}

.btn-link .mdi {
    font-size: 14px;
}

.all-linked-note {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #22c55e;
    font-weight: 600;
}

.all-linked-note .mdi {
    font-size: 14px;
}

/* Linked rows inside panel */
.linked-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.linked-empty {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #94a3b8;
    padding: 12px 0;
}

.linked-empty .mdi {
    font-size: 16px;
}

.linked-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1px solid #e8edf3;
    border-radius: 10px;
    padding: 10px 14px;
    transition: border-color .12s;
}

.linked-row:hover {
    border-color: rgba(17, 66, 212, .2);
}

.linked-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}

.linked-info {
    flex: 1;
    min-width: 0;
}

.linked-name {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
}

.linked-sub {
    font-size: 10px;
    color: #94a3b8;
    margin-top: 1px;
    display: flex;
    align-items: center;
    gap: 3px;
}

.btn-unlink {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    flex-shrink: 0;
    border: 1px solid #fecdd3;
    background: #fff1f2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #be123c;
    cursor: pointer;
    transition: background .13s, border-color .13s;
}

.btn-unlink:hover:not(:disabled) {
    background: #ffe4e6;
}

.btn-unlink:disabled {
    opacity: .4;
    cursor: not-allowed;
}

/* ── Expand transition ── */
.t-expand-enter-active {
    animation: expand-down .22s ease;
}

.t-expand-leave-active {
    animation: expand-down .18s ease reverse;
}

@keyframes expand-down {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ── Skeleton rows for service ── */
.skel-service-row {
    padding: 13px 20px;
    border-bottom: 1px solid #f8fafc;
}

.skel-service-top {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* ── Edit Row ── */
.edit-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    flex-wrap: wrap;
}

.btn-save {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 36px;
    padding: 0 14px;
    border-radius: 8px;
    background: #1142d4;
    color: #fff;
    border: none;
    font-size: 12px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: filter .13s;
    white-space: nowrap;
}

.btn-save:hover:not(:disabled) {
    filter: brightness(1.08);
}

.btn-save:disabled {
    opacity: .5;
    cursor: not-allowed;
}

.btn-save .mdi {
    font-size: 15px;
}

.btn-cancel {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #64748b;
    cursor: pointer;
}

.btn-cancel:hover {
    background: #f1f5f9;
}

/* ── Empty State ── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    gap: 10px;
    text-align: center;
}

.empty-icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(17, 66, 212, .06);
    color: #1142d4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 4px;
}

.empty-title {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
}

.empty-desc {
    font-size: 12px;
    color: #94a3b8;
}

/* ── Toast ── */
.toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0, 0, 0, .12);
    max-width: 320px;
}

.toast-success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #15803d;
}

.toast-error {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    color: #be123c;
}

.toast-icon {
    font-size: 17px;
    flex-shrink: 0;
}

.t-toast-enter-active,
.t-toast-leave-active {
    transition: all .25s ease;
}

.t-toast-enter-from,
.t-toast-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

/* ── Delete Modal ── */
.modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9998;
    background: rgba(15, 23, 42, .4);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}

.modal-card {
    background: #fff;
    border-radius: 16px;
    padding: 32px 28px;
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, .18);
}

.modal-icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 4px;
}

.modal-icon-danger {
    background: #fff1f2;
    color: #be123c;
}

.modal-title {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
}

.modal-desc {
    font-size: 13px;
    color: #64748b;
    line-height: 1.6;
}

.modal-desc strong {
    color: #1e293b;
}

.modal-actions {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-top: 4px;
}

.btn-modal-cancel {
    flex: 1;
    height: 42px;
    border-radius: 9px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
}

.btn-modal-cancel:hover {
    background: #f1f5f9;
}

.btn-modal-danger {
    flex: 1;
    height: 42px;
    border-radius: 9px;
    border: none;
    background: #be123c;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: filter .13s;
}

.btn-modal-danger:hover:not(:disabled) {
    filter: brightness(1.08);
}

.btn-modal-danger:disabled {
    opacity: .5;
    cursor: not-allowed;
}

.btn-modal-danger .mdi {
    font-size: 15px;
}

.t-modal-enter-active,
.t-modal-leave-active {
    transition: all .22s ease;
}

.t-modal-enter-from,
.t-modal-leave-to {
    opacity: 0;
}

.t-modal-enter-from .modal-card,
.t-modal-leave-to .modal-card {
    transform: scale(.95);
}

/* ── Skeleton ── */
.skel {
    background: linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

.skel-icon-sm {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    flex-shrink: 0;
}

.skel-lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.skel-line-md {
    height: 13px;
    width: 55%;
}

.skel-line-sm {
    height: 10px;
    width: 35%;
}

.skel-chip {
    width: 70px;
    height: 22px;
    border-radius: 9999px;
}

.skel-toggle {
    width: 44px;
    height: 24px;
    border-radius: 9999px;
    flex-shrink: 0;
}

.mt-1 {
    margin-top: 4px;
}

/* ── Spinner ── */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.btn-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, .3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    flex-shrink: 0;
}

.btn-spinner-sm {
    width: 13px;
    height: 13px;
}

.btn-spinner-red {
    border-color: rgba(190, 18, 60, .3);
    border-top-color: #be123c;
}

.input-error {
    border-color: #ef4444 !important;
}

.field-error {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #ef4444;
    margin-top: 3px;
}

.field-error .mdi {
    font-size: 12px;
}

.field-hint {
    font-size: 10px;
    color: #94a3b8;
    margin-top: 3px;
    letter-spacing: .02em;
}

.field-dummy {
    height: 10px;
    margin-top: 3px;
}
</style>