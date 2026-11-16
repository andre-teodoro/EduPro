import type { Enrollment, SchoolData } from "../types";
import { requireField } from "../validation";
export class EnrollmentRulesResolver {
  static resolveParticipants(
    data: SchoolData,
    studentId: string,
    courseId: string,
  ) {
    const student = data.students.find((s) => s.id === studentId);
    const course = data.courses.find((c) => c.id === courseId);
    requireField(student && course, "enrollmentInvalid");
    requireField(
      !data.enrollments.some(
        (e) => e.studentId === studentId && e.courseId === courseId,
      ),
      "enrollmentDuplicate",
    );
    return { student, course };
  }
  static nextStatus(status: Enrollment["status"]): Enrollment["status"] {
    return status === "active" ? "suspended" : "active";
  }
}
