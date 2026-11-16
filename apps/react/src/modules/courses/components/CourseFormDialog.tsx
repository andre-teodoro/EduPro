import type { ListRow } from "@edupro/domain";
import { RecordFormDialog } from "@/components/records/RecordFormDialog";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { useCourseStore } from "../stores/useCourseStore";
import { CourseResolver } from "../resolvers/CourseResolver";
export function CourseFormDialog({
  row,
  close,
}: {
  row?: ListRow;
  close: () => void;
}) {
  const courses = useSchoolDataStore((state) => state.data!.courses);
  const save = useCourseStore((state) => state.save);
  return (
    <RecordFormDialog
      row={row}
      close={close}
      courses={courses}
      config={CourseResolver.form(!!row)}
      saveRecord={save}
    />
  );
}
