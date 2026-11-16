<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Eye, EyeOff, ArrowRight } from "@lucide/vue";
import Button from "@/components/ui/Button.vue";
import { useAuthStore } from "../stores/useAuthStore";
import {
  AuthResolver,
  DEMO_EMAIL,
  DEMO_PASSWORD,
} from "../resolvers/AuthResolver";
import type { LoginIssues } from "../types/Auth";
const { t } = useI18n();
const store = useAuthStore(),
  router = useRouter(),
  route = useRoute();
const email = ref(""),
  password = ref(""),
  showPassword = ref(false),
  issues = ref<LoginIssues>({}),
  formError = ref("");
async function submit() {
  issues.value = AuthResolver.validate({
    email: email.value,
    password: password.value,
  });
  formError.value = "";
  if (issues.value.email || issues.value.password) {
    formError.value = "auth.formInvalid";
    await nextTick();
    document
      .getElementById(issues.value.email ? "login-email" : "login-password")
      ?.focus();
    return;
  }
  if (store.signIn({ email: email.value, password: password.value })) {
    password.value = "";
    await router.replace(AuthResolver.destination(route.query.redirect));
  } else formError.value = store.error;
}
async function demo() {
  email.value = DEMO_EMAIL;
  password.value = DEMO_PASSWORD;
  await submit();
}
</script>
<template>
  <form class="form-grid" novalidate @submit.prevent="submit">
    <label class="field" for="login-email"
      >{{ t("email")
      }}<input
        id="login-email"
        v-model="email"
        class="input"
        type="email"
        name="email"
        autocomplete="username"
        inputmode="email"
        :aria-invalid="!!issues.email"
        :aria-describedby="issues.email ? 'login-email-error' : undefined"
        @input="
          issues.email = undefined;
          formError = '';
        "
    /></label>
    <p v-if="issues.email" id="login-email-error" class="field-error">
      {{ t(issues.email) }}
    </p>
    <div class="field">
      <label for="login-password">{{ t("auth.password") }}</label>
      <div class="relative">
        <input
          id="login-password"
          v-model="password"
          class="input pr-12"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          autocomplete="current-password"
          :aria-invalid="!!issues.password"
          :aria-describedby="
            issues.password ? 'login-password-error' : undefined
          "
          @input="
            issues.password = undefined;
            formError = '';
          "
        /><Button
          variant="ghost"
          size="icon"
          class="absolute right-0 top-0"
          :aria-label="
            t(showPassword ? 'auth.hidePassword' : 'auth.showPassword')
          "
          :aria-pressed="showPassword"
          @click="showPassword = !showPassword"
          ><EyeOff v-if="showPassword" aria-hidden="true" /><Eye
            v-else
            aria-hidden="true"
        /></Button>
      </div>
    </div>
    <p v-if="issues.password" id="login-password-error" class="field-error">
      {{ t(issues.password) }}
    </p>
    <p v-if="formError" class="error-message" role="alert">
      {{ t(formError) }}
    </p>
    <Button type="submit" class="w-full"
      >{{ t("auth.enter") }}<ArrowRight aria-hidden="true"
    /></Button>
    <Button variant="outline" class="w-full" @click="demo">{{
      t("auth.enterDemo")
    }}</Button>
    <p class="muted text-xs text-center">
      {{
        t("auth.credentials", { email: DEMO_EMAIL, password: DEMO_PASSWORD })
      }}
    </p>
    <p class="demo-note">{{ t("auth.demoHint") }}</p>
  </form>
</template>
