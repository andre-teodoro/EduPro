import { RecordPage } from "@/components/records/RecordPage";
import { useCourseModule } from "../hooks/useCourseModule";
import { CourseFormDialog } from "../components/CourseFormDialog";
export default function CoursesView() {
  const module = useCourseModule();
  return (
    <RecordPage
      module={module}
      renderForm={(row, close) => <CourseFormDialog row={row} close={close} />}
    />
  );
}
