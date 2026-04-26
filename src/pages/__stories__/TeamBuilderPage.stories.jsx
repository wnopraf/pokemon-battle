import { TeamBuilderPage } from "@/pages/TeamBuilderPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { MemoryRouter } from "react-router-dom";

function StoryProviders({ children, initialEntries = ["/teams/new"] }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

export default {
  title: "Pages/TeamBuilderPage",
  component: TeamBuilderPage,
  decorators: [
    (Story, context) => {
      const initialEntries = context.parameters?.initialEntries ?? [
        "/teams/new",
      ];

      return (
        <StoryProviders initialEntries={initialEntries}>
          <Story />
        </StoryProviders>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {},
};

export const ModalSearchStep = {
  parameters: {
    initialEntries: ["/teams/new?modal=add-pokemon&step=search&team=A&slot=0"],
  },
};

export const ModalDetailStep = {
  parameters: {
    initialEntries: [
      "/teams/new?modal=add-pokemon&step=detail&team=A&slot=0&pokemonId=25",
    ],
  },
};

export const ModalConfirmStep = {
  parameters: {
    initialEntries: [
      "/teams/new?modal=add-pokemon&step=confirm&team=A&slot=0&pokemonId=25",
    ],
  },
};
