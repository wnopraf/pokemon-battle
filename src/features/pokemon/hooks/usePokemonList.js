import { useQuery } from "@tanstack/react-query";
import * as pokemonApi from "../pokemon.api.js";
import { pokemonKeys } from "../pokemon.keys.js";
import { mapPokemonByType, mapPokemonListItem } from "../pokemon.adapters.js";

export const usePokemonList = ({ type, limit = 20, offset = 0 }) => {
  return useQuery({
    queryKey: pokemonKeys.list({ type, limit, offset }),
    queryFn: async () => {
      if (type) {
        const response = await pokemonApi.getPokemonByType(type);
        return mapPokemonByType(response);
      }
      const response = await pokemonApi.getPokemonList(limit, offset);
      return response.results.map(mapPokemonListItem);
    },
    staleTime: 5 * 60 * 1000,
  });
};
