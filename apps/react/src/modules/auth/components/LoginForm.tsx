import { useRef, useState, type FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import {
  AuthResolver,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  type LoginInput,
  type LoginIssues,
} from "@edupro/presentation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../stores/useAuthStore";
export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate(),
    [params] = useSearchParams();
  const signIn = useAuthStore((state) => state.signIn);
  const [input, setInput] = useState<LoginInput>({ email: "", password: "" });
  const [issues, setIssues] = useState<LoginIssues>({}),
    [formError, setFormError] = useState<
      "auth.formInvalid" | "auth.sessionError" | ""
    >("");
  const [showPassword, setShowPassword] = useState(false);
  const emailField = useRef<HTMLInputElement>(null),
    passwordField = useRef<HTMLInputElement>(null);
  function enter(credentials: LoginInput) {
    const result = AuthResolver.validate(credentials);
    setIssues(result);
    setFormError("");
    if (result.email || result.password) {
      setFormError("auth.formInvalid");
      (result.email ? emailField : passwordField).current?.focus();
      return;
    }
    if (signIn(credentials)) {
      setInput((previous) => ({ ...previous, password: "" }));
      void navigate(AuthResolver.destination(params.get("redirect")), {
        replace: true,
      });
    } else setFormError("auth.sessionError");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    enter(input);
  }
  return (
    <form className="form-grid" noValidate onSubmit={submit}>
      <label className="field" htmlFor="login-email">
        {t("email")}
        <input
          ref={emailField}
          id="login-email"
          className="input"
          type="email"
          name="email"
          autoComplete="username"
          inputMode="email"
          value={input.email}
          onChange={(event) => {
            setInput({ ...input, email: event.target.value });
            setIssues({ ...issues, email: undefined });
            setFormError("");
          }}
          aria-invalid={!!issues.email}
          aria-describedby={issues.email ? "login-email-error" : undefined}
        />
      </label>
      {issues.email && (
        <p id="login-email-error" className="field-error">
          {t(issues.email)}
        </p>
      )}
      <div className="field">
        <label htmlFor="login-password">{t("auth.password")}</label>
        <div className="relative">
          <input
            ref={passwordField}
            id="login-password"
            className="input pr-12"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            value={input.password}
            onChange={(event) => {
              setInput({ ...input, password: event.target.value });
              setIssues({ ...issues, password: undefined });
              setFormError("");
            }}
            aria-invalid={!!issues.password}
            aria-describedby={
              issues.password ? "login-password-error" : undefined
            }
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            aria-label={t(
              showPassword ? "auth.hidePassword" : "auth.showPassword",
            )}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
      {issues.password && (
        <p id="login-password-error" className="field-error">
          {t(issues.password)}
        </p>
      )}
      {formError && (
        <p role="alert" className="error-message">
          {t(formError)}
        </p>
      )}
      <Button type="submit" className="w-full">
        {t("auth.enter")}
        <ArrowRight aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => enter({ email: DEMO_EMAIL, password: DEMO_PASSWORD })}
      >
        {t("auth.enterDemo")}
      </Button>
      <p className="muted text-xs text-center">
        {t("auth.credentials", { email: DEMO_EMAIL, password: DEMO_PASSWORD })}
      </p>
      <p className="demo-note">{t("auth.demoHint")}</p>
    </form>
  );
}
