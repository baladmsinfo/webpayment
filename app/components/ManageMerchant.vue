<template>
  <div class="merchant-shell">
    <!-- ░░ HEADER ░░ -->
    <header class="mh-header">
      <div class="mh-header__inner">

        <div class="mh-header__actions">
          <button class="btn-back" @click="router.back()">
            <!-- <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg> -->
            <span class="btn-back__label">Back</span>
          </button>
        </div>

        <div class="mh-header__brand">
          <div class="mh-brand-text">
            <h1 class="mh-business-name">{{ merchantForm.business_name || '—' }}</h1>
            <div class="mh-meta mh-meta--right">
              <span class="mh-mid">MID: {{ merchantForm.mid }}</span>
              <span :class="['mh-badge', statusBadgeClass(merchantForm.mstatus)]">{{ merchantForm.mstatus }}</span>
            </div>
          </div>
          <div class="mh-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        </div>

      </div>
    </header>

    <!-- ░░ STAT STRIP ░░ -->
    <div class="stat-strip">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Wallet Balance</p>
          <p class="stat-card__value">₹ {{ Number(merchantForm.wallet?.balance || 0).toLocaleString('en-IN',
            { minimumFractionDigits: 2 }) }}</p>
          <p class="stat-card__sub">Available for settlement</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--amber">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
            <path d="M13 5v2" />
            <path d="M13 17v2" />
            <path d="M13 11v2" />
          </svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Settlement Status</p>
          <p class="stat-card__value stat-card__value--amber">Hold</p>
          <p class="stat-card__sub stat-card__sub--amber">Requires onboarding verification</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--emerald">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          </svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Global Risk Level</p>
          <p class="stat-card__value stat-card__value--emerald">{{ merchantForm.merchantKyc?.globalRiskLevel || 'LOW' }}
          </p>
          <p class="stat-card__sub">Score: {{ merchantForm.merchantKyc?.globalRiskScore ?? 0 }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--violet">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Lead Source</p>
          <p class="stat-card__value">{{ merchantForm.lead_source || '—' }}</p>
          <p class="stat-card__sub">Aggregator: {{ merchantForm.aggregator?.name || '—' }}</p>
        </div>
      </div>
    </div>

    <!-- ░░ TAB NAV ░░ -->
    <div class="tab-nav-wrap">
      <nav class="tab-nav">
        <button v-for="t in tabs" :key="t.key" :class="['tab-btn', activeTab === t.key && 'tab-btn--active']"
          @click="activeTab = t.key">
          <span class="tab-btn__icon" v-html="t.icon"></span>
          <span class="tab-btn__label">{{ t.label }}</span>
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
              <p><span :class="['pill', merchantForm.status ? 'pill--emerald' : 'pill--red']">{{ merchantForm.status ?
                'Active' : 'Inactive' }}</span></p>
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
              <p>{{ merchantForm.merchantinfo.gender === 'M' ? 'Male' : merchantForm.merchantinfo.gender === 'F' ?
                'Female' : merchantForm.merchantinfo.gender }}</p>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Official Address
            </div>
            <div class="addr-card__body">
              <p>{{ merchantForm.address.official_address }}</p>
              <p>{{ merchantForm.address.address1 }}, {{ merchantForm.address.address2 }}</p>
              <p v-if="merchantForm.address.address3">{{ merchantForm.address.address3 }}</p>
              <p class="addr-city">{{ merchantForm.address.city }}, {{ merchantForm.address.state }} – {{
                merchantForm.address.pincode }}</p>
              <div class="addr-contact">
                <span>📞 {{ merchantForm.address.mobile_number }}</span>
                <span v-if="merchantForm.address.phone">☎ {{ merchantForm.address.phone }}</span>
              </div>
            </div>
          </div>
          <div class="addr-card" v-if="merchantForm.address">
            <div class="addr-card__hd addr-card__hd--violet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Residential Address
            </div>
            <div class="addr-card__body">
              <p>{{ merchantForm.address.residential_address }}</p>
              <p>{{ merchantForm.address.res_address1 }}, {{ merchantForm.address.res_address2 }}</p>
              <p v-if="merchantForm.address.res_address3">{{ merchantForm.address.res_address3 }}</p>
              <p class="addr-city">{{ merchantForm.address.res_city }}, {{ merchantForm.address.res_state }} – {{
                merchantForm.address.res_pincode }}</p>
              <div class="addr-contact">
                <span>📞 {{ merchantForm.address.res_mobile }}</span>
              </div>
            </div>
          </div>
          <div class="addr-card" v-if="merchantForm.address">
            <div class="addr-card__hd addr-card__hd--emerald">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Visitor / Store
            </div>
            <div class="addr-card__body">
              <p>{{ merchantForm.address.vister_address }}</p>
              <p>{{ merchantForm.address.v_address1 }}, {{ merchantForm.address.v_address2 }}</p>
              <p v-if="merchantForm.address.v_address3">{{ merchantForm.address.v_address3 }}</p>
              <p class="addr-city">{{ merchantForm.address.v_city }}, {{ merchantForm.address.v_state }} – {{
                merchantForm.address.v_pincode }}</p>
              <div class="addr-contact">
                <span>📞 {{ merchantForm.address.v_mobile }}</span>
                <a v-if="merchantForm.address.website" :href="merchantForm.address.website" class="addr-link"
                  target="_blank">🌐 Website</a>
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
              <p><span :class="['pill', merchantForm.user.status ? 'pill--emerald' : 'pill--red']">{{
                merchantForm.user.status ? 'Active' : 'Inactive' }}</span></p>
            </div>
            <div class="info-item">
              <label>Email Verified</label>
              <p><span :class="['pill', merchantForm.user.email_verifited ? 'pill--emerald' : 'pill--amber']">{{
                merchantForm.user.email_verifited ? 'Yes' : 'No' }}</span></p>
            </div>
            <div class="info-item">
              <label>Mobile Verified</label>
              <p><span :class="['pill', merchantForm.user.mobile_verifited ? 'pill--emerald' : 'pill--amber']">{{
                merchantForm.user.mobile_verifited ? 'Yes' : 'No' }}</span></p>
            </div>
            <div class="info-item">
              <label>OTP Verified</label>
              <p><span :class="['pill', merchantForm.user.isotpVerified ? 'pill--emerald' : 'pill--amber']">{{
                merchantForm.user.isotpVerified ? 'Yes' : 'No' }}</span></p>
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

        <div class="kyc-actions-row">
          <!-- Desktop: Services Dropdown (hidden on mobile) -->
          <div class="services-dropdown services-dropdown--desktop" ref="dropdownRef">
            <button class="btn-primary" @click="toggleDropdown">
              Services
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"
                :style="{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <Transition name="dropdown">
              <div v-if="dropdownOpen" class="services-menu">

                <!-- STEP 1: Pick a Service -->
                <template v-if="!selectedService">
                  <div class="services-menu__header">
                    <span class="services-menu__title">Select Service</span>
                    <span class="services-menu__count">{{ servicesOptions.length }}</span>
                  </div>
                  <div v-if="servicesOptions.length === 0" class="services-menu__empty">
                    No services available
                  </div>
                  <div v-for="svc in servicesOptions" :key="svc.id"
                    class="services-menu__item services-menu__item--selectable" @click="selectService(svc)">
                    <div class="svc-menu-icon">{{ svc.service.slice(0, 2) }}</div>
                    <div class="svc-menu-info">
                      <p class="svc-menu-name">{{ svc.service }}</p>
                      <p class="svc-menu-meta">{{ svc.interfaces.length }} interface(s)</p>
                    </div>
                    <svg class="svc-menu-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </template>

                <!-- STEP 2: Pick an Interface -->
                <template v-else>
                  <div class="services-menu__header">
                    <button class="svc-back-btn" @click="selectedService = null">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <span class="services-menu__title">
                      <span class="svc-menu-badge svc-menu-badge--amber" style="font-size:10px;">
                        {{ selectedService.service }}
                      </span>
                      → Interface
                    </span>
                    <span class="services-menu__count">{{ selectedService.interfaces.length }}</span>
                  </div>

                  <div v-if="selectedService.interfaces.length === 0" class="services-menu__empty">
                    No interfaces available
                  </div>
                  <div v-for="intf in selectedService.interfaces" :key="intf.id"
                    class="services-menu__item services-menu__item--selectable" @click="confirmOnboard(intf)">
                    <div class="svc-menu-icon">{{ intf.interface.slice(0, 2) }}</div>
                    <div class="svc-menu-info">
                      <p class="svc-menu-name">{{ intf.interface }}</p>
                    </div>
                    <svg class="svc-menu-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </template>

              </div>
            </Transition>
          </div>

          <!-- Mobile: Services Button (opens drawer) -->
          <button class="btn-primary services-btn--mobile" @click="mobileDrawerOpen = true">
            Services
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        <!-- KYC Overview -->
        <div class="card" v-if="merchantForm.merchantKyc">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">KYC Status Overview</h3>
            <span :class="['ml-auto pill', statusPillClass(merchantForm.merchantKyc.globalStatus)]">{{
              merchantForm.merchantKyc.globalStatus }}</span>
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

          <!-- Global KYC Summary -->
          <div v-if="merchantForm.merchantservicekyc[0]?.merchantKyc" class="global-kyc-banner">
            <div class="global-kyc-banner__inner">
              <div class="global-kyc-banner__item">
                <span class="global-kyc-banner__label">Global Status</span>
                <span :class="['pill', statusPillClass(merchantForm.merchantservicekyc[0].merchantKyc.globalStatus)]">
                  {{ merchantForm.merchantservicekyc[0].merchantKyc.globalStatus }}
                </span>
              </div>
              <div class="global-kyc-banner__item">
                <span class="global-kyc-banner__label">Risk Level</span>
                <span :class="['pill', riskPillClass(merchantForm.merchantservicekyc[0].merchantKyc.globalRiskLevel)]">
                  {{ merchantForm.merchantservicekyc[0].merchantKyc.globalRiskLevel }}
                  ({{ merchantForm.merchantservicekyc[0].merchantKyc.globalRiskScore }})
                </span>
              </div>
              <div class="global-kyc-banner__item">
                <span class="global-kyc-banner__label">AML Flag</span>
                <span
                  :class="['flag', merchantForm.merchantservicekyc[0].merchantKyc.amlFlag ? 'flag--on' : 'flag--off']">
                  {{ merchantForm.merchantservicekyc[0].merchantKyc.amlFlag ? 'Yes' : 'No' }}
                </span>
              </div>
              <div class="global-kyc-banner__item">
                <span class="global-kyc-banner__label">Sanction Match</span>
                <span
                  :class="['flag', merchantForm.merchantservicekyc[0].merchantKyc.sanctionMatch ? 'flag--on' : 'flag--off']">
                  {{ merchantForm.merchantservicekyc[0].merchantKyc.sanctionMatch ? 'Yes' : 'No' }}
                </span>
              </div>
              <div class="global-kyc-banner__item"
                v-if="merchantForm.merchantservicekyc[0].merchantKyc.globalVerifiedAt">
                <span class="global-kyc-banner__label">Verified At</span>
                <span class="global-kyc-banner__value">{{
                  formatDate(merchantForm.merchantservicekyc[0].merchantKyc.globalVerifiedAt) }}</span>
              </div>
              <div class="global-kyc-banner__item" v-if="merchantForm.merchantservicekyc[0].merchantKyc.remarks">
                <span class="global-kyc-banner__label">Remarks</span>
                <span class="global-kyc-banner__value">{{ merchantForm.merchantservicekyc[0].merchantKyc.remarks
                }}</span>
              </div>
            </div>
          </div>

          <div class="svc-kyc-list">
            <div class="card" v-if="merchantForm.merchantservicekyc?.length">
              <div class="svc-kyc-list">
                <div v-for="svc in merchantForm.merchantservicekyc" :key="svc.id" class="svc-kyc-card">

                  <!-- Card Header -->
                  <div class="svc-kyc-card__top" @click="toggleSvcExpand(svc.id)" style="cursor:pointer;">
                    <div class="svc-icon">{{ svc.service.slice(0, 2) }}</div>
                    <div class="svc-info">
                      <p class="svc-name">{{ svc.service }}</p>
                      <p class="svc-interface"><strong>{{ svc.interface }}</strong></p>
                      <p class="svc-risk">Risk: <strong>{{ svc.riskLevel }}</strong> (Score: {{ svc.riskScore }})</p>
                    </div>

                    <div class="svc-kyc-card__action ml-auto" @click.stop>
                      <span v-if="svc.status === 'VERIFIED'" class="svc-verified-chip">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Onboarded
                      </span>

                      <div v-else class="svc-inline-onboard">
                        <span class="mr-5" :class="['ml-auto pill', statusPillClass(svc.status)]">{{ svc.status
                        }}</span>

                        <button class="svc-onboard-btn" @click="onboardService(svc.service, svc.interface, { pan_status: svc.panStatus, otp_status: svc.otpStatus, aadhaar_status: svc.aadhaarStatus, bank_status: svc.bankStatus, gst_status: svc.gstStatus, store_img_status: svc.storeImgStatus })">
                          Onboard
                        </button>
                      </div>
                    </div>

                    <span class="svc-expand-icon">{{ expandedSvc[svc.id] ? '▲' : '▼' }}</span>
                  </div>

                  <!-- Expandable -->
                  <div v-if="expandedSvc[svc.id]" class="svc-kyc-card__expanded">
                    <div class="svc-kyc-card__flags">
                      <span :class="['flag', svc.biometricRequired ? 'flag--on' : 'flag--off']">
                        Biometric: {{ svc.biometricRequired ? 'Required' : 'Not Required' }}
                      </span>
                      <span :class="['flag', svc.physicalVerificationRequired ? 'flag--on' : 'flag--off']">
                        Physical Verify: {{ svc.physicalVerificationRequired ? 'Yes' : 'No' }}
                      </span>
                      <span :class="['flag', svc.geoTaggedShopPhoto ? 'flag--on' : 'flag--off']">
                        Geo Tagged Photo: {{ svc.geoTaggedShopPhoto ? 'Yes' : 'No' }}
                      </span>
                      <span :class="['flag', svc.amlFlag ? 'flag--on' : 'flag--off']">
                        AML Flag: {{ svc.amlFlag ? 'Yes' : 'No' }}
                      </span>
                      <span :class="['flag', svc.sanctionMatch ? 'flag--on' : 'flag--off']">
                        Sanction Match: {{ svc.sanctionMatch ? 'Yes' : 'No' }}
                      </span>
                    </div>

                    <div class="svc-doc-verifications">
                      <p class="svc-doc-verifications__title">Document Verifications</p>

                      <!-- Desktop table -->
                      <table class="doc-verify-table doc-verify-table--desktop">
                        <thead>
                          <tr>
                            <th>Document</th>
                            <th>Status</th>
                            <th>Verified At</th>
                            <th>Rejection Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="doc-verify-table__name">PAN</td>
                            <td><span :class="['pill pill--sm', statusPillClass(svc.panStatus)]">{{ svc.panStatus }}</span></td>
                            <td>{{ svc.panVerifiedAt ? formatDate(svc.panVerifiedAt) : '—' }}</td>
                            <td>{{ svc.panRejectionReason || '—' }}</td>
                          </tr>
                          <tr>
                            <td class="doc-verify-table__name">Aadhaar</td>
                            <td><span :class="['pill pill--sm', statusPillClass(svc.aadhaarStatus)]">{{ svc.aadhaarStatus }}</span></td>
                            <td>{{ svc.aadhaarVerifiedAt ? formatDate(svc.aadhaarVerifiedAt) : '—' }}</td>
                            <td>{{ svc.aadhaarRejectionReason || '—' }}</td>
                          </tr>
                          <tr>
                            <td class="doc-verify-table__name">Bank</td>
                            <td><span :class="['pill pill--sm', statusPillClass(svc.bankStatus)]">{{ svc.bankStatus }}</span></td>
                            <td>{{ svc.bankVerifiedAt ? formatDate(svc.bankVerifiedAt) : '—' }}</td>
                            <td>{{ svc.bankRejectionReason || '—' }}</td>
                          </tr>
                          <tr>
                            <td class="doc-verify-table__name">GST</td>
                            <td><span :class="['pill pill--sm', statusPillClass(svc.gstStatus)]">{{ svc.gstStatus }}</span></td>
                            <td>{{ svc.gstVerifiedAt ? formatDate(svc.gstVerifiedAt) : '—' }}</td>
                            <td>{{ svc.gstRejectionReason || '—' }}</td>
                          </tr>
                          <tr>
                            <td class="doc-verify-table__name">Store Image</td>
                            <td><span :class="['pill pill--sm', statusPillClass(svc.storeImgStatus)]">{{ svc.storeImgStatus }}</span></td>
                            <td>{{ svc.storeImgVerifiedAt ? formatDate(svc.storeImgVerifiedAt) : '—' }}</td>
                            <td>{{ svc.storeImgRejectionReason || '—' }}</td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- Mobile doc cards -->
                      <div class="doc-verify-cards doc-verify-cards--mobile">
                        <div class="doc-verify-card" v-for="doc in [
                          { name: 'PAN', status: svc.panStatus, verifiedAt: svc.panVerifiedAt, reason: svc.panRejectionReason },
                          { name: 'Aadhaar', status: svc.aadhaarStatus, verifiedAt: svc.aadhaarVerifiedAt, reason: svc.aadhaarRejectionReason },
                          { name: 'Bank', status: svc.bankStatus, verifiedAt: svc.bankVerifiedAt, reason: svc.bankRejectionReason },
                          { name: 'GST', status: svc.gstStatus, verifiedAt: svc.gstVerifiedAt, reason: svc.gstRejectionReason },
                          { name: 'Store Image', status: svc.storeImgStatus, verifiedAt: svc.storeImgVerifiedAt, reason: svc.storeImgRejectionReason },
                        ]" :key="doc.name">
                          <div class="doc-verify-card__row">
                            <span class="doc-verify-card__name">{{ doc.name }}</span>
                            <span :class="['pill pill--sm', statusPillClass(doc.status)]">{{ doc.status }}</span>
                          </div>
                          <div class="doc-verify-card__meta" v-if="doc.verifiedAt || doc.reason">
                            <span v-if="doc.verifiedAt" class="doc-verify-card__date">✓ {{ formatDate(doc.verifiedAt) }}</span>
                            <span v-if="doc.reason" class="doc-verify-card__reason">{{ doc.reason }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- ════ TAB: SETTLEMENT & BANKING ════ -->
      <section v-show="activeTab === 'settlement'" class="tab-section">
        <!-- PAN Details -->
        <div class="card" v-if="merchantForm.merchantpan?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--rose"></div>
            <h3 class="card__title">PAN Details</h3>
          </div>
          <div class="table-scroll-wrap">
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
                  <td><span :class="['pill', pan.partner ? 'pill--indigo' : 'pill--slate']">{{ pan.partner ? 'Yes' : 'No'
                  }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card" v-else>
          <div class="card__head">
            <div class="card__head-dot card__head-dot--rose"></div>
            <h3 class="card__title">PAN Details</h3>
          </div>
          <div class="empty-state">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            <p>No PAN details submitted yet</p>
          </div>
        </div>

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
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
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
              <div class="info-item"><label>GST Number</label>
                <p class="font-mono">{{ merchantForm.merchantgst }}</p>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No GST details submitted</p>
          </div>
        </div>

      </section>

      <!-- ════ TAB: COMMISSION ════ -->
      <section v-show="activeTab === 'commission'" class="tab-section">

        <!-- Aggregator Commission -->
        <div class="card" v-if="merchantForm.aggregator">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--amber"></div>
            <h3 class="card__title">Aggregator: {{ merchantForm.aggregator.name }}</h3>
            <span class="ml-2 text-xs text-slate-400">Code: {{ merchantForm.aggregator.code }}</span>
          </div>
          <div class="info-grid info-grid--3 mb-6">
            <div class="info-item"><label>Email</label>
              <p>{{ merchantForm.aggregator.email }}</p>
            </div>
            <div class="info-item"><label>Mobile</label>
              <p>{{ merchantForm.aggregator.mobile_no }}</p>
            </div>
            <div class="info-item"><label>Default Rate</label>
              <p>{{ merchantForm.aggregator.rate }}% ({{ merchantForm.aggregator.rateType }})</p>
            </div>
          </div>
          <h4 class="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3 mt-2">Commission Rates</h4>
          <div class="table-scroll-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Provider</th>
                  <th>Min Amount</th>
                  <th>Max Amount</th>
                  <th>Rate</th>
                  <th>Rate Type</th>
                </tr>
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
        </div>

        <!-- Vendor Info -->
        <div class="card" v-if="merchantForm.vendor">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--violet"></div>
            <h3 class="card__title">Vendor: {{ merchantForm.vendor.name }}</h3>
            <span class="ml-2 text-xs text-slate-400">Code: {{ merchantForm.vendor.code }}</span>
          </div>
          <div class="info-grid info-grid--3 mb-6">
            <div class="info-item"><label>Email</label>
              <p>{{ merchantForm.vendor.email }}</p>
            </div>
            <div class="info-item"><label>Mobile</label>
              <p>{{ merchantForm.vendor.mobile_no }}</p>
            </div>
            <div class="info-item"><label>Status</label>
              <p><span :class="['pill', merchantForm.vendor.status ? 'pill--emerald' : 'pill--red']">{{
                merchantForm.vendor.status ? 'Active' : 'Inactive' }}</span></p>
            </div>
          </div>
          <h4 class="text-xs font-bold uppercase text-slate-400 tracking-widest mb-3 mt-2">Vendor Commission</h4>
          <div class="table-scroll-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Payment Method</th>
                  <th>Provider</th>
                  <th>Rate</th>
                  <th>Rate Type</th>
                </tr>
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
        </div>

      </section>

      <!-- ════ TAB: WALLET LIMITS ════ -->
      <section v-show="activeTab === 'wallet'" class="tab-section">

        <!-- Wallet Overview -->
        <div class="card" v-if="merchantForm.wallet">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--emerald"></div>
            <h3 class="card__title">Wallet Overview</h3>
            <span :class="['ml-auto pill', merchantForm.wallet.status ? 'pill--emerald' : 'pill--red']">{{
              merchantForm.wallet.status ? 'Active' : 'Inactive' }}</span>
          </div>
          <div class="info-grid info-grid--3">
            <div class="info-item"><label>Balance</label>
              <p class="text-2xl font-bold text-slate-900">₹ {{
                Number(merchantForm.wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) }}</p>
            </div>
            <div class="info-item"><label>Wallet ID</label>
              <p class="font-mono text-xs">{{ merchantForm.wallet.id }}</p>
            </div>
            <div class="info-item"><label>Created</label>
              <p>{{ formatDate(merchantForm.wallet.createdAt) }}</p>
            </div>
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
              <div class="paymethod-icon">{{ pm.paymentMethod.slice(0, 1) }}</div>
              <div>
                <p class="paymethod-name">{{ pm.paymentMethod }}</p>
                <p class="paymethod-provider">Provider: {{ pm.provider }}</p>
              </div>
              <span :class="['ml-auto pill', pm.active ? 'pill--emerald' : 'pill--red']">{{ pm.active ? 'Active' :
                'Inactive' }}</span>
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
                <div class="outlet-icon">{{ outlet.code.slice(0, 1) }}</div>
                <div>
                  <p class="outlet-name">{{ outlet.name }}</p>
                  <p class="outlet-id font-mono text-xs">{{ outlet.outletId }}</p>
                </div>
                <span :class="['ml-auto pill', outlet.status ? 'pill--emerald' : 'pill--red']">{{ outlet.status ?
                  'Active' : 'Inactive' }}</span>
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
            <div class="info-item"><label>MCC Code</label>
              <p class="font-mono font-bold text-lg">{{ merchantForm.mcc.id }}</p>
            </div>
            <div class="info-item"><label>Description</label>
              <p>{{ merchantForm.mcc.descr }}</p>
            </div>
            <div class="info-item"><label>Status</label>
              <p><span :class="['pill', merchantForm.mcc.status ? 'pill--emerald' : 'pill--red']">{{
                merchantForm.mcc.status ? 'Active' : 'Inactive' }}</span></p>
            </div>
          </div>
        </div>

      </section>

    </main>

    <!-- ░░ FOOTER — hidden on mobile ░░ -->
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

    <!-- ░░ MOBILE SERVICES DRAWER ░░ -->
    <Teleport to="body">
      <Transition name="drawer-overlay">
        <div v-if="mobileDrawerOpen" class="mobile-drawer-overlay" @click="closeMobileDrawer"></div>
      </Transition>
      <Transition name="drawer-slide">
        <div v-if="mobileDrawerOpen" class="mobile-drawer">
          <!-- Drawer handle -->
          <div class="mobile-drawer__handle"></div>

          <!-- Drawer header -->
          <div class="mobile-drawer__header">
            <template v-if="!mobileDrawerStep2">
              <div>
                <p class="mobile-drawer__title">Select Service</p>
                <p class="mobile-drawer__sub">Choose a service to onboard</p>
              </div>
              <button class="mobile-drawer__close" @click="closeMobileDrawer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </template>
            <template v-else>
              <button class="mobile-drawer__back" @click="mobileDrawerStep2 = null">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
              </button>
              <div class="mobile-drawer__step2-title">
                <span class="svc-menu-badge svc-menu-badge--amber">{{ mobileDrawerStep2.service }}</span>
                <span class="mobile-drawer__arrow">→ Interface</span>
              </div>
              <button class="mobile-drawer__close" @click="closeMobileDrawer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </template>
          </div>

          <!-- Drawer body -->
          <div class="mobile-drawer__body">
            <!-- Step 1: Services list -->
            <template v-if="!mobileDrawerStep2">
              <div v-if="servicesOptions.length === 0" class="mobile-drawer__empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>No services available</p>
              </div>
              <div v-for="svc in servicesOptions" :key="svc.id"
                class="mobile-drawer__item" @click="mobileDrawerStep2 = svc">
                <div class="mobile-drawer__item-icon">{{ svc.service.slice(0, 2) }}</div>
                <div class="mobile-drawer__item-info">
                  <p class="mobile-drawer__item-name">{{ svc.service }}</p>
                  <p class="mobile-drawer__item-meta">{{ svc.interfaces.length }} interface(s) available</p>
                </div>
                <svg class="mobile-drawer__item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </template>

            <!-- Step 2: Interfaces list -->
            <template v-else>
              <div v-if="mobileDrawerStep2.interfaces.length === 0" class="mobile-drawer__empty">
                <p>No interfaces available</p>
              </div>
              <div v-for="intf in mobileDrawerStep2.interfaces" :key="intf.id"
                class="mobile-drawer__item" @click="mobileConfirmOnboard(intf)">
                <div class="mobile-drawer__item-icon mobile-drawer__item-icon--violet">{{ intf.interface.slice(0, 2) }}</div>
                <div class="mobile-drawer__item-info">
                  <p class="mobile-drawer__item-name">{{ intf.interface }}</p>
                  <p class="mobile-drawer__item-meta">Tap to onboard</p>
                </div>
                <svg class="mobile-drawer__item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Snackbar -->
    <Transition name="snack">
      <div v-if="snackbar.show"
        :class="['snackbar', snackbar.color === 'success' ? 'snackbar--success' : 'snackbar--error']">
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
const dropdownInterface = ref(false);
const dropdownRef = ref(null);

const inlineOnboardSvcId = ref(null);

// Mobile drawer state
const mobileDrawerOpen = ref(false);
const mobileDrawerStep2 = ref(null);

const closeMobileDrawer = () => {
  mobileDrawerOpen.value = false;
  mobileDrawerStep2.value = null;
};

const mobileConfirmOnboard = (intf) => {
  const svc = mobileDrawerStep2.value;
  closeMobileDrawer();
  createServiceKyc(svc, intf);
};

const kycServices = computed(() => {
  return merchantForm.merchantKyc?.services || [];
});

const handleOutsideClick = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false;
  }
};

