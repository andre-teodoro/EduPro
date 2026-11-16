import type { AcademicContent, LocalizedContent } from "./types";

export function resolveContent<T>(
  content: LocalizedContent<T>,
  locale: string,
): T {
  return (
    content.translations[locale] ?? content.translations[content.sourceLocale]!
  );
}

export function academicContent(
  record: AcademicContent & { content?: LocalizedContent<AcademicContent> },
  locale: string,
): AcademicContent {
  return record.content
    ? resolveContent(record.content, locale)
    : { name: record.name, description: record.description };
}
