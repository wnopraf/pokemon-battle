export function mapPokemonListItem(apiItem) {
  const id = apiItem.url.split("/").filter(Boolean).pop();

  return {
    id: Number(id),
    name: apiItem.name,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  };
}

export function mapPokemon(apiPokemon) {
  const getStat = (name) =>
    apiPokemon.stats.find((s) => s.stat.name === name)?.base_stat ?? 0;

  return {
    id: apiPokemon.id,
    name: apiPokemon.name,
    image: apiPokemon.sprites?.front_default ?? "",

    attack: getStat("attack"),
    defense: getStat("defense"),
    speed: getStat("speed"),

    types: apiPokemon.types.map((t) => t.type.name),
  };
}
export function mapPokemonTypeList(apiResponse) {
  return apiResponse.results
    .map((t) => t.name)
    .filter((t) => t !== "unknown" && t !== "shadow");
}
export function mapPokemonByType(apiResponse) {
  return apiResponse.pokemon.map((entry) => {
    const { name, url } = entry.pokemon;

    const id = url.split("/").filter(Boolean).pop();

    return {
      id: Number(id),
      name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    };
  });
}
