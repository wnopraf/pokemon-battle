import { create } from "zustand";

export const useBattleStore = create((set) => ({
  battleResult: null,

  setBattleResult: (result) => set({ battleResult: result }),

  resetBattle: () => set({ battleResult: null }),
}));
