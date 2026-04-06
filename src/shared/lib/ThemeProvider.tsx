import { useState, useEffect, useCallback, type ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  getNextTheme,
  getPreferredTheme,
  isTheme,
  type Theme,
} from "@/shared/config/theme";
import { ThemeContext } from "./themeContext";

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(saved) ? saved : getPreferredTheme();
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => getNextTheme(prev));
  }, []);

  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
};
