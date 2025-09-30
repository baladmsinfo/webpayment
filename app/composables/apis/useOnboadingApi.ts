// src/composables/useUsersApi.ts
import { useApi } from "./useApi";
import { useOnboardingStore } from "~/stores/onboading";

export function useOnboadingApi() {
  const { get, post } = useApi();
  const Onboading = useOnboardingStore();

  const MCCSearch = async (searchBy: string) => {
    return await get("/aggregator/search/mcc?q=" + searchBy);
  };

  const pincodeSearch = async (searchBy: string) => {
    return await get("/aggregator/search/pincode?q=" + searchBy);
  };

  // const verifyPan = async (payload: any) => {
  //   //console.log(payload);
  //   return await post("/onboading/verify/pan", payload);
  // };

  // const verifyAccount = async (payload: ) => {
  //   //console.log(payload);
  //   return await post("/onboading/verify/account", payload);
  // };

  // const onboading = async (payload: any) => {
  //   //console.log(payload);
  //   return await post("/onboading/onboading", payload);
  // };

  const businessTurnOver = async () => {
    const res = await get("/aggregator/trunOver");
    Onboading.setTurnOver(res.data);
    return res.data;
  };

  const businessType = async () => {
    const res = await get("/aggregator/businessType");
    console.log(res.data);
    if (res.data.statusCode == "00") {
      Onboading.setBusinessTypes(res.data.data);
      return res.data.data;
    }
  };

  return {
    MCCSearch,
    businessTurnOver,
    businessType,
    pincodeSearch,
  };
}
