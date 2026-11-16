import { Navigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  GraduationCap,
  UsersRound,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/hooks/useTheme";
import { LoginForm } from "../components/LoginForm";
import { useAuthStore } from "../stores/useAuthStore";
import { AuthResolver } from "../resolvers/AuthResolver";
import "@edupro/ui/login.css";
const themes = [
  { value: "light", Icon: Sun },
  { value: "system", Icon: Monitor },
  { value: "dark", Icon: Moon },
] as const;
export default function LoginView() {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();
  const email = useAuthStore((state) => state.email);
  const [params] = useSearchParams();
  if (email)
    return (
      <Navigate to={AuthResolver.destination(params.get("redirect"))} replace />
    );
  return (
    <main className="login-page">
      <div className="login-preferences">
        <LanguageSwitcher />
        <div
          className="login-theme theme-switch"
          role="group"
          aria-label={t("theme")}
        >
          {themes.map(({ value, Icon }) => (
            <Button
              key={value}
              variant={preference === value ? "secondary" : "ghost"}
              size="icon"
              aria-label={t(value)}
              aria-pressed={preference === value}
              onClick={() => setPreference(value)}
            >
              <Icon aria-hidden="true" />
            </Button>
          ))}
        </div>
      </div>
      <div className="login-grid">
        <section className="login-intro">
          <div className="brand">
            <span className="brand-mark">
              <BookOpen aria-hidden="true" />
            </span>
            {t("app")}
          </div>
          <div className="login-copy">
            <p className="badge">{t("workspace")}</p>
            <h1>{t("auth.headline")}</h1>
            <p className="muted">{t("auth.intro")}</p>
          </div>
          <div className="login-benefits">
            <div>
              <GraduationCap aria-hidden="true" />
              <span>
                <strong>{t("auth.academic")}</strong>
                <p>{t("auth.academicDescription")}</p>
              </span>
            </div>
            <div>
              <UsersRound aria-hidden="true" />
              <span>
                <strong>{t("auth.journey")}</strong>
                <p>{t("auth.journeyDescription")}</p>
              </span>
            </div>
          </div>
        </section>
        <section className="login-form-area" aria-labelledby="login-title">
          <div className="login-card">
            <span className="metric-icon mb-5">
              <UsersRound aria-hidden="true" />
            </span>
            <h2 id="login-title">{t("auth.title")}</h2>
            <p className="muted mb-7">{t("auth.description")}</p>
            <LoginForm />
          </div>
          <p className="muted text-xs text-center mt-5">{t("auth.local")}</p>
        </section>
      </div>
    </main>
  );
}
