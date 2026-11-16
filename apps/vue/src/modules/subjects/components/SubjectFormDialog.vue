<script setup lang="ts">
import type { ListRow } from "@edupro/domain";
import RecordFormDialog from "@/components/records/RecordFormDialog.vue";
import { useSubjectStore } from "../stores/useSubjectStore";
import { SubjectResolver } from "../resolvers/SubjectResolver";
defineProps<{ row?: ListRow }>();
defineEmits<{ close: [] }>();
const store = useSubjectStore();
</script>
<template>
  <RecordFormDialog
    localizable
    :row="row"
    :courses="store.courses"
    :config="SubjectResolver.form(!!row)"
    :save-record="store.save"
    @close="$emit('close')"
  />
</template>