// Two-step dropdown state
const selectedService = ref(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
  if (!dropdownOpen.value) selectedService.value = null;
};

const selectService = (svc) => {
  selectedService.value = svc;
};

const createServiceKyc = async (svc, intf) => {
  try {
    const payload = {
      merchantId: props.merchantId,
      service: svc.service,
      interfaceName: intf.interface
    };

    const res = await createKyc(payload);

    const isSuccess = res.data?.statusCode === "00" || res.statusCode === "00";

    if (!isSuccess) {
      snackbar.message = res.data?.message || res.message || "Something went wrong";
      snackbar.color = "error";
      snackbar.show = true;
    } else {
      snackbar.message = res.data?.message || res.message || `KYC created for ${svc.service} → ${intf.interface}`;
      snackbar.color = "success";
      snackbar.show = true;

      setTimeout(() => {
        getMerchant(props.merchantId);
      }, 2000);
    }

    setTimeout(() => { snackbar.show = false; }, 3000);

  } catch (e) {
    snackbar.message = `Failed to create KYC for ${svc.service}`;
    snackbar.color = "error";
    snackbar.show = true;
    setTimeout(() => { snackbar.show = false; }, 3000);
  }
};

const confirmOnboard = (intf) => {
  const svc = selectedService.value;
  dropdownOpen.value = false;
  selectedService.value = null;

  createServiceKyc(svc, intf);
};

