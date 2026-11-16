import { useState } from "react";
import { useTranslation } from "react-i18next";
import { errorCode } from "@edupro/domain";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useEnrollmentStore } from "../stores/useEnrollmentStore";
import { useEnrollmentOptions } from "../hooks/useEnrollmentModule";
export function EnrollmentFormDialog({ close }: { close: () => void }) {
  const { t } = useTranslation();
  const data = useEnrollmentOptions();
  const enroll = useEnrollmentStore((s) => s.enroll);
  const [studentId, setStudent] = useState("");
  const [courseId, setCourse] = useState("");
  const [error, setError] = useState("");
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title={t("newEnrollments")}
      description={t("simulatedEmail")}
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          try {
            enroll(studentId, courseId);
            close();
          } catch (cause) {
            setError(errorCode(cause));
          }
        }}
      >
        <div className="form-grid">
          <label className="field">
            {t("student")}
            <select
              className="input"
              value={studentId}
              onChange={(e) => {
                setStudent(e.target.value);
                setError("");
              }}
            >
              <option value="">{t("selectStudent")}</option>
              {data.students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("course")}
            <select
              className="input"
              value={courseId}
              onChange={(e) => {
                setCourse(e.target.value);
                setError("");
              }}
            >
              <option value="">{t("selectCourse")}</option>
              {data.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && (
          <p role="alert" className="error-message mt-4">
            {t(`errors.${error}` as "errors.unexpected")}
          </p>
        )}
        <div className="form-footer">
          <Button variant="outline" onClick={close}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("save")}</Button>
        </div>
      </form>
    </Dialog>
  );
}
