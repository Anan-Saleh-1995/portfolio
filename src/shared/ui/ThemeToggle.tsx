import { Sun, Moon } from "lucide-react";
import { getNextTheme, isDarkTheme } from "@/shared/config/theme";
import { useTheme } from "@/shared/lib/useTheme";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const nextTheme = getNextTheme(theme);

  return (
    <button
      onClick={toggle}
      className={styles.root}
      aria-label={`Switch to ${nextTheme} mode`}
    >
      {isDarkTheme(theme) ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
