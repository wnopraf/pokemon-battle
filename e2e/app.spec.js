import { expect, test } from "@playwright/test";

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
