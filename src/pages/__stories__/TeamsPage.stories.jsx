import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";

import TeamsPage from "@/pages/TeamsPage";
import { useTeamsStore } from "@/features/teams/teams.store";

function TeamsPageStoryWrapper({ savedTeamA, savedTeamB }) {
  useEffect(() => {
    const previous = useTeamsStore.getState();

    useTeamsStore.setState({ savedTeamA, savedTeamB });

    return () => {
      useTeamsStore.setState({
        savedTeamA: previous.savedTeamA,
        savedTeamB: previous.savedTeamB,
      });
    };
  }, [savedTeamA, savedTeamB]);

  return (
    <MemoryRouter initialEntries={["/teams"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <TeamsPage />
      </div>
    </MemoryRouter>
  );
}

const mockSavedTeamA = [
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
  {
    id: 146,
    name: "moltres",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png",
  },
  {
    id: 78,
    name: "rapidash",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png",
  },
  {
    id: 663,
    name: "talonflame",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/663.png",
  },
];

const mockSavedTeamB = [
  {
    id: 134,
    name: "vaporeon",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
  },
  {
    id: 245,
    name: "suicune",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png",
  },
  {
    id: 73,
    name: "tentacruel",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/73.png",
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
  {
    id: 658,
    name: "greninja",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png",
  },
];

export default {
  title: "Pages/TeamsPage",
  component: TeamsPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <TeamsPageStoryWrapper
      savedTeamA={mockSavedTeamA}
      savedTeamB={mockSavedTeamB}
    />
  ),
};

export const Empty = {
  render: () => <TeamsPageStoryWrapper savedTeamA={[]} savedTeamB={[]} />,
};
