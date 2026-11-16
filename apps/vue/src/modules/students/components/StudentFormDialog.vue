<script setup lang="ts">
import type { ListRow } from "@edupro/domain";
import RecordFormDialog from "@/components/records/RecordFormDialog.vue";
import { useStudentStore } from "../stores/useStudentStore";
import { StudentResolver } from "../resolvers/StudentResolver";
defineProps<{ row?: ListRow }>();
defineEmits<{ close: [] }>();
const store = useStudentStore();
</script>
<template>
  <RecordFormDialog
    :row="row"
    :courses="store.courses"
    :config="StudentResolver.form(!!row)"
    :save-record="store.save"
    @close="$emit('close')"
  />
</template>
