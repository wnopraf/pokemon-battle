export const pokemonKeys = {
  all: ["pokemon"],

  list: (limit, offset) => [...pokemonKeys.all, "list", limit, offset],
  typeList: () => [...pokemonKeys.all, "type"],
  typeDetail: (type) => [...pokemonKeys.all, "type", type],
  detail: (id) => [...pokemonKeys.all, "detail", id],
};
