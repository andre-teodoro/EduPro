import {
  emptyInput,
  filterRows,
  formatDate,
  toInput,
  type ListRow,
} from "@edupro/domain";
import type { DetailField, RecordConfirmation } from "../types/records";

export class RecordResolver {
  static filter = filterRows;
  static input = toInput;
  static emptyInput = emptyInput;
  static localizedInput(
    row: ListRow | undefined,
    locale: string,
    locales: readonly string[],
  ) {
    const input = row ? toInput(row) : emptyInput();
    input.content ??= {
      sourceLocale: row ? "" : locale,
      translations: row
        ? { [locale]: { name: input.name, description: input.description } }
        : {},
    };
    for (const code of locales)
      input.content.translations[code] ??= { name: "", description: "" };
    return input;
  }
  static deleteConfirmation(): RecordConfirmation {
    return {
      title: "confirmDelete",
      description: "confirmDeleteDescription",
      destructive: true,
    };
  }
  static academicFields(row: ListRow, locale = "pt-BR"): DetailField[] {
    return [
      { label: "description", value: row.description ?? "" },
      {
        label: "hours",
        value: row.hours === undefined ? "" : row.hours.toLocaleString(locale),
      },
      ...(row.createdAt
        ? [
            {
              label: "createdAt" as const,
              value: formatDate(row.createdAt, locale),
            },
          ]
        : []),
    ];
  }
}
