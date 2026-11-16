import { useMemo } from "react";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { CourseResolver } from "../resolvers/CourseResolver";
import { useCourseStore } from "../stores/useCourseStore";
import type { RecordsModule } from "@/types/records";
export function useCourseModule() {
  const data = useSchoolDataStore((state) => state.data)!;
  const applyAction = useCourseStore((state) => state.applyAction);
  const rows = useMemo(() => CourseResolver.resolveList(data), [data]);
  return {
    kind: "courses",
    createLabel: "newCourses",
    rows,
    courses: data.courses,
    details: (row, locale) => CourseResolver.details(data, row, locale),
    confirmation: CourseResolver.confirmation,
    applyAction,
  } satisfies RecordsModule;
}
