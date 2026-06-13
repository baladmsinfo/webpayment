<template>
  <div class="cust-page">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="page-title-wrap">
        <router-link to="/wallet-service" class="back-btn">
          <v-icon size="18">mdi-arrow-left</v-icon>
        </router-link>
        <div>
          <h1 class="page-title">Customers</h1>
          <p class="page-sub">Wallet service customer registry</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="export-btn" @click="handleExport">
          <v-icon size="16" class="mr-1">mdi-download-outline</v-icon>
          Export CSV
        </button>
        <button class="create-btn" @click="openCreateModal">
          <v-icon size="16" class="mr-1">mdi-plus</v-icon>
          New Customer
        </button>
      </div>
    </div>

    <!-- ── Stats Row ── -->
    <div class="stats-row" v-if="!statsLoading">
      <div class="stat-card">
        <div class="stat-icon bg-blue"><v-icon size="18" color="#fff">mdi-account-group</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Total Customers</span>
          <span class="stat-value">{{ customerStats.totalCustomers }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-green"><v-icon size="18" color="#fff">mdi-credit-card-multiple</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Total Cards</span>
          <span class="stat-value">{{ customerStats.totalCards }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-teal"><v-icon size="18" color="#fff">mdi-credit-card-check</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Active Cards</span>
          <span class="stat-value">{{ customerStats.activeCards }}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-red"><v-icon size="18" color="#fff">mdi-credit-card-off</v-icon></div>
        <div class="stat-body">
          <span class="stat-label">Blocked / Hotlisted</span>
          <span class="stat-value">{{ customerStats.blockedCards }}</span>
        </div>
      </div>
    </div>
    <div class="stats-row" v-else>
      <div v-for="i in 4" :key="i" class="stat-card stat-skeleton">
        <div class="sk sk-icon-s"></div>
        <div class="stat-body">
          <div class="sk sk-label"></div>
          <div class="sk sk-value"></div>
        </div>
      </div>
    </div>

    <!-- ── Filters Bar ── -->
    <div class="filters-bar">
      <div class="search-wrap">
        <v-icon size="16" class="search-icon">mdi-magnify</v-icon>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search name, phone, email…"
          class="search-input"
          @input="debouncedFetch"
        />
        <button v-if="filters.search" class="search-clear" @click="filters.search = ''; doFetch()">
          <v-icon size="14">mdi-close</v-icon>
        </button>
      </div>

      <div class="filter-group">
        <input v-model="filters.city"  type="text" placeholder="City"  class="mini-input" @input="debouncedFetch" />
        <input v-model="filters.state" type="text" placeholder="State" class="mini-input" @input="debouncedFetch" />
      </div>

      <div class="sort-wrap">
        <select v-model="filters.sortBy" class="sort-select" @change="doFetch">
          <option value="createdAt">Joined</option>
          <option value="name">Name</option>
          <option value="phone">Phone</option>
          <option value="city">City</option>
        </select>
        <button class="sort-dir-btn" @click="toggleSortDir">
          <v-icon size="16">{{ filters.sortDir === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
        </button>
      </div>

      <div class="per-page-wrap">
        <label class="per-page-label">Rows</label>
        <select v-model.number="filters.limit" class="per-page-select" @change="filters.page = 1; doFetch()">
          <option v-for="n in limitOptions" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- ── Summary chips ── -->
    <div class="summary-row" v-if="!customerLoading && customerList.length">
      <div class="summary-chip">
        <span class="sc-label">Showing</span>
        <span class="sc-value">{{ customerList.length }} of {{ customerPagination.total }}</span>
      </div>
      <div class="summary-chip green">
        <v-icon size="12">mdi-credit-card-check-outline</v-icon>
        <span class="sc-label">With active cards</span>
        <span class="sc-value">{{ customersWithActiveCards }}</span>
      </div>
      <div class="summary-chip amber">
        <v-icon size="12">mdi-credit-card-remove-outline</v-icon>
        <span class="sc-label">No cards</span>
        <span class="sc-value">{{ customersWithNoCards }}</span>
      </div>
    </div>

    <!-- ── Table panel ── -->
    <div class="panel table-panel">

      <!-- Skeleton -->
      <div v-if="customerLoading" class="skeleton-rows">
        <div v-for="i in filters.limit" :key="i" class="skeleton-row">
          <div class="sk sk-avatar"></div>
          <div class="sk-col">
            <div class="sk sk-name"></div>
            <div class="sk sk-sub"></div>
          </div>
          <div class="sk sk-phone"></div>
          <div class="sk sk-city"></div>
          <div class="sk sk-cards"></div>
          <div class="sk sk-date"></div>
          <div class="sk sk-action"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="customerError" class="empty-state error-state">
        <v-icon size="40" color="#ba1a1a">mdi-alert-circle-outline</v-icon>
        <p>{{ customerError }}</p>
        <button class="retry-btn" @click="doFetch">
          <v-icon size="14">mdi-refresh</v-icon> Retry
        </button>
      </div>

      <!-- Empty -->
      <div v-else-if="!customerList.length" class="empty-state">
        <v-icon size="52" color="#d0ccc0">mdi-account-search-outline</v-icon>
        <p>No customers found</p>
        <span v-if="hasActiveFilters" class="empty-hint">Try clearing your filters</span>
        <button v-else class="create-btn-sm" @click="openCreateModal">
          <v-icon size="14">mdi-plus</v-icon> Add first customer
        </button>
      </div>

      <!-- Table -->
      <template v-else>
        <div class="table-wrap">
          <table class="cust-table">
            <thead>
              <tr>
                <th class="th-avatar"></th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Cards</th>
                <th>Joined</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="cust in customerList" :key="cust.id">
                <!-- Customer row -->
                <tr class="cust-row" :class="{ expanded: expandedId === cust.id }" @click="toggleExpand(cust.id)">
                  <td class="td-avatar">
                    <div class="avatar" :style="{ background: avatarColor(cust.name) }">
                      {{ initials(cust.name) }}
                    </div>
                  </td>
                  <td class="td-name">
                    <span class="cust-name">{{ cust.name }}</span>
                    <span class="cust-email">{{ cust.email || cust.vpa || '—' }}</span>
                  </td>
                  <td class="td-phone">
                    <span class="phone-text">{{ cust.phone }}</span>
                  </td>
                  <td class="td-location">
                    <span v-if="cust.city || cust.state" class="location-text">
                      <v-icon size="12">mdi-map-marker-outline</v-icon>
                      {{ [cust.city, cust.state].filter(Boolean).join(', ') }}
                    </span>
                    <span v-else class="muted">—</span>
                  </td>
                  <td class="td-cards">
                    <div class="cards-summary" v-if="cust.cards.length">
                      <span
                        v-for="card in cust.cards.slice(0, 3)"
                        :key="card.id"
                        class="card-chip"
                        :class="cardStatusClass(card.status)"
                        :title="`${card.network} ${card.type} ••${card.last4} — ${card.status}`"
                      >
                        <v-icon size="10">mdi-credit-card-outline</v-icon>
                        ••{{ card.last4 }}
                      </span>
                      <span v-if="cust.cards.length > 3" class="card-more">+{{ cust.cards.length - 3 }}</span>
                    </div>
                    <span v-else class="no-cards">No cards</span>
                  </td>
                  <td class="td-date">
                    <span class="date-main">{{ formatDate(cust.createdAt) }}</span>
                    <span class="date-time">{{ formatTime(cust.createdAt) }}</span>
                  </td>
                  <td class="td-actions" @click.stop>
                    <button class="action-btn" title="Edit" @click="openEditModal(cust)">
                      <v-icon size="14">mdi-pencil-outline</v-icon>
                    </button>
                    <button class="action-btn danger" title="Delete" @click="confirmDelete(cust)">
                      <v-icon size="14">mdi-trash-can-outline</v-icon>
                    </button>
                    <button class="expand-btn" :class="{ rotated: expandedId === cust.id }" title="Details">
                      <v-icon size="16">mdi-chevron-down</v-icon>
                    </button>
                  </td>
                </tr>

                <!-- Expanded detail row -->
                <tr v-if="expandedId === cust.id" class="detail-row">
                  <td colspan="7" class="detail-td">
                    <div class="detail-panel">

                      <!-- Customer meta -->
                      <div class="detail-meta">
                        <div class="meta-item" v-if="cust.address1 || cust.address2">
                          <span class="meta-label">Address</span>
                          <span class="meta-val">{{ [cust.address1, cust.address2].filter(Boolean).join(', ') }}</span>
                        </div>
                        <div class="meta-item" v-if="cust.pincode">
                          <span class="meta-label">Pincode</span>
                          <span class="meta-val">{{ cust.pincode }}</span>
                        </div>
                      </div>

                      <!-- Cards section -->
                      <div class="cards-section">
                        <div class="section-header">
                          <span class="section-title">
                            <v-icon size="14">mdi-credit-card-multiple-outline</v-icon>
                            Cards ({{ cust.cards.length }})
                          </span>
                          <!-- Link Card Button -->
                          <button class="link-card-btn" @click.stop="openLinkCardModal(cust)">
                            <v-icon size="14">mdi-link-variant-plus</v-icon>
                            Link Card from Pool
                          </button>
                        </div>

                        <div class="cards-grid" v-if="cust.cards.length">
                          <div
                            v-for="card in cust.cards"
                            :key="card.id"
                            class="card-detail-tile"
                            :class="card.status.toLowerCase()"
                          >
                            <!-- Card header -->
                            <div class="card-tile-header">
                              <div class="card-network-badge" :class="card.network.toLowerCase()">
                                {{ card.network }}
                              </div>
                              <span class="card-type-badge">{{ card.type }}</span>
                              <span class="card-status-pill" :class="cardStatusClass(card.status)">{{ card.status }}</span>
                              <div class="card-tile-actions">
                                <button
                                  v-if="card.status !== 'ACTIVE'"
                                  class="card-action-btn activate"
                                  title="Activate"
                                  @click.stop="updateCardStatus(cust.id, card.id, 'ACTIVE')"
                                >
                                  <v-icon size="12">mdi-check-circle-outline</v-icon>
                                </button>
                                <button
                                  v-if="card.status === 'ACTIVE'"
                                  class="card-action-btn block"
                                  title="Block"
                                  @click.stop="updateCardStatus(cust.id, card.id, 'BLOCKED')"
                                >
                                  <v-icon size="12">mdi-block-helper</v-icon>
                                </button>
                                <!-- Unlink card button -->
                                <button
                                  class="card-action-btn unlink"
                                  title="Unlink card from customer"
                                  @click.stop="confirmUnlinkCard(cust, card)"
                                >
                                  <v-icon size="12">mdi-link-variant-off</v-icon>
                                </button>
                              </div>
                            </div>

                            <!-- Masked PAN -->
                            <div class="card-pan">{{ formatPan(card.maskedPan) }}</div>
                            <div class="card-holder">{{ card.cardHolderName }}</div>

                            <!-- Expiry + bank -->
                            <div class="card-meta-row">
                              <div class="card-meta-item">
                                <span class="cm-label">Expiry</span>
                                <span class="cm-val">{{ String(card.expiryMonth).padStart(2, '0') }}/{{ card.expiryYear }}</span>
                              </div>
                              <div class="card-meta-item">
                                <span class="cm-label">Issuer</span>
                                <span class="cm-val">{{ card.issuerBank }}</span>
                              </div>
                              <div class="card-meta-item" v-if="card.dailyLimit">
                                <span class="cm-label">Daily Limit</span>
                                <span class="cm-val">₹{{ formatCurrency(parseFloat(card.dailyLimit)) }}</span>
                              </div>
                              <div class="card-meta-item" v-if="card.availableLimit">
                                <span class="cm-label">Available</span>
                                <span class="cm-val">₹{{ formatCurrency(parseFloat(card.availableLimit)) }}</span>
                              </div>
                            </div>

                            <!-- Flags -->
                            <div class="card-flags">
                              <span class="flag-chip" :class="{ active: card.pinSet }">
                                <v-icon size="10">mdi-lock{{ card.pinSet ? '' : '-open' }}-outline</v-icon>
                                PIN {{ card.pinSet ? 'Set' : 'Not set' }}
                              </span>
                              <span class="flag-chip" :class="{ active: card.kycVerified }">
                                <v-icon size="10">mdi-shield{{ card.kycVerified ? '-check' : '-off' }}-outline</v-icon>
                                KYC {{ card.kycVerified ? 'Verified' : 'Pending' }}
                              </span>
                              <span class="flag-chip" :class="{ active: card.contactless }">
                                <v-icon size="10">mdi-nfc</v-icon>
                                Contactless
                              </span>
                              <span class="flag-chip" :class="{ active: card.internationalTxn }">
                                <v-icon size="10">mdi-earth</v-icon>
                                Intl Txn
                              </span>
                            </div>

                            <div class="card-added">Added {{ formatDate(card.createdAt) }}</div>
                          </div>
                        </div>

                        <div v-else class="no-cards-panel">
                          <v-icon size="28" color="#d0ccc0">mdi-credit-card-off-outline</v-icon>
                          <span>No cards linked to this customer</span>
                          <button class="link-card-btn-sm" @click.stop="openLinkCardModal(cust)">
                            <v-icon size="13">mdi-link-variant-plus</v-icon>
                            Link a card
                          </button>
                        </div>
                      </div>

                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar">
          <span class="pag-info">
            Page <strong>{{ customerPagination.page }}</strong> of <strong>{{ customerPagination.totalPages }}</strong>
            &nbsp;·&nbsp; {{ customerPagination.total }} total
          </span>
          <div class="pag-controls">
            <button class="pag-btn" :disabled="!customerPagination.hasPrev" @click="goTo(1)">
              <v-icon size="16">mdi-page-first</v-icon>
            </button>
            <button class="pag-btn" :disabled="!customerPagination.hasPrev" @click="goTo(customerPagination.page - 1)">
              <v-icon size="16">mdi-chevron-left</v-icon>
            </button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="pag-ellipsis">…</span>
              <button v-else class="pag-btn pag-num" :class="{ current: p === customerPagination.page }" @click="goTo(p)">{{ p }}</button>
            </template>
            <button class="pag-btn" :disabled="!customerPagination.hasNext" @click="goTo(customerPagination.page + 1)">
              <v-icon size="16">mdi-chevron-right</v-icon>
            </button>
            <button class="pag-btn" :disabled="!customerPagination.hasNext" @click="goTo(customerPagination.totalPages)">
              <v-icon size="16">mdi-page-last</v-icon>
            </button>
          </div>
          <div class="pag-jump">
            <span class="pag-jump-label">Go to</span>
            <input v-model.number="jumpPage" type="number" min="1" :max="customerPagination.totalPages" class="pag-jump-input" @keyup.enter="goTo(jumpPage)" />
            <button class="pag-jump-btn" @click="goTo(jumpPage)">Go</button>
          </div>
        </div>
      </template>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
         CREATE / EDIT CUSTOMER MODAL
    ═════════════════════════════════════════════════════════════════════ -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">
            <v-icon size="18" class="mr-2">{{ editingCustomer ? 'mdi-account-edit' : 'mdi-account-plus' }}</v-icon>
            {{ editingCustomer ? 'Edit Customer' : 'New Customer' }}
          </h2>
          <button class="modal-close" @click="closeModal"><v-icon size="20">mdi-close</v-icon></button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-field full">
              <label class="field-label">Full Name <span class="req">*</span></label>
              <input v-model="form.name" type="text" class="field-input" placeholder="e.g. Ravi Kumar" />
              <span v-if="formErrors.name" class="field-error">{{ formErrors.name }}</span>
            </div>
            <div class="form-field">
              <label class="field-label">Phone <span class="req">*</span></label>
              <input v-model="form.phone" type="tel" class="field-input" placeholder="10-digit mobile" :disabled="!!editingCustomer" />
              <span v-if="formErrors.phone" class="field-error">{{ formErrors.phone }}</span>
            </div>
            <div class="form-field">
              <label class="field-label">Email</label>
              <input v-model="form.email" type="email" class="field-input" placeholder="optional" />
            </div>
            <div class="form-field full">
              <label class="field-label">Address Line 1</label>
              <input v-model="form.address1" type="text" class="field-input" placeholder="House / Street" />
            </div>
            <div class="form-field full">
              <label class="field-label">Address Line 2</label>
              <input v-model="form.address2" type="text" class="field-input" placeholder="Area / Landmark" />
            </div>
            <div class="form-field">
              <label class="field-label">City</label>
              <input v-model="form.city" type="text" class="field-input" placeholder="City" />
            </div>
            <div class="form-field">
              <label class="field-label">State</label>
              <input v-model="form.state" type="text" class="field-input" placeholder="State" />
            </div>
            <div class="form-field">
              <label class="field-label">Pincode</label>
              <input v-model="form.pincode" type="text" class="field-input" placeholder="6-digit code" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="submit-btn" :disabled="modalLoading" @click="submitForm">
            <v-icon v-if="modalLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>{{ editingCustomer ? 'Save Changes' : 'Create Customer' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
         LINK CARD MODAL
         Shows all AVAILABIL cards from the WalletProfile pool for selection
    ═════════════════════════════════════════════════════════════════════ -->
    <div v-if="showLinkCardModal" class="modal-backdrop" @click.self="closeLinkCardModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h2 class="modal-title">
            <v-icon size="18" class="mr-2">mdi-link-variant-plus</v-icon>
            Link Card to <em class="modal-title-name">{{ linkCardTarget?.name }}</em>
          </h2>
          <button class="modal-close" @click="closeLinkCardModal"><v-icon size="20">mdi-close</v-icon></button>
        </div>

        <div class="modal-body">
          <!-- Filter bar inside modal -->
          <div class="lc-filters">
            <div class="search-wrap lc-search">
              <v-icon size="15" class="search-icon">mdi-magnify</v-icon>
              <input
                v-model="lcSearch"
                type="text"
                placeholder="Search by PAN, holder name, last 4…"
                class="search-input"
                @input="debouncedLcFetch"
              />
              <button v-if="lcSearch" class="search-clear" @click="lcSearch = ''; fetchAvailableCards()">
                <v-icon size="14">mdi-close</v-icon>
              </button>
            </div>
            <select v-model="lcTypeFilter" class="sort-select" @change="fetchAvailableCards">
              <option value="">All Types</option>
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
              <option value="PREPAID">Prepaid</option>
              <option value="CDM">CDM</option>
            </select>
            <select v-model="lcNetworkFilter" class="sort-select" @change="fetchAvailableCards">
              <option value="">All Networks</option>
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">Mastercard</option>
              <option value="RUPAY">RuPay</option>
              <option value="AMEX">AMEX</option>
              <option value="DINERS">Diners</option>
            </select>
          </div>

          <!-- Loading state -->
          <div v-if="availableCardsLoading" class="lc-loading">
            <div class="lc-skeleton" v-for="i in 3" :key="i">
              <div class="sk lc-sk-badge"></div>
              <div class="lc-sk-body">
                <div class="sk lc-sk-pan"></div>
                <div class="sk lc-sk-name"></div>
              </div>
              <div class="sk lc-sk-btn"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!availableCards.length" class="lc-empty">
            <v-icon size="44" color="#d0ccc0">mdi-credit-card-search-outline</v-icon>
            <p>No available cards in the pool</p>
            <span class="empty-hint">Cards with availability <strong>AVAILABIL</strong> will appear here</span>
          </div>

          <!-- Card grid -->
          <div v-else class="lc-grid">
            <div
              v-for="card in availableCards"
              :key="card.id"
              class="lc-card"
              :class="{ 'lc-card-selected': selectedCardId === card.id }"
              @click="selectedCardId = card.id"
            >
              <!-- Selection indicator -->
              <div class="lc-select-ring">
                <v-icon v-if="selectedCardId === card.id" size="16" color="#1a6fc4">mdi-check-circle</v-icon>
                <v-icon v-else size="16" color="#d0ccc0">mdi-circle-outline</v-icon>
              </div>

              <!-- Card body -->
              <div class="lc-card-body">
                <div class="lc-card-top">
                  <span class="card-network-badge" :class="card.network.toLowerCase()">{{ card.network }}</span>
                  <span class="card-type-badge">{{ card.type }}</span>
                  <span class="avail-badge">
                    <v-icon size="10">mdi-check-circle-outline</v-icon>
                    Available
                  </span>
                </div>
                <div class="lc-pan">{{ formatPan(card.maskedPan) }}</div>
                <div class="lc-holder">{{ card.cardHolderName }}</div>
                <div class="lc-meta">
                  <span>Exp {{ String(card.expiryMonth).padStart(2, '0') }}/{{ card.expiryYear }}</span>
                  <span class="lc-sep">·</span>
                  <span>{{ card.issuerBank }}</span>
                  <template v-if="card.dailyLimit">
                    <span class="lc-sep">·</span>
                    <span>₹{{ formatCurrency(parseFloat(card.dailyLimit)) }} daily</span>
                  </template>
                </div>
                <div class="lc-flags">
                  <span class="flag-chip" :class="{ active: card.pinSet }">
                    <v-icon size="9">mdi-lock-outline</v-icon>
                    PIN {{ card.pinSet ? 'Set' : 'Not set' }}
                  </span>
                  <span class="flag-chip" :class="{ active: card.kycVerified }">
                    <v-icon size="9">mdi-shield-check-outline</v-icon>
                    KYC {{ card.kycVerified ? 'OK' : 'Pending' }}
                  </span>
                  <span class="flag-chip" :class="{ active: card.contactless }">
                    <v-icon size="9">mdi-nfc</v-icon>
                    Contactless
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="lc-footer-info" v-if="availableCards.length">
            <span class="sc-label">{{ availableCards.length }} card{{ availableCards.length !== 1 ? 's' : '' }} available</span>
            <span v-if="selectedCardId" class="sc-value ml-2">· 1 selected</span>
          </div>
          <button class="cancel-btn" @click="closeLinkCardModal">Cancel</button>
          <button
            class="submit-btn"
            :disabled="!selectedCardId || linkCardLoading"
            @click="doLinkCard"
          >
            <v-icon v-if="linkCardLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Link Selected Card</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
         UNLINK CARD CONFIRM MODAL
    ═════════════════════════════════════════════════════════════════════ -->
    <div v-if="unlinkCardTarget" class="modal-backdrop" @click.self="unlinkCardTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2 class="modal-title danger-title">
            <v-icon size="18" class="mr-2" color="#ba1a1a">mdi-link-variant-off</v-icon>
            Unlink Card
          </h2>
          <button class="modal-close" @click="unlinkCardTarget = null"><v-icon size="20">mdi-close</v-icon></button>
        </div>
        <div class="modal-body">
          <p class="confirm-text">
            Unlink card <strong>••{{ unlinkCardTarget.card.last4 }}</strong>
            ({{ unlinkCardTarget.card.network }} {{ unlinkCardTarget.card.type }}) from
            <strong>{{ unlinkCardTarget.customer.name }}</strong>?
            The card will return to the available pool.
          </p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="unlinkCardTarget = null">Cancel</button>
          <button class="delete-btn" :disabled="unlinkLoading" @click="doUnlinkCard">
            <v-icon v-if="unlinkLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Yes, Unlink</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
         DELETE CONFIRM MODAL
    ═════════════════════════════════════════════════════════════════════ -->
    <div v-if="deleteTarget" class="modal-backdrop" @click.self="deleteTarget = null">
      <div class="modal modal-sm">
        <div class="modal-header">
          <h2 class="modal-title danger-title">
            <v-icon size="18" class="mr-2" color="#ba1a1a">mdi-alert-circle-outline</v-icon>
            Delete Customer
          </h2>
          <button class="modal-close" @click="deleteTarget = null"><v-icon size="20">mdi-close</v-icon></button>
        </div>
        <div class="modal-body">
          <p class="confirm-text">
            Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>?
            This will also remove all their linked beneficiaries.
          </p>
          <!-- Show card unlink warning if customer has cards -->
          <div v-if="deleteTarget.cards?.length" class="delete-card-warning">
            <v-icon size="15" color="#c4751a">mdi-information-outline</v-icon>
            <span>
              <strong>{{ deleteTarget.cards.length }}</strong> linked card{{ deleteTarget.cards.length !== 1 ? 's' : '' }}
              will be <strong>unlinked</strong> and returned to the available pool.
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="deleteTarget = null">Cancel</button>
          <button class="delete-btn" :disabled="deleteLoading" @click="doDelete">
            <v-icon v-if="deleteLoading" size="16" class="spin">mdi-loading</v-icon>
            <span v-else>Yes, Delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMsg" class="toast" :class="toastType">
      <v-icon size="16">{{ toastType === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      <span>{{ toastMsg }}</span>
      <button class="toast-close" @click="toastMsg = ''"><v-icon size="14">mdi-close</v-icon></button>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: "walletservicelayer",
  middleware: "auth",
});

import { ref, reactive, computed, onMounted } from "vue";
import { useWalletServiceCustomerApi } from "@/composables/apis/useWalletServiceCustomerApi";

const {
  customerList,
  customerPagination,
  customerStats,
  customerLoading,
  customerError,
  statsLoading,
  availableCards,
  availableCardsLoading,
  wsCreateCustomer,
  wsFetchCustomers,
  wsUpdateCustomer,
  wsDeleteCustomer,
  wsUpdateCardStatus,
  wsFetchCustomerStats,
  wsFetchAvailableCards,
  wsLinkCard,
  wsUnlinkCard,
} = useWalletServiceCustomerApi();

// ── Filter / sort state ────────────────────────────────────────────────────
const filters = reactive({
  page:    1,
  limit:   10,
  search:  "",
  city:    "",
  state:   "",
  sortBy:  "createdAt",
  sortDir: "desc",
});
const limitOptions = [5, 10, 25, 50, 100];
const jumpPage     = ref(1);

// ── Expand state ───────────────────────────────────────────────────────────
const expandedId = ref(null);
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// ── Computed ───────────────────────────────────────────────────────────────
const hasActiveFilters = computed(() => filters.search || filters.city || filters.state);

const customersWithActiveCards = computed(() =>
  customerList.value.filter(c => c.cards.some(k => k.status === "ACTIVE")).length
);
const customersWithNoCards = computed(() =>
  customerList.value.filter(c => c.cards.length === 0).length
);

const visiblePages = computed(() => {
  const total = customerPagination.value.totalPages;
  const cur   = customerPagination.value.page;
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (cur > 3) pages.push("...");
  const start = Math.max(2, cur - 1);
  const end   = Math.min(total - 1, cur + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (cur < total - 2) pages.push("...");
  pages.push(total);
  return pages;
});

// ── Fetch ──────────────────────────────────────────────────────────────────
const doFetch = async () => {
  jumpPage.value = filters.page;
  await wsFetchCustomers({
    page:    filters.page,
    limit:   filters.limit,
    search:  filters.search  || undefined,
    city:    filters.city    || undefined,
    state:   filters.state   || undefined,
    sortBy:  filters.sortBy,
    sortDir: filters.sortDir,
  });
};

let debounceTimer = null;
const debouncedFetch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { filters.page = 1; doFetch(); }, 400);
};

const goTo = (p) => {
  const clamped = Math.max(1, Math.min(p, customerPagination.value.totalPages));
  filters.page = clamped;
  doFetch();
};

const toggleSortDir = () => {
  filters.sortDir = filters.sortDir === "asc" ? "desc" : "asc";
  doFetch();
};

// ── Create / Edit modal ────────────────────────────────────────────────────
const showModal       = ref(false);
const modalLoading    = ref(false);
const editingCustomer = ref(null);

const emptyForm = () => ({
  name: "", phone: "", email: "", vpa: "",
  address1: "", address2: "", city: "", state: "", pincode: "", dob: "",
});
const form       = reactive(emptyForm());
const formErrors = reactive({});

const openCreateModal = () => {
  Object.assign(form, emptyForm());
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  editingCustomer.value = null;
  showModal.value = true;
};

const openEditModal = (cust) => {
  Object.assign(form, {
    name:     cust.name     || "",
    phone:    cust.phone    || "",
    email:    cust.email    || "",
    vpa:      cust.vpa      || "",
    address1: cust.address1 || "",
    address2: cust.address2 || "",
    city:     cust.city     || "",
    state:    cust.state    || "",
    pincode:  cust.pincode  || "",
    dob:      cust.dob ? cust.dob.slice(0, 10) : "",
  });
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  editingCustomer.value = cust;
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; editingCustomer.value = null; };

const validateForm = () => {
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
  if (!form.name.trim())  formErrors.name  = "Name is required";
  if (!form.phone.trim()) formErrors.phone = "Phone is required";
  else if (!/^\d{10}$/.test(form.phone.trim())) formErrors.phone = "Enter a valid 10-digit phone";
  return Object.keys(formErrors).length === 0;
};

const submitForm = async () => {
  if (!validateForm()) return;
  modalLoading.value = true;
  try {
    const payload = {
      name:     form.name.trim(),
      phone:    form.phone.trim(),
      email:    form.email.trim()    || undefined,
      vpa:      form.vpa.trim()      || undefined,
      address1: form.address1.trim() || undefined,
      address2: form.address2.trim() || undefined,
      city:     form.city.trim()     || undefined,
      state:    form.state.trim()    || undefined,
      pincode:  form.pincode.trim()  || undefined,
      dob:      form.dob             || undefined,
    };

    const res = editingCustomer.value
      ? await wsUpdateCustomer(editingCustomer.value.id, payload)
      : await wsCreateCustomer(payload);

    if (res?.statusCode === "00") {
      showToast(res.message || "Success", "success");
      closeModal();
      doFetch();
      wsFetchCustomerStats();
    } else {
      showToast(res?.message || "Operation failed", "error");
    }
  } finally {
    modalLoading.value = false;
  }
};

// ── Delete ─────────────────────────────────────────────────────────────────
const deleteTarget  = ref(null);
const deleteLoading = ref(false);

const confirmDelete = (cust) => { deleteTarget.value = cust; };
const doDelete      = async () => {
  if (!deleteTarget.value) return;
  deleteLoading.value = true;
  try {
    const res = await wsDeleteCustomer(deleteTarget.value.id);
    if (res?.statusCode === "00") {
      showToast("Customer deleted", "success");
      deleteTarget.value = null;
      // If the deleted customer was expanded, collapse
      if (expandedId.value === deleteTarget.value?.id) expandedId.value = null;
      doFetch();
      wsFetchCustomerStats();
    } else {
      showToast(res?.message || "Delete failed", "error");
    }
  } finally {
    deleteLoading.value = false;
  }
};

// ── Card status update ─────────────────────────────────────────────────────
const updateCardStatus = async (customerId, cardId, status) => {
  const res = await wsUpdateCardStatus(customerId, cardId, status);
  if (res?.statusCode === "00") {
    showToast(`Card ${status.toLowerCase()}`, "success");
    doFetch();
  } else {
    showToast(res?.message || "Failed", "error");
  }
};

// ── Link Card Modal ────────────────────────────────────────────────────────
const showLinkCardModal = ref(false);
const linkCardTarget    = ref(null);   // the customer we're linking to
const selectedCardId    = ref(null);   // the card chosen in the picker
const linkCardLoading   = ref(false);
const lcSearch          = ref("");
const lcTypeFilter      = ref("");
const lcNetworkFilter   = ref("");

const openLinkCardModal = async (cust) => {
  linkCardTarget.value = cust;
  selectedCardId.value = null;
  lcSearch.value       = "";
  lcTypeFilter.value   = "";
  lcNetworkFilter.value = "";
  showLinkCardModal.value = true;
  await fetchAvailableCards();
};

const closeLinkCardModal = () => {
  showLinkCardModal.value = false;
  linkCardTarget.value    = null;
  selectedCardId.value    = null;
};

const fetchAvailableCards = async () => {
  await wsFetchAvailableCards({
    search:  lcSearch.value       || undefined,
    type:    lcTypeFilter.value   || undefined,
    network: lcNetworkFilter.value || undefined,
  });
};

let lcDebounceTimer = null;
const debouncedLcFetch = () => {
  clearTimeout(lcDebounceTimer);
  lcDebounceTimer = setTimeout(fetchAvailableCards, 350);
};

const doLinkCard = async () => {
  if (!selectedCardId.value || !linkCardTarget.value) return;
  linkCardLoading.value = true;
  try {
    const res = await wsLinkCard(linkCardTarget.value.id, selectedCardId.value);
    if (res?.statusCode === "00") {
      showToast("Card linked successfully", "success");
      closeLinkCardModal();
      doFetch();
      wsFetchCustomerStats();
    } else {
      showToast(res?.message || "Failed to link card", "error");
    }
  } finally {
    linkCardLoading.value = false;
  }
};

// ── Unlink Card ────────────────────────────────────────────────────────────
const unlinkCardTarget = ref(null);   // { customer, card }
const unlinkLoading    = ref(false);

const confirmUnlinkCard = (customer, card) => {
  unlinkCardTarget.value = { customer, card };
};

const doUnlinkCard = async () => {
  if (!unlinkCardTarget.value) return;
  unlinkLoading.value = true;
  try {
    const { customer, card } = unlinkCardTarget.value;
    const res = await wsUnlinkCard(customer.id, card.id);
    if (res?.statusCode === "00") {
      showToast("Card unlinked from customer", "success");
      unlinkCardTarget.value = null;
      doFetch();
      wsFetchCustomerStats();
    } else {
      showToast(res?.message || "Failed to unlink card", "error");
    }
  } finally {
    unlinkLoading.value = false;
  }
};

// ── Export CSV ─────────────────────────────────────────────────────────────
const handleExport = () => {
  if (!customerList.value.length) { showToast("No data to export", "error"); return; }
  const headers = ["ID", "Name", "Phone", "Email", "VPA", "City", "State", "Cards", "Joined"];
  const rows = customerList.value.map(c => [
    c.id, `"${c.name}"`, c.phone,
    c.email || "", c.vpa || "",
    c.city  || "", c.state || "",
    c.cards.length,
    new Date(c.createdAt).toISOString(),
  ]);
  const csv  = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a"); a.href = url;
  a.download = `customers-page-${filters.page}.csv`; a.click();
  URL.revokeObjectURL(url);
  showToast("CSV exported");
};

// ── Utilities ──────────────────────────────────────────────────────────────
const formatCurrency = (v) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0);

const formatDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const formatTime = (s) =>
  s ? new Date(s).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

const formatPan = (pan) => {
  if (!pan) return "••••  ••••  ••••  ••••";
  return pan.replace(/(.{4})/g, "$1  ").trim();
};

const initials = (name) =>
  (name || "?").split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");

const COLORS = ["#1a6fc4","#3b7c0c","#8b2fc9","#c4521a","#1a8f8f","#c4881a","#2a6e2a"];
const avatarColor = (name) => COLORS[(name || "").charCodeAt(0) % COLORS.length];

const cardStatusClass = (s) => ({
  "cs-active":   s === "ACTIVE",
  "cs-blocked":  s === "BLOCKED" || s === "HOTLISTED",
  "cs-inactive": s === "INACTIVE" || s === "EXPIRED",
});

// Toast
const toastMsg  = ref("");
const toastType = ref("success");
const showToast = (msg, type = "success") => {
  toastMsg.value = msg; toastType.value = type;
  setTimeout(() => { toastMsg.value = ""; }, 4000);
};

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => { doFetch(); wsFetchCustomerStats(); });
</script>

<style scoped>
* { box-sizing: border-box; }

.cust-page {
  padding: 24px;
  background: #f7f6f3;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Header */
.page-header {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
}
.page-title-wrap { display: flex; align-items: center; gap: 14px; }
.back-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: #fff; border: 1px solid #eceae3;
  display: flex; align-items: center; justify-content: center;
  color: #1a1a1a; text-decoration: none; transition: background .15s;
}
.back-btn:hover { background: #f0ede8; }
.page-title { margin: 0; font-size: 20px; font-weight: 700; color: #1a1a1a; }
.page-sub   { margin: 2px 0 0; font-size: 12px; color: #888780; }
.header-actions { display: flex; gap: 8px; align-items: center; }

.export-btn, .create-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 9px 18px; border-radius: 50px;
  font-size: 13px; font-weight: 500; cursor: pointer; transition: background .15s;
}
.export-btn { border: 1px solid #dbd7cc; background: #fff; color: #1a1a1a; }
.export-btn:hover { background: #f5f5f3; }
.create-btn { border: none; background: #1a6fc4; color: #fff; }
.create-btn:hover { background: #155da0; }

/* Stats */
.stats-row { display: flex; gap: 12px; flex-wrap: wrap; }
.stat-card {
  flex: 1; min-width: 160px; background: #fff; border: 1px solid #eceae3; border-radius: 14px;
  padding: 16px; display: flex; align-items: center; gap: 12px;
}
.stat-skeleton { animation: pulse 1.8s infinite; }
.stat-icon {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.bg-blue  { background: #1a6fc4; }
.bg-green { background: #3b7c0c; }
.bg-teal  { background: #1a8f8f; }
.bg-red   { background: #ba1a1a; }
.stat-body { display: flex; flex-direction: column; gap: 3px; }
.stat-label { font-size: 11px; color: #888780; font-weight: 500; }
.stat-value { font-size: 20px; font-weight: 700; color: #1a1a1a; line-height: 1; }

/* Filters bar */
.filters-bar {
  display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
  background: #fff; border: 1px solid #eceae3; border-radius: 14px; padding: 14px 16px;
}
.search-wrap {
  position: relative; display: flex; align-items: center; flex: 1; min-width: 180px;
}
.search-icon { position: absolute; left: 10px; color: #888780; pointer-events: none; }
.search-input {
  width: 100%; padding: 8px 30px 8px 32px; border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 13px; font-family: inherit; background: #faf9f7; outline: none; transition: border .2s;
}
.search-input:focus { border-color: #1a6fc4; background: #fff; }
.search-clear { position: absolute; right: 8px; background: none; border: none; cursor: pointer; color: #888780; }
.filter-group { display: flex; gap: 6px; }
.mini-input {
  padding: 8px 12px; border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 12px; font-family: inherit; background: #faf9f7; outline: none; width: 100px;
  transition: border .2s;
}
.mini-input:focus { border-color: #1a6fc4; background: #fff; }
.sort-wrap { display: flex; gap: 4px; align-items: center; }
.sort-select {
  padding: 7px 10px; border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 12px; font-family: inherit; background: #faf9f7; outline: none; cursor: pointer;
}
.sort-dir-btn {
  width: 32px; height: 32px; border: 1px solid #e0dcd8; border-radius: 8px;
  background: #faf9f7; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555552; transition: background .15s;
}
.sort-dir-btn:hover { background: #f0ede8; }
.per-page-wrap { display: flex; align-items: center; gap: 6px; margin-left: auto; }
.per-page-label { font-size: 12px; color: #888780; }
.per-page-select {
  padding: 7px 10px; border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 12px; font-family: inherit; background: #faf9f7; outline: none; cursor: pointer;
}

/* Summary */
.summary-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.summary-chip {
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px;
  background: #fff; border: 1px solid #eceae3; font-size: 12px;
}
.sc-label { color: #888780; }
.sc-value { font-weight: 600; color: #1a1a1a; }
.summary-chip.green { background: #eaf3de; border-color: #c2e0a0; }
.summary-chip.amber { background: #fff8e0; border-color: #f5d680; }

/* Panel */
.panel { background: #fff; border: 1px solid #eceae3; border-radius: 16px; overflow: hidden; }

/* Table */
.table-wrap { overflow-x: auto; }
.cust-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.cust-table thead tr { background: #faf9f7; border-bottom: 1px solid #eceae3; }
.cust-table th {
  padding: 12px 14px; text-align: left;
  font-size: 11px; font-weight: 600; color: #888780;
  text-transform: uppercase; letter-spacing: .4px; white-space: nowrap;
}
.th-avatar { width: 48px; }
.th-actions { text-align: right; }

.cust-row { border-bottom: 1px solid #f0ede8; cursor: pointer; transition: background .12s; }
.cust-row:hover { background: #faf9f7; }
.cust-row.expanded { background: #f5f3ef; border-bottom: none; }
.cust-table td { padding: 12px 14px; vertical-align: middle; }

.td-avatar { width: 48px; }
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #fff;
}

.td-name { max-width: 220px; }
.cust-name { display: block; font-weight: 600; color: #1a1a1a; font-size: 13px; }
.cust-email { display: block; font-size: 11px; color: #888780; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }

.phone-text { font-family: "Courier New", monospace; font-size: 12px; color: #333; }
.location-text { font-size: 12px; color: #555552; display: flex; align-items: center; gap: 3px; }
.muted { color: #ccc8c0; font-size: 12px; }

.cards-summary { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.card-chip {
  display: inline-flex; align-items: center; gap: 3px; padding: 2px 7px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
}
.card-chip.cs-active   { background: #eaf3de; color: #3b6d11; }
.card-chip.cs-blocked  { background: #fcebeb; color: #a32d2d; }
.card-chip.cs-inactive { background: #f5f5f3; color: #888780; }
.card-more { font-size: 11px; color: #888780; padding: 2px 4px; }
.no-cards  { font-size: 11px; color: #ccc8c0; }

.td-date { white-space: nowrap; }
.date-main { display: block; font-weight: 500; color: #1a1a1a; font-size: 12px; }
.date-time { display: block; font-size: 11px; color: #888780; margin-top: 2px; }

.td-actions { text-align: right; white-space: nowrap; }
.action-btn {
  width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e0dcd8; background: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555552; transition: all .15s; margin-right: 4px;
}
.action-btn:hover        { background: #f0ede8; }
.action-btn.danger:hover { background: #fcebeb; border-color: #f5ccc8; color: #a32d2d; }
.expand-btn {
  width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e0dcd8; background: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555552; transition: transform .2s, background .15s;
}
.expand-btn.rotated { transform: rotate(180deg); background: #f0ede8; }

/* Detail row */
.detail-row { background: #f9f8f5; }
.detail-td  { padding: 0 !important; }
.detail-panel { padding: 16px 20px 20px; border-top: 1px solid #eceae3; }

.detail-meta { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }
.meta-item { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: 10px; font-weight: 600; color: #888780; text-transform: uppercase; letter-spacing: .4px; }
.meta-val   { font-size: 13px; color: #1a1a1a; font-weight: 500; }
.meta-val.mono { font-family: "Courier New", monospace; font-size: 11px; color: #555552; }

.section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px; flex-wrap: wrap; gap: 8px;
}
.section-title {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 700; color: #555552;
  text-transform: uppercase; letter-spacing: .4px;
}

/* Link card button (inside section header) */
.link-card-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 50px;
  border: 1px solid #1a6fc4; background: #edf4fc; color: #1a6fc4;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s;
}
.link-card-btn:hover { background: #1a6fc4; color: #fff; }

/* Link card button (inside no-cards panel) */
.link-card-btn-sm {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 16px; border-radius: 50px; border: none;
  background: #1a6fc4; color: #fff;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: background .15s; margin-top: 4px;
}
.link-card-btn-sm:hover { background: #155da0; }

.cards-grid { display: flex; gap: 12px; flex-wrap: wrap; }

/* Card tile */
.card-detail-tile {
  width: 280px; flex-shrink: 0;
  background: #fff; border: 1px solid #eceae3; border-radius: 12px;
  padding: 14px; display: flex; flex-direction: column; gap: 8px;
  transition: box-shadow .15s;
}
.card-detail-tile:hover { box-shadow: 0 2px 12px rgba(0,0,0,.08); }
.card-detail-tile.blocked,
.card-detail-tile.hotlisted { border-color: #f5ccc8; background: #fffafa; }
.card-detail-tile.inactive,
.card-detail-tile.expired   { border-color: #e0dcd8; background: #faf9f7; opacity: .8; }

.card-tile-header { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.card-network-badge {
  padding: 2px 8px; border-radius: 4px;
  font-size: 10px; font-weight: 800; letter-spacing: .5px;
  background: #1a1a1a; color: #fff;
}
.card-network-badge.visa       { background: #1a3c8f; }
.card-network-badge.mastercard { background: #eb001b; }
.card-network-badge.rupay      { background: #097a3b; }
.card-network-badge.amex       { background: #006fcf; }
.card-network-badge.diners     { background: #004b87; }

.card-type-badge {
  font-size: 10px; font-weight: 600; color: #555552; padding: 2px 7px; border-radius: 4px;
  background: #f0ede8; border: 1px solid #e0dcd8;
}
.card-status-pill { padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
.cs-active   { background: #eaf3de; color: #3b6d11; }
.cs-blocked  { background: #fcebeb; color: #a32d2d; }
.cs-inactive { background: #f5f5f3; color: #888780; }

.card-tile-actions { margin-left: auto; display: flex; gap: 4px; }
.card-action-btn {
  width: 22px; height: 22px; border-radius: 5px; border: 1px solid #e0dcd8; background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 10px; transition: all .15s;
}
.card-action-btn.activate:hover { background: #eaf3de; border-color: #c2e0a0; color: #3b6d11; }
.card-action-btn.block:hover    { background: #fcebeb; border-color: #f5ccc8; color: #a32d2d; }
.card-action-btn.unlink:hover   { background: #fff3e0; border-color: #ffd699; color: #c4751a; }

.card-pan { font-family: "Courier New", monospace; font-size: 14px; font-weight: 700; color: #1a1a1a; letter-spacing: 1px; }
.card-holder { font-size: 12px; font-weight: 500; color: #555552; }

.card-meta-row { display: flex; flex-wrap: wrap; gap: 12px; padding: 8px 0; border-top: 1px solid #f0ede8; }
.card-meta-item { display: flex; flex-direction: column; gap: 1px; }
.cm-label { font-size: 10px; color: #888780; font-weight: 600; text-transform: uppercase; }
.cm-val   { font-size: 12px; font-weight: 600; color: #1a1a1a; }

.card-flags { display: flex; flex-wrap: wrap; gap: 5px; }
.flag-chip {
  display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 20px;
  font-size: 10px; font-weight: 500; background: #f5f5f3; color: #888780; border: 1px solid #e8e4df;
}
.flag-chip.active { background: #eaf3de; color: #3b6d11; border-color: #c2e0a0; }

.card-added { font-size: 10px; color: #aaa8a0; border-top: 1px solid #f0ede8; padding-top: 6px; }

.no-cards-panel {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 20px 0; color: #ccc8c0; font-size: 13px;
}

/* Pagination */
.pagination-bar {
  display: flex; align-items: center; flex-wrap: wrap; gap: 12px;
  padding: 14px 20px; border-top: 1px solid #eceae3; background: #faf9f7;
}
.pag-info { font-size: 12px; color: #888780; white-space: nowrap; }
.pag-info strong { color: #1a1a1a; }
.pag-controls { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.pag-btn {
  min-width: 32px; height: 32px; border: 1px solid #e0dcd8; border-radius: 8px;
  background: #fff; color: #1a1a1a; font-size: 12px; font-weight: 500; cursor: pointer;
  display: flex; align-items: center; justify-content: center; padding: 0 6px; transition: all .15s;
}
.pag-btn:hover:not(:disabled) { background: #f0ede8; border-color: #d0ccc0; }
.pag-btn:disabled { opacity: .35; cursor: default; }
.pag-btn.current { background: #1a6fc4; color: #fff; border-color: #1a6fc4; font-weight: 700; }
.pag-ellipsis { padding: 0 4px; font-size: 14px; color: #888780; line-height: 32px; }
.pag-jump { display: flex; align-items: center; gap: 6px; }
.pag-jump-label { font-size: 12px; color: #888780; white-space: nowrap; }
.pag-jump-input {
  width: 50px; padding: 6px 8px; border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 12px; font-family: inherit; text-align: center; outline: none; background: #fff;
}
.pag-jump-input:focus { border-color: #1a6fc4; }
.pag-jump-btn {
  padding: 6px 12px; border: none; border-radius: 8px; background: #1a6fc4; color: #fff;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: background .15s;
}
.pag-jump-btn:hover { background: #155da0; }

/* Skeleton */
.skeleton-rows { padding: 8px 0; }
.skeleton-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-bottom: 1px solid #f0ede8;
}
.sk {
  background: linear-gradient(90deg, #f0ede8 0%, #e5e0d7 50%, #f0ede8 100%);
  background-size: 200% 100%; border-radius: 6px;
  animation: shimmer 1.8s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: .6; } }
.sk-avatar  { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; }
.sk-icon-s  { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
.sk-col     { display: flex; flex-direction: column; gap: 5px; flex: 1; }
.sk-name    { height: 13px; width: 120px; }
.sk-sub     { height: 11px; width: 80px; }
.sk-phone   { width: 90px; height: 13px; }
.sk-city    { width: 70px; height: 13px; }
.sk-cards   { width: 100px; height: 20px; border-radius: 20px; }
.sk-date    { width: 70px; height: 13px; }
.sk-action  { width: 60px; height: 28px; border-radius: 8px; }
.sk-label   { height: 10px; width: 60px; }
.sk-value   { height: 22px; width: 40px; margin-top: 4px; }

/* Empty / Error */
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 60px 20px; color: #d0ccc0;
}
.empty-state p  { font-size: 14px; color: #888780; margin: 0; }
.empty-hint     { font-size: 12px; color: #aaa8a0; }
.error-state    { color: #ba1a1a; }
.create-btn-sm {
  display: inline-flex; align-items: center; gap: 5px; padding: 9px 18px; border: none;
  border-radius: 50px; background: #1a6fc4; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer;
}
.retry-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 9px 18px; border: none;
  border-radius: 50px; background: #ba1a1a; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer;
}

/* Modal */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 2000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fadeIn .2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal {
  background: #fff; border-radius: 20px; width: 100%; max-width: 600px; max-height: 90vh;
  display: flex; flex-direction: column; animation: slideUp .2s ease; overflow: hidden;
}
.modal-sm { max-width: 440px; }
.modal-lg { max-width: 780px; }
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px; border-bottom: 1px solid #eceae3;
}
.modal-title {
  font-size: 16px; font-weight: 700; color: #1a1a1a;
  display: flex; align-items: center; margin: 0;
}
.modal-title-name { font-style: normal; color: #1a6fc4; margin-left: 4px; }
.danger-title { color: #a32d2d; }
.modal-close {
  background: none; border: none; cursor: pointer; color: #888780; display: flex; padding: 4px; transition: color .15s;
}
.modal-close:hover { color: #1a1a1a; }

.modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field.full { grid-column: 1 / -1; }
.field-label { font-size: 12px; font-weight: 600; color: #555552; }
.req { color: #ba1a1a; margin-left: 2px; }
.field-input {
  padding: 9px 12px; border: 1px solid #e0dcd8; border-radius: 8px;
  font-size: 13px; font-family: inherit; outline: none;
  background: #faf9f7; color: #1a1a1a; transition: border .2s;
}
.field-input:focus   { border-color: #1a6fc4; background: #fff; }
.field-input:disabled { opacity: .6; cursor: not-allowed; }
.field-error { font-size: 11px; color: #ba1a1a; }

.modal-footer {
  display: flex; justify-content: flex-end; align-items: center; gap: 10px;
  padding: 16px 24px; border-top: 1px solid #eceae3; background: #faf9f7;
}
.lc-footer-info { margin-right: auto; font-size: 12px; }
.ml-2 { margin-left: 8px; }
.cancel-btn {
  padding: 9px 20px; border: 1px solid #e0dcd8; border-radius: 50px;
  background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; transition: background .15s;
}
.cancel-btn:hover { background: #f5f5f3; }
.submit-btn {
  padding: 9px 24px; border: none; border-radius: 50px; background: #1a6fc4; color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background .15s;
}
.submit-btn:hover:not(:disabled) { background: #155da0; }
.submit-btn:disabled { opacity: .6; cursor: not-allowed; }
.delete-btn {
  padding: 9px 24px; border: none; border-radius: 50px; background: #ba1a1a; color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background .15s;
}
.delete-btn:hover:not(:disabled) { background: #9e1515; }
.delete-btn:disabled { opacity: .6; cursor: not-allowed; }
.confirm-text { font-size: 14px; color: #333; line-height: 1.6; margin: 0 0 12px; }
.confirm-text strong { color: #1a1a1a; }

/* Delete card warning banner */
.delete-card-warning {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 10px 14px; border-radius: 10px;
  background: #fff8ed; border: 1px solid #ffd699;
  font-size: 12px; color: #7a4d0f; line-height: 1.5;
}
.delete-card-warning strong { color: #5a3307; }

/* ── Link Card Modal specifics ── */
.lc-filters {
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;
}
.lc-search { flex: 1; min-width: 200px; }

/* Skeleton for link card modal */
.lc-loading { display: flex; flex-direction: column; gap: 10px; }
.lc-skeleton {
  display: flex; align-items: center; gap: 12px;
  padding: 14px; border: 1px solid #eceae3; border-radius: 12px; background: #faf9f7;
}
.lc-sk-badge  { width: 48px; height: 22px; border-radius: 4px; }
.lc-sk-body   { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.lc-sk-pan    { height: 14px; width: 160px; }
.lc-sk-name   { height: 11px; width: 110px; }
.lc-sk-btn    { width: 70px; height: 30px; border-radius: 8px; }

/* Empty for link card modal */
.lc-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 48px 20px; color: #d0ccc0;
}
.lc-empty p { font-size: 14px; color: #888780; margin: 0; }

/* Card grid for link card modal */
.lc-grid { display: flex; flex-direction: column; gap: 8px; }
.lc-card {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 16px; border: 1.5px solid #eceae3; border-radius: 12px;
  background: #fff; cursor: pointer; transition: all .15s;
}
.lc-card:hover { border-color: #a8cff0; background: #f4f9ff; }
.lc-card-selected { border-color: #1a6fc4 !important; background: #edf4fc !important; box-shadow: 0 0 0 3px rgba(26,111,196,.12); }

.lc-select-ring { padding-top: 2px; flex-shrink: 0; }
.lc-card-body { flex: 1; }

.lc-card-top { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }

/* Available badge */
.avail-badge {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 2px 8px; border-radius: 20px; margin-left: auto;
  font-size: 10px; font-weight: 600;
  background: #eaf3de; color: #3b6d11; border: 1px solid #c2e0a0;
}

.lc-pan { font-family: "Courier New", monospace; font-size: 14px; font-weight: 700; color: #1a1a1a; letter-spacing: 1px; margin-bottom: 3px; }
.lc-holder { font-size: 12px; color: #555552; font-weight: 500; margin-bottom: 6px; }
.lc-meta { font-size: 11px; color: #888780; margin-bottom: 8px; }
.lc-sep  { margin: 0 5px; opacity: .5; }
.lc-flags { display: flex; flex-wrap: wrap; gap: 4px; }

/* Spinner */
.spin { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
.toast {
  position: fixed; bottom: 20px; right: 20px;
  background: #fff; border: 1px solid #dbd7cc; border-radius: 12px;
  padding: 12px 16px; display: flex; align-items: center; gap: 10px;
  font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,.15);
  z-index: 2999; max-width: 340px; animation: slideIn .3s ease;
}
@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.toast.success { border-color: #b7e4c3; background: #f1fdf6; color: #2a5e3f; }
.toast.error   { border-color: #f5ccc8; background: #fef5f4; color: #a32d2d; }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; display: flex; margin-left: auto; }

@media (max-width: 700px) {
  .filters-bar   { flex-direction: column; align-items: stretch; }
  .per-page-wrap { margin-left: 0; }
  .pag-controls  { margin-left: 0; }
  .pagination-bar { justify-content: center; }
  .form-grid     { grid-template-columns: 1fr; }
  .cards-grid    { flex-direction: column; }
  .card-detail-tile { width: 100%; }
  .lc-filters    { flex-direction: column; }
  .modal-lg      { max-width: 100%; }
}
</style>