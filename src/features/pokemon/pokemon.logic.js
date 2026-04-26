export function searchPokemon(pokemonList, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase();
  return pokemonList.filter((p) =>
    p.name.toLowerCase().includes(normalizedSearch),
  );
}

export function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function sortByAttackDesc(pokemons) {
  return [...pokemons].sort((a, b) => b.attack - a.attack);
}
export function applyPokemonFilters({ pokemons, search, sort, shuffle }) {
  let result = pokemons;

  result = searchPokemon(result, search);

  if (sort === "attack") {
    result = sortByAttackDesc(result);
  }

  if (sort === "name") {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (shuffle) {
    result = shuffleArray(result);
  }

  return result;
}
