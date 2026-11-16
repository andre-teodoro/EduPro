<script setup lang="ts">
import { watch } from "vue";
import { useLocale } from "@/composables/useLocale";
import i18n from "@/i18n";
const { locale } = useLocale();
watch(
  locale,
  (value) => {
    i18n.global.locale.value = value;
    document.documentElement.lang = value;
  },
  { immediate: true },
);
</script>
<template><RouterView /></template>
