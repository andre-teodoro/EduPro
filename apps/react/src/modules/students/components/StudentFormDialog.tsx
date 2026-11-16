import type { ListRow } from "@edupro/domain";
import { RecordFormDialog } from "@/components/records/RecordFormDialog";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { useStudentStore } from "../stores/useStudentStore";
import { StudentResolver } from "../resolvers/StudentResolver";
export function StudentFormDialog({
  row,
  close,
}: {
  row?: ListRow;
  close: () => void;
}) {
  const courses = useSchoolDataStore((state) => state.data!.courses);
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
