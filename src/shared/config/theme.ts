export const THEMES = {
  dark: "dark",
  light: "light",
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

export const THEME_ACCENT_HEX: Record<Theme, string> = {
  [THEMES.dark]: "#c41e3a",
  [THEMES.light]: "#8b0000",
};

export const THEME_STORAGE_KEY = "theme";

export const isTheme = (value: unknown): value is Theme =>
  value === THEMES.dark || value === THEMES.light;

export const isDarkTheme = (theme: Theme) => theme === THEMES.dark;

export const getPreferredTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.dark
    : THEMES.light;

export const getNextTheme = (theme: Theme): Theme =>
  isDarkTheme(theme) ? THEMES.light : THEMES.dark;
