import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { TeamBuilderPage } from "./index";
import { useTeamsStore } from "@/features/teams/teams.store";

jest.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
  draggable: () => () => {},
  dropTargetForElements: () => () => {},
}));

jest.mock("@atlaskit/pragmatic-drag-and-drop/combine", () => ({
  combine:
    (...fns) =>
    () =>
      fns.forEach((fn) => typeof fn === "function" && fn()),
}));

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

jest.mock("sonner", () => ({
  toast: {
    success: (...args) => mockToast.success(...args),
    error: (...args) => mockToast.error(...args),
  },
}));

jest.mock("@/features/pokemon/components/PokeSearch", () => {
  const React = require("react");
  const { usePokemonFeature } = require("@/features/pokemon/providers");
  return {
    PokeSearch: () => {
      const { onSelectPokemon } = usePokemonFeature();
      return (
        <div data-testid="poke-search">
          <button
            type="button"
            onClick={() => onSelectPokemon({ id: 25, name: "pikachu" })}
          >
            Seleccionar pikachu
          </button>
          <button
            type="button"
            onClick={() => onSelectPokemon({ id: 4, name: "charmander" })}
          >
            Seleccionar charmander
          </button>
        </div>
      );
    },
    PokeSearchModal: ({ open, children, title, onOpenChange }) =>
      open ? (
        <div data-testid="poke-search-modal" role="dialog" aria-label={title}>
          <h2>{title}</h2>
          <button
            type="button"
            aria-label="Cerrar modal"
            onClick={() => onOpenChange(false)}
          >
            ×
          </button>
          {children}
        </div>
      ) : null,
  };
});

jest.mock("./PokemonDetailStep", () => ({
  PokemonDetailStep: ({ onBack, onContinue, pokemonId }) => (
    <div data-testid="detail-step">
      <span data-testid="detail-pokemon-id">{pokemonId}</span>
      <button type="button" onClick={onBack}>
        Volver desde detalle
      </button>
      <button type="button" onClick={() => onContinue(pokemonId)}>
        Continuar a confirmar
      </button>
    </div>
  ),
}));

jest.mock("./PokemonConfirmStep", () => ({
  PokemonConfirmStep: ({ onBack, onConfirm, pokemonId }) => (
    <div data-testid="confirm-step">
      <span data-testid="confirm-pokemon-id">{pokemonId}</span>
      <button type="button" onClick={onBack}>
        Volver desde confirmar
      </button>
      <button
        type="button"
        onClick={() =>
          onConfirm({ id: Number(pokemonId), name: `pokemon-${pokemonId}` })
        }
      >
        Confirmar adición
      </button>
    </div>
  ),
}));

const pikachu = { id: 25, name: "pikachu", image: "pikachu.png" };
const charmander = { id: 4, name: "charmander", image: "charmander.png" };
const bulbasaur = { id: 1, name: "bulbasaur", image: "bulbasaur.png" };
const squirtle = { id: 7, name: "squirtle", image: "squirtle.png" };
const eevee = { id: 133, name: "eevee", image: "eevee.png" };
const mew = { id: 151, name: "mew", image: "mew.png" };
const mewtwo = { id: 150, name: "mewtwo", image: "mewtwo.png" };

function resetStore({
  draftTeam,
  teams = [],
  draftPokemonSort = "manual",
} = {}) {
  useTeamsStore.setState({
    draftTeam: draftTeam ?? {
      id: "draft-team",
      name: "",
      pokemons: [],
      createdAt: 1,
      updatedAt: 1,
    },
    teams,
    draftPokemonSort,
    battleSelection: { teamAId: null, teamBId: null },
  });
}

function renderPage({ initialPath = "/teams/new" } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/teams/new" element={<TeamBuilderPage />} />
        <Route path="/teams/:id" element={<TeamBuilderPage />} />
        <Route path="/teams" element={<div>Teams Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockToast.success.mockClear();
  mockToast.error.mockClear();
  resetStore();
});

