import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import {
  GraduationCap,
  UsersRound,
  Library,
  ClipboardCheck,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { initials } from "@edupro/domain";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "../stores/useDashboardStore";

const metrics = [
  { key: "registeredCourses", Icon: GraduationCap, path: "/courses" },
  { key: "registeredStudents", Icon: UsersRound, path: "/students" },
  { key: "registeredSubjects", Icon: Library, path: "/subjects" },
  { key: "activeEnrollments", Icon: ClipboardCheck, path: "/enrollments" },
] as const;
export default function DashboardView() {
  const { t } = useTranslation();
  const stats = useDashboardStore();
  return (
    <section className="page" aria-labelledby="dashboard-title">
      <header className="page-header">
        <div>
          <div className="workspace-label">{t("workspace")}</div>
          <h1 id="dashboard-title">{t("overview")}</h1>
          <p className="muted">{t("overviewDescription")}</p>
        </div>
        <Button asChild>
          <NavLink to="/students">
            <UsersRound aria-hidden="true" />
            {t("seeStudents")}
          </NavLink>
        </Button>
      </header>
      <div className="metric-grid">
        {metrics.map(({ key, Icon, path }, i) => (
          <NavLink to={path} key={key} className="panel metric">
            <div className="metric-top">
              <span className="muted">{t(key)}</span>
              <span className="metric-icon">
                <Icon aria-hidden="true" />
              </span>
            </div>
            <strong>{stats.totals[i]}</strong>
          </NavLink>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel panel-padding">
          <header className="panel-title">
            <div>
              <h2>{t("courseDistribution")}</h2>
              <p className="muted text-xs mt-1">
                {t("courseDistributionDescription")}
              </p>
            </div>
            <GraduationCap
              className="text-primary"
              size={20}
              aria-hidden="true"
            />
          </header>
          {stats.courses.map((course) => (
            <div className="bar-row" key={course.id}>
              <div className="bar-label">
                <NavLink to={`/courses/${course.id}`}>{course.name}</NavLink>
                <strong>{course.count}</strong>
              </div>
              <div className="bar-track" aria-hidden="true">
                <div
                  className="bar-fill"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </section>
        <section className="panel panel-padding">
          <header className="panel-title">
            <h2>{t("recentEnrollments")}</h2>
            <Button size="sm" variant="ghost" asChild>
              <NavLink to="/enrollments">
                {t("seeAll")}
                <ArrowUpRight aria-hidden="true" />
              </NavLink>
            </Button>
          </header>
          {stats.recent.length ? (
            stats.recent.map((row) => (
              <NavLink
                to={`/enrollments/${row.id}`}
                key={row.id}
                className="recent-row"
              >
                <span className="avatar">{initials(row.title)}</span>
                <div className="recent-info">
                  <strong>{row.title}</strong>
                  <p>{row.subtitle}</p>
                </div>
                <span className={`badge ${row.status}`}>{t(row.status!)}</span>
              </NavLink>
            ))
          ) : (
            <p className="muted">{t("noEnrollments")}</p>
          )}
        </section>
      </div>
      <section className="panel panel-padding page-header">
        <div>
          <h2>{t("quickStart")}</h2>
          <p className="muted">{t("quickStartDescription")}</p>
        </div>
        <Button variant="outline" asChild>
          <NavLink to="/students">
            {t("seeStudents")}
            <ArrowUpRight aria-hidden="true" />
          </NavLink>
        </Button>
      </section>
      <p className="demo-note">
        <Info aria-hidden="true" />
        <span>
          <strong>{t("demo")}. </strong>
          {t("demoDescription")}
        </span>
      </p>
    </section>
  );
}
