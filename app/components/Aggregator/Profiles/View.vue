<template>
  <div class="view-root" v-if="profile && profile.id">

    <!-- ── Page Header ── -->
    <div class="view-header">
      <div class="view-header__left">
        <button class="btn-back" @click="router.back()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div class="view-brand">
          <div class="view-avatar" :style="{ background: avatarBg(profile.name || 'P') }">
            {{ initials(profile.name || 'P') }}
          </div>
          <div class="view-brand-text">
            <h1 class="view-merchant-name">{{ profile.name || '—' }}</h1>
            <div class="view-meta">
              <span class="mid-chip">{{ profile.code }}</span>
              <span :class="['status-pill', mstatusBadge(profile.mstatus)]">{{ profile.mstatus }}</span>
              <span :class="['status-pill', profile.status ? 'pill--emerald' : 'pill--red']">{{ profile.status ? 'Active' : 'Inactive' }}</span>
              <span v-if="profile.businesstype?.type" class="status-pill pill--slate">{{ profile.businesstype.type }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="live-badge"><span class="live-dot"></span>Live</div>
    </div>

    <!-- ── KPI Strip ── -->
    <div class="kpi-strip">
      <div class="kpi-card" style="--kc:#1142d4">
        <div class="kpi-icon-wrap" style="background:rgba(17,66,212,.1)"><span class="mdi mdi-file-document-outline" style="color:#1142d4"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Documents</p>
          <p class="kpi-value">{{ profile.documents?.length || 0 }}</p>
          <p class="kpi-sub">Submitted records</p>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#059669">
        <div class="kpi-icon-wrap" style="background:rgba(5,150,105,.1)"><span class="mdi mdi-percent-box-outline" style="color:#059669"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Commissions</p>
          <p class="kpi-value" style="color:#059669">{{ profile.commissionconfig?.length || 0 }}</p>
          <p class="kpi-sub">Active slabs</p>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#d97706">
        <div class="kpi-icon-wrap" style="background:rgba(217,119,6,.1)"><span class="mdi mdi-credit-card-outline" style="color:#d97706"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Cards</p>
          <p class="kpi-value" style="color:#d97706">{{ profile.cards?.length || 0 }}</p>
          <p class="kpi-sub">Issued cards</p>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#7c3aed">
        <div class="kpi-icon-wrap" style="background:rgba(124,58,237,.1)"><span class="mdi mdi-webhook" style="color:#7c3aed"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Webhooks</p>
          <p class="kpi-value">{{ profile.webhookEndpoints?.length || 0 }}</p>
          <p class="kpi-sub">Configured endpoints</p>
        </div>
      </div>
    </div>

    <!-- ── Tab Nav ── -->
    <div class="tab-wrap">
      <nav class="tab-nav">
        <button v-for="t in tabs" :key="t.key" :class="['tab-btn', activeTab === t.key && 'tab-btn--active']" @click="activeTab = t.key">
          <span class="mdi" :class="t.mdi"></span>
          <span class="tab-label">{{ t.label }}</span>
        </button>
      </nav>
    </div>

    <!-- ── Tab Content ── -->
    <main class="view-content">

      <!-- ════ TAB: OVERVIEW ════ -->
      <section v-show="activeTab === 'overview'" class="tab-section">

        <!-- ── STATUS MANAGEMENT PANEL ── -->
        <div class="card status-mgmt-card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--rose"></div>
            <h3 class="card__title">Status Management</h3>
            <span class="status-mgmt-badge">Operator Controls</span>
          </div>

          <div class="status-mgmt-body">
            <div class="smc-row">
              <div class="smc-row__info">
                <p class="smc-row__label">Active Status</p>
                <p class="smc-row__desc">Controls whether this profile can transact</p>
                <div class="smc-row__current">
                  Current:
                  <span :class="['pill', profile.status ? 'pill--emerald' : 'pill--red']">
                    {{ profile.status ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              <div class="smc-row__actions">
                <button
                  :class="['smc-btn', profile.status ? 'smc-btn--danger' : 'smc-btn--success']"
                  @click="openConfirm(!profile.status)">
                  <svg v-if="profile.status" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  {{ profile.status ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Identity -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-account-circle-outline"></span></div>
            <h3 class="card-title">Profile Identity</h3>
            <span class="ro-badge">View Only</span>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Name</label><p>{{ profile.name || '—' }}</p></div>
            <div class="info-item"><label>DBA Name</label><p>{{ profile.dba_name || '—' }}</p></div>
            <div class="info-item"><label>Profile Code</label><p class="mono">{{ profile.code || '—' }}</p></div>
            <div class="info-item"><label>Business Type</label><p><span class="pill pill--indigo">{{ profile.businesstype?.type || '—' }}</span></p></div>
            <div class="info-item"><label>Email</label><p>{{ profile.email || '—' }}</p></div>
            <div class="info-item"><label>Mobile</label><p class="mono">{{ profile.mobile_no || '—' }}</p></div>
            <div class="info-item"><label>Profile Status</label><p><span :class="['pill', mstatusBadgeClass(profile.mstatus)]">{{ profile.mstatus || '—' }}</span></p></div>
            <div class="info-item"><label>Active</label><p><span :class="['pill', profile.status ? 'pill--emerald' : 'pill--red']">{{ profile.status ? 'Active' : 'Inactive' }}</span></p></div>
            <div class="info-item"><label>Risk Flag</label><p><span :class="['pill', profile.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ profile.riskflag ?? 0 }}</span></p></div>
            <div class="info-item"><label>Created At</label><p>{{ fmtDate(profile.createdAt) }}</p></div>
            <div class="info-item"><label>Updated At</label><p>{{ fmtDate(profile.updatedAt) }}</p></div>
          </div>
        </div>

        <!-- Business Info -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(8,145,178,.1);color:#0891b2"><span class="mdi mdi-information-outline"></span></div>
            <h3 class="card-title">Business Information</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Date of Birth</label><p>{{ fmtDate(profile.dob) }}</p></div>
            <div class="info-item"><label>Gender</label><p>{{ genderLabel(profile.gender) }}</p></div>
            <div class="info-item"><label>MCC</label><p>{{ profile.mcc || '—' }}</p></div>
            <div class="info-item"><label>Nature of Business</label><p>{{ profile.nature_of_business || '—' }}</p></div>
            <div class="info-item"><label>Annual Turnover</label><p>{{ profile.annual_turn_over || '—' }}</p></div>
            <div class="info-item"><label>Website</label><p>{{ profile.website || '—' }}</p></div>
            <div class="info-item"><label>Latitude</label><p class="mono">{{ profile.lat || '—' }}</p></div>
            <div class="info-item"><label>Longitude</label><p class="mono">{{ profile.long || '—' }}</p></div>
          </div>
        </div>

        <!-- Settlement Account -->
        <div class="card" v-if="profile.settlementaccount">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669"><span class="mdi mdi-bank-outline"></span></div>
            <h3 class="card-title">Settlement Account</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Account Holder</label><p>{{ profile.settlementaccount.account_holder_name || '—' }}</p></div>
            <div class="info-item"><label>Account Type</label><p>{{ profile.settlementaccount.account_type || '—' }}</p></div>
            <div class="info-item"><label>Bank Name</label><p>{{ profile.settlementaccount.bank_name || '—' }}</p></div>
            <div class="info-item"><label>Account No</label><p class="mono">{{ profile.settlementaccount.bank_account_no || '—' }}</p></div>
            <div class="info-item"><label>IFSC Code</label><p class="mono">{{ profile.settlementaccount.bank_ifsc_code || '—' }}</p></div>
            <div class="info-item"><label>Branch Name</label><p>{{ profile.settlementaccount.branch_name || '—' }}</p></div>
            <div class="info-item"><label>City</label><p>{{ profile.settlementaccount.city || '—' }}</p></div>
            <div class="info-item"><label>Holder Verified</label>
              <p><span :class="['pill', profile.settlementaccount.account_holder_result ? 'pill--emerald' : 'pill--amber']">{{ profile.settlementaccount.account_holder_result ? 'Verified' : 'Pending' }}</span></p>
            </div>
          </div>
        </div>

        <!-- Account Balance -->
        <div class="card" v-if="profile.wallet">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-cash-multiple"></span></div>
            <h3 class="card-title">Account Balance</h3>
          </div>
          <div class="info-grid info-grid--3">
            <div class="info-item"><label>Available Balance</label><p class="mono">{{ profile.wallet.balance ?? '0.00' }}</p></div>
            <div class="info-item"><label>Account Status</label><p><span :class="['pill', profile.wallet.status ? 'pill--emerald' : 'pill--red']">{{ profile.wallet.status ? 'Active' : 'Inactive' }}</span></p></div>
            <div class="info-item"><label>Created</label><p>{{ fmtDate(profile.wallet.createdAt) }}</p></div>
          </div>
        </div>

        <!-- User Accounts -->
        <div class="card" v-if="profile.user?.length">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(124,58,237,.1);color:#7c3aed"><span class="mdi mdi-account-key-outline"></span></div>
            <h3 class="card-title">User Accounts</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ profile.user.length }} record(s)</span></span>
          </div>
          <div class="outlet-users" style="padding:14px 18px;">
            <div class="outlet-user" v-for="u in profile.user" :key="u.id">
              <div class="ou-avatar" :style="{ background: avatarBg(u.name || u.email) }">{{ initials(u.name || u.email) }}</div>
              <div class="ou-info">
                <p class="ou-name">{{ u.name || '—' }}</p>
                <p class="ou-email mono">{{ u.email }} · {{ u.mobile_no }}</p>
              </div>
              <span :class="['pill pill--sm', u.status ? 'pill--emerald' : 'pill--red']">{{ u.status ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>

      </section>

      <!-- ════ TAB: ADDRESS ════ -->
      <section v-show="activeTab === 'address'" class="tab-section">
        <div class="card" v-if="profile.address">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(8,145,178,.1);color:#0891b2"><span class="mdi mdi-map-marker-outline"></span></div>
            <h3 class="card-title">Address Details</h3>
          </div>
          <div class="addr-grid">
            <div class="addr-card">
              <div class="addr-card-hd" style="background:rgba(17,66,212,.06);color:#1142d4"><span class="mdi mdi-office-building-outline"></span> Official Address</div>
              <div class="addr-card-body">
                <p class="addr-main">{{ profile.address.official_address }}</p>
                <p>{{ [profile.address.address1, profile.address.address2, profile.address.address3].filter(Boolean).join(', ') }}</p>
                <p class="addr-city">{{ profile.address.city }}, {{ profile.address.state }} – {{ profile.address.pincode }}</p>
                <div class="addr-contact">
                  <span><span class="mdi mdi-phone-outline"></span> {{ profile.address.mobile_number }}</span>
                </div>
              </div>
            </div>
            <div class="addr-card">
              <div class="addr-card-hd" style="background:rgba(5,150,105,.06);color:#059669"><span class="mdi mdi-home-outline"></span> Residential Address</div>
              <div class="addr-card-body">
                <p class="addr-main">{{ profile.address.residential_address }}</p>
                <p>{{ [profile.address.res_address1, profile.address.res_address2, profile.address.res_address3].filter(Boolean).join(', ') }}</p>
                <p class="addr-city">{{ profile.address.res_city }}, {{ profile.address.res_state }} – {{ profile.address.res_pincode }}</p>
                <div class="addr-contact">
                  <span><span class="mdi mdi-phone-outline"></span> {{ profile.address.res_mobile }}</span>
                </div>
              </div>
            </div>
            <div class="addr-card">
              <div class="addr-card-hd" style="background:rgba(217,119,6,.06);color:#d97706"><span class="mdi mdi-storefront-outline"></span> Visitor / Shop Address</div>
              <div class="addr-card-body">
                <p class="addr-main">{{ profile.address.vister_address }}</p>
                <p>{{ [profile.address.v_address1, profile.address.v_address2, profile.address.v_address3].filter(Boolean).join(', ') }}</p>
                <p class="addr-city">{{ profile.address.v_city }}, {{ profile.address.v_state }} – {{ profile.address.v_pincode }}</p>
                <div class="addr-contact">
                  <span><span class="mdi mdi-phone-outline"></span> {{ profile.address.v_mobile }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-icon-wrap"><span class="mdi mdi-map-marker-off-outline"></span></div>
          <p class="empty-title">No address on file</p>
        </div>
      </section>

      <!-- ════ TAB: DOCUMENTS ════ -->
      <section v-show="activeTab === 'documents'" class="tab-section">
        <div class="card" v-if="profile.documents?.length">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-file-document-outline"></span></div>
            <h3 class="card-title">Documents</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ profile.documents.length }} record(s)</span></span>
          </div>
          <div class="docs-grid" style="padding:16px 18px;">
            <div class="doc-card" v-for="doc in profile.documents" :key="doc.id" @click="openDoc(doc)">
              <div class="doc-card-top">
                <div class="doc-icon"><span class="mdi mdi-file-outline"></span></div>
                <span :class="['pill pill--sm', docStatusPill(doc.doc_status)]">{{ doc.doc_status }}</span>
              </div>
              <p class="doc-name">{{ doc.doc_name || doc.doc_type }}</p>
              <p class="doc-type">{{ doc.doc_type }}</p>
              <p class="doc-num mono">{{ doc.doc_number || '—' }}</p>
              <div class="doc-count"><span class="mdi mdi-image-multiple-outline"></span> {{ doc.images?.length || 0 }} image(s)</div>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-icon-wrap"><span class="mdi mdi-file-remove-outline"></span></div>
          <p class="empty-title">No documents on file</p>
        </div>
      </section>

      <!-- ════ TAB: CONFIGURATION ════ -->
      <section v-show="activeTab === 'configuration'" class="tab-section">
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(124,58,237,.1);color:#7c3aed"><span class="mdi mdi-cog-outline"></span></div>
            <h3 class="card-title">Profile Configuration</h3>
            <span class="ro-badge">Read Only</span>
          </div>
          <div class="svc-flags-row">
            <div class="svc-flag-item">
              <span class="svc-flag-label">Business Type</span>
              <span class="svc-flag-val"><span class="pill pill--sm pill--indigo">{{ profile.businesstype?.type || '—' }}</span></span>
            </div>
            <div class="svc-flag-item">
              <span class="svc-flag-label">MCC</span>
              <span class="svc-flag-val">{{ profile.mcc || '—' }}</span>
            </div>
            <div class="svc-flag-item">
              <span class="svc-flag-label">Nature of Business</span>
              <span class="svc-flag-val">{{ profile.nature_of_business || '—' }}</span>
            </div>
            <div class="svc-flag-item">
              <span class="svc-flag-label">Annual Turnover</span>
              <span class="svc-flag-val">{{ profile.annual_turn_over || '—' }}</span>
            </div>
          </div>
          <div class="info-grid info-grid--3">
            <div class="info-item">
              <label>Active Status</label>
              <p><span class="flag" :class="profile.status ? 'flag--on' : 'flag--off'">{{ profile.status ? 'Enabled' : 'Disabled' }}</span></p>
            </div>
            <div class="info-item">
              <label>Profile Lifecycle</label>
              <p><span :class="['pill', mstatusBadgeClass(profile.mstatus)]">{{ profile.mstatus || '—' }}</span></p>
            </div>
            <div class="info-item">
              <label>Risk Flag</label>
              <p><span class="flag" :class="profile.riskflag > 0 ? 'flag--warn' : 'flag--on'">{{ profile.riskflag > 0 ? `Flagged (${profile.riskflag})` : 'Clear (0)' }}</span></p>
            </div>
            <div class="info-item"><label>Website</label><p>{{ profile.website || '—' }}</p></div>
            <div class="info-item"><label>Latitude</label><p class="mono">{{ profile.lat || '—' }}</p></div>
            <div class="info-item"><label>Longitude</label><p class="mono">{{ profile.long || '—' }}</p></div>
          </div>
        </div>
      </section>

      <!-- ════ TAB: COMMISSIONS ════ -->
      <section v-show="activeTab === 'commissions'" class="tab-section">
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669"><span class="mdi mdi-percent-box-outline"></span></div>
            <h3 class="card-title">Commission Slabs</h3>
            <span class="pill pill--sm pill--slate" v-if="profile.commissionconfig?.length">{{ profile.commissionconfig.length }} record(s)</span>
            <button class="term-create-btn ml-auto" @click="openCreateCommission">
              <span class="mdi mdi-plus"></span> Add Commission
            </button>
          </div>
          <div class="table-scroll" v-if="profile.commissionconfig?.length">
            <table class="data-table">
              <thead><tr><th>Level</th><th>Payment Method</th><th>Provider</th><th>Txn Type</th><th>Min Amt</th><th>Max Amt</th><th>Components</th><th>Default</th><th>Active</th><th></th></tr></thead>
              <tbody>
                <tr v-for="c in profile.commissionconfig" :key="c.id">
                  <td>{{ c.level }}</td>
                  <td>{{ c.paymentMethod }}</td>
                  <td>{{ c.provider }}</td>
                  <td>{{ c.txnType }}</td>
                  <td class="mono">{{ c.minAmount }}</td>
                  <td class="mono">{{ c.maxAmount }}</td>
                  <td>
                    <span v-for="cm in c.components" :key="cm.id" class="pill pill--sm pill--slate" style="margin:2px 3px 2px 0;display:inline-block">
                      {{ cm.name }}: {{ cm.value }}{{ cm.chargeType === 'PERCENTAGE' ? '%' : ' ₹' }}
                    </span>
                  </td>
                  <td><span :class="['pill pill--sm', c.isDefault ? 'pill--indigo' : 'pill--slate']">{{ c.isDefault ? 'Yes' : 'No' }}</span></td>
                  <td><span :class="['pill pill--sm', c.active ? 'pill--emerald' : 'pill--red']">{{ c.active ? 'Active' : 'Inactive' }}</span></td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button class="icon-close" title="Edit" @click="openEditCommission(c)"><span class="mdi mdi-pencil-outline"></span></button>
                      <button class="icon-close" title="Disable" :disabled="!c.active" @click="openDeleteCommission(c)"><span class="mdi mdi-trash-can-outline"></span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" v-else>
            <div class="empty-icon-wrap"><span class="mdi mdi-percent-outline"></span></div>
            <p class="empty-title">No commission slabs configured</p>
          </div>
        </div>
      </section>

      <!-- ════ TAB: CARDS ════ -->
      <section v-show="activeTab === 'cards'" class="tab-section">
        <div class="card" v-if="profile.cards?.length">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706"><span class="mdi mdi-credit-card-outline"></span></div>
            <h3 class="card-title">Cards</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ profile.cards.length }} record(s)</span></span>
          </div>
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr><th>Holder</th><th>Masked PAN</th><th>Type</th><th>Network</th><th>Expiry</th><th>Status</th></tr></thead>
              <tbody>
                <tr v-for="c in profile.cards" :key="c.id">
                  <td>{{ c.cardHolderName }}</td>
                  <td class="mono">{{ c.maskedPan }}</td>
                  <td>{{ c.type }}</td>
                  <td>{{ c.network }}</td>
                  <td class="mono">{{ String(c.expiryMonth).padStart(2,'0') }}/{{ c.expiryYear }}</td>
                  <td><span :class="['pill pill--sm', cardStatusPill(c.status)]">{{ c.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-icon-wrap"><span class="mdi mdi-credit-card-off-outline"></span></div>
          <p class="empty-title">No cards issued</p>
        </div>
      </section>

      <!-- ════ TAB: ACTIVITY ════ -->
      <section v-show="activeTab === 'activity'" class="tab-section">
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(15,23,42,.08);color:#0f172a"><span class="mdi mdi-history"></span></div>
            <h3 class="card-title">Activity Log</h3>
          </div>
          <div v-if="activityLoading" class="w-loading-row">Loading activity…</div>
          <div class="table-scroll" v-else-if="activity.length">
            <table class="data-table">
              <thead><tr><th>Action</th><th>Details</th><th>Date</th></tr></thead>
              <tbody>
                <tr v-for="a in activity" :key="a.id">
                  <td>{{ a.action }}</td>
                  <td>{{ a.meta?.reason || '—' }}</td>
                  <td>{{ fmtDate(a.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" v-else>
            <div class="empty-icon-wrap"><span class="mdi mdi-history"></span></div>
            <p class="empty-title">No activity recorded yet</p>
          </div>
        </div>
      </section>

    </main>

    <Teleport to="body">

      <!-- ░░ DOCUMENT DIALOG ░░ -->
      <Transition name="dialog-fade">
        <div v-if="docDialog" class="dialog-overlay" @click.self="docDialog = false">
          <div class="dialog">
            <div class="dialog-hdr">
              <div>
                <p class="dialog-title">{{ selectedDoc?.doc_name || selectedDoc?.doc_type }}</p>
                <p class="dialog-sub">{{ selectedDoc?.doc_type }} · {{ selectedDoc?.doc_number || '—' }}</p>
              </div>
              <button class="icon-close" @click="docDialog = false">
                <span class="mdi mdi-close"></span>
              </button>
            </div>
            <div class="dialog-body">
              <p class="dialog-section-lbl">Images</p>
              <div class="doc-img-grid" v-if="selectedDoc?.images?.length">
                <img v-for="img in selectedDoc.images" :key="img.id" :src="img.url" class="doc-img-thumb" @click="openPreview(img.url)" />
              </div>
              <p v-else class="empty-title">No images uploaded</p>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ IMAGE PREVIEW ░░ -->
      <Transition name="dialog-fade">
        <div v-if="imgPreview" class="dialog-overlay" @click.self="imgPreview = false">
          <div class="dialog dialog--img">
            <div class="dialog-hdr">
              <p class="dialog-title">Document Image</p>
              <button class="icon-close" @click="imgPreview = false"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="dialog-body dialog-body--img">
              <img :src="previewUrl" class="img-preview" />
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ CONFIRM DIALOG ░░ -->
      <Transition name="dialog">
        <div v-if="confirmDialog.open" class="dialog-overlay" @click.self="closeConfirm">
          <div class="dialog dialog--confirm">

            <div class="dialog__hdr">
              <div class="confirm-icon-wrap" :class="`confirm-icon-wrap--${confirmDialog.severity}`">
                <svg v-if="confirmDialog.severity === 'danger'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <div>
                <p class="dialog__title">{{ confirmDialog.title }}</p>
                <p class="dialog__sub">{{ confirmDialog.subtitle }}</p>
              </div>
              <button class="icon-close-btn ml-auto" @click="closeConfirm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div class="dialog__body">
              <div class="confirm-change-summary">
                <div class="ccs-row">
                  <span class="ccs-label">Profile</span>
                  <span class="ccs-val font-mono">{{ profile.code }}</span>
                </div>
                <div class="ccs-row">
                  <span class="ccs-label">Current value</span>
                  <span class="ccs-val" v-html="confirmDialog.fromHtml"></span>
                </div>
                <div class="ccs-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                </div>
                <div class="ccs-row ccs-row--new">
                  <span class="ccs-label">New value</span>
                  <span class="ccs-val" v-html="confirmDialog.toHtml"></span>
                </div>
              </div>

              <div class="confirm-reason">
                <label class="confirm-reason__label">
                  Reason <span class="confirm-reason__opt">(optional)</span>
                </label>
                <textarea
                  v-model="confirmDialog.reason"
                  class="confirm-reason__input"
                  rows="2"
                  placeholder="e.g. Verified by compliance team…"
                  maxlength="300"
                ></textarea>
                <p class="confirm-reason__count">{{ confirmDialog.reason.length }}/300</p>
              </div>

              <div class="confirm-warn-note" v-if="confirmDialog.severity === 'danger'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                This action will immediately affect the profile's ability to transact. It is logged and auditable.
              </div>

              <div class="confirm-actions">
                <button class="btn-secondary" @click="closeConfirm" :disabled="confirmDialog.loading">
                  Cancel
                </button>
                <button
                  :class="['btn-confirm', `btn-confirm--${confirmDialog.severity}`]"
                  @click="executeUpdate"
                  :disabled="confirmDialog.loading">
                  <span v-if="confirmDialog.loading" class="btn-spinner"></span>
                  <span v-else>{{ confirmDialog.actionLabel }}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>

      <!-- ░░ COMMISSION ADD / EDIT MODAL ░░ -->
      <Transition name="dialog-fade">
        <div v-if="commissionModal.open" class="dialog-overlay" @click.self="closeCommissionModal">
          <div class="dialog dialog--commission">
            <div class="dialog-hdr">
              <div>
                <p class="dialog-title">{{ commissionModal.mode === 'edit' ? 'Edit Commission Slab' : 'Add Commission Slab' }}</p>
                <p class="dialog-sub">{{ profile.name }} · {{ profile.code }}</p>
              </div>
              <button class="icon-close" @click="closeCommissionModal" :disabled="commissionModal.saving"><span class="mdi mdi-close"></span></button>
            </div>

            <div class="dialog-body">
              <div class="term-form-error" v-if="commissionModal.error">{{ commissionModal.error }}</div>

              <div class="term-form-grid">
                <div class="term-field">
                  <label>Level</label>
                  <select class="term-select" v-model="commissionModal.form.level" :disabled="commissionModal.mode === 'edit'">
                    <option v-for="opt in COMMISSION_LEVELS" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Payment Method</label>
                  <select class="term-select" v-model="commissionModal.form.paymentMethod" :disabled="commissionModal.mode === 'edit'">
                    <option v-for="opt in PAYMENT_METHODS" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Provider</label>
                  <select class="term-select" v-model="commissionModal.form.provider" :disabled="commissionModal.mode === 'edit'">
                    <option v-for="opt in PROVIDERS" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Txn Type</label>
                  <select class="term-select" v-model="commissionModal.form.txnType" :disabled="commissionModal.mode === 'edit'">
                    <option v-for="opt in TXN_TYPES" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Min Amount</label>
                  <input class="term-input" type="number" min="0" v-model.number="commissionModal.form.minAmount" />
                </div>
                <div class="term-field">
                  <label>Max Amount</label>
                  <input class="term-input" type="number" min="0" v-model.number="commissionModal.form.maxAmount" />
                </div>
              </div>

              <div class="comp-section-hdr">
                <p class="dialog-section-lbl" style="margin:0">Components</p>
                <button class="comp-add-btn" @click="addComponentRow"><span class="mdi mdi-plus"></span> Add Component</button>
              </div>

              <div class="comp-row" v-for="(comp, i) in commissionModal.form.components" :key="i">
                <div class="term-field">
                  <label>Name</label>
                  <select class="term-select" v-model="comp.name">
                    <option v-for="opt in COMPONENT_TYPES" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Charge Type</label>
                  <select class="term-select" v-model="comp.chargeType">
                    <option v-for="opt in CHARGE_TYPES" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Value</label>
                  <input class="term-input" type="number" step="0.01" v-model.number="comp.value" />
                </div>
                <div class="term-field">
                  <label>Receiver</label>
                  <select class="term-select" v-model="comp.receiver">
                    <option v-for="opt in RECEIVERS" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Applies On</label>
                  <select class="term-select" v-model="comp.appliesOn">
                    <option v-for="opt in CHARGE_EVENTS" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="term-field">
                  <label>Depends On <span style="font-weight:400;color:#94a3b8">(optional)</span></label>
                  <input class="term-input" v-model="comp.dependsOn" placeholder="e.g. PER_1000" />
                </div>
                <button class="comp-remove-btn" title="Remove component" :disabled="commissionModal.form.components.length <= 1" @click="removeComponentRow(i)">
                  <span class="mdi mdi-trash-can-outline"></span>
                </button>
              </div>
            </div>

            <div class="w-modal-footer">
              <button class="w-btn-ghost" @click="closeCommissionModal" :disabled="commissionModal.saving">Cancel</button>
              <button class="w-btn-primary" :disabled="commissionModal.saving" @click="saveCommission">
                <span v-if="commissionModal.saving" class="mdi mdi-loading spin"></span>
                {{ commissionModal.saving ? 'Saving…' : (commissionModal.mode === 'edit' ? 'Save Changes' : 'Create Slab') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ COMMISSION DISABLE CONFIRM ░░ -->
      <Transition name="dialog-fade">
        <div v-if="deleteCommissionDialog.open" class="dialog-overlay" @click.self="closeDeleteCommission">
          <div class="dialog dialog--confirm">
            <div class="dialog__hdr">
              <div class="confirm-icon-wrap confirm-icon-wrap--danger">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <div>
                <p class="dialog__title">Disable Commission Slab</p>
                <p class="dialog__sub">This slab will stop applying to new transactions.</p>
              </div>
              <button class="icon-close-btn ml-auto" @click="closeDeleteCommission"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="dialog__body" v-if="deleteCommissionDialog.target">
              <div class="confirm-change-summary">
                <div class="ccs-row"><span class="ccs-label">Payment Method</span><span class="ccs-val">{{ deleteCommissionDialog.target.paymentMethod }}</span></div>
                <div class="ccs-row"><span class="ccs-label">Txn Type</span><span class="ccs-val">{{ deleteCommissionDialog.target.txnType }}</span></div>
                <div class="ccs-row"><span class="ccs-label">Range</span><span class="ccs-val font-mono">{{ deleteCommissionDialog.target.minAmount }} – {{ deleteCommissionDialog.target.maxAmount }}</span></div>
              </div>
              <div class="confirm-actions">
                <button class="btn-secondary" @click="closeDeleteCommission" :disabled="deleteCommissionDialog.loading">Cancel</button>
                <button class="btn-confirm btn-confirm--danger" :disabled="deleteCommissionDialog.loading" @click="confirmDeleteCommission">
                  <span v-if="deleteCommissionDialog.loading" class="btn-spinner"></span>
                  <span v-else>Disable</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ TOAST ░░ -->
      <Transition name="toast">
        <div v-if="toast.show" :class="['toast', `toast--${toast.type}`]">
          <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {{ toast.message }}
        </div>
      </Transition>

    </Teleport>

  </div>

  <!-- ── Loader ── -->
  <div v-else class="page-loader">
    <div class="loader-spinner"></div>
    <p class="loader-text">Loading profile data…</p>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useWalletProfileApi } from "~/composables/apis/useWalletProfileApi";
import { useWalletCommissionApi } from "~/composables/apis/useWalletCommissionApi";

const props = defineProps({ profileId: String });
const router = useRouter();
const { getWalletProfileById, updateWalletProfileStatus, getWalletProfileActivity } = useWalletProfileApi();
const { getWalletCommissions, createWalletCommission, updateWalletCommission, disableWalletCommission } = useWalletCommissionApi();

const profile    = reactive({});
const activeTab  = ref('overview');
const docDialog  = ref(false);
const selectedDoc = ref(null);
const imgPreview = ref(false);
const previewUrl = ref(null);

const activity        = ref([]);
const activityLoading = ref(false);

const fetchActivity = async () => {
  activityLoading.value = true;
  try {
    const res = await getWalletProfileActivity(props.profileId);
    if (res?.statusCode === '00') activity.value = res.data;
  } finally {
    activityLoading.value = false;
  }
};

watch(activeTab, (tab) => {
  if (tab === 'activity' && !activity.value.length) fetchActivity();
});

// ── Toast ──────────────────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success', message: '' });
let toastTimer = null;

const showToast = (message, type = 'success') => {
  clearTimeout(toastTimer);
  toast.message = message;
  toast.type = type;
  toast.show = true;
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

// ── Confirm dialog (Activate / Deactivate) ──────────────────────────
const confirmDialog = reactive({
  open: false,
  newValue: null,
  reason: '',
  loading: false,
  severity: 'info',
  title: '',
  subtitle: '',
  fromHtml: '',
  toHtml: '',
  actionLabel: '',
});

const pillHtml = (text, cls) => `<span class="pill pill--sm pill--${cls}">${text}</span>`;

const openConfirm = (newValue) => {
  confirmDialog.newValue = newValue;
  confirmDialog.reason = '';
  confirmDialog.loading = false;

  const activating = newValue === true;
  confirmDialog.severity = activating ? 'info' : 'danger';
  confirmDialog.title = activating ? 'Activate Profile' : 'Deactivate Profile';
  confirmDialog.subtitle = activating
    ? 'The profile will be able to transact immediately.'
    : 'The profile will not be able to transact.';
  confirmDialog.fromHtml = pillHtml(profile.status ? 'Active' : 'Inactive', profile.status ? 'emerald' : 'red');
  confirmDialog.toHtml   = pillHtml(activating ? 'Active' : 'Inactive', activating ? 'emerald' : 'red');
  confirmDialog.actionLabel = activating ? 'Activate' : 'Deactivate';

  confirmDialog.open = true;
};

const closeConfirm = () => {
  if (confirmDialog.loading) return;
  confirmDialog.open = false;
};

const executeUpdate = async () => {
  if (confirmDialog.loading) return;
  confirmDialog.loading = true;
  try {
    const res = await updateWalletProfileStatus(props.profileId, {
      status: confirmDialog.newValue,
      reason: confirmDialog.reason || undefined,
    });

    if (res?.statusCode === '00') {
      profile.status = confirmDialog.newValue;
      showToast(res.message || 'Updated successfully', 'success');
      confirmDialog.open = false;
    } else {
      showToast(res?.message || 'Update failed. Please try again.', 'error');
    }
  } catch {
    showToast('Something went wrong. Please try again.', 'error');
  } finally {
    confirmDialog.loading = false;
  }
};

const openDoc     = (doc) => { selectedDoc.value = doc; docDialog.value = true; };
const openPreview = (url) => { previewUrl.value = url; imgPreview.value = true; };

// ── Commissions (wallet-commission) ─────────────────────────────────
const PAYMENT_METHODS  = ['UPI','CARD','NETBANKING','CASH','WALLET','AEPS','DMT','ALL','IMPS','NEFT','RTGS'];
const PROVIDERS        = ['ISG','MOS','WORLD','BUCKSBOX','AXIS','NSDL','FINO','CANARA'];
const TXN_TYPES        = ['CASH_WITHDRAWAL','BALANCE_ENQUIRY','MINI_STATEMENT','CASH_DEPOSIT','VALIDATION','DMT','PUS','PURCHASE','PAYIN','ADD_MONEY','TOPUP','TRANSFER','CARD_MAINTENANCE_FEE','NONE'];
const COMPONENT_TYPES  = ['INTERCHANGE','CUSTOMER_FEE','GST','BANK_SHARE','BANK_COMMISSION','MERCHANT_COMMISSION','DISTRIBUTOR_COMMISSION','SUPER_DISTRIBUTOR_COMMISSION','AGGREGATOR_COMMISSION','PLATFORM_COMMISSION','PROCESSING_FEE','VENDOR_SHARE','CARD_ISSUANCE_FEE','CARD_MAINTENANCE_FEE'];
const CHARGE_TYPES      = ['FIXED','PERCENTAGE','HYBRID'];
const CHARGE_EVENTS     = ['TRANSACTION','VALIDATION','REGISTRATION'];
const RECEIVERS         = ['MERCHANT','DISTRIBUTOR','SUPER_DISTRIBUTOR','VENDOR','AGGREGATOR','BANK','BENEFICIARY','PLATFORM','GOVERNMENT','BC_NETWORK'];
const COMMISSION_LEVELS = ['SUPER_DISTRIBUTOR','DISTRIBUTOR','MERCHANT','PLATFORM'];

const commissionsLoading = ref(false);

const fetchCommissions = async () => {
  commissionsLoading.value = true;
  try {
    const res = await getWalletCommissions(props.profileId);
    if (res?.success) profile.commissionconfig = res.data;
  } catch (e) {
    console.error('Failed to fetch commissions:', e);
  } finally {
    commissionsLoading.value = false;
  }
};

const emptyComponent = () => ({ name: 'PLATFORM_COMMISSION', chargeType: 'FIXED', value: 0, dependsOn: '', receiver: 'PLATFORM', appliesOn: 'TRANSACTION' });

const commissionModal = reactive({
  open: false,
  mode: 'create', // 'create' | 'edit'
  editingId: null,
  saving: false,
  error: '',
  form: {
    level: 'PLATFORM',
    paymentMethod: 'CARD',
    provider: 'AXIS',
    txnType: 'PURCHASE',
    minAmount: 0,
    maxAmount: 100000,
    components: [emptyComponent()],
  },
});

const openCreateCommission = () => {
  commissionModal.mode = 'create';
  commissionModal.editingId = null;
  commissionModal.error = '';
  commissionModal.form = {
    level: 'PLATFORM',
    paymentMethod: 'CARD',
    provider: 'AXIS',
    txnType: 'PURCHASE',
    minAmount: 0,
    maxAmount: 100000,
    components: [emptyComponent()],
  };
  commissionModal.open = true;
};

const openEditCommission = (c) => {
  commissionModal.mode = 'edit';
  commissionModal.editingId = c.id;
  commissionModal.error = '';
  commissionModal.form = {
    level: c.level || 'PLATFORM',
    paymentMethod: c.paymentMethod,
    provider: c.provider,
    txnType: c.txnType,
    minAmount: Number(c.minAmount),
    maxAmount: Number(c.maxAmount),
    components: (c.components?.length ? c.components : [emptyComponent()]).map(cm => ({
      name: cm.name,
      chargeType: cm.chargeType,
      value: Number(cm.value),
      dependsOn: cm.dependsOn || '',
      receiver: cm.receiver || 'PLATFORM',
      appliesOn: cm.appliesOn || 'TRANSACTION',
    })),
  };
  commissionModal.open = true;
};

const closeCommissionModal = () => {
  if (commissionModal.saving) return;
  commissionModal.open = false;
};

const addComponentRow    = () => commissionModal.form.components.push(emptyComponent());
const removeComponentRow = (i) => {
  if (commissionModal.form.components.length <= 1) return;
  commissionModal.form.components.splice(i, 1);
};

const saveCommission = async () => {
  commissionModal.error = '';

  const f = commissionModal.form;
  if (Number(f.minAmount) > Number(f.maxAmount)) {
    commissionModal.error = 'Min amount cannot exceed max amount';
    return;
  }
  if (!f.components.length) {
    commissionModal.error = 'At least one component is required';
    return;
  }

  commissionModal.saving = true;
  try {
    const componentsPayload = f.components.map(c => ({
      name: c.name,
      chargeType: c.chargeType,
      value: Number(c.value),
      dependsOn: c.dependsOn || undefined,
      receiver: c.receiver,
      appliesOn: c.appliesOn,
    }));

    let res;
    if (commissionModal.mode === 'create') {
      res = await createWalletCommission({
        walletprofileId: props.profileId,
        level: f.level,
        paymentMethod: f.paymentMethod,
        provider: f.provider,
        txnType: f.txnType,
        minAmount: Number(f.minAmount),
        maxAmount: Number(f.maxAmount),
        components: componentsPayload,
      });
    } else {
      res = await updateWalletCommission(commissionModal.editingId, {
        minAmount: Number(f.minAmount),
        maxAmount: Number(f.maxAmount),
        components: componentsPayload,
      });
    }

    if (res?.success) {
      showToast(commissionModal.mode === 'create' ? 'Commission slab created' : 'Commission slab updated', 'success');
      commissionModal.open = false;
      await fetchCommissions();
    } else {
      commissionModal.error = res?.message || 'Failed to save commission';
    }
  } catch (err) {
    commissionModal.error = err?.response?.data?.message || err?.message || 'Something went wrong';
  } finally {
    commissionModal.saving = false;
  }
};

const deleteCommissionDialog = reactive({ open: false, target: null, loading: false });

const openDeleteCommission = (c) => { deleteCommissionDialog.target = c; deleteCommissionDialog.open = true; };
const closeDeleteCommission = () => { if (deleteCommissionDialog.loading) return; deleteCommissionDialog.open = false; deleteCommissionDialog.target = null; };

const confirmDeleteCommission = async () => {
  if (!deleteCommissionDialog.target) return;
  deleteCommissionDialog.loading = true;
  try {
    const res = await disableWalletCommission(deleteCommissionDialog.target.id);
    if (res?.success) {
      showToast('Commission slab disabled', 'success');
      deleteCommissionDialog.open = false;
      deleteCommissionDialog.target = null;
      await fetchCommissions();
    } else {
      showToast(res?.message || 'Failed to disable commission', 'error');
    }
  } catch (err) {
    showToast(err?.response?.data?.message || 'Something went wrong', 'error');
  } finally {
    deleteCommissionDialog.loading = false;
  }
};

const tabs = [
  { key: 'overview',      label: 'Overview',      mdi: 'mdi-account-circle-outline' },
  { key: 'address',       label: 'Address',       mdi: 'mdi-map-marker-outline' },
  { key: 'documents',     label: 'Documents',     mdi: 'mdi-file-document-outline' },
  { key: 'configuration', label: 'Configuration', mdi: 'mdi-cog-outline' },
  { key: 'commissions',   label: 'Commissions',   mdi: 'mdi-percent-box-outline' },
  { key: 'cards',         label: 'Cards',         mdi: 'mdi-credit-card-outline' },
  { key: 'activity',      label: 'Activity',      mdi: 'mdi-history' },
];

/* ── Helpers ── */
const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarBg  = (n) => AVATAR_COLORS[(n||'?').charCodeAt(0) % AVATAR_COLORS.length];
const initials  = (n) => (n||'?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
const fmtDate   = (d) => { if (!d) return '—'; const dt = new Date(d); if (isNaN(dt)) return '—'; return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`; };
const genderLabel = (g) => g === 'M' ? 'Male' : g === 'F' ? 'Female' : g === 'O' ? 'Other' : '—';
const mstatusBadge      = (s) => { if (!s) return 'pill--amber'; if (['APPROVED','VERIFIED','ACTIVE'].includes(s)) return 'pill--emerald'; if (['REJECTED','FAILED','BLOCKED','SUSPENDED'].includes(s)) return 'pill--red'; return 'pill--amber'; };
const mstatusBadgeClass = (s) => mstatusBadge(s);
const docStatusPill = (s) => { if (s==='VERIFIED') return 'pill--emerald'; if (s==='REJECTED') return 'pill--red'; if (s==='SUBMITTED') return 'pill--sky'; return 'pill--amber'; };
const cardStatusPill = (s) => { if (s==='ACTIVE') return 'pill--emerald'; if (['BLOCKED','EXPIRED','CANCELLED'].includes(s)) return 'pill--red'; return 'pill--amber'; };

onMounted(async () => {
  try {
    const res = await getWalletProfileById(props.profileId);
    Object.assign(profile, res?.data || {});
  } catch (e) {
    console.error('Failed to fetch profile:', e);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.view-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; color: #0f172a; }
.mono    { font-family: 'DM Mono', monospace; }
.text-xs { font-size: 11px; }
.font-bold { font-weight: 700; }
.ml-auto { margin-left: auto; }

/* ── Header ── */
.view-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 14px 18px; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.view-header__left { display: flex; align-items: center; gap: 14px; min-width: 0; flex: 1; }
.btn-back { display: flex; align-items: center; gap: 5px; padding: 7px 13px; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 12px; font-weight: 600; background: #f8fafc; color: #475569; cursor: pointer; transition: all .15s; font-family: inherit; flex-shrink: 0; }
.btn-back:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
.view-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.view-avatar { width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #fff; font-family: 'DM Sans', sans-serif; }
.view-brand-text { min-width: 0; }
.view-merchant-name { font-size: 16px; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 340px; }
.view-meta { display: flex; align-items: center; gap: 5px; margin-top: 4px; flex-wrap: wrap; }
.mid-chip { font-size: 9.5px; font-family: 'DM Mono', monospace; color: #64748b; background: #f1f5f9; padding: 2px 7px; border-radius: 5px; border: 1px solid #e2e8f0; }
.status-pill { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 20px; text-transform: uppercase; letter-spacing: .4px; white-space: nowrap; }
.live-badge { display: flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #0f172a; flex-shrink: 0; }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,.25); animation: pulse-g 2s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulse-g { 0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,.25); } 50% { box-shadow: 0 0 0 5px rgba(34,197,94,.08); } }

/* ── KPI Strip ── */
.kpi-strip { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (min-width: 768px) { .kpi-strip { grid-template-columns: repeat(4, 1fr); } }
.kpi-card { background: #fff; border: 1px solid #e8edf3; border-top: 3px solid var(--kc, #1142d4); border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: box-shadow .2s; }
.kpi-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.kpi-icon-wrap { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.kpi-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.kpi-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.kpi-value { font-size: 22px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }
.kpi-sub   { font-size: 10px; color: #94a3b8; }

/* ── Tab Nav ── */
.tab-wrap { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 4px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.tab-nav  { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
.tab-nav::-webkit-scrollbar { display: none; }
.tab-btn  { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: none; border-radius: 9px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; background: transparent; color: #64748b; transition: all .15s; flex-shrink: 0; font-family: inherit; }
.tab-btn .mdi { font-size: 15px; }
.tab-btn:hover { background: #f1f5f9; color: #0f172a; }
.tab-btn--active { background: #0f172a; color: #fff; box-shadow: 0 2px 8px rgba(15,23,42,.2); }
.tab-label { display: block; }

/* ── Content ── */
.view-content { display: flex; flex-direction: column; gap: 0; }
.tab-section  { display: flex; flex-direction: column; gap: 14px; }

/* ── Card ── */
.card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.04); overflow: hidden; }
.card-header { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.card-icon-dot { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.card-title { font-size: 13.5px; font-weight: 700; color: #0f172a; }
.ro-badge { margin-left: auto; font-size: 9px; font-weight: 700; color: #94a3b8; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 5px; padding: 2px 8px; text-transform: uppercase; letter-spacing: .5px; }

/* ── Info Grid ── */
.info-grid { display: grid; gap: 0; }
.info-grid--4 { grid-template-columns: repeat(4, 1fr); }
.info-grid--3 { grid-template-columns: repeat(3, 1fr); }
.info-item { padding: 14px 18px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.info-grid--4 .info-item:nth-child(4n) { border-right: none; }
.info-grid--3 .info-item:nth-child(3n) { border-right: none; }
.info-item label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .7px; display: block; margin-bottom: 4px; }
.info-item p { font-size: 13px; font-weight: 500; color: #0f172a; }

/* ── Pills & Flags ── */
.pill { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }
.pill--sm { font-size: 9.5px; padding: 1px 6px; }
.pill--indigo  { background: #e0e7ff; color: #4338ca; }
.pill--emerald { background: #d1fae5; color: #065f46; }
.pill--amber   { background: #fef3c7; color: #92400e; }
.pill--red     { background: #fee2e2; color: #991b1b; }
.pill--sky     { background: #e0f2fe; color: #0369a1; }
.pill--violet  { background: #ede9fe; color: #5b21b6; }
.pill--slate   { background: #f1f5f9; color: #64748b; }
.flag { font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: 6px; }
.flag--on   { background: #d1fae5; color: #065f46; }
.flag--off  { background: #f1f5f9; color: #64748b; }
.flag--warn { background: #fef3c7; color: #92400e; }

/* ── Flags row ── */
.svc-flags-row  { display: flex; flex-wrap: wrap; gap: 8px 18px; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.svc-flag-item  { display: flex; align-items: center; gap: 6px; }
.svc-flag-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; white-space: nowrap; }
.svc-flag-val   { font-size: 12px; font-weight: 600; color: #0f172a; }

/* ── Table ── */
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table   { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 480px; }
.data-table thead { background: #f8fafc; }
.data-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
.data-table td { padding: 11px 14px; color: #334155; border-bottom: 1px solid #f9fafb; vertical-align: top; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #f8fafc; }

/* ── Address ── */
.addr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 16px 18px; }
.addr-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.addr-card-hd { display: flex; align-items: center; gap: 8px; padding: 11px 14px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .7px; }
.addr-card-body { padding: 14px; font-size: 12.5px; color: #334155; line-height: 1.75; }
.addr-main { font-weight: 600; color: #0f172a; }
.addr-city { color: #64748b; font-size: 11.5px; margin-top: 5px; font-weight: 600; }
.addr-contact { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; font-size: 11px; color: #64748b; }
.addr-contact .mdi { font-size: 12px; }
@media (max-width: 900px) { .addr-grid { grid-template-columns: 1fr; } }

/* ── Outlet-style user rows ── */
.outlet-users { display: flex; flex-direction: column; gap: 8px; }
.outlet-user  { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; }
.ou-avatar { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0; }
.ou-info   { flex: 1; min-width: 0; }
.ou-name   { font-size: 12.5px; font-weight: 600; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ou-email  { color: #94a3b8; font-size: 11px; }

/* ── Documents ── */
.docs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
.doc-card  { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 16px; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: transform .15s, box-shadow .15s; }
.doc-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.1); }
.doc-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.doc-icon  { width: 36px; height: 36px; border-radius: 10px; background: rgba(17,66,212,.1); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.doc-name  { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
.doc-type  { font-size: 11px; color: #64748b; margin-bottom: 3px; }
.doc-num   { font-size: 10.5px; color: #94a3b8; margin-bottom: 8px; }
.doc-count { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #94a3b8; }

/* ── Empty State ── */
.empty-state     { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 40px 20px; text-align: center; }
.empty-icon-wrap { width: 56px; height: 56px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 26px; }
.empty-title { font-size: 13px; font-weight: 700; color: #334155; }
.w-loading-row { text-align: center; color: #94a3b8; padding: 24px 0; font-size: 13px; }

/* ── Dialog ── */
.dialog-overlay { position: fixed; inset: 0; z-index: 400; background: rgba(15,23,42,.45); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.dialog { background: #fff; border-radius: 16px; width: 100%; max-width: 760px; box-shadow: 0 24px 64px rgba(0,0,0,.2); overflow: hidden; max-height: 90dvh; display: flex; flex-direction: column; }
.dialog--img { max-width: 600px; }
.dialog-hdr  { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.dialog-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.dialog-sub   { font-size: 12px; color: #64748b; margin-top: 2px; }
.dialog-body  { padding: 20px; overflow-y: auto; flex: 1; }
.dialog-body--img { padding: 8px; }
.dialog-section-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; margin: 14px 0 8px; }
.icon-close { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; cursor: pointer; color: #64748b; font-size: 16px; transition: all .15s; }
.icon-close:hover { background: #f1f5f9; color: #0f172a; }
.doc-img-grid  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.doc-img-thumb { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 8px; cursor: pointer; transition: opacity .13s; }
.doc-img-thumb:hover { opacity: .82; }
.img-preview   { width: 100%; max-height: 520px; object-fit: contain; border-radius: 8px; }
.dialog-fade-enter-active, .dialog-fade-leave-active { transition: opacity .2s ease; }
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity: 0; }

/* ── Status Management Card ── */
.card__head { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.card__head-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.card__head-dot--rose { background: #f43f5e; box-shadow: 0 0 0 3px rgba(244,63,94,.15); }
.card__title { font-size: 13.5px; font-weight: 700; color: #0f172a; }
.status-mgmt-badge { margin-left: auto; font-size: 9px; font-weight: 700; color: #7c3aed; background: #ede9fe; border: 1px solid #ddd6fe; border-radius: 5px; padding: 2px 8px; text-transform: uppercase; letter-spacing: .5px; }
.status-mgmt-body { display: flex; flex-direction: column; }
.smc-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 18px; flex-wrap: wrap; }
.smc-row__info { flex: 1; min-width: 0; }
.smc-row__label { font-size: 13.5px; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
.smc-row__desc  { font-size: 11.5px; color: #64748b; margin-bottom: 8px; line-height: 1.5; }
.smc-row__current { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b; font-weight: 600; }
.smc-row__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.smc-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: none; border-radius: 9px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .15s; }
.smc-btn--success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
.smc-btn--success:hover { background: #a7f3d0; }
.smc-btn--danger  { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.smc-btn--danger:hover  { background: #fca5a5; }

/* ── Confirm Dialog ── */
.dialog--confirm { max-width: 480px; }
.icon-close-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; cursor: pointer; color: #64748b; flex-shrink: 0; transition: all .15s; }
.icon-close-btn:hover { background: #f1f5f9; color: #0f172a; }
.dialog__hdr { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.dialog__title { font-size: 14.5px; font-weight: 700; color: #0f172a; }
.dialog__sub   { font-size: 12px; color: #64748b; margin-top: 2px; line-height: 1.4; }
.dialog__body  { padding: 20px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; flex: 1; }
.confirm-icon-wrap { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.confirm-icon-wrap--info   { background: rgba(17,66,212,.1);  color: #1142d4; }
.confirm-icon-wrap--danger { background: rgba(239,68,68,.1);   color: #ef4444; }
.confirm-change-summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
.ccs-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #f1f5f9; gap: 10px; }
.ccs-row:last-child { border-bottom: none; }
.ccs-row--new { background: rgba(17,66,212,.03); }
.ccs-label { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; flex-shrink: 0; }
.ccs-val   { font-size: 13px; font-weight: 600; color: #0f172a; }
.ccs-arrow { display: flex; justify-content: center; padding: 6px 14px; background: #fff; border-bottom: 1px solid #f1f5f9; }
.confirm-reason { display: flex; flex-direction: column; gap: 6px; }
.confirm-reason__label { font-size: 11.5px; font-weight: 700; color: #334155; }
.confirm-reason__opt   { font-weight: 400; color: #94a3b8; }
.confirm-reason__input { width: 100%; border: 1px solid #e2e8f0; border-radius: 9px; padding: 9px 12px; font-size: 12.5px; font-family: inherit; color: #0f172a; resize: vertical; outline: none; transition: border .15s; }
.confirm-reason__input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.08); }
.confirm-reason__count { font-size: 10.5px; color: #94a3b8; text-align: right; }
.confirm-warn-note { display: flex; align-items: flex-start; gap: 8px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 9px; padding: 10px 12px; font-size: 11.5px; color: #92400e; line-height: 1.5; }
.confirm-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding-top: 4px; }
.btn-secondary { padding: 9px 18px; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 12.5px; font-weight: 600; background: #f8fafc; color: #475569; cursor: pointer; font-family: inherit; transition: all .15s; }
.btn-secondary:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
.btn-secondary:disabled { opacity: .55; cursor: not-allowed; }
.btn-confirm { display: flex; align-items: center; gap: 6px; padding: 9px 20px; border: none; border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all .15s; }
.btn-confirm:disabled { opacity: .55; cursor: not-allowed; }
.btn-confirm--info:not(:disabled)   { background: #1142d4; color: #fff; }
.btn-confirm--info:hover:not(:disabled)   { background: #0e35a8; }
.btn-confirm--danger:not(:disabled) { background: #ef4444; color: #fff; }
.btn-confirm--danger:hover:not(:disabled) { background: #dc2626; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
.font-mono { font-family: 'DM Mono', monospace; }
.dialog-enter-active, .dialog-leave-active { transition: opacity .2s ease; }
.dialog-enter-from, .dialog-leave-to { opacity: 0; }

/* ── Toast ── */
.toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; align-items: center; gap: 9px; padding: 11px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; box-shadow: 0 8px 28px rgba(0,0,0,.18); max-width: 340px; }
.toast--success { background: #0f172a; color: #fff; }
.toast--error   { background: #ef4444; color: #fff; }
.toast-enter-active, .toast-leave-active { transition: all .3s cubic-bezier(.34,1.56,.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px) scale(.95); }

/* ── Page Loader ── */
.page-loader  { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 14px; }
.loader-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #1142d4; border-radius: 50%; animation: spin .8s linear infinite; }
.loader-text  { font-size: 13px; color: #64748b; font-family: 'DM Sans', sans-serif; font-weight: 600; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Add Commission button ── */
.term-create-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border: none; border-radius: 9px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; background: #1142d4; color: #fff; transition: background .15s; }
.term-create-btn:hover { background: #0e35a8; }
.icon-close:disabled { opacity: .4; cursor: not-allowed; }

/* ── Commission form dialog ── */
.dialog--commission { max-width: 720px; }
.term-form-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 9px; padding: 10px 14px; font-size: 12.5px; font-weight: 600; margin-bottom: 14px; }
.term-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
.term-field { display: flex; flex-direction: column; gap: 5px; }
.term-field label { font-size: 10.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
.term-select, .term-input { border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px 11px; font-size: 12.5px; font-family: inherit; color: #0f172a; outline: none; transition: border .15s; background: #fff; }
.term-select:focus, .term-input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.08); }
.term-select:disabled, .term-input:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }

.comp-section-hdr { display: flex; align-items: center; justify-content: space-between; margin: 18px 0 10px; }
.comp-add-btn { display: flex; align-items: center; gap: 5px; padding: 6px 12px; border: 1px dashed #1142d4; border-radius: 8px; background: rgba(17,66,212,.05); color: #1142d4; font-size: 11.5px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background .15s; }
.comp-add-btn:hover { background: rgba(17,66,212,.1); }
.comp-row { display: grid; grid-template-columns: repeat(6, 1fr) auto; gap: 10px; align-items: end; padding: 12px; border: 1px solid #f1f5f9; border-radius: 10px; background: #fafafa; margin-bottom: 10px; }
.comp-remove-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border: 1px solid #fca5a5; border-radius: 8px; background: #fee2e2; color: #991b1b; cursor: pointer; flex-shrink: 0; transition: background .15s; }
.comp-remove-btn:hover:not(:disabled) { background: #fca5a5; }
.comp-remove-btn:disabled { opacity: .4; cursor: not-allowed; }
@media (max-width: 760px) { .term-form-grid { grid-template-columns: repeat(2, 1fr); } .comp-row { grid-template-columns: repeat(2, 1fr); } }

/* ── Modal footer / buttons (shared by commission + wallet-style modals) ── */
.w-modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 16px 20px; border-top: 1px solid #f1f5f9; flex-shrink: 0; }
.w-btn-ghost { padding: 9px 18px; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 12.5px; font-weight: 600; background: #f8fafc; color: #475569; cursor: pointer; font-family: inherit; transition: all .15s; }
.w-btn-ghost:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
.w-btn-ghost:disabled { opacity: .55; cursor: not-allowed; }
.w-btn-primary { display: flex; align-items: center; gap: 6px; padding: 9px 20px; border: none; border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; background: #1142d4; color: #fff; transition: background .15s; }
.w-btn-primary:hover:not(:disabled) { background: #0e35a8; }
.w-btn-primary:disabled { opacity: .55; cursor: not-allowed; }
</style>
