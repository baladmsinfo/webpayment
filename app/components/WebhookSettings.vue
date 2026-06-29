<template>
  <div class="wh-root">

    <!-- ── Header bar ── -->
    <div class="wh-header">
      <div>
        <h2 class="wh-title">Webhook Endpoints</h2>
        <p class="wh-sub">Receive real-time notifications to your server for payment, KYC, wallet and settlement events.</p>
      </div>
      <button class="wh-btn-primary" @click="openCreate">
        <span class="mdi mdi-plus"></span> Add Endpoint
      </button>
    </div>

    <!-- ── Event legend chips ── -->
    <div class="wh-event-legend">
      <span v-for="cat in eventCategories" :key="cat.label" class="wh-event-chip" :class="cat.cls">
        <span class="mdi" :class="cat.icon"></span> {{ cat.label }}
      </span>
    </div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="wh-loading">
      <div class="wh-skel" v-for="i in 3" :key="i"></div>
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="!endpoints.length" class="wh-empty">
      <span class="mdi mdi-webhook wh-empty-icon"></span>
      <p class="wh-empty-title">No webhook endpoints yet</p>
      <p class="wh-empty-sub">Add your first endpoint to start receiving real-time events.</p>
      <button class="wh-btn-primary mt-4" @click="openCreate">
        <span class="mdi mdi-plus"></span> Add Endpoint
      </button>
    </div>

    <!-- ── Endpoint cards ── -->
    <div v-else class="wh-list">
      <div v-for="ep in endpoints" :key="ep.id" class="wh-card">
        <div class="wh-card-top">
          <div class="wh-card-url-row">
            <span class="wh-method-badge">POST</span>
            <span class="wh-url">{{ ep.url }}</span>
            <button class="wh-icon-btn" title="Copy URL" @click="copyText(ep.url)">
              <span class="mdi mdi-content-copy"></span>
            </button>
          </div>
          <div class="wh-card-actions">
            <span class="wh-status-pill" :class="ep.status === 'ACTIVE' ? 'pill-green' : ep.status === 'SUSPENDED' ? 'pill-red' : 'pill-gray'">
              {{ ep.status }}
            </span>
            <button class="wh-icon-btn" title="Send test ping" @click="sendTest(ep)" :disabled="testing === ep.id">
              <span class="mdi" :class="testing === ep.id ? 'mdi-loading mdi-spin' : 'mdi-send-outline'"></span>
            </button>
            <button class="wh-icon-btn" title="Delivery history" @click="openDeliveries(ep)">
              <span class="mdi mdi-history"></span>
            </button>
            <button class="wh-icon-btn" title="Edit endpoint" @click="openEdit(ep)">
              <span class="mdi mdi-pencil-outline"></span>
            </button>
            <button class="wh-icon-btn wh-icon-btn-danger" title="Delete" @click="confirmDelete(ep)">
              <span class="mdi mdi-delete-outline"></span>
            </button>
          </div>
        </div>

        <div class="wh-card-meta">
          <span v-if="ep.description" class="wh-desc">{{ ep.description }}</span>
          <div class="wh-event-tags">
            <span v-for="evt in ep.events.slice(0, 5)" :key="evt" class="wh-evt-tag">{{ evt }}</span>
            <span v-if="ep.events.length > 5" class="wh-evt-tag wh-evt-more">+{{ ep.events.length - 5 }} more</span>
          </div>
          <div class="wh-card-footer">
            <span class="wh-foot-item"><span class="mdi mdi-clock-outline"></span> Timeout: {{ ep.timeout }}ms</span>
            <span class="wh-foot-item"><span class="mdi mdi-refresh"></span> Max retries: {{ ep.maxRetries }}</span>
            <span class="wh-foot-item"><span class="mdi mdi-calendar-outline"></span> {{ fmtDate(ep.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════ CREATE / EDIT MODAL ══════════════════ -->
    <div v-if="showForm" class="wh-modal-overlay" @click.self="showForm = false">
      <div class="wh-modal">
        <div class="wh-modal-header">
          <h3>{{ editingId ? 'Edit Endpoint' : 'Add Webhook Endpoint' }}</h3>
          <button class="wh-modal-close" @click="showForm = false"><span class="mdi mdi-close"></span></button>
        </div>

        <div class="wh-modal-body">
          <!-- URL -->
          <div class="wh-field">
            <label class="wh-label">Endpoint URL <span class="req">*</span></label>
            <input v-model="form.url" type="url" class="wh-input" placeholder="https://your-server.com/webhooks" />
          </div>

          <!-- Description -->
          <div class="wh-field">
            <label class="wh-label">Description</label>
            <input v-model="form.description" type="text" class="wh-input" placeholder="Optional label for this endpoint" />
          </div>

          <!-- Events -->
          <div class="wh-field">
            <label class="wh-label">Events <span class="wh-hint">(select all that apply)</span></label>
            <div class="wh-event-grid">
              <div
                v-for="cat in eventCategories"
                :key="cat.label"
                class="wh-event-cat"
              >
                <div class="wh-cat-header" @click="toggleCategory(cat)">
                  <span class="mdi" :class="cat.icon"></span>
                  <span>{{ cat.label }}</span>
                  <span class="wh-cat-check mdi" :class="allCatSelected(cat) ? 'mdi-checkbox-marked-circle wh-cat-check-on' : 'mdi-checkbox-blank-circle-outline'"></span>
                </div>
                <div class="wh-event-checks">
                  <label v-for="evt in cat.events" :key="evt" class="wh-evt-check">
                    <input type="checkbox" :value="evt" v-model="form.events" />
                    <span>{{ evt }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="wh-select-all-row">
              <button type="button" class="wh-link" @click="selectAll">Select all</button>
              <span class="wh-dot">·</span>
              <button type="button" class="wh-link" @click="form.events = []">Clear</button>
              <span class="wh-evt-count">{{ form.events.length }} event(s) selected</span>
            </div>
          </div>

          <!-- Advanced -->
          <details class="wh-advanced">
            <summary>Advanced settings</summary>
            <div class="wh-adv-grid">
              <div class="wh-field">
                <label class="wh-label">Timeout (ms)</label>
                <input v-model.number="form.timeout" type="number" class="wh-input" min="1000" max="30000" />
              </div>
              <div class="wh-field">
                <label class="wh-label">Max Retries</label>
                <input v-model.number="form.maxRetries" type="number" class="wh-input" min="0" max="5" />
              </div>
            </div>
            <div v-if="editingId" class="wh-field mt-3">
              <label class="wh-label">Status</label>
              <select v-model="form.status" class="wh-input">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </details>

          <!-- Secret (edit only) -->
          <div v-if="editingId" class="wh-secret-box">
            <div class="wh-secret-row">
              <span class="mdi mdi-lock-outline"></span>
              <span class="wh-secret-label">Signing Secret</span>
              <span class="wh-secret-val">{{ secretDisplay }}</span>
            </div>
            <button class="wh-btn-outline wh-btn-sm" @click="doRotateSecret" :disabled="rotating">
              <span class="mdi" :class="rotating ? 'mdi-loading mdi-spin' : 'mdi-refresh'"></span>
              {{ rotating ? 'Rotating…' : 'Rotate Secret' }}
            </button>
            <p class="wh-secret-hint">The new secret will be shown once after rotation. Update your server immediately.</p>
            <div v-if="newSecret" class="wh-secret-new">
              <strong>New secret:</strong>
              <code>{{ newSecret }}</code>
              <button class="wh-icon-btn" @click="copyText(newSecret)"><span class="mdi mdi-content-copy"></span></button>
            </div>
          </div>
        </div>

        <div class="wh-modal-footer">
          <button class="wh-btn-outline" @click="showForm = false">Cancel</button>
          <button class="wh-btn-primary" @click="saveEndpoint" :disabled="saving">
            <span class="mdi" :class="saving ? 'mdi-loading mdi-spin' : 'mdi-check'"></span>
            {{ saving ? 'Saving…' : (editingId ? 'Save Changes' : 'Create Endpoint') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════ DELIVERY HISTORY MODAL ══════════════════ -->
    <div v-if="showDeliveries" class="wh-modal-overlay" @click.self="showDeliveries = false">
      <div class="wh-modal wh-modal-wide">
        <div class="wh-modal-header">
          <div>
            <h3>Delivery History</h3>
            <p class="wh-modal-sub">{{ deliveryEndpoint?.url }}</p>
          </div>
          <button class="wh-modal-close" @click="showDeliveries = false"><span class="mdi mdi-close"></span></button>
        </div>

        <div class="wh-modal-body">
          <!-- Filters -->
          <div class="wh-delivery-filters">
            <select v-model="dlvFilter.status" class="wh-input wh-input-sm" @change="loadDeliveries">
              <option value="">All statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="RETRYING">Retrying</option>
              <option value="PENDING">Pending</option>
            </select>
            <select v-model="dlvFilter.event" class="wh-input wh-input-sm" @change="loadDeliveries">
              <option value="">All events</option>
              <option v-for="ev in allEvents" :key="ev" :value="ev">{{ ev }}</option>
            </select>
          </div>

          <!-- Table -->
          <div v-if="dlvLoading" class="wh-loading">
            <div class="wh-skel" v-for="i in 4" :key="i"></div>
          </div>
          <div v-else-if="!deliveries.length" class="wh-empty-sm">No deliveries yet</div>
          <table v-else class="wh-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Status</th>
                <th>HTTP</th>
                <th>Sent at</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in deliveries" :key="d.id" :class="{ 'tr-expanded': expandedDlv === d.id }">
                <td><span class="wh-evt-tag">{{ d.event }}</span></td>
                <td>
                  <span class="wh-status-pill"
                    :class="d.status === 'SUCCESS' ? 'pill-green' : d.status === 'FAILED' ? 'pill-red' : 'pill-yellow'">
                    {{ d.status }}
                  </span>
                </td>
                <td>{{ d.statusCode ?? '—' }}</td>
                <td>{{ fmtDate(d.sentAt) }}</td>
                <td class="wh-td-actions">
                  <button class="wh-link" @click="expandedDlv = expandedDlv === d.id ? null : d.id">
                    {{ expandedDlv === d.id ? 'Hide' : 'Details' }}
                  </button>
                  <button v-if="d.status !== 'SUCCESS'" class="wh-link wh-link-blue" @click="doRetry(d)" :disabled="retrying === d.id">
                    {{ retrying === d.id ? 'Retrying…' : 'Retry' }}
                  </button>
                </td>
              </tr>
              <tr v-if="expandedDlv" class="tr-detail">
                <td colspan="5">
                  <div class="wh-detail-box" v-if="deliveries.find(d => d.id === expandedDlv)">
                    <div class="wh-detail-section">
                      <strong>Payload:</strong>
                      <pre class="wh-pre">{{ JSON.stringify(deliveries.find(d => d.id === expandedDlv)?.payload, null, 2) }}</pre>
                    </div>
                    <div class="wh-detail-section">
                      <strong>Response:</strong>
                      <pre class="wh-pre">{{ deliveries.find(d => d.id === expandedDlv)?.response || '(no response)' }}</pre>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="dlvMeta.totalPages > 1" class="wh-pagination">
            <button class="wh-btn-outline wh-btn-sm" :disabled="dlvPage <= 1" @click="dlvPage--; loadDeliveries()">
              <span class="mdi mdi-chevron-left"></span>
            </button>
            <span>{{ dlvPage }} / {{ dlvMeta.totalPages }}</span>
            <button class="wh-btn-outline wh-btn-sm" :disabled="dlvPage >= dlvMeta.totalPages" @click="dlvPage++; loadDeliveries()">
              <span class="mdi mdi-chevron-right"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Toast ── -->
    <div v-if="toast.show" class="wh-toast" :class="toast.type === 'error' ? 'wh-toast-error' : 'wh-toast-success'">
      <span class="mdi" :class="toast.type === 'error' ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline'"></span>
      {{ toast.msg }}
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useWebhookApi } from '~/composables/apis/useWebhookApi';

const api = useWebhookApi();

// ── State ──────────────────────────────────────────────────────────────────────
const loading   = ref(true);
const saving    = ref(false);
const rotating  = ref(false);
const testing   = ref<string | null>(null);
const retrying  = ref<string | null>(null);

const endpoints    = ref<any[]>([]);
const showForm     = ref(false);
const editingId    = ref<string | null>(null);
const secretDisplay = ref('');
const newSecret    = ref('');

const showDeliveries    = ref(false);
const deliveryEndpoint  = ref<any>(null);
const deliveries        = ref<any[]>([]);
const dlvLoading        = ref(false);
const dlvPage           = ref(1);
const dlvMeta           = ref({ total: 0, totalPages: 1 });
const dlvFilter         = ref({ status: '', event: '' });
const expandedDlv       = ref<string | null>(null);

const toast = ref({ show: false, msg: '', type: 'success' });

// ── Event categories ───────────────────────────────────────────────────────────
const eventCategories = [
  {
    label: 'Payment', icon: 'mdi-cash-multiple', cls: 'chip-blue',
    events: ['payment.success', 'payment.failed', 'payment.pending'],
  },
  {
    label: 'Merchant', icon: 'mdi-store-outline', cls: 'chip-purple',
    events: ['merchant.activated', 'merchant.suspended'],
  },
  {
    label: 'KYC', icon: 'mdi-shield-check-outline', cls: 'chip-green',
    events: ['kyc.verified', 'kyc.rejected'],
  },
  {
    label: 'Wallet', icon: 'mdi-wallet-outline', cls: 'chip-orange',
    events: ['wallet.credited', 'wallet.debited'],
  },
  {
    label: 'Settlement', icon: 'mdi-bank-transfer', cls: 'chip-teal',
    events: ['settlement.initiated', 'settlement.success', 'settlement.failed'],
  },
  {
    label: 'Reconciliation', icon: 'mdi-check-all', cls: 'chip-indigo',
    events: ['reconciliation.completed', 'reconciliation.exception'],
  },
  {
    label: 'Refund', icon: 'mdi-cash-refund', cls: 'chip-pink',
    events: ['refund.initiated', 'refund.success', 'refund.failed'],
  },
  {
    label: 'Chargeback', icon: 'mdi-alert-outline', cls: 'chip-red',
    events: ['chargeback.raised', 'chargeback.resolved'],
  },
];

const allEvents = computed(() => eventCategories.flatMap(c => c.events));

// ── Form model ─────────────────────────────────────────────────────────────────
const form = ref({
  url: '',
  description: '',
  events: [] as string[],
  status: 'ACTIVE',
  timeout: 7000,
  maxRetries: 3,
});

function resetForm() {
  form.value = { url: '', description: '', events: [], status: 'ACTIVE', timeout: 7000, maxRetries: 3 };
  editingId.value    = null;
  secretDisplay.value = '';
  newSecret.value    = '';
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function copyText(t: string) {
  navigator.clipboard?.writeText(t);
  showToast('Copied to clipboard');
}

function showToast(msg: string, type = 'success') {
  toast.value = { show: true, msg, type };
  setTimeout(() => (toast.value.show = false), 3000);
}

function allCatSelected(cat: any) {
  return cat.events.every((e: string) => form.value.events.includes(e));
}

function toggleCategory(cat: any) {
  if (allCatSelected(cat)) {
    form.value.events = form.value.events.filter((e: string) => !cat.events.includes(e));
  } else {
    form.value.events = [...new Set([...form.value.events, ...cat.events])];
  }
}

function selectAll() {
  form.value.events = [...allEvents.value];
}

// ── Load endpoints ─────────────────────────────────────────────────────────────
async function loadEndpoints() {
  loading.value = true;
  try {
    const res = await api.getEndpoints();
    endpoints.value = res.data?.data ?? [];
  } catch {
    showToast('Failed to load endpoints', 'error');
  } finally {
    loading.value = false;
  }
}

// ── Open modals ────────────────────────────────────────────────────────────────
function openCreate() {
  resetForm();
  showForm.value = true;
}

function openEdit(ep: any) {
  resetForm();
  editingId.value       = ep.id;
  form.value.url         = ep.url;
  form.value.description = ep.description ?? '';
  form.value.events      = [...ep.events];
  form.value.status      = ep.status;
  form.value.timeout     = ep.timeout;
  form.value.maxRetries  = ep.maxRetries;
  secretDisplay.value    = ep.secretMasked ?? '••••••••••••••••••••';
  showForm.value         = true;
}

async function openDeliveries(ep: any) {
  deliveryEndpoint.value = ep;
  dlvPage.value          = 1;
  dlvFilter.value        = { status: '', event: '' };
  expandedDlv.value      = null;
  showDeliveries.value   = true;
  await loadDeliveries();
}

// ── CRUD ───────────────────────────────────────────────────────────────────────
async function saveEndpoint() {
  if (!form.value.url) return showToast('URL is required', 'error');
  if (!form.value.events.length) return showToast('Select at least one event', 'error');
  saving.value = true;
  try {
    if (editingId.value) {
      await api.updateEndpoint(editingId.value, {
        url:         form.value.url,
        events:      form.value.events,
        description: form.value.description,
        status:      form.value.status,
        timeout:     form.value.timeout,
        maxRetries:  form.value.maxRetries,
      });
      showToast('Endpoint updated');
    } else {
      const res = await api.createEndpoint({
        url:         form.value.url,
        events:      form.value.events,
        description: form.value.description,
        timeout:     form.value.timeout,
        maxRetries:  form.value.maxRetries,
      });
      if (res.data?.data?.secret) {
        showToast(`Endpoint created. Secret: ${res.data.data.secret.slice(0, 8)}… (copy it now!)`, 'success');
      } else {
        showToast('Endpoint created');
      }
    }
    showForm.value = false;
    await loadEndpoints();
  } catch {
    showToast('Failed to save endpoint', 'error');
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(ep: any) {
  if (!confirm(`Delete endpoint "${ep.url}"? This cannot be undone.`)) return;
  try {
    await api.deleteEndpoint(ep.id);
    showToast('Endpoint deleted');
    await loadEndpoints();
  } catch {
    showToast('Failed to delete endpoint', 'error');
  }
}

// ── Secret rotation ────────────────────────────────────────────────────────────
async function doRotateSecret() {
  if (!editingId.value) return;
  if (!confirm('Rotate the signing secret? Your server must be updated to use the new secret immediately.')) return;
  rotating.value = true;
  try {
    const res = await api.rotateSecret(editingId.value);
    newSecret.value = res.data?.data?.secret ?? '';
    showToast('Secret rotated — copy the new secret now!');
  } catch {
    showToast('Failed to rotate secret', 'error');
  } finally {
    rotating.value = false;
  }
}

// ── Test ping ──────────────────────────────────────────────────────────────────
async function sendTest(ep: any) {
  testing.value = ep.id;
  try {
    const res = await api.testEndpoint(ep.id);
    const ok  = res.data?.data?.success;
    showToast(ok ? `Test ping delivered (HTTP ${res.data.data.statusCode})` : `Test ping failed: ${res.data.data.response?.slice(0, 60)}`, ok ? 'success' : 'error');
  } catch {
    showToast('Test ping failed', 'error');
  } finally {
    testing.value = null;
  }
}

// ── Deliveries ─────────────────────────────────────────────────────────────────
async function loadDeliveries() {
  if (!deliveryEndpoint.value) return;
  dlvLoading.value = true;
  try {
    const res = await api.getDeliveries(deliveryEndpoint.value.id, {
      page:   dlvPage.value,
      limit:  15,
      status: dlvFilter.value.status || undefined,
      event:  dlvFilter.value.event  || undefined,
    });
    deliveries.value = res.data?.data ?? [];
    dlvMeta.value    = res.data?.meta ?? { total: 0, totalPages: 1 };
  } catch {
    showToast('Failed to load deliveries', 'error');
  } finally {
    dlvLoading.value = false;
  }
}

async function doRetry(delivery: any) {
  retrying.value = delivery.id;
  try {
    const res = await api.retryDelivery(delivery.id);
    showToast(res.data?.data?.success ? 'Retry succeeded' : 'Retry failed — will try again later', res.data?.data?.success ? 'success' : 'error');
    await loadDeliveries();
  } catch {
    showToast('Retry failed', 'error');
  } finally {
    retrying.value = null;
  }
}

onMounted(loadEndpoints);
</script>

<style scoped>
/* ── Layout ── */
.wh-root { display: flex; flex-direction: column; gap: 1.25rem; }

.wh-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.wh-title  { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0 0 .2rem; }
.wh-sub    { font-size: .82rem; color: #64748b; margin: 0; }

/* ── Event legend ── */
.wh-event-legend { display: flex; flex-wrap: wrap; gap: .4rem; }
.wh-event-chip   { display: inline-flex; align-items: center; gap: .3rem; padding: .2rem .6rem; border-radius: 999px; font-size: .72rem; font-weight: 600; }
.chip-blue    { background: #dbeafe; color: #1d4ed8; }
.chip-purple  { background: #ede9fe; color: #7c3aed; }
.chip-green   { background: #dcfce7; color: #16a34a; }
.chip-orange  { background: #ffedd5; color: #ea580c; }
.chip-teal    { background: #ccfbf1; color: #0f766e; }
.chip-indigo  { background: #e0e7ff; color: #4338ca; }
.chip-pink    { background: #fce7f3; color: #be185d; }
.chip-red     { background: #fee2e2; color: #dc2626; }

/* ── Loading / Empty ── */
.wh-loading { display: flex; flex-direction: column; gap: .75rem; }
.wh-skel    { height: 80px; background: #f1f5f9; border-radius: 10px; animation: pulse 1.4s infinite; }
@keyframes pulse { 0%,100%{ opacity:1 } 50%{ opacity:.5 } }

.wh-empty       { display: flex; flex-direction: column; align-items: center; padding: 3rem 1rem; text-align: center; }
.wh-empty-icon  { font-size: 3rem; color: #94a3b8; }
.wh-empty-title { font-size: 1rem; font-weight: 600; color: #334155; margin: .5rem 0 .25rem; }
.wh-empty-sub   { font-size: .83rem; color: #64748b; }
.wh-empty-sm    { text-align: center; padding: 2rem; color: #94a3b8; font-size: .85rem; }

/* ── Endpoint cards ── */
.wh-list { display: flex; flex-direction: column; gap: .85rem; }

.wh-card      { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.1rem; }
.wh-card-top  { display: flex; align-items: center; justify-content: space-between; gap: .75rem; flex-wrap: wrap; }

.wh-card-url-row { display: flex; align-items: center; gap: .5rem; min-width: 0; flex: 1; }
.wh-method-badge { background: #eff6ff; color: #2563eb; font-size: .7rem; font-weight: 700; padding: .15rem .45rem; border-radius: 4px; white-space: nowrap; }
.wh-url          { font-family: monospace; font-size: .82rem; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.wh-card-actions { display: flex; align-items: center; gap: .3rem; }

.wh-card-meta   { margin-top: .75rem; }
.wh-desc        { font-size: .8rem; color: #64748b; display: block; margin-bottom: .4rem; }
.wh-event-tags  { display: flex; flex-wrap: wrap; gap: .35rem; margin-bottom: .65rem; }
.wh-evt-tag     { background: #f1f5f9; color: #475569; font-size: .7rem; padding: .15rem .5rem; border-radius: 4px; }
.wh-evt-more    { background: #e2e8f0; color: #64748b; }
.wh-card-footer { display: flex; flex-wrap: wrap; gap: .75rem; }
.wh-foot-item   { font-size: .75rem; color: #94a3b8; display: flex; align-items: center; gap: .25rem; }

/* ── Buttons ── */
.wh-btn-primary { display: inline-flex; align-items: center; gap: .35rem; background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: .5rem 1rem; font-size: .82rem; font-weight: 600; cursor: pointer; }
.wh-btn-primary:hover { background: #1d4ed8; }
.wh-btn-outline { display: inline-flex; align-items: center; gap: .35rem; background: #fff; color: #334155; border: 1px solid #cbd5e1; border-radius: 8px; padding: .5rem 1rem; font-size: .82rem; font-weight: 600; cursor: pointer; }
.wh-btn-outline:hover { background: #f8fafc; }
.wh-btn-sm { padding: .3rem .7rem; font-size: .75rem; }
.wh-link    { background: none; border: none; cursor: pointer; color: #64748b; font-size: .78rem; text-decoration: underline; padding: 0; }
.wh-link-blue { color: #2563eb; }
.wh-icon-btn       { background: none; border: none; cursor: pointer; color: #64748b; padding: .25rem; border-radius: 5px; font-size: 1rem; }
.wh-icon-btn:hover { background: #f1f5f9; color: #1e293b; }
.wh-icon-btn-danger:hover { color: #dc2626; background: #fee2e2; }
.mt-4 { margin-top: 1rem; }
.mt-3 { margin-top: .75rem; }

/* ── Status pills ── */
.wh-status-pill { font-size: .7rem; font-weight: 700; padding: .15rem .55rem; border-radius: 999px; }
.pill-green  { background: #dcfce7; color: #16a34a; }
.pill-red    { background: #fee2e2; color: #dc2626; }
.pill-yellow { background: #fef9c3; color: #a16207; }
.pill-gray   { background: #f1f5f9; color: #64748b; }

/* ── Modal ── */
.wh-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.wh-modal         { background: #fff; border-radius: 14px; width: 100%; max-width: 560px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
.wh-modal-wide    { max-width: 780px; }
.wh-modal-header  { display: flex; align-items: flex-start; justify-content: space-between; padding: 1.1rem 1.25rem .8rem; border-bottom: 1px solid #e2e8f0; }
.wh-modal-header h3 { margin: 0; font-size: 1rem; font-weight: 700; color: #1e293b; }
.wh-modal-sub     { margin: .2rem 0 0; font-size: .78rem; color: #64748b; font-family: monospace; }
.wh-modal-close   { background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #94a3b8; padding: 0; }
.wh-modal-body    { padding: 1.1rem 1.25rem; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 1rem; }
.wh-modal-footer  { display: flex; justify-content: flex-end; gap: .75rem; padding: .9rem 1.25rem; border-top: 1px solid #e2e8f0; }

/* ── Form fields ── */
.wh-field  { display: flex; flex-direction: column; gap: .35rem; }
.wh-label  { font-size: .8rem; font-weight: 600; color: #475569; }
.wh-hint   { font-weight: 400; color: #94a3b8; }
.wh-input  { border: 1px solid #cbd5e1; border-radius: 7px; padding: .48rem .75rem; font-size: .83rem; color: #1e293b; outline: none; background: #fff; }
.wh-input:focus { border-color: #2563eb; box-shadow: 0 0 0 2px rgba(37,99,235,.15); }
.wh-input-sm { padding: .3rem .6rem; font-size: .78rem; max-width: 160px; }
.req { color: #dc2626; }

/* ── Event grid ── */
.wh-event-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; }
.wh-event-cat    { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.wh-cat-header   { display: flex; align-items: center; gap: .4rem; padding: .45rem .65rem; background: #f8fafc; cursor: pointer; font-size: .78rem; font-weight: 600; color: #334155; border-bottom: 1px solid #e2e8f0; }
.wh-cat-check    { margin-left: auto; font-size: 1rem; color: #94a3b8; }
.wh-cat-check-on { color: #16a34a; }
.wh-event-checks { padding: .4rem .6rem; display: flex; flex-direction: column; gap: .3rem; }
.wh-evt-check    { display: flex; align-items: center; gap: .4rem; font-size: .75rem; color: #475569; cursor: pointer; }
.wh-select-all-row { display: flex; align-items: center; gap: .5rem; }
.wh-dot          { color: #cbd5e1; }
.wh-evt-count    { margin-left: auto; font-size: .75rem; color: #94a3b8; }

/* ── Advanced ── */
.wh-advanced         { border: 1px solid #e2e8f0; border-radius: 8px; padding: .6rem .85rem; font-size: .82rem; cursor: pointer; }
.wh-advanced summary { font-weight: 600; color: #475569; }
.wh-adv-grid         { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: .75rem; }

/* ── Secret box ── */
.wh-secret-box   { background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: .85rem 1rem; display: flex; flex-direction: column; gap: .5rem; }
.wh-secret-row   { display: flex; align-items: center; gap: .5rem; }
.wh-secret-label { font-size: .78rem; font-weight: 600; color: #92400e; }
.wh-secret-val   { font-family: monospace; font-size: .78rem; color: #78350f; flex: 1; }
.wh-secret-hint  { font-size: .73rem; color: #a16207; margin: 0; }
.wh-secret-new   { display: flex; align-items: center; gap: .5rem; background: #fff; border: 1px solid #fcd34d; border-radius: 6px; padding: .45rem .7rem; }
.wh-secret-new code { font-size: .78rem; color: #1e293b; word-break: break-all; flex: 1; }

/* ── Delivery table ── */
.wh-delivery-filters { display: flex; gap: .6rem; flex-wrap: wrap; }
.wh-table   { width: 100%; border-collapse: collapse; font-size: .8rem; }
.wh-table th { text-align: left; padding: .5rem .65rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #64748b; font-size: .75rem; }
.wh-table td { padding: .55rem .65rem; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
.wh-table tr:last-child td { border-bottom: none; }
.tr-expanded td { background: #eff6ff; }
.wh-td-actions { display: flex; gap: .5rem; justify-content: flex-end; }
.wh-detail-box { padding: .75rem; background: #f8fafc; border-radius: 6px; display: flex; flex-direction: column; gap: .75rem; }
.wh-detail-section { display: flex; flex-direction: column; gap: .3rem; font-size: .78rem; }
.wh-pre { background: #1e293b; color: #e2e8f0; border-radius: 6px; padding: .6rem .75rem; font-size: .73rem; overflow: auto; max-height: 200px; margin: 0; }

/* ── Pagination ── */
.wh-pagination { display: flex; align-items: center; justify-content: center; gap: .75rem; padding-top: .75rem; font-size: .82rem; color: #64748b; }

/* ── Toast ── */
.wh-toast         { position: fixed; bottom: 1.5rem; right: 1.5rem; display: flex; align-items: center; gap: .5rem; padding: .65rem 1rem; border-radius: 8px; font-size: .82rem; font-weight: 600; z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,.12); animation: slideUp .2s ease; }
.wh-toast-success { background: #1e293b; color: #fff; }
.wh-toast-error   { background: #dc2626; color: #fff; }
@keyframes slideUp { from{ transform:translateY(20px); opacity:0 } to{ transform:translateY(0); opacity:1 } }

@media (max-width: 640px) {
  .wh-event-grid  { grid-template-columns: 1fr; }
  .wh-adv-grid    { grid-template-columns: 1fr; }
  .wh-modal       { max-height: 100vh; border-radius: 14px 14px 0 0; align-self: flex-end; }
  .wh-modal-overlay { align-items: flex-end; }
}
</style>
