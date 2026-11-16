import { ptBR } from "./messages";
import en from "./locales/en";
import es from "./locales/es";
import auth from "./auth/pt-BR";
import authEn from "./auth/en";
import authEs from "./auth/es";
export * from "./locale";
export const messages = {
  "pt-BR": { ...ptBR, language: "Idioma", auth },
  en: { ...en, language: "Language", auth: authEn },
  es: { ...es, language: "Idioma", auth: authEs },
};
