import {
  ArrowRight,
  Bolt,
  History,
  LayoutGrid,
  Plus,
  Sparkles,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBattleStore } from "@/features/battle/battle.store";
import { TeamCard } from "@/features/teams/components/TeamCard";
import { useTeamsStore } from "@/features/teams/teams.store";

const RECENT_HISTORY_LIMIT = 5;

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

export default function HomePage() {
  const navigate = useNavigate();
  const teams = useTeamsStore((s) => s.teams);
  const draftTeam = useTeamsStore((s) => s.draftTeam);
  const startDraft = useTeamsStore((s) => s.startDraft);
  const selectBattleTeams = useTeamsStore((s) => s.selectBattleTeams);
  const history = useBattleStore((s) => s.history);

  const hasDraft =
    Boolean(draftTeam?.name?.trim()) || (draftTeam?.pokemons?.length ?? 0) > 0;

  const totalPokemons = teams.reduce(
    (acc, team) => acc + (team.pokemons?.length ?? 0),
    0,
  );

  const recentTeams = [...teams]
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
    .slice(0, 3);

  const recentBattles = useMemo(
    () => history.slice(0, RECENT_HISTORY_LIMIT),
    [history],
  );

  const lastBattle = history[0] ?? null;
  const lastBattleParticipants = getBattleParticipants(lastBattle);
  const canRematch =
    Boolean(lastBattle) &&
    teams.some((t) => t.id === lastBattle.teamA.id) &&
    teams.some((t) => t.id === lastBattle.teamB.id);

  const handleRematch = () => {
    if (!lastBattle || !canRematch) return;
    selectBattleTeams(lastBattle.teamA.id, lastBattle.teamB.id);
    navigate("/battle/play");
  };

  const isEmpty = teams.length === 0 && !hasDraft && history.length === 0;

  const handleCreateTeam = () => {
    startDraft();
    navigate("/teams/new");
  };

  const handleEditTeam = (team) => {
    if (!team?.id) return;
    startDraft(team);
    navigate(`/teams/${team.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-[2rem] p-8 shadow-sm md:p-12"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--blue-50) 0%, #ffffff 50%, #fff1f1 100%)",
        }}
      >
        {/* Resplandores suaves */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-(--blue-100) opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-(--red-500)/15 blur-3xl" />

        <BattleIllustration className="pointer-events-none absolute right-2 top-1/2 h-64 w-[440px] -translate-y-1/2" />

        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-(--blue-100) bg-white/80 px-3 py-1 text-xs font-semibold text-(--blue-600) backdrop-blur">
            <Sparkles className="size-3.5" />
            Bienvenido a PokeBattle
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-(--gray-900) md:text-5xl">
            Prepara tu equipo y{" "}
            <span className="text-(--blue-600)">domina el combate</span>
          </h1>
          <p className="mt-3 max-w-md text-base leading-7 text-(--gray-600)">
            Crea alineaciones, compara estrategias y enfrenta a otros
            entrenadores en batallas rápidas por turnos.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navigate("/battle")}
              className="h-12 gap-2 bg-(--blue-500) px-6 text-base font-semibold text-white shadow-md hover:bg-(--blue-600)"
            >
              <Swords className="size-4" />
              Iniciar combate
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/teams")}
              className="h-12 gap-2 border-(--gray-200) bg-white px-6 text-base font-semibold text-(--gray-700) hover:bg-(--gray-50)"
            >
              <LayoutGrid className="size-4" />
              Ver mis equipos
            </Button>
          </div>
        </div>
      </section>

      {/* Continuar borrador */}
      {hasDraft ? (
        <button
          type="button"
          onClick={() => navigate(`/teams/${draftTeam.id ? "new" : "new"}`)}
          className="group flex w-full items-center justify-between rounded-2xl border border-(--blue-200) bg-(--blue-50) p-5 text-left transition-colors hover:bg-(--blue-100)"
        >
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white shadow-sm">
              <Bolt className="size-5 text-(--blue-600)" />
            </div>
            <div>
              <p className="text-sm font-semibold text-(--gray-900)">
                Termina tu equipo en borrador
                {draftTeam.name?.trim() ? `: ${draftTeam.name}` : ""}
              </p>
              <p className="text-xs text-(--gray-600)">
                {draftTeam.pokemons?.length ?? 0}/6 pokémon añadidos — continúa
                donde lo dejaste.
              </p>
            </div>
          </div>
          <ArrowRight className="size-4 text-(--blue-600) transition-transform group-hover:translate-x-1" />
        </button>
      ) : null}

      {/* Último combate (revancha) */}
      {lastBattle && lastBattleParticipants ? (
        <section className="rounded-2xl border border-(--gray-200) bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-11 items-center justify-center rounded-xl bg-(--amber-50) text-(--amber-600)">
                <Trophy className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-(--gray-500)">
                  Último combate · {formatRelativeTime(lastBattle.date)}
                </p>
                <p className="mt-0.5 text-sm text-(--gray-900)">
                  <span className="font-semibold text-(--gray-900)">
                    {lastBattleParticipants.winner.name || "Equipo sin nombre"}
                  </span>{" "}
                  venció a{" "}
                  <span className="font-medium text-(--gray-700)">
                    {lastBattleParticipants.loser.name || "Equipo sin nombre"}
                  </span>{" "}
                  en {lastBattle.rounds} turnos.
                </p>
              </div>
            </div>
            <Button
              onClick={handleRematch}
              disabled={!canRematch}
              className="h-10 gap-2 bg-(--blue-500) px-4 text-sm font-semibold text-white hover:bg-(--blue-600) disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Swords className="size-4" />
              Revancha
            </Button>
          </div>
          {!canRematch ? (
            <p className="mt-3 text-xs text-(--gray-500)">
              Uno de los equipos del combate ya no existe, no se puede repetir.
            </p>
          ) : null}
        </section>
      ) : null}

      {/* Stats */}
      {!isEmpty ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label="Equipos guardados"
            value={teams.length}
            tone="blue"
          />
          <StatCard
            icon={Sparkles}
            label="Pokémon en tus equipos"
            value={totalPokemons}
            tone="red"
          />
          <StatCard
            icon={Swords}
            label="Combates jugados"
            value={history.length}
            tone="amber"
          />
        </section>
      ) : null}

      {/* Últimos equipos */}
      {recentTeams.length > 0 ? (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-(--gray-900)">
                Últimos equipos
              </h2>
              <p className="text-sm text-(--gray-500)">
                Retoma rápidamente los que has editado hace poco.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/teams")}
              className="text-xs font-medium text-(--blue-600) hover:text-(--blue-700)"
            >
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentTeams.map((team, index) => (
              <TeamCard
                key={team.id}
                title={team.name || `Equipo ${index + 1}`}
                pokemons={team.pokemons}
                onClick={() => handleEditTeam(team)}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* Historial reciente */}
      {recentBattles.length > 0 ? (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-(--gray-900)">
                Historial reciente
              </h2>
              <p className="text-sm text-(--gray-500)">
                Últimos combates jugados.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/battle-history")}
              className="text-xs font-medium text-(--blue-600) hover:text-(--blue-700)"
            >
              Ver todos →
            </button>
          </div>

          <Card className="rounded-2xl border-(--gray-200) bg-white shadow-sm">
            <CardContent className="px-0 py-0">
              <ul className="divide-y divide-(--gray-100)">
                {recentBattles.map((battle) => (
                  <BattleHistoryRow key={battle.id} battle={battle} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {/* Estado vacío */}
      {isEmpty ? (
        <section className="rounded-[1.75rem] border border-dashed border-(--gray-300) bg-white p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-(--blue-50)">
            <Plus className="size-6 text-(--blue-600)" />
          </div>
          <p className="mt-4 text-lg font-semibold text-(--gray-900)">
            Empieza creando tu primer equipo
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-(--gray-500)">
            Elige hasta 6 pokémon, ponle nombre y estará listo para entrar en
            combate.
          </p>
          <Button
            onClick={handleCreateTeam}
            className="mt-6 h-10 gap-2 bg-(--blue-500) hover:bg-(--blue-600)"
          >
            <Plus className="size-4" />
            Crear mi primer equipo
          </Button>
        </section>
      ) : null}
    </div>
  );
}

const TONE_STYLES = {
  blue: "bg-(--blue-50) text-(--blue-600)",
  red: "bg-(--red-50) text-(--red-500)",
  amber: "bg-(--amber-50) text-(--amber-600)",
};

function BattleIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 440 280"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="clash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="1" />
          <stop offset="55%" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ball-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="ball-blue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Líneas de movimiento (suaves) */}
      <g stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <line x1="30" y1="110" x2="75" y2="110" />
        <line x1="15" y1="160" x2="80" y2="160" />
        <line x1="35" y1="205" x2="85" y2="205" />
        <line x1="360" y1="110" x2="410" y2="110" />
        <line x1="355" y1="160" x2="425" y2="160" />
        <line x1="365" y1="205" x2="415" y2="205" />
      </g>

      {/* Pokéball izquierda (azul) */}
      <g transform="translate(70 60)" filter="url(#soft-shadow)">
        <circle cx="80" cy="80" r="80" fill="#fff" />
        <path d="M0 80a80 80 0 01160 0H0z" fill="url(#ball-blue)" />
        <rect x="0" y="75" width="160" height="10" fill="#1f2937" />
        <circle cx="80" cy="80" r="22" fill="#fff" stroke="#1f2937" strokeWidth="4" />
        <circle cx="80" cy="80" r="10" fill="#e5e7eb" stroke="#1f2937" strokeWidth="2" />
        {/* brillo */}
        <ellipse cx="55" cy="40" rx="18" ry="10" fill="#fff" opacity="0.6" />
      </g>

      {/* Choque central */}
      <circle cx="220" cy="140" r="95" fill="url(#clash)" />
      <g transform="translate(195 95)">
        <path
          d="M30 0 L0 50 L18 50 L8 90 L52 35 L34 35 Z"
          fill="#fde047"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>
      <g fill="#fbbf24">
        <circle cx="160" cy="75" r="3" />
        <circle cx="285" cy="85" r="3.5" />
        <circle cx="170" cy="210" r="3.5" />
        <circle cx="275" cy="205" r="3" />
      </g>

      {/* Pokéball derecha (roja) */}
      <g transform="translate(210 60)" filter="url(#soft-shadow)">
        <circle cx="80" cy="80" r="80" fill="#fff" />
        <path d="M0 80a80 80 0 01160 0H0z" fill="url(#ball-red)" />
        <rect x="0" y="75" width="160" height="10" fill="#1f2937" />
        <circle cx="80" cy="80" r="22" fill="#fff" stroke="#1f2937" strokeWidth="4" />
        <circle cx="80" cy="80" r="10" fill="#e5e7eb" stroke="#1f2937" strokeWidth="2" />
        <ellipse cx="55" cy="40" rx="18" ry="10" fill="#fff" opacity="0.6" />
      </g>
    </svg>
  );
}

function BattleHistoryRow({ battle }) {
  const participants = getBattleParticipants(battle);
  if (!participants) return null;

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-(--gray-50) text-(--gray-500)">
          <History className="size-4" />
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
          <p className="text-xs text-(--gray-500)">
            {battle.rounds} turnos · {formatRelativeTime(battle.date)}
          </p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-(--amber-50) px-2.5 py-1 text-xs font-semibold text-(--amber-600)">
        <Trophy className="size-3" />
        Victoria
      </span>
    </li>
  );
}

function StatCard({ icon: Icon, label, value, tone = "blue" }) {
  return (
    <Card className="rounded-2xl border-(--gray-200) bg-white py-5 shadow-sm">
      <CardContent className="flex items-center gap-4 px-5">
        <div
          className={`flex size-11 items-center justify-center rounded-xl ${TONE_STYLES[tone]}`}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-(--gray-900)">{value}</p>
          <p className="text-xs text-(--gray-500)">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
