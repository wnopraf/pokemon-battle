import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TeamCard({ title, pokemons, onClick }) {
  const isInteractive = typeof onClick === "function";

  return (
    <Card
      className={cn(
        "gap-4 rounded-[1.6rem] border-(--gray-200) bg-white py-6 shadow-sm",
        isInteractive
          ? "cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-(--blue-300) hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--blue-500)"
          : "",
      )}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between px-6 pb-0">
        <CardTitle className="text-lg font-semibold text-(--gray-900)">
          {title}
        </CardTitle>
        <Badge
          variant="secondary"
          className="rounded-full px-2.5 py-1 text-sm font-semibold"
        >
          {pokemons.length}/6
        </Badge>
      </CardHeader>

      <CardContent className="px-6 pt-2">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, index) => {
            const pokemon = pokemons[index] ?? null;

            return (
              <div
                key={pokemon ? pokemon.id : `empty-${title}-${index}`}
                className="aspect-square overflow-hidden rounded-2xl border border-(--gray-200) bg-(--gray-50) flex items-center justify-center"
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
