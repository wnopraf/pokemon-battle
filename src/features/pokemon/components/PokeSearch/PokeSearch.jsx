import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

import { PokeGrid } from "@/features/pokemon/components/PokeGrid";
import { usePokemonSearch } from "@/features/pokemon/hooks/usePokemonSearch";

function TypeSkeletonList() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={`type-skeleton-${index}`}
          className="h-8 w-20 rounded-full"
        />
      ))}
    </div>
  );
}

export function PokeSearch({ onSelectPokemon }) {
  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    types,
    results,
    isLoadingPokemons,
    isLoadingTypes,
    isError,
  } = usePokemonSearch();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--gray-500)" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar Pokémon por nombre"
            className="h-10 pl-10"
          />
        </div>

        <Select
          value={selectedType || "all"}
          onValueChange={(value) =>
            setSelectedType(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                <span className="capitalize">{type}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-(--gray-700)">
          Filtrar por tipo
        </p>
        {isLoadingTypes ? (
          <TypeSkeletonList />
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={selectedType ? "outline" : "default"}
              onClick={() => setSelectedType("")}
            >
              Todos
            </Button>
            {types.map((type) => (
              <Button
                key={type}
                type="button"
                size="sm"
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        )}
      </div>

      {isError ? (
        <div className="rounded-xl border border-(--red-500) bg-red-50 p-4 text-sm text-(--red-500)">
          No se pudieron cargar los Pokémon. Inténtalo de nuevo.
        </div>
      ) : isLoadingPokemons ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={`pokemon-skeleton-${index}`}
              className="h-28 rounded-xl"
            />
          ))}
        </div>
      ) : (
        <PokeGrid pokemons={results} onSelect={onSelectPokemon} />
      )}
    </div>
  );
}
