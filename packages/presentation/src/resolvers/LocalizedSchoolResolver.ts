import { academicContent, type SchoolData } from "@edupro/domain";

export class LocalizedSchoolResolver {
  static resolve(data: SchoolData, locale: string): SchoolData {
    return {
      ...data,
      courses: data.courses.map((item) => ({
        ...item,
        ...academicContent(item, locale),
      })),
      subjects: data.subjects.map((item) => ({
        ...item,
        ...academicContent(item, locale),
      })),
    };
  }
}
