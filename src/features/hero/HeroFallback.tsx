import { Trans } from "@lingui/react/macro";
import { ImageOff } from "lucide-react";

interface HeroFallbackProps {
  failed?: boolean;
}

export const HeroFallback = ({ failed = false }: HeroFallbackProps) => (
  <div
    className="absolute inset-0 flex items-center justify-center text-[var(--text-muted)]"
    aria-hidden="true"
  >
    {failed ? (
      <div className="flex flex-col items-center gap-3 text-center [font-family:var(--font-mono)] text-xs uppercase tracking-[0.12em] rtl:normal-case rtl:tracking-normal">
        <ImageOff size={24} strokeWidth={1.5} aria-hidden="true" />
        <span>
          <Trans id="hero.media.unavailable">Portrait unavailable</Trans>
        </span>
      </div>
    ) : (
      <span className="h-24 w-px animate-pulse bg-[var(--border)] motion-reduce:animate-none" />
    )}
  </div>
);
