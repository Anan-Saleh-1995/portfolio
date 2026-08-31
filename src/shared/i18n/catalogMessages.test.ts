import { setupI18n, type Messages } from "@lingui/core";
import { messages as arMessages } from "@/locales/ar/messages.po";
import { messages as enMessages } from "@/locales/en/messages.po";
import { messages as heMessages } from "@/locales/he/messages.po";
import { describe, expect, it } from "vitest";

const translate = (locale: string, messages: Messages, id: string) => {
  const runtime = setupI18n({ locale, messages: { [locale]: messages } });
  return runtime._(id);
};

describe("production hero title catalogs", () => {
  it("keeps the English macron in the accessible title", () => {
    expect(translate("en", enMessages, "hero.title.accessible")).toBe(
      "The Way of the Rōnin.",
    );
  });

  it("uses the attached Hebrew definite article", () => {
    expect(translate("he", heMessages, "hero.title.accessible")).toBe(
      "דרכו של הרונין.",
    );
  });

  it("uses the Arabic definite article on the second idafa term", () => {
    expect(translate("ar", arMessages, "hero.title.accessible")).toBe(
      "درب الرونين.",
    );
  });
});
