import { useLocalizedSchoolData } from "@/composables/useLocalizedSchoolData";
import { computed } from "vue";
import { defineStore } from "pinia";
import type { EntityInput, ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { CourseRepository } from "../repositories/CourseRepository";
import { CourseResolver } from "../resolvers/CourseResolver";
export const useCourseStore = defineStore("courses", () => {
  const source = useSchoolDataStore();
  const localized = useLocalizedSchoolData();
  const kind = "courses" as const;
  const createLabel = "newCourses" as const;
  const rows = computed(() =>
    localized.value ? CourseResolver.resolveList(localized.value) : [],
  );
  const courses = computed(() => localized.value?.courses ?? []);
  function details(row: ListRow, locale = "pt-BR") {
    return CourseResolver.details(localized.value!, row, locale);
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
