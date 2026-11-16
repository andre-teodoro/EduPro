import { useLocalizedSchoolData } from "@/composables/useLocalizedSchoolData";
import { computed } from "vue";
import { defineStore } from "pinia";
import { DashboardResolver } from "../resolvers/DashboardResolver";
export const useDashboardStore = defineStore("dashboard", () => {
  const localized = useLocalizedSchoolData();
  const statistics = computed(() =>
    localized.value ? DashboardResolver.resolve(localized.value) : null,
  );
  return { statistics };
});
