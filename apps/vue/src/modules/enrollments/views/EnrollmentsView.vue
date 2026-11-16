<script setup lang="ts">
import RecordPage from "@/components/records/RecordPage.vue";
import EnrollmentFormDialog from "../components/EnrollmentFormDialog.vue";
import { useEnrollmentStore } from "../stores/useEnrollmentStore";
const store = useEnrollmentStore();
</script>
<template>
  <RecordPage :module="store"
    ><template #form="{ row, close }"
      ><EnrollmentFormDialog @close="close" /></template
  ></RecordPage>
</template>
