<script setup lang="ts">
import { Eye, Pencil, Trash2, Pause, Play } from "@lucide/vue";
import { useI18n } from "vue-i18n";
import type { EntityKind, ListRow } from "@edupro/domain";
import Button from "@/components/ui/Button.vue";
defineProps<{ kind: EntityKind; row: ListRow }>();
defineEmits<{
  details: [row: ListRow];
  edit: [row: ListRow];
  action: [row: ListRow];
}>();
const { t } = useI18n();
</script>
<template>
  <div class="actions">
    <Button
      size="icon"
      variant="ghost"
      :aria-label="`${t('details')}: ${row.title}`"
      @click="$emit('details', row)"
      ><Eye aria-hidden="true" /></Button
    ><Button
      v-if="kind !== 'enrollments'"
      size="icon"
      variant="ghost"
      :aria-label="`${t('edit')}: ${row.title}`"
      @click="$emit('edit', row)"
      ><Pencil aria-hidden="true" /></Button
    ><Button
      size="icon"
      variant="ghost"
      :aria-label="`${t(kind === 'enrollments' ? (row.status === 'active' ? 'suspend' : 'resume') : 'remove')}: ${row.title}`"
      @click="$emit('action', row)"
      ><template v-if="kind === 'enrollments'"
        ><Pause v-if="row.status === 'active'" aria-hidden="true" /><Play
          v-else
          aria-hidden="true" /></template
      ><Trash2 v-else class="text-destructive" aria-hidden="true"
    /></Button>
  </div>
</template>
