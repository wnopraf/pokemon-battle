import { useEffect, useMemo } from "react";
import { MemoryRouter } from "react-router-dom";

import { simulateBattle } from "@/features/battle/battle.logic";
import { useBattleStore } from "@/features/battle/battle.store";
import { useTeamsStore } from "@/features/teams/teams.store";
import BattleResultPage from "@/pages/BattleResultPage";

const teamFire = {
  id: "team-fire",
  name: "Equipo Fuego",
  pokemons: [
    {
      id: 6,
      name: "charizard",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
      attack: 84,
      defense: 78,
      speed: 100,
    },
    {
      id: 59,
      name: "arcanine",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
      attack: 110,
      defense: 80,
      speed: 95,
    },
    {
      id: 392,
      name: "infernape",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png",
      attack: 104,
      defense: 71,
      speed: 108,
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
      attack: 65,
      defense: 60,
      speed: 65,
    },
    {
      id: 130,
      name: "gyarados",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
      attack: 125,
      defense: 79,
      speed: 81,
    },
    {
      id: 9,
      name: "blastoise",
      image:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
      attack: 83,
      defense: 100,
      speed: 78,
    },
  ],
};

function BattleResultStoryWrapper({
  teams = [],
  selection = null,
  battleResult = null,
}) {
  useEffect(() => {
    const previousTeamsState = useTeamsStore.getState();
    const previousBattleState = useBattleStore.getState();

    useTeamsStore.setState({
      teams,
      battleSelection: selection ?? { teamAId: null, teamBId: null },
    });
    useBattleStore.setState({ battleResult });

    return () => {
      useTeamsStore.setState({
        teams: previousTeamsState.teams,
        battleSelection: previousTeamsState.battleSelection,
      });
      useBattleStore.setState({
        battleResult: previousBattleState.battleResult,
      });
    };
  }, [battleResult, selection, teams]);

  return (
    <MemoryRouter initialEntries={["/battle/result"]}>
      <div className="min-h-screen bg-(--gray-50) p-6">
        <BattleResultPage />
      </div>
    </MemoryRouter>
  );
}

function BattleResultStoryConnected(props) {
  const battleResult = useMemo(() => {
    if (!props.withResult) return null;
    return simulateBattle(teamFire.pokemons, teamWater.pokemons);
  }, [props.withResult]);

  return (
    <BattleResultStoryWrapper
      teams={props.teams}
      selection={props.selection}
      battleResult={battleResult}
    />
  );
}

export default {
  title: "Pages/BattleResultPage",
  component: BattleResultPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const Default = {
  render: () => (
    <BattleResultStoryConnected
      withResult
      teams={[teamFire, teamWater]}
      selection={{ teamAId: "team-fire", teamBId: "team-water" }}
    />
  ),
};

export const Empty = {
  render: () => (
    <BattleResultStoryConnected
      withResult={false}
      teams={[]}
      selection={null}
    />
  ),
};
