<script setup lang="ts">
import type { ListRow } from "@edupro/domain";
import RecordFormDialog from "@/components/records/RecordFormDialog.vue";
import { useCourseStore } from "../stores/useCourseStore";
import { CourseResolver } from "../resolvers/CourseResolver";
defineProps<{ row?: ListRow }>();
defineEmits<{ close: [] }>();
const store = useCourseStore();
</script>
<template>
  <RecordFormDialog
    :row="row"
    :courses="store.courses"
    :config="CourseResolver.form(!!row)"
    :save-record="store.save"
    @close="$emit('close')"
  />
</template>
