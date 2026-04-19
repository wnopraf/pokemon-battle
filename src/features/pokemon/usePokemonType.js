import { useQuery } from '@tanstack/react-query'
import * as pokemonApi from './pokemon.api.js'
import { pokemonKeys } from './pokemon.keys.js'

export const usePokemonType = () => {
  return useQuery({
    queryKey: pokemonKeys.type(),
    queryFn: () => pokemonApi.getPokemonTypes(),
  })
}
