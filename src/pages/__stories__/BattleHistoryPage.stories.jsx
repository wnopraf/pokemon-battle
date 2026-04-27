import { useEffect } from "react";
import { MemoryRouter } from "react-router-dom";

import { useBattleStore } from "@/features/battle/battle.store";
import { useTeamsStore } from "@/features/teams/teams.store";
import BattleHistoryPage from "@/pages/BattleHistoryPage";

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

const teamFire = {
  id: "team-fire",
  name: "Equipo Fuego",
  pokemons: [{ id: 6 }, { id: 59 }, { id: 392 }, { id: 146 }],
  updatedAt: Date.now(),
};

const teamWater = {
  id: "team-water",
  name: "Equipo Agua",
  pokemons: [{ id: 134 }, { id: 9 }, { id: 658 }],
  updatedAt: Date.now() - hour,
};

const teamGrass = {
  id: "team-grass",
  name: "Equipo Planta",
  pokemons: [{ id: 3 }, { id: 154 }, { id: 254 }],
  updatedAt: Date.now() - day,
};

const fullHistory = [
  {
    id: "battle-1",
    date: Date.now() - 3 * minute,
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
    winner: "A",
    rounds: 9,
    teamA: { id: "team-fire", name: "Equipo Fuego", pokemonCount: 6 },
    teamB: { id: "team-water", name: "Equipo Agua", pokemonCount: 4 },
  },
  {
    id: "battle-5",
    date: Date.now() - 5 * day,
    winner: "B",
    rounds: 14,
    teamA: { id: "team-deleted", name: "Equipo Borrado", pokemonCount: 5 },
    teamB: { id: "team-fire", name: "Equipo Fuego", pokemonCount: 6 },
  },
];

function BattleHistoryPageStoryWrapper({ teams = [], history = [] }) {
  useEffect(() => {
    const previousTeams = useTeamsStore.getState();
    const previousBattle = useBattleStore.getState();

    useTeamsStore.setState({ teams });
    useBattleStore.setState({ history });

    return () => {
      useTeamsStore.setState({ teams: previousTeams.teams });
      useBattleStore.setState({ history: previousBattle.history });
    };
  }, [teams, history]);

  return (
    <MemoryRouter initialEntries={["/battle-history"]}>
      <div className="min-h-screen bg-(--gray-50) p-6 md:p-10">
        <div className="mx-auto w-full max-w-5xl">
          <BattleHistoryPage />
        </div>
      </div>
    </MemoryRouter>
  );
}

export default {
  title: "Pages/BattleHistoryPage",
  component: BattleHistoryPage,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <BattleHistoryPageStoryWrapper
      teams={[teamFire, teamWater, teamGrass]}
      history={fullHistory}
    />
  ),
};

export const Empty = {
  render: () => <BattleHistoryPageStoryWrapper teams={[]} history={[]} />,
};

export const WithStaleBattles = {
  render: () => (
    <BattleHistoryPageStoryWrapper
      teams={[teamFire]}
      history={fullHistory}
    />
  ),
};
