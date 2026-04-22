export const pokemonKeys = {
  all: ["pokemon"],

  list: (params) => [...pokemonKeys.all, "list", params],

  detail: (id) => [...pokemonKeys.all, "detail", id],

  types: () => [...pokemonKeys.all, "types"],
};
