import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { appendHistoryEntry, createHistoryEntry } from "./battle.logic";

const STORE_KEY = "battle-store";

export const useBattleStore = create(
  persist(
    (set, get) => ({
      battleResult: null,
      history: [],

      setBattleResult: (result) => set({ battleResult: result }),

      resetBattle: () => set({ battleResult: null }),

      recordBattle: (result, teamA, teamB) => {
        const entry = createHistoryEntry(result, teamA, teamB);
        if (!entry) return;

        set({ history: appendHistoryEntry(get().history, entry) });
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }),
    },
  ),
);
