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
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-(--gray-900)">Mis equipos</h1>

        <Button
          onClick={handleCreateTeam}
          className="h-10 px-4 bg-(--blue-500) hover:bg-(--blue-600)"
        >
          + Nuevo equipo
        </Button>
      </div>

      {!teams.length ? (
        <div className="rounded-xl border border-dashed border-(--gray-300) bg-(--gray-50) p-10 text-center text-(--gray-500)">
          Aún no hay equipos guardados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
