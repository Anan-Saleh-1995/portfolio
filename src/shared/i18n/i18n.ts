import { i18n, type I18n } from "@lingui/core";
import { catalogLoaders, type CatalogLoaders } from "./catalogs";
import { defaultLocale, type Locale } from "./config";

type CatalogRuntime = Pick<I18n, "loadAndActivate">;
type ActivateLocale = (locale: Locale) => Promise<boolean>;

export const createLocaleActivator = (
  runtime: CatalogRuntime,
  loaders: CatalogLoaders,
): ActivateLocale => {
  let latestRequestId = 0;

  return async (locale) => {
    const requestId = ++latestRequestId;

    try {
      const { messages } = await loaders[locale]();

      if (requestId !== latestRequestId) {
        return false;
      }

      runtime.loadAndActivate({ locale, messages });
      return true;
    } catch (error) {
      if (requestId !== latestRequestId) {
        return false;
      }

      throw error;
    }
  };
};

export const activateLocale = createLocaleActivator(i18n, catalogLoaders);

export const createInitialLocaleActivator = (activate: ActivateLocale) => {
  return async (requestedLocale: Locale): Promise<Locale> => {
    try {
      const activated = await activate(requestedLocale);
      if (activated) {
        return requestedLocale;
      }

      throw new Error("Initial locale activation was superseded.");
    } catch (error) {
      if (requestedLocale === defaultLocale) {
        throw error;
      }
    }

    const activated = await activate(defaultLocale);
    if (!activated) {
      throw new Error("Default locale activation was superseded.");
    }

    return defaultLocale;
  };
};

export const activateInitialLocale =
  createInitialLocaleActivator(activateLocale);

export { i18n };
