import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const FLOW_MODAL = "add-pokemon";
const FLOW_STEPS = ["search", "detail", "confirm"];

function isValidStep(step) {
  return FLOW_STEPS.includes(step);
}

function parseSlot(value) {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function useTeamBuilderFlow() {
  const [searchParams, setSearchParams] = useSearchParams();

  const isFlowOpen = searchParams.get("modal") === FLOW_MODAL;
  const rawStep = searchParams.get("step");
  const currentStep = isFlowOpen && isValidStep(rawStep) ? rawStep : "search";
  const team = searchParams.get("team");
  const slot = parseSlot(searchParams.get("slot"));
  const selectedPokemonId = searchParams.get("pokemonId");

  const selectionContext = useMemo(() => {
    if (!team) return null;

    return {
      team,
      slot,
    };
  }, [team, slot]);

  const updateFlowParams = useCallback(
    (updates = {}) => {
      const nextParams = new URLSearchParams(searchParams);

      if (updates.modal === null) nextParams.delete("modal");
      else if (updates.modal !== undefined)
        nextParams.set("modal", updates.modal);

      if (updates.step === null) nextParams.delete("step");
      else if (updates.step !== undefined) nextParams.set("step", updates.step);

      if (updates.team === null) nextParams.delete("team");
      else if (updates.team !== undefined) nextParams.set("team", updates.team);

      if (updates.slot === null) nextParams.delete("slot");
      else if (updates.slot !== undefined)
        nextParams.set("slot", String(updates.slot));

      if (updates.pokemonId === null) nextParams.delete("pokemonId");
      else if (updates.pokemonId !== undefined) {
        nextParams.set("pokemonId", String(updates.pokemonId));
      }

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  const openSearch = useCallback(
    ({ team: nextTeam = null, slot: nextSlot = null } = {}) => {
      updateFlowParams({
        modal: FLOW_MODAL,
        step: "search",
        team: nextTeam,
        slot: nextSlot,
        pokemonId: null,
      });
    },
    [updateFlowParams],
  );

  const goToDetail = useCallback(
    (pokemonId) => {
      if (!pokemonId) return;

      updateFlowParams({
        modal: FLOW_MODAL,
        step: "detail",
        pokemonId,
      });
    },
    [updateFlowParams],
  );

  const goToConfirm = useCallback(
    (pokemonId) => {
      if (!pokemonId) return;

      updateFlowParams({
        modal: FLOW_MODAL,
        step: "confirm",
        pokemonId,
      });
    },
    [updateFlowParams],
  );

  const closeFlow = useCallback(() => {
    updateFlowParams({
      modal: null,
      step: null,
      team: null,
      slot: null,
      pokemonId: null,
    });
  }, [updateFlowParams]);

  const backStep = useCallback(() => {
    if (!isFlowOpen || currentStep === "search") {
      closeFlow();
      return;
    }

    if (currentStep === "confirm") {
      updateFlowParams({ step: "detail" });
      return;
    }

    updateFlowParams({
      step: "search",
      pokemonId: null,
    });
  }, [closeFlow, currentStep, isFlowOpen, updateFlowParams]);

  return {
    isFlowOpen,
    currentStep,
    selectionContext,
    selectedPokemonId,
    openSearch,
    goToDetail,
    goToConfirm,
    closeFlow,
    backStep,
  };
}
