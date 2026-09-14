import { useId, useState } from "react";
import { ArrowDownRight, ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/shared/lib/useMediaQuery";
import { EnsoMark } from "@/shared/ui/EnsoMark";
import styles from "./HeroSpecimenPanel.module.css";

const paths = [
  {
    discipline: "Mobile & systems",
    project: "Learning Space",
    href: "#work-learning-space",
  },
  {
    discipline: "Wallets & protocols",
    project: "Dokimi Ledger",
    href: "#work-dokimi",
  },
  {
    discipline: "Product & interface",
    project: "Nexzon",
    href: "#work-nexzon",
  },
  {
    discipline: "Platforms & flows",
    project: "Travel Platform",
    href: "#work-travel",
  },
];

export const HeroSpecimenPanel = () => {
  const contentId = useId();
  const isWide = useMediaQuery("(min-width: 48rem)");
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      className={styles.panel}
      aria-label="Explore my connected work"
      data-hero-animate
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>Field notes / 001</p>
        <div className={styles.identity}>
          <p className={styles.title}>
            One practice.
            <br />
            <em>Many paths.</em>
          </p>
          <p className={styles.description}>
            A growing body of work. Pick a thread and see where it leads.
          </p>
        </div>
        {!isWide && (
          <button
            className={styles.disclosure}
            type="button"
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Close map" : "Explore the map"}
            <ChevronDown size={15} aria-hidden="true" />
          </button>
        )}
      </div>
      <div
        id={contentId}
        className={styles.content}
        hidden={!isWide && !expanded}
      >
        <nav className={styles.map} aria-label="Paths into the projects">
          <div className={styles.origin} aria-hidden="true">
            <EnsoMark size={36} />
            <span>ANAN</span>
            <span className={styles.originCaption}>The connecting thread</span>
          </div>
          <ol className={styles.paths}>
            {paths.map(({ discipline, project, href }, index) => (
              <li key={href} className={styles.path}>
                <a href={href}>
                  <span className={styles.number}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.pathCopy}>
                    <span className={styles.discipline}>{discipline}</span>
                    <span className={styles.project}>{project}</span>
                  </span>
                  <ArrowDownRight size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className={styles.note}>
          The work, the code, the notes.
          <br />
          Different views of the same curiosity.
        </p>
        <a className={styles.action} href="#forge">
          Explore all projects <ArrowDownRight size={15} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
};
