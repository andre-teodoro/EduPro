import { computed } from "vue";
import { defineStore } from "pinia";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { DashboardResolver } from "../resolvers/DashboardResolver";
export const useDashboardStore = defineStore("dashboard", () => {
  const source = useSchoolDataStore();
  const statistics = computed(() =>
    source.data ? DashboardResolver.resolve(source.data) : null,
  );
  return { statistics };
});
