import { cp, mkdir, writeFile, rm, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { supportedLocales, defaultLocale } from "../packages/ui/locale.ts";
import { landingMessages } from "../packages/ui/landing.ts";
const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const output = resolve(root, "dist");
if (dirname(output) !== root || process.cwd() !== root)
  throw new Error("Run this script from the EduPro workspace root.");
await rm(output, { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const framework of ["vue", "react"])
  await cp(`apps/${framework}/dist`, `dist/${framework}`, { recursive: true });
await writeFile("dist/.nojekyll", "");
const template = await readFile(
  new URL("./landing/index.html", import.meta.url),
  "utf8",
);
const config = JSON.stringify({
  languages: supportedLocales,
  defaultLocale,
  messages: landingMessages,
}).replaceAll("<", "\\u003c");
const options = supportedLocales
  .map(
    ({ code, name }) =>
      `<option value="${code}" lang="${code}"${code === defaultLocale ? " selected" : ""}>${name}</option>`,
  )
  .join("");
await writeFile(
  "dist/index.html",
  template
    .replace("<!-- LANGUAGE_OPTIONS -->", options)
    .replace("/* LANDING_CONFIG */ {}", config),
);
