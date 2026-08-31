import {
  defaultLocale,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  type Locale,
} from "./config";

type LocaleDetectionInput = Readonly<{
  storedLocale?: string | null;
  navigatorCandidates?: readonly string[];
}>;

export const detectLocale = ({
  storedLocale,
  navigatorCandidates = [],
}: LocaleDetectionInput): Locale => {
  const explicitLocale = normalizeLocale(storedLocale);
  if (explicitLocale) {
    return explicitLocale;
  }

  for (const candidate of navigatorCandidates) {
    const locale = normalizeLocale(candidate);
    if (locale) {
      return locale;
    }
  }

  return defaultLocale;
};

const readStoredLocale = (): string | null => {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
};

const readNavigatorCandidates = (): readonly string[] => {
  const candidates = [...window.navigator.languages];
  const fallbackCandidate = window.navigator.language;

  if (fallbackCandidate && !candidates.includes(fallbackCandidate)) {
    candidates.push(fallbackCandidate);
  }

  return candidates;
};

export const detectInitialLocale = (): Locale =>
  detectLocale({
    storedLocale: readStoredLocale(),
    navigatorCandidates: readNavigatorCandidates(),
  });

export const persistLocalePreference = (locale: Locale): boolean => {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    return true;
  } catch {
    return false;
  }
};
