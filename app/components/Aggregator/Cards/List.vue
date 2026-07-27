<template>
  <div class="view-root">

    <!-- ── Page Header ── -->
    <div class="view-header">
      <div class="view-header__left">
        <div class="view-brand-text">
          <h1 class="view-merchant-name">Cards</h1>
          <p class="view-sub">Card applications and your issued card pool</p>
        </div>
      </div>
      <button v-if="activeTab === 'applications'" class="btn-primary" @click="openApplyModal">
        <span class="mdi mdi-credit-card-plus-outline"></span>
        Apply for Card
      </button>
    </div>

    <!-- ── Tab Nav ── -->
    <div class="tab-wrap">
      <nav class="tab-nav">
        <button :class="['tab-btn', activeTab === 'applications' && 'tab-btn--active']" @click="activeTab = 'applications'">
          <span class="mdi mdi-clipboard-list-outline"></span>
          <span class="tab-label">Applications</span>
        </button>
        <button :class="['tab-btn', activeTab === 'pool' && 'tab-btn--active']" @click="activeTab = 'pool'">
          <span class="mdi mdi-credit-card-multiple-outline"></span>
          <span class="tab-label">Cards</span>
        </button>
      </nav>
    </div>

    <!-- ════════════════════════ TAB: APPLICATIONS ════════════════════════ -->
    <section v-show="activeTab === 'applications'" class="tab-section">

      <!-- Stats -->
      <div class="kpi-strip">
        <div class="kpi-card" style="--kc:#1142d4">
          <div class="kpi-icon-wrap" style="background:rgba(17,66,212,.1)"><span class="mdi mdi-clipboard-list-outline" style="color:#1142d4"></span></div>
          <div class="kpi-body">
            <p class="kpi-label">Applications</p>
            <p class="kpi-value">{{ applicationStats.totalEnquiries }}</p>
          </div>
        </div>
        <div class="kpi-card" style="--kc:#d97706">
          <div class="kpi-icon-wrap" style="background:rgba(217,119,6,.1)"><span class="mdi mdi-credit-card-multiple-outline" style="color:#d97706"></span></div>
          <div class="kpi-body">
            <p class="kpi-label">Cards Ordered</p>
            <p class="kpi-value" style="color:#d97706">{{ applicationStats.totalCardsOrdered }}</p>
          </div>
        </div>
        <div class="kpi-card" style="--kc:#059669">
          <div class="kpi-icon-wrap" style="background:rgba(5,150,105,.1)"><span class="mdi mdi-check-circle-outline" style="color:#059669"></span></div>
          <div class="kpi-body">
            <p class="kpi-label">Approved</p>
            <p class="kpi-value" style="color:#059669">{{ applicationStats.approvedCount }}</p>
          </div>
        </div>
        <div class="kpi-card" style="--kc:#7c3aed">
          <div class="kpi-icon-wrap" style="background:rgba(124,58,237,.1)"><span class="mdi mdi-truck-delivery-outline" style="color:#7c3aed"></span></div>
          <div class="kpi-body">
            <p class="kpi-label">Delivered</p>
            <p class="kpi-value" style="color:#7c3aed">{{ applicationStats.deliveredCount }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-icon-dot" style="background:rgba(17,66,212,.1);color:#1142d4"><span class="mdi mdi-clipboard-list-outline"></span></div>
          <h3 class="card-title">Card Applications</h3>
          <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ applicationPagination.total }} record(s)</span></span>
        </div>

        <!-- Filters -->
        <div class="cards-filter-bar">
          <div class="cf-field cf-field--search">
            <span class="mdi mdi-magnify cf-search-icon"></span>
            <input
              class="cf-input cf-input--search"
              v-model="appFilters.search"
              placeholder="Search application no, remarks…"
            />
          </div>
          <select class="cf-select" v-model="appFilters.status" @change="applyAppFilters">
            <option value="">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select class="cf-select" v-model="appFilters.paymentStatus" @change="applyAppFilters">
            <option value="">All Payments</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <select class="cf-select" v-model="appFilters.fulfillmentStatus" @change="applyAppFilters">
            <option value="">All Fulfillment</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
            <option value="FAILED">Failed</option>
          </select>
          <button class="cf-reset-btn" title="Reset filters" @click="resetAppFilters">
            <span class="mdi mdi-filter-remove-outline"></span>
          </button>
        </div>

        <div v-if="applicationLoading" class="w-loading-row">Loading applications…</div>
        <div v-else-if="applicationError" class="empty-state">
          <div class="empty-icon-wrap"><span class="mdi mdi-alert-circle-outline"></span></div>
          <p class="empty-title">{{ applicationError }}</p>
        </div>
        <div class="table-scroll" v-else-if="applicationList.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Application No</th><th>No. of Cards</th><th>Delivery Address</th><th>Status</th><th>Payment</th><th>Fulfillment</th><th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in applicationList" :key="a.id" class="clickable-row" @click="viewApplication(a.id)">
                <td class="mono">{{ a.enquiryNo }}</td>
                <td>{{ a.noOfCards }}</td>
                <td>
                  <span v-if="a.address">{{ a.address.address1 }}, {{ a.address.city }}</span>
                  <span v-else class="text-muted">No address set</span>
                </td>
                <td><span :class="['pill pill--sm', appStatusPill(a.status)]">{{ a.status }}</span></td>
                <td><span :class="['pill pill--sm', paymentStatusPill(a.paymentStatus)]">{{ a.paymentStatus }}</span></td>
                <td><span :class="['pill pill--sm', fulfillmentStatusPill(a.fulfillmentStatus)]">{{ a.fulfillmentStatus }}</span></td>
                <td>{{ fmtDate(a.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-icon-wrap"><span class="mdi mdi-credit-card-search-outline"></span></div>
          <p class="empty-title">No card applications found</p>
          <button class="btn-primary" @click="openApplyModal">
            <span class="mdi mdi-plus"></span> Apply for your first card
          </button>
        </div>

        <div class="cards-pagination" v-if="applicationPagination.totalPages > 1">
          <button class="cf-page-btn" :disabled="!applicationPagination.hasPrev" @click="goToAppPage(applicationPagination.page - 1)">
            <span class="mdi mdi-chevron-left"></span>
          </button>
          <span class="cf-page-info">Page {{ applicationPagination.page }} of {{ applicationPagination.totalPages }}</span>
          <button class="cf-page-btn" :disabled="!applicationPagination.hasNext" @click="goToAppPage(applicationPagination.page + 1)">
            <span class="mdi mdi-chevron-right"></span>
          </button>
        </div>
      </div>
    </section>

    <!-- ════════════════════════ TAB: CARDS (POOL) ════════════════════════ -->
    <section v-show="activeTab === 'pool'" class="tab-section">
      <div class="card">
        <div class="card-header">
          <div class="card-icon-dot" style="background:rgba(217,119,6,.1);color:#d97706"><span class="mdi mdi-credit-card-outline"></span></div>
          <h3 class="card-title">Card Pool</h3>
          <span class="ml-auto"><span class="pill pill--sm pill--slate">{{ poolPagination.total }} record(s)</span></span>
        </div>

        <!-- Filters -->
        <div class="cards-filter-bar">
          <div class="cf-field cf-field--search">
            <span class="mdi mdi-magnify cf-search-icon"></span>
            <input
              class="cf-input cf-input--search"
              v-model="poolFilters.search"
              placeholder="Search by card ref ID, holder name or PAN…"
            />
          </div>
          <select class="cf-select" v-model="poolFilters.status" @change="applyPoolFilters">
            <option value="">All Status</option>
            <option v-for="s in CARD_STATUSES" :key="s" :value="s">{{ statusLabel(s) }}</option>
          </select>
          <select class="cf-select" v-model="poolFilters.type" @change="applyPoolFilters">
            <option value="">All Types</option>
            <option v-for="t in CARD_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
          <select class="cf-select" v-model="poolFilters.network" @change="applyPoolFilters">
            <option value="">All Networks</option>
            <option v-for="n in CARD_NETWORKS" :key="n" :value="n">{{ n }}</option>
          </select>
          <select class="cf-select" v-model="poolFilters.linked" @change="applyPoolFilters">
            <option value="">Linked + Unlinked</option>
            <option value="linked">Linked only</option>
            <option value="unlinked">Unlinked only</option>
          </select>
          <input type="date" class="cf-input cf-input--date" v-model="poolFilters.dateFrom" @change="applyPoolFilters" title="Created from" />
          <input type="date" class="cf-input cf-input--date" v-model="poolFilters.dateTo" @change="applyPoolFilters" title="Created to" />
          <button class="cf-reset-btn" title="Reset filters" @click="resetPoolFilters">
            <span class="mdi mdi-filter-remove-outline"></span>
          </button>
        </div>

        <div v-if="poolLoading" class="w-loading-row">Loading cards…</div>
        <div class="table-scroll" v-else-if="poolCards.length">
          <table class="data-table">
            <thead>
              <tr>
                <th>Card Ref ID</th><th>Holder</th><th>Masked PAN</th><th>Type</th><th>Network</th><th>Status</th><th>Linked To</th><th>Created</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in poolCards" :key="c.id">
                <td class="mono">{{ c.cardRefId || '—' }}</td>
                <td>{{ c.cardHolderName }}</td>
                <td class="mono">{{ c.maskedPan }}</td>
                <td>{{ c.type }}</td>
                <td>{{ c.network }}</td>
                <td><span :class="['pill pill--sm', cardStatusPill(c.status)]">{{ statusLabel(c.status) }}</span></td>
                <td>
                  <span v-if="c.merchant" class="pill pill--sm pill--indigo">{{ c.merchant.dba_name || c.merchant.legal_name || c.merchant.mid }}</span>
                  <span v-else-if="c.walletprofile" class="pill pill--sm pill--indigo">{{ c.walletprofile.name }}</span>
                  <span v-else class="text-muted">Unlinked</span>
                </td>
                <td>{{ fmtDate(c.createdAt) }}</td>
                <td>
                  <div class="row-actions">
                    <button class="icon-close" title="Edit card" @click="openEditCard(c)"><span class="mdi mdi-pencil-outline"></span></button>
                    <button class="icon-close" title="Link card" @click="openLinkModal(c)"><span class="mdi mdi-link-variant"></span></button>
                    <button
                      v-if="c.merchantId || c.walletprofileId"
                      class="icon-close"
                      title="Unlink card"
                      @click="handleUnlink(c)"
                    ><span class="mdi mdi-link-variant-off"></span></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" v-else>
          <div class="empty-icon-wrap"><span class="mdi mdi-credit-card-off-outline"></span></div>
          <p class="empty-title">No cards found</p>
        </div>

        <div class="cards-pagination" v-if="poolPagination.totalPages > 1">
          <button class="cf-page-btn" :disabled="poolPagination.page <= 1" @click="goToPoolPage(poolPagination.page - 1)">
            <span class="mdi mdi-chevron-left"></span>
          </button>
          <span class="cf-page-info">Page {{ poolPagination.page }} of {{ poolPagination.totalPages }}</span>
          <button class="cf-page-btn" :disabled="poolPagination.page >= poolPagination.totalPages" @click="goToPoolPage(poolPagination.page + 1)">
            <span class="mdi mdi-chevron-right"></span>
          </button>
        </div>
      </div>
    </section>

    <Teleport to="body">

      <!-- ░░ APPLY FOR CARD MODAL ░░ -->
      <Transition name="dialog-fade">
        <div v-if="showApplyModal" class="dialog-overlay" @click.self="closeApplyModal">
          <div class="dialog dialog--apply">
            <div class="dialog-hdr">
              <div>
                <p class="dialog-title">Apply for Card</p>
                <p class="dialog-sub">Submit a new card application</p>
              </div>
              <button class="icon-close" @click="closeApplyModal"><span class="mdi mdi-close"></span></button>
            </div>

            <div class="dialog-body">
              <div class="term-field" style="margin-bottom:14px">
                <label>Number of Cards <span class="req">*</span></label>
                <input v-model.number="applyForm.noOfCards" type="number" min="1" max="1000" class="term-input" placeholder="e.g. 50" />
                <span v-if="applyFormErrors.noOfCards" class="field-error">{{ applyFormErrors.noOfCards }}</span>
              </div>

              <div class="term-field" style="margin-bottom:14px">
                <label>Remarks <span style="font-weight:400;color:#94a3b8">(optional)</span></label>
                <textarea v-model="applyForm.remarks" class="confirm-reason__input" rows="2" placeholder="Any special instructions or notes…"></textarea>
              </div>

              <div class="dialog-section-lbl" style="margin-top:0">Delivery Address</div>
              <div v-if="addressLoading" class="w-loading-row">Loading address…</div>
              <template v-else>
                <div class="addr-mode-tabs">
                  <button class="addr-tab" :class="{ active: addressMode === 'official' }" :disabled="!profileAddress" @click="addressMode = 'official'">
                    <span class="mdi mdi-home-outline"></span> Use Registered Address
                  </button>
                  <button class="addr-tab" :class="{ active: addressMode === 'new' }" @click="addressMode = 'new'">
                    <span class="mdi mdi-plus-circle-outline"></span> Enter New Address
                  </button>
                </div>

                <div v-if="addressMode === 'official'" class="official-addr-card">
                  <div v-if="profileAddress" class="addr-confirm-box">
                    <div class="addr-lines">
                      <span>{{ profileAddress.official_address }}</span>
                      <span>{{ profileAddress.address1 }}<span v-if="profileAddress.address2">, {{ profileAddress.address2 }}</span></span>
                      <span>{{ profileAddress.city }}, {{ profileAddress.state }} – {{ profileAddress.pincode }}</span>
                      <span v-if="profileAddress.mobile_number" class="text-muted">📱 {{ profileAddress.mobile_number }}</span>
                    </div>
                  </div>
                  <div v-else class="addr-no-official">
                    <span class="mdi mdi-alert-outline"></span>
                    <span>No registered address found. Please enter a new address.</span>
                  </div>
                </div>

                <div v-if="addressMode === 'new'" class="term-form-grid term-form-grid--2" style="margin-top:12px">
                  <div class="term-field" style="grid-column:1/-1">
                    <label>Official Address / Company Name <span class="req">*</span></label>
                    <input v-model="newAddr.official_address" class="term-input" placeholder="Company name or official address" />
                    <span v-if="addrErrors.official_address" class="field-error">{{ addrErrors.official_address }}</span>
                  </div>
                  <div class="term-field" style="grid-column:1/-1">
                    <label>Address Line 1 <span class="req">*</span></label>
                    <input v-model="newAddr.address1" class="term-input" placeholder="Street / Building / Area" />
                    <span v-if="addrErrors.address1" class="field-error">{{ addrErrors.address1 }}</span>
                  </div>
                  <div class="term-field">
                    <label>Address Line 2</label>
                    <input v-model="newAddr.address2" class="term-input" placeholder="Landmark (optional)" />
                  </div>
                  <div class="term-field">
                    <label>City <span class="req">*</span></label>
                    <input v-model="newAddr.city" class="term-input" />
                    <span v-if="addrErrors.city" class="field-error">{{ addrErrors.city }}</span>
                  </div>
                  <div class="term-field">
                    <label>State <span class="req">*</span></label>
                    <input v-model="newAddr.state" class="term-input" />
                    <span v-if="addrErrors.state" class="field-error">{{ addrErrors.state }}</span>
                  </div>
                  <div class="term-field">
                    <label>Pincode <span class="req">*</span></label>
                    <input v-model="newAddr.pincode" class="term-input" maxlength="6" />
                    <span v-if="addrErrors.pincode" class="field-error">{{ addrErrors.pincode }}</span>
                  </div>
                  <div class="term-field">
                    <label>Mobile Number <span class="req">*</span></label>
                    <input v-model="newAddr.mobile_number" class="term-input" maxlength="10" />
                    <span v-if="addrErrors.mobile_number" class="field-error">{{ addrErrors.mobile_number }}</span>
                  </div>
                </div>
              </template>
            </div>

            <div class="w-modal-footer">
              <button class="w-btn-ghost" @click="closeApplyModal">Cancel</button>
              <button class="w-btn-primary" :disabled="modalLoading" @click="submitApplyForm">
                <span v-if="modalLoading" class="mdi mdi-loading spin"></span>
                <span v-else>Review &amp; Submit</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ CHARGE CONFIRM MODAL ░░ -->
      <Transition name="dialog-fade">
        <div v-if="showChargeConfirmModal" class="dialog-overlay" @click.self="showChargeConfirmModal = false">
          <div class="dialog dialog--confirm">
            <div class="dialog__hdr">
              <div class="confirm-icon-wrap confirm-icon-wrap--info">
                <span class="mdi mdi-receipt-text-outline" style="font-size:20px"></span>
              </div>
              <div>
                <p class="dialog__title">Confirm &amp; Submit Application</p>
                <p class="dialog__sub">Review charges for {{ applyForm.noOfCards }} card(s)</p>
              </div>
              <button class="icon-close-btn ml-auto" @click="showChargeConfirmModal = false"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="dialog__body">
              <div v-if="cardChargesLoading" class="w-loading-row">Loading charges…</div>
              <div v-else-if="cardChargesError" class="field-error">Could not load charges. <button class="link-btn" @click="fetchCardCharges">Retry</button></div>
              <template v-else-if="cardCharges">
                <div class="confirm-change-summary">
                  <div class="ccs-row">
                    <span class="ccs-label">Issuance Fee (per card)</span>
                    <span class="ccs-val">{{ cardCharges.chargeType === 'PERCENTAGE' ? `${cardCharges.issuanceFee}%` : `₹${Number(cardCharges.issuanceFee).toFixed(2)}` }}</span>
                  </div>
                  <div class="ccs-row">
                    <span class="ccs-label">Number of Cards</span>
                    <span class="ccs-val">{{ applyForm.noOfCards }}</span>
                  </div>
                  <div class="ccs-row ccs-row--new">
                    <span class="ccs-label">Total Estimated Charges</span>
                    <span class="ccs-val" style="font-size:16px;font-weight:800;color:#1142d4">{{ confirmationTotal }}</span>
                  </div>
                </div>
                <label class="accept-row" :class="{ 'accept-row--error': chargeAcceptError }">
                  <input type="checkbox" v-model="chargeAccepted" @change="chargeAcceptError = false" />
                  <span>I accept the total charges of <strong>{{ confirmationTotal }}</strong> for <strong>{{ applyForm.noOfCards }} card(s)</strong>.</span>
                </label>
                <p v-if="chargeAcceptError" class="field-error" style="margin:-6px 0 0 2px">Please accept the charges to proceed.</p>
              </template>
              <div v-else class="text-muted" style="font-size:13px">No issuance fee configured. You can proceed for free.</div>

              <div class="confirm-actions">
                <button class="btn-secondary" @click="showChargeConfirmModal = false">Go Back</button>
                <button class="btn-confirm btn-confirm--info" :disabled="modalLoading" @click="confirmAndCreateApplication">
                  <span v-if="modalLoading" class="btn-spinner"></span>
                  <span v-else>Confirm &amp; Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ EDIT CARD MODAL ░░ -->
      <Transition name="dialog-fade">
        <div v-if="cardModal.open" class="dialog-overlay" @click.self="closeCardModal">
          <div class="dialog dialog--card">
            <div class="dialog-hdr">
              <div>
                <p class="dialog-title">Edit Card</p>
                <p class="dialog-sub mono">{{ cardModal.cardRefId || '—' }}</p>
              </div>
              <button class="icon-close" @click="closeCardModal" :disabled="cardModal.saving"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="dialog-body">
              <div class="term-form-error" v-if="cardModal.error">{{ cardModal.error }}</div>
              <div class="term-form-grid term-form-grid--2">
                <div class="term-field">
                  <label>Card Holder Name</label>
                  <input class="term-input" v-model="cardModal.form.cardHolderName" placeholder="e.g. JOHN DOE" />
                </div>
                <div class="term-field">
                  <label>Masked PAN</label>
                  <input class="term-input mono" v-model="cardModal.form.maskedPan" placeholder="e.g. 524164XXXXXX4587" />
                </div>
                <div class="term-field">
                  <label>Status</label>
                  <select class="term-select" v-model="cardModal.form.status">
                    <option v-for="s in CARD_STATUSES" :key="s" :value="s">{{ statusLabel(s) }}</option>
                  </select>
                </div>
              </div>
              <div class="confirm-reason">
                <label class="confirm-reason__label">Reason <span class="confirm-reason__opt">(optional)</span></label>
                <textarea v-model="cardModal.reason" class="confirm-reason__input" rows="2" maxlength="300" placeholder="e.g. Corrected holder name per updated KYC…"></textarea>
              </div>
            </div>
            <div class="w-modal-footer">
              <button class="w-btn-ghost" @click="closeCardModal" :disabled="cardModal.saving">Cancel</button>
              <button class="w-btn-primary" :disabled="cardModal.saving" @click="saveCard">
                <span v-if="cardModal.saving" class="mdi mdi-loading spin"></span>
                {{ cardModal.saving ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ LINK CARD MODAL ░░ -->
      <Transition name="dialog-fade">
        <div v-if="linkModal.open" class="dialog-overlay" @click.self="closeLinkModal">
          <div class="dialog dialog--card">
            <div class="dialog-hdr">
              <div>
                <p class="dialog-title">Link Card</p>
                <p class="dialog-sub mono">{{ linkModal.cardRefId || '—' }}</p>
              </div>
              <button class="icon-close" @click="closeLinkModal" :disabled="linkModal.saving"><span class="mdi mdi-close"></span></button>
            </div>
            <div class="dialog-body">
              <div class="term-form-error" v-if="linkModal.error">{{ linkModal.error }}</div>

              <div class="addr-mode-tabs" style="margin-bottom:14px">
                <button class="addr-tab" :class="{ active: linkModal.targetType === 'MERCHANT' }" @click="linkModal.targetType = 'MERCHANT'; linkModal.targetId = ''">
                  <span class="mdi mdi-storefront-outline"></span> Merchant
                </button>
                <button class="addr-tab" :class="{ active: linkModal.targetType === 'WALLET_PROFILE' }" @click="linkModal.targetType = 'WALLET_PROFILE'; linkModal.targetId = ''">
                  <span class="mdi mdi-bank-outline"></span> Wallet Profile
                </button>
              </div>

              <div v-if="linkModal.optionsLoading" class="w-loading-row">Loading options…</div>
              <div class="term-field" v-else>
                <label>{{ linkModal.targetType === 'MERCHANT' ? 'Select Merchant' : 'Select Wallet Profile' }}</label>
                <select class="term-select" v-model="linkModal.targetId">
                  <option value="" disabled>Choose…</option>
                  <option
                    v-for="opt in (linkModal.targetType === 'MERCHANT' ? linkOptions.merchants : linkOptions.walletProfiles)"
                    :key="opt.id"
                    :value="opt.id"
                  >
                    {{ linkModal.targetType === 'MERCHANT' ? (opt.dba_name || opt.legal_name || opt.mid) : `${opt.name} (${opt.code})` }}
                  </option>
                </select>
              </div>

              <div class="confirm-reason">
                <label class="confirm-reason__label">Reason <span class="confirm-reason__opt">(optional)</span></label>
                <textarea v-model="linkModal.reason" class="confirm-reason__input" rows="2" maxlength="300" placeholder="e.g. Assigned for outlet POS…"></textarea>
              </div>
            </div>
            <div class="w-modal-footer">
              <button class="w-btn-ghost" @click="closeLinkModal" :disabled="linkModal.saving">Cancel</button>
              <button class="w-btn-primary" :disabled="linkModal.saving || !linkModal.targetId" @click="saveLink">
                <span v-if="linkModal.saving" class="mdi mdi-loading spin"></span>
                {{ linkModal.saving ? 'Linking…' : 'Link Card' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ░░ TOAST ░░ -->
      <Transition name="toast">
        <div v-if="toast.show" :class="['toast', `toast--${toast.type}`]">
          <span class="mdi" :class="toast.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></span>
          {{ toast.message }}
        </div>
      </Transition>

    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAggregatorCardApplicationApi } from "~/composables/apis/useAggregatorCardApplicationApi";
import { useAggregatorCardsApi } from "~/composables/apis/useAggregatorCardsApi";

const router = useRouter();
const activeTab = ref("applications");

// ── Toast ──────────────────────────────────────────────────────────
const toast = reactive({ show: false, type: "success", message: "" });
let toastTimer = null;
const showToast = (message, type = "success") => {
  clearTimeout(toastTimer);
  toast.message = message;
  toast.type = type;
  toast.show = true;
  toastTimer = setTimeout(() => { toast.show = false; }, 3500);
};

/* ══════════════════════════ APPLICATIONS ══════════════════════════ */

const {
  applicationList, applicationPagination, applicationLoading, applicationError,
  applicationStats,
  profileAddress, addressLoading,
  cardCharges, cardChargesLoading, cardChargesError,
  fetchApplications, fetchApplicationStats, fetchProfileAddress, fetchCardCharges,
  createApplication,
} = useAggregatorCardApplicationApi();

const appFilters = reactive({
  page: 1, limit: 10, search: "",
  status: "", paymentStatus: "", fulfillmentStatus: "",
  sortBy: "createdAt", sortDir: "desc",
});

const doFetchApplications = () => fetchApplications({ ...appFilters });

let appSearchTimer = null;
watch(() => appFilters.search, () => {
  clearTimeout(appSearchTimer);
  appSearchTimer = setTimeout(() => { appFilters.page = 1; doFetchApplications(); }, 400);
});

const applyAppFilters = () => { appFilters.page = 1; doFetchApplications(); };
const resetAppFilters = () => {
  appFilters.search = ""; appFilters.status = ""; appFilters.paymentStatus = ""; appFilters.fulfillmentStatus = "";
  appFilters.page = 1;
  doFetchApplications();
};
const goToAppPage = (p) => {
  if (p < 1 || p > applicationPagination.value.totalPages) return;
  appFilters.page = p;
  doFetchApplications();
};

const viewApplication = (id) => router.push(`/aggregator/cards/view/${id}`);

const appStatusPill = (s) => ({
  DRAFT: "pill--slate", SUBMITTED: "pill--sky", APPROVED: "pill--emerald",
  REJECTED: "pill--red", CANCELLED: "pill--slate",
}[s] || "pill--slate");
const paymentStatusPill = (s) => ({
  UNPAID: "pill--amber", PAID: "pill--emerald", FAILED: "pill--red", REFUNDED: "pill--violet",
}[s] || "pill--slate");
const fulfillmentStatusPill = (s) => ({
  PENDING: "pill--amber", PROCESSING: "pill--sky", DISPATCHED: "pill--indigo",
  DELIVERED: "pill--emerald", FAILED: "pill--red",
}[s] || "pill--slate");

// ── Apply for Card modal ──────────────────────────────────────────────
const showApplyModal = ref(false);
const showChargeConfirmModal = ref(false);
const modalLoading = ref(false);
const addressMode = ref("official");
const chargeAccepted = ref(false);
const chargeAcceptError = ref(false);

const emptyApplyForm = () => ({ noOfCards: null, remarks: "" });
const emptyAddr = () => ({ official_address: "", address1: "", address2: "", city: "", state: "", pincode: "", mobile_number: "" });

const applyForm = reactive(emptyApplyForm());
const newAddr = reactive(emptyAddr());
const applyFormErrors = reactive({});
const addrErrors = reactive({});

const confirmationTotal = computed(() => {
  if (!cardCharges.value || !applyForm.noOfCards) return "₹0.00";
  if (cardCharges.value.chargeType === "PERCENTAGE") return `${cardCharges.value.issuanceFee}% per card`;
  const total = (Number(cardCharges.value.issuanceFee) || 0) * (applyForm.noOfCards || 0);
  return `₹${total.toFixed(2)}`;
});

const openApplyModal = async () => {
  Object.assign(applyForm, emptyApplyForm());
  Object.assign(newAddr, emptyAddr());
  Object.keys(applyFormErrors).forEach(k => delete applyFormErrors[k]);
  Object.keys(addrErrors).forEach(k => delete addrErrors[k]);
  addressMode.value = "official";
  chargeAccepted.value = false;
  chargeAcceptError.value = false;
  showApplyModal.value = true;
  await Promise.all([fetchProfileAddress(), fetchCardCharges()]);
  if (!profileAddress.value) addressMode.value = "new";
};

const closeApplyModal = () => { showApplyModal.value = false; };

const validateApplyForm = () => {
  Object.keys(applyFormErrors).forEach(k => delete applyFormErrors[k]);
  Object.keys(addrErrors).forEach(k => delete addrErrors[k]);

  if (!applyForm.noOfCards || applyForm.noOfCards < 1) applyFormErrors.noOfCards = "Enter at least 1 card";

  if (addressMode.value === "new") {
    if (!newAddr.official_address) addrErrors.official_address = "Required";
    if (!newAddr.address1) addrErrors.address1 = "Required";
    if (!newAddr.city) addrErrors.city = "Required";
    if (!newAddr.state) addrErrors.state = "Required";
    if (!newAddr.pincode) addrErrors.pincode = "Required";
    if (!newAddr.mobile_number) addrErrors.mobile_number = "Required";
  }

  return Object.keys(applyFormErrors).length === 0 && Object.keys(addrErrors).length === 0;
};

const submitApplyForm = async () => {
  if (!validateApplyForm()) return;
  chargeAccepted.value = false;
  chargeAcceptError.value = false;
  if (!cardCharges.value) await fetchCardCharges();
  showChargeConfirmModal.value = true;
};

const confirmAndCreateApplication = async () => {
  if (cardCharges.value && !chargeAccepted.value) {
    chargeAcceptError.value = true;
    return;
  }

  modalLoading.value = true;
  try {
    const payload = { noOfCards: applyForm.noOfCards, remarks: applyForm.remarks || undefined };

    if (addressMode.value === "official" && profileAddress.value?.id) {
      payload.addressId = profileAddress.value.id;
    } else if (addressMode.value === "new") {
      payload.newAddress = { ...newAddr };
    }

    const res = await createApplication(payload);

    if (res?.statusCode === "00") {
      showToast("Card application submitted successfully!", "success");
      showChargeConfirmModal.value = false;
      closeApplyModal();
      doFetchApplications();
      fetchApplicationStats();
    } else {
      showToast(res?.message || "Failed to submit application", "error");
    }
  } catch (err) {
    showToast(err.message || "Server error", "error");
  } finally {
    modalLoading.value = false;
  }
};

/* ══════════════════════════ CARDS POOL ══════════════════════════ */

const { getCards, getLinkOptions, updateCard, linkCard, unlinkCard } = useAggregatorCardsApi();

const CARD_STATUSES = ["ACTIVE", "BLOCKED", "HOTLISTED", "EXPIRED", "INACTIVE", "AVAILABIL", "PENDING"];
const CARD_TYPES    = ["DEBIT", "CREDIT", "PREPAID", "CDM"];
const CARD_NETWORKS = ["VISA", "MASTERCARD", "RUPAY", "AMEX", "DINERS"];

const poolCards = ref([]);
const poolLoading = ref(false);
const poolPagination = reactive({ page: 1, limit: 10, total: 0, totalPages: 0 });
const poolFilters = reactive({ search: "", status: "", type: "", network: "", dateFrom: "", dateTo: "", linked: "" });

let poolSearchTimer = null;

const fetchPoolCards = async (page = poolPagination.page) => {
  poolLoading.value = true;
  try {
    const res = await getCards({
      page,
      limit: poolPagination.limit,
      search: poolFilters.search,
      status: poolFilters.status,
      type: poolFilters.type,
      network: poolFilters.network,
      dateFrom: poolFilters.dateFrom,
      dateTo: poolFilters.dateTo,
      linked: poolFilters.linked,
    });
    if (res?.statusCode === "00") {
      poolCards.value = res.data || [];
      Object.assign(poolPagination, res.pagination || {});
    }
  } catch (e) {
    console.error("Failed to fetch cards:", e);
  } finally {
    poolLoading.value = false;
  }
};

const applyPoolFilters = () => fetchPoolCards(1);
const resetPoolFilters = () => {
  poolFilters.search = ""; poolFilters.status = ""; poolFilters.type = "";
  poolFilters.network = ""; poolFilters.dateFrom = ""; poolFilters.dateTo = ""; poolFilters.linked = "";
  fetchPoolCards(1);
};
const goToPoolPage = (page) => {
  if (page < 1 || page > poolPagination.totalPages) return;
  fetchPoolCards(page);
};

watch(() => poolFilters.search, () => {
  clearTimeout(poolSearchTimer);
  poolSearchTimer = setTimeout(() => fetchPoolCards(1), 400);
});

watch(activeTab, (tab) => {
  if (tab === "pool" && !poolCards.value.length) fetchPoolCards(1);
});

const cardStatusPill = (s) => { if (s === "ACTIVE" || s === "AVAILABIL") return "pill--emerald"; if (["BLOCKED", "EXPIRED", "HOTLISTED"].includes(s)) return "pill--red"; return "pill--amber"; };

// AVAILABIL is a fixed typo in the DB enum — display-only correction, the raw value is still sent/filtered on.
const CARD_STATUS_LABELS = { AVAILABIL: "AVAILABLE" };
const statusLabel = (s) => CARD_STATUS_LABELS[s] || s;

// ── Edit card modal ──────────────────────────────────────────────────
const cardModal = reactive({
  open: false, saving: false, error: "", cardId: null, cardRefId: "", reason: "",
  form: { cardHolderName: "", maskedPan: "", status: "ACTIVE" },
});

const openEditCard = (c) => {
  cardModal.cardId = c.id;
  cardModal.cardRefId = c.cardRefId || "";
  cardModal.error = "";
  cardModal.reason = "";
  cardModal.form = { cardHolderName: c.cardHolderName || "", maskedPan: c.maskedPan || "", status: c.status || "ACTIVE" };
  cardModal.open = true;
};
const closeCardModal = () => { if (cardModal.saving) return; cardModal.open = false; };

const saveCard = async () => {
  cardModal.error = "";
  if (!cardModal.form.cardHolderName?.trim()) { cardModal.error = "Card holder name is required"; return; }
  if (!cardModal.form.maskedPan?.trim()) { cardModal.error = "Masked PAN is required"; return; }

  cardModal.saving = true;
  try {
    const res = await updateCard(cardModal.cardId, {
      cardHolderName: cardModal.form.cardHolderName.trim(),
      maskedPan: cardModal.form.maskedPan.trim(),
      status: cardModal.form.status,
      reason: cardModal.reason || undefined,
    });
    if (res?.statusCode === "00") {
      showToast(res.message || "Card updated successfully", "success");
      cardModal.open = false;
      await fetchPoolCards();
    } else {
      cardModal.error = res?.message || "Failed to update card";
    }
  } catch (err) {
    cardModal.error = err?.response?.data?.message || err?.message || "Something went wrong";
  } finally {
    cardModal.saving = false;
  }
};

// ── Link card modal ───────────────────────────────────────────────────
const linkOptions = reactive({ merchants: [], walletProfiles: [] });
const linkOptionsLoaded = ref(false);

const linkModal = reactive({
  open: false, saving: false, error: "", cardId: null, cardRefId: "",
  targetType: "MERCHANT", targetId: "", reason: "", optionsLoading: false,
});

const openLinkModal = async (c) => {
  linkModal.cardId = c.id;
  linkModal.cardRefId = c.cardRefId || "";
  linkModal.error = "";
  linkModal.reason = "";
  linkModal.targetType = "MERCHANT";
  linkModal.targetId = "";
  linkModal.open = true;

  if (!linkOptionsLoaded.value) {
    linkModal.optionsLoading = true;
    try {
      const res = await getLinkOptions();
      if (res?.statusCode === "00") {
        linkOptions.merchants = res.data?.merchants || [];
        linkOptions.walletProfiles = res.data?.walletProfiles || [];
        linkOptionsLoaded.value = true;
      }
    } finally {
      linkModal.optionsLoading = false;
    }
  }
};

const closeLinkModal = () => { if (linkModal.saving) return; linkModal.open = false; };

const saveLink = async () => {
  linkModal.error = "";
  if (!linkModal.targetId) { linkModal.error = "Please select a target"; return; }

  linkModal.saving = true;
  try {
    const res = await linkCard(linkModal.cardId, {
      targetType: linkModal.targetType,
      targetId: linkModal.targetId,
      reason: linkModal.reason || undefined,
    });
    if (res?.statusCode === "00") {
      showToast(res.message || "Card linked successfully", "success");
      linkModal.open = false;
      await fetchPoolCards();
    } else {
      linkModal.error = res?.message || "Failed to link card";
    }
  } catch (err) {
    linkModal.error = err?.response?.data?.message || err?.message || "Something went wrong";
  } finally {
    linkModal.saving = false;
  }
};

const handleUnlink = async (c) => {
  try {
    const res = await unlinkCard(c.id);
    if (res?.statusCode === "00") {
      showToast(res.message || "Card unlinked successfully", "success");
      await fetchPoolCards();
    } else {
      showToast(res?.message || "Failed to unlink card", "error");
    }
  } catch (err) {
    showToast(err?.response?.data?.message || "Something went wrong", "error");
  }
};

/* ── Helpers ── */
const fmtDate = (d) => { if (!d) return "—"; const dt = new Date(d); if (isNaN(dt)) return "—"; return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`; };

onMounted(() => {
  doFetchApplications();
  fetchApplicationStats();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.view-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 16px; color: #0f172a; }
.mono { font-family: 'DM Mono', monospace; }
.ml-auto { margin-left: auto; }
.text-muted { color: #94a3b8; font-size: 12px; font-style: italic; }
.link-btn { background: none; border: none; color: #1142d4; cursor: pointer; text-decoration: underline; font-size: inherit; padding: 0; }

/* ── Header ── */
.view-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: #fff; border: 1px solid #e8edf3; border-radius: 14px; padding: 14px 18px; box-shadow: 0 1px 6px rgba(0,0,0,.04); }
.view-merchant-name { font-size: 18px; font-weight: 800; color: #0f172a; }
.view-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.btn-primary { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border: none; border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; background: #1142d4; color: #fff; transition: background .15s; }
.btn-primary:hover { background: #0e35a8; }

/* ── Tab Nav ── */
.tab-wrap { background: #fff; border: 1px solid #e8edf3; border-radius: 12px; padding: 4px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.tab-nav  { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
.tab-btn  { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: none; border-radius: 9px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; background: transparent; color: #64748b; transition: all .15s; flex-shrink: 0; font-family: inherit; }
.tab-btn .mdi { font-size: 15px; }
.tab-btn:hover { background: #f1f5f9; color: #0f172a; }
.tab-btn--active { background: #0f172a; color: #fff; box-shadow: 0 2px 8px rgba(15,23,42,.2); }
.tab-label { display: block; }
.tab-section { display: flex; flex-direction: column; gap: 14px; }

/* ── KPI Strip ── */
.kpi-strip { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
@media (min-width: 768px) { .kpi-strip { grid-template-columns: repeat(4, 1fr); } }
.kpi-card { background: #fff; border: 1px solid #e8edf3; border-top: 3px solid var(--kc, #1142d4); border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.kpi-icon-wrap { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.kpi-body { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.kpi-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; }
.kpi-value { font-size: 22px; font-weight: 800; color: #0f172a; font-family: 'DM Mono', monospace; }

/* ── Card ── */
.card { background: #fff; border: 1px solid #e8edf3; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.04); overflow: hidden; }
.card-header { display: flex; align-items: center; gap: 10px; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.card-icon-dot { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.card-title { font-size: 13.5px; font-weight: 700; color: #0f172a; }

/* ── Pills ── */
.pill { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; }
.pill--sm { font-size: 9.5px; padding: 1px 6px; }
.pill--indigo  { background: #e0e7ff; color: #4338ca; }
.pill--emerald { background: #d1fae5; color: #065f46; }
.pill--amber   { background: #fef3c7; color: #92400e; }
.pill--red     { background: #fee2e2; color: #991b1b; }
.pill--sky     { background: #e0f2fe; color: #0369a1; }
.pill--violet  { background: #ede9fe; color: #5b21b6; }
.pill--slate   { background: #f1f5f9; color: #64748b; }

/* ── Table ── */
.table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table   { width: 100%; border-collapse: collapse; font-size: 12.5px; min-width: 480px; }
.data-table thead { background: #f8fafc; }
.data-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
.data-table td { padding: 11px 14px; color: #334155; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover td { background: #f8fafc; }
.clickable-row { cursor: pointer; }
.row-actions { display: flex; gap: 6px; }

/* ── Empty State ── */
.empty-state     { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 40px 20px; text-align: center; }
.empty-icon-wrap { width: 56px; height: 56px; border-radius: 50%; background: rgba(17,66,212,.07); color: #1142d4; display: flex; align-items: center; justify-content: center; font-size: 26px; }
.empty-title { font-size: 13px; font-weight: 700; color: #334155; }
.w-loading-row { text-align: center; color: #94a3b8; padding: 24px 0; font-size: 13px; }

/* ── Cards filter bar ── */
.cards-filter-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 18px; border-bottom: 1px solid #f1f5f9; background: #fafafa; }
.cf-field { position: relative; display: flex; align-items: center; }
.cf-field--search { flex: 1 1 240px; min-width: 200px; }
.cf-search-icon { position: absolute; left: 10px; font-size: 15px; color: #94a3b8; pointer-events: none; }
.cf-input, .cf-select { border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px 11px; font-size: 12px; font-family: inherit; color: #0f172a; outline: none; background: #fff; transition: border .15s; }
.cf-input--search { width: 100%; padding-left: 30px; }
.cf-input--date { color: #475569; min-width: 132px; }
.cf-select { min-width: 118px; cursor: pointer; }
.cf-input:focus, .cf-select:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.08); }
.cf-reset-btn { width: 33px; height: 33px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 9px; background: #fff; color: #64748b; cursor: pointer; font-size: 15px; transition: all .15s; }
.cf-reset-btn:hover { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
@media (max-width: 760px) { .cards-filter-bar { flex-direction: column; align-items: stretch; } .cf-field--search { flex: 1 1 auto; } }

/* ── Pagination ── */
.cards-pagination { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 14px 18px; border-top: 1px solid #f1f5f9; }
.cf-page-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; color: #475569; cursor: pointer; font-size: 16px; transition: all .15s; }
.cf-page-btn:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
.cf-page-btn:disabled { opacity: .4; cursor: not-allowed; }
.cf-page-info { font-size: 12px; font-weight: 600; color: #64748b; }

/* ── Dialog ── */
.dialog-overlay { position: fixed; inset: 0; z-index: 400; background: rgba(15,23,42,.45); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.dialog { background: #fff; border-radius: 16px; width: 100%; max-width: 560px; box-shadow: 0 24px 64px rgba(0,0,0,.2); overflow: hidden; max-height: 90dvh; display: flex; flex-direction: column; }
.dialog--apply { max-width: 620px; }
.dialog--card { max-width: 560px; }
.dialog-hdr  { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.dialog-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.dialog-sub   { font-size: 12px; color: #64748b; margin-top: 2px; }
.dialog-body  { padding: 20px; overflow-y: auto; flex: 1; }
.dialog-section-lbl { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .07em; margin: 14px 0 8px; }
.icon-close { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; cursor: pointer; color: #64748b; font-size: 16px; transition: all .15s; }
.icon-close:hover { background: #f1f5f9; color: #0f172a; }
.dialog-fade-enter-active, .dialog-fade-leave-active { transition: opacity .2s ease; }
.dialog-fade-enter-from, .dialog-fade-leave-to { opacity: 0; }

/* ── Form fields ── */
.term-field { display: flex; flex-direction: column; gap: 5px; }
.term-field label { font-size: 10.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
.term-select, .term-input { border: 1px solid #e2e8f0; border-radius: 9px; padding: 8px 11px; font-size: 12.5px; font-family: inherit; color: #0f172a; outline: none; transition: border .15s; background: #fff; }
.term-select:focus, .term-input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.08); }
.term-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
.term-form-grid--2 { grid-template-columns: repeat(2, 1fr); }
.term-form-error { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; border-radius: 9px; padding: 10px 14px; font-size: 12.5px; font-weight: 600; margin-bottom: 14px; }
.req { color: #ef4444; margin-left: 2px; }
.field-error { font-size: 11px; color: #ef4444; }

/* ── Address mode tabs ── */
.addr-mode-tabs { display: flex; border: 1px solid #e2e8f0; border-radius: 9px; overflow: hidden; }
.addr-tab { flex: 1; padding: 10px 14px; background: #fff; border: none; font-size: 12px; font-weight: 600; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all .15s; }
.addr-tab:not(:last-child) { border-right: 1px solid #e2e8f0; }
.addr-tab:hover:not(:disabled) { background: #f8fafc; }
.addr-tab.active { color: #1142d4; background: rgba(17,66,212,.06); }
.addr-tab:disabled { opacity: .4; cursor: not-allowed; }
.official-addr-card { padding: 14px 0; }
.addr-confirm-box { background: #f0f6ff; border: 1px solid #c2d9f0; border-radius: 10px; padding: 14px; }
.addr-lines { display: flex; flex-direction: column; gap: 4px; }
.addr-lines span { font-size: 13px; color: #334155; }
.addr-no-official { display: flex; align-items: center; gap: 8px; background: #fff8e0; border: 1px solid #fde68a; border-radius: 10px; padding: 12px; font-size: 13px; color: #92400e; }

/* ── Confirm dialog ── */
.dialog--confirm { max-width: 480px; }
.icon-close-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; cursor: pointer; color: #64748b; flex-shrink: 0; }
.dialog__hdr { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
.dialog__title { font-size: 14.5px; font-weight: 700; color: #0f172a; }
.dialog__sub   { font-size: 12px; color: #64748b; margin-top: 2px; }
.dialog__body  { padding: 20px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; flex: 1; }
.confirm-icon-wrap { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.confirm-icon-wrap--info { background: rgba(17,66,212,.1); color: #1142d4; }
.confirm-change-summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
.ccs-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #f1f5f9; gap: 10px; }
.ccs-row:last-child { border-bottom: none; }
.ccs-row--new { background: rgba(17,66,212,.03); }
.ccs-label { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; }
.ccs-val   { font-size: 13px; font-weight: 600; color: #0f172a; }
.accept-row { display: flex; align-items: flex-start; gap: 10px; padding: 11px 13px; border: 1px solid #c2d9f0; border-radius: 9px; background: #fff; cursor: pointer; font-size: 12.5px; color: #334155; line-height: 1.5; }
.accept-row input { margin-top: 2px; accent-color: #1142d4; }
.accept-row--error { border-color: #fca5a5; background: #fef2f2; }
.confirm-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.btn-secondary { padding: 9px 18px; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 12.5px; font-weight: 600; background: #f8fafc; color: #475569; cursor: pointer; font-family: inherit; }
.btn-secondary:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
.btn-confirm { display: flex; align-items: center; gap: 6px; padding: 9px 20px; border: none; border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; }
.btn-confirm:disabled { opacity: .55; cursor: not-allowed; }
.btn-confirm--info:not(:disabled) { background: #1142d4; color: #fff; }
.btn-confirm--info:hover:not(:disabled) { background: #0e35a8; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }

/* ── Reason field (shared) ── */
.confirm-reason { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
.confirm-reason__label { font-size: 11.5px; font-weight: 700; color: #334155; }
.confirm-reason__opt   { font-weight: 400; color: #94a3b8; }
.confirm-reason__input { width: 100%; border: 1px solid #e2e8f0; border-radius: 9px; padding: 9px 12px; font-size: 12.5px; font-family: inherit; color: #0f172a; resize: vertical; outline: none; transition: border .15s; }
.confirm-reason__input:focus { border-color: #1142d4; box-shadow: 0 0 0 3px rgba(17,66,212,.08); }

/* ── Modal footer / buttons ── */
.w-modal-footer { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 16px 20px; border-top: 1px solid #f1f5f9; flex-shrink: 0; }
.w-btn-ghost { padding: 9px 18px; border: 1px solid #e2e8f0; border-radius: 9px; font-size: 12.5px; font-weight: 600; background: #f8fafc; color: #475569; cursor: pointer; font-family: inherit; }
.w-btn-ghost:hover:not(:disabled) { background: #f1f5f9; color: #0f172a; }
.w-btn-ghost:disabled { opacity: .55; cursor: not-allowed; }
.w-btn-primary { display: flex; align-items: center; gap: 6px; padding: 9px 20px; border: none; border-radius: 9px; font-size: 12.5px; font-weight: 700; cursor: pointer; font-family: inherit; background: #1142d4; color: #fff; }
.w-btn-primary:hover:not(:disabled) { background: #0e35a8; }
.w-btn-primary:disabled { opacity: .55; cursor: not-allowed; }

/* ── Toast ── */
.toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; align-items: center; gap: 9px; padding: 11px 18px; border-radius: 12px; font-size: 13px; font-weight: 600; box-shadow: 0 8px 28px rgba(0,0,0,.18); max-width: 340px; }
.toast--success { background: #0f172a; color: #fff; }
.toast--error   { background: #ef4444; color: #fff; }
.toast-enter-active, .toast-leave-active { transition: all .3s cubic-bezier(.34,1.56,.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(16px) scale(.95); }

.spin { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
