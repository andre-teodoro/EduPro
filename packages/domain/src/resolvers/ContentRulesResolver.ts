import {
  DomainError,
  type AcademicContent,
  type LocalizedContent,
} from "../types";
import { requireField } from "../validation";
import { RecordRulesResolver } from "./RecordRulesResolver";

export class ContentRulesResolver {
  static normalize(
    content: LocalizedContent<AcademicContent>,
  ): LocalizedContent<AcademicContent> {
    requireField(
      content.sourceLocale.length > 0,
      "sourceLocaleRequired",
      "sourceLocale",
    );
    requireField(
      Object.hasOwn(content.translations, content.sourceLocale),
      "nameInvalid",
      `translations.${content.sourceLocale}.name`,
    );
    const translations: Record<string, AcademicContent> = {};
    for (const [locale, value] of Object.entries(content.translations)) {
      if (
        locale !== content.sourceLocale &&
        !value.name.trim() &&
        !value.description.trim()
      )
        continue;
      try {
        const name = RecordRulesResolver.validateName(value.name);
        requireField(
          value.description.trim().length > 0 &&
            value.description.length <= 2000,
          "descriptionInvalid",
          "description",
        );
        translations[locale] = { name, description: value.description.trim() };
      } catch (error) {
        if (error instanceof DomainError)
          throw new DomainError(
            error.code,
            `translations.${locale}.${error.field}`,
          );
        throw error;
      }
    }
    return { sourceLocale: content.sourceLocale, translations };
  }
}
