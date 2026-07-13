// utils/aepsBanks.js
//
// AEPS has no bank-list API on paymentSystem's side (aeps.route.js exposes onboarding +
// withdrawal/balance/minstatement/reqAuth/purchase only — no /aeps/banks route). Real AEPS
// integrations select the issuing bank by its NPCI-assigned IIN (Issuer Identification
// Number), which is normally sourced from NPCI's published bank/IIN list.
//
// The codes below are PLACEHOLDERS for local/UAT testing only — the backend defaults
// BankName to the sandbox test code '990326' when omitted (see aeps.txn.controller.js).
// Replace this list with NPCI's official IIN mapping before using in production.
export const AEPS_BANKS = [
  { name: "State Bank of India", iin: "918152" },
  { name: "HDFC Bank", iin: "607153" },
  { name: "ICICI Bank", iin: "607094" },
  { name: "Axis Bank", iin: "607238" },
  { name: "Punjab National Bank", iin: "918010" },
  { name: "Bank of Baroda", iin: "607093" },
  { name: "Canara Bank", iin: "918204" },
  { name: "Union Bank of India", iin: "918405" },
  { name: "Bank of India", iin: "918315" },
  { name: "Indian Bank", iin: "918294" },
  { name: "UAT Test Bank (sandbox default)", iin: "990326" },
];

export function bankNameByIin(iin) {
  return AEPS_BANKS.find((b) => b.iin === iin)?.name ?? "";
}
