import { useMemo } from "react";
import { useLocalizedSchoolData } from "@/hooks/useLocalizedSchoolData";
import { CourseResolver } from "../resolvers/CourseResolver";
import { useCourseStore } from "../stores/useCourseStore";
import type { RecordsModule } from "@/types/records";
export function useCourseModule() {
  const data = useLocalizedSchoolData()!;
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