const onboardService = async (svc, intf, kycStatus) => {
  try {
    if (svc === "AEPS" && intf === "NSDL") {
      router.push({
        path: `/vendor/onboarding/aeps/${props.merchantId}`,
        query: {
          pan_status: kycStatus?.pan_status || "PENDING",
          otp_status: kycStatus?.otp_status || false,
          aadhaar_status: kycStatus?.aadhaar_status || "PENDING",
          bank_status: kycStatus?.bank_status || "PENDING",
          gst_status: kycStatus?.gst_status || "PENDING",
          store_img_status: kycStatus?.store_img_status || "PENDING",
        }
      });
    } else {
      // handle other services
    }

    snackbar.message = `${svc} → ${intf} onboarding initiated`;
    snackbar.color = "success";
    snackbar.show = true;
    setTimeout(() => { snackbar.show = false; }, 3000);
  } catch (e) {
    snackbar.message = `Failed to onboard ${svc}`;
    snackbar.color = "error";
    snackbar.show = true;
    setTimeout(() => { snackbar.show = false; }, 3000);
  }
};

const props = defineProps({ merchantId: String });
const router = useRouter();
const { getMerchantById, createKyc, getServices } = useOnboadingApi();
const { getTransactionsByMerchantId } = useUsersApi();

const merchantForm = reactive({});
const transactions = ref({ data: [], pagination: {} });
const servicesOptions = ref([]);
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
    key: "commission", label: "Commission",
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
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

