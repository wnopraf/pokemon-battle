import { create } from "zustand";
import {
  addPokemonToTeam,
  removePokemonFromTeam,
  canStartBattle,
} from "./teams.logic";

const DRAFT_KEY = "teams-draft";
const SAVED_KEY = "teams-saved";

const loadDraft = () => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    if (!data) return { draftTeamA: [], draftTeamB: [] };
    return JSON.parse(data);
  } catch {
    return { draftTeamA: [], draftTeamB: [] };
  }
};

const loadSaved = () => {
  try {
    const data = localStorage.getItem(SAVED_KEY);
    if (!data) return { savedTeamA: [], savedTeamB: [] };
    return JSON.parse(data);
  } catch {
    return { savedTeamA: [], savedTeamB: [] };
  }
};

const persistDraft = (draft) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
};

const persistSaved = (saved) => {
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
};

const initialDraft = loadDraft();
const initialSaved = loadSaved();

export const useTeamsStore = create((set, get) => ({
  draftTeamA: initialDraft.draftTeamA || [],
  draftTeamB: initialDraft.draftTeamB || [],
  savedTeamA: initialSaved.savedTeamA || [],
  savedTeamB: initialSaved.savedTeamB || [],

  addPokemon: (team, pokemon) => {
    const { draftTeamA, draftTeamB } = get();

    const result = addPokemonToTeam({
      teamA: draftTeamA,
      teamB: draftTeamB,
      team,
      pokemon,
    });

    const newDraft = {
      draftTeamA: result.teamA,
      draftTeamB: result.teamB,
    };

    persistDraft(newDraft);
    set(newDraft);
  },

  removePokemon: (team, pokemonId) => {
    const { draftTeamA, draftTeamB } = get();

    let newDraft;

    if (team === "A") {
      newDraft = {
        draftTeamA: removePokemonFromTeam(draftTeamA, pokemonId),
        draftTeamB,
      };
    }

    if (team === "B") {
      newDraft = {
        draftTeamA,
        draftTeamB: removePokemonFromTeam(draftTeamB, pokemonId),
      };
    }

    persistDraft(newDraft);
    set(newDraft);
  },

  clearDraft: () => {
    const empty = { draftTeamA: [], draftTeamB: [] };
    persistDraft(empty);
    set(empty);
  },

  saveTeams: () => {
    const { draftTeamA, draftTeamB } = get();

    const saved = {
      savedTeamA: draftTeamA,
      savedTeamB: draftTeamB,
    };

    persistSaved(saved);
    set(saved);
  },

  canBattle: () => {
    const { savedTeamA, savedTeamB } = get();
    return canStartBattle(savedTeamA, savedTeamB);
  },
}));
