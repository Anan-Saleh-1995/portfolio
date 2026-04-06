import { defaultLocale, type Locale } from "./config";
import type { HomeContent } from "@/shared/content/home.types";
import { homeContent as enHomeContent } from "@/shared/content/en/home";
import { homeContent as jaHomeContent } from "@/shared/content/ja/home";

export const getHomeContent = (locale: Locale = defaultLocale): HomeContent => {
  switch (locale) {
    case "ja":
      return jaHomeContent;
    case "en":
    default:
      return enHomeContent;
  }
};
