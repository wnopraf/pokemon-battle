import { expect, test } from "@playwright/test";

import { mockPokeApi } from "./fixtures/pokeapi-mocks.js";
import {
  buildHistoryEntry,
  buildPokemon,
  buildTeam,
  seedStores,
} from "./fixtures/seed.js";

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

test.describe("edición de equipo", () => {
  test("permite renombrar un equipo y persistir el cambio", async ({
    page,
  }) => {
    await seedStores(page, { teams: [teamFire] });
    await mockPokeApi(page);

    await page.goto(`/teams/${teamFire.id}`);

    await expect(
      page.getByRole("heading", { name: /editar equipo/i }),
    ).toBeVisible();

    const nameInput = page.getByLabel(/nombre del equipo/i);
    await expect(nameInput).toHaveValue(teamFire.name);

    await nameInput.fill("Equipo Renombrado");

    await page.getByRole("button", { name: /guardar cambios/i }).click();

    await expect(page).toHaveURL(/\/teams$/);
    await expect(page.getByText("Equipo Renombrado")).toBeVisible();
  });
});

test.describe("combate end-to-end", () => {
  test("seleccionar dos equipos, iniciar combate y verlo en el historial", async ({
    page,
  }) => {
    await seedStores(page, { teams: [teamFire, teamWater] });
    await mockPokeApi(page);

    await page.goto("/battle");

    await expect(
      page.getByRole("heading", {
        name: /seleccionar equipos para el combate/i,
      }),
    ).toBeVisible();

    const selects = page.locator('[role="combobox"]');
    await selects.nth(0).click();
    await page.getByRole("option", { name: "Equipo Fuego" }).click();

    await selects.nth(1).click();
    await page.getByRole("option", { name: "Equipo Agua" }).click();

    const startButton = page.getByRole("button", { name: /comenzar combate/i });
    await expect(startButton).toBeEnabled();
    await startButton.click();

    await expect(page).toHaveURL("/battle/play");
    await expect(
      page.getByRole("heading", { name: /combate en curso/i }),
    ).toBeVisible();

    await page.waitForFunction(() => {
      const raw = window.localStorage.getItem("battle-store");
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        return (parsed?.state?.history?.length ?? 0) > 0;
      } catch {
        return false;
      }
    });

    await page
      .getByRole("link", { name: "Historial", exact: true })
      .click();

    await expect(page).toHaveURL("/battle-history");
    await expect(
      page.getByRole("heading", { name: /historial de combates/i }),
    ).toBeVisible();
    await expect(page.getByText(/1 combates registrados/i)).toBeVisible();

    const firstRow = page.locator("ul > li").first();
    await expect(firstRow).toContainText("Equipo Fuego");
    await expect(firstRow).toContainText("Equipo Agua");
  });
});

test.describe("revancha desde la home", () => {
  test("el banner muestra el último combate y el botón navega a /battle/play", async ({
    page,
  }) => {
    const lastEntry = buildHistoryEntry({
      id: "battle-last",
      winnerTeam: teamFire,
      loserTeam: teamWater,
      rounds: 7,
      winner: "A",
    });

    await seedStores(page, {
      teams: [teamFire, teamWater],
      history: [lastEntry],
    });
    await mockPokeApi(page);

    await page.goto("/");

    await expect(page.getByText(/último combate/i)).toBeVisible();
    await expect(page.getByText(/en 7 turnos/i)).toBeVisible();

    await page.getByRole("button", { name: /^revancha$/i }).click();

    await expect(page).toHaveURL("/battle/play");
    await expect(
      page.getByRole("heading", { name: /combate en curso/i }),
    ).toBeVisible();
  });

  test("la revancha se deshabilita si alguno de los equipos ya no existe", async ({
    page,
  }) => {
    const staleEntry = buildHistoryEntry({
      id: "battle-stale",
      winnerTeam: teamFire,
      loserTeam: { ...teamWater, id: "team-removed" },
      rounds: 5,
      winner: "A",
    });

    await seedStores(page, {
      teams: [teamFire],
      history: [staleEntry],
    });

    await page.goto("/");

    const rematchButton = page.getByRole("button", { name: /^revancha$/i });
    await expect(rematchButton).toBeDisabled();
    await expect(
      page.getByText(/uno de los equipos del combate ya no existe/i),
    ).toBeVisible();
  });
});

test.describe("historial de combates", () => {
  test("muestra estadísticas agregadas y la lista completa", async ({
    page,
  }) => {
    const history = [
      buildHistoryEntry({
        id: "b1",
        winnerTeam: teamFire,
        loserTeam: teamWater,
        rounds: 6,
        winner: "A",
      }),
      buildHistoryEntry({
        id: "b2",
        winnerTeam: teamFire,
        loserTeam: teamWater,
        rounds: 8,
        winner: "A",
      }),
      buildHistoryEntry({
        id: "b3",
        winnerTeam: teamWater,
        loserTeam: teamFire,
        rounds: 10,
        winner: "B",
      }),
    ];

    await seedStores(page, { teams: [teamFire, teamWater], history });
    await page.goto("/battle-history");

    await expect(page.getByText(/3 combates registrados/i)).toBeVisible();
    await expect(page.getByText(/equipo fuego · 2/i)).toBeVisible();
    await expect(page.locator("ul > li")).toHaveCount(3);
  });

  test("permite limpiar el historial con confirmación", async ({ page }) => {
    const history = [
      buildHistoryEntry({
        id: "b1",
        winnerTeam: teamFire,
        loserTeam: teamWater,
        rounds: 5,
        winner: "A",
      }),
    ];

    await seedStores(page, { teams: [teamFire, teamWater], history });
    await page.goto("/battle-history");

    await page.getByRole("button", { name: /limpiar historial/i }).click();

    await expect(
      page.getByRole("heading", { name: /¿borrar el historial\?/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: /^borrar historial$/i }).click();

    await expect(
      page.getByText(/aún no has jugado ningún combate/i),
    ).toBeVisible();
  });

  test("estado vacío con CTA cuando no hay historial", async ({ page }) => {
    await seedStores(page, { teams: [], history: [] });
    await page.goto("/battle-history");

    await expect(
      page.getByText(/aún no has jugado ningún combate/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /iniciar un combate/i }),
    ).toBeVisible();
  });
});
