import type { Course, EntityInput, EntityKind, ListRow } from "@edupro/domain";
import type { MessageKey } from "@edupro/ui/messages";

export interface DetailField {
  label: MessageKey;
  value: string;
  status?: "active" | "suspended";
}
export interface DetailItem {
  id: string;
  name: string;
  status?: "active" | "suspended";
}
export interface DetailSection {
  title: MessageKey;
  items: DetailItem[];
}
export interface RecordDetails {
  title: string;
  fields: DetailField[];
  sections: DetailSection[];
}
export interface RecordConfirmation {
  title: MessageKey;
  description: MessageKey;
  destructive: boolean;
}
export interface FormField {
  key: "name" | "description" | "hours" | "cpf" | "birthDate" | "email";
  type: "text" | "textarea" | "number" | "date" | "email";
  full?: boolean;
  maxLength?: number;
}
export interface RecordFormConfig {
  title: MessageKey;
  description: MessageKey;
  fields: FormField[];
  showCourses: boolean;
}
export interface RecordsModule {
  kind: EntityKind;
  createLabel: MessageKey;
  rows: ListRow[];
  courses: Course[];
  details: (row: ListRow, locale?: string) => RecordDetails;
  confirmation: (row: ListRow | null) => RecordConfirmation;
  applyAction: (row: ListRow) => void;
}
export type SaveRecord = (input: EntityInput, id?: string) => void;
