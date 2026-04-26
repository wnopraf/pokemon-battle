import { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PokeSearch,
  PokeSearchModal,
} from "@/features/pokemon/components/PokeSearch";
import { PokemonFeatureProvider } from "@/features/pokemon/providers";
import { PokemonSlot } from "@/features/teams/components/PokemonSlot";
import { useTeamsStore } from "@/features/teams/teams.store";

import { PokemonConfirmStep } from "./PokemonConfirmStep";
import { PokemonDetailStep } from "./PokemonDetailStep";
import { useTeamBuilderFlow } from "./useTeamBuilderFlow";

export function TeamBuilderPage() {
  const draftTeam = useTeamsStore((s) => s.draftTeam);
  const removePokemon = useTeamsStore((s) => s.removePokemon);
  const addPokemon = useTeamsStore((s) => s.addPokemon);
  const reorderDraftPokemons = useTeamsStore((s) => s.reorderDraftPokemons);
  const setDraftTeamName = useTeamsStore((s) => s.setDraftTeamName);
  const saveDraft = useTeamsStore((s) => s.saveDraft);
  const startDraft = useTeamsStore((s) => s.startDraft);
  const slotRefs = useRef([]);
  const [dragState, setDragState] = useState({
    sourceIndex: null,
    targetIndex: null,
  });

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

    const cleanups = Array.from({ length: 6 })
      .map((_, index) => {
        const element = slotRefs.current[index];
        if (!element) return null;

        const isOccupiedSlot = index < draftTeam.pokemons.length;

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

            const maxIndex = draftTeam.pokemons.length - 1;
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
  }, [draftTeam?.id, draftTeam?.pokemons, reorderDraftPokemons]);

  const handleAddPokemon = () => {
    if (!draftTeam?.id) return;
    openSearch({ team: draftTeam.id });
  };

  const handleRemovePokemon = (index) => {
    if (!draftTeam?.pokemons?.[index]) return;
    removePokemon(draftTeam.id, draftTeam.pokemons[index].id);
  };

  const handleSelectPokemon = (pokemon) => {
    if (!pokemon?.id) return;
    goToDetail(pokemon.id);
  };

  const handleConfirmAdd = (pokemon) => {
    const targetTeam = selectionContext?.team || draftTeam?.id;
    if (!targetTeam) return;
    addPokemon(targetTeam, pokemon);
    closeFlow();
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
    if (!draftTeam?.name?.trim()) {
      alert("Por favor, introduce un nombre para el equipo");
      return;
    }
    if (!draftTeam?.pokemons?.length) {
      alert("Por favor, añade al menos un Pokémon al equipo");
      return;
    }
    saveDraft();
    alert("Equipo guardado correctamente");
  };

  const isTeamFull = (draftTeam?.pokemons?.length ?? 0) >= 6;

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
            <div className="grid grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  ref={(element) => {
                    slotRefs.current[index] = element;
                  }}
                  className={cn(
                    "rounded-xl transition-all duration-300 ease-out",
                    draftTeam?.pokemons?.[index] &&
                      "cursor-grab active:cursor-grabbing",
                    dragState.sourceIndex === index &&
                      "scale-[0.97] opacity-60 shadow-2xl",
                    dragState.targetIndex === index &&
                      dragState.sourceIndex !== index &&
                      "border-2 border-dashed border-(--blue-300) bg-(--blue-50)",
                  )}
                >
                  <PokemonSlot
                    pokemon={draftTeam?.pokemons?.[index]}
                    onRemove={handleRemovePokemon}
                    index={index}
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

          <Button
            onClick={handleSaveTeam}
            size="lg"
            className="h-12 w-full bg-(--blue-500) text-base font-semibold hover:bg-(--blue-600)"
          >
            Guardar equipo
          </Button>
        </div>

        <PokeSearchModal
          open={isFlowOpen}
          onOpenChange={handleModalOpenChange}
          title={modalTitleByStep[currentStep]}
          description={modalDescriptionByStep[currentStep]}
        >
          {renderModalStep()}
        </PokeSearchModal>
      </div>
    </PokemonFeatureProvider>
  );
}

export default TeamBuilderPage;
