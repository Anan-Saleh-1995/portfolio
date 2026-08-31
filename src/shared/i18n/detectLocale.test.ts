import { afterEach, describe, expect, it, vi } from "vitest";
import { detectInitialLocale } from "./detectLocale";

describe("detectInitialLocale", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("always starts in English regardless of stored or browser preferences", () => {
    window.localStorage.setItem("portfolio.locale", "ar");
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue([
      "he-IL",
      "ar-EG",
    ]);
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("he-IL");

    expect(detectInitialLocale()).toBe("en");
  });
});
