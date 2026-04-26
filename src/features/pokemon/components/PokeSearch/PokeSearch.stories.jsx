import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

import { PokemonFeatureProvider } from "@/features/pokemon/providers";
import { PokeSearch } from "./PokeSearch";
import { PokeSearchModal } from "./PokeSearchModal";

function QueryProviderWrapper({ children }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default {
  title: "Features/Pokemon/PokeSearch",
  component: PokeSearch,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <QueryProviderWrapper>
      <PokemonFeatureProvider onSelectPokemon={() => {}}>
        <PokeSearch />
      </PokemonFeatureProvider>
    </QueryProviderWrapper>
  ),
};

export const AsModal = {
  render: () => (
    <QueryProviderWrapper>
      <PokemonFeatureProvider onSelectPokemon={() => {}}>
        <PokeSearchModal open onOpenChange={() => {}} />
      </PokemonFeatureProvider>
    </QueryProviderWrapper>
  ),
};
