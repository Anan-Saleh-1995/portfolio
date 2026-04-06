import { createContext } from "react";
import type { Theme } from "@/shared/config/theme";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
