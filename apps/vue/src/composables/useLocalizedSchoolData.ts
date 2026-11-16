import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { LocalizedSchoolResolver } from "@edupro/presentation";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";

export function useLocalizedSchoolData() {
  const source = useSchoolDataStore();
  const { locale } = useI18n();
  return computed(() =>
    source.data
      ? LocalizedSchoolResolver.resolve(source.data, locale.value)
      : null,
  );
}
