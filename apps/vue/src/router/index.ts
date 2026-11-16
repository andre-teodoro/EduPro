import { createRouter, createWebHashHistory } from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
import { AuthResolver } from "@/modules/auth/resolvers/AuthResolver";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/modules/auth/views/LoginView.vue"),
    },
    {
      path: "/",
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () =>
            import("@/modules/dashboard/views/DashboardView.vue"),
        },
        {
          path: "courses/:id?",
          name: "courses",
          component: () => import("@/modules/courses/views/CoursesView.vue"),
        },
        {
          path: "subjects/:id?",
          name: "subjects",
          component: () => import("@/modules/subjects/views/SubjectsView.vue"),
        },
        {
          path: "students/:id?",
          name: "students",
          component: () => import("@/modules/students/views/StudentsView.vue"),
        },
        {
          path: "enrollments/:id?",
          name: "enrollments",
          component: () =>
            import("@/modules/enrollments/views/EnrollmentsView.vue"),
        },
        {
          path: ":pathMatch(.*)*",
          name: "not-found",
          component: () => import("@/views/NotFound.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated)
    return { name: "login", query: { redirect: to.fullPath } };
  if (to.name === "login" && auth.isAuthenticated)
    return AuthResolver.destination(to.query.redirect);
});

export default router;
