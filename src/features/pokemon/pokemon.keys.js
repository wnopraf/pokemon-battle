export const pokemonKeys = {
  all: ["pokemon"],

  list: (limit, offset) => [...pokemonKeys.lists(), limit, offset],
  type: () => [...pokemonKeys.all, "type"],
  detail: (name) => [...pokemonKeys.details(), name],
};
