import { useQuery } from "@tanstack/react-query";
import * as pokemonApi from "./pokemon.api.js";
import { pokemonKeys } from "./pokemon.keys.js";

export const usePokemonDetail = (name) => {
  return useQuery({
    queryKey: pokemonKeys.detail(name),
    queryFn: () => pokemonApi.getPokemon(name),
    enabled: !!name,
  });
};
