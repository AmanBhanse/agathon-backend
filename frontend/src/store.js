import { create } from "zustand";

export const useCaseStore = create((set) => ({
  caseNumber: "",
  userName: "",
  setCaseNumber: (num) => set({ caseNumber: num }),
  setUserName: (name) => set({ userName: name }),
  logout: () => set({ caseNumber: "", userName: "", cachedReports: {} }),

  // Report caching
  cachedReports: {}, // { fallnummer: { report, timestamp } }
  setCachedReport: (fallnummer, report) =>
    set((state) => ({
      cachedReports: {
        ...state.cachedReports,
        [fallnummer]: {
          report,
          timestamp: new Date().toISOString(),
        },
      },
    })),
  getCachedReport: (fallnummer) =>
    set((state) => {
      const cached = state.cachedReports[fallnummer];
      return cached ? cached.report : null;
    }),
  clearCachedReport: (fallnummer) =>
    set((state) => {
      const { [fallnummer]: _, ...rest } = state.cachedReports;
      return { cachedReports: rest };
    }),
  clearAllCachedReports: () => set({ cachedReports: {} }),
}));
