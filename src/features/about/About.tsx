import { SectionLabel } from "@/shared/ui/SectionLabel";
import styles from "./About.module.css";

const STATS = [
  { value: "5+", label: "Years building" },
  { value: "3", label: "Languages spoken" },
  { value: "∞", label: "Commits to craft" },
];

export function About() {
  return (
    <section id="about" className={styles.root}>
      <div className={styles.container}>
        <SectionLabel number="02" title="About" />

        <div className={styles.grid}>
          <div className={styles.content}>
            <h2 className={styles.heading}>The Path</h2>
            <p className={styles.bio}>
              Backend engineer by trade, craftsman by discipline. I build
              systems that are fast, reliable, and readable — because the
              quality of your code is the quality of your practice.
            </p>
            <p className={styles.bio}>
              Currently sharpening skills in Three.js and modern full-stack
              architecture. Every commit is a step in the kata.
            </p>
            <a
              href="https://resume-site-opal-phi.vercel.app/en/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              View Resume →
            </a>
          </div>

          <aside className={styles.aside}>
            <ul className={styles.stats} role="list">
              {STATS.map(({ value, label }) => (
                <li key={label} className={styles.stat}>
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
}
