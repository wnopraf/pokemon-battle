import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePokemonDetail } from "@/features/pokemon";

export function PokemonDetailStep({ pokemonId, onBack, onContinue }) {
  const {
    data: pokemon,
    isLoading,
    isError,
  } = usePokemonDetail(pokemonId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-(--red-500) bg-red-50 p-4 text-sm text-(--red-500)">
          No se pudo cargar el detalle del Pokémon.
        </div>
        <Button type="button" variant="outline" onClick={onBack}>
          Volver a búsqueda
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-(--gray-200) bg-white p-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
          <div className="h-28 w-28 rounded-xl bg-(--gray-50) p-2">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs uppercase tracking-wide text-(--gray-500)">
              #{pokemon.id}
            </p>
            <h3 className="text-xl font-semibold capitalize text-(--gray-900)">
              {pokemon.name}
            </h3>

            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              {pokemon.types.map((type) => (
                <Badge key={type} variant="outline" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-(--gray-200) bg-(--gray-50) p-3 text-center">
          <p className="text-xs text-(--gray-500)">Ataque</p>
          <p className="text-lg font-semibold text-(--gray-900)">{pokemon.attack}</p>
        </div>
        <div className="rounded-xl border border-(--gray-200) bg-(--gray-50) p-3 text-center">
          <p className="text-xs text-(--gray-500)">Defensa</p>
          <p className="text-lg font-semibold text-(--gray-900)">{pokemon.defense}</p>
        </div>
        <div className="rounded-xl border border-(--gray-200) bg-(--gray-50) p-3 text-center">
          <p className="text-xs text-(--gray-500)">Velocidad</p>
          <p className="text-lg font-semibold text-(--gray-900)">{pokemon.speed}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button type="button" onClick={() => onContinue(pokemon.id)}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
