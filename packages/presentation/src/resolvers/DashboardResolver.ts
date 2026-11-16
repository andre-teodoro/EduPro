import type { SchoolData } from "@edupro/domain";
import { EnrollmentResolver } from "./EnrollmentResolver";
export class DashboardResolver {
  static resolve(data: SchoolData) {
    const courses = data.courses.map((course) => ({
      ...course,
      count: data.enrollments.filter(
        (e) => e.courseId === course.id && e.status === "active",
      ).length,
    }));
    const max = Math.max(1, ...courses.map((course) => course.count));
    return {
      totals: [
        data.courses.length,
        data.students.length,
        data.subjects.length,
        data.enrollments.filter((e) => e.status === "active").length,
      ],
      courses: courses.map((course) => ({
        ...course,
        percentage: (course.count / max) * 100,
      })),
      recent: EnrollmentResolver.resolveList(data)
        .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
        .slice(0, 5),
    };
  }
}
