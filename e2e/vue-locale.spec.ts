import { test, expect } from "@playwright/test";

for (const framework of ["vue", "react"]) {
  test(`${framework}: idiomas persistentes e sidebar sem rolagem horizontal`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${framework}/#/login`);
    await expect(
      page.getByRole("combobox", { name: "Language", exact: true }),
    ).toHaveValue("en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", { name: "Welcome back", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(
      page.getByText("Enter your email.", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Try the demo", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Overview", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Overview", exact: true }),
    ).toBeVisible();
    const sidebar = page.locator(".desktop-sidebar");
    for (const width of [1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 720 });
      for (const [code, heading] of [
        ["pt-BR", "Visão geral"],
        ["en", "Overview"],
        ["es", "Resumen"],
      ]) {
        await sidebar.getByRole("combobox").selectOption(code);
        await expect(
          page.getByRole("heading", { name: heading, exact: true }),
        ).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("lang", code);
        const dimensions = await sidebar.evaluate((element) => ({
          client: element.clientWidth,
          scroll: element.scrollWidth,
        }));
        expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
      }
    }
    await sidebar.getByRole("combobox").selectOption("en");
    await page.getByRole("link", { name: "Courses", exact: true }).click();
    await page
      .getByRole("button", {
        name: "Information Systems",
        exact: true,
      })
      .first()
      .click();
    await expect(
      page.locator(".record-details").getByText("2/1/2026", { exact: true }),
    ).toBeVisible();
    await sidebar.getByRole("combobox").selectOption("pt-BR");
    await expect(
      page.locator(".record-details").getByText("01/02/2026", { exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      sidebar.getByRole("combobox", { name: "Idioma", exact: true }),
    ).toHaveValue("pt-BR");
    await expect(
      page.getByRole("heading", { name: "Cursos", exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: `test-results/${framework}-sidebar-locale.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });

  test(`${framework}: seletor no mobile e login a partir de 320 px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(`/${framework}/#/login`);
    await expect(
      page.getByRole("heading", { name: "Welcome back", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("combobox", { name: "Language", exact: true })
      .selectOption("es");
    await page
      .getByRole("button", { name: "Entrar en la demostración", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Abrir menú de navegación", exact: true })
      .click();
    const menu = page.getByRole("dialog");
    await menu
      .getByRole("combobox", { name: "Idioma", exact: true })
      .selectOption("en");
    await expect(
      menu.getByRole("link", { name: "Overview", exact: true }),
    ).toBeVisible();
    expect(
      await menu
        .locator(".sidebar")
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/${framework}-menu-locale-mobile.png`,
      fullPage: true,
    });
    await menu.getByRole("button", { name: "Close", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Overview", exact: true }),
    ).toBeVisible();
  });
}
