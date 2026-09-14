import { Sun, Moon } from "lucide-react";
import { isDarkTheme } from "@/shared/config/theme";
import { useTheme } from "@/shared/lib/useTheme";
import styles from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const darkTheme = isDarkTheme(theme);
  const accessibleLabel = darkTheme
    ? "Switch to light mode"
    : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.root}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      {darkTheme ? (
        <Sun size={18} aria-hidden={true} />
      ) : (
        <Moon size={18} aria-hidden={true} />
      )}
    </button>
  );
};
