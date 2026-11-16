import type {
  AcademicContent,
  LocalizedContent,
  EntityInput,
  EntityKind,
  SchoolData,
} from "./types";

export interface ListRow {
  content?: LocalizedContent<AcademicContent>;
  id: string;
  title: string;
  subtitle: string;
  courseIds: string[];
  courseNames: string[];
  hours?: number;
  status?: "active" | "suspended";
  createdAt?: string;
  email?: string;
  cpf?: string;
  birthDate?: string;
  description?: string;
}
export const emptyInput = (): EntityInput => ({
  name: "",
  description: "",
  hours: 60,
  cpf: "",
  birthDate: "",
  email: "",
  courseIds: [],
});
export const formatCpf = (value: string): string =>
  value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
export const formatDate = (value: string, locale = "pt-BR"): string =>
  new Intl.DateTimeFormat(locale, { timeZone: "UTC" }).format(new Date(value));
export const initials = (value: string): string =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

export function listRows(data: SchoolData, kind: EntityKind): ListRow[] {
  const courseName = (id: string) =>
    data.courses.find((c) => c.id === id)?.name ?? "";
  if (kind === "courses")
    return data.courses.map((c) => ({
      ...c,
      title: c.name,
      subtitle: c.description,
      courseIds: [c.id],
      courseNames: [],
      description: c.description,
    }));
  if (kind === "subjects")
    return data.subjects.map((s) => ({
      ...s,
      title: s.name,
      subtitle: s.description,
      courseNames: s.courseIds.map(courseName),
    }));
  if (kind === "students")
    return data.students.map((s) => {
      const courseIds = data.enrollments
        .filter((e) => e.studentId === s.id)
        .map((e) => e.courseId);
      return {
        ...s,
        title: s.name,
        subtitle: formatCpf(s.cpf),
        courseIds,
        courseNames: courseIds.map(courseName),
      };
    });
  return data.enrollments.map((e) => ({
    ...e,
    title: data.students.find((s) => s.id === e.studentId)?.name ?? "",
    subtitle: courseName(e.courseId),
    courseIds: [e.courseId],
    courseNames: [courseName(e.courseId)],
  }));
}

export function filterRows(
  rows: ListRow[],
  search: string,
  courseId = "",
  status = "",
): ListRow[] {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const query = normalize(search.trim());
  const digits = search.replace(/\D/g, "");
  return rows.filter(
    (row) =>
      (!query ||
        normalize(`${row.title} ${row.subtitle} ${row.email ?? ""}`).includes(
          query,
        ) ||
        (!!row.cpf && digits.length > 0 && row.cpf.includes(digits))) &&
      (!courseId || row.courseIds.includes(courseId)) &&
      (!status || row.status === status),
  );
}

export function toInput(row: ListRow): EntityInput {
  return {
    content: row.content
      ? {
          sourceLocale: row.content.sourceLocale,
          translations: Object.fromEntries(
            Object.entries(row.content.translations).map(([locale, value]) => [
              locale,
              { ...value },
            ]),
          ),
        }
      : undefined,
    name: row.title,
    description: row.description ?? "",
    hours: row.hours ?? 60,
    cpf: row.cpf ?? "",
    birthDate: row.birthDate ?? "",
    email: row.email ?? "",
    courseIds: [...row.courseIds],
  };
}

export function dashboard(data: SchoolData) {
  return {
    totals: [
      data.courses.length,
      data.students.length,
      data.subjects.length,
      data.enrollments.filter((e) => e.status === "active").length,
    ],
    courses: data.courses.map((c) => ({
      ...c,
      count: data.enrollments.filter(
        (e) => e.courseId === c.id && e.status === "active",
      ).length,
    })),
    recent: listRows(data, "enrollments")
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
      .slice(0, 5),
  };
}
