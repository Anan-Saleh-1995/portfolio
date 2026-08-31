import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { I18nProvider } from "@lingui/react";
import { getLocaleDirection, type Locale } from "./config";
import { applyDocumentLocale } from "./direction";
import { activateLocale, i18n } from "./i18n";
import { LocaleContext, type LocaleContextValue } from "./LocaleContext";

type LocaleProviderProps = Readonly<{
  children: ReactNode;
  initialLocale: Locale;
}>;

type LocaleTransitionState = Readonly<{
  pendingLocale: Locale | null;
  localeChangeError: Error | null;
}>;

const initialTransitionState: LocaleTransitionState = {
  pendingLocale: null,
  localeChangeError: null,
};

const toError = (error: unknown): Error =>
  error instanceof Error
    ? error
    : new Error("The locale catalog could not be activated.");

export const LocaleProvider = ({
  children,
  initialLocale,
}: LocaleProviderProps) => {
  const [locale, setActiveLocale] = useState(initialLocale);
  const [transition, setTransition] = useState<LocaleTransitionState>(
    initialTransitionState,
  );
  const requestIdRef = useRef(0);

  const setLocale = useCallback(async (nextLocale: Locale) => {
    const requestId = ++requestIdRef.current;

    setTransition({
      pendingLocale: nextLocale,
      localeChangeError: null,
    });

    try {
      const activated = await activateLocale(nextLocale);
      if (!activated || requestId !== requestIdRef.current) {
        return false;
      }

      applyDocumentLocale(nextLocale);
      setActiveLocale(nextLocale);
      setTransition(initialTransitionState);

      return true;
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setTransition({
          pendingLocale: null,
          localeChangeError: toError(error),
        });
      }

      return false;
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction: getLocaleDirection(locale),
      pendingLocale: transition.pendingLocale,
      isLocaleChanging: transition.pendingLocale !== null,
      localeChangeError: transition.localeChangeError,
      setLocale,
    }),
    [locale, setLocale, transition],
  );

  return (
    <I18nProvider i18n={i18n}>
      <LocaleContext value={value}>{children}</LocaleContext>
    </I18nProvider>
  );
};
