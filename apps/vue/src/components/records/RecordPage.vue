<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Info,
} from "@lucide/vue";
import { errorCode, type ListRow } from "@edupro/domain";
import type { RecordsModule } from "@/types/records";
import { RecordResolver } from "@/resolvers/RecordResolver";
import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";
import RecordList from "./RecordList.vue";
import RecordDetails from "./RecordDetails.vue";
const props = defineProps<{ module: RecordsModule }>();
const { t, locale } = useI18n();
const route = useRoute(),
  router = useRouter();
const kind = computed(() => props.module.kind);
const search = ref(""),
  course = ref(""),
  status = ref(""),
  page = ref(1),
  grid = ref(false);
const form = ref<{ row?: ListRow } | null>(null),
  action = ref<ListRow | null>(null),
  error = ref("");
const rows = computed(() => props.module.rows);
const filtered = computed(() =>
  RecordResolver.filter(rows.value, search.value, course.value, status.value),
);
const pageCount = computed(() =>
  Math.max(1, Math.ceil(filtered.value.length / 6)),
);
const currentPage = computed(() => Math.min(page.value, pageCount.value));
const visible = computed(() =>
  filtered.value.slice((currentPage.value - 1) * 6, currentPage.value * 6),
);
const selected = computed(() =>
  rows.value.find((row) => row.id === route.params.id),
);
const detailsModel = computed(() =>
  selected.value ? props.module.details(selected.value, locale.value) : null,
);
const confirmation = computed(() => props.module.confirmation(action.value));
watch([search, course, status], () => {
  page.value = 1;
});
function clear() {
  search.value = "";
  course.value = "";
  status.value = "";
  page.value = 1;
}
function details(row: ListRow) {
  void router.push(`/${kind.value}/${row.id}`);
}
function closeDetails() {
  void router.push(`/${kind.value}`);
}
function closeForm() {
  form.value = null;
}
function askAction(row: ListRow) {
  error.value = "";
  action.value = row;
}
function applyAction() {
  if (!action.value) return;
  try {
    props.module.applyAction(action.value);
    action.value = null;
  } catch (cause) {
    error.value = errorCode(cause);
  }
}
</script>
<template>
  <section
    class="page entity-page"
    :class="{ 'has-detail': selected }"
    :aria-labelledby="selected ? 'record-detail-title' : 'page-title'"
  >
    <header class="page-header">
      <div>
        <h1 id="page-title">{{ t(kind) }}</h1>
        <p class="muted">{{ t(`${kind}Description`) }}</p>
      </div>
      <Button @click="form = {}">
        <Plus aria-hidden="true" />
        {{ t(module.createLabel) }}
      </Button>
    </header>
    <div class="toolbar">
      <label class="search-box"
        ><span class="sr-only">{{ t("search") }}</span>
        <Search aria-hidden="true" />
        <input
          v-model="search"
          class="input"
          type="search"
          :placeholder="
            t(kind === 'students' ? 'search' : 'searchGeneric')
          " /></label
      ><label v-if="kind !== 'courses'" class="filter-select"
        ><span class="sr-only">{{ t("course") }}</span
        ><select v-model="course" class="input">
          <option value="">{{ t("allCourses") }}</option>
          <option
            v-for="item in module.courses"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select></label
      ><label v-if="kind === 'enrollments'" class="filter-select"
        ><span class="sr-only">{{ t("status") }}</span
        ><select v-model="status" class="input">
          <option value="">{{ t("allStatuses") }}</option>
          <option value="active">{{ t("active") }}</option>
          <option value="suspended">{{ t("suspended") }}</option>
        </select></label
      >
      <div class="view-switch">
        <Button
          :variant="grid ? 'ghost' : 'secondary'"
          size="icon"
          :aria-label="t('listView')"
          :aria-pressed="!grid"
          @click="grid = false"
        >
          <List aria-hidden="true" />
        </Button>
        <Button
          :variant="grid ? 'secondary' : 'ghost'"
          size="icon"
          :aria-label="t('gridView')"
          :aria-pressed="grid"
          @click="grid = true"
        >
          <LayoutGrid aria-hidden="true" />
        </Button>
      </div>
    </div>
    <Button
      v-if="search || course || status"
      variant="ghost"
      size="sm"
      class="self-start"
      @click="clear"
      >{{ t("clearFilters") }}
    </Button>
    <div>
      <RecordList
        :kind="kind"
        :rows="visible"
        :grid="grid"
        @details="details"
        @edit="form = { row: $event }"
        @action="askAction"
      />
      <footer class="pagination">
        <span>{{ filtered.length }} {{ t("records") }}</span>
        <div class="actions">
          <Button
            size="icon"
            variant="outline"
            :disabled="currentPage === 1"
            :aria-label="t('previous')"
            @click="page = currentPage - 1"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <span
            >{{ t("page") }} {{ currentPage }} {{ t("of") }}
            {{ pageCount }}</span
          >
          <Button
            size="icon"
            variant="outline"
            :disabled="currentPage === pageCount"
            :aria-label="t('next')"
            @click="page = currentPage + 1"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </footer>
    </div>
    <p class="demo-note">
      <Info aria-hidden="true" />
      {{ t("demoDescription") }}
    </p>
    <slot v-if="form" name="form" :row="form.row" :close="closeForm" />
    <RecordDetails
      v-if="selected"
      :model="detailsModel!"
      @close="closeDetails"
    />
    <Dialog
      v-if="route.params.id && !selected"
      :open="true"
      :title="t('missingTitle')"
      :description="t('errors.notFound')"
      @update:open="closeDetails"
    >
      <Button @click="closeDetails">{{ t("back") }}</Button>
    </Dialog>
    <Dialog
      :open="!!action"
      :title="t(confirmation.title)"
      :description="t(confirmation.description)"
      @update:open="!$event && (action = null)"
      ><p v-if="error" class="error-message" role="alert">
        {{ t(`errors.${error}`) }}
      </p>
      <div class="form-footer">
        <Button variant="outline" @click="action = null"
          >{{ t("cancel") }}
        </Button>
        <Button
          :variant="confirmation.destructive ? 'destructive' : 'default'"
          @click="applyAction"
          >{{ t("confirm") }}
        </Button>
      </div>
    </Dialog>
  </section>
</template>
