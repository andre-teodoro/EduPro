<script setup lang="ts">
import { Inbox } from "@lucide/vue";
import { useI18n } from "vue-i18n";
import {
  formatDate,
  initials,
  type EntityKind,
  type ListRow,
} from "@edupro/domain";
import RecordActions from "./RecordActions.vue";
defineProps<{ kind: EntityKind; rows: ListRow[]; grid: boolean }>();
const emit = defineEmits<{
  details: [row: ListRow];
  edit: [row: ListRow];
  action: [row: ListRow];
}>();
const { t, locale } = useI18n();
</script>
<template>
  <div v-if="!rows.length" class="panel empty">
    <Inbox aria-hidden="true" />
    <h2>{{ t("empty") }}</h2>
    <p class="muted">{{ t("emptyDescription") }}</p>
  </div>
  <template v-else
    ><div v-if="!grid" class="panel table-wrap desktop-table">
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col">
              {{ t(kind === "enrollments" ? "student" : "name") }}
            </th>
            <th scope="col">
              {{
                t(
                  kind === "enrollments"
                    ? "status"
                    : kind === "students"
                      ? "linkedCourses"
                      : "hours",
                )
              }}
            </th>
            <th scope="col">
              {{
                t(
                  kind === "enrollments"
                    ? "enrolledAt"
                    : kind === "students"
                      ? "email"
                      : kind === "subjects"
                        ? "linkedCourses"
                        : "createdAt",
                )
              }}
            </th>
            <th scope="col">{{ t("actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>
              <div class="row-title">
                <span class="avatar">{{ initials(row.title) }}</span>
                <div>
                  <button class="row-name" @click="emit('details', row)">
                    {{ row.title }}
                  </button>
                  <p class="row-subtitle">{{ row.subtitle }}</p>
                </div>
              </div>
            </td>
            <td>
              <span v-if="row.status" class="badge" :class="row.status">{{
                t(row.status)
              }}</span><span v-else-if="row.hours" class="badge"
                >{{ row.hours.toLocaleString(locale) }} h</span
              >
              <div v-else class="tags">
                <span
                  v-for="name in row.courseNames"
                  :key="name"
                  class="badge"
                  >{{ name }}</span
                >
              </div>
            </td>
            <td>
              <template v-if="kind === 'students'">{{ row.email }}</template>
              <div v-else-if="kind === 'subjects'" class="tags">
                <span
                  v-for="name in row.courseNames"
                  :key="name"
                  class="badge"
                  >{{ name }}</span
                >
              </div>
              <template v-else-if="row.createdAt">{{
                formatDate(row.createdAt, locale)
              }}</template>
            </td>
            <td>
              <RecordActions
                :kind="kind"
                :row="row"
                @details="emit('details', $event)"
                @edit="emit('edit', $event)"
                @action="emit('action', $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="records-grid" :class="{ 'mobile-cards': !grid }">
      <article v-for="row in rows" :key="row.id" class="panel record-card">
        <div class="card-top">
          <span class="avatar">{{ initials(row.title) }}</span><span
            v-if="row.status"
            class="badge"
            :class="row.status"
            >{{ t(row.status) }}</span
          ><span v-else-if="row.hours" class="badge"
            >{{ row.hours.toLocaleString(locale) }} h</span
          >
        </div>
        <button class="row-name" @click="emit('details', row)">
          {{ row.title }}
        </button>
        <p class="muted">{{ row.subtitle }}</p>
        <div v-if="kind !== 'courses' && kind !== 'enrollments'" class="tags">
          <span v-for="name in row.courseNames" :key="name" class="badge">{{
            name
          }}</span>
        </div>
        <div class="card-bottom">
          <span class="muted text-xs">{{
            row.createdAt ? formatDate(row.createdAt, locale) : row.email
          }}</span><RecordActions
            :kind="kind"
            :row="row"
            @details="emit('details', $event)"
            @edit="emit('edit', $event)"
            @action="emit('action', $event)"
          />
        </div>
      </article></div
  ></template>
</template>
