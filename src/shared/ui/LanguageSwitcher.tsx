import { useId, type ChangeEvent } from "react";
import {
  ChevronDown,
  CircleAlert,
  Languages,
  LoaderCircle,
} from "lucide-react";
import { useLingui } from "@lingui/react/macro";
import {
  isLocale,
  localeMetadata,
  locales,
  type Locale,
} from "@/shared/i18n/config";
import { useLocale } from "@/shared/i18n/useLocale";

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher = ({
  compact = false,
}: LanguageSwitcherProps) => {
  const { t } = useLingui();
  const {
    locale,
    pendingLocale,
    isLocaleChanging,
    localeChangeError,
    setLocale,
  } = useLocale();
  const errorId = useId();
  const activeLocale = localeMetadata[locale];
  const activeOptionLabel = activeLocale.endonym;
  const currentLanguageLabel = t({
    id: "language.current",
    message: `Language: ${activeOptionLabel}`,
  });
  const pendingEndonym = pendingLocale
    ? localeMetadata[pendingLocale].endonym
    : null;
  const statusLabel = pendingEndonym
    ? t({
        id: "language.switching",
        message: `Switching language to ${pendingEndonym}`,
      })
    : currentLanguageLabel;

  const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;

    if (!isLocale(nextLocale) || nextLocale === locale) {
      return;
    }

    await setLocale(nextLocale);
  };

  return (
    <div className="relative inline-flex">
      <div className="relative inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 text-[var(--text-muted)] transition-colors hover:border-[var(--token)] hover:text-[var(--token)] focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-[var(--token)] motion-reduce:transition-none">
        <Languages size={16} aria-hidden={true} className="shrink-0" />
        <span
          className="font-mono text-xs tracking-[0.08em] whitespace-nowrap"
          aria-hidden={true}
        >
          {compact ? activeLocale.shortLabel : activeLocale.endonym}
        </span>
        {isLocaleChanging ? (
          <LoaderCircle
            size={14}
            aria-hidden={true}
            className="shrink-0 animate-spin motion-reduce:animate-none"
          />
        ) : (
          <ChevronDown size={14} aria-hidden={true} className="shrink-0" />
        )}

        <select
          className="absolute inset-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-wait"
          value={locale}
          onChange={(event) => {
            void handleChange(event);
          }}
          disabled={isLocaleChanging}
          aria-label={statusLabel}
          aria-busy={isLocaleChanging}
          aria-describedby={localeChangeError ? errorId : undefined}
        >
          {locales.map((optionLocale) => (
            <option
              key={optionLocale}
              value={optionLocale}
              lang={optionLocale}
              dir={localeMetadata[optionLocale].direction}
            >
              {localeMetadata[optionLocale].endonym}
            </option>
          ))}
        </select>
      </div>

      {localeChangeError ? (
        <span
          id={errorId}
          role="alert"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-[110] flex w-max max-w-[min(18rem,80vw)] items-start gap-2 border border-[var(--token)] bg-[var(--surface-raised)] px-3 py-2 [font-family:var(--font-body)] text-sm leading-snug text-[var(--text)] shadow-xl"
        >
          <CircleAlert
            size={16}
            aria-hidden={true}
            className="mt-0.5 shrink-0 text-[var(--token)]"
          />
          {t({
            id: "language.changeFailed",
            message: "Language change failed. Try again.",
          })}
        </span>
      ) : null}
    </div>
  );
};
