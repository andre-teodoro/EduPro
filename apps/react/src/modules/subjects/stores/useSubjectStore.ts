import { create } from "zustand";
import type { ListRow } from "@edupro/domain";
import type { SaveRecord } from "@/types/records";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { SubjectRepository } from "../repositories/SubjectRepository";
interface SubjectActions {
  save: SaveRecord;
  applyAction: (row: ListRow) => void;
}
export const useSubjectStore = create<SubjectActions>()(() => ({
  save: (input, id) =>
    useSchoolDataStore
      .getState()
      .commit(
        () => new SubjectRepository(createSchoolRepository()).save(input, id),
        "saved",
      ),
  applyAction: (row) =>
    useSchoolDataStore
      .getState()
      .commit(
        () => new SubjectRepository(createSchoolRepository()).remove(row.id),
        "deleted",
      ),
}));
