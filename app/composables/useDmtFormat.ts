// composables/useDmtFormat.ts
// Formatting + masking helpers shared across the DMT module.
export function useDmtFormat() {
  const formatCurrency = (val: number | string | null | undefined) =>
    "₹" + Number(val ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatCurrencyShort = (val: number | string | null | undefined) =>
    "₹" + Number(val ?? 0).toLocaleString("en-IN");

  const maskAccount = (accNo: string | null | undefined) => {
    if (!accNo) return "—";
    const s = String(accNo);
    return s.length <= 4 ? s : "XXXXXX" + s.slice(-4);
  };

  const maskAadhaar = (aadhaar: string | null | undefined) => {
    if (!aadhaar) return "—";
    const digits = String(aadhaar).replace(/\D/g, "");
    return digits.length >= 4 ? "XXXX XXXX " + digits.slice(-4) : "XXXX XXXX XXXX";
  };

  const maskMobile = (mobile: string | null | undefined) => {
    if (!mobile) return "—";
    const s = String(mobile);
    return s.length <= 4 ? s : "XXXXXX" + s.slice(-4);
  };

  const formatDateTime = (d: string | number | Date) =>
    new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return { formatCurrency, formatCurrencyShort, maskAccount, maskAadhaar, maskMobile, formatDateTime };
}
