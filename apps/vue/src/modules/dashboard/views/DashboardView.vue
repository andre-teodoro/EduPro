<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  GraduationCap,
  UsersRound,
  Library,
  ClipboardCheck,
  Info,
  ArrowUpRight,
} from "@lucide/vue";
import { initials } from "@edupro/domain";
import Button from "@/components/ui/Button.vue";
import { useDashboardStore } from "../stores/useDashboardStore";
const { t } = useI18n();
const store = useDashboardStore();
const stats = computed(() => store.statistics!);
const metrics = [
  { key: "registeredCourses", icon: GraduationCap, path: "/courses" },
  { key: "registeredStudents", icon: UsersRound, path: "/students" },
  { key: "registeredSubjects", icon: Library, path: "/subjects" },
  { key: "activeEnrollments", icon: ClipboardCheck, path: "/enrollments" },
];
</script>
<template>
  <section class="page" aria-labelledby="dashboard-title">
    <header class="page-header">
      <div>
        <div class="workspace-label">{{ t("workspace") }}</div>
        <h1 id="dashboard-title">{{ t("overview") }}</h1>
        <p class="muted">{{ t("overviewDescription") }}</p>
      </div>
      <Button as-child
        ><RouterLink to="/students"
          ><UsersRound aria-hidden="true" />{{ t("seeStudents") }}</RouterLink
        ></Button
      >
    </header>
    <div class="metric-grid">
      <RouterLink
        v-for="(metric, index) in metrics"
        :key="metric.key"
        :to="metric.path"
        class="panel metric"
        ><div class="metric-top">
          <span class="muted">{{ t(metric.key) }}</span><span
            class="metric-icon"
            ><component :is="metric.icon" aria-hidden="true"
          /></span>
        </div>
        <strong>{{ stats.totals[index] }}</strong></RouterLink
      >
    </div>
    <div class="dashboard-grid">
      <section class="panel panel-padding">
        <header class="panel-title">
          <div>
            <h2>{{ t("courseDistribution") }}</h2>
            <p class="muted text-xs mt-1">
              {{ t("courseDistributionDescription") }}
            </p>
          </div>
          <GraduationCap class="text-primary" :size="20" aria-hidden="true" />
        </header>
        <div v-for="course in stats.courses" :key="course.id" class="bar-row">
          <div class="bar-label">
            <RouterLink :to="`/courses/${course.id}`">{{
              course.name
            }}</RouterLink><strong>{{ course.count }}</strong>
          </div>
          <div class="bar-track" aria-hidden="true">
            <div class="bar-fill" :style="{ width: `${course.percentage}%` }" />
          </div>
        </div>
      </section>
      <section class="panel panel-padding">
        <header class="panel-title">
          <h2>{{ t("recentEnrollments") }}</h2>
          <Button size="sm" variant="ghost" as-child
            ><RouterLink to="/enrollments"
              >{{ t("seeAll") }}<ArrowUpRight aria-hidden="true" /></RouterLink
          ></Button>
        </header>
        <template v-if="stats.recent.length"
          ><RouterLink
            v-for="row in stats.recent"
            :key="row.id"
            :to="`/enrollments/${row.id}`"
            class="recent-row"
            ><span class="avatar">{{ initials(row.title) }}</span>
            <div class="recent-info">
              <strong>{{ row.title }}</strong>
              <p>{{ row.subtitle }}</p>
            </div>
            <span class="badge" :class="row.status">{{
              t(row.status!)
            }}</span></RouterLink
          ></template
        >
        <p v-else class="muted">{{ t("noEnrollments") }}</p>
      </section>
    </div>
    <section class="panel panel-padding page-header">
      <div>
        <h2>{{ t("quickStart") }}</h2>
        <p class="muted">{{ t("quickStartDescription") }}</p>
      </div>
      <Button variant="outline" as-child
        ><RouterLink to="/students"
          >{{ t("seeStudents") }}<ArrowUpRight aria-hidden="true" /></RouterLink
      ></Button>
    </section>
    <p class="demo-note">
      <Info aria-hidden="true" /><span
        ><strong>{{ t("demo") }}. </strong>{{ t("demoDescription") }}</span
      >
    </p>
  </section>
</template>
