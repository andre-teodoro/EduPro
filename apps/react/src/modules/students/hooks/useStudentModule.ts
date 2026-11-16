import { useMemo } from "react";
import { useLocalizedSchoolData } from "@/hooks/useLocalizedSchoolData";
import { StudentResolver } from "../resolvers/StudentResolver";
import { useStudentStore } from "../stores/useStudentStore";
import type { RecordsModule } from "@/types/records";
export function useStudentModule() {
  const data = useLocalizedSchoolData()!;
  const applyAction = useStudentStore((state) => state.applyAction);
  const rows = useMemo(() => StudentResolver.resolveList(data), [data]);
  return {
    kind: "students",
    createLabel: "newStudents",
    rows,
    courses: data.courses,
    details: (row, locale) => StudentResolver.details(data, row, locale),
    confirmation: StudentResolver.confirmation,
    applyAction,
  } satisfies RecordsModule;
}
