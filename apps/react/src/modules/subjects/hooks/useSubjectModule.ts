import { useMemo } from "react";
import { useLocalizedSchoolData } from "@/hooks/useLocalizedSchoolData";
import { SubjectResolver } from "../resolvers/SubjectResolver";
import { useSubjectStore } from "../stores/useSubjectStore";
import type { RecordsModule } from "@/types/records";
export function useSubjectModule() {
  const data = useLocalizedSchoolData()!;
  const applyAction = useSubjectStore((state) => state.applyAction);
  const rows = useMemo(() => SubjectResolver.resolveList(data), [data]);
  return {
    kind: "subjects",
    createLabel: "newSubjects",
    rows,
    courses: data.courses,
    details: (row, locale) => SubjectResolver.details(data, row, locale),
    confirmation: SubjectResolver.confirmation,
    applyAction,
  } satisfies RecordsModule;
}
