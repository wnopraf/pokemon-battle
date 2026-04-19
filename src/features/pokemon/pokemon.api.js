const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export const getPokemon = async (name) => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Pokemon ${name} not found`);
  }
  return response.json();
};

export const getPokemonList = async (limit = 20, offset = 0) => {
  const response = await fetch(
    `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch pokemon list");
  }
  return response.json();
};

export const getPokemonTypes = async () => {
  const response = await fetch(`${POKEAPI_BASE_URL}/type`);
  if (!response.ok) {
    throw new Error("Failed to fetch pokemon types");
  }
  return response.json();
};
