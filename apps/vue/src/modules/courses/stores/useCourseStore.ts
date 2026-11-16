import { computed } from "vue";
import { defineStore } from "pinia";
import type { EntityInput, ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import { CourseResolver } from "../resolvers/CourseResolver";
export const useCourseStore = defineStore("courses", () => {
  const source = useSchoolDataStore();
  const kind = "courses" as const;
  const createLabel = "newCourses" as const;
  const rows = computed(() =>
    source.data ? CourseResolver.resolveList(source.data) : [],
  );
  const courses = computed(() => source.data?.courses ?? []);
  function details(row: ListRow, locale = "pt-BR") {
    return CourseResolver.details(source.data!, row, locale);
  }
  function save(input: EntityInput, id?: string) {
    source.commit(
      () => new CourseRepository(createSchoolRepository()).save(input, id),
      "saved",
    );
  }
  function applyAction(row: ListRow) {
    source.commit(
      () => new CourseRepository(createSchoolRepository()).remove(row.id),
      "deleted",
    );
  }
  return {
    kind,
    createLabel,
    rows,
    courses,
    details,
    confirmation: CourseResolver.confirmation,
    applyAction,
    save,
  };
});
