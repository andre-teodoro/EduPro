<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useNotificationStore } from "../stores/useNotificationStore";
const { t } = useI18n();
const store = useNotificationStore();
const selected = ref("");
const confirmations = computed(() => store.confirmations);
const current = computed(
  () =>
    confirmations.value.find((c) => c.id === selected.value) ??
    confirmations.value[0],
);
</script>
<template>
  <div v-if="current" class="form-grid">
    <label class="field"
      >{{ t("notifications")
      }}<select
        class="input"
        :value="current.id"
        @change="selected = ($event.target as HTMLSelectElement).value"
      >
        <option v-for="item in confirmations" :key="item.id" :value="item.id">
          {{ item.label }}
        </option>
      </select></label
    >
    <article class="mail">
      <p class="muted">
        {{ t("to") }}: {{ current.to }}<br />{{ current.date }}
      </p>
      <h3>{{ t("mailSubject") }}</h3>
      <p>{{ t("mailGreeting") }} {{ current.studentName }}!</p>
      <p>
        {{ t("mailBody") }} <strong>{{ current.courseName }}</strong>.
      </p>
      <p>{{ t("mailEnding") }}</p>
      <strong>{{ t("app") }}</strong>
    </article>
  </div>
  <p v-else class="muted">{{ t("noNotifications") }}</p>
</template>
