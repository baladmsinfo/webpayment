<template>
  <div class="view-root" v-if="merchant && merchant.id">

    <!-- ── Page Header ── -->
    <div class="view-header">
      <div class="view-header__left">
        <button class="btn-back" @click="router.back()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div class="view-brand">
          <div class="view-avatar" :style="{ background: avatarBg(merchant.legal_name || merchant.business_name || 'M') }">
            {{ initials(merchant.legal_name || merchant.business_name || 'M') }}
          </div>
          <div class="view-brand-text">
            <h1 class="view-merchant-name">{{ merchant.legal_name || merchant.business_name || '—' }}</h1>
            <div class="view-meta">
              <span class="mid-chip">{{ merchant.mid }}</span>
              <span :class="['status-pill', mstatusBadge(merchant.mstatus)]">{{ merchant.mstatus }}</span>
              <span :class="['status-pill', merchant.status ? 'pill--emerald' : 'pill--red']">{{ merchant.status ? 'Active' : 'Inactive' }}</span>
              <span class="status-pill pill--slate">{{ merchant.interface }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="live-badge"><span class="live-dot"></span>Live</div>
    </div>

    <!-- ── KPI Strip ── -->
    <div class="kpi-strip">
      <div class="kpi-card" style="--kc:#1142d4">
        <div class="kpi-icon-wrap" style="background:rgba(17,66,212,.1)"><span class="mdi mdi-credit-card-outline" style="color:#1142d4"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Terminals</p>
          <p class="kpi-value">{{ merchant.terminals?.length || 0 }}</p>
          <p class="kpi-sub">Assigned devices</p>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#059669">
        <div class="kpi-icon-wrap" style="background:rgba(5,150,105,.1)"><span class="mdi mdi-cash-multiple" style="color:#059669"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Commissions</p>
          <p class="kpi-value" style="color:#059669">{{ merchant.commissionconfig?.length || 0 }}</p>
          <p class="kpi-sub">Active slabs</p>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#d97706">
        <div class="kpi-icon-wrap" style="background:rgba(217,119,6,.1)"><span class="mdi mdi-store-outline" style="color:#d97706"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">Outlets</p>
          <p class="kpi-value" style="color:#d97706">{{ merchant.outlets?.length || 0 }}</p>
          <p class="kpi-sub">Branch locations</p>
        </div>
      </div>
      <div class="kpi-card" style="--kc:#7c3aed">
        <div class="kpi-icon-wrap" style="background:rgba(124,58,237,.1)"><span class="mdi mdi-shield-check-outline" style="color:#7c3aed"></span></div>
        <div class="kpi-body">
          <p class="kpi-label">KYC Services</p>
          <p class="kpi-value">{{ merchant.merchantservicekyc?.length || 0 }}</p>
          <p class="kpi-sub">Registered services</p>
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

      <!-- ════ TAB: MERCHANT INFO ════ -->
      <section v-show="activeTab === 'info'" class="tab-section">

        <!-- Identity -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-account-circle-outline"></span></div>
            <h3 class="card-title">Merchant Identity</h3>
            <span class="ro-badge">View Only</span>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Legal Name</label><p>{{ merchant.legal_name || '—' }}</p></div>
            <div class="info-item"><label>Business Name</label><p>{{ merchant.business_name || '—' }}</p></div>
            <div class="info-item"><label>MID</label><p class="mono">{{ merchant.mid || '—' }}</p></div>
            <div class="info-item"><label>App ID</label><p class="mono text-xs">{{ merchant.appid || '—' }}</p></div>
            <div class="info-item"><label>Interface</label><p><span class="pill pill--indigo">{{ merchant.interface || '—' }}</span></p></div>
            <div class="info-item"><label>Lifecycle Status</label><p><span :class="['pill', mstatusBadgeClass(merchant.mstatus)]">{{ merchant.mstatus || '—' }}</span></p></div>
            <div class="info-item"><label>Active</label><p><span :class="['pill', merchant.status ? 'pill--emerald' : 'pill--red']">{{ merchant.status ? 'Active' : 'Inactive' }}</span></p></div>
            <div class="info-item"><label>Risk Flag</label><p><span :class="['pill', merchant.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ merchant.riskflag }}</span></p></div>
            <div class="info-item"><label>Lead Source</label><p>{{ merchant.lead_source || '—' }}</p></div>
            <div class="info-item"><label>LG Code</label><p class="mono">{{ merchant.lg_code || '—' }}</p></div>
            <div class="info-item"><label>Created At</label><p>{{ fmtDate(merchant.createdAt) }}</p></div>
            <div class="info-item"><label>Verified At</label><p>{{ fmtDate(merchant.verifiedAt) }}</p></div>
          </div>
        </div>

        <!-- Merchant Info -->
        <div class="card" v-if="merchant.merchantinfo">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(8,145,178,.1);color:#0891b2"><span class="mdi mdi-information-outline"></span></div>
            <h3 class="card-title">Merchant Info</h3>
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
            <div class="info-item"><label>Application ID</label><p class="mono text-xs">{{ merchant.merchantinfo.application_id || '—' }}</p></div>
          </div>
        </div>

        <!-- GST -->
        <div class="card" v-if="merchant.merchantgst">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706"><span class="mdi mdi-receipt-text-outline"></span></div>
            <h3 class="card-title">GST Information</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>GSTIN</label><p class="mono">{{ merchant.merchantgst.gstin || '—' }}</p></div>
            <div class="info-item"><label>Business Name</label><p>{{ merchant.merchantgst.business_name || '—' }}</p></div>
          </div>
        </div>

        <!-- Settlement Account -->
        <div class="card" v-if="merchant.settlementaccount">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669"><span class="mdi mdi-bank-outline"></span></div>
            <h3 class="card-title">Settlement Account</h3>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Account Holder</label><p>{{ merchant.settlementaccount.account_holder_name || '—' }}</p></div>
            <div class="info-item"><label>Account Type</label><p>{{ merchant.settlementaccount.account_type || '—' }}</p></div>
            <div class="info-item"><label>Bank Name</label><p>{{ merchant.settlementaccount.bank_name || '—' }}</p></div>
            <div class="info-item"><label>Account No</label><p class="mono">{{ merchant.settlementaccount.bank_account_no || '—' }}</p></div>
            <div class="info-item"><label>IFSC Code</label><p class="mono">{{ merchant.settlementaccount.bank_ifsc_code || '—' }}</p></div>
            <div class="info-item"><label>Branch Name</label><p>{{ merchant.settlementaccount.branch_name || '—' }}</p></div>
            <div class="info-item"><label>City</label><p>{{ merchant.settlementaccount.city || '—' }}</p></div>
            <div class="info-item"><label>Holder Verified</label>
              <p><span :class="['pill', merchant.settlementaccount.account_holder_result ? 'pill--emerald' : 'pill--amber']">{{ merchant.settlementaccount.account_holder_result ? 'Verified' : 'Pending' }}</span></p>
            </div>
          </div>
        </div>

        <!-- PAN -->
        <div class="card" v-if="merchant.merchantpan?.length">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(244,63,94,.1);color:#f43f5e"><span class="mdi mdi-card-account-details-outline"></span></div>
            <h3 class="card-title">PAN Information</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ merchant.merchantpan.length }} record(s)</span></span>
          </div>
          <div class="table-scroll">
            <table class="data-table">
              <thead><tr><th>PAN</th><th>Name</th><th>Entity PAN</th><th>Father Name</th><th>DOB</th><th>Partner</th></tr></thead>
              <tbody>
                <tr v-for="pan in merchant.merchantpan" :key="pan.id">
                  <td class="mono">{{ pan.pan || '—' }}</td>
                  <td>{{ pan.pan_name || '—' }}</td>
                  <td class="mono">{{ pan.entity_pan || '—' }}</td>
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
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(124,58,237,.1);color:#7c3aed"><span class="mdi mdi-account-key-outline"></span></div>
            <h3 class="card-title">User Account</h3>
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
            <span class="api-key-label"><span class="mdi mdi-key-outline"></span> API Key</span>
            <span class="mono text-xs api-key-val">{{ merchant.user.apiKey?.slice(0,44) + '…' }}</span>
          </div>
        </div>

      </section>

      <!-- ════ TAB: ADDRESS ════ -->
      <section v-show="activeTab === 'address'" class="tab-section">
        <div class="card" v-if="merchant.address">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(8,145,178,.1);color:#0891b2"><span class="mdi mdi-map-marker-outline"></span></div>
            <h3 class="card-title">Address Details</h3>
          </div>
          <div class="addr-grid">
            <div class="addr-card">
              <div class="addr-card-hd" style="background:#eff6ff;color:#1d4ed8;border-bottom:1px solid #dbeafe">
                <span class="mdi mdi-office-building-outline"></span> Official Address
              </div>
              <div class="addr-card-body">
                <p class="addr-main">{{ merchant.address.official_address || '—' }}</p>
                <p>{{ [merchant.address.address1, merchant.address.address2, merchant.address.address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
                <p class="addr-city">{{ merchant.address.city }}, {{ merchant.address.state }} – {{ merchant.address.pincode }}</p>
                <div class="addr-contact">
                  <span v-if="merchant.address.phone && merchant.address.phone !== '0000000000'"><span class="mdi mdi-phone-outline"></span> {{ merchant.address.phone }}</span>
                  <span v-if="merchant.address.mobile_number && merchant.address.mobile_number !== '0000000000'"><span class="mdi mdi-cellphone"></span> {{ merchant.address.mobile_number }}</span>
                  <a v-if="merchant.address.website" :href="'https://'+merchant.address.website.replace(/^https?:\/\//,'')" class="addr-link" target="_blank"><span class="mdi mdi-web"></span> {{ merchant.address.website }}</a>
                </div>
              </div>
            </div>
            <div class="addr-card">
              <div class="addr-card-hd" style="background:#f5f3ff;color:#6d28d9;border-bottom:1px solid #ddd6fe">
                <span class="mdi mdi-home-outline"></span> Residential Address
              </div>
              <div class="addr-card-body">
                <p class="addr-main">{{ merchant.address.residential_address || '—' }}</p>
                <p>{{ [merchant.address.res_address1, merchant.address.res_address2, merchant.address.res_address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
                <p class="addr-city">{{ merchant.address.res_city }}, {{ merchant.address.res_state }} – {{ merchant.address.res_pincode }}</p>
                <div class="addr-contact">
                  <span v-if="merchant.address.res_mobile && merchant.address.res_mobile !== '0000000000'"><span class="mdi mdi-cellphone"></span> {{ merchant.address.res_mobile }}</span>
                  <span v-if="merchant.address.res_phone_number && merchant.address.res_phone_number !== '0000000000'"><span class="mdi mdi-phone-outline"></span> {{ merchant.address.res_phone_number }}</span>
                </div>
              </div>
            </div>
            <div class="addr-card">
              <div class="addr-card-hd" style="background:#f0fdf4;color:#065f46;border-bottom:1px solid #bbf7d0">
                <span class="mdi mdi-store-outline"></span> Visitor / Shop
              </div>
              <div class="addr-card-body">
                <p class="addr-main">{{ merchant.address.vister_address || '—' }}</p>
                <p>{{ [merchant.address.v_address1, merchant.address.v_address2, merchant.address.v_address3].filter(v => v && v !== 'N/A').join(', ') || '—' }}</p>
                <p class="addr-city">{{ merchant.address.v_city }}, {{ merchant.address.v_state }} – {{ merchant.address.v_pincode }}</p>
                <div class="addr-contact">
                  <span v-if="merchant.address.v_mobile && merchant.address.v_mobile !== '0000000000'"><span class="mdi mdi-cellphone"></span> {{ merchant.address.v_mobile }}</span>
                  <span v-if="merchant.address.v_phone_number && merchant.address.v_phone_number !== '0000000000'"><span class="mdi mdi-phone-outline"></span> {{ merchant.address.v_phone_number }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-icon-wrap"><span class="mdi mdi-map-marker-off-outline"></span></div>
          <p class="empty-title">No address information available</p>
        </div>
      </section>

      <!-- ════ TAB: KYC SERVICES ════ -->
      <section v-show="activeTab === 'kyc'" class="tab-section">
        <div class="card" v-if="merchant.merchantKyc">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-shield-account-outline"></span></div>
            <h3 class="card-title">KYC Overview</h3>
            <span class="ml-auto"><span :class="['pill', kycStatusPill(merchant.merchantKyc.globalStatus)]">{{ merchant.merchantKyc.globalStatus }}</span></span>
          </div>
          <div class="info-grid info-grid--4">
            <div class="info-item"><label>Global Status</label><p><span :class="['pill', kycStatusPill(merchant.merchantKyc.globalStatus)]">{{ merchant.merchantKyc.globalStatus || '—' }}</span></p></div>
            <div class="info-item"><label>Risk Level</label><p><span :class="['pill', riskPill(merchant.merchantKyc.globalRiskLevel)]">{{ merchant.merchantKyc.globalRiskLevel || '—' }}</span></p></div>
            <div class="info-item"><label>Risk Score</label><p class="mono font-bold">{{ merchant.merchantKyc.globalRiskScore ?? '—' }}</p></div>
            <div class="info-item"><label>AML Flag</label><p><span :class="['flag', merchant.merchantKyc.amlFlag ? 'flag--warn' : 'flag--off']">{{ merchant.merchantKyc.amlFlag ? 'Flagged' : 'Clear' }}</span></p></div>
            <div class="info-item"><label>Sanction Match</label><p><span :class="['flag', merchant.merchantKyc.sanctionMatch ? 'flag--warn' : 'flag--off']">{{ merchant.merchantKyc.sanctionMatch ? 'Match' : 'None' }}</span></p></div>
            <div class="info-item"><label>Verified At</label><p>{{ fmtDate(merchant.merchantKyc.globalVerifiedAt) }}</p></div>
            <div class="info-item" v-if="merchant.merchantKyc.remarks"><label>Remarks</label><p>{{ merchant.merchantKyc.remarks }}</p></div>
          </div>
        </div>

        <template v-if="merchant.merchantservicekyc?.length">
          <div class="card" v-for="svc in merchant.merchantservicekyc" :key="svc.id">
            <div class="card-header">
              <div class="svc-icon-badge">{{ (svc.service || '?').slice(0,2) }}</div>
              <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                <h3 class="card-title">{{ svc.service }}</h3>
                <span class="interface-chip">{{ svc.interface }}</span>
              </div>
              <span class="ml-auto"><span :class="['pill', kycStatusPill(svc.status)]">{{ svc.status || 'PENDING' }}</span></span>
            </div>
            <div class="svc-flags-row">
              <div class="svc-flag-item"><span class="svc-flag-label">Risk Level</span><span :class="['pill pill--sm', riskPill(svc.riskLevel)]">{{ svc.riskLevel || '—' }}</span></div>
              <div class="svc-flag-item"><span class="svc-flag-label">Risk Score</span><span class="svc-flag-val mono">{{ svc.riskScore ?? '—' }}</span></div>
              <div class="svc-flag-item"><span class="svc-flag-label">OTP Verified</span><span :class="['flag', svc.otpStatus ? 'flag--on' : 'flag--off']">{{ svc.otpStatus ? 'Done' : 'No' }}</span></div>
              <div class="svc-flag-item"><span class="svc-flag-label">Biometric</span><span :class="['flag', svc.biometricRequired ? 'flag--warn' : 'flag--off']">{{ svc.biometricRequired ? 'Required' : 'Not Req.' }}</span></div>
              <div class="svc-flag-item"><span class="svc-flag-label">Physical Verify</span><span :class="['flag', svc.physicalVerificationRequired ? 'flag--warn' : 'flag--off']">{{ svc.physicalVerificationRequired ? 'Required' : 'Not Req.' }}</span></div>
              <div class="svc-flag-item"><span class="svc-flag-label">AML Flag</span><span :class="['flag', svc.amlFlag ? 'flag--warn' : 'flag--off']">{{ svc.amlFlag ? 'Flagged' : 'Clear' }}</span></div>
              <div class="svc-flag-item"><span class="svc-flag-label">Sanction Match</span><span :class="['flag', svc.sanctionMatch ? 'flag--warn' : 'flag--off']">{{ svc.sanctionMatch ? 'Match' : 'None' }}</span></div>
              <div class="svc-flag-item" v-if="svc.verifiedAt"><span class="svc-flag-label">Verified At</span><span class="svc-flag-val">{{ fmtDate(svc.verifiedAt) }}</span></div>
            </div>
            <div class="svc-doc-grid">
              <div class="svc-doc-item" v-for="doc in buildDocItems(svc)" :key="doc.key">
                <div class="svc-doc-top">
                  <span class="svc-doc-name">{{ doc.label }}</span>
                  <span :class="['pill pill--sm', kycStatusPill(doc.status)]">{{ doc.status || 'PENDING' }}</span>
                </div>
                <div class="svc-doc-meta" v-if="doc.verifiedAt || doc.reason">
                  <span v-if="doc.verifiedAt" class="svc-doc-date"><span class="mdi mdi-check-circle-outline"></span> {{ fmtDate(doc.verifiedAt) }}</span>
                  <span v-if="doc.reason" class="svc-doc-reason">{{ doc.reason }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="card" v-else>
          <div class="empty-state">
            <div class="empty-icon-wrap" style="background:rgba(124,58,237,.1);color:#7c3aed"><span class="mdi mdi-shield-off-outline"></span></div>
            <p class="empty-title">No KYC services registered for this merchant</p>
          </div>
        </div>
      </section>

      <!-- ════ TAB: COMMISSIONS ════ -->
      <section v-show="activeTab === 'commissions'" class="tab-section">
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-percent-box-outline"></span></div>
            <h3 class="card-title">Commission Slabs</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--indigo">{{ merchant.commissionconfig?.length || 0 }} slabs</span></span>
          </div>
          <div class="table-scroll" v-if="merchant.commissionconfig?.length">
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
          <div class="empty-state" v-else>
            <div class="empty-icon-wrap" style="background:rgba(5,150,105,.1);color:#059669"><span class="mdi mdi-cash-off"></span></div>
            <p class="empty-title">No commission slabs configured</p>
          </div>
        </div>

        <div class="card" v-if="merchant.paymethods?.length">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(8,145,178,.1);color:#0891b2"><span class="mdi mdi-credit-card-multiple-outline"></span></div>
            <h3 class="card-title">Payment Methods</h3>
          </div>
          <div class="pay-methods-grid">
            <div class="pay-method-card" v-for="pm in merchant.paymethods" :key="pm.paymentMethod">
              <div class="pay-method-icon"><span class="mdi mdi-credit-card-outline"></span></div>
              <div class="pay-method-body">
                <p class="pay-method-name">{{ pm.paymentMethod }}</p>
                <p class="pay-method-provider">{{ pm.provider }}</p>
              </div>
              <span :class="['pill pill--sm ml-auto', pm.active ? 'pill--emerald' : 'pill--red']">{{ pm.active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ════ TAB: TERMINALS & OUTLETS ════ -->
      <section v-show="activeTab === 'terminals'" class="tab-section">
        <div class="card" v-if="merchant.terminals?.length">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-point-of-sale"></span></div>
            <h3 class="card-title">Terminals</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--indigo">{{ merchant.terminals.length }}</span></span>
          </div>
          <div class="terminal-grid">
            <div class="terminal-card" v-for="t in merchant.terminals" :key="t.id">
              <div class="terminal-top">
                <div class="terminal-icon"><span class="mdi mdi-credit-card-chip-outline"></span></div>
                <div class="terminal-info">
                  <p class="terminal-tid">{{ t.tid || 'No TID' }}</p>
                  <p class="terminal-type">{{ t.type }} · {{ t.interfaceType }}</p>
                </div>
                <span :class="['pill pill--sm ml-auto', t.status ? 'pill--emerald' : 'pill--red']">{{ t.status ? 'Active' : 'Inactive' }}</span>
              </div>
              <div class="info-grid info-grid--3">
                <div class="info-item"><label>MID</label><p class="mono text-xs">{{ t.mid || '—' }}</p></div>
                <div class="info-item"><label>Interface</label><p>{{ t.interface }}</p></div>
                <div class="info-item"><label>Service</label><p>{{ t.service || '—' }}</p></div>
                <div class="info-item"><label>Interface Type</label><p>{{ t.interfaceType || '—' }}</p></div>
                <div class="info-item"><label>Soundbox</label><p><span :class="['flag', t.soundbox ? 'flag--on' : 'flag--off']">{{ t.soundbox ? 'Yes' : 'No' }}</span></p></div>
                <div class="info-item"><label>Risk Flag</label><p><span :class="['pill pill--sm', t.riskflag > 0 ? 'pill--red' : 'pill--emerald']">{{ t.riskflag }}</span></p></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card" v-if="merchant.outlets?.length">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(5,150,105,.1);color:#059669"><span class="mdi mdi-store-outline"></span></div>
            <h3 class="card-title">Outlets</h3>
            <span class="ml-auto"><span class="pill pill--sm pill--emerald">{{ merchant.outlets.length }}</span></span>
          </div>
          <div class="outlet-grid">
            <div class="outlet-card" v-for="o in merchant.outlets" :key="o.id">
              <div class="outlet-top">
                <div class="outlet-icon"><span class="mdi mdi-store-check-outline"></span></div>
                <div class="outlet-info">
                  <p class="outlet-name">{{ o.name }}</p>
                  <p class="outlet-code mono text-xs">{{ o.code }} · {{ o.outletId }}</p>
                </div>
                <span :class="['pill pill--sm ml-auto', o.status ? 'pill--emerald' : 'pill--red']">{{ o.status ? 'Active' : 'Inactive' }}</span>
              </div>
              <div class="info-grid info-grid--3">
                <div class="info-item"><label>Latitude</label><p class="mono text-xs">{{ o.latitude || '—' }}</p></div>
                <div class="info-item"><label>Longitude</label><p class="mono text-xs">{{ o.longitude || '—' }}</p></div>
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
          <div class="empty-icon-wrap"><span class="mdi mdi-credit-card-off-outline"></span></div>
          <p class="empty-title">No terminals or outlets assigned</p>
        </div>
      </section>

      <!-- ════ TAB: DOCUMENTS ════ -->
      <section v-show="activeTab === 'documents'" class="tab-section">
        <div class="docs-grid" v-if="merchant.documents?.length">
          <div class="doc-card" v-for="doc in merchant.documents" :key="doc.id" @click="openDoc(doc)">
            <div class="doc-card-top">
              <div class="doc-icon"><span class="mdi mdi-file-document-outline"></span></div>
              <span :class="['pill pill--sm', docStatusPill(doc.doc_status)]">{{ doc.doc_status }}</span>
            </div>
            <p class="doc-name">{{ doc.doc_name || '—' }}</p>
            <p class="doc-type">{{ doc.doc_type || '—' }}</p>
            <p class="doc-num mono text-xs">{{ doc.doc_number || '—' }}</p>
            <div class="doc-count"><span class="mdi mdi-image-multiple-outline"></span>{{ doc.images?.length || 0 }} image(s)</div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-icon-wrap" style="background:rgba(217,119,6,.1);color:#d97706"><span class="mdi mdi-file-cancel-outline"></span></div>
          <p class="empty-title">No documents uploaded</p>
        </div>
      </section>

      <!-- ════ TAB: TRANSACTIONS ════ -->
      <section v-show="activeTab === 'transactions'" class="tab-section">
        <div class="card">
          <div class="card-header">
            <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-swap-horizontal"></span></div>
            <h3 class="card-title">Recent Transactions</h3>
          </div>
          <div class="table-scroll" v-if="transactions.data?.length">
            <table class="data-table">
              <thead><tr><th>TR</th><th>RRN</th><th>Amount</th><th>Method</th><th>Status</th><th>Provider</th><th>Date</th></tr></thead>
              <tbody>
                <tr v-for="t in transactions.data" :key="t.id">
                  <td class="mono text-xs">{{ t.tr }}</td>
                  <td class="mono text-xs">{{ t.rrn }}</td>
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
            <div class="empty-icon-wrap"><span class="mdi mdi-swap-horizontal-bold"></span></div>
            <p class="empty-title">No transactions found</p>
          </div>
        </div>
      </section>

    </main>

    <!-- ░░ Document Dialog ░░ -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="docDialog" class="dialog-overlay" @click.self="docDialog = false">
          <div class="dialog">
            <div class="dialog-hdr">
              <div>
                <p class="dialog-title">{{ selectedDoc?.doc_name }}</p>
                <p class="dialog-sub">{{ selectedDoc?.doc_type }}</p>
              </div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span :class="['pill pill--sm', docStatusPill(selectedDoc?.doc_status)]">{{ selectedDoc?.doc_status }}</span>
                <button class="icon-close" @click="docDialog = false"><span class="mdi mdi-close"></span></button>
              </div>
            </div>
            <div class="dialog-body" v-if="selectedDoc">
              <div class="info-grid info-grid--3" style="border:1px solid #f1f5f9;border-radius:10px;overflow:hidden;margin-bottom:16px;">
                <div class="info-item"><label>Doc Number</label><p class="mono">{{ selectedDoc.doc_number || '—' }}</p></div>
                <div class="info-item"><label>Verified By</label><p>{{ selectedDoc.doc_verified_by || '—' }}</p></div>
                <div class="info-item"><label>Result</label><p><span :class="['pill pill--sm', selectedDoc.doc_verified_result ? 'pill--emerald' : 'pill--amber']">{{ selectedDoc.doc_verified_result ? 'Verified' : 'Pending' }}</span></p></div>
              </div>
              <p class="dialog-section-lbl">Document Images</p>
              <div class="doc-img-grid" v-if="selectedDoc.images?.length">
                <img v-for="img in selectedDoc.images" :key="img.id" :src="img.url" class="doc-img-thumb" @click="openPreview(img.url)" />
              </div>
              <div class="empty-state" v-else>
                <p style="font-size:13px;color:#94a3b8">No images uploaded for this document</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="dialog-fade">
        <div v-if="imgPreview" class="dialog-overlay" @click.self="imgPreview = false">
          <div class="dialog dialog--img">
            <div class="dialog-hdr">
              <p class="dialog-title">Image Preview</p>
              <button class="icon-close" @click="imgPreview = false"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="dialog-body dialog-body--img"><img :src="previewUrl" class="img-preview" /></div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>

  <!-- ── Loader ── -->
  <div v-else class="page-loader">
    <div class="loader-spinner"></div>
    <p class="loader-text">Loading merchant data…</p>
  </div>
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

const merchant     = reactive({});
const transactions = ref({ data: [], pagination: {} });
const activeTab    = ref('info');
const docDialog    = ref(false);
const selectedDoc  = ref(null);
const imgPreview   = ref(false);
const previewUrl   = ref(null);

const tabs = [
  { key: 'info',         label: 'Merchant Info',  mdi: 'mdi-account-circle-outline' },
  { key: 'address',      label: 'Address',         mdi: 'mdi-map-marker-outline' },
  { key: 'kyc',          label: 'KYC Services',    mdi: 'mdi-shield-check-outline' },
  { key: 'commissions',  label: 'Commissions',     mdi: 'mdi-percent-box-outline' },
  { key: 'terminals',    label: 'Terminals',       mdi: 'mdi-point-of-sale' },
  { key: 'documents',    label: 'Documents',       mdi: 'mdi-file-document-outline' },
  { key: 'transactions', label: 'Transactions',    mdi: 'mdi-swap-horizontal' },
];

/* ── Helpers ── */
const AVATAR_COLORS = ['#1142d4','#7c3aed','#db2777','#059669','#d97706','#dc2626','#0891b2'];
const avatarBg  = (n) => AVATAR_COLORS[(n||'?').charCodeAt(0) % AVATAR_COLORS.length];
const initials  = (n) => (n||'?').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
const fmtDate   = (d) => { if (!d) return '—'; const dt = new Date(d); if (isNaN(dt)) return '—'; return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()}`; };
const genderLabel = (g) => g === 'M' ? 'Male' : g === 'F' ? 'Female' : g === 'O' ? 'Other' : '—';

const mstatusBadge      = (s) => { if (!s) return 'pill--amber'; if (['APPROVED','VERIFIED','ACTIVE'].includes(s)) return 'pill--emerald'; if (['REJECTED','FAILED'].includes(s)) return 'pill--red'; return 'pill--amber'; };
const mstatusBadgeClass = (s) => mstatusBadge(s);
const kycStatusPill = (s) => { if (!s || s === 'PENDING') return 'pill--amber'; if (['VERIFIED','APPROVED'].includes(s)) return 'pill--emerald'; if (['REJECTED','FAILED','SUSPENDED'].includes(s)) return 'pill--red'; if (['PROCESSING','UNDER_REVIEW','SUBMITTED'].includes(s)) return 'pill--sky'; return 'pill--amber'; };
const riskPill  = (s) => { if (!s) return 'pill--slate'; if (s === 'LOW') return 'pill--emerald'; if (s === 'MEDIUM') return 'pill--amber'; if (s === 'HIGH') return 'pill--red'; return 'pill--slate'; };
const docStatusPill = (s) => { if (s==='VERIFIED') return 'pill--emerald'; if (s==='REJECTED') return 'pill--red'; if (s==='SUBMITTED') return 'pill--sky'; return 'pill--amber'; };
const txnPill   = (s) => { if (['PAID','SUCCESS'].includes(s)) return 'pill--emerald'; if (['FAILED','CANCELLED'].includes(s)) return 'pill--red'; return 'pill--amber'; };

const openDoc     = (doc) => { selectedDoc.value = doc; docDialog.value = true; };
const openPreview = (url) => { previewUrl.value = url; imgPreview.value = true; };

const buildDocItems = (svc) => [
  { key: 'pan',      label: 'PAN',         status: svc.panStatus,      verifiedAt: svc.panVerifiedAt,      reason: svc.panRejectionReason },
  { key: 'aadhaar',  label: 'Aadhaar',     status: svc.aadhaarStatus,  verifiedAt: svc.aadhaarVerifiedAt,  reason: svc.aadhaarRejectionReason },
  { key: 'bank',     label: 'Bank',        status: svc.bankStatus,     verifiedAt: svc.bankVerifiedAt,     reason: svc.bankRejectionReason },
  { key: 'gst',      label: 'GST',         status: svc.gstStatus,      verifiedAt: svc.gstVerifiedAt,      reason: svc.gstRejectionReason },
  { key: 'storeImg', label: 'Store Image', status: svc.storeImgStatus, verifiedAt: svc.storeImgVerifiedAt, reason: svc.storeImgRejectionReason },
];

onMounted(async () => {
  try { const res = await getMerchantById(props.merchantId); Object.assign(merchant, res.data || {}); } catch (e) { console.error('Failed to fetch merchant:', e); }
  try { const res = await getTransactionsByMerchantId(props.merchantId, 1, 20); transactions.value = res; } catch {}
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

/* ── API Key ── */
.api-key-row { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-top: 1px solid #f1f5f9; background: #fafafa; flex-wrap: wrap; }
.api-key-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .7px; flex-shrink: 0; display: flex; align-items: center; gap: 4px; }
.api-key-val   { color: #475569; word-break: break-all; }

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

/* ── KYC Service Cards ── */
.svc-icon-badge { width: 34px; height: 34px; border-radius: 9px; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
.interface-chip { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: #e0e7ff; color: #4338ca; text-transform: uppercase; letter-spacing: .4px; white-space: nowrap; }
.svc-flags-row  { display: flex; flex-wrap: wrap; gap: 8px 18px; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.svc-flag-item  { display: flex; align-items: center; gap: 6px; }
.svc-flag-label { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; white-space: nowrap; }
.svc-flag-val   { font-size: 12px; font-weight: 600; color: #0f172a; }
.svc-doc-grid   { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; }
.svc-doc-item   { padding: 14px 16px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
.svc-doc-item:nth-child(5n) { border-right: none; }
.svc-doc-top    { display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 5px; }
.svc-doc-name   { font-size: 11.5px; font-weight: 700; color: #0f172a; }
.svc-doc-meta   { display: flex; flex-direction: column; gap: 2px; }
.svc-doc-date   { font-size: 10px; color: #64748b; display: flex; align-items: center; gap: 3px; }
.svc-doc-reason { font-size: 10px; color: #ef4444; }

/* ── Table ── */
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table   { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 480px; }
.data-table thead { background: #f8fafc; }
.data-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
.data-table td { padding: 11px 14px; color: #334155; border-bottom: 1px solid #f9fafb; vertical-align: top; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #f8fafc; }
.rate-cell  { font-family: 'DM Mono', monospace; font-weight: 700; color: #1142d4; font-size: 12px; }
.rate-type  { font-size: 9.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; font-family: inherit; }

/* ── Address ── */
.addr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 16px 18px; }
.addr-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.addr-card-hd { display: flex; align-items: center; gap: 8px; padding: 11px 14px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .7px; }
.addr-card-body { padding: 14px; font-size: 12.5px; color: #334155; line-height: 1.75; }
.addr-main { font-weight: 600; color: #0f172a; }
.addr-city { color: #64748b; font-size: 11.5px; margin-top: 5px; font-weight: 600; }
.addr-contact { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; font-size: 11px; color: #64748b; }
.addr-contact .mdi { font-size: 12px; }
.addr-link { color: #1142d4; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 3px; }
.addr-link:hover { text-decoration: underline; }

/* ── Payment Methods ── */
.pay-methods-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; padding: 16px 18px; }
.pay-method-card  { display: flex; align-items: center; gap: 10px; padding: 13px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; transition: background .13s; }
.pay-method-card:hover { background: #f1f5f9; }
.pay-method-icon  { width: 34px; height: 34px; border-radius: 8px; background: rgba(17,66,212,.1); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.pay-method-body  { flex: 1; min-width: 0; }
.pay-method-name  { font-size: 13px; font-weight: 700; color: #0f172a; }
.pay-method-provider { font-size: 11px; color: #64748b; margin-top: 2px; }

/* ── Terminals ── */
.terminal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; padding: 14px 18px; }
.terminal-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.terminal-top  { display: flex; align-items: center; gap: 10px; padding: 14px; border-bottom: 1px solid #f1f5f9; background: #fff; }
.terminal-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(17,66,212,.1); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.terminal-info { flex: 1; min-width: 0; }
.terminal-tid  { font-size: 13.5px; font-weight: 700; color: #0f172a; }
.terminal-type { font-size: 11px; color: #64748b; margin-top: 2px; }

/* ── Outlets ── */
.outlet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; padding: 14px 18px; }
.outlet-card  { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.outlet-top   { display: flex; align-items: center; gap: 10px; padding: 14px; border-bottom: 1px solid #f1f5f9; background: #fff; }
.outlet-icon  { width: 36px; height: 36px; border-radius: 10px; background: rgba(5,150,105,.1); color: #059669; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.outlet-info  { flex: 1; min-width: 0; }
.outlet-name  { font-size: 13.5px; font-weight: 700; color: #0f172a; }
.outlet-code  { color: #94a3b8; margin-top: 2px; }
.outlet-users { padding: 10px 14px; border-top: 1px solid #f1f5f9; display: flex; flex-direction: column; gap: 8px; }
.outlet-user  { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: #fff; border: 1px solid #f1f5f9; border-radius: 8px; }
.ou-avatar { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0; }
.ou-info   { flex: 1; min-width: 0; }
.ou-name   { font-size: 12.5px; font-weight: 600; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ou-email  { color: #94a3b8; }

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

/* ── Page Loader ── */
.page-loader  { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 14px; }
.loader-spinner { width: 40px; height: 40px; border: 3px solid #e2e8f0; border-top-color: #1142d4; border-radius: 50%; animation: spin .8s linear infinite; }
.loader-text  { font-size: 13px; color: #64748b; font-family: 'DM Sans', sans-serif; font-weight: 600; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Tablet ≤1024px ── */
@media (max-width: 1024px) {
  .info-grid--4 { grid-template-columns: repeat(2, 1fr); }
  .info-grid--4 .info-item:nth-child(4n) { border-right: 1px solid #f1f5f9; }
  .info-grid--4 .info-item:nth-child(2n) { border-right: none; }
  .info-grid--3 { grid-template-columns: repeat(2, 1fr); }
  .info-grid--3 .info-item:nth-child(3n) { border-right: 1px solid #f1f5f9; }
  .info-grid--3 .info-item:nth-child(2n) { border-right: none; }
  .addr-grid    { grid-template-columns: repeat(2, 1fr); }
  .svc-doc-grid { grid-template-columns: repeat(3, 1fr); }
  .svc-doc-item:nth-child(5n) { border-right: 1px solid #f1f5f9; }
  .svc-doc-item:nth-child(3n) { border-right: none; }
}

/* ── Mobile ≤640px ── */
@media (max-width: 640px) {
  .view-root    { gap: 12px; }
  .view-header  { padding: 12px 14px; flex-wrap: wrap; }
  .view-merchant-name { font-size: 14px; max-width: 180px; }
  .kpi-strip    { gap: 8px; }
  .kpi-card     { padding: 12px 12px; }
  .kpi-value    { font-size: 18px; }
  .kpi-sub      { display: none; }
  .tab-wrap     { position: fixed; bottom: 0; left: 0; right: 0; z-index: 45; margin: 0; padding: 0; border-radius: 0; border: none; border-top: 1px solid #e2e8f0; box-shadow: 0 -2px 10px rgba(0,0,0,.07); }
  .tab-nav      { border-radius: 0; padding: 0; gap: 0; justify-content: space-around; }
  .tab-btn      { flex: 1; flex-direction: column; align-items: center; justify-content: center; padding: 7px 4px 5px; gap: 3px; border-radius: 0; min-width: 0; }
  .tab-btn .mdi { font-size: 18px; }
  .tab-btn--active { background: transparent; color: #1142d4; box-shadow: none; }
  .tab-label    { font-size: 8.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 50px; }
  .view-content { margin-top: 2px; }
  .tab-section  { gap: 10px; }
  .info-grid--4, .info-grid--3 { grid-template-columns: repeat(2, 1fr); }
  .info-grid--4 .info-item:nth-child(4n), .info-grid--3 .info-item:nth-child(3n) { border-right: 1px solid #f1f5f9; }
  .info-grid--4 .info-item:nth-child(2n), .info-grid--3 .info-item:nth-child(2n) { border-right: none; }
  .info-item    { padding: 11px 13px; }
  .addr-grid    { grid-template-columns: 1fr; padding: 12px 14px; }
  .terminal-grid, .outlet-grid, .pay-methods-grid { grid-template-columns: 1fr; padding: 12px 14px; }
  .docs-grid    { grid-template-columns: 1fr 1fr; gap: 10px; }
  .svc-doc-grid { grid-template-columns: repeat(2, 1fr); }
  .svc-doc-item:nth-child(5n) { border-right: 1px solid #f1f5f9; }
  .svc-doc-item:nth-child(2n) { border-right: none; }
  .svc-flags-row { gap: 6px 12px; padding: 10px 14px; }
  .dialog-overlay { padding: 10px; }
  .dialog       { max-height: 95dvh; border-radius: 12px; }
  .doc-img-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 400px) {
  .info-grid--4, .info-grid--3 { grid-template-columns: 1fr; }
  .info-grid--4 .info-item, .info-grid--3 .info-item { border-right: none; }
  .docs-grid    { grid-template-columns: 1fr; }
  .svc-doc-grid { grid-template-columns: 1fr; }
  .svc-doc-item { border-right: none; }
}
</style>
