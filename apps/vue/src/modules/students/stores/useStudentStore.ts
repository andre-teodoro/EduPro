import { useLocalizedSchoolData } from "@/composables/useLocalizedSchoolData";
import { computed } from "vue";
import { defineStore } from "pinia";
import type { EntityInput, ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { StudentRepository } from "../repositories/StudentRepository";
import { StudentResolver } from "../resolvers/StudentResolver";
export const useStudentStore = defineStore("students", () => {
  const source = useSchoolDataStore();
  const localized = useLocalizedSchoolData();
  const kind = "students" as const;
  const createLabel = "newStudents" as const;
  const rows = computed(() =>
    localized.value ? StudentResolver.resolveList(localized.value) : [],
  );
  const courses = computed(() => localized.value?.courses ?? []);
  function details(row: ListRow, locale = "pt-BR") {
    return StudentResolver.details(localized.value!, row, locale);
  }
  function save(input: EntityInput, id?: string) {
    source.commit(
      () => new StudentRepository(createSchoolRepository()).save(input, id),
      "saved",
    );
  }
  function applyAction(row: ListRow) {
    source.commit(
      () => new StudentRepository(createSchoolRepository()).remove(row.id),
      "deleted",
    );
  }
  return {
    kind,
    createLabel,
    rows,
    courses,
    details,
    confirmation: StudentResolver.confirmation,
    applyAction,
    save,
  };
});
