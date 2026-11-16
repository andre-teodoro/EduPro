import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSchoolResolver } from "@edupro/presentation";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";

export function useLocalizedSchoolData() {
  const data = useSchoolDataStore((state) => state.data);
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  return useMemo(
    () => (data ? LocalizedSchoolResolver.resolve(data, locale) : null),
    [data, locale],
  );
}
