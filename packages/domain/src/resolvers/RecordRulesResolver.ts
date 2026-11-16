import { requireField } from "../validation";
export class RecordRulesResolver {
  static validateName(name: string): string {
    const normalized = name.trim();
    requireField(
      normalized.length >= 3 && normalized.length <= 120,
      "nameInvalid",
      "name",
    );
    return normalized;
  }
}
