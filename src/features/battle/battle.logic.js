export const MAX_BATTLE_HISTORY = 50;

export function createBattleId() {
  return `battle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toTeamSnapshot(team) {
  return {
    id: team?.id ?? null,
    name: team?.name ?? "",
    pokemonCount: team?.pokemons?.length ?? 0,
  };
}

export function createHistoryEntry(result, teamA, teamB) {
  if (!result || !teamA || !teamB) return null;

  return {
    id: createBattleId(),
    date: Date.now(),
    winner: result.winner,
    rounds: Array.isArray(result.rounds) ? result.rounds.length : 0,
    teamA: toTeamSnapshot(teamA),
    teamB: toTeamSnapshot(teamB),
  };
}

export function appendHistoryEntry(history, entry, max = MAX_BATTLE_HISTORY) {
  if (!entry) return history;
  return [entry, ...history].slice(0, max);
}

export function simulateBattle(teamA, teamB) {
  let i = 0;
  let j = 0;
  let roundNumber = 1;

  let currentA = teamA[i];
  let currentB = teamB[j];

  const rounds = [];

  const defeatedA = [];
  const defeatedB = [];

  while (currentA && currentB) {
    const winner = fight(currentA, currentB);
    const loser = winner === currentA ? currentB : currentA;

    rounds.push({
      round: roundNumber,
      attackerA: currentA,
      attackerB: currentB,
      winner,
      loser,
    });

    if (winner === currentA) {
      defeatedB.push(currentB);
      j++;
      currentB = teamB[j];
    } else {
      defeatedA.push(currentA);
      i++;
      currentA = teamA[i];
    }

    roundNumber++;
  }

  const aliveA = teamA.slice(i);
  const aliveB = teamB.slice(j);

  return {
    rounds,
    winner: aliveA.length > 0 ? "A" : "B",
    summary: {
      teamA: {
        alive: aliveA,
        defeated: defeatedA,
      },
      teamB: {
        alive: aliveB,
        defeated: defeatedB,
      },
    },
  };
}

export function fight(a, b) {
  const first = a.speed >= b.speed ? a : b;
  const second = first === a ? b : a;

  if (first.attack > second.defense) return first;

  if (second.attack > first.defense) return second;

  return first;
}
