import {
  appendHistoryEntry,
  createBattleId,
  createHistoryEntry,
  fight,
  simulateBattle,
  toTeamSnapshot,
} from "./battle.logic";

const createPokemon = (overrides) => ({
  name: "test",
  attack: 50,
  defense: 50,
  speed: 50,
  ...overrides,
});

describe("fight", () => {
  test("should let the faster Pokémon attack first and win if attack exceeds defense", () => {
    const a = createPokemon({ speed: 100, attack: 80 });
    const b = createPokemon({ defense: 50 });

    const winner = fight(a, b);

    expect(winner).toBe(a);
  });

  test("should allow defender to counterattack and win if attacker fails", () => {
    const a = createPokemon({ speed: 100, attack: 40, defense: 40 });
    const b = createPokemon({ attack: 80 });

    const winner = fight(a, b);

    expect(winner).toBe(b);
  });

  test("should return the faster Pokémon if neither can defeat the other", () => {
    const a = createPokemon({ speed: 100, attack: 40 });
    const b = createPokemon({ speed: 50, attack: 40 });

    const winner = fight(a, b);

    expect(winner).toBe(a);
  });

  test("should prioritize speed when both could defeat each other", () => {
    const a = createPokemon({ speed: 100, attack: 80 });
    const b = createPokemon({ speed: 50, attack: 80 });

    const winner = fight(a, b);

    expect(winner).toBe(a);
  });
});

describe("simulateBattle", () => {
  test("should return team A as winner when it defeats all opponents", () => {
    const teamA = [
      createPokemon({ name: "A1", attack: 100 }),
      createPokemon({ name: "A2" }),
    ];

    const teamB = [createPokemon({ name: "B1", defense: 10 })];

    const result = simulateBattle(teamA, teamB);

    expect(result.winner).toBe("A");
    expect(result.summary.teamB.alive.length).toBe(0);
    expect(result.summary.teamB.defeated.length).toBe(1);
  });

  test("should return team B as winner when it defeats all opponents", () => {
    const teamA = [createPokemon({ name: "A1", defense: 10 })];

    const teamB = [
      createPokemon({ name: "B1", attack: 100 }),
      createPokemon({ name: "B2" }),
    ];

    const result = simulateBattle(teamA, teamB);

    expect(result.winner).toBe("B");
    expect(result.summary.teamA.alive.length).toBe(0);
    expect(result.summary.teamA.defeated.length).toBe(1);
  });

  test("should allow the winner to continue fighting the next opponent", () => {
    const teamA = [createPokemon({ name: "A1", attack: 100 })];

    const teamB = [
      createPokemon({ name: "B1", defense: 10 }),
      createPokemon({ name: "B2", defense: 10 }),
    ];

    const result = simulateBattle(teamA, teamB);

    expect(result.rounds.length).toBe(2);
    expect(result.winner).toBe("A");
  });

  test("should correctly record each round result", () => {
    const teamA = [createPokemon({ name: "A1", attack: 100 })];
    const teamB = [createPokemon({ name: "B1", defense: 10 })];

    const result = simulateBattle(teamA, teamB);

    expect(result.rounds[0]).toMatchObject({
      round: 1,
      winner: teamA[0],
      loser: teamB[0],
    });
  });

  test("should correctly calculate alive and defeated Pokémon", () => {
    const teamA = [
      createPokemon({ name: "A1", attack: 100 }),
      createPokemon({ name: "A2" }),
    ];

    const teamB = [createPokemon({ name: "B1", defense: 10 })];

    const result = simulateBattle(teamA, teamB);

    expect(result.summary.teamA.alive.length).toBe(2);
    expect(result.summary.teamA.defeated.length).toBe(0);
    expect(result.summary.teamB.defeated.length).toBe(1);
  });

  test("should handle empty teams gracefully", () => {
    const result = simulateBattle([], []);

    expect(result).toBeDefined();
    expect(result.rounds.length).toBe(0);
  });
});

describe("createBattleId", () => {
  test("returns a unique id with the battle prefix", () => {
    const id1 = createBattleId();
    const id2 = createBattleId();

    expect(id1).toMatch(/^battle-\d+-[a-z0-9]{6}$/);
    expect(id1).not.toBe(id2);
  });
});

describe("toTeamSnapshot", () => {
  test("extracts id, name and pokemon count", () => {
    const snapshot = toTeamSnapshot({
      id: "t1",
      name: "Fire",
      pokemons: [{ id: 1 }, { id: 2 }],
    });

    expect(snapshot).toEqual({ id: "t1", name: "Fire", pokemonCount: 2 });
  });

  test("returns safe defaults for missing fields", () => {
    expect(toTeamSnapshot(null)).toEqual({
      id: null,
      name: "",
      pokemonCount: 0,
    });
    expect(toTeamSnapshot({})).toEqual({
      id: null,
      name: "",
      pokemonCount: 0,
    });
  });
});

describe("createHistoryEntry", () => {
  const teamA = { id: "a", name: "A", pokemons: [{ id: 1 }] };
  const teamB = { id: "b", name: "B", pokemons: [{ id: 2 }] };
  const result = { winner: "A", rounds: [{}, {}, {}] };

  test("returns null when arguments are missing", () => {
    expect(createHistoryEntry(null, teamA, teamB)).toBeNull();
    expect(createHistoryEntry(result, null, teamB)).toBeNull();
    expect(createHistoryEntry(result, teamA, null)).toBeNull();
  });

  test("builds an entry with snapshots and round count", () => {
    const entry = createHistoryEntry(result, teamA, teamB);

    expect(entry).toMatchObject({
      winner: "A",
      rounds: 3,
      teamA: { id: "a", name: "A", pokemonCount: 1 },
      teamB: { id: "b", name: "B", pokemonCount: 1 },
    });
    expect(entry.id).toEqual(expect.any(String));
    expect(entry.date).toEqual(expect.any(Number));
  });

  test("handles results without rounds array", () => {
    const entry = createHistoryEntry({ winner: "B" }, teamA, teamB);
    expect(entry.rounds).toBe(0);
  });
});

describe("appendHistoryEntry", () => {
  const entry = (id) => ({ id });

  test("prepends the entry at the beginning", () => {
    const result = appendHistoryEntry([entry("a")], entry("b"));
    expect(result.map((e) => e.id)).toEqual(["b", "a"]);
  });

  test("respects the max history size", () => {
    const history = [entry("1"), entry("2"), entry("3")];
    const result = appendHistoryEntry(history, entry("4"), 3);

    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).toEqual(["4", "1", "2"]);
  });

  test("returns history unchanged when entry is null", () => {
    const history = [entry("1")];
    expect(appendHistoryEntry(history, null)).toBe(history);
  });
});
