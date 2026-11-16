import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./apps/vue/src", import.meta.url)) },
  },
  test: { include: ["packages/**/*.test.ts", "apps/vue/src/**/*.test.ts"] },
});
