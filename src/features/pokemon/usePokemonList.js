import { useQuery } from "@tanstack/react-query";
import * as pokemonApi from "./pokemon.api.js";
import { pokemonKeys } from "./pokemon.keys.js";

export const usePokemonList = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: pokemonKeys.list(limit, offset),
    queryFn: () => pokemonApi.getPokemonList(limit, offset),
  });
};
