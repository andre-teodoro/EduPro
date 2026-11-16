import { create } from "zustand";
import { errorCode, type SchoolData } from "@edupro/domain";
import type { MessageKey } from "@edupro/ui/messages";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
interface SchoolDataState {
  data: SchoolData | null;
  error: string;
  notice: MessageKey | "";
  load: () => void;
  commit: (operation: () => SchoolData, notice: MessageKey) => void;
  reset: () => void;
  dismiss: () => void;
}
export const useSchoolDataStore = create<SchoolDataState>()((set, get) => ({
  data: null,
  error: "",
  notice: "",
  load: () => {
    try {
      set({ data: createSchoolRepository().load(), error: "" });
    } catch (cause) {
      set({ data: null, error: errorCode(cause) });
    }
  },
  commit: (operation, notice) => {
    const data = operation();
    set({ data, error: "", notice });
  },
  reset: () => get().commit(() => createSchoolRepository().reset(), "restored"),
  dismiss: () => set({ notice: "" }),
}));
