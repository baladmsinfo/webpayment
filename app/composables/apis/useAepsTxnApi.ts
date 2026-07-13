// src/composables/apis/useAepsTxnApi.ts
//
// AEPS transactions — paymentSystem routes mounted directly at /aeps/* (see
// paymentSystem/src/modules/interface/nsdl/aeps/aeps.route.js and aeps.txn.controller.js).
// No encrypted envelope — merchant identity resolved from the Bearer token, same as DMT.
import { useApi } from "./useApi";
import type { DmtApiResult } from "./useDmtCustomerApi";

/** Shared request shape for every AEPS transaction endpoint (see aeps.txn.controller.js
 *  REQUIRED_TXN_FIELDS: AadharNo, TxnAmount, Latitude, Longitude, CustomerName, PidData).
 *  BankName is optional — the backend defaults to the UAT sandbox code '990326' if omitted. */
export interface AepsTxnPayload {
  AadharNo: string;
  TxnAmount: number; // required by the backend's validator even for balance/statement — send 0 if not applicable
  Latitude: number | string;
  Longitude: number | string;
  CustomerName: string;
  PidData: string;
  BankName?: string;
}

export function useAepsTxnApi() {
  const { post } = useApi();

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

  return { withdrawal, balance, ministatement, purchase };
}
