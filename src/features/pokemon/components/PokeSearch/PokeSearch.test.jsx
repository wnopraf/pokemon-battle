import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PokeSearch } from "./PokeSearch";
import { PokemonFeatureProvider } from "@/features/pokemon/providers";

import { usePokemonSearch } from "../../hooks/usePokemonSearch";

jest.mock("../../hooks/usePokemonSearch");

const mockPokemons = [
  { id: 1, name: "bulbasaur", types: ["grass", "poison"], image: "bulbasaur.png" },
  { id: 2, name: "charmander", types: ["fire"], image: "charmander.png" },
  { id: 3, name: "squirtle", types: ["water"], image: "squirtle.png" },
  { id: 4, name: "ivysaur", types: ["grass", "poison"], image: "ivysaur.png" },
];

const mockTypes = ["grass", "fire", "water", "poison", "electric"];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <PokemonFeatureProvider onSelectPokemon={jest.fn()}>
        {children}
      </PokemonFeatureProvider>
    </QueryClientProvider>
  );
}

describe("PokeSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("renderización inicial", () => {
    it("debería renderizar el componente con los controles de búsqueda", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      expect(screen.getByPlaceholderText(/buscar pokémon por nombre/i)).toBeInTheDocument();
      expect(screen.getByText(/encuentra el próximo pokémon/i)).toBeInTheDocument();
      expect(screen.getByText(/filtrar por tipo/i)).toBeInTheDocument();
    });

    it("debería mostrar skeleton de tipos mientras carga", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: [],
        results: [],
        isLoadingPokemons: false,
        isLoadingTypes: true,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const skeletons = document.querySelectorAll('[data-slot="skeleton"], .animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("búsqueda por nombre", () => {
    it("debería actualizar el término de búsqueda al escribir", async () => {
      const setSearchTerm = jest.fn();
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm,
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });
      const searchInput = screen.getByPlaceholderText(/buscar pokémon por nombre/i);

      await userEvent.type(searchInput, "b");

      expect(setSearchTerm).toHaveBeenCalledWith("b");
    });

    it("debería mostrar resultados filtrados por nombre", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "bulba",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: [mockPokemons[0], mockPokemons[3]],
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("ivysaur")).toBeInTheDocument();
      expect(screen.queryByText("charmander")).not.toBeInTheDocument();
    });

    it("debería mostrar mensaje cuando no hay resultados de búsqueda", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "xyz",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: [],
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });
  });

  describe("filtrado por tipo (Select)", () => {
    it("debería mostrar el Select de tipo", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const selectTrigger = screen.getByRole("combobox");
      expect(selectTrigger).toBeInTheDocument();
    });

    it("debería mostrar 'all' como valor por defecto cuando no hay tipo seleccionado", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const hiddenInput = document.querySelector('input[aria-hidden="true"]');
      expect(hiddenInput).toHaveValue("all");
    });

    it("debería reflejar el tipo seleccionado en el valor del Select", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "fire",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const hiddenInput = document.querySelector('input[aria-hidden="true"]');
      expect(hiddenInput).toHaveValue("fire");
    });
  });

  describe("filtrado por tipo (botones rápidos)", () => {
    it("debería mostrar botones de tipo", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      expect(screen.getByRole("button", { name: /todos/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /grass/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /fire/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /water/i })).toBeInTheDocument();
    });

    it("debería llamar a setSelectedType al hacer clic en un botón de tipo", async () => {
      const setSelectedType = jest.fn();
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType,
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const grassButton = screen.getByRole("button", { name: /grass/i });
      await userEvent.click(grassButton);

      expect(setSelectedType).toHaveBeenCalledWith("grass");
    });

    it("debería llamar a setSelectedType con vacío al hacer clic en 'Todos'", async () => {
      const setSelectedType = jest.fn();
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "grass",
        setSelectedType,
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const allButton = screen.getByRole("button", { name: /todos/i });
      await userEvent.click(allButton);

      expect(setSelectedType).toHaveBeenCalledWith("");
    });

    it("debería mostrar el botón de tipo seleccionado como default", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "fire",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const fireButton = screen.getByRole("button", { name: /fire/i });
      const grassButton = screen.getByRole("button", { name: /grass/i });
      const allButton = screen.getByRole("button", { name: /todos/i });

      expect(fireButton).toHaveClass("bg-primary");
      expect(grassButton).not.toHaveClass("bg-primary");
      expect(allButton).not.toHaveClass("bg-primary");
    });
  });

  describe("combinación de búsqueda y tipo", () => {
    it("debería mostrar resultados filtrados por ambos criterios", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "saur",
        setSearchTerm: jest.fn(),
        selectedType: "grass",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: [mockPokemons[0], mockPokemons[3]],
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("ivysaur")).toBeInTheDocument();
      expect(screen.queryByText("charmander")).not.toBeInTheDocument();
      expect(screen.queryByText("squirtle")).not.toBeInTheDocument();
    });
  });

  describe("estados de carga", () => {
    it("debería mostrar skeleton de pokemons mientras carga", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: [],
        isLoadingPokemons: true,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      const skeletons = document.querySelectorAll('[data-slot="skeleton"], .animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("estado de error", () => {
    it("debería mostrar mensaje de error cuando falla la carga", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: [],
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: true,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      expect(screen.getByText(/no se pudieron cargar los pokémon/i)).toBeInTheDocument();
    });
  });

  describe("selección de Pokémon", () => {
    it("debería disparar onSelectPokemon al hacer clic en una card", async () => {
      const onSelectPokemon = jest.fn();
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      render(
        <QueryClientProvider client={queryClient}>
          <PokemonFeatureProvider onSelectPokemon={onSelectPokemon}>
            <PokeSearch />
          </PokemonFeatureProvider>
        </QueryClientProvider>,
      );

      const bulbasaurCard = screen.getByText("bulbasaur");
      await userEvent.click(bulbasaurCard);

      expect(onSelectPokemon).toHaveBeenCalledWith(
        expect.objectContaining({ name: "bulbasaur" }),
      );
    });
  });

  describe("limpiar filtros", () => {
    it("debería mostrar todos los pokemons cuando no hay filtros", () => {
      usePokemonSearch.mockReturnValue({
        searchTerm: "",
        setSearchTerm: jest.fn(),
        selectedType: "",
        setSelectedType: jest.fn(),
        types: mockTypes,
        results: mockPokemons,
        isLoadingPokemons: false,
        isLoadingTypes: false,
        isError: false,
      });

      render(<PokeSearch />, { wrapper: createWrapper() });

      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("charmander")).toBeInTheDocument();
      expect(screen.getByText("squirtle")).toBeInTheDocument();
      expect(screen.getByText("ivysaur")).toBeInTheDocument();
    });
  });
});
