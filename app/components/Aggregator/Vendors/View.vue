<template>
  <div class="vendor-shell">

    <!-- ░░ HEADER ░░ -->
    <header class="mh-header">
      <div class="mh-header__inner">
        <div class="mh-header__actions">
          <button class="btn-back" @click="router.back()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span class="btn-back__label">Back</span>
          </button>
        </div>
        <div class="mh-header__brand">
          <div class="mh-brand-text">
            <h1 class="mh-business-name">{{ vendorForm.name || '—' }}</h1>
            <div class="mh-meta mh-meta--right">
              <span class="mh-mid">{{ vendorForm.code }}</span>
              <span :class="['mh-badge', statusBadgeClass(vendorForm.mstatus)]">{{ vendorForm.mstatus }}</span>
              <span :class="['mh-badge', vendorForm.status ? 'mh-badge--success' : 'mh-badge--error']">{{ vendorForm.status ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
          <div class="mh-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
      </div>
    </header>

    <!-- ░░ STAT STRIP ░░ -->
    <div class="stat-strip">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Merchants</p>
          <p class="stat-card__value">{{ vendorForm.merchants?.length || 0 }}</p>
          <p class="stat-card__sub">Under this vendor</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--emerald">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Terminals</p>
          <p class="stat-card__value stat-card__value--emerald">{{ vendorForm.terminals?.length || 0 }}</p>
          <p class="stat-card__sub">Assigned devices</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--amber">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Commissions</p>
          <p class="stat-card__value stat-card__value--amber">{{ vendorForm.commissions?.length || 0 }}</p>
          <p class="stat-card__sub">Active slabs</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--violet">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Documents</p>
          <p class="stat-card__value">{{ vendorForm.documents?.length || 0 }}</p>
          <p class="stat-card__sub">Uploaded files</p>
        </div>
      </div>
    </div>

    <!-- ░░ TAB NAV ░░ -->
    <div class="tab-nav-wrap">
      <nav class="tab-nav">
        <button v-for="t in tabs" :key="t.key" :class="['tab-btn', activeTab === t.key && 'tab-btn--active']" @click="activeTab = t.key">
          <span class="tab-btn__icon" v-html="t.icon"></span>
          <span class="tab-btn__label">{{ t.label }}</span>
          <span v-if="t.count" class="tab-btn__count">{{ t.count }}</span>
        </button>
      </nav>
    </div>

    <!-- ░░ CONTENT ░░ -->
    <main class="mh-content">

      <!-- ════ TAB: VENDOR INFO ════ -->
      <section v-show="activeTab === 'info'" class="tab-section">

        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">Vendor Information</h3>
            <button class="edit-toggle-btn ml-auto" @click="toggleEdit('contact')">
              <svg v-if="!editMode.contact" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {{ editMode.contact ? 'Cancel' : 'Edit' }}
            </button>
          </div>
          <template v-if="!editMode.contact">
            <div class="info-grid info-grid--4">
              <div class="info-item"><label>Legal Name</label><p>{{ vendorForm.name || '—' }}</p></div>
              <div class="info-item"><label>Email</label><p>{{ vendorForm.email || '—' }}</p></div>
              <div class="info-item"><label>Mobile</label><p>{{ vendorForm.mobile_no || '—' }}</p></div>
              <div class="info-item"><label>Vendor Code</label><p class="font-mono">{{ vendorForm.code || '—' }}</p></div>
              <div class="info-item"><label>Status</label><p><span :class="['pill', vendorForm.status ? 'pill--emerald' : 'pill--red']">{{ vendorForm.status ? 'Active' : 'Inactive' }}</span></p></div>
              <div class="info-item"><label>M-Status</label><p><span class="pill pill--amber">{{ vendorForm.mstatus || '—' }}</span></p></div>
              <div class="info-item"><label>Risk Flag</label><p><span :class="['pill', vendorForm.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ vendorForm.riskflag }}</span></p></div>
              <div class="info-item"><label>Latitude</label><p class="font-mono">{{ vendorForm.lat || '—' }}</p></div>
              <div class="info-item"><label>Longitude</label><p class="font-mono">{{ vendorForm.long || '—' }}</p></div>
              <div class="info-item"><label>Created At</label><p>{{ formatDate(vendorForm.createdAt) }}</p></div>
              <div class="info-item"><label>Updated At</label><p>{{ formatDate(vendorForm.updatedAt) }}</p></div>
            </div>
          </template>
          <template v-else>
            <div class="edit-form-grid">
              <div class="edit-field"><label>Legal Name</label><input v-model="vendorForm.name" /></div>
              <div class="edit-field"><label>Email</label><input v-model="vendorForm.email" /></div>
              <div class="edit-field"><label>Mobile</label><input v-model="vendorForm.mobile_no" /></div>
              <div class="edit-field"><label>Latitude</label><input v-model="vendorForm.lat" /></div>
              <div class="edit-field"><label>Longitude</label><input v-model="vendorForm.long" /></div>
            </div>
          </template>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--emerald"></div>
            <h3 class="card__title">Settlement Account</h3>
            <button class="edit-toggle-btn ml-auto" @click="toggleEdit('settlement')" v-if="vendorForm.settlementAccount">
              <svg v-if="!editMode.settlement" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {{ editMode.settlement ? 'Cancel' : 'Edit' }}
            </button>
          </div>
          <template v-if="vendorForm.settlementAccount">
            <template v-if="!editMode.settlement">
              <div class="info-grid info-grid--4">
                <div class="info-item"><label>Account Holder</label><p>{{ vendorForm.settlementAccount.account_holder_name }}</p></div>
                <div class="info-item"><label>Account Type</label><p>{{ vendorForm.settlementAccount.account_type }}</p></div>
                <div class="info-item"><label>Bank Name</label><p>{{ vendorForm.settlementAccount.bank_name }}</p></div>
                <div class="info-item"><label>Account No</label><p class="font-mono">{{ vendorForm.settlementAccount.bank_account_no }}</p></div>
                <div class="info-item"><label>IFSC Code</label><p class="font-mono">{{ vendorForm.settlementAccount.bank_ifsc_code }}</p></div>
                <div class="info-item"><label>City</label><p>{{ vendorForm.settlementAccount.city || '—' }}</p></div>
                <div class="info-item"><label>State</label><p>{{ vendorForm.settlementAccount.state || '—' }}</p></div>
              </div>
            </template>
            <template v-else>
              <div class="edit-form-grid">
                <div class="edit-field"><label>Account Holder</label><input v-model="vendorForm.settlementAccount.account_holder_name" /></div>
                <div class="edit-field"><label>Account Type</label><input v-model="vendorForm.settlementAccount.account_type" /></div>
                <div class="edit-field"><label>Bank Name</label><input v-model="vendorForm.settlementAccount.bank_name" /></div>
                <div class="edit-field"><label>Account No</label><input v-model="vendorForm.settlementAccount.bank_account_no" /></div>
                <div class="edit-field"><label>IFSC Code</label><input v-model="vendorForm.settlementAccount.bank_ifsc_code" /></div>
                <div class="edit-field"><label>City</label><input v-model="vendorForm.settlementAccount.city" /></div>
                <div class="edit-field"><label>State</label><input v-model="vendorForm.settlementAccount.state" /></div>
              </div>
            </template>
          </template>
          <div class="empty-state" v-else><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg><p>No settlement account configured</p></div>
        </div>

        <div class="card" v-if="vendorForm.address">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Address Details</h3>
            <button class="edit-toggle-btn ml-auto" @click="toggleEdit('address')">
              <svg v-if="!editMode.address" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              {{ editMode.address ? 'Cancel' : 'Edit' }}
            </button>
          </div>
          <template v-if="!editMode.address">
            <div class="addr-grid">
              <div class="addr-card">
                <div class="addr-card__hd addr-card__hd--blue">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Official Address
                </div>
                <div class="addr-card__body">
                  <p>{{ vendorForm.address.official_address }}</p>
                  <p>{{ vendorForm.address.address1 }}, {{ vendorForm.address.address2 }}</p>
                  <p class="addr-city">{{ vendorForm.address.city }}, {{ vendorForm.address.state }} – {{ vendorForm.address.pincode }}</p>
                  <div class="addr-contact">
                    <span>📞 {{ vendorForm.address.mobile_number }}</span>
                    <a v-if="vendorForm.address.website" :href="vendorForm.address.website" class="addr-link" target="_blank">🌐 Website</a>
                  </div>
                </div>
              </div>
              <div class="addr-card">
                <div class="addr-card__hd addr-card__hd--violet">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  Residential Address
                </div>
                <div class="addr-card__body">
                  <p>{{ vendorForm.address.residential_address }}</p>
                  <p>{{ vendorForm.address.res_address1 }}, {{ vendorForm.address.res_address2 }}</p>
                  <p class="addr-city">{{ vendorForm.address.res_city }}, {{ vendorForm.address.res_state }} – {{ vendorForm.address.res_pincode }}</p>
                  <div class="addr-contact"><span>📞 {{ vendorForm.address.res_mobile }}</span></div>
                </div>
              </div>
              <div class="addr-card">
                <div class="addr-card__hd addr-card__hd--emerald">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Visitor / Store
                </div>
                <div class="addr-card__body">
                  <p>{{ vendorForm.address.vister_address }}</p>
                  <p>{{ vendorForm.address.v_address1 }}, {{ vendorForm.address.v_address2 }}</p>
                  <p class="addr-city">{{ vendorForm.address.v_city }}, {{ vendorForm.address.v_state }} – {{ vendorForm.address.v_pincode }}</p>
                  <div class="addr-contact"><span>📞 {{ vendorForm.address.v_mobile }}</span></div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="edit-form-grid edit-form-grid--padded">
              <div class="edit-field"><label>Official Address</label><input v-model="vendorForm.address.official_address" /></div>
              <div class="edit-field"><label>Line 1</label><input v-model="vendorForm.address.address1" /></div>
              <div class="edit-field"><label>Line 2</label><input v-model="vendorForm.address.address2" /></div>
              <div class="edit-field"><label>City</label><input v-model="vendorForm.address.city" /></div>
              <div class="edit-field"><label>State</label><input v-model="vendorForm.address.state" /></div>
              <div class="edit-field"><label>Pincode</label><input v-model="vendorForm.address.pincode" /></div>
              <div class="edit-field"><label>Mobile</label><input v-model="vendorForm.address.mobile_number" /></div>
              <div class="edit-field"><label>Website</label><input v-model="vendorForm.address.website" /></div>
            </div>
          </template>
        </div>

        <div class="card" v-if="vendorForm.user">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--rose"></div>
            <h3 class="card__title">User Account</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Name</label><p>{{ vendorForm.user.name }}</p></div>
            <div class="info-item"><label>Email</label><p>{{ vendorForm.user.email }}</p></div>
            <div class="info-item"><label>Mobile</label><p>{{ vendorForm.user.mobile_no }}</p></div>
            <div class="info-item"><label>Role</label><p><span class="pill pill--indigo">{{ vendorForm.user.role }}</span></p></div>
            <div class="info-item"><label>Account Status</label><p><span :class="['pill', vendorForm.user.status ? 'pill--emerald' : 'pill--red']">{{ vendorForm.user.status ? 'Active' : 'Inactive' }}</span></p></div>
            <div class="info-item"><label>Mobile Verified</label><p><span :class="['pill', vendorForm.user.mobile_verifited ? 'pill--emerald' : 'pill--amber']">{{ vendorForm.user.mobile_verifited ? 'Yes' : 'No' }}</span></p></div>
            <div class="info-item"><label>Email Verified</label><p><span :class="['pill', vendorForm.user.isemailVerified ? 'pill--emerald' : 'pill--amber']">{{ vendorForm.user.isemailVerified ? 'Yes' : 'No' }}</span></p></div>
            <div class="info-item"><label>OTP Verified</label><p><span :class="['pill', vendorForm.user.isotpVerified ? 'pill--emerald' : 'pill--amber']">{{ vendorForm.user.isotpVerified ? 'Yes' : 'No' }}</span></p></div>
            <div class="info-item"><label>Invited</label><p><span :class="['pill', vendorForm.user.invited ? 'pill--emerald' : 'pill--amber']">{{ vendorForm.user.invited ? 'Yes' : 'Pending' }}</span></p></div>
            <div class="info-item"><label>Joined</label><p>{{ formatDate(vendorForm.user.createdAt) }}</p></div>
          </div>
          <div class="api-key-bar">
            <span class="api-key-bar__label">API Key</span>
            <span class="font-mono text-xs">{{ vendorForm.user.apiKey?.slice(0,32) + '…' }}</span>
          </div>
        </div>

        <div class="card" v-if="vendorForm.vendorpan?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--amber"></div>
            <h3 class="card__title">PAN Information</h3>
          </div>
          <div class="table-scroll-wrap">
            <table class="data-table">
              <thead><tr><th>PAN</th><th>Name</th><th>Entity PAN</th><th>DOB</th><th>Father Name</th><th>Partner</th></tr></thead>
              <tbody>
                <tr v-for="pan in vendorForm.vendorpan" :key="pan.id">
                  <td class="font-mono">{{ pan.pan }}</td>
                  <td>{{ pan.pan_name }}</td>
                  <td class="font-mono">{{ pan.entity_pan || '—' }}</td>
                  <td>{{ formatDate(pan.pan_dob) || '—' }}</td>
                  <td>{{ pan.pan_father_name || '—' }}</td>
                  <td><span :class="['pill', pan.partner ? 'pill--indigo' : 'pill--slate']">{{ pan.partner ? 'Yes' : 'No' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </section>

      <!-- ════ TAB: LINKED SERVICES ════ -->
<section v-show="activeTab === 'linkedservices'" class="tab-section">

  <div class="card">
    <div class="card__head">
      <div class="card__head-dot card__head-dot--sky"></div>
      <h3 class="card__title">Allowed Services and Interface</h3>
      <span class="ml-2">
        <span class="pill pill--sky pill--sm">{{ linkedServices.length }} linked</span>
      </span>
      <button class="btn-primary ml-auto" @click="openAddLs">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Service
      </button>
    </div>

    <div class="table-scroll-wrap" v-if="linkedServices.length">
      <table class="data-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Interface</th>
            <th>Interface API Key</th>
            <th>Status</th>
            <th>Linked On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ls in linkedServices" :key="ls.id">
            <td>
              <span class="pill pill--indigo pill--sm">{{ ls.service?.service }}</span>
            </td>
            <td>
              <span class="pill pill--slate pill--sm">{{ ls.interface?.interface }}</span>
            </td>
            <td>
              <span class="font-mono text-xs" v-if="ls.interface?.apiKey">
                {{ ls.interface.apiKey.slice(0, 20) }}…
              </span>
              <span class="text-xs" style="color:#94a3b8" v-else>—</span>
            </td>
            <td>
              <span :class="['flag', ls.status ? 'flag--on' : 'flag--off']">
                {{ ls.status ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>{{ formatDate(ls.createdAt) }}</td>
            <td>
              <div class="action-btns">
                <button class="icon-btn icon-btn--edit" @click="openEditLs(ls)" title="Edit">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="icon-btn icon-btn--delete" @click="deleteLs(ls.id)" title="Delete">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="empty-state" v-else>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
      <p>No services linked to this vendor yet</p>
      <button class="btn-primary" style="margin-top:10px" @click="openAddLs">Link First Service</button>
    </div>
  </div>

  <!-- Linked Service Modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="lsModal.open" class="modal-overlay" @click.self="closeLsModal">
        <div class="modal-box">

          <div class="modal-box__header">
            <h3 class="modal-box__title">
              {{ lsModal.mode === 'add' ? 'Link New Service' : 'Update Linked Service' }}
            </h3>
            <button class="modal-close" @click="closeLsModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-box__body">
            <div class="modal-grid">

              <div class="modal-field modal-field--full">
                <label>Service <span class="req">*</span></label>
                <select v-model="lsForm.serviceId" @change="lsForm.interfaceId = ''">
                  <option value="">Select a service</option>
                  <option v-for="svc in allServices" :key="svc.id" :value="svc.id">
                    {{ svc.service }}
                  </option>
                </select>
              </div>

              <div class="modal-field modal-field--full">
                <label>Interface <span class="req">*</span></label>
                <select v-model="lsForm.interfaceId" :disabled="!lsForm.serviceId">
                  <option value="">{{ lsForm.serviceId ? 'Select an interface' : 'Select a service first' }}</option>
                  <option v-for="iface in availableInterfaces" :key="iface.id" :value="iface.id">
                    {{ iface.interface }}
                  </option>
                </select>
                <p v-if="lsForm.serviceId && availableInterfaces.length === 0"
                  style="font-size:11px;color:#ef4444;margin-top:4px">
                  No active interfaces for this service
                </p>
              </div>

              <div class="modal-field modal-field--full">
                <label class="toggle-label">
                  <span>Activate this link immediately</span>
                  <div class="toggle-wrap">
                    <input type="checkbox" v-model="lsForm.status" class="toggle-input" id="lsStatusToggle" />
                    <label for="lsStatusToggle" class="toggle-track"></label>
                  </div>
                </label>
              </div>

            </div>
          </div>

          <div class="modal-box__footer">
            <button class="btn-cancel" @click="closeLsModal">Cancel</button>
            <button class="btn-primary" :disabled="lsSaving" @click="saveLs">
              <svg v-if="lsSaving" class="spin-icon" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ lsSaving ? 'Saving…' : lsModal.mode === 'add' ? 'Link Service' : 'Update' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

</section>

<!-- ════ TAB: COMMISSIONS ════ -->
<section v-show="activeTab === 'commissions'" class="tab-section">

  <!-- Aggregator Info -->
  <div class="card" v-if="vendorForm.aggregator">
    <div class="card__head">
      <div class="card__head-dot card__head-dot--violet"></div>
      <h3 class="card__title">Aggregator: {{ vendorForm.aggregator.name }}</h3>
      <span class="ml-auto text-xs text-slate-400">Code: {{ vendorForm.aggregator.code }}</span>
    </div>
    <div class="info-grid info-grid--4">
      <div class="info-item"><label>Name</label><p>{{ vendorForm.aggregator.name }}</p></div>
      <div class="info-item"><label>Email</label><p>{{ vendorForm.aggregator.email }}</p></div>
      <div class="info-item"><label>Mobile</label><p>{{ vendorForm.aggregator.mobile_no }}</p></div>
      <div class="info-item"><label>Code</label><p class="font-mono">{{ vendorForm.aggregator.code }}</p></div>
      <div class="info-item"><label>Default Rate</label><p>{{ vendorForm.aggregator.rate }}% ({{ vendorForm.aggregator.rateType }})</p></div>
    </div>
  </div>

  <!-- Vendor Commission Slabs (editable) -->
  <div class="card">
    <div class="card__head">
      <div class="card__head-dot card__head-dot--indigo"></div>
      <h3 class="card__title">Vendor Commission Slabs</h3>
      <span class="ml-2"><span class="pill pill--indigo pill--sm">{{ vendorForm.commissions?.length || 0 }} slabs</span></span>
      <button class="btn-primary ml-auto" @click="openAddCommission">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Slab
      </button>
    </div>

    <div class="table-scroll-wrap" v-if="vendorForm.commissions?.length">
      <table class="data-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Provider</th>
            <th>Txn Type</th>
            <th>Min ₹</th>
            <th>Max ₹</th>
            <th>Rate</th>
            <th>Rate Type</th>
            <th>Default</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in vendorForm.commissions" :key="c.id">
            <td><span class="pill pill--indigo pill--sm">{{ c.paymentMethod }}</span></td>
            <td>{{ c.provider }}</td>
            <td><span class="pill pill--slate pill--sm">{{ c.txnType }}</span></td>
            <td class="font-mono">₹ {{ Number(c.minAmount).toLocaleString('en-IN') }}</td>
            <td class="font-mono">₹ {{ Number(c.maxAmount).toLocaleString('en-IN') }}</td>
            <td class="rate-val font-bold">{{ c.commissionRate }}{{ c.rateType === 'PERCENTAGE' ? '%' : ' ₹' }}</td>
            <td>
              <span :class="['pill pill--sm', c.rateType === 'PERCENTAGE' ? 'pill--sky' : 'pill--violet']">
                {{ c.rateType }}
              </span>
            </td>
            <td>
              <span :class="['flag', c.isDefault ? 'flag--on' : 'flag--off']">
                {{ c.isDefault ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>
              <div class="action-btns">
                <button class="icon-btn icon-btn--edit" @click="openEditCommission(c)" title="Edit">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="icon-btn icon-btn--delete" @click="deleteCommissionSlab(c.id)" title="Delete">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="empty-state" v-else>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
      <p>No commission slabs configured for this vendor</p>
      <button class="btn-primary" style="margin-top:10px;" @click="openAddCommission">Add First Slab</button>
    </div>
  </div>

  <!-- Aggregator Commission Slabs (read-only reference) -->
  <!-- <div class="card" v-if="vendorForm.aggregator?.commissions?.length">
    <div class="card__head">
      <div class="card__head-dot card__head-dot--amber"></div>
      <h3 class="card__title">Aggregator Commission Reference</h3>
      <span class="ml-auto"><span class="pill pill--amber pill--sm">{{ vendorForm.aggregator.commissions.length }} slabs</span></span>
    </div>
    <div class="table-scroll-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Method</th><th>Provider</th><th>Txn Type</th>
            <th>Min ₹</th><th>Max ₹</th><th>Rate</th><th>Rate Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in vendorForm.aggregator.commissions" :key="c.id">
            <td><span class="pill pill--indigo pill--sm">{{ c.paymentMethod }}</span></td>
            <td>{{ c.provider }}</td>
            <td><span class="pill pill--slate pill--sm">{{ c.txnType }}</span></td>
            <td class="font-mono">₹ {{ Number(c.minAmount).toLocaleString('en-IN') }}</td>
            <td class="font-mono">₹ {{ Number(c.maxAmount).toLocaleString('en-IN') }}</td>
            <td class="rate-val font-bold">{{ c.rate }}{{ c.rateType === 'PERCENTAGE' ? '%' : ' ₹' }}</td>
            <td><span :class="['pill pill--sm', c.rateType === 'PERCENTAGE' ? 'pill--sky' : 'pill--violet']">{{ c.rateType }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div> -->

  <!-- Bank Commission Reference (read-only) -->
  <!-- <div class="card" v-if="vendorForm.aggregator?.bankcommissions?.length">
    <div class="card__head">
      <div class="card__head-dot card__head-dot--emerald"></div>
      <h3 class="card__title">Bank Commission Reference</h3>
      <span class="ml-auto"><span class="pill pill--emerald pill--sm">{{ vendorForm.aggregator.bankcommissions.length }} slabs</span></span>
    </div>
    <div class="table-scroll-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Method</th><th>Provider</th><th>Txn Type</th>
            <th>Min ₹</th><th>Max ₹</th><th>Rate</th><th>Rate Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in vendorForm.aggregator.bankcommissions" :key="c.id">
            <td><span class="pill pill--indigo pill--sm">{{ c.paymentMethod }}</span></td>
            <td>{{ c.provider }}</td>
            <td><span class="pill pill--slate pill--sm">{{ c.txnType }}</span></td>
            <td class="font-mono">₹ {{ Number(c.minAmount).toLocaleString('en-IN') }}</td>
            <td class="font-mono">₹ {{ Number(c.maxAmount).toLocaleString('en-IN') }}</td>
            <td class="rate-val font-bold">{{ c.rate }}{{ c.rateType === 'PERCENTAGE' ? '%' : ' ₹' }}</td>
            <td><span :class="['pill pill--sm', c.rateType === 'PERCENTAGE' ? 'pill--sky' : 'pill--violet']">{{ c.rateType }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div> -->

  <!-- Commission Modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="commissionModal.open" class="modal-overlay" @click.self="closeCommissionModal">
        <div class="modal-box">
          <div class="modal-box__header">
            <h3 class="modal-box__title">
              {{ commissionModal.mode === 'add' ? 'Add Commission Slab' : 'Edit Commission Slab' }}
            </h3>
            <button class="modal-close" @click="closeCommissionModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="modal-box__body">
            <div class="modal-grid">

              <div class="modal-field">
                <label>Payment Method <span class="req">*</span></label>
                <select v-model="commissionForm.paymentMethod">
                  <option value="">Select</option>
                  <option v-for="m in paymentMethods" :key="m" :value="m">{{ m }}</option>
                </select>
              </div>

              <div class="modal-field">
                <label>Provider <span class="req">*</span></label>
                <select v-model="commissionForm.provider">
                  <option value="">Select</option>
                  <option v-for="p in providers" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>

              <div class="modal-field">
                <label>Txn Type <span class="req">*</span></label>
                <select v-model="commissionForm.txnType">
                  <option v-for="t in txnTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <div class="modal-field">
                <label>Min Amount (₹) <span class="req">*</span></label>
                <input type="number" v-model.number="commissionForm.minAmount" min="0" placeholder="0" />
              </div>

              <div class="modal-field">
                <label>Max Amount (₹) <span class="req">*</span></label>
                <input type="number" v-model.number="commissionForm.maxAmount" min="0" placeholder="99999999" />
              </div>

              <div class="modal-field">
                <label>Commission Rate <span class="req">*</span></label>
                <input type="number" v-model.number="commissionForm.commissionRate" min="0" step="0.01" placeholder="0.00" />
              </div>

              <div class="modal-field">
                <label>Rate Type <span class="req">*</span></label>
                <select v-model="commissionForm.rateType">
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="FLAT">FLAT</option>
                </select>
              </div>

              <div class="modal-field modal-field--full">
                <label class="toggle-label">
                  <span>Mark as Default Slab</span>
                  <div class="toggle-wrap">
                    <input type="checkbox" v-model="commissionForm.isDefault" class="toggle-input" id="isDefaultToggle" />
                    <label for="isDefaultToggle" class="toggle-track"></label>
                  </div>
                </label>
              </div>

            </div>

            <!-- Rate comparison helper -->
            <div class="rate-hint" v-if="commissionForm.paymentMethod && commissionForm.provider">
              <p class="rate-hint__title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Aggregator reference for {{ commissionForm.paymentMethod }} / {{ commissionForm.provider }}
              </p>
              <div class="rate-hint__rows">
                <template v-for="ref in aggregatorRateRef" :key="ref.id">
                  <div class="rate-hint__row">
                    <span class="pill pill--slate pill--sm">{{ ref.txnType }}</span>
                    <span class="rate-hint__range">₹{{ ref.minAmount }} – ₹{{ ref.maxAmount }}</span>
                    <span class="rate-hint__rate">
                      {{ ref.rate }}{{ ref.rateType === 'PERCENTAGE' ? '%' : ' ₹ flat' }}
                    </span>
                  </div>
                </template>
                <p v-if="!aggregatorRateRef.length" class="rate-hint__none">No aggregator slab for this combination</p>
              </div>
            </div>
          </div>

          <div class="modal-box__footer">
            <button class="btn-cancel" @click="closeCommissionModal">Cancel</button>
            <button class="btn-primary" :disabled="commissionSaving" @click="saveCommission">
              <svg v-if="commissionSaving" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ commissionSaving ? 'Saving…' : commissionModal.mode === 'add' ? 'Add Slab' : 'Update Slab' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</section>

      <!-- ════ TAB: MERCHANTS ════ -->
      <section v-show="activeTab === 'merchants'" class="tab-section">

        <div class="toolbar-row">
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input v-model="merchantSearch" placeholder="Search merchants…" class="search-input" />
          </div>
          <div class="filter-pills">
            <button :class="['fpill', merchantFilter === 'ALL' && 'fpill--active']" @click="merchantFilter = 'ALL'">All</button>
            <button :class="['fpill', merchantFilter === 'APPROVED' && 'fpill--active']" @click="merchantFilter = 'APPROVED'">Approved</button>
            <button :class="['fpill', merchantFilter === 'PENDING' && 'fpill--active']" @click="merchantFilter = 'PENDING'">Pending</button>
          </div>
          <div class="view-switcher">
            <button :class="['vs-btn', merchantView === 'card' && 'vs-btn--active']" @click="merchantView = 'card'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button :class="['vs-btn', merchantView === 'table' && 'vs-btn--active']" @click="merchantView = 'table'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="merchant-grid" v-if="merchantView === 'card' && filteredMerchants.length">
          <div v-for="m in filteredMerchants" :key="m.id" class="merchant-card">
            <div class="merchant-card__top" @click="toggleExpand(m.id)" style="cursor:pointer">
              <div class="mc-avatar" :style="{ background: avatarBg(m.legal_name || m.business_name || 'M') }">
                {{ (m.legal_name || m.business_name || 'M').charAt(0).toUpperCase() }}
              </div>
              <div class="mc-info">
                <p class="mc-name">{{ m.legal_name || m.business_name || '—' }}</p>
                <p class="mc-mid font-mono text-xs">{{ m.mid }}</p>
              </div>
              <div class="mc-badges">
                <span :class="['pill pill--sm', m.status ? 'pill--emerald' : 'pill--red']">{{ m.status ? 'Active' : 'Inactive' }}</span>
                <span class="pill pill--sm pill--slate">{{ m.mstatus }}</span>
              </div>
              <span class="expand-caret">{{ expandedMerchant === m.id ? '▲' : '▼' }}</span>
            </div>
            <div class="mc-meta-row">
              <span class="pill pill--sm pill--indigo">{{ m.interface }}</span>
              <span :class="['pill pill--sm', m.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ m.riskflag > 0 ? '⚠ Flagged' : '✓ Clear' }}</span>
              <span v-if="m.mobile_no" class="mc-mobile">📞 {{ m.mobile_no }}</span>
            </div>
            <div class="mc-methods" v-if="m.paymethods?.length">
              <span class="mc-methods__label">Pay Methods</span>
              <span v-for="pm in m.paymethods" :key="pm.paymentMethod" class="pill pill--sm pill--sky">{{ pm.paymentMethod }} · {{ pm.provider }}</span>
            </div>
            <div class="mc-kyc-row" v-if="m.merchantKyc">
              <span class="mc-methods__label">KYC</span>
              <span :class="['pill pill--sm', kycPillClass(m.merchantKyc.globalStatus)]">{{ m.merchantKyc.globalStatus }}</span>
              <span class="pill pill--sm pill--slate">{{ m.merchantKyc.globalRiskLevel }}</span>
              <span v-if="m.merchantKyc.amlFlag" class="pill pill--sm pill--red">⚠ AML</span>
            </div>

            <div v-if="expandedMerchant === m.id" class="mc-expanded">
              <div class="mc-exp-grid">
                <div class="mc-exp-block" v-if="m.address">
                  <p class="mc-exp-label">Official Address</p>
                  <p class="mc-exp-val">{{ m.address.official_address }}, {{ m.address.address1 }}</p>
                  <p class="mc-exp-val">{{ m.address.city }}, {{ m.address.state }} – {{ m.address.pincode }}</p>
                  <p class="mc-exp-val" v-if="m.address.website">🌐 {{ m.address.website }}</p>
                </div>
                <div class="mc-exp-block" v-if="m.merchantinfo">
                  <p class="mc-exp-label">Merchant Info</p>
                  <p class="mc-exp-val">✉ {{ m.merchantinfo.primary_email_id }}</p>
                  <p class="mc-exp-val">📞 {{ m.merchantinfo.primary_mobile }}</p>
                  <p class="mc-exp-val">DOB: {{ formatDate(m.merchantinfo.dob) }}</p>
                  <p class="mc-exp-val" v-if="m.merchantinfo.annual_turn_over">Turnover: {{ m.merchantinfo.annual_turn_over }}</p>
                </div>
                <div class="mc-exp-block" v-if="m.merchantgst">
                  <p class="mc-exp-label">GST</p>
                  <p class="mc-exp-val font-mono">{{ m.merchantgst.gstin }}</p>
                  <p class="mc-exp-val">{{ m.merchantgst.business_name }}</p>
                </div>
                <div class="mc-exp-block" v-if="m.settlementaccount">
                  <p class="mc-exp-label">Settlement Account</p>
                  <p class="mc-exp-val">{{ m.settlementaccount.bank_name }} · {{ m.settlementaccount.account_type }}</p>
                  <p class="mc-exp-val font-mono">A/C: {{ m.settlementaccount.bank_account_no }}</p>
                  <p class="mc-exp-val font-mono">IFSC: {{ m.settlementaccount.bank_ifsc_code }}</p>
                </div>
                <div class="mc-exp-block" v-if="m.merchantpan?.length">
                  <p class="mc-exp-label">PAN</p>
                  <div v-for="pan in m.merchantpan" :key="pan.id" class="mc-exp-pan-row">
                    <span class="font-mono">{{ pan.pan }}</span>
                    <span>{{ pan.pan_name }}</span>
                    <span :class="['pill pill--sm', pan.partner ? 'pill--indigo' : 'pill--slate']">{{ pan.partner ? 'Partner' : 'Self' }}</span>
                  </div>
                </div>
                <div class="mc-exp-block" v-if="m.wallet">
                  <p class="mc-exp-label">Wallet</p>
                  <p class="mc-exp-val font-bold">₹ {{ Number(m.wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</p>
                  <span :class="['pill pill--sm', m.wallet.status ? 'pill--emerald' : 'pill--red']">{{ m.wallet.status ? 'Active' : 'Inactive' }}</span>
                </div>
                <div class="mc-exp-block" v-if="m.mcc">
                  <p class="mc-exp-label">MCC</p>
                  <p class="mc-exp-val font-mono font-bold">{{ m.mcc.id }}</p>
                  <p class="mc-exp-val">{{ m.mcc.descr }}</p>
                </div>
                <div class="mc-exp-block" v-if="m.businesstype">
                  <p class="mc-exp-label">Business Type</p>
                  <p class="mc-exp-val">{{ m.businesstype.type }} ({{ m.businesstype.value }})</p>
                </div>
              </div>

              <div v-if="m.merchantKyc?.services?.length" class="mc-kyc-services">
                <p class="mc-exp-label" style="margin-bottom:8px">KYC Services</p>
                <table class="data-table data-table--compact kyc-svc-desktop">
                  <thead><tr><th>Service</th><th>Interface</th><th>PAN</th><th>Aadhaar</th><th>Bank</th><th>GST</th><th>Store Img</th><th>OTP</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr v-for="svc in m.merchantKyc.services" :key="svc.id">
                      <td><span class="pill pill--sm pill--indigo">{{ svc.service }}</span></td>
                      <td><span class="pill pill--sm pill--slate">{{ svc.interface }}</span></td>
                      <td><span :class="['pill pill--sm', kycPillClass(svc.panStatus)]">{{ svc.panStatus }}</span></td>
                      <td><span :class="['pill pill--sm', kycPillClass(svc.aadhaarStatus)]">{{ svc.aadhaarStatus }}</span></td>
                      <td><span :class="['pill pill--sm', kycPillClass(svc.bankStatus)]">{{ svc.bankStatus }}</span></td>
                      <td><span :class="['pill pill--sm', kycPillClass(svc.gstStatus)]">{{ svc.gstStatus }}</span></td>
                      <td><span :class="['pill pill--sm', kycPillClass(svc.storeImgStatus)]">{{ svc.storeImgStatus }}</span></td>
                      <td><span :class="['flag', svc.otpStatus ? 'flag--on' : 'flag--off']">{{ svc.otpStatus ? 'Done' : 'No' }}</span></td>
                      <td><span :class="['pill pill--sm', kycPillClass(svc.status)]">{{ svc.status }}</span></td>
                    </tr>
                  </tbody>
                </table>
                <div class="kyc-svc-mobile">
                  <div v-for="svc in m.merchantKyc.services" :key="svc.id" class="kyc-mob-card">
                    <div class="kyc-mob-card__hd">
                      <span class="pill pill--sm pill--indigo">{{ svc.service }}</span>
                      <span class="pill pill--sm pill--slate">{{ svc.interface }}</span>
                      <span :class="['pill pill--sm', kycPillClass(svc.status)]">{{ svc.status }}</span>
                    </div>
                    <div class="kyc-mob-card__body">
                      <div class="kyc-mob-row"><span>PAN</span><span :class="['pill pill--sm', kycPillClass(svc.panStatus)]">{{ svc.panStatus }}</span></div>
                      <div class="kyc-mob-row"><span>Aadhaar</span><span :class="['pill pill--sm', kycPillClass(svc.aadhaarStatus)]">{{ svc.aadhaarStatus }}</span></div>
                      <div class="kyc-mob-row"><span>Bank</span><span :class="['pill pill--sm', kycPillClass(svc.bankStatus)]">{{ svc.bankStatus }}</span></div>
                      <div class="kyc-mob-row"><span>GST</span><span :class="['pill pill--sm', kycPillClass(svc.gstStatus)]">{{ svc.gstStatus }}</span></div>
                      <div class="kyc-mob-row"><span>Store Img</span><span :class="['pill pill--sm', kycPillClass(svc.storeImgStatus)]">{{ svc.storeImgStatus }}</span></div>
                      <div class="kyc-mob-row"><span>OTP</span><span :class="['flag', svc.otpStatus ? 'flag--on' : 'flag--off']">{{ svc.otpStatus ? 'Done' : 'No' }}</span></div>
                      <div class="kyc-mob-row"><span>Biometric</span><span :class="['flag', svc.biometricRequired ? 'flag--on' : 'flag--off']">{{ svc.biometricRequired ? 'Required' : 'No' }}</span></div>
                      <div class="kyc-mob-row"><span>Physical Verify</span><span :class="['flag', svc.physicalVerificationRequired ? 'flag--on' : 'flag--off']">{{ svc.physicalVerificationRequired ? 'Yes' : 'No' }}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card" v-else-if="merchantView === 'table' && filteredMerchants.length">
          <div class="table-scroll-wrap">
            <table class="data-table">
              <thead><tr><th>MID</th><th>Legal Name</th><th>Interface</th><th>Status</th><th>Lifecycle</th><th>Risk</th><th>Created</th></tr></thead>
              <tbody>
                <tr v-for="m in filteredMerchants" :key="m.id">
                  <td class="font-mono text-xs">{{ m.mid }}</td>
                  <td><strong>{{ m.legal_name || '—' }}</strong></td>
                  <td><span class="pill pill--sm pill--indigo">{{ m.interface }}</span></td>
                  <td><span :class="['pill pill--sm', m.status ? 'pill--emerald' : 'pill--red']">{{ m.status ? 'Active' : 'Inactive' }}</span></td>
                  <td><span class="pill pill--sm pill--amber">{{ m.mstatus }}</span></td>
                  <td><span :class="['pill pill--sm', m.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ m.riskflag > 0 ? 'Flagged' : 'Clear' }}</span></td>
                  <td>{{ formatDate(m.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="empty-state" v-else>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          <p>No merchants found</p>
        </div>
      </section>

      <!-- ════ TAB: TERMINALS ════ -->
      <section v-show="activeTab === 'terminals'" class="tab-section">
        <div class="terminal-grid" v-if="vendorForm.terminals?.length">
          <div class="terminal-card" v-for="t in vendorForm.terminals" :key="t.id">
            <div class="terminal-card__top">
              <div class="tc-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div>
                <p class="tc-tid">{{ t.tid || 'No TID' }}</p>
                <p class="tc-type">{{ t.type }} · {{ t.interfaceType }}</p>
              </div>
              <span :class="['pill pill--sm ml-auto', t.status ? 'pill--emerald' : 'pill--red']">{{ t.status ? 'Active' : 'Inactive' }}</span>
            </div>
            <div class="info-grid info-grid--3">
              <div class="info-item"><label>MID</label><p class="font-mono text-xs">{{ t.mid || '—' }}</p></div>
              <div class="info-item"><label>Interface</label><p>{{ t.interface }}</p></div>
              <div class="info-item"><label>Serial No</label><p class="font-mono text-xs">{{ t.serialNumber || '—' }}</p></div>
              <div class="info-item"><label>VPA</label><p class="font-mono text-xs">{{ t.vpastring?.vpa || '—' }}</p></div>
              <div class="info-item"><label>Soundbox</label><p><span :class="['flag', t.soundbox ? 'flag--on' : 'flag--off']">{{ t.soundbox ? 'Yes' : 'No' }}</span></p></div>
              <div class="info-item"><label>Risk Flag</label><p><span :class="['pill pill--sm', t.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ t.riskflag }}</span></p></div>
            </div>
            <div class="tc-device" v-if="t.device">
              <p class="tc-device-label">Device</p>
              <p class="tc-device-val">{{ t.device.deviceName }} · {{ t.device.type }}</p>
              <p class="tc-device-val font-mono text-xs">{{ t.device.serialNumber }}</p>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <p>No terminals assigned to this vendor</p>
        </div>
      </section>

      <!-- ════ TAB: DOCUMENTS ════ -->
      <section v-show="activeTab === 'documents'" class="tab-section">
        <div class="docs-grid" v-if="vendorForm.documents?.length">
          <div class="doc-card" v-for="doc in vendorForm.documents" :key="doc.id" @click="openDoc(doc)">
            <div class="doc-card__top">
              <div class="doc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <span :class="['pill pill--sm', docStatusPill(doc.doc_status)]">{{ doc.doc_status }}</span>
            </div>
            <p class="doc-name">{{ doc.doc_name }}</p>
            <p class="doc-type">{{ doc.doc_type }}</p>
            <p class="doc-num font-mono text-xs">{{ doc.doc_number || '—' }}</p>
            <div class="doc-imgs-count">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              {{ doc.images?.length || 0 }} image(s)
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p>No documents uploaded</p>
        </div>
      </section>

      <!-- ════ TAB: TRANSACTIONS ════ -->
      <section v-show="activeTab === 'transactions'" class="tab-section">
        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">Recent Transactions</h3>
          </div>
          <div class="table-scroll-wrap" v-if="transactions.data?.length">
            <table class="data-table">
              <thead><tr><th>TR</th><th>RRN</th><th>Amount</th><th>Method</th><th>Status</th><th>Provider</th><th>Date</th></tr></thead>
              <tbody>
                <tr v-for="t in transactions.data" :key="t.id">
                  <td class="font-mono text-xs">{{ t.tr }}</td>
                  <td class="font-mono text-xs">{{ t.rrn }}</td>
                  <td><strong>₹ {{ Number(t.amount).toLocaleString('en-IN') }}</strong></td>
                  <td><span class="pill pill--sm pill--indigo">{{ t.paymentMethod }}</span></td>
                  <td><span :class="['pill pill--sm', txnPill(t.status)]">{{ t.status }}</span></td>
                  <td>{{ t.provider }}</td>
                  <td>{{ formatDate(t.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" v-else>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
            <p>No transactions found</p>
          </div>
        </div>
      </section>

    </main>

    <!-- ░░ FOOTER (desktop only) ░░ -->
    <footer class="mh-footer">
      <div class="mh-footer__status"><div class="pulse-dot"></div><span>Live System Status: Optimal</span></div>
      <div class="mh-footer__links"><a href="#">Support Docs</a><a href="#">Compliance</a><a href="#">API Reference</a></div>
    </footer>

    <!-- ░░ SAVE BAR ░░ -->
    <Transition name="save-bar">
      <div v-if="isFormChanged" class="save-bar">
        <div class="save-bar__inner">
          <span class="save-bar__msg">You have unsaved changes</span>
          <div class="save-bar__actions">
            <button class="btn-discard" @click="cancelEdit">Discard</button>
            <button class="btn-save" @click="submitForm" :disabled="saving">
              <span v-if="saving" class="btn-spinner"></span>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {{ saving ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ░░ DOCUMENT DIALOG ░░ -->
    <Teleport to="body">
      <Transition name="dialog">
        <div v-if="docDialog" class="dialog-overlay" @click.self="docDialog = false">
          <div class="dialog">
            <div class="dialog__header">
              <div>
                <p class="dialog__title">{{ selectedDoc?.doc_name }}</p>
                <p class="dialog__sub">{{ selectedDoc?.doc_type }}</p>
              </div>
              <div class="dialog__hdr-right">
                <span :class="['pill pill--sm', docStatusPill(selectedDoc?.doc_status)]">{{ selectedDoc?.doc_status }}</span>
                <button class="icon-close-btn" @click="docDialog = false">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div class="dialog__body" v-if="selectedDoc">
              <div class="info-grid info-grid--3">
                <div class="info-item"><label>Document No</label><p class="font-mono">{{ selectedDoc.doc_number || '—' }}</p></div>
                <div class="info-item"><label>Verified By</label><p>{{ selectedDoc.doc_verified_by || '—' }}</p></div>
                <div class="info-item"><label>Result</label><p><span :class="['pill pill--sm', selectedDoc.doc_verified_result ? 'pill--emerald' : 'pill--amber']">{{ selectedDoc.doc_verified_result ? 'Verified' : 'Pending' }}</span></p></div>
                <div class="info-item"><label>Remark</label><p>{{ selectedDoc.doc_verified_remark || '—' }}</p></div>
              </div>
              <p class="dialog__section-lbl">Document Images</p>
              <div class="doc-img-grid" v-if="selectedDoc.images?.length">
                <img v-for="img in selectedDoc.images" :key="img.id" :src="img.url" class="doc-img-thumb" @click="openPreview(img.url)" />
              </div>
              <div class="empty-state" v-else><p>No images uploaded for this document</p></div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="dialog">
        <div v-if="imgPreview" class="dialog-overlay" @click.self="imgPreview = false">
          <div class="dialog dialog--img">
            <div class="dialog__header">
              <p class="dialog__title">Image Preview</p>
              <button class="icon-close-btn" @click="imgPreview = false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="dialog__body dialog__body--img">
              <img :src="previewUrl" class="img-preview" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ░░ SNACKBAR ░░ -->
    <Transition name="snack">
      <div v-if="snackbar.show" :class="['snackbar', snackbar.color === 'success' ? 'snackbar--success' : 'snackbar--error']">
        {{ snackbar.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { useUsersApi } from "~/composables/apis/useUsersApi";

import { useVendorLinkedServiceApi } from '~/composables/apis/useVendorLinkedServiceApi'
import { useOnboadingApi } from '~/composables/apis/useOnboadingApi'

const { getLinkedServices, createLinkedService, updateLinkedService, deleteLinkedService } = useVendorLinkedServiceApi()
const { getServices } = useOnboadingApi()

// ── Linked Services state ─────────────────────────────────────────────
const linkedServices     = ref([])
const allServices        = ref([])   // from /services/List
const lsModal            = reactive({ open: false, mode: 'add' })
const lsSaving           = ref(false)

const defaultLsForm = () => ({
  id:          null,
  serviceId:   '',
  interfaceId: '',
  status:      false,
})
const lsForm = reactive(defaultLsForm())

const fetchLinkedServices = async () => {
  const res = await getLinkedServices(props.vendorId)
  linkedServices.value = res?.data ?? []
}

const openAddLs = () => {
  Object.assign(lsForm, defaultLsForm())
  lsModal.mode = 'add'
  lsModal.open = true
}

const openEditLs = (row) => {
  Object.assign(lsForm, {
    id:          row.id,
    serviceId:   row.serviceId,
    interfaceId: row.interfaceId,
    status:      row.status,
  })
  lsModal.mode = 'edit'
  lsModal.open = true
}

const closeLsModal = () => { lsModal.open = false }

const saveLs = async () => {
  if (!lsForm.serviceId || !lsForm.interfaceId) {
    showSnack('Service and Interface are required', 'error')
    return
  }
  lsSaving.value = true
  try {
    const payload = {
      serviceId:   lsForm.serviceId,
      interfaceId: lsForm.interfaceId,
      status:      lsForm.status,
    }
    const res = lsModal.mode === 'add'
      ? await createLinkedService(props.vendorId, payload)
      : await updateLinkedService(props.vendorId, lsForm.id, payload)

    const ok = res?.statusCode === '00'
    showSnack(ok ? res.message : (res?.message || 'Something went wrong'), ok ? 'success' : 'error')
    if (ok) { closeLsModal(); fetchLinkedServices() }
  } catch {
    showSnack('Failed to save', 'error')
  } finally {
    lsSaving.value = false
  }
}

const deleteLs = async (id) => {
  if (!confirm('Remove this linked service?')) return
  const res = await deleteLinkedService(props.vendorId, id)
  const ok  = res?.statusCode === '00'
  showSnack(ok ? 'Deleted' : (res?.message || 'Delete failed'), ok ? 'success' : 'error')
  if (ok) fetchLinkedServices()
}

// Fix fetchAllServices to extract the services array correctly
const fetchAllServices = async () => {
  const res = await getServices()
  // getServices returns res.data from axios, so res = { services: [...] }
  allServices.value = res?.services ?? []
}

// availableInterfaces is already correct — no change needed since
// the nested interfaces array is already on each service object
const availableInterfaces = computed(() => {
  if (!lsForm.serviceId) return []
  const svc = allServices.value.find(s => s.id === lsForm.serviceId)
  return svc?.interfaces ?? []
})

// Commission 
import { useVendorCommissionApi } from '~/composables/apis/useVendorCommissionApi'
const { createVendorCommission, updateVendorCommission, deleteVendorCommission } = useVendorCommissionApi()

const paymentMethods = ['UPI', 'CARD', 'NETBANKING', 'CASH', 'WALLET', 'AEPS', 'DMT', 'ALL']
const providers      = ['ISG', 'MOS', 'WORLD', 'BUCKSBOX', 'NSDL', 'FINO', 'CANARA']
const txnTypes       = ['CW', 'BE', 'MS', 'CD', 'DMT', 'PUS', 'PAYIN', 'NONE']

const commissionModal   = reactive({ open: false, mode: 'add' })
const commissionSaving  = ref(false)

const defaultCommissionForm = () => ({
  id:             null,
  paymentMethod:  '',
  provider:       '',
  txnType:        'NONE',
  minAmount:      0,
  maxAmount:      99999999,
  commissionRate: 0,
  rateType:       'PERCENTAGE',
  isDefault:      false,
})

const commissionForm = reactive(defaultCommissionForm())

// Computed: show matching aggregator slabs as a reference inside the modal
const aggregatorRateRef = computed(() => {
  const slabs = vendorForm.aggregator?.commissions || []
  return slabs.filter(s =>
    s.paymentMethod === commissionForm.paymentMethod &&
    s.provider      === commissionForm.provider
  )
})

const openAddCommission = () => {
  Object.assign(commissionForm, defaultCommissionForm())
  commissionModal.mode = 'add'
  commissionModal.open = true
}

const openEditCommission = (c) => {
  Object.assign(commissionForm, {
    id:             c.id,
    paymentMethod:  c.paymentMethod,
    provider:       c.provider,
    txnType:        c.txnType,
    minAmount:      c.minAmount,
    maxAmount:      c.maxAmount,
    commissionRate: c.commissionRate,
    rateType:       c.rateType,
    isDefault:      c.isDefault,
  })
  commissionModal.mode = 'edit'
  commissionModal.open = true
}

const closeCommissionModal = () => {
  commissionModal.open = false
}

const saveCommission = async () => {
  if (!commissionForm.paymentMethod || !commissionForm.provider) {
    showSnack('Payment Method and Provider are required', 'error')
    return
  }

  commissionSaving.value = true
  try {
    const payload = {
      paymentMethod:  commissionForm.paymentMethod,
      provider:       commissionForm.provider,
      txnType:        commissionForm.txnType,
      minAmount:      commissionForm.minAmount,
      maxAmount:      commissionForm.maxAmount,
      commissionRate: commissionForm.commissionRate,
      rateType:       commissionForm.rateType,
      isDefault:      commissionForm.isDefault,
    }

    let res
    if (commissionModal.mode === 'add') {
      res = await createVendorCommission(props.vendorId, payload)
    } else {
      res = await updateVendorCommission(props.vendorId, commissionForm.id, payload)
    }

    const ok = res?.statusCode === '00'
    showSnack(ok ? (res.message || 'Saved successfully') : (res?.message || 'Something went wrong'), ok ? 'success' : 'error')

    if (ok) {
      closeCommissionModal()
      setTimeout(() => getVendor(props.vendorId), 800)
    }
  } catch {
    showSnack('Failed to save commission slab', 'error')
  } finally {
    commissionSaving.value = false
  }
}

const deleteCommissionSlab = async (slabId) => {
  if (!confirm('Delete this commission slab?')) return
  try {
    const res = await deleteVendorCommission(props.vendorId, slabId)
    const ok  = res?.statusCode === '00'
    showSnack(ok ? 'Deleted successfully' : (res?.message || 'Delete failed'), ok ? 'success' : 'error')
    if (ok) setTimeout(() => getVendor(props.vendorId), 800)
  } catch {
    showSnack('Failed to delete', 'error')
  }
}

const props = defineProps({ vendorId: String });
const router = useRouter();
const { getVendorById, verifyOnboarding } = useAggregatorApi();
const { getAllTransactionsUnderVendor } = useUsersApi();

const vendorForm   = reactive({});
const transactions = ref({ data: [], pagination: {} });
const activeTab    = ref('info');
const saving       = ref(false);
const isFormChanged = ref(false);
const expandedMerchant  = ref(null);
const merchantSearch    = ref('');
const merchantFilter    = ref('ALL');
const merchantView      = ref('card');
const docDialog         = ref(false);
const selectedDoc       = ref(null);
const imgPreview        = ref(false);
const previewUrl        = ref(null);
const editMode = reactive({ contact: false, settlement: false, address: false });
const snackbar = reactive({ show: false, message: '', color: 'success' });

const tabs = computed(() => [
  { key: 'info',         label: 'Vendor Info',    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
  { key: 'linkedservices', label: 'Services and Interfaces', icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`, count: linkedServices.value.length },
  { key: 'commissions',  label: 'Commissions',    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  { key: 'merchants',    label: 'Merchants',      count: vendorForm.merchants?.length || 0, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
  { key: 'terminals',    label: 'Terminals',      count: vendorForm.terminals?.length || 0, icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>` },
  { key: 'documents',    label: 'Documents',      icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>` },
  { key: 'transactions', label: 'Transactions',   icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>` },
]);

const filteredMerchants = computed(() => {
  let list = vendorForm.merchants || [];
  if (merchantFilter.value !== 'ALL') list = list.filter(m => m.mstatus === merchantFilter.value);
  const q = merchantSearch.value.toLowerCase();
  if (q) list = list.filter(m =>
    (m.mid||'').toLowerCase().includes(q) ||
    (m.legal_name||'').toLowerCase().includes(q) ||
    (m.business_name||'').toLowerCase().includes(q)
  );
  return list;
});

const AVATAR_COLORS = ['#4f46e5','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#db2777'];
const avatarBg = (name) => AVATAR_COLORS[(name||'?').charCodeAt(0) % AVATAR_COLORS.length];

const formatDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return '—';
  return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`;
};

const statusBadgeClass = (s) => {
  if (!s) return 'mh-badge--pending';
  if (['VERIFIED','APPROVED','ACTIVE','APPROVAL'].includes(s)) return 'mh-badge--success';
  if (['REJECTED','FAILED'].includes(s)) return 'mh-badge--error';
  return 'mh-badge--pending';
};
const kycPillClass  = (s) => { if (s==='VERIFIED') return 'pill--emerald'; if (['REJECTED','SUSPENDED'].includes(s)) return 'pill--red'; if (['PROCESSING','UNDER_REVIEW'].includes(s)) return 'pill--sky'; return 'pill--amber'; };
const docStatusPill = (s) => { if (s==='VERIFIED') return 'pill--emerald'; if (s==='REJECTED') return 'pill--red'; if (s==='SUBMITTED') return 'pill--sky'; return 'pill--amber'; };
const txnPill       = (s) => { if (['PAID','SUCCESS'].includes(s)) return 'pill--emerald'; if (['FAILED','CANCELLED'].includes(s)) return 'pill--red'; return 'pill--amber'; };

const toggleEdit  = (section) => { editMode[section] = !editMode[section]; };
const toggleExpand = (id) => { expandedMerchant.value = expandedMerchant.value === id ? null : id; };
const openDoc     = (doc) => { selectedDoc.value = doc; docDialog.value = true; };
const openPreview = (url) => { previewUrl.value = url; imgPreview.value = true; };

const cancelEdit = () => {
  Object.keys(editMode).forEach(k => editMode[k] = false);
  isFormChanged.value = false;
  getVendor(props.vendorId);
};

const showSnack = (msg, color = 'success') => {
  snackbar.message = msg; snackbar.color = color; snackbar.show = true;
  setTimeout(() => snackbar.show = false, 3200);
};

const getVendor = async (id) => {
  try {
    const res = await getVendorById(id);
    Object.assign(vendorForm, res.data || {});
  } catch { showSnack('Failed to load vendor data', 'error'); }
};

const submitForm = async () => {
  saving.value = true;
  try {
    const payload = { name: vendorForm.name, email: vendorForm.email, mobile_no: vendorForm.mobile_no, lat: vendorForm.lat, long: vendorForm.long, settlementAccount: vendorForm.settlementAccount, address: vendorForm.address };
    const res = await verifyOnboarding(payload);
    if (res?.data?.statusCode === '00') { showSnack(res.data.message || 'Saved successfully'); cancelEdit(); }
    else showSnack(res?.data?.message || 'Failed to save', 'error');
  } catch { showSnack('Something went wrong', 'error'); }
  finally { saving.value = false; }
};

watch(editMode, () => { isFormChanged.value = Object.values(editMode).some(v => v); }, { deep: true });
watch(docDialog, v => { if (!v) selectedDoc.value = null; });
onMounted(() => {
  getVendor(props.vendorId);
  getAllTransactionsUnderVendor?.(props.vendorId,1,10).then(r => transactions.value = r).catch(()=>{});
  fetchLinkedServices()   // 👈 ADD
  fetchAllServices()      // 👈 ADD
});
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;}
.vendor-shell{min-height:100vh;background:#f1f5f9;font-family:'DM Sans','Manrope','Segoe UI',sans-serif;color:#0f172a;padding-bottom:56px;}

/* HEADER */
.mh-header{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #e2e8f0;padding:0 20px;box-shadow:0 1px 3px rgba(0,0,0,.06);}
.mh-header__inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0;}
.mh-header__brand{display:flex;align-items:center;gap:12px;min-width:0;flex-shrink:0;}
.mh-brand-text{min-width:0;text-align:right;}
.mh-logo{width:40px;height:40px;background:#0f172a;border-radius:10px;display:grid;place-items:center;color:#fff;flex-shrink:0;}
.mh-business-name{font-size:18px;font-weight:700;letter-spacing:-.3px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mh-meta{display:flex;align-items:center;gap:6px;margin-top:3px;flex-wrap:wrap;}
.mh-meta--right{justify-content:flex-end;}
.mh-mid{font-size:10px;font-family:'JetBrains Mono',monospace;color:#64748b;background:#f8fafc;padding:2px 7px;border-radius:4px;border:1px solid #e2e8f0;white-space:nowrap;}
.mh-badge{font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:20px;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;}
.mh-badge--pending{background:#fef3c7;color:#92400e;border:1px solid #fcd34d;}
.mh-badge--success{background:#dcfce7;color:#166534;border:1px solid #86efac;}
.mh-badge--error{background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;}
.mh-header__actions{display:flex;align-items:center;gap:8px;flex-shrink:0;flex:1;}
.btn-back{display:flex;align-items:center;gap:5px;padding:7px 13px;border:1px solid #e2e8f0;border-radius:8px;font-size:12.5px;font-weight:600;background:#fff;color:#475569;cursor:pointer;transition:all .15s;white-space:nowrap;font-family:inherit;}
.btn-back:hover{background:#f8fafc;border-color:#cbd5e1;color:#0f172a;}

/* STAT STRIP */
.stat-strip{max-width:1280px;margin:20px auto 0;padding:0 20px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:box-shadow .2s;}
.stat-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);}
.stat-card__icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;}
.stat-card__icon--blue{background:#dbeafe;color:#2563eb;}
.stat-card__icon--emerald{background:#d1fae5;color:#059669;}
.stat-card__icon--amber{background:#fef3c7;color:#d97706;}
.stat-card__icon--violet{background:#ede9fe;color:#7c3aed;}
.stat-card__body{min-width:0;flex:1;}
.stat-card__label{font-size:10.5px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px;}
.stat-card__value{font-size:18px;font-weight:700;color:#0f172a;line-height:1.2;}
.stat-card__value--emerald{color:#059669;}
.stat-card__value--amber{color:#d97706;}
.stat-card__sub{font-size:10.5px;color:#94a3b8;margin-top:3px;}

/* TAB NAV */
.tab-nav-wrap{max-width:1280px;margin:18px auto 0;padding:0 20px;}
.tab-nav{display:flex;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:4px;overflow-x:auto;scrollbar-width:none;}
.tab-nav::-webkit-scrollbar{display:none;}
.tab-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border:none;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;background:transparent;color:#64748b;transition:all .15s;flex-shrink:0;font-family:inherit;}
.tab-btn:hover{background:#f1f5f9;color:#0f172a;}
.tab-btn--active{background:#0f172a;color:#fff;box-shadow:0 2px 8px rgba(15,23,42,.2);}
.tab-btn__icon{display:flex;align-items:center;}
.tab-btn__count{font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:9px;background:#e2e8f0;color:#475569;}
.tab-btn--active .tab-btn__count{background:rgba(255,255,255,.2);color:#fff;}

/* CONTENT */
.mh-content{max-width:1280px;margin:18px auto 0;padding:0 20px;}
.tab-section{display:flex;flex-direction:column;gap:16px;}

/* CARD */
.card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.card__head{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #f1f5f9;background:#fafafa;}
.card__head-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.card__head-dot--indigo{background:#6366f1;}
.card__head-dot--sky{background:#0ea5e9;}
.card__head-dot--emerald{background:#10b981;}
.card__head-dot--amber{background:#f59e0b;}
.card__head-dot--rose{background:#f43f5e;}
.card__head-dot--violet{background:#8b5cf6;}
.card__title{font-size:13.5px;font-weight:700;color:#0f172a;}
.edit-toggle-btn{display:flex;align-items:center;gap:5px;padding:5px 11px;border:1px solid #e2e8f0;border-radius:7px;background:#f8fafc;font-size:11.5px;font-weight:600;color:#475569;cursor:pointer;transition:all .15s;font-family:inherit;}
.edit-toggle-btn:hover{background:#ede9fe;border-color:#8b5cf6;color:#5b21b6;}

/* INFO GRID */
.info-grid{display:grid;gap:0;}
.info-grid--4{grid-template-columns:repeat(4,1fr);}
.info-grid--3{grid-template-columns:repeat(3,1fr);}
.info-item{padding:14px 18px;border-right:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9;}
.info-grid--4 .info-item:nth-child(4n){border-right:none;}
.info-grid--3 .info-item:nth-child(3n){border-right:none;}
.info-item label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:4px;}
.info-item p{font-size:13px;font-weight:500;color:#0f172a;}

/* EDIT FORM */
.edit-form-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:16px 18px;}
.edit-form-grid--padded{padding:16px 18px;}
.edit-field{display:flex;flex-direction:column;gap:5px;}
.edit-field label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;}
.edit-field input{height:36px;padding:0 10px;border-radius:8px;border:1.5px solid #e2e8f0;background:#f8fafc;font-size:13px;color:#334155;outline:none;font-family:inherit;transition:border-color .15s;}
.edit-field input:focus{border-color:#6366f1;background:#fff;}

/* API KEY */
.api-key-bar{display:flex;align-items:center;gap:10px;padding:12px 18px;border-top:1px solid #f1f5f9;background:#fafafa;}
.api-key-bar__label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;flex-shrink:0;}

/* ADDRESS */
.addr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:16px 18px;}
.addr-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;}
.addr-card__hd{display:flex;align-items:center;gap:8px;padding:11px 14px;font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;}
.addr-card__hd--blue{background:#eff6ff;color:#1d4ed8;border-bottom:1px solid #dbeafe;}
.addr-card__hd--violet{background:#f5f3ff;color:#6d28d9;border-bottom:1px solid #ddd6fe;}
.addr-card__hd--emerald{background:#f0fdf4;color:#065f46;border-bottom:1px solid #bbf7d0;}
.addr-card__body{padding:14px;font-size:12.5px;color:#334155;line-height:1.7;}
.addr-city{color:#64748b;font-size:11.5px;margin-top:5px;font-weight:600;}
.addr-contact{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;font-size:11px;color:#64748b;}
.addr-link{color:#2563eb;text-decoration:none;font-weight:600;}
.addr-link:hover{text-decoration:underline;}

/* PILLS */
.pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
.pill--sm{font-size:9.5px;padding:1px 6px;}
.pill--indigo{background:#e0e7ff;color:#4338ca;}
.pill--emerald{background:#d1fae5;color:#065f46;}
.pill--amber{background:#fef3c7;color:#92400e;}
.pill--red{background:#fee2e2;color:#991b1b;}
.pill--sky{background:#e0f2fe;color:#0369a1;}
.pill--violet{background:#ede9fe;color:#5b21b6;}
.pill--slate{background:#f1f5f9;color:#64748b;}
.flag{font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:6px;}
.flag--on{background:#d1fae5;color:#065f46;}
.flag--off{background:#f1f5f9;color:#64748b;}
.rate-val{font-family:'JetBrains Mono',monospace;font-weight:700;color:#4f46e5;}

/* TABLE */
.table-scroll-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.data-table{width:100%;border-collapse:collapse;font-size:12.5px;min-width:480px;}
.data-table thead{background:#f8fafc;}
.data-table th{padding:10px 14px;text-align:left;font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;border-bottom:1px solid #f1f5f9;white-space:nowrap;}
.data-table td{padding:11px 14px;color:#334155;border-bottom:1px solid #f9fafb;}
.data-table tbody tr:last-child td{border-bottom:none;}
.data-table tbody tr:hover td{background:#f8fafc;}
.data-table--compact th,.data-table--compact td{padding:7px 10px;}

/* TOOLBAR */
.toolbar-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.search-box{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #e2e8f0;border-radius:9px;padding:0 10px;height:36px;flex:1;min-width:160px;transition:border-color .15s;}
.search-box:focus-within{border-color:#6366f1;}
.search-input{flex:1;border:none;background:transparent;font-size:13px;color:#334155;outline:none;font-family:inherit;}
.search-input::placeholder{color:#94a3b8;}
.filter-pills{display:flex;gap:5px;flex-wrap:wrap;}
.fpill{padding:5px 12px;border-radius:9999px;border:1.5px solid #e2e8f0;background:#fff;font-size:11px;font-weight:700;color:#64748b;font-family:inherit;cursor:pointer;transition:all .13s;}
.fpill:hover{border-color:#6366f1;color:#4f46e5;}
.fpill--active{background:#0f172a!important;border-color:#0f172a!important;color:#fff!important;}
.view-switcher{display:flex;border:1.5px solid #e2e8f0;border-radius:8px;overflow:hidden;}
.vs-btn{width:34px;height:34px;border:none;background:#fff;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:pointer;transition:all .13s;}
.vs-btn+.vs-btn{border-left:1.5px solid #e2e8f0;}
.vs-btn--active{background:#0f172a!important;color:#fff!important;}

/* MERCHANT CARDS */
.merchant-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px;}
.merchant-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.merchant-card__top{display:flex;align-items:center;gap:10px;padding:14px;transition:background .12s;}
.merchant-card__top:hover{background:#f8fafc;}
.mc-avatar{width:38px;height:38px;border-radius:10px;flex-shrink:0;display:grid;place-items:center;font-size:14px;font-weight:800;color:#fff;}
.mc-info{flex:1;min-width:0;}
.mc-name{font-size:13.5px;font-weight:700;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.mc-mid{color:#94a3b8;}
.mc-badges{display:flex;flex-direction:column;gap:4px;flex-shrink:0;}
.expand-caret{font-size:10px;color:#94a3b8;flex-shrink:0;}
.mc-meta-row{display:flex;align-items:center;gap:6px;padding:0 14px 10px;flex-wrap:wrap;border-bottom:1px solid #f1f5f9;}
.mc-mobile{font-size:11px;color:#64748b;}
.mc-methods{padding:10px 14px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.mc-methods__label{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#94a3b8;margin-right:2px;}
.mc-kyc-row{padding:8px 14px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.mc-expanded{background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px;}
.mc-exp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;}
.mc-exp-block{display:flex;flex-direction:column;gap:3px;}
.mc-exp-label{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;color:#94a3b8;margin-bottom:3px;}
.mc-exp-val{font-size:12px;color:#334155;line-height:1.5;}
.mc-exp-pan-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.mc-kyc-services{margin-top:14px;border-top:1px solid #e2e8f0;padding-top:12px;}
.kyc-svc-desktop{display:table;}
.kyc-svc-mobile{display:none;}
.kyc-mob-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;overflow:hidden;}
.kyc-mob-card__hd{display:flex;gap:6px;flex-wrap:wrap;padding:10px 12px;border-bottom:1px solid #f1f5f9;background:#fafafa;}
.kyc-mob-card__body{padding:10px 12px;display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.kyc-mob-row{display:flex;align-items:center;justify-content:space-between;gap:6px;}
.kyc-mob-row span:first-child{font-size:11px;color:#64748b;font-weight:500;}

/* TERMINALS */
.terminal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;}
.terminal-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04);}
.terminal-card__top{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid #f1f5f9;}
.tc-icon{width:36px;height:36px;border-radius:10px;background:#e0e7ff;color:#4338ca;display:grid;place-items:center;flex-shrink:0;}
.tc-tid{font-size:14px;font-weight:700;color:#0f172a;}
.tc-type{font-size:11px;color:#64748b;margin-top:2px;}
.tc-device{padding:12px 18px;border-top:1px solid #f1f5f9;}
.tc-device-label{font-size:9.5px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px;}
.tc-device-val{font-size:12px;color:#475569;}

/* DOCUMENTS */
.docs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}
.doc-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:transform .15s,box-shadow .15s;}
.doc-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.1);}
.doc-card__top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
.doc-icon{width:36px;height:36px;border-radius:10px;background:#e0e7ff;color:#4338ca;display:grid;place-items:center;}
.doc-name{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:3px;}
.doc-type{font-size:11px;color:#64748b;margin-bottom:3px;}
.doc-num{font-size:10.5px;color:#94a3b8;margin-bottom:8px;}
.doc-imgs-count{display:flex;align-items:center;gap:5px;font-size:11px;color:#94a3b8;}

/* EMPTY STATE */
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:36px;color:#94a3b8;text-align:center;}
.empty-state p{font-size:13px;font-weight:500;}

/* FOOTER */
.mh-footer{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e2e8f0;padding:0 20px;height:44px;display:flex;align-items:center;justify-content:space-between;z-index:40;}
.mh-footer__status{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:#64748b;}
.mh-footer__links{display:flex;gap:16px;}
.mh-footer__links a{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#94a3b8;text-decoration:none;}
.mh-footer__links a:hover{color:#475569;}
.pulse-dot{width:7px;height:7px;border-radius:50%;background:#10b981;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4);}50%{box-shadow:0 0 0 4px rgba(16,185,129,0);}}

/* SAVE BAR */
.save-bar{position:fixed;bottom:44px;left:0;right:0;z-index:99;background:#fff;border-top:1px solid #e2e8f0;box-shadow:0 -4px 20px rgba(0,0,0,.08);}
.save-bar__inner{display:flex;align-items:center;justify-content:space-between;padding:10px 20px;gap:12px;flex-wrap:wrap;}
.save-bar__msg{font-size:12.5px;font-weight:600;color:#475569;}
.save-bar__actions{display:flex;gap:8px;}
.btn-discard{padding:7px 14px;border-radius:8px;border:1px solid #e2e8f0;background:#f8fafc;font-size:12.5px;font-weight:700;color:#64748b;font-family:inherit;cursor:pointer;transition:all .13s;}
.btn-discard:hover{border-color:#ef4444;color:#ef4444;}
.btn-save{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:8px;background:#059669;color:#fff;border:none;font-size:12.5px;font-weight:700;font-family:inherit;cursor:pointer;box-shadow:0 4px 12px rgba(5,150,105,.25);transition:all .15s;}
.btn-save:hover{background:#047857;}
.btn-save:disabled{opacity:.55;cursor:not-allowed;}
@keyframes spin{to{transform:rotate(360deg);}}
.btn-spinner{width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
.save-bar-enter-active,.save-bar-leave-active{transition:transform .22s ease;}
.save-bar-enter-from,.save-bar-leave-to{transform:translateY(100%);}

/* DIALOG */
.dialog-overlay{position:fixed;inset:0;z-index:400;background:rgba(15,23,42,.45);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:20px;}
.dialog{background:#fff;border-radius:16px;width:100%;max-width:760px;box-shadow:0 24px 64px rgba(0,0,0,.2);overflow:hidden;max-height:90dvh;display:flex;flex-direction:column;}
.dialog--img{max-width:640px;}
.dialog__header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #f1f5f9;flex-shrink:0;}
.dialog__hdr-right{display:flex;align-items:center;gap:8px;}
.dialog__title{font-size:15px;font-weight:700;color:#0f172a;}
.dialog__sub{font-size:12px;color:#64748b;margin-top:2px;}
.dialog__body{padding:20px;overflow-y:auto;flex:1;}
.dialog__body--img{padding:8px;}
.dialog__section-lbl{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;margin:14px 0 8px;}
.icon-close-btn{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;cursor:pointer;color:#64748b;transition:all .15s;}
.icon-close-btn:hover{background:#f1f5f9;color:#0f172a;}
.doc-img-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.doc-img-thumb{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;cursor:pointer;transition:opacity .13s;}
.doc-img-thumb:hover{opacity:.82;}
.img-preview{width:100%;max-height:560px;object-fit:contain;border-radius:8px;}
.dialog-enter-active,.dialog-leave-active{transition:opacity .2s ease;}
.dialog-enter-from,.dialog-leave-to{opacity:0;}

/* SNACKBAR */
.snackbar{position:fixed;bottom:60px;right:16px;padding:11px 18px;border-radius:10px;font-size:12.5px;font-weight:600;z-index:500;box-shadow:0 4px 20px rgba(0,0,0,.15);}
.snackbar--success{background:#059669;color:#fff;}
.snackbar--error{background:#ef4444;color:#fff;}
.snack-enter-active,.snack-leave-active{transition:all .3s;}
.snack-enter-from,.snack-leave-to{opacity:0;transform:translateY(10px);}

/* UTILITIES */
.ml-auto{margin-left:auto;}
.font-mono{font-family:'JetBrains Mono','Fira Code',monospace;}
.font-bold{font-weight:700;}
.text-xs{font-size:11px;}
.text-slate-400{color:#94a3b8;}

/* ═══ TABLET ≤1024px ═══ */
@media(max-width:1024px){
  .stat-strip{grid-template-columns:repeat(2,1fr);}
  .info-grid--4{grid-template-columns:repeat(2,1fr);}
  .info-grid--4 .info-item:nth-child(4n){border-right:1px solid #f1f5f9;}
  .info-grid--4 .info-item:nth-child(2n){border-right:none;}
  .info-grid--3{grid-template-columns:repeat(2,1fr);}
  .info-grid--3 .info-item:nth-child(3n){border-right:1px solid #f1f5f9;}
  .info-grid--3 .info-item:nth-child(2n){border-right:none;}
  .addr-grid{grid-template-columns:repeat(2,1fr);}
  .edit-form-grid{grid-template-columns:repeat(2,1fr);}
}

/* ═══ MOBILE ≤640px ═══ */
@media(max-width:640px){
  /* Header compact */
  .mh-header{padding:0 14px;}
  .mh-header__inner{padding:10px 0;gap:8px;}
  .mh-logo{width:32px;height:32px;border-radius:8px;}
  .mh-logo svg{width:16px;height:16px;}
  .mh-business-name{font-size:14px;}
  .mh-mid{font-size:9px;padding:1px 5px;}
  .mh-badge{font-size:8.5px;padding:1px 5px;}
  .btn-back{padding:6px 9px;font-size:11.5px;}

  /* Stat strip 2x2 */
  .stat-strip{margin-top:12px;padding:0 14px;grid-template-columns:1fr 1fr;gap:10px;}
  .stat-card{padding:12px 11px;gap:9px;border-radius:12px;min-height:80px;}
  .stat-card__icon{width:32px;height:32px;border-radius:8px;}
  .stat-card__icon svg{width:14px;height:14px;}
  .stat-card__label{font-size:9px;}
  .stat-card__value{font-size:13.5px;}
  .stat-card__sub{display:none;}

  /* Tab nav → fixed bottom */
  .tab-nav-wrap{position:fixed;bottom:44px;left:0;right:0;z-index:45;margin:0;padding:0;background:#fff;border-top:1px solid #e2e8f0;border-bottom:none;box-shadow:0 -2px 10px rgba(0,0,0,.07);}
  .tab-nav{border-radius:0;border:none;padding:0;gap:0;background:transparent;justify-content:space-around;}
  .tab-btn{flex:1;flex-direction:column;align-items:center;justify-content:center;padding:8px 4px 6px;gap:3px;border-radius:0;min-width:0;}
  .tab-btn__icon svg{width:18px;height:18px;}
  .tab-btn__label{font-size:9px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:52px;}
  .tab-btn__count{display:none;}
  .tab-btn--active{background:transparent;color:#6366f1;box-shadow:none;}

  /* Push content up for bottom nav */
  .vendor-shell{padding-bottom:112px;}
  .mh-footer{display:none;}
  .save-bar{bottom:88px;}

  /* Content */
  .mh-content{padding:0 14px;margin-top:14px;}
  .tab-section{gap:12px;}
  .card{border-radius:12px;}
  .card__head{padding:12px 14px;}
  .card__title{font-size:12.5px;}

  /* Info grids → 2 col */
  .info-grid--4,.info-grid--3{grid-template-columns:1fr 1fr;}
  .info-grid--4 .info-item:nth-child(4n),.info-grid--3 .info-item:nth-child(3n){border-right:1px solid #f1f5f9;}
  .info-grid--4 .info-item:nth-child(2n),.info-grid--3 .info-item:nth-child(2n){border-right:none;}
  .info-item{padding:11px 13px;}
  .info-item label{font-size:9.5px;}
  .info-item p{font-size:12px;}
  .edit-form-grid{grid-template-columns:1fr 1fr;gap:10px;padding:12px 14px;}

  /* Address → 1 col */
  .addr-grid{grid-template-columns:1fr;gap:10px;padding:12px 14px;}

  /* Toolbar */
  .toolbar-row{gap:8px;}

  /* Merchant → 1 col */
  .merchant-grid{grid-template-columns:1fr;}

  /* KYC services: mobile cards */
  .kyc-svc-desktop{display:none;}
  .kyc-svc-mobile{display:block;}

  /* Terminals → 1 col */
  .terminal-grid{grid-template-columns:1fr;}

  /* Docs → 2 col */
  .docs-grid{grid-template-columns:1fr 1fr;gap:10px;}

  /* Dialog */
  .dialog-overlay{padding:10px;}
  .dialog{max-height:95dvh;border-radius:12px;}
  .doc-img-grid{grid-template-columns:repeat(2,1fr);}

  /* Snackbar full-width */
  .snackbar{right:14px;left:14px;text-align:center;bottom:100px;}
}

/* ═══ XS ≤400px ═══ */
@media(max-width:400px){
  .info-grid--4,.info-grid--3{grid-template-columns:1fr;}
  .info-grid--4 .info-item,.info-grid--3 .info-item{border-right:none;}
  .edit-form-grid{grid-template-columns:1fr;}
  .docs-grid{grid-template-columns:1fr;}
}

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,.5);
  backdrop-filter: blur(3px);
  z-index: 600;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}

.modal-box {
  background: #fff;
  border-radius: 18px;
  width: 100%; max-width: 580px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(15,23,42,.18);
  overflow: hidden;
}

.modal-box__header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa; flex-shrink: 0;
}

.modal-box__title { font-size: 15px; font-weight: 700; color: #0f172a; }

.modal-close {
  display: grid; place-items: center;
  width: 30px; height: 30px;
  border: 1px solid #e2e8f0; border-radius: 8px;
  background: #fff; cursor: pointer; color: #64748b;
  transition: all .15s;
}
.modal-close:hover { background: #f1f5f9; color: #0f172a; }

.modal-box__body { overflow-y: auto; padding: 20px; flex: 1; }

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.modal-field { display: flex; flex-direction: column; gap: 5px; }
.modal-field--full { grid-column: 1 / -1; }

.modal-field label {
  font-size: 10.5px; font-weight: 700;
  color: #64748b; text-transform: uppercase; letter-spacing: .5px;
}

.req { color: #ef4444; margin-left: 2px; }

.modal-field input,
.modal-field select {
  padding: 8px 11px;
  border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #0f172a;
  background: #fff; outline: none;
  transition: border-color .15s; width: 100%;
  font-family: inherit;
}

.modal-field input:focus,
.modal-field select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}

.modal-box__footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #f1f5f9;
  background: #fafafa; flex-shrink: 0;
}

.btn-cancel {
  padding: 8px 16px; border: 1px solid #e2e8f0;
  border-radius: 8px; font-size: 13px; font-weight: 600;
  background: #fff; color: #475569; cursor: pointer;
  transition: all .15s; font-family: inherit;
}
.btn-cancel:hover { background: #f1f5f9; }

.btn-primary {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600;
  background: #059669; color: #fff; cursor: pointer;
  box-shadow: 0 4px 12px rgba(5,150,105,.25);
  transition: all .15s; font-family: inherit;
}
.btn-primary:hover { background: #047857; transform: translateY(-1px); }
.btn-primary:disabled { opacity: .55; cursor: not-allowed; transform: none; }

/* Action buttons */
.action-btns { display: flex; align-items: center; gap: 6px; }

.icon-btn {
  display: grid; place-items: center;
  width: 28px; height: 28px;
  border-radius: 7px; border: 1px solid;
  cursor: pointer; transition: all .15s;
  background: transparent;
}

.icon-btn--edit   { border-color: #c7d2fe; color: #4f46e5; }
.icon-btn--edit:hover   { background: #eef2ff; }
.icon-btn--delete { border-color: #fecaca; color: #dc2626; }
.icon-btn--delete:hover { background: #fef2f2; }

/* Toggle */
.toggle-label {
  display: flex; align-items: center;
  justify-content: space-between;
  font-size: 13px; font-weight: 600; color: #475569;
}
.toggle-wrap { position: relative; }
.toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
.toggle-track {
  display: block; width: 40px; height: 22px;
  background: #cbd5e1; border-radius: 11px;
  cursor: pointer; transition: background .2s; position: relative;
}
.toggle-track::after {
  content: ''; position: absolute;
  top: 3px; left: 3px;
  width: 16px; height: 16px;
  border-radius: 50%; background: #fff;
  transition: transform .2s;
}
.toggle-input:checked + .toggle-track { background: #059669; }
.toggle-input:checked + .toggle-track::after { transform: translateX(18px); }

/* Rate hint box */
.rate-hint {
  margin-top: 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 10px;
  padding: 12px 14px;
}
.rate-hint__title {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700;
  color: #0369a1; text-transform: uppercase;
  letter-spacing: .5px; margin-bottom: 8px;
}
.rate-hint__rows { display: flex; flex-direction: column; gap: 6px; }
.rate-hint__row {
  display: flex; align-items: center;
  gap: 10px; flex-wrap: wrap;
}
.rate-hint__range { font-size: 11.5px; color: #475569; font-family: 'JetBrains Mono', monospace; }
.rate-hint__rate  { font-size: 12px; font-weight: 700; color: #0f172a; margin-left: auto; }
.rate-hint__none  { font-size: 12px; color: #94a3b8; }

/* Spinner */
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal transitions */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Mobile modal */
@media (max-width: 640px) {
  .modal-grid { grid-template-columns: 1fr; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-box { border-radius: 20px 20px 0 0; max-height: 92vh; }
}
</style>