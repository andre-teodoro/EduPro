<script setup lang="ts">
import RecordPage from "@/components/records/RecordPage.vue";
import CourseFormDialog from "../components/CourseFormDialog.vue";
import { useCourseStore } from "../stores/useCourseStore";
const store = useCourseStore();
</script>
<template>
  <RecordPage :module="store"
    ><template #form="{ row, close }"
      ><CourseFormDialog :row="row" @close="close" /></template
  ></RecordPage>
</template>
