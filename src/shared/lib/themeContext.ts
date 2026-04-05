import { createContext } from "react";

export type ThemeContextValue = {
  theme: "dark" | "light";
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
