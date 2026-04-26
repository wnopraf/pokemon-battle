import { useContext } from "react";

import { PokemonFeatureContext } from "./PokemonFeatureProvider";

export function usePokemonFeature() {
  const context = useContext(PokemonFeatureContext);

  if (!context) {
    throw new Error("usePokemonFeature must be used within PokemonFeatureProvider");
  }

  return context;
}
