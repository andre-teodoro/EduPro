<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { BookOpen, Menu, Info, X } from "@lucide/vue";
import { errorCode, SCHOOL_STORAGE_KEY } from "@edupro/domain";
import { useSchoolDataStore } from "@/stores/useSchoolDataStore";
import { useTheme } from "@/composables/useTheme";
import Button from "@/components/ui/Button.vue";
import Dialog from "@/components/ui/Dialog.vue";
import Sidebar from "./Sidebar.vue";
import MailPreview from "@/modules/notifications/components/MailPreview.vue";
const { t } = useI18n();
const store = useSchoolDataStore();
const { preference } = useTheme();
const menu = ref(false),
  restore = ref(false),
  mail = ref(false),
  actionError = ref("");
function sync(e: StorageEvent) {
  if (e.key === SCHOOL_STORAGE_KEY || e.key === null) store.load();
}
function focus() {
  store.load();
}
onMounted(() => {
  store.load();
  window.addEventListener("storage", sync);
  window.addEventListener("focus", focus);
});
onUnmounted(() => {
  window.removeEventListener("storage", sync);
  window.removeEventListener("focus", focus);
});
watch(
  () => store.notice,
  (notice, _, cleanup) => {
    if (!notice) return;
    const timer = setTimeout(store.dismiss, 6000);
    cleanup(() => clearTimeout(timer));
  },
);
function openRestore() {
  menu.value = false;
  actionError.value = "";
  restore.value = true;
}
function openMail() {
  menu.value = false;
  mail.value = true;
}
function reset() {
  try {
    store.reset();
    restore.value = false;
  } catch (cause) {
    actionError.value = errorCode(cause);
  }
}
function skipContent() {
  document.getElementById("main-content")?.focus();
}
</script>
<template>
  <main class="app-shell">
    <a
      href="#main-content"
      @click.prevent="skipContent"
      class="sr-only focus:not-sr-only"
      >{{ t("skipContent") }}</a
    >
    <div class="app-frame">
      <Sidebar
        class="desktop-sidebar"
        :preference="preference"
        @theme="preference = $event"
        @close="menu = false"
        @restore="openRestore"
        @notifications="openMail"
      />
      <div id="main-content" class="app-content" tabindex="-1">
        <header class="mobile-header">
          <Button
            variant="ghost"
            size="icon"
            :aria-label="t('openMenu')"
            :aria-expanded="menu"
            @click="menu = true"
            ><Menu aria-hidden="true" /></Button
          ><span class="brand"
            ><span class="brand-mark"><BookOpen aria-hidden="true" /></span
            >{{ t("app") }}</span
          >
        </header>
        <section v-if="store.error" class="page">
          <h1>{{ t("app") }}</h1>
          <p class="error-message" role="alert">
            {{ t(`errors.${store.error}`) }}
          </p>
          <Button @click="openRestore">{{ t("restore") }}</Button>
        </section>
        <RouterView v-else-if="store.data" :key="$route.path.split('/')[1]" />
        <p v-else class="page" role="status">{{ t("loading") }}</p>
      </div>
    </div>
    <Dialog v-model:open="menu" :title="t('navigation')" drawer
      ><Sidebar
        :preference="preference"
        @theme="preference = $event"
        @close="menu = false"
        @restore="openRestore"
        @notifications="openMail" /></Dialog
    ><Dialog
      v-model:open="restore"
      :title="t('restoreTitle')"
      :description="t('restoreDescription')"
      ><p v-if="actionError" role="alert" class="error-message">
        {{ t(`errors.${actionError}`) }}
      </p>
      <div class="form-footer">
        <Button variant="outline" @click="restore = false">{{
          t("cancel")
        }}</Button><Button variant="destructive" @click="reset">{{
          t("confirm")
        }}</Button>
      </div></Dialog
    ><Dialog
      v-model:open="mail"
      :title="t('mailPreview')"
      :description="t('simulatedEmail')"
      ><MailPreview
    /></Dialog>
    <div v-if="store.notice" class="toast" role="status">
      <Info :size="18" aria-hidden="true" /><span>{{ t(store.notice) }}</span
      ><Button
        variant="ghost"
        size="icon"
        :aria-label="t('close')"
        @click="store.dismiss"
        ><X aria-hidden="true"
      /></Button>
    </div>
  </main>
</template>
