import { PokeGrid } from "./PokeGrid";

const mockPokemons = [
  {
    id: 25,
    name: "pikachu",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  },
  {
    id: 6,
    name: "charizard",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  },
  {
    id: 9,
    name: "blastoise",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
  },
  {
    id: 3,
    name: "venusaur",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
  },
  {
    id: 94,
    name: "gengar",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
  },
  {
    id: 149,
    name: "dragonite",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
  },
  {
    id: 448,
    name: "lucario",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png",
  },
  {
    id: 282,
    name: "gardevoir",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png",
  },
];

export default {
  title: "Features/Pokemon/PokeGrid",
  component: PokeGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    pokemons: mockPokemons,
  },
};

export const Empty = {
  args: {
    pokemons: [],
  },
};
