import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  academicContent,
  DomainError,
  errorCode,
  type Course,
  type EntityInput,
  type ListRow,
} from "@edupro/domain";
import type { RecordFormConfig, SaveRecord } from "@/types/records";
import { RecordResolver } from "@/resolvers/RecordResolver";
import { supportedLocales } from "@edupro/ui/locale";
import { TranslationEditor } from "./TranslationEditor";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
export function RecordFormDialog({
  config,
  localizable = false,
  row,
  courses,
  saveRecord,
  close,
}: {
  localizable?: boolean;
  config: RecordFormConfig;
  row?: ListRow;
  courses: Course[];
  saveRecord: SaveRecord;
  close: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const [activeLocale, setActiveLocale] = useState(locale);
  const formRef = useRef<HTMLFormElement>(null);
  const [focusRequest, setFocusRequest] = useState(0);
  useEffect(() => {
    if (!focusRequest) return;
    const frame = requestAnimationFrame(() =>
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [focusRequest]);
  const [input, setInput] = useState<EntityInput>(() =>
    localizable
      ? RecordResolver.localizedInput(
          row,
          locale,
          supportedLocales.map((language) => language.code),
        )
      : row
        ? RecordResolver.input(row)
        : RecordResolver.emptyInput(),
  );
  const [error, setError] = useState(""),
    [fieldError, setFieldError] = useState("");
  function update<Key extends keyof EntityInput>(
    key: Key,
    value: EntityInput[Key],
  ) {
    setInput((previous) => ({ ...previous, [key]: value }));
    setError("");
    setFieldError("");
  }
  const fields = config.fields.filter(
    (field) => !localizable || !["name", "description"].includes(field.key),
  );
  const courseOptions = courses.map((course) => ({
    ...course,
    ...academicContent(course, localizable ? activeLocale : locale),
  }));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      saveRecord(input, row?.id);
      close();
    } catch (cause) {
      setError(errorCode(cause));
      const field = cause instanceof DomainError ? (cause.field ?? "") : "";
      setFieldError(field);
      const match = /^translations\.(.+)\.(name|description)$/.exec(field);
      if (match) setActiveLocale(match[1]!);
      setFocusRequest((previous) => previous + 1);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title={t(config.title)}
      description={t(config.description)}
    >
      <form ref={formRef} noValidate onSubmit={submit}>
        <div className="form-grid two-columns">
          {localizable && input.content && (
            <TranslationEditor
              content={input.content}
              active={activeLocale}
              onActiveChange={setActiveLocale}
              onChange={(content) => update("content", content)}
              fieldError={fieldError}
              legacy={!!row && !row.content}
            />
          )}
          {fields.map((field) => (
            <label
              key={field.key}
              className={`field ${field.full ? "span-full" : ""}`}
            >
              {t(field.key)}
              {field.type === "textarea" ? (
                <textarea
                  className="input"
                  value={input.description}
                  maxLength={field.maxLength}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  aria-invalid={fieldError === field.key}
                  aria-describedby={
                    fieldError === field.key ? "form-error" : undefined
                  }
                />
              ) : field.type === "number" ? (
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="20000"
                  step="1"
                  value={input.hours}
                  onChange={(event) =>
                    update("hours", Number(event.target.value))
                  }
                  aria-invalid={fieldError === field.key}
                  aria-describedby={
                    fieldError === field.key ? "form-error" : undefined
                  }
                />
              ) : (
                <input
                  className="input"
                  name={field.key}
                  type={field.type}
                  value={input[field.key]}
                  maxLength={field.maxLength}
                  autoComplete={
                    field.key === "name"
                      ? "name"
                      : field.key === "email"
                        ? "email"
                        : "off"
                  }
                  onChange={(event) => {
                    const key = field.key;
                    if (key !== "hours") update(key, event.target.value);
                  }}
                  aria-invalid={fieldError === field.key}
                  aria-describedby={
                    fieldError === field.key ? "form-error" : undefined
                  }
                />
              )}
            </label>
          ))}
          {config.showCourses && (
            <fieldset
              className="field span-full"
              aria-describedby={
                fieldError === "courseIds" ? "form-error" : undefined
              }
            >
              <legend className="mb-2">{t("courseIds")}</legend>
              <div className="checkbox-group">
                {courseOptions.map((course) => (
                  <label className="checkbox-label" key={course.id}>
                    <input
                      type="checkbox"
                      checked={input.courseIds.includes(course.id)}
                      onChange={(event) =>
                        update(
                          "courseIds",
                          event.target.checked
                            ? [...input.courseIds, course.id]
                            : input.courseIds.filter((id) => id !== course.id),
                        )
                      }
                    />
                    {course.name}
                  </label>
                ))}
              </div>
              <span className="muted">{t("selectCourses")}</span>
            </fieldset>
          )}
        </div>
        {error && (
          <p id="form-error" className="error-message mt-4" role="alert">
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
