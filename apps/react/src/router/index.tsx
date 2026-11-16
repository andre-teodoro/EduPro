import { lazy, Suspense } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/layouts/AppLayout";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
const LoginView = lazy(() => import("@/modules/auth/views/LoginView"));
const DashboardView = lazy(
  () => import("@/modules/dashboard/views/DashboardView"),
);
const CoursesView = lazy(() => import("@/modules/courses/views/CoursesView"));
const SubjectsView = lazy(
  () => import("@/modules/subjects/views/SubjectsView"),
);
const StudentsView = lazy(
  () => import("@/modules/students/views/StudentsView"),
);
const EnrollmentsView = lazy(
  () => import("@/modules/enrollments/views/EnrollmentsView"),
);
const NotFound = lazy(() => import("@/views/NotFound"));
function RequireAuth() {
  const email = useAuthStore((state) => state.email);
  const location = useLocation();
  return email ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
      replace
    />
  );
}
export function AppRouter() {
  const { t } = useTranslation();
  const ready = useAuthStore((state) => state.ready);
  const loading = (
    <p className="page" role="status">
      {t("loading")}
    </p>
  );
  if (!ready) return loading;
  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="login" element={<LoginView />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardView />} />
              <Route path="courses/:id?" element={<CoursesView />} />
              <Route path="subjects/:id?" element={<SubjectsView />} />
              <Route path="students/:id?" element={<StudentsView />} />
              <Route path="enrollments/:id?" element={<EnrollmentsView />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
