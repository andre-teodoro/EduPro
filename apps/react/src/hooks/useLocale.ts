import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "@reactuses/core";
import {
  defaultLocale,
  normalizeLocale,
  type AppLocale,
} from "@edupro/ui/locale";
export function useLocale() {
  const { i18n } = useTranslation();
  const [preference, setPreference] = useLocalStorage<string>(
    "edupro:locale",
    defaultLocale,
    { serializer: { read: (raw) => raw, write: (value) => value } },
  );
  const locale = normalizeLocale(preference ?? defaultLocale);
  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
  }, [locale, i18n]);
  return { locale, setLocale: (value: AppLocale) => setPreference(value) };
}
