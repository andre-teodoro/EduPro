<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  DomainError,
  errorCode,
  type Course,
  type ListRow,
} from "@edupro/domain";
import type { RecordFormConfig, SaveRecord } from "@/types/records";
import { RecordResolver } from "@/resolvers/RecordResolver";
import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";
const props = defineProps<{
  config: RecordFormConfig;
  row?: ListRow;
  courses: Course[];
  saveRecord: SaveRecord;
}>();
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const input = ref(
  props.row ? RecordResolver.input(props.row) : RecordResolver.emptyInput(),
);
const error = ref(""),
  fieldError = ref("");
function save() {
  try {
    props.saveRecord(input.value, props.row?.id);
    emit("close");
  } catch (cause) {
    error.value = errorCode(cause);
    fieldError.value = cause instanceof DomainError ? (cause.field ?? "") : "";
  }
}
</script>
<template>
  <Dialog
    :open="true"
    :title="t(config.title)"
    :description="t(config.description)"
    @update:open="!$event && emit('close')"
    ><form
      novalidate
      @submit.prevent="save"
      @input="
        error = '';
        fieldError = '';
      "
    >
      <div class="form-grid two-columns">
        <label
          v-for="field in config.fields"
          :key="field.key"
          class="field"
          :class="{ 'span-full': field.full }"
          >{{ t(field.key) }}
          <textarea
            v-if="field.type === 'textarea'"
            v-model="input.description"
            class="input"
            :maxlength="field.maxLength"
            :aria-invalid="fieldError === field.key"
            :aria-describedby="
              fieldError === field.key ? 'form-error' : undefined
            "
          />
          <input
            v-else-if="field.type === 'number'"
            v-model.number="input.hours"
            type="number"
            class="input"
            min="1"
            max="20000"
            step="1"
            :aria-invalid="fieldError === field.key"
            :aria-describedby="
              fieldError === field.key ? 'form-error' : undefined
            "
          />
          <input
            v-else
            v-model="input[field.key]"
            :name="field.key"
            :type="field.type"
            :maxlength="field.maxLength"
            class="input"
            :autocomplete="
              field.key === 'name'
                ? 'name'
                : field.key === 'email'
                  ? 'email'
                  : 'off'
            "
            :aria-invalid="fieldError === field.key"
            :aria-describedby="
              fieldError === field.key ? 'form-error' : undefined
            "
          />
        </label>
        <fieldset
          v-if="config.showCourses"
          class="field span-full"
          :aria-describedby="
            fieldError === 'courseIds' ? 'form-error' : undefined
          "
        >
          <legend class="mb-2">{{ t("courseIds") }}</legend>
          <div class="checkbox-group">
            <label
              v-for="course in courses"
              :key="course.id"
              class="checkbox-label"
              ><input
                v-model="input.courseIds"
                type="checkbox"
                :value="course.id"
              />{{ course.name }}</label
            >
          </div>
          <span class="muted">{{ t("selectCourses") }}</span>
        </fieldset>
      </div>
      <p v-if="error" id="form-error" class="error-message mt-4" role="alert">
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
