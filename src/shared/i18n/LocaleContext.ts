import { createContext } from "react";
import type { Direction, Locale } from "./config";

export type LocaleContextValue = Readonly<{
  locale: Locale;
  direction: Direction;
  pendingLocale: Locale | null;
  isLocaleChanging: boolean;
  localeChangeError: Error | null;
  setLocale: (locale: Locale) => Promise<boolean>;
}>;

export const LocaleContext = createContext<LocaleContextValue | null>(null);
