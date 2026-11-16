<script setup lang="ts">
import RecordPage from "@/components/records/RecordPage.vue";
import StudentFormDialog from "../components/StudentFormDialog.vue";
import { useStudentStore } from "../stores/useStudentStore";
const store = useStudentStore();
</script>
<template>
  <RecordPage :module="store"
    ><template #form="{ row, close }"
      ><StudentFormDialog :row="row" @close="close" /></template
  ></RecordPage>
</template>
