import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { TeamCard } from "@/features/teams/components/TeamCard";
import { useTeamsStore } from "@/features/teams/teams.store";

export default function TeamsPage() {
  const navigate = useNavigate();
  const savedTeamA = useTeamsStore((s) => s.savedTeamA);
  const savedTeamB = useTeamsStore((s) => s.savedTeamB);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-(--gray-900)">Mis equipos</h1>

        <Button
          onClick={() => navigate("/teams/new")}
          className="h-10 px-4 bg-(--blue-500) hover:bg-(--blue-600)"
        >
          + Nuevo equipo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TeamCard title="Equipo 1" pokemons={savedTeamA} />
        <TeamCard title="Equipo 2" pokemons={savedTeamB} />
      </div>
    </div>
  );
}
