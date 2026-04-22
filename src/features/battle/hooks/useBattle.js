import { simulateBattle } from "../battle.logic";
import { useBattleStore } from "../battle.store";

export default function useBattle() {
  const setBattleResult = useBattleStore((store) => store.setBattleResult);
  const resetBattle = useBattleStore((store) => store.resetBattle);
  const battleResult = useBattleStore((store) => store.battleResult);

  return {
    startBattle: (teamA, teamB) => {
      const result = simulateBattle(teamA, teamB);
      setBattleResult(result);
    },
    resetBattle,
    battleResult,
  };
}
