import { defaultLocale, type Locale } from "./config";
import type { HomeContent } from "@/shared/content/home.types";
import { homeContent as enHomeContent } from "@/shared/content/en/home";

export const getHomeContent = (locale: Locale = defaultLocale): HomeContent => {
  switch (locale) {
    case "en":
    default:
      return enHomeContent;
  }
};
