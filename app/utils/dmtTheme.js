// utils/dmtTheme.js
// Shared brand tokens for the DMT module — matches merchant/dashboard.vue's palette
// (#1142d4 primary, DM Sans/DM Mono) so the money-transfer screens read as one product.
export const BX = {
  primary: '#1142d4',
  primaryDark: '#0e35a8',
  primaryLight: '#4169e1',
  success: '#059669',
  success2: '#16a34a',
  successTint: '#f0fdf4',
  successBorder: '#bbf7d0',
  warning: '#d97706',
  warningTint: '#fffbeb',
  warningBorder: '#fde68a',
  error: '#dc2626',
  error2: '#ef4444',
  errorTint: '#fef2f2',
  errorBorder: '#fecaca',
  ink: '#0f172a',
  muted: '#64748b',
  faint: '#94a3b8',
  border: '#e6eaf1',
}

export const BANK_LOGO_COLORS = {
  HDFC: '#004c8f',
  SBI: '#22409a',
  SBIN: '#22409a',
  ICICI: '#b8202e',
  ICIC: '#b8202e',
  AXIS: '#7b1fa2',
  UTIB: '#7b1fa2',
  PNB: '#a71930',
  KOTAK: '#ed1c24',
  YES: '#003057',
}

export function bankAccent(ifsc) {
  const key = Object.keys(BANK_LOGO_COLORS).find(k => (ifsc || '').toUpperCase().startsWith(k))
  return BANK_LOGO_COLORS[key] || BX.primary
}

export function bankNameFromIfsc(ifsc) {
  const map = {
    HDFC: 'HDFC Bank', SBIN: 'State Bank of India', ICIC: 'ICICI Bank',
    UTIB: 'Axis Bank', PUNB: 'Punjab National Bank', KKBK: 'Kotak Mahindra Bank', YESB: 'Yes Bank',
  }
  const key = Object.keys(map).find(k => (ifsc || '').toUpperCase().startsWith(k))
  return key ? map[key] : ''
}
