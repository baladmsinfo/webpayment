// src/composables/apis/useAepsTxnApi.ts
//
// AEPS transactions — paymentSystem routes mounted directly at /aeps/* (see
// paymentSystem/src/modules/interface/nsdl/aeps/aeps.route.js and aeps.txn.controller.js).
// No encrypted envelope — merchant identity resolved from the Bearer token, same as DMT.
import { useApi } from "./useApi";
import type { DmtApiResult } from "./useDmtCustomerApi";

/** Shared request shape for every AEPS transaction endpoint (see aeps.txn.controller.js
 *  REQUIRED_TXN_FIELDS: AadharNo, TxnAmount, Latitude, Longitude, CustomerName, PidData,
 *  BankName). BankName is the customer's NSDL IIN code — required, and validated against
 *  the AepsBank table server-side (no default; see GET /aeps/banks). */
export interface AepsTxnPayload {
  AadharNo: string;
  TxnAmount: number; // required by the backend's validator even for balance/statement — send 0 if not applicable
  Latitude: number | string;
  Longitude: number | string;
  CustomerName: string;
  PidData: string;
  BankName: string;
}

export interface AepsBank {
  iin: string;
  bankName: string;
}

export interface AepsAuthStatus {
  authenticated: boolean;
  tid: string | null;
  authenticatedAt: string | null;
  expiresAt: string | null;
}

export function useAepsTxnApi() {
  const { get, post } = useApi();

  const handle = async (label: string, fn: () => Promise<any>): Promise<DmtApiResult> => {
    try {
      const res = await fn();
      return res.data;
    } catch (err: any) {
      console.error(`[AEPS] ${label} error:`, err);
      return (
        err?.response?.data ?? {
          statusCode: "01",
          message: err?.message || "Network error — please try again",
        }
      );
    }
  };

  /** POST /aeps/withdrawal */
  const withdrawal = (payload: AepsTxnPayload) => handle("withdrawal", () => post(`/aeps/withdrawal`, payload));

  /** POST /aeps/balance */
  const balance = (payload: AepsTxnPayload) => handle("balance", () => post(`/aeps/balance`, payload));

  /** POST /aeps/minstatement */
  const ministatement = (payload: AepsTxnPayload) => handle("minstatement", () => post(`/aeps/minstatement`, payload));

  /** POST /aeps/purchase — used here for "Aadhaar Pay" (merchant-assisted debit). */
  const purchase = (payload: AepsTxnPayload) => handle("purchase", () => post(`/aeps/purchase`, payload));

  /** POST /aeps/reqAuth — one-time (24h) agent/terminal authentication with NSDL.
   *  Must succeed before withdrawal/balance/statement/purchase can be used; those
   *  endpoints will also auto-run this on demand if no session exists, but the
   *  dashboard gate calls it explicitly so the agent goes through it up front. */
  const reqAuth = (payload: AepsTxnPayload) => handle("reqAuth", () => post(`/aeps/reqAuth`, payload));

  /** GET /aeps/authStatus — read-only check for whether a reqAuth session already
   *  exists for this merchant's terminal. Never calls NSDL. */
  const authStatus = async (): Promise<AepsAuthStatus> => {
    const res = await handle("authStatus", () => get(`/aeps/authStatus`));
    return res?.data ?? { authenticated: false, tid: null, authenticatedAt: null, expiresAt: null };
  };

  /** GET /aeps/banks — official NSDL IIN → bank name list, for the "Select Bank" dropdown. */
  const banks = async (): Promise<AepsBank[]> => {
    const res = await handle("banks", () => get(`/aeps/banks`));
    return Array.isArray(res?.data) ? res.data : [];
  };

  return { withdrawal, balance, ministatement, purchase, reqAuth, authStatus, banks };
}
