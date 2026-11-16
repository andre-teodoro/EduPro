import { computed } from "vue";
import { defineStore } from "pinia";
import type { EntityInput, ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { StudentRepository } from "../repositories/StudentRepository";
import { StudentResolver } from "../resolvers/StudentResolver";
export const useStudentStore = defineStore("students", () => {
  const source = useSchoolDataStore();
  const kind = "students" as const;
  const createLabel = "newStudents" as const;
  const rows = computed(() =>
    source.data ? StudentResolver.resolveList(source.data) : [],
  );
  const courses = computed(() => source.data?.courses ?? []);
  function details(row: ListRow, locale = "pt-BR") {
    return StudentResolver.details(source.data!, row, locale);
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
