import type { Messages } from "@lingui/core";
import type { Locale } from "./config";

export type CatalogModule = Readonly<{
  messages: Messages;
}>;

export type CatalogLoader = () => Promise<CatalogModule>;
export type CatalogLoaders = Readonly<Record<Locale, CatalogLoader>>;

export const catalogLoaders: CatalogLoaders = Object.freeze({
  en: () => import("@/locales/en/messages.po"),
  he: () => import("@/locales/he/messages.po"),
  ar: () => import("@/locales/ar/messages.po"),
});
