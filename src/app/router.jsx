import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./layout";

import TeamsPage from "@/pages/TeamsPage";
import TeamBuilderPage from "@/pages/TeamBuilderPage";
import BattleSetupPage from "@/pages/BattleSetupPage";
import BattlePage from "@/pages/BattlePage";
import BattleResultPage from "@/pages/BattleResultPage";

export const router = createBrowserRouter([
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
]);
