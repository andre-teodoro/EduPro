import { useMemo } from "react";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { NotificationResolver } from "../resolvers/NotificationResolver";
export function useNotificationStore(locale: string) {
  const data = useSchoolDataStore((state) => state.data);
  return useMemo(
    () => NotificationResolver.resolveList(data?.confirmations ?? [], locale),
    [data, locale],
  );
}
