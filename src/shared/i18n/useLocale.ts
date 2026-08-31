import { use } from "react";
import { LocaleContext } from "./LocaleContext";

export const useLocale = () => {
  const context = use(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider.");
  }

  return context;
};
