import { type SchoolRepository, type EntityInput } from "@edupro/domain";
export class SubjectRepository {
  constructor(private readonly school: SchoolRepository) {}
  save(input: EntityInput, id?: string) {
    return this.school.save("subjects", input, id);
  }
  remove(id: string) {
    return this.school.remove("subjects", id);
  }
}
