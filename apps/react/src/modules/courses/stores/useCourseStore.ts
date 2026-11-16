import { create } from "zustand";
import type { ListRow } from "@edupro/domain";
import type { SaveRecord } from "@/types/records";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { CourseRepository } from "../repositories/CourseRepository";
interface CourseActions {
  save: SaveRecord;
  applyAction: (row: ListRow) => void;
}
export const useCourseStore = create<CourseActions>()(() => ({
  save: (input, id) =>
    useSchoolDataStore
      .getState()
      .commit(
        () => new CourseRepository(createSchoolRepository()).save(input, id),
        "saved",
      ),
  applyAction: (row) =>
    useSchoolDataStore
      .getState()
      .commit(
        () => new CourseRepository(createSchoolRepository()).remove(row.id),
        "deleted",
      ),
}));
