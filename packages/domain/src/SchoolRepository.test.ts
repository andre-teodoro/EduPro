import { describe, expect, it, beforeEach } from "vitest";
import { StorageError, type StoragePort } from "@edupro/core";
import { SchoolRepository, SCHOOL_STORAGE_KEY } from "./SchoolRepository";
import { emptyInput, filterRows, listRows } from "./selectors";
import { isSchoolData } from "./validation";
import { DomainError } from "./types";

class MemoryStorage implements StoragePort {
  values = new Map<string, string>();
  failWrite = false;
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    if (this.failWrite) throw new Error("quota");
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}
let storage: MemoryStorage, repository: SchoolRepository;
beforeEach(() => {
  storage = new MemoryStorage();
  let sequence = 0;
  repository = new SchoolRepository(
    storage,
    () => `new-${++sequence}`,
    () => "2026-11-16T12:00:00.000Z",
  );
});
const studentInput = () => ({
  ...emptyInput(),
  name: "Aluno de Teste",
  cpf: "52998224725",
  birthDate: "2000-01-01",
  email: "teste@example.com",
  courseIds: ["c1", "c2"],
});

describe("dados e persistência compartilhados", () => {
  it("valida os JSONs e mantém o seed independente de mutações", () => {
    const initial = repository.load();
    expect(isSchoolData(initial)).toBe(true);
    initial.courses.length = 0;
    expect(repository.load().courses).toHaveLength(6);
  });
  it("persiste edições para uma segunda instância e restaura somente sua chave", () => {
    storage.setItem("outro-app", "preservar");
    const input = {
      ...emptyInput(),
      name: "Curso de Teste",
      description: "Descrição do curso.",
      hours: 80,
    };
    repository.save("courses", input);
    expect(new SchoolRepository(storage).load().courses.at(-1)?.name).toBe(
      input.name,
    );
    expect(repository.reset().courses).toHaveLength(6);
    expect(storage.getItem("outro-app")).toBe("preservar");
  });
  it("rejeita JSON corrompido sem sobrescrevê-lo silenciosamente", () => {
    storage.setItem(SCHOOL_STORAGE_KEY, "{invalido");
    expect(() => repository.load()).toThrow(StorageError);
    expect(storage.getItem(SCHOOL_STORAGE_KEY)).toBe("{invalido");
    expect(isSchoolData(repository.reset())).toBe(true);
  });
  it("não altera os dados quando o storage falha", () => {
    const initial = repository.load();
    storage.failWrite = true;
    expect(() => repository.save("students", studentInput())).toThrow(
      StorageError,
    );
    expect(repository.load()).toEqual(initial);
  });
});

describe("regras escolares", () => {
  it("cadastra aluno, matrículas e confirmações na mesma operação", () => {
    const data = repository.save("students", studentInput());
    const student = data.students.find((s) => s.cpf === studentInput().cpf)!;
    expect(
      data.enrollments.filter((e) => e.studentId === student.id),
    ).toHaveLength(2);
    expect(data.confirmations).toHaveLength(2);
    expect(data.confirmations[0].to).toBe(studentInput().email);
  });
  it("exige CPF válido, e-mail e ao menos um curso e não persiste cadastro parcial", () => {
    const before = repository.load();
    for (const changes of [
      { cpf: "11111111111" },
      { email: "invalido" },
      { courseIds: [] },
      { courseIds: ["inexistente"] },
      { birthDate: "2026-02-30" },
    ]) {
      expect(() =>
        repository.save("students", { ...studentInput(), ...changes }),
      ).toThrow(DomainError);
      expect(repository.load()).toEqual(before);
    }
  });
  it("bloqueia CPF duplicado mesmo com pontuação", () => {
    repository.save("students", studentInput());
    expect(() =>
      repository.save("students", { ...studentInput(), cpf: "529.982.247-25" }),
    ).toThrow("cpfDuplicate");
  });
  it("bloqueia matrícula duplicada, permite trancar e reativar", () => {
    expect(() => repository.enroll("st1", "c1")).toThrow("enrollmentDuplicate");
    repository.toggleEnrollment("e1");
    expect(() => repository.enroll("st1", "c1")).toThrow("enrollmentDuplicate");
    expect(
      repository.toggleEnrollment("e1").enrollments.find((e) => e.id === "e1")
        ?.status,
    ).toBe("active");
  });
  it("não permite vínculos com entidades inexistentes", () => {
    expect(() => repository.enroll("ausente", "c1")).toThrow(
      "enrollmentInvalid",
    );
    expect(() => repository.enroll("st1", "ausente")).toThrow(
      "enrollmentInvalid",
    );
  });
  it("bloqueia curso com matrículas e disciplina que ficaria órfã", () => {
    expect(() => repository.remove("courses", "c1")).toThrow(
      "courseHasEnrollments",
    );
    for (const subject of repository
      .load()
      .subjects.filter((s) => s.courseIds.includes("c6")))
      repository.save(
        "subjects",
        {
          ...emptyInput(),
          name: subject.name,
          description: subject.description,
          hours: subject.hours,
          courseIds: ["c6"],
        },
        subject.id,
      );
    expect(() => repository.remove("courses", "c6")).toThrow(
      "courseHasSubjects",
    );
  });
  it("remove curso sem matrículas preservando disciplinas de outros cursos", () => {
    const data = repository.remove("courses", "c6");
    expect(data.courses.some((c) => c.id === "c6")).toBe(false);
    expect(data.subjects.find((s) => s.id === "su6")?.courseIds).toEqual([
      "c2",
    ]);
    expect(isSchoolData(data)).toBe(true);
  });
  it("exclui aluno com suas matrículas e confirmações", () => {
    const added = repository.save("students", studentInput());
    const student = added.students.find((s) => s.cpf === studentInput().cpf)!;
    const data = repository.remove("students", student.id);
    expect(data.enrollments.some((e) => e.studentId === student.id)).toBe(
      false,
    );
    expect(data.confirmations).toHaveLength(0);
    expect(isSchoolData(data)).toBe(true);
  });
  it("busca por CPF sem máscara e nome sem acento, respeitando curso", () => {
    const rows = listRows(repository.load(), "students");
    expect(filterRows(rows, "joao")[0].title).toBe("João Pedro Souza");
    expect(filterRows(rows, rows[0].cpf!)[0].id).toBe(rows[0].id);
    expect(filterRows(rows, "", "c6")).toHaveLength(0);
  });
});
