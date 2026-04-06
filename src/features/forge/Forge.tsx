import { useRef } from "react";
import { ExternalLink, Lock } from "lucide-react";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { projects } from "@/shared/config/projects";
import styles from "./Forge.module.css";

export const Forge = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="forge" className={styles.root}>
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
              {project.private || project.placeholder ? (
                <article
                  className={`${styles.card} ${styles.cardPlaceholder}`}
                  aria-label={`${project.title} project card`}
                >
                  <span className={styles.tag}>{project.tag}</span>
                  <span className={styles.cardTitle}>{project.title}</span>
                  <span className={styles.cardDesc}>{project.description}</span>
                  {project.private && (
                    <Lock
                      size={14}
                      className={styles.icon}
                      aria-hidden="true"
                    />
                  )}
                </article>
              ) : (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  <span className={styles.tag}>{project.tag}</span>
                  <span className={styles.cardTitle}>{project.title}</span>
                  <span className={styles.cardDesc}>{project.description}</span>
                  <ExternalLink
                    size={14}
                    className={styles.icon}
                    aria-hidden="true"
                  />
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
