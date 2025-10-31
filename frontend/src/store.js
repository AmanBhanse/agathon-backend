import { create } from "zustand";

export const useCaseStore = create((set) => ({
  caseNumber: "",
  userName: "",
  setCaseNumber: (num) => set({ caseNumber: num }),
  setUserName: (name) => set({ userName: name }),
  logout: () => set({ caseNumber: "", userName: "" }),
}));
