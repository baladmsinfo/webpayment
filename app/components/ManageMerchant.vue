<template>
  <div class="merchant-shell">
 <!-- ░░ HEADER ░░ -->
<header class="mh-header">
  <div class="mh-header__inner">
    <div class="mh-header__brand">
          <div class="mh-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div>
            <h1 class="mh-business-name">{{ merchantForm.business_name || '—' }}</h1>
            <div class="mh-meta">
              <span class="mh-mid">MID: {{ merchantForm.mid }}</span>
              <span :class="['mh-badge', statusBadgeClass(merchantForm.mstatus)]">{{ merchantForm.mstatus }}</span>
              <span class="mh-badge mh-badge--interface">{{ merchantForm.interface }}</span>
            </div>
          </div>
        </div>
    <div class="mh-header__actions">
      <!-- Services Dropdown -->
      <div class="services-dropdown" ref="dropdownRef">
        <button class="btn-primary" @click="toggleDropdown">
          Services
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="services-menu">
            <div class="services-menu__header">
              <span class="services-menu__title">Services</span>
              <span class="services-menu__count">{{ kycServices.length }}</span>
            </div>
            <div v-if="kycServices.length === 0" class="services-menu__empty">
              No services available
            </div>
            <div v-for="svc in kycServices" :key="svc.id" class="services-menu__item">
              <div class="svc-menu-icon">{{ svc.service.slice(0, 2) }}</div>
              <div class="svc-menu-info">
                <p class="svc-menu-name">{{ svc.service }}</p>
                <p class="svc-menu-meta">
                  Risk: {{ svc.riskLevel }}
                  <span :class="['svc-menu-badge', svc.status === 'PENDING' ? 'svc-menu-badge--amber' : svc.status === 'ACTIVE' ? 'svc-menu-badge--green' : 'svc-menu-badge--red']">
                    {{ svc.status }}
                  </span>
                </p>
              </div>
              <button
                v-if="svc.status === 'PENDING'"
                class="svc-onboard-btn"
                @click="onboardService(svc)"
              >
                Onboard
              </button>
              <span v-else class="svc-done-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Onboarded
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</header>
    <!-- ░░ STAT STRIP ░░ -->
    <div class="stat-strip">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
        <div>
          <p class="stat-card__label">Wallet Balance</p>
          <p class="stat-card__value">₹ {{ Number(merchantForm.wallet?.balance || 0).toLocaleString('en-IN', {minimumFractionDigits:2}) }}</p>
          <p class="stat-card__sub">Available for settlement</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--amber">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
        </div>
        <div>
          <p class="stat-card__label">Settlement Status</p>
          <p class="stat-card__value stat-card__value--amber">Hold</p>
          <p class="stat-card__sub stat-card__sub--amber">Requires onboarding verification</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--emerald">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        </div>
        <div>
          <p class="stat-card__label">Global Risk Level</p>
          <p class="stat-card__value stat-card__value--emerald">{{ merchantForm.merchantKyc?.globalRiskLevel || 'LOW' }}</p>
          <p class="stat-card__sub">Score: {{ merchantForm.merchantKyc?.globalRiskScore ?? 0 }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--violet">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p class="stat-card__label">Lead Source</p>
          <p class="stat-card__value">{{ merchantForm.lead_source || '—' }}</p>
          <p class="stat-card__sub">Aggregator: {{ merchantForm.aggregator?.name || '—' }}</p>
        </div>
      </div>
    </div>

    <!-- ░░ TAB NAV ░░ -->
    <div class="tab-nav-wrap">
      <nav class="tab-nav">
        <button v-for="t in tabs" :key="t.key" :class="['tab-btn', activeTab === t.key && 'tab-btn--active']" @click="activeTab = t.key">
          <span class="tab-btn__icon" v-html="t.icon"></span>
          {{ t.label }}
        </button>
      </nav>
    </div>

    <!-- ░░ CONTENT ░░ -->
    <main class="mh-content">

      <!-- ════ TAB: MERCHANT INFO ════ -->
      <section v-show="activeTab === 'info'" class="tab-section">

        <!-- Business Registration -->
        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">Business Registration</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item">
              <label>Legal Name</label>
              <p>{{ merchantForm.legal_name || '—' }}</p>
            </div>
            <div class="info-item">
              <label>Business Name</label>
              <p>{{ merchantForm.business_name || '—' }}</p>
            </div>
            <div class="info-item">
              <label>DBA Name</label>
              <p>{{ merchantForm.dba_name || '—' }}</p>
            </div>
            <div class="info-item">
              <label>Business Type</label>
              <p><span class="pill pill--indigo">{{ merchantForm.business_type || '—' }}</span></p>
            </div>
            <div class="info-item">
              <label>MID</label>
              <p class="font-mono text-xs">{{ merchantForm.mid }}</p>
            </div>
            <div class="info-item">
              <label>Business ID</label>
              <p class="font-mono text-xs">{{ merchantForm.businessId }}</p>
            </div>
            <div class="info-item">
              <label>App ID</label>
              <p class="font-mono text-xs">{{ merchantForm.appid }}</p>
            </div>
            <div class="info-item">
              <label>Interface</label>
              <p>{{ merchantForm.interface }}</p>
            </div>
            <div class="info-item">
              <label>Mobile</label>
              <p>{{ merchantForm.mobile_no || '—' }}</p>
            </div>
            <div class="info-item">
              <label>Created At</label>
              <p>{{ formatDate(merchantForm.createdAt) }}</p>
            </div>
            <div class="info-item">
              <label>Verified At</label>
              <p>{{ formatDate(merchantForm.verifiedAt) || '—' }}</p>
            </div>
            <div class="info-item">
              <label>Status</label>
              <p><span :class="['pill', merchantForm.status ? 'pill--emerald' : 'pill--red']">{{ merchantForm.status ? 'Active' : 'Inactive' }}</span></p>
            </div>
          </div>
        </div>

        <!-- Merchant Info Details -->
        <div class="card" v-if="merchantForm.merchantinfo">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Merchant Info</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item">
              <label>Application ID</label>
              <p class="font-mono text-xs">{{ merchantForm.merchantinfo.application_id }}</p>
            </div>
            <div class="info-item">
              <label>Txn Ref No</label>
              <p class="font-mono text-xs">{{ merchantForm.merchantinfo.txn_ref_no }}</p>
            </div>
            <div class="info-item">
              <label>Primary Email</label>
              <p>{{ merchantForm.merchantinfo.primary_email_id }}</p>
            </div>
            <div class="info-item">
              <label>Primary Mobile</label>
              <p>{{ merchantForm.merchantinfo.primary_mobile }}</p>
            </div>
            <div class="info-item">
              <label>Beneficiary Email</label>
              <p>{{ merchantForm.merchantinfo.beneficiary_email }}</p>
            </div>
            <div class="info-item">
              <label>Beneficiary Mobile</label>
              <p>{{ merchantForm.merchantinfo.beneficiary_mobile }}</p>
            </div>
            <div class="info-item">
              <label>Date of Birth</label>
              <p>{{ formatDate(merchantForm.merchantinfo.dob) }}</p>
            </div>
            <div class="info-item">
              <label>Gender</label>
              <p>{{ merchantForm.merchantinfo.gender === 'M' ? 'Male' : merchantForm.merchantinfo.gender === 'F' ? 'Female' : merchantForm.merchantinfo.gender }}</p>
            </div>
            <div class="info-item">
              <label>Annual Turnover</label>
              <p>{{ merchantForm.merchantinfo.annual_turn_over || '—' }}</p>
            </div>
            <div class="info-item">
              <label>STD Code</label>
              <p>{{ merchantForm.merchantinfo.std_code || '—' }}</p>
            </div>
            <div class="info-item">
              <label>Nature of Business</label>
              <p>{{ merchantForm.merchantinfo.nature_of_business || '—' }}</p>
            </div>
            <div class="info-item">
              <label>Geo Coordinates</label>
              <p class="font-mono text-xs">{{ merchantForm.lat }}, {{ merchantForm.long }}</p>
            </div>
          </div>
        </div>

        <!-- Address Cards -->
        <div class="addr-grid">
          <div class="addr-card" v-if="merchantForm.address">
            <div class="addr-card__hd addr-card__hd--blue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Official Address
            </div>
            <div class="addr-card__body">
              <p>{{ merchantForm.address.official_address }}</p>
              <p>{{ merchantForm.address.address1 }}, {{ merchantForm.address.address2 }}</p>
              <p v-if="merchantForm.address.address3">{{ merchantForm.address.address3 }}</p>
              <p class="addr-city">{{ merchantForm.address.city }}, {{ merchantForm.address.state }} – {{ merchantForm.address.pincode }}</p>
              <div class="addr-contact">
                <span>📞 {{ merchantForm.address.mobile_number }}</span>
                <span v-if="merchantForm.address.phone">☎ {{ merchantForm.address.phone }}</span>
              </div>
            </div>
          </div>
          <div class="addr-card" v-if="merchantForm.address">
            <div class="addr-card__hd addr-card__hd--violet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              Residential Address
            </div>
            <div class="addr-card__body">
              <p>{{ merchantForm.address.residential_address }}</p>
              <p>{{ merchantForm.address.res_address1 }}, {{ merchantForm.address.res_address2 }}</p>
              <p v-if="merchantForm.address.res_address3">{{ merchantForm.address.res_address3 }}</p>
              <p class="addr-city">{{ merchantForm.address.res_city }}, {{ merchantForm.address.res_state }} – {{ merchantForm.address.res_pincode }}</p>
              <div class="addr-contact">
                <span>📞 {{ merchantForm.address.res_mobile }}</span>
              </div>
            </div>
          </div>
          <div class="addr-card" v-if="merchantForm.address">
            <div class="addr-card__hd addr-card__hd--emerald">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Visitor / Store
            </div>
            <div class="addr-card__body">
              <p>{{ merchantForm.address.vister_address }}</p>
              <p>{{ merchantForm.address.v_address1 }}, {{ merchantForm.address.v_address2 }}</p>
              <p v-if="merchantForm.address.v_address3">{{ merchantForm.address.v_address3 }}</p>
              <p class="addr-city">{{ merchantForm.address.v_city }}, {{ merchantForm.address.v_state }} – {{ merchantForm.address.v_pincode }}</p>
              <div class="addr-contact">
                <span>📞 {{ merchantForm.address.v_mobile }}</span>
                <a v-if="merchantForm.address.website" :href="merchantForm.address.website" class="addr-link" target="_blank">🌐 Website</a>
              </div>
            </div>
          </div>
        </div>

        <!-- User Account -->
        <div class="card" v-if="merchantForm.user">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--rose"></div>
            <h3 class="card__title">User Account</h3>
          </div>
          <div class="info-grid info-grid--3">
            <div class="info-item">
              <label>Name</label>
              <p>{{ merchantForm.user.name }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ merchantForm.user.email }}</p>
            </div>
            <div class="info-item">
              <label>Mobile</label>
              <p>{{ merchantForm.user.mobile_no }}</p>
            </div>
            <div class="info-item">
              <label>Role</label>
              <p><span class="pill pill--indigo">{{ merchantForm.user.role }}</span></p>
            </div>
            <div class="info-item">
              <label>Account Status</label>
              <p><span :class="['pill', merchantForm.user.status ? 'pill--emerald' : 'pill--red']">{{ merchantForm.user.status ? 'Active' : 'Inactive' }}</span></p>
            </div>
            <div class="info-item">
              <label>Email Verified</label>
              <p><span :class="['pill', merchantForm.user.email_verifited ? 'pill--emerald' : 'pill--amber']">{{ merchantForm.user.email_verifited ? 'Yes' : 'No' }}</span></p>
            </div>
            <div class="info-item">
              <label>Mobile Verified</label>
              <p><span :class="['pill', merchantForm.user.mobile_verifited ? 'pill--emerald' : 'pill--amber']">{{ merchantForm.user.mobile_verifited ? 'Yes' : 'No' }}</span></p>
            </div>
            <div class="info-item">
              <label>OTP Verified</label>
              <p><span :class="['pill', merchantForm.user.isotpVerified ? 'pill--emerald' : 'pill--amber']">{{ merchantForm.user.isotpVerified ? 'Yes' : 'No' }}</span></p>
            </div>
            <div class="info-item">
              <label>Joined</label>
              <p>{{ formatDate(merchantForm.user.createdAt) }}</p>
            </div>
          </div>
        </div>

      </section>

      <!-- ════ TAB: KYC & DOCUMENTS ════ -->
      <section v-show="activeTab === 'kyc'" class="tab-section">

        <!-- KYC Overview -->
        <div class="card" v-if="merchantForm.merchantKyc">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">KYC Status Overview</h3>
            <span :class="['ml-auto pill', statusPillClass(merchantForm.merchantKyc.globalStatus)]">{{ merchantForm.merchantKyc.globalStatus }}</span>
          </div>
          <div class="kyc-status-grid">
            <div v-for="item in kycStatusItems" :key="item.key" class="kyc-item">
              <div :class="['kyc-item__dot', statusDotClass(item.status)]"></div>
              <div>
                <p class="kyc-item__label">{{ item.label }}</p>
                <p :class="['kyc-item__status', statusTextClass(item.status)]">{{ item.status }}</p>
                <p class="kyc-item__date" v-if="item.date">Verified: {{ formatDate(item.date) }}</p>
                <p class="kyc-item__reason text-red-500 text-xs" v-if="item.reason">{{ item.reason }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Service KYC -->
        <div class="card" v-if="merchantForm.merchantservicekyc?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Service KYC</h3>
          </div>
          <div class="svc-kyc-list">
            <div v-for="svc in merchantForm.merchantservicekyc" :key="svc.id" class="svc-kyc-card">
              <div class="svc-kyc-card__top">
                <div class="svc-icon">{{ svc.service.slice(0,2) }}</div>
                <div>
                  <p class="svc-name">{{ svc.service }}</p>
                  <p class="svc-risk">Risk: <strong>{{ svc.riskLevel }}</strong> (Score: {{ svc.riskScore }})</p>
                </div>
                <span :class="['ml-auto pill', statusPillClass(svc.status)]">{{ svc.status }}</span>
              </div>
              <div class="svc-kyc-card__flags">
                <span :class="['flag', svc.biometricRequired ? 'flag--on' : 'flag--off']">Biometric: {{ svc.biometricRequired ? 'Required' : 'Not Required' }}</span>
                <span :class="['flag', svc.physicalVerificationRequired ? 'flag--on' : 'flag--off']">Physical Verify: {{ svc.physicalVerificationRequired ? 'Yes' : 'No' }}</span>
                <span :class="['flag', svc.geoTaggedShopPhoto ? 'flag--on' : 'flag--off']">Geo Tagged Photo: {{ svc.geoTaggedShopPhoto ? 'Yes' : 'No' }}</span>
                <span :class="['flag', svc.amlFlag ? 'flag--on' : 'flag--off']">AML Flag: {{ svc.amlFlag ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Required Documents -->
        <div class="card" v-if="merchantForm.businesstype">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--amber"></div>
            <h3 class="card__title">Required Documents</h3>
            <span class="ml-auto text-xs text-slate-400">Business Type: {{ merchantForm.businesstype.type }}</span>
          </div>
          <div class="doc-categories">
            <div v-for="cat in merchantForm.businesstype.categories" :key="cat.id" class="doc-category">
              <div class="doc-category__hd">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                {{ cat.categoryCode.category.replace(/_/g, ' ') }}
              </div>
              <div class="doc-list">
                <div v-for="doc in cat.categoryCode.businessDocs" :key="doc.id" class="doc-item">
                  <div class="doc-item__check">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <p class="doc-item__name">{{ doc.name }}</p>
                    <p class="doc-item__desc">{{ doc.description }}</p>
                  </div>
                  <span class="doc-item__badge">{{ doc.code }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PAN Details -->
        <div class="card" v-if="merchantForm.merchantpan?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--rose"></div>
            <h3 class="card__title">PAN Details</h3>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>PAN Number</th>
                <th>Name</th>
                <th>Entity PAN</th>
                <th>DOB</th>
                <th>Father Name</th>
                <th>Partner</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pan in merchantForm.merchantpan" :key="pan.id">
                <td class="font-mono">{{ pan.pan }}</td>
                <td>{{ pan.pan_name }}</td>
                <td class="font-mono">{{ pan.entity_pan }}</td>
                <td>{{ formatDate(pan.pan_dob) || '—' }}</td>
                <td>{{ pan.pan_father_name || '—' }}</td>
                <td><span :class="['pill', pan.partner ? 'pill--indigo' : 'pill--slate']">{{ pan.partner ? 'Yes' : 'No' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card" v-else>
          <div class="card__head"><div class="card__head-dot card__head-dot--rose"></div><h3 class="card__title">PAN Details</h3></div>
          <div class="empty-state">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            <p>No PAN details submitted yet</p>
          </div>
        </div>

      </section>

      <!-- ════ TAB: SETTLEMENT & BANKING ════ -->
      <section v-show="activeTab === 'settlement'" class="tab-section">

        <!-- Settlement Account -->
        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--emerald"></div>
            <h3 class="card__title">Settlement Account</h3>
          </div>
          <div v-if="merchantForm.settlementaccount">
            <div class="info-grid info-grid--3">
              <div class="info-item">
                <label>Account Holder</label>
                <p>{{ merchantForm.settlementaccount.account_holder_name }}</p>
              </div>
              <div class="info-item">
                <label>Account Type</label>
                <p>{{ merchantForm.settlementaccount.account_type }}</p>
              </div>
              <div class="info-item">
                <label>Bank Name</label>
                <p>{{ merchantForm.settlementaccount.bank_name }}</p>
              </div>
              <div class="info-item">
                <label>Account Number</label>
                <p class="font-mono">{{ merchantForm.settlementaccount.bank_account_no }}</p>
              </div>
              <div class="info-item">
                <label>IFSC Code</label>
                <p class="font-mono">{{ merchantForm.settlementaccount.bank_ifsc_code }}</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            <p>No settlement account linked yet</p>
          </div>
        </div>

        <!-- GST -->
        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">GST Information</h3>
          </div>
          <div v-if="merchantForm.merchantgst">
            <div class="info-grid info-grid--3">
              <div class="info-item"><label>GST Number</label><p class="font-mono">{{ merchantForm.merchantgst }}</p></div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No GST details submitted</p>
          </div>
        </div>

        <!-- Aggregator Commission -->
        <div class="card" v-if="merchantForm.aggregator">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--amber"></div>
            <h3 class="card__title">Aggregator: {{ merchantForm.aggregator.name }}</h3>
            <span class="ml-2 text-xs text-slate-400">Code: {{ merchantForm.aggregator.code }}</span>
          </div>
          <div class="info-grid info-grid--3 mb-6">
            <div class="info-item"><label>Email</label><p>{{ merchantForm.aggregator.email }}</p></div>
            <div class="info-item"><label>Mobile</label><p>{{ merchantForm.aggregator.mobile_no }}</p></div>
            <div class="info-item"><label>Default Rate</label><p>{{ merchantForm.aggregator.rate }}% ({{ merchantForm.aggregator.rateType }})</p></div>
          </div>
          <h4 class="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3 mt-2">Commission Rates</h4>
          <table class="data-table">
            <thead>
              <tr><th>Payment Method</th><th>Provider</th><th>Min Amount</th><th>Max Amount</th><th>Rate</th><th>Rate Type</th></tr>
            </thead>
            <tbody>
              <tr v-for="c in merchantForm.aggregator.commissions" :key="c.id">
                <td><span class="pill pill--indigo">{{ c.paymentMethod }}</span></td>
                <td>{{ c.provider }}</td>
                <td>₹ {{ Number(c.minAmount).toLocaleString('en-IN') }}</td>
                <td>₹ {{ Number(c.maxAmount).toLocaleString('en-IN') }}</td>
                <td class="font-bold">{{ c.rate }}%</td>
                <td>{{ c.rateType }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vendor Info -->
        <div class="card" v-if="merchantForm.vendor">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--violet"></div>
            <h3 class="card__title">Vendor: {{ merchantForm.vendor.name }}</h3>
            <span class="ml-2 text-xs text-slate-400">Code: {{ merchantForm.vendor.code }}</span>
          </div>
          <div class="info-grid info-grid--3 mb-6">
            <div class="info-item"><label>Email</label><p>{{ merchantForm.vendor.email }}</p></div>
            <div class="info-item"><label>Mobile</label><p>{{ merchantForm.vendor.mobile_no }}</p></div>
            <div class="info-item"><label>Status</label><p><span :class="['pill', merchantForm.vendor.status ? 'pill--emerald' : 'pill--red']">{{ merchantForm.vendor.status ? 'Active' : 'Inactive' }}</span></p></div>
          </div>
          <h4 class="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3 mt-2">Vendor Commission</h4>
          <table class="data-table">
            <thead>
              <tr><th>Payment Method</th><th>Provider</th><th>Rate</th><th>Rate Type</th></tr>
            </thead>
            <tbody>
              <tr v-for="c in merchantForm.vendor.commissions" :key="c.id">
                <td><span class="pill pill--sky">{{ c.paymentMethod }}</span></td>
                <td>{{ c.provider }}</td>
                <td class="font-bold">{{ c.commissionRate }}%</td>
                <td>{{ c.rateType }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </section>

      <!-- ════ TAB: WALLET LIMITS ════ -->
      <section v-show="activeTab === 'wallet'" class="tab-section">

        <!-- Wallet Overview -->
        <div class="card" v-if="merchantForm.wallet">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--emerald"></div>
            <h3 class="card__title">Wallet Overview</h3>
            <span :class="['ml-auto pill', merchantForm.wallet.status ? 'pill--emerald' : 'pill--red']">{{ merchantForm.wallet.status ? 'Active' : 'Inactive' }}</span>
          </div>
          <div class="info-grid info-grid--3">
            <div class="info-item"><label>Balance</label><p class="text-2xl font-bold text-slate-900">₹ {{ Number(merchantForm.wallet.balance).toLocaleString('en-IN', {minimumFractionDigits:2}) }}</p></div>
            <div class="info-item"><label>Wallet ID</label><p class="font-mono text-xs">{{ merchantForm.wallet.id }}</p></div>
            <div class="info-item"><label>Created</label><p>{{ formatDate(merchantForm.wallet.createdAt) }}</p></div>
          </div>
        </div>

        <!-- Limits Table -->
        <div class="card" v-if="merchantForm.wallet?.limits?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Transaction Limits</h3>
          </div>
          <div class="limits-channel-grid">
            <div v-for="channel in walletChannels" :key="channel" class="limits-channel">
              <div class="limits-channel__name">{{ channel }}</div>
              <div class="limits-rows">
                <div v-for="lim in limitsForChannel(channel)" :key="lim.id" class="limit-row">
                  <div class="limit-row__type">{{ lim.limitType }}</div>
                  <div class="limit-row__bar-wrap">
                    <div class="limit-row__bar">
                      <div class="limit-row__bar-fill" :style="{ width: barWidth(lim.maxAmount) + '%' }"></div>
                    </div>
                  </div>
                  <div class="limit-row__amount">₹ {{ formatAmount(lim.maxAmount) }}</div>
                  <span class="limit-row__period">{{ lim.periodSecs ? periodLabel(lim.periodSecs) : 'Per Txn' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="card" v-if="merchantForm.paymethods?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--violet"></div>
            <h3 class="card__title">Payment Methods</h3>
          </div>
          <div class="paymethod-list">
            <div v-for="pm in merchantForm.paymethods" :key="pm.paymentMethod" class="paymethod-item">
              <div class="paymethod-icon">{{ pm.paymentMethod.slice(0,1) }}</div>
              <div>
                <p class="paymethod-name">{{ pm.paymentMethod }}</p>
                <p class="paymethod-provider">Provider: {{ pm.provider }}</p>
              </div>
              <span :class="['ml-auto pill', pm.active ? 'pill--emerald' : 'pill--red']">{{ pm.active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>

      </section>

      <!-- ════ TAB: OUTLETS & TERMINALS ════ -->
      <section v-show="activeTab === 'outlets'" class="tab-section">

        <div class="card" v-if="merchantForm.outlets?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Outlets</h3>
            <span class="ml-auto text-xs text-slate-400">{{ merchantForm.outlets.length }} outlet(s)</span>
          </div>
          <div class="outlet-grid">
            <div v-for="outlet in merchantForm.outlets" :key="outlet.id" class="outlet-card">
              <div class="outlet-card__hd">
                <div class="outlet-icon">{{ outlet.code.slice(0,1) }}</div>
                <div>
                  <p class="outlet-name">{{ outlet.name }}</p>
                  <p class="outlet-id font-mono text-xs">{{ outlet.outletId }}</p>
                </div>
                <span :class="['ml-auto pill', outlet.status ? 'pill--emerald' : 'pill--red']">{{ outlet.status ? 'Active' : 'Inactive' }}</span>
              </div>
              <div class="outlet-meta">
                <span>📍 {{ outlet.latitude }}, {{ outlet.longitude }}</span>
                <span>Created: {{ formatDate(outlet.createdAt) }}</span>
              </div>
              <div class="outlet-users" v-if="outlet.users?.length">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Users</p>
                <div v-for="u in outlet.users" :key="u.id" class="outlet-user">
                  <div class="outlet-user__avatar">{{ u.name.charAt(0) }}</div>
                  <div>
                    <p class="outlet-user__name">{{ u.name }}</p>
                    <p class="outlet-user__email">{{ u.email }}</p>
                  </div>
                  <span :class="['ml-auto pill text-xs', u.status ? 'pill--emerald' : 'pill--red']">{{ u.role }}</span>
                </div>
              </div>
              <div class="outlet-terminals" v-if="outlet.terminals?.length">
                <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-3 mb-2">Terminals</p>
                <div v-for="t in outlet.terminals" :key="t.id" class="terminal-item">{{ t.terminalId }}</div>
              </div>
              <div v-else class="text-xs text-slate-400 mt-3">No terminals assigned</div>
            </div>
          </div>
        </div>

        <!-- MCC Info -->
        <div class="card" v-if="merchantForm.mcc">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--amber"></div>
            <h3 class="card__title">MCC Classification</h3>
          </div>
          <div class="info-grid info-grid--3">
            <div class="info-item"><label>MCC Code</label><p class="font-mono font-bold text-lg">{{ merchantForm.mcc.id }}</p></div>
            <div class="info-item"><label>Description</label><p>{{ merchantForm.mcc.descr }}</p></div>
            <div class="info-item"><label>Status</label><p><span :class="['pill', merchantForm.mcc.status ? 'pill--emerald' : 'pill--red']">{{ merchantForm.mcc.status ? 'Active' : 'Inactive' }}</span></p></div>
          </div>
        </div>

      </section>

    </main>

    <!-- ░░ FOOTER ░░ -->
    <footer class="mh-footer">
      <div class="mh-footer__status">
        <div class="pulse-dot"></div>
        <span>Live System Status: Optimal</span>
      </div>
      <div class="mh-footer__links">
        <a href="#">Support Docs</a>
        <a href="#">Compliance Policy</a>
        <a href="#">API Reference</a>
      </div>
    </footer>

    <!-- Snackbar -->
    <Transition name="snack">
      <div v-if="snackbar.show" :class="['snackbar', snackbar.color === 'success' ? 'snackbar--success' : 'snackbar--error']">
        {{ snackbar.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useOnboadingApi } from "~/composables/apis/useOnboadingApi";
import { useUsersApi } from "~/composables/apis/useUsersApi";

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const handleOutsideClick = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
};

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});

const kycServices = computed(() => {
  return merchantForm.merchantKyc?.services || [];
});

const onboardService = async (svc) => {
  dropdownOpen.value = false;
  try {
    console.log("Service Type", svc);
    
    if (svc.service === "AEPS") {
        router.push(`/vendor/onboarding/aeps/${props.merchantId}`);
    } else {
        
    }
    snackbar.message = `${svc.service} onboarding initiated`;
    snackbar.color = "success";
    snackbar.show = true;
    setTimeout(() => { snackbar.show = false; }, 3000);
  } catch (e) {
    snackbar.message = `Failed to onboard ${svc.service}`;
    snackbar.color = "error";
    snackbar.show = true;
    setTimeout(() => { snackbar.show = false; }, 3000);
  }
};

const props = defineProps({ merchantId: String });
const router = useRouter();
const { getMerchantById } = useOnboadingApi();
const { getTransactionsByMerchantId } = useUsersApi();

const merchantForm = reactive({});
const transactions = ref({ data: [], pagination: {} });
const transactionPage = ref(1);
const transactionLimit = ref(10);
const isFormChanged = ref(false);
const activeTab = ref("info");

const snackbar = reactive({ show: false, message: "", color: "success" });

const tabs = [
  {
    key: "info", label: "Merchant Info",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    key: "kyc", label: "KYC & Documents",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`
  },
  {
    key: "settlement", label: "Settlement & Banking",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`
  },
  {
    key: "wallet", label: "Wallet & Limits",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>`
  },
  {
    key: "outlets", label: "Outlets & Terminals",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
];

// KYC status items from merchantKyc object
const kycStatusItems = computed(() => {
  const k = merchantForm.merchantKyc;
  if (!k) return [];
  return [
    { key: "pan", label: "PAN Verification", status: k.panStatus, date: k.panVerifiedAt, reason: k.panRejectionReason },
    { key: "aadhaar", label: "Aadhaar Verification", status: k.aadhaarStatus, date: k.aadhaarVerifiedAt, reason: k.aadhaarRejectionReason },
    { key: "bank", label: "Bank Verification", status: k.bankStatus, date: k.bankVerifiedAt, reason: k.bankRejectionReason },
    { key: "gst", label: "GST Verification", status: k.gstStatus, date: k.gstVerifiedAt, reason: k.gstRejectionReason },
    { key: "storeImg", label: "Store Image", status: k.storeImgStatus, date: k.storeImgVerifiedAt, reason: k.storeImgRejectionReason },
    { key: "global", label: "Global KYC", status: k.globalStatus, date: k.globalVerifiedAt, reason: k.globalRejectionReason },
  ];
});

const walletChannels = computed(() => {
  if (!merchantForm.wallet?.limits) return [];
  return [...new Set(merchantForm.wallet.limits.map((l) => l.channel))];
});

// Utility functions
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const formatAmount = (val) => {
  const n = Number(val);
  if (n >= 10000000) return (n / 10000000).toFixed(0) + " Cr";
  if (n >= 100000) return (n / 100000).toFixed(0) + " L";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toLocaleString("en-IN");
};

const periodLabel = (secs) => {
  if (secs === 86400) return "Daily";
  if (secs === 2592000) return "Monthly";
  return secs + "s";
};

const limitsForChannel = (channel) =>
  merchantForm.wallet?.limits?.filter((l) => l.channel === channel) || [];

const maxLimitVal = computed(() => {
  if (!merchantForm.wallet?.limits) return 1;
  return Math.max(...merchantForm.wallet.limits.map((l) => Number(l.maxAmount)));
});

const barWidth = (val) => Math.round((Number(val) / maxLimitVal.value) * 100);

const statusBadgeClass = (status) => {
  if (!status) return "mh-badge--pending";
  if (["VERIFIED", "APPROVED", "ACTIVE"].includes(status)) return "mh-badge--success";
  if (["REJECTED", "FAILED"].includes(status)) return "mh-badge--error";
  return "mh-badge--pending";
};

const statusPillClass = (status) => {
  if (!status) return "pill--amber";
  if (["VERIFIED", "APPROVED", "ACTIVE", "SUCCESS"].includes(status)) return "pill--emerald";
  if (["REJECTED", "FAILED"].includes(status)) return "pill--red";
  return "pill--amber";
};

const statusDotClass = (status) => {
  if (["VERIFIED", "APPROVED", "ACTIVE"].includes(status)) return "kyc-item__dot--green";
  if (["REJECTED", "FAILED"].includes(status)) return "kyc-item__dot--red";
  return "kyc-item__dot--amber";
};

const statusTextClass = (status) => {
  if (["VERIFIED", "APPROVED", "ACTIVE"].includes(status)) return "text-emerald-600";
  if (["REJECTED", "FAILED"].includes(status)) return "text-red-500";
  return "text-amber-600";
};

const getMerchant = async (id) => {
  try {
    const res = await getMerchantById(id);
    Object.assign(merchantForm, res.data || {});
  } catch (e) {
    console.error("Failed to fetch merchant:", e);
  }
};

const getTransactions = async (merchantId, page = 1, limit = 10) => {
  try {
    const res = await getTransactionsByMerchantId(merchantId, page, limit);
    transactions.value = res;
  } catch (e) {
    console.error("Failed to fetch transactions:", e);
  }
};

// const submitForm = async () => {
//   try {
//     const payload = {
//       legal_name: merchantForm.merchantinfo?.legal_name,
//       dba_name: merchantForm.merchantinfo?.dba_name,
//       dob: merchantForm.merchantinfo?.dob ? new Date(merchantForm.merchantinfo.dob).toISOString().split("T")[0] : null,
//       primary_email_id: merchantForm.merchantinfo?.primary_email_id,
//       primary_mobile: merchantForm.merchantinfo?.primary_mobile,
//       beneficiary_email: merchantForm.merchantinfo?.beneficiary_email,
//       beneficiary_mobile: merchantForm.merchantinfo?.beneficiary_mobile,
//       lat: merchantForm.lat,
//       long: merchantForm.long,
//       mcc: merchantForm.mcc?.id,
//       nature_of_business: merchantForm.merchantinfo?.nature_of_business,
//       annual_turn_over: merchantForm.merchantinfo?.annual_turn_over,
//       business_type: merchantForm.business_type,
//       std_code: merchantForm.merchantinfo?.std_code,
//       lead_source: merchantForm.lead_source,
//       lg_code: merchantForm.lg_code,
//       website: merchantForm.address?.website,
//       pan: {
//         pan: merchantForm.merchantpan?.[0]?.pan,
//         name: merchantForm.merchantpan?.[0]?.pan_name,
//         fathername: merchantForm.merchantpan?.[0]?.pan_father_name,
//         dob: merchantForm.merchantpan?.[0]?.pan_dob ? new Date(merchantForm.merchantpan[0].pan_dob).toISOString().split("T")[0] : null,
//       },
//       account: {
//         accountNumber: merchantForm.settlementaccount?.bank_account_no,
//         accountHolderName: merchantForm.settlementaccount?.account_holder_name,
//         ifsc: merchantForm.settlementaccount?.bank_ifsc_code,
//         bankName: merchantForm.settlementaccount?.bank_name,
//         branchName: merchantForm.settlementaccount?.branch_name,
//         additionalData: true,
//         consent: "Y",
//       },
//       official_address: merchantForm.address?.official_address,
//       address1: merchantForm.address?.address1,
//       address2: merchantForm.address?.address2,
//       address3: merchantForm.address?.address3,
//       phone: merchantForm.address?.phone,
//       city: merchantForm.address?.city,
//       state: merchantForm.address?.state,
//       pincode: merchantForm.address?.pincode ? String(merchantForm.address.pincode) : "",
//       residential_address: merchantForm.address?.residential_address,
//       res_address1: merchantForm.address?.res_address1,
//       res_address2: merchantForm.address?.res_address2,
//       res_address3: merchantForm.address?.res_address3,
//       res_mobile: merchantForm.address?.res_mobile,
//       res_phone_number: merchantForm.address?.res_phone_number,
//       res_city: merchantForm.address?.res_city,
//       res_state: merchantForm.address?.res_state,
//       res_pincode: merchantForm.address?.res_pincode ? String(merchantForm.address.res_pincode) : "",
//       vister_address: merchantForm.address?.vister_address,
//       v_address1: merchantForm.address?.v_address1,
//       v_address2: merchantForm.address?.v_address2,
//       v_address3: merchantForm.address?.v_address3,
//       v_mobile: merchantForm.address?.v_mobile,
//       v_phone_number: merchantForm.address?.v_phone_number,
//       v_city: merchantForm.address?.v_city,
//       v_state: merchantForm.address?.v_state,
//       v_pincode: merchantForm.address?.v_pincode ? String(merchantForm.address.v_pincode) : "",
//       merchantId: props.merchantId,
//     };
//     const res = await verifyOnboarding(payload);
//     if (res.data.statusCode === "00") {
//       snackbar.message = res.data.message;
//       snackbar.color = "success";
//       snackbar.show = true;
//       setTimeout(() => { snackbar.show = false; router.push("/aggregator/merchants/onboarded"); }, 2000);
//     } else {
//       snackbar.message = res.data.message;
//       snackbar.color = "error";
//       snackbar.show = true;
//       setTimeout(() => { snackbar.show = false; }, 3000);
//     }
//   } catch (e) {
//     console.error(e);
//     snackbar.message = "Something went wrong";
//     snackbar.color = "error";
//     snackbar.show = true;
//     setTimeout(() => { snackbar.show = false; }, 3000);
//   }
// };

onMounted(() => {
  getMerchant(props.merchantId);
  getTransactions(props.merchantId);
  document.addEventListener("mousedown", handleOutsideClick);
});
</script>

<style scoped>
/* ── Reset & Shell ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; }

.merchant-shell {
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'DM Sans', 'Manrope', 'Segoe UI', sans-serif;
  color: #0f172a;
  padding-bottom: 56px;
}

/* ── Header ── */
.mh-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.mh-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  flex-wrap: wrap;
}
.mh-header__brand { display: flex; align-items: center; gap: 14px; }
.mh-logo {
  width: 44px; height: 44px;
  background: #0f172a;
  border-radius: 12px;
  display: grid; place-items: center;
  color: #fff;
  flex-shrink: 0;
}
.mh-business-name { font-size: 20px; font-weight: 700; letter-spacing: -0.4px; color: #0f172a; }
.mh-meta { display: flex; align-items: center; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
.mh-mid { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #64748b; background: #f8fafc; padding: 2px 8px; border-radius: 4px; border: 1px solid #e2e8f0; }
.mh-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: .5px; }
.mh-badge--pending { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
.mh-badge--success { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
.mh-badge--error   { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
.mh-badge--interface { background: #ede9fe; color: #5b21b6; border: 1px solid #c4b5fd; }
.mh-header__actions { display: flex; gap: 10px; }

.btn-primary {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px;
  border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600;
  background: #059669;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(5,150,105,.25);
  transition: all .15s;
}
.btn-primary:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(5,150,105,.3); }

/* ── Stat Strip ── */
.stat-strip {
  max-width: 1280px;
  margin: 24px auto 0;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.stat-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
  transition: box-shadow .2s;
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }
.stat-card__icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: grid; place-items: center;
  flex-shrink: 0;
}
.stat-card__icon--blue   { background: #dbeafe; color: #2563eb; }
.stat-card__icon--amber  { background: #fef3c7; color: #d97706; }
.stat-card__icon--emerald{ background: #d1fae5; color: #059669; }
.stat-card__icon--violet { background: #ede9fe; color: #7c3aed; }
.stat-card__label { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.stat-card__value { font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.1; }
.stat-card__value--amber  { color: #d97706; }
.stat-card__value--emerald{ color: #059669; }
.stat-card__sub  { font-size: 11px; color: #94a3b8; margin-top: 4px; }
.stat-card__sub--amber { color: #d97706; }

/* ── Tab Nav ── */
.tab-nav-wrap {
  max-width: 1280px;
  margin: 24px auto 0;
  padding: 0 24px;
}
.tab-nav {
  display: flex;
  gap: 2px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}
.tab-nav::-webkit-scrollbar { display: none; }
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 16px;
  border: none; border-radius: 9px;
  font-size: 12.5px; font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  background: transparent;
  color: #64748b;
  transition: all .15s;
}
.tab-btn:hover { background: #f1f5f9; color: #0f172a; }
.tab-btn--active { background: #0f172a; color: #fff; box-shadow: 0 2px 8px rgba(15,23,42,.2); }
.tab-btn__icon { display: flex; align-items: center; }

/* ── Content ── */
.mh-content {
  max-width: 1280px;
  margin: 20px auto 0;
  padding: 0 24px;
}
.tab-section { display: flex; flex-direction: column; gap: 20px; }

/* ── Card ── */
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.card__head {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}
.card__head-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.card__head-dot--indigo { background: #6366f1; }
.card__head-dot--sky    { background: #0ea5e9; }
.card__head-dot--emerald{ background: #10b981; }
.card__head-dot--amber  { background: #f59e0b; }
.card__head-dot--rose   { background: #f43f5e; }
.card__head-dot--violet { background: #8b5cf6; }
.card__title { font-size: 14px; font-weight: 700; color: #0f172a; }

/* ── Info Grid ── */
.info-grid { display: grid; gap: 0; padding: 0; }
.info-grid--3 { grid-template-columns: repeat(3, 1fr); }
.info-grid--4 { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 900px) {
  .info-grid--4 { grid-template-columns: repeat(2, 1fr); }
  .info-grid--3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .info-grid--4, .info-grid--3 { grid-template-columns: 1fr; }
}
.info-item {
  padding: 16px 20px;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
.info-item:nth-child(4n) { border-right: none; }
.info-grid--3 .info-item:nth-child(3n) { border-right: none; }
.info-item label { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .7px; display: block; margin-bottom: 5px; }
.info-item p { font-size: 13.5px; font-weight: 500; color: #0f172a; }

.font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

/* ── Pills ── */
.pill {
  display: inline-block; padding: 2px 9px; border-radius: 20px;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px;
}
.pill--indigo  { background: #e0e7ff; color: #4338ca; }
.pill--emerald { background: #d1fae5; color: #065f46; }
.pill--amber   { background: #fef3c7; color: #92400e; }
.pill--red     { background: #fee2e2; color: #991b1b; }
.pill--sky     { background: #e0f2fe; color: #0369a1; }
.pill--violet  { background: #ede9fe; color: #5b21b6; }
.pill--slate   { background: #f1f5f9; color: #64748b; }
.ml-auto { margin-left: auto; }

/* ── Address Grid ── */
.addr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 900px) { .addr-grid { grid-template-columns: 1fr; } }
.addr-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
.addr-card__hd {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .7px;
}
.addr-card__hd--blue   { background: #eff6ff; color: #1d4ed8; border-bottom: 1px solid #dbeafe; }
.addr-card__hd--violet { background: #f5f3ff; color: #6d28d9; border-bottom: 1px solid #ddd6fe; }
.addr-card__hd--emerald{ background: #f0fdf4; color: #065f46; border-bottom: 1px solid #bbf7d0; }
.addr-card__body { padding: 16px; font-size: 13px; color: #334155; line-height: 1.7; }
.addr-city { color: #64748b; font-size: 12px; margin-top: 6px; font-weight: 600; }
.addr-contact { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; font-size: 11.5px; color: #64748b; }
.addr-link { color: #2563eb; text-decoration: none; font-weight: 600; }
.addr-link:hover { text-decoration: underline; }

/* ── KYC Items ── */
.kyc-status-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
@media (max-width: 900px) { .kyc-status-grid { grid-template-columns: repeat(2, 1fr); } }
.kyc-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 18px 20px;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
.kyc-item__dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 3px; flex-shrink: 0; }
.kyc-item__dot--green { background: #10b981; box-shadow: 0 0 0 3px #d1fae5; }
.kyc-item__dot--amber { background: #f59e0b; box-shadow: 0 0 0 3px #fef3c7; }
.kyc-item__dot--red   { background: #ef4444; box-shadow: 0 0 0 3px #fee2e2; }
.kyc-item__label  { font-size: 12px; font-weight: 600; color: #475569; }
.kyc-item__status { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
.kyc-item__date   { font-size: 10.5px; color: #94a3b8; margin-top: 3px; }

/* ── Service KYC ── */
.svc-kyc-list { display: flex; flex-direction: column; gap: 0; }
.svc-kyc-card { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.svc-kyc-card:last-child { border-bottom: none; }
.svc-kyc-card__top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.svc-icon { width: 36px; height: 36px; border-radius: 10px; background: #0f172a; color: #fff; display: grid; place-items: center; font-size: 11px; font-weight: 800; }
.svc-name { font-size: 14px; font-weight: 700; color: #0f172a; }
.svc-risk { font-size: 11.5px; color: #64748b; margin-top: 2px; }
.svc-kyc-card__flags { display: flex; flex-wrap: wrap; gap: 8px; }
.flag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px; }
.flag--on  { background: #d1fae5; color: #065f46; }
.flag--off { background: #f1f5f9; color: #64748b; }

/* ── Doc Categories ── */
.doc-categories { display: flex; flex-direction: column; gap: 0; }
.doc-category { border-bottom: 1px solid #f1f5f9; padding: 16px 20px; }
.doc-category:last-child { border-bottom: none; }
.doc-category__hd { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .6px; color: #475569; margin-bottom: 12px; }
.doc-list { display: flex; flex-direction: column; gap: 8px; }
.doc-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
.doc-item__check { width: 20px; height: 20px; border-radius: 6px; background: #d1fae5; color: #059669; display: grid; place-items: center; flex-shrink: 0; }
.doc-item__name { font-size: 13px; font-weight: 600; color: #0f172a; }
.doc-item__desc { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }
.doc-item__badge { margin-left: auto; font-size: 9px; font-weight: 700; background: #e0e7ff; color: #4338ca; padding: 2px 7px; border-radius: 4px; white-space: nowrap; align-self: flex-start; }

/* ── Tables ── */
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table thead { background: #f8fafc; }
.data-table th { padding: 10px 16px; text-align: left; font-size: 10.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; border-bottom: 1px solid #f1f5f9; }
.data-table td { padding: 12px 16px; color: #334155; border-bottom: 1px solid #f9fafb; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #f8fafc; }

/* ── Limits ── */
.limits-channel-grid { display: flex; flex-direction: column; gap: 0; }
.limits-channel { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.limits-channel:last-child { border-bottom: none; }
.limits-channel__name { font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.limits-channel__name::before { content: ''; width: 3px; height: 14px; background: #6366f1; border-radius: 2px; display: block; }
.limits-rows { display: flex; flex-direction: column; gap: 8px; }
.limit-row { display: grid; grid-template-columns: 80px 1fr 100px 70px; align-items: center; gap: 12px; }
.limit-row__type { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .5px; }
.limit-row__bar-wrap { }
.limit-row__bar { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.limit-row__bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #818cf8); border-radius: 3px; transition: width .4s ease; }
.limit-row__amount { font-size: 13px; font-weight: 700; color: #0f172a; text-align: right; }
.limit-row__period { font-size: 10.5px; font-weight: 600; color: #94a3b8; background: #f1f5f9; padding: 2px 7px; border-radius: 4px; text-align: center; }

/* ── Payment Methods ── */
.paymethod-list { padding: 4px 0; }
.paymethod-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid #f9fafb; }
.paymethod-item:last-child { border-bottom: none; }
.paymethod-icon { width: 40px; height: 40px; border-radius: 12px; background: #0f172a; color: #fff; display: grid; place-items: center; font-size: 14px; font-weight: 800; flex-shrink: 0; }
.paymethod-name { font-size: 14px; font-weight: 700; color: #0f172a; }
.paymethod-provider { font-size: 12px; color: #94a3b8; margin-top: 2px; }

/* ── Outlets ── */
.outlet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 0; }
.outlet-card { padding: 20px; border-right: 1px solid #f1f5f9; }
.outlet-card:last-child { border-right: none; }
.outlet-card__hd { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.outlet-icon { width: 40px; height: 40px; border-radius: 12px; background: #0f172a; color: #fff; display: grid; place-items: center; font-size: 14px; font-weight: 800; flex-shrink: 0; }
.outlet-name { font-size: 15px; font-weight: 700; color: #0f172a; }
.outlet-id { color: #94a3b8; }
.outlet-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 11.5px; color: #64748b; margin-bottom: 14px; }
.outlet-users { background: #f8fafc; border-radius: 10px; padding: 12px; }
.outlet-user { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.outlet-user:last-child { border-bottom: none; }
.outlet-user__avatar { width: 30px; height: 30px; border-radius: 8px; background: #e0e7ff; color: #4338ca; display: grid; place-items: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
.outlet-user__name  { font-size: 13px; font-weight: 600; color: #0f172a; }
.outlet-user__email { font-size: 11.5px; color: #94a3b8; }

/* ── Empty State ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 40px; color: #94a3b8; text-align: center; }
.empty-state p { font-size: 13px; font-weight: 500; }

/* ── Footer ── */
.mh-footer {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  padding: 0 24px;
  height: 44px;
  display: flex; align-items: center; justify-content: space-between;
  z-index: 40;
}
.mh-footer__status { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; color: #64748b; }
.mh-footer__links { display: flex; gap: 20px; }
.mh-footer__links a { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: #94a3b8; text-decoration: none; }
.mh-footer__links a:hover { color: #475569; }
.pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,.4); }
  50%      { box-shadow: 0 0 0 4px rgba(16,185,129,0); }
}

/* ── Snackbar ── */
.snackbar {
  position: fixed; bottom: 60px; right: 24px;
  padding: 12px 20px; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0,0,0,.15);
}
.snackbar--success { background: #059669; color: #fff; }
.snackbar--error   { background: #ef4444; color: #fff; }
.snack-enter-active, .snack-leave-active { transition: all .3s; }
.snack-enter-from, .snack-leave-to { opacity: 0; transform: translateY(10px); }

/* ── Text utilities ── */
.text-emerald-600 { color: #059669; }
.text-red-500     { color: #ef4444; }
.text-amber-600   { color: #d97706; }
.text-xs { font-size: 11px; }
.font-bold { font-weight: 700; }
.mb-6 { margin-bottom: 24px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mb-3 { margin-bottom: 12px; }
.mb-2 { margin-bottom: 8px; }

/* ── Services Dropdown ── */
.services-dropdown {
  position: relative;
}

.services-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 300px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(15, 23, 42, .14);
  z-index: 200;
  overflow: hidden;
}

.services-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.services-menu__title {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .7px;
  color: #64748b;
}

.services-menu__count {
  font-size: 10px;
  font-weight: 700;
  background: #e0e7ff;
  color: #4338ca;
  padding: 2px 7px;
  border-radius: 10px;
}

.services-menu__empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}

.services-menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f9fafb;
  transition: background .12s;
}

.services-menu__item:last-child { border-bottom: none; }
.services-menu__item:hover { background: #f8fafc; }

.svc-menu-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 800;
  flex-shrink: 0;
}

.svc-menu-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.svc-menu-meta {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.svc-menu-badge {
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  text-transform: uppercase;
}
.svc-menu-badge--amber { background: #fef3c7; color: #92400e; }
.svc-menu-badge--green { background: #d1fae5; color: #065f46; }
.svc-menu-badge--red   { background: #fee2e2; color: #991b1b; }

.svc-onboard-btn {
  margin-left: auto;
  flex-shrink: 0;
  padding: 5px 12px;
  background: #059669;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
}
.svc-onboard-btn:hover { background: #047857; }

.svc-done-badge {
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #059669;
}

/* ── Dropdown animation ── */
.dropdown-enter-active, .dropdown-leave-active {
  transition: opacity .15s, transform .15s;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>