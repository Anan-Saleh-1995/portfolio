import { useRef } from "react";
import { homeContent } from "@/shared/content/en/home";
import { useScrollReveal } from "@/shared/lib/useScrollReveal";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./ProvingGround.module.css";

export const ProvingGround = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const { provingGround } = homeContent;

  return (
    <section ref={sectionRef} id="proving-ground" className={styles.root}>
      <div className={styles.container}>
        <div data-animate>
          <SectionLabel
            number={provingGround.sectionNumber}
            title={provingGround.sectionTitle}
          />
        </div>

        <div className={styles.header} data-animate>
          <div className={styles.headingBlock}>
            <h2 className={styles.heading}>{provingGround.heading}</h2>
            <p className={styles.subheading}>{provingGround.subheading}</p>
            <p className={styles.statusNote}>{provingGround.statusNote}</p>
          </div>
          <p className={styles.note}>{provingGround.note}</p>
        </div>

        <div className={styles.grid}>
          <article className={styles.panel} data-animate>
            <span className={styles.eyebrow}>Problem</span>
            <p className={styles.copy}>{provingGround.problem}</p>
          </article>

          <article className={styles.panel} data-animate>
            <span className={styles.eyebrow}>Role</span>
            <p className={styles.copy}>{provingGround.role}</p>
          </article>

          <article className={styles.panelWide} data-animate>
            <span className={styles.eyebrow}>Stack</span>
            <ul className={styles.tags} role="list">
              {provingGround.stack.map((item) => (
                <li key={item} className={styles.tag}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className={styles.contentGrid}>
          <article className={styles.story} data-animate>
            <span className={styles.eyebrow}>Constraints</span>
            <p className={styles.copy}>{provingGround.constraints}</p>

            <span className={styles.eyebrow}>What I Built</span>
            <ul className={styles.systemList} role="list">
              {provingGround.systems.map((item) => (
                <li key={item} className={styles.systemItem}>
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <aside className={styles.aside}>
            <div className={styles.proofCard} data-animate>
              <span className={styles.eyebrow}>Proof</span>
              <ul className={styles.stats} role="list">
                {provingGround.proofPoints.map(({ value, label }) => (
                  <li key={label} className={styles.stat}>
                    <span className={styles.statValue}>{value}</span>
                    <span className={styles.statLabel}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.proofCard} data-animate>
              <span className={styles.eyebrow}>Impact</span>
              <p className={styles.copy}>{provingGround.impact}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
