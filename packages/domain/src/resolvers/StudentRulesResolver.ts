import type { EntityInput, SchoolData } from "../types";
import { isValidCpf, requireField } from "../validation";
import { CourseRulesResolver } from "./CourseRulesResolver";
export class StudentRulesResolver {
  static validate(
    data: SchoolData,
    input: EntityInput,
    now: string,
    id?: string,
  ): string {
    const cpf = input.cpf.replace(/\D/g, "");
    requireField(isValidCpf(cpf), "cpfInvalid", "cpf");
    requireField(
      !data.students.some((s) => s.id !== id && s.cpf === cpf),
      "cpfDuplicate",
      "cpf",
    );
    requireField(
      /^\d{4}-\d{2}-\d{2}$/.test(input.birthDate) &&
        Number.isFinite(Date.parse(input.birthDate)) &&
        new Date(input.birthDate).toISOString().slice(0, 10) ===
          input.birthDate &&
        input.birthDate < now.slice(0, 10),
      "birthInvalid",
      "birthDate",
    );
    requireField(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email),
      "emailInvalid",
      "email",
    );
    if (!id) CourseRulesResolver.validateLinks(data, input.courseIds);
    return cpf;
  }
}
