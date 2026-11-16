import { create } from "zustand";
import type { ListRow } from "@edupro/domain";
import type { SaveRecord } from "@/types/records";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { createSchoolRepository } from "@/repositories/createSchoolRepository";
import { EnrollmentRepository } from "../repositories/EnrollmentRepository";
interface EnrollmentActions {
  enroll: (studentId: string, courseId: string) => void;
  applyAction: (row: ListRow) => void;
}
export const useEnrollmentStore = create<EnrollmentActions>()(() => ({
  enroll: (studentId, courseId) =>
    useSchoolDataStore
      .getState()
      .commit(
        () =>
          new EnrollmentRepository(createSchoolRepository()).enroll(
            studentId,
            courseId,
          ),
        "enrolled",
      ),
  applyAction: (row) =>
    useSchoolDataStore
      .getState()
      .commit(
        () => new EnrollmentRepository(createSchoolRepository()).toggle(row.id),
        "changed",
      ),
}));
