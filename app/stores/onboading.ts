import { defineStore } from "pinia";

export interface TurnOverData {
  id: string;     // UUIDs are strings
  label: string;
  value: string;
  status: boolean;
}

export interface BusinessTypeData {
  id: string;     // UUIDs are strings
  label: string;
  value: string;
  status: boolean;
}

export const useOnboardingStore = defineStore("Onboarding", {
  state: () => ({
    turnOverList: [] as TurnOverData[],
    businessTypeList: [] as BusinessTypeData[],
  }),
  actions: {
    setTurnOver(payload: TurnOverData[]) {
      this.turnOverList = payload;
    },
    setBusinessTypes(payload: BusinessTypeData[]) {
      this.businessTypeList = payload;
    },
  },
});
