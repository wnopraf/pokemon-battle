import { useMemo, useState } from "react";

import { useDebounce } from "@/shared/hooks";
import { searchPokemon } from "../pokemon.logic";
import { usePokemonList } from "./usePokemonList";
import { usePokemonTypes } from "./usePokemonTypes";

export function usePokemonSearch({
  initialType = "",
  limit = 24,
  offset = 0,
  debounceMs = 300,
} = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(initialType);

  const debouncedSearch = useDebounce(searchTerm, debounceMs);

  const {
    data: pokemons = [],
    isLoading: isLoadingPokemons,
    isError: isPokemonsError,
    error: pokemonsError,
  } = usePokemonList({
    type: selectedType || undefined,
    limit,
    offset,
  });

  const {
    data: types = [],
    isLoading: isLoadingTypes,
    isError: isTypesError,
    error: typesError,
  } = usePokemonTypes();

  const results = useMemo(() => {
    const term = debouncedSearch.trim();
    if (!term) return pokemons;
    return searchPokemon(pokemons, term);
  }, [pokemons, debouncedSearch]);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    selectedType,
    setSelectedType,
    types,
    results,
    isLoadingPokemons,
    isLoadingTypes,
    isError: isPokemonsError || isTypesError,
    error: pokemonsError || typesError,
  };
}
