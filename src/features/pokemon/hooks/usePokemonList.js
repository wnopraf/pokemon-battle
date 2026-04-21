import { useQuery } from "@tanstack/react-query";
import * as pokemonApi from "../pokemon.api.js";
import { pokemonKeys } from "../pokemon.keys.js";
import { mapPokemonListItem } from "../pokemon.adapters.js";

export const usePokemonList = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: pokemonKeys.list(limit, offset),
    queryFn: async () => {
      const response = await pokemonApi.getPokemonList(limit, offset);
      return response.results.map(mapPokemonListItem);
    },
    staleTime: 5 * 60 * 1000,
  });
};
