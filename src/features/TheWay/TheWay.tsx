import { useRef } from "react";
import { getHomeContent } from "@/shared/i18n/getHomeContent";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./TheWay.module.css";

export const TheWay = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { theWay } = getHomeContent();

  return (
    <section ref={sectionRef} id="the-way" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel
            number={theWay.sectionNumber}
            title={theWay.sectionTitle}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.content}>
            <h2 className={styles.heading} data-animate>
              {theWay.heading}
            </h2>
            {theWay.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.bio} data-animate>
                {paragraph}
              </p>
            ))}
            <a
              href={theWay.resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              data-animate
            >
              {theWay.resume.label}
            </a>
          </div>

          <aside className={styles.aside}>
            <ul className={styles.stats} role="list">
              {theWay.stats.map(({ value, label }) => (
                <li key={label} className={styles.stat} data-animate>
                  <span className={styles.statValue}>{value}</span>
                  <span className={styles.statLabel}>{label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};
