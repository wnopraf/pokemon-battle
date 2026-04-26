import { useEffect, useMemo, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PokeSearch,
  PokeSearchModal,
} from "@/features/pokemon/components/PokeSearch";
import { applyPokemonFilters } from "@/features/pokemon/pokemon.logic";
import { PokemonFeatureProvider } from "@/features/pokemon/providers";
import { PokemonSlot } from "@/features/teams/components/PokemonSlot";
import { useDraftSaveWithFeedback } from "@/features/teams/hooks/useDraftSaveWithFeedback";
import { useTeamsStore } from "@/features/teams/teams.store";

import { PokemonConfirmStep } from "./PokemonConfirmStep";
import { PokemonDetailStep } from "./PokemonDetailStep";
import { useTeamBuilderFlow } from "./useTeamBuilderFlow";

const EMPTY_POKEMONS = [];

export function TeamBuilderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const draftTeam = useTeamsStore((s) => s.draftTeam);
  const removePokemon = useTeamsStore((s) => s.removePokemon);
  const addPokemon = useTeamsStore((s) => s.addPokemon);
  const reorderDraftPokemons = useTeamsStore((s) => s.reorderDraftPokemons);
  const draftPokemonSort = useTeamsStore((s) => s.draftPokemonSort);
  const setDraftPokemonSort = useTeamsStore((s) => s.setDraftPokemonSort);
  const setDraftTeamName = useTeamsStore((s) => s.setDraftTeamName);
  const clearDraft = useTeamsStore((s) => s.clearDraft);
  const startDraft = useTeamsStore((s) => s.startDraft);
  const { canSaveDraft, saveWithFeedback } = useDraftSaveWithFeedback();
  const draftPokemons = draftTeam?.pokemons ?? EMPTY_POKEMONS;
  const slotRefs = useRef([]);
  const [dragState, setDragState] = useState({
    sourceIndex: null,
    targetIndex: null,
  });
  const [duplicatePokemonName, setDuplicatePokemonName] = useState("");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const {
    isFlowOpen,
    currentStep,
    selectedPokemonId,
    selectionContext,
    openSearch,
    goToDetail,
    goToConfirm,
    closeFlow,
    backStep,
  } = useTeamBuilderFlow();

  useEffect(() => {
    if (!draftTeam?.id) {
      startDraft();
    }
  }, [draftTeam?.id, startDraft]);

  useEffect(() => {
    if (!draftTeam?.id) return;
    if (draftPokemonSort !== "manual") {
      return;
    }

    const cleanups = Array.from({ length: 6 })
      .map((_, index) => {
        const element = slotRefs.current[index];
        if (!element) return null;

        const isOccupiedSlot = index < draftPokemons.length;

        const dropCleanup = dropTargetForElements({
          element,
          canDrop: ({ source }) => {
            return (
              source.data?.type === "team-pokemon" &&
              typeof source.data.index === "number"
            );
          },
          onDragEnter: () => {
            setDragState((current) => ({ ...current, targetIndex: index }));
          },
          onDragLeave: () => {
            setDragState((current) =>
              current.targetIndex === index
                ? { ...current, targetIndex: null }
                : current,
            );
          },
          onDrop: ({ source }) => {
            const startIndex = source.data?.index;
            if (typeof startIndex !== "number") return;

            const maxIndex = draftPokemons.length - 1;
            if (maxIndex < 0) return;

            const finishIndex = Math.min(index, maxIndex);
            if (startIndex === finishIndex) {
              setDragState({ sourceIndex: null, targetIndex: null });
              return;
            }

            reorderDraftPokemons(draftTeam.id, startIndex, finishIndex);
            setDragState({ sourceIndex: null, targetIndex: null });
          },
        });

        if (!isOccupiedSlot) {
          return dropCleanup;
        }

        return combine(
          draggable({
            element,
            getInitialData: () => ({ type: "team-pokemon", index }),
            onDragStart: () => {
              setDragState({ sourceIndex: index, targetIndex: null });
            },
            onDrop: () => {
              setDragState({ sourceIndex: null, targetIndex: null });
            },
          }),
          dropCleanup,
        );
      })
      .filter(Boolean);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [
    draftPokemonSort,
    draftPokemons,
    draftTeam?.id,
    reorderDraftPokemons,
  ]);

  const handleAddPokemon = () => {
    if (!draftTeam?.id) return;
    openSearch({ team: draftTeam.id });
  };

  const handleRemovePokemon = (pokemonId) => {
    if (!draftTeam?.id || !pokemonId) return;
    removePokemon(draftTeam.id, pokemonId);
  };

  const handleSelectPokemon = (pokemon) => {
    if (!pokemon?.id) return;
    goToDetail(pokemon.id);
  };

  const handleConfirmAdd = (pokemon) => {
    const targetTeam = selectionContext?.team || draftTeam?.id;
    if (!targetTeam) return;

    const isAlreadyInDraft = draftPokemons.some((p) => p.id === pokemon.id);
    if (isAlreadyInDraft) {
      setDuplicatePokemonName(pokemon.name);
      closeFlow();
      return;
    }

    addPokemon(targetTeam, pokemon);
    toast.success(`${pokemon.name} se añadió al equipo.`, {
      id: `pokemon-added-${pokemon.id}`,
    });
    closeFlow();
  };

  const handleDuplicateDialogOpenChange = (nextOpen) => {
    if (!nextOpen) {
      setDuplicatePokemonName("");
    }
  };

  const handleModalOpenChange = (nextOpen) => {
    if (!nextOpen) {
      closeFlow();
    }
  };

  const modalTitleByStep = {
    search: "Buscar Pokémon",
    detail: "Detalle del Pokémon",
    confirm: "Confirmar adición",
  };

  const modalDescriptionByStep = {
    search:
      "Filtra por nombre o tipo y selecciona un Pokémon para añadirlo al equipo.",
    detail: "Revisa estadísticas y tipos antes de continuar.",
    confirm: "Confirma que quieres añadir este Pokémon al equipo.",
  };

  const handleSaveTeam = () => {
    const wasSaved = saveWithFeedback();
    if (!wasSaved) return;

    navigate("/teams");
  };

  const isCreatingRoute = location.pathname === "/teams/new";
  const hasDraftChanges =
    Boolean(draftTeam?.name?.trim()) || (draftPokemons?.length ?? 0) > 0;

  const handleCancelCreation = () => {
    if (hasDraftChanges) {
      setIsCancelDialogOpen(true);
      return;
    }

    clearDraft();
    navigate("/teams");
  };

  const handleConfirmCancelDiscard = () => {
    clearDraft();
    setIsCancelDialogOpen(false);
    navigate("/teams");
  };

  const handleSaveAndExit = () => {
    const wasSaved = saveWithFeedback();
    if (!wasSaved) return;

    setIsCancelDialogOpen(false);
    navigate("/teams");
  };

  const isTeamFull = (draftTeam?.pokemons?.length ?? 0) >= 6;
  const dragStateForView =
    draftPokemonSort === "manual"
      ? dragState
      : { sourceIndex: null, targetIndex: null };

  const sortedDraftPokemons = useMemo(() => {
    if (!draftPokemons.length || draftPokemonSort === "manual") {
      return draftPokemons;
    }

    return applyPokemonFilters({
      pokemons: draftPokemons,
      search: "",
      sort: draftPokemonSort === "random" ? "" : draftPokemonSort,
      shuffle: draftPokemonSort === "random",
    });
  }, [draftPokemonSort, draftPokemons]);

  const visiblePokemons =
    draftPokemonSort === "manual" ? draftPokemons : sortedDraftPokemons;

  const renderModalStep = () => {
    if (currentStep === "detail") {
      return (
        <PokemonDetailStep
          pokemonId={selectedPokemonId}
          onBack={backStep}
          onContinue={goToConfirm}
        />
      );
    }

    if (currentStep === "confirm") {
      return (
        <PokemonConfirmStep
          pokemonId={selectedPokemonId}
          onBack={backStep}
          onConfirm={handleConfirmAdd}
        />
      );
    }

    return <PokeSearch />;
  };

  return (
    <PokemonFeatureProvider onSelectPokemon={handleSelectPokemon}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-(--gray-900)">Crear equipo</h1>
        </div>

        <div className="rounded-2xl border border-(--gray-200) bg-white p-6 shadow-xl md:p-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="w-full">
              <label
                htmlFor="teamName"
                className="mb-3 block text-sm font-semibold text-(--gray-900)"
              >
                Nombre del equipo
              </label>
              <Input
                id="teamName"
                type="text"
                placeholder="Ej: Equipo Fuego"
                value={draftTeam?.name || ""}
                onChange={(e) => setDraftTeamName(e.target.value)}
                className="h-12 w-full text-base border-(--gray-300) focus-visible:ring-(--blue-500)"
              />
            </div>
            <div className="whitespace-nowrap text-sm font-semibold text-(--gray-500)">
              {draftTeam?.pokemons?.length ?? 0}/6
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-(--gray-700)">Ordenar equipo</p>
              <Select
                value={draftPokemonSort}
                onValueChange={setDraftPokemonSort}
              >
                <SelectTrigger className="h-10 w-full sm:w-56">
                  <SelectValue placeholder="Orden manual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual (drag & drop)</SelectItem>
                  <SelectItem value="name">Nombre (A-Z)</SelectItem>
                  <SelectItem value="attack">Ataque (mayor a menor)</SelectItem>
                  <SelectItem value="random">Aleatorio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {draftPokemonSort !== "manual" ? (
              <p className="mb-3 text-xs text-(--gray-500)">
                El arrastre se desactiva mientras el orden automático está activo.
              </p>
            ) : null}

            <div className="grid grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  ref={(element) => {
                    slotRefs.current[index] = element;
                  }}
                  className={cn(
                    "rounded-xl transition-all duration-300 ease-out",
                    draftPokemonSort === "manual" &&
                      visiblePokemons[index] &&
                      "cursor-grab active:cursor-grabbing",
                    dragStateForView.sourceIndex === index &&
                      "scale-[0.97] opacity-60 shadow-2xl",
                    dragStateForView.targetIndex === index &&
                      dragStateForView.sourceIndex !== index &&
                      "border-2 border-dashed border-(--blue-300) bg-(--blue-50)",
                  )}
                >
                  <PokemonSlot
                    pokemon={visiblePokemons[index]}
                    onRemove={handleRemovePokemon}
                    isDraggable={draftPokemonSort === "manual"}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <Button
              type="button"
              onClick={handleAddPokemon}
              disabled={isTeamFull}
              variant="outline"
              className="h-11 w-full border-(--blue-300) text-(--blue-600) hover:bg-(--blue-50) hover:border-(--blue-500)"
            >
              <Plus className="size-4" />
              {isTeamFull ? "Equipo completo" : "Añadir Pokémon"}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {isCreatingRoute ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelCreation}
                className="h-12 border-(--gray-300) text-(--gray-700) hover:bg-(--gray-100)"
              >
                Cancelar
              </Button>
            ) : null}

            <Button
              onClick={handleSaveTeam}
              size="lg"
              className="h-12 w-full bg-(--blue-500) text-base font-semibold hover:bg-(--blue-600)"
            >
              Guardar equipo
            </Button>
          </div>
        </div>

        <PokeSearchModal
          open={isFlowOpen}
          onOpenChange={handleModalOpenChange}
          title={modalTitleByStep[currentStep]}
          description={modalDescriptionByStep[currentStep]}
        >
          {renderModalStep()}
        </PokeSearchModal>

        <Dialog
          open={Boolean(duplicatePokemonName)}
          onOpenChange={handleDuplicateDialogOpenChange}
        >
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Pokémon duplicado</DialogTitle>
              <DialogDescription>
                {duplicatePokemonName
                  ? `${duplicatePokemonName} ya está en el equipo.`
                  : "Este Pokémon ya está en el equipo."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => setDuplicatePokemonName("")}
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Descartar borrador</DialogTitle>
              <DialogDescription>
                Tienes cambios sin guardar en el equipo. Si cancelas ahora, se
                perderán.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Seguir editando
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!canSaveDraft}
                onClick={handleSaveAndExit}
              >
                Guardar y salir
              </Button>
              <Button type="button" onClick={handleConfirmCancelDiscard}>
                Descartar borrador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PokemonFeatureProvider>
  );
}

export default TeamBuilderPage;
