import { describe, expect, it } from "vitest";
import {
  THEMES,
  getNextTheme,
  getPreferredTheme,
  isDarkTheme,
  isTheme,
} from "./theme";

describe("theme helpers", () => {
  it("recognizes valid theme values", () => {
    expect(isTheme(THEMES.dark)).toBe(true);
    expect(isTheme(THEMES.light)).toBe(true);
    expect(isTheme("sepia")).toBe(false);
  });

  it("returns the opposite theme when toggling", () => {
    expect(getNextTheme(THEMES.dark)).toBe(THEMES.light);
    expect(getNextTheme(THEMES.light)).toBe(THEMES.dark);
  });

  it("identifies the dark theme", () => {
    expect(isDarkTheme(THEMES.dark)).toBe(true);
    expect(isDarkTheme(THEMES.light)).toBe(false);
  });

  it("uses the browser preference for the initial theme", () => {
    expect(getPreferredTheme()).toBe(THEMES.dark);
  });
});
