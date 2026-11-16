import { type SchoolRepository, type EntityInput } from "@edupro/domain";
export class CourseRepository {
  constructor(private readonly school: SchoolRepository) {}
  save(input: EntityInput, id?: string) {
    return this.school.save("courses", input, id);
  }
  remove(id: string) {
    return this.school.remove("courses", id);
  }
}
