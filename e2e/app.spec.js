import { expect, test } from "@playwright/test";

import { buildPokemon, buildTeam, seedStores } from "./fixtures/seed.js";

const teamFire = buildTeam({
  id: "team-fire",
  name: "Equipo Fuego",
  pokemons: [
    buildPokemon({ id: 6, name: "charizard", attack: 84, defense: 78, speed: 100, types: ["fire"] }),
    buildPokemon({ id: 150, name: "mewtwo", attack: 110, defense: 90, speed: 130, types: ["psychic"] }),
  ],
});

const teamWater = buildTeam({
  id: "team-water",
  name: "Equipo Agua",
  pokemons: [
    buildPokemon({ id: 9, name: "blastoise", attack: 83, defense: 100, speed: 78, types: ["water"] }),
    buildPokemon({ id: 3, name: "venusaur", attack: 82, defense: 83, speed: 80, types: ["grass"] }),
  ],
});

test.describe("home & navegación", () => {
  test("muestra estado vacío cuando no hay equipos ni historial", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /domina el combate/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/empieza creando tu primer equipo/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /crear mi primer equipo/i }),
    ).toBeVisible();
  });

  test("el logo de la cabecera vuelve a la home", async ({ page }) => {
    await page.goto("/teams");
    await page.getByRole("link", { name: /pokebattle/i }).click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: /domina el combate/i }),
    ).toBeVisible();
  });

  test("la navegación lateral lleva a cada sección", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /equipos/i }).click();
    await expect(page).toHaveURL("/teams");
    await expect(
      page.getByRole("heading", { name: /mis equipos/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: /combate/i }).click();
    await expect(page).toHaveURL("/battle");

    await page.getByRole("link", { name: /historial/i }).click();
    await expect(page).toHaveURL("/battle-history");
    await expect(
      page.getByRole("heading", { name: /historial de combates/i }),
    ).toBeVisible();
  });
});

test.describe("persistencia", () => {
  test("los equipos sembrados se mantienen tras recargar", async ({
    page,
  }) => {
    await seedStores(page, { teams: [teamFire, teamWater] });
    await page.goto("/teams");

    await expect(page.getByText("Equipo Fuego")).toBeVisible();
    await expect(page.getByText("Equipo Agua")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Equipo Fuego")).toBeVisible();
    await expect(page.getByText("Equipo Agua")).toBeVisible();
  });
});
