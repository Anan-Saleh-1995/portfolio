import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import lingui from "eslint-plugin-lingui";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

const typedParserOptions = {
  projectService: true,
  tsconfigRootDir: import.meta.dirname,
};

export default defineConfig([
  globalIgnores([
    "dist",
    "src/locales/*/messages.js",
    "src/locales/*/messages.mjs",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: typedParserOptions,
    },
  },
  {
    files: [
      "src/features/hero/Hero.tsx",
      "src/features/hero/HeroCoordinates.tsx",
      "src/features/hero/HeroFallback.tsx",
      "src/features/hero/HeroMedia.tsx",
      "src/features/hero/HeroOverlay.tsx",
      "src/features/hero/RoninGlyphResolve.tsx",
      "src/features/nav/Nav.tsx",
      "src/features/nav/SourceRepoLink.tsx",
      "src/shared/ui/LanguageSwitcher.tsx",
      "src/shared/ui/ThemeToggle.tsx",
    ],
    ignores: ["**/*.test.tsx"],
    plugins: {
      lingui,
    },
    rules: {
      ...lingui.configs["flat/recommended"].rules,
      "lingui/no-unlocalized-strings": [
        "error",
        {
          ignore: [
            "^(?:ArrowDown|ArrowUp|End|Enter|Escape|Home|Space|Tab)$",
            "^(?:ar|en|he)$",
            "^(?:failed|loaded|loading)$",
            "^(?:Anan Saleh|Rōnin)$",
          ],
          ignoreFunctions: [
            "CustomEvent",
            "*.addEventListener",
            "*.closest",
            "*.getElementById",
            "*.hasAttribute",
            "*.matchMedia",
            "*.open",
            "*.querySelector",
            "*.querySelectorAll",
            "*.removeAttribute",
            "*.removeEventListener",
            "*.setAttribute",
            "useMediaQuery",
          ],
          ignoreNames: [
            {
              regex: {
                pattern:
                  "^(?:DESKTOP_NAV_QUERY|FINAL_GLYPH|FOCUSABLE_SELECTOR|INITIAL_GLYPH|MOBILE_MENU_EVENT|SOURCE_REPOSITORY_URL|actionClassName|aria-controls|aria-expanded|aria-haspopup|aria-hidden|aria-modal|behavior|chars|className|data-.+|decoding|dir|draggable|ease|fetchPriority|focusRing|href|id|lang|loading|overflow|rel|role|sizes|src|srcSet|tabIndex|target|textShadow|translate|type|x)$",
              },
            },
          ],
          useTsTypes: true,
        },
      ],
    },
  },
  {
    files: [
      "api/**/*.ts",
      "server/**/*.ts",
      "shared/**/*.ts",
      "lingui.config.ts",
      "vite.config.ts",
    ],
    ignores: ["server/**/*.test.ts"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
      parserOptions: typedParserOptions,
    },
  },
  {
    files: ["server/**/*.test.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
]);
