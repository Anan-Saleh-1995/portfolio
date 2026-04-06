import { createContext } from "react";

interface ThemeContextValue {
  theme: "dark" | "light";
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
