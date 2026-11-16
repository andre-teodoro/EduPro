import { describe, it, expect } from "vitest";
import { messages } from "./index";
import { normalizeLocale } from "./types";
import { RecordResolver } from "@/resolvers/RecordResolver";
import { formatDate } from "@edupro/domain";

function flatten(value: object, prefix = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof item === "string"
        ? [[path, item]]
        : Object.entries(flatten(item, path));
    }),
  );
}
describe("idiomas do Vue", () => {
  it("inclui todas as traduções e preserva os parâmetros de interpolação", () => {
    const source = flatten(messages["pt-BR"]);
    for (const language of [messages.en, messages.es]) {
      const translated = flatten(language);
      expect(Object.keys(translated).sort()).toEqual(
        Object.keys(source).sort(),
      );
      for (const [key, value] of Object.entries(source)) {
        expect(translated[key].trim().length).toBeGreaterThan(0);
        expect(translated[key].match(/\{\w+\}/g) ?? []).toEqual(
          value.match(/\{\w+\}/g) ?? [],
        );
      }
    }
  });
  it("recupera inglês quando a preferência salva não é suportada", () => {
    expect(normalizeLocale("invalido")).toBe("en");
    expect(normalizeLocale("pt-BR")).toBe("pt-BR");
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("es")).toBe("es");
  });
  it("formata datas por idioma mantendo o comportamento padrão da versão React", () => {
    expect(formatDate("2026-02-01")).toBe("01/02/2026");
    expect(formatDate("2026-02-01", "en")).toBe("2/1/2026");
    const row = {
      id: "c1",
      title: "Example",
      subtitle: "",
      courseIds: [],
      courseNames: [],
      hours: 3200,
    };
    expect(
      RecordResolver.academicFields(row, "en").find(
        (field) => field.label === "hours",
      )?.value,
    ).toBe("3,200");
    expect(
      RecordResolver.academicFields(row, "pt-BR").find(
        (field) => field.label === "hours",
      )?.value,
    ).toBe("3.200");
  });
});
