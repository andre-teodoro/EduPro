import type { ListRow } from "@edupro/domain";
import { RecordFormDialog } from "@/components/records/RecordFormDialog";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { useSubjectStore } from "../stores/useSubjectStore";
import { SubjectResolver } from "../resolvers/SubjectResolver";
export function SubjectFormDialog({
  row,
  close,
}: {
  row?: ListRow;
  close: () => void;
}) {
  const courses = useSchoolDataStore((state) => state.data!.courses);
  const save = useSubjectStore((state) => state.save);
  return (
    <RecordFormDialog
      localizable
      row={row}
      close={close}
      courses={courses}
      config={SubjectResolver.form(!!row)}
      saveRecord={save}
    />
  );
}
