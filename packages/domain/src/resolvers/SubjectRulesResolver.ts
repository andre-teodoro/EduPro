import type { EntityInput, SchoolData } from "../types";
import { CourseRulesResolver } from "./CourseRulesResolver";
export class SubjectRulesResolver {
  static validate(data: SchoolData, input: EntityInput): void {
    CourseRulesResolver.validate(input);
    CourseRulesResolver.validateLinks(data, input.courseIds);
  }
}
