import type { SchoolData, ListRow } from "@edupro/domain";
import { RecordResolver } from "./RecordResolver";
import type { RecordDetails, RecordFormConfig } from "../types/records";
export class CourseResolver {
  static resolveList(data: SchoolData): ListRow[] {
    return data.courses.map((course) => ({
      ...course,
      title: course.name,
      subtitle: course.description,
      courseIds: [course.id],
      courseNames: [],
    }));
  }
  static details(
    data: SchoolData,
    row: ListRow,
    locale = "pt-BR",
  ): RecordDetails {
    return {
      title: row.title,
      fields: RecordResolver.academicFields(row, locale),
      sections: [
        {
          title: "courseStudents",
          items: data.enrollments
            .filter((e) => e.courseId === row.id)
            .map((e) => ({
              id: e.id,
              name: data.students.find((s) => s.id === e.studentId)?.name ?? "",
              status: e.status,
            })),
        },
        {
          title: "courseSubjects",
          items: data.subjects
            .filter((s) => s.courseIds.includes(row.id))
            .map((s) => ({
              id: s.id,
              name: `${s.name} · ${s.hours.toLocaleString(locale)} h`,
            })),
        },
      ],
    };
  }
  static confirmation = RecordResolver.deleteConfirmation;
  static form(editing: boolean): RecordFormConfig {
    return {
      title: editing ? "editCourses" : "newCourses",
      description: "coursesDescription",
      showCourses: false,
      fields: [
        { key: "name", type: "text", full: true, maxLength: 120 },
        { key: "description", type: "textarea", full: true, maxLength: 2000 },
        { key: "hours", type: "number", full: true },
      ],
    };
  }
}
