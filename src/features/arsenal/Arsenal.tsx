import { useRef } from "react";
import { ArrowDownRight, Plus } from "lucide-react";
import { homeContent } from "@/shared/content/home";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { arsenalGroups } from "./arsenal.content";
import { arsenalEvidence } from "./arsenalEvidence";
import styles from "./Arsenal.module.css";

export const Arsenal = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { arsenal } = homeContent;

  return (
    <section
      ref={sectionRef}
      id="arsenal"
      aria-labelledby="arsenal-title"
      className={styles.root}
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader} data-animate>
          <SectionLabel
            number={arsenal.sectionNumber}
            title={arsenal.sectionTitle}
          />
          <span className={styles.annotation}>A toolkit, with context.</span>
        </div>

        <div className={styles.layout}>
          <div className={styles.introduction} data-animate>
            <h2 id="arsenal-title" className={styles.heading}>
              The right tool.
              <br />
              <em>The right reason.</em>
            </h2>
            <p className={styles.description}>
              From mobile interfaces to wallet protocols and the systems in
              between. Open a discipline for the tools, the projects they belong
              to, and what I am still exploring.
            </p>
            <a href="#forge" className={styles.workLink}>
              Go straight to the projects
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
            <div className={styles.methodNote}>
              <span className={styles.methodLabel}>A note on the toolkit</span>
              <p>
                These are tools I work with across different projects. Each
                example identifies its context; concepts in study are labeled
                separately from implementation.
              </p>
            </div>
          </div>

          <div className={styles.ledger} data-animate>
            <div className={styles.ledgerHeader} aria-hidden="true">
              <span>Discipline / selected tools</span>
              <span>Inspect</span>
            </div>
            {arsenalGroups.map(({ id, category, items, concepts }, index) => {
              const evidence = arsenalEvidence[id];

              return (
                <details key={id} className={styles.discipline}>
                  <summary className={styles.summary}>
                    <span className={styles.number}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.disciplineHeading}>
                      <span className={styles.category}>{category}</span>
                      <span className={styles.preview}>
                        {items.slice(0, 3).join(" · ")}
                      </span>
                    </span>
                    <Plus
                      size={18}
                      className={styles.disclosureIcon}
                      aria-hidden="true"
                    />
                  </summary>
                  <div className={styles.detailContent}>
                    <ul
                      className={styles.tools}
                      aria-label={`${category} tools`}
                    >
                      {items.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                    {concepts && (
                      <div className={styles.concepts}>
                        <span className={styles.evidenceLabel}>
                          Concepts in study
                        </span>
                        <p>{concepts.join(" · ")}</p>
                      </div>
                    )}
                    {evidence && (
                      <div className={styles.evidence}>
                        <span className={styles.evidenceLabel}>
                          In the work
                        </span>
                        <p>{evidence.description}</p>
                        <div className={styles.evidenceLinks}>
                          <a
                            href={evidence.href}
                            className={styles.evidenceLink}
                          >
                            {evidence.label}
                            <ArrowDownRight size={16} aria-hidden="true" />
                          </a>
                          {evidence.related && (
                            <a
                              href={evidence.related.href}
                              className={styles.evidenceLink}
                            >
                              {evidence.related.label}
                              <ArrowDownRight size={16} aria-hidden="true" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
