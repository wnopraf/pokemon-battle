import { create } from "zustand";
import { canStartBattle, removePokemonFromTeam } from "./teams.logic";

const DRAFT_KEY = "teams-draft-v2";
const SAVED_KEY = "teams-saved-v2";

const createTeamId = () =>
  `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyDraftTeam = () => ({
  id: createTeamId(),
  name: "",
  pokemons: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

const loadDraft = () => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    if (!data) return createEmptyDraftTeam();
    const parsed = JSON.parse(data);

    if (!parsed || !parsed.id || !Array.isArray(parsed.pokemons)) {
      return createEmptyDraftTeam();
    }

    return parsed;
  } catch {
    return createEmptyDraftTeam();
  }
};

const loadTeams = () => {
  try {
    const data = localStorage.getItem(SAVED_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
};

const persistDraft = (draftTeam) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draftTeam));
};

const persistTeams = (teams) => {
  localStorage.setItem(SAVED_KEY, JSON.stringify(teams));
};

const initialDraft = loadDraft();
const initialTeams = loadTeams();

const isDuplicatePokemon = (teams, draftTeamId, pokemonId) => {
  return teams.some(
    (team) =>
      team.id !== draftTeamId && team.pokemons.some((p) => p.id === pokemonId),
  );
};

export const useTeamsStore = create((set, get) => ({
  draftTeam: initialDraft,
  teams: initialTeams,
  battleSelection: {
    teamAId: null,
    teamBId: null,
  },

  startDraft: (initial = {}) => {
    const nextDraft = {
      ...createEmptyDraftTeam(),
      ...initial,
      pokemons: Array.isArray(initial.pokemons) ? initial.pokemons : [],
      updatedAt: Date.now(),
    };

    persistDraft(nextDraft);
    set({ draftTeam: nextDraft });
  },

  setDraftTeamName: (name) => {
    const { draftTeam } = get();
    const nextDraft = {
      ...draftTeam,
      name,
      updatedAt: Date.now(),
    };

    persistDraft(nextDraft);
    set({ draftTeam: nextDraft });
  },

  addPokemon: (teamId, pokemon) => {
    const { draftTeam, teams } = get();
    if (!pokemon || teamId !== draftTeam.id) return;
    if (draftTeam.pokemons.some((p) => p.id === pokemon.id)) return;
    if (isDuplicatePokemon(teams, draftTeam.id, pokemon.id)) return;
    if (draftTeam.pokemons.length >= 6) return;

    const nextDraft = {
      ...draftTeam,
      pokemons: [...draftTeam.pokemons, pokemon],
      updatedAt: Date.now(),
    };

    persistDraft(nextDraft);
    set({ draftTeam: nextDraft });
  },

  removePokemon: (teamId, pokemonId) => {
    const { draftTeam } = get();
    if (teamId !== draftTeam.id) return;

    const nextDraft = {
      ...draftTeam,
      pokemons: removePokemonFromTeam(draftTeam.pokemons, pokemonId),
      updatedAt: Date.now(),
    };

    persistDraft(nextDraft);
    set({ draftTeam: nextDraft });
  },

  reorderDraftPokemons: (teamId, startIndex, finishIndex) => {
    const { draftTeam } = get();
    if (teamId !== draftTeam.id) return;
    if (
      !Number.isInteger(startIndex) ||
      !Number.isInteger(finishIndex) ||
      startIndex === finishIndex
    ) {
      return;
    }

    const maxIndex = draftTeam.pokemons.length - 1;
    if (
      startIndex < 0 ||
      finishIndex < 0 ||
      startIndex > maxIndex ||
      finishIndex > maxIndex
    ) {
      return;
    }

    const nextPokemons = [...draftTeam.pokemons];
    const [movedPokemon] = nextPokemons.splice(startIndex, 1);
    nextPokemons.splice(finishIndex, 0, movedPokemon);

    const nextDraft = {
      ...draftTeam,
      pokemons: nextPokemons,
      updatedAt: Date.now(),
    };

    persistDraft(nextDraft);
    set({ draftTeam: nextDraft });
  },

  clearDraft: () => {
    const nextDraft = createEmptyDraftTeam();
    persistDraft(nextDraft);
    set({ draftTeam: nextDraft });
  },

  saveDraft: () => {
    const { draftTeam, teams } = get();
    if (!draftTeam.name.trim() || draftTeam.pokemons.length === 0) return;

    const existingIndex = teams.findIndex((team) => team.id === draftTeam.id);
    let nextTeams;

    if (existingIndex === -1) {
      nextTeams = [...teams, draftTeam];
    } else {
      nextTeams = teams.map((team) =>
        team.id === draftTeam.id
          ? {
              ...draftTeam,
              updatedAt: Date.now(),
            }
          : team,
      );
    }

    persistTeams(nextTeams);
    set({ teams: nextTeams });
  },

  deleteTeam: (teamId) => {
    const { teams, battleSelection } = get();
    const nextTeams = teams.filter((team) => team.id !== teamId);

    const nextBattleSelection = {
      teamAId:
        battleSelection.teamAId === teamId ? null : battleSelection.teamAId,
      teamBId:
        battleSelection.teamBId === teamId ? null : battleSelection.teamBId,
    };

    persistTeams(nextTeams);
    set({ teams: nextTeams, battleSelection: nextBattleSelection });
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

    const finalTeamAId = teamAId ?? battleSelection.teamAId;
    const finalTeamBId = teamBId ?? battleSelection.teamBId;

    if (!finalTeamAId || !finalTeamBId || finalTeamAId === finalTeamBId)
      return false;

    const teamA = teams.find((team) => team.id === finalTeamAId);
    const teamB = teams.find((team) => team.id === finalTeamBId);

    if (!teamA || !teamB) return false;

    return canStartBattle(teamA.pokemons, teamB.pokemons);
  },
}));
