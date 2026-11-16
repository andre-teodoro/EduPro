import { type SchoolRepository } from "@edupro/domain";
export class EnrollmentRepository {
  constructor(private readonly school: SchoolRepository) {}
  enroll(studentId: string, courseId: string) {
    return this.school.enroll(studentId, courseId);
  }
  toggle(id: string) {
    return this.school.toggleEnrollment(id);
  }
}
