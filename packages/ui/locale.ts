import type { ptBR } from "./messages";
export type CommonMessages = {
  [Key in keyof typeof ptBR]: Key extends "errors"
    ? { [Code in keyof typeof ptBR.errors]: string }
    : string;
};
export const supportedLocales = [
  { code: "pt-BR", name: "Português" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
] as const;
export type AppLocale = (typeof supportedLocales)[number]["code"];
export const defaultLocale: AppLocale = "en";
export function normalizeLocale(value: string): AppLocale {
  return (
    supportedLocales.find((locale) => locale.code === value)?.code ??
    defaultLocale
  );
}
