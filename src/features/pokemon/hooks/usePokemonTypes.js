import { useQuery } from "@tanstack/react-query";
import * as pokemonApi from "../pokemon.api.js";
import { pokemonKeys } from "../pokemon.keys.js";
import { mapPokemonTypeList } from "../pokemon.adapters.js";

export const usePokemonTypes
 = () => {
  return useQuery({
    queryKey: pokemonKeys.types(),
    queryFn: async () => {
      const response = await pokemonApi.getPokemonTypes();
      return mapPokemonTypeList(response);
    },
    staleTime: Infinity,
  });
};
