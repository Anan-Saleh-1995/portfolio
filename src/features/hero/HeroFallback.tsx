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
      <div className="flex flex-col items-center gap-3 text-center [font-family:var(--font-mono)] text-xs uppercase tracking-[0.12em]">
        <ImageOff size={24} strokeWidth={1.5} aria-hidden="true" />
        <span>Portrait unavailable</span>
      </div>
    ) : (
      <span className="h-24 w-px animate-pulse bg-[var(--border)] motion-reduce:animate-none" />
    )}
  </div>
);
