<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  UsersRound,
  ClipboardCheck,
  Library,
  Sun,
  Moon,
  Monitor,
  RotateCcw,
  Bell,
  ExternalLink,
  LogOut,
} from "@lucide/vue";
import Button from "@/components/ui/Button.vue";
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/stores/useAuthStore";
defineProps<{ preference: string }>();
defineEmits<{
  close: [];
  restore: [];
  notifications: [];
  theme: [value: string];
}>();
const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();
function signOut() {
  auth.signOut();
  void router.replace("/login");
}
const base = import.meta.env.BASE_URL;
const links = [
  { path: "/", key: "overview", icon: LayoutDashboard },
  { path: "/courses", key: "courses", icon: GraduationCap },
  { path: "/subjects", key: "subjects", icon: Library },
  { path: "/students", key: "students", icon: UsersRound },
  { path: "/enrollments", key: "enrollments", icon: ClipboardCheck },
];
const themes = [
  { value: "light", icon: Sun },
  { value: "system", icon: Monitor },
  { value: "dark", icon: Moon },
];
</script>
<template>
  <aside class="sidebar">
    <RouterLink to="/" class="brand" @click="$emit('close')"
      ><span class="brand-mark"><BookOpen aria-hidden="true" /></span
      >{{ t("app") }}</RouterLink
    >
    <nav class="nav-links" :aria-label="t('navigation')">
      <RouterLink
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="nav-link"
        :class="{
          active:
            link.path === '/'
              ? $route.path === '/'
              : $route.path.startsWith(link.path),
        }"
        @click="$emit('close')"
        ><component :is="link.icon" aria-hidden="true" />{{
          t(link.key)
        }}</RouterLink
      >
    </nav>
    <div class="sidebar-bottom">
      <LanguageSwitcher />
      <Button
        variant="ghost"
        class="justify-start"
        @click="$emit('notifications')"
        ><Bell aria-hidden="true" />{{ t("notifications") }}</Button
      >
      <div class="theme-switch" role="group" :aria-label="t('theme')">
        <Button
          v-for="theme in themes"
          :key="theme.value"
          :variant="preference === theme.value ? 'secondary' : 'ghost'"
          size="icon"
          :aria-label="t(theme.value)"
          :aria-pressed="preference === theme.value"
          @click="$emit('theme', theme.value)"
          ><component :is="theme.icon" aria-hidden="true"
        /></Button>
      </div>
      <a class="nav-link" :href="`${base}../react/`"
        ><ExternalLink aria-hidden="true" />{{ t("framework") }} React</a
      ><Button
        variant="ghost"
        size="sm"
        class="justify-start whitespace-normal text-left"
        @click="$emit('restore')"
        ><RotateCcw aria-hidden="true" />{{ t("restore") }}</Button
      >
      <div class="profile">
        <span class="avatar">EP</span
        ><span
          ><strong>{{ t("profile") }}</strong
          ><small>{{ auth.email }}</small></span
        >
      </div>
      <Button
        variant="ghost"
        class="justify-start whitespace-normal text-left"
        @click="signOut"
        ><LogOut aria-hidden="true" />{{ t("auth.signOut") }}</Button
      >
      <span class="badge justify-center">Vue + TypeScript</span>
    </div>
  </aside>
</template>
