import { useMemo } from "react";
import { useLocalizedSchoolData } from "@/hooks/useLocalizedSchoolData";
import { DashboardResolver } from "../resolvers/DashboardResolver";
export function useDashboardStore() {
  const data = useLocalizedSchoolData()!;
  return useMemo(() => DashboardResolver.resolve(data), [data]);
}
