import { create } from "zustand";
import type { ListRow } from "@edupro/domain";
import type { SaveRecord } from "@/types/records";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { StudentRepository } from "../repositories/StudentRepository";
interface StudentActions {
  save: SaveRecord;
  applyAction: (row: ListRow) => void;
}
export const useStudentStore = create<StudentActions>()(() => ({
  save: (input, id) =>
    useSchoolDataStore
      .getState()
      .commit(
        () => new StudentRepository(createSchoolRepository()).save(input, id),
        "saved",
      ),
  applyAction: (row) =>
    useSchoolDataStore
      .getState()
      .commit(
        () => new StudentRepository(createSchoolRepository()).remove(row.id),
        "deleted",
      ),
}));
