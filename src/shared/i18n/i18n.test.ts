import { setupI18n, type Messages } from "@lingui/core";
import { describe, expect, it } from "vitest";
import type { CatalogLoaders, CatalogModule } from "./catalogs";
import { createInitialLocaleActivator, createLocaleActivator } from "./i18n";

const messages = (value: string): Messages => ({ value });

const resolvedCatalog = (value: string): Promise<CatalogModule> =>
  Promise.resolve({ messages: messages(value) });

describe("createLocaleActivator", () => {
  it("activates a successfully loaded catalog", async () => {
    const runtime = setupI18n();
    const loaders: CatalogLoaders = {
      en: () => resolvedCatalog("English"),
      he: () => resolvedCatalog("Hebrew"),
      ar: () => resolvedCatalog("Arabic"),
    };
    const activate = createLocaleActivator(runtime, loaders);

    await expect(activate("he")).resolves.toBe(true);
    expect(runtime.locale).toBe("he");
    expect(runtime.messages).toEqual(messages("Hebrew"));
  });

  it("ignores a stale completion when a newer request wins", async () => {
    let resolveHebrew: ((catalog: CatalogModule) => void) | undefined;
    const hebrewCatalog = new Promise<CatalogModule>((resolve) => {
      resolveHebrew = resolve;
    });
    const runtime = setupI18n();
    const loaders: CatalogLoaders = {
      en: () => resolvedCatalog("English"),
      he: () => hebrewCatalog,
      ar: () => resolvedCatalog("Arabic"),
    };
    const activate = createLocaleActivator(runtime, loaders);

    const pendingHebrew = activate("he");
    await expect(activate("ar")).resolves.toBe(true);

    resolveHebrew?.({ messages: messages("Hebrew") });

    await expect(pendingHebrew).resolves.toBe(false);
    expect(runtime.locale).toBe("ar");
    expect(runtime.messages).toEqual(messages("Arabic"));
  });

  it("retains the active locale when an in-session catalog load fails", async () => {
    const runtime = setupI18n();
    const loaders: CatalogLoaders = {
      en: () => resolvedCatalog("English"),
      he: () => Promise.reject(new Error("catalog unavailable")),
      ar: () => resolvedCatalog("Arabic"),
    };
    const activate = createLocaleActivator(runtime, loaders);

    await expect(activate("en")).resolves.toBe(true);
    await expect(activate("he")).rejects.toThrow("catalog unavailable");

    expect(runtime.locale).toBe("en");
    expect(runtime.messages).toEqual(messages("English"));
  });
});

describe("createInitialLocaleActivator", () => {
  it("falls back to English when the requested catalog fails", async () => {
    const requests: string[] = [];
    const activate = createInitialLocaleActivator((locale) => {
      requests.push(locale);

      if (locale === "he") {
        return Promise.reject(new Error("catalog unavailable"));
      }

      return Promise.resolve(true);
    });

    await expect(activate("he")).resolves.toBe("en");
    expect(requests).toEqual(["he", "en"]);
  });

  it("surfaces an English boot failure instead of retrying indefinitely", async () => {
    const requests: string[] = [];
    const activate = createInitialLocaleActivator((locale) => {
      requests.push(locale);
      return Promise.reject(new Error("catalog unavailable"));
    });

    await expect(activate("en")).rejects.toThrow("catalog unavailable");
    expect(requests).toEqual(["en"]);
  });
});
