<script setup lang="ts">
import { Languages } from "@lucide/vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "@/composables/useLocale";
import { supportedLocales } from "@/i18n/types";
const { t } = useI18n();
const { locale } = useLocale();
</script>
<template>
  <label class="language-switcher"
    ><span class="sr-only">{{ t("language") }}</span
    ><Languages aria-hidden="true" /><select v-model="locale" class="input">
      <option
        v-for="language in supportedLocales"
        :key="language.code"
        :value="language.code"
        :lang="language.code"
      >
        {{ language.name }}
      </option>
    </select></label
  >
</template>
