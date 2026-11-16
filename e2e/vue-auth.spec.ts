import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("edupro:locale", "pt-BR"),
  );
});

for (const framework of ["vue", "react"]) {
  test(`${framework}: login, validação, sessão da aba, redirecionamento e saída`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${framework}/#/students/st1`);
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(
      page.getByText("Informe seu e-mail.", { exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("E-mail", { exact: true })).toBeFocused();
    await page.getByLabel("E-mail", { exact: true }).fill("email-invalido");
    await page.getByLabel("Senha", { exact: true }).fill("senha-ficticia");
    await page
      .getByRole("button", { name: "Mostrar senha", exact: true })
      .click();
    await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
      "type",
      "text",
    );
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(
      page.getByText("Informe um e-mail válido.", { exact: true }),
    ).toBeVisible();
    await page
      .getByLabel("E-mail", { exact: true })
      .fill("secretaria@example.com");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(
      page
        .locator(".record-details")
        .getByRole("heading", { name: "Ana Beatriz Costa", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        (key) => sessionStorage.getItem(key),
        `edupro:${framework}:session`,
      ),
    ).toBe("secretaria@example.com");
    expect(
      await page.evaluate(() =>
        JSON.stringify({ ...sessionStorage, ...localStorage }),
      ),
    ).not.toContain("senha-ficticia");
    await page.reload();
    await expect(page.locator(".record-details")).toBeVisible();
    await page.getByRole("link", { name: "Cursos", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Cursos", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Sair da demonstração", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta", exact: true }),
    ).toBeVisible();
    await page.goBack();
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta", exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${framework}: login responsivo e acesso demonstrativo sem dados reais`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${framework}/#/login`);
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/${framework}-login-mobile.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Entrar na demonstração", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Visão geral", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Abrir menu de navegação", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Sair da demonstração", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Bem-vindo de volta", exact: true }),
    ).toBeVisible();
  });
}
