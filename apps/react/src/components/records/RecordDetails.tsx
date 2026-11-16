import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, X } from "lucide-react";
import type { RecordDetails as DetailsModel } from "@/types/records";
import { Button } from "@/components/ui/button";
export function RecordDetails({
  model,
  close,
}: {
  model: DetailsModel;
  close: () => void;
}) {
  const { t } = useTranslation();
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    panel.current?.focus();
  }, [model.title]);
  return (
    <section
      ref={panel}
      tabIndex={-1}
      className="record-details panel panel-padding"
      aria-labelledby="record-detail-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <header className="detail-header">
        <Button
          size="icon"
          variant="ghost"
          aria-label={t("back")}
          onClick={close}
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <span className="muted">{t("detailsTitle")}</span>
        <Button
          size="icon"
          variant="ghost"
          aria-label={t("close")}
          onClick={close}
        >
          <X aria-hidden="true" />
        </Button>
      </header>
      <h2 id="record-detail-title" className="detail-heading">
        {model.title}
      </h2>
      <dl className="detail-list">
        {model.fields.map((field) => (
          <div key={field.label}>
            <dt>{t(field.label)}</dt>
            <dd>
              {field.status ? (
                <span className={`badge ${field.status}`}>
                  {t(field.status)}
                </span>
              ) : (
                field.value
              )}
            </dd>
          </div>
        ))}
      </dl>
      {model.sections.map((section) => (
        <section className="detail-section" key={section.title}>
          <h3>{t(section.title)}</h3>
          {section.items.length ? (
            section.items.map((item) => (
              <div className="detail-item" key={item.id}>
                <span>{item.name}</span>
                {item.status && (
                  <span className={`badge ${item.status}`}>
                    {t(item.status)}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="muted">{t("noLinks")}</p>
          )}
        </section>
      ))}
    </section>
  );
}
