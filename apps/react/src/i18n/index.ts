import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  messages,
  defaultLocale,
  normalizeLocale,
} from "@edupro/ui/localization";
function initialLocale() {
  try {
    return normalizeLocale(
      window.localStorage.getItem("edupro:locale") ?? defaultLocale,
    );
  } catch {
    return defaultLocale;
  }
}
void i18n.use(initReactI18next).init({
  resources: {
    "pt-BR": { translation: messages["pt-BR"] },
    en: { translation: messages.en },
    es: { translation: messages.es },
  },
  lng: initialLocale(),
  fallbackLng: defaultLocale,
  supportedLngs: ["pt-BR", "en", "es"],
  interpolation: { escapeValue: false, prefix: "{", suffix: "}" },
  initImmediate: false,
});
export default i18n;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: (typeof messages)["pt-BR"] };
  }
}
