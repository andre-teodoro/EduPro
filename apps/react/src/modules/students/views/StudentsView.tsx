import { RecordPage } from "@/components/records/RecordPage";
import { useStudentModule } from "../hooks/useStudentModule";
import { StudentFormDialog } from "../components/StudentFormDialog";
export default function StudentsView() {
  const module = useStudentModule();
  return (
    <RecordPage
      module={module}
      renderForm={(row, close) => <StudentFormDialog row={row} close={close} />}
    />
  );
}
