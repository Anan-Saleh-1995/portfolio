import { GitBranch } from "lucide-react";
import { shellContent } from "@/shared/content/shell.content";

interface SourceRepoLinkProps {
  compact?: boolean;
}

export const SourceRepoLink = ({ compact = false }: SourceRepoLinkProps) => {
  const { sourceRepo } = shellContent.nav;

  return (
    <a
      href={sourceRepo.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-[2px] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] transition-colors hover:border-[var(--focus)] hover:bg-[var(--surface-raised)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus)] motion-reduce:transition-none ${
        compact ? "size-11 p-0" : "gap-2.5 px-4"
      }`}
      aria-label={sourceRepo.ariaLabel}
      title={sourceRepo.label}
    >
      <GitBranch size={compact ? 18 : 16} aria-hidden={true} />
      {!compact && (
        <span className="[font-family:var(--font-mono)] text-xs tracking-[0.025em] whitespace-nowrap">
          {sourceRepo.label}
        </span>
      )}
    </a>
  );
};
