import { toast } from "sonner";

import { useTeamsStore } from "@/features/teams/teams.store";

export function useDraftSaveWithFeedback() {
  const draftTeam = useTeamsStore((store) => store.draftTeam);
  const saveDraft = useTeamsStore((store) => store.saveDraft);

  const canSaveDraft =
    Boolean(draftTeam?.name?.trim()) && (draftTeam?.pokemons?.length ?? 0) > 0;

  const saveWithFeedback = () => {
    if (!draftTeam?.name?.trim()) {
      toast.error("Por favor, introduce un nombre para el equipo");
      return false;
    }

    if (!draftTeam?.pokemons?.length) {
      toast.error("Por favor, añade al menos un Pokémon al equipo");
      return false;
    }

    saveDraft();
    toast.success("Equipo guardado correctamente");

    return true;
  };

  return {
    canSaveDraft,
    saveWithFeedback,
  };
}
