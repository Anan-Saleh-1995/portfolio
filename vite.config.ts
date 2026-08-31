import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { lingui, linguiTransformerBabelPreset } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    lingui({ failOnCompileError: true }),
    babel({ presets: [linguiTransformerBabelPreset()] }),
    tailwindcss(),
    mode === "analyze" &&
      visualizer({
        open: true,
        filename: "dist/bundle-stats.html",
        gzipSize: true,
      }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
    css: true,
  },
}));
