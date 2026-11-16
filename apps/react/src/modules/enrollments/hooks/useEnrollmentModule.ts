import { useMemo } from "react";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { EnrollmentResolver } from "../resolvers/EnrollmentResolver";
import { useEnrollmentStore } from "../stores/useEnrollmentStore";
import type { RecordsModule } from "@/types/records";
export function useEnrollmentModule() {
  const data = useSchoolDataStore((state) => state.data)!;
  const applyAction = useEnrollmentStore((state) => state.applyAction);
  const rows = useMemo(() => EnrollmentResolver.resolveList(data), [data]);
  return {
    kind: "enrollments",
    createLabel: "newEnrollments",
    rows,
    courses: data.courses,
    details: (row, locale) => EnrollmentResolver.details(data, row, locale),
    confirmation: EnrollmentResolver.confirmation,
    applyAction,
  } satisfies RecordsModule;
}

export function useEnrollmentOptions() {
  const data = useSchoolDataStore((state) => state.data)!;
  return useMemo(() => EnrollmentResolver.options(data), [data]);
}
