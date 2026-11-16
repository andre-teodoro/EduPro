import { useLocalizedSchoolData } from "@/composables/useLocalizedSchoolData";
import { computed } from "vue";
import { defineStore } from "pinia";
import type { ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { EnrollmentRepository } from "../repositories/EnrollmentRepository";
import { EnrollmentResolver } from "../resolvers/EnrollmentResolver";
export const useEnrollmentStore = defineStore("enrollments", () => {
  const source = useSchoolDataStore();
  const localized = useLocalizedSchoolData();
  const kind = "enrollments" as const;
  const createLabel = "newEnrollments" as const;
  const rows = computed(() =>
    localized.value ? EnrollmentResolver.resolveList(localized.value) : [],
  );
  const courses = computed(() => localized.value?.courses ?? []);
  const options = computed(() =>
    localized.value
      ? EnrollmentResolver.options(localized.value)
      : { students: [], courses: [] },
  );
  function details(row: ListRow, locale = "pt-BR") {
    return EnrollmentResolver.details(localized.value!, row, locale);
  }
  function enroll(studentId: string, courseId: string) {
    source.commit(
      () =>
        new EnrollmentRepository(createSchoolRepository()).enroll(
          studentId,
          courseId,
        ),
      "enrolled",
    );
  }
  function applyAction(row: ListRow) {
    source.commit(
      () => new EnrollmentRepository(createSchoolRepository()).toggle(row.id),
      "changed",
    );
  }
  return {
    kind,
    createLabel,
    rows,
    courses,
    details,
    confirmation: EnrollmentResolver.confirmation,
    applyAction,
    enroll,
    options,
  };
});
