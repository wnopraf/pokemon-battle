export function buildPokemon(overrides = {}) {
  return {
    id: 25,
    name: "pikachu",
    image: "",
    attack: 55,
    defense: 40,
    speed: 90,
    types: ["electric"],
    ...overrides,
  };
}

export function buildTeam({ id, name, pokemons = [] }) {
  const now = Date.now();
  return {
    id,
    name,
    pokemons,
    createdAt: now,
    updatedAt: now,
  };
}

export async function seedStores(page, { teams = [], history = [] } = {}) {
  await page.addInitScript(
    ({ teams, history }) => {
      const teamsPayload = {
        state: {
          teams,
          draftTeam: {
            id: `draft-${Date.now()}`,
            name: "",
            pokemons: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        version: 1,
      };

      const battlePayload = {
        state: { history },
        version: 1,
      };

      if (!window.localStorage.getItem("teams-store")) {
        window.localStorage.setItem(
          "teams-store",
          JSON.stringify(teamsPayload),
        );
      }
      if (!window.localStorage.getItem("battle-store")) {
        window.localStorage.setItem(
          "battle-store",
          JSON.stringify(battlePayload),
        );
      }
    },
    { teams, history },
  );
}
