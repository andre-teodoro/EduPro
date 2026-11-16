import { test, expect } from "@playwright/test";

test("idioma acompanha a troca entre Vue e React e as credenciais são interpoladas", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/vue/#/login");
  await expect(
    page.getByRole("heading", { name: "Welcome back", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Language", exact: true })
    .selectOption("es");
  await page
    .getByRole("button", { name: "Entrar en la demostración", exact: true })
    .click();
  await page.getByRole("link", { name: "Versión React", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Te damos la bienvenida", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Para probar: demo@edupro.local / edupro123", {
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/react-login-desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Entrar en la demostración", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Resumen", exact: true }),
  ).toBeVisible();
  await page
    .locator(".desktop-sidebar")
    .getByRole("combobox")
    .selectOption("en");
  await page.getByRole("link", { name: "Version Vue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Overview", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(errors).toEqual([]);
});
