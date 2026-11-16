import courses from "./courses.json";
import subjects from "./subjects.json";
import students from "./students.json";
import enrollments from "./enrollments.json";

export const seed = {
  version: 1 as const,
  courses,
  subjects,
  students,
  enrollments: enrollments.map((item) => ({
    ...item,
    status:
      item.status === "active" ? ("active" as const) : ("suspended" as const),
  })),
  confirmations: [],
};
