import { createContext } from "react";

type ThemeContextValue = {
  theme: "dark" | "light";
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);
