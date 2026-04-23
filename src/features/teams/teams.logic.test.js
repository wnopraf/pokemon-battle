import {
  addPokemonToTeam,
  removePokemonFromTeam,
  clearTeam,
  isTeamValid,
  canStartBattle,
} from "./teams.logic";

describe("teams.logic", () => {
  describe("addPokemonToTeam", () => {
    const mockPokemon = { id: 1, name: "Bulbasaur", attack: 50, defense: 50, speed: 50 };

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
        2
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
        2
      );

      expect(result).toBe(true);
    });
  });

  describe("canStartBattle", () => {
    it("should return true when both teams have pokemon", () => {
      const result = canStartBattle(
        [{ id: 1, name: "Bulbasaur" }],
        [{ id: 2, name: "Charmander" }]
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
});
