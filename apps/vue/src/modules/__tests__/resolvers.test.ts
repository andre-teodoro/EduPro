import { describe, it, expect } from "vitest";
import { seed } from "@edupro/data";
import { CourseResolver } from "../courses/resolvers/CourseResolver";
import { StudentResolver } from "../students/resolvers/StudentResolver";
import { SubjectResolver } from "../subjects/resolvers/SubjectResolver";
import { EnrollmentResolver } from "../enrollments/resolvers/EnrollmentResolver";
import { DashboardResolver } from "../dashboard/resolvers/DashboardResolver";
import { AuthResolver } from "../auth/resolvers/AuthResolver";

describe("resolvers dos módulos Vue", () => {
  it("resolve cursos com seus alunos e disciplinas sem alterar os dados", () => {
    const data = structuredClone(seed);
    const before = structuredClone(data);
    const row = CourseResolver.resolveList(data)[0];
    const details = CourseResolver.details(data, row);
    expect(
      details.sections[0].items.some(
        (item) => item.name === "Ana Beatriz Costa",
      ),
    ).toBe(true);
    expect(
      details.sections[1].items.some((item) =>
        item.name.includes("Design de Interfaces"),
      ),
    ).toBe(true);
    expect(data).toEqual(before);
  });
  it("resolve aluno com CPF formatado e todos os vínculos acadêmicos", () => {
    const row = StudentResolver.resolveList(seed)[0];
    expect(row.subtitle).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    expect(row.courseNames).toEqual([
      "Sistemas de Informação",
      "Design Digital",
    ]);
    expect(StudentResolver.details(seed, row).sections[0].items).toHaveLength(
      2,
    );
    expect(StudentResolver.form(false).showCourses).toBe(true);
    expect(StudentResolver.form(true).showCourses).toBe(false);
  });
  it("resolve disciplinas compartilhadas com todas as associações", () => {
    const row = SubjectResolver.resolveList(seed)[0];
    expect(row.courseNames).toHaveLength(3);
    expect(
      SubjectResolver.details(seed, row).sections[0].items.map(
        (item) => item.id,
      ),
    ).toEqual(row.courseIds);
  });
  it("resolve a ação de matrícula conforme o estado atual, sem tradução antecipada", () => {
    const rows = EnrollmentResolver.resolveList(seed);
    expect(EnrollmentResolver.confirmation(rows[0]).title).toBe(
      "confirmSuspend",
    );
    expect(EnrollmentResolver.confirmation(rows[3]).title).toBe(
      "confirmResume",
    );
    expect(
      EnrollmentResolver.details(seed, rows[3]).fields.find(
        (field) => field.label === "status",
      )?.status,
    ).toBe("suspended");
  });
  it("calcula indicadores, ordem recente e barras vazias sem divisão por zero", () => {
    const stats = DashboardResolver.resolve(seed);
    expect(stats.totals).toEqual([6, 12, 8, 11]);
    expect(stats.recent[0].id).toBe("e13");
    const empty = DashboardResolver.resolve({
      ...structuredClone(seed),
      enrollments: [],
    });
    expect(empty.courses.every((course) => course.percentage === 0)).toBe(true);
  });
});

describe("autenticação de demonstração", () => {
  it("retorna chaves de validação para e-mail e senha", () => {
    expect(AuthResolver.validate({ email: "", password: "" })).toEqual({
      email: "auth.emailRequired",
      password: "auth.passwordRequired",
    });
    expect(
      AuthResolver.validate({ email: "invalido", password: "teste" }).email,
    ).toBe("auth.emailInvalid");
    expect(
      AuthResolver.validate({ email: "demo@example.com", password: "teste" }),
    ).toEqual({ email: undefined, password: undefined });
  });
  it("mantém links internos válidos e rejeita redirecionamento externo ou para login", () => {
    expect(AuthResolver.destination("/students/st1")).toBe("/students/st1");
    for (const value of [
      "https://example.com",
      "//example.com",
      "/login",
      "/\\example.com",
      ["courses"],
      undefined,
    ])
      expect(AuthResolver.destination(value)).toBe("/");
  });
});