const kycStatusItems = computed(() => {
  const k = merchantForm.merchantKyc;
  if (!k) return [];
  return [
    { key: "global", label: "Global KYC", status: k.status, date: k.globalVerifiedAt, reason: k.globalRejectionReason },
  ];
});

const expandedSvc = ref({});

const toggleSvcExpand = (id) => {
  expandedSvc.value = {
    ...expandedSvc.value,
    [id]: !expandedSvc.value[id]
  };
};

const riskPillClass = (level) => {
  const map = { LOW: 'pill--green', MEDIUM: 'pill--yellow', HIGH: 'pill--red' };
  return map[level] || 'pill--grey';
};

const walletChannels = computed(() => {
  if (!merchantForm.wallet?.limits) return [];
  return [...new Set(merchantForm.wallet.limits.map((l) => l.channel))];
});

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

const getServicesFunc = async () => {
  try {
    const res = await getServices();
    servicesOptions.value = res.services || [];
    console.log("Services:", servicesOptions.value);
  } catch (e) {
    console.error("Failed to fetch services:", e);
  }
};

onMounted(() => {
  getMerchant(props.merchantId);
  getTransactions(props.merchantId);
  getServicesFunc();
  document.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>

<style scoped>
/* ── Reset & Shell ── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.merchant-shell {
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'DM Sans', 'Manrope', 'Segoe UI', sans-serif;
  color: #0f172a;
  padding-bottom: 56px;
}

/* ══════════════════════════════════════════
   HEADER
══════════════════════════════════════════ */
.mh-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .06);
}

