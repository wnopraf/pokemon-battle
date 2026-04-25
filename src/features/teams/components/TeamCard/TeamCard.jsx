import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TeamCard({ title, pokemons }) {
  return (
    <Card className="rounded-2xl border-(--gray-200) shadow-sm py-5 gap-3">
      <CardHeader className="flex flex-row items-center justify-between px-5 pb-0">
        <CardTitle className="font-semibold text-(--gray-900) text-base">
          {title}
        </CardTitle>
        <Badge variant="secondary" className="text-xs font-semibold">
          {pokemons.length}/6
        </Badge>
      </CardHeader>

      <CardContent className="px-5 pt-1">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, index) => {
            const pokemon = pokemons[index] ?? null;

            return (
              <div
                key={pokemon ? pokemon.id : `empty-${title}-${index}`}
                className="aspect-square rounded-xl border border-(--gray-200) bg-(--gray-50) overflow-hidden flex items-center justify-center"
                title={pokemon?.name ?? ""}
              >
                {pokemon?.image ? (
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
