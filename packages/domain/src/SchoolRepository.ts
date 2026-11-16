import { JsonStorage, StorageError, type StoragePort } from "@edupro/core";
import { seed } from "@edupro/data";
import {
  DomainError,
  type EditableKind,
  type EntityInput,
  type SchoolData,
} from "./types";
import { isSchoolData, requireField } from "./validation";

import { RecordRulesResolver } from "./resolvers/RecordRulesResolver";
import { SubjectRulesResolver } from "./resolvers/SubjectRulesResolver";
import { CourseRulesResolver } from "./resolvers/CourseRulesResolver";
import { StudentRulesResolver } from "./resolvers/StudentRulesResolver";
import { EnrollmentRulesResolver } from "./resolvers/EnrollmentRulesResolver";

export const SCHOOL_STORAGE_KEY = "edupro:school:v1";

export class SchoolRepository {
  private readonly storage: JsonStorage;
  constructor(
    storage: StoragePort,
    private readonly id: () => string = () => crypto.randomUUID(),
    private readonly now: () => string = () => new Date().toISOString(),
  ) {
    this.storage = new JsonStorage(storage, SCHOOL_STORAGE_KEY);
  }

  load(): SchoolData {
    return this.storage.read(isSchoolData) ?? structuredClone(seed);
  }

  reset(): SchoolData {
    this.storage.clear();
    return this.load();
  }

  private commit(change: (data: SchoolData) => void): SchoolData {
    const data = this.load();
    change(data);
    if (!isSchoolData(data)) throw new StorageError("storageInvalid");
    this.storage.write(data);
    return data;
  }

  save(kind: EditableKind, input: EntityInput, id?: string): SchoolData {
    return this.commit((data) => {
      const name = RecordRulesResolver.validateName(input.name);
      if (id)
        requireField(
          data[kind].some((item) => item.id === id),
          "notFound",
        );
      if (kind === "students") {
        const cpf = StudentRulesResolver.validate(data, input, this.now(), id);
        const studentId = id ?? this.id();
        const student = {
          id: studentId,
          name,
          cpf,
          birthDate: input.birthDate,
          email: input.email.trim(),
        };
        data.students = id
          ? data.students.map((item) => (item.id === id ? student : item))
          : [...data.students, student];
        if (!id)
          for (const courseId of new Set(input.courseIds))
            this.addEnrollment(data, studentId, courseId);
      } else {
        if (kind === "courses") CourseRulesResolver.validate(input);
        else SubjectRulesResolver.validate(data, input);
        const fields = {
          name,
          description: input.description.trim(),
          hours: input.hours,
        };
        if (kind === "courses") {
          const item = {
            ...fields,
            id: id ?? this.id(),
            createdAt:
              data.courses.find((c) => c.id === id)?.createdAt ?? this.now(),
          };
          data.courses = id
            ? data.courses.map((c) => (c.id === id ? item : c))
            : [...data.courses, item];
        } else {
          const item = {
            ...fields,
            id: id ?? this.id(),
            courseIds: [...new Set(input.courseIds)],
          };
          data.subjects = id
            ? data.subjects.map((s) => (s.id === id ? item : s))
            : [...data.subjects, item];
        }
      }
    });
  }

  private addEnrollment(
    data: SchoolData,
    studentId: string,
    courseId: string,
  ): void {
    const { student, course } = EnrollmentRulesResolver.resolveParticipants(
      data,
      studentId,
      courseId,
    );
    const enrollment = {
      id: this.id(),
      studentId,
      courseId,
      status: "active" as const,
      createdAt: this.now(),
    };
    data.enrollments.push(enrollment);
    data.confirmations.unshift({
      id: this.id(),
      enrollmentId: enrollment.id,
      to: student.email,
      studentName: student.name,
      courseName: course.name,
      createdAt: this.now(),
    });
  }

  enroll(studentId: string, courseId: string): SchoolData {
    return this.commit((data) => this.addEnrollment(data, studentId, courseId));
  }

  toggleEnrollment(id: string): SchoolData {
    return this.commit((data) => {
      const item = data.enrollments.find((e) => e.id === id);
      requireField(item, "notFound");
      item.status = EnrollmentRulesResolver.nextStatus(item.status);
    });
  }

  remove(kind: EditableKind, id: string): SchoolData {
    return this.commit((data) => {
      requireField(
        data[kind].some((item) => item.id === id),
        "notFound",
      );
      if (kind === "courses") {
        CourseRulesResolver.assertRemovable(data, id);
        data.courses = data.courses.filter((c) => c.id !== id);
        data.subjects = data.subjects.map((s) => ({
          ...s,
          courseIds: s.courseIds.filter((c) => c !== id),
        }));
      } else if (kind === "students") {
        const removed = new Set(
          data.enrollments.filter((e) => e.studentId === id).map((e) => e.id),
        );
        data.students = data.students.filter((s) => s.id !== id);
        data.enrollments = data.enrollments.filter((e) => e.studentId !== id);
        data.confirmations = data.confirmations.filter(
          (c) => !removed.has(c.enrollmentId),
        );
      } else data.subjects = data.subjects.filter((s) => s.id !== id);
    });
  }
}

export function errorCode(error: unknown): string {
  return error instanceof DomainError || error instanceof StorageError
    ? error.code
    : "unexpected";
}
