<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { errorCode } from "@edupro/domain";
import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";
import { useEnrollmentStore } from "../stores/useEnrollmentStore";
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const store = useEnrollmentStore();
const studentId = ref(""),
  courseId = ref(""),
  error = ref("");
function save() {
  try {
    store.enroll(studentId.value, courseId.value);
    emit("close");
  } catch (cause) {
    error.value = errorCode(cause);
  }
}
</script>
<template>
  <Dialog
    :open="true"
    :title="t('newEnrollments')"
    :description="t('simulatedEmail')"
    @update:open="!$event && emit('close')"
    ><form novalidate @submit.prevent="save" @change="error = ''">
      <div class="form-grid">
        <label class="field"
          >{{ t("student")
          }}<select v-model="studentId" class="input">
            <option value="">{{ t("selectStudent") }}</option>
            <option
              v-for="student in store.options.students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.name }}
            </option>
          </select></label
        ><label class="field"
          >{{ t("course")
          }}<select v-model="courseId" class="input">
            <option value="">{{ t("selectCourse") }}</option>
            <option
              v-for="course in store.options.courses"
              :key="course.id"
              :value="course.id"
            >
              {{ course.name }}
            </option>
          </select></label
        >
      </div>
      <p v-if="error" class="error-message mt-4" role="alert">
        {{ t(`errors.${error}`) }}
      </p>
      <div class="form-footer">
        <Button variant="outline" @click="emit('close')">{{
          t("cancel")
        }}</Button><Button type="submit">{{ t("save") }}</Button>
      </div>
    </form></Dialog
  >
</template>
