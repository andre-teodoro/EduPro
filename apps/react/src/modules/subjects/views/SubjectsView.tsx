import { RecordPage } from "@/components/records/RecordPage";
import { useSubjectModule } from "../hooks/useSubjectModule";
import { SubjectFormDialog } from "../components/SubjectFormDialog";
export default function SubjectsView() {
  const module = useSubjectModule();
  return (
    <RecordPage
      module={module}
      renderForm={(row, close) => <SubjectFormDialog row={row} close={close} />}
    />
  );
}
