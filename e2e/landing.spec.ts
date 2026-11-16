import { test, expect } from "@playwright/test";

test("entrada: inglês por padrão e idioma compartilhado com Vue e React", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByText("Frontend portfolio", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Language", exact: true }),
  ).toHaveValue("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("combobox").selectOption("pt-BR");
  await expect(
    page.getByText("Portfólio frontend", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Idioma", exact: true }),
  ).toHaveValue("pt-BR");
  await page
    .getByRole("link", { name: "Explorar em Vue", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Bem-vindo de volta", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Idioma", exact: true })
    .selectOption("es");
  await page.goBack();
  await expect(
    page.getByText("Portafolio frontend", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Idioma", exact: true }),
  ).toHaveValue("es");
  await page
    .getByRole("link", { name: "Explorar en React", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Te damos la bienvenida", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("entrada: seletor mobile funciona mesmo sem acesso ao storage", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage unavailable", "SecurityError");
      },
    });
  });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("combobox", { name: "Language", exact: true }),
  ).toHaveValue("en");
  await page.getByRole("combobox").selectOption("es");
  await expect(
    page.getByRole("link", { name: "Explorar en Vue", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/landing-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