describe("TeamBuilderPage", () => {
  describe("modos de la página", () => {
    it("debería renderizar en modo creación con el título correcto", () => {
      renderPage({ initialPath: "/teams/new" });

      expect(
        screen.getByRole("heading", { name: /crear equipo/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancelar/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /guardar equipo/i }),
      ).toBeInTheDocument();
    });

    it("debería renderizar en modo edición cuando el equipo existe", () => {
      const team = {
        id: "team-1",
        name: "Equipo Fuego",
        pokemons: [charmander],
        createdAt: 1,
        updatedAt: 1,
      };
      resetStore({ teams: [team] });

      renderPage({ initialPath: "/teams/team-1" });

      expect(
        screen.getByRole("heading", { name: /editar equipo/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /guardar cambios/i }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /cancelar/i }),
      ).not.toBeInTheDocument();
      expect(screen.getByDisplayValue("Equipo Fuego")).toBeInTheDocument();
    });

    it("debería redirigir a /teams cuando el equipo no existe", () => {
      renderPage({ initialPath: "/teams/no-existe" });

      expect(screen.getByText("Teams Page")).toBeInTheDocument();
    });
  });

  describe("identidad del equipo", () => {
    it("debería actualizar el nombre del equipo al escribir", async () => {
      renderPage();

      const input = screen.getByPlaceholderText(/ej: equipo fuego/i);
      await userEvent.type(input, "Mi Equipo");

      expect(useTeamsStore.getState().draftTeam.name).toBe("Mi Equipo");
    });

    it("debería mostrar el contador de pokemons X/6", () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "",
          pokemons: [pikachu, charmander],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      expect(screen.getByText("2/6 Pokémon")).toBeInTheDocument();
    });
  });

  describe("añadir pokémon", () => {
    it("debería abrir el modal de búsqueda al pulsar 'Añadir Pokémon'", async () => {
      renderPage();

      const addButton = screen.getByRole("button", { name: /añadir pokémon/i });
      await userEvent.click(addButton);

      expect(screen.getByTestId("poke-search-modal")).toBeInTheDocument();
      expect(screen.getByTestId("poke-search")).toBeInTheDocument();
    });

    it("debería deshabilitar el botón cuando el equipo está lleno", () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Lleno",
          pokemons: [pikachu, charmander, bulbasaur, squirtle, eevee, mew],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      const addButton = screen.getByRole("button", {
        name: /equipo completo/i,
      });
      expect(addButton).toBeDisabled();
    });
  });

  describe("eliminar pokémon", () => {
    it("debería eliminar un pokémon del draft al pulsar la X de su slot", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Mi equipo",
          pokemons: [pikachu, charmander],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      const pikachuImage = screen.getByAltText("pikachu");
      const slot = pikachuImage.closest(".group");
      const removeButton = within(slot).getByRole("button");
      await userEvent.click(removeButton);

      const state = useTeamsStore.getState();
      expect(state.draftTeam.pokemons).toEqual([charmander]);
    });
  });

  describe("ordenación de pokémons", () => {
    it("debería mostrar mensaje cuando el orden no es manual", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo",
          pokemons: [pikachu, charmander],
          createdAt: 1,
          updatedAt: 1,
        },
        draftPokemonSort: "name",
      });

      renderPage();

      expect(
        screen.getByText(
          /el arrastre se desactiva mientras el orden automático/i,
        ),
      ).toBeInTheDocument();
    });

    it("no debería mostrar el mensaje cuando el orden es manual", () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
        draftPokemonSort: "manual",
      });

      renderPage();

      expect(
        screen.queryByText(
          /el arrastre se desactiva mientras el orden automático/i,
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("guardar equipo", () => {
    it("debería mostrar error si no hay nombre al guardar", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      const saveButton = screen.getByRole("button", {
        name: /guardar equipo/i,
      });
      await userEvent.click(saveButton);

      expect(mockToast.error).toHaveBeenCalledWith(
        expect.stringMatching(/introduce un nombre/i),
      );
      expect(useTeamsStore.getState().teams).toEqual([]);
    });

    it("debería mostrar error si no hay pokémons al guardar", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo",
          pokemons: [],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      const saveButton = screen.getByRole("button", {
        name: /guardar equipo/i,
      });
      await userEvent.click(saveButton);

      expect(mockToast.error).toHaveBeenCalledWith(
        expect.stringMatching(/al menos un pokémon/i),
      );
      expect(useTeamsStore.getState().teams).toEqual([]);
    });

    it("debería guardar el equipo y navegar a /teams cuando el draft es válido", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo eléctrico",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      const saveButton = screen.getByRole("button", {
        name: /guardar equipo/i,
      });
      await userEvent.click(saveButton);

      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/guardado correctamente/i),
      );
      expect(screen.getByText("Teams Page")).toBeInTheDocument();
      expect(useTeamsStore.getState().teams).toHaveLength(1);
    });
  });

  describe("cancelar creación", () => {
    it("debería navegar directamente a /teams si no hay cambios en el draft", async () => {
      renderPage();

      const cancelButton = screen.getByRole("button", { name: /cancelar/i });
      await userEvent.click(cancelButton);

      expect(screen.getByText("Teams Page")).toBeInTheDocument();
    });

    it("debería abrir el dialog de confirmación si hay cambios en el draft", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Cambios",
          pokemons: [],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      const cancelButton = screen.getByRole("button", { name: /cancelar/i });
      await userEvent.click(cancelButton);

      expect(
        screen.getByRole("heading", { name: /descartar borrador/i }),
      ).toBeInTheDocument();
    });

    it("debería descartar el draft y navegar al confirmar 'Descartar borrador'", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Cambios",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
      await userEvent.click(
        screen.getByRole("button", { name: /descartar borrador/i }),
      );

      expect(screen.getByText("Teams Page")).toBeInTheDocument();
      expect(useTeamsStore.getState().draftTeam.pokemons).toEqual([]);
      expect(useTeamsStore.getState().draftTeam.name).toBe("");
    });

    it("debería cerrar el dialog al pulsar 'Seguir editando'", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Cambios",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
      await userEvent.click(
        screen.getByRole("button", { name: /seguir editando/i }),
      );

      expect(
        screen.queryByRole("heading", { name: /descartar borrador/i }),
      ).not.toBeInTheDocument();
      expect(useTeamsStore.getState().draftTeam.pokemons).toEqual([pikachu]);
    });

    it("debería guardar y salir cuando se pulsa 'Guardar y salir' con un draft válido", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo válido",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
      const saveAndExitButton = screen.getByRole("button", {
        name: /guardar y salir/i,
      });
      expect(saveAndExitButton).not.toBeDisabled();

      await userEvent.click(saveAndExitButton);

      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/guardado correctamente/i),
      );
      expect(screen.getByText("Teams Page")).toBeInTheDocument();
      expect(useTeamsStore.getState().teams).toHaveLength(1);
    });

    it("debería deshabilitar 'Guardar y salir' si el draft no es guardable", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Solo nombre",
          pokemons: [],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
      const saveAndExitButton = screen.getByRole("button", {
        name: /guardar y salir/i,
      });

      expect(saveAndExitButton).toBeDisabled();
    });
  });

  describe("dialog de pokémon duplicado", () => {
    it("no debería mostrarse por defecto", () => {
      renderPage();

      expect(
        screen.queryByRole("heading", { name: /pokémon duplicado/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("flujo del modal de añadir Pokémon", () => {
    it("debería abrir el modal en el paso 'search' por defecto", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );

      expect(
        screen.getByRole("heading", { name: /buscar pokémon/i }),
      ).toBeInTheDocument();
      expect(screen.getByTestId("poke-search")).toBeInTheDocument();
    });

    it("debería avanzar al paso 'detail' al seleccionar un Pokémon", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );

      expect(screen.getByTestId("detail-step")).toBeInTheDocument();
      expect(screen.getByTestId("detail-pokemon-id")).toHaveTextContent("25");
      expect(
        screen.getByRole("heading", { name: /detalle del pokémon/i }),
      ).toBeInTheDocument();
    });

    it("debería avanzar al paso 'confirm' desde detail", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /continuar a confirmar/i }),
      );

      expect(screen.getByTestId("confirm-step")).toBeInTheDocument();
      expect(screen.getByTestId("confirm-pokemon-id")).toHaveTextContent("25");
      expect(
        screen.getByRole("heading", { name: /confirmar adición/i }),
      ).toBeInTheDocument();
    });

    it("debería volver de detail a search al pulsar volver", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /volver desde detalle/i }),
      );

      expect(screen.getByTestId("poke-search")).toBeInTheDocument();
      expect(screen.queryByTestId("detail-step")).not.toBeInTheDocument();
    });

    it("debería volver de confirm a detail al pulsar volver", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /continuar a confirmar/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /volver desde confirmar/i }),
      );

      expect(screen.getByTestId("detail-step")).toBeInTheDocument();
      expect(screen.queryByTestId("confirm-step")).not.toBeInTheDocument();
    });

    it("debería añadir el pokémon al equipo y cerrar el modal al confirmar", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /continuar a confirmar/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /confirmar adición/i }),
      );

      expect(screen.queryByTestId("poke-search-modal")).not.toBeInTheDocument();
      expect(useTeamsStore.getState().draftTeam.pokemons).toHaveLength(1);
      expect(useTeamsStore.getState().draftTeam.pokemons[0]).toMatchObject({
        id: 25,
      });
      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/se añadió al equipo/i),
        expect.objectContaining({ id: "pokemon-added-25" }),
      );
    });

    it("debería mostrar el dialog de duplicado al añadir un pokémon ya existente", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /continuar a confirmar/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /confirmar adición/i }),
      );

      expect(
        screen.getByRole("heading", { name: /pokémon duplicado/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/pokemon-25 ya está en el equipo/i),
      ).toBeInTheDocument();
      expect(useTeamsStore.getState().draftTeam.pokemons).toHaveLength(1);
      expect(screen.queryByTestId("poke-search-modal")).not.toBeInTheDocument();
      expect(mockToast.success).not.toHaveBeenCalled();
    });

    it("debería cerrar el dialog de duplicado al pulsar 'Cerrar'", async () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo",
          pokemons: [pikachu],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /continuar a confirmar/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /confirmar adición/i }),
      );
      await userEvent.click(screen.getByRole("button", { name: /cerrar/i }));

      expect(
        screen.queryByRole("heading", { name: /pokémon duplicado/i }),
      ).not.toBeInTheDocument();
    });

    it("debería cerrar el modal al pulsar el botón cerrar", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );

      expect(screen.getByTestId("detail-step")).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole("button", { name: /cerrar modal/i }),
      );

      expect(screen.queryByTestId("poke-search-modal")).not.toBeInTheDocument();
    });

    it("debería resetear el flujo cuando se reabre el modal después de cerrarlo", async () => {
      renderPage();

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /seleccionar pikachu/i }),
      );
      await userEvent.click(
        screen.getByRole("button", { name: /cerrar modal/i }),
      );

      await userEvent.click(
        screen.getByRole("button", { name: /añadir pokémon/i }),
      );

      expect(screen.getByTestId("poke-search")).toBeInTheDocument();
      expect(screen.queryByTestId("detail-step")).not.toBeInTheDocument();
    });
  });

  describe("renderizado de slots", () => {
    it("debería renderizar 6 slots siempre, ocupados y vacíos", () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo",
          pokemons: [pikachu, charmander, bulbasaur],
          createdAt: 1,
          updatedAt: 1,
        },
      });

      renderPage();

      expect(screen.getByAltText("pikachu")).toBeInTheDocument();
      expect(screen.getByAltText("charmander")).toBeInTheDocument();
      expect(screen.getByAltText("bulbasaur")).toBeInTheDocument();
    });

    it("debería ordenar pokémons por nombre cuando se elige sort 'name'", () => {
      resetStore({
        draftTeam: {
          id: "draft-team",
          name: "Equipo",
          pokemons: [pikachu, bulbasaur, charmander],
          createdAt: 1,
          updatedAt: 1,
        },
        draftPokemonSort: "name",
      });

      renderPage();

      const names = screen
        .getAllByRole("img")
        .map((img) => img.getAttribute("alt"));

      expect(names).toEqual(["bulbasaur", "charmander", "pikachu"]);
    });
  });
});
