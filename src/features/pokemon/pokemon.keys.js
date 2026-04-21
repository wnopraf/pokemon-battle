export const pokemonKeys = {
  all: ["pokemon"],

  list: (limit, offset) => [...pokemonKeys.all, "list", limit, offset],
  type: () => [...pokemonKeys.all, "type"],
  detail: (id) => [...pokemonKeys.all, "detail", id],
};
