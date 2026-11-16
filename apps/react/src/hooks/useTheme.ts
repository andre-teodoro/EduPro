import { useEffect } from "react";
import { useLocalStorage, useMediaQuery } from "@reactuses/core";

export function useTheme() {
  const [preference, setPreference] = useLocalStorage<string>(
    "edupro:theme",
    "system",
    { serializer: { read: (raw) => raw, write: (value) => value } },
  );
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      preference === "dark" || (preference !== "light" && systemDark),
    );
  }, [preference, systemDark]);
  return { preference, setPreference };
}
