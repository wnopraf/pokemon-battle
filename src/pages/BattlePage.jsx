import { CircleDot, Crown, Shield, Swords } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { simulateBattle } from "@/features/battle/battle.logic";
import { useBattleStore } from "@/features/battle/battle.store";
import { useTeamsStore } from "@/features/teams/teams.store";
import { cn } from "@/lib/utils";

const ROUND_REVEAL_MS = 1200;

function buildLiveSummary({ teamA, teamB, rounds, visibleRounds }) {
  const initialA = teamA?.pokemons?.length ?? 0;
  const initialB = teamB?.pokemons?.length ?? 0;

  let defeatedA = 0;
  let defeatedB = 0;

  rounds.slice(0, visibleRounds).forEach((round) => {
    const loserId = round?.loser?.id;
    const loserInA = teamA?.pokemons?.some((pokemon) => pokemon.id === loserId);

    if (loserInA) {
      defeatedA += 1;
    } else {
      defeatedB += 1;
    }
  });

  return {
    aliveA: Math.max(0, initialA - defeatedA),
    aliveB: Math.max(0, initialB - defeatedB),
    defeatedA,
    defeatedB,
  };
}

export function BattlePage() {
  const navigate = useNavigate();
  const teams = useTeamsStore((store) => store.teams);
  const battleSelection = useTeamsStore((store) => store.battleSelection);
  const battleResult = useBattleStore((store) => store.battleResult);
  const setBattleResult = useBattleStore((store) => store.setBattleResult);
  const resetBattle = useBattleStore((store) => store.resetBattle);
  const recordBattle = useBattleStore((store) => store.recordBattle);

  const [roundPlayback, setRoundPlayback] = useState({
    battleId: null,
    visibleRounds: 0,
  });

  const teamA = useMemo(
    () => teams.find((team) => team.id === battleSelection.teamAId) ?? null,
    [battleSelection.teamAId, teams],
  );

  const teamB = useMemo(
    () => teams.find((team) => team.id === battleSelection.teamBId) ?? null,
    [battleSelection.teamBId, teams],
  );

  const rounds = useMemo(() => battleResult?.rounds ?? [], [battleResult]);
  const battleId = `${teamA?.id ?? "none"}-${teamB?.id ?? "none"}-${rounds.length}`;

  const recordedSignatureRef = useRef(null);

  useEffect(() => {
    if (!teamA?.pokemons?.length || !teamB?.pokemons?.length) {
      return;
    }

    const signature = `${teamA.id}-${teamA.updatedAt ?? ""}-${teamB.id}-${teamB.updatedAt ?? ""}`;
    if (recordedSignatureRef.current === signature) {
      return;
    }
    recordedSignatureRef.current = signature;

    const result = simulateBattle(teamA.pokemons, teamB.pokemons);
    setBattleResult(result);
    recordBattle(result, teamA, teamB);
  }, [setBattleResult, recordBattle, teamA, teamB]);

  useEffect(() => {
    if (!rounds.length) return;

    let step = 0;

    const intervalId = setInterval(() => {
      step += 1;

      setRoundPlayback({
        battleId,
        visibleRounds: Math.min(step, rounds.length),
      });

      if (step >= rounds.length) {
        clearInterval(intervalId);
      }
    }, ROUND_REVEAL_MS);

    return () => clearInterval(intervalId);
  }, [battleId, rounds]);

  const visibleRounds =
    roundPlayback.battleId === battleId ? roundPlayback.visibleRounds : 0;
  const displayedRounds = rounds.slice(0, visibleRounds);
  const isBattleFinished = rounds.length > 0 && visibleRounds >= rounds.length;

  const liveSummary = buildLiveSummary({
    teamA,
    teamB,
    rounds,
    visibleRounds,
  });

  const progress = rounds.length
    ? Math.round((displayedRounds.length / rounds.length) * 100)
    : 0;
  const winnerTeamName =
    battleResult?.winner === "A" ? teamA?.name : teamB?.name;

  if (!teamA || !teamB) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-(--gray-200) bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-(--gray-900)">
            No hay combate preparado
          </h1>
          <p className="mt-2 text-sm text-(--gray-500)">
            Selecciona dos equipos antes de iniciar la retransmisión del
            combate.
          </p>
          <Button className="mt-6" onClick={() => navigate("/battle")}>
            Ir a selección de equipos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-2xl border border-(--gray-200) bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-(--gray-900)">
              Combate en curso
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-(--blue-50) px-3 py-1 text-xs font-semibold text-(--blue-600)">
              <CircleDot className="size-3" />
              {isBattleFinished ? "Finalizado" : "En directo"}
            </span>
          </div>

          <div className="mb-4 grid gap-3 rounded-xl border border-(--gray-200) bg-(--gray-50) p-3 text-sm md:grid-cols-2">
            <div>
              <p className="font-semibold text-(--gray-800)">{teamA.name}</p>
              <p className="text-(--gray-500)">
                {liveSummary.aliveA} vivos · {liveSummary.defeatedA} KO
              </p>
            </div>
            <div>
              <p className="font-semibold text-(--gray-800)">{teamB.name}</p>
              <p className="text-(--gray-500)">
                {liveSummary.aliveB} vivos · {liveSummary.defeatedB} KO
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {displayedRounds.length ? (
              displayedRounds.map((round) => {
                const winnerInA = teamA.pokemons.some(
                  (pokemon) => pokemon.id === round.winner.id,
                );

                return (
                  <article
                    key={round.round}
                    className={cn(
                      "animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-(--gray-200) bg-white p-4 duration-500",
                      round.round === displayedRounds.length && "shadow-sm",
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--gray-500)">
                        Turno {round.round}
                      </p>
                      <p className="inline-flex items-center gap-1 text-xs font-medium text-(--gray-500)">
                        <Swords className="size-3.5" />
                        {round.attackerA.name} vs {round.attackerB.name}
                      </p>
                    </div>

                    <p className="text-sm text-(--gray-800)">
                      <span className="font-semibold capitalize text-(--gray-900)">
                        {round.winner.name}
                      </span>{" "}
                      derrota a{" "}
                      <span className="font-semibold capitalize text-(--gray-900)">
                        {round.loser.name}
                      </span>
                      .
                    </p>

                    <p
                      className={cn(
                        "mt-2 text-xs font-medium",
                        winnerInA ? "text-(--red-500)" : "text-(--blue-500)",
                      )}
                    >
                      Punto para {winnerInA ? teamA.name : teamB.name}
                    </p>
                  </article>
                );
              })
            ) : (
              <div className="rounded-xl border border-dashed border-(--gray-300) bg-(--gray-50) px-4 py-8 text-center text-sm text-(--gray-500)">
                Preparando retransmisión...
              </div>
            )}
          </div>
        </section>

        <aside className="rounded-2xl border border-(--gray-200) bg-white p-5 shadow-sm md:p-6">
          <p className="text-sm font-semibold text-(--gray-900)">Progreso</p>
          <p className="mt-1 text-xs text-(--gray-500)">
            {displayedRounds.length} de {rounds.length || 0} turnos
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-(--gray-200)">
            <div
              className="h-full rounded-full bg-(--blue-500) transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {isBattleFinished ? (
            <div className="mt-6 rounded-xl border border-(--green-500)/30 bg-(--green-500)/10 p-4">
              <p className="inline-flex items-center gap-1 text-sm font-semibold text-(--green-500)">
                <Crown className="size-4" />
                Victoria de {winnerTeamName}
              </p>
              <p className="mt-1 text-xs text-(--gray-600)">
                El combate terminó. Puedes ver el resumen o iniciar otro.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-(--yellow-500)/30 bg-(--yellow-500)/10 p-4">
              <p className="inline-flex items-center gap-1 text-sm font-semibold text-(--yellow-500)">
                <Shield className="size-4" />
                Combate en progreso
              </p>
              <p className="mt-1 text-xs text-(--gray-600)">
                La retransmisión avanza turno a turno automáticamente.
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-2">
            <Button
              type="button"
              onClick={() => navigate("/battle/result")}
              disabled={!isBattleFinished}
            >
              Ver resultado
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetBattle();
                navigate("/battle");
              }}
            >
              Nuevo combate
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BattlePage;
