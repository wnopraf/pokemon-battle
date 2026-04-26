import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { usePokemonDetail } from "@/features/pokemon";

const STAT_MAX = 200;

function formatStatValue(value) {
  return Math.max(0, Math.min(100, Math.round((value / STAT_MAX) * 100)));
}

export function PokemonDetailStep({ pokemonId, onBack, onContinue }) {
  const { data: pokemon, isLoading, isError } = usePokemonDetail(pokemonId);

  const stats = pokemon
    ? [
        { label: "Ataque", value: pokemon.attack, tone: "bg-(--red-500)" },
        {
          label: "Defensa",
          value: pokemon.defense,
          tone: "bg-(--blue-500)",
        },
        {
          label: "Velocidad",
          value: pokemon.speed,
          tone: "bg-(--yellow-500)",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
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
      <div className="overflow-hidden rounded-2xl border border-(--gray-200) bg-white shadow-sm">
        <div className="bg-linear-to-br from-(--blue-50) via-white to-(--yellow-50) px-4.5 py-5 sm:px-5 sm:py-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-36 w-36 items-center justify-center rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-lg">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-(--gray-500)">
                #{pokemon.id}
              </p>
              <h3 className="text-[1.6rem] font-bold capitalize text-(--gray-900) sm:text-2xl">
                {pokemon.name}
              </h3>

              <div className="flex flex-wrap justify-center gap-2">
                {pokemon.types.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="rounded-full border-(--gray-300) bg-white/80 px-2.5 py-0.75 text-[13px] capitalize"
                  >
                    {type}
                  </Badge>
                ))}
              </div>

              <p className="mx-auto max-w-md text-[13px] leading-5.5 text-(--gray-600)">
                Revisa sus estadísticas base para decidir si encaja en la
                estrategia de tu equipo.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-(--gray-200) bg-(--gray-50) p-3.5 sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-(--gray-900)">
              Estadísticas base
            </p>
            <p className="text-[13px] text-(--gray-500)">
              Valores relativos sobre una escala visual de 0 a {STAT_MAX}.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-(--gray-200) bg-white p-3.5 shadow-sm"
            >
              <Progress
                value={formatStatValue(stat.value)}
                className="grid gap-2"
                trackClassName="h-2 rounded-full bg-(--gray-100)"
                indicatorClassName={stat.tone}
              >
                <div className="flex items-center gap-2.5">
                  <ProgressLabel className="text-[13px] font-semibold text-(--gray-800)">
                    {stat.label}
                  </ProgressLabel>
                  <ProgressValue className="text-[13px] font-semibold text-(--gray-600)">
                    {stat.value}
                  </ProgressValue>
                </div>
              </Progress>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onBack} className="h-10">
          Volver
        </Button>
        <Button type="button" onClick={() => onContinue(pokemon.id)} className="h-10">
          Continuar
        </Button>
      </div>
    </div>
  );
}
