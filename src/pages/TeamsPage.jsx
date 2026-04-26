import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { TeamCard } from "@/features/teams/components/TeamCard";
import { useTeamsStore } from "@/features/teams/teams.store";

export default function TeamsPage() {
  const navigate = useNavigate();
  const teams = useTeamsStore((s) => s.teams);
  const startDraft = useTeamsStore((s) => s.startDraft);

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
    <div className="mx-auto max-w-176">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-(--gray-900)">Mis equipos</h1>
          <p className="mt-2 text-base leading-7 text-(--gray-500)">
            Revisa tus equipos guardados, compara alineaciones y entra en
            edición cuando quieras ajustar la estrategia.
          </p>
        </div>

        <Button
          onClick={handleCreateTeam}
          className="h-11 px-5 text-base bg-(--blue-500) hover:bg-(--blue-600)"
        >
          + Nuevo equipo
        </Button>
      </div>

      {!teams.length ? (
        <div className="rounded-[1.75rem] border border-dashed border-(--gray-300) bg-(--gray-50) p-12 text-center">
          <p className="text-lg font-semibold text-(--gray-900)">
            Aún no hay equipos guardados.
          </p>
          <p className="mt-2 text-base leading-7 text-(--gray-500)">
            Crea tu primer equipo para empezar a preparar alineaciones y
            enfrentamientos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {teams.map((team, index) => (
            <TeamCard
              key={team.id}
              title={team.name || `Equipo ${index + 1}`}
              pokemons={team.pokemons}
              onClick={() => handleEditTeam(team)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
