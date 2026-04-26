import { Swords } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamsStore } from "@/features/teams/teams.store";

function TeamPreview({ team, title }) {
  return (
    <div className="rounded-xl border border-(--gray-200) bg-white p-4">
      <p className="text-sm font-semibold text-(--gray-700)">{title}</p>
      <p className="mt-1 text-sm font-medium text-(--gray-900)">
        {team?.name || "Sin selección"}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, index) => {
          const pokemon = team?.pokemons?.[index];

          return (
            <div
              key={index}
              className="aspect-square rounded-lg border border-(--gray-200) bg-(--gray-50)"
            >
              {pokemon ? (
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BattleSetupPage() {
  const navigate = useNavigate();
  const teams = useTeamsStore((store) => store.teams);
  const storedSelection = useTeamsStore((store) => store.battleSelection);
  const selectBattleTeams = useTeamsStore((store) => store.selectBattleTeams);
  const canBattle = useTeamsStore((store) => store.canBattle);

  const [teamAId, setTeamAId] = useState(storedSelection.teamAId ?? "");
  const [teamBId, setTeamBId] = useState(storedSelection.teamBId ?? "");

  const selectedTeamA = useMemo(
    () => teams.find((team) => team.id === teamAId) ?? null,
    [teamAId, teams],
  );

  const selectedTeamB = useMemo(
    () => teams.find((team) => team.id === teamBId) ?? null,
    [teamBId, teams],
  );

  const isBattleReady = canBattle(teamAId || null, teamBId || null);

  const handleSelectTeamA = (nextId) => {
    setTeamAId(nextId);
    selectBattleTeams(nextId || null, teamBId || null);
  };

  const handleSelectTeamB = (nextId) => {
    setTeamBId(nextId);
    selectBattleTeams(teamAId || null, nextId || null);
  };

  const handleStartBattle = () => {
    if (!isBattleReady) {
      toast.error("Selecciona dos equipos válidos para iniciar el combate");
      return;
    }

    navigate("/battle/play");
  };

  if (!teams.length) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-(--gray-200) bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-(--gray-900)">
            Seleccionar equipos para el combate
          </h1>
          <p className="mt-2 text-sm text-(--gray-500)">
            Necesitas crear al menos un equipo antes de empezar un combate.
          </p>
          <Button className="mt-6" onClick={() => navigate("/teams")}>
            Ir a mis equipos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold text-(--gray-900)">
        Seleccionar equipos para el combate
      </h1>

      <div className="rounded-2xl border border-(--gray-200) bg-white p-5 shadow-sm md:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-(--gray-700)">Equipo 1</p>
            <Select value={teamAId} onValueChange={handleSelectTeamA}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-(--gray-700)">Equipo 2</p>
            <Select value={teamBId} onValueChange={handleSelectTeamB}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Selecciona un equipo" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <TeamPreview team={selectedTeamA} title="Equipo 1" />

          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-(--gray-200) bg-(--gray-50) text-(--gray-500)">
            <Swords className="size-5" />
          </div>

          <TeamPreview team={selectedTeamB} title="Equipo 2" />
        </div>

        <Button
          type="button"
          className="mt-6 h-12 w-full bg-(--blue-500) text-base font-semibold hover:bg-(--blue-600)"
          onClick={handleStartBattle}
          disabled={!isBattleReady}
        >
          Comenzar combate
        </Button>
      </div>
    </div>
  );
}

export default BattleSetupPage;
