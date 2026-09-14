import { GitBranch } from "lucide-react";

interface SourceRepoLinkProps {
  compact?: boolean;
}

export const SourceRepoLink = ({ compact = false }: SourceRepoLinkProps) => {
  const sourceLabel = "Source";

  return (
    <a
      href="https://github.com/Anan-Saleh-1995/portfolio"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--token)] hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--token)] motion-reduce:transition-none ${
        compact ? "size-11 p-0" : "gap-2 px-3.5"
      }`}
      aria-label="View portfolio source on GitHub"
      title={sourceLabel}
    >
      <GitBranch size={compact ? 18 : 16} aria-hidden={true} />
      {!compact && (
        <span className="[font-family:var(--font-mono)] text-xs tracking-[0.08em] whitespace-nowrap uppercase">
          Source
        </span>
      )}
    </a>
  );
};
