import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

import AppLayout from "@/app/layout";
import { useTeamsStore } from "@/features/teams/teams.store";
import { BattlePage } from "@/pages/BattlePage";
import { BattleResultPage } from "@/pages/BattleResultPage";
import { BattleSetupPage } from "@/pages/BattleSetupPage";
import TeamBuilderPage from "@/pages/TeamBuilderPage";
import TeamsPage from "@/pages/TeamsPage";

const mockSavedTeamA = [
  {
    id: 6,
    name: "charizard",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    attack: 84,
    types: ["fire", "flying"],
  },
  {
    id: 59,
    name: "arcanine",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
    attack: 110,
    types: ["fire"],
  },
  {
    id: 146,
    name: "moltres",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png",
    attack: 100,
    types: ["fire", "flying"],
  },
];

const mockSavedTeamB = [
  {
    id: 134,
    name: "vaporeon",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
    attack: 65,
    types: ["water"],
  },
  {
    id: 130,
    name: "gyarados",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
    attack: 125,
    types: ["water", "flying"],
  },
  {
    id: 9,
    name: "blastoise",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    attack: 83,
    types: ["water"],
  },
];

const baseTeams = [
  {
    id: "team-fire",
    name: "Equipo Fuego",
    pokemons: mockSavedTeamA,
    createdAt: Date.now() - 5000,
    updatedAt: Date.now() - 2000,
  },
  {
    id: "team-water",
    name: "Equipo Agua",
    pokemons: mockSavedTeamB,
    createdAt: Date.now() - 4000,
    updatedAt: Date.now() - 1000,
  },
];

const baseDraft = {
  id: "draft-team-story",
  name: "Equipo Story",
  pokemons: [
    {
      id: 25,
      name: "pikachu",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      attack: 55,
      types: ["electric"],
    },
    {
      id: 4,
      name: "charmander",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      attack: 52,
      types: ["fire"],
    },
  ],
  createdAt: Date.now() - 3000,
  updatedAt: Date.now(),
};

function StoryProviders({ children, initialPath = "/teams" }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    const previousState = useTeamsStore.getState();

    useTeamsStore.setState({
      teams: baseTeams,
      draftTeam: baseDraft,
      draftPokemonSort: "manual",
      battleSelection: {
        teamAId: "team-fire",
        teamBId: "team-water",
      },
    });

    return () => {
      useTeamsStore.setState({
        teams: previousState.teams,
        draftTeam: previousState.draftTeam,
        draftPokemonSort: previousState.draftPokemonSort,
        battleSelection: previousState.battleSelection,
      });
    };
  }, [initialPath]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function AppSandbox({ initialPath = "/teams" }) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            path: "teams",
            element: <TeamsPage />,
          },
          {
            path: "teams/new",
            element: <TeamBuilderPage />,
          },
          {
            path: "teams/:id",
            element: <TeamBuilderPage />,
          },
          {
            path: "battle",
            element: <BattleSetupPage />,
          },
          {
            path: "battle/play",
            element: <BattlePage />,
          },
          {
            path: "battle/result",
            element: <BattleResultPage />,
          },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return (
    <StoryProviders initialPath={initialPath}>
      <RouterProvider router={router} />
    </StoryProviders>
  );
}

export default {
  title: "App/Layout",
  component: AppLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const TeamsDashboard = {
  render: () => <AppSandbox initialPath="/teams" />,
};

export const TeamBuilderCreate = {
  render: () => <AppSandbox initialPath="/teams/new" />,
};

export const TeamBuilderEdit = {
  render: () => <AppSandbox initialPath="/teams/team-fire" />,
};

export const BattleSetup = {
  render: () => <AppSandbox initialPath="/battle" />,
};
