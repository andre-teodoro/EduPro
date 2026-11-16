import {
  formatCpf,
  formatDate,
  type SchoolData,
  type ListRow,
} from "@edupro/domain";
import { RecordResolver } from "./RecordResolver";
import type { RecordDetails, RecordFormConfig } from "../types/records";
export class StudentResolver {
  static resolveList(data: SchoolData): ListRow[] {
    return data.students.map((student) => {
      const courseIds = data.enrollments
        .filter((e) => e.studentId === student.id)
        .map((e) => e.courseId);
      return {
        ...student,
        title: student.name,
        subtitle: formatCpf(student.cpf),
        courseIds,
        courseNames: courseIds.map(
          (id) => data.courses.find((c) => c.id === id)?.name ?? "",
        ),
      };
    });
  }
  static details(
    data: SchoolData,
    row: ListRow,
    locale = "pt-BR",
  ): RecordDetails {
    return {
      title: row.title,
      fields: [
        { label: "cpf", value: formatCpf(row.cpf ?? "") },
        { label: "email", value: row.email ?? "" },
        {
          label: "birthDate",
          value: row.birthDate ? formatDate(row.birthDate, locale) : "",
        },
      ],
      sections: [
        {
          title: "studentEnrollments",
          items: data.enrollments
            .filter((e) => e.studentId === row.id)
            .map((e) => ({
              id: e.id,
              name: data.courses.find((c) => c.id === e.courseId)?.name ?? "",
              status: e.status,
            })),
        },
      ],
    };
  }
  static confirmation = RecordResolver.deleteConfirmation;
  static form(editing: boolean): RecordFormConfig {
    return {
      title: editing ? "editStudents" : "newStudents",
      description: editing ? "editStudentHint" : "newStudentHint",
      showCourses: !editing,
      fields: [
        { key: "name", type: "text", full: true, maxLength: 120 },
        { key: "cpf", type: "text", maxLength: 14 },
        { key: "birthDate", type: "date" },
        { key: "email", type: "email", full: true, maxLength: 120 },
      ],
    };
  }
}
