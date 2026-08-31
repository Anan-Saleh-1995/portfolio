import { describe, expect, it } from "vitest";
import { applyDocumentLocale, getInputDirection } from "./direction";

describe("direction helpers", () => {
  it.each(["email", "password", "code", "phone", "number", "url"] as const)(
    "keeps %s input content LTR",
    (inputKind) => {
      expect(getInputDirection(inputKind)).toBe("ltr");
    },
  );

  it("lets prose input follow its content", () => {
    expect(getInputDirection("text")).toBe("auto");
  });

  it("updates document language and direction in one synchronization step", () => {
    const root = document.documentElement;

    expect(applyDocumentLocale("ar", root)).toBe("rtl");
    expect(root.lang).toBe("ar");
    expect(root.dir).toBe("rtl");

    expect(applyDocumentLocale("en", root)).toBe("ltr");
    expect(root.lang).toBe("en");
    expect(root.dir).toBe("ltr");
  });
});
