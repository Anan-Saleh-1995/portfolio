export const locales = Object.freeze(["en", "he", "ar"] as const);
export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export const defaultLocale: Locale = "en";

export type LocaleMetadata = Readonly<{
  endonym: string;
  shortLabel: string;
  direction: Direction;
}>;

export const localeMetadata = Object.freeze({
  en: Object.freeze({
    endonym: "English",
    shortLabel: "EN",
    direction: "ltr",
  }),
  he: Object.freeze({
    endonym: "עברית",
    shortLabel: "עב",
    direction: "rtl",
  }),
  ar: Object.freeze({
    endonym: "العربية",
    shortLabel: "عر",
    direction: "rtl",
  }),
} satisfies Record<Locale, LocaleMetadata>);

const supportedLocaleSet = new Set<string>(locales);
const legacyLocaleAliases: Readonly<Record<string, string>> = Object.freeze({
  iw: "he",
});

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && supportedLocaleSet.has(value);

export const normalizeLocale = (value: unknown): Locale | null => {
  if (typeof value !== "string") {
    return null;
  }

  const localeTag = value.trim().replaceAll("_", "-");
  if (!localeTag) {
    return null;
  }

  const tagParts = localeTag.split("-");
  const language = tagParts[0];
  if (!language) {
    return null;
  }

  tagParts[0] = legacyLocaleAliases[language.toLowerCase()] ?? language;

  try {
    const [canonicalLocale] = Intl.getCanonicalLocales(tagParts.join("-"));
    const canonicalLanguage = canonicalLocale?.split("-")[0]?.toLowerCase();

    return isLocale(canonicalLanguage) ? canonicalLanguage : null;
  } catch {
    return null;
  }
};

export const getLocaleDirection = (locale: Locale): Direction =>
  localeMetadata[locale].direction;
