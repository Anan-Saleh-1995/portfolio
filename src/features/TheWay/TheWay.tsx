import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import { homeContent } from "@/shared/content/home";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./TheWay.module.css";

const readingPaths = [
  {
    number: "01",
    title: "The tools",
    description: "Explore the disciplines behind the interface.",
    href: "#arsenal",
  },
  {
    number: "02",
    title: "The work",
    description: "Visit the projects, writing, and public code.",
    href: "#forge",
  },
  {
    number: "03",
    title: "The decisions",
    description: "Look closer at the system underneath a product.",
    href: "#work-travel",
  },
];

export const TheWay = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { theWay } = homeContent;

  return (
    <section
      ref={sectionRef}
      id="the-way"
      aria-labelledby="the-way-title"
      className={styles.root}
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader} data-animate>
          <SectionLabel
            number={theWay.sectionNumber}
            title={theWay.sectionTitle}
          />
          <span className={styles.annotation}>
            Behind the image, a practice.
          </span>
        </div>

        <div className={styles.story}>
          <div className={styles.introduction} data-animate>
            <h2 id="the-way-title" className={styles.heading}>
              The discipline
              <br />
              <em>behind the work.</em>
            </h2>
            <dl className={styles.facts}>
              {theWay.stats.slice(0, 2).map(({ value, label }) => (
                <div key={label} className={styles.fact}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.biography} data-animate>
            <p className={styles.lead}>{theWay.paragraphs[0]}</p>
            <p className={styles.perspective}>
              My current projects span mobile learning tools, testnet wallets,
              commerce, developer tooling, and technical publishing. I use them
              to work through product decisions and system behavior in code.
            </p>
            <details className={styles.experience}>
              <summary className={styles.summary}>
                A closer look at the experience
                <Plus size={16} aria-hidden="true" />
              </summary>
              <div className={styles.experienceContent}>
                {theWay.paragraphs.slice(1).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
            <a
              href={theWay.resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resume}
            >
              Read my résumé
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav aria-label="Choose a path through my work" data-animate>
          <div className={styles.pathHeading}>
            <span>Follow your curiosity</span>
            <span className={styles.pathNote}>Three ways into the record</span>
          </div>
          <ol className={styles.paths}>
            {readingPaths.map(({ number, title, description, href }) => (
              <li key={href} className={styles.pathItem}>
                <a href={href} className={styles.path}>
                  <span className={styles.pathNumber}>{number}</span>
                  <span className={styles.pathContent}>
                    <span className={styles.pathTitle}>{title}</span>
                    <span className={styles.pathDescription}>
                      {description}
                    </span>
                  </span>
                  <ArrowDownRight
                    size={21}
                    className={styles.pathArrow}
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
};
