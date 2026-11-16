import { formatDate, type SchoolData, type ListRow } from "@edupro/domain";
import type { RecordDetails, RecordConfirmation } from "../types/records";
export class EnrollmentResolver {
  static resolveList(data: SchoolData): ListRow[] {
    return data.enrollments.map((enrollment) => ({
      ...enrollment,
      title:
        data.students.find((s) => s.id === enrollment.studentId)?.name ?? "",
      subtitle:
        data.courses.find((c) => c.id === enrollment.courseId)?.name ?? "",
      courseIds: [enrollment.courseId],
      courseNames: [
        data.courses.find((c) => c.id === enrollment.courseId)?.name ?? "",
      ],
    }));
  }
  static details(
    _data: SchoolData,
    row: ListRow,
    locale = "pt-BR",
  ): RecordDetails {
    return {
      title: row.title,
      fields: [
        { label: "course", value: row.subtitle },
        {
          label: "enrolledAt",
          value: row.createdAt ? formatDate(row.createdAt, locale) : "",
        },
        { label: "status", value: row.status ?? "", status: row.status },
      ],
      sections: [],
    };
  }
  static confirmation(row: ListRow | null): RecordConfirmation {
    const active = row?.status === "active";
    return {
      title: active ? "confirmSuspend" : "confirmResume",
      description: active
        ? "confirmSuspendDescription"
        : "confirmResumeDescription",
      destructive: false,
    };
  }
  static options(data: SchoolData) {
    return {
      students: data.students.map(({ id, name }) => ({ id, name })),
      courses: data.courses.map(({ id, name }) => ({ id, name })),
    };
  }
}
