<script setup lang="ts">
import RecordPage from "@/components/records/RecordPage.vue";
import SubjectFormDialog from "../components/SubjectFormDialog.vue";
import { useSubjectStore } from "../stores/useSubjectStore";
const store = useSubjectStore();
</script>
<template>
  <RecordPage :module="store"
    ><template #form="{ row, close }"
      ><SubjectFormDialog :row="row" @close="close" /></template
  ></RecordPage>
</template>
