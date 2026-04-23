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
