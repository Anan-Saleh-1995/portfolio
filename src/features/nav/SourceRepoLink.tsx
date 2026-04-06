import { GitBranch } from "lucide-react";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import styles from "./Nav.module.css";

interface SourceRepoLinkProps {
  compact?: boolean;
}

export const SourceRepoLink = ({ compact = false }: SourceRepoLinkProps) => {
  const { nav } = getHomeContent();

  return (
    <a
      href={nav.sourceRepo.href}
      target="_blank"
      rel="noopener noreferrer"
      className={compact ? styles.sourceIcon : styles.sourceLink}
      aria-label={nav.sourceRepo.ariaLabel}
      title={nav.sourceRepo.label}
    >
      <GitBranch size={compact ? 18 : 16} aria-hidden="true" />
      {!compact && (
        <span className={styles.sourceLabel}>{nav.sourceRepo.label}</span>
      )}
    </a>
  );
};