.mh-header__inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
}

.mh-header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex-shrink: 0;
}

.mh-brand-text {
  min-width: 0;
  text-align: right;
}

.mh-logo {
  width: 40px;
  height: 40px;
  background: #0f172a;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #fff;
  flex-shrink: 0;
}

.mh-business-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mh-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  flex-wrap: wrap;
}

.mh-meta--right {
  justify-content: flex-end;
}

.mh-mid {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #64748b;
  background: #f8fafc;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
}

.mh-badge {
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: .4px;
  white-space: nowrap;
}

.mh-badge--pending {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.mh-badge--success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.mh-badge--error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.mh-badge--interface {
  background: #ede9fe;
  color: #5b21b6;
  border: 1px solid #c4b5fd;
}

.mh-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  flex: 1;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 13px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  background: #fff;
  color: #475569;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}

.btn-back:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  background: #059669;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(5, 150, 105, .25);
  transition: all .15s;
}

.btn-primary:hover {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(5, 150, 105, .3);
}

/* ══════════════════════════════════════════
   STAT STRIP
══════════════════════════════════════════ */
.stat-strip {
  max-width: 1280px;
  margin: 20px auto 0;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.stat-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .04);
  transition: box-shadow .2s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, .08);
}

.stat-card__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.stat-card__icon--blue    { background: #dbeafe; color: #2563eb; }
.stat-card__icon--amber   { background: #fef3c7; color: #d97706; }
.stat-card__icon--emerald { background: #d1fae5; color: #059669; }
.stat-card__icon--violet  { background: #ede9fe; color: #7c3aed; }

.stat-card__body {
  min-width: 0;
  flex: 1;
}

.stat-card__label {
  font-size: 10.5px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: .6px;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-card__value {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-card__value--amber   { color: #d97706; }
.stat-card__value--emerald { color: #059669; }

.stat-card__sub {
  font-size: 10.5px;
  color: #94a3b8;
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-card__sub--amber { color: #d97706; }

/* ══════════════════════════════════════════
   TAB NAV
══════════════════════════════════════════ */
.tab-nav-wrap {
  max-width: 1280px;
  margin: 18px auto 0;
  padding: 0 20px;
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
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  background: transparent;
  color: #64748b;
  transition: all .15s;
  flex-shrink: 0;
}

.tab-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.tab-btn--active {
  background: #0f172a;
  color: #fff;
  box-shadow: 0 2px 8px rgba(15, 23, 42, .2);
}

.tab-btn__icon {
  display: flex;
  align-items: center;
}

.tab-btn__label {
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  display: inline;
}

/* ══════════════════════════════════════════
   CONTENT
══════════════════════════════════════════ */
.mh-content {
  max-width: 1280px;
  margin: 18px auto 0;
  padding: 0 20px;
}

.tab-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Card ── */
.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .04);
}

.card__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.card__head-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card__head-dot--indigo  { background: #6366f1; }
.card__head-dot--sky     { background: #0ea5e9; }
.card__head-dot--emerald { background: #10b981; }
.card__head-dot--amber   { background: #f59e0b; }
.card__head-dot--rose    { background: #f43f5e; }
.card__head-dot--violet  { background: #8b5cf6; }

.card__title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
}

/* ── KYC actions row ── */
.kyc-actions-row {
  display: flex;
  justify-content: flex-end;
  position: relative;
}

/* Desktop dropdown: visible only ≥641px */
.services-dropdown--desktop { display: block; }

/* Mobile services button: hidden on desktop */
.services-btn--mobile { display: none; }

/* ── Info Grid ── */
.info-grid {
  display: grid;
  gap: 0;
  padding: 0;
}

.info-grid--3 { grid-template-columns: repeat(3, 1fr); }
.info-grid--4 { grid-template-columns: repeat(4, 1fr); }

.info-item {
  padding: 14px 18px;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:nth-child(4n)       { border-right: none; }
.info-grid--3 .info-item:nth-child(3n) { border-right: none; }

.info-item label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: .7px;
  display: block;
  margin-bottom: 4px;
}

.info-item p {
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
}

.font-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }

/* ── Pills ── */
.pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.pill--indigo  { background: #e0e7ff; color: #4338ca; }
.pill--emerald { background: #d1fae5; color: #065f46; }
.pill--amber   { background: #fef3c7; color: #92400e; }
.pill--red     { background: #fee2e2; color: #991b1b; }
.pill--sky     { background: #e0f2fe; color: #0369a1; }
.pill--violet  { background: #ede9fe; color: #5b21b6; }
.pill--slate   { background: #f1f5f9; color: #64748b; }
.pill--sm      { font-size: 9.5px; padding: 1px 6px; }

.ml-auto { margin-left: auto; }

/* ── Address Grid ── */
.addr-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.addr-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
}

.addr-card__hd {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .7px;
}

.addr-card__hd--blue    { background: #eff6ff; color: #1d4ed8; border-bottom: 1px solid #dbeafe; }
.addr-card__hd--violet  { background: #f5f3ff; color: #6d28d9; border-bottom: 1px solid #ddd6fe; }
.addr-card__hd--emerald { background: #f0fdf4; color: #065f46; border-bottom: 1px solid #bbf7d0; }

.addr-card__body {
  padding: 14px;
  font-size: 12.5px;
  color: #334155;
  line-height: 1.7;
}

.addr-city {
  color: #64748b;
  font-size: 11.5px;
  margin-top: 5px;
  font-weight: 600;
}

.addr-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
  font-size: 11px;
  color: #64748b;
}

.addr-link { color: #2563eb; text-decoration: none; font-weight: 600; }
.addr-link:hover { text-decoration: underline; }

/* ── KYC Items ── */
.kyc-status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.kyc-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px 18px;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.kyc-item__dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  margin-top: 3px;
  flex-shrink: 0;
}

.kyc-item__dot--green  { background: #10b981; box-shadow: 0 0 0 3px #d1fae5; }
.kyc-item__dot--amber  { background: #f59e0b; box-shadow: 0 0 0 3px #fef3c7; }
.kyc-item__dot--red    { background: #ef4444; box-shadow: 0 0 0 3px #fee2e2; }

.kyc-item__label  { font-size: 12px; font-weight: 600; color: #475569; }
.kyc-item__status { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
.kyc-item__date   { font-size: 10px; color: #94a3b8; margin-top: 3px; }

/* ── Service KYC ── */
.svc-kyc-list { display: flex; flex-direction: column; gap: 0; }

.svc-kyc-card {
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
}

.svc-kyc-card:last-child { border-bottom: none; }

.svc-kyc-card__top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.svc-icon {
  width: 34px; height: 34px;
  border-radius: 9px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 800;
  flex-shrink: 0;
}

.svc-info { min-width: 0; flex: 1; }
.svc-name { font-size: 13.5px; font-weight: 700; color: #0f172a; }
.svc-risk { font-size: 11px; color: #64748b; margin-top: 2px; }
.svc-interface { font-size: 11px; color: #0964e2; margin-top: 1px; }

.svc-kyc-card__action { display: flex; align-items: center; flex-shrink: 0; }

.svc-verified-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 9px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.svc-inline-onboard { position: relative; display: flex; align-items: center; gap: 6px; }

.svc-onboard-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 11px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
  white-space: nowrap;
}

.svc-onboard-btn:hover { background: #1e293b; }

.svc-kyc-card__flags { display: flex; flex-wrap: wrap; gap: 6px; }

.flag { font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: 6px; }
.flag--on  { background: #d1fae5; color: #065f46; }
.flag--off { background: #f1f5f9; color: #64748b; }

/* ── Tables ── */
.table-scroll-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

.data-table { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 480px; }
.data-table thead { background: #f8fafc; }

.data-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 10px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: .6px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.data-table td {
  padding: 11px 14px;
  color: #334155;
  border-bottom: 1px solid #f9fafb;
}

.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #f8fafc; }

/* ── Doc Verify ── */
.svc-doc-verifications {
  margin-top: 12px;
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
}

.svc-doc-verifications__title {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  margin-bottom: 8px;
}

.doc-verify-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}

.doc-verify-table th {
  text-align: left;
  font-size: 10.5px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 8px 6px;
  border-bottom: 1px solid #e5e7eb;
}

.doc-verify-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: middle;
}

.doc-verify-table tr:last-child td { border-bottom: none; }
.doc-verify-table__name { font-weight: 600; color: #111827 !important; }

.doc-verify-cards--mobile { display: none; }

.doc-verify-card {
  padding: 9px 0;
  border-bottom: 1px solid #f3f4f6;
}

.doc-verify-card:last-child { border-bottom: none; }

.doc-verify-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.doc-verify-card__name { font-size: 12.5px; font-weight: 600; color: #111827; }

.doc-verify-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 3px;
}

.doc-verify-card__date   { font-size: 10.5px; color: #6b7280; }
.doc-verify-card__reason { font-size: 10.5px; color: #ef4444; }

/* ── Limits ── */
.limits-channel-grid { display: flex; flex-direction: column; gap: 0; }

.limits-channel { padding: 14px 18px; border-bottom: 1px solid #f1f5f9; }
.limits-channel:last-child { border-bottom: none; }

.limits-channel__name {
  font-size: 11.5px;
  font-weight: 800;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: .8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.limits-channel__name::before {
  content: '';
  width: 3px; height: 13px;
  background: #6366f1;
  border-radius: 2px;
  display: block;
}

.limits-rows { display: flex; flex-direction: column; gap: 8px; }

.limit-row {
  display: grid;
  grid-template-columns: 80px 1fr 90px 65px;
  align-items: center;
  gap: 10px;
}

.limit-row__type   { font-size: 10.5px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .5px; }
.limit-row__bar    { height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.limit-row__bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #818cf8); border-radius: 3px; transition: width .4s ease; }
.limit-row__amount { font-size: 12.5px; font-weight: 700; color: #0f172a; text-align: right; }
.limit-row__period { font-size: 10px; font-weight: 600; color: #94a3b8; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; text-align: center; }

/* ── Payment Methods ── */
.paymethod-list { padding: 2px 0; }

.paymethod-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-bottom: 1px solid #f9fafb;
}

.paymethod-item:last-child { border-bottom: none; }

.paymethod-icon {
  width: 38px; height: 38px;
  border-radius: 11px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}

.paymethod-name     { font-size: 13.5px; font-weight: 700; color: #0f172a; }
.paymethod-provider { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }

/* ── Outlets ── */
.outlet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 0; }

.outlet-card { padding: 18px; border-right: 1px solid #f1f5f9; }
.outlet-card:last-child { border-right: none; }

.outlet-card__hd { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }

.outlet-icon {
  width: 38px; height: 38px;
  border-radius: 11px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
  flex-shrink: 0;
}

.outlet-name { font-size: 14px; font-weight: 700; color: #0f172a; }
.outlet-id   { color: #94a3b8; }
.outlet-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; color: #64748b; margin-bottom: 12px; }

.outlet-users { background: #f8fafc; border-radius: 9px; padding: 10px; }

.outlet-user { display: flex; align-items: center; gap: 9px; padding: 7px 0; border-bottom: 1px solid #f1f5f9; }
.outlet-user:last-child { border-bottom: none; }

.outlet-user__avatar {
  width: 28px; height: 28px;
  border-radius: 7px;
  background: #e0e7ff;
  color: #4338ca;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.outlet-user__name  { font-size: 12.5px; font-weight: 600; color: #0f172a; }
.outlet-user__email { font-size: 11px; color: #94a3b8; }

/* ── Empty State ── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 36px;
  color: #94a3b8;
  text-align: center;
}

.empty-state p { font-size: 13px; font-weight: 500; }

/* ── Footer (desktop only) ── */
.mh-footer {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  padding: 0 20px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 40;
}

.mh-footer__status { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .8px; color: #64748b; }
.mh-footer__links  { display: flex; gap: 16px; }
.mh-footer__links a { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: #94a3b8; text-decoration: none; }
.mh-footer__links a:hover { color: #475569; }

.pulse-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, .4); }
  50%       { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
}

/* ── Snackbar ── */
.snackbar {
  position: fixed;
  bottom: 56px;
  right: 16px;
  padding: 11px 18px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .15);
}

.snackbar--success { background: #059669; color: #fff; }
.snackbar--error   { background: #ef4444; color: #fff; }

.snack-enter-active, .snack-leave-active { transition: all .3s; }
.snack-enter-from,   .snack-leave-to    { opacity: 0; transform: translateY(10px); }

/* ── Text utilities ── */
.text-emerald-600 { color: #059669; }
.text-red-500     { color: #ef4444; }
.text-amber-600   { color: #d97706; }
.text-xs          { font-size: 11px; }
.text-slate-400   { color: #94a3b8; }
.text-2xl         { font-size: 22px; }
.text-lg          { font-size: 16px; }
.font-bold        { font-weight: 700; }
.text-slate-900   { color: #0f172a; }

.mb-6 { margin-bottom: 24px; }
.ml-2 { margin-left: 6px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mb-3 { margin-bottom: 12px; }
.mb-2 { margin-bottom: 8px; }
.mr-5 { margin-right: 6px; }

.tracking-widest { letter-spacing: .1em; }
.uppercase { text-transform: uppercase; }

/* ── Services Dropdown (desktop) ── */
.services-dropdown { position: relative; }

.services-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: auto;
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
  padding: 11px 14px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}

.services-menu__title {
  font-size: 10.5px;
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

.services-menu__empty { padding: 22px 14px; text-align: center; font-size: 12px; color: #94a3b8; }

.services-menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-bottom: 1px solid #f9fafb;
  transition: background .12s;
}

.services-menu__item:last-child { border-bottom: none; }
.services-menu__item:hover { background: #f8fafc; }
.services-menu__item--selectable { cursor: pointer; }

.svc-menu-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 9.5px;
  font-weight: 800;
  flex-shrink: 0;
}

.svc-menu-info { flex: 1; min-width: 0; }
.svc-menu-name { font-size: 12.5px; font-weight: 700; color: #0f172a; }
.svc-menu-meta { font-size: 10.5px; color: #94a3b8; margin-top: 2px; display: flex; align-items: center; gap: 5px; }

.svc-menu-badge { font-size: 9.5px; font-weight: 700; padding: 1px 6px; border-radius: 10px; text-transform: uppercase; }
.svc-menu-badge--amber { background: #fef3c7; color: #92400e; }
.svc-menu-badge--green { background: #d1fae5; color: #065f46; }
.svc-menu-badge--red   { background: #fee2e2; color: #991b1b; }

.svc-menu-arrow {
  margin-left: auto;
  flex-shrink: 0;
  color: #cbd5e1;
  transition: color .15s, transform .15s;
}

.services-menu__item--selectable:hover .svc-menu-arrow { color: #6366f1; transform: translateX(2px); }

.svc-back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px; height: 22px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  color: #475569;
  flex-shrink: 0;
  transition: all .15s;
}

.svc-back-btn:hover { background: #f1f5f9; color: #0f172a; }

.dropdown-enter-active, .dropdown-leave-active { transition: opacity .15s, transform .15s; }
.dropdown-enter-from,   .dropdown-leave-to    { opacity: 0; transform: translateY(-6px); }

/* ── Global KYC Banner ── */
.global-kyc-banner {
  background: #f0f7ff;
  border: 1px solid #c8e0ff;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 14px;
}

.global-kyc-banner__inner { display: flex; flex-wrap: wrap; gap: 10px 20px; align-items: center; }
.global-kyc-banner__item  { display: flex; flex-direction: column; gap: 3px; }
.global-kyc-banner__label { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 600; }
.global-kyc-banner__value { font-size: 12.5px; color: #374151; }

.svc-expand-icon { font-size: 10px; color: #9ca3af; margin-left: 6px; flex-shrink: 0; }

.svc-kyc-card__expanded { margin-top: 8px; border-top: 1px solid #f1f5f9; padding-top: 8px; }

.svc-intf-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  width: 200px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, .12);
  z-index: 300;
  overflow: hidden;
}

.svc-intf-menu__title { padding: 8px 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .7px; color: #94a3b8; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.svc-intf-menu__empty { padding: 14px 12px; font-size: 12px; color: #94a3b8; text-align: center; }

.svc-intf-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 1px solid #f9fafb;
  transition: background .12s;
  text-align: left;
}

.svc-intf-menu__item:last-child { border-bottom: none; }
.svc-intf-menu__item:hover { background: #f8fafc; }

.svc-intf-menu__icon {
  width: 24px; height: 24px;
  border-radius: 6px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: 800;
  flex-shrink: 0;
}

.svc-menu-icon--violet { background: #6d28d9 !important; }

/* ══════════════════════════════════════════
   MOBILE SERVICES DRAWER
══════════════════════════════════════════ */
.mobile-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 500;
  backdrop-filter: blur(2px);
}

.mobile-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 20px 20px 0 0;
  z-index: 501;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 40px rgba(15, 23, 42, .18);
}

.mobile-drawer__handle {
  width: 36px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin: 12px auto 0;
  flex-shrink: 0;
}

.mobile-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 12px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
  gap: 10px;
}

.mobile-drawer__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.mobile-drawer__sub {
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 2px;
}

.mobile-drawer__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  color: #64748b;
  flex-shrink: 0;
  transition: all .15s;
}

.mobile-drawer__close:hover { background: #f1f5f9; color: #0f172a; }

.mobile-drawer__back {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  flex-shrink: 0;
  transition: all .15s;
}

.mobile-drawer__back:hover { background: #f1f5f9; color: #0f172a; }

.mobile-drawer__step2-title {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  justify-content: center;
}

.mobile-drawer__arrow {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.mobile-drawer__body {
  overflow-y: auto;
  flex: 1;
  padding-bottom: env(safe-area-inset-bottom, 16px);
}

.mobile-drawer__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 40px 20px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.mobile-drawer__item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background .12s;
  -webkit-tap-highlight-color: transparent;
}

.mobile-drawer__item:last-child { border-bottom: none; }
.mobile-drawer__item:active { background: #f8fafc; }

.mobile-drawer__item-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
}

.mobile-drawer__item-icon--violet { background: #6d28d9; }

.mobile-drawer__item-info { flex: 1; min-width: 0; }

.mobile-drawer__item-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.mobile-drawer__item-meta {
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 2px;
}

.mobile-drawer__item-arrow {
  color: #cbd5e1;
  flex-shrink: 0;
}

/* Drawer animations */
.drawer-overlay-enter-active, .drawer-overlay-leave-active { transition: opacity .25s ease; }
.drawer-overlay-enter-from, .drawer-overlay-leave-to { opacity: 0; }

.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform .3s cubic-bezier(0.32, 0.72, 0, 1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateY(100%); }

/* ══════════════════════════════════════════
   RESPONSIVE — TABLET  ≤ 1024px
══════════════════════════════════════════ */
@media (max-width: 1024px) {
  .stat-strip {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-grid--4 { grid-template-columns: repeat(2, 1fr); }
  .info-item:nth-child(4n) { border-right: 1px solid #f1f5f9; }
  .info-grid--4 .info-item:nth-child(2n) { border-right: none; }

  .addr-grid { grid-template-columns: repeat(2, 1fr); }
  .kyc-status-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ══════════════════════════════════════════
   RESPONSIVE — MOBILE  ≤ 640px
══════════════════════════════════════════ */
@media (max-width: 640px) {

  /* ── Header: compact ── */
  .mh-header { padding: 0 14px; }

  .mh-header__inner {
    padding: 10px 0;
    gap: 8px;
    flex-wrap: nowrap;
  }

  .mh-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  .mh-logo svg { width: 16px; height: 16px; }

  .mh-business-name { font-size: 14px; }

  .mh-mid { font-size: 9px; padding: 1px 5px; }

  .mh-badge { font-size: 8.5px; padding: 1px 5px; }

  .btn-back {
    padding: 6px 9px;
    font-size: 11.5px;
    gap: 4px;
    border-radius: 7px;
  }

  .btn-back svg { width: 12px; height: 12px; }

  @media (max-width: 380px) {
    .btn-back__label { display: none; }
  }

  /* ── Stat strip: 2×2 equal-height cards ── */
  .stat-strip {
    margin-top: 12px;
    padding: 0 14px;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .stat-card {
    padding: 12px 11px;
    gap: 9px;
    border-radius: 12px;
    align-items: flex-start;
    min-height: 80px;
  }

  .stat-card__icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .stat-card__icon svg { width: 14px; height: 14px; }

  .stat-card__label {
    font-size: 9px;
    letter-spacing: .3px;
    white-space: normal;
    line-height: 1.3;
  }

  .stat-card__value {
    font-size: 13.5px;
    white-space: normal;
    word-break: break-all;
  }

  .stat-card__sub {
    font-size: 9.5px;
    white-space: normal;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── Tab nav: icon + short label, bottom bar ── */
  .tab-nav-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 45;
    margin: 0;
    padding: 0;
    background: #fff;
    border-top: 1px solid #e2e8f0;
    box-shadow: 0 -2px 10px rgba(0,0,0,.07);
  }

  .tab-nav {
    border-radius: 0;
    border: none;
    padding: 0;
    gap: 0;
    background: transparent;
    justify-content: space-around;
  }

  .tab-btn {
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 4px 6px;
    gap: 3px;
    border-radius: 0;
    min-width: 0;
  }

  .tab-btn__icon {
    width: 20px;
    height: 20px;
  }

  .tab-btn__icon svg { width: 18px; height: 18px; }

  .tab-btn__label {
    font-size: 9px;
    font-weight: 600;
    line-height: 1;
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 52px;
    display: block;
  }

  .tab-btn--active {
    background: transparent;
    color: #6366f1;
    box-shadow: none;
  }

  /* ── Shell padding — no footer on mobile ── */
  .merchant-shell { padding-bottom: 68px; }

  /* ── Footer: completely hidden on mobile ── */
  .mh-footer { display: none; }

  /* ── Services: hide desktop dropdown, show mobile button ── */
  .services-dropdown--desktop { display: none; }
  .services-btn--mobile { display: flex; }

  /* ── Content ── */
  .mh-content { padding: 0 14px; margin-top: 14px; }
  .tab-section { gap: 12px; }

  /* ── Cards ── */
  .card { border-radius: 12px; }
  .card__head { padding: 12px 14px; }
  .card__title { font-size: 12.5px; }

  /* ── Info grid: 2-col on mobile ── */
  .info-grid--4,
  .info-grid--3 { grid-template-columns: 1fr 1fr; }

  .info-grid--4 .info-item,
  .info-grid--3 .info-item { border-right: 1px solid #f1f5f9; }

  .info-grid--4 .info-item:nth-child(2n),
  .info-grid--3 .info-item:nth-child(2n) { border-right: none; }

  .info-item { padding: 11px 13px; }
  .info-item label { font-size: 9.5px; }
  .info-item p { font-size: 12px; }

  /* ── Address grid: 1 col ── */
  .addr-grid { grid-template-columns: 1fr; gap: 10px; }

  /* ── KYC grid: 1 col ── */
  .kyc-status-grid { grid-template-columns: 1fr; }

  /* ── KYC actions ── */
  .kyc-actions-row { margin-bottom: 4px; }

  /* ── Doc verify: mobile cards ── */
  .doc-verify-table--desktop { display: none; }
  .doc-verify-cards--mobile  { display: block; }

  /* ── Limit rows ── */
  .limit-row { grid-template-columns: 60px 1fr 72px 52px; gap: 6px; }
  .limit-row__amount { font-size: 11.5px; }
  .limit-row__type   { font-size: 10px; }

  /* ── Snackbar ── */
  .snackbar { right: 14px; left: 14px; text-align: center; bottom: 72px; }

  /* ── Outlet grid: 1 col ── */
  .outlet-grid { grid-template-columns: 1fr; }
  .outlet-card { border-right: none; border-bottom: 1px solid #f1f5f9; }
  .outlet-card:last-child { border-bottom: none; }
}

/* ══════════════════════════════════════════
   RESPONSIVE — EXTRA-SMALL  ≤ 400px
══════════════════════════════════════════ */
@media (max-width: 400px) {
  .stat-strip { grid-template-columns: 1fr 1fr; gap: 8px; }
  .stat-card__value { font-size: 12.5px; }
  .stat-card__label { font-size: 8.5px; }

  .info-grid--4,
  .info-grid--3 { grid-template-columns: 1fr; }

  .info-grid--4 .info-item,
  .info-grid--3 .info-item { border-right: none; }
}
</style>