import { watchEffect } from "vue";
import { useLocalStorage, usePreferredDark } from "@vueuse/core";
export function useTheme() {
  const preference = useLocalStorage("edupro:theme", "system");
  const systemDark = usePreferredDark();
  watchEffect(() =>
    document.documentElement.classList.toggle(
      "dark",
      preference.value === "dark" ||
        (preference.value !== "light" && systemDark.value),
    ),
  );
  return { preference };
}
