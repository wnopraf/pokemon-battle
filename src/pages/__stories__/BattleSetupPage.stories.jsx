import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";

import { useTeamsStore } from "@/features/teams/teams.store";
import BattleSetupPage from "@/pages/BattleSetupPage";

const teamFire = {
  id: "team-fire",
  name: "Equipo Fuego",
  pokemons: [
    {
      id: 6,
      name: "charizard",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    },
    {
      id: 59,
      name: "arcanine",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
    },
    {
      id: 392,
      name: "infernape",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png",
    },
  ],
};

const teamWater = {
  id: "team-water",
  name: "Equipo Agua",
  pokemons: [
    {
      id: 134,
      name: "vaporeon",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
    },
    {
      id: 130,
      name: "gyarados",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    },
    {
      id: 9,
      name: "blastoise",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    },
  ],
};

function BattleSetupStoryWrapper({ teams = [], selection }) {
  useEffect(() => {
    const previousState = useTeamsStore.getState();

    useTeamsStore.setState({
      teams,
      battleSelection: selection ?? { teamAId: null, teamBId: null },
    });

    return () => {
      useTeamsStore.setState({
        teams: previousState.teams,
        battleSelection: previousState.battleSelection,
      });
    };
  }, [selection, teams]);

  return (
    <MemoryRouter initialEntries={["/battle"]}>
      <div className="min-h-screen bg-(--gray-50) p-6">
        <BattleSetupPage />
      </div>
    </MemoryRouter>
  );
}

export default {
  title: "Pages/BattleSetupPage",
  component: BattleSetupPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <BattleSetupStoryWrapper
      teams={[teamFire, teamWater]}
      selection={{ teamAId: "team-fire", teamBId: "team-water" }}
    />
  ),
};

export const Empty = {
  render: () => <BattleSetupStoryWrapper teams={[]} selection={null} />,
};
