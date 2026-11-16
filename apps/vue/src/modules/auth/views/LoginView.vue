<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  BookOpen,
  GraduationCap,
  UsersRound,
  Sun,
  Moon,
  Monitor,
} from "@lucide/vue";
import { useTheme } from "@/composables/useTheme";
import Button from "@/components/ui/Button.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import LoginForm from "../components/LoginForm.vue";
const { t } = useI18n();
const { preference } = useTheme();
const themes = [
  { value: "light", icon: Sun },
  { value: "system", icon: Monitor },
  { value: "dark", icon: Moon },
];
</script>
<template>
  <main class="login-page">
    <div class="login-preferences">
      <LanguageSwitcher />
      <div
        class="login-theme theme-switch"
        role="group"
        :aria-label="t('theme')"
      >
        <Button
          v-for="theme in themes"
          :key="theme.value"
          :variant="preference === theme.value ? 'secondary' : 'ghost'"
          size="icon"
          :aria-label="t(theme.value)"
          :aria-pressed="preference === theme.value"
          @click="preference = theme.value"
          ><component :is="theme.icon" aria-hidden="true"
        /></Button>
      </div>
    </div>
    <div class="login-grid">
      <section class="login-intro">
        <div class="brand">
          <span class="brand-mark"><BookOpen aria-hidden="true" /></span
          >{{ t("app") }}
        </div>
        <div class="login-copy">
          <p class="badge">{{ t("workspace") }}</p>
          <h1>{{ t("auth.headline") }}</h1>
          <p class="muted">{{ t("auth.intro") }}</p>
        </div>
        <div class="login-benefits">
          <div>
            <GraduationCap aria-hidden="true" /><span
              ><strong>{{ t("auth.academic") }}</strong>
              <p>{{ t("auth.academicDescription") }}</p></span
            >
          </div>
          <div>
            <UsersRound aria-hidden="true" /><span
              ><strong>{{ t("auth.journey") }}</strong>
              <p>{{ t("auth.journeyDescription") }}</p></span
            >
          </div>
        </div>
      </section>
      <section class="login-form-area" aria-labelledby="login-title">
        <div class="login-card">
          <span class="metric-icon mb-5"
            ><UsersRound aria-hidden="true"
          /></span>
          <h2 id="login-title">{{ t("auth.title") }}</h2>
          <p class="muted mb-7">{{ t("auth.description") }}</p>
          <LoginForm />
        </div>
        <p class="muted text-xs text-center mt-5">{{ t("auth.local") }}</p>
      </section>
    </div>
  </main>
</template>
<style src="@edupro/ui/login.css"></style>
