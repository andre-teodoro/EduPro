import { defineStore } from "pinia";
import { ref } from "vue";
import { errorCode, type SchoolData } from "@edupro/domain";
import type { MessageKey } from "@edupro/ui/messages";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";

export const useSchoolDataStore = defineStore("school-data", () => {
  const data = ref<SchoolData | null>(null);
  const error = ref("");
  const notice = ref<MessageKey | "">("");
  function load() {
    try {
      data.value = createSchoolRepository().load();
      error.value = "";
    } catch (cause) {
      data.value = null;
      error.value = errorCode(cause);
    }
  }
  function commit(operation: () => SchoolData, message: MessageKey) {
    data.value = operation();
    error.value = "";
    notice.value = message;
  }
  function reset() {
    commit(() => createSchoolRepository().reset(), "restored");
  }
  function dismiss() {
    notice.value = "";
  }
  return { data, error, notice, load, commit, reset, dismiss };
});
