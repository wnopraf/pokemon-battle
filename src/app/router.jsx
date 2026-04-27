import { createBrowserRouter } from "react-router-dom";

import AppLayout from "./layout";
import RouteErrorBoundary from "./RouteErrorBoundary";

const lazyPage = (loader) => async () => {
  const module = await loader();
  return { Component: module.default };
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        lazy: lazyPage(() => import("@/pages/HomePage")),
      },
      {
        path: "teams",
        lazy: lazyPage(() => import("@/pages/TeamsPage")),
      },
      {
        path: "teams/new",
        lazy: lazyPage(() => import("@/pages/TeamBuilderPage")),
      },
      {
        path: "teams/:id",
        lazy: lazyPage(() => import("@/pages/TeamBuilderPage")),
      },
      {
        path: "battle",
        lazy: lazyPage(() => import("@/pages/BattleSetupPage")),
      },
      {
        path: "battle/play",
        lazy: lazyPage(() => import("@/pages/BattlePage")),
      },
      {
        path: "battle/result",
        lazy: lazyPage(() => import("@/pages/BattleResultPage")),
      },
      {
        path: "battle-history",
        lazy: lazyPage(() => import("@/pages/BattleHistoryPage")),
      },
    ],
  },
]);
