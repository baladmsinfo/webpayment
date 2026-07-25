// app/utils/documentRegistry.ts

export interface DocRegistryEntry {
  code: string;
  docId: number;
  backDocId?: number;
  docName: string;
  docIsBack: boolean;
  requiresFrontBack: boolean;
  category: string;
  requiresNumber: boolean;
  requiredImageCount: number;
  businessTypes: string[];
  guessed?: boolean;
  validationRules?: {
    pattern?: RegExp;
    length?: number;
    message?: string;
  };
}

const ALL_TYPES = [
  "INDIVIDUAL", "SOLE_PROPRIETORSHIP", "PARTNERSHIP", "LLP",
  "PRIVATE_LIMITED", "PUBLIC_LIMITED", "SOCIETY",
];
const ENTITY_TYPES = ALL_TYPES.filter((t) => t !== "INDIVIDUAL");
const BUSINESS_PAN_TYPES = ENTITY_TYPES; // partnership + companies + society, not sole prop
const PARTNER_TYPES = ["PARTNERSHIP", "LLP", "PRIVATE_LIMITED", "PUBLIC_LIMITED", "SOCIETY"];

const AADHAAR_RULES = {
  pattern: /^\d{12}$/,
  length: 12,
  message: "Enter a valid 12-digit Aadhaar number",
};

function entry(e: Omit<DocRegistryEntry, "requiresFrontBack" | "requiredImageCount">): DocRegistryEntry {
  return {
    ...e,
    requiresFrontBack: e.docIsBack,
    requiredImageCount: e.docIsBack ? 2 : 1,
  };
}

