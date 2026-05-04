// src/composables/apis/useDmtBcApi.ts
import { useApi } from "./useApi";

export function useDmtBcApi() {
  const { post } = useApi();

  /**
   * Step 1 — Initialize DMT service for merchant
   * POST /onboarding/dmt/agent/initialize
   * Body: { merchantId }
   */
  const dmtAgentInitialize = async (payload: { merchantId: string }) => {
    try {
      const res = await post(`/onboarding/dmt/bc/agent/initialize`, payload);
      console.log("[DMT-BC] Initialize response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT-BC] Initialize error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  /**
   * Step 2 — Register merchant as DMT agent
   * POST /onboarding/dmt/agent/registor
   * Body: { merchantId, pancard, name, lastname, dmt, aeps, cardpin, accountopen }
   */
  const dmtAgentRegister = async (payload: {
    merchantId:  string;
    name:        string;
    lastname:    string;
    pancard:     string;
    dmt:         0 | 1;
    aeps:        0 | 1;
    cardpin:     0 | 1;
    accountopen: 0 | 1;
  }) => {
    try {
      const res = await post(`/onboarding/dmt/bc/agent/registor`, payload);
      console.log("[DMT-BC] Register response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[DMT-BC] Register error:", err);
      return err?.response?.data ?? { statusCode: "01", message: "Network error" };
    }
  };

  return {
    dmtAgentInitialize,
    dmtAgentRegister,
  };
}