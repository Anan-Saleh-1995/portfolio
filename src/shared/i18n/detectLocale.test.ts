import { describe, expect, it } from "vitest";
import { detectLocale } from "./detectLocale";

describe("detectLocale", () => {
  it("prioritizes a supported stored explicit choice", () => {
    expect(
      detectLocale({
        storedLocale: "he",
        navigatorCandidates: ["ar-EG", "en-US"],
      }),
    ).toBe("he");
  });

  it("uses the first supported navigator candidate in order", () => {
    expect(
      detectLocale({
        storedLocale: "fr",
        navigatorCandidates: ["de-DE", "iw-IL", "ar-EG"],
      }),
    ).toBe("he");
  });

  it("falls back to English when no candidate is supported", () => {
    expect(
      detectLocale({
        storedLocale: null,
        navigatorCandidates: ["fr-FR", "de-DE"],
      }),
    ).toBe("en");
  });
});
