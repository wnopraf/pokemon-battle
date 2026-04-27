import {
  applyPokemonFilters,
  searchPokemon,
  shuffleArray,
  sortByAttackDesc,
} from "./pokemon.logic";

const createPokemon = (overrides) => ({
  id: 1,
  name: "Bulbasaur",
  attack: 50,
  defense: 50,
  speed: 50,
  ...overrides,
});

describe("searchPokemon", () => {
  const pokemons = [
    createPokemon({ id: 1, name: "Bulbasaur" }),
    createPokemon({ id: 2, name: "Charmander" }),
    createPokemon({ id: 3, name: "Squirtle" }),
    createPokemon({ id: 4, name: "Pikachu" }),
  ];

  test("returns all pokemons when search term is empty", () => {
    const result = searchPokemon(pokemons, "");
    expect(result).toHaveLength(4);
  });

  test("filters by name case-insensitively", () => {
    const result = searchPokemon(pokemons, "bul");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bulbasaur");
  });

  test("filters with uppercase search term", () => {
    const result = searchPokemon(pokemons, "CHAR");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Charmander");
  });

  test("returns empty array when no matches", () => {
    const result = searchPokemon(pokemons, "missing");
    expect(result).toHaveLength(0);
  });

  test("handles partial matches", () => {
    const result = searchPokemon(pokemons, "a");
    expect(result.length).toBeGreaterThan(0);
  });

  test("does not mutate original array", () => {
    const originalLength = pokemons.length;
    searchPokemon(pokemons, "bul");
    expect(pokemons).toHaveLength(originalLength);
  });
});

describe("shuffleArray", () => {
  test("returns a new array", () => {
    const original = [1, 2, 3];
    const result = shuffleArray(original);
    expect(result).not.toBe(original);
  });

  test("does not mutate original array", () => {
    const original = [1, 2, 3];
    shuffleArray(original);
    expect(original).toEqual([1, 2, 3]);
  });

  test("returns array with same length", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffleArray(original);
    expect(result).toHaveLength(original.length);
  });

  test("returns array with same elements", () => {
    const original = [1, 2, 3];
    const result = shuffleArray(original);
    expect(result.sort()).toEqual(original.sort());
  });

  test("handles empty array", () => {
    const result = shuffleArray([]);
    expect(result).toEqual([]);
  });

  test("handles single element array", () => {
    const result = shuffleArray([1]);
    expect(result).toEqual([1]);
  });
});

describe("sortByAttackDesc", () => {
  test("sorts by attack in descending order", () => {
    const pokemons = [
      createPokemon({ id: 1, name: "A", attack: 30 }),
      createPokemon({ id: 2, name: "B", attack: 100 }),
      createPokemon({ id: 3, name: "C", attack: 50 }),
    ];
    const result = sortByAttackDesc(pokemons);
    expect(result[0].attack).toBe(100);
    expect(result[1].attack).toBe(50);
    expect(result[2].attack).toBe(30);
  });

  test("does not mutate original array", () => {
    const original = [
      createPokemon({ id: 1, attack: 30 }),
      createPokemon({ id: 2, attack: 100 }),
    ];
    sortByAttackDesc(original);
    expect(original[0].attack).toBe(30);
  });

  test("returns a new array", () => {
    const original = [createPokemon({ attack: 50 })];
    const result = sortByAttackDesc(original);
    expect(result).not.toBe(original);
  });

  test("handles empty array", () => {
    const result = sortByAttackDesc([]);
    expect(result).toEqual([]);
  });

  test("handles single element array", () => {
    const original = [createPokemon({ attack: 50 })];
    const result = sortByAttackDesc(original);
    expect(result).toEqual(original);
  });

  test("maintains order for equal attack values", () => {
    const pokemons = [
      createPokemon({ id: 1, name: "A", attack: 50 }),
      createPokemon({ id: 2, name: "B", attack: 50 }),
    ];
    const result = sortByAttackDesc(pokemons);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });
});

describe("applyPokemonFilters", () => {
  const pokemons = [
    createPokemon({ id: 1, name: "Bulbasaur", attack: 30 }),
    createPokemon({ id: 2, name: "Charmander", attack: 100 }),
    createPokemon({ id: 3, name: "Squirtle", attack: 50 }),
  ];

  test("returns original array when no filters applied", () => {
    const result = applyPokemonFilters({ pokemons, search: "", sort: null, shuffle: false });
    expect(result).toEqual(pokemons);
  });

  test("applies search filter", () => {
    const result = applyPokemonFilters({ pokemons, search: "bul", sort: null, shuffle: false });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Bulbasaur");
  });

  test("applies attack sort", () => {
    const result = applyPokemonFilters({ pokemons, search: "", sort: "attack", shuffle: false });
    expect(result[0].attack).toBe(100);
    expect(result[2].attack).toBe(30);
  });

  test("applies name sort", () => {
    const result = applyPokemonFilters({ pokemons, search: "", sort: "name", shuffle: false });
    expect(result[0].name).toBe("Bulbasaur");
    expect(result[1].name).toBe("Charmander");
    expect(result[2].name).toBe("Squirtle");
  });

  test("applies shuffle", () => {
    const result = applyPokemonFilters({ pokemons, search: "", sort: null, shuffle: true });
    expect(result).toHaveLength(3);
    expect(result).not.toEqual(pokemons);
  });

  test("combines search and sort", () => {
    const result = applyPokemonFilters({ pokemons, search: "a", sort: "attack", shuffle: false });
    expect(result.length).toBeGreaterThan(0);
    if (result.length > 1) {
      expect(result[0].attack).toBeGreaterThanOrEqual(result[1].attack);
    }
  });

  test("combines search and shuffle", () => {
    const result = applyPokemonFilters({ pokemons, search: "a", sort: null, shuffle: true });
    expect(result.length).toBeGreaterThan(0);
  });

  test("combines all filters", () => {
    const result = applyPokemonFilters({ pokemons, search: "", sort: "attack", shuffle: true });
    expect(result).toHaveLength(3);
  });

  test("does not mutate original pokemons array", () => {
    const originalLength = pokemons.length;
    applyPokemonFilters({ pokemons, search: "bul", sort: "attack", shuffle: true });
    expect(pokemons).toHaveLength(originalLength);
  });

  test("handles empty pokemons array", () => {
    const result = applyPokemonFilters({ pokemons: [], search: "", sort: null, shuffle: false });
    expect(result).toEqual([]);
  });

  test("ignores unknown sort option", () => {
    const result = applyPokemonFilters({ pokemons, search: "", sort: "unknown", shuffle: false });
    expect(result).toEqual(pokemons);
  });
});
