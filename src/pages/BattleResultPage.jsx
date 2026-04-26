import { Crown, RotateCcw, ShieldCheck, Swords } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import confettiImage from "@/assets/confetti.webp";
import trophyImage from "@/assets/trophy.webp";
import { Button } from "@/components/ui/button";
import { useBattleStore } from "@/features/battle/battle.store";
import { useTeamsStore } from "@/features/teams/teams.store";
import { cn } from "@/lib/utils";

function PokemonRoster({ pokemons = [], tone = "neutral", emptyLabel }) {
  if (!pokemons.length) {
    return (
      <div className="rounded-xl border border-dashed border-(--gray-300) bg-(--gray-50) px-4 py-6 text-center text-sm text-(--gray-500)">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {pokemons.map((pokemon) => (
        <div
          key={pokemon.id}
          className={cn(
            "rounded-xl border p-3 text-center shadow-sm",
            tone === "winner" &&
              "border-(--green-500)/30 bg-(--green-500)/10 text-(--gray-900)",
            tone === "loser" &&
              "border-(--gray-200) bg-(--gray-50) text-(--gray-700)",
            tone === "neutral" &&
              "border-(--gray-200) bg-white text-(--gray-900)",
          )}
        >
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="mx-auto size-20 object-contain"
          />
          <p className="mt-2 truncate text-sm font-semibold capitalize">
            {pokemon.name}
          </p>
        </div>
      ))}
    </div>
  );
}

function TeamSummaryCard({ title, team, isWinner, summary }) {
  return (
    <section
      className={cn(
        "rounded-2xl border p-5 shadow-sm",
        isWinner
          ? "border-(--green-500)/30 bg-(--green-500)/10"
          : "border-(--gray-200) bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-(--gray-700)">{title}</p>
          <h2 className="mt-1 text-xl font-bold text-(--gray-900)">
            {team?.name || "Equipo sin datos"}
          </h2>
        </div>
        {isWinner ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-(--green-500)">
            <Crown className="size-3.5" />
            Ganador
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-white/80 px-4 py-3">
          <p className="text-(--gray-500)">Supervivientes</p>
          <p className="mt-1 text-lg font-bold text-(--gray-900)">
            {summary?.alive?.length ?? 0}
          </p>
        </div>
        <div className="rounded-xl bg-white/80 px-4 py-3">
          <p className="text-(--gray-500)">Derrotados</p>
          <p className="mt-1 text-lg font-bold text-(--gray-900)">
            {summary?.defeated?.length ?? 0}
          </p>
        </div>
      </div>
    </section>
  );
}

export function BattleResultPage() {
  const navigate = useNavigate();
  const teams = useTeamsStore((store) => store.teams);
  const battleSelection = useTeamsStore((store) => store.battleSelection);
  const battleResult = useBattleStore((store) => store.battleResult);
  const resetBattle = useBattleStore((store) => store.resetBattle);

  const teamA = useMemo(
    () => teams.find((team) => team.id === battleSelection.teamAId) ?? null,
    [battleSelection.teamAId, teams],
  );

  const teamB = useMemo(
    () => teams.find((team) => team.id === battleSelection.teamBId) ?? null,
    [battleSelection.teamBId, teams],
  );

  const winnerTeam = battleResult?.winner === "A" ? teamA : teamB;
  const loserTeam = battleResult?.winner === "A" ? teamB : teamA;
  const winnerSummary =
    battleResult?.winner === "A"
      ? battleResult?.summary?.teamA
      : battleResult?.summary?.teamB;
  const loserSummary =
    battleResult?.winner === "A"
      ? battleResult?.summary?.teamB
      : battleResult?.summary?.teamA;

  const handleBackToSetup = () => {
    resetBattle();
    navigate("/battle");
  };

  const handleRematch = () => {
    resetBattle();
    navigate("/battle/play");
  };

  if (!battleResult || !teamA || !teamB) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-(--gray-200) bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-(--gray-900)">
            No hay resultado disponible
          </h1>
          <p className="mt-2 text-sm text-(--gray-500)">
            Completa un combate antes de consultar esta pantalla.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate("/battle")}>Ir a selección</Button>
            <Button variant="outline" onClick={() => navigate("/battle/play")}>
              Volver al combate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-3xl border border-(--gray-200) bg-white p-6 shadow-sm md:p-8">
        <img
          src={confettiImage}
          alt="Confeti"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
        />

        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-(--green-500)/10 px-3 py-1 text-xs font-semibold text-(--green-500)">
              <ShieldCheck className="size-3.5" />
              Combate finalizado
            </p>

            <h1 className="mt-4 text-3xl font-black text-(--gray-900) md:text-4xl">
              {winnerTeam.name} gana el combate
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-(--gray-600) md:text-base">
              {winnerTeam.name} se impone a {loserTeam?.name} tras{" "}
              {battleResult.rounds.length} turnos. Aquí tienes el resumen final
              de la batalla y el estado de ambos equipos.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" onClick={handleRematch}>
                <RotateCcw className="size-4" />
                Revancha
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToSetup}
              >
                <Swords className="size-4" />
                Nueva selección
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-3xl bg-linear-to-br from-(--blue-50) to-white p-6 shadow-inner">
              <img
                src={trophyImage}
                alt="Trofeo del equipo ganador"
                className="mx-auto h-56 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <TeamSummaryCard
          title="Equipo ganador"
          team={winnerTeam}
          isWinner
          summary={winnerSummary}
        />
        <TeamSummaryCard
          title="Equipo rival"
          team={loserTeam}
          isWinner={false}
          summary={loserSummary}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-(--gray-200) bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-(--gray-900)">
            Supervivientes de {winnerTeam.name}
          </h2>
          <p className="mt-1 text-sm text-(--gray-500)">
            Pokémon que terminaron el combate en pie.
          </p>
          <div className="mt-4">
            <PokemonRoster
              pokemons={winnerSummary?.alive}
              tone="winner"
              emptyLabel="No quedaron supervivientes."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-(--gray-200) bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-(--gray-900)">
            Derrotados de {loserTeam.name}
          </h2>
          <p className="mt-1 text-sm text-(--gray-500)">
            Pokémon que cayeron durante el combate.
          </p>
          <div className="mt-4">
            <PokemonRoster
              pokemons={loserSummary?.defeated}
              tone="loser"
              emptyLabel="No hubo derrotados en este equipo."
            />
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-(--gray-200) bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-(--gray-900)">
          Resumen por turnos
        </h2>
        <p className="mt-1 text-sm text-(--gray-500)">
          Secuencia completa de los enfrentamientos individuales.
        </p>

        <div className="mt-5 space-y-3">
          {battleResult.rounds.map((round) => {
            const winnerLabel = winnerTeam?.pokemons?.some(
              (pokemon) => pokemon.id === round.winner.id,
            )
              ? winnerTeam.name
              : loserTeam?.name;

            return (
              <article
                key={round.round}
                className="rounded-xl border border-(--gray-200) bg-(--gray-50) p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-(--gray-500)">
                    Turno {round.round}
                  </p>
                  <p className="inline-flex items-center gap-1 text-xs font-medium text-(--gray-500)">
                    <Swords className="size-3.5" />
                    {round.attackerA.name} vs {round.attackerB.name}
                  </p>
                </div>

                <p className="mt-2 text-sm text-(--gray-800)">
                  <span className="font-semibold capitalize text-(--gray-900)">
                    {round.winner.name}
                  </span>{" "}
                  derrotó a{" "}
                  <span className="font-semibold capitalize text-(--gray-900)">
                    {round.loser.name}
                  </span>
                  .
                </p>

                <p className="mt-2 text-xs font-medium text-(--gray-500)">
                  Punto para {winnerLabel}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default BattleResultPage;
