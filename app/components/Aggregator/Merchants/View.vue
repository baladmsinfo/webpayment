<template>
  <div class="mg-shell" v-if="merchant && merchant.id">

    <!-- ░░ HEADER ░░ -->
    <header class="mg-header">
      <div class="mg-header__inner">
        <div class="mg-header__left">
          <button class="btn-back" @click="router.back()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Back</span>
          </button>
        </div>
        <div class="mg-header__brand">
          <div class="mg-brand-text">
            <h1 class="mg-merchant-name">{{ merchant.legal_name || merchant.business_name || '—' }}</h1>
            <div class="mg-meta">
              <span class="mg-mid-chip">{{ merchant.mid }}</span>
              <span :class="['mg-badge', mstatusBadge(merchant.mstatus)]">{{ merchant.mstatus }}</span>
              <span :class="['mg-badge', merchant.status ? 'mg-badge--success' : 'mg-badge--error']">{{ merchant.status ? 'Active' : 'Inactive' }}</span>
              <span class="mg-badge mg-badge--slate">{{ merchant.interface }}</span>
            </div>
          </div>
          <div class="mg-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        </div>
      </div>
    </header>

    <!-- ░░ STAT STRIP ░░ -->
    <div class="mg-stat-strip">
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--blue">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Terminals</p>
          <p class="stat-card__value">{{ merchant.terminals?.length || 0 }}</p>
          <p class="stat-card__sub">Assigned devices</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--emerald">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Commissions</p>
          <p class="stat-card__value stat-card__value--emerald">{{ merchant.commissionconfig?.length || 0 }}</p>
          <p class="stat-card__sub">Active slabs</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--amber">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><path d="M2 13v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">Outlets</p>
          <p class="stat-card__value stat-card__value--amber">{{ merchant.outlets?.length || 0 }}</p>
          <p class="stat-card__sub">Branch locations</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon stat-card__icon--violet">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        </div>
        <div class="stat-card__body">
          <p class="stat-card__label">KYC Services</p>
          <p class="stat-card__value">{{ merchant.merchantservicekyc?.length || 0 }}</p>
          <p class="stat-card__sub">Registered services</p>
        </div>
      </div>
    </div>

    <!-- ░░ TAB NAV ░░ -->
    <div class="mg-tab-wrap">
      <nav class="mg-tab-nav">
        <button v-for="t in tabs" :key="t.key"
          :class="['tab-btn', activeTab === t.key && 'tab-btn--active']"
          @click="activeTab = t.key">
          <span class="tab-btn__icon" v-html="t.icon"></span>
          <span class="tab-btn__label">{{ t.label }}</span>
        </button>
      </nav>
    </div>

    <!-- ░░ MAIN CONTENT ░░ -->
    <main class="mg-content">

      <!-- ════ TAB: MERCHANT INFO ════ -->
      <section v-show="activeTab === 'info'" class="tab-section">

        <!-- Identity -->
        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">Merchant Identity</h3>
            <span class="card__ro-badge">View Only</span>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Legal Name</label><p>{{ merchant.legal_name || '—' }}</p></div>
            <div class="info-item"><label>Business Name</label><p>{{ merchant.business_name || '—' }}</p></div>
            <div class="info-item"><label>MID</label><p class="font-mono">{{ merchant.mid || '—' }}</p></div>
            <div class="info-item"><label>App ID</label><p class="font-mono text-xs">{{ merchant.appid || '—' }}</p></div>
            <div class="info-item"><label>Interface</label><p><span class="pill pill--indigo">{{ merchant.interface || '—' }}</span></p></div>
            <div class="info-item"><label>Lifecycle Status</label><p><span :class="['pill', mstatusBadgeClass(merchant.mstatus)]">{{ merchant.mstatus || '—' }}</span></p></div>
            <div class="info-item"><label>Active</label><p><span :class="['pill', merchant.status ? 'pill--emerald' : 'pill--red']">{{ merchant.status ? 'Active' : 'Inactive' }}</span></p></div>
            <div class="info-item"><label>Risk Flag</label><p><span :class="['pill', merchant.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ merchant.riskflag }}</span></p></div>
            <div class="info-item"><label>Lead Source</label><p>{{ merchant.lead_source || '—' }}</p></div>
            <div class="info-item"><label>LG Code</label><p class="font-mono">{{ merchant.lg_code || '—' }}</p></div>
            <div class="info-item"><label>Created At</label><p>{{ fmtDate(merchant.createdAt) }}</p></div>
            <div class="info-item"><label>Verified At</label><p>{{ fmtDate(merchant.verifiedAt) }}</p></div>
          </div>
        </div>

        <!-- Merchant Info -->
        <div class="card" v-if="merchant.merchantinfo">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Merchant Info</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Primary Email</label><p>{{ merchant.merchantinfo.primary_email_id || '—' }}</p></div>
            <div class="info-item"><label>Primary Mobile</label><p>{{ merchant.merchantinfo.primary_mobile || '—' }}</p></div>
            <div class="info-item"><label>Beneficiary Email</label><p>{{ merchant.merchantinfo.beneficiary_email || '—' }}</p></div>
            <div class="info-item"><label>Beneficiary Mobile</label><p>{{ merchant.merchantinfo.beneficiary_mobile || '—' }}</p></div>
            <div class="info-item"><label>DBA Name</label><p>{{ merchant.merchantinfo.dba_name || '—' }}</p></div>
            <div class="info-item"><label>Date of Birth</label><p>{{ fmtDate(merchant.merchantinfo.dob) }}</p></div>
            <div class="info-item"><label>Gender</label><p>{{ genderLabel(merchant.merchantinfo.gender) }}</p></div>
            <div class="info-item"><label>Nature of Business</label><p>{{ merchant.merchantinfo.nature_of_business || '—' }}</p></div>
            <div class="info-item"><label>Annual Turnover</label><p>{{ merchant.merchantinfo.annual_turn_over || '—' }}</p></div>
            <div class="info-item"><label>Website</label><p>{{ merchant.merchantinfo.website || merchant.address?.website || '—' }}</p></div>
            <div class="info-item"><label>STD Code</label><p>{{ merchant.merchantinfo.std_code || '—' }}</p></div>
            <div class="info-item"><label>Application ID</label><p class="font-mono text-xs">{{ merchant.merchantinfo.application_id || '—' }}</p></div>
          </div>
        </div>

        <!-- GST -->
        <div class="card" v-if="merchant.merchantgst">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--amber"></div>
            <h3 class="card__title">GST Information</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>GSTIN</label><p class="font-mono">{{ merchant.merchantgst.gstin || '—' }}</p></div>
            <div class="info-item"><label>Business Name</label><p>{{ merchant.merchantgst.business_name || '—' }}</p></div>
          </div>
        </div>

        <!-- Settlement Account -->
        <div class="card" v-if="merchant.settlementaccount">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--emerald"></div>
            <h3 class="card__title">Settlement Account</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Account Holder</label><p>{{ merchant.settlementaccount.account_holder_name || '—' }}</p></div>
            <div class="info-item"><label>Account Type</label><p>{{ merchant.settlementaccount.account_type || '—' }}</p></div>
            <div class="info-item"><label>Bank Name</label><p>{{ merchant.settlementaccount.bank_name || '—' }}</p></div>
            <div class="info-item"><label>Account No</label><p class="font-mono">{{ merchant.settlementaccount.bank_account_no || '—' }}</p></div>
            <div class="info-item"><label>IFSC Code</label><p class="font-mono">{{ merchant.settlementaccount.bank_ifsc_code || '—' }}</p></div>
            <div class="info-item"><label>Branch Name</label><p>{{ merchant.settlementaccount.branch_name || '—' }}</p></div>
            <div class="info-item"><label>City</label><p>{{ merchant.settlementaccount.city || '—' }}</p></div>
            <div class="info-item"><label>Holder Verified</label>
              <p><span :class="['pill', merchant.settlementaccount.account_holder_result ? 'pill--emerald' : 'pill--amber']">{{ merchant.settlementaccount.account_holder_result ? 'Verified' : 'Pending' }}</span></p>
            </div>
          </div>
        </div>

        <!-- PAN -->
        <div class="card" v-if="merchant.merchantpan?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--rose"></div>
            <h3 class="card__title">PAN Information</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ merchant.merchantpan.length }} record(s)</span></span>
          </div>
          <div class="table-scroll-wrap">
            <table class="data-table">
              <thead><tr><th>PAN</th><th>Name</th><th>Entity PAN</th><th>Father Name</th><th>DOB</th><th>Partner</th></tr></thead>
              <tbody>
                <tr v-for="pan in merchant.merchantpan" :key="pan.id">
                  <td class="font-mono">{{ pan.pan || '—' }}</td>
                  <td>{{ pan.pan_name || '—' }}</td>
                  <td class="font-mono">{{ pan.entity_pan || '—' }}</td>
                  <td>{{ pan.pan_father_name || '—' }}</td>
                  <td>{{ fmtDate(pan.pan_dob) }}</td>
                  <td><span :class="['pill pill--sm', pan.partner ? 'pill--indigo' : 'pill--slate']">{{ pan.partner ? 'Yes' : 'No' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- User Account -->
        <div class="card" v-if="merchant.user">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--violet"></div>
            <h3 class="card__title">User Account</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Name</label><p>{{ merchant.user.name || '—' }}</p></div>
            <div class="info-item"><label>Email</label><p>{{ merchant.user.email || '—' }}</p></div>
            <div class="info-item"><label>Mobile</label><p>{{ merchant.user.mobile_no || '—' }}</p></div>
            <div class="info-item"><label>Role</label><p><span class="pill pill--indigo">{{ merchant.user.role }}</span></p></div>
            <div class="info-item"><label>Account Status</label><p><span :class="['pill', merchant.user.status ? 'pill--emerald' : 'pill--red']">{{ merchant.user.status ? 'Active' : 'Inactive' }}</span></p></div>
            <div class="info-item"><label>Mobile Verified</label><p><span :class="['pill', merchant.user.mobile_verifited ? 'pill--emerald' : 'pill--amber']">{{ merchant.user.mobile_verifited ? 'Yes' : 'No' }}</span></p></div>
            <div class="info-item"><label>Email Verified</label><p><span :class="['pill', merchant.user.isemailVerified ? 'pill--emerald' : 'pill--amber']">{{ merchant.user.isemailVerified ? 'Yes' : 'No' }}</span></p></div>
            <div class="info-item"><label>Joined</label><p>{{ fmtDate(merchant.user.createdAt) }}</p></div>
          </div>
          <div class="api-key-row">
            <span class="api-key-row__label">API Key</span>
            <span class="font-mono text-xs api-key-val">{{ merchant.user.apiKey?.slice(0,44) + '…' }}</span>
          </div>
        </div>

      </section>

      <!-- ════ TAB: ADDRESS ════ -->
      <section v-show="activeTab === 'address'" class="tab-section">
        <div class="card" v-if="merchant.address">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Address Details</h3>
          </div>
          <div class="addr-grid">
            <div class="addr-card">
              <div class="addr-card__hd addr-card__hd--blue">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Official Address
              </div>
              <div class="addr-card__body">
                <p class="addr-main">{{ merchant.address.official_address || '—' }}</p>
                <p>{{ [merchant.address.address1, merchant.address.address2, merchant.address.address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
                <p class="addr-city">{{ merchant.address.city }}, {{ merchant.address.state }} – {{ merchant.address.pincode }}</p>
                <div class="addr-contact">
                  <span v-if="merchant.address.phone && merchant.address.phone !== '0000000000'">📞 {{ merchant.address.phone }}</span>
                  <span v-if="merchant.address.mobile_number && merchant.address.mobile_number !== '0000000000'">📱 {{ merchant.address.mobile_number }}</span>
                  <a v-if="merchant.address.website" :href="'https://'+merchant.address.website.replace(/^https?:\/\//,'')" class="addr-link" target="_blank">🌐 {{ merchant.address.website }}</a>
                </div>
              </div>
            </div>
            <div class="addr-card">
              <div class="addr-card__hd addr-card__hd--violet">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                Residential Address
              </div>
              <div class="addr-card__body">
                <p class="addr-main">{{ merchant.address.residential_address || '—' }}</p>
                <p>{{ [merchant.address.res_address1, merchant.address.res_address2, merchant.address.res_address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
                <p class="addr-city">{{ merchant.address.res_city }}, {{ merchant.address.res_state }} – {{ merchant.address.res_pincode }}</p>
                <div class="addr-contact">
                  <span v-if="merchant.address.res_mobile && merchant.address.res_mobile !== '0000000000'">📱 {{ merchant.address.res_mobile }}</span>
                  <span v-if="merchant.address.res_phone_number && merchant.address.res_phone_number !== '0000000000'">📞 {{ merchant.address.res_phone_number }}</span>
                </div>
              </div>
            </div>
            <div class="addr-card">
              <div class="addr-card__hd addr-card__hd--emerald">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                Visitor / Shop
              </div>
              <div class="addr-card__body">
                <p class="addr-main">{{ merchant.address.vister_address || '—' }}</p>
                <p>{{ [merchant.address.v_address1, merchant.address.v_address2, merchant.address.v_address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
                <p class="addr-city">{{ merchant.address.v_city }}, {{ merchant.address.v_state }} – {{ merchant.address.v_pincode }}</p>
                <div class="addr-contact">
                  <span v-if="merchant.address.v_mobile && merchant.address.v_mobile !== '0000000000'">📱 {{ merchant.address.v_mobile }}</span>
                  <span v-if="merchant.address.v_phone_number && merchant.address.v_phone_number !== '0000000000'">📞 {{ merchant.address.v_phone_number }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <p>No address information available</p>
        </div>
      </section>

      <!-- ════ TAB: KYC SERVICES ════ -->
      <section v-show="activeTab === 'kyc'" class="tab-section">

        <!-- Global KYC Overview -->
        <div class="card" v-if="merchant.merchantKyc">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">KYC Overview</h3>
            <span class="ml-auto"><span :class="['pill', kycStatusPill(merchant.merchantKyc.globalStatus)]">{{ merchant.merchantKyc.globalStatus }}</span></span>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Global Status</label><p><span :class="['pill', kycStatusPill(merchant.merchantKyc.globalStatus)]">{{ merchant.merchantKyc.globalStatus || '—' }}</span></p></div>
            <div class="info-item"><label>Risk Level</label><p><span :class="['pill', riskPill(merchant.merchantKyc.globalRiskLevel)]">{{ merchant.merchantKyc.globalRiskLevel || '—' }}</span></p></div>
            <div class="info-item"><label>Risk Score</label><p class="font-mono font-bold">{{ merchant.merchantKyc.globalRiskScore ?? '—' }}</p></div>
            <div class="info-item"><label>AML Flag</label><p><span :class="['flag', merchant.merchantKyc.amlFlag ? 'flag--warn' : 'flag--off']">{{ merchant.merchantKyc.amlFlag ? 'Flagged' : 'Clear' }}</span></p></div>
            <div class="info-item"><label>Sanction Match</label><p><span :class="['flag', merchant.merchantKyc.sanctionMatch ? 'flag--warn' : 'flag--off']">{{ merchant.merchantKyc.sanctionMatch ? 'Match' : 'None' }}</span></p></div>
            <div class="info-item"><label>Verified At</label><p>{{ fmtDate(merchant.merchantKyc.globalVerifiedAt) }}</p></div>
            <div class="info-item" v-if="merchant.merchantKyc.remarks"><label>Remarks</label><p>{{ merchant.merchantKyc.remarks }}</p></div>
          </div>
        </div>

        <!-- Service KYC Cards -->
        <template v-if="merchant.merchantservicekyc?.length">
          <div class="card" v-for="svc in merchant.merchantservicekyc" :key="svc.id">
            <div class="card__head">
              <div class="svc-icon-sm">{{ (svc.service || '?').slice(0,2) }}</div>
              <div class="svc-head-info">
                <h3 class="card__title">{{ svc.service }}</h3>
                <span class="svc-interface-chip">{{ svc.interface }}</span>
              </div>
              <div class="svc-head-right ml-auto">
                <span :class="['pill', kycStatusPill(svc.status)]">{{ svc.status || 'PENDING' }}</span>
              </div>
            </div>

            <!-- Risk & flags row -->
            <div class="svc-flags-row">
              <div class="svc-flag-item">
                <span class="svc-flag-label">Risk Level</span>
                <span :class="['pill pill--sm', riskPill(svc.riskLevel)]">{{ svc.riskLevel || '—' }}</span>
              </div>
              <div class="svc-flag-item">
                <span class="svc-flag-label">Risk Score</span>
                <span class="svc-flag-val font-mono">{{ svc.riskScore ?? '—' }}</span>
              </div>
              <div class="svc-flag-item">
                <span class="svc-flag-label">OTP Verified</span>
                <span :class="['flag', svc.otpStatus ? 'flag--on' : 'flag--off']">{{ svc.otpStatus ? 'Done' : 'No' }}</span>
              </div>
              <div class="svc-flag-item">
                <span class="svc-flag-label">Biometric</span>
                <span :class="['flag', svc.biometricRequired ? 'flag--warn' : 'flag--off']">{{ svc.biometricRequired ? 'Required' : 'Not Req.' }}</span>
              </div>
              <div class="svc-flag-item">
                <span class="svc-flag-label">Physical Verify</span>
                <span :class="['flag', svc.physicalVerificationRequired ? 'flag--warn' : 'flag--off']">{{ svc.physicalVerificationRequired ? 'Required' : 'Not Req.' }}</span>
              </div>
              <div class="svc-flag-item">
                <span class="svc-flag-label">AML Flag</span>
                <span :class="['flag', svc.amlFlag ? 'flag--warn' : 'flag--off']">{{ svc.amlFlag ? 'Flagged' : 'Clear' }}</span>
              </div>
              <div class="svc-flag-item">
                <span class="svc-flag-label">Sanction Match</span>
                <span :class="['flag', svc.sanctionMatch ? 'flag--warn' : 'flag--off']">{{ svc.sanctionMatch ? 'Match' : 'None' }}</span>
              </div>
              <div class="svc-flag-item" v-if="svc.verifiedAt">
                <span class="svc-flag-label">Verified At</span>
                <span class="svc-flag-val">{{ fmtDate(svc.verifiedAt) }}</span>
              </div>
            </div>

            <!-- Doc verification grid -->
            <div class="svc-doc-grid">
              <div class="svc-doc-item" v-for="doc in buildDocItems(svc)" :key="doc.key">
                <div class="svc-doc-item__top">
                  <span class="svc-doc-item__name">{{ doc.label }}</span>
                  <span :class="['pill pill--sm', kycStatusPill(doc.status)]">{{ doc.status || 'PENDING' }}</span>
                </div>
                <div class="svc-doc-item__meta" v-if="doc.verifiedAt || doc.reason">
                  <span v-if="doc.verifiedAt" class="svc-doc-item__date">✓ {{ fmtDate(doc.verifiedAt) }}</span>
                  <span v-if="doc.reason" class="svc-doc-item__reason">{{ doc.reason }}</span>
                </div>
              </div>
            </div>

          </div>
        </template>

        <div class="card" v-else>
          <div class="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            <p>No KYC services registered for this merchant</p>
          </div>
        </div>

      </section>

      <!-- ════ TAB: COMMISSIONS ════ -->
      <section v-show="activeTab === 'commissions'" class="tab-section">
        <div class="card">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">Commission Slabs</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--indigo">{{ merchant.commissionconfig?.length || 0 }} slabs</span></span>
          </div>
          <div class="table-scroll-wrap" v-if="merchant.commissionconfig?.length">
            <table class="data-table">
              <thead><tr><th>Method</th><th>Provider</th><th>Txn Type</th><th>Min ₹</th><th>Max ₹</th><th>Merchant</th><th>Vendor</th><th>Aggregator</th><th>Bank</th><th>Active</th></tr></thead>
              <tbody>
                <tr v-for="c in merchant.commissionconfig" :key="c.id">
                  <td><span class="pill pill--sm pill--indigo">{{ c.paymentMethod }}</span></td>
                  <td>{{ c.provider }}</td>
                  <td><span class="pill pill--sm pill--slate">{{ c.txnType }}</span></td>
                  <td>₹ {{ Number(c.minAmount).toLocaleString('en-IN') }}</td>
                  <td>₹ {{ Number(c.maxAmount).toLocaleString('en-IN') }}</td>
                  <td class="rate-cell">{{ c.merchantRate }}{{ c.merchantRateType === 'PERCENTAGE' ? '%' : ' ₹' }}<br><span class="rate-type">{{ c.merchantRateType }}</span></td>
                  <td class="rate-cell">{{ c.vendorRate }}{{ c.vendorRateType === 'PERCENTAGE' ? '%' : ' ₹' }}<br><span class="rate-type">{{ c.vendorRateType }}</span></td>
                  <td class="rate-cell">{{ c.aggregatorRate }}{{ c.aggregatorRateType === 'PERCENTAGE' ? '%' : ' ₹' }}<br><span class="rate-type">{{ c.aggregatorRateType }}</span></td>
                  <td class="rate-cell">{{ c.bankRate }}{{ c.bankRateType === 'PERCENTAGE' ? '%' : ' ₹' }}<br><span class="rate-type">{{ c.bankRateType }}</span></td>
                  <td><span :class="['pill pill--sm', c.active ? 'pill--emerald' : 'pill--red']">{{ c.active ? 'Yes' : 'No' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="empty-state" v-else><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><p>No commission slabs configured</p></div>
        </div>

        <!-- Payment Methods -->
        <div class="card" v-if="merchant.paymethods?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--sky"></div>
            <h3 class="card__title">Payment Methods</h3>
          </div>
          <div class="pay-methods-grid">
            <div class="pay-method-card" v-for="pm in merchant.paymethods" :key="pm.paymentMethod">
              <div class="pay-method-card__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div class="pay-method-card__body">
                <p class="pay-method-card__name">{{ pm.paymentMethod }}</p>
                <p class="pay-method-card__provider">{{ pm.provider }}</p>
              </div>
              <span :class="['pill pill--sm ml-auto', pm.active ? 'pill--emerald' : 'pill--red']">{{ pm.active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ════ TAB: TERMINALS & OUTLETS ════ -->
      <section v-show="activeTab === 'terminals'" class="tab-section">

        <div class="card" v-if="merchant.terminals?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--indigo"></div>
            <h3 class="card__title">Terminals</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--indigo">{{ merchant.terminals.length }}</span></span>
          </div>
          <div class="terminal-grid">
            <div class="terminal-card" v-for="t in merchant.terminals" :key="t.id">
              <div class="terminal-card__top">
                <div class="tc-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg></div>
                <div class="tc-info">
                  <p class="tc-tid">{{ t.tid || 'No TID' }}</p>
                  <p class="tc-type">{{ t.type }} · {{ t.interfaceType }}</p>
                </div>
                <span :class="['pill pill--sm ml-auto', t.status ? 'pill--emerald' : 'pill--red']">{{ t.status ? 'Active' : 'Inactive' }}</span>
              </div>
              <div class="info-grid info-grid--3">
                <div class="info-item"><label>MID</label><p class="font-mono text-xs">{{ t.mid || '—' }}</p></div>
                <div class="info-item"><label>Interface</label><p>{{ t.interface }}</p></div>
                <div class="info-item"><label>Service</label><p>{{ t.service || '—' }}</p></div>
                <div class="info-item"><label>Interface Type</label><p>{{ t.interfaceType || '—' }}</p></div>
                <div class="info-item"><label>Soundbox</label><p><span :class="['flag', t.soundbox ? 'flag--on' : 'flag--off']">{{ t.soundbox ? 'Yes' : 'No' }}</span></p></div>
                <div class="info-item"><label>Risk Flag</label><p><span :class="['pill pill--sm', t.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ t.riskflag }}</span></p></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Outlets -->
        <div class="card" v-if="merchant.outlets?.length">
          <div class="card__head">
            <div class="card__head-dot card__head-dot--emerald"></div>
            <h3 class="card__title">Outlets</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--emerald">{{ merchant.outlets.length }}</span></span>
          </div>
          <div class="outlet-grid">
            <div class="outlet-card" v-for="o in merchant.outlets" :key="o.id">
              <div class="outlet-card__top">
                <div class="outlet-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4"/><path d="M2 13v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"/></svg></div>
                <div class="outlet-info">
                  <p class="outlet-name">{{ o.name }}</p>
                  <p class="outlet-code font-mono text-xs">{{ o.code }} · {{ o.outletId }}</p>
                </div>
                <span :class="['pill pill--sm ml-auto', o.status ? 'pill--emerald' : 'pill--red']">{{ o.status ? 'Active' : 'Inactive' }}</span>
              </div>
              <div class="info-grid info-grid--3">
                <div class="info-item"><label>Latitude</label><p class="font-mono text-xs">{{ o.latitude || '—' }}</p></div>
                <div class="info-item"><label>Longitude</label><p class="font-mono text-xs">{{ o.longitude || '—' }}</p></div>
                <div class="info-item"><label>Users</label><p>{{ o.users?.length || 0 }} user(s)</p></div>
              </div>
              <div v-if="o.users?.length" class="outlet-users">
                <div class="outlet-user" v-for="u in o.users" :key="u.id">
                  <div class="ou-avatar" :style="{ background: avatarBg(u.name) }">{{ (u.name||'U').charAt(0).toUpperCase() }}</div>
                  <div class="ou-info">
                    <p class="ou-name">{{ u.name }}</p>
                    <p class="ou-email text-xs">{{ u.email }}</p>
                  </div>
                  <span :class="['pill pill--sm ml-auto', u.status ? 'pill--emerald' : 'pill--red']">{{ u.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" v-if="!merchant.terminals?.length && !merchant.outlets?.length">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          <p>No terminals or outlets assigned</p>
        </div>
      </section>

      <!-- ════ TAB: DOCUMENTS ════ -->
      <section v-show="activeTab === 'documents'" class="tab-section">
        <div class="docs-grid" v-if="merchant.documents?.length">
          <div class="doc-card" v-for="doc in merchant.documents" :key="doc.id" @click="openDoc(doc)">
            <div class="doc-card__top">
              <div class="doc-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <span :class="['pill pill--sm', docStatusPill(doc.doc_status)]">{{ doc.doc_status }}</span>
            </div>
            <p class="doc-name">{{ doc.doc_name || '—' }}</p>
            <p class="doc-type">{{ doc.doc_type || '—' }}</p>
            <p class="doc-num font-mono text-xs">{{ doc.doc_number || '—' }}</p>
            <div class="doc-count"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>{{ doc.images?.length || 0 }} image(s)</div>
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
                  <td>{{ fmtDate(t.createdAt) }}</td>
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

    <!-- ░░ FOOTER ░░ -->
    <footer class="mg-footer">
      <div class="mg-footer__status"><div class="pulse-dot"></div><span>Live System</span></div>
      <div class="mg-footer__links"><a href="#">Docs</a><a href="#">Compliance</a><a href="#">API</a></div>
    </footer>

    <!-- ░░ DOCUMENT DIALOG ░░ -->
    <Teleport to="body">
      <Transition name="dialog">
        <div v-if="docDialog" class="dialog-overlay" @click.self="docDialog = false">
          <div class="dialog">
            <div class="dialog__hdr">
              <div><p class="dialog__title">{{ selectedDoc?.doc_name }}</p><p class="dialog__sub">{{ selectedDoc?.doc_type }}</p></div>
              <div class="dialog__hdr-right">
                <span :class="['pill pill--sm', docStatusPill(selectedDoc?.doc_status)]">{{ selectedDoc?.doc_status }}</span>
                <button class="icon-close-btn" @click="docDialog = false"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
            </div>
            <div class="dialog__body" v-if="selectedDoc">
              <div class="info-grid info-grid--3" style="border:1px solid #f1f5f9;border-radius:10px;overflow:hidden;margin-bottom:16px;">
                <div class="info-item"><label>Doc Number</label><p class="font-mono">{{ selectedDoc.doc_number || '—' }}</p></div>
                <div class="info-item"><label>Verified By</label><p>{{ selectedDoc.doc_verified_by || '—' }}</p></div>
                <div class="info-item"><label>Result</label><p><span :class="['pill pill--sm', selectedDoc.doc_verified_result ? 'pill--emerald' : 'pill--amber']">{{ selectedDoc.doc_verified_result ? 'Verified' : 'Pending' }}</span></p></div>
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
            <div class="dialog__hdr"><p class="dialog__title">Image Preview</p><button class="icon-close-btn" @click="imgPreview = false"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
            <div class="dialog__body dialog__body--img"><img :src="previewUrl" class="img-preview" /></div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>

  <div v-else class="mg-loader"><div class="mg-loader__spinner"></div></div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAggregatorApi } from "~/composables/apis/useAggregatorApi";
import { useUsersApi } from "~/composables/apis/useUsersApi";

const props = defineProps({ merchantId: String });
const router = useRouter();
const { getMerchantById } = useAggregatorApi();
const { getTransactionsByMerchantId } = useUsersApi();

const merchant = reactive({});
const transactions = ref({ data: [], pagination: {} });
const activeTab = ref('info');
const docDialog = ref(false);
const selectedDoc = ref(null);
const imgPreview = ref(false);
const previewUrl = ref(null);

const tabs = [
  { key: 'info',         label: 'Merchant Info',  icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
  { key: 'address',      label: 'Address',         icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>` },
  { key: 'kyc',          label: 'KYC Services',    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>` },
  { key: 'commissions',  label: 'Commissions',     icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>` },
  { key: 'terminals',    label: 'Terminals',       icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>` },
  { key: 'documents',    label: 'Documents',       icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>` },
  { key: 'transactions', label: 'Transactions',    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>` },
];

// ── Helpers ──────────────────────────────────────────────────────
const fmtDate = (d) => { if (!d) return '—'; const dt = new Date(d); if (isNaN(dt)) return '—'; return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`; };
const genderLabel = (g) => g === 'M' ? 'Male' : g === 'F' ? 'Female' : g === 'O' ? 'Other' : '—';
const mstatusBadge = (s) => { if (!s) return 'mg-badge--pending'; if (['APPROVED','VERIFIED','ACTIVE'].includes(s)) return 'mg-badge--success'; if (['REJECTED','FAILED'].includes(s)) return 'mg-badge--error'; return 'mg-badge--pending'; };
const mstatusBadgeClass = (s) => { if (!s) return 'pill--amber'; if (['APPROVED','VERIFIED','ACTIVE'].includes(s)) return 'pill--emerald'; if (['REJECTED','FAILED'].includes(s)) return 'pill--red'; return 'pill--amber'; };
const kycStatusPill = (s) => { if (!s || s === 'PENDING') return 'pill--amber'; if (['VERIFIED','APPROVED'].includes(s)) return 'pill--emerald'; if (['REJECTED','FAILED','SUSPENDED'].includes(s)) return 'pill--red'; if (['PROCESSING','UNDER_REVIEW','SUBMITTED'].includes(s)) return 'pill--sky'; return 'pill--amber'; };
const riskPill = (s) => { if (!s) return 'pill--slate'; if (s === 'LOW') return 'pill--emerald'; if (s === 'MEDIUM') return 'pill--amber'; if (s === 'HIGH') return 'pill--red'; return 'pill--slate'; };
const docStatusPill = (s) => { if (s==='VERIFIED') return 'pill--emerald'; if (s==='REJECTED') return 'pill--red'; if (s==='SUBMITTED') return 'pill--sky'; return 'pill--amber'; };
const txnPill = (s) => { if (['PAID','SUCCESS'].includes(s)) return 'pill--emerald'; if (['FAILED','CANCELLED'].includes(s)) return 'pill--red'; return 'pill--amber'; };
const AVATAR_COLORS = ['#4f46e5','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#db2777'];
const avatarBg = (name) => AVATAR_COLORS[(name||'?').charCodeAt(0) % AVATAR_COLORS.length];
const openDoc = (doc) => { selectedDoc.value = doc; docDialog.value = true; };
const openPreview = (url) => { previewUrl.value = url; imgPreview.value = true; };

// Build doc verification items from a service KYC record
const buildDocItems = (svc) => [
  { key: 'pan',      label: 'PAN',         status: svc.panStatus,      verifiedAt: svc.panVerifiedAt,      reason: svc.panRejectionReason },
  { key: 'aadhaar',  label: 'Aadhaar',     status: svc.aadhaarStatus,  verifiedAt: svc.aadhaarVerifiedAt,  reason: svc.aadhaarRejectionReason },
  { key: 'bank',     label: 'Bank',        status: svc.bankStatus,     verifiedAt: svc.bankVerifiedAt,     reason: svc.bankRejectionReason },
  { key: 'gst',      label: 'GST',         status: svc.gstStatus,      verifiedAt: svc.gstVerifiedAt,      reason: svc.gstRejectionReason },
  { key: 'storeImg', label: 'Store Image', status: svc.storeImgStatus, verifiedAt: svc.storeImgVerifiedAt, reason: svc.storeImgRejectionReason },
];

// ── Data fetch ────────────────────────────────────────────────────
onMounted(async () => {
  try { const res = await getMerchantById(props.merchantId); Object.assign(merchant, res.data || {}); } catch (e) { console.error('Failed to fetch merchant:', e); }
  try { const res = await getTransactionsByMerchantId(props.merchantId, 1, 20); transactions.value = res; } catch {}
});
</script>

<style scoped>
*,*::before,*::after{box-sizing:border-box;margin:0;}
.mg-shell{min-height:100vh;background:#f1f5f9;font-family:'DM Sans','Manrope','Segoe UI',sans-serif;color:#0f172a;padding-bottom:56px;}

/* ── HEADER ── */
.mg-header{position:sticky;top:0;z-index:50;background:#0f172a;border-bottom:1px solid rgba(255,255,255,0.08);padding:0 20px;box-shadow:0 2px 12px rgba(0,0,0,0.18);}
.mg-header__inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;}
.mg-header__brand{display:flex;align-items:center;gap:12px;min-width:0;}
.mg-brand-text{min-width:0;text-align:right;}
.mg-merchant-name{font-size:17px;font-weight:700;color:#fff;letter-spacing:-.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px;}
.mg-meta{display:flex;align-items:center;gap:6px;margin-top:4px;flex-wrap:wrap;justify-content:flex-end;}
.mg-mid-chip{font-size:9.5px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.1);padding:2px 7px;border-radius:4px;border:1px solid rgba(255,255,255,0.12);white-space:nowrap;}
.mg-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:20px;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;}
.mg-badge--pending{background:rgba(251,191,36,0.18);color:#fbbf24;border:1px solid rgba(251,191,36,0.3);}
.mg-badge--success{background:rgba(52,211,153,0.18);color:#34d399;border:1px solid rgba(52,211,153,0.3);}
.mg-badge--error{background:rgba(248,113,113,0.18);color:#f87171;border:1px solid rgba(248,113,113,0.3);}
.mg-badge--slate{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.12);}
.mg-logo-icon{width:38px;height:38px;background:rgba(255,255,255,0.1);border-radius:10px;display:grid;place-items:center;color:#fff;flex-shrink:0;border:1px solid rgba(255,255,255,0.12);}
.mg-header__left{display:flex;align-items:center;flex:1;}
.btn-back{display:flex;align-items:center;gap:5px;padding:7px 13px;border:1px solid rgba(255,255,255,0.15);border-radius:8px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.8);cursor:pointer;transition:all .15s;font-family:inherit;white-space:nowrap;}
.btn-back:hover{background:rgba(255,255,255,0.14);color:#fff;}

/* ── STAT STRIP ── */
.mg-stat-strip{max-width:1280px;margin:18px auto 0;padding:0 20px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:box-shadow .2s;}
.stat-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.08);}
.stat-card__icon{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;flex-shrink:0;}
.stat-card__icon--blue{background:#dbeafe;color:#2563eb;}
.stat-card__icon--emerald{background:#d1fae5;color:#059669;}
.stat-card__icon--amber{background:#fef3c7;color:#d97706;}
.stat-card__icon--violet{background:#ede9fe;color:#7c3aed;}
.stat-card__body{min-width:0;flex:1;}
.stat-card__label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:3px;}
.stat-card__value{font-size:18px;font-weight:700;color:#0f172a;line-height:1.2;}
.stat-card__value--emerald{color:#059669;}
.stat-card__value--amber{color:#d97706;}
.stat-card__sub{font-size:10px;color:#94a3b8;margin-top:3px;}

/* ── TAB NAV ── */
.mg-tab-wrap{max-width:1280px;margin:18px auto 0;padding:0 20px;}
.mg-tab-nav{display:flex;gap:2px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:4px;overflow-x:auto;scrollbar-width:none;}
.mg-tab-nav::-webkit-scrollbar{display:none;}
.tab-btn{display:flex;align-items:center;gap:6px;padding:8px 14px;border:none;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;background:transparent;color:#64748b;transition:all .15s;flex-shrink:0;font-family:inherit;}
.tab-btn:hover{background:#f1f5f9;color:#0f172a;}
.tab-btn--active{background:#0f172a;color:#fff;box-shadow:0 2px 8px rgba(15,23,42,.2);}
.tab-btn__icon{display:flex;align-items:center;}

/* ── CONTENT ── */
.mg-content{max-width:1280px;margin:18px auto 0;padding:0 20px;}
.tab-section{display:flex;flex-direction:column;gap:16px;}

/* ── CARD ── */
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
.card__ro-badge{margin-left:auto;font-size:9px;font-weight:700;color:#94a3b8;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:5px;padding:2px 8px;text-transform:uppercase;letter-spacing:.5px;}

/* ── INFO GRID ── */
.info-grid{display:grid;gap:0;}
.info-grid--4{grid-template-columns:repeat(4,1fr);}
.info-grid--3{grid-template-columns:repeat(3,1fr);}
.info-item{padding:14px 18px;border-right:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9;}
.info-grid--4 .info-item:nth-child(4n){border-right:none;}
.info-grid--3 .info-item:nth-child(3n){border-right:none;}
.info-item label{font-size:9.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;display:block;margin-bottom:4px;}
.info-item p{font-size:13px;font-weight:500;color:#0f172a;}

/* ── API KEY ── */
.api-key-row{display:flex;align-items:center;gap:10px;padding:12px 18px;border-top:1px solid #f1f5f9;background:#fafafa;flex-wrap:wrap;}
.api-key-row__label{font-size:9.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;flex-shrink:0;}
.api-key-val{color:#475569;word-break:break-all;}

/* ── KYC SERVICE CARDS ── */
.svc-icon-sm{width:34px;height:34px;border-radius:9px;background:#0f172a;color:#fff;display:grid;place-items:center;font-size:10px;font-weight:800;flex-shrink:0;}
.svc-head-info{display:flex;align-items:center;gap:8px;min-width:0;}
.svc-interface-chip{font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;background:#e0e7ff;color:#4338ca;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;}
.svc-head-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.svc-flags-row{display:flex;flex-wrap:wrap;gap:8px 18px;padding:12px 18px;border-bottom:1px solid #f1f5f9;background:#fafafa;}
.svc-flag-item{display:flex;align-items:center;gap:6px;}
.svc-flag-label{font-size:9.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;}
.svc-flag-val{font-size:12px;font-weight:600;color:#0f172a;}
.svc-doc-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;}
.svc-doc-item{padding:14px 16px;border-right:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9;}
.svc-doc-item:nth-child(5n){border-right:none;}
.svc-doc-item__top{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:5px;}
.svc-doc-item__name{font-size:11.5px;font-weight:700;color:#0f172a;}
.svc-doc-item__meta{display:flex;flex-direction:column;gap:2px;}
.svc-doc-item__date{font-size:10px;color:#64748b;}
.svc-doc-item__reason{font-size:10px;color:#ef4444;}

/* ── TABLE ── */
.table-scroll-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.data-table{width:100%;border-collapse:collapse;font-size:12.5px;min-width:480px;}
.data-table thead{background:#f8fafc;}
.data-table th{padding:10px 14px;text-align:left;font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;border-bottom:1px solid #f1f5f9;white-space:nowrap;}
.data-table td{padding:11px 14px;color:#334155;border-bottom:1px solid #f9fafb;vertical-align:top;}
.data-table tbody tr:last-child td{border-bottom:none;}
.data-table tbody tr:hover td{background:#f8fafc;}
.rate-cell{font-family:'JetBrains Mono',monospace;font-weight:700;color:#4f46e5;font-size:12px;}
.rate-type{font-size:9.5px;font-weight:600;color:#94a3b8;text-transform:uppercase;font-family:inherit;}

/* ── PILLS / FLAGS ── */
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
.flag--warn{background:#fef3c7;color:#92400e;}

/* ── ADDRESS ── */
.addr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:16px 18px;}
.addr-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;}
.addr-card__hd{display:flex;align-items:center;gap:8px;padding:11px 14px;font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.7px;}
.addr-card__hd--blue{background:#eff6ff;color:#1d4ed8;border-bottom:1px solid #dbeafe;}
.addr-card__hd--violet{background:#f5f3ff;color:#6d28d9;border-bottom:1px solid #ddd6fe;}
.addr-card__hd--emerald{background:#f0fdf4;color:#065f46;border-bottom:1px solid #bbf7d0;}
.addr-card__body{padding:14px;font-size:12.5px;color:#334155;line-height:1.75;}
.addr-main{font-weight:600;color:#0f172a;}
.addr-city{color:#64748b;font-size:11.5px;margin-top:5px;font-weight:600;}
.addr-contact{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;font-size:11px;color:#64748b;}
.addr-link{color:#2563eb;text-decoration:none;font-weight:600;}
.addr-link:hover{text-decoration:underline;}

/* ── PAYMENT METHODS ── */
.pay-methods-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;padding:16px 18px;}
.pay-method-card{display:flex;align-items:center;gap:10px;padding:13px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;}
.pay-method-card__icon{width:34px;height:34px;border-radius:8px;background:#e0e7ff;color:#4338ca;display:grid;place-items:center;flex-shrink:0;}
.pay-method-card__body{flex:1;min-width:0;}
.pay-method-card__name{font-size:13px;font-weight:700;color:#0f172a;}
.pay-method-card__provider{font-size:11px;color:#64748b;margin-top:2px;}

/* ── TERMINALS ── */
.terminal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;padding:14px 18px;}
.terminal-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;}
.terminal-card__top{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid #f1f5f9;background:#fff;}
.tc-icon{width:35px;height:35px;border-radius:9px;background:#e0e7ff;color:#4338ca;display:grid;place-items:center;flex-shrink:0;}
.tc-info{flex:1;min-width:0;}
.tc-tid{font-size:13.5px;font-weight:700;color:#0f172a;}
.tc-type{font-size:11px;color:#64748b;margin-top:2px;}

/* ── OUTLETS ── */
.outlet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px;padding:14px 18px;}
.outlet-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;}
.outlet-card__top{display:flex;align-items:center;gap:10px;padding:14px;border-bottom:1px solid #f1f5f9;background:#fff;}
.outlet-icon{width:35px;height:35px;border-radius:9px;background:#d1fae5;color:#059669;display:grid;place-items:center;flex-shrink:0;}
.outlet-info{flex:1;min-width:0;}
.outlet-name{font-size:13.5px;font-weight:700;color:#0f172a;}
.outlet-code{color:#94a3b8;margin-top:2px;}
.outlet-users{padding:10px 14px;border-top:1px solid #f1f5f9;display:flex;flex-direction:column;gap:8px;}
.outlet-user{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff;border:1px solid #f1f5f9;border-radius:8px;}
.ou-avatar{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;}
.ou-info{flex:1;min-width:0;}
.ou-name{font-size:12.5px;font-weight:600;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.ou-email{color:#94a3b8;}

/* ── DOCUMENTS ── */
.docs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}
.doc-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:transform .15s,box-shadow .15s;}
.doc-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.1);}
.doc-card__top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
.doc-icon{width:36px;height:36px;border-radius:10px;background:#e0e7ff;color:#4338ca;display:grid;place-items:center;}
.doc-name{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:3px;}
.doc-type{font-size:11px;color:#64748b;margin-bottom:3px;}
.doc-num{font-size:10.5px;color:#94a3b8;margin-bottom:8px;}
.doc-count{display:flex;align-items:center;gap:5px;font-size:11px;color:#94a3b8;}

/* ── EMPTY STATE ── */
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:40px 20px;color:#94a3b8;text-align:center;}
.empty-state p{font-size:13px;font-weight:500;}

/* ── FOOTER ── */
.mg-footer{position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e2e8f0;padding:0 20px;height:44px;display:flex;align-items:center;justify-content:space-between;z-index:40;}
.mg-footer__status{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#64748b;}
.mg-footer__links{display:flex;gap:16px;}
.mg-footer__links a{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:#94a3b8;text-decoration:none;}
.mg-footer__links a:hover{color:#475569;}
.pulse-dot{width:7px;height:7px;border-radius:50%;background:#10b981;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4);}50%{box-shadow:0 0 0 4px rgba(16,185,129,0);}}

/* ── DIALOG ── */
.dialog-overlay{position:fixed;inset:0;z-index:400;background:rgba(15,23,42,.45);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:20px;}
.dialog{background:#fff;border-radius:16px;width:100%;max-width:760px;box-shadow:0 24px 64px rgba(0,0,0,.2);overflow:hidden;max-height:90dvh;display:flex;flex-direction:column;}
.dialog--img{max-width:600px;}
.dialog__hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #f1f5f9;flex-shrink:0;}
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
.img-preview{width:100%;max-height:520px;object-fit:contain;border-radius:8px;}
.dialog-enter-active,.dialog-leave-active{transition:opacity .2s ease;}
.dialog-enter-from,.dialog-leave-to{opacity:0;}

/* ── LOADER ── */
.mg-loader{display:flex;align-items:center;justify-content:center;height:100vh;background:#f1f5f9;}
.mg-loader__spinner{width:40px;height:40px;border:3px solid #e2e8f0;border-top-color:#0f172a;border-radius:50%;animation:spin .8s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}

/* ── UTILITIES ── */
.ml-auto{margin-left:auto;}
.font-mono{font-family:'JetBrains Mono','Fira Code',monospace;}
.font-bold{font-weight:700;}
.text-xs{font-size:11px;}

/* ══ TABLET ≤1024px ══ */
@media(max-width:1024px){
  .mg-stat-strip{grid-template-columns:repeat(2,1fr);}
  .info-grid--4{grid-template-columns:repeat(2,1fr);}
  .info-grid--4 .info-item:nth-child(4n){border-right:1px solid #f1f5f9;}
  .info-grid--4 .info-item:nth-child(2n){border-right:none;}
  .info-grid--3{grid-template-columns:repeat(2,1fr);}
  .info-grid--3 .info-item:nth-child(3n){border-right:1px solid #f1f5f9;}
  .info-grid--3 .info-item:nth-child(2n){border-right:none;}
  .addr-grid{grid-template-columns:repeat(2,1fr);}
  .svc-doc-grid{grid-template-columns:repeat(3,1fr);}
  .svc-doc-item:nth-child(5n){border-right:1px solid #f1f5f9;}
  .svc-doc-item:nth-child(3n){border-right:none;}
}

/* ══ MOBILE ≤640px ══ */
@media(max-width:640px){
  .mg-header{padding:0 14px;}
  .mg-header__inner{padding:10px 0;gap:8px;}
  .mg-merchant-name{font-size:14px;max-width:160px;}
  .mg-logo-icon{width:32px;height:32px;border-radius:8px;}
  .mg-logo-icon svg{width:15px;height:15px;}
  .mg-mid-chip{font-size:8.5px;}
  .mg-badge{font-size:8px;padding:1px 5px;}
  .btn-back{padding:6px 9px;font-size:11.5px;}

  .mg-stat-strip{margin-top:12px;padding:0 14px;grid-template-columns:repeat(2,1fr);gap:10px;}
  .stat-card{padding:12px 11px;gap:9px;border-radius:12px;}
  .stat-card__icon{width:32px;height:32px;border-radius:8px;}
  .stat-card__icon svg{width:14px;height:14px;}
  .stat-card__label{font-size:9px;}
  .stat-card__value{font-size:14px;}
  .stat-card__sub{display:none;}

  .mg-tab-wrap{position:fixed;bottom:44px;left:0;right:0;z-index:45;margin:0;padding:0;background:#fff;border-top:1px solid #e2e8f0;box-shadow:0 -2px 10px rgba(0,0,0,.07);}
  .mg-tab-nav{border-radius:0;border:none;padding:0;gap:0;background:transparent;justify-content:space-around;}
  .tab-btn{flex:1;flex-direction:column;align-items:center;justify-content:center;padding:7px 4px 5px;gap:3px;border-radius:0;min-width:0;}
  .tab-btn__icon svg{width:17px;height:17px;}
  .tab-btn__label{font-size:8.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:50px;display:block;}
  .tab-btn--active{background:transparent;color:#4f46e5;box-shadow:none;}

  .mg-shell{padding-bottom:110px;}
  .mg-footer{display:none;}

  .mg-content{padding:0 14px;margin-top:14px;}
  .tab-section{gap:12px;}
  .card{border-radius:12px;}
  .card__head{padding:11px 14px;}
  .card__title{font-size:12.5px;}

  .info-grid--4,.info-grid--3{grid-template-columns:repeat(2,1fr);}
  .info-grid--4 .info-item:nth-child(4n),.info-grid--3 .info-item:nth-child(3n){border-right:1px solid #f1f5f9;}
  .info-grid--4 .info-item:nth-child(2n),.info-grid--3 .info-item:nth-child(2n){border-right:none;}
  .info-item{padding:11px 13px;}
  .info-item label{font-size:9px;}
  .info-item p{font-size:12px;}

  .addr-grid{grid-template-columns:1fr;padding:12px 14px;}
  .terminal-grid{grid-template-columns:1fr;padding:12px 14px;}
  .outlet-grid{grid-template-columns:1fr;padding:12px 14px;}
  .pay-methods-grid{grid-template-columns:1fr;padding:12px 14px;}
  .docs-grid{grid-template-columns:1fr 1fr;gap:10px;}
  .svc-doc-grid{grid-template-columns:repeat(2,1fr);}
  .svc-doc-item:nth-child(5n){border-right:1px solid #f1f5f9;}
  .svc-doc-item:nth-child(3n){border-right:1px solid #f1f5f9;}
  .svc-doc-item:nth-child(2n){border-right:none;}
  .svc-flags-row{gap:6px 12px;padding:10px 14px;}

  .dialog-overlay{padding:10px;}
  .dialog{max-height:95dvh;border-radius:12px;}
  .doc-img-grid{grid-template-columns:repeat(2,1fr);}
}

/* ══ XS ≤400px ══ */
@media(max-width:400px){
  .info-grid--4,.info-grid--3{grid-template-columns:1fr;}
  .info-grid--4 .info-item,.info-grid--3 .info-item{border-right:none;}
  .docs-grid{grid-template-columns:1fr;}
  .svc-doc-grid{grid-template-columns:1fr;}
  .svc-doc-item{border-right:none;}
}
</style>