import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Link2, Plus } from "lucide-react";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { ProjectPreview } from "./ProjectPreview";
import { ProjectPermalink } from "./ProjectPermalink";
import {
  portfolioProjects,
  type PortfolioProject,
  type ProjectLink,
} from "./projects.content";
import styles from "./Forge.module.css";

const selectedProjects = portfolioProjects
  .filter((project) => project.featured)
  .slice(0, 4);
const archiveProjects = portfolioProjects.filter(
  (project) => !selectedProjects.includes(project),
);

const WorkLink = ({ link }: { link: ProjectLink }) => (
  <a
    href={link.href}
    target={link.external ? "_blank" : undefined}
    rel={link.external ? "noopener noreferrer" : undefined}
    className={styles.textLink}
  >
    {link.label}
    {link.external ? (
      <ArrowUpRight size={14} aria-hidden="true" />
    ) : (
      <ArrowRight size={14} aria-hidden="true" />
    )}
    {link.external && <span className="sr-only"> (opens in a new tab)</span>}
  </a>
);

const BuildNotes = ({ project }: { project: PortfolioProject }) => (
  <details className={styles.buildNotes}>
    <summary>
      <span>Build notes</span>
      <Plus size={16} className={styles.disclosureIcon} aria-hidden="true" />
    </summary>
    <div className={styles.notesBody}>
      <ul>
        {project.buildNotes.scope.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p className={styles.maturity}>{project.buildNotes.boundary}</p>
      {project.related.length > 0 && (
        <div className={styles.related}>
          <span className={styles.relatedLabel}>Continue exploring</span>
          {project.related.map((link) => (
            <WorkLink key={link.href} link={link} />
          ))}
        </div>
      )}
    </div>
  </details>
);

const ProjectRecord = ({
  project,
  index,
  compact = false,
}: {
  project: PortfolioProject;
  index: number;
  compact?: boolean;
}) => (
  <article
    id={project.id}
    className={`${styles.project} ${compact ? styles.projectCompact : ""}`}
    aria-labelledby={`${project.id}-title`}
  >
    <div className={styles.previewWrap}>
      <ProjectPreview project={project} compact={compact} />
      <div className={styles.previewCaption}>
        <span>
          {String(index + 1).padStart(2, "0")} / {project.preview.label}
        </span>
        <span>{project.status}</span>
      </div>
    </div>
    <div className={styles.projectContent}>
      <p className={styles.category}>{project.category}</p>
      <div className={styles.titleRow}>
        <h3 id={`${project.id}-title`} className={styles.projectTitle}>
          {project.title}
        </h3>
        <a
          href={`#${project.id}`}
          className={styles.permalink}
          aria-label={`Link to ${project.title}`}
          title={`Link to ${project.title}`}
        >
          <Link2 size={17} aria-hidden="true" />
        </a>
      </div>
      <p className={styles.purpose}>{project.purpose}</p>
      <ul className={styles.stack} role="list">
        {project.stack.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
      <div className={styles.projectActions}>
        {project.liveUrl ? (
          <a
            className={styles.siteLink}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit site <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className={styles.comingSoon}>
            <span aria-hidden="true" />
            Live site soon
          </span>
        )}
        {project.links.map((link) => (
          <WorkLink key={link.href} link={link} />
        ))}
        <ProjectPermalink id={project.id} title={project.title} />
      </div>
      <BuildNotes project={project} />
    </div>
  </article>
);

export const Forge = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const archiveRef = useRef<HTMLDetailsElement>(null);
  useScrollReveal(sectionRef);

  useEffect(() => {
    let scrollFrame = 0;
    const revealLinkedProject = () => {
      const id = window.location.hash.slice(1);
      if (!archiveProjects.some((project) => project.id === id)) return;
      if (!archiveRef.current) return;
      archiveRef.current.open = true;
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });
    };
    revealLinkedProject();
    window.addEventListener("hashchange", revealLinkedProject);
    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("hashchange", revealLinkedProject);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="forge"
      className={styles.root}
      aria-labelledby="forge-heading"
    >
      <div className={styles.container}>
        <header className={styles.header} data-animate>
          <div>
            <SectionLabel number="02" title="Selected work" />
            <h2 id="forge-heading" className={styles.heading}>
              Ideas, made tangible.
            </h2>
          </div>
          <div className={styles.introduction}>
            <p>
              Mobile products, learning systems, commerce, and tools. Different
              ways to explore how I think and what I build.
            </p>
            <span className={styles.indexLabel}>Selected projects / 01—04</span>
          </div>
        </header>

        <div className={styles.selectedProjects}>
          {selectedProjects.map((project, index) => (
            <ProjectRecord key={project.id} project={project} index={index} />
          ))}
        </div>

        {archiveProjects.length > 0 && (
          <details ref={archiveRef} className={styles.archive}>
            <summary className={styles.archiveSummary}>
              <span className={styles.archiveHeading}>
                More from the workbench
              </span>
              <span className={styles.archiveCount}>
                {archiveProjects.length} projects
              </span>
              <Plus
                size={20}
                className={styles.disclosureIcon}
                aria-hidden="true"
              />
            </summary>
            <div className={styles.archiveProjects}>
              {archiveProjects.map((project, index) => (
                <ProjectRecord
                  key={project.id}
                  project={project}
                  index={selectedProjects.length + index}
                  compact
                />
              ))}
            </div>
          </details>
        )}

        <div className={styles.sectionFoot}>
          <p>Every project opens another part of the practice.</p>
          <a href="#arsenal" className={styles.textLink}>
            Explore the toolkit <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
