<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { ArrowLeft, X } from "@lucide/vue";
import type { RecordDetails } from "@/types/records";
import Button from "@/components/ui/Button.vue";
const props = defineProps<{ model: RecordDetails }>();
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const panel = ref<HTMLElement>();
watch(
  () => props.model.title,
  async () => {
    await nextTick();
    panel.value?.focus();
  },
  { immediate: true },
);
</script>
<template>
  <section
    ref="panel"
    tabindex="-1"
    class="record-details panel panel-padding"
    aria-labelledby="record-detail-title"
    @keydown.esc="emit('close')"
  >
    <header class="detail-header">
      <Button
        size="icon"
        variant="ghost"
        :aria-label="t('back')"
        @click="emit('close')"
        ><ArrowLeft aria-hidden="true" /></Button
      ><span class="muted">{{ t("detailsTitle") }}</span
      ><Button
        size="icon"
        variant="ghost"
        :aria-label="t('close')"
        @click="emit('close')"
        ><X aria-hidden="true"
      /></Button>
    </header>
    <h2 id="record-detail-title" class="detail-heading">{{ model.title }}</h2>
    <dl class="detail-list">
      <div v-for="field in model.fields" :key="field.label">
        <dt>{{ t(field.label) }}</dt>
        <dd>
          <span v-if="field.status" class="badge" :class="field.status">{{
            t(field.status)
          }}</span><template v-else>{{ field.value }}</template>
        </dd>
      </div>
    </dl>
    <section
      v-for="section in model.sections"
      :key="section.title"
      class="detail-section"
    >
      <h3>{{ t(section.title) }}</h3>
      <template v-if="section.items.length"
        ><div v-for="item in section.items" :key="item.id" class="detail-item">
          <span>{{ item.name }}</span><span
            v-if="item.status"
            class="badge"
            :class="item.status"
            >{{ t(item.status) }}</span
          >
        </div></template
      >
      <p v-else class="muted">{{ t("noLinks") }}</p>
    </section>
  </section>
</template>
