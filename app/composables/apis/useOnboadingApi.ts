// src/composables/useUsersApi.ts
import { useApi } from "./useApi";
import { useOnboardingStore } from "~/stores/onboading";

export function useOnboadingApi() {
  const { get, post } = useApi();
  const Onboading = useOnboardingStore();

  const MCCSearch = async (searchBy: string) => {
    return await get("/onboading/search/mcc?q=" + searchBy);
  };

  const pincodeSearch = async (searchBy: string) => {
    return await get("onboading/search/pincode?q=" + searchBy);
  };

  const verifyPan = async (payload: { dob: string,fathername: string,name: string,pan: string }) => {
    //console.log(payload);
    return await post("/onboading/verify/pan", payload);
  };

  const verifyAccount = async (payload: { accountNumber: number,accountHolderName: string,ifsc: string,additionalData: boolean,consent: string }) => {
    //console.log(payload);
    return await post("/onboading/verify/account", payload);
  };

  const onboading = async (payload: any) => {
    //console.log(payload);
    return await post("/onboading/onboading", payload);
  };

  const businessTurnOver = async () => {
    const res = await get("onboading/trunOver");
    Onboading.setTurnOver(res.data);
    return res.data;
  };

  const businessType = async () => {
    const res = await get("onboading/businessType");
    Onboading.setBusinessTypes(res.data);
    return res.data;
  };

  return {
    MCCSearch,
    businessTurnOver,
    businessType,
    pincodeSearch,
    verifyPan,
    verifyAccount,
    onboading
  };
}
