import { computed } from "vue";
import { defineStore } from "pinia";
import type { EntityInput, ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { SubjectRepository } from "../repositories/SubjectRepository";
import { SubjectResolver } from "../resolvers/SubjectResolver";
export const useSubjectStore = defineStore("subjects", () => {
  const source = useSchoolDataStore();
  const kind = "subjects" as const;
  const createLabel = "newSubjects" as const;
  const rows = computed(() =>
    source.data ? SubjectResolver.resolveList(source.data) : [],
  );
  const courses = computed(() => source.data?.courses ?? []);
  function details(row: ListRow, locale = "pt-BR") {
    return SubjectResolver.details(source.data!, row, locale);
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
