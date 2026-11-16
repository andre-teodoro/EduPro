import type { SchoolData, ListRow } from "@edupro/domain";
import { RecordResolver } from "./RecordResolver";
import type { RecordDetails, RecordFormConfig } from "../types/records";
export class SubjectResolver {
  static resolveList(data: SchoolData): ListRow[] {
    return data.subjects.map((subject) => ({
      ...subject,
      title: subject.name,
      subtitle: subject.description,
      courseNames: subject.courseIds.map(
        (id) => data.courses.find((c) => c.id === id)?.name ?? "",
      ),
    }));
  }
  static details(
    _data: SchoolData,
    row: ListRow,
    locale = "pt-BR",
  ): RecordDetails {
    return {
      title: row.title,
      fields: RecordResolver.academicFields(row, locale),
      sections: [
        {
          title: "linkedCourses",
          items: row.courseNames.map((name, index) => ({
            id: row.courseIds[index],
            name,
          })),
        },
      ],
    };
  }
  static confirmation = RecordResolver.deleteConfirmation;
  static form(editing: boolean): RecordFormConfig {
    return {
      title: editing ? "editSubjects" : "newSubjects",
      description: "subjectsDescription",
      showCourses: true,
      fields: [
        { key: "name", type: "text", full: true, maxLength: 120 },
        { key: "description", type: "textarea", full: true, maxLength: 2000 },
        { key: "hours", type: "number", full: true },
      ],
    };
  }
}
