import { useTeamsStore } from "./teams.store";

const pikachu = { id: 25, name: "pikachu" };
const charmander = { id: 4, name: "charmander" };

describe("teams.store", () => {
  beforeEach(() => {
    localStorage.clear();

    useTeamsStore.setState({
      draftTeam: {
        id: "draft-team",
        name: "",
        pokemons: [],
        createdAt: 1,
        updatedAt: 1,
      },
      teams: [],
      battleSelection: {
        teamAId: null,
        teamBId: null,
      },
    });
  });

  it("initializes with empty state if no storage", () => {
    const state = useTeamsStore.getState();

    expect(Array.isArray(state.draftTeam.pokemons)).toBe(true);
    expect(state.teams).toEqual([]);
  });

  it("adds pokemon to current draft and persists draft", () => {
    const { addPokemon } = useTeamsStore.getState();
    const draftId = useTeamsStore.getState().draftTeam.id;

    addPokemon(draftId, pikachu);

    const state = useTeamsStore.getState();

    expect(state.draftTeam.pokemons).toEqual([pikachu]);
    expect(JSON.parse(localStorage.getItem("teams-draft-v2"))).toMatchObject({
      id: draftId,
      pokemons: [pikachu],
    });
  });

  it("does not add pokemon when team id does not match current draft", () => {
    const { addPokemon } = useTeamsStore.getState();

    addPokemon("another-team", pikachu);

    const state = useTeamsStore.getState();

    expect(state.draftTeam.pokemons).toHaveLength(0);
  });

  it("does not allow duplicate pokemon in same draft", () => {
    const { addPokemon } = useTeamsStore.getState();
    const draftId = useTeamsStore.getState().draftTeam.id;

    addPokemon(draftId, pikachu);
    addPokemon(draftId, pikachu);

    const state = useTeamsStore.getState();

    expect(state.draftTeam.pokemons).toHaveLength(1);
  });

  it("removes pokemon from draft and persists", () => {
    const { addPokemon, removePokemon } = useTeamsStore.getState();
    const draftId = useTeamsStore.getState().draftTeam.id;

    addPokemon(draftId, pikachu);
    removePokemon(draftId, pikachu.id);

    const state = useTeamsStore.getState();

    expect(state.draftTeam.pokemons).toEqual([]);
    expect(JSON.parse(localStorage.getItem("teams-draft-v2"))).toMatchObject({
      id: draftId,
      pokemons: [],
    });
  });

  it("reorders pokemons in draft and persists", () => {
    const { addPokemon, reorderDraftPokemons } = useTeamsStore.getState();
    const draftId = useTeamsStore.getState().draftTeam.id;

    addPokemon(draftId, pikachu);
    addPokemon(draftId, charmander);

    reorderDraftPokemons(draftId, 0, 1);

    const state = useTeamsStore.getState();

    expect(state.draftTeam.pokemons).toEqual([charmander, pikachu]);
    expect(JSON.parse(localStorage.getItem("teams-draft-v2"))).toMatchObject({
      id: draftId,
      pokemons: [charmander, pikachu],
    });
  });

  it("does not reorder pokemons when indices are invalid", () => {
    const { addPokemon, reorderDraftPokemons } = useTeamsStore.getState();
    const draftId = useTeamsStore.getState().draftTeam.id;

    addPokemon(draftId, pikachu);
    addPokemon(draftId, charmander);

    reorderDraftPokemons(draftId, 0, 2);

    const state = useTeamsStore.getState();

    expect(state.draftTeam.pokemons).toEqual([pikachu, charmander]);
  });

  it("clears draft and persists", () => {
    const { addPokemon, clearDraft } = useTeamsStore.getState();
    const draftId = useTeamsStore.getState().draftTeam.id;

    addPokemon(draftId, pikachu);
    clearDraft();

    const state = useTeamsStore.getState();

    expect(state.draftTeam.pokemons).toEqual([]);
    expect(state.draftTeam.id).not.toBe(draftId);
  });

  it("saves draft as a team and persists", () => {
    const { addPokemon, setDraftTeamName, saveDraft } =
      useTeamsStore.getState();
    const draftId = useTeamsStore.getState().draftTeam.id;

    setDraftTeamName("Equipo eléctrico");
    addPokemon(draftId, pikachu);
    saveDraft();

    const state = useTeamsStore.getState();

    expect(state.teams).toHaveLength(1);
    expect(state.teams[0]).toMatchObject({
      id: draftId,
      name: "Equipo eléctrico",
      pokemons: [pikachu],
    });

    expect(JSON.parse(localStorage.getItem("teams-saved-v2"))).toHaveLength(1);
  });

  it("canBattle returns true only when two different selected teams have pokemon", () => {
    const {
      startDraft,
      setDraftTeamName,
      addPokemon,
      saveDraft,
      selectBattleTeams,
      canBattle,
    } = useTeamsStore.getState();

    expect(canBattle()).toBe(false);

    startDraft();
    let draftId = useTeamsStore.getState().draftTeam.id;
    setDraftTeamName("Team 1");
    addPokemon(draftId, pikachu);
    saveDraft();

    expect(canBattle()).toBe(false);

    startDraft();
    draftId = useTeamsStore.getState().draftTeam.id;
    setDraftTeamName("Team 2");
    addPokemon(draftId, charmander);
    saveDraft();

    const teams = useTeamsStore.getState().teams;

    selectBattleTeams(teams[0].id, teams[1].id);

    expect(canBattle()).toBe(true);
  });

  it("hydrates v2 state from localStorage", () => {
    const draftTeam = {
      id: "draft-local",
      name: "Draft local",
      pokemons: [pikachu],
      createdAt: 1,
      updatedAt: 1,
    };

    const teams = [
      {
        id: "saved-local",
        name: "Saved local",
        pokemons: [charmander],
        createdAt: 1,
        updatedAt: 1,
      },
    ];

    localStorage.setItem("teams-draft-v2", JSON.stringify(draftTeam));

    localStorage.setItem("teams-saved-v2", JSON.stringify(teams));

    jest.resetModules();

    const { useTeamsStore: newStore } = require("./teams.store");

    const state = newStore.getState();

    expect(state.draftTeam).toMatchObject(draftTeam);
    expect(state.teams).toEqual(teams);
  });
});
