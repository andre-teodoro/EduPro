import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

for (const framework of ["vue", "react"]) {
  test(`${framework}: localized subject editing, validation and persistence`, async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("edupro:locale", "en"));
    await page.goto(`/${framework}/#/subjects`);
    await page
      .getByRole("button", { name: "Try the demo", exact: true })
      .click();
    await page
      .getByRole("button", { name: "New subject", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Name", { exact: true })
      .fill("Accessible Interfaces");
    await dialog
      .getByLabel("Description", { exact: true })
      .fill("Inclusive interfaces for everyone.");
    await dialog.getByLabel("Information Systems", { exact: true }).check();
    await dialog.getByRole("tab", { name: /^Portugu\u00eas:/ }).click();
    await expect(
      dialog.getByLabel("Sistemas de Informa\u00e7\u00e3o", { exact: true }),
    ).toBeChecked();
    await dialog
      .getByLabel("Name", { exact: true })
      .fill("Interfaces Acess\u00edveis");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      dialog.getByLabel("Description", { exact: true }),
    ).toBeFocused();
    await dialog
      .getByLabel("Description", { exact: true })
      .fill("Interfaces inclusivas para todos.");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await page.getByRole("searchbox").fill("Accessible Interfaces");
    await expect(
      page
        .getByRole("button", { name: "Accessible Interfaces", exact: true })
        .first(),
    ).toBeVisible();
    await page.reload();
    await page.getByRole("searchbox").fill("Accessible Interfaces");
    await page
      .getByRole("button", { name: "Edit: Accessible Interfaces", exact: true })
      .first()
      .click();
    await dialog.getByRole("tab", { name: /^Portugu\u00eas:/ }).click();
    await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
      "Interfaces Acess\u00edveis",
    );
    await expect(
      dialog.getByLabel("Sistemas de Informa\u00e7\u00e3o", { exact: true }),
    ).toBeChecked();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("edupro:school:v1")!),
    );
    const subject = stored.subjects.find(
      (item: { name: string }) => item.name === "Accessible Interfaces",
    );
    expect(subject.courseIds).toEqual(["c1"]);
    expect(Object.keys(subject.content.translations).sort()).toEqual([
      "en",
      "pt-BR",
    ]);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    const other = framework === "vue" ? "react" : "vue";
    await page.goto(`/${other}/#/subjects`);
    await page
      .getByRole("button", { name: "Try the demo", exact: true })
      .click();
    await page.getByRole("searchbox").fill("Accessible Interfaces");
    await page
      .getByRole("button", { name: "Edit: Accessible Interfaces", exact: true })
      .first()
      .click();
    await dialog.getByRole("tab", { name: /^Portugu\u00eas:/ }).click();
    await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
      "Interfaces Acess\u00edveis",
    );
    await expect(
      dialog.getByLabel("Sistemas de Informa\u00e7\u00e3o", { exact: true }),
    ).toBeChecked();
  });

  test(`${framework}: course editing on mobile and translated relationships across pages`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addInitScript(() => localStorage.setItem("edupro:locale", "en"));
    await page.goto(`/${framework}/#/courses`);
    await page
      .getByRole("button", { name: "Try the demo", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Edit: Information Systems", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Name", { exact: true })
      .fill("Information Technology");
    await dialog.getByRole("tab", { name: /^Portugu\u00eas:/ }).click();
    await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
      "Sistemas de Informa\u00e7\u00e3o",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/${framework}-course-translations-mobile.png`,
      fullPage: true,
    });
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await page.goto(`/${framework}/#/students`);
    await expect(
      page
        .locator(".record-card")
        .getByText("Information Technology", { exact: true })
        .first(),
    ).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 900 });
    await page
      .getByRole("combobox", { name: "Language", exact: true })
      .selectOption("pt-BR");
    await expect(
      page
        .locator(".data-table")
        .getByText("Sistemas de Informa\u00e7\u00e3o", { exact: true })
        .first(),
    ).toBeVisible();
    await expect(
      page.getByText("Information Technology", { exact: true }),
    ).toHaveCount(0);
  });

  test(`${framework}: legacy custom content requires source language confirmation`, async ({
    page,
  }) => {
    const read = (name: string) =>
      JSON.parse(readFileSync(`packages/data/src/${name}.json`, "utf8"));
    const legacy = {
      version: 1,
      courses: read("courses"),
      subjects: read("subjects"),
      students: read("students"),
      enrollments: read("enrollments"),
      confirmations: [],
    };
    const custom = { ...legacy.courses[0], name: "Legacy custom course" };
    const { content: _content, ...oldCourse } = custom;
    const data = {
      ...legacy,
      courses: [oldCourse, ...legacy.courses.slice(1)],
    };
    await page.addInitScript((value) => {
      localStorage.setItem("edupro:locale", "en");
      localStorage.setItem("edupro:school:v1", JSON.stringify(value));
    }, data);
    await page.goto(`/${framework}/#/courses`);
    await page
      .getByRole("button", { name: "Try the demo", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Edit: Legacy custom course", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      dialog.getByLabel("Source language", { exact: true }),
    ).toBeFocused();
    await dialog
      .getByLabel("Source language", { exact: true })
      .selectOption("pt-BR");
    await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(
      "Legacy custom course",
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).not.toBeVisible();
  });
}
