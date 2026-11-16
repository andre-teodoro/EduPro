import { computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { defaultLocale, normalizeLocale, type AppLocale } from "@/i18n/types";
export function useLocale() {
  const stored = useLocalStorage<string>("edupro:locale", defaultLocale);
  const locale = computed<AppLocale>({
    get: () => normalizeLocale(stored.value),
    set: (value) => {
      stored.value = value;
    },
  });
  return { locale };
}
