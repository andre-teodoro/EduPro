import { RecordPage } from "@/components/records/RecordPage";
import { useEnrollmentModule } from "../hooks/useEnrollmentModule";
import { EnrollmentFormDialog } from "../components/EnrollmentFormDialog";
export default function EnrollmentsView() {
  const module = useEnrollmentModule();
  return (
    <RecordPage
      module={module}
      renderForm={(row, close) => <EnrollmentFormDialog close={close} />}
    />
  );
}
