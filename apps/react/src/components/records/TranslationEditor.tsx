import { useId } from "react";
import { useTranslation } from "react-i18next";
import type { AcademicContent, LocalizedContent } from "@edupro/domain";
import { supportedLocales } from "@edupro/ui/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Content = LocalizedContent<AcademicContent>;
export function TranslationEditor({
  content,
  active,
  onActiveChange,
  onChange,
  fieldError,
  legacy,
}: {
  content: Content;
  active: string;
  onActiveChange: (locale: string) => void;
  onChange: (content: Content) => void;
  fieldError: string;
  legacy: boolean;
}) {
  const { t } = useTranslation();
  const id = useId();
  const languages = [
    ...supportedLocales,
    ...Object.keys(content.translations)
      .filter((code) => !supportedLocales.some((item) => item.code === code))
      .map((code) => ({ code, name: code })),
  ];
  function changeSource(selected: string) {
    const translations = { ...content.translations };
    if (!content.sourceLocale) {
      const original = Object.entries(translations).find(
        ([, value]) => value.name || value.description,
      );
      if (original && original[0] !== selected) {
        translations[selected] = { ...original[1] };
        translations[original[0]] = { name: "", description: "" };
      }
      onActiveChange(selected);
    }
    onChange({ sourceLocale: selected, translations });
  }
  function update(locale: string, field: keyof AcademicContent, value: string) {
    onChange({
      ...content,
      translations: {
        ...content.translations,
        [locale]: { ...content.translations[locale]!, [field]: value },
      },
    });
  }
  function status(code: string) {
    const value = content.translations[code]!;
    return value.name.trim() && value.description.trim()
      ? "translationComplete"
      : value.name.trim() || value.description.trim()
        ? "translationIncomplete"
        : "translationEmpty";
  }
  return (
    <div className="span-full min-w-0">
      <div className="field mb-3">
        <label htmlFor={`${id}-source`}>{t("sourceLocale")}</label>
        <select
          id={`${id}-source`}
          className="input"
          value={content.sourceLocale}
          onChange={(event) => changeSource(event.target.value)}
          aria-invalid={fieldError === "sourceLocale"}
          aria-describedby={
            fieldError === "sourceLocale" ? "form-error" : undefined
          }
        >
          <option disabled value="">
            {t("sourceLocale")}
          </option>
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
      {legacy && <p className="muted mb-3">{t("legacyContentHint")}</p>}
      <p id={`${id}-hint`} className="muted mb-3">
        {t("translationHint")}
      </p>
      {content.sourceLocale && (
        <Tabs value={active} onValueChange={onActiveChange}>
          <TabsList aria-label={t("translations")}>
            {languages.map((language) => (
              <TabsTrigger
                key={language.code}
                value={language.code}
                aria-label={`${language.name}: ${t(status(language.code))}`}
              >
                {language.name}
                {language.code === content.sourceLocale ? " *" : ""}
                <span className="block text-xs">
                  {t(status(language.code))}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {languages.map((language) => (
            <TabsContent
              key={language.code}
              value={language.code}
              className="form-grid"
              lang={language.code}
            >
              <div className="field">
                <label htmlFor={`${id}-name-${language.code}`}>
                  {t("name")}
                </label>
                <input
                  id={`${id}-name-${language.code}`}
                  name={`translations[${language.code}][name]`}
                  className="input"
                  maxLength={120}
                  value={content.translations[language.code]!.name}
                  onChange={(event) =>
                    update(language.code, "name", event.target.value)
                  }
                  aria-invalid={
                    fieldError === `translations.${language.code}.name`
                  }
                  aria-describedby={
                    fieldError === `translations.${language.code}.name`
                      ? "form-error"
                      : `${id}-hint`
                  }
                />
              </div>
              <div className="field">
                <label htmlFor={`${id}-description-${language.code}`}>
                  {t("description")}
                </label>
                <textarea
                  id={`${id}-description-${language.code}`}
                  name={`translations[${language.code}][description]`}
                  className="input"
                  maxLength={2000}
                  value={content.translations[language.code]!.description}
                  onChange={(event) =>
                    update(language.code, "description", event.target.value)
                  }
                  aria-invalid={
                    fieldError === `translations.${language.code}.description`
                  }
                  aria-describedby={
                    fieldError === `translations.${language.code}.description`
                      ? "form-error"
                      : `${id}-hint`
                  }
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
