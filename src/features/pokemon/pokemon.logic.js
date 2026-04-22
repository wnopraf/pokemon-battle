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
