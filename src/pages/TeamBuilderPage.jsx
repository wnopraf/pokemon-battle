import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PokemonSlot } from "../features/teams/components/PokemonSlot";
import { useTeamsStore } from "../features/teams/teams.store";

export function TeamBuilderPage() {
  const [teamName, setTeamName] = useState("");
  const draftTeamA = useTeamsStore((state) => state.draftTeamA);
  const removePokemon = useTeamsStore((state) => state.removePokemon);
  const saveTeams = useTeamsStore((state) => state.saveTeams);

  const handleAddPokemon = () => {
    // TODO: Open Pokemon search modal
    console.log("Open Pokemon search");
  };

  const handleRemovePokemon = (index) => {
    removePokemon("A", draftTeamA[index].id);
  };

  const handleSaveTeam = () => {
    if (!teamName.trim()) {
      alert("Por favor, introduce un nombre para el equipo");
      return;
    }
    if (draftTeamA.length === 0) {
      alert("Por favor, añade al menos un Pokémon al equipo");
      return;
    }
    saveTeams();
    alert("Equipo guardado correctamente");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">
          Crear equipo
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[var(--gray-200)]">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div className="w-full">
            <label
              htmlFor="teamName"
              className="block text-sm font-semibold text-[var(--gray-900)] mb-3"
            >
              Nombre del equipo
            </label>
            <Input
              id="teamName"
              type="text"
              placeholder="Ej: Equipo Fuego"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full h-12 text-base border-(--gray-300) focus-visible:ring-(--blue-500)"
            />
          </div>
          <div className="text-sm font-semibold text-[var(--gray-500)] whitespace-nowrap">
            {draftTeamA.length}/6
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <PokemonSlot
                key={index}
                pokemon={draftTeamA[index]}
                onClick={handleAddPokemon}
                onRemove={handleRemovePokemon}
                index={index}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleSaveTeam}
          size="lg"
          className="w-full h-12 text-base font-semibold bg-[var(--blue-500)] hover:bg-[var(--blue-600)]"
        >
          Guardar equipo
        </Button>
      </div>
    </div>
  );
}
