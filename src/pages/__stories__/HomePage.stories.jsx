import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import { useBattleStore } from "@/features/battle/battle.store";
import { useTeamsStore } from "@/features/teams/teams.store";

function HomePageStoryWrapper({
  teams = [],
  draftTeam = null,
  history = [],
}) {
  useEffect(() => {
    const previousTeams = useTeamsStore.getState();
    const previousBattle = useBattleStore.getState();

    useTeamsStore.setState({
      teams,
      draftTeam: draftTeam ?? {
        id: "draft-empty",
        name: "",
        pokemons: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });

    useBattleStore.setState({ history });

    return () => {
      useTeamsStore.setState({
        teams: previousTeams.teams,
        draftTeam: previousTeams.draftTeam,
      });
      useBattleStore.setState({ history: previousBattle.history });
    };
  }, [teams, draftTeam, history]);

  return (
    <MemoryRouter initialEntries={["/"]}>
      <div className="min-h-screen bg-(--gray-50) p-6 md:p-10">
        <div className="mx-auto w-full max-w-5xl">
          <HomePage />
        </div>
      </div>
    </MemoryRouter>
  );
}

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

const mockHistoryFull = [
  {
    id: "battle-1",
    date: Date.now() - 5 * minute,
    winner: "A",
    rounds: 8,
    teamA: { id: "team-fire", name: "Equipo Fuego", pokemonCount: 6 },
    teamB: { id: "team-water", name: "Equipo Agua", pokemonCount: 4 },
  },
  {
    id: "battle-2",
    date: Date.now() - 2 * hour,
    winner: "B",
    rounds: 12,
    teamA: { id: "team-grass", name: "Equipo Planta", pokemonCount: 3 },
    teamB: { id: "team-fire", name: "Equipo Fuego", pokemonCount: 6 },
  },
  {
    id: "battle-3",
    date: Date.now() - 1 * day,
    winner: "A",
    rounds: 6,
    teamA: { id: "team-water", name: "Equipo Agua", pokemonCount: 4 },
    teamB: { id: "team-grass", name: "Equipo Planta", pokemonCount: 3 },
  },
  {
    id: "battle-4",
    date: Date.now() - 3 * day,
    winner: "B",
    rounds: 9,
    teamA: { id: "team-fire", name: "Equipo Fuego", pokemonCount: 6 },
    teamB: { id: "team-water", name: "Equipo Agua", pokemonCount: 4 },
  },
];

// Historial donde uno de los equipos ya no existe (revancha bloqueada)
const mockHistoryStale = [
  {
    id: "battle-stale",
    date: Date.now() - 30 * minute,
    winner: "A",
    rounds: 7,
    teamA: { id: "team-fire", name: "Equipo Fuego", pokemonCount: 6 },
    teamB: { id: "team-deleted", name: "Equipo Borrado", pokemonCount: 4 },
  },
];

const mockTeamFire = [
  { id: 6, name: "charizard", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" },
  { id: 59, name: "arcanine", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png" },
  { id: 392, name: "infernape", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png" },
  { id: 146, name: "moltres", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png" },
  { id: 78, name: "rapidash", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png" },
  { id: 663, name: "talonflame", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/663.png" },
];

const mockTeamWater = [
  { id: 134, name: "vaporeon", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png" },
  { id: 245, name: "suicune", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png" },
  { id: 9, name: "blastoise", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" },
  { id: 658, name: "greninja", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png" },
];

const mockTeamGrass = [
  { id: 3, name: "venusaur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png" },
  { id: 154, name: "meganium", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/154.png" },
  { id: 254, name: "sceptile", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/254.png" },
];

export default {
  title: "Pages/HomePage",
  component: HomePage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <HomePageStoryWrapper
      teams={[
        { id: "team-fire", name: "Equipo Fuego", pokemons: mockTeamFire, updatedAt: Date.now() },
        { id: "team-water", name: "Equipo Agua", pokemons: mockTeamWater, updatedAt: Date.now() - 1000 * 60 * 60 },
        { id: "team-grass", name: "Equipo Planta", pokemons: mockTeamGrass, updatedAt: Date.now() - 1000 * 60 * 60 * 24 },
      ]}
    />
  ),
};

export const WithDraft = {
  render: () => (
    <HomePageStoryWrapper
      teams={[
        { id: "team-fire", name: "Equipo Fuego", pokemons: mockTeamFire, updatedAt: Date.now() - 1000 * 60 * 30 },
      ]}
      draftTeam={{
        id: "draft-123",
        name: "Equipo Eléctrico",
        pokemons: mockTeamGrass.slice(0, 2),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }}
    />
  ),
};

export const Empty = {
  render: () => <HomePageStoryWrapper teams={[]} />,
};

export const WithBattleHistory = {
  render: () => (
    <HomePageStoryWrapper
      teams={[
        { id: "team-fire", name: "Equipo Fuego", pokemons: mockTeamFire, updatedAt: Date.now() },
        { id: "team-water", name: "Equipo Agua", pokemons: mockTeamWater, updatedAt: Date.now() - 1000 * 60 * 60 },
        { id: "team-grass", name: "Equipo Planta", pokemons: mockTeamGrass, updatedAt: Date.now() - 1000 * 60 * 60 * 24 },
      ]}
      history={mockHistoryFull}
    />
  ),
};

export const RematchUnavailable = {
  render: () => (
    <HomePageStoryWrapper
      teams={[
        { id: "team-fire", name: "Equipo Fuego", pokemons: mockTeamFire, updatedAt: Date.now() },
      ]}
      history={mockHistoryStale}
    />
  ),
};

export const FullDashboard = {
  render: () => (
    <HomePageStoryWrapper
      teams={[
        { id: "team-fire", name: "Equipo Fuego", pokemons: mockTeamFire, updatedAt: Date.now() },
        { id: "team-water", name: "Equipo Agua", pokemons: mockTeamWater, updatedAt: Date.now() - 1000 * 60 * 60 },
        { id: "team-grass", name: "Equipo Planta", pokemons: mockTeamGrass, updatedAt: Date.now() - 1000 * 60 * 60 * 24 },
      ]}
      draftTeam={{
        id: "draft-123",
        name: "Equipo Eléctrico",
        pokemons: mockTeamGrass.slice(0, 2),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }}
      history={mockHistoryFull}
    />
  ),
};
