import type { SchoolData } from "./types";
import { DomainError } from "./types";

export function isValidCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const digits = [...cpf].map(Number);
  for (const length of [9, 10]) {
    const sum = digits
      .slice(0, length)
      .reduce((total, digit, index) => total + digit * (length + 1 - index), 0);
    const remainder = sum % 11;
    if (digits[length] !== (remainder < 2 ? 0 : 11 - remainder)) return false;
  }
  return true;
}

export function requireField(
  condition: unknown,
  code: string,
  field?: string,
): asserts condition {
  if (!condition) throw new DomainError(code, field);
}

const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;
const text = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(text);
const hours = (v: unknown) =>
  typeof v === "number" && Number.isInteger(v) && v > 0;
const date = (v: unknown) => text(v) && Number.isFinite(Date.parse(v));
const rows = (
  v: unknown,
  validate: (row: Record<string, unknown>) => boolean,
): v is Record<string, unknown>[] =>
  Array.isArray(v) &&
  v.every((row) => record(row) && text(row.id) && validate(row)) &&
  new Set(v.map((row: Record<string, unknown>) => row.id)).size === v.length;

function validContent(value: unknown): boolean {
  if (value === undefined) return true;
  if (
    !record(value) ||
    !text(value.sourceLocale) ||
    !record(value.translations)
  )
    return false;
  return (
    Object.hasOwn(value.translations, value.sourceLocale) &&
    Object.values(value.translations).every(
      (v) => record(v) && text(v.name) && text(v.description),
    )
  );
}

export function isSchoolData(value: unknown): value is SchoolData {
  if (!record(value) || value.version !== 1) return false;
  const { courses, subjects, students, enrollments, confirmations } = value;
  if (
    !rows(
      courses,
      (r) =>
        validContent(r.content) &&
        text(r.name) &&
        typeof r.description === "string" &&
        hours(r.hours) &&
        date(r.createdAt),
    )
  )
    return false;
  if (
    !rows(
      subjects,
      (r) =>
        validContent(r.content) &&
        text(r.name) &&
        typeof r.description === "string" &&
        hours(r.hours) &&
        strings(r.courseIds) &&
        r.courseIds.length > 0,
    )
  )
    return false;
  if (
    !rows(
      students,
      (r) =>
        text(r.name) &&
        text(r.cpf) &&
        isValidCpf(r.cpf) &&
        date(r.birthDate) &&
        text(r.email),
    )
  )
    return false;
  if (
    !rows(
      enrollments,
      (r) =>
        text(r.studentId) &&
        text(r.courseId) &&
        ["active", "suspended"].includes(String(r.status)) &&
        date(r.createdAt),
    )
  )
    return false;
  if (
    !rows(
      confirmations,
      (r) =>
        text(r.enrollmentId) &&
        text(r.to) &&
        text(r.studentName) &&
        text(r.courseName) &&
        date(r.createdAt),
    )
  )
    return false;
  const courseIds = new Set(courses.map((r) => r.id));
  const studentIds = new Set(students.map((r) => r.id));
  const enrollmentIds = new Set(enrollments.map((r) => r.id));
  return (
    subjects.every((r) =>
      (r.courseIds as string[]).every((id) => courseIds.has(id)),
    ) &&
    enrollments.every(
      (r) => courseIds.has(r.courseId) && studentIds.has(r.studentId),
    ) &&
    confirmations.every((r) => enrollmentIds.has(r.enrollmentId)) &&
    new Set(students.map((r) => r.cpf)).size === students.length &&
    new Set(enrollments.map((r) => `${r.studentId}:${r.courseId}`)).size ===
      enrollments.length
  );
}
