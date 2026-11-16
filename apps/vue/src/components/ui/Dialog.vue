<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "reka-ui";
import { X } from "@lucide/vue";
import { useI18n } from "vue-i18n";
import Button from "./Button.vue";
defineProps<{
  open: boolean;
  title: string;
  description?: string;
  drawer?: boolean;
}>();
defineEmits<{ "update:open": [value: boolean] }>();
const { t } = useI18n();
</script>
<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)"
    ><DialogPortal
      ><DialogOverlay class="dialog-overlay" /><DialogContent
        :class="drawer ? 'drawer-content' : 'dialog-content'"
        ><DialogTitle :class="drawer ? 'sr-only' : 'dialog-title'">{{
          title
        }}</DialogTitle
        ><DialogDescription
          :class="description ? 'dialog-description' : 'sr-only'"
          >{{ description ?? title }}</DialogDescription
        ><slot /><DialogClose as-child
          ><Button
            variant="ghost"
            size="icon"
            class="dialog-x"
            :aria-label="t('close')"
            ><X
              aria-hidden="true" /></Button></DialogClose></DialogContent></DialogPortal
  ></DialogRoot>
</template>
