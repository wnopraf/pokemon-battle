import { fight, simulateBattle } from "./battle.logic";

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
