import { create } from "zustand";

export const useCaseStore = create((set) => ({
  caseNumber: "",
  setCaseNumber: (num) => set({ caseNumber: num }),
}));
