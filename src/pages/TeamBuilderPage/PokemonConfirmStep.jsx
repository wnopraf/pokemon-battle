import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePokemonDetail } from "@/features/pokemon";

export function PokemonConfirmStep({ pokemonId, onBack, onConfirm }) {
  const {
    data: pokemon,
    isLoading,
    isError,
    refetch,
  } = usePokemonDetail(pokemonId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-(--gray-200) bg-(--gray-50) p-4 text-sm text-(--gray-500)">
        Cargando confirmación...
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-(--red-500) bg-red-50 p-4 text-sm text-(--red-500)">
          No se pudo cargar el Pokémon seleccionado.
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
          <Button type="button" variant="outline" onClick={onBack}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-(--gray-200) bg-white shadow-sm">
        <div className="bg-linear-to-br from-(--blue-50) via-white to-(--yellow-50) p-5 sm:p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] border border-white/80 bg-white/90 p-3 shadow-lg">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-(--gray-500)">
                #{pokemon.id}
              </p>
              <h3 className="text-2xl font-bold capitalize text-(--gray-900)">
                {pokemon.name}
              </h3>

              <div className="flex flex-wrap justify-center gap-2">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="rounded-full border-(--gray-300) bg-white/80 px-3 py-1 capitalize"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-(--gray-200) bg-(--gray-50) p-4 sm:p-5">
        <p className="text-sm leading-6 text-(--gray-700)">
          Vas a añadir a{" "}
          <span className="font-semibold capitalize text-(--gray-900)">
            {pokemon.name}
          </span>{" "}
          al equipo actual.
        </p>
        <p className="mt-2 text-sm text-(--gray-500)">
          Se incorporará a la alineación y podrás reordenarlo después si lo
          necesitas.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button type="button" onClick={() => onConfirm(pokemon)}>
          Confirmar adición
        </Button>
      </div>
    </div>
  );
}
