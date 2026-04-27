import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./layout";
import RouteErrorBoundary from "./RouteErrorBoundary";

import TeamsPage from "@/pages/TeamsPage";
import TeamBuilderPage from "@/pages/TeamBuilderPage";
import BattleSetupPage from "@/pages/BattleSetupPage";
import BattlePage from "@/pages/BattlePage";
import BattleResultPage from "@/pages/BattleResultPage";
import BattleHistoryPage from "@/pages/BattleHistoryPage";
import HomePage from "@/pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
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
      {
        path: "battle-history",
        element: <BattleHistoryPage />,
      },
    ],
  },
]);
