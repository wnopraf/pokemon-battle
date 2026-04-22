import { useQuery } from "@tanstack/react-query";
import * as pokemonApi from "../pokemon.api.js";
import { pokemonKeys } from "../pokemon.keys.js";
import { mapPokemonByType } from "../pokemon.adapters.js";

export const usePokemonTypeDetail = (type) => {
  return useQuery({
    queryKey: pokemonKeys.typeDetail(type),
    queryFn: async () => {
      const response = await pokemonApi.getPokemonByType(type);
      return mapPokemonByType(response);
    },
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
};
