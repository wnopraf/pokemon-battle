export const pokemonKeys = {
  all: ["pokemon"],
  lists: () => [...pokemonKeys.all, "list"],
  list: (limit, offset) => [...pokemonKeys.lists(), limit, offset],
  details: () => [...pokemonKeys.all, "detail"],
  detail: (name) => [...pokemonKeys.details(), name],
  species: () => [...pokemonKeys.all, "species"],
  speciesDetail: (id) => [...pokemonKeys.species(), id],
};
