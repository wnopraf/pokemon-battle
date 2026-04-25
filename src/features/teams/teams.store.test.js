import { useTeamsStore } from "./teams.store";

const pikachu = { id: 25, name: "pikachu" };
const charmander = { id: 4, name: "charmander" };

describe("teams.store", () => {
  beforeEach(() => {
    localStorage.clear();

    useTeamsStore.setState({
      draftTeamA: [],
      draftTeamB: [],
      savedTeamA: [],
      savedTeamB: [],
    });
  });

  it("initializes with empty state if no storage", () => {
    const state = useTeamsStore.getState();

    expect(state.draftTeamA).toEqual([]);
    expect(state.draftTeamB).toEqual([]);
    expect(state.savedTeamA).toEqual([]);
    expect(state.savedTeamB).toEqual([]);
  });

  it("adds pokemon to draft team A and persists draft", () => {
    const { addPokemon } = useTeamsStore.getState();

    addPokemon("A", pikachu);

    const state = useTeamsStore.getState();

    expect(state.draftTeamA).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem("teams-draft"))).toEqual({
      draftTeamA: [pikachu],
      draftTeamB: [],
    });
  });

  it("adds pokemon to draft team B", () => {
    const { addPokemon } = useTeamsStore.getState();

    addPokemon("B", pikachu);

    const state = useTeamsStore.getState();

    expect(state.draftTeamB).toHaveLength(1);
  });

  it("does not allow duplicates across teams", () => {
    const { addPokemon } = useTeamsStore.getState();

    addPokemon("A", pikachu);
    addPokemon("B", pikachu);

    const state = useTeamsStore.getState();

    expect(state.draftTeamA).toHaveLength(1);
    expect(state.draftTeamB).toHaveLength(0);
  });

  it("removes pokemon from team A and persists", () => {
    const { addPokemon, removePokemon } = useTeamsStore.getState();

    addPokemon("A", pikachu);
    removePokemon("A", pikachu.id);

    const state = useTeamsStore.getState();

    expect(state.draftTeamA).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem("teams-draft"))).toEqual({
      draftTeamA: [],
      draftTeamB: [],
    });
  });

  it("removes pokemon from team B", () => {
    const { addPokemon, removePokemon } = useTeamsStore.getState();

    addPokemon("B", pikachu);
    removePokemon("B", pikachu.id);

    const state = useTeamsStore.getState();

    expect(state.draftTeamB).toHaveLength(0);
  });

  it("clears draft and persists", () => {
    const { addPokemon, clearDraft } = useTeamsStore.getState();

    addPokemon("A", pikachu);
    clearDraft();

    const state = useTeamsStore.getState();

    expect(state.draftTeamA).toEqual([]);
    expect(state.draftTeamB).toEqual([]);
  });

  it("saves teams correctly", () => {
    const { addPokemon, saveTeams } = useTeamsStore.getState();

    addPokemon("A", pikachu);
    addPokemon("B", charmander);

    saveTeams();

    const state = useTeamsStore.getState();

    expect(state.savedTeamA).toEqual([pikachu]);
    expect(state.savedTeamB).toEqual([charmander]);

    expect(JSON.parse(localStorage.getItem("teams-saved"))).toEqual({
      savedTeamA: [pikachu],
      savedTeamB: [charmander],
    });
  });

  it("canBattle returns true only if saved teams have pokemon", () => {
    const { addPokemon, saveTeams, canBattle } = useTeamsStore.getState();

    expect(canBattle()).toBe(false);

    addPokemon("A", pikachu);
    saveTeams();

    expect(canBattle()).toBe(false);

    addPokemon("B", charmander);
    saveTeams();

    expect(canBattle()).toBe(true);
  });

  it("hydrates from localStorage", () => {
    localStorage.setItem(
      "teams-draft",
      JSON.stringify({
        draftTeamA: [pikachu],
        draftTeamB: [],
      }),
    );

    localStorage.setItem(
      "teams-saved",
      JSON.stringify({
        savedTeamA: [],
        savedTeamB: [charmander],
      }),
    );

    jest.resetModules();

    const { useTeamsStore: newStore } = require("./teams.store");

    const state = newStore.getState();

    expect(state.draftTeamA).toEqual([pikachu]);
    expect(state.savedTeamB).toEqual([charmander]);
  });
});
