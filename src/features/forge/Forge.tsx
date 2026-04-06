import { ExternalLink, Lock } from "lucide-react";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { projects } from "@/shared/config/projects";
import styles from "./Forge.module.css";

export const Forge = () => (
  <section id="forge" className={styles.root}>
    <div className={styles.container}>
      <div data-animate>
        <SectionLabel number="04" title="Forge" />
      </div>
      <h2 className={styles.heading} data-animate>
        Blades Forged
      </h2>

      <ul className={styles.grid} role="list" data-animate>
        {projects.map((project) => (
          <li key={project.title}>
            <a
              href={project.private ? undefined : project.url}
              target={
                project.private || project.placeholder ? undefined : "_blank"
              }
              rel={
                project.private || project.placeholder
                  ? undefined
                  : "noopener noreferrer"
              }
              role={project.private ? "presentation" : undefined}
              className={`${styles.card} ${project.placeholder ? styles.cardPlaceholder : ""}`}
              aria-disabled={project.placeholder}
              tabIndex={project.placeholder ? -1 : undefined}
            >
              <span className={styles.tag}>{project.tag}</span>
              <span className={styles.cardTitle}>{project.title}</span>
              <span className={styles.cardDesc}>{project.description}</span>
              {project.private && (
                <Lock size={14} className={styles.icon} aria-hidden="true" />
              )}
              {!project.private && !project.placeholder && (
                <ExternalLink
                  size={14}
                  className={styles.icon}
                  aria-hidden="true"
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
