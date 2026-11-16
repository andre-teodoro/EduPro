import type { ListRow } from "@edupro/domain";
import { RecordFormDialog } from "@/components/records/RecordFormDialog";
import { useLocalizedSchoolData } from "@/hooks/useLocalizedSchoolData";
import { useStudentStore } from "../stores/useStudentStore";
import { StudentResolver } from "../resolvers/StudentResolver";
export function StudentFormDialog({
  row,
  close,
}: {
  row?: ListRow;
  close: () => void;
}) {
  const courses = useLocalizedSchoolData()!.courses;
  const save = useStudentStore((state) => state.save);
  return (
    <RecordFormDialog
      row={row}
      close={close}
      courses={courses}
      config={StudentResolver.form(!!row)}
      saveRecord={save}
    />
  );
}
