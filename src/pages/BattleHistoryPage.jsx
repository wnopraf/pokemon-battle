import { History, Swords, Trash2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBattleStore } from "@/features/battle/battle.store";
import { useTeamsStore } from "@/features/teams/teams.store";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "ahora mismo";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return new Date(timestamp).toLocaleDateString();
}

function getBattleParticipants(entry) {
  if (!entry) return null;
  const winner = entry.winner === "A" ? entry.teamA : entry.teamB;
  const loser = entry.winner === "A" ? entry.teamB : entry.teamA;
  return { winner, loser };
}

function computeStats(history) {
  if (history.length === 0) return null;

  const totalRounds = history.reduce((acc, b) => acc + (b.rounds ?? 0), 0);
  const averageRounds = Math.round(totalRounds / history.length);

  const winsByTeam = new Map();
  history.forEach((battle) => {
    const winner = battle.winner === "A" ? battle.teamA : battle.teamB;
    if (!winner.id) return;
    const current = winsByTeam.get(winner.id) ?? {
      id: winner.id,
      name: winner.name,
      wins: 0,
    };
    current.wins += 1;
    current.name = winner.name || current.name;
    winsByTeam.set(winner.id, current);
  });

  const topTeam = [...winsByTeam.values()].sort((a, b) => b.wins - a.wins)[0];

  return {
    total: history.length,
    averageRounds,
    topTeam: topTeam ?? null,
  };
}

export default function BattleHistoryPage() {
  const navigate = useNavigate();
  const history = useBattleStore((s) => s.history);
  const clearHistory = useBattleStore((s) => s.clearHistory);
  const teams = useTeamsStore((s) => s.teams);
  const selectBattleTeams = useTeamsStore((s) => s.selectBattleTeams);

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const stats = useMemo(() => computeStats(history), [history]);

  const teamIdsSet = useMemo(
    () => new Set(teams.map((team) => team.id)),
    [teams],
  );

  const canRematch = (battle) =>
    teamIdsSet.has(battle.teamA.id) && teamIdsSet.has(battle.teamB.id);

  const handleRematch = (battle) => {
    if (!canRematch(battle)) return;
    selectBattleTeams(battle.teamA.id, battle.teamB.id);
    navigate("/battle/play");
  };

  const handleConfirmClear = () => {
    clearHistory();
    setIsClearDialogOpen(false);
  };

  if (history.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-(--gray-900) md:text-3xl">
            Historial de combates
          </h1>
          <p className="mt-1 text-sm text-(--gray-500)">
            Aquí verás todos los combates jugados.
          </p>
        </header>

        <section className="rounded-2xl border border-dashed border-(--gray-300) bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-(--blue-50)">
            <Swords className="size-6 text-(--blue-600)" />
          </div>
          <p className="mt-4 text-lg font-semibold text-(--gray-900)">
            Aún no has jugado ningún combate
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--gray-500)">
            Cuando enfrentes a dos equipos, el resultado quedará guardado aquí.
          </p>
          <Button
            onClick={() => navigate("/battle")}
            className="mt-6 h-10 gap-2 bg-(--blue-500) hover:bg-(--blue-600)"
          >
            <Swords className="size-4" />
            Iniciar un combate
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--gray-900) md:text-3xl">
            Historial de combates
          </h1>
          <p className="mt-1 text-sm text-(--gray-500)">
            {stats.total} combates registrados.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsClearDialogOpen(true)}
          className="h-10 gap-2 border-(--gray-200) text-(--gray-700) hover:bg-(--gray-50)"
        >
          <Trash2 className="size-4" />
          Limpiar historial
        </Button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Swords}
          label="Combates totales"
          value={stats.total}
          tone="blue"
        />
        <StatCard
          icon={History}
          label="Turnos por combate (media)"
          value={stats.averageRounds}
          tone="amber"
        />
        <StatCard
          icon={Trophy}
          label="Equipo con más victorias"
          value={
            stats.topTeam
              ? `${stats.topTeam.name || "Sin nombre"} · ${stats.topTeam.wins}`
              : "—"
          }
          tone="red"
        />
      </section>

      <section>
        <Card className="rounded-2xl border-(--gray-200) bg-white shadow-sm">
          <CardContent className="px-0 py-0">
            <ul className="divide-y divide-(--gray-100)">
              {history.map((battle) => {
                const participants = getBattleParticipants(battle);
                if (!participants) return null;
                const rematchAvailable = canRematch(battle);

                return (
                  <li
                    key={battle.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--amber-50) text-(--amber-600)">
                        <Trophy className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm text-(--gray-900)">
                          <span className="font-semibold">
                            {participants.winner.name || "Equipo sin nombre"}
                          </span>
                          <span className="mx-1.5 text-(--gray-400)">vs</span>
                          <span className="text-(--gray-700)">
                            {participants.loser.name || "Equipo sin nombre"}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-(--gray-500)">
                          {battle.rounds} turnos ·{" "}
                          {formatRelativeTime(battle.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => handleRematch(battle)}
                        disabled={!rematchAvailable}
                        className="h-9 gap-2 border-(--gray-200) text-xs font-semibold text-(--gray-700) hover:bg-(--gray-50) disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Swords className="size-3.5" />
                        Revancha
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </section>

      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Borrar el historial?</DialogTitle>
            <DialogDescription>
              Se eliminarán todos los combates guardados. Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsClearDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmClear}
              className="bg-(--red-500) text-white hover:bg-(--red-600)"
            >
              Borrar historial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const TONE_STYLES = {
  blue: "bg-(--blue-50) text-(--blue-600)",
  red: "bg-(--red-50) text-(--red-500)",
  amber: "bg-(--amber-50) text-(--amber-600)",
};

function StatCard({ icon: Icon, label, value, tone = "blue" }) {
  return (
    <Card className="rounded-2xl border-(--gray-200) bg-white py-5 shadow-sm">
      <CardContent className="flex items-center gap-4 px-5">
        <div
          className={`flex size-11 items-center justify-center rounded-xl ${TONE_STYLES[tone]}`}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-2xl font-bold text-(--gray-900)">
            {value}
          </p>
          <p className="truncate text-xs text-(--gray-500)">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
