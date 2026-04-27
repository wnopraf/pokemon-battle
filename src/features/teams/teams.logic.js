export const DRAFT_SORT_OPTIONS = ["manual", "name", "attack", "random"];

export function isValidDraftSort(sort) {
  return DRAFT_SORT_OPTIONS.includes(sort);
}

export function createTeamId() {
  return `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyDraftTeam() {
  const now = Date.now();
  return {
    id: createTeamId(),
    name: "",
    pokemons: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function isPokemonInOtherTeam(teams, draftTeamId, pokemonId) {
  return teams.some(
    (team) =>
      team.id !== draftTeamId && team.pokemons.some((p) => p.id === pokemonId),
  );
}

export function reorderPokemons(pokemons, startIndex, finishIndex) {
  if (
    !Number.isInteger(startIndex) ||
    !Number.isInteger(finishIndex) ||
    startIndex === finishIndex
  ) {
    return pokemons;
  }

  const maxIndex = pokemons.length - 1;
  if (
    startIndex < 0 ||
    finishIndex < 0 ||
    startIndex > maxIndex ||
    finishIndex > maxIndex
  ) {
    return pokemons;
  }

  const next = [...pokemons];
  const [moved] = next.splice(startIndex, 1);
  next.splice(finishIndex, 0, moved);
  return next;
}

export function upsertTeam(teams, team) {
  const index = teams.findIndex((t) => t.id === team.id);
  if (index === -1) return [...teams, team];
  return teams.map((t) =>
    t.id === team.id ? { ...team, updatedAt: Date.now() } : t,
  );
}

export function removeTeamById(teams, teamId) {
  return teams.filter((team) => team.id !== teamId);
}

export function clearBattleSelectionFor(battleSelection, deletedTeamId) {
  return {
    teamAId:
      battleSelection.teamAId === deletedTeamId
        ? null
        : battleSelection.teamAId,
    teamBId:
      battleSelection.teamBId === deletedTeamId
        ? null
        : battleSelection.teamBId,
  };
}

export function canStartBattleBetween(teams, teamAId, teamBId) {
  if (!teamAId || !teamBId || teamAId === teamBId) return false;

  const teamA = teams.find((team) => team.id === teamAId);
  const teamB = teams.find((team) => team.id === teamBId);

  if (!teamA || !teamB) return false;

  return canStartBattle(teamA.pokemons, teamB.pokemons);
}

export function addPokemonToTeam({ teamA, teamB, team, pokemon, maxSize = 6 }) {
  const existsInA = teamA.some((p) => p.id === pokemon.id);
  const existsInB = teamB.some((p) => p.id === pokemon.id);

  if (existsInA || existsInB) {
    return { teamA, teamB };
  }

  if (team === "A") {
    if (teamA.length >= maxSize) return { teamA, teamB };

    return {
      teamA: [...teamA, pokemon],
      teamB,
    };
  }

  if (team === "B") {
    if (teamB.length >= maxSize) return { teamA, teamB };

    return {
      teamA,
      teamB: [...teamB, pokemon],
    };
  }

  return { teamA, teamB };
}

export function removePokemonFromTeam(team, pokemonId) {
  return team.filter((p) => p.id !== pokemonId);
}

export function clearTeam() {
  return [];
}

export function isTeamValid(team, minSize = 1) {
  return team.length >= minSize;
}

export function canStartBattle(teamA, teamB) {
  return teamA.length > 0 && teamB.length > 0;
}
