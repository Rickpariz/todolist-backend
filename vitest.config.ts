/// <reference types="vitest/globals" />

import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    exclude: [...configDefaults.exclude],
    coverage: {
      exclude: [
        "./src/modules/*/infrastructure/http/router/*",
        "./src/shared/*",
        "./vitest.config.ts",
        "./src/server.ts",
      ],
    },
  },
});
