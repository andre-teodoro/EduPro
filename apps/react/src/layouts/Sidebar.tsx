import { NavLink, useNavigate } from "react-router";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  UsersRound,
  ClipboardCheck,
  Library,
  Sun,
  Moon,
  Monitor,
  RotateCcw,
  Bell,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
const links = [
  { path: "/", key: "overview", icon: LayoutDashboard },
  { path: "/courses", key: "courses", icon: GraduationCap },
  { path: "/subjects", key: "subjects", icon: Library },
  { path: "/students", key: "students", icon: UsersRound },
  { path: "/enrollments", key: "enrollments", icon: ClipboardCheck },
] as const;
export function Sidebar({
  className = "",
  close,
  preference,
  setPreference,
  restore,
  notifications,
}: {
  className?: string;
  close: () => void;
  preference: string | null;
  setPreference: (value: string) => void;
  restore: () => void;
  notifications: () => void;
}) {
  const { t } = useTranslation();
  const email = useAuthStore((state) => state.email);
  const signOut = useAuthStore((state) => state.signOut);
  const authError = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  return (
    <aside className={`sidebar ${className}`}>
      <NavLink to="/" className="brand" onClick={close}>
        <span className="brand-mark">
          <BookOpen aria-hidden="true" />
        </span>
        {t("app")}
      </NavLink>
      <nav className="nav-links" aria-label={t("navigation")}>
        {links.map(({ path, key, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            onClick={close}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon aria-hidden="true" />
            {t(key)}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <LanguageSwitcher />
        <Button
          variant="ghost"
          className="justify-start"
          onClick={notifications}
        >
          <Bell aria-hidden="true" />
          {t("notifications")}
        </Button>
        <div className="theme-switch" role="group" aria-label={t("theme")}>
          {(
            [
              { value: "light", Icon: Sun },
              { value: "system", Icon: Monitor },
              { value: "dark", Icon: Moon },
            ] as const
          ).map(({ value, Icon }) => (
            <Button
              key={value}
              variant={preference === value ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setPreference(value)}
              aria-label={t(value)}
              aria-pressed={preference === value}
            >
              <Icon aria-hidden="true" />
            </Button>
          ))}
        </div>
        <a className="nav-link" href={`${import.meta.env.BASE_URL}../vue/`}>
          <ExternalLink aria-hidden="true" />
          <span>{t("framework")} Vue</span>
        </a>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start whitespace-normal text-left"
          onClick={restore}
        >
          <RotateCcw aria-hidden="true" />
          {t("restore")}
        </Button>
        <div className="profile">
          <span className="avatar">EP</span>
          <span>
            <strong>{t("profile")}</strong>
            <small>{email}</small>
          </span>
        </div>
        <Button
          variant="ghost"
          className="justify-start whitespace-normal text-left"
          onClick={() => {
            if (signOut()) void navigate("/login", { replace: true });
          }}
        >
          <LogOut aria-hidden="true" />
          {t("auth.signOut")}
        </Button>
        {authError && (
          <p role="alert" className="field-error">
            {t(authError)}
          </p>
        )}
        <span className="badge justify-center">React + TypeScript</span>
      </div>
    </aside>
  );
}
