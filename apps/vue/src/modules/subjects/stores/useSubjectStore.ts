import { useLocalizedSchoolData } from "@/composables/useLocalizedSchoolData";
import { computed } from "vue";
import { defineStore } from "pinia";
import type { EntityInput, ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { SubjectRepository } from "../repositories/SubjectRepository";
import { SubjectResolver } from "../resolvers/SubjectResolver";
export const useSubjectStore = defineStore("subjects", () => {
  const source = useSchoolDataStore();
  const localized = useLocalizedSchoolData();
  const kind = "subjects" as const;
  const createLabel = "newSubjects" as const;
  const rows = computed(() =>
    localized.value ? SubjectResolver.resolveList(localized.value) : [],
  );
  const courses = computed(() => localized.value?.courses ?? []);
  function details(row: ListRow, locale = "pt-BR") {
    return SubjectResolver.details(localized.value!, row, locale);
  }
  function save(input: EntityInput, id?: string) {
    source.commit(
      () => new SubjectRepository(createSchoolRepository()).save(input, id),
      "saved",
    );
  }
  function applyAction(row: ListRow) {
    source.commit(
      () => new SubjectRepository(createSchoolRepository()).remove(row.id),
      "deleted",
    );
  }
  return {
    kind,
    createLabel,
    rows,
    courses,
    details,
    confirmation: SubjectResolver.confirmation,
    applyAction,
    save,
  };
});
