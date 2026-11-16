import { createI18n } from "vue-i18n";
import { messages, defaultLocale } from "@edupro/ui/localization";
export { messages };
export default createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
});
