import { SchoolRepository } from "@edupro/domain";
export function createSchoolRepository() {
  return new SchoolRepository(window.localStorage);
}
