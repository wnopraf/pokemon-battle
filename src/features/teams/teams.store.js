import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  canStartBattleBetween,
  clearBattleSelectionFor,
  createEmptyDraftTeam,
  isPokemonInOtherTeam,
  isValidDraftSort,
  removePokemonFromTeam,
  removeTeamById,
  reorderPokemons,
  upsertTeam,
} from "./teams.logic";

const STORE_KEY = "teams-store";
const LEGACY_DRAFT_KEY = "teams-draft-v2";
const LEGACY_SAVED_KEY = "teams-saved-v2";


const migrateLegacyKeys = () => {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(STORE_KEY)) return;

  try {
    const rawDraft = localStorage.getItem(LEGACY_DRAFT_KEY);
    const rawTeams = localStorage.getItem(LEGACY_SAVED_KEY);
    if (!rawDraft && !rawTeams) return;

    const draftTeam = rawDraft ? JSON.parse(rawDraft) : null;
    const teams = rawTeams ? JSON.parse(rawTeams) : null;

    const migrated = {
      state: {
        teams: Array.isArray(teams) ? teams : [],
        draftTeam:
          draftTeam && draftTeam.id && Array.isArray(draftTeam.pokemons)
            ? draftTeam
            : createEmptyDraftTeam(),
      },
      version: 1,
    };

    localStorage.setItem(STORE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_DRAFT_KEY);
    localStorage.removeItem(LEGACY_SAVED_KEY);
  } catch {
    // ignore: si los datos antiguos están corruptos, simplemente arrancamos limpios
  }
};

migrateLegacyKeys();

export const useTeamsStore = create(
  persist(
    (set, get) => ({
      draftTeam: createEmptyDraftTeam(),
      teams: [],
      // Estado transitorio: NO se persiste (ver `partialize`)
      draftPokemonSort: "manual",
      battleSelection: {
        teamAId: null,
        teamBId: null,
      },

      startDraft: (initial = {}) => {
        set({
          draftTeam: {
            ...createEmptyDraftTeam(),
            ...initial,
            pokemons: Array.isArray(initial.pokemons)
              ? initial.pokemons
              : [],
            updatedAt: Date.now(),
          },
        });
      },

      setDraftPokemonSort: (sort) => {
        if (!isValidDraftSort(sort)) return;
        set({ draftPokemonSort: sort });
      },

      setDraftTeamName: (name) => {
        set((state) => ({
          draftTeam: {
            ...state.draftTeam,
            name,
            updatedAt: Date.now(),
          },
        }));
      },

      addPokemon: (teamId, pokemon) => {
        const { draftTeam, teams } = get();
        if (!pokemon || teamId !== draftTeam.id) return;
        if (draftTeam.pokemons.some((p) => p.id === pokemon.id)) return;
        if (isPokemonInOtherTeam(teams, draftTeam.id, pokemon.id)) return;
        if (draftTeam.pokemons.length >= 6) return;

        set({
          draftTeam: {
            ...draftTeam,
            pokemons: [...draftTeam.pokemons, pokemon],
            updatedAt: Date.now(),
          },
        });
      },

      removePokemon: (teamId, pokemonId) => {
        const { draftTeam } = get();
        if (teamId !== draftTeam.id) return;

        set({
          draftTeam: {
            ...draftTeam,
            pokemons: removePokemonFromTeam(draftTeam.pokemons, pokemonId),
            updatedAt: Date.now(),
          },
        });
      },

      reorderDraftPokemons: (teamId, startIndex, finishIndex) => {
        const { draftTeam } = get();
        if (teamId !== draftTeam.id) return;

        const nextPokemons = reorderPokemons(
          draftTeam.pokemons,
          startIndex,
          finishIndex,
        );
        if (nextPokemons === draftTeam.pokemons) return;

        set({
          draftTeam: {
            ...draftTeam,
            pokemons: nextPokemons,
            updatedAt: Date.now(),
          },
        });
      },

      clearDraft: () => {
        set({ draftTeam: createEmptyDraftTeam() });
      },

      saveDraft: () => {
        const { draftTeam, teams } = get();
        if (!draftTeam.name.trim() || draftTeam.pokemons.length === 0) return;

        set({ teams: upsertTeam(teams, draftTeam) });
      },

      deleteTeam: (teamId) => {
        const { teams, battleSelection } = get();

        set({
          teams: removeTeamById(teams, teamId),
          battleSelection: clearBattleSelectionFor(battleSelection, teamId),
        });
      },

      getTeamById: (teamId) => {
        const { teams } = get();
        return teams.find((team) => team.id === teamId) || null;
      },

      selectBattleTeams: (teamAId, teamBId) => {
        set({
          battleSelection: {
            teamAId,
            teamBId,
          },
        });
      },

      canBattle: (teamAId, teamBId) => {
        const { teams, battleSelection } = get();

        return canStartBattleBetween(
          teams,
          teamAId ?? battleSelection.teamAId,
          teamBId ?? battleSelection.teamBId,
        );
      },
    }),
    {
      name: STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        teams: state.teams,
        draftTeam: state.draftTeam,
      }),
    },
  ),
);
