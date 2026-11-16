import { useMemo } from "react";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { DashboardResolver } from "../resolvers/DashboardResolver";
export function useDashboardStore() {
  const data = useSchoolDataStore((state) => state.data)!;
  return useMemo(() => DashboardResolver.resolve(data), [data]);
}
