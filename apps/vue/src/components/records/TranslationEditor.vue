<script setup lang="ts">
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "reka-ui";
import type { AcademicContent, LocalizedContent } from "@edupro/domain";
import { supportedLocales } from "@edupro/ui/locale";
const content = defineModel<LocalizedContent<AcademicContent>>({
  required: true,
});
const active = defineModel<string>("active", { required: true });
defineProps<{ fieldError: string; legacy?: boolean }>();
const { t } = useI18n();
const languages = computed(() => [
  ...supportedLocales,
  ...Object.keys(content.value.translations)
    .filter((code) => !supportedLocales.some((item) => item.code === code))
    .map((code) => ({ code, name: code })),
]);
watch(
  () => content.value.sourceLocale,
  (selected, previous) => {
    if (previous !== "" || !selected) return;
    const original = Object.entries(content.value.translations).find(
      ([, value]) => value.name || value.description,
    );
    if (original && original[0] !== selected) {
      content.value.translations[selected] = { ...original[1] };
      content.value.translations[original[0]] = { name: "", description: "" };
    }
    active.value = selected;
  },
);
function status(code: string) {
  const value = content.value.translations[code]!;
  return value.name.trim() && value.description.trim()
    ? "translationComplete"
    : value.name.trim() || value.description.trim()
      ? "translationIncomplete"
      : "translationEmpty";
}
</script>
<template>
  <div class="span-full min-w-0">
    <div class="field mb-3">
      <label for="content-source-locale">{{ t("sourceLocale") }}</label>
      <select
        id="content-source-locale"
        v-model="content.sourceLocale"
        class="input"
        :aria-invalid="fieldError === 'sourceLocale'"
        :aria-describedby="
          fieldError === 'sourceLocale' ? 'form-error' : undefined
        "
      >
        <option disabled value="">{{ t("sourceLocale") }}</option>
        <option
          v-for="language in languages"
          :key="language.code"
          :value="language.code"
        >
          {{ language.name }}
        </option>
      </select>
    </div>
    <p v-if="legacy" class="muted mb-3">{{ t("legacyContentHint") }}</p>
    <p id="translation-hint" class="muted mb-3">{{ t("translationHint") }}</p>
    <TabsRoot v-if="content.sourceLocale" v-model="active">
      <TabsList
        :aria-label="t('translations')"
        class="flex flex-wrap gap-2 mb-4"
      >
        <TabsTrigger
          v-for="language in languages"
          :key="language.code"
          :value="language.code"
          class="rounded-lg border border-border px-3 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          :aria-label="`${language.name}: ${t(status(language.code))}`"
        >
          {{ language.name
          }}{{ language.code === content.sourceLocale ? " *" : "" }}
          <span class="block text-xs">{{ t(status(language.code)) }}</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        v-for="language in languages"
        :key="language.code"
        :value="language.code"
        class="form-grid"
        :lang="language.code"
      >
        <label class="field" :for="`translation-name-${language.code}`"
          >{{ t("name") }}
          <input
            :id="`translation-name-${language.code}`"
            v-model="content.translations[language.code]!.name"
            :name="`translations[${language.code}][name]`"
            class="input"
            maxlength="120"
            :aria-invalid="fieldError === `translations.${language.code}.name`"
            :aria-describedby="
              fieldError === `translations.${language.code}.name`
                ? 'form-error'
                : 'translation-hint'
            "
          />
        </label>
        <label class="field" :for="`translation-description-${language.code}`"
          >{{ t("description") }}
          <textarea
            :id="`translation-description-${language.code}`"
            v-model="content.translations[language.code]!.description"
            :name="`translations[${language.code}][description]`"
            class="input"
            maxlength="2000"
            :aria-invalid="
              fieldError === `translations.${language.code}.description`
            "
            :aria-describedby="
              fieldError === `translations.${language.code}.description`
                ? 'form-error'
                : 'translation-hint'
            "
          />
        </label>
      </TabsContent>
    </TabsRoot>
  </div>
</template>
