import { useQuery } from "@tanstack/react-query";
import * as pokemonApi from "../pokemon.api.js";
import { pokemonKeys } from "../pokemon.keys.js";
import { mapPokemon } from "../pokemon.adapters.js";

export const usePokemonDetail = (id) => {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: async () => {
      const response = await pokemonApi.getPokemon(id);
      return mapPokemon(response);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
