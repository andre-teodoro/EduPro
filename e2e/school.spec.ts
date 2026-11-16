import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("edupro:locale", "pt-BR"),
  );
});

for (const framework of ["vue", "react"]) {
  test(`${framework}: disciplina compartilhada entre cursos`, async ({
    page,
  }) => {
    await visit(page, `/${framework}/#/subjects`);
    await page
      .getByRole("button", { name: "Nova disciplina", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Nome", { exact: true })
      .fill("Acessibilidade Digital");
    await dialog
      .getByLabel("Descrição", { exact: true })
      .fill("Interfaces inclusivas para todos.");
    await dialog.getByLabel("Carga horária (h)", { exact: true }).fill("40");
    await dialog.getByLabel("Sistemas de Informação", { exact: true }).check();
    await dialog.getByLabel("Design Digital", { exact: true }).check();
    await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
    await page.getByRole("searchbox").fill("Acessibilidade");
    await page
      .getByRole("button", { name: "Acessibilidade Digital", exact: true })
      .first()
      .click();
    await expect(
      page
        .locator(".record-details")
        .getByText("Sistemas de Informação", { exact: true }),
    ).toBeVisible();
    await expect(
      page
        .locator(".record-details")
        .getByText("Design Digital", { exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", {
        name: "Excluir: Acessibilidade Digital",
        exact: true,
      })
      .first()
      .click();
    await dialog
      .getByRole("button", { name: "Confirmar", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Nenhum registro encontrado" }),
    ).toBeVisible();
  });

  test(`${framework}: cadastro, edição, matrícula, persistência e restauração`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await visit(page, `/${framework}/`);
    await expect(
      page.getByRole("heading", { name: "Visão geral", exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Cursos", exact: true }).click();
    await page.getByRole("button", { name: "Novo curso", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Nome", { exact: true }).fill("Curso de Portfólio");
    await dialog
      .getByLabel("Descrição", { exact: true })
      .fill("Curso para validar o fluxo da demonstração.");
    await dialog.getByLabel("Carga horária (h)", { exact: true }).fill("120");
    await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await page.getByRole("searchbox").fill("Curso de Portfólio");
    await expect(
      page
        .getByRole("button", { name: "Curso de Portfólio", exact: true })
        .first(),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Editar: Curso de Portfólio", exact: true })
      .first()
      .click();
    await dialog
      .getByLabel("Nome", { exact: true })
      .fill("Curso de Portfólio Editado");
    await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
    await page.reload();
    await page.getByRole("searchbox").fill("Portfólio Editado");
    await expect(
      page
        .getByRole("button", {
          name: "Curso de Portfólio Editado",
          exact: true,
        })
        .first(),
    ).toBeVisible();
    await page.getByRole("link", { name: "Alunos", exact: true }).click();
    await page.getByRole("button", { name: "Novo aluno", exact: true }).click();
    await dialog.getByLabel("Nome", { exact: true }).fill("Aluno do Portfólio");
    await dialog.getByLabel("CPF", { exact: true }).fill("52998224725");
    await dialog
      .getByLabel("Data de nascimento", { exact: true })
      .fill("2000-01-01");
    await dialog
      .getByLabel("E-mail", { exact: true })
      .fill("portfolio@example.com");
    await dialog
      .getByLabel("Curso de Portfólio Editado", { exact: true })
      .check();
    await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await page.getByRole("searchbox").fill("529.982.247-25");
    await expect(
      page
        .getByRole("button", { name: "Aluno do Portfólio", exact: true })
        .first(),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Confirmações", exact: true })
      .click();
    await expect(
      dialog.getByText("portfolio@example.com", { exact: false }),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Fechar", exact: true }).click();
    await page.getByRole("link", { name: "Cursos", exact: true }).click();
    await page.getByRole("searchbox").fill("Portfólio Editado");
    await page
      .getByRole("button", {
        name: "Excluir: Curso de Portfólio Editado",
        exact: true,
      })
      .first()
      .click();
    await dialog
      .getByRole("button", { name: "Confirmar", exact: true })
      .click();
    await expect(dialog.getByRole("alert")).toContainText(
      "matrículas vinculadas",
    );
    await dialog.getByRole("button", { name: "Cancelar", exact: true }).click();
    await page
      .getByRole("button", { name: "Restaurar demonstração", exact: true })
      .click();
    await dialog
      .getByRole("button", { name: "Confirmar", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Cursos", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Nenhum registro encontrado",
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Limpar filtros", exact: true })
      .click();
    await expect(
      page
        .getByRole("button", { name: "Sistemas de Informação", exact: true })
        .first(),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${framework}: mobile, menu acessível e links diretos`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await visit(page, `/${framework}/#/students/st1`);
    await expect(page.locator(".record-details")).toBeVisible();
    await expect(
      page
        .locator(".record-details")
        .getByRole("heading", { name: "Ana Beatriz Costa", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page
      .getByRole("button", { name: "Abrir menu de navegação", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "Cursos", exact: true })
      .click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Cursos", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".mobile-cards")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/${framework}-mobile.png`,
      fullPage: true,
    });
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Cursos", exact: true }),
    ).toBeVisible();
  });
}

test("dados compartilhados ao alternar de Vue para React", async ({ page }) => {
  await visit(page, "/vue/#/enrollments");
  await page
    .getByRole("button", {
      name: "Trancar matrícula: Ana Beatriz Costa",
      exact: true,
    })
    .first()
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Confirmar", exact: true })
    .click();
  await visit(page, "/react/#/enrollments");
  await expect(
    page
      .getByRole("button", {
        name: "Reativar matrícula: Ana Beatriz Costa",
        exact: true,
      })
      .first(),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/react-desktop.png",
    fullPage: true,
  });
});

test("tema e navegação por teclado entre as versões", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await visit(page, "/vue/");
  await page.getByRole("button", { name: "Tema escuro", exact: true }).click();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.getByRole("link", { name: "Versão React", exact: true }).click();
  await authenticateIfNeeded(page);
  await expect(
    page.getByRole("heading", { name: "Visão geral", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveClass("dark");
  await page.screenshot({
    path: "test-results/react-dashboard-dark.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Tema claro", exact: true }).click();
  await page.getByRole("link", { name: "Versão Vue", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass("dark");
  await page.screenshot({
    path: "test-results/vue-dashboard.png",
    fullPage: true,
  });
  await page.keyboard.press("Tab");
  await page
    .getByRole("link", { name: "Ir para o conteúdo", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Visão geral", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

async function visit(page: Page, path: string) {
  await page.goto(path);
  await authenticateIfNeeded(page);
}

async function authenticateIfNeeded(page: Page) {
  await page
    .locator("#login-title, #page-title, #dashboard-title")
    .first()
    .waitFor({ state: "attached" });
  if (page.url().includes("#/login")) {
    await page
      .getByRole("button", { name: "Entrar na demonstração", exact: true })
      .click();
    await expect(page.locator("#login-title")).not.toBeVisible();
  }
}
