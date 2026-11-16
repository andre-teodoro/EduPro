export interface Course {
  id: string;
  name: string;
  description: string;
  hours: number;
  createdAt: string;
}
export interface Subject {
  id: string;
  name: string;
  description: string;
  hours: number;
  courseIds: string[];
}
export interface Student {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  email: string;
}
export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: "active" | "suspended";
  createdAt: string;
}
export interface Confirmation {
  id: string;
  enrollmentId: string;
  to: string;
  studentName: string;
  courseName: string;
  createdAt: string;
}
export interface SchoolData {
  version: 1;
  courses: Course[];
  subjects: Subject[];
  students: Student[];
  enrollments: Enrollment[];
  confirmations: Confirmation[];
}
export type EntityKind = "courses" | "subjects" | "students" | "enrollments";
export type EditableKind = Exclude<EntityKind, "enrollments">;
export interface EntityInput {
  name: string;
  description: string;
  hours: number;
  cpf: string;
  birthDate: string;
  email: string;
  courseIds: string[];
}
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    public readonly field?: string,
  ) {
    super(code);
  }
}
