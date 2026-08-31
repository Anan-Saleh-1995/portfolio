import { describe, expect, it } from "vitest";
import { getLocaleDirection, isLocale, normalizeLocale } from "./config";

describe("locale configuration", () => {
  it("recognizes only the finite app locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("he")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it.each([
    ["en", "en"],
    ["EN-us", "en"],
    ["he-IL", "he"],
    ["iw", "he"],
    ["iw_IL", "he"],
    ["ar-EG", "ar"],
  ])("normalizes %s to %s", (candidate, expected) => {
    expect(normalizeLocale(candidate)).toBe(expected);
  });

  it.each([null, undefined, "", "en--US", "fr-FR", 42])(
    "rejects unsupported or malformed candidate %s",
    (candidate) => {
      expect(normalizeLocale(candidate)).toBeNull();
    },
  );

  it("derives document direction from the selected app locale", () => {
    expect(getLocaleDirection("en")).toBe("ltr");
    expect(getLocaleDirection("he")).toBe("rtl");
    expect(getLocaleDirection("ar")).toBe("rtl");
  });
});
