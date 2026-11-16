import { computed } from "vue";
import { defineStore } from "pinia";
import type { ListRow } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { EnrollmentRepository } from "../repositories/EnrollmentRepository";
import { EnrollmentResolver } from "../resolvers/EnrollmentResolver";
export const useEnrollmentStore = defineStore("enrollments", () => {
  const source = useSchoolDataStore();
  const kind = "enrollments" as const;
  const createLabel = "newEnrollments" as const;
  const rows = computed(() =>
    source.data ? EnrollmentResolver.resolveList(source.data) : [],
  );
  const courses = computed(() => source.data?.courses ?? []);
  const options = computed(() =>
    source.data
      ? EnrollmentResolver.options(source.data)
      : { students: [], courses: [] },
  );
  function details(row: ListRow, locale = "pt-BR") {
    return EnrollmentResolver.details(source.data!, row, locale);
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
