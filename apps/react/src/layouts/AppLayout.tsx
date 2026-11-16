import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { BookOpen, Menu, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { errorCode, SCHOOL_STORAGE_KEY } from "@edupro/domain";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { useTheme } from "@/hooks/useTheme";
import { Sidebar } from "./Sidebar";
import { MailPreview } from "@/modules/notifications/components/MailPreview";

export function AppLayout() {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const [menu, setMenu] = useState(false);
  const [restore, setRestore] = useState(false);
  const [mail, setMail] = useState(false);
  const [actionError, setActionError] = useState("");
  const data = useSchoolDataStore((s) => s.data);
  const error = useSchoolDataStore((s) => s.error);
  const notice = useSchoolDataStore((s) => s.notice);
  const load = useSchoolDataStore((s) => s.load);
  const restoreData = useSchoolDataStore((s) => s.reset);
  const dismiss = useSchoolDataStore((s) => s.dismiss);
  useEffect(() => {
    load();
    const sync = (event: StorageEvent) => {
      if (event.key === SCHOOL_STORAGE_KEY || event.key === null) load();
    };
    const focus = () => load();
    window.addEventListener("storage", sync);
    window.addEventListener("focus", focus);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", focus);
    };
  }, [load]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(dismiss, 6000);
    return () => clearTimeout(timer);
  }, [notice, dismiss]);
  const sideProps = {
    close: () => setMenu(false),
    preference,
    setPreference: (value: string) => {
      void setPreference(value);
    },
    restore: () => {
      setMenu(false);
      setActionError("");
      setRestore(true);
    },
    notifications: () => {
      setMenu(false);
      setMail(true);
    },
  };
  function reset() {
    try {
      restoreData();
      setRestore(false);
    } catch (cause) {
      setActionError(errorCode(cause));
    }
  }
  return (
    <main className="app-shell">
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
        className="sr-only focus:not-sr-only"
      >
        {t("skipContent")}
      </a>
      <div className="app-frame">
        <Sidebar {...sideProps} className="desktop-sidebar" />
        <div className="app-content" id="main-content" tabIndex={-1}>
          <header className="mobile-header">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenu(true)}
              aria-label={t("openMenu")}
              aria-expanded={menu}
            >
              <Menu aria-hidden="true" />
            </Button>
            <span className="brand">
              <span className="brand-mark">
                <BookOpen aria-hidden="true" />
              </span>
              {t("app")}
            </span>
          </header>
          {error ? (
            <section className="page">
              <h1>{t("app")}</h1>
              <p className="error-message" role="alert">
                {t(`errors.${error}` as "errors.unexpected")}
              </p>
              <Button onClick={() => setRestore(true)}>{t("restore")}</Button>
            </section>
          ) : data ? (
            <Outlet />
          ) : (
            <p className="page" role="status">
              {t("loading")}
            </p>
          )}
        </div>
      </div>
      <Dialog open={menu} onOpenChange={setMenu} title={t("navigation")} drawer>
        <Sidebar {...sideProps} />
      </Dialog>
      <Dialog
        open={restore}
        onOpenChange={setRestore}
        title={t("restoreTitle")}
        description={t("restoreDescription")}
      >
        {actionError && (
          <p className="error-message" role="alert">
            {t(`errors.${actionError}` as "errors.unexpected")}
          </p>
        )}
        <div className="form-footer">
          <Button variant="outline" onClick={() => setRestore(false)}>
            {t("cancel")}
          </Button>
          <Button variant="destructive" onClick={reset}>
            {t("confirm")}
          </Button>
        </div>
      </Dialog>
      <Dialog
        open={mail}
        onOpenChange={setMail}
        title={t("mailPreview")}
        description={t("simulatedEmail")}
      >
        <MailPreview />
      </Dialog>
      {notice && (
        <div className="toast" role="status">
          <Info aria-hidden="true" size={18} />
          <span>{t(notice as "saved")}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={dismiss}
            aria-label={t("close")}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
      )}
    </main>
  );
}
