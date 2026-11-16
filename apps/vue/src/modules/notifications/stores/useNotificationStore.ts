import i18n from "@/i18n";
import { computed } from "vue";
import { defineStore } from "pinia";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { NotificationResolver } from "../resolvers/NotificationResolver";
export const useNotificationStore = defineStore("notifications", () => {
  const source = useSchoolDataStore();
  const confirmations = computed(() =>
    NotificationResolver.resolveList(
      source.data?.confirmations ?? [],
      i18n.global.locale.value,
    ),
  );
  return { confirmations };
});
