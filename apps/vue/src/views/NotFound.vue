<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Button from "@/components/ui/Button.vue";
const { t } = useI18n();
</script>
<template>
  <section class="page">
    <h1>{{ t("missingTitle") }}</h1>
    <p class="muted">{{ t("missingDescription") }}</p>
    <Button as-child class="self-start"
      ><RouterLink to="/">{{ t("goHome") }}</RouterLink></Button
    >
  </section>
</template>
