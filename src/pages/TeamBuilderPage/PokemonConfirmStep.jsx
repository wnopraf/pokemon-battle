import { Button } from "@/components/ui/button";
import { usePokemonDetail } from "@/features/pokemon";

export function PokemonConfirmStep({ pokemonId, onBack, onConfirm }) {
  const {
    data: pokemon,
    isLoading,
    isError,
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
        <Button type="button" variant="outline" onClick={onBack}>
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-(--gray-200) bg-(--gray-50) p-4">
        <p className="text-sm text-(--gray-700)">
          Vas a añadir a <span className="font-semibold capitalize">{pokemon.name}</span> al equipo.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2">
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
