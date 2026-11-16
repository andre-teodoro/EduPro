import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supportedLocales, normalizeLocale } from "@edupro/ui/locale";
import { useLocale } from "@/hooks/useLocale";
export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  return (
    <label className="language-switcher">
      <span className="sr-only">{t("language")}</span>
      <Languages aria-hidden="true" />
      <select
        className="input"
        value={locale}
        onChange={(event) => {
          void setLocale(normalizeLocale(event.target.value));
        }}
      >
        {supportedLocales.map((language) => (
          <option
            key={language.code}
            value={language.code}
            lang={language.code}
          >
            {language.name}
          </option>
        ))}
      </select>
    </label>
  );
}
