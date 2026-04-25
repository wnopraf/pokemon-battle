import { Card, CardContent } from "@/components/ui/card";

export function PokeGrid({ pokemons = [], onSelect }) {
  if (!pokemons.length) {
    return (
      <div className="rounded-xl border border-dashed border-(--gray-300) bg-(--gray-50) p-8 text-center text-sm text-(--gray-500)">
        No hay Pokémon para mostrar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {pokemons.map((pokemon) => (
        <Card
          key={pokemon.id}
          className="cursor-pointer border-(--gray-200) py-0 hover:border-(--blue-500) hover:shadow-md"
          onClick={() => onSelect?.(pokemon)}
        >
          <CardContent className="flex flex-col items-center gap-2 p-3">
            <div className="h-18 w-18 rounded-lg bg-(--gray-50) p-1">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <p className="text-xs font-semibold capitalize text-(--gray-900)">
              {pokemon.name}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
