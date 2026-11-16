import { useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
import { AppRouter } from "@/router";
export function App() {
  useLocale();
  const hydrate = useAuthStore((state) => state.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return <AppRouter />;
}