export const DOCUMENT_REGISTRY: Record<string, DocRegistryEntry> = {
  // ── IDENTITY ──────────────────────────────────────────────
  AADHAAR: entry({
    code: "AADHAAR", docId: 55, docName: "Aadhaar Card", docIsBack: true,
    category: "IDENTITY", requiresNumber: true, businessTypes: ALL_TYPES,
    validationRules: AADHAAR_RULES,
  }),
  DRIVING_LICENSE: entry({
    code: "DRIVING_LICENSE", docId: 5, docName: "Driving license", docIsBack: true,
    category: "IDENTITY", requiresNumber: false, businessTypes: ALL_TYPES,
  }),
  VOTER_ID: entry({
    code: "VOTER_ID", docId: 2, docName: "Voter identity card", docIsBack: true,
    category: "IDENTITY", requiresNumber: false, businessTypes: ALL_TYPES,
  }),
  PASSPORT: entry({
    code: "PASSPORT", docId: 1, docName: "Passport", docIsBack: true,
    category: "IDENTITY", requiresNumber: false, businessTypes: ALL_TYPES,
  }),

  // ── PAN ───────────────────────────────────────────────────
  INDIVIDUAL_PAN: entry({
    code: "INDIVIDUAL_PAN", docId: 63, docName: "Pan Card", docIsBack: false,
    category: "INDIVIDUAL_PAN", requiresNumber: false, businessTypes: ALL_TYPES,
  }),
  // NOTE: BUSINESS_PAN's docId is business-type dependent (128 for
  // Company/Society, 134 for Partnership/LLP) — this entry is the fallback;
  // getDocMeta() below overrides docId/docName when businessType is known.
  BUSINESS_PAN: entry({
    code: "BUSINESS_PAN", docId: 128, docName: "Company Pan Card", docIsBack: false,
    category: "BUSINESS_PAN", requiresNumber: false, businessTypes: BUSINESS_PAN_TYPES,
  }),

  // ── BUSINESS LEGALITY ─────────────────────────────────────
  PARTNERSHIP_DEED: entry({
    code: "PARTNERSHIP_DEED", docId: 13, docName: "Partnership deed", docIsBack: true,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  GST: entry({
    code: "GST", docId: 106, docName: "Proprietor VAT OR TIN OR GST", docIsBack: true,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  SEC: entry({
    code: "SEC", docId: 105, docName: "Proprietor shop and establishment certificate", docIsBack: true,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  COI: entry({
    code: "COI", docId: 127, docName: "Company-Certificate of Incorporation", docIsBack: false,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  // MOA and AOA are two separate documents with two separate doc-master ids —
  // modeled as a front/back pair (front=MOA/129, back=AOA/130) so it reuses
  // the existing two-image upload flow instead of a new multi-doc concept.
  MOA_AOA: entry({
    code: "MOA_AOA", docId: 129, backDocId: 130,
    docName: "Memorandum & Articles of Association (MOA & AOA)", docIsBack: true,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  BOARD_RESOLUTION: entry({
    code: "BOARD_RESOLUTION", docId: 131, docName: "Company-board resolution", docIsBack: false,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  UDHYAM_REGISTRATION: entry({
    code: "UDHYAM_REGISTRATION", docId: 0, docName: "UNMAPPED — no matching row in doc master table",
    docIsBack: false, category: "BUSINESS_LEGALITY", requiresNumber: false,
    businessTypes: ENTITY_TYPES, guessed: true,
  }),
  TRADE_LICENSE: entry({
    code: "TRADE_LICENSE", docId: 108, docName: "Proprietor trade license", docIsBack: true,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  FORM_32: entry({
    code: "FORM_32", docId: 133, docName: "Company Form 32", docIsBack: false,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ["PRIVATE_LIMITED", "PUBLIC_LIMITED"],
  }),
  CERTIFICATE_OF_COMMENCEMENT: entry({
    code: "CERTIFICATE_OF_COMMENCEMENT", docId: 132,
    docName: "Company Certificate of Commencement of Business", docIsBack: false,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ["PRIVATE_LIMITED", "PUBLIC_LIMITED"],
    guessed: true, // duplicate row 142 has the identical name — confirm which applies
  }),
  TRUST_DEED: entry({
    code: "TRUST_DEED", docId: 136, docName: "Trust deed", docIsBack: false,
    category: "TRUST_SOCIETY_DOCS", requiresNumber: false, businessTypes: ["TRUST"],
  }),
  TRUST_REGISTRATION_CERTIFICATE: entry({
    code: "TRUST_REGISTRATION_CERTIFICATE", docId: 0,
    docName: "UNMAPPED — no matching row in doc master table", docIsBack: false,
    category: "TRUST_SOCIETY_DOCS", requiresNumber: false, businessTypes: ["TRUST"], guessed: true,
  }),
  MOU: entry({
    code: "MOU", docId: 138, docName: "Memorandum of understanding", docIsBack: false,
    category: "TRUST_SOCIETY_DOCS", requiresNumber: false, businessTypes: ["TRUST", "SOCIETY"],
  }),
  CERT_80G: entry({
    code: "CERT_80G", docId: 137, docName: "Trust 80G & 12A certificate", docIsBack: false,
    category: "TRUST_SOCIETY_DOCS", requiresNumber: false, businessTypes: ["TRUST"],
  }),
  CERT_12A: entry({
    // Same doc-master row as CERT_80G — the master catalog combines 80G & 12A into one certificate.
    code: "CERT_12A", docId: 137, docName: "Trust 80G & 12A certificate", docIsBack: false,
    category: "TRUST_SOCIETY_DOCS", requiresNumber: false, businessTypes: ["TRUST"],
  }),
  GOVT_OFFICER_ID: entry({
    code: "GOVT_OFFICER_ID", docId: 140, docName: "Government office ID of signatory officer", docIsBack: false,
    category: "GOVERNMENT_DOCS", requiresNumber: false, businessTypes: ["GOVERNMENT"],
  }),
  SOCIETY_REGISTRATION_CERTIFICATE: entry({
    code: "SOCIETY_REGISTRATION_CERTIFICATE", docId: 0,
    docName: "UNMAPPED — no matching row in doc master table", docIsBack: false,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ["SOCIETY"], guessed: true,
  }),
  SOCIETY_AUTHORITY_LETTER: entry({
    code: "SOCIETY_AUTHORITY_LETTER", docId: 0,
    docName: "UNMAPPED — no matching row in doc master table", docIsBack: false,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ["SOCIETY"], guessed: true,
  }),
  SOCIETY_BYELAWS: entry({
    code: "SOCIETY_BYELAWS", docId: 139, docName: "club/society/association-by Laws", docIsBack: false,
    category: "BUSINESS_LEGALITY", requiresNumber: false, businessTypes: ["SOCIETY"],
  }),

  // ── COMMON MANDATORY (all business types) ─────────────────
  MERCHANT_APPLICATION_FORM: entry({
    code: "MERCHANT_APPLICATION_FORM", docId: 111, docName: "ISG PG Merchant Application", docIsBack: true,
    category: "COMMON_MANDATORY", requiresNumber: false, businessTypes: ALL_TYPES,
  }),
  MERCHANT_AGREEMENT: entry({
    code: "MERCHANT_AGREEMENT", docId: 110, docName: "ISG PG Merchant Agreement", docIsBack: true,
    category: "COMMON_MANDATORY", requiresNumber: false, businessTypes: ALL_TYPES,
  }),
  CANCELLED_CHEQUE: entry({
    code: "CANCELLED_CHEQUE", docId: 146, docName: "Bank Cancelled Cheque", docIsBack: false,
    category: "COMMON_MANDATORY", requiresNumber: false, businessTypes: ALL_TYPES,
  }),

  // ── FINANCIAL PROOF (only relevant when international transactions enabled) ──
  FINANCIAL_PROOF: entry({
    code: "FINANCIAL_PROOF", docId: 0, docName: "UNMAPPED — no matching row in doc master table",
    docIsBack: false, category: "FINANCIAL_PROOF", requiresNumber: false,
    businessTypes: ALL_TYPES, guessed: true,
  }),
  FIRC: entry({
    code: "FIRC", docId: 0, docName: "UNMAPPED — no matching row in doc master table",
    docIsBack: false, category: "FINANCIAL_PROOF", requiresNumber: false,
    businessTypes: ALL_TYPES, guessed: true,
  }),

  // ── ADDRESS PROOF ─────────────────────────────────────────
  UTILITY_BILL: entry({
    code: "UTILITY_BILL", docId: 125, docName: "Utility bills", docIsBack: true,
    category: "ADDRESS_PROOF", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),
  ELECTRICITY_BILL: entry({
    code: "ELECTRICITY_BILL", docId: 125, docName: "Utility bills", docIsBack: true,
    category: "ADDRESS_PROOF", requiresNumber: false, businessTypes: ENTITY_TYPES,
    guessed: true, // no distinct row — reused Utility Bills — confirm
  }),
  RENT_AGREEMENT: entry({
    code: "RENT_AGREEMENT", docId: 126, docName: "Leave and license agreement registered", docIsBack: true,
    category: "ADDRESS_PROOF", requiresNumber: false, businessTypes: ENTITY_TYPES, guessed: true,
  }),
  PROPERTY_TAX_RECEIPT: entry({
    code: "PROPERTY_TAX_RECEIPT", docId: 0, docName: "UNMAPPED — no matching row in doc master table",
    docIsBack: false, category: "ADDRESS_PROOF", requiresNumber: false,
    businessTypes: ENTITY_TYPES, guessed: true,
  }),
  BANK_STATEMENT: entry({
    code: "BANK_STATEMENT", docId: 8, docName: "Bank account statement", docIsBack: true,
    category: "ADDRESS_PROOF", requiresNumber: false, businessTypes: ENTITY_TYPES,
  }),

  // ── BANK VERIFICATION ─────────────────────────────────────
  BANK_PASSBOOK: entry({
    code: "BANK_PASSBOOK", docId: 8, docName: "Bank account statement", docIsBack: true,
    category: "BANK_VERIFICATION", requiresNumber: false, businessTypes: ALL_TYPES,
    guessed: true, // no distinct passbook row — reused Bank account statement — confirm
  }),

  // ── STORE IMAGE ───────────────────────────────────────────
  // docId 999 is not from the doc-master table — it's the legacy reserved id
  // the backend already special-cases (isg.route.js: docid: 999 for both
  // indoor/outdoor store checks). Kept as-is, not a guess.
  INDOOR_STORE_IMAGE: entry({
    code: "INDOOR_STORE_IMAGE", docId: 999, docName: "Indoor Store Image", docIsBack: false,
    category: "STORE_IMAGE", requiresNumber: false, businessTypes: ALL_TYPES,
  }),
  OUTDOOR_STORE_IMAGE: entry({
    code: "OUTDOOR_STORE_IMAGE", docId: 999, docName: "Outdoor Store Image", docIsBack: false,
    category: "STORE_IMAGE", requiresNumber: false, businessTypes: ALL_TYPES,
  }),

  // ── PARTNER 1 ─────────────────────────────────────────────
  PARTNER1_AADHAAR: entry({
    code: "PARTNER1_AADHAAR", docId: 55, docName: "Aadhaar Card", docIsBack: true,
    category: "PARTNER_1_DOCS", requiresNumber: true, businessTypes: PARTNER_TYPES,
    validationRules: AADHAAR_RULES,
  }),
  PARTNER1_DRIVING_LICENSE: entry({
    code: "PARTNER1_DRIVING_LICENSE", docId: 5, docName: "Driving license", docIsBack: true,
    category: "PARTNER_1_DOCS", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),
  PARTNER1_VOTER_ID: entry({
    code: "PARTNER1_VOTER_ID", docId: 2, docName: "Voter identity card", docIsBack: true,
    category: "PARTNER_1_DOCS", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),
  PARTNER1_PASSPORT: entry({
    code: "PARTNER1_PASSPORT", docId: 1, docName: "Passport", docIsBack: true,
    category: "PARTNER_1_DOCS", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),
  PARTNER1_INDIVIDUAL_PAN: entry({
    code: "PARTNER1_INDIVIDUAL_PAN", docId: 63, docName: "Pan Card", docIsBack: false,
    category: "PARTNER_1_INDIVIDUAL_PAN", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),

  // ── PARTNER 2 ─────────────────────────────────────────────
  PARTNER2_AADHAAR: entry({
    code: "PARTNER2_AADHAAR", docId: 55, docName: "Aadhaar Card", docIsBack: true,
    category: "PARTNER_2_DOCS", requiresNumber: true, businessTypes: PARTNER_TYPES,
    validationRules: AADHAAR_RULES,
  }),
  PARTNER2_DRIVING_LICENSE: entry({
    code: "PARTNER2_DRIVING_LICENSE", docId: 5, docName: "Driving license", docIsBack: true,
    category: "PARTNER_2_DOCS", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),
  PARTNER2_VOTER_ID: entry({
    code: "PARTNER2_VOTER_ID", docId: 2, docName: "Voter identity card", docIsBack: true,
    category: "PARTNER_2_DOCS", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),
  PARTNER2_PASSPORT: entry({
    code: "PARTNER2_PASSPORT", docId: 1, docName: "Passport", docIsBack: true,
    category: "PARTNER_2_DOCS", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),
  PARTNER2_INDIVIDUAL_PAN: entry({
    code: "PARTNER2_INDIVIDUAL_PAN", docId: 63, docName: "Pan Card", docIsBack: false,
    category: "PARTNER_2_INDIVIDUAL_PAN", requiresNumber: false, businessTypes: PARTNER_TYPES,
  }),
};

const DEFAULT_ENTRY: Omit<DocRegistryEntry, "code"> = {
  docId: 0,
  docName: "Document",
  docIsBack: false,
  requiresFrontBack: false,
  category: "OTHER",
  requiresNumber: false,
  requiredImageCount: 1,
  businessTypes: ALL_TYPES,
  guessed: true,
};

const PARTNERSHIP_LIKE_TYPES = ["PARTNERSHIP", "LLP"];

export function getDocMeta(code: string, businessType?: string): DocRegistryEntry {
  // BUSINESS_PAN's doc-master id differs by entity type: Partnership/LLP file
  // a "Partnership PAN Card" (134), everyone else files a "Company PAN Card" (128).
  if (code === "BUSINESS_PAN" && businessType && PARTNERSHIP_LIKE_TYPES.includes(businessType)) {
    const base = DOCUMENT_REGISTRY.BUSINESS_PAN!;
    return { ...base, docId: 134, docName: "Partnership Pan card" };
  }

  return DOCUMENT_REGISTRY[code] ?? { ...DEFAULT_ENTRY, code };
}
