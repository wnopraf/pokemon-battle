import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import { useTeamsStore } from "@/features/teams/teams.store";

function HomePageStoryWrapper({ teams = [], draftTeam = null }) {
  useEffect(() => {
    const previous = useTeamsStore.getState();

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

    return () => {
      useTeamsStore.setState({
        teams: previous.teams,
        draftTeam: previous.draftTeam,
      });
    };
  }, [teams, draftTeam]);

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
