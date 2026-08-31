import { defineConfig } from "@lingui/cli";
import { formatter } from "@lingui/format-po";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "he", "ar"],
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["<rootDir>/src"],
      exclude: ["<rootDir>/src/**/*.test.{ts,tsx}", "<rootDir>/src/test/**"],
    },
  ],
  format: formatter({
    lineNumbers: false,
    origins: true,
  }),
  compileNamespace: "es",
  orderBy: "message",
});
