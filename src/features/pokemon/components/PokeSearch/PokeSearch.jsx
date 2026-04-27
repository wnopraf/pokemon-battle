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

export function PokeSearch() {
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
    refetch,
  } = usePokemonSearch();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 space-y-5 border-b border-(--gray-200) bg-white pb-5">
        <section className="rounded-2xl border border-(--gray-200) bg-(--gray-50) p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-(--gray-900)">
              Encuentra el próximo Pokémon
            </p>
            <p className="text-sm text-(--gray-500)">
              Busca por nombre o afina la selección por tipo antes de añadirlo
              al equipo.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--gray-500)" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar Pokémon por nombre"
                className="h-11 bg-white pl-10"
              />
            </div>

            <Select
              value={selectedType || "all"}
              onValueChange={(value) =>
                setSelectedType(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="h-11 w-full bg-white sm:w-56">
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
        </section>

        <section>
          <p className="mb-3 text-sm font-medium text-(--gray-700)">
            Filtrar por tipo
          </p>
          {isLoadingTypes ? (
            <TypeSkeletonList />
          ) : (
            <div className="flex flex-wrap gap-2.5">
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
        </section>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-5 sm:px-3">
        {isError ? (
          <div className="space-y-3 rounded-xl border border-(--red-500) bg-red-50 p-4 text-sm text-(--red-500)">
            <p>No se pudieron cargar los Pokémon.</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => refetch()}
            >
              Reintentar
            </Button>
          </div>
        ) : isLoadingPokemons ? (
          <div className="grid grid-cols-2 gap-4 px-1 sm:grid-cols-3 sm:px-2 md:grid-cols-4 lg:px-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={`pokemon-skeleton-${index}`}
                className="h-28 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="px-1 sm:px-2 lg:px-3">
            <PokeGrid pokemons={results} />
          </div>
        )}
      </div>
    </div>
  );
}
