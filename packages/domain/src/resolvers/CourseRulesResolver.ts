import type { EntityInput, SchoolData } from "../types";
import { requireField } from "../validation";
export class CourseRulesResolver {
  static validate(input: EntityInput): void {
    requireField(
      Number.isInteger(input.hours) && input.hours > 0 && input.hours <= 20000,
      "hoursInvalid",
      "hours",
    );
    requireField(
      input.description.trim().length > 0 && input.description.length <= 2000,
      "descriptionInvalid",
      "description",
    );
  }
  static validateLinks(data: SchoolData, ids: string[]): void {
    requireField(
      ids.length > 0 &&
        ids.every((id) => data.courses.some((c) => c.id === id)),
      "coursesRequired",
      "courseIds",
    );
  }
  static assertRemovable(data: SchoolData, id: string): void {
    requireField(
      !data.enrollments.some((e) => e.courseId === id),
      "courseHasEnrollments",
    );
    requireField(
      !data.subjects.some(
        (s) => s.courseIds.includes(id) && s.courseIds.length === 1,
      ),
      "courseHasSubjects",
    );
  }
}
