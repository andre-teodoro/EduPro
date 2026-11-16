import { cp, mkdir, writeFile, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const output = resolve(root, "dist");
if (dirname(output) !== root || process.cwd() !== root)
  throw new Error("Run this script from the EduPro workspace root.");
await rm(output, { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const framework of ["vue", "react"])
  await cp(`apps/${framework}/dist`, `dist/${framework}`, { recursive: true });
await writeFile("dist/.nojekyll", "");
await writeFile(
  "dist/index.html",
  `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="EduPro: gestão escolar em Vue e React. Explore duas implementações do mesmo produto."><title>EduPro — Vue & React</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:24px;font-family:system-ui,sans-serif;background:#f6f8fc;color:#19283f}main{width:min(100%,650px);border:1px solid #dce3ef;border-radius:20px;background:white;padding:clamp(24px,6vw,56px);box-shadow:0 4px 24px #172a4608}h1{font-size:42px;letter-spacing:-2px;margin:0 0 12px}p{color:#53647c;line-height:1.7}nav{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:32px 0}a{padding:16px;border-radius:12px;background:#2563eb;color:white;text-align:center;text-decoration:none;font-weight:600}a:focus-visible{outline:3px solid #172a46;outline-offset:4px}small{display:block;color:#53647c;line-height:1.6}span{display:inline-block;padding:8px 12px;border-radius:10px;background:#eaf1ff;color:#2563eb;font-weight:700;margin-bottom:24px}@media(max-width:400px){nav{grid-template-columns:1fr}}
</style></head><body><main><span>Portfólio frontend</span><h1>EduPro</h1><p>Uma escola, duas implementações. Explore cursos, disciplinas, alunos e matrículas com a mesma experiência em Vue e React.</p><nav aria-label="Escolher versão"><a href="./vue/">Explorar em Vue</a><a href="./react/">Explorar em React</a></nav><small>Dados fictícios e persistência local. As duas versões compartilham suas alterações neste navegador. Nenhum e-mail é enviado.</small></main></body></html>`,
);
