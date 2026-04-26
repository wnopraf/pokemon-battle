import { useMemo } from "react";

import { PokemonFeatureContext } from "./PokemonFeatureContext";

export function PokemonFeatureProvider({ children, onSelectPokemon }) {
  const value = useMemo(
    () => ({
      onSelectPokemon,
    }),
    [onSelectPokemon],
  );

  return (
    <PokemonFeatureContext.Provider value={value}>
      {children}
    </PokemonFeatureContext.Provider>
  );
}
