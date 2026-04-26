import { createContext, useMemo } from "react";

export const PokemonFeatureContext = createContext(null);

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
