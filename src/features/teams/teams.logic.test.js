import {
  addPokemonToTeam,
  canStartBattleBetween,
  canStartBattle,
  clearBattleSelectionFor,
  clearTeam,
  createEmptyDraftTeam,
  createTeamId,
  DRAFT_SORT_OPTIONS,
  isPokemonInOtherTeam,
  isTeamValid,
  isValidDraftSort,
  removePokemonFromTeam,
  removeTeamById,
  reorderPokemons,
  upsertTeam,
} from "./teams.logic";

describe("teams.logic", () => {
  describe("addPokemonToTeam", () => {
    const mockPokemon = {
      id: 1,
      name: "Bulbasaur",
      attack: 50,
      defense: 50,
      speed: 50,
    };

    it("should add pokemon to team A", () => {
      const result = addPokemonToTeam({
        teamA: [],
        teamB: [],
        team: "A",
        pokemon: mockPokemon,
      });

      expect(result.teamA).toHaveLength(1);
      expect(result.teamA[0]).toBe(mockPokemon);
      expect(result.teamB).toHaveLength(0);
    });

    it("should add pokemon to team B", () => {
      const result = addPokemonToTeam({
        teamA: [],
        teamB: [],
        team: "B",
        pokemon: mockPokemon,
      });

      expect(result.teamB).toHaveLength(1);
      expect(result.teamB[0]).toBe(mockPokemon);
      expect(result.teamA).toHaveLength(0);
    });

    it("should not add pokemon if already in team A", () => {
      const result = addPokemonToTeam({
        teamA: [mockPokemon],
        teamB: [],
        team: "B",
        pokemon: mockPokemon,
      });

      expect(result.teamB).toHaveLength(0);
      expect(result.teamA).toHaveLength(1);
    });

    it("should not add pokemon if already in team B", () => {
      const result = addPokemonToTeam({
        teamA: [],
        teamB: [mockPokemon],
        team: "A",
        pokemon: mockPokemon,
      });

      expect(result.teamA).toHaveLength(0);
      expect(result.teamB).toHaveLength(1);
    });

    it("should respect max size for team A", () => {
      const fullTeam = Array(6).fill({ id: 1, name: "Pokemon" });
      const result = addPokemonToTeam({
        teamA: fullTeam,
        teamB: [],
        team: "A",
        pokemon: mockPokemon,
        maxSize: 6,
      });

      expect(result.teamA).toHaveLength(6);
    });

    it("should respect max size for team B", () => {
      const fullTeam = Array(6).fill({ id: 1, name: "Pokemon" });
      const result = addPokemonToTeam({
        teamA: [],
        teamB: fullTeam,
        team: "B",
        pokemon: mockPokemon,
        maxSize: 6,
      });

      expect(result.teamB).toHaveLength(6);
    });

    it("should return unchanged teams if team parameter is invalid", () => {
      const result = addPokemonToTeam({
        teamA: [],
        teamB: [],
        team: "C",
        pokemon: mockPokemon,
      });

      expect(result.teamA).toHaveLength(0);
      expect(result.teamB).toHaveLength(0);
    });
  });

  describe("removePokemonFromTeam", () => {
    const mockTeam = [
      { id: 1, name: "Bulbasaur" },
      { id: 2, name: "Charmander" },
      { id: 3, name: "Squirtle" },
    ];

    it("should remove pokemon by id", () => {
      const result = removePokemonFromTeam(mockTeam, 2);

      expect(result).toHaveLength(2);
      expect(result.find((p) => p.id === 2)).toBeUndefined();
    });

    it("should not modify original array", () => {
      const originalLength = mockTeam.length;
      removePokemonFromTeam(mockTeam, 1);

      expect(mockTeam).toHaveLength(originalLength);
    });

    it("should return empty array if removing only pokemon", () => {
      const result = removePokemonFromTeam([{ id: 1, name: "Bulbasaur" }], 1);

      expect(result).toHaveLength(0);
    });

    it("should return same array if pokemon not found", () => {
      const result = removePokemonFromTeam(mockTeam, 999);

      expect(result).toHaveLength(3);
    });
  });

  describe("clearTeam", () => {
    it("should return empty array", () => {
      const result = clearTeam();

      expect(result).toEqual([]);
    });

    it("should always return empty array regardless of input", () => {
      const result1 = clearTeam();
      const result2 = clearTeam();

      expect(result1).toEqual(result2);
      expect(result1).toEqual([]);
    });
  });

  describe("isTeamValid", () => {
    it("should return true for team with 1 pokemon (default minSize)", () => {
      const result = isTeamValid([{ id: 1, name: "Bulbasaur" }]);

      expect(result).toBe(true);
    });

    it("should return false for empty team (default minSize)", () => {
      const result = isTeamValid([]);

      expect(result).toBe(false);
    });

    it("should respect custom minSize", () => {
      const result = isTeamValid([{ id: 1, name: "Bulbasaur" }], 2);

      expect(result).toBe(false);
    });

    it("should return true for team meeting custom minSize", () => {
      const result = isTeamValid(
        [
          { id: 1, name: "Bulbasaur" },
          { id: 2, name: "Charmander" },
        ],
        2,
      );

      expect(result).toBe(true);
    });

    it("should return true for team larger than minSize", () => {
      const result = isTeamValid(
        [
          { id: 1, name: "Bulbasaur" },
          { id: 2, name: "Charmander" },
          { id: 3, name: "Squirtle" },
        ],
        2,
      );

      expect(result).toBe(true);
    });
  });

  describe("canStartBattle", () => {
    it("should return true when both teams have pokemon", () => {
      const result = canStartBattle(
        [{ id: 1, name: "Bulbasaur" }],
        [{ id: 2, name: "Charmander" }],
      );

      expect(result).toBe(true);
    });

    it("should return false when team A is empty", () => {
      const result = canStartBattle([], [{ id: 2, name: "Charmander" }]);

      expect(result).toBe(false);
    });

    it("should return false when team B is empty", () => {
      const result = canStartBattle([{ id: 1, name: "Bulbasaur" }], []);

      expect(result).toBe(false);
    });

    it("should return false when both teams are empty", () => {
      const result = canStartBattle([], []);

      expect(result).toBe(false);
    });

    it("should return true for full teams", () => {
      const teamA = Array(6).fill({ id: 1, name: "Pokemon" });
      const teamB = Array(6).fill({ id: 2, name: "Pokemon" });
      const result = canStartBattle(teamA, teamB);

      expect(result).toBe(true);
    });
  });

  describe("createTeamId", () => {
    it("returns a unique id with the team prefix", () => {
      const id1 = createTeamId();
      const id2 = createTeamId();

      expect(id1).toMatch(/^team-\d+-[a-z0-9]{6}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("createEmptyDraftTeam", () => {
    it("returns a draft with default empty values", () => {
      const draft = createEmptyDraftTeam();

      expect(draft).toMatchObject({ name: "", pokemons: [] });
      expect(draft.id).toEqual(expect.any(String));
      expect(draft.createdAt).toEqual(expect.any(Number));
      expect(draft.updatedAt).toEqual(expect.any(Number));
    });
  });

  describe("isValidDraftSort", () => {
    it("accepts known sort options", () => {
      DRAFT_SORT_OPTIONS.forEach((option) => {
        expect(isValidDraftSort(option)).toBe(true);
      });
    });

    it("rejects unknown options", () => {
      expect(isValidDraftSort("speed")).toBe(false);
      expect(isValidDraftSort(undefined)).toBe(false);
    });
  });

  describe("isPokemonInOtherTeam", () => {
    const teams = [
      { id: "t1", pokemons: [{ id: 1 }, { id: 2 }] },
      { id: "t2", pokemons: [{ id: 3 }] },
    ];

    it("returns true when pokemon exists in another team", () => {
      expect(isPokemonInOtherTeam(teams, "t2", 1)).toBe(true);
    });

    it("ignores duplicates within the same draft team", () => {
      expect(isPokemonInOtherTeam(teams, "t1", 1)).toBe(false);
    });

    it("returns false when pokemon is not in any team", () => {
      expect(isPokemonInOtherTeam(teams, "t1", 999)).toBe(false);
    });
  });

  describe("reorderPokemons", () => {
    const list = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it("reorders elements between valid indices", () => {
      const result = reorderPokemons(list, 0, 2);
      expect(result.map((p) => p.id)).toEqual([2, 3, 1]);
    });

    it("returns the same reference when indices are invalid", () => {
      expect(reorderPokemons(list, 0, 5)).toBe(list);
      expect(reorderPokemons(list, -1, 1)).toBe(list);
      expect(reorderPokemons(list, 0, 0)).toBe(list);
      expect(reorderPokemons(list, "0", 1)).toBe(list);
    });

    it("does not mutate the input array", () => {
      reorderPokemons(list, 0, 2);
      expect(list.map((p) => p.id)).toEqual([1, 2, 3]);
    });
  });

  describe("upsertTeam", () => {
    const teamA = { id: "t1", name: "A", pokemons: [], updatedAt: 1 };
    const teamB = { id: "t2", name: "B", pokemons: [], updatedAt: 1 };

    it("appends a new team when id is not present", () => {
      const result = upsertTeam([teamA], teamB);
      expect(result).toHaveLength(2);
      expect(result[1]).toBe(teamB);
    });

    it("replaces an existing team and refreshes updatedAt", () => {
      const updated = { ...teamA, name: "Renamed" };
      const result = upsertTeam([teamA, teamB], updated);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: "t1", name: "Renamed" });
      expect(result[0].updatedAt).toBeGreaterThanOrEqual(teamA.updatedAt);
    });
  });

  describe("removeTeamById", () => {
    it("filters out the team with the given id", () => {
      const teams = [{ id: "t1" }, { id: "t2" }];
      expect(removeTeamById(teams, "t1")).toEqual([{ id: "t2" }]);
    });

    it("returns the same content when id does not exist", () => {
      const teams = [{ id: "t1" }];
      expect(removeTeamById(teams, "missing")).toEqual(teams);
    });
  });

  describe("clearBattleSelectionFor", () => {
    it("clears slots that match the deleted team id", () => {
      const result = clearBattleSelectionFor(
        { teamAId: "t1", teamBId: "t2" },
        "t1",
      );
      expect(result).toEqual({ teamAId: null, teamBId: "t2" });
    });

    it("leaves selection untouched when id does not match", () => {
      const selection = { teamAId: "t1", teamBId: "t2" };
      expect(clearBattleSelectionFor(selection, "t9")).toEqual(selection);
    });
  });

  describe("canStartBattleBetween", () => {
    const teams = [
      { id: "t1", pokemons: [{ id: 1 }] },
      { id: "t2", pokemons: [{ id: 2 }] },
      { id: "empty", pokemons: [] },
    ];

    it("returns true for two distinct non-empty teams", () => {
      expect(canStartBattleBetween(teams, "t1", "t2")).toBe(true);
    });

    it("returns false when ids are missing or equal", () => {
      expect(canStartBattleBetween(teams, null, "t2")).toBe(false);
      expect(canStartBattleBetween(teams, "t1", null)).toBe(false);
      expect(canStartBattleBetween(teams, "t1", "t1")).toBe(false);
    });

    it("returns false when a team is missing or empty", () => {
      expect(canStartBattleBetween(teams, "t1", "missing")).toBe(false);
      expect(canStartBattleBetween(teams, "t1", "empty")).toBe(false);
    });
  });
});
