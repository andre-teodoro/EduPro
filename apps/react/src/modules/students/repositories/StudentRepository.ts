import { type SchoolRepository, type EntityInput } from "@edupro/domain";
export class StudentRepository {
  constructor(private readonly school: SchoolRepository) {}
  save(input: EntityInput, id?: string) {
    return this.school.save("students", input, id);
  }
  remove(id: string) {
    return this.school.remove("students", id);
  }
}
