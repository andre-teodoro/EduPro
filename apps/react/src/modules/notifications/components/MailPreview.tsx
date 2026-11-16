import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotificationStore } from "../stores/useNotificationStore";
export function MailPreview() {
  const { t, i18n } = useTranslation();
  const confirmations = useNotificationStore(i18n.resolvedLanguage ?? "en");
  const [selected, setSelected] = useState("");
  const current =
    confirmations.find((c) => c.id === selected) ?? confirmations[0];
  if (!current) return <p className="muted">{t("noNotifications")}</p>;
  return (
    <div className="form-grid">
      <label className="field">
        {t("notifications")}
        <select
          className="input"
          value={current.id}
          onChange={(e) => setSelected(e.target.value)}
        >
          {confirmations.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <article className="mail">
        <p className="muted">
          {t("to")}: {current.to}
          <br />
          {current.date}
        </p>
        <h3>{t("mailSubject")}</h3>
        <p>
          {t("mailGreeting")} {current.studentName}!
        </p>
        <p>
          {t("mailBody")} <strong>{current.courseName}</strong>.
        </p>
        <p>{t("mailEnding")}</p>
        <strong>{t("app")}</strong>
      </article>
    </div>
  );
}
