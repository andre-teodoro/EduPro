import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  const { t } = useTranslation();
  return (
    <section className="page">
      <h1>{t("missingTitle")}</h1>
      <p className="muted">{t("missingDescription")}</p>
      <Button asChild className="self-start">
        <NavLink to="/">{t("goHome")}</NavLink>
      </Button>
    </section>
  );
}
