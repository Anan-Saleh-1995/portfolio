import { ExternalLink } from "lucide-react";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { projects } from "@/shared/config/projects";
import styles from "./Arsenal.module.css";

export function Arsenal() {
  return (
    <section id="arsenal" className={styles.root}>
      <div className={styles.container}>
        <SectionLabel number="03" title="Arsenal" />
        <h2 className={styles.heading}>Deployed in the Field</h2>

        <ul className={styles.grid} role="list">
          {projects.map((project) => (
            <li key={project.title}>
              <a
                href={project.url}
                target={project.placeholder ? undefined : "_blank"}
                rel={project.placeholder ? undefined : "noopener noreferrer"}
                className={`${styles.card} ${project.placeholder ? styles.cardPlaceholder : ""}`}
                aria-disabled={project.placeholder}
                tabIndex={project.placeholder ? -1 : undefined}
              >
                <span className={styles.tag}>{project.tag}</span>
                <span className={styles.cardTitle}>{project.title}</span>
                <span className={styles.cardDesc}>{project.description}</span>
                {!project.placeholder && (
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
}
