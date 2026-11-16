import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { errorCode, type ListRow } from "@edupro/domain";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { RecordsModule } from "@/types/records";
import { RecordResolver } from "@/resolvers/RecordResolver";
import { RecordList } from "./RecordList";
import { RecordDetails } from "./RecordDetails";
export function RecordPage({
  module,
  renderForm,
}: {
  module: RecordsModule;
  renderForm: (row: ListRow | undefined, close: () => void) => ReactNode;
}) {
  const kind = module.kind;
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [grid, setGrid] = useState(false);
  const [form, setForm] = useState<{ row?: ListRow } | null>(null);
  const [action, setAction] = useState<ListRow | null>(null);
  const [error, setError] = useState("");
  const rows = module.rows;
  const filtered = RecordResolver.filter(rows, search, course, status);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));
  const currentPage = Math.min(page, pageCount);
  const selected = rows.find((r) => r.id === id);
  const confirmation = module.confirmation(action);
  function applyAction() {
    if (!action) return;
    try {
      module.applyAction(action);
      setAction(null);
    } catch (cause) {
      setError(errorCode(cause));
    }
  }
  return (
    <section
      className={`page entity-page ${selected ? "has-detail" : ""}`}
      aria-labelledby={selected ? "record-detail-title" : "page-title"}
    >
      <header className="page-header">
        <div>
          <h1 id="page-title">{t(kind)}</h1>
          <p className="muted">{t(`${kind}Description`)}</p>
        </div>
        <Button onClick={() => setForm({})}>
          <Plus aria-hidden="true" />
          {t(module.createLabel)}
        </Button>
      </header>
      <div className="toolbar">
        <label className="search-box">
          <span className="sr-only">{t("search")}</span>
          <Search aria-hidden="true" />
          <input
            className="input"
            type="search"
            value={search}
            placeholder={t(kind === "students" ? "search" : "searchGeneric")}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>
        {kind !== "courses" && (
          <label className="filter-select">
            <span className="sr-only">{t("course")}</span>
            <select
              className="input"
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                setPage(1);
              }}
            >
              <option value="">{t("allCourses")}</option>
              {module.courses.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        {kind === "enrollments" && (
          <label className="filter-select">
            <span className="sr-only">{t("status")}</span>
            <select
              className="input"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">{t("allStatuses")}</option>
              <option value="active">{t("active")}</option>
              <option value="suspended">{t("suspended")}</option>
            </select>
          </label>
        )}
        <div className="view-switch">
          <Button
            variant={grid ? "ghost" : "secondary"}
            size="icon"
            onClick={() => setGrid(false)}
            aria-label={t("listView")}
            aria-pressed={!grid}
          >
            <List aria-hidden="true" />
          </Button>
          <Button
            variant={grid ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setGrid(true)}
            aria-label={t("gridView")}
            aria-pressed={grid}
          >
            <LayoutGrid aria-hidden="true" />
          </Button>
        </div>
      </div>
      {(search || course || status) && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          onClick={() => {
            setSearch("");
            setCourse("");
            setStatus("");
            setPage(1);
          }}
        >
          {t("clearFilters")}
        </Button>
      )}
      <div>
        <RecordList
          kind={kind}
          rows={filtered.slice((currentPage - 1) * 6, currentPage * 6)}
          grid={grid}
          details={(row) => {
            void navigate(`/${kind}/${row.id}`);
          }}
          edit={(row) => setForm({ row })}
          action={(row) => {
            setError("");
            setAction(row);
          }}
        />
        <footer className="pagination">
          <span>
            {filtered.length} {t("records")}
          </span>
          <div className="actions">
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage === 1}
              aria-label={t("previous")}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <span>
              {t("page")} {currentPage} {t("of")} {pageCount}
            </span>
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage === pageCount}
              aria-label={t("next")}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </footer>
      </div>
      <p className="demo-note">
        <Info aria-hidden="true" />
        {t("demoDescription")}
      </p>
      {form && renderForm(form.row, () => setForm(null))}
      {selected && (
        <RecordDetails
          model={module.details(selected, i18n.resolvedLanguage)}
          close={() => {
            void navigate(`/${kind}`);
          }}
        />
      )}
      {id && !selected && (
        <Dialog
          open
          onOpenChange={() => {
            void navigate(`/${kind}`);
          }}
          title={t("missingTitle")}
          description={t("errors.notFound")}
        >
          <Button
            onClick={() => {
              void navigate(`/${kind}`);
            }}
          >
            {t("back")}
          </Button>
        </Dialog>
      )}
      <Dialog
        open={!!action}
        onOpenChange={(open) => {
          if (!open) setAction(null);
        }}
        title={t(confirmation.title)}
        description={t(confirmation.description)}
      >
        {error && (
          <p className="error-message" role="alert">
            {t(`errors.${error}` as "errors.unexpected")}
          </p>
        )}
        <div className="form-footer">
          <Button variant="outline" onClick={() => setAction(null)}>
            {t("cancel")}
          </Button>
          <Button
            variant={confirmation.destructive ? "destructive" : "default"}
            onClick={applyAction}
          >
            {t("confirm")}
          </Button>
        </div>
      </Dialog>
    </section>
  );
}
