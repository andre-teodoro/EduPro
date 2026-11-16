import { Eye, Pencil, Trash2, Pause, Play, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  formatDate,
  initials,
  type EntityKind,
  type ListRow,
} from "@edupro/domain";
import { Button } from "@/components/ui/button";
export function RecordList({
  kind,
  rows,
  grid,
  details,
  edit,
  action,
}: {
  kind: EntityKind;
  rows: ListRow[];
  grid: boolean;
  details: (row: ListRow) => void;
  edit: (row: ListRow) => void;
  action: (row: ListRow) => void;
}) {
  const { t, i18n } = useTranslation();
  const actions = (row: ListRow) => (
    <div className="actions">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => details(row)}
        aria-label={`${t("details")}: ${row.title}`}
      >
        <Eye aria-hidden="true" />
      </Button>
      {kind !== "enrollments" && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => edit(row)}
          aria-label={`${t("edit")}: ${row.title}`}
        >
          <Pencil aria-hidden="true" />
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        onClick={() => action(row)}
        aria-label={`${t(kind === "enrollments" ? (row.status === "active" ? "suspend" : "resume") : "remove")}: ${row.title}`}
      >
        {kind === "enrollments" ? (
          row.status === "active" ? (
            <Pause aria-hidden="true" />
          ) : (
            <Play aria-hidden="true" />
          )
        ) : (
          <Trash2 className="text-destructive" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
  const extra = (row: ListRow) =>
    row.status ? (
      <span className={`badge ${row.status}`}>{t(row.status)}</span>
    ) : row.hours ? (
      <span className="badge">
        {row.hours.toLocaleString(i18n.resolvedLanguage)} h
      </span>
    ) : (
      <div className="tags">
        {row.courseNames.map((name) => (
          <span className="badge" key={name}>
            {name}
          </span>
        ))}
      </div>
    );
  if (!rows.length)
    return (
      <div className="panel empty">
        <Inbox aria-hidden="true" />
        <h2>{t("empty")}</h2>
        <p className="muted">{t("emptyDescription")}</p>
      </div>
    );
  return (
    <>
      {!grid && (
        <div className="panel table-wrap desktop-table">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">
                  {t(kind === "enrollments" ? "student" : "name")}
                </th>
                <th scope="col">
                  {t(
                    kind === "enrollments"
                      ? "status"
                      : kind === "students"
                        ? "linkedCourses"
                        : "hours",
                  )}
                </th>
                <th scope="col">
                  {t(
                    kind === "enrollments"
                      ? "enrolledAt"
                      : kind === "students"
                        ? "email"
                        : kind === "subjects"
                          ? "linkedCourses"
                          : "createdAt",
                  )}
                </th>
                <th scope="col">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="row-title">
                      <span className="avatar">{initials(row.title)}</span>
                      <div>
                        <button
                          className="row-name"
                          onClick={() => details(row)}
                        >
                          {row.title}
                        </button>
                        <p className="row-subtitle">{row.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td>{extra(row)}</td>
                  <td>
                    {kind === "students" ? (
                      row.email
                    ) : kind === "subjects" ? (
                      <div className="tags">
                        {row.courseNames.map((name) => (
                          <span className="badge" key={name}>
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : row.createdAt ? (
                      formatDate(row.createdAt, i18n.resolvedLanguage)
                    ) : (
                      ""
                    )}
                  </td>
                  <td>{actions(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className={`records-grid ${grid ? "" : "mobile-cards"}`}>
        {rows.map((row) => (
          <article className="panel record-card" key={row.id}>
            <div className="card-top">
              <span className="avatar">{initials(row.title)}</span>
              {row.status ? (
                <span className={`badge ${row.status}`}>{t(row.status)}</span>
              ) : row.hours ? (
                <span className="badge">
                  {row.hours.toLocaleString(i18n.resolvedLanguage)} h
                </span>
              ) : null}
            </div>
            <button className="row-name" onClick={() => details(row)}>
              {row.title}
            </button>
            <p className="muted">{row.subtitle}</p>
            {kind !== "courses" && kind !== "enrollments" && (
              <div className="tags">
                {row.courseNames.map((name) => (
                  <span className="badge" key={name}>
                    {name}
                  </span>
                ))}
              </div>
            )}
            <div className="card-bottom">
              <span className="muted text-xs">
                {row.createdAt
                  ? formatDate(row.createdAt, i18n.resolvedLanguage)
                  : row.email}
              </span>
              {actions(row)}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
