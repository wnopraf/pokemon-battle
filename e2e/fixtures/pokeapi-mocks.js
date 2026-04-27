const MOCK_POKEMONS = [
  { id: 25, name: "pikachu", attack: 55, defense: 40, speed: 90, types: ["electric"] },
  { id: 6, name: "charizard", attack: 84, defense: 78, speed: 100, types: ["fire", "flying"] },
  { id: 9, name: "blastoise", attack: 83, defense: 100, speed: 78, types: ["water"] },
  { id: 3, name: "venusaur", attack: 82, defense: 83, speed: 80, types: ["grass", "poison"] },
  { id: 150, name: "mewtwo", attack: 110, defense: 90, speed: 130, types: ["psychic"] },
];

const MOCK_TYPES = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "flying",
  "poison",
];

function buildPokemonDetailPayload(p) {
  return {
    id: p.id,
    name: p.name,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
    },
    stats: [
      { stat: { name: "attack" }, base_stat: p.attack },
      { stat: { name: "defense" }, base_stat: p.defense },
      { stat: { name: "speed" }, base_stat: p.speed },
    ],
    types: p.types.map((t) => ({ type: { name: t } })),
  };
}

function buildPokemonListPayload() {
  return {
    count: MOCK_POKEMONS.length,
    next: null,
    previous: null,
    results: MOCK_POKEMONS.map((p) => ({
      name: p.name,
      url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
    })),
  };
}

function buildTypeListPayload() {
  return {
    count: MOCK_TYPES.length,
    results: MOCK_TYPES.map((t) => ({
      name: t,
      url: `https://pokeapi.co/api/v2/type/${t}`,
    })),
  };
}

function buildPokemonByTypePayload(type) {
  const matching = MOCK_POKEMONS.filter((p) => p.types.includes(type));
  return {
    pokemon: matching.map((p) => ({
      pokemon: {
        name: p.name,
        url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
      },
    })),
  };
}

export async function mockPokeApi(page) {
  await page.route("**/pokeapi.co/api/v2/pokemon?**", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildPokemonListPayload()),
    });
  });

  await page.route("**/pokeapi.co/api/v2/pokemon/*", (route) => {
    const url = route.request().url();
    const name = decodeURIComponent(url.split("/").filter(Boolean).pop());
    const pokemon = MOCK_POKEMONS.find(
      (p) => p.name === name || String(p.id) === name,
    );

    if (!pokemon) {
      return route.fulfill({ status: 404, body: "Not found" });
    }

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildPokemonDetailPayload(pokemon)),
    });
  });

  await page.route("**/pokeapi.co/api/v2/type", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildTypeListPayload()),
    });
  });

  await page.route("**/pokeapi.co/api/v2/type/*", (route) => {
    const url = route.request().url();
    const type = url.split("/").filter(Boolean).pop();
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(buildPokemonByTypePayload(type)),
    });
  });

  await page.route("**/raw.githubusercontent.com/**", (route) => {
    route.fulfill({ status: 200, contentType: "image/png", body: "" });
  });
}

export { MOCK_POKEMONS };
